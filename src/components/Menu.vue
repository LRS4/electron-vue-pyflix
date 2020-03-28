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
            <b-nav-item to="/movies/action" replace v-on:click='filterItems("Action")'>Action</b-nav-item>            
            <b-nav-item to="/movies/adventure" replace v-on:click='filterItems("Adventure")'>Adventure</b-nav-item>
            <b-nav-item to="/movies/animation" replace v-on:click='filterItems("Animation")'>Animation</b-nav-item>
            <b-nav-item to="/movies/biography" replace v-on:click='filterItems("Biography")'>Biography</b-nav-item>
            <b-nav-item to="/movies/comedy" replace v-on:click='filterItems("Comedy")'>Comedy</b-nav-item>
            <b-nav-item to="/movies/crime" replace v-on:click='filterItems("Crime")'>Crime</b-nav-item>            
            <b-nav-item to="/movies/drama" replace v-on:click='filterItems("Drama")'>Drama</b-nav-item>
            <b-nav-item to="/movies/horror" replace v-on:click='filterItems("Horror")'>Horror</b-nav-item>
            <b-nav-item to="/movies/scifi" replace v-on:click='filterItems("Sci-Fi")'>Sci-Fi</b-nav-item>
            <b-nav-item to="/movies/thriller" replace v-on:click='filterItems("Thriller")'>Thriller</b-nav-item>
            <b-nav-item to="/movies/war" replace v-on:click='filterItems("War")'>War</b-nav-item>
          </b-navbar-nav>  

          <b-navbar-nav>
            <b-nav-item-dropdown class="dropdown-filters" left>
              <!-- Using 'button-content' slot -->
              <template v-slot:button-content>
                <b>Filters</b>
              </template>
              <div class="dropdown-filters">
                <b-dropdown-item varient="dark" v-on:click='filterItems("MostWatched")' href="#">Most Watched</b-dropdown-item>
                <b-dropdown-item varient="dark" v-on:click='filterItems("RecentlyAdded")' href="#">Recently Added</b-dropdown-item>
                <b-dropdown-item varient="dark" v-on:click='filterItems("TopRated")' href="#">Top Rated</b-dropdown-item>
              </div>
            </b-nav-item-dropdown>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
              <b-form-input
              size="sm"
              class="mr-sm-2"
              placeholder="Search..."
              id="txtName"
              v-on:keyup="filterItems(searchInput)"
              v-model="searchInput"
              type="search"
              >
              </b-form-input>
              <b-button 
                size="sm" 
                variant="outline-success" 
                class="my-2 my-sm-0" 
                v-b-popover.hover="'Refresh the data source.'"
                v-b-modal.modal
                >
                <b-icon class="refreshDataIcon" icon="arrow-repeat"></b-icon>
              </b-button>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>

      <!-- Reindex HDD modal confirmation -->
      <b-modal
      id="modal"
      size="lg"
      title="Are you sure?"
      :header-bg-variant="headerBgVariant"
      :header-text-variant="headerTextVariant"
      :body-bg-variant="bodyBgVariant"
      :body-text-variant="bodyTextVariant"
      :footer-bg-variant="footerBgVariant"
      :footer-text-variant="footerTextVariant"
      v-on:ok="refreshData()"
      centered
      >
      <div class="confirmRefreshModal">
        <div class="row">
          <div class="col-sm-6">
            <p class="my-4">
              This operation will index the data source and use that to query the OMDB API for movie information and store file locations.
            </p>
            <p>
              It will add any new movies from the data source, and remove any that no longer exist :)
            </p>
            <p>
              In order for this to work the folders and files must be in a specific structure.
            </p>
            <p>
              As shown in the example on the right, the folder structure is set out with a Movie folder containing various category Folders with movies
              within them. They are all in the format 'Title (YYYY)'. The folder also contains a 'Series' folder with Season folders, with episodes inside.
            </p>
            <p>
              This layout is perfect, and should be imitated exactly to get the best results!
            </p>
          </div>
          <div class="col-sm-6">
            <p class="my-4">Example folder structure that would index perfectly...</p>
            <ul> 
              <li>Movies</li>
                <ul>
                  <li>Action</li>
                  <ul> 
                    <li>MovieName (YYYY)</li>
                    <li>MovieName (YYYY)</li>
                    <li>MovieName (YYYY)</li>
                  </ul>
                </ul>
                <ul>
                  <li>Adventure</li>
                  <ul> 
                    <li>MovieName (YYYY)</li>
                    <li>MovieName (YYYY)</li>
                    <li>MovieName (YYYY)</li>
                  </ul>
                </ul>
                <ul>
                  <li>Thriller</li>
                  <ul> 
                    <li>MovieName (YYYY)</li>
                    <li>MovieName (YYYY)</li>
                    <li>MovieName (YYYY)</li>
                  </ul>
                </ul>
                <ul>
                  <li>Series</li>
                  <ul> 
                    <li>SeriesName (YYYY)</li>
                    <ul>
                      <li>Season 1</li>
                        <ul>
                          <li>Episode 1</li>
                          <li>Episode 2</li>
                          <li>...</li>
                        </ul>
                      <li>Season 2</li>
                        <ul>
                          <li>Episode 1</li>
                          <li>Episode 2</li>
                          <li>...</li>
                        </ul>
                    </ul>
                    <li>SeriesName (YYYY)</li>
                      <ul>
                        <li>Episode 1</li>
                        <li>Episode 2</li>
                        <li>...</li>
                      </ul>
                    </ul>
                  </ul>
            </ul>
          </div>
        </div>
      </div>
      </b-modal>

      <!-- Welcome modal to enter folder path on first visit -->
      <b-modal
      id="modal-prevent-closing"
      size="lg"
      title="Welcome to Pyflix!"
      v-model="firstVisit"
      :header-bg-variant="headerBgVariant"
      :header-text-variant="headerTextVariant"
      :body-bg-variant="bodyBgVariant"
      :body-text-variant="bodyTextVariant"
      :footer-bg-variant="footerBgVariant"
      :footer-text-variant="footerTextVariant"
      @show="resetModal"
      @hidden="resetModal"
      @close="preventFormClose"
      @ok="handleOk"
      centered
      >
        <div class="welcomeModal">
          <div class="row">
            <div class="col-sm-6">
              <p class="my-4">
                This app uses the Open Movie Database in combination with your own DVD or video files to create a custom movie explorer :)
              </p>
              <p>
                Since it's your first time here there is a little set up involved and some guidance to follow...
              </p>
              <p>
                Firstly, you will to enter below the path to the folder which holds all the movies which are to be indexed into the database...
              </p>
              <p>
                This might look something like... 'F:\Movies'
              </p>
              <p>
                In order for the app to index correctly the folders and files must be in a specific structure.
              </p>
              <p>
                As shown in the example on the right, the folder structure is set out with a Movie folder containing various category Folders with movies
                within them. They are all in the format 'Title (YYYY)'. The folder also contains a 'Series' folder with Season folders, with episodes inside.
              </p>
              <p>
                This layout is perfect, and should be imitated exactly to get the best results! Only 
              </p>
              <form ref="form" @submit.stop.prevent="handleSubmit">
                <b-form-group
                  :state="folderPathState"
                  label="Enter folder path"
                  label-for="folder-input"
                  invalid-feedback="Folder path required and must be a valid directory"
                >
                  <b-form-input
                    id="folder-input"
                    v-model="folderPath"
                    :state="folderPathState"
                    required
                  ></b-form-input>
                </b-form-group>
              </form>
              <div class="mt-3">Selected folder path: {{ folderPath }}</div>
            </div>
            <div class="col-sm-6">
              <p class="my-4">Example folder structure that would index perfectly...</p>
              <ul> 
                <li>Movies</li>
                  <ul>
                    <li>Action</li>
                    <ul> 
                      <li>MovieName (YYYY)</li>
                      <li>MovieName (YYYY)</li>
                      <li>MovieName (YYYY)</li>
                    </ul>
                  </ul>
                  <ul>
                    <li>Adventure</li>
                    <ul> 
                      <li>MovieName (YYYY)</li>
                      <li>MovieName (YYYY)</li>
                      <li>MovieName (YYYY)</li>
                    </ul>
                  </ul>
                  <ul>
                    <li>Thriller</li>
                    <ul> 
                      <li>MovieName (YYYY)</li>
                      <li>MovieName (YYYY)</li>
                      <li>MovieName (YYYY)</li>
                    </ul>
                  </ul>
                  <ul>
                    <li>Series</li>
                    <ul> 
                      <li>SeriesName (YYYY)</li>
                      <ul>
                        <li>Season 1</li>
                          <ul>
                            <li>Episode 1</li>
                            <li>Episode 2</li>
                            <li>...</li>
                          </ul>
                        <li>Season 2</li>
                          <ul>
                            <li>Episode 1</li>
                            <li>Episode 2</li>
                            <li>...</li>
                          </ul>
                      </ul>
                      <li>SeriesName (YYYY)</li>
                        <ul>
                          <li>Episode 1</li>
                          <li>Episode 2</li>
                          <li>...</li>
                        </ul>
                      </ul>
                    </ul>
              </ul>
            </div>
          </div>
        </div>
        <template v-slot:modal-footer="{ ok }">
          <!-- Emulate built in modal footer ok and cancel button actions -->
          <b-button variant="danger" @click="ok()">
            Confirm
          </b-button>
        </template>
      </b-modal>
    </div>
