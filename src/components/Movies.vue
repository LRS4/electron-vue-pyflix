<template>
  <div class="hello">
    <div v-if="!movieData" class="loading">Loading Please wait...</div>
    <div v-else class="movies">
     <h3>{{ movieData.Title }}</h3>
     <small>{{ movieData.Year }} - {{ movieData.Director }} </small>
     <p>{{ movieData.Plot }}</p>
     <img v-bind:src="`${ movieData.Poster }`" />
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
    axios.get('http://www.omdbapi.com/?t=gladiator&y=2000&apikey=ff0c3dab')
    .then(response => (this.movieData = response.data))
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
</style>
