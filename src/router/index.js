import Vue from 'vue'
import VueRouter from  'vue-router'
import Movies from '../components/Movies.vue'
import Movie from '../components/Movie.vue'
import Series from '../components/Series.vue'
import About from '../components/About.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "movies",
    component: Movies
  },
  {
    path: '*',
    redirect: '/'
  },
  {
    path: "/movies/:filter",
    name: "movieFilter",
    component: Movies
  },
  {
    path: "/movie/:id",
    name: "movie",
    component: Movie
  },
  {
    path: "/series/:id",
    name: "series",
    component: Series
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