<template>
    <div class="container">
        <h2>{{error }}</h2>
        <RouterLink class="return" to="/profile"> return </RouterLink>
    </div>
</template>

<script>
import { RouterLink } from 'vue-router'
export default {
    data(){
        return {
            error: this.$route.params.error
        }
    },
    components:{RouterLink}
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables.scss';
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 14%;
        h2 {
            color: $gold;
            font-size: 2rem;
            text-transform: capitalize;
            font-family: $main-font;
        }
        a {
            color: $text-color;
            font-size: 1rem;
            text-transform: uppercase;
            font-family: $main-font;
            transition: 0.5s;
            text-decoration: none;
            cursor: pointer;
            &:hover {
                color: $gold;
            }
        }
    }
</style>
