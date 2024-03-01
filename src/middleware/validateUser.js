import store from '@/store/index'
export default function (to, from, next){
    let token = localStorage.getItem('token')
    store.dispatch('validateUser', token)
    .then(() =>{ 
      //console.log(done, 'foi foi foi')
      return next()
    })
    .catch((err) =>{
      console.log(err, 'erro')
      return next('/login')
    })
  }