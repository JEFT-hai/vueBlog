import PluginView from './View.vue'

export default {
  install: function (Vue, options) {
    let PluginVue = Vue.extend(PluginView)
    let pluginInstance
    const initInstance = () => {
      pluginInstance = new PluginVue()
      let pluginElement = pluginInstance.$mount().$el
      document.body.appendChild(pluginElement)
    }
    Vue.prototype.$showImageEditor = function (src) {
      if (!pluginInstance) {
        initInstance()
      }
      return pluginInstance.show(src)
        .then(val => {
          return Promise.resolve(val)
        })
        .catch(err => {
          return Promise.reject(err)
        })
    }
    Vue.prototype.$showImageFileEditor = function (imageFile) {
      if (!pluginInstance) {
        initInstance()
      }
      return pluginInstance.showFile(imageFile)
        .then(val => {
          return Promise.resolve(val)
        })
        .catch(err => {
          return Promise.reject(err)
        })
    }
  }
}
