<template>
    <!-- BootstrapVue supports 'to=' attribute from Vue Router -->
    <!-- previously <router-link to='/'>Home</router-link> -->
    <div>
      <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand to="/" v-on:click='filterItems("")'>Piflix</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item to="/about">About</b-nav-item>
            <b-nav-item to="/" v-on:click='filterItems("")'>All</b-nav-item>
            <b-nav-item to="/" v-on:click='filterItems("Action")'>Action</b-nav-item>            
            <b-nav-item to="/" v-on:click='filterItems("Adventure")'>Adventure</b-nav-item>
            <b-nav-item to="/" v-on:click='filterItems("Animation")'>Animation</b-nav-item>
            <b-nav-item to="/" v-on:click='filterItems("Biography")'>Biography</b-nav-item>
            <b-nav-item to="/" v-on:click='filterItems("Comedy")'>Comedy</b-nav-item>
            <b-nav-item to="/" v-on:click='filterItems("Crime")'>Crime</b-nav-item>            
            <b-nav-item to="/" v-on:click='filterItems("Drama")'>Drama</b-nav-item>
            <b-nav-item to="/" v-on:click='filterItems("Horror")'>Horror</b-nav-item>
            <b-nav-item to="/" v-on:click='filterItems("Sci-Fi")'>Sci-Fi</b-nav-item>
            <b-nav-item to="/" v-on:click='filterItems("Thriller")'>Thriller</b-nav-item>
            <b-nav-item to="/" v-on:click='filterItems("War")'>War</b-nav-item>
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
</template>

<script>
export default {
  name: 'Menu',
  methods: {
    filterItems(filter) {
        this.$store.dispatch('setFilter', filter)
    }
  }
}
</script>