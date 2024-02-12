import { createStore } from 'vuex'
import axios from 'axios'
let url = 'http://localhost:12000/goldentimes/'

export default createStore({
  modules: {
    user: {
      state: {
        ID: undefined,
        name: undefined,
        profileImg: undefined,
        email: undefined,
        Description: undefined,
        groups: [],
        Token: localStorage.getItem('token')
      },
      mutations: {
        SET_TOKEN(state, payload){
          let token = "Bearer " + payload.token
          localStorage.setItem('token', token)
          state.Token = token
          return
        },
        SET_USER(state, payload){
          let {id, name, profileImg, email, description, groups} = payload
          state.ID = id
          state.name = name 
          state.profileImg = profileImg
          state.email = email
          state.description = description
          state.groups = groups
    
          return
        },
        UNSET_TOKEN(state) {
          localStorage.removeItem('token')
          state.Token = undefined
        }
      },
      actions: {
        async signup(context, payload){
          let {name, email, password} = payload
          return new Promise((resolve, reject) => {
            axios.post(url + 'user', {name,email,password}).then(data => resolve(data))
            .catch(error =>  reject(error.response.err))
          })
        },
        async login(context, payload){
          let  {email, password} = payload
          return new Promise((resolve, reject) => {
            axios.post(url + 'login', {email,password}).then(data => resolve(data))
            .catch(error =>  reject(error))
          })
        },
        async validateUser(context, payload){
          let token = payload
          console.log('chamei a função')
          return new Promise((resolve, reject) => {
            axios.post(url + 'validate', {}, {headers:{authorization: token}})
            .then(response => {
              console.log(response,' vou setar agora')
              context.commit('SET_USER', response.data.user)
              return resolve()
            }).catch(err => {
              console.log(err, 'o erro')
              return reject(err.response.data)
            })
          })
        },
        
        editUserName(context, payload){
          let token = context.state.Token,
          {name} = payload
          return new Promise((resolve, reject) => {
            axios.put(url + 'username', {name}, {headers:{authorization: token}})
            .then(response => {
              let token = response.data.token
              return resolve(token)
            }).catch(err => {
              console.log(err, 'o erro')
              return reject(err.response.data)
            })
          })
        },
        editImgProfile(context, payload){
          let token = context.state.Token,
          file = payload,
          axiosHeader = {headers:{authorization: token}}
                    console.log('o axiosHeader', axiosHeader)
          return new Promise((resolve, reject) => {
            axios.put(`${url}img`, file, axiosHeader).then(response => {
              console.log(response,' a imageeem')
              return resolve(response.data.token)
            }).catch(err => {
              console.log(err, 'erro')
              return reject(err.response.data)
            })
          })
        },
        editUserDescription(context, payload){
          let token = context.state.Token,
            {description} = payload
            return new Promise((resolve, reject) => {
              axios.put(`${url}description`, {description}, {headers:{authorization: token}})
              .then(response => {
                console.log(response)
                let token = response.data.token
                return resolve(token)
              }).catch(err => {
                console.log(err, 'o erro')
                return reject(err.response.data)
              })
            })
        }
      },
    },
    locations:{
      state: {
        SavedLocations: [],
        BlackListLocations: [],
      },
      mutations: {
        SET_LOCATIONS(state, payload){
          console.log('vou setaar', payload)
          state.SavedLocations = payload.SavedLocations
          state.BlackListLocations = payload.BlackListLocations
        },
        UNSET_LOCATIONS(state){
          state.SavedLocations = [],
          state.BlackListLocations = []
        }
      },
      actions:{
        getUserLocations(context){
          let token = context.rootState.user.Token
          let axiosHeader = {headers:{authorization: token}}
          console.log('seguinte, eu vou fazer isso lol', token)
          return new Promise((resolve, reject) => {
            axios.get(`${url}locations`, axiosHeader).then(response => {
              console.log(response, 'é isso que vou setar')
              let locations = response.data.currentLocations
              context.commit('SET_LOCATIONS', locations)
              resolve()
            }).catch(error => {
              console.log('o erro', error)
              reject(error.response.data)
            })
          })
        },
        saveLocation(context, payload){
          let {location} = payload
          let token = context.rootState.user.Token
          let axiosHeader = {headers:{authorization: token}}
          return new Promise((resolve, reject) => {
            axios.post(`${url}location`, {location}, axiosHeader).then(response => {
              let locations = response.data.currentLocations
              console.log('vou salvar isso aqui', locations)
              context.commit('SET_LOCATIONS', locations)
              resolve()
            }).catch(error => {
              console.log('o erro', error)
              reject(error.response.data)
            })
          })
        },
        addLocationToBlackList(context, payload){
          let {location} = payload
          let token = context.rootState.user.Token
          let axiosHeader = {headers:{authorization: token}}
          return new Promise((resolve, reject) => {
            axios.post(`${url}locationblacklist`, {location}, axiosHeader).then(response => {
              let locations = response.data.currentLocations
              console.log('vou salvar isso aqui', locations)
              context.commit('SET_LOCATIONS', locations)
              resolve()
            }).catch(error => {
              console.log('o erro', error)
              reject(error.response.data)
            })
          })
        },
        deleteLocation(context, payload){
          let {location} = payload
          let token = context.rootState.user.Token
          let headers = {authorization: token}
          console.log(headers)
          return new Promise((resolve, reject) => {
            axios.delete(`${url}location`, {headers, data:{location}}).then(response => {
              let locations = response.data.currentLocations
              console.log('vou setar isso aqui', locations)
              context.commit('SET_LOCATIONS', locations)
              resolve()
            }).catch(error => {
              console.log('o erro', error)
              reject(error.response.data)
            })
          })
        },
        deleteLocationFromBlackList(context, payload){
          let {location} = payload
          let token = context.rootState.user.Token
          let headers = {authorization: token}
          console.log(headers)
          return new Promise((resolve, reject) => {
            axios.delete(`${url}locationblacklist`, {headers, data:{location}}).then(response => {
              let locations = response.data.currentLocations
              context.commit('SET_LOCATIONS', locations)
              resolve()
            }).catch(error => {
              console.log('o erro', error)
              reject(error.response.data)
            })
          })
        }
      }
    },
    groups: {
      state: {
        Groups:[],
        CurrentGroupBlackListLocations: []
      },
      mutations: {
        SET_GROUP_STATE(state, payload){
          state.Groups = payload
        },
        SET_CURRENT_LOCATIONS_BLACK_LISTED(state, payload){
          console.log(payload,' o valor do payload ')
          state.CurrentGroupBlackListLocations = payload
        },
        UNSET_GROUPS(state){
          state.Groups = []
        },
        UNSET_CURRENT_GROUP_BLACK_LIST_LOCATIONS(state){
          state.currentGroupBlackListLocation = []
        }

      },
      actions: {
        async saveGroup(context, payload) {
        let Leader = context.rootState.user.ID, GroupName = payload,

        token = context.rootState.user.Token,
        axiosHeader = {headers:{authorization: token}}

        return new Promise((resolve, reject) => {
          axios.post(`${url}group`, {Leader, GroupName}, axiosHeader)
          .then(response => {
            resolve(response.data.groups)
          }).catch(err => {
            console.log(err)
            reject(err.response.data)
          })
        })
      },
      async editGroupName(context, payload){
        let {groupName, groupID} = payload

        let token = context.rootState.user.Token,
        axiosHeader = {headers:{authorization: token}}
        return new Promise((resolve, reject) => {
          axios.put(`${url}group/${groupID}`, {groupName}, axiosHeader)
          .then(response => {
            console.log(response)
            resolve(response.data.groupUpdated)
          }).catch(err => {
            console.log(err, 'errou')
            reject(err.response.data)
          })
          
        })
      },
      async leaveGroup(context, payload){
        console.log('o group id', payload.groupID)
        let {groupID} = payload
        let token = context.rootState.user.Token,
        headers = {authorization: token}
        return new Promise((resolve, reject) => {
          axios.delete(`${url}leavegroup/${groupID}`, {headers})
          .then(response => {
            resolve(response.data.groupID)
          }).catch(err => {
            console.log(err, 'errou')
            reject(err.response.data)
          })
          
        })
      },
      async deleteGroup(context, payload){
        let {groupID} = payload,
          token = context.rootState.user.Token
        return new Promise((resolve, reject) => {
          axios.delete(`${url}group/${groupID}`,{headers:{authorization: token}})
          .then(response => {
            console.log(response)
            resolve(response.data.deletedGroup)
          }).catch(err => {
            console.log(err, 'errou')
            reject(err.response.data)
          })
          
        })
      },
      async getGroup(context, payload){
        let token = context.rootState.user.Token, id = payload,
        axiosHeader = {headers:{authorization: token}}

        return new Promise((resolve, reject) => {
          axios.get(`${url}group/${id}`, axiosHeader).then(response => {
            console.log(response.data.group, 'o grupo')
            resolve(response.data.group)
          }).catch(err => {
            console.log(err)
            reject(err)
          })
        })
      },
      async getGroups(context){
        let token = context.rootState.user.Token,
        axiosHeader = {headers:{authorization: token}}

        return new Promise((resolve, reject) => {
          axios.get(`${url}groups/`, axiosHeader).then(response => {
            console.log(response.data.groups, 'o grupo')
            resolve(response.data.groups)
          }).catch(err => {
            console.log(err)
            reject(err.response.data)
          })
        })
      },
      
    },
  },
  categories: {
    state: {
      category: {},
    },
    mutations: {
      SET_CATEGORY_STATE(state, payload){
        state.category = payload
      },
      SET_CURRENT_SAVED_LOCATIONS(state, payload){
        console.log(payload,' o valor do payload ')
        state.category.SavedLocations = payload
      },
    },
    actions: {
      async createCategory(context, payload){
        let token = context.rootState.user.Token,
        axiosHeader = {headers:{authorization: token}}
        const {GroupID, name} = payload
        return new Promise((resolve, reject) => {
          axios.post(`${url}category/${GroupID}`, {name}, axiosHeader).then(response => {
            console.log(response)
            resolve(response.data.category)
          }).catch(err => {
            console.log(err)
            reject(err.response.data)
          })
        })
      },
      async getCategories(context, payload){
        let token = context.rootState.user.Token, id = payload,
        axiosHeader = {headers:{authorization: token}}
        return new Promise((resolve, reject) => {
          axios.get(`${url}categories/${id}`, axiosHeader).then(response => {
            console.log(response)
            resolve(response.data.categories)
          }).catch(err => {
            console.log(err)
            reject(err.response.data)
          })
        })
      },
      getCategory(context, payload){
        let token = context.rootState.user.Token, 
        {categoryID, groupID} = payload,
        axiosHeader = {headers:{authorization: token}}
        return new Promise((resolve, reject) => {
          axios.get(`${url}category/${categoryID}/${groupID}`, axiosHeader).then(response => {
            console.log(response)
            resolve(response.data.category)
          }).catch(err => {
            console.log(err)
            reject(err.response.data)
          })
        })
      },
      async editCategory(context, payload) {
        console.log('foi a função', payload)
        const {categoryID, groupID, name} = payload
        let token = context.rootState.user.Token
        let headers = {authorization: token}
        return new Promise((resolve, reject) => {
          axios.put(`${url}categoryname/${groupID}`, {categoryID, name}, {headers}).then(response => {
            console.log(response)
            resolve(response.data.category)
          }).catch(err => {
            console.log(err)
            reject(err.response.data)
          })
        })
      },
      async deleteCategory(context, payload){
        console.log('foi a função', payload)
        const {ID, groupID} = payload
        let token = context.rootState.user.Token
        let headers = {authorization: token}
        return new Promise((resolve, reject) => {
          axios.delete(`${url}category/${ID}/${groupID}`, {headers}).then(response => {
            console.log(response)
            resolve(response.data.deleted)
          }).catch(err => {
            console.log(err)
            reject(err.response.data)
          })
        })
      },

      saveLocationInCategory(context, payload){
        let token = context.rootState.user.Token,
        axiosHeader = {headers:{authorization: token}}
        const {groupID, categoryID, location} = payload
        return new Promise((resolve, reject) => {
          axios.post(`${url}location-in-category/${groupID}`, {categoryID, location}, axiosHeader).then(response => {
            console.log(response)
            let {currentSavedLocations} = response.data
            context.commit('SET_CURRENT_SAVED_LOCATIONS', currentSavedLocations)
            resolve(currentSavedLocations)
          }).catch(err => {
            console.log(err)
            reject(err.response.data)
          })
        })
      },

      deleteLocationInCategory(context, payload){
        let {location, categoryID, groupID} = payload, token = context.rootState.user.Token,
        headers = {authorization: token}
        return new Promise((resolve, reject) => {
          axios.delete(`${url}group-location/${categoryID}/${groupID}`, {headers, data:{location}}).then(response => {
            console.log(response)
            let {currentSavedLocations} = response.data
            context.commit('SET_CURRENT_SAVED_LOCATIONS', currentSavedLocations)
            resolve({currentSavedLocations})
          }).catch(err => {
            console.log(err)
            reject(err.response.data)
          })
        })
      },

      addLocationToGroupBlackList(context, payload){
        let token = context.rootState.user.Token,
        axiosHeader = {headers:{authorization: token}}
        const {groupID, location} = payload
        console.log('irei fazer a requisição')
        return new Promise((resolve, reject) => {
          axios.post(`${url}group-location-blacklist/${groupID}`, {location}, axiosHeader).then(response => {
            console.log(response, ' a resposta')
            let {currentBlackListLocation} =  response.data
            resolve(currentBlackListLocation)
          }).catch(err => {
            reject(err.response.data)
          })
        })
      },
      removeLocationFromGroupBlackList(context, payload){
        let {location, groupID} = payload,
         token = context.rootState.user.Token,
        headers = {authorization: token}

        return new Promise((resolve, reject) => {
          axios.delete(`${url}group-location-blacklist/${groupID}`, {headers, data:{location}}).then(response => {
            let {currentBlackListLocation} = response.data
            console.log(response)
            context.commit('SET_CURRENT_LOCATIONS_BLACK_LISTED', currentBlackListLocation)
            resolve({currentBlackListLocation})
          }).catch(err => {
            reject(err.response.data)
          })
        })
      },
    }
  },

  invites: {
    actions: {
      sendUserInvite(context, payload){
        let token = context.rootState.user.Token,
        axiosHeader = {headers:{authorization: token}}
        const {groupID, invite} = payload
        console.log('irei fazer a requisição', groupID, invite)
        return new Promise((resolve, reject) => {
          axios.post(`${url}invite/${groupID}`, {invite}, axiosHeader).then(response => {
            console.log(response, ' a resposta')
            resolve(response.data)
          }).catch(err => {
            console.log(err)
            reject(err)
          })
        })
      },
      
      getUserInvites(context){
        let token = context.rootState.user.Token,
        axiosHeader = {headers:{authorization: token}}
        console.log('irei fazer a requisição')
        return new Promise((resolve, reject) => {
          axios.get(`${url}invites`, axiosHeader).then(response => {
            console.log(response, ' a resposta')
            resolve(response.data.invites)
          }).catch(err => {
            console.log(err)
            reject(err)
          })
        })
      },
      acceptInvite(context, payload){
        let token = context.rootState.user.Token,
        axiosHeader = {headers:{authorization: token}}
        const {GroupID, ID = payload.invite.ID, invite} = payload
        console.log('irei fazer a requisição', payload)
        return new Promise((resolve, reject) => {
          axios.post(`${url}member/${ID}`, {invite, groupID: GroupID}, axiosHeader).then(response => {
            console.log(response, ' a resposta')
            resolve(response.data.inviteID)
          }).catch(err => {
            console.log(err)
            reject(err.response.data)
          })
        })
      },
      refuseInvite(context, payload){
        let token = context.rootState.user.Token,
        headers = {authorization: token}
        const {GroupID, invite} = payload
        console.log('irei fazer a requisição', payload)
        return new Promise((resolve, reject) => {
          axios.delete(`${url}invite/`, {data:{invite, groupID: GroupID}, headers}).then(response => {
            console.log(response, ' a resposta')
            resolve(response.data.inviteID)
          }).catch(err => {
            console.log(err)
            reject(err.response.data)
          })
        })
      }

    }
  }
}
})
