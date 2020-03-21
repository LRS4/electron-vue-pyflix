<template>
  <b-container class="movieContainer">
    <b-row>
      <!-- First column -->
      <b-col cols="4">
        <div>
          <img v-bind:src="`${ movieData.Poster }`" class="moviePoster" />
        </div>
      </b-col>
      <!-- Second column -->
      <b-col cols="8">
        <h3>{{ movieData.Title }}</h3>
        <!-- Row with five sub-columns for info --> 
        <div class="row">
          <div class="col-sm-2">
            <p><b-icon icon="calendar" style="color: white;"></b-icon> {{ movieData.Year }}</p>
          </div>
          <div class="col-sm-2">
            <p><b-icon icon="clock" style="color: white;"></b-icon> {{ movieData.Runtime }}</p>
          </div>
          <div class="col-sm-4">
            <p><b-icon icon="tv" style="color: white;"></b-icon> {{ movieData.Genre }}</p>
          </div>
          <div class="col-sm-2">
            <p v-if="movieData.Ratings[1].Value >= 80"><b-img class="rottenTomatoesLogo" :src="require('../assets/certified.jpg')"></b-img> {{ movieData.Ratings[1].Value }}%</p>
            <p v-else-if="movieData.Ratings[1].Value >= 60"><b-img class="rottenTomatoesLogo" :src="require('../assets/fresh.jpg')"></b-img> {{ movieData.Ratings[1].Value }}%</p>
            <p v-else><b-img class="rottenTomatoesLogo" :src="require('../assets/rotten.jpg')"></b-img> {{ movieData.Ratings[1].Value }}%</p>
          </div>
          <div class="col-sm-2">
            <p><b-img id="imdbLogo" :src="require('../assets/imdb.png')"></b-img> {{ movieData.imdbRating }}</p>
          </div>
        </div>
        <div>
          <p class="moviePlot">
            {{ movieData.Plot }}
          </p>
        </div>
        <!-- Row with two sub-cols for action buttons -->
        <div class="row movieSubRows">
          <div class="col-sm-6">
            <b-button block variant="outline-success" pill v-on:click="play(movieData.fileLocation)">Play <b-icon icon="play-fill"></b-icon></b-button>
          </div>
          <div class="col-sm-6">
            <b-button block variant="outline-success" pill v-bind:href="`https://www.imdb.com/title/${movieData.imdbID}/#titleRecs`" target="_blank">View details <b-icon icon="info-square"></b-icon></b-button>
          </div>
        </div>
        <!-- Row with three sub-cols for watch information -->
        <div class="row movieSubRows">
          <div class="col-sm-4">
            <p v-if="movieData.watchCount == 0"><b-icon icon="eye-slash" style="color: white;"></b-icon> Not watched</p>
            <p v-else><b-icon icon="eye" style="color: white;"></b-icon> Played {{ movieData.watchCount }} times</p>
          </div>
          <div class="col-sm-4">
            <p v-if="movieData.watchCount == 0" ></p>
            <p v-else>Last watched {{ formatDate(movieData.lastWatched) }}</p>
          </div>
          <div class="col-sm-4">
            <p>Added {{ formatDate(movieData.dateAdded) }}</p>
          </div>
        </div>
        <!-- Row for 'More Like This' -->
        <div class="row movieSubRows">
          <div class="col-sm-4">
            FILM
          </div>
          <div class="col-sm-4">
            FILM
          </div>
          <div class="col-sm-4">
            FILM
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
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
      isPlaying: false
    };
  },
  methods: {
    play(filePath) {
      (this.isPlaying == false) ? this.isPlaying = true : this.isPlaying = false;
      storage.get('movies')
      .then(data => {
          for (let movie in data) {
              if (data[movie].imdbID == this.movieId) {
                  data[movie].watchCount += 1;
                  data[movie].lastWatched = moment();
                  storage.set('movies', data);
                  return console.log("Watch count updated!");
              }
          }
      });

      // open file in default application
      console.log(filePath);
      shell.openExternal(path.normalize(filePath)); 
    },
    formatDate(value) {
      if (value) {
        // return moment(String(value)).format('Do MMMM YYYY HH:MMa');
        return moment(value).fromNow();
      }
    }
  },
  computed: {
    movieData() {
        let result = this.$store.state.movies.find(item => item.imdbID == this.movieId);
        console.log(result)
        result.Ratings[1].Value = parseInt(result.Ratings[1].Value);
        if (result != undefined) {
            return result;
        } else {
            return "Error";
        }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  font-size: 35px;
  font-weight: bold;
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
.movieContainer {
  width: 100%;
  margin-top: 6%;
  font-family: 'Roboto';
}
.movieInfoBar {
  margin-left: 40px;
}
.moviePlot {
  margin-top: 30px;
  font-size: 25px;
}
#imdbLogo {
  height: 20px;
  width: 55px
}
.rottenTomatoesLogo {
  height: 20px;
  width:20px;
  margin-bottom: 1px;
}
.movieSubRows {
  margin-top: 40px;
}
</style>
