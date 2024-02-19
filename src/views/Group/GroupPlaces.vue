<template>
    <h1 v-if="loaded">{{groupName}}</h1>
    <Loading v-if="!loaded"></Loading>
    <div class="container" v-if="loaded">
         <aside>
             <div class="profile-container">
                 <div class="profile">
                     <div class="sign-out">
                         <button @click="back">Return</button>
                     </div>
                     <div class="profile-img-container">
                         <img :src="imgSrc" alt="imagem do perfil do usuario">
                     </div>
                     <div class="name-description-container">
                         <h2 class="name">{{user.name}}</h2>
                         <p class="description">{{user.description}}</p>
                     </div>
                     <button class="edit-btn" @click="backToProfile">Back To Profile</button>
                 </div>
             </div>
             <div class="groups-container">
                 <DefaultButton btnNameProps="Create Group" hrefProps="/groups/create" v-if="!Groups"></DefaultButton>
                 <DefaultButton v-else btnNameProps="My Groups" hrefProps="/groups"></DefaultButton>

             </div>
         </aside>
         <main>
             <nav>
                 <RouterLink :to="`/group/searchplaces/${groupID}/category/${categoryID}`" @click="setActivated('group-search')" :class="{activated:search}"> <span v-if="search"></span>
                     Search Places
                 </RouterLink>
                 <RouterLink :to="`/group/savedplaces/${groupID}/category/${categoryID}`" @click="setActivated('group-saved')" :class="{activated:saved}"> <span v-if="saved"></span> 
                     Saved Places
                 </RouterLink>
                 <RouterLink :to="`/group/blacklist/${groupID}/category/${categoryID}`" @click="setActivated('group-black')" :class="{activated:black}"> <span v-if="black"></span> 
                     Group Black List
                 </RouterLink>
             </nav>
             <RouterView>
             </RouterView>
         </main>
     </div>
 </template>
 
 <script>
 import { RouterLink } from 'vue-router';
 import { mapActions, mapMutations, mapState } from 'vuex';
 import DefaultButton from '@/components/DefaultButton.vue';
