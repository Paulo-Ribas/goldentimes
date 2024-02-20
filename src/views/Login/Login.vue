<template>
    <div class="container">
        <section id="login">
            <div class="login-container">
                <LoginSignError :errProps="err" v-if="err !== ''"></LoginSignError>
                <form @submit.prevent="submit">
                    <div class="inputs">
                        <div class="name-email">
                            <label for="email">Email</label>
                            <div class="input-container">
                                <EmailIcon></EmailIcon>
                                <input v-model="email" id="email" required name="email" type="email" placeholder="meuemail@email.com">
                            </div>
                        </div>
                        <div class="passwords">
                            <label for="password">Senha</label>
                            <div class="input-container">
                                <PassIcon></PassIcon>
                                <input v-model="password" id="password" required name="password" type="password" placeholder="******************">
                            </div>
                        </div>
                    </div> <!--fim .inputs-->
                    <div class="forgot">
                        <RouterLink to="/request-token">Forgot Password</RouterLink>
                    </div>
                    <input type="submit" @click.prevent="submit" value="Login">
                    <div class="no-account">
                        <span>Haven’t Account? <RouterLink to="sign-up">Register</RouterLink></span>
                    </div>
                </form>
            </div>
        </section>
    </div>
</template>

<script>
import LoginSignError from '@/components/LoginSignError.vue';
import EmailIcon from '@/components/svgs/EmailIcon.vue';
import PassIcon from '@/components/svgs/PassIcon.vue';
import { mapActions, mapMutations } from 'vuex';
export default {
    components: { EmailIcon, PassIcon, LoginSignError },
    name:'LoginPage',    
    head(){
        return {
            title: 'Login',
            meta: [
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                {name: 'robots', content: 'index'}
            ], 
        }
    },
    data(){
        return {
            email: '',
            password: '',
            err: '',

        }
    },
    methods: {
        ...mapActions({login: 'login'}),
        ...mapMutations({SET_TOKEN:'SET_TOKEN'}),
        async submit(){
            try {
                let response = await this.login({email: this.email, password: this.password})
                this.SET_TOKEN(response.data)
                this.$router.push('/profile/searchplaces')
                
            } catch (error) {
                console.log(error)
                this.err = error.err
            }
        }
    }

}
</script>

<style scoped lang="scss">

  @import '@/assets/scss/variables.scss';
  @import '@/assets//scss/buttonsAndInputs.scss';

    #login {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .login-container{
            display: flex;
            width: 96%;
            height: 96%;
            position: relative;
            max-width: 420px;
            max-height: 298px;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: $default-gradient;
            border-radius: 40px;
            box-shadow: 8px 8px 8px 0px rgba(0, 0, 0, 0.70);
            form {
                width: calc(100% - 3px);
                height: calc(100% - 3px);
                background-color: #191918;
                border-radius: 40px;
                display: flex;
                align-items: center;
                flex-direction: column;
                justify-content: center;
                .inputs {
                    margin-top: 25px;
                    display: inline-flex;
                    flex-direction: column;
                    width: 100%;
                    max-width: 430px;
                    align-items: center;
                    gap: 19px;
                    .name-email, .passwords {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        width: 85%;
                        gap: 10px;
                        .input-container {
                            @include inputsContainer;
                            svg {
                                position: absolute;
                                left: 0%;
                                top: 50%;
                                transform: translate(75%, -50%);
                                z-index: 2;
                            }
                        }
                        label {
                            position: absolute;
                            opacity: 0;
                        }
                    }

                }
                .forgot {
                    width: 85%;
                    max-width: 430px;
                    font-family: $main-font;
                    font-size: 0.9rem;
                    font-style: normal;
                    font-weight: 400;
                    line-height: normal;
                    display: flex;
                    justify-content: flex-end;
                    padding: 0px 5px;
                    margin: 12px 0px 18px 0px;
                    a{
                        color: rgba(232, 232, 232, 0.50);
                        text-decoration: none;
                        justify-self: flex-end

                    }
                }
                input[type="submit"] {
                    @include formBtn;
                    text-transform: uppercase;
                }
                .no-account {
                    display: inline-flex;
                    padding: 10px;
                    justify-content: center;
                    align-items: center;
                    gap: 10px;
                    margin-top: 15px;
                    span {
                        color: rgba(232, 232, 232, 0.50);
                        font-family: $main-font;
                        font-size: 0.9rem;
                        font-style: normal;
                        font-weight: 400;
                        line-height: normal;
                    }
                    a {
                        color: #F5CB86;
                        font-family: $main-font;
                        font-size: 0.9rem;
                        font-style: normal;
                        font-weight: 400;
                        line-height: normal;
                    }
                }
            }
        }
    }



</style>