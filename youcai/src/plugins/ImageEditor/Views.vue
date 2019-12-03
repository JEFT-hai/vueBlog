<template>
  <div id="ImageEditor">
    <div class="header">
      <div class="btn_back"><a href="javascript:;" @click="Next">返回</a></div>
      <div class="text_title">{{Title}}</div>
      <div class="btn_next"><a href="javascript:;" @click="Next">下一步</a></div>
    </div>
    <div class="imageContainer">
    </div>
    <div class="imagePreview">
    </div>
  </div>
</template>

<style lang="less">
#ImageEditor {
  .header {
    height: var(--navbar-height);
    display: flex;
    justify-items: center;
    .btn_back {
      width: 13.87vw;
      padding: 0 4.4vw;
      &::before {
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
  .imagePreview {
    position: absolute;
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
export default {
  data () {
    return {
      fileIndex: 0
    }
  },
  props: {
    fileList: {
      type: Array,
      required: false,
      default () {
        return []
      }
    }
  },
  computed: {
    Title () {
      return (this.fileIndex + 1) + '/' + this.fileList.length + ''
    }
  },
  methods: {
    Next () {
      if (this.fileIndex + 1 === this.fileList.length) {
        //完成
      } else {
        this.fileIndex++
      }
    }
  }
}
</script>
