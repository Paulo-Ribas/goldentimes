<template>
    <form class="profile" @submit.prevent="editProfile">
      <div class="sign-out">
          <ReturnIcon @click="backToProfileDefault"></ReturnIcon>
      </div>
      <span class="profile-error">{{err}}</span>
      <div class="container-profile-icon-img">
          <div class="profile-img-container">
              <img :src="imgSrc" alt="imagem do perfil do usuario">
              <LoadingMicro v-if="saving"></LoadingMicro>
            </div>
            <PlusIconVue @click="clickInput"></PlusIconVue>
            <input id="file" type="file" @change="changeImg" accept="image/*">
      </div>
      <div class="name-description-container">
        <input class="name" v-model="newName">
        <textarea class="description" v-model="newDescription"> </textarea>
    </div>
          <button class="edit-btn" v-if="!editing" @click="backToProfileDefault">redefinir</button>
          <button type="submit" class="edit-btn">save</button>
</form>
  </template>
  
  <script>
import { mapActions, mapMutations } from 'vuex';
import LoadingMicro from './LoadingMicro.vue';
  import ReturnIcon from './svgs/ReturnIcon.vue'
  import PlusIconVue from './svgs/SuperPlus.vue';
  export default {
      props: {
          userProps: Object,
          notificationProps: Boolean
      },
      watch: {
          notificationProps(value){
              this.notification = value
          }
      },
      data(){
          return {
              user: this.userProps,
              notification: this.notificationProps,
              newName: this.userProps.name,
              editing: true,
              newDescription: this.userProps.description,
              err: '',
              firstImg: this.userProps.profileImg,
              saving: false,
              imgChoiced: undefined,
  
          }
      },
      computed: {
          imgSrc: {
              get() {
                  if (this.user.profileImg == 'default.png')
                      return require('../assets/imgs/default.png');
                  return this.user.profileImg;
              },
              set(value){
                this.user.profileImg = value
              }
          },
      },
      components: { ReturnIcon, PlusIconVue, LoadingMicro},
      methods: {
        ...mapActions({editUserName: 'editUserName', editImgProfile: 'editImgProfile',
        editUserDescription: 'editUserDescription', validateUser: 'validateUser'
        }),
        ...mapMutations({SET_TOKEN: 'SET_TOKEN'}),
          logout(){
              this.$emit('logout')
          },
          emitBell(){
              this.$emit('bellClicked')
          },
          async editProfile(){
            let token = undefined
            this.saving = true
            try {
                if(this.user.name !== this.newName){
                    token = await this.editUserName({name: this.newName})
                } 

                if(this.imgSrc !== this.firstImg && this.imgChoiced){
                    token = await this.editImgProfile(this.imgChoiced)
                } 

                if(this.user.description !== this.newDescription) {
                    token = await this.editUserDescription({description: this.newDescription})
                }
                if(!token) return
                this.SET_TOKEN({token: token})
                setTimeout(async () =>{ 
                    try {
                        console.log('vou validar', token)
                        await this.validateUser('Bearer ' + token)
                        this.backToProfileDefault()

                    } catch (error) {
                        this.saving = false
                        this.err = error.err
                    }
                }, 33);

            } catch (error) {
                this.err = error.err
                this.saving = false
                if(token) {
                    this.SET_TOKEN({token})
                    setTimeout(() => this.validateUser('Bearer ', token), 33);
                }   
            }
          },
          clickInput(){
            document.getElementById('file').click()
          },
          changeImg(){
            let file = document.getElementById('file').files[0], form
            if(!file) return

            let urlblob = URL.createObjectURL(file)
            this.imgSrc = urlblob
            form = new FormData
            form.append('profileimg', file)
            this.imgChoiced = form
          },
          backToProfileDefault(){
            this.$emit('closeEdit')
          }
      }
  
  }
  </script>
  
  <style lang="scss" scoped>
  @import '../assets/scss/variables.scss';
  @import '../assets/scss/imageCenter.scss';
  @import '../assets/scss/buttonsAndInputs.scss';
  
          .profile {
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              padding: 5px 0px 30px 0px;
              .sign-out {
                  width: 100%;
                  padding: 6px;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
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
                  svg {
                      cursor: pointer;
                  }
              }
              .container-profile-icon-img{
                  width: 100%;
                  height: 100%;
                  border-radius: 50%;
                  background-image: $default-gradient;
                  max-width: 235px;
                  max-height: 235px;
                  position: relative;
                  margin: 0px auto;
                  svg {
                    right: 0;
                    bottom: 0;
                    position: absolute;
                    transform: translate(-25%, -25%);
                    cursor: pointer;
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
                  #file {
                    opacity: 0;
                    width: 0;
                    height: 0;
                    position: absolute;
                    z-index: -4;
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
                  padding: 0px 16px;
                  gap: 9px;
                  flex-shrink: 0;
                  .name {
                      color: $text-color;
                      font-family: $main-font;
                      border-radius: 20px;
                      background-color: #191918;
                      font-size: 1.3rem;
                      padding: 6px 10px;
                      overflow: hidden;
                      width: 100%;
                      height: 35px;
                      display: flex;
                      border: none;
                      outline: none;
                      justify-content: center;
                      align-items: center;
                  }
                  .description {
                      color: $text-color;
                      font-family: $main-font;
                      font-size: 1rem;
                      border-radius: 20px;
                      padding: 15px 10px;
                      background-color: #191918;
                      width: 100%;
                      max-height: calc(100% - 45px);
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: break-spaces;
                      text-wrap: wrap;  
                      outline: none;
                      border: none;
                      resize: none;
                      overflow-y: auto;
  
                  }
              }
              .edit-btn {
                  @include edit-btn
              }
          }
  
  </style>