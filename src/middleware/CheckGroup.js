import store from '@/store/index'
export default function (to, from, next){
    console.log(to)
    let token = localStorage.getItem('token'),  groupID = to.params.groupID || to.params.id
    store.dispatch('checkGroup', {token, groupID})
    .then(() =>{ 
        console.log('deu tudo certo :D')
      return next()
    })
    .catch((err) =>{
        let error 
        if(err.err) return  next({name:'PageError', params: {error: err.err}})

        !err.response ?  {err: err.message || 'Network Error'} : err.response.data 

        return next({name:'PageError', params: {error: error.err}})
    })
  }