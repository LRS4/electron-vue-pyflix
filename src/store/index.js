import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import moment from 'moment';
const chunk = require('chunk');
const storage = require('electron-storage');
const path = require('path');
const fs = require('fs');


Vue.use(Vuex)

export const store = new Vuex.Store({
    state: { // data
        movies : [],
        filter: "",
        loading: true
    },
    actions: { // methods
        loadMovies({ commit }) {
            console.log('Attempting to retrieve movies.json from local storage...');
            storage.isPathExists('movies.json', (itDoes) => {
                if (itDoes) {
                storage.get('movies')
                .then(data => {
                    console.log(`${data.length} items retrieved successfully.`);
                    let movies = data.sort((a, b) => a.Title.localeCompare(b.Title)); // sort alphabetical
                    commit('SET_MOVIES', movies);
                })
                .catch(err => {
                    console.error(err);
                });
                } else {
                // the values for the API lookup from HDD
                const movieItemsHDD = JSON.parse(fs.readFileSync(path.normalize('C:\\Users\\L.Spencer\\Documents\\GitHub\\electron-vue-pyflix\\utils\\hdd_data.json')));
            
                // https://stackoverflow.com/questions/56532652/axios-get-then-in-a-for-loop
                let movies = [];
                let promises = [];
                console.log('Calling OMDB API...');
        
                movieItemsHDD.forEach(item => {
                    if (item.Type == 'movie') {
                    promises.push(
                        axios.get(`http://www.omdbapi.com/?t=${ item.Title }&y=${ item.Year }&apikey=ff0c3dab`)
                        .then(response => {
                        if (response.data.Error == 'Movie not found!') { 
                            return console.error(`Undefined error! The movie ${item.Title} could not be found.`); 
                        }
                        
                        let newData = response.data;
                        newData.watchCount = 0;
                        newData.dateLastWatched = 'Not watched';
                        newData.minuteLastWatched = 0;
                        newData.myRating = 0;
                        newData.fileLocation = item.FileLocation;
                        newData.dateAdded = moment();
                        console.log(newData);
                        movies.push(newData);
                        })
                    )
                    } else {
                    promises.push(
                        axios.get(`http://www.omdbapi.com/?t=${ item.Title }&apikey=ff0c3dab`)
                        .then(response => {
                        let newData = response.data;
                        newData.watchCount = 0;
                        newData.dateLastWatched = 'Not watched';
                        newData.minuteLastWatched = 0;
                        newData.myRating = 0;
                        newData.fileLocation = 'C://somepath';
                        newData.dateAdded = moment();
                        movies.push(newData);
                        })
                    )
                    }
                })
                
                Promise.all(promises).then(() => {
                    console.log('Saving response to local storage...')
                    storage.set('movies', movies)
                    .then(() => {
                    console.log('The file was successfully written to local storage.'); // C:\Users\L.Spencer\AppData\Roaming\electron-vue\movies.json
                    console.log(`${promises.length} items were saved successfully.`)
                    })
                    .catch(err => {
                    console.error(err);
                    });
                    commit('SET_MOVIES', movies);
                });
                }
            })
        },   
        setFilter({ commit }, value) {
            // console.log(value)
            commit('SET_FILTER', value);
        },
        setLoadingStatus({commit}, status) {
            console.log(status);
            commit('SET_LOADING', status);
        }
    },
    mutations: { // setters
        SET_MOVIES (state, movies) {
            state.movies = movies
        },
        SET_FILTER(state, value) {
            state.filter = value
        },
        SET_LOADING(state, status) {
            state.loading = status
        }
    },
    getters: { // computed
        getMovies(state) {
            let genres = ['Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'War']; 
            let yearRegex = /[0-9][0-9][0-9][0-9]/;
            if (state.filter == undefined || state.filter == "") {
                return chunk(state.movies, 6);
            } else if (yearRegex.test(state.filter)) {
                return chunk(state.movies.filter(item => item.Year == state.filter), 6);
            } else if (genres.includes(state.filter)) {
                return chunk(state.movies.filter(item => item.Genre.includes(state.filter)), 6);
            } else {
                let filter = (state.filter).toLowerCase();
                return chunk(state.movies.filter(item => (item.Title).toLowerCase().includes(filter)), 6);
            }
        }
    }
})