<template>
  <form @submit.prevent="submitForm" class="create-group-container">
        <input v-model="name" type="text" :placeholder="placeholder">
        <button type="submit">
                <PlusIcon></PlusIcon>
        </button>
    </form>
</template>

<script>
import PlusIcon from '@/components/svgs/PlusIcon.vue'

export default {
    props: {
        placeholderProps: String
    },
    data(){
        return {
            name: '',
            placeholder: this.placeholderProps
        }
    },
    components:{PlusIcon},
    methods: {
        submitForm(){
            this.$emit('submitForm', this.name)
            this.name = ''
        }
    }

}
</script>

<style scoped lang="scss">
@import '../assets/scss/variables.scss';
.create-group-container {
            display: flex;
            width: 90%;
            gap: 15px;
            input {
                display: flex;
                padding: 19px 15px;
                align-items: flex-start;
                color: $gold;
                font-family: $main-font;
                font-size: 1.2rem;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                border-radius: 40px;
                background: #191918;
                border:none;
                outline: none;
                &::placeholder {
                    color: $text-color;
                    font-size: 1.2rem;
                    font-family: $main-font;
                }
                
            }
            button {
                border-radius: 40px;
                background-color: #191918;
                display: flex;
                justify-content: center;
                align-items: center;
                border: none;
                padding: 0px 2rem;
                cursor: pointer;

            }
        }
</style>