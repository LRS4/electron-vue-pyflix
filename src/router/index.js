import Vue from 'vue'
import VueRouter from  'vue-router'
import Movies from '../components/Movies.vue'
import Movie from '../components/Movie.vue'
import About from '../components/About.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "movies",
    component: Movies
  },
  {
    path: "/movie/:id",
    name: "movie",
    component: Movie
  },
  {
    path: "/about",
    name: "about",
    component: About
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router