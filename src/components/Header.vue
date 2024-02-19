<template>
    <header>
        <div class="logo-container">
            <img src="../assets/imgs/ampulheta.png" class="logo-icon">
        </div>
        <nav>
            <ul>
                <li><RouterLink to="/login">login</RouterLink></li>
                <li><RouterLink to="/sign-up">register</RouterLink></li>
            </ul>
        </nav>
    </header>
</template>
<script>
import { RouterLink } from 'vue-router';
export default {
    name: 'Header-',
    components: {RouterLink}
    
}
</script> 

<style lang="scss" scoped>
@import '../assets/scss/variables.scss';
@import '../assets/scss/buttonsAndInputs.scss';
    header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .logo-container {
            width: 70px;
            height: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
            .logo-icon {
                width: 100%;
                height: 100%;
                animation: rotateLogo;
                animation-duration: 1.3s;
                animation-fill-mode:both;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
            }
        }
        nav {
            display: flex;
            justify-content: center;
            align-items: center;
            ul {
                display: flex;
                align-items: center;
                gap: 20px;
                li {
                    list-style: none;
                    a {
                        @include edit-btn;
                        text-decoration: none;
                        font-size: 1rem;
                        font-family: $main-font;
                        text-transform: uppercase;
                        padding: 5px 25px;
                    }
                }
            }
        }
    }
    @keyframes rotateLogo {
        from {
            transform: rotateZ(0deg);
        }
        to {
            transform: rotateZ(360deg);
        }
        
    }
</style>