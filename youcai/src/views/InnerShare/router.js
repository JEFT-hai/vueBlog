
export default {
  path: '/innerShare/:innerShareData',
  name: 'inner_share',
  meta: { login: true, title: '分享至' },
  component: () => import('./InnerShare.vue')
}