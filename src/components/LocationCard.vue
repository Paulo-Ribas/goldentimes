<template>
  <div class="card-container">
    <a class="img-container" target="_blank" :href="mapsUri">
        <Image></Image>
    </a>
    <div class="basic-informations">
        <h2 :class="{'actived-name':activedName}" @click="activedName = !activedName">{{locationName}}</h2>
        <span>Opens at <time :datetime="`${openHour}:${openMinutes}`">{{openHour}}:{{openMinutes }}</time></span>
    </div>
    <div class="rating-and-openNow">
        <div class="rating-container">
            <StarYellow v-for="(starYellow, index) in starsYellow" :key="index"></StarYellow>
            <StarHalf v-for="(starBlue, index) in halfStars" :key="index"></StarHalf>
            <StarTransparent v-for="(StarTransparent, index) in starsTransparents" :key="index"></StarTransparent>
        </div>
        <span class="open" v-if="openNow">
            Open
        </span>
        <span class="closed" v-else>
            Closed
        </span>
    </div>
    <ul>
        <li>
            <div class="icon-container">
                <LocationSvg></LocationSvg>
            </div>
            <address>
                {{locationAddress}}
            </address>
        </li>
        <li @click="copyNumber()" v-if="!openWhatsApiLink">
            <Transition name="copied">
            <span class="copy-warn" v-if="copied">Copied!</span>
            </Transition>
            <div class="icon-container">
                <PhoneSvg></PhoneSvg>
            </div>
            {{phone}}
        </li>
        <li v-if="openWhatsApiLink">
            <div class="icon--container">
                <PhoneSvg> </PhoneSvg>
            </div>
            <a target="_blank" :href="`https://api.whatsapp.com/send?phone=${numberTreated}`">{{phone}}</a>
        </li>
        <li v-if="facebook" class="website">
            <div class="icon-container">
                <FacebookSvg></FacebookSvg>
            </div>
            <a :href="webSite" target="_blank">{{webSite}}</a>
        </li>
        <li class="website" v-if="!facebook">
            <div class="icon-container">
                <WebUri></WebUri>
            </div>
            <a :href="webSite" target="_blank">{{ webSite }}</a>
        </li>
    </ul>
    <div class="btns-container">
        <button class="special-btn" v-if="!saved" @click="SaveCard()">
            Save
        </button>
        <button class="special-btn" v-if="saved && !placesSaved && !placesBlackListed" @click.prevent="">
            Saved
        </button>
        <button class="special-btn" v-if="saved && placesSaved" @mouseenter="savedBtn = 'unSave'" @mouseleave="savedBtn = 'saved'" @click="deleteCard()">
            <Transition name="btn-hover">
                <span :key="savedBtn">{{savedBtn}}</span>
            </Transition>
        </button>
        <button class="special-btn" v-if="saved  && placesSaved" @mouseenter="addBlackList = 'add'" @mouseleave="addBlackList = 'Black List'" @click="addBlackListCard()">
            <Transition name="btn-hover">
                <span :key="addBlackList">{{addBlackList}}</span>
            </Transition>
        </button>
        <button class="special-btn" v-if="placesBlackListed" @mouseenter="blackListed = 'remove'" @mouseleave="blackListed = 'Black Listed'" @click="removeBlackListCard()">
            <Transition name="btn-hover">
                <span :key="blackListed">{{blackListed}}</span>
            </Transition>
        </button>
    </div>
  </div>
</template>

