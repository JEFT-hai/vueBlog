let defaultPath = './'

export default {
  path: '/activity',
  component: () => import(defaultPath + 'Master.vue'),
  children: [{
      path: '',
      name: 'activityHome',
      meta: {
        login: false,
        title: '活动',
        keepAlive: true,
        index: 1
      },
      component: () => import(defaultPath + 'Home.vue')
    },
    {
      path: '/activity/post/',
      name: 'activityPost',
      meta: {
        login: true,
        title: '活动发布',
        index: 2
      },
      component: () => import(defaultPath + 'Post.vue')
    },
    {
      path: '/activity/vote',
      name: 'activityVote',
      meta: {
        login: true,
        title: '发布投票',
        index: 2
      },
      component: () => import(defaultPath + 'vote.vue')
    },
    {
      path: '/activity/list/',
      name: 'activityList',
      meta: {
        login: true,
        title: '我的活动',
        index: 2
      },
      component: () => import(defaultPath + 'MyActivityList.vue')
    },
    {
      path: '/activity/info/:id',
      name: 'activityInfo',
      meta: {
        login: false,
        title: '活动详情',
        index: 4
      },
      component: () => import(defaultPath + 'Info.vue')
    },
    {
      path: 'activityJoinList/:id',
      name: 'activityJoinList',
      meta: {
        login: true,
        title: '报名人列表',
        index: 5
      },
      component: () => import(defaultPath + 'JoinList.vue')
    },
    {
      path: 'activityJoin/:id/:fee?',
      name: 'activityJoin',
      meta: {
        login: true,
        title: '填写报名',
        index: 5
      },
      component: () => import(defaultPath + 'Join.vue')
    },
    {
      path: '/activity/revise/:id',
      name: 'activityRevise',
      meta: {
        login: false,
        title: '修改活动',
        index: 5
      },
      component: () => import(defaultPath + 'revise.vue')
    },
    {
      path: '/activity/nearBy',
      name: 'activityNearBy',
      meta: {
        login: true,
        title: '附近活动',
        index: 10
      },
      component: () => import(defaultPath + 'nearBy.vue')
    }
  ]
}
