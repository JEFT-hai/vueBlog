let defaultPath = './'

export default {
  path: '/message',
  component: () => import(defaultPath + 'Master.vue'),
  children: [{
      path: '/',
      name: 'messageList',
      component: () => import(defaultPath + 'MessageList.vue'),
      meta: {
        title: '消息',
        keepAlive: true
      }
    },
    {
      path: '/chatRoom/:name/:type/:id/:share?',
      name: 'chatRoom',
      component: () => import(defaultPath + 'ChatRoom.vue'),
      // meta: {
      //   title: 'haahhahah',
      //   noNav: false
      // }
    },
    {
      path: '/broadcast',
      name: 'broadcast',
      component: () => import(defaultPath + 'Broadcast.vue'),
      meta: {
        title: '广播',
        noNav: false
      }
    },
    {
      path: ':type?/:userId?/:userName?',
      name: 'message',
      component: () => import(defaultPath + 'Home.vue'),
      meta: {
        title: '消息',
        headColor: 'headclor',
        login: true
      }
    },
    {
      path: 'dialog/:type?/:userId?/:userName?',
      name: 'dialog',
      component: () => import(defaultPath + 'Dialog.vue'),
      meta: {
        login: true
      }
    },
    // 新的
    {
      path: '/chatAddFollow',
      name: 'message_addFollow',
      meta: {
        title: '通知消息'
      },
      component: () => import(defaultPath + 'AddFollow.vue'),
    },
    {
      path: '/chatLike',
      name: 'message_like',
      meta: {
        title: '赞和收藏'
      },
      component: () => import(defaultPath + 'LikeAndFavorite.vue')
    },
    {
      path: '/chatNoticeInner',
      name: 'message_notice',
      meta: {
        title: '系统通知'
      },
      component: () => import(defaultPath + 'NoticeInner.vue'),
    },
    {
      path: '/chatDiscuz',
      name: 'message_discuz',
      meta: {
        title: '评论'
      },
      component: () => import(defaultPath + 'ChatDiscuz.vue'),
    }
  ]
}
