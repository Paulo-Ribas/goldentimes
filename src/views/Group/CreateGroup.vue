<template>
    <section id="create">
        <div class="container">
            <div class="groups-container">
                <span class="error">{{err}}</span>
                <MyForm placeholderProps="Group Name" @submitForm="createGroup($event)"/>
                <Groups @deleteGroupFromUser="deleteGroupFromUser($event)" @editGroup="editGroup($event)" @leaveGroup="leaveTheGroup($event)" v-for="group in groups" :key="group.GroupID" :idProps="group.GroupID" :nameProps="group.GroupName" :leaderProps="group.Leader"></Groups>
            </div>
        </div>
    </section>
  
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import Groups from '@/components/Groups.vue'
import MyForm from '@/components/MyForm.vue'
export default {
    async beforeMount(){
        try {
            await this.setGroups()
        } catch (error) {
            this.err = error
        }
        
    },
    data(){
        return {
            name: '',
            text: '',
            err: '',
            groupsDefault: this.userGroups
        }
    },
    watch:{
        userGroups(value) {
            this.groupsDefault = value
        }
    },
    components:{ Groups, MyForm },
    computed:{
        ...mapState({user: state => state.user, userGroups: state => state.groups}),
        groups:{
            set(value){
                return this.userGroups.Groups = value
            },
            get(){
                return this.userGroups.Groups
            }
        }
    },
    methods: {
        ...mapMutations({SET_GROUPS:'SET_GROUP_STATE'}), 
        ...mapActions({saveGroup: 'saveGroup', validateUser: 'validateUser', getGroups: 'getGroups',
        updateGroupName:'editGroupName', deleteGroup: 'deleteGroup', leaveGroup: 'leaveGroup'}),
        async createGroup($event){
            this.name = $event
            try {
                let groups = await this.saveGroup(this.name)
                this.groups = groups
                console.log(groups,'o grupoo')
                this.name = ''
            } catch (error) {
                this.err = error.err
                this.name = ''
            }
        },
        async editGroup(context){
            try {
                let groupUpdated = await this.updateGroupName(context)
                console.log('atualizei ele, ', groupUpdated)
                this.name = ''
                this.err = ''
                let newArray = this.groups.map(group => {
                    return {
                        ...group,
                        GroupName: groupUpdated.GroupID === group.GroupID ? groupUpdated.GroupName : group.GroupName
                    }
                })
                this.groups = newArray
            } catch (error)    {
                this.err = error.err
                this.name = ''
                console.log(error)
            }
        },
        async deleteGroupFromUser(id){
            try {
                 this.deleteGroup({groupID: id})
                let newArray = this.groups.filter(group => {
                     return group.GroupID !== id
                })
                console.log(newArray.length, this.groups.length)
                this.groups = newArray
                this.err = ''
            } catch (error) {
                console.log(error)
                this.err = error.err
            }
        },
        async leaveTheGroup($event){
            try {
                let groupID = await this.leaveGroup($event)
                let newArray = this.groups.filter(group => {
                     return group.GroupID !== groupID
                })
                this.groups = newArray
            } catch (error) {
                console.log(error)
                this.err = error.err
            }
        },
        async setGroups(){
            try {
                let groups = await this.getGroups(this.user.id)
                this.SET_GROUPS(groups)
            } catch (error) {
                this.err = error.err
            }
        },
    }
}
</script>

<style scoped lang="scss">
    @import '../../assets/scss/variables.scss';
    #create {
        width: 100%;
        height: 100vh;
        .container {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
        }
    }
    .groups-container {
        width: 100%;
        height: 95%;
        border-radius: 40px;
        margin-top: 10px;
        background: #0E0E0D;
        padding: 20px 30px 0px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 13px;
        overflow-y: auto;

    }
</style>