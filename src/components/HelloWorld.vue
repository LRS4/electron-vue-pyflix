<template>
  <div class="hello">
    <h1>Welcome</h1>
    <p>
      ... to my very own Netflix app :)
    </p>
    <div v-for="movie in movieDataList" :key="movie.imdbID" class="movie-data">
      <h3>{{movie.Title}}</h3>
      <p>{{movie.Plot}}</p>
      <ul>
        <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank" rel="noopener">{{ movie.Year }}</a></li>
        <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank" rel="noopener">{{ movie.Director }}</a></li>
        <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" target="_blank" rel="noopener">{{ movie.Country }}</a></li>
      </ul>
      <img :src="movie.Poster">        
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
  name: 'HelloWorld',
  data() {
    return {
      movieDataList: []
    };
  },
  mounted() {
    axios.get('http://www.omdbapi.com/?t=gladiator&y=2000&apikey=ff0c3dab').then(response => (this.movieDataList = response))
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
