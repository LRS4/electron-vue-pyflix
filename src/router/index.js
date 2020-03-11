import Vue from 'vue'
import VueRouter from  'vue-router'
import Home from '../components/HelloWorld.vue'
import Movie from '../components/Movie.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/movie",
    name: "movie",
    component: Movie
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router