<template>
  <div class="hello">
    <div v-if="!movieData" class="loading">Loading Please wait...</div>
    <div v-else class="movie">
      <h3>{{ movieData.Title }}</h3>
      <p>{{ movieData.Year }}</p>
      <p>{{ movieData.Director }} </p>
      <p>{{ movieData.Plot }}</p>
      <p>Played {{ movieData.watchCount }} times</p>
      <p>Added {{ formatDate(movieData.dateAdded) }}</p>
      <img v-bind:src="`${ movieData.Poster }`" class="moviePoster" />
    </div>
  </div>
</template>

<script>
import moment from 'moment';
const storage = require('electron-storage');

export default {
  name: 'Movie',
  data() {
    return {
      movieId: this.$route.params.id,
      movieData: null
    };
  },
  methods: {
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
  height: 32%;
  width: 32%;
}
</style>
