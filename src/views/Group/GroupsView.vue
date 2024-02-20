<template>
  <Loading v-if="!loaded"></Loading>
  <section id="categories" @keydown="checkEscape" @click="closeSearch(), toggleMembersContextMenu()" v-if="loaded">
    <div class="dark-background" v-if="search"></div>
      <div class="container">
          <div class="categories">
              <span class="category-error">{{ err }}</span>
              <div class="form-container">
                <MyForm placeholderProps="Category Name" @submitForm="createCategory($event)"/>
                <ShowMembersBtn v-if="mobile && !showMembers" @click="toggleShowMembers"></ShowMembersBtn>
                <CloseWithGradient v-if="mobile && showMembers" @click="toggleShowMembers"></CloseWithGradient>
              </div>
              <div class="categories-container" v-if="!showMembers">
                <Category v-for="category in categories" :key="category.ID" 
                 :categoryProps="category"
                 :groupIDProps="groupID"
                 @editCategory="updateCategoryName($event)"
                 @deleteCategory="removeCategory($event)"></Category>
              </div>
          </div>
          <div class="members" v-if="!mobile">
            <RouterLink to="/groups" class="return">voltar</RouterLink>
            <div class="members-container">
              <span class="error">{{errMemberActions}}</span>
              <button class="btn-special" @click.stop="search = !search">Add user to group</button>
                <Member v-for="member in members" :key="member.ID" 
                
                :memberProps="member" :groupProps="group"
                :ContextMenuAdminProps="iamAdmin" :ContextMenuOwnerProps="iamLeader" :ContextMenuMemberProps="iamMember"
                :toggleContextMenuProps="membersContextMenu"
  
                @closeOthersContextMenu="setMembersContextMenuProps"
                @kickMember="kickMember($event)"
                @giveAdmin="giveAdmin($event)"
                @removeAdmin="removeAdmin($event)"
                ></Member>
            </div>
            </div>
          <div class="members-mobile" v-if="mobile && showMembers">
            <span class="error">{{errMemberActions}}</span>
            <button class="btn-special" @click.stop="search = !search">Add user to group</button>
              <Member v-for="member in members" :key="member.ID" 
              
              :memberProps="member" :groupProps="group"
              :ContextMenuAdminProps="iamAdmin" :ContextMenuOwnerProps="iamLeader" :ContextMenuMemberProps="iamMember"
              :toggleContextMenuProps="membersContextMenu"

              @closeOthersContextMenu="setMembersContextMenuProps"
              @kickMember="kickMember($event)"
              @giveAdmin="giveAdmin($event)"
              @removeAdmin="removeAdmin($event)"
              ></Member>
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
import ShowMembersBtn from '@/components/ShowMembersBtn.vue'
import CloseWithGradient from '@/components/CloseWithGradient.vue'
export default {
  components: { MyForm, Category, Member, Users, SearchIcon, Close, LoadingMicro, Loading, ShowMembersBtn, CloseWithGradient },
  created() {
    this.setResponsive()
  },
  head(){
        return {
            title: this.group.GroupName,
            meta: [
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                {name: 'robots', content: 'noindex'}
            ], 
        }
    },
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
    iamLeader(){
      return this.leader === this.user.ID
    },
    iamAdmin(){
      return this.group.Admins.find(members => members.id === this.user.id)
    },
    iamMember(){
      return !this.iamLeader && !this.iamAdmin
    }
  },
  watch: {
    '$screen.width'(value){
     this.setResponsive(value)
     if(value > 500) this.showMembers = false
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
        url: 'https://33bits.tech/goldentimes/',
        usersInvited: [],
        err: '',
        loaded: false,
        searching: false,
        mobile: false,
        showMembers: false,
        membersContextMenu: 0,
        errMemberActions: '',

    }
  },
  methods: {
      ...mapActions({getGroup: 'getGroup', getCategories: 'getCategories', 
        saveCategory: 'createCategory', deleteCategory: 'deleteCategory',
        editCategory: 'editCategory', sendUserInvite: 'sendUserInvite',
        removeMember: 'kickMember', addAdmin: 'giveMemberAdmin', 
        removeMemberAdmin: 'removeMemberAdmin'
        }),
      ...mapMutations({SET_GROUPS: 'SET_GROUPS'}),

      setResponsive(value = this.$screen.width){

        if(value <= 500) return this.mobile = true
        this.mobile = false
      },
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
      toggleShowMembers() {
        this.showMembers = !this.showMembers
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
      closeSearch(){
        this.search = false
      },
      toggleMembersContextMenu(){
        this.membersContextMenu = "0"
      },
      setMembersContextMenuProps($event){
        console.log('vou setar o contextMenu', $event)
        this.membersContextMenu = $event
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
      },
      async kickMember($event){
        const payload = {memberID: $event, groupID: this.groupID}
        try {
          const group = await this.removeMember(payload)
          this.group = group
        } catch (error) {
          this.errMemberActions = error.err
        }
      },
      async giveAdmin($event){
        const payload = {memberID: $event, groupID: this.groupID}
        try {
          const Admins = await this.addAdmin(payload)
          console.log('vou adicionar o admin', Admins)
          this.group.Admins = Admins
        } catch (error) {
          this.errMemberActions = error.err
        }
      },
      async removeAdmin($event){
        const payload = {memberID: $event, groupID: this.groupID}
        try {
          const Admins = await this.removeMemberAdmin(payload)
          this.group.Admins = Admins
        } catch (error) {
          this.errMemberActions = error.err
        }
      },
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
      height: calc(100vh - 4%);
    }
    .categories {
      width: 90%;
      max-width: 600px;
      flex-direction: column;
      display: flex;
      height: 91%;
      gap: 10px;
      flex: 1.3;
      padding: 0px 8px;
      .form-container {
        display: flex;
        align-items: center;
      }
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
      flex: 0.7;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 22px;

      .return {
        @include specialBtn(4px, 50px, 1rem);
        text-transform: uppercase;
        cursor: pointer;
        max-height: 29px;
        text-decoration: none;
        transform: translateX(calc(16vw - 138px));
        padding-top: 6px;
    }
      .members-container {
        display: flex;
        height: fit-content;
        min-height: 200px;
        max-height: 90vh;
        padding: 5px 14px 10px;
        width: 100%;
        max-width: 400px;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        flex-shrink: 0;
        border-radius: 20px;
        background: #0E0E0D;
        margin: 1.735rem 0px;
        .btn-special {
          max-height: 55px;
          width: 100%;
          margin-bottom: 3px;
          cursor: pointer;
          @include specialBtn(3px, 3px, 1.4rem)
        }
      }

    }
    .members-mobile {
      display: flex;
      height: fit-content;
      min-height: 200px;
      max-height: 90vh;
      padding: 14px;
      width: 99%;
      max-width: 400px;
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
      border-radius: 20px;
      background: #0E0E0D;
      margin: 3.938rem auto 0px auto;
      position: absolute;
      top: 10%;
      left: 50%;
      transform: translate(-50%, -10%);
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
    padding: 5px 8px;
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
      padding: 13px 13px;
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
        padding: 13px 25px 10px 10px;
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
        transform: translate(calc((7px - 3.150rem) - 5px), -50%);        
        cursor: pointer;
      }
      .close {
        position: relative;
        cursor:  pointer;
      }
    }
  }
}
@media screen and (max-width: 860px) {
        #categories {
          padding-top: 1%;
        }
        .return {
          transform: translateX(calc(16vw - 100px)) !important;

        }
    }
</style>