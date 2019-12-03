// 引入Share组件
import Toast from './toast.vue'

let ToastPlugin = {
  install (Vue, router) {
    let ToastContructor = Vue.extend(Toast)
    let ToastInstance = new ToastContructor()
    ToastInstance.$mount(document.createElement('div'))
    document.body.appendChild(ToastInstance.$el)
    Vue.prototype.$toast = (info, dur = 1500) => {
      ToastInstance.info = info
      ToastInstance.show = true
      setTimeout(() => {
        ToastInstance.show = false
      }, dur)
    }
  }
}
export default ToastPlugin
