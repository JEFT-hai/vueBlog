let defaultPath = './'

export default {
  path: '/my',
  component: () => import(defaultPath + 'Master.vue'),
  children: [{
      path: '',
      name: 'my',
      component: () => import(defaultPath + 'MyHome.vue'),
      meta: {
        title: '我的',
        login: true,
        keepAlive: true
      }
    },
    {
      path: '/user/:id',
      name: 'discoverUser',
      component: () => import(defaultPath + 'OtherHome.vue')
    },
    {
      path: '/my/follow/:id/:type/:label',
      name: 'my_follows',
      component: () => import(defaultPath + 'NewMyFollow.vue'),
      children: [{
          path: 'followUser',
          name: 'follow_user',
          component: () => import(defaultPath + 'FollowUser.vue'),
        },
        {
          path: 'followTopic',
          name: 'follow_topic',
          component: () => import(defaultPath + 'FollowTopic.vue'),
        },
        {
          path: 'followActivity',
          name: 'follow_activity',
          component: () => import(defaultPath + 'FollowActivityList.vue'),
        }
      ]
    },
    {
      path: '/my/followMe/:id/:routerType',
      name: 'my_followme',
      component: () => import(defaultPath + 'NewMyFans.vue'),
      children: [{
          path: 'followFans',
          name: 'follow_fans',
          component: () => import(defaultPath + 'FollowFans.vue'),
        },
        {
          path: 'likeMe',
          name: 'like_me',
          component: () => import(defaultPath + 'LikeMeList.vue'),
        },
        {
          path: 'followGroup',
          name: 'follow_group',
          component: () => import(defaultPath + 'FollowGroup.vue'),
        }
      ]
    },
    {
      path: '/my/set',
      name: 'my_set',
      component: () => import(defaultPath + 'Set.vue'),
      meta: {
        title: '设置'
      }
    },
    {
      path: '/my/personal',
      name: 'my_personal',
      component: () => import(defaultPath + 'Personal.vue')
    },
    {
      path: '/my/about',
      name: 'my_about',
      component: () => import(defaultPath + 'About.vue')
    },
    {
      path: '/my/account',
      name: 'account',
      component: () => import(defaultPath + 'Account.vue'),
      meta: {
        title: '用户账号'
      }
    },
    {
      path: '/my/score',
      name: 'my_score',
      component: () => import(defaultPath + 'Score.vue'),
      meta: {
        title: '等级会员'
      }
    },
    {
      path: '/my/xiao',
      name: 'my_xiao',
      component: () => import(defaultPath + 'UserDraft.vue'),
      meta: {
        title: '我的草稿'
      }
    },
    {
      path: '/my/taskCenter',
      name: 'taskCenter',
      component: () => import(defaultPath + 'Task.vue'),
      meta: {
        title: '任务中心'
      }
    },
    {
      path: '/my/flowersDetail',
      name: 'flowersDetail',
      component: () => import(defaultPath + 'FlowersDetail'),
      meta: {
        title: '积分明细'
      }
    },
    {
      path: '/my/whoLook',
      name: 'my_whoLook',
      component: () => import(defaultPath + 'WhoLookMe.vue'),
      meta: {
        title: '谁看过我'
      }
    },
    {
      path: '/my/feedBack',
      name: 'my_feedBack',
      component: () => import(defaultPath + 'Support.vue'),
      meta: {
        title: '反馈'
      }
    },
    {
      path: '/my/right',
      name: 'my_right',
      component: () => import(defaultPath + 'Right.vue'),
      meta: {
        title: '申请认证'
      }
    },
    {
      path: '/my/modifyRight',
      name: 'modify_right',
      component: () => import(defaultPath + 'ModifyRight.vue'),
      meta: {
        title: '修改认证'
      }
    },
    {
      path: '/my/blackList',
      name: 'black_list',
      component: () => import(defaultPath + 'BlackList.vue'),
      meta: {
        title: '黑名单'
      }
    },
    {
      path: '/my/bindPhone',
      name: 'bindPhone',
      component: () => import(defaultPath + 'BindPhone.vue'),
      meta: {
        title: '绑定手机号'
      }
    },
    {
      path: '/my/bindWChat',
      name: 'bindWChat',
      component: () => import(defaultPath + 'BindWChat.vue'),
      meta: {
        title: '绑定微信号'
      }
    },
    {
      path: '/my/headHanger/:curName?',
      name: 'hanger',
      component: () => import('./Privilege/HeadHanger.vue')
    },
    {
      path: '/my/nameColor/:curName?',
      name: 'nameColor',
      component: () => import('./Privilege/NameColor.vue')
    },
    {
      path: '/my/privilege/:curName?',
      name: 'privilegeDetail',
      component: () => import('./Privilege/Privilege.vue')
    },
    {
      path: '/my/unique',
      name: 'uniqueDecorate',
      component: () => import('./Privilege/PersonalDecorate.vue'),
      meta: {
        title: '个性装扮'
      }
    },
    {
      path: '/my/beVIP',
      name: 'beVIP',
      component: () => import('./Privilege/beVIP.vue'),
      meta: {
        title: '开通会员'
      }
    }
  ]
}
