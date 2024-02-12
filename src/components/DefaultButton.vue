
<template>
    <RouterLink class="btn-default" :to="href">{{btnName}}</RouterLink>  
</template>

<script>
export default {
    props: {
        btnNameProps: String,
        hrefProps: String,
    },
    data(){
        return {
            href: this.hrefProps,
            btnName: this.btnNameProps
        }
    },

}
</script>

<style scoped lang="scss">
    @import '../assets/scss/variables.scss';
    .btn-default {
        border-radius: 40px;
        background: #191918;
        width: 100%;
        margin-top: 7px;
        padding: 19px 0px;
        font-size: 1.1rem;
        font-family: $main-font;
        color: $text-color;
        text-decoration: none;
        display: flex;
        justify-content: center;
        transition: 0.2s ease-in-out;
        &:hover {
            color: $gold;
        }
    }

</style>