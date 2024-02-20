import { createRouter, createWebHistory } from 'vue-router'
import validateUser from '@/middleware/validateUser'
import CheckGroup from '@/middleware/CheckGroup'

const routes = [
  {
    path: '/',
    name: 'home',
    beforeEnter(to, from, next){
      if(localStorage.getItem('token')){
        return next('/profile')
      }
      next()
    },
    component: () => import('../views/Home.vue')
  },

  {
    path: '/sign-up',
    name: 'signUp',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/SignUp/SignUp.vue')
  },
  {
    path:'/login',
    name: 'login',
    component: () => import('../views/Login/Login.vue')
  },
  {
    path: '/request-token',
    name: 'requestToken',
    component: () => import('../views/RequestToken/RequestToken.vue')
  },
  {
    path: '/recovery-password/:token',
    name: 'recovetPassword',
    component: () => import('../views/RecoveryPassword/RecoveryPassword.vue')
  },
  {
    path:'/profile',
    name: 'perfil',
    beforeEnter: validateUser,
    component: () => import('../views/Profile/Profile.vue'),
    children: [
      {
        path:'searchplaces',
        name:'search',
        component:() => import('../views/SearchPlaces/SearchPlaces.vue')
      },
      {
        path:'savedplaces',
        name: 'saved',
        component:() => import('../views/PlacesSaved/PlacesSaved.vue')
      },
      {
        path:'blacklist',
        name: 'black',
        component:() => import('../views/BlackList/BlackList.vue')
      },
    ]
  },
  {
    path: '/user/profile/:userId',
    name: 'publicProfile',
    component: () => import('../views/User/Profile.vue')
  },
  {
    path:'/group/:id',
    name: 'groups',
    beforeEnter: [validateUser, CheckGroup],
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
    beforeEnter: [validateUser, CheckGroup],
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
  },
  {
    path:'/errorpage/:error',
    name: 'PageError',
    component:() => import('../views/ErrorPage/ErrorPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
