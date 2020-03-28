import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import moment from 'moment';
import getMovieDataFromHDD from '../../utils/filename-extractor';
const chunk = require('chunk');
const storage = require('electron-storage');
const path = require('path');
const fs = require('fs');
const remote = require('electron').remote;
const app = remote.app;

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: { // data
        movies : [],
        folder_path: "",
        filter: "",
        refreshMessages: [],
        loading: true, 
        firstVisit: false
    },
    actions: { // methods
        loadMovies({ commit, dispatch }) {
            // if user information exists in cache
            storage.isPathExists('user.json', (itDoes) => {
                if (itDoes) { 
                    console.log('Reading user information...');
                    storage.get('user')
                        .then(data => {
                            dispatch('setFirstVisitStatus', {
                                status: data.isFirstTime,
                                folder_path: data.folderPath
                            });
                            console.log(`User information retrieved successfully.`);
                        })
                        .catch(err => {
                            console.error(err);
                    });
                    // if movies exist in cache
                    storage.isPathExists('movies.json', (itDoes) => {
                        if (itDoes) {
                        storage.get('movies')
                        .then(data => {
                            console.log(`${data.length} items retrieved successfully.`);
                            commit('SET_REFRESH_MESSAGES', `${data.length} items loaded!`);
                            commit('SET_REFRESH_MESSAGES', `Enjoy!`);
                            let movies = data.sort((a, b) => a.Title.localeCompare(b.Title)); // sort alphabetical
                            commit('SET_MOVIES', movies);
                        })
                        .catch(err => {
                            console.error(err);
                        });
                        } else {
                        // the values for the API lookup from HDD
                        let movieItemsHDD = JSON.parse(fs.readFileSync(path.join(app.getPath('userData'), '/hdd_data.json')));
                    
                        // https://stackoverflow.com/questions/56532652/axios-get-then-in-a-for-loop
                        let movies = [];
                        let promises = [];
                        console.log('Calling OMDB API...');
                        commit('SET_REFRESH_MESSAGES', `Calling OMDB API...`)
                
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
                                newData.isFavourite = 0;
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
                                    
                                    // add seasons arrays to series object
                                    // these contain episode file locations
                                    let seasons = [];
                                    if (item.Type == 'series') { 
                                        for (let key in item) {
                                            if (key.includes('Season')) {
                                                seasons.push(item[key]);
                                            }
                                        }
                                    }

                                    newData.seasons = seasons;
                                    newData.watchCount = 0;
                                    newData.dateLastWatched = 'Not watched';
                                    newData.minuteLastWatched = 0;
                                    newData.myRating = 0;
                                    newData.isFavourite = 0;
                                    newData.dateAdded = moment();
                                    movies.push(newData);
                                    })
                                )
                            }
                        })
                        
                        Promise.all(promises).then(() => {
                            console.log('Saving response to local storage...')
                            commit('SET_REFRESH_MESSAGES', `Saving response data...`)
                            storage.set('movies', movies)
                            .then(() => {
                            console.log('The file was successfully written to local storage.'); // C:\Users\L.Spencer\AppData\Roaming\pyflix\movies.json
                            console.log(`${promises.length} items were saved successfully.`) // replace \pyflix\ with application name if different
                            commit('SET_REFRESH_MESSAGES', `File saved...`)
                            commit('SET_REFRESH_MESSAGES', `${promises.length} items indexed!`)
                            })
                            .catch(err => {
                            console.error(err);
                            });
                            commit('SET_MOVIES', movies.sort((a, b) => a.Title.localeCompare(b.Title)));
                        });
                        }
                    })
                } else {
                    this.dispatch('setFirstVisitStatus', { status: true });
                }

                setTimeout(() => {
                    commit('SET_REFRESH_MESSAGES', null);
                }, 15000);
            })
        },   
        setFilter({ commit }, value) {
            // console.log(value)
            commit('SET_FILTER', value);
        },
        setLoadingStatus({commit}, status) {
            commit('SET_LOADING', status);
        },
        setFirstVisitStatus({commit}, payload) {
            commit('SET_FIRST_VISIT', payload);
        },
        updateMovie({ commit }, payload) {
            commit('UPDATE_MOVIE', payload)
        },
        reindexHDD({ commit, state }) {
            // Reindex and read HDD to create hdd_data.json
            console.log('Indexing HDD...');
            commit('SET_REFRESH_MESSAGES', 'Indexing HDD...');
            
            // Pass in the folder path from state and output path
            getMovieDataFromHDD(state.folder_path, app.getPath('userData'));
            console.log('Index complete.');
        },
        refreshMovies({ commit }) {
            setTimeout(() => {
                let movieItemsHDD = JSON.parse(fs.readFileSync(path.join(app.getPath('userData'), 'hdd_data.json')));
                console.log(`${movieItemsHDD.length} items retrieved from HDD JSON` );
                console.log(movieItemsHDD)
    
                // Read cached data from movies.json
                let promises = [];
                storage.get('movies')
                .then(data => {
                    console.log(`${data.length} items retrieved from cache.`);
                    console.log(data);
    
                    // If a film has been removed from HDD
                    // Check movies cache against hdd_data for any that do not exist
                    // Remove entry from movies object
                    let removeCount = 0;
                    for (let item in data) {
                        let cacheFileLocation = data[item].fileLocation;
                        let check = movieItemsHDD.some(item => item.FileLocation == cacheFileLocation);
                        if (check == false) {
                            let cacheTitle = data[item].Title;
                            console.log(`${ cacheTitle } is not in HDD data...`);
                            console.log(`Removing ${ cacheTitle }...`);
                            data.splice(item, 1);
                            commit('SET_REFRESH_MESSAGES', `${ cacheTitle } removed.`);
                            removeCount++;
                        }
                    }
    
                    // If a film has been added to HDD
                    // Check hdd_data against movies cache for any that do not exist
                    // Call API and add new entries to movies object
                    for (let item in movieItemsHDD) {
                        let hddFileLocation = movieItemsHDD[item].FileLocation;
                        let check = data.some(item => item.fileLocation == hddFileLocation);
                        if (check == false) { 
                            // if movie not in cache add it
                            let newMovie = movieItemsHDD[item]
                            console.log(`${ newMovie.Title } is a new addition! Adding entry...`);
                            promises.push(
                                axios.get(`http://www.omdbapi.com/?t=${ newMovie.Title }&y=${ newMovie.Year }&apikey=ff0c3dab`)
                                .then(response => {
                                if (response.data.Error == 'Movie not found!') { 
                                    commit('SET_REFRESH_MESSAGES', `The movie ${ newMovie.Title } could not be found...`)
                                    return console.error(`Undefined error! The movie ${ newMovie.Title } could not be found.`); 
                                }
                                let newData = response.data;
                                // check item does not already exist
                                for (let movie in data) {
                                    if (data[movie].Title == newData.Title && data[movie].imdbID == newData.imdbID) {
                                    return console.error(`Duplicate error! The movie '${ newData.Title }' is already in the database.`);
                                    }
                                }
                                newData.watchCount = 0;
                                newData.dateLastWatched = 'Not watched';
                                newData.minuteLastWatched = 0;
                                newData.myRating = 0;
                                newData.isFavourite = 0;
                                newData.fileLocation = newMovie.FileLocation;
                                newData.dateAdded = moment();
                                commit('SET_REFRESH_MESSAGES', `${ newMovie.Title } added.`)
    
                                console.log(newData);
                                data.push(newData);
                                })
                            )
                        }
                    }
        
                    // Save updated data to cache and view model
                    Promise.all(promises).then(() => {
                        console.log('Saving response to local storage...')
                        storage.set('movies', data)
                        .then(() => {
                        console.log('The file was successfully written to local storage.'); // C:\Users\L.Spencer\AppData\Roaming\electron-vue\movies.json
                        if (promises.length == 0 && removeCount == 0) {
                            console.log("Nothing to add or remove :)")
                            commit('SET_REFRESH_MESSAGES', 'Nothing to add or remove :)');
                        } else if (promises.length > 0 || removeCount > 0) {
                            console.log(`${ promises.length } items were added.`)
                            console.log(`${ removeCount } items were removed.`)
                            commit('SET_REFRESH_MESSAGES', `${ promises.length } items were added.`);
                            commit('SET_REFRESH_MESSAGES', `${ removeCount } items were removed.`);
                        }
                        })
                        .catch(err => {
                        console.error(err);
                        });
                        commit('SET_MOVIES', data.sort((a, b) => a.Title.localeCompare(b.Title)));
                    });
    
                    setTimeout(() => {
                        commit('SET_REFRESH_MESSAGES', null);
                    }, 10000);
                    
                })
                .catch(err => {
                    console.error(err);
                });
            }, 4000);
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
        },
        SET_FIRST_VISIT(state, payload) {
            const { status, folder_path } = payload;
            state.firstVisit = status;
            state.folder_path = folder_path;
        },
        SET_REFRESH_MESSAGES(state, message) {
            if (typeof message == 'string') {
                state.refreshMessages.push(message);
            } else {
                state.refreshMessages = [];
            }
        },
        UPDATE_MOVIE (state, payload) {
            const { updateType, lastWatched, rating, movieId } = payload;
            let movie = state.movies.find(item => item.imdbID == movieId);
            if (updateType == 'play') {
                movie.watchCount += 1;
                movie.lastWatched = lastWatched;
            } else if (updateType == 'rate') {
                movie.myRating = rating;
            }
        }
    },
    getters: { // computed
        getMovies(state) {
            let filters = ['RecentlyAdded', 'MostWatched', 'TopRated'];
            let genres = ['Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'War']; 
            let yearRegex = /[0-9][0-9][0-9][0-9]/;
            if (!filters.includes(state.filters)) {
                state.movies.sort((a, b) => a.Title.localeCompare(b.Title));
            }

            if (state.filter == undefined || state.filter == "") {
                return chunk(state.movies, 6);
            } else if (yearRegex.test(state.filter)) {
                return chunk(state.movies.filter(item => item.Year == state.filter), 6);
            } else if (state.filter == 'RecentlyAdded') {
                return chunk(state.movies.filter(item => moment().diff(moment(item.dateAdded), 'days', false) < 7), 6);
            } else if (state.filter == 'MostWatched') {
                return chunk(state.movies.sort((a, b) => b.watchCount - a.watchCount), 6);
            } else if (state.filter == 'TopRated') {
                return chunk(state.movies.sort((a, b) => b.myRating - a.myRating ), 6);
            } else if (genres.includes(state.filter)) {
                return chunk(state.movies.filter(item => item.Genre.includes(state.filter)), 6);
            } else {
                let filter = (state.filter).toLowerCase();
                return chunk(state.movies.filter(item => (item.Title).toLowerCase().includes(filter) || (item.Actors).toLowerCase().includes(filter)), 6);
            }
        }   
    }
})