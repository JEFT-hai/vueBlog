
export default {
  path: '/report/:id/:type',
  name: 'report',
  meta: { login: true, title: '举报' },
  component: () => import('./Report.vue')
}