<template>
     <div class="invite-container">
        <div class="invite-informations">
            <div v-for="invite in invites" :key="invite.ID" class="invite-box">
                <h3>Convite para o grupo <span class="group-name">{{invite.GroupName}}</span> enviado por <span class="invite-name">{{invite.InviterName}}</span></h3>
                <div class="btns-container">
                    <button @click="emitAccept(invite)">accept</button>
                    <button @click="emitRefuse(invite)">decline</button>
                </div>
            </div>
        </div> <!--fim do invite information-->
        <button class="edit-btn" @click="emitClose">close</button>
     </div>
</template>

<script>
export default {
    name: 'notifications-',
    props: {
        invitesProps: Array,
        userProps: Object
    },
    watch: {
        invitesProps(value){
            this.invites = value
        }
    },
    data(){
        return {
            invites: this.invitesProps,
            user: this.userProps
        }
    },
    methods: {
        emitClick(){
            this.$emit('clicked')
        },
        emitAccept($event){
            this.$emit('accepted', $event)
        },
        emitRefuse($event) {
            this.$emit('refused', $event)
        },
        emitClose(){
            this.$emit('close')
        }
    }

}

</script>

<style lang="scss" scoped>
@import '../assets/scss/buttonsAndInputs.scss';
@import '../assets/scss/variables.scss';
.invite-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 0px 0px 30px 0px;
    .invite-informations {
        width: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 5px;
        overflow-y: auto;
        .invite-box {
            width: 100%;
            display: flex;
            gap: 11px;
            flex-direction: column;
            padding: 20px 0px;
            border-radius: 20px;
            background: #0F0F0F;
            h3 {
                color: $text-color;
                font-size: 1.2rem;
                font-family: $main-font;
                width: 100%;
                text-align: center;
                font-weight: 500;
                padding: 0px 7px;
                .group-name, .invite-name {
                    max-width: 120px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: inline-block;
                    word-break: keep-all;
                    white-space: nowrap;
                    vertical-align: bottom;
                }
            }
            .btns-container {
                width: 100%;
                display: flex;
                justify-content: space-around;
                button {
                    cursor: pointer;
                    text-transform: uppercase;
                    @include defaultBtn(4px, 23px, 1.07rem);
                    padding-bottom: 1px;
                }
            }
        }

    }
}
.edit-btn {
    @include edit-btn
}


</style>