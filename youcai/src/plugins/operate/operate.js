// 引入Share组件
import Operate from './operate.vue'

let OperatePlugin = {
  install(Vue) {
    let OperateC = Vue.extend(Operate)
    let OperateInstance = new OperateC()
    OperateInstance.$mount(document.createElement('div'))
    document.body.appendChild(OperateInstance.$el)
    Vue.prototype.$operate = function (options) {
      Object.assign(OperateInstance, options)
      OperateInstance.show = true
    }
    Vue.mixin({
      data() {
        return {
          operateEles: null,
          timeOutEvent: 0
        }
      },
      methods: {
        /** touchstart && touchmove 监听长按事件 */
        onImgtouchstart(e) {
          console.log(e.target || e.srcElement)
          let target = e.target || e.srcElement
          let image = target.getAttribute('src')
          if (!image) {
            return
          }
          let me = this
          this.timeOutEvent = setTimeout(() => {
            me.longPress(image)
          }, 500)
        },
        onImgtouchmove(e) {
          clearTimeout(this.timeOutEvent)
        },
        onImgtouchend(e) {
          clearTimeout(this.timeOutEvent)
        },
        // onImgclick (e) {
        //   console.log(111222)
        //   clearTimeout(this.timeOutEvent)
        // },
        longPress(data) { // 长按事件
          this.$operate({
            data: data
          })
        },
        initOperate(gallerySelector) {
          this.operateEles = document.querySelectorAll(gallerySelector)
          for (var i = 0, l = this.operateEles.length; i < l; i++) {
            this.operateEles[i].setAttribute('data-pswp-uid', i + 1)
            this.operateEles[i].ontouchstart = this.onImgtouchstart
            this.operateEles[i].ontouchmove = this.onImgtouchmove
            this.operateEles[i].ontouchend = this.onImgtouchend
            // this.operateEles[i].onclick = this.onImgclick
          }
        }
      },
      mounted() {
        this.initOperate('img[down]')
      }
    })
  }
}
export default OperatePlugin
