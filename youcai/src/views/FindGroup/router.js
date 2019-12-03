let defaultPath = './'
export default {
  path: '/userGroup',
  // meta: { login: true, title: '举报笔记' },
  component: () => import(defaultPath + 'Master.vue'),
  children: [
    {
      path: 'findUserGroup',
      name: 'user_Group',
      meta: { login: true },
      component: () => import('./findUserGroup')
    }
  ]
}
