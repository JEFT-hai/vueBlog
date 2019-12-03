<template>
  <div class="myPluginSharePage">
    <transition name="fadeIn">
      <div class="mask" v-show="show" @touchstart="cancelShare"></div>
    </transition>
    <transition name="sharePlay">
      <div class="share" v-show="show">
        <div class="userShare">
          <span class="shareTo">分享给</span>
          <div class="PluginShareWrap">
            <ul class="pluginShareUl oneUl">
              <li class="pluginShareLi" @click="share('weixin', 0)">
                <span class="weixinBtn pluginShareBtn">
                  <i class="iconWanwan iconWweixinfenxiang"></i>
                </span>
                <span class="shareTitle">微信好友</span>
              </li>
              <li class="pluginShareLi" @click="share('weixin', 1)">
                <span class="friendsBtn pluginShareBtn">
                  <i class="iconWanwan iconWweixinpengyouquan"></i>
                </span>
                <span class="shareTitle">朋友圈</span>
              </li>
              <li class="pluginShareLi" @click="shareFirentGroup">
                <span class="innerBtn pluginShareBtn">
                  <i class="iconWanwan iconWzhifeiji whiteFont"></i>
                </span>
                <span class="shareTitle">好友和群组</span>
              </li>
            </ul>
            <ul class="pluginShareUl twoUI">
              <li class="pluginShareLi" @click="copy">
                <span class="whiteBtn pluginShareBtn">
                  <i class="iconWanwan iconWfuzhilianjie whiteFont"></i>
                </span>
                <span class="shareTitle">复制链接</span>
              </li>
              <li
                class="pluginShareLi"
                @click="toReport(item)"
                v-if="!isDelete && !isDeleteActivity && !isMy"
              >
                <span class="whiteBtn pluginShareBtn">
                  <i class="iconWanwan iconWjubao1 whiteFont"></i>
                </span>
                <span class="shareTitle">举报</span>
              </li>
              <li
                class="pluginShareLi"
                v-if="!isDelete && !isDeleteActivity && !isMy"
                @click="noLike"
              >
                <span class="whiteBtn pluginShareBtn">
                  <i class="iconWanwan iconWicon1 whiteFont"></i>
                </span>
                <span class="shareTitle">不感兴趣</span>
              </li>
              <li class="pluginShareLi" v-if="isDelete" @click="deletePicture">
                <span class="whiteBtn pluginShareBtn">
                  <i class="iconWanwan iconWshanchu1 whiteFont"></i>
                </span>
                <span class="shareTitle">删除</span>
              </li>

              <li
                class="pluginShareLi"
                v-if="isDeleteActivity"
                @click="deleteActivity"
              >
                <span class="whiteBtn pluginShareBtn">
                  <i class="iconWanwan iconWshanchu1 whiteFont"></i>
                </span>
                <span class="shareTitle">删除</span>
              </li>
              <li class="pluginShareLi whitePosition" v-if="isDelete">
                <span class="shareTitle"></span>
              </li>
              <li class="pluginShareLi whitePosition" v-if="isDeleteActivity">
                <span class="shareTitle"></span>
              </li>
              <li class="pluginShareLi whitePosition" v-if="isMy">
                <span class="shareTitle"></span>
              </li>
              <li class="pluginShareLi whitePosition" v-if="isMy">
                <span class="shareTitle"></span>
              </li>
            </ul>
          </div>
          <span class="userCancel" @click="cancelShare">取消</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Share',
  props: {
    isDeleteActivity: {
      type: Boolean,
      defualt: false
    },
    item: {
      type: Object,
      default: null
    },
    isDelete: {
      type: Boolean,
      default: false,
      required: false
    },
    router: {
      type: Object,
      default: null
    },
    KeyW: {
      type: String,
      defalut: '',
      require: true
    },
    path: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'discover'
    },
    show: {
      type: Boolean,
      defalut: false
    },
    innerObj: {
      type: Object
    }
  },
  data() {
    return {
      shares: {},
      isFormal: true
      // 添加一个属性 show，来动态控制 这个组件的显示和隐藏, 默认是隐藏的
    }
  },
  computed: {
    isMy() {
      return this.innerObj && this.innerObj.name === 'my';
    },
    prifix() {
      // 前缀
      return this.isFormal
        ? 'http://webapp.szwanwan.com/#'
        : 'http://testapp.szwanwan.com/#';
    },
    miniPath() {
      let path = '';
      switch (this.type) {
        case 'vote': // 投票详情
          path = `/pages/votes/votes?id=${this.item.activityId}`
          break;
        case 'voteDetail': // 投票Item详情
          path = `/pages/voteDetail/voteDetail?itemId=${this.item.postId}`
          break;
        case 'discover': // 动态详情
          path = `/pages/postDetail/postDetail?id=${this.item.postId}&postType=1`
          break;
        case 'activity': // 活动详情
          path = `/pages/activiityDetail/activiityDetail?id=${this.item.activityId}`
          break;
        case 'user': // 个人详情
          path = `/pages/userInfo/userInfo?userId=${this.item.userId}`
          break;
        case 'groupInfo': // 群组
        case 'chatSettings':
          path = `/pages/groupDetail/groupDetail?id=${this.item.userGroupId}`
          break;
        case 'groupQR': // 群组二维码
          path = `/pages/groupQR/groupQR?id=${this.item.userGroupId}`
          break;
        default:
          break
      }
      return path
    },
    url() {
      if (!this.item) {
        return '';
      }
      let url = '';
      switch (this.type) {
        case 'music':
          url = '/index?tab=music&id=' + this.item.voiceId
          break;
        case 'chatSettings':
          url = `/group/info/${this.item.userGroupId}?share=weixin`
          break;
        case 'discover':
          url = '/discover/item/' + this.item.postId
          break;
        case 'video':
          url = '/discover/videoSwiper/' + this.item.postId
          break;
        default:
          url = this.path
          break;
      }
      return this.prifix + url
    },
    title() {
      if (!this.item) {
        return '';
      }
      let title = '';
      if (this.type === 'discover') {
        title = this.item.categoryTitle
      } else if (this.type === 'video') {
        title = this.item.categoryTitle
      } else if (this.type === 'activity') {
        title = this.item.title
      } else if (this.type === 'topic') {
        title = this.item.title
      } else if (this.type === 'topicItem') {
        title = this.item.title
      } else if (this.type === 'user') {
        title = this.item.nickName || this.item.name
      } else if (this.type === 'music') {
        title = this.item.title
      } else if (this.type === 'groupQR') {
        title = `快来加入【${this.item.groupName}]群组吧`
      } else if (this.type === 'groupInfo' || this.type === 'chatSettings') {
        title = this.item.groupName
      } else if (this.type === 'vote') {
        title = this.item.title
      } else if (this.type === 'voteDetail') {
        title = `[${this.item.title}]投票活动 请支持${this.item.voteSort}号 ${this.item.nickName}`
      }
      title = title ? title.substr(0, 20) : '多录';
      return title
    },
    content() {
      if (!this.item) {
        return '';
      }
      let content = '';
      if (this.type === 'discover') {
        content = this.item.content ? this.item.content : this.item.postTitle
      } else if (this.type === 'video') {
        content = this.item.content
      } else if (this.type === 'activity') {
        if (
          !this.item.details
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/<[^>]+>/g, '')
            .trim()
        ) {
          return '';
        }
        content = this.item.details
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/<[^>]+>/g, '')
          .trim()
      } else if (this.type === 'topic') {
        if (
          !this.item.content
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/<[^>]+>/g, '')
            .trim()
        ) {
          return '';
        }
        content = this.item.content
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/<[^>]+>/g, '')
          .trim()
      } else if (this.type === 'topicItem') {
        content = this.item.content 
      } else if (this.type === 'music') {
        content = this.item.label
      } else if (this.type === 'groupQR') {
        content = '扫一扫二维码, 加入群聊';
      } else if (this.type === 'groupInfo' || this.type === 'chatSettings') {
        content = this.item.groupStatement
      } else if (this.type === 'user') {
        content = '快来关注我吧';
      } else if (this.type === 'vote') {
        content = '快来报名吧';
      } else if (this.type === 'voteDetail') {
        content =
          '正在参与' + this.item.title ? this.item.title : '' + '投票活动';
      }
      content = content ? content.substr(0, 50) : '多录';
      console.log('打印这个type', this.type)
      return content
    },
    thumbGif() {
      if (!this.item) {
        return '';
      }
      let thumbGif = '';
      switch (this.type) {
        case 'voteDetail':
          thumbGif = this.item.imageList[0] || this.item.PictureGif
          break;
        default:
          break
      }
      return thumbGif
    },
    Thumbnail() {
      if (!this.item) {
        return '';
      }
      let thumbnail = '';
      if (this.type === 'discover') {
        thumbnail = this.item.imageList[0]
      } else if (this.type === 'video') {
        thumbnail = this.item.videoCover
          ? this.item.videoCover
          : this.item.avatar
      } else if (this.type === 'activity') {
        thumbnail = this.item.activityImg
      } else if (this.type === 'topic') {
        thumbnail = this.item.avatar
      } else if (this.type === 'topicItem') {
        thumbnail = this.item.image
      } else if (this.type === 'user') {
        thumbnail = this.item.avatar
      } else if (this.type === 'music') {
        thumbnail = this.item.imageUrl
      } else if (this.type === 'groupQR') {
        thumbnail = this.item.QRimg
      } else if (this.type === 'groupInfo' || this.type === 'chatSettings') {
        thumbnail = this.item.groupCover
      } else if (this.type === 'vote') {
        thumbnail = this.item.activityImg
      } else if (this.type === 'voteDetail') {
        thumbnail = this.item.imageList[0] || this.item.avatar
      }
      // thumbnail = thumbnail ? thumbnail : ''
      return (
        thumbnail || 'http://webapp.szwanwan.com/img/default/defaultavatar.png'
      )
    }
  },
  watch: {
    item(newV) {
      return newV
    }
  },
  mounted() {
    window.share = this.share
  },
  methods: {
    share(s, ex) {
      this.hide()
      if (ex === 0 && this.miniPath) {
        // 微信好友  // 小程序里面有页面
        console.log(
          'canMini',
          this.miniPath,
          this.type === 'discover' ? this.content : this.title,
          this.Thumbnail
        )
        console.log(this.item, 'item')
        if (
          this.type === 'user' ||
          this.type === 'groupInfo' ||
          this.type === 'chatSettings'
        ) {
          this.item.type = this.type
          this.item.miniPath = this.miniPath
          console.log(this.item.type)
          window.isInAndroid &&
            window.WanAndroid.wxMiniProgramShortCut(JSON.stringify(this.item))
        } else {
          window.isInAndroid &&
            window.WanAndroid.wxMiniProgram(
              this.miniPath,
              this.type === 'discover' ? this.content : this.title,
              '',
              this.thumbGif ? this.thumbGif : this.Thumbnail
            )
        }
      } else {
        // eslint-disable-next-line
        window.isInAndroid &&
          window.WanAndroid.wxShare(
            this.url,
            this.title,
            this.content,
            this.Thumbnail,
            ex
          )
      }

      if (this.type === 'discover' || this.type === 'video') {
        let shareType = ex + 1
        this.tellShare(shareType)
      }
    },
    hide() {
      this.show = false
    },
    tellShare(shareType) {
      // 告知后台分享的类型与postId
      let me = this
      let data = {
        postId: this.item.postId,
        shareType: shareType
      }
      me.api.put({
        url: 'PostDetails',
        data: data,
        success: function() {},
        error: function() {}
      })
    },
    toReport() {
      let targetId = '';
      if (this.innerObj.topicCommentId) {
        targetId = this.innerObj.topicCommentId
      } else {
        targetId = this.innerObj.objectId
      }
      this.show = false
      this.router.push({
        name: 'report',
        params: { id: targetId, type: 1 }
      })
    },
    // 删除自己的照片
    deletePicture() {
      console.log('删除中')
      let me = this
      me.api.delete({
        url: `Post?id=${me.item.postId}`,
        success: function() {
          me.$toast('删除成功')
          me.hide()
          if (window.history.length >= 1) {
            me.router.go(-1)
          }
          me.hide()
        }
      })
    },
    /**
     * deleteActivity删除活动
     */
    deleteActivity() {
      // return
      let me = this
      me.api.delete({
        url: `Activity?ActivityId=${this.innerObj.objectId}`,
        success: function() {
          me.$toast('删除成功')
          me.hide()
          if (me.isPath && me.isPath.name === 'activityHome') {
            me.router.push({
              path: '/activity',
              query: {
                refresh: true
              }
            })
          } else {
            if (window.history.length >= 1) {
              me.router.go(-1)
            }
          }
        }
      })
    },
    // 不感兴趣
    noLike() {
      let targetId = '';
      if (this.innerObj.topicCommentId) {
        targetId = this.innerObj.topicCommentId
      } else {
        targetId = this.innerObj.objectId
      }
      let me = this
      me.api.process({
        url: 'PostRefuse',
        data: {
          postId: targetId
        },
        success: function() {
          me.$toast('我们将持续为你优化推荐内容', 1200)
          setTimeout(() => {
            me.hide()
          }, 1000)
        }
      })
    },
    cancelShare() {
      this.hide()
    },
    getShare() {},
    copy() {
      let I = document.createElement('input')
      I.value = this.url
      document.body.appendChild(I)
      I.select()
      document.execCommand('Copy')
      document.body.removeChild(I)
      this.$toast('复制成功', 1200)
      setTimeout(() => {
        this.hide()
      }, 1500)
    },
    shareFirentGroup() {
      let imageUrl = '';
      if (this.type === 'voteDetail') {
        imageUrl = this.thumbGif
      } else {
        imageUrl = this.Thumbnail
      }
      let type = '';
      if (this.type === 'music') {
        this.innerObj.name = 'music';
      }

      if (
        this.innerObj.name === 'discoverItem' ||
        this.innerObj.name === 'index' ||
        (this.innerObj.name === 'discoverItemOnly' && this.type === 'discover')
      ) {
        // 表示发现内页
        type = 1
      } else if (this.innerObj.name === 'activityInfo') {
        // 表示活动详情
        type = 2
      } else if (this.innerObj.name === 'discount_info') {
        // 表示优惠详情
        type = 3
      } else if (this.innerObj.name === 'videoPlayer') {
        // 表示视频播放
        type = 4
      } else if (this.innerObj.name === 'groupApplyList') {
        // 表示群组申请列表
        type = 5
      } else if (this.innerObj.name === 'videoSwiper') {
        // 表示视频播放
        type = 6
      } else if (this.innerObj.name === 'music') {
        // 表示音乐
        console.log('我是音乐')
        type = 7
      } else if (this.innerObj.name === 'topicComment') {
        // 表示话题评论内部
        type = 8
      } else if (this.innerObj.name === 'discoverUser') {
        // 表示别人的主页
        type = 9
      } else if (this.innerObj.name === 'groupInfo') {
        // 表示群详情
        type = 10
      } else if (this.innerObj.name === 'voteList') {
        // 表示投票详情页
        type = 11
      } else if (this.innerObj.name === 'videoVote') {
        // 表示投票页的视频
        type = 12
      } else if (this.innerObj.name === 'groupChatSettings') {
        // 表示群聊天设置
        type = 13
      } else if (this.innerObj.name === 'topicItemss') {
        // 话题内页
        type = 14
      } else if (this.innerObj.name === 'my') {
        // 我的页面
        type = 15
      } else if (this.innerObj.name === 'groupQR') {
        // 表示分享到二维码
        type = 16
      }
      let innerShareData = {
        objectId: this.innerObj.objectId,
        postType: type,
        title: this.title,
        content: this.content,
        imageUrl
      }
      if (type == 8) {
        innerShareData.topicCommentId = this.innerObj.topicCommentId
      }
      innerShareData.hideUser = this.isDelete
      // console.log(innerShareData, 'innerShareData')
      // return;
      if (
        type == 1 ||
        type == 6 ||
        type == 8 ||
        type == 9 ||
        type == 12 ||
        type == 15
      ) {
        // 表示是发现页面, 视频播放， 话题评论内页,投票视频播放页 我的页面
        innerShareData.postUserAvatar = this.item.avatar
        innerShareData.postUserName = this.item.nickName
          ? this.item.nickName
          : this.item.name
      } else if (type == 2 || type == 3 || type == 11) {
        // 表示活动详情, 优惠详情，没有用户名，那么就传userId
        innerShareData.postUserId = this.item.userId // 表示发帖子的userId
      } else if (type == 10 || type == 13 || type == 16) {
        // 表示群详情,群设置页, 群二维码
        innerShareData.postUserAvatar = this.item.groupCover
        innerShareData.postUserName = this.item.groupName
      }
      this.router.push({
        name: 'inner_share',
        params: { innerShareData: JSON.stringify(innerShareData) }
      })
      this.hide()
      this.tellShare(0)
    }
  }
}
</script>

