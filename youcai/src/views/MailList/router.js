let defaultPath = './'
export default {
  path: '/mail',
  component: () => import(defaultPath + 'Master.vue'),
  children: [
    {
      path: 'mailList',
      name: 'mailList',
      meta: { login: true, title: '群组' },
      component: () => import('./MailList.vue')
    }
  ]
}
