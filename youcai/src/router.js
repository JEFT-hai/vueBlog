import Vue from 'vue'
import Router from 'vue-router'

// import RouteStart from '@/views/Start/router'
import RouteIndex from '@/caview/Index/router'
import RouteFunc from '@/caview/func/router'
import RouteShop from '@/caview/shop/router'
import RouteSeek from '@/caview/seek/router'

import RouteAccount from '@/views/Account/router'
import RouteMy from '@/views/My0/router'
import RouteDiscover from '@/views/Discover/router'
import RouteMessage from '@/views/Message/router'
import RouteGroup from '@/views/Groups/router'
import RouteReport from '@/views/Report/router'
import RouteActivity from '@/views/Activity/router'
import RouteVote from '@/views/Vote/router'
import RouteFindGroup from '@/views/FindGroup/router'
import RoutePost from '@/views/Post/router'
// import RouteShop from '@/views/Shop/router'
import RouteMail from '@/views/MailList/router'
import RouteInner from '@/views/InnerShare/router'
import RouteRank from '@/views/RankList/router'
Vue.use(Router)
let router = new Router({
  mode: 'hash',
  routes: [
    // {
    //   path: '/',
    //   redirect: () => {
    //     // 方法接收 目标路由 作为参数
    //     // return 重定向的 字符串路径/路径对象
    //     return '/index'
    //   }
    // },
    // RouteStart,
    RouteIndex,
    RouteFunc,
    RouteShop,
    RouteSeek,
    
    RouteAccount,
    RouteDiscover,
    RouteActivity,
    RouteMy,
    RouteMessage,
    RouteGroup,
    RouteReport,
    RouteVote,
    RouteFindGroup,
    RoutePost,
    RouteShop,
    RouteMail,
    RouteInner,
    RouteRank
  ]
})
export default router
