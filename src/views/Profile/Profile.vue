<template>
   <h1>welcome to golden times!</h1>
    <Loanding v-if="!loaded"></Loanding>
   <div class="container" v-if="loaded">
        <aside>
            <div class="profile-container">
                <ProfileDefault v-if="showUserProfile" :userProps="user" :notificationProps="notification"
                 @logout="logout" 
                 @bellClicked="bellClicked"
                 @emitEdit="EditClicked"
                 />
                 <ProfileEditing v-if="editUserProfile" :userProps="user" :notificationProps="notification"
                 @closeEdit="closecloseEdit"
                />
                
                <Notifications v-if="showNotifications" :userProps="user" :invitesProps="userInvites" 
                @close="closeNotifications"
                @accepted="accepted"
                @refused="refused"
                />
            </div>
            <div class="groups-container">
                <DefaultButton v-if="!Groups" btnNameProps="Create Group" hrefProps="/groups"></DefaultButton>
                <DefaultButton v-else btnNameProps="My Groups" hrefProps="/groups"></DefaultButton>

            </div>
        </aside>
        <main>
            <nav>
                <RouterLink to="/profile/searchplaces" @click="setActivated('search')" :class="{activated:search}"> <span v-if="search"></span>
                     Search Places
                </RouterLink>
                <RouterLink to="/profile/savedplaces" @click="setActivated('saved')" :class="{activated:saved}"> <span v-if="saved"></span> 
                    Saved Places
                </RouterLink>
                <RouterLink to="/profile/blacklist" @click="setActivated('black')" :class="{activated:black}"> <span v-if="black"></span> 
                    Black List
                </RouterLink>
            </nav>
            <RouterView>
            </RouterView>
        </main>
    </div>
</template>

