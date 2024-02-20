<template>
    <div class="body">
        <div class="container">
            <Header></Header>
            <main>
                <h1>welcome to <br>
                    <span class="gold">golden times!</span>
                </h1>
                <h3>como funciona?</h3>
                <div class="slide-container" @mousedown="setAnimation(), setIsDragging($event)" @mouseup="stopDragging(), removeAnimation()" @mouseleave="stopDragging(), removeAnimation()"
                 @touchstart="setAnimation(), setIsDragging($event)" @touchmove="startDragging($event)" @mousemove="startDragging($event)" @touchend="stopDragging(), removeAnimation()">
                    <div :class="{grabbing, setTransition}" id="slide">
                        <ApresentationCard v-for="(card, index) in cardsArray" :key="index" :htmlProps="card.text" :sizeAnimationProps="animation" ></ApresentationCard>
                    </div>
                </div>
                <div class="advantages">
                    <h2>Vantagens</h2>
                    <div class="extra-info-container">
                        <ExtraInfo v-for="(info, index) in infosArray" :key="index" :textProps="info.text"></ExtraInfo>
                    </div>
                </div>
                <div class="join">
                    <div class="join-container">
                        <h2>Faça o login ou registre-se <br> para <span class="gold">começar sua pesquisa</span></h2>
                        <div class="register">
                        <RouterLink to="/sign-up" class="links">Register</RouterLink>
                           
                            <div class="or-container">
                                <div class="white-line"></div>
                                    <span class="or">or</span>
                                <div class="white-line"></div>
                            </div>

                            <RouterLink to="/login" class="links"> Login</RouterLink>
                        </div> <!--fim do register-->
                    </div><!--fim do join-container-->
                </div><!--fim do join-->
            </main>
        </div>
        <footer>
            <span> Todos direitos reservados ®Golden Times • 2024 </span>
        </footer>
    </div>
</template>

<script>
import ApresentationCard from '@/components/ApresentationCard.vue';
import ExtraInfo from '@/components/ExtraInfo.vue';
import Header from '@/components/Header.vue';

export default {
    components: { Header, ApresentationCard, ExtraInfo },
    name: 'Home-',
    data(){
        return {
            animation: false,
            grabbing: false,
            isDragging: false,
            mousePositionStart: 0,
            prevTranslate: 0,
            currentTranslate: 0,
            cardsArray: [{
                text: `<p>Utilize a ferramenta para obter<br> informações de contato,como <br> endereço,telefone e website.</p>
                <p>Entre em contato diretamente <br> com os locais para  fazer <br> reservas ou obter mais <br> informações.</p>`
            }, {
                text: `<p>Utilize a pesquisa avançada<br> com filtros para encontrar<br> locais específicos, como<br> "lanchonetes em Santa <br> Catarina".</p><p> A Busca <br> garante resultados precisos e atualizados.</p>`
            }, {
                text: `<p>Convide seus amigos e <br> familiares para participar de <br> grupos e compartilhar seus <br> lugares favoritos.</p> <p>Colaborem juntos para <br>encontrar os melhores lugares <br> para visitar.</p>`
            }, {
                text: `<p>Salve os lugares que você <br> encontrar para acessá-los <br> facilmente mais tarde.</p><p>Crie grupos personalizados <br>  para organizar seus lugares <br> por categorias, como <br> "restaurantes", "bares" ou <br> "pontos turísticos".</p>`
            }, {
                text: `<p>Utilize a ferramenta para <br> encontrar negócios locais que <br> precisem de seus serviços.</p><p>Entre em contato com os  <br> negócios e apresente seu <br> portfólio.</p>`
            }],
            setTransition: false,
            infosArray: [
                {text: 'Oferecer seus serviços de web<br> design e designer web para <br> negócios locais.'},
                {text: 'Encontrar os melhores lugares <br> para visitar, comer e se <br> divertir.'},
                {text: 'Economizar tempo e esforço na <br> sua busca por lugares e <br> informações.'},
                {text: 'Organizar seus lugares <br> favoritos de forma prática e <br> eficiente.'},
                {text: 'Compartilhar seus lugares <br> favoritos com seus amigos e <br> familiares.'},
            ]

        }
    },
    methods: {
        setAnimation(){
            this.animation = true
            this.grabbing = true
        },
        removeAnimation(){
            this.animation = false,
            this.grabbing = false
        },
        setIsDragging($event){
            if(this.isDragging) return
            this.isDragging = true
            this.setTransition = false
            this.mousePositionStart = $event.pageX || $event.touches[0].pageX
        },
        startDragging($event){
            if(!this.isDragging) return
            let currentMousePosition =  $event.pageX || $event.touches[0].pageX
            this.currentTranslate = this.prevTranslate + currentMousePosition - this.mousePositionStart

            this.setTranslate(this.currentTranslate)
 
        },
        setTranslate(translate){
            const slide = document.getElementById('slide')
            slide.style.transform = `translateX(${translate}px)`
        },
        stopDragging(){
            this.setTransition = true
            if(!this.isDragging) return
            this.isDragging = false
            let newTranslate = this.verifyTranslate(this.currentTranslate)
            this.currentTranslate = newTranslate
            this.prevTranslate = this.currentTranslate

        },
        verifyTranslate(translate){
            let leftCheckTranslate = this.verifyLeftSide(translate)
            if(leftCheckTranslate === 0) {
                this.setTranslate(leftCheckTranslate)
                return leftCheckTranslate
            }
            let rightCheckTranslate = this.verifyRightSide(translate)
            this.setTranslate(rightCheckTranslate)
            return rightCheckTranslate

        },
        verifyLeftSide(translate){
            const slide = document.getElementById('slide')
            let left = slide.getBoundingClientRect().left
            if(left > 0) translate = 0 
            return translate
        },
        verifyRightSide(translate){
            const slide = document.getElementById('slide'),
            container = document.querySelector('.slide-container')

            let amount = this.cardsArray.length,
            slideWidth = slide.getBoundingClientRect().width,
            containerWidth = container.getBoundingClientRect().width,
            translatePositive = Math.abs(translate)
            
            if(translatePositive >= (slideWidth - containerWidth)  + (10 * amount)) {
                translate = ((slideWidth - containerWidth)  + (10 * amount))  * -1
                
            }
            return translate
        }
    }
}
</script>

