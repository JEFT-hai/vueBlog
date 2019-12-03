let defaultPath = './'

export default {
  path: '/account',
  component: () => import(defaultPath + 'Master.vue'),
  children: [{
      path: 'loginChoose',
      name: 'loginChoose',
      component: () => import(defaultPath + 'LoginChoose.vue'),
      meta: {
        title: '',
        index: 1
      }
    },
    {
      path: 'login',
      name: 'login',
      meta: {
        index: 2
      },
      redirect: 'loginByPhone'
    },
    {
      path: 'loginByPhone',
      name: 'loginByPhone',
      component: () => import(defaultPath + 'LoginByPhone.vue'),
      meta: {
        title: '',
        index: 2
      }
    },
    {
      path: 'loginByUs',
      name: 'loginByUs',
      component: () => import(defaultPath + 'LoginByUs.vue'),
      meta: {
        title: '',
        index: 3
      }
    },
    {
      path: 'agreement',
      name: 'agreement',
      meta: {
        title: '用户注册协议',
        index: 4
      },
      component: () => import(defaultPath + 'Agreement.vue')
    },
    {
      path: 'privacy',
      name: 'privacy',
      meta: {
        title: '多录隐私政策',
        index: 4
      },
      component: () => import(defaultPath + 'Privacy.vue')
    },
    {
      path: 'RecommentLabel',
      name: 'recommentLabel',
      meta: {
        index: 5
      },
      component: () => import(defaultPath + 'RecommentLabel.vue')
    },
    {
      path: 'logout',
      name: 'logout',
      component: () => import(defaultPath + 'Logout.vue'),
      meta: {
        title: '退出登录'
      }
    },
    {
      path: 'loginSuccess',
      name: 'loginSuccess',
      component: () => import(defaultPath + 'LoginSuccess.vue'),
      meta: {
        title: '登录成功',
        index: 6
      }
    }
  ]
}
