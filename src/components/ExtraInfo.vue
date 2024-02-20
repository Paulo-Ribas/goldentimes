<template>
    <div class="information-box">
        <p class="text-container" v-html="text">
        </p>
    </div>
</template>

<script>
export default {
    props: {
        textProps: String
    },
    data(){
        return {
            text: this.textProps
        }
    }

}
</script>

<style scoped lang="scss">
@import '../assets/scss/variables.scss';
    .information-box {
        width: 90%;
        max-width: 305px;
        border-radius: 40px;
        padding: 1px;
        background: $default-gradient;
        box-shadow: 8px 8px 8px 0px rgba(0, 0, 0, 0.70);
        &:hover{
            .text-container {
                transform: translate(1%, -4%);
            }
        }
        .text-container {
            width: 100%;
            background-color: #191918;
            padding: 13px 35px;
            border-radius: 40px;
            font-size: 1rem;
            color: $text-color;
            font-family: $main-font;
            text-align: center;
            transform: translate(0%, 0%);
            transition: 0.3s;

        }
    }

</style>