<template>
  <div class="btnConfimList"
       v-show="show">
    <div class="btnConfimListMask"
         @click="setShow(false)"></div>
    <transition name="transTop">
      <div class="btnConfimListContent">
        <ul>
          <li class="borderT">
            {{title}}
          </li>
          <li v-if="type === 'saveImg'"
              class="borderT"
              @click="saveImg()"
              style="color: var(--mRed);">保存</li>
        </ul>
        <p class="cancelDeleteImage"
           @click="setShow(false)">取消</p>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  props: {
    type: {
        type: String,
        default: 'saveImg'
    },
    title: {
        type: String,
        default: '保存该图片到本地相册？'
    },
    btnTxt: {
        type: String,
        default: '保存'
    },
    data: {
        type: String
    }
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    setShow (data) {
      this.show = data
    },
    saveImg () {
      console.log(this.data, 'img')
      window.isInAndroid && window.WanAndroid.saveQRtoGallery(this.data)
      this.setShow(false)
      this.$toast('保存成功')
    }
  }
}
</script>
<style lang="less">
</style>
