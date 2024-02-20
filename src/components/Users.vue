<template>
    <div class="user-container">
        <div class="user-img-name-container">
            <div class="img-container">
                <img :src="profileImg">
            </div>
            <RouterLink class="user-name" :to="`/profile/${user.ID}`">{{user.Name}}</RouterLink>
        </div>
        <button class="invite" v-if="canBeInvited && !isMember" @click="inviteUser">Invite</button>
        <div class="member" v-else-if="isMember && !isLeader" @click="inviteUser">Member</div>
        <div class="member" v-else-if="isLeader" @click="inviteUser">Owner</div>
        <div class="invited" v-else>Invited</div>
    </div>
</template>

<script>
export default {
    name:'Users-',
    mounted(){
        console.log(this.Leader, this.user.ID, this.isLeader)
    },
    props: {
        userProps: Object,
        membersProps: Array,
        invitedProps: Array,
        leaderProps: String,
    },
    data(){
        return {
            user: this.userProps,
            groupID: this.$route.params.id,
            members: this.membersProps,
            invited: this.invitedProps,
            Leader: this.leaderProps,
            err: ''
        }
    },
    watch:{
        invitedProps(value){
            this.invited = value
        }
    },
    computed: {
        profileImg(){
            if(!this.user.Img) return
            if(this.user.Img === 'default.png') return require('../assets/imgs/default.png')
            return this.user.Img
        },
        canBeInvited(){
            if(!this.user.InvitesRecived) return true
            let found = this.user.InvitesRecived.find(filter => {
                 return filter.groupID === this.groupID
            })
            console.log(this.user, this.invited)
            if(!found) found = this.invited.find(filter => filter.groupID === this.groupID && filter.userID === this.user.ID)
            if(found) return false
            return true
        },
        isMember(){
            if(!this.members) return false
            let found = this.members.find(filter => filter.id === this.user.ID)
            if(found) return true
            return false
        },
        isLeader(){
            if(!this.members) return false
            let isLeader = this.Leader === this.user.ID
            if(isLeader) return true
            return false
        }
    },
    methods: {
        inviteUser(){
            let data = {
                UserInvitedID: this.user.ID,
                userInvitedName: this.user.Name
            }
            this.$emit('inviteUser', data)
        }
    }
}
</script>

<style scoped lang="scss">
@import '../assets/scss/variables.scss';
@import '../assets/scss/imageCenter.scss';
@import '../assets/scss/buttonsAndInputs.scss';

    .user-container {
        border-radius: 20px;   
        background: #191918;
        width: 100%;
        padding: 5px 10px;
        display: flex;
        justify-content: space-around;
        margin: 4px 0px;
        .user-img-name-container {
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
                    object-fit: cover;
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
        .invite {
            cursor: pointer;
            width: 100%;
            height: auto;
            max-width: 100px;
            text-transform: uppercase;
            @include defaultBtn(0px, 0px, 0.8rem)
        }
        .invited, .member {
            height: auto;
            width: 100%;
            max-width: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 0.8rem;
            font-family: $main-font;
            text-transform: uppercase;
            background: none;
        }
        .member {
            color: $gold;
        }
    }
</style>