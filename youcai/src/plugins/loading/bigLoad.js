// 引入Share组件
import BigLoad from './bigLoad.vue'

let LoadPlugin = {
  install (Vue, router) {
    let BigLoadContructor = Vue.extend(BigLoad)
    let BigInstance = new BigLoadContructor()
    BigInstance.$mount(document.createElement('div'))
    document.body.appendChild(BigInstance.$el)
    Vue.prototype.$bigLoad = (info, dur = 1500) => {
      BigInstance.info = info
      BigInstance.show = true
      setTimeout(() => {
        BigInstance.show = false
      }, dur)
    }
  }
}
export default LoadPlugin
