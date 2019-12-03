<template>
  <transition name="fadeIn">
    <div class="uploadWrap"
         v-if="showLoading">
      <div class="uploadInner"
           v-show="type === 0">
        <img src="./loading.gif"
             alt
             class="loadImg">
        <p class="loadDes">{{dataMsg}}</p>
      </div>
      <div class="successInner uploadInner"
           v-show="type === 1">
        <img src="./success.png"
             alt
             class="loadImg">
        <p class="loadDes">{{dataMsg}}</p>
      </div>
      <div class="errorInner uploadInner"
           v-show="type === 2">
        <img src="./error.png"
             alt
             class="loadImg">
        <p class="loadDes">{{dataMsg}}</p>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    type: {
      type: Number, // 0 loading 1 success 2 error
      default: 0
    },
    show: {
      type: Boolean,
      default: false
    },
    msg: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showLoading: ''
    }
  },
  computed: {
    dataMsg() {
      if (this.msg) {
        return this.msg
      } else {
        switch (this.type) {
          case 0:
            return '上传中...'
          case 1:
            return '上传成功'
          case 2:
            return '上传失败'
          default:
            return ''
        }
      }
    }
  },
  watch: {
    type (newV) {
      if (newV === 2 && this.msg) { //  出错
        this.showLoading = false
        this.$alert(this.msg)
      }
    },
    show (newV) {
      if (this.type === 2) {
        this.showLoading = false
      } else {
        this.showLoading = newV
      }
      return newV
    }
  }
}
</script>
<style lang="less" scoped>
.uploadWrap {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 10000;
  &.fadeIn-enter-active,&.fadeIn-leave-active {
    transition: all .1s ease-out;
  }
  &.fadeIn-enter,&.fadeIn-leave-to {
    opacity: 0;
  }
  .uploadInner {
    position: absolute;
    width: 40vw;
    height: 40vw;
    top: 30vh;
    left: 30vw;
    text-align: center;
    padding-top: 8vw;
    border-radius: 3vw;
    background: rgba(0, 0, 0, 0.8);
  }
  .loadImg {
    display: inline-block;
    width: 14vw;
    height: 14vw;
    margin-bottom: 3vw;
  }
  .loadDes {
    font-size: 4.4vw;
    color: #fff;
    letter-spacing: 2px;
  }
}
</style>
