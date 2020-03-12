<template>
  <div id="app">
    <!-- BootstrapVue supports 'to=' attribute from Vue Router -->
    <!-- previously <router-link to='/'>Home</router-link> -->
    <div>
      <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand to="/" href="#">Piflix</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item to="/about">About</b-nav-item>
            <b-nav-item to="/movie/the terminator">Series</b-nav-item>
            <b-nav-item href="https://www.imdb.com" target="_blank">Action</b-nav-item>
            <b-nav-item href="#">Drama</b-nav-item>
            <b-nav-item href="#">Horror</b-nav-item>
            <b-nav-item href="#">Sci-Fi</b-nav-item>
            <b-nav-item href="#">Comedy</b-nav-item>
          </b-navbar-nav>  

          <b-navbar-nav>
            <b-nav-item-dropdown left>
              <!-- Using 'button-content' slot -->
              <template v-slot:button-content>
                <b>Filters</b>
              </template>
              <b-dropdown-item href="#">Top Rated</b-dropdown-item>
              <b-dropdown-item href="#">Most Watched</b-dropdown-item>
              <b-dropdown-item href="#">Recently Added</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-form>
              <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
              <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
            </b-nav-form>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>

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
  html {
    background-color: black;
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: white;
    background-color: black;
  }

  .navbar-brand {
    font-family: 'Bebas Neue';
  }
</style>