<style scoped lang="scss">
@import '../assets/scss/variables.scss';

.body {
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    height: 100vh;
}

.container {
    height: fit-content;
}
main {
    width: 100%;
    padding-top: 5vh;
    h1 {
        text-align: center;
        font-size: 4.5rem;
        text-transform: uppercase;
        color: $text-color;
        margin-bottom: 125px;
    }

    h3 {
        color: $gold;
        font-size: 2rem;
        font-family: $main-font;
        text-align: center;
        text-transform: capitalize;
        margin-bottom: 40px;
    }
}

.slide-container {
    width: 99%;
    height: 70vh;
    max-height: 316px;
    margin: auto;
    overflow: hidden;

    #slide {
        display: flex;
        width: fit-content;
        height: 100%;
        justify-content: center;
        gap: 34px;
        cursor: grab;
    }
}
.grabbing {
    cursor: grabbing !important;
}
.setTransition {
    transition: .6s !important;
}
.advantages {
    margin-top: 110px;
    margin-bottom: 80px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;
    h2 {
        color: $gold;
        font-family: $main-font;
        font-size: 2.1rem;
    }
    .extra-info-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 34px;
    }
}

.join {
    width: 100%;
    padding: 90px 0px;
    margin: 100px 0px;
    .join-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 60px;
        h2 {
            color: $text-color;
            font-size: 3.8rem;
            font-family: $main-font;
        }
        .register {
            display: flex;
            flex-direction: column;
            width: 93%;
            gap: 50px;
            max-width: 510px;
            align-items: center;
            .or-container {
                display: flex;
                width: 100%;
                justify-content: center;
                align-items: center;
                .white-line {
                    height: 2px;
                    background-color: white;
                    flex: 1;
                    max-width: 400px;
                }
                .or {
                    display: flex;
                    width: 30px;
                    color: $text-color;
                    justify-content: center;
                    font-family: $main-font;

                }

            }
            
        }
    }
}

footer {
    width: 100%;
    background: linear-gradient(180deg, #F5CB86 0%, #7E5936 100%);
    height: 8vh;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 60px;
    span {
        font-weight: bold;
        font-family: $main-font;
        color: $text-color;
        
    }
}

.gold {
    color: $gold;
}

.links {
    border-radius: 40px;
    border: 1px solid #F5CB86;
    background: linear-gradient(270deg, rgba(126, 89, 54, 0.80) 1.16%, rgba(183, 143, 92, 0.80) 55.93%, rgba(245, 203, 134, 0.80) 96.59%);
    font-family: $main-font;
    text-transform: uppercase;
    font-size: 1.2rem;
    padding: 11px 0px 8px 0px;
    width: 100%;
    color: rgba(232, 232, 232, 0.80);
    text-align: center;
    text-shadow: 2px 1px 4px rgba(0, 0, 0, 0.90);
    font-weight: 700;
    text-decoration: none;
    transition: .5s;
    &:hover {
        box-shadow:  2px 1px 5px 0px $gold;
        transform: scale(1.03);
    }
}
</style>