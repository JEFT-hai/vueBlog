<template>
  <div class="thumbnail" :style="{width: width}">
    <img
      :src="thumbnail"
      v-if="thumbnail!=null"
      alt
    >
  </div>
</template>

<script>
export default {
  data () {
    return {
      thumbnail: null,
      origin: null
    }
  },
  props: {
    src: {
      type: String,
      required: true
    },
    width: {
      type: String,
      required: true
    }
  },
  created () {
    let $app = document.getElementById('app')
    let fullWidth = $app.offsetWidth
    let me = this
    let imgWidth = parseInt(fullWidth * parseFloat(me.width.replace('vw', '')) / 100)
    let imgSrc = this.src.indexOf('/') !== 0 ? this.src : (this.config.imageOrigin + this.src)
    me.createThumbnail(imgSrc, imgWidth * window.devicePixelRatio, function (result) {
      this.thumbnail = result
    })
  },
  methods: {
    createThumbnail (url, w, callBack) {
      let me = this
      let img = new Image()
      img.onload = function () {
        let $img = this
        let h = parseInt((w * $img.height) / $img.width)
        let canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        let ctx = canvas.getContext('2d')
        // ctx.imageSmoothingEnabled = true
        ctx.drawImage($img, 0, 0, $img.width, $img.height, 0, 0, w, h)
        // let result = canvas.toDataURL('image/png')
        let result = canvas.toDataURL('image/jpeg', 0.8)
        callBack.call(me, result)
      }
      img.setAttribute('crossOrigin', 'Anonymous')
      img.src = url
    }
  }
}
</script>
