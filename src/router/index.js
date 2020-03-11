import Vue from 'vue'
import VueRouter from  'vue-router'
import Movies from '../components/Movies.vue'
import Movie from '../components/Movie.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "movies",
    component: Movies
  },
  {
    path: "/movie/:title",
    name: "movie",
    component: Movie
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router