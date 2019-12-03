let defaultPath = './'

export default {
  path: '/group',
  component: () => import(defaultPath + 'Master.vue'),
  children: [{ // 1
      path: '/group/info/:id/:from?',
      name: 'groupInfo',
      meta: {
        login: false,
        title: '',
        keepAlive: true,
        index: 1
      },
      component: () => import(defaultPath + 'Info.vue')
    },
    {
      path: '/group/revise/:id',
      name: 'groupRevise',
      meta: {
        login: true,
        title: '修改群组资料',
        index: 2
      },
      component: () => import(defaultPath + 'revise.vue')
    },
    {
      path: '/group/QR/:id',
      name: 'groupQR',
      meta: {
        login: false,
        title: '群二维码',
        index: 6
      },
      component: () => import(defaultPath + 'QR.vue')
    },
    {
      path: '/group/create/',
      name: 'groupCreate',
      meta: {
        login: true,
        title: '创建群组'
      },
      component: () => import(defaultPath + 'Create.vue')
    },
    {
      path: '/group/memberList/:id',
      name: 'groupMemberList',
      meta: {
        keepAlive: true,
        index: 4
      },
      // meta: { login: true, title: '创建群组' },
      component: () => import(defaultPath + 'groupMemberList.vue')
    },

    {
      path: '/group/chatSettings/:id/:isTop/:isMute',
      name: 'groupChatSettings',
      meta: {
        login: true,
        title: '聊天设置',
        index: 3
      },
      component: () => import(defaultPath + 'chatSettings.vue')
    },
    {
      path: '/group/applyList/:id',
      name: 'groupApplyList',
      // meta: { login: true, title: '创建群组' },
      component: () => import(defaultPath + 'groupApplyList.vue')
    },
    {
      path: '/group/groupSet/:type/:groupId',
      name: 'groupSet',
      meta: {
        login: true,
        title: '群设置'
      },
      component: () => import(defaultPath + 'groupSetPage.vue')
    },
    {
      path: '/group/setGroupNotice',
      name: 'groupNotice',
      component: () => import(defaultPath + 'MessageNotice.vue')
    },
    {
      path: '/group/userChatSettings/:id/:isTop/:isMute',
      name: 'userChatSettings',
      component: () => import(defaultPath + 'SetPersonalMsg.vue')
    }
  ]
}
