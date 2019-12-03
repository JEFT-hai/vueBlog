<template>
  <div class="userImageUploaderPage">
    <ul ref='imgList'
        class="imgList">
      <li ref='imgItem'
          class="imgCoverItem"
          v-for='(item, index) in allList'
          :key='index'
          @click="deleteImage(index)"
          :data-index='index'>
        <img :id="'avarimgs' + index"
             :src="item">
        <p class='iconWanwan iconWtouxiang'
           v-show="userAvatarIndex === index"></p>
      </li>
      <li v-show="allList.length < maxLength"
          class="imgCoverItem upLoadImageWrapper iconWxinjian iconWanwan">
        <input ref='upLoadImageFile'
               id='upLoadImage'
               type='file'
               accept="image/*"
               multiple='multiple'
               @change="change" />
      </li>
    </ul>
    <p>
      <span>{{msg}}</span>
      <span></span>
    </p>
    <div class="btnConfimList"
         v-show="DeleteImageMask">
      <div class="btnConfimListMask"
           @click='setDelete(false)'></div>
      <transition name="transTop">
        <div class="btnConfimListContent">
          <ul>
            <li class="borderT">删除图片/设置头像</li>
            <li class="borderT"
                @click='setDelete(true)'
                style="color: var(--mRed);">删除</li>
            <li class="borderT"
                @click='setAvatar(true)'
                style="color: var(--mRed);">设为头像</li>
          </ul>
          <p class="cancelDeleteImage"
             @click='setDelete(false)'>取消</p>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
/** 上传用户照片墙组件
 * 1. 限制用户上传上限，普通用户3张，vip8张，满上限隐藏 +Item
 * 2. 点击图片，弹出操作选项, 删除头像/设为头像
 * 3. 默认第一张为头像，如果删除头像，重置第一张为头像
 * 4. 删除照片拦截，知道保留一张照片
 * 5. toAndroid 初始化 导致android上传图片的数量与类型 8 OR 3 方形, 销毁组件时告知android重置上传图片类型与数量
 */
import { mapState } from 'vuex'
export default {
  data () {
    return {
      userAvatarIndex: 0,
      files: [],
      fileItem: {},
      filesResults: [],
      DeleteImageMask: false,
      target: null,
      startIndex: null,
      zindex: 1,
      leftW: 0,
      targetW: 0,
      clientW: 0,
      targetX: 0,
      targetY: 0,
      targetIndex: null,
      // msg: '点击可删除图片/设置头像，共3张',
      downList: [],
      downIdList: [],
      deleteList: [],
      originDownList: '',
      originUserAvatarIndex: 0
    }
  },
  computed: {
    ...mapState(['user']),
    allList () {
      return this.downList.concat(this.filesResults)
    },
    hasChangeUserImg () {
      return !(this.originDownList === JSON.stringify(this.allList) && this.originUserAvatarIndex === this.userAvatarIndex)
    },
    maxLength () {
      return this.user.vipLevel ? 8 : 3
    },
    msg () {
      return `点击可删除图片/设置头像，共${this.maxLength}张`
    }
  },
  watch: {
    files (newV) {
      this.$emit('upFiles', newV)
      return newV
    },
    deleteList (newV) {
      this.$emit('deleteFiles', newV)
    },
    userAvatarIndex () {
      this.$emit('setAvatar', this.userAvatarIndex)
    },
    allList (newV) {
      this.$emit('allList', newV)
    },
    hasChangeUserImg (newV) {
      this.$emit('hasChange', newV)
    }
  },
  mounted() {
    this.getUserImage()
    window.isInAndroid && window.WanAndroid.imgCropType(2, this.maxLength)
  },
  beforeDestroy () {
    window.isInAndroid && window.WanAndroid.imgCropType(0)
  },
  methods: {
    getUserImage () {
      let me = this
      me.api.get({
        url: 'UserImage',
        success: (res) => {
          res.map((item, index) => {
            me.downList.push(item.imageUrl)
            me.downIdList.push(item.userImageId)
            if (item.imageUrl === me.$store.state.user.avatar) {
              me.userAvatarIndex = index
            }
          })
          me.originDownList = JSON.stringify(me.downList)
          me.originUserAvatarIndex = me.userAvatarIndex
        }
      })
    },
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
            if (me.allList.length >= me.maxLength) {
              me.$toast(`最多上传${me.maxLength}张图片`)
              return
            }
            me.files.push(file)
            me.filesResults.push(e.target.result)
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
      if (data && this.allList.length <= 1) {
        this.$toast('照片墙至少保留一张图片')
        return
      }
      data && this.userAvatarIndex === this.curIndex && (this.userAvatarIndex = 0)
      if (this.curIndex < this.downList.length && data) { // 删除线上网址
        this.downList.splice(this.curIndex, 1) && this.deleteList.push(this.downIdList.splice(this.curIndex, 1))
        this.curIndex = null
        return
      }
      // 删除本地地址
      data && this.curIndex >= 0 && this.files.splice(this.curIndex - this.downList.length, 1) && this.filesResults.splice(this.curIndex - this.downList.length, 1)
      this.curIndex = null
    },
    setAvatar () {
      this.userAvatarIndex = this.curIndex
      this.setDelete(false)
    }
  }
}
</script>
<style lang="less">
  .userImageUploaderPage{
    background: transparent;
    color: #a8a8a8;
    overflow: hidden;
    width: 100%;
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
      margin-left: -1.1vw;
      .imgCoverItem{
        position: relative;
        width: 22vw;
        height: 22vw;
        border-radius: 1.11vw;
        display: inline-block;
        vertical-align: top;
        overflow: hidden;
        margin-left: 1.1vw;
        margin-bottom: 1.1vw;
        text-align: center;
        font-size: 12vw;
        line-height: 22vw;
        color: #fff;
        img{
          width: 100%;
          min-height: 100%;
        }
        p{
          position: absolute;
          height: 5vw;
          width: 5vw;
          top: 0;
          right: 0;
          text-align:center;
          line-height: 6vw;
          font-size: 4vw;
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