<style lang="less">
@keyframes bounce {
  0%,
  20%,
  53%,
  80%,
  100% {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
  40%,
  43% {
    -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    -webkit-transform: translate3d(0, -10%, 0);
    transform: translate3d(0, -10%, 0);
  }
  // 70% {
  //     -webkit-animation-timing-function: cubic-bezier(.755,.05,.855,.06);
  //     animation-timing-function: cubic-bezier(.755,.05,.855,.06);
  //     -webkit-transform: translate3d(0,-15px,0);
  //     transform: translate3d(0,-15px,0);
  // }
  // 90% {
  //     -webkit-transform: translate3d(0,-4px,0);
  //     transform: translate3d(0,-4px,0);
  // }
}
.myPluginSharePage {
  width: 100%;
  height: 100%;
  z-index: 20000;
  position: relative;
  top: 0;
  left: 0;
  .mask {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
  }
  .share {
    width: 100%;
    // min-height: 25%;
    min-height: 70.92vw;
    background-color: rgb(227, 227, 227);
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 999;
    display: flex;
    justify-content: space-around;
    .userShare {
      width: 100%;
      margin-top: 1vw;
      .weixin.iconWanwan {
        color: #fff;
      }
      .shareFriends.iconWanwan {
        color: #fff;
      }
      .shareTo {
        display: inline-block;
        width: 20vw;
        height: 6vw;
        font-size: 4.3vw;
        font-weight: 500;
        color: rgb(127, 127, 127);
        margin-left: 43%;
        margin-top: 1vw;
      }
      .userCancel {
        display: inline-block;
        width: 15vw;
        height: 6vw;
        margin-top: 12vw;
        margin-left: 42%;
        text-align: center;
        font-size: 4.3vw;
        font-weight: 500;
        color: rgb(127, 127, 127);
      }
      .PluginShareWrap {
        margin-top: 3.6vw;
        height: 35vw;
        // overflow-x: scroll;
        .pluginShareUl {
          &.twoUI {
            .pluginShareLi {
              width: 18vw;
              // height:12vw;
              text-align: center;
              animation: bounce 0.6s 1 ease-in-out;
              &:nth-child(1) {
                animation-delay: 0.15s;
              }
              &:nth-child(2) {
                animation-delay: 0.2s;
              }
              &:nth-child(3) {
                animation-delay: 0.25s;
              }
            }
          }
          width: 100vw;
          display: flex;
          justify-content: space-around;
          // margin-bottom:2vw;
          .pluginShareLi {
            width: 18vw;
            // height:12vw;
            text-align: center;
            animation: bounce 0.8s 1 ease-in-out;
            &:nth-child(1) {
              animation-delay: 0;
            }
            &:nth-child(2) {
              animation-delay: 0.05s;
            }
            &:nth-child(3) {
              animation-delay: 0.1s;
            }
            &:nth-child(4) {
              animation-delay: 0.15s;
            }
            &:nth-child(5) {
              animation-delay: 0.2s;
            }
            .pluginShareBtn {
              display: inline-block;
              text-align: center;
              width: 14.35vw;
              height: 14.35vw;
              border-radius: 50%;
            }
            .shareTitle {
              font-size: 3vw;
              color: rgb(127, 127, 127);
              width: 100%;
              display: inline-block;
            }
            .weixinBtn {
              background-color: rgb(59, 187, 7);
              line-height: 15.54vw;
              .iconWweixinfenxiang {
                font-size: 10.2vw;
                color: white;
              }
            }
            .friendsBtn {
              line-height: 15.54vw;
              background-color: rgb(159, 206, 24);
              .iconWweixinpengyouquan {
                font-size: 10.2vw;
                color: white;
              }
            }
            .innerBtn {
              line-height: 15.54vw;
              background: rgb(90, 145, 228);
              .iconWzhifeiji {
                font-size: 10.2vw;
                color: white;
              }
            }
            .whiteBtn {
              background: white;
              .whiteFont {
                color: #7f7f7f;
                font-size: 9.2vw;
              }
              .iconWjubao1 {
                font-size: 9vw;
                // line-height:14.35vw;
              }
              .iconWicon1 {
                font-size: 11vw;
                line-height: 15vw;
              }
            }
            .noLike {
              .iconWicon1 {
                font-size: 11vw;
              }
            }
          }
          .whitePosition {
            background: rgb(227, 227, 227);
          }
        }
        .oneUl {
          margin-bottom: 2vw;
        }
        // .ulTwo{
        //   justify-content: start;
        // }
      }
    }
  }
}
.sharePlay-enter-active,
.sharePlay-leave-active {
  transform: translate3d(0, 0, 0);
  transition: all 0.35s;
}
.sharePlay-enter,
.sharePlay-leave-to {
  transform: translate3d(0, 100%, 0);
  opacity: 0;
  // top: 100%;
}
.fadeIn-enter-active {
  transition: all 0.2s;
}
.fadeIn-leave-active {
  transition: all 0.8s;
}

.fadeIn-enter,
.fadeIn-leave-to {
  opacity: 0;
}
</style>
