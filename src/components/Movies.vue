<template>
  <div class="hello">
    <div v-if="!movieData" class="loading">Loading Please wait...</div>
    <div v-else v-for="movie in movieData" v-bind:key="movie.imdbId" class="movies">
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

export default {
  name: 'Movies',
  data() {
    return {
      movieData: []
    };
  },
  created() {
    axios.get('http://www.omdbapi.com/?apikey=ff0c3dab&s=american')
    .then(response => (this.movieData = response.data.Search))
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
