<template>
  <div :class="{card: true, sizeAnimation}">
    <div class="text-container " v-html="html">
    </div>
  </div>
</template>

<script>
export default {
    props: {
        htmlProps: String,
        sizeAnimationProps: Boolean,
    },
    watch: {
        sizeAnimationProps(value){
            this.sizeAnimation = value
        }
    },
    data(){
        return {
            html: this.htmlProps,
            sizeAnimation: this.sizeAnimationProps
        }
    }

}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables.scss';
    .card {
        background: $default-gradient;
        width: 305px;
        height: calc(99% - 5px);
        max-height: 314px;
        box-shadow: 8px 8px 8px 0px rgba(0, 0, 0, 0.70);
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 40px;
        font-size: 1rem;
        transition: .7s;
        .text-container {
            width: 99.4%;
            height: 99.4%;
            background-color: #191918;
            border-radius: 40px;
            display:flex;
            color: $text-color;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            gap: 28px;
            padding: 25px;
        }
    }
    .sizeAnimation {
        width: 295px !important;
        height: calc(99% - 15px) !important;
        font-size: 0.950rem !important;

    }

</style>