<script>
import StarTransparent from './svgs/StarTransparent.vue'
import StarYellow from './svgs/StarYellow.vue'
import StarHalf from './svgs/StarHalf.vue'
import Image from './svgs/Image.vue'
import LocationSvg from './svgs/LocationSvg.vue'
import PhoneSvg from './svgs/PhoneSvg.vue'
import FacebookSvg from './svgs/FacebookSvg.vue'
import WebUri from './svgs/WebUri.vue'
export default {
    props: { 
        locationProps: Object,
        copyForWhatsApiProps: Boolean,
        placesSavedProps: Boolean,
        placesBlackListedProps: Boolean,
        openWhatsApiLinkProps: Boolean,
    },
    watch: {
        locationProps(value) {
            this.location = value
        },
        copyForWhatsApiProps(value){
            this.copyForWhatsApi = value
        },
        openWhatsApiLinkProps(value){
            this.openWhatsApiLink = value
        },
    },
    mounted(){
        this.renderStars()
    },
    computed: {
        locationName(){
            return this.location.displayName.text
        },
        locationAddress(){
            return this.location.formattedAddress
        },
        openHour(){
            if(!this.location.regularOpeningHours) return '??'
            if(this.location.regularOpeningHours.periods.length < 2) return '??'
            return this.location.regularOpeningHours.periods[0].open.hour
        },
        openMinutes(){
            if(!this.location.regularOpeningHours) return '??'
            if(this.location.regularOpeningHours.periods.length < 2) return '??'
            return this.location.regularOpeningHours.periods[0].close.minute
        },
        openNow(){
            if(this.location.regularOpeningHours) return this.location.regularOpeningHours.openNow
            return false
        },
        rating(){
            return this.location.rating || '??'
        },
        mapsUri(){
            return this.location.googleMapsUri
        },
        phone(){
            if(!this.location.nationalPhoneNumber) return '??'
            return this.location.nationalPhoneNumber
        },
        webSite(){
            if(!this.location.websiteUri) return '#'
            return this.location.websiteUri
        },
        facebook(){
            if(!this.location.websiteUri) return false
            return (this.location.websiteUri.includes('facebook'))
        },
        saved(){
            if(this.location.saved) return true
            return false
        },
        numberTreated(){
            if(this.phone == '??') return '#'
            return this.phone.replace(/[^\d]+/g, '')
        }
    },
    data(){
        return {
            location: this.locationProps,
            starsYellow: [],
            starsTransparents: [],
            halfStars: [],
            copyForWhatsApi: this.copyForWhatsApiProps,
            openWhatsApiLink: this.openWhatsApiLinkProps,
            savedBtn: 'Saved',
            activedName: false,
            addBlackList: 'Black List',
            blackListed: 'Black Listed',
            placesSaved: this.placesSavedProps,
            placesBlackListed: this.placesBlackListedProps,
            copied: false,
        }
    },
    components: { StarYellow, StarTransparent, StarHalf, Image, PhoneSvg, FacebookSvg, WebUri, LocationSvg},
    methods:{
        renderStars() {
            if(!this.rating) return
            for (let i = 0; i < 5; i++) {
                if(this.rating <= i) {
                    this.starsTransparents.length++ 
                }
                else if(!Number.isInteger(this.rating) && Math.floor(this.rating) === i) {
                    this.halfStars.length++
                }
                else if(this.rating > i) {
                    this.starsYellow.length++
                }
            }
        },
        copyNumber(){
            if(this.phone == '??') return
            if(this.copyForWhatsApi)  navigator.clipboard.writeText(`https://api.whatsapp.com/send?phone=${this.numberTreated}`)  
            else navigator.clipboard.writeText(this.numberTreated)
                
                this.copied = true
                
            setTimeout(() => {
                this.copied = false
            }, 400);
        },
        SaveCard(){
            this.$emit('saveCard', this.location)
        },
        deleteCard(){
            this.$emit('deleteCard', this.location)
        },
        addBlackListCard(){
            this.$emit('addBlackListCard', this.location)
        },
        removeBlackListCard(){
            this.$emit('removeBlackListCard', this.location)
        },

    } 


}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables.scss';
@import '../assets/scss/buttonsAndInputs.scss';

    .card-container {
        width: calc(50% - 10%);
        min-width: 300px;
        border-radius: 20px;
        padding: 5px;
        background: #191918;
        display: flex;
        flex-direction: column;
        gap: 8px;
        .img-container {
            width: 100%;
            height: 117px;
            border-radius: 20px 20px 20px 0px;
            background: #D9D9D9;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .basic-informations {
            display: flex;
            align-items: center;
            gap: 14px;
            h2 {
                color: $text-color;
                font-family: $main-font;
                font-size: 1.2rem;
                font-style: normal;
                font-weight: bold;
                line-height: normal;
                cursor: pointer;
            }
            .actived-name {
                color: #14FF00 !important;
            }
            span {
                color: #959595;
                font-family: $main-font;
                font-size: 0.750rem;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
            }
        }
        .rating-and-openNow{
            width: 100%;
            display: flex;
            gap: 15px;
            .rating-container {
                display: flex;
                gap: 5px;
            }
            .open, .closed {                
                /* h5/regular/12px */
                font-family: $main-font;
                font-size: 0.9rem;
                font-style: normal;
                font-weight: bold;
                line-height: normal;
                line-height: 22px;
            }
            .open {
                color: #14FF00;
            }
            .closed {
                color: #F00;
            }
        }
        ul {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 11px;
            li {
                color: $text-color;
                /* h5/regular/12px */
                font-family: $main-font;
                font-size: 1rem;
                font-style: normal;
                line-height: normal;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 15px;
                a {
                    color: $text-color;
                    font-family: $main-font;
                    font-size: 1rem;
                    font-style: normal;
                    line-height: normal;
                    cursor: pointer;
                    font-style: normal;
                    text-decoration: none;
                }
                address {
                    font-style: normal;
                    font-weight: 500;
                }

                .icon-container {
                    border-radius: 50%;
                    background-color: #0E0E0D;
                    width: fit-content;
                    height: fit-content;
                    display: flex;
                }
            }
            .website {
                overflow: hidden;
                text-overflow: ellipsis;
                a {
                    padding-right: 10px;
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 21px;
                }
            }
        }
        .btns-container {  
            width: 100%;
            gap: 10px;
            display: flex;
            overflow: hidden;
            .special-btn {
                text-transform: uppercase;
                cursor: pointer;
                overflow: hidden;
                @include specialBtn(7px, 0px, 1.1rem);
                padding-top: 10px;
                .btn-hover-enter-active {
                    transition: 0.4s;
                    transition-delay: 0.2s;
                }
                .btn-hover-leave-active {
                    transition-delay: 0s;
                    transition: 0.4s;
                }
                .btn-hover-enter-from {
                    opacity: 0;
                    transform: translate(20px, 0px);
                }
                .btn-hover-enter-to {
                    opacity: 1;
                    transform: translate(0px, 0px);
                }
                .btn-hover-leave-from {
                    opacity: 1;
                    transform: translate(0px, 0px);
                }
                .btn-hover-leave-to {
                    opacity: 0;
                    transform: translate(-20px, 0px);
                }
                
            }
        }
    }

</style>