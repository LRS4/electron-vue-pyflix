<template>
  <div id="app">
    <Menu />
    <!-- route outlet -->
    <!-- component matched by the route will render here -->
    <transition name="view">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import Menu from './components/Menu';
import { mapState } from 'vuex'

export default {
  name: 'App',
  components: {
    Menu
  },
  mounted() {
    this.$store.dispatch('loadMovies');
  },
  computed: {
    ...mapState([
      'movies'
    ])
  }
}
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

  .view-enter-active, .view-leave-active {
    transition: opacity 0.5s ease-in-out, transform 0.5s ease;
  }

  .view-enter-active {
    transition-delay: 0.5s;
  }

  /* When the page enters */
  .view-enter, .view-leave-to {
    opacity: 0;
  }

  /* When the page leaves */
  .view-enter-to, .view-leave {
    opacity: 1;
  }

  ::-webkit-scrollbar {
    width: 12px;
    background-color: black;
  }

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
    background-color: gray;
  }
</style>
