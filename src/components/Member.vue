<template>
    <div class="member-container" @click.stop="showContextMenu($event), closeOthers(member.id)">
        <div class="member-img-name-container">
            <div class="img-container">
                <img :src="profileImg">
            </div>
            <RouterLink class="user-name" :to="`/user/profile/${member.id}`">{{member.name}}</RouterLink>
        </div>
        <ContextMenuOwnerVue v-if="ContextMenuOwner && showMenu" :Xprops="x" :Yprops="y" 
        :mousePositionXProps="mousePositionX" :mousePositionYProps="mousePositionY"
        :isOwnerProps="IsOwner" :isMemberAdminProps="IsAdmin"
        @kickMember="kickMember(member.id)"
        @giveMemberAdmin="giveAdmin(member.id)"
        @removeMemberAdmin="removeAdmin(member.id)"
        ></ContextMenuOwnerVue>

        <ContextMenuAdmVue v-if="ContextMenuAdmin && showMenu" :Xprops="x" :Yprops="y"
        :mousePositionXProps="mousePositionX" :mousePositionYProps="mousePositionY"
        :isOwnerProps="IsOwner" :isMemberAdminProps="IsAdmin"
        @giveMemberAdmin="giveAdmin(member.id)"
        @removeMemberAdmin="removeAdmin(member.id)"
        ></ContextMenuAdmVue>

        <ContextMenuMemberVue v-if="ContextMenuMember && showMenu" :Xprops="x" :Yprops="y"
        :mousePositionXProps="mousePositionX" :mousePositionYProps="mousePositionY"

        :isOwnerProps="IsOwner" :isMemberAdminProps="IsAdmin"
        ></ContextMenuMemberVue>
    </div>
</template>

<script>
import ContextMenuAdmVue from './ContextMenuAdm.vue'
import ContextMenuMemberVue from './ContextMenuMember.vue'
import ContextMenuOwnerVue from './ContextMenuOwner.vue'
export default {
    name:'Member-',
    props: {
        memberProps: Object,
        groupProps: Object,
        ContextMenuOwnerProps: Boolean,
        ContextMenuAdminProps: Boolean,
        ContextMenuMemberProps: Boolean,
        toggleContextMenuProps: String,
    },
    data(){
        return {
            member: this.memberProps,
            ContextMenuOwner: this.ContextMenuOwnerProps,
            ContextMenuAdmin: this.ContextMenuAdminProps,
            ContextMenuMember: this.ContextMenuMemberProps,
            showMenu: false,
            group: this.groupProps,
            x: 0,
            y: 0,
            mousePositionX: 0,
            mousePositionY: 0,
        }
    },
    watch:{
        toggleContextMenuProps(value){
            if(value !== this.member.id) return this.showMenu = false
        }
    },
    computed: {
        profileImg(){
            if(!this.member.profileImg) return
            if(this.member.profileImg === 'default.png') return require('../assets/imgs/default.png')
            return this.member.profileImg

        },
        IsOwner(){
            console.log(this.group.Leader, this.member.id)
            if(!this.group) return false
            return this.group.Leader === this.member.id
        },
        IsAdmin(){
            if(!this.group) return false
            return this.group.Admins.find(members => {
                return members.id === this.member.id
            })
        },
        IsMember(){
            if(!this.group) return false
            let isOwner = this.group.Leader === this.member.id
            let foundAdmin = this.group.Admins.find(members => members.id === this.member.id)
            if(isOwner || foundAdmin) return false
            return true
        }
    },
    methods: {
        showContextMenu($event){
            this.x = $event.offsetX
            this.y = $event.offsetY

            this.mousePositionX = $event.pageX
            this.mousePositionY = $event.pageY

            this.showMenu = !this.showMenu
        },
        closeOthers(id){
            this.$emit('closeOthersContextMenu', id)
        },
        kickMember($event){
            this.$emit('kickMember', $event)
        },
        removeAdmin($event){
            this.$emit('removeAdmin', $event)
        },
        giveAdmin($event){
            this.$emit('giveAdmin', $event)
        }
    },
    components: {ContextMenuOwnerVue, ContextMenuMemberVue, ContextMenuAdmVue}
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