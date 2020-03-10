<template>
  <div id="app">
    <div class="vue-logo">
      <img alt="Vue logo" src="./assets/logo.png">
    </div>
  
    <!-- use router-link component for navigation. -->
    <!-- specify the link by passing the `to` prop. -->
    <!-- `<router-link>` will be rendered as an `<a>` tag by default -->
    <nav class="topnav-centered">
      <router-link to='/'>Home</router-link>
      <router-link to='/about'>About</router-link>
    </nav>

    <!-- route outlet -->
    <!-- component matched by the route will render here -->
    <router-view></router-view>
  </div>
</template>

<script>
/* Before Vue Router was implemented
import Weather from './components/Weather.vue'
export default {
  name: 'App',
  components: {
    Weather
  }
}
*/
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
  /* Style the links inside the navigation bar */
  .router-link-active {
    color: black;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
    font-size: 17px;
  }
  /* Change the color of links on hover */
  .router-link-active:hover {
    background-color: #ddd;
    color: black;
  }
  /* Add a color to the active/current link */
  .router-link-active:active {
    background-color: #4CAF50;
    color: white;
  }
  nav {
    margin-top: 15px;
  }
  nav a {
  color: black;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
    font-size: 17px;
  }
  nav a:hover {
    background-color: #ddd;
    color: black;
  }
  /* Add a color to the active/current link */
  nav a:active {
    background-color: #4CAF50;
    color: white;
  }
</style>
