let defaultPath = './'

export default {
  path: '/Post',
  component: () => import(defaultPath + 'Master.vue'),
  children: [{
      path: '',
      redirect: '/post'
    },
    {
      path: 'post/:id?',
      meta: {
        login: true,
        title: '发布动态'
      },
      name: 'postPost',
      component: () => import('@/views/Discover/Post.vue')
    },
    {
      path: 'activity',
      meta: {
        login: true,
        title: '发布活动'
      },
      name: 'postActivity',
      component: () => import('@/views/Activity/Post.vue')
    }
  ]
}
