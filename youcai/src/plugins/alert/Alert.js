// 引入Share组件
import Alert from './Alert.vue'

let AlertPlugin = {
  install (Vue, router) {
    let AlertContructor = Vue.extend(Alert)
    let AlertInstance = new AlertContructor()
    AlertInstance.$mount(document.createElement('div'))
    document.body.appendChild(AlertInstance.$el)
    AlertInstance.router = router
    Vue.prototype.$alert = (info) => {
      AlertInstance.info = info
      AlertInstance.show = true
    }
  }
}
export default AlertPlugin
