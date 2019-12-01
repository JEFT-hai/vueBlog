import Vue from 'vue'
import App from './App.vue'
import router from './router'
import api from '@/assets/js/api'
import $ from '@/assets/js/ajax'
import ElementUI from 'element-ui'
import '@/assets/css/root.css' //全局根样式
import 'element-ui/lib/theme-chalk/index.css' // 基本css
import 'element-ui/lib/theme-chalk/display.css' // 显隐css
import '@/assets/less/display.less' // 补充显隐css
import '@/assets/less/common.less' // 全局样式
import mock from '@/assets/js/mock.js'

Vue.prototype.api = api
Vue.prototype.$ = $
Vue.prototype.getMock = function (data) {
  return new Promise ((resolve) => {
    resolve(mock[data])
  })
}
Vue.use(router)
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
