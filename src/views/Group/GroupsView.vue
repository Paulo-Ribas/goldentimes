<template>
  <Loading v-if="!loaded"></Loading>
  <section id="categories" @keydown="checkEscape" @click="search = false" v-if="loaded">
    <div class="dark-background" v-if="search"></div>
      <div class="container">
          <div class="categories">
              <span class="category-error">{{ err }}</span>
              <MyForm placeholderProps="Category Name" @submitForm="createCategory($event)"/>
              <div class="categories-container">
                <Category v-for="category in categories" :key="category.ID" 
                 :categoryProps="category"
                 :groupIDProps="groupID"
                 @editCategory="updateCategoryName($event)"
                 @deleteCategory="removeCategory($event)"></Category>
              </div>
          </div>
          <div class="members">
            <button class="btn-special" @click.stop="search = !search">Add user to group</button>
              <Member v-for="member in members" :key="member.ID" :memberProps="member"></Member>
          </div>
          <div class="search-users" @click.stop="" v-if="search">
            <form class="search-form" @submit.prevent="searchUser">
              <input type="search" v-model="userSearch" placeholder="Search">
              <input id="search-user" type="submit" value="buscar">
              <SearchIcon class="search-icon" @click="simulateSubmit"></SearchIcon>
              <Close class="close" @click="search = false"></Close>
            </form>
              <div class="users-container">
                <LoadingMicro v-if="searching"></LoadingMicro>
                <span class="error">{{ errInvited }}</span>
                <Users v-for="user in users" :key="user.ID" :invitedProps="usersInvited" :userProps="user" :membersProps="members" :leaderProps="leader" @inviteUser="invite($event)"></Users>
              </div>
          </div>
      </div>
  </section>
</template>

<script>
import Category from '@/components/Category.vue'
import Member from '@/components/Member.vue'
import MyForm from '@/components/MyForm.vue'
import SearchIcon from '@/components/svgs/SearchIcon.vue'
import { mapActions, mapMutations, mapState} from 'vuex'
import axios from 'axios'
import Users from '@/components/Users.vue'
import Close from '@/components/svgs/Close.vue'
import Loading from '@/components/Loading.vue'
import LoadingMicro from '@/components/LoadingMicro.vue'
export default {
  components: { MyForm, Category, Member, Users, SearchIcon, Close, LoadingMicro, Loading },
  async beforeMount(){
    try {
      console.log(this.groupID, 'o iddd')
      let group = await this.getGroup(this.groupID)
      this.group = group
      this.categories = await this.getCategories(this.groupID) || []
      this.err = ''
      this.loaded = true
      return
    
    } catch (error) {
      console.log(error, 'o erro')
      this.err = error.err
      this.loaded = true
    }
  },
  computed: {
    ...mapState({user: state => state.user}),
    members(){
      return this.group.Members
    },
    leader(){
      return this.group.Leader
    },
  },
  data(){
    return {
        groupID: this.$route.params.id,
        errInvited: '',
        group: {},
        categories: [],
        editing: false,
        search: false,
        users: [],
        userSearch: '',
        url: 'http://localhost:12000/goldentimes/',
        usersInvited: [],
        err: '',
        loaded: false,
        searching: false,

    }
  },
  methods: {
      ...mapActions({getGroup: 'getGroup', getCategories: 'getCategories', 
        saveCategory: 'createCategory', deleteCategory: 'deleteCategory',
        editCategory: 'editCategory', sendUserInvite: 'sendUserInvite'
        }),
      ...mapMutations({SET_GROUPS: 'SET_GROUPS'}),
      async createCategory($event){
        try {
          let category = await this.saveCategory({GroupID: this.groupID, name: $event})
          this.categories.push(category)
          console.log(this.categories,' está aqui')
        } catch (error) {
          console.log(error)
          this.err = error.err
        }
      },
      simulateSubmit(){
        document.getElementById('search-user').click()
      },
      async updateCategoryName(category) {
        try {
          const groupID = this.groupID, {categoryID, name} = category

          let updated = await this.editCategory({name, categoryID, groupID})
          this.categories = this.categories.map(obj => ({
              ...obj,
              Name: obj.ID === updated.ID ? updated.Name : obj.Name
            }))

        } catch (error) {
          this.err = error.err
        }
      },
      async removeCategory($event){
        try {
          let ID = $event, groupID = this.groupID
          await this.deleteCategory({ID, groupID})
          let newArray = this.categories.filter(filter => filter.ID !== ID)
          this.categories = newArray
        } catch (error) {
          console.log(error)
          this.err = error.err
        }

      },
      searchUser(){
        let token = this.user.Token
        this.searching = true
        axios.get(`${this.url}users/${this.userSearch}`, {headers:{authorization: token}}).then(response => {
          this.searching = false
          this.users = response.data.users
        }).catch(err => {
          console.log(err)
          this.err = err.err
          this.searching = false
        })
      },
      checkEscape($event) {
        if($event.code === 'Escape') this.search = false
      },
      async invite($event){
        let invite = {
          ...$event,
          GroupName: this.group.GroupName
        }
        console.log(invite, 'vou enviar o convite')
        let groupID = this.groupID
        try {
          let invitedUser = await this.sendUserInvite({invite, groupID})
          this.usersInvited.push(invitedUser)
        } catch (error) {
          this.errInvited = error
        }
      }
  },
}
</script>

