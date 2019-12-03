// 引入Share组件
import userInput from './userInput.vue'

let userInputPlugin = {
  install (Vue, router) {
    let userInputContructor = Vue.extend(userInput)
    let userInputInstance = new userInputContructor()
    userInputInstance.$mount(document.createElement('div'))
    document.body.appendChild(userInputInstance.$el)
    userInputInstance.router = router
    Vue.prototype.$userInput = (info) => {
      
    }
  }
}
export default userInputPlugin
