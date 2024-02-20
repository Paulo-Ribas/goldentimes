<template>
  <div class="profile">
    <div class="sign-out">
        <button @click="logout">Sair</button>
        <BellWhite v-if="!notification" @click="emitBell"/>
        <BellGold @click="emitBell" v-else/>
    </div>
    <span class="error">{{err}}</span>
    <div class="profile-img-container">
        <img :src="imgSrc" alt="imagem do perfil do usuario">
    </div>
    <div class="name-description-container">
        <h2 class="name">
            <span>{{user.name}}</span></h2>
        <p class="description">{{user.description}}</p>
    </div>
        <button class="edit-btn" @click="emitEdit">edit profile</button>
   </div>
</template>

<script>
import BellWhite from './svgs/BellWhite.vue';
import BellGold from './svgs/BellGold.vue';
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
            notification: this.notificationProps

        }
    },
    computed: {
        imgSrc: {
            get() {
                if (this.user.profileImg == 'default.png')
                    return require('../assets/imgs/default.png');
                return this.user.profileImg;
            },
        },
    },
    components: {BellWhite, BellGold},
    methods: {
        logout(){
            this.$emit('logout')
        },
        emitBell(){
            this.$emit('bellClicked')
        },
        emitEdit(){
            this.$emit('emitEdit')
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
                    max-width: 99%;
                    height: 35px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    span {
                        text-overflow: ellipsis;
                        overflow: hidden;
                        width: 100%;
                        text-align: center;
                    }
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
                    white-space: pre-wrap;
                    text-wrap: wrap;
                    padding: 0px 3px;
                    



                }
            }
            .edit-btn {
                @include edit-btn
            }
        }
        @media screen and (max-width: 860px) {
            .profile-img-container  {
                width: 58% !important;
            }
          }

        @media screen and (max-height: 580px) {
            .profile-img-container {
                width: 70%  !important;
                height: 50% !important;
                max-width: 169px !important;
                min-width: 110px;
                min-height: 110px;
                overflow: hidden;
                border-radius: 50%;
                background-image: $default-gradient;
                max-width: 235px;
                max-height: 235px;
                position: relative;
                margin: 0px auto;
            }
            
        }

</style>