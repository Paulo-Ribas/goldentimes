<template>
     <Loanding v-if="!loaded"></Loanding>
    <div class="container" v-if="loaded">
         <main>
            <span class="error">{{ err }}</span>
             <div class="profile-container">
                 <ProfilePublic  :userProps="user"
                  @Return="returnToPage" 
                  />
             </div>
         </main>
     </div>
 </template>
 
 <script>
 import {  mapActions } from 'vuex';
 import Loanding from '@/components/Loading.vue';
import ProfilePublic from '@/components/ProfilePublic.vue';
 export default {
     async beforeMount(){
         try {
             this.user = await this.getUser(this.$route.params.userId)
             //console.log(this.user, 'o user')
             this.loaded = true
         } catch (error) {
             //console.log(error, 'o erro do catch')
             this.err = error.err.err || error.message
             this.$router.push({name: 'PageError', params: {error: this.err}})
         }
 
     },
     name: "publicProfile",
     data(){
         return {
             user: undefined,
             loaded: false,
             err: '',
         }
     },
     components: { Loanding, ProfilePublic },
     methods: {
        ...mapActions({getUser: 'getUser'}),
        returnToPage(){
            if(!this.$router.options.history.state.back) return this.$router.push('/profile/searchplaces')
            this.$router.back()
        },
     }
 }
 </script>
 
 <style lang="scss" scoped>
 @import '@/assets/scss/variables.scss';
 @import '@/assets/scss/imageCenter.scss';
 
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
     justify-content: center;
 }
 main  {
     flex: 1;
     max-width: 450px;
     height: 100%;
     display: flex;
     justify-content: center;
     align-items: center;
     .profile-container {
         width: 99%;
         height: 99%;
         border-image: $default-gradient;
         border-image-slice: 1;
         border-width: 4px;
         border-style: solid;
         max-height: 530px;
         margin-top: 20px;
     }
     .groups-container {
         width: 100%;
         display: flex;
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
     main {
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
 
 }
 
 </style>