<template>
  <div class="imageUploaderPage">
    <div class='ulWrapper'>
      <ul ref='imgList'
          class="imgList"
          :style="ulStyle">
        <li ref='imgItem'
            class="imgCoverItem"
            v-for='(item, index) in allImages'
            :key='index'
            @click="deleteImage(index)"
            :data-index='index'
            @touchstart="touchstart($event, item, index)"
            @touchmove="touchmove($event)"
            @touchend="touchend($event)">
          <img :id="'avarimgs' + index"
               :src="item">
        </li>
        <li ref="imageUploadBtn"
            v-show="showInput"
            class="imgCoverItem upLoadImageWrapper iconWxinjian iconWanwan">
          <input ref='upLoadImageFile'
                 id='upLoadImage'
                 type='file'
                 accept="image/*"
                 multiple="multiple"
                 @change="change" />
        </li>
      </ul>
    </div>
    <p>{{msg}}</p>
    <div class="btnConfimList"
         v-show="DeleteImageMask">
      <div class="btnConfimListMask"
           @click='setDelete(false)'></div>
      <transition name="transTop">
        <div class="btnConfimListContent">
          <ul>
            <li class="borderT">删除该<span>{{type === 'image' ? '图片' : '视频'}}</span>？</li>
            <li class="borderT"
                @click='setDelete(true)'
                style="color: var(--mRed);">删除</li>
          </ul>
          <p class="cancelDeleteImage"
             @click='setDelete(false)'>取消</p>
        </div>
      </transition>
    </div>
    <video style="display: none;"
           ref='video'
           width="200"
           height='200'
           controls="controls">
    </video>
  </div>
