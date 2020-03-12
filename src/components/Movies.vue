<template>
  <div class="hello">
    <button v-on:click="addNewItem">Add new item</button>
    <div v-if="!moviesData" class="loading">Loading Please wait...</div>
    <div v-else v-for="movie in moviesData" v-bind:key="movie.imdbId" class="movies">
     <h3>{{ movie.Title }}</h3>
     <small>{{ movie.Year }} - {{ movie.Director }} </small>
     <p>{{ movie.Plot }}</p>
     <img v-bind:src="`${ movie.Poster }`" />
    </div>
  </div>
</template>

<script>
/*
Even though we are fetching the data from a file, we do the exact same thing when fetching data from an URL.
Just replace “weather.json” with the API URL.
Fetch has a few shortcomings. Like we demonstrated earlier with fetch, we needed to chain two then functions to the call the get the data. 
This is simplified with axios. Let’s replace our current fetch function with axios.
*/
import axios from 'axios';
import moment from 'moment';
const storage = require('electron-storage');

export default {
  name: 'Movies',
  data() {
    return {
      moviesData: []
    };
  },
  methods: {
    addNewItem() {
      storage.get('movies')
      .then(data => {

        // create new item to add to model
        axios.get('http://www.omdbapi.com/?&t=we were soldiers&apikey=ff0c3dab')
        .then(response => {
          let newData = response.data;

          // check item does not already exist
          for (let movie in data) {
            if (data[movie].Title == newData.Title && data[movie].imdbID == newData.imdbID) {
              return console.error(`Duplicate error! The movie '${newData.Title}' is already in the database.`);
            }
          }

          // proceed if not a duplicate
          // add additional properties to the new item
          newData.watchCount = 0;
          newData.dateLastWatched = 'Not watched';
          newData.minuteLastWatched = 0;
          newData.myRating = 0;
          newData.fileLocation = 'C://somepath';
          newData.dateAdded = moment();
          data.push(newData);
          console.log(newData);

          // save to cached file
          storage.set('movies', data)
          .then(() => {
            console.log(`A new movie '${response.data.Title}' was added to the cached data.`);
          })
          .catch(err => {
            console.log(err);
          });
        });

        // update view model
        this.moviesData = data;
      })
      .catch(err => {
        console.error(err);
      });
    },
    populateMovieData() {
      console.log('Attempting to retrieve movies.json from local storage...');
      storage.isPathExists('movies.json', (itDoes) => {
        if (itDoes) {
          storage.get('movies')
          .then(data => {
            console.log(`${data.length} items retrieved successfully.`);
            this.moviesData = data;
          })
          .catch(err => {
            console.error(err);
          });
        } else {
          const movieNames = ['Gladiator', 'The Matrix', 'The Terminator']; // the values for the API lookup
      
          // https://stackoverflow.com/questions/56532652/axios-get-then-in-a-for-loop
          let movies = [];
          let promises = [];
          console.log('Calling OMDB API...');
          movieNames.forEach(name => {
            promises.push(
              axios.get(`http://www.omdbapi.com/?t=${ name }&y=&apikey=ff0c3dab`).then(response => {
                movies.push(response.data);
              })
            )
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
            this.moviesData = movies;
          });
        }
      })
    }
  },
  created() {
    this.populateMovieData()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 10px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
