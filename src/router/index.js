import { createRouter, createWebHistory } from 'vue-router'
import validateUser from '@/middleware/validateUser'

const routes = [
  {
    path: '/',
    name: 'home',
    beforeEnter(to, from, next){
      if(localStorage.getItem('token')){
        return next('/perfil')
      }
      next('/sign-up')
    },
  },
  {
    path: '/sign-up',
    name: 'signUp',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/SignUp.vue')
  },
  {
    path:'/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path:'/profile',
    name: 'perfil',
    beforeEnter: validateUser,
    component: () => import('../views/Profile.vue'),
    children: [
      {
        path:'searchplaces',
        name:'search',
        component:() => import('../views/SearchPlaces.vue')
      },
      {
        path:'savedplaces',
        name: 'saved',
        component:() => import('../views/PlacesSaved.vue')
      },
      {
        path:'blacklist',
        name: 'black',
        component:() => import('../views/BlackList.vue')
      },
    ]
  },
  {
    path:'/group/:id',
    name: 'groups',
    beforeEnter: validateUser,
    component:() => import('../views/Group/GroupsView.vue'),
  },
  {
    path: '/groups',
    name: 'createGroup',
    beforeEnter: validateUser,
    component:() => import('../views/Group/CreateGroup.vue')
  },
  {
    path:'/group/:groupID/category/:categoryID',
    name: 'GroupLocation',
    beforeEnter: validateUser,
    component:() => import('../views/Group/GroupPlaces.vue'),
    children: [
      {
        path:'/group/searchplaces/:groupID/category/:categoryID',
        name:'group-search',
        component:() => import('../views/Group/SearchPlaces/SearchPlaces.vue')
      },
      {
        path:'/group/savedplaces/:groupID/category/:categoryID',
        name: 'group-saved',
        component:() => import('../views/Group/SavedPlaces/PlacesSaved.vue')
      },
      {
        path:'/group/blacklist/:groupID/category/:categoryID',
        name: 'group-black',
        component:() => import('../views/Group/BlackListGroup/BlackList.vue')
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
