import store from '@/store/index'
export default function (to, from, next){
    let token = localStorage.getItem('token')
    store.dispatch('validateUser', token)
    .then((done) =>{ 
      console.log(done, 'foi foi foi')
      return next()
    })
    .catch((err) =>{
      console.log(err, 'erro erro erro')
      return next('/login')
    })
  }