let defaultPath = './'

export default {
  path: '/',
  component: () => import(defaultPath + 'Master.vue'),
  children: [{
      path: '/index/discover',
      name: 'discoverindex',
      component: () => import('@/views/Index/Discover.vue')
      // meta: { keepAlive: true }
    },
    {
      path: '/index',
      name: 'index',
      component: () => import(defaultPath + 'Master.vue'),
      meta: {
        keepAlive: true,
        scrollY: 0
      }
      // meta: { title: '关注' }
    },
    {
      path: '/index/topic',
      name: 'topic',
      component: () => import('@/views/Index/TopicHome.vue')
      // meta: { title: '话题' }
    },
    {
      path: '/index/info:id(\\d+)',
      name: 'topicinfo',
      component: () => import('@/views/Index/Info.vue')
      // meta: { title: '话题' }
    }
  ]
}
