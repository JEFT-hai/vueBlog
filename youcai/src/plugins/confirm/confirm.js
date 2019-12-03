// 引入Share组件
import Confirm from './confirm.vue'

let ConfirmPlugin = {
  install(Vue) {
    let ConfirmC = Vue.extend(Confirm)
    let ConfirmInstance = new ConfirmC()
    ConfirmInstance.$mount(document.createElement('div'))
    document.body.appendChild(ConfirmInstance.$el)
    Vue.prototype.$confirm = function (options) {
      Object.assign(ConfirmInstance, options)
      ConfirmInstance.show = true
      return ConfirmInstance.confirm()
    }
  }
}
export default ConfirmPlugin
