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
          <div class="col-sm-3">
            <p><b-icon icon="calendar" style="color: white;"></b-icon> {{ movieData.Year }}</p>
          </div>
          <div class="col-sm-2">
            <p><b-icon icon="clock" style="color: white;"></b-icon> {{ movieData.Runtime }}</p>
          </div>
          <div class="col-sm-5">
            <p><b-icon icon="tv" style="color: white;"></b-icon> {{ movieData.Genre }}</p>
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
            <b-button block variant="outline-success" pill v-on:click="playMovie(movieData.fileLocation)">Play <b-icon icon="play-fill"></b-icon></b-button>
          </div>
          <div class="col-sm-3">
            <b-button block variant="outline-success" pill v-b-modal.modal-center>Details <b-icon icon="info"></b-icon></b-button>
          </div>
          <div class="col-sm-3">
            <b-button block variant="outline-success" pill v-bind:href="`https://www.imdb.com/title/${movieData.imdbID}/#titleRecs`" target="_blank">More like this <b-icon icon="box-arrow-up-right"></b-icon></b-button>
          </div>
        </div>
        <!-- Row with three sub-cols for watch information -->
        <div class="row movieSubRows">
          <div class="col-sm-3">
            <p v-if="movieData.watchCount == 0"><b-icon icon="eye-slash" style="color: white;"></b-icon> Not watched</p>
            <p v-else><b-icon icon="eye" style="color: white;"></b-icon> Played {{ movieData.watchCount }} times</p>
          </div>
          <div class="col-sm-6">
            <p v-if="movieData.watchCount == 0" ></p>
            <p v-else><b-icon icon="arrow-clockwise" style="color: white;"></b-icon> Last watched {{ formatDate(movieData.lastWatched) }}</p>
          </div>
          <div class="col-sm-3">
            <p><b-icon icon="plus" style="color: white;"></b-icon> Added {{ formatDate(movieData.dateAdded) }}</p>
          </div>
        </div>
        <!-- Row with two sub-cols for add favourite and my rating -->
        <div class="row movieSubRows">
          <div class="col-sm-3">
          </div>
          <div class="col-sm-6">
            <star-rating
            @rating-selected="setRating"
            v-bind:rating="movieData.myRating"
            v-bind:increment="0.5"
            v-bind:max-rating="10"
            v-bind:star-size="30"
            v-bind:show-rating="false"
            active-color="#5cb85c"
            border-color="black"
            v-bind:border-width="2"
            v-bind:glow="1"
            
            >
            </star-rating>
          </div>
          <div class="col-sm-3">
          </div>
        </div>
      </b-col>
    </b-row>
    <!-- Details modal -->
     <b-modal
      id="modal-center"
      size="xl"
      centered
      :title="movieData.Title"
      :header-bg-variant="headerBgVariant"
      :header-text-variant="headerTextVariant"
      :body-bg-variant="bodyBgVariant"
      :body-text-variant="bodyTextVariant"
      :footer-bg-variant="footerBgVariant"
      :footer-text-variant="footerTextVariant"
      >
      <div class="movieModalInfo">
        <div class="row">
          <div class="col-sm-6">
            <p class="my-4">Released</p> 
          </div>
          <div class="col-sm-6">
            <p class="my-4">{{ movieData.Released }}</p>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-6">
            <p class="my-4">Director</p> 
          </div>
          <div class="col-sm-6">
            <p class="my-4"> {{ movieData.Director }}</p>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-6">
            <p class="my-4">Writer</p> 
          </div>
          <div class="col-sm-6">
            <p class="my-4">{{ movieData.Writer }}</p>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-6">
            <p class="my-4">Actors</p> 
          </div>
          <div class="col-sm-6">
            <p class="my-4">{{ movieData.Actors }}</p>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-6">
            <p class="my-4">Total Seasons</p> 
          </div>
          <div class="col-sm-6">
            <p class="my-4">{{ movieData.totalSeasons }}</p>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-6">
            <p class="my-4">Awards</p> 
          </div>
          <div class="col-sm-6">
            <p class="my-4">{{ movieData.Awards }}</p>
          </div>
        </div>
      </div>
      <template v-slot:modal-footer="{ ok }">
        <!-- Emulate built in modal footer ok and cancel button actions -->
        <b-button size="md" pill variant="light" @click="ok()">
          OK
        </b-button>
      </template>
    </b-modal>
  </b-container>
</template>

<script>
import moment from 'moment';
import StarRating from 'vue-star-rating';
const storage = require('electron-storage');
const shell = require('electron').shell;
const path = require('path');

export default {
  name: 'Movie',
  data() {
    return {
      movieId: this.$route.params.id,
      isPlaying: false,
      headerBgVariant: 'dark',
      headerTextVariant: 'light',
      bodyBgVariant: 'dark',
      bodyTextVariant: 'light',
      footerBgVariant: 'dark',
      footerTextVariant: 'dark',
    };
  },
  components: {
    StarRating
  },
  methods: {
    playMovie(filePath) {
      (this.isPlaying == false) ? this.isPlaying = true : this.isPlaying = false;
      
      // update data in cache
      storage.get('movies')
      .then(data => {
          for (let movie in data) {
              if (data[movie].imdbID == this.movieId) {
                  data[movie].watchCount += 1;
                  data[movie].lastWatched = moment();
                  storage.set('movies', data);
                  return console.log("Cache updated...");
              }
          }
      });

      // update view model
      this.$store.dispatch('updateMovie', {
        updateType: 'play',
        lastWatched: moment(),
        movieId: this.movieId
      })
      console.log("View model updated...");

      // open file in default application
      console.log("File path accessed --> " + filePath);
      shell.openExternal(path.normalize(filePath)); 
    },
    setRating(rating) {
      // update cache
      storage.get('movies')
      .then(data => {
          for (let movie in data) {
              if (data[movie].imdbID == this.movieId) {
                  data[movie].myRating = rating;
                  storage.set('movies', data);
                  return console.log("Cache updated...");
              }
          }
      });

      // update view model
      this.$store.dispatch('updateMovie', {
        updateType: 'rate',
        rating: rating,
        movieId: this.movieId
      })
      console.log("View model updated...")
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
.movieModalInfo p {
  font-size: 20px;
  font-family: 'Roboto';
}
</style>