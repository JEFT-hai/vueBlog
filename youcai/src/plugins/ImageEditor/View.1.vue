<template>
  <div id="dragableMask" v-show="isShow" @click="isShow=false">
    <div class="container" @click.stop="">
      <div class="holder" :style="{'width': this.container.width + 'px', 'height': this.container.height + 'px'}">
        <img
          :src="src"
          @mousedown.prevent="dragBegin"
          @touchstart.prevent="dragBegin"
          @mouseup.prevent="dragEnd"
          @touchend.prevent="dragEnd"
          class="img"
          :style="{'transform': transform}"
          alt=""
        >
      </div>
    </div>
    <div class="switcher" @click.stop="" v-if="showSwitcher">
      <i class="icon iconsns icon-fullscreen" @click="fullSize=true" v-if="!fullSize"></i>
      <i class="icon iconsns icon-fullscreen-exit" @click="fullSize=false" v-if="fullSize"></i>
    </div>
    <pre class="log">
scale: {{style.scale}}
{{log}}
    </pre>
    <img id="preview" />
  </div>
</template>

<style lang="less">
#dragableMask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  background-color: rgba(0,0,0,.6);
  border-top: 60px solid transparent;
  .container {
    width: 100vw;
    height: 100vw;
    outline: 1px solid #fff;
    background-color: #f1f1f1;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .switcher {
    position: relative;
    left: 10px;
    margin-top: -10vw;
    z-index: 100;
  }
  .holder {
    outline: 2px solid yellow;
    overflow: hidden;
    position: relative;
  }
  .img {
    position: relative;
    z-index: 8;
    will-change: transform, scale, left, top;
    max-width: inherit;
  }
  .log {
    margin-top: 10vw;
    background-color: #f1f1f1;
    padding: 5px;
  }
  #preview {
    z-index: 10;
    background-color: rgba(255, 255, 255, 0.2);
    bottom: 10vw;
    width: 40vw;
    left: 30vw;
    border: 1px solid salmon;
  }
}
</style>

