<template>
  <div id="dragableContainer">
      <img
        :src="src"
        @load="onLoad"
        @mousedown.prevent="dragBegin"
        @touchstart.prevent="dragBegin"
        @mouseup.prevent="dragEnd"
        @touchend.prevent="dragEnd"
        style="will-change: transform, scale, left, top;" :style="{'transform': transform}"
        alt=""
      >
  </div>
</template>

<style lang="less">
  #dragableContainer {
    position: absolute;
    width: 100vw;
    height: 100vw;
    outline: 1px solid #fff;
    background-color: #f00;
    z-index: 10;
    overflow: hidden;
    margin-top: 60px;
    > img {
      position: relative !important;
    }
  }
</style>

<script>
export default {
  data () {
    return {
      dragging: false,
      draggingLock: true,
      resizing: false,
      resizingScale: 1,
      elmentX: 0,
      elmentY: 0,
      elmentWidth: 0,
      elmentHeight: 0,
      elmentScale: 1,
      mouseX: 0,
      mouseY: 0,
      mouseNewX: 0,
      mouseNewY: 0,
      mouseWidth: 0,
      mouseNewWidth: 0,
      element: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        scale: 1
      },
      limit: {
        minScale: 0,
        maxScale: 0
      },
      start: {
        elementLeft: 0,
        elementTop: 0,
        mouseX: 0,
        mouseY: 0,
        mouseX2: 0,
        mouseY2: 0
      },
      end: {
        x: 0,
        y: 0,
        scale: 1
      },
      style: {
        top: 'inherit',
        left: 'inherit',
        scale: 1
      },
      container: {
        max: 0,
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }
    }
  },
  computed: {
    transform () {
      return 'scale(' + this.style.scale + ',' + this.style.scale + ')'
    }
  },
  props: {
    src: {
      type: String,
      required: true
    },
    containerX: {
      type: Number,
      required: false,
      default: 0
    },
    containerY: {
      type: Number,
      required: false,
      default: 0
    },
    containerWidth: {
      type: Number,
      required: false,
      default: -1
    },
    containerHeight: {
      type: Number,
      required: false,
      default: -1
    }
  },
  created () {
    this.container.max = document.documentElement.offsetWidth
    this.container.width = this.container.max
    this.container.height = this.container.max
    console.log(this.container)
  },
  methods: {
    toggleFullSize () {
      if(this.container.width != this.container.height) {
        if(this.container.width != this.container.max) {
          this.container.width = this.container.max
        }
        if(this.container.height != this.container.max) {
          this.container.height = this.container.max
        }
      } else {
        if (this.element.width > this.element.height) {
          this.container.height = this.container.max * 3 / 4
        } else {
          this.container.width = this.container.max * 3 / 4
        }
      }
      this.style.scale = this.limit.minScale
    },
    onLoad (e) {
      console.log('onLoad')
      let me = this
      let $img = me.$el.querySelector('img')
      this.element.width = $img.offsetWidth
      this.element.height = $img.offsetHeight

      let minScale = Math.min(this.container.max / this.element.width, this.container.max / this.element.height)
      let minScaleFullSize = Math.max(this.container.max / this.element.width, this.container.max / this.element.height)
      
      this.style.scale = minScaleFullSize
      console.log(this.style.scale)
      let fixLeft = -1 * this.element.width * (1 - this.style.scale) / 2
      let fixTop = -1 * this.element.height * (1 - this.style.scale) / 2
      if (this.element.width > this.element.height) {
        $img.style.left = -1 * (this.element.width * this.style.scale - this.container.max) / 2 + fixLeft + 'px'
        $img.style.top = fixTop + 'px'
      } else {
        $img.style.left = fixLeft + 'px'
        $img.style.top = -1 * (this.element.height * this.style.scale - this.container.max) / 2 + fixTop + 'px'
      }
      // $img.style.left = -1 * ($img.offsetWidth - document.documentElement.offsetWidth) / 2 + 'px'
      // $img.style.top = -1 * ($img.offsetHeight - document.documentElement.offsetHeight) / 2 + 'px'
      // let scale = 1.5 * Math.max(document.documentElement.offsetWidth / $img.offsetWidth, document.documentElement.offsetHeight / $img.offsetHeight)
      // $img.style.transform = 'scale(' + scale + ',' + scale + ')'
      // me.elmentScale = scale
      // this.style.scale = 2
    },
    getDragPosition (e) {

    },
    dragBegin (e) {
      // e.preventDefault()
      let me = this
      me.elmentX = me.$el.offsetLeft
      me.elmentY = me.$el.offsetTop

      this.start.x = me.$el.offsetLeft
      this.start.y = me.$el.offsetTop

      if (e.type.indexOf('touch') !== -1 && e.touches.length === 2) {
        me.resizing = true
        me.mouseWidth = me.getTouchesDistance(e) // me.getDistance({ x: e.touches[0].pageX, y: e.touches[0].pageY }, { x: e.touches[1].pageX, y: e.touches[1].pageY })
      } else {
        me.dragging = true
        me.draggingLock = true
        let ps = me.getMoustPosition(e)
        me.mouseX = ps[0]
        me.mouseY = ps[1]
      }
      document.documentElement.addEventListener('mousemove', this.dragMove, true)
      document.documentElement.addEventListener('touchmove', this.dragMove, true)
    },
    dragMove (e) {
      let me = this
      if (me.resizing) {
        me.mouseNewWidth = me.getTouchesDistance(e) // me.getDistance({ x: e.touches[0].pageX, y: e.touches[0].pageY }, { x: e.touches[1].pageX, y: e.touches[1].pageY })
        let scale = (me.mouseNewWidth / me.mouseWidth) * me.element.scale // me.elmentScale
        this.style.scale = scale
        // me.$el.style.transform = 'scale(' + scale + ',' + scale + ')'
        // me.resizingScale = scale
      } else if (me.dragging) {
        let ps = me.getMoustPosition(e)
        me.mouseNewX = ps[0]
        me.mouseNewY = ps[1]
        let diffX = me.mouseNewX - me.mouseX
        let diffY = me.mouseNewY - me.mouseY
        if (me.draggingLock) {
          if (Math.abs(diffX) >= 10 || Math.abs(diffY) >= 10) {
            me.draggingLock = false
          } else {
            return
          }
        }
        me.$el.style.left = me.elmentX + diffX + 'px'
        me.$el.style.top = me.elmentY + diffY + 'px'
      }
    },
    dragEnd (e) {
      let me = this
      document.documentElement.removeEventListener('mousemove', this.dragMove, true)
      document.documentElement.removeEventListener('touchmove', this.dragMove, true)
      if (me.resizing) {
        me.element.scale = me.style.scale
        // me.elmentScale = me.resizingScale
        // me.resizingScale = 1
        me.resizing = false
      }
      me.dragging = false
      me.fixEl(e)
    },
    fixEl (e) {
      let me = this
      let $img = me.$el
      let newWidth = $img.offsetWidth * me.elmentScale
      let newHeight = $img.offsetHeight * me.elmentScale
      if (newWidth < document.documentElement.offsetWidth || newHeight < document.documentElement.offsetHeight) {
        let scale = Math.max(document.documentElement.offsetWidth / $img.offsetWidth, document.documentElement.offsetHeight / $img.offsetHeight)
        $img.style.transform = 'scale(' + scale + ',' + scale + ')'
        me.elmentScale = scale
      }
      let x0 = $img.offsetLeft + ($img.offsetWidth / 2) - ($img.offsetWidth * me.elmentScale / 2)
      let x1 = $img.offsetLeft + ($img.offsetWidth / 2) + ($img.offsetWidth * me.elmentScale / 2)
      let y0 = $img.offsetTop + ($img.offsetHeight / 2) - ($img.offsetHeight * me.elmentScale / 2)
      let y1 = $img.offsetTop + ($img.offsetHeight / 2) + ($img.offsetHeight * me.elmentScale / 2)
      if (x0 > 0) {
        $img.style.left = ($img.offsetWidth * me.elmentScale - $img.offsetWidth) / 2 + 'px'
      }
      if (x1 < document.documentElement.offsetWidth) {
        $img.style.left = document.documentElement.offsetWidth - $img.offsetWidth - ($img.offsetWidth * me.elmentScale - $img.offsetWidth) / 2 + 'px'
      }
      if (y0 > 0) {
        $img.style.top = ($img.offsetHeight * me.elmentScale - $img.offsetHeight) / 2 + 'px'
      }
      if (y1 < document.documentElement.offsetHeight) {
        $img.style.top = document.documentElement.offsetHeight - $img.offsetHeight - ($img.offsetHeight * me.elmentScale - $img.offsetHeight) / 2 + 'px'
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
    getTouchesDistance (e) {
      return this.getDistance({ x: e.touches[0].pageX, y: e.touches[0].pageY }, { x: e.touches[1].pageX, y: e.touches[1].pageY })
    },
    getResult () {
      let me = this
      let $img = this.$el
      let dstX = 0
      let dstY = 0
      let dstW = 512
      let dstH = 512
      let x0 = $img.offsetLeft + ($img.offsetWidth / 2) - ($img.offsetWidth * me.elmentScale / 2)
      let y0 = $img.offsetTop + ($img.offsetHeight / 2) - ($img.offsetHeight * me.elmentScale / 2)
      let yFix = document.documentElement.offsetWidth * 0.2
      let srcX = Math.abs(x0) / me.elmentScale
      let srcY = Math.abs(y0 - yFix) / me.elmentScale
      let srcW = document.documentElement.clientWidth / me.elmentScale
      let srcH = document.documentElement.clientWidth / me.elmentScale
      return me.getImageDataurl($img, me.elmentScale, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH)
    },
    getImageDataurl ($img, scale, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH) {
      let canvas = document.createElement('canvas')
      canvas.width = dstW
      canvas.height = dstH
      let ctx = canvas.getContext('2d')
      ctx.imageSmoothingEnabled = true
      ctx.drawImage($img, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH)
      return canvas.toDataURL('image/png')
    }
  }
}
</script>

<style lang="less">
  @masktop: 20vw;
  #avatar_cropper {
    position: absolute;
    z-index: 1111;
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #000;
    .mask {
      position: absolute;
      z-index: 9;
      border-style: solid;
      border-width: 0;
      border-color: rgba(255, 255, 255, 0.6);
      overflow: hidden;
    }
    .mask_top, .mask_bottom {
      width: 100vw;
      background-color: rgba(0, 0, 0, .6);
    }
    .mask_top {
      top: 0;
      height: @masktop;
      border-bottom-width: 1px;
    }
    .mask_bottom {
      top: calc(100vw + @masktop);
      bottom: 0;
      border-top-width: 1px;
    }
    .mask_left, .mask_right {
      top: @masktop;
      width: 1vw;
      height: 100vw;
    }
    .mask_left {
      left: 0;
      border-left-width: 1px;
    }
    .mask_right {
      right: 0;
      border-right-width: 1px;
    }
    .actions {
      position: absolute;
      z-index: 10;
      bottom: 0;
      display: flex;
      justify-content: space-between;
      padding: 0 4vw;
      width: 100vw;
      >a {
        padding: 4vw;
        line-height: 12vw;
        color: #fff;
      }
    }
    img {
      position: absolute;
      z-index: 8;
      max-width: inherit;
    }
    img.preview {
      z-index: 10;
      background-color: rgba(255, 255, 255, 0.2);
      bottom: 10vw;
      width: 40vw;
      left: 30vw;
      border: 1px solid salmon;
    }
  }
</style>
