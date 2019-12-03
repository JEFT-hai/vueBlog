<template>
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
</template>

<style lang="less">
#ImageEditor {
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
}
</style>

<script>
import helper from '../plugins/ImageEditor/helper.js'
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
    },
    file (newVal, oldVal) {
      this.showFile(newVal)
    }
  },
  props: {
    file: {
      type: File,
      required: true
    }
  },
  mounted () {
    this.showFile(this.file)
  },
  methods: {
    showFile (file) {
      let me = this
      helper.compress(file, { type: 'file', compress: { width: 2560, height: 2560, quality: 0.9 } }, function (blob) {
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
        me.$emit('getFullSizeAble', this.width >= this.height * 4 / 3 || this.height >= this.width * 4 / 3)
        me.reset(this.width, this.height, true)
      }
      img.src = this.src
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
      document.querySelector('#ImageEditor .imagePreview').innerHTML = '<img src="' + me.getResult(true) + '" />'
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
    getResult (preview) {
      let me = this
      let $img = me.$el.querySelector('img')
      let dstX = 0
      let dstY = 0
      let dstW = me.container.width >= me.container.height ? 1280 : 960
      let dstH = me.container.height >= me.container.width ? 1280 : 960
      if (preview) {
        dstW = me.container.width
        dstH = me.container.height
      }
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
      return canvas.toDataURL('image/jpeg', 0.8) // 'image/png')
    },
    hideMe () {
      this.isShow = false
    },
    setFullsize (val) {
      let me = this
      me.fullSize = val
    }
  }
}
</script>
