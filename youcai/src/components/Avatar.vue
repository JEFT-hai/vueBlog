<template>
  <div :class="['userAvatar', sizeClass]"
       @click="goUserDetail">
    <img class="weui-media-box__thumb userPhoto"
         :class="{defaultAvatar:!item.avatar}"
         v-lazy="avatarPath"
         alt='用户头像'
         v-if="item != null && !isItemOnly" />
    <img class="weui-media-box__thumb userPhoto"
         :class="{defaultAvatar:!item.avatar}"
         :src="item.avatar"
         v-if="item != null && isItemOnly" />
    <span class="groupName"
          v-if="isGroupChat">{{groupIdentify === 2 ? '群主' : groupIdentify === 1 ? '管理员' : '成员'}}</span>
    <div v-if="authOptions.show && item.autheType === 1"
         :class="['authentication', {hasABorder:authOptions.hasBorder}]">
      <i :class="['authenticationTxt',fontClass]">v</i>
    </div>
    <div class="hangerImgWrap"
         v-if="curHanger.name">
      <img class="hangerImg"
           :src="curHanger.path"
           :alt="curHanger.name">
    </div>
  </div>
</template>

<script>
import headHanger from '@/assets/js/headHanger'
export default {
  props: {
    item: {
      type: Object,
      required: false
    },
    size: { // avatar的大小 0 6.4 | 1 10 | 2 12 | 3 21 | 4 9.07 | 5 5
      type: Number,
      default: 1
    },
    authOptions: { // 认证
      type: Object,
      default: function () {
        return {
          show: true, // 是否显示认证logo
          hasBorder: false, // 认证logo是否有边框
          fontSize: 0, // 字体
        }
      }
    },
    canClick: {
      type: Boolean,
      default: true
    },
    isUserMessage: {
      type: Boolean,
      default: false
    },
    isComment: { // 是评论
      type: Boolean,
      default: false
    },
    isGroupChat: { // 表示是群组聊天的页面
      type: Boolean,
      default: false
    },
    groupIdentify: {
      type: Number // 表示群的身份
    },
    isItemOnly : { // 表示如果是发现内页头像需要改变，那么不用 v-lazy
      type: Boolean,
      default: false 
    },
    hanger: {
      type: Object,
      default: function() {
        return {}
      }
    },
    showOwnHanger: {
      type: Boolean,
      default: true
    },
    isMyHome: {
      type: Boolean,
      default: false, // 表示我的页面
    }
  },
  data () {
    return {
      defaultUserAvatar: require('@/assets/images/userBg.jpg'),
      headHanger: headHanger
    }
  },
  computed: {
    avatarPath () {
      let avatar = this.item.avatar
      return (avatar && avatar.length >= 1 && avatar.indexOf('http') === 0 && avatar !== this.$store.state.avatarDefault) ? (avatar) : this.defaultUserAvatar
    },
    sizeClass () {
      return `size${this.size}`
    },
    fontClass () {
      return `fontSize${this.authOptions.fontSize}`
    },
    ownHangerName () {
      let avatar = this.avatarPath
      if (avatar.indexOf('?name=') > 0){
        return avatar.split('?name=')[1]
      }
      return ''
    },
    curHanger () {
      return  this.showOwnHanger ? this.getHanger() : this.hanger
    }
  },
  methods: {
    getHanger () {
      let me = this
      let itm = {}
      for (let key in headHanger) {
        headHanger[key].map((item) => {
          item.name === me.ownHangerName && (itm = item)
        })
      }
      return itm
    },
    goUserDetail (e) {
      if (!this.canClick) {
        return
      }
      e.stopProgapation()
      if (this.isMyHome) {
        this.$router.push({
          name: 'my_set'
        })
      }
      if (this.isUserMessage) {
        this.$emit('goHome')
        return
      }
      if (this.isComment) {
        this.$emit('goUserHome', this.item)
        return
      }
      // if (!this.canClick) {
      //   return
      // }
      console.log('gogogo')
      this.go.user(this.item.userId)
    }
  }
}
</script>

<style lang='less' scoped>
.userAvatar {
  position: relative;
  width:10vw;
  height:10vw;
  border-radius: 50%;
  .hangerImgWrap{
    position: absolute;
    width: 122%;
    height: 122%;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    .hangerImg{
      width: 100%;
      height: 100%;
    }
  }
  &.size0{
    width: 6.4vw !important;
    height: 6.4vw !important;
  }
  &.size1{
    width: 10vw !important;
    height: 10vw !important;
  }
  &.size2{
    width: 12vw !important;
    height: 12vw !important;
  }
  &.size3{
    width: 21vw !important;
    height: 21vw !important;
  }
  &.size4{
    width: 9.07vw !important;
    height: 9.07vw !important;
  }
  &.size5{
    width: 5vw !important;
    height: 5vw !important;
  }
  &.size19{
    width:19.2vw !important;
    height:19.2vw !important;
  }
  &.size18{
    width:18.5vw !important;
    height:18.5vw !important;
  }
  &.size20{
    width:20.56vw !important;
    height:20.56vw !important;
  }
  &.size9{
    width: 9vw !important;
    height: 9vw !important;
  }
   &.size7{
    width: 7vw !important;
    height: 7vw !important;
  }
  &.size11{
    width: 11.48vw !important;
    height: 11.48vw !important;
  }
  &.size118{
    width: 11.85vw !important;
    height: 11.85vw !important;
  }
  &.size117{
    width: 11.57vw !important;
    height: 11.57vw !important;
  }
  &.size119{
    width: 11.94vw !important;
    height: 11.94vw !important;
  }
  &.size123{
    width: 12.31vw !important;
    height: 12.31vw !important;
  }
  .userPhoto{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    // overflow: hidden;
  }
  .groupName{
    position:absolute;
    bottom:-2vw;
    left:0;
    right:0;
    margin:0 auto;
    padding:0vw 0.5vw;
    box-sizing: border-box;
    border-radius: 2vw;
    font-size:3vw;
    background:rgb(200, 200, 197);
    color:white;
    text-align: center;
  }
  .authentication {
    &.hasABorder{
      padding: 3.6%;
    }
    position: absolute;
    right: 0;
    bottom: 0;
    width: 40%;
    height: 40%;
    z-index:100000;
    border-radius: 50%;
    color: white;
    box-sizing: border-box;
    font-size: 3.7vw;
    font-weight: 500;
    font-family: Times, TimesNR, 'New Century Schoolbook', Georgia, 'New York', serif;
    background: #fff;
    overflow: hidden;
    .authenticationTxt{
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: -webkit-gradient(linear, left top, right bottom, from(#e37782), color-stop(#f56b80), color-stop(#ff5363), color-stop(#ff405b), to(#fc3f58));
      background: linear-gradient(to right bottom, #e37782, #f56b80, #ff5363, #ff405b, #fc3f58);
    }
    .fontSize6{
      font-size:6vw;
    }
  }
}

</style>
