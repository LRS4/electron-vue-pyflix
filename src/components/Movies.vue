<template>
  <div name="view" class="movie-grid">
    <div v-if="!getMovies && getMovies.length < 1">
      Loading...
    </div>
    <div class="moviesContainer" v-else>
      <b-row v-for="(movies, index) in getMovies" v-bind:key="`movie-${index}`" is="transition-group" name="fade-out-in" mode="out-in">
        <b-col v-for="movie in movies" v-bind:key="movie.imdbID">
          <router-link v-bind:to="'/movie/' + movie.imdbID">
            <img v-bind:src="`${ movie.Poster }`" class="moviePosters" />
          </router-link>
          <p class="movieInformation">
            <span v-if="movie.Title.length <= 17" class="movieTitles">{{ movie.Title }}</span>
            <span v-else class="movieTitles">{{ (movie.Title).slice(0, 17) }}...</span>
            <br />
            <span class="movieYears">{{ movie.Year }}</span>
          </p>
        </b-col>  
      </b-row>
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
import { mapGetters } from 'vuex';
import axios from 'axios';
import moment from 'moment';
const storage = require('electron-storage');

export default {
  name: 'Movies',
  methods: {
    addNewItem() {
      storage.get('movies')
      .then(data => {

        // create new item to add to model
        axios.get('http://www.omdbapi.com/?&t=the count of monte cristo&apikey=ff0c3dab')
        .then(response => {

          if (response.data.Error == 'Movie not found!') { 
            return console.error('Undefined error! The movie could not be found.') 
          }

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
    filterItems(filter) {
      this.$store.dispatch('setFilter', filter)
    }
  },
  computed: {
    ...mapGetters(['getMovies'])
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
.b-container {
  width: 100%;
}
.moviesContainer {
  padding: 0px 25px;
  margin-top: 30px;
  width: 100%;
}
.moviePosters {
  height: 80%;
  width: 100%;
  min-height: 330px;
  max-height: 330px;
  max-width: 250px;
  min-width: 250px;
  padding: 1px 1px;
}
.moviePosters:hover {
  background-color: white;
}
.movieTitles {
  font-family: 'Roboto';
  font-weight: bold;
}
.movieYears {
  font-family: 'Roboto';
  color: gray;
}
.fade-out-in-enter-active,
.fade-out-in-leave-active {
  transition: opacity .5s;
}

.fade-out-in-enter-active {
  transition-delay: .5s;
}

.fade-out-in-enter,
.fade-out-in-leave-active {
  opacity: 0;
}
</style>
