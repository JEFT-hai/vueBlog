// 引入Upload组件
import Upload from './upload.vue'

let UploadPlugin = {
  install(Vue, router) {
    let UploadContructor = Vue.extend(Upload)
    let UploadInstance = new UploadContructor()
    UploadInstance.$mount(document.createElement('div'))
    document.body.appendChild(UploadInstance.$el)
    Vue.prototype.$uploading = (isLoading, msg, dur) => {
      UploadInstance.type = 0
      msg && (UploadInstance.msg = msg)
      UploadInstance.show = isLoading
      if (dur) {
        setTimeout(() => {
          UploadInstance.show = false
        }, dur)
      }
    }
    Vue.prototype.$success = (isSuccess, msg, dur) => {
      UploadInstance.type = 1
      msg && (UploadInstance.msg = msg)
      UploadInstance.show = isSuccess
      setTimeout(() => {
        UploadInstance.show = false
      }, dur ? dur : 1200)
    }
    Vue.prototype.$error = (isError, msg, dur) => {
      UploadInstance.type = 2
      msg && (UploadInstance.msg = msg)
      UploadInstance.show = isError
      if (dur) {
        setTimeout(() => {
          UploadInstance.show = false
        }, dur)
      }
    }
  }
}
export default UploadPlugin
