<template>
  <div id="ImageEditor">
    <div class="header">
      <div class="btn_back"><a href="javascript:;" @click="goBack">返回</a></div>
      <div class="text_title">{{Title}}</div>
      <div class="btn_next"><a href="javascript:;" @click="goNext">{{fileIndex + 1 === imageList.length ? '完成' : '下一步'}}</a></div>
    </div>
    <div class="imageContainer" @click.stop="">
      <ImageEditorHolder ref="ImageEditorHolder" :file="imageList[fileIndex]" @getFullSizeAble="getFullSizeAble" :fullSize="fullSize" />
    </div>
    <div class="imageSwitcher" @click.stop="" v-if="fileIndex === 0 && showSwitcher">
      <i class="icon iconsns icon-fullscreen" @click="setFullSize(true)" v-if="!fullSize"></i>
      <i class="icon iconsns icon-fullscreen-exit" @click="setFullSize(false)" v-if="fullSize"></i>
    </div>
    <div class="imagePreview">
    </div>
  </div>
</template>

<style lang="less">
form .weui-cells {
  position: inherit;
}
form .weui-cell {
  position: inherit;
}
#ImageEditor {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  z-index: 99999;
  .header {
    height: var(--navbar-height);
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    justify-content: space-between;
    padding: 0 4.4vw;
    align-items: center;
    .btn_back {
      position: relative;
      padding-left: 12px;
      a {
        display: inline;
        color: transparent;
        text-indent: -100vw;
        &::before {
          position: absolute;
          top: 10px;
          left: 0;
          content: "";
          width: 2.5vw;
          height: 2.5vw;
          color: rgba(0, 0, 0, 0.54);
          border-left: 1px solid currentColor;
          border-top: 1px solid currentColor;
          -webkit-transform: translate3d(0, -50%, 0) rotate(315deg);
          transform: translate3d(0, -50%, 0) rotate(315deg);
        }
      }
    }
    .text_title {
      color: black;
      font-size: 120%;
    }
    .btn_next {
      a {
          display: inline-block;
          background-color: #ff0000;
          padding: 2vw 4vw;
          color: white;
          border-radius: 4vw;
          font-weight: bold;
      }
    }
  }
  .imageContainer {
    position: relative;
    width: 100vw;
    height: 100vw;
    outline: 2px solid #fff;
    background-color: #f1f1f1;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .imageSwitcher {
    position: relative;
    left: 10px;
    margin-top: -10vw;
    z-index: 100;
    i {
      background-color: rgba(255,255,255,0.9);
      overflow: hidden;
      border-radius: 6px;
      padding: 3px;
      border: 1px solid #ddd;
      color: #666;
    }
  }
  .imagePreview {
    position: relative;
    top: 5vw;
    bottom: 10vw;
    left: 5vw;
    width: 20vw;
    height: 20vw;
    background-color: #f1f1f1;
    border: 1px solid salmon;
  }
}
</style>

<script>
import ImageEditorHolder from './ImageEditorHolder'
export default {
  components: {
    ImageEditorHolder
  },
  data () {
    return {
      fileIndex: 0,
      showSwitcher: false,
      fullSize: true
    }
  },
  props: {
    imageList: {
      type: Array,
      required: true,
      default () {
        return []
      }
    }
  },
  mounted () {
    let me = this
    if (!me.imageList || me.imageList.length <= 0) {
      return
    }
    this.fileIndex = 0
    // let file = me.imageList[0]
    return false
    // me.$showImageFileEditor(file).then(async (val) => {
    //   console.log('then')
    //   console.log(val)
    // }).catch((val) => {
    //   me.$msg.showError(val)
    // })
  },
  computed: {
    Title () {
      return (this.fileIndex + 1) + '/' + this.imageList.length + ''
    }
  },
  methods: {
    goNext () {
      // if (this.fileIndex + 1 === this.imageList.length) {
      //   return true // 完成
      // } else {
      // }
      let imageData = this.$refs.ImageEditorHolder.getResult(false)
      let previewData = this.$refs.ImageEditorHolder.getResult(true)
      this.$emit('addImage', { imageData, previewData })
      this.fileIndex++
      if (this.fileIndex >= this.imageList.length) {
        this.$emit('hideEditor')
      }
    },
    goBack () {
      console.log(this.imageList)
      if (this.fileIndex <= 0) {
        this.$emit('hideEditor')
      } else {
        this.fileIndex--
      }
    },
    getFullSizeAble (val) {
      this.showSwitcher = val
    },
    setFullSize (val) {
      console.log('setFullSize')
      this.fullSize = val
      this.$refs.ImageEditorHolder.fullSize = val
    }
  }
}
</script>
