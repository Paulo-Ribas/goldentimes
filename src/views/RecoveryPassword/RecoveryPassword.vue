<template>
    <div class="container">
        <section id="recovery">
            <div class="recovery-container">
                <LoginSignError :errProps="err" v-if="err!== '' "></LoginSignError>
                <form @submit.prevent="submit">
                    <h1>goldentimes</h1>
                    <div class="inputs">
                        <div class="name-email">
                            <label for="email">Email</label>
                            <div class="input-container">
                                <EmailIcon></EmailIcon>
                                <input v-model="email" id="email" required name="email" type="email" placeholder="meuemail@email.com">
                            </div>
                        </div>
                        <Bar></Bar>
                        <div class="passwords">
                            <label for="password">Senha</label>
                            <div class="input-container">
                                <PassIcon></PassIcon>
                                <input v-model="password" id="password" required name="password" type="password" placeholder="******************">
                            </div>
                            <label for="confirmPassword">Confirmar Senha</label>
                            <div class="input-container">
                                <PassIcon></PassIcon>
                                <input v-model="confirmPassword" id="confirmPassword" name="confirmPassword" type="password" placeholder="insira novamente sua senha">
                            </div>
                            <Bar></Bar>
                        </div>
                    </div> <!--fim .inputs-->
                    <input type="submit" @click.prevent="submit" value="Confirm">
                </form>
            </div>
        </section>
    </div>
</template>

<script>
import LoginSignError from '@/components/LoginSignError.vue';
import Bar from '@/components/svgs/Bar'
import EmailIcon from '@/components/svgs/EmailIcon.vue';
import PassIcon from '@/components/svgs/PassIcon.vue';
import { mapActions } from 'vuex';
export default {
    components: { Bar, EmailIcon, PassIcon, LoginSignError },
    head(){
        return {
            title: 'RecoveryPassword',
            meta: [
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                {name: 'robots', content: 'noindex'}
            ], 
        }
    },
    data(){
        return {
            email: '',
            password: '',
            err: '',
            confirmPassword: '',
            token: this.$route.params.token

        }
    },
    methods: {
        ...mapActions({editPasswordByToken:'editPasswordByToken'}),
        async submit(){
            if(this.confirmPassword !== this.password) return this.err = 'as senhas não coincidem'
            try {
                await this.editPasswordByToken({email: this.email, password: this.password, token: this.token})
                this.$router.push('/login')
                
            } catch (error) {
                this.err = error.err
            }
        }
    }

}
</script>

<style scoped lang="scss">

  @import '@/assets/scss/variables.scss';
  @import '@/assets//scss/buttonsAndInputs.scss';

    h1{
        font-family: $main-font;
        font-size: 3.68138rem;
        font-style: normal;
        font-weight: bold;
        line-height: normal;
        letter-spacing: -0.2945rem;
        text-transform: uppercase;
        background: $default-gradient;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        -webkit-background-clip: text;
        -webkit-text-stroke:   1px transparent;
    }
    #recovery {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .recovery-container{
            display: flex;
            width: 99%;
            height: 99%;
            max-width: 413px;
            max-height: 467px;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: $default-gradient;
            border-radius: 40px;
            box-shadow: 8px 8px 8px 0px rgba(0, 0, 0, 0.70);
            position: relative;
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
                    margin-top: 30px;
                    text-transform: uppercase;
                }
            }
        }
    }



</style>