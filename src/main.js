import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vueScreen from 'vue-screen'
import {createHead, VueHeadMixin} from "@unhead/vue"

let head = createHead()


createApp(App).use(store).use(router).use(head)
.use(vueScreen, {
    sm: 500,
    md: 860,
    lg: 1300,
    lx: Infinity,
}).mixin(VueHeadMixin)
.mount('#app')
