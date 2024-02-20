<template>
    <div class="container">
        <section id="token-form">
            <div class="token-form-container">
                <LoginSignError :errProps="err" v-if="err!== '' && !sucess"></LoginSignError>
                <SucessMessage :sucessProps="message" v-if="sucess"></SucessMessage>
                <div class="shadow" v-if="sending" ></div>
                <LoadingSmall v-if="sending"></LoadingSmall>
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
                    </div> <!--fim .inputs-->
                    <input type="submit" @click.prevent="submit" value="Send Email">
                </form>
            </div>
        </section>
    </div>
</template>

<script>
    import Bar from '@/components/svgs/Bar.vue'
    import LoginSignError from '@/components/LoginSignError.vue'
    import EmailIcon from '@/components/svgs/EmailIcon.vue'
    import {mapActions} from 'vuex'
    import LoadingSmall from '@/components/LoadingSmall.vue'
import SucessMessage from '@/components/SucessMessage.vue'
    
export default {
    components: {Bar, LoginSignError, EmailIcon, LoadingSmall, SucessMessage},
    head(){
        return {
            title: 'Request Token',
            meta: [
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                {name: 'robots', content: 'noindex'}
            ], 
        }
    },
    data(){
        return {
            email: '',
            err: '',
            sucess: false,
            sending: false,
            message: 'email enviado com sucesso, cheque em alguns instantes'
        }
    },
    methods: {
        ...mapActions({recoveryPass:'recoveryPassword'}),
        async submit(){
            if(this.email === '' || this.email === ' ') return this.err = 'digite o email'
            if(this.sucess) throw {err: 'email já foi enviado'}
            try {
                this.sending = true
                await this.recoveryPass(this.email)
                this.err = ''
                this.sucess = true
                this.sending = false
            } catch (error) {
                this.sucess = false
                this.sending = false
                this.err = error.err
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';
  @import '@/assets//scss/buttonsAndInputs.scss';
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .shadow {
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: #191918;
    opacity: 0.7;
    z-index: 3;
  }
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
        width: 100%;
        text-align: center;
    }
    #token-form {
        width: 96%;
        height: 96%;
        max-height: 293px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        .token-form-container{
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
                gap: 23px;
                .inputs {
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
                input[type="submit"] {
                    @include formBtn;
                    text-transform: uppercase;
                }
            }
        }
    }



</style>