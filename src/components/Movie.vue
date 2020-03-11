<template>
  <div class="hello">
    <h1>Welcome</h1>
    <p>
      ... to my very own Netflix app :)
    </p>
    <div class="movie">
     <h3>{{ movieData.Title }}</h3>
     <small>{{ movieData.Year }} - {{ movieData.Director }} </small>
     <p>{{ movieData.Plot }}</p>
     <img v-bind:src="`${ movieData.Poster }`" />
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Movie',
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