import Loading from '@/components/Loading.vue';
 export default {
    head(){
        return {
            title: this.groupName,
            meta: [
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                {name: 'robots', content: 'noindex'}
            ], 
        }
    },
     async beforeMount(){
         this.setActivated(this.$route.name)
         try {
            let {GroupName} = await this.getGroup(this.groupID)
            this.groupName = GroupName
            if(!this.Groups) {
                await this.setGroups()
                this.loaded = true
            }
            this.loaded = true
         } catch (error) {
            this.err = error.err
            this.loaded = true
         }
        
     },
     name: "UserProfile",
     computed: {
         ...mapState({ user: state => state.user, userGroups: state => state.groups.Groups}),
         imgSrc: {
             get() {
                 if (this.user.profileImg == 'default.png')
                     return require('../../assets/imgs/default.png');
                 return this.user.profileImg;
             },
         },
         Groups(){
            return this.userGroups.length !== 0
        },
     },
     data(){
         return {
             search: false,
             saved: false,
             black: false,
             groupID: this.$route.params.groupID,
             categoryID: this.$route.params.categoryID,
             groupName: '',
             loaded: false,
         }
     },
     components: { RouterLink, DefaultButton, Loading },
     methods: {
        ...mapMutations({SET_GROUPS:'SET_GROUP_STATE'}),
        ...mapActions({getGroup: 'getGroup', getGroups: 'getGroups'}),
         setActivated(picked){
             switch (picked) {
                 case 'group-search':
                     this.search = true
                     this.saved = false
                     this.black = false
                     break;
                 case 'group-saved':
                     this.search = false
                     this.saved = true
                     this.black = false
                 break;
                 case 'group-black':
                     this.search = false
                     this.saved = false
                     this.black = true
                 break;
             }
         },
         back(){
            this.$router.push(`/group/${this.groupID}`)
         },
         backToProfile() {
            this.$router.push('/profile')
         },
         async setGroups(){
            try {
                let groups = await this.getGroups(this.user.id)
                this.SET_GROUPS(groups)
            } catch (error) {
                this.err = error.err
            }
        },
     }
 }
 </script>
 
 <style lang="scss" scoped>
 @import '../../assets/scss/variables.scss';
 @import '../../assets/scss/imageCenter.scss';
 
 h1{
     color: #FFF;
     text-shadow: 2px 1px 4px rgba(0, 0, 0, 0.90), 2px 1px 4px rgba(0, 0, 0, 0.90);
     text-align: center;
     font-family: $main-font;
     text-transform: uppercase;
     font-size: 1.6rem;
     font-style: normal;
     font-weight: 700;
     line-height: normal;
     padding: 8px 0px;
     background: $default-gradient;
 }
 .container {
     display: flex;
     gap: 8%;
 }
 aside {
     flex: 1;
     max-width: 333px;
     height: 100%;
     .profile-container {
         width: 100%;
         height: 70%;
         border-image: $default-gradient;
         border-image-slice: 1;
         border-width: 4px;
         border-style: solid;
         max-height: 470px;
         margin-top: 20px;
         .profile {
             width: 100%;
             height: 100%;
             display: flex;
             flex-direction: column;
             padding: 5px 0px 30px 0px;
             .sign-out {
                 width: 100%;
                 padding: 5px;
                 button{
                     border: 0.796px solid #F5CB86;
                     border-radius: 31.853px;
                     background: linear-gradient(180deg, #F5CB86 0%, #7E5936 100%);
                     text-shadow: 1.593px 0.796px 3.185px rgba(0, 0, 0, 0.90);
                     color: $text-color;
                     font-family:  $main-font;
                     font-size: 0.9rem;
                     font-style: normal;
                     font-weight: 700;
                     line-height: normal;
                     text-transform: uppercase;
                     padding: 1px 13px;
                     transition: 0.4s;
                     cursor: pointer;
                     &:hover {
                         background: linear-gradient(260deg, #F5CB86 0%, #7E5936 100%);
                     }
                 }
             }
             .profile-img-container {
                 width: 100%;
                 height: 100%;
                 overflow: hidden;
                 border-radius: 50%;
                 background-image: $default-gradient;
                 max-width: 235px;
                 max-height: 235px;
                 position: relative;
                 margin: 0px auto;
                 img {
                     @include centerImage(cover, center);
                     width: calc(100% - 6px) !important;
                     height: calc(100% - 6px) !important;
                     border-radius: 50%;
 
                 }
             }
             .name-description-container {
                 display: flex;
                 width: 100%;
                 max-width: 100%;
                 overflow: hidden;
                 height: 100%;
                 max-height: 120px;
                 margin-top: 5px;
                 flex-direction: column;
                 align-items: center;
                 gap: 9px;
                 flex-shrink: 0;
                 .name {
                     color: $text-color;
                     font-family: $main-font;
                     font-size: 1.5rem;
                     overflow: hidden;
                     max-width: 99%;
                     text-overflow: ellipsis;
                     height: 35px;
                     display: flex;
                     justify-content: center;
                     align-items: center;
                 }
                 .description {
                     color: $text-color;
                     font-family: $main-font;
                     font-size: 1rem;
                     width: 100%;
                     max-height: calc(100% - 45px);
                     overflow: hidden;
                     text-overflow: ellipsis;
                     text-align: center;
                     white-space: break-spaces;
                     text-wrap: wrap;
                     padding: 0px 3px;
 
 
                 }
             }
             .edit-btn {
                 border-radius: 40px;
                 border: 1px solid #F5CB86;
                 background: linear-gradient(270deg, #7E5936 0%, #F5CB86 98.41%);
                 color: rgba(232, 232, 232, 0.80);
                 text-shadow: 2px 1px 4px rgba(0, 0, 0, 0.90);
                 font-size: 1.4rem;
                 font-style: normal;
                 font-weight: 700;
                 line-height: normal;
                 text-transform: uppercase;
                 padding: 3px 0px;
                 width: 90%;
                 margin: 0px auto;
                 cursor: pointer;
                 transition: 0.3s;
                 &:hover {
                     text-shadow: 2px 1px 4px rgba(0, 0, 0, 0.90), 2px 1px 4px rgba(0, 0, 0, 0.90)
                     4px 2px 6px rgba(0, 0, 0, 0.90),0px -1px 2px rgba(0, 0, 0, 0.90) ;
                     border: 1px solid #7E5936;
                     box-shadow: 0px 0px 5px 1px #F5CB86;
 
                 }
             }
         }
     }
 }
 main {
     margin-top: 20px;
     flex: 1;
     height: 100vh;
     display: flex;
     flex-direction: column;
     align-items: center;
 
     nav {
         width: 99%;
         max-width: 560px;
         border-radius: 40px;
         background: #0E0E0D;
         display: flex;
         justify-content: space-evenly;
         align-items: center;
         min-height: 49px;
 
         a {
             color: $text-color;
             text-decoration: none;
             &:hover {
                 color: #F5CB86;
             }
             display: inline-block;
             position: relative;
 
             span {
                 width: 100%;
                 background-color: #F5CB86;
                 height: 1px;
                 position: absolute;
                 bottom: 0;
                 transform: translateY(-100%)
             }
         }
 
     }
 
 }
 .activated {
     color: #F5CB86;
 }
 @media screen and (max-width: 860px) {
    .container {
      flex-direction: column;
      align-items: center;
      gap: 0%;
      height: 200vh;
    }
    aside {
    width: 99%;
    max-width: 333px;
    height: 45%;
    flex: unset;
    .profile-container {
        width: 100%;
        height: calc(100% - 75px);
        border-image: $default-gradient;
        border-image-slice: 1;
        border-width: 4px;
        border-style: solid;
        max-height: 470px;
        margin-top: 20px;
    }
    .groups-container {
        width: 100%;
        display: flex;
    }
}
main {
    margin-top: 20px;
    flex: unset;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;

    nav {
        width: 99%;
        max-width: 560px;
        border-radius: 40px;
        background: #0E0E0D;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        min-height: 49px;

        a {
            color: $text-color;
            text-decoration: none;
            &:hover {
                color: #F5CB86;
            }
            display: inline-block;
            position: relative;

            span {
                width: 100%;
                background-color: #F5CB86;
                height: 1px;
                position: absolute;
                bottom: 0;
                transform: translateY(-100%)
            }
        }

    }

}
}
 </style>