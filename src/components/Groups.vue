<template>
  <form @submit.prevent="emitEdit" @click="goToGroup">
        <GroupsSvg/>
        <div class="name-container" @click.stop="">
            <RouterLink :to="'/group/' + id" @click.stop="" v-if="!editing">{{ name }}</RouterLink>
            <input @click.stop="" v-if="editing" type="text" v-model="text" :placeholder="name">
            <div class="icons-container">
                <PencilSvg v-if="!editing" @click.stop="editing = true"/>
                <XMark v-if="editing" @click.stop="editing = false"/>
            </div>
        </div>
        <RecycleBin v-if="showDelete" @click.stop="deleteGroup"></RecycleBin>
        <LeaveGroup v-if="!showDelete" @click.stop="leaveGroup"></LeaveGroup>
    </form>
</template>

<script>
import {mapState } from 'vuex';
import GroupsSvg from './svgs/GroupsSvg.vue';
import PencilSvg from './svgs/PencilSvg.vue';
import RecycleBin from './svgs/RecycleBin.vue';
import XMark from './svgs/XMark.vue';
import LeaveGroup from './svgs/LeaveGroup.vue'

export default {
    props: {
        nameProps: String,
        idProps: String,
        leaderProps: String
    },
    watch:{
        nameProps(value, payload) {
            if(value !== payload) {
                this.name = value
                this.editing = false
            }
        }
    },
    name: 'groups-',
    data(){
        return {
            name: this.nameProps,
            id: this.idProps,
            text: '',
            editing: false,
            leader: this.leaderProps
        }
    },
    computed: {
        ...mapState({user: state => state.user}),
        showDelete(){
            return this.leader === this.user.ID
        }
    },
    components: {GroupsSvg, PencilSvg, RecycleBin, XMark, LeaveGroup},
    methods: {
        emitEdit(){
            this.$emit('editGroup', {groupName: this.text, groupID: this.id})
        },
        deleteGroup(){
            //console.log(this.id, 'p~sajdpsakk')
            this.$emit('deleteGroupFromUser', this.id)
        },
        goToGroup(){
            this.$router.push(`/group/${this.id}`)
        },
        leaveGroup(){
            this.$emit('leaveGroup', {groupID: this.id})
        }
    }
}
</script>

<style scoped lang="scss">
    @import '../assets/scss/variables.scss';
    form {
        width: 90%;
        padding: 30px 0px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        border-radius: 20px;
        background: #191918;
        cursor: pointer;
        &:hover {
            transform: translateY(-3px);
            transition: 0.1s;
        }
        svg {
            flex: 1;
            cursor: pointer;
        }
        .name-container {
            font-size: 1.1rem;
            color: $text-color;
            font-family:  $main-font;
            display: flex;
            flex: 1;
            justify-content: center;
            gap: 30px;
            max-width: 350px;
            a {
                text-decoration: none;
                color: $text-color;
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                text-align: center;
                &:hover {
                    color: $gold;
                }
            }
            input {
                background: none;
                font-size: 1.1rem;
                font-family: $main-font;
                border: none;
                outline: none;
                color: $gold;
                &::placeholder {
                    font-size: 1.1rem;
                    color: $text-color;
                }
            }
        }
    }

</style>