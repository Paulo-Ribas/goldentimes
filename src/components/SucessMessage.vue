<template>
    <div class="sucess">
        <div class="text-container">
            <span class="text">
                {{sucess}}
            </span>
        </div>

    </div>
</template>

<script>
export default {
    props: {
        sucessProps: String,
    },
    watch: {
        sucessProps(value){
            this.sucess = value
        }
    },
    data(){
        return {
            sucess: this.sucessProps
        }
    }
}
</script>

<style scoped lang="scss">
    @import '@/assets/scss/variables.scss';
    .sucess {
        background: linear-gradient(180deg, #F5CB86 0%, #7E5936 100%);
        width: 85%;
        padding: 2px;
        border-radius: 60px;
        position: absolute;
        top: 0;
        transform: translateY(calc(-100% - 20px));
        .text-container {
            width: 100%;
            padding: 10px 0px;
            text-align: center;
            background: #191918;
            border-radius: 60px;
            span {
                background: linear-gradient(180deg, #F5CB86 33%, #7E5936 100%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                font-size: 1.1rem;
                -webkit-text-stroke:   1px transparent;
                letter-spacing: 1px;
                font-family: $main-font;
                
            }
        }
        
    }

</style>