<style scoped lang="scss">
  @import '../../assets/scss/variables.scss';
  @import '../../assets/scss/imageCenter.scss';
  @import '../../assets/scss/buttonsAndInputs.scss';
  #categories {
    width: 100%;
    height: 100vh;
    padding-top: 4%;
    .dark-background {
      background-color: #0E0E0D;
      opacity: 0.7;
      width: 100%;
      height: -webkit-fill-available;
      position: absolute;
      z-index: 1;
      top: 0;
    }
    .container {
      display: flex;
    }
    .categories {
      width: 90%;
      max-width: 600px;
      flex-direction: column;
      display: flex;
      height: 91%;
      gap: 10px;
      .categories-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;
        overflow-y: auto;
        padding-top: 5px;
      }
    }
    .members {
      display: inline-flex;
      height: fit-content;
      min-height: 200px;
      max-height: 90vh;
      padding: 14px;
      flex: 1;
      max-width: 400px;
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
      flex-shrink: 0;
      border-radius: 20px;
      background: #0E0E0D;
      margin: 3.938rem auto 0px auto;
      .btn-special {
        max-height: 55px;
        width: 100%;
        cursor: pointer;
        @include specialBtn(3px, 3px, 1.4rem)
      }
  }
  .search-users {
    position: absolute;
    width: 98%;
    height: 95%;
    max-width: 450px;
    max-height: 550px;
    background-color: #0E0E0D;
    padding: 5px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    border-radius: 40px;
    border: 1px solid #7E5936;
    box-shadow: 8px 8px 8px 0px rgba(0, 0, 0, 0.70);
    display: flex;
    flex-direction: column;
    .users-container {
      width: 100%;
      height: fit-content;
      overflow: auto;

    }
    .search-form {
      font-size: 1rem;
      color: $text-color;
      width: 100%;
      padding: 10px 3px;
      display: flex;
      justify-content: center;
      position: relative;
      align-items: center;
      gap: 5px;
      input {
        flex: 1;
        max-width: 98%;
        font-size: 1rem;
        font-family: $main-font;
        color: $gold;
        border: none;
        outline: none;
        background: #191918;
        border-radius: 20px;
        padding: 10px 25px 10px 10px;
        &::placeholder {
          color: $text-color;
        }
        &::-webkit-search-cancel-button{
            display: none;
        }
      }
      input[type="submit"] {
        position: absolute;
        opacity: 0;
        z-index: -1;
      }
      .search-icon {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translate(calc((16px - 3.150rem) - 5px), -50%);        
        cursor: pointer;
      }
      .close {
        position: relative;
        cursor:  pointer;
      }
    }
  }
}
</style>