<script>
import helper from './helper.js'
export default {
  data () {
    return {
      src: '',
      isShow: false,
      promise: {
        resolve: null,
        reject: null
      },
      dragging: false,
      draggingLock: true,
      resizing: false,
      fullSize: true,
      elmentScale: 1,
      element: {
        width: 0,
        height: 0
      },
      start: {
        element: { x: 0, y: 0, scale: 1 },
        mouse1: { x: 0, y: 0 },
        mouse2: { x: 0, y: 0 }
      },
      current: {
        element: { x: 0, y: 0, scale: 1 },
        mouse1: { x: 0, y: 0 },
        mouse2: { x: 0, y: 0 }
      },
      style: {
        scale: 1
      },
      container: {
        max: 0,
        width: 0,
        height: 0
      },
      log: ''
    }
  },
  computed: {
    transform () {
      return 'scale(' + this.style.scale + ',' + this.style.scale + ')'
    },
    showSwitcher () {
      return !isNaN(this.element.width) && this.element.width >= 1 &&
        !isNaN(this.element.height) && this.element.height >= 1 &&
        (this.element.width >= this.element.height * 4 / 3 || this.element.height >= this.element.width * 4 / 3)
    }
  },
  watch: {
    fullSize (isFullSize) {
      if (isFullSize) {
        this.container.width = this.container.max
        this.container.height = this.container.max
      } else {
        if (this.element.width > this.element.height) {
          this.container.width = this.container.max
          this.container.height = this.container.max * 3 / 4
        } else {
          this.container.width = this.container.max * 3 / 4
          this.container.height = this.container.max
        }
      }
      this.reset(this.element.width, this.element.height, isFullSize)
    }
  },
  methods: {
    showFile (file) {
      let me = this
      helper.compress(file, { type: 'file', compress: { width: 1024, height: 1024, quality: 0.9 } }, function (blob) {
        let fr = new FileReader()
        fr.onload = function (e) {
          me.show(e.target.result)
        }
        fr.readAsDataURL(blob)
      })
      return new Promise((resolve, reject) => {
        this.promise.resolve = resolve
        this.promise.reject = reject
      })
    },
    show (src) {
      let me = this
      this.src = this.Utility.getImagePath(src)
      let img = new Image()
      img.onload = function (e) {
        img = null
        me.container.max = document.documentElement.offsetWidth
        me.container.width = me.container.max
        me.container.height = me.container.max
        me.element.width = this.width
        me.element.height = this.height
        me.fullSize = true
        me.reset(this.width, this.height, true)
      }
      img.src = this.src
      this.isShow = true
      return new Promise((resolve, reject) => {
        this.promise.resolve = resolve
        this.promise.reject = reject
      })
    },
    reset (width, height, fullSize) {
      let me = this
      let $img = me.$el.querySelector('img')
      let scale = me.getMinScale(fullSize, width, height)
      let fixLeft = -1 * width * (1 - scale) / 2
      let fixTop = -1 * height * (1 - scale) / 2
      let offsetLeft = width > height ? (-1 * (width * scale - this.container.max) / 2) : 0
      let offsetTop = width > height ? 0 : (-1 * (height * scale - this.container.max) / 2)
      this.style.scale = scale
      $img.style.left = offsetLeft + fixLeft + 'px'
      $img.style.top = offsetTop + fixTop + 'px'
      me.update()
    },
    dragBegin (e) {
      document.documentElement.addEventListener('mousemove', this.dragMove, true)
      document.documentElement.addEventListener('touchmove', this.dragMove, true)
      let me = this
      let $img = me.$el.querySelector('img')
      this.start.element.x = $img.offsetLeft
      this.start.element.y = $img.offsetTop
      this.start.element.scale = me.style.scale
      let isResize = e.type.indexOf('touch') !== -1 && e.touches.length === 2
      if (isResize) {
        me.resizing = true
        this.start.mouse1.x = e.touches[0].pageX
        this.start.mouse1.y = e.touches[0].pageY
        this.start.mouse2.x = e.touches[1].pageX
        this.start.mouse2.y = e.touches[1].pageY
      } else {
        me.dragging = true
        me.draggingLock = true
        let ps = me.getMoustPosition(e)
        this.start.mouse1.x = ps[0]
        this.start.mouse1.y = ps[1]
      }
    },
    dragMove (e) {
      let me = this
      if (me.resizing) {
        this.current.mouse1.x = e.touches[0].pageX
        this.current.mouse1.y = e.touches[0].pageY
        this.current.mouse2.x = e.touches[1].pageX
        this.current.mouse2.y = e.touches[1].pageY
        let startDistance = me.getDistance(this.start.mouse1, this.start.mouse2)
        let currentDistance = me.getDistance(this.current.mouse1, this.current.mouse2)
        let scale = (currentDistance / startDistance) * me.start.element.scale
        let minScale = me.getMinScale(this.fullSize, this.element.width, this.element.height)
        if (scale < minScale || scale > 4) {
          return
        }
        this.style.scale = scale
      } else if (me.dragging) {
        let ps = me.getMoustPosition(e)
        this.current.mouse1.x = ps[0]
        this.current.mouse1.y = ps[1]
        let diffX = this.current.mouse1.x - this.start.mouse1.x
        let diffY = this.current.mouse1.y - this.start.mouse1.y
        if (me.draggingLock) {
          if (Math.abs(diffX) < 10 && Math.abs(diffY) < 10) {
            return
          } else {
            me.draggingLock = false
          }
        }
        let $img = me.$el.querySelector('img')
        $img.style.left = me.start.element.x + diffX + 'px'
        $img.style.top = me.start.element.y + diffY + 'px'
      }
    },
    dragEnd (e) {
      document.documentElement.removeEventListener('mousemove', this.dragMove, true)
      document.documentElement.removeEventListener('touchmove', this.dragMove, true)
      let me = this
      if (me.resizing) {
        me.resizing = false
      } else {
        me.dragging = false
        me.draggingLock = true
      }
      let $img = me.$el.querySelector('img')
      let scale = me.style.scale
      let x0 = $img.offsetLeft + ($img.offsetWidth / 2) - ($img.offsetWidth * scale / 2)
      let x1 = $img.offsetLeft + ($img.offsetWidth / 2) + ($img.offsetWidth * scale / 2)
      let y0 = $img.offsetTop + ($img.offsetHeight / 2) - ($img.offsetHeight * scale / 2)
      let y1 = $img.offsetTop + ($img.offsetHeight / 2) + ($img.offsetHeight * scale / 2)
      this.log = JSON.stringify([x0, x1, y0, y1])
      if (x0 > 0) {
        $img.style.left = ($img.offsetWidth * scale - $img.offsetWidth) / 2 + 'px'
      }
      if (x1 < this.container.width) {
        $img.style.left = this.container.width - $img.offsetWidth - ($img.offsetWidth * scale - $img.offsetWidth) / 2 + 'px'
      }
      if (y0 > 0) {
        $img.style.top = ($img.offsetHeight * scale - $img.offsetHeight) / 2 + 'px'
      }
      if (y1 < this.container.height) {
        $img.style.top = this.container.height - $img.offsetHeight - ($img.offsetHeight * scale - $img.offsetHeight) / 2 + 'px'
      }
      me.update()
    },
    update () {
      let me = this
      document.getElementById('preview').setAttribute('src', me.getResult())
    },
    getMinScale (fullSize, width, height) {
      if (fullSize) {
        return this.container.max / Math.min(width, height)
      } else {
        if (width > height) {
          return this.container.height / height
        } else {
          return this.container.width / width
        }
      }
    },
    getMoustPosition (e) {
      if (e.type.indexOf('touch') !== -1) {
        return [
          e.changedTouches[0].clientX,
          e.changedTouches[0].clientY
        ]
      } else {
        return [
          e.pageX || e.clientX + document.documentElement.scrollLeft,
          e.pageY || e.clientY + document.documentElement.scrollTop
        ]
      }
    },
    getDistance (start, end) {
      return Math.sqrt(Math.pow((end.x - start.x), 2) + Math.pow((end.y - start.y), 2))
    },
    getResult () {
      let me = this
      let $img = me.$el.querySelector('img')
      let dstX = 0
      let dstY = 0
      let dstW = me.container.width // 512
      let dstH = me.container.height // 512
      let scale = me.style.scale
      let x0 = $img.offsetLeft + ($img.offsetWidth / 2) - ($img.offsetWidth * scale / 2)
      let y0 = $img.offsetTop + ($img.offsetHeight / 2) - ($img.offsetHeight * scale / 2)
      // let yFix = document.documentElement.offsetWidth * 0.2
      let srcX = Math.abs(x0) / scale
      let srcY = Math.abs(y0) / scale
      let srcW = me.container.width / scale
      let srcH = me.container.height / scale
      this.log = JSON.stringify([scale, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH])
      return me.getImageDataurl($img, scale, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH)
    },
    getImageDataurl ($img, scale, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH) {
      let canvas = document.createElement('canvas')
      canvas.width = dstW
      canvas.height = dstH
      let ctx = canvas.getContext('2d')
      ctx.imageSmoothingEnabled = true
      ctx.drawImage($img, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH)
      return canvas.toDataURL('image/png')
    },
    hideMe () {
      this.isShow = false
    }
  }
}
</script>
