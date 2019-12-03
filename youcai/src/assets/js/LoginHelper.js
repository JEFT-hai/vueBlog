let authentication = {
  isInApp: function () {
    return !(window.location.origin.indexOf('http://localhost') >= 0)
  },
  isLoginExpired: function () {
    let loginTimeString = localStorage.getItem('tianv_login_Time')
    if (!loginTimeString || loginTimeString.length <= 0) {
      return true
    }
    let loginTimeNumber = parseFloat(loginTimeString)
    if (isNaN(loginTimeNumber)) {
      return true
    }
    let loginTime = new Date(loginTimeNumber)
    let now = new Date()
    return loginTime >= now || loginTime <= now - (360 * 24 * 60 * 60 * 1000)
  },
  isLogin: function () {
    let auth = localStorage.getItem('Headers_Authorization')
    return auth === null ? false : auth && auth.length >= 1
  },
  authorization: function (store, router, to, next) {
    // 需要登录才能进入的页面
    let auth = localStorage.getItem('Headers_Authorization')
    let isLogin = auth && auth.length >= 1
    let isExpired = this.isLoginExpired()
    console.log(isLogin, isExpired, 'login')
    if (!isLogin || isExpired) {
      let needLogin = false
      if (to.matched.length >= 1) {
        for (let i = 0; i < to.matched.length; i++) {
          let item = to.matched[i]
          if (item.meta && item.meta.login) {
            needLogin = true
            break
          }
        }
      }
      if (needLogin) {
        // router.push({
        //   name: 'loginChoose',
        //   query: { redirect: true, path: to.path }
        // })
        console.log(store.state.operatorType)
        if (store.state.operatorType === '2') {
          router.push({name: 'login'})
        } else {
          router.push({name: 'loginChoose'})
        }
        next(false)
        return
      }
    }
    // 标题栏
    let metaTitle = to.meta.title && to.meta.title.length >= 1 ? to.meta.title : ''
    store.commit('updateMetaTitle', metaTitle)
    next()
  }
}

export default authentication
