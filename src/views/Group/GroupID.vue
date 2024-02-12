<template>
    <div class="content-container">
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
      <div class="cards-container">
          <LocationCard v-for="(location, index) in locations" :key="index" :locationProps="location" :copyForWhatsApiProps="copySpecial"
          :placesSavedProps="true"
          @deleteCard="deleteUserCard($event)"
          @addBlackListCard="addPlaceToBlackList($event)"
          />
      </div>
    </div>
  </template>
  
  <script>
  import SearchIcon from '../../components/svgs/SearchIcon.vue'
  import FiltersIcon from '../../components/svgs/FiltersIcon.vue'
  import Filters from '../../components/Filters.vue'
  import LocationCard from '@/components/LocationCard.vue'
  import { mapActions, mapState } from 'vuex'
  
  export default {
    /* eslint-disable */
      async mounted(){
          await this.getUserLocations()
          await this.isLocationSaved(this.locationStore.SavedLocations)
          await this.isLocationBlackListed(this.locationStore.SavedLocations)
      },
      data(){
          return {
              text:'',
              filters: false,
              filtersList: [ { name: 'PhoneNumber', selected: false, apiFilter: 'phone' },
              {name:'Only Whats', selected: false, apiFilter:'onlyWhats'},
              { name: 'Reviews', selected: false, googleFilter:'places.reviews' },
              { name: 'Facebook', selected: false, apiFilter: 'facebook'},
              { name: 'Copy WhatsApp Api Link', selected: false, apiFilter: 'copyOnlyWhats'},
              { name: 'Open Now', selected: false, apiFilter: 'openNow' },
              { name: 'WebSite', selected: false, apiFilter: 'webSite' }, ],
              googleFiltersSelecteds: [],
              apiFiltersSelecteds: [],
              locations: [],
              copySpecial: undefined,
              
          }
      },
      computed: {
          ...mapState({locationStore: state => state.locations})
      },
      watch: {
        text(){
            this.search()
        }
      },
      components:{SearchIcon, FiltersIcon, Filters, LocationCard},
      methods: {
          ...mapActions({saveLocation:'saveLocation', getUserLocations: 'getUserLocations',
          deleteLocation: 'deleteLocation', addLocationToBlackList: 'addLocationToBlackList'
        }),
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
          async toggleFilter(){
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
              this.apiFiltersSelecteds = apiFiltersNamesTreated
              this.googleFiltersSelecteds = googleFiltersTreated
              await this.applyFilters()
          },
          async applyFilters(){
            let newPlaces = this.locationStore.SavedLocations
            let {openNow, onlyWhats, facebook, webSite, phone} =  await this.setVariables()
            try {
                if(openNow){
                    newPlaces = this.getLocationsOpeneds(newPlaces)
                }
                if(phone) {
                    newPlaces = this.getLocationsWithPhoneNumbers(newPlaces)
                }
                if(onlyWhats){
                    newPlaces = this.getOnlyPhoneNumbers(newPlaces)
                }
                if(facebook){
                    newPlaces = this.getOnlyFaceook(newPlaces, webSite)
                }
                if(!webSite && !facebook) {
                    newPlaces = this.getLocationsWithoutSites(newPlaces, facebook)
                }
                if(webSite) {
                    newPlaces = this.getLocationsWithSites(newPlaces)
                }
                console.log(newPlaces, 'funcionou')
                return this.locations = newPlaces
             }
            catch(err){
                throw err
            }
          },
          async setVariables(){
            let openNow = undefined, onlyWhats = undefined, 
            facebook = undefined, webSite = undefined,
            phone = undefined, filters = this.apiFiltersSelecteds
            for (let i = 0; i < filters.length; i++) {
                let filter = filters[i];
                switch (filter) {
                    case 'phone':
                        phone = true
                    break;
                    case 'openNow':
                        openNow = true
                    break;
                    case 'onlyWhats':
                        onlyWhats = true
                    break;
                    case 'facebook':
                        facebook = true
                    break;
                    case 'webSite':
                        webSite = true
                    break;
                default:
                    break;
                }
            }
            return new Promise((resolve, reject) => {
                resolve({openNow, onlyWhats, facebook, webSite, phone})
                console.log(reject)
               
            })
          },
          simulateSubmit(){
              document.querySelector('input[type="submit"]').click()
          },
          search(){
            if(this.text == '' || this.text ==' ') return 
            this.locations = this.locationStore.SavedLocations.filter(filter => {
              return filter.displayName.text.toLowerCase().includes(this.text.toLowerCase()) 
            || filter.formattedAddress.toLowerCase().includes(this.text.toLowerCase())
            })
            return this.isLocationSaved(this.locations)
          },
          async isLocationSaved(locations){
            if(this.locationStore.SavedLocations.length < 1) return this.locations = []
            let newArray = locations.map(location => {
                let found = this.locationStore.SavedLocations.find(filter => {
                    return filter.googleMapsUri === location.googleMapsUri
                })
                location.saved = false
                if(found) location.saved = true
                return location
            })
            this.locations = newArray.filter(filter => filter.saved)
        },
          async isLocationBlackListed(locations){
              if(this.locationStore.BlackListLocations.length < 1) return
              let newArray = locations.filter(location => {
                  let found = this.locationStore.BlackListLocations.find(filter => {
                      return filter.googleMapsUri === location.googleMapsUri
                  })
                  if(found) return false
                  return true
              })
              this.locations = newArray
          },
          async deleteUserCard($event){
              try {
                  console.log($event,'o eventou')
                  await this.deleteLocation({location: $event})
                  this.isLocationSaved(this.locations)
                  this.isLocationBlackListed(this.locations)
              }
              catch(error){
                  console.log(error, ' o erro')
                  this.err = error
              }
          },
          async addPlaceToBlackList($event) {
              try {
                await this.addLocationToBlackList({location: $event})
                this.isLocationSaved(this.locations)
                this.isLocationBlackListed(this.locations)
                
              } catch (error) {
                  if(!error.err) error.err = 'ocorreu um erro'
                  this.error = err
              }

          },
          
    getLocationsOpeneds(places){
        console.log('veio aquieeee', places)
      try {
        return places.filter(filter => {
          if(!filter.regularOpeningHours) return false
          return filter.regularOpeningHours.openNow
        })
      } catch (error) {
        throw {err: 'ocorreu um erro'}
      }
    },
    getLocationsWithPhoneNumbers(places){
      try {
        return places.filter(filter => {
          if(!filter.nationalPhoneNumber) return false
          return true
        })
      } catch (error) {
        throw {err: 'ocorreu um erro'}
      }
    },
    getOnlyPhoneNumbers(places) {
      try {
        return places.filter(filter => {
          if(!filter.nationalPhoneNumber) return false
          return filter.nationalPhoneNumber.split(' ')[1].charAt(0) === '9'
        })
      }
      catch(err){
        throw {err: 'ocorreu um erro'}
      }
    },
    getOnlyFaceook(places, webSite){
      try {
        return places.filter(filter => {
          if(!filter.websiteUri && !webSite) return true
          if(!filter.websiteUri && webSite) return false
          return filter.websiteUri.includes('facebook')
        })
        
      } catch (error) {
        throw {err: 'ocorreu um erro'}
      }
    },
    getLocationsWithoutSites(places, facebook){
      try {
        return places.filter(filter => {
          if(!filter.websiteUri && !facebook) return true 
          if(filter.websiteUri && facebook) return true
          if(filter.websiteUri && !facebook) return false
        })
        
      } catch (error) {
        throw {err: 'ocorreu um erro'}
      }
    },
    getLocationsWithSites(places) {
      try {
        return places.filter(filter => {
          if(!filter.websiteUri) return false
          return true
        })
        
      } catch (error) {
        throw {err: 'ocorreu um erro'}
      }
    }
      },
  
  }
  </script>
  
  <style lang="scss" scoped>
  @import '../../assets/scss/variables.scss';
  @import '../../assets/scss/imageCenter.scss';
      .content-container {
          width: 100%;
          height: 81.5%;
          border-radius: 40px;
          margin-top: 10px;
          background: #0E0E0D;
          padding: 20px 30px 0px;
          display: flex;
          flex-direction: column;
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
  
  </style>
  
  