</template>

<script>
const fs = require('fs');
const storage = require('electron-storage');

export default {
  name: 'Menu',
  data() {
    return {
      searchInput: '',
      folderPath: '',
      folderPathState: null,
      headerBgVariant: 'dark',
      headerTextVariant: 'light',
      bodyBgVariant: 'dark',
      bodyTextVariant: 'light',
      footerBgVariant: 'dark',
      footerTextVariant: 'dark',
    }
  },
  methods: {
    filterItems(filter) {
        this.$store.dispatch('setFilter', filter)
    },
    refreshData() {
      this.$store.dispatch('reindexHDD');
      this.$store.dispatch('setLoadingStatus', true);
      this.$store.dispatch('refreshMovies');
      setTimeout(() => {
        this.$store.dispatch('setLoadingStatus', false);
      }, 10000);
    },
    preventFormClose(bvModalEvt) {
      bvModalEvt.preventDefault()
    },
    checkFormValidity() {
        const valid = this.$refs.form.checkValidity()
        if (valid && fs.existsSync(this.folderPath)) {
          this.folderPathState = valid
          return valid
        } else {
          this.folderPathState = false;
          return false;
        }  
    },
    resetModal() {
      this.folderPath = ''
      this.folderPathState = null
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()

      // Trigger submit handler
      this.handleSubmit()
    },
    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return
      }

      // Handle success - update first visit status
      this.$store.dispatch('setFirstVisitStatus', {
        status: false,
        folder_path: this.folderPath
      });

      // Create the user.json file
      console.log('Creating user.json...')
      let user = {
        isFirstTime: false,
        folderPath: this.folderPath
      }
      storage.set('user', user)
      .then(() => {
      console.log('User information cached successfully.'); // C:\Users\L.Spencer\AppData\Roaming\pyflix\user.json
      })
      .catch(err => {
      console.error(err);
      });

      // Fire the load movies method and set loading to true
      this.$store.dispatch('setLoadingStatus', true);
      setTimeout(() => {
        this.$store.dispatch('loadMovies');
      }, 3000);

      // Timeout for turning off loading screen
      setTimeout(() => {
        this.$store.dispatch('setLoadingStatus', false);
      }, 10000);
      
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('modal-prevent-closing')
      })
    }
  },
  computed: {
    firstVisit: {
      // https://vuejs.org/v2/guide/computed.html#Computed-Setter
      get() {
        return this.$store.state.firstVisit;
      },
      set(value) {
        this.$store.dispatch('setFirstVisitStatus', value);
      }
    },
  }
}
</script>

<style scoped>
  nav {
    background-color: black !important;
  }
  #txtName {
    background-color: black;
    color: white;
  }
  #txtName::placeholder {
    color: white;
  }
  #txtName::-webkit-search-cancel-button{
    -webkit-appearance: none;
    color: white !important;    
  }
  .nav-link {
    font-weight: bold;
    padding: 8px 8px 8px 8px;
  }
  .nav-link:hover {
    border-bottom: 3px solid white;
    padding: 8px 8px 5px 8px;
  }
  .nav-link.router-link-exact-active {
    border-bottom: 3px solid white;
    padding: 8px 8px 5px 8px;
  }
  .form-control:focus {
    border-color: gray;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(0, 0, 0, 0.6);
  }
  .refreshDataIcon {
    height: 18px;
    width: 18px;
  }
  .confirmRefreshModal { 
    font-size: 17px;
    font-family: 'Roboto';
  }
  .welcomeModal { 
    font-size: 17px;
    font-family: 'Roboto';
  }

</style>