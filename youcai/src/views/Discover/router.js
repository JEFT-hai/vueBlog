let defaultPath = './'

export default {
  path: '/discover',
  component: () => import(defaultPath + 'Master.vue'),
  children: [{
      path: 'discoverItem/:postId',
      name: 'discoverItemOnly',
      meta: {
        login: true,
      },
      component: () => import(defaultPath + 'ItemOnly.vue')
    },
    {
      path: 'videoSwiper/:id',
      name: 'videoSwiper',
      meta: {
        login: true,
        title: ''
      },
      component: () => import(defaultPath + 'videoSwiper.vue')
    },
    {
      path: 'videoH/:id',
      name: 'videoH',
      meta: {
        login: true,
        title: '视频投票页'
      },
      component: () => import(defaultPath + 'videoH.vue')
    },
    {
      path: 'topicitem/:id',
      name: 'topicItemss',
      meta: {
        login: true,
        title: '话题'
      },
      component: () => import(defaultPath + 'TopicItem.vue')
    },
    {
      path: 'commentInner/:topicId/:topicAnswerId',
      name: 'topicComment',
      component: () => import(defaultPath + 'TopicCommentInner.vue')
    },
    {
      path: 'post/:id?',
      name: 'discoverPost',
      meta: {
        login: true,
        title: '发布动态'
      },
      component: () => import(defaultPath + 'Post.vue')
    },
    {
      path: 'otherPage/:tit?/:id',
      name: 'otherPage',
      meta: {
        login: true,
        title: ''
      },
      component: () => import(defaultPath + 'OtherPage.vue')
    }
  ]
}