<script>
import { RouterLink } from 'vue-router';
import { mapState, mapMutations, mapActions } from 'vuex';
import DefaultButton from '@/components/DefaultButton.vue';
import ProfileDefault from '@/components/ProfileDefault.vue';
import Notifications from '@/components/Notifications.vue';
import ProfileEditing from '@/components/ProfileEditing.vue';
import Loanding from '@/components/Loading.vue';
export default {
    head(){
        return {
            title: 'Profile',
            meta: [
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                {name: 'robots', content: 'noindex'}
            ], 
        }
    },
    async beforeMount(){
        try {
            this.setActivated(this.$route.name)
            this.userInvites = await this.getUserInvites()
            if(this.userGroups.length > 0) return this.loaded = true
            await this.setGroups()
            this.loaded = true
        } catch (error) {
            //console.log(error)
            this.err = error.err
        }

    },
    name: "UserProfile",
    computed: {

        ...mapState({ user: state => state.user, userGroups: state => state.groups.Groups}),
        Groups(){
            return this.userGroups.length !== 0
        },
        notification() {
            let InvitesRecived = this.userInvites || []
            return InvitesRecived.length > 0
        },

    },
    data(){
        return {
            search: false,
            saved: false,
            black: false,
            showNotifications: false,
            showUserProfile: true,
            userInvites: [],
            editUserProfile: false,
            loaded: false,
        }
    },
    components: { RouterLink, DefaultButton, ProfileDefault, ProfileEditing, Notifications, Loanding },
    methods: {
        ...mapMutations({UNSET_TOKEN: 'UNSET_TOKEN', UNSET_CURRENT_GROUP_BLACK_LIST_LOCATIONS: 'UNSET_CURRENT_GROUP_BLACK_LIST_LOCATIONS',
            UNSET_GROUPS: 'UNSET_GROUPS', UNSET_LOCATIONS: 'UNSET_LOCATIONS', SET_GROUPS:'SET_GROUP_STATE'
        }),
        ...mapActions({getUserInvites: 'getUserInvites', acceptInvite: 'acceptInvite', getGroups: 'getGroups',
                    refuseInvite: 'refuseInvite'
        }),
        setActivated(picked){
            switch (picked) {
                case 'search':
                    this.search = true
                    this.saved = false
                    this.black = false
                    break;
                case 'saved':
                    this.search = false
                    this.saved = true
                    this.black = false
                break;
                case 'black':
                    this.search = false
                    this.saved = false
                    this.black = true
                break;
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
        logout(){
            this.UNSET_TOKEN()
            this.UNSET_GROUPS()
            this.UNSET_LOCATIONS()
            this.UNSET_CURRENT_GROUP_BLACK_LIST_LOCATIONS()
            this.$router.push('/login')
        },
        async bellClicked(){
            this.userInvites = await this.getUserInvites()
            this.showNotifications = true
            this.showUserProfile = false
        },
        closeNotifications(){
            this.showNotifications = false
            this.showUserProfile = true
        },
        EditClicked(){
            this.showNotifications = false,
            this.showUserProfile = false
            this.editUserProfile = true
        },
        closecloseEdit(){
            this.showNotifications = false,
            this.showUserProfile = true
            this.editUserProfile = false
        },
        async accepted($event){
            //console.log('o objeto', $event)
            let invite = $event
            let {GroupID} = $event
            try {
                let acceptedId = await this.acceptInvite({invite, GroupID})
                let newArray = this.userInvites.filter(filter => {
                    return filter.ID !== acceptedId
                })
                this.userInvites = newArray
                this.setGroups()
                if(this.userInvites.length === 0) return  this.closeNotifications()
            } catch (error) {
                //console.log(error)
                this.err = error.err
            }
        },
        async refused($event) {
            //console.log('o objeto', $event)
            let invite = $event
            let {GroupID} = $event
            try {
                let acceptedId = await this.refuseInvite({invite, GroupID})
                let newArray = this.userInvites.filter(filter => {
                    //console.log(filter.ID, acceptedId)
                    return filter.ID !== acceptedId
                })
                this.userInvites = newArray
                if(this.userInvites.length === 0) return  this.closeNotifications()
            } catch (error) {
                this.err = error.err
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/imageCenter.scss';

h1{
    color: #FFF;
    text-shadow: 2px 1px 4px rgba(0, 0, 0, 0.90), 2px 1px 4px rgba(0, 0, 0, 0.90);
    text-align: center;
    font-family: $main-font;
    text-transform: uppercase;
    font-size: 1.6rem;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    padding: 11px 0px 8px 0px;
    background: $default-gradient;
}
.container {
    display: flex;
    gap: 8%;
}
aside {
    flex: 1;
    max-width: 333px;
    height: 100%;
    .profile-container {
        width: 100%;
        height: 70%;
        border-image: $default-gradient;
        border-image-slice: 1;
        border-width: 4px;
        border-style: solid;
        max-height: 470px;
        margin-top: 20px;
    }
    .groups-container {
        width: 100%;
        display: flex;
    }
}
main {
    margin-top: 20px;
    flex: 1;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;

    nav {
        width: 99%;
        max-width: 560px;
        border-radius: 40px;
        background: #0E0E0D;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        min-height: 49px;

        a {
            color: $text-color;
            text-decoration: none;
            &:hover {
                color: #F5CB86;
            }
            display: inline-block;
            position: relative;

            span {
                width: 100%;
                background-color: #F5CB86;
                height: 1px;
                position: absolute;
                bottom: 0;
                transform: translateY(-100%)
            }
        }

    }

}
.activated {
    color: #F5CB86;
}
@media screen and (max-width: 860px) {
    .container {
      flex-direction: column;
      align-items: center;
      gap: 0%;
      height: 200vh;
    }
    aside {
    width: 99%;
    max-width: 333px;
    height: 50%;
    flex: unset;
    .profile-container {
        width: 100%;
        height: calc(100% - 75px);
        border-image: $default-gradient;
        border-image-slice: 1;
        border-width: 4px;
        border-style: solid;
        max-height: 470px;
        margin-top: 20px;
    }
    .groups-container {
        width: 100%;
        display: flex;
    }
}
main {
    margin-top: 20px;
    flex: unset;
    width: 100%;
    height: -webkit-fill-available;
    display: flex;
    flex-direction: column;
    align-items: center;

    nav {
        width: 99%;
        max-width: 560px;
        border-radius: 40px;
        background: #0E0E0D;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        min-height: 49px;

        a {
            color: $text-color;
            text-decoration: none;
            &:hover {
                color: #F5CB86;
            }
            display: inline-block;
            position: relative;

            span {
                width: 100%;
                background-color: #F5CB86;
                height: 1px;
                position: absolute;
                bottom: 0;
                transform: translateY(-100%)
            }
        }

    }

}
}
@media screen and (max-height: 580px) {
    aside {
    width: 99%;
    max-width: 333px;
    height: fit-content !important;
    flex: unset;
    .profile-container {
        width: 100%;
        height: calc(100% - 75px);
        min-height: 323px !important;
        border-image: $default-gradient;
        border-image-slice: 1;
        border-width: 4px;
        border-style: solid;
        max-height: 470px;
        margin-top: 5px !important;
    }
    .groups-container {
        width: 100%;
        display: flex;
    }
}

}

</style>