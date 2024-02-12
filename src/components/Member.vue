<template>
    <div class="member-container" @click="showContextMenu">
        <div class="member-img-name-container">
            <div class="img-container">
                <img :src="profileImg">
            </div>
            <RouterLink class="user-name" :to="`/profile/${member.id}`">{{member.name}}</RouterLink>
        </div>
        <ContextMenuOwnerVue v-if="showMenu" :Xprops="x" :Yprops="y"></ContextMenuOwnerVue>
    </div>
</template>

<script>
import ContextMenuOwnerVue from './ContextMenuOwner.vue'
export default {
    name:'Member-',
    props: {
        memberProps: Object,
    },
    data(){
        return {
            member: this.memberProps,
            ContextMenuOwnerVue: false,
            showMenu: false,
            x: 0,
            y: 0,
        }
    },
    computed: {
        profileImg(){
            if(!this.member.profileImg) return
            if(this.member.profileImg === 'default.png') return require('../assets/imgs/default.png')
            return this.member.profileImg

        }
    },
    methods: {
        showContextMenu($event){
            this.x = $event.offsetX
            this.y = $event.offsetY
            this.showMenu = !this.showMenu
        }
    },
    components: {ContextMenuOwnerVue}
}
</script>

<style scoped lang="scss">
@import '../assets/scss/variables.scss';
@import '../assets/scss/imageCenter.scss';


    .member-container {
        border-radius: 20px;   
        background: #191918;
        width: 100%;
        padding: 5px 10px;
        display: flex;
        justify-content: space-around;
        cursor: pointer;
        position: relative;
        .member-img-name-container {
            flex: 1;
            display: flex;
            gap: 10px;
            align-items: center;
            .img-container {
                border-radius: 25px;
                overflow: hidden;
                position: relative;
                width: 40px;
                height: 40px;
    
                img {
                    @include centerImage(contain, center);
                    object-fit: cover !important;
                }
            }
            .user-name {
                color: $text-color;
                font-family: $main-font;
                font-size: 1rem;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
                text-decoration: none;
            }

        }
    }
</style>