</template>
<script>
export default {
  props: {
    canUploadVideo: {
      type: Boolean,
      default: false
    },
    imagesList: { // 传进来的原始的图片
      type: Array,
      default: function () {
        return []
      }
    },
    maxLength: {
      default: 4
    }
  },
  data () {
    return {
      allImages: [],
      allImagesFiles: [],
      type: 'image',
      files: [],
      fileItem: {},
      filesResults: [],
      DeleteImageMask: false,
      // isShow:false,
      startX: 0, // 开始触摸的位置
      startY: 0,
      moveX: 0, // 滑动时的位置
      moveY: 0,
      endX: 0,
      endY: 0, // 结束触摸的位置
      disX: 0, // 移动距离
      disY: 0,
      target: null,
      startIndex: null,
      zindex: 1,
      leftW: 0,
      targetW: 0,
      clientW: 0,
      targetX: 0,
      targetY: 0,
      targetIndex: null,
      inputIndex: 0,
      inputArray: ['1'],
      timeOutEvent: 0,
      canMove: false,
      deleteList: []
    }
  },
  computed: {
    msg () {
      let msg = '可上4张图片/一段视频'
      let me = this
      if (this.type === 'image') {
        if (!this.allImages.length) {
          // this.type = 'image'
          msg = this.canUploadVideo ? `可上传${me.maxLength}张图片, 或一段视频` : `最多可上${me.maxLength}张图片`
        } else if (this.allImages.length >= 2) {
          msg = `点击删除图片, 长按拖拽更改顺序，共${me.maxLength}张`
        } else {
          msg = `点击删除图片, 最多可上传${me.maxLength}张图片`
        }
      }
      return msg
    },
    showInput () { //是否显示添加图片按钮
      return this.type === 'image' && this.allImages.length < this.maxLength
    },
    ulStyle () { // 外层的style
      let num = this.showInput ? 1 : 0
      return {
        width: ( this.allImages.length + num ) * 24 + 'vw'
      }
    }
  },
  watch: {
    files (newV) {
      if (!newV.length) {
        this.type = 'image'
      }
      this.$emit('upFiles', newV, this.type)
      return newV
    },
    allImages (newV) { // 所有的图片
      return newV
    },
    allImagesFiles (newV) {
      this.$emit('allImagesFiles', newV)
      return newV
    },
    imagesList (newV) {
      this.allImages = this.allImages.concat(newV)
      this.allImagesFiles = this.allImagesFiles.concat(newV)
    },
    deleteList (newV) {
      this.$emit('deleteList', newV)
      console.log(newV, 'deleteList')
      return newV
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.leftW = this.$refs.imgList.querySelectorAll('li')[0].getBoundingClientRect().left
    })
  },
  methods: {
    change (e) {
      let me = this
      if (e.target.files[0].type.indexOf('image') >= 0) {
        for (let i = 0; i < e.target.files.length; i++) {
          var reader = new FileReader()
          let file = e.target.files[i]
          reader.onload = function (e) {
            if (me.filesResults.indexOf(e.target.result) >= 0) {
              me.$toast('请勿重复上传')
              return
            }
            if (me.allImages.length >= me.maxLength) {
              me.$toast(`最多上传${me.maxLength}张图片`)
              return
            }
            me.allImagesFiles.push(file)
            me.allImages.push(e.target.result)
          }
          reader.readAsDataURL(file)
        }
      }
      e.target.value = ''
    },
    deleteImage (index) {
      this.curIndex = index
      this.DeleteImageMask = true
    },
    setDelete (data) {
      this.DeleteImageMask = false
      let deleteItem = this.allImages.slice(this.curIndex, this.curIndex + 1)[0]
      if (data) {
        if (deleteItem.indexOf('http') >= 0) { // 网络地址
          this.deleteList.push(deleteItem)
          this.curIndex >= 0 && this.allImages.splice(this.curIndex, 1) && this.allImagesFiles.splice(this.curIndex, 1)
        } else { // 本地地址
          this.curIndex >= 0 && this.allImages.splice(this.curIndex, 1) && this.allImagesFiles.splice(this.curIndex, 1)
        }
        this.inputIndex += 1
        this.inputArray.push(this.inputIndex)
      }
      this.curIndex = null
    },
    longPress (e, item, index) {
      this.canMove = true
      this.startIndex = index
      this.targetIndex = index
      this.target = e.target.nodeName.toLowerCase() === 'li' ? e.target : e.target.parentNode
      this.target.style.border = '1px solid #f9f9f9'
      !this.leftW && (this.leftW = this.target.parentNode.querySelectorAll('li')[0].getBoundingClientRect().left)
      !this.topH && (this.topH = this.target.parentNode.querySelectorAll('li')[0].getBoundingClientRect().top)
      !this.targetW && (this.targetW = this.target.offsetWidth)
      !this.clientW && (this.clientW = this.leftW + this.targetW)
      this.zindex++
      this.target.style.zIndex = this.zindex
      this.startX = e.touches[0].clientX
      this.startY = e.touches[0].clientY
    },
    touchstart (e, item, index) {
      let me = this
      this.timeOutEvent = setTimeout(() => {
          me.longPress(e, item, index)
      }, 300)
    },
    touchmove (ev) {
      clearTimeout(this.timeOutEvent)
      if (!this.canMove) {
        this.startX = 0
        this.startY = 0
        this.startIndex = null
        this.targetIndex = null
        return
      }
      ev = ev || window.event
      ev.preventDefault()
      if (ev.touches.length === 1) {
        this.moveX = ev.touches[0].clientX
        this.moveY = ev.touches[0].clientY
        this.disX = this.moveX - this.startX
        this.disY = this.moveY - this.startY
        // 边界处理
        this.disY <= 0 && (this.disY = 0)
        this.disY >= (this.$refs.imgList.offsetHeight - this.clientW) && (this.disY = this.$refs.imgList.offsetHeight - this.clientW)
        this.target.style.transform = 'translate3d(' + this.disX + 'px,' + this.disY + 'px, 0)'
        this.target.getBoundingClientRect().left <= 0 && (this.target.style.transform = 'translate3d(' + (-this.clientW * this.startIndex) + 'px,' + this.disY + 'px, 0)')
        this.target.getBoundingClientRect().right >= this.$refs.imgList.offsetWidth && (this.target.style.transform = 'translate3d(' + this.clientW * (3 - this.startIndex) + 'px,' + this.disY + 'px, 0)')
        for (let i = 0; i < this.allImages.length; i++) {
          // && this.moveY > this.$refs.imgItem[i].getBoundingClientRect().top && this.moveY < this.$refs.imgItem[i].getBoundingClientRect().top + this.targetW
          if (this.moveX >= this.$refs.imgItem[i].getBoundingClientRect().left && this.moveX < this.$refs.imgItem[i].getBoundingClientRect().left + this.targetW && (i !== this.startIndex)) {
            if (i > this.targetIndex && this.moveX >= this.$refs.imgItem[i].getBoundingClientRect().left && this.moveX < this.$refs.imgItem[i].getBoundingClientRect().left + this.targetW) {
              if (this.$refs.imgItem[i].style.transform) {
                if (this.$refs.imgItem[i].style.transform === 'translate3d(0px, 0px, 0px)') {
                  this.$refs.imgItem[i].style.transform = 'translate3d(' + (-this.clientW) + 'px, 0, 0)'
                  this.targetIndex = i
                } else {
                  this.$refs.imgItem[i].style.transform = 'translate3d(0px, 0px, 0px)'
                  this.targetIndex = i - 1
                }
              } else {
                this.$refs.imgItem[i].style.transform = 'translate3d(' + (-this.clientW) + 'px, 0, 0)'
                this.targetIndex = i
              }
            } else if (i < this.targetIndex && this.moveX >= this.$refs.imgItem[i].getBoundingClientRect().left && this.moveX < this.$refs.imgItem[i].getBoundingClientRect().left + this.targetW) {
              if (this.$refs.imgItem[i].style.transform) {
                if (this.$refs.imgItem[i].style.transform === 'translate3d(0px, 0px, 0px)') {
                  this.$refs.imgItem[i].style.transform = 'translate3d(' + (this.clientW) + 'px, 0, 0)'
                  this.targetIndex = i
                } else {
                  this.$refs.imgItem[i].style.transform = 'translate3d(0px, 0px, 0px)'
                  this.targetIndex = i + 1
                }
              } else {
                this.$refs.imgItem[i].style.transform = 'translate3d(' + (this.clientW) + 'px, 0, 0)'
                this.targetIndex = i
              }
            } else {
              this.targetIndex > this.startIndex && (this.targetIndex = i - 1)
              this.targetIndex < this.startIndex && (this.targetIndex = i + 1)
            }
          }
        }
      }
    },
    touchend (e) {
      if (!this.canMove) {
        return
      } else {
        this.canMove = false
      }
      this.target.style.border = 'none'
      this.target.style.transform = 'translate3d(' + (this.targetIndex - this.startIndex) * (this.leftW + this.targetW) + 'px,' + this.targetY + 'px, 0)'
      let start = this.allImages.splice(this.startIndex, 1)[0]
      start && this.allImages.splice(this.targetIndex, 0, start)
      let startItem = this.allImagesFiles.splice(this.startIndex, 1)[0]
      startItem && this.allImagesFiles.splice(this.targetIndex, 0, startItem)
      for (let i = 0; i < this.allImages.length; i++) {
        this.$refs.imgItem[i].style.transform = 'none'
      }
    }
  }
}
</script>
<style lang="less">
  .imageUploaderPage{
    background: #f0f0f3;
    color: #a8a8a8;
    overflow: hidden;
    .ulWrapper{
      width: 100%;
      overflow-x: scroll;
    }
    overflow-x: scroll;
    p{
        text-align: center;
        color: #a7a7a7;
        height: 4.07vw;
        line-height: 4.07vw;
        font-size: var(--mText);
        margin-bottom: var(--nText);
    }
    .imgList{
      padding: 2.78vw 0;
      font-size: 0;
      position: relative;
      min-height: 30.2vw;
      .imgCoverItem{
        position: relative;
        width: 22.25vw;
        height: 22.25vw;
        border-radius: 1.11vw;
        display: inline-block;
        vertical-align: top;
        overflow: hidden;
        margin-left: 1.4vw;
        margin-bottom: 1.4vw;
        text-align: center;
        font-size: 12vw;
        line-height: 23.25vw;
        color: #fff;
        img{
          width: 100%;
          min-height: 100%;
        }
      }
      .upLoadImageWrapper{
        position: relative;
        background: #e0e0e0;
        #upLoadImage{
          position: absolute;
          outline: none;
          z-index: 1;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
        }
      }
    }
  }
</style>
