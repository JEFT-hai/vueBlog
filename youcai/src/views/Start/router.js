let defaultPath = './'

export default {
  path: '/',
  // redirect: () => {
  //   // 方法接收 目标路由 作为参数
  //   // return 重定向的 字符串路径/路径对象
  //   return '/index'
  // },
  name: 'start',
  meta: {
    title: '首页',
    login: true
  },
  component: () => import(defaultPath + 'Default.vue')
}
