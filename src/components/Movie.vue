<template>
  <div class="hello">
    <div v-if="!movieData" class="loading">Loading Please wait...</div>
    <div v-else v-show="!isPlaying" class="movie">
      <h3>{{ movieData.Title }}</h3>
      <p>{{ movieData.Year }}</p>
      <p>{{ movieData.Director }}</p>
      <p>{{ movieData.Plot }}</p>
      <p>Played {{ movieData.watchCount }} times</p>
      <p>Added {{ formatDate(movieData.dateAdded) }}</p>
      <button v-on:click="play">Play</button>
      <a v-bind:href="`https://www.imdb.com/title/${movieData.imdbID}/#titleRecs`" target="_blank">More like this</a>
      <div>
        <img v-bind:src="`${ movieData.Poster }`" class="moviePoster" />
      </div>
    </div>
    <div v-show="isPlaying" controls>
      <h1>Movie launching...</h1>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
const storage = require('electron-storage');
const shell = require('electron').shell;
const path = require('path');

export default {
  name: 'Movie',
  data() {
    return {
      movieId: this.$route.params.id,
      movieData: null,
      isPlaying: false
    };
  },
  methods: {
    play() {
      (this.isPlaying == false) ? this.isPlaying = true : this.isPlaying = false;
      storage.get('movies')
      .then(data => {
          for (let movie in data) {
              if (data[movie].imdbID == this.movieId) {
                  data[movie].watchCount += 1;
                  storage.set('movies', data);
                  this.movieData = data[movie];
                  return console.log("Watch count updated!");
              }
          }
      });

      // open file in default application
      shell.openExternal(path.normalize("C:\\Users\\L.Spencer\\Desktop\\Movies\\Conan the Barbarian (1982).avi")); 
    },
    formatDate(value) {
      if (value) {
        // return moment(String(value)).format('Do MMMM YYYY HH:MMa');
        return moment(value).fromNow();
      }
    }
  },
  created() {
    storage.get('movies')
      .then(data => {
           for (let movie in data) {
               if (data[movie].imdbID == this.movieId) {
                   this.movieData = data[movie];
                   return console.log("Movie found!");
               }
           }
      });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
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
.moviePoster {
  height: 20%;
  width: 20%;
}
</style>
