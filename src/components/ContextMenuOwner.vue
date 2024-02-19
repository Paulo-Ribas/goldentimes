<template>
  <div class="btn-container" @click.prevent="" :style="{left: X, top: Y}">
    <button @click="emitKickMember" v-if="!isOwner">Kick Member</button>
    <button @click="emitGiveMemberAdmin" v-if="!isMemberAdmin && !isOwner">Give Admin</button>
    <button @click="emitRemoveMemberAdmin" v-if="isMemberAdmin && !isOwner">Remove Admin</button>
    <button v-if="isOwner">Owner</button>
  </div>
</template>

<script>
export default {
    props: {
        Xprops: Number,
        Yprops: Number,
        mousePositionXProps: Number,
        mousePositionYProps: Number,
        isMemberAdminProps: Boolean,
        isOwnerProps: Boolean,
    },
    beforeMount(){
        let windowWidth = window.innerWidth, windowHeight = window.innerHeight
        console.log(this.X, this.mousePositionY, windowHeight, (this.mousePositionY + 400))
        if((this.mousePositionX + 200) >= windowWidth) this.X = (this.$props.Xprops - 200) + 'px'
        if((this.mousePositionY + this.$props.Yprops) >= windowHeight) this.Y = (this.$props.Yprops - (this.$props.Yprops * 2)) + 'px'
        console.log( '         ', this.X)


    },
    watch: {
        Xprops(value){
            this.X = value + 'px'
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
            isMemberAdmin: this.isMemberAdminProps,
            isOwner: this.isOwnerProps,
            mousePositionX: this.mousePositionXProps,
            mousePositionY: this.mousePositionYProps
        }
    },
    methods: {
        emitKickMember(){
            this.$emit('kickMember')
        },
        emitGiveMemberAdmin(){
            this.$emit('giveMemberAdmin')
        },
        emitRemoveMemberAdmin(){
            this.$emit('removeMemberAdmin')
        },
    }
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
        z-index: 2;
        button {
            margin: 22px 0px;
            border: none;
            background: none;
            color: $text-color;
            font-size: 1rem;
            font-family: $main-font;
            padding-left: 10px;
            transition: 0.3s;
            display: block;
            &:hover{
                color: $gold;
            }
            cursor: pointer;
        }   
    }

</style>