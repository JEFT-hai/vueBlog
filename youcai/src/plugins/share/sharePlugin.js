// 引入Share组件
import Share from './Share.vue'
// import {mapState} from 'vuex'

let SharePlugin = {
  install(Vue, router) {
    let ShareContructor = Vue.extend(Share)
    let shareInstance = new ShareContructor()
    shareInstance.$mount(document.createElement('div'))
    document.body.appendChild(shareInstance.$el)
    shareInstance.router = router
    Vue.prototype.$share = {
      open(item = null, isDelete = false, type = 'discover', path = '', innerObj = '', isDeleteActivity = false, isPath = '') { // isMusic 表示是音乐页
        shareInstance.item = item
        shareInstance.type = type
        shareInstance.path = path
        shareInstance.isDelete = isDelete
        shareInstance.show = true
        shareInstance.innerObj = innerObj
        shareInstance.isDeleteActivity = isDeleteActivity
        shareInstance.isPath = isPath
      },
      close() {
        shareInstance.show = false
      }
    }
  }
}
export default SharePlugin
