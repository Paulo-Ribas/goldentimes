<template>
  <div class="btn-container" @click.prevent="" :class="{checkTop, checkRigth}" :style="{left: X, top: Y}">
    <button>Kick Member</button>
    <button v-if="owner">Give Adimin</button>
    <button v-if="!owner">Remove Adimin</button>
  </div>
</template>

<script>
export default {
    props: {
        Xprops: Number,
        Yprops: Number,
        checkRigthProps: Boolean,
        checkTopProps: Boolean,
        ownerProps: Boolean,
    },
    watch: {
        Xprops(value){
            this.X = value + 'px'
            console.log(this.X)
        },
        Yprops(value){
            console.log(value, 'vou coisar')
            this.Y = value + 'px'
        }
    },
    data(){
        return {
            X: `${this.Xprops}px`,
            Y: `${this.Yprops}px`,
            checkRigth: this.checkRigthProps,
            checkTop: this.checkTopProps,
            owner: this.ownerProps
        }
    },
}
</script>

<style scoped lang="scss">
@import '../../assets/scss/variables.scss';
    .btn-container {
        border-radius: 20px;
        border: 1px solid #7E5936;
        background: #0E0E0D; 
        max-width: 250px;
        width: 20%;
        min-width: 200px;
        position: absolute;
        button {
            margin: 22px 0px;
            border: none;
            background: none;
            color: $text-color;
            font-size: 1rem;
            font-family: $main-font;
            padding-left: 10px;
            transition: 0.3s;
            &:hover{
                color: $gold;
            }
            cursor: pointer;
        }   
    }

</style>