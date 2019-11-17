import Vue from 'vue'
import Router from 'vue-router'

import RouteAccount from '@/views/Account/router' // 登录注册
import RouteBlog from '@/views/Blog/router'
Vue.use(Router)
let router = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      redirect: () => {
        return '/account'
      }
    },
    RouteAccount,
    RouteBlog
  ]
})
export default router
