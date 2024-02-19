<template>
    <div class="content-container">
        <span class="locations-errs">{{err}}</span>
      <form @submit.prevent="search()">
          <div class="search-container">
              <input type="search" placeholder="Search" name="search" id="search" autocomplete="off" v-model="text">
                  <SearchIcon @click="simulateSubmit"></SearchIcon>
                <input type="submit" hidden>
          </div>
          <button @click.prevent="filters = !filters">
              <FiltersIcon></FiltersIcon>
              Bring
          </button>
          <Transition name="filters">
              <Filters v-if="filters" :filtersProps="filtersList" @addFilter="filterSelected($event)"></Filters>
          </Transition>
      </form>
      <LoadingSmall v-if="searching"></LoadingSmall>
      <div class="cards-container" v-if="!searching">
          <LocationCard v-for="(location, index) in locations" :key="index" :locationProps="location" :copyForWhatsApiProps="copySpecial"
          :placesSavedProps="false"
          @saveCard="savePlace($event)"
          />
      </div>
    </div>
  </template>
  
  <script>
  import SearchIcon from '@/components/svgs/SearchIcon.vue'
  import FiltersIcon from '@/components/svgs/FiltersIcon.vue'
  import Filters from '@/components/Filters.vue'
  import LocationCard from '@/components/LocationCard.vue'
  import axios from 'axios'
  import LoadingSmall from '@/components/LoadingSmall.vue'
  import { mapActions, mapMutations, mapState } from 'vuex'
  
  export default {
    head(){
        return {
            title: this.categoryName + ' Search',
            meta: [
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                {name: 'robots', content: 'noindex'}
            ], 
        }
    },
      async mounted(){
        try {
            let category = await this.getCategory({categoryID: this.categoryID, groupID: this.groupID})
            this.categoryName = category.Name
            this.SET_STATE(category)
            let {BlackListLocations}= await this.getGroup(this.groupID)
            this.SET_CURRENT_LOCATIONS_BLACK_LISTED(BlackListLocations)
        } catch (error) {
            this.err = error.err
        }
      },
      data(){
          return {
              text:'',
              categoryID: this.$route.params.categoryID,
              groupID: this.$route.params.groupID,
              filters: false,
              filtersList: [ { name: 'PhoneNumber', selected: false, apiFilter: 'phone' },
              {name:'Only Whats', selected: false, apiFilter:'onlyWhats'},
              { name: 'Reviews', selected: false, googleFilter:'places.reviews' },
              { name: 'Facebook', selected: false, apiFilter: 'facebook'},
              { name: 'Copy WhatsApp Api Link', selected: false, apiFilter: 'copyOnlyWhats'},
              { name: 'Open Now', selected: false, apiFilter: 'openNow' },
              { name: 'WebSite', selected: false, apiFilter: 'webSite' }, ],
              googleFiltersSelecteds: '',
              apiFiltersSelecteds:'',
              locations: [],
              copySpecial: undefined,
              searching: false,
              err: '',
              categoryName: '',
              mobile: false,
              
          }
      },
      watch: {
        '$screen.width'(value){
            this.setResponsive(value)
        },
      },
      computed: {
          ...mapState({locationStore: state => state.categories.category, BlackListLocations: state => state.groups.CurrentGroupBlackListLocations})
      },
      components:{SearchIcon, FiltersIcon, Filters, LocationCard, LoadingSmall},
      methods: {
          ...mapActions({saveLocation:'saveLocationInCategory', getCategory: 'getCategory'}),
          ...mapMutations({SET_STATE: 'SET_CATEGORY_STATE'}),
          setResponsive(value = this.$screen.width){
            if(value <= 860) return this.mobile = true
            this.mobile = false
          },
          filterSelected(filter){
              let newFiltersList = this.filtersList.map(obj => {
                  if(obj.name === filter && obj.googleFilter){
                      return {name: obj.name, selected: !obj.selected, googleFilter: obj.googleFilter}
                  }
                  if(obj.name === filter && obj.apiFilter){
                      return {name: obj.name, selected: !obj.selected, apiFilter: obj.apiFilter}
                  }
                  return obj
              })
              this.filtersList = newFiltersList
              let found = this.filtersList.find(filter => {
                  return filter.name === 'Copy WhatsApp Api Link' && filter.selected
              })
              found ? this.copySpecial = true : this.copySpecial = false
              this.toggleFilter()
          },
          toggleFilter(){
              let filtersSelecteds = this.filtersList.filter(filter => {
                  return filter.selected === true
              })
              let googlefiltersNames = filtersSelecteds.filter(obj => {
                  return obj.googleFilter
              })
              let apiFiltersNames = filtersSelecteds.filter(obj => {
                  return obj.apiFilter
              })
              let googleFiltersTreated = Array.from(googlefiltersNames).map(filter => filter.googleFilter)
              let apiFiltersNamesTreated = Array.from(apiFiltersNames).map(filter => filter.apiFilter)
  
              this.googleFiltersSelecteds = googleFiltersTreated.join(',')
              this.apiFiltersSelecteds = apiFiltersNamesTreated.join(',')

              this.search()
          },
          simulateSubmit(){
              document.querySelector('input[type="submit"]').click()
          },
          search(){
              this.searching = true
              let url = this.apiFiltersSelecteds !== '' ? `http://localhost:12000/goldentimes/locations/${this.text}/places.nationalPhoneNumber,${this.googleFiltersSelecteds}/${this.apiFiltersSelecteds}` 
              : `http://localhost:12000/goldentimes/locations/${this.text}/places.nationalPhoneNumber,${this.googleFiltersSelecteds}`
              console.log('vou fazer a pesquisa', url)
              axios.get(url)
              .then(response =>{
                  if(response.data.locations.error) return this.err = 'ocorreu um erro durante a pesquisa'
                  let locations = response.data.locations.places
                  this.isLocationSaved(locations)
                  this.isLocationBlackListed(this.locations)
                  this.searching = false
              }).catch(err => {
                  console.log(err)
                  this.err = err.response.data.err
                  this.searching = false
              })
          },
          async isLocationSaved(locations){
              if(this.locationStore.SavedLocations.length < 1) return this.locations = locations
              let newArray = locations.map(location => {
                  let found = this.locationStore.SavedLocations.find(filter => {
                      return filter.googleMapsUri === location.googleMapsUri
                  })
                  if(found) location.saved = true
                  return location
              })
              this.locations = newArray
          },
          async isLocationBlackListed(locations){
                if(this.BlackListLocations.length < 1) return
                let newArray = locations.filter(location => {
                    let found = this.BlackListLocations.find(filter => {
                        return filter.googleMapsUri === location.googleMapsUri
                    })
                    if(found) return false
                    return true
                })
                this.locations = newArray
            },
          async savePlace($event){
              try {
                  console.log($event,'o eventou')
                  await this.saveLocation({groupID: this.groupID, categoryID:this.categoryID, location: $event})
                  this.isLocationSaved(this.locations)
              }
              catch(error){
                  console.log(error, ' o erro')
                  this.err = error.err
              }
          }
      }
  
  }
  </script>
  
  <style lang="scss" scoped>
  @import '@/assets/scss/variables.scss';
  @import '@/assets/scss/imageCenter.scss';
      .content-container {
          width: 100%;
          height: 81.5%;
          border-radius: 40px;
          margin-top: 10px;
          background: #0E0E0D;
          padding: 20px 30px 0px;
          display: flex;
          flex-direction: column;
          position: relative;
      }
      form {
          display: flex;
          width: 100%;
          gap: 9px;
          justify-content: space-between;
          position: relative;
          .search-container {
              flex: 1;
              display: flex;
              position: relative;
              input {
                  width: 99%;
                  border-radius: 40px;
                  background: #191918;
                  border: none;
                  outline: none;
                  padding: 15px;
                  color: $text-color;
                  font-size: 1rem;
                  font-family: $main-font;
                  &::-webkit-search-cancel-button{
                      display: none;
                  }
                  &::placeholder {
                  color: $text-color;
                  font-family: $main-font;
                  font-size: 1rem;
                  font-style: normal;
                  font-weight: 400;
                  line-height: normal;
                  }
                  
              }
              svg {
                  position: absolute;
                  right: 0;
                  top: 50%;
                  right: calc(0% + 15px);
                  transform: translate(-50%, -50%);
                  cursor: pointer;
                  
              }
          }
          button{
              display: flex;
              flex: 1;
              max-width: 115px;
              padding: 15px 24px;
              align-items: center;
              gap: 5px;
              border-radius: 40px;
              background: #191918;
              color: $text-color;
              font-family: $main-font;
              font-size: 1rem;
              font-style: normal;
              font-weight: 400;
              line-height: normal;
              border: none;
              cursor: pointer;
              &:hover {
                  color: #F5CB86;
              }
          }
      }
      .cards-container {
          height: 100%;
          overflow-y: auto;
          display: flex;
          flex-wrap: wrap;
          gap: 10%;
          align-items: center;
          justify-content: center;
          padding: 43px 0px 33px;
      }
  
      .filters-enter-active, .filters-leave-active {
          transition: 0.3s;
      }
      .filters-enter-from {
          opacity: 0;
          transform: translate(-50%, 0%);
      }
      .filters-enter-to {
          opacity: 1;
          transform: translate(-50%, 100%);
      }
      .filters-leave-from {
          opacity: 1;
          transform: translate(-50%, 100%);
  
      }
      .filters-leave-to {
          opacity: 0;
          transform: translate(-50%, 0%);
      }
      @media screen and (max-width: 860px) {
        .content-container {
          width: 100%;
          height: 81.5%;
          border-radius: 40px;
          margin-top: 10px;
          background: #0E0E0D;
          padding: 20px 20px 0px;
          display: flex;
          flex-direction: column;
          position: relative;
      }
      }
  
  </style>
  
  