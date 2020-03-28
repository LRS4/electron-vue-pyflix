<template>
  <div name="view" class="movie-grid">
    <transition name="loading-fade">
      <div class="container h-100" v-show="loading">
        <div class="row h-100 justify-content-center align-items-center">
          <h1 class="loadingBanner">Pyflix</h1> 
        </div>  
        <b-spinner variant="success" type="grow" label="Spinning"></b-spinner>
        <p v-for="(message, index) in refreshMessages" v-bind:key="index">{{ message }}</p>
      </div>
    </transition>
    <transition name="movies-fade">
      <div class="moviesContainer" v-show="!loading">
        <b-row v-for="(movies, index) in getMovies" v-bind:key="`movie-${index}`" is="transition-group" name="fade-out-in" mode="out-in">
          <b-col v-for="movie in movies" v-bind:key="movie.imdbID">
            <router-link v-bind:to="'/series/' + movie.imdbID" v-if="movie.Type == 'series'"> 
              <img v-bind:src="`${ movie.Poster }`" class="moviePosters" />
            </router-link>
            <router-link v-bind:to="'/movie/' + movie.imdbID" v-else>
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
    </transition>
  </div>
</template>

<script>
/*
Even though we are fetching the data from a file, we do the exact same thing when fetching data from an URL.
Just replace “weather.json” with the API URL.
Fetch has a few shortcomings. Like we demonstrated earlier with fetch, we needed to chain two then functions to the call the get the data. 
This is simplified with axios. Let’s replace our current fetch function with axios.
*/
import { mapState, mapGetters } from 'vuex';
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
      this.$store.dispatch('setFilter', filter);
    },
    stopLoading() {
      setTimeout(() => {
        this.$store.dispatch('setLoadingStatus', false);
      }, 3000);
    }
  },
  computed: {
    ...mapState(['loading', 'refreshMessages']),
    ...mapGetters(['getMovies'])
  },
  created() {
    this.stopLoading();
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
  max-width: 240px;
  min-width: 240px;
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

/* The individual movies in the grid on filter change */
.fade-out-in-enter-active,
.fade-out-in-leave-active {
  transition:  opacity 0.5s ease-in-out, transform 0.5s ease;
}

.fade-out-in-enter-active {
  transition-delay: 0.s;
}

.fade-out-in-enter,
.fade-out-in-leave-active {
  opacity: 0;
}

/* The initial loading screen fading out */
.loadingBanner {
  font-family: 'Bebas Neue';
  font-size: 160px;
  margin-top: 25%;
}
.loading-fade-enter-active,
.loading-fade-leave-active {
  transition:  opacity 0.5s ease-out, transform 0.5s ease;
}

.loading-fade-enter-active {
  transition-delay: 0.5s;
}

.loading-fade-enter,
.loading-fade-leave-active {
  opacity: 0;
}

/* The movies grid fading in after load */
.movies-fade-enter-active,
.movies-fade-leave-active {
  transition:  opacity 0.7s ease-in, transform 0.7s ease;
}

.movies-fade-enter-active {
  transition-delay: 0.7s;
}

.movies-fade-enter,
.movies-fade-leave-active {
  opacity: 0;
}
</style>
