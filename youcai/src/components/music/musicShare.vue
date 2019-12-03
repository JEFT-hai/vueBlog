<template>
  <transition name="sharePlay">
    <div class="musicShare">
      <div class="musicMask"
           @touchstart="cancelShare"></div>
      <div class="share">
        <div class="userShare">
          <span class="shareTo">分享给</span>
          <div class="musicShareWrap">
            <ul class="musicShareUl musicShareUlOne">
              <li class="musicShareLi"
                  @click="share('weixin', 0)">
                <span class="weixinBtn pluginShareBtn">
                  <i class="iconWanwan iconWweixinfenxiang"></i>
                </span>
                <span class="shareTitle">微信好友</span>
              </li>
              <li class="musicShareLi"
                  @click="share('weixin', 1)">
                <span class="friendsBtn pluginShareBtn">
                  <i class="iconWanwan iconWweixinpengyouquan"></i>
                </span>
                <span class="shareTitle">朋友圈</span>
              </li>
              <li class="musicShareLi"
                  @click="shareInnerFirend">
                <span class="innerBtn pluginShareBtn">
                  <i class="iconWanwan iconWzhifeiji whiteFont"></i>
                </span>
                <span class="shareTitle">好友和群组</span>
              </li>
              <!-- <li class="musicShareLi" @click="copy">
                <span class="whiteBtn pluginShareBtn">
                  <i class="iconWanwan iconWfuzhilianjie whiteFont"></i>
                </span>
                <span class="shareTitle">复制链接</span>
              </li>
              <li class="musicShareLi" v-if="!isDelete" @click="toReport(item)">
                <span class="whiteBtn pluginShareBtn">
                  <i class="iconWanwan iconWjubao1 whiteFont"></i>
                </span>
                <span class="shareTitle">举报</span>
              </li>
              <li class="musicShareLi" @click="noLike">
                <span class="whiteBtn pluginShareBtn">
                  <i class="iconWanwan iconWicon1 whiteFont"></i>
                </span>
                <span class="shareTitle">不感兴趣</span>
              </li>
              <li class="musicShareLi" v-if="isDelete" @click="deletePicture">
                <span class="whiteBtn pluginShareBtn">
                  <i class="iconWanwan iconWshanchu1 whiteFont"></i>
                </span>
                <span class="shareTitle">删除</span>
              </li> -->
            </ul>
            <ul class="musicShareUl">
              <!-- <li class="musicShareLi" @click="share('weixin', 0)">
                <span class="weixinBtn pluginShareBtn">
                  <i class="iconWanwan iconWweixinfenxiang"></i>
                </span>
                <span class="shareTitle">微信好友</span>
              </li>
              <li class="musicShareLi" @click="share('weixin', 1)">
                <span class="friendsBtn pluginShareBtn">
                  <i class="iconWanwan iconWweixinpengyouquan"></i>
                </span>
                <span class="shareTitle">朋友圈</span>
              </li>
              <li class="musicShareLi" @click="shareInnerFirend">
                <span class="innerBtn pluginShareBtn">
                  <i class="iconWanwan iconWzhifeiji whiteFont"></i>
                </span>
                <span class="shareTitle">好友和群组</span>
              </li> -->
              <li class="musicShareLi"
                  @click="copy">
                <span class="whiteBtn pluginShareBtn">
                  <i class="iconWanwan iconWfuzhilianjie whiteFont"></i>
                </span>
                <span class="shareTitle">复制链接</span>
              </li>
              <li class="musicShareLi"
                  v-if="!isDelete"
                  @click="toReport(item)">
                <span class="whiteBtn pluginShareBtn">
                  <i class="iconWanwan iconWjubao1 whiteFont"></i>
                </span>
                <span class="shareTitle">举报</span>
              </li>
              <li class="musicShareLi"
                  @click="noLike">
                <span class="whiteBtn pluginShareBtn">
                  <i class="iconWanwan iconWicon1 whiteFont"></i>
                </span>
                <span class="shareTitle">不感兴趣</span>
              </li>
              <li class="musicShareLi"
                  v-if="isDelete"
                  @click="deletePicture">
                <span class="whiteBtn pluginShareBtn">
                  <i class="iconWanwan iconWshanchu1 whiteFont"></i>
                </span>
                <span class="shareTitle">删除</span>
              </li>
            </ul>
          </div>
          <span class="userCancel"
                @click="cancelShare">取消</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
export default {
  name: 'Share',
  props: {
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
    type: {
      type: String,
      default: 'discover'
    },
    show: {
      type: Boolean,
      defalut: false
    },
  },
  data() {
    return {
      shares: {},
      path: this.$router.currentRoute.fullPath  
    }
  },
  computed: {
    ...mapState(['isPlaying', 'currentIndex', 'playList', 'squenceList', 'musicMode', 'pieShow', 'currentTime', 'duration', 'musicInnerShow']),
    url() {
      if (!this.item) {
        return ''
      } else if (this.type === 'music') {
        return (
          'http://webapp.szwanwan.com/#/index?tab=music&id=' + this.item.voiceId
          // 'http://testapp.szwanwan.com/#/index?tab=music&id=' + this.item.voiceId
        )
      } else if (this.path.indexOf('index') >= 0) {
        if (this.type === 'discover') {
          if (this.item.imageList && this.item.imageList[0]) {
            this.path = '/discover/item/' + this.item.postId
          }
        } else if (this.type === 'video') {
          this.path = 'discover/videoPlayer/' + this.item.postId
        }
      }
      this.path =
        this.path.indexOf('?') >= 0
          ? this.path + '&share=weixin'
          : this.path + '?share=weixin'
      return 'http://webapp.szwanwan.com/#' + this.path // 正式
      // return 'http://testapp.szwanwan.com/#' + this.path // 测试
    },
    title() {
      if (!this.item) {
        return ''
      }
      let title = ''
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
        title = this.item.groupName
      } else if (this.type === 'groupInfo') {
        title = this.item.groupName
      }
      title = title ? title.substr(0, 20) : '多录'
      return title
    },
    content() {
      if (!this.item) {
        return ''
      }
      let content = ''
      if (this.type === 'discover') {
        content = this.item.content
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
          return ''
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
          return ''
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
        content = '扫一扫二维码, 加入群聊'
      } else if (this.type === 'groupInfo') {
        content = this.item.groupStatement
      }
      content = content ? content.substr(0, 50) : '多录'
      return content
    },
    Thumbnail() {
      if (!this.item) {
        return ''
      }
      let thumbnail = ''
      thumbnail = this.item.imageUrl
      // thumbnail = thumbnail ? thumbnail : ''
      return (
        thumbnail || 'http://webapp.szwanwan.com/img/default/defaultavatar.png'
      )
    }
  },
  watch: {
    item(newV, oldV) {
      return newV
    }
  },
  mounted() {
    window.share = this.share
    // this.getShare()
  },
  methods: {
    ...mapMutations(['setMusicInnerShow']),
    share(s, ex) {
      // eslint-disable-next-line
      window.isInAndroid &&
        window.WanAndroid.wxShare(
          this.url,
          this.title,
          this.content,
          this.Thumbnail,
          ex
        )
      console.log(this.url, this.title, this.content, this.Thumbnail)
    },
    hide() {
      this.show = false
    },
    toReport(item) {
      let me = this
      // this.$router.push({
      //   name: 'report',
      //   para
      console.log('打印这item',this.item)
      this.$emit('showMusicShare')
      this.$store.commit('setMusicInnerShow', !this.musicInnerShow)
      this.$router.push({name: 'report', params: {id : this.item.voiceId, type: 'music'}})
    },
    // 删除自己的照片
    deletePicture() {
      console.log('删除中')
      let me = this
      me.api.delete({
        url: `Post?id=${me.item.postId}`,
        success: function() {
          me.$toast('删除成功')
          // me.hide()
          // if (window.history.length >= 1) {
          //   me.$router.go(-1)
          // }
          // let matched = me.$route.matched[me.$route.matched.length - 1]
          // let link =
          //   typeof matched.parent === 'undefined'
          //     ? '/'
          //     : matched.parent.path.replace(/\/$/, '') + '/'
          // if (
          //   matched.path.endsWith('/') &&
          //   matched.path === matched.parent.path + '/' &&
          //   typeof matched.parent.parent !== 'undefined'
          // ) {
          //   link = matched.parent.parent.path
          // }
          // me.$router.replace(link)
        }
      })
    },
    // 不感兴趣
    noLike() {
      let me = this
      me.api.process({
        url: 'PostRefuse',
        data: {
          postId: this.item.voiceId
        },
        success: function (res) {
          me.$toast('我们将持续为你优化推荐内容', 500)
          this.$emit('showMusicShare', false)
        }
      })
    },
    cancelShare() {
      this.$emit('showMusicShare', false)
    },
    getShare() {
      // let me = this
      // window.mui.plusReady(function () {
      // me.updateSerivces()
      // if (window.plus.os.name === 'Android') {
      //   var Intent = window.plus.android.importClass('android.content.Intent')
      //   var File = window.plus.android.importClass('java.io.File')
      //   var Uri = window.plus.android.importClass('android.net.Uri')
      //   var main = window.plus.android.runtimeMainActivity()
      // }
      // })
      // me.updateSerivces()
      // if (window.plus.os.name === 'Android') {
      //   var Intent = window.plus.android.importClass('android.content.Intent')
      //   var File = window.plus.android.importClass('java.io.File')
      //   var Uri = window.plus.android.importClass('android.net.Uri')
      //   var main = window.plus.android.runtimeMainActivity()
      // }
    },
    updateSerivces() {
      let me = this
      window.plus.share.getServices(
        function(s) {
          for (var i in s) {
            var t = s[i]
            me.shares[t.id] = t
          }
          console.log('获取分享服务列表成功')
          console.log(JSON.stringify(me.shares))
        },
        function(e) {
          console.log('获取分享服务列表失败：' + e.message)
        }
      )
    },
    shareAction(id, ex) {
      console.log(this.Thumbnail, 'Thumbnail')
      let me = this
      var s = null
      // this.hide()
      this.$emit('showMusicShare')
      if (!id || !(s = me.shares[id])) {
        console.log('无效的分享服务！')
        return
      }
      if (s.authenticated) {
        console.log('---已授权---')
        me.shareMessage(s, ex)
      } else {
        console.log('---未授权---')
        s.authorize(
          function() {
            me.shareMessage(s, ex)
          },
          function(e) {
            console.log('认证授权失败')
          }
        )
      }
    },
    shareMessage(s, ex) {
      let me = this
      console.log(this.Thumbnail, 'Thumbnail')
      var msg = {
        // 这三个地方，用了item里面的三个属性Id，TopicTitle，Content,所以item不能为null
        href: me.url,
        title: me.title,
        content: me.content,
        thumbs: [me.Thumbnail],
        pictures: ['http://dev.szwanwan.com/favicon.ico'],
        extra: {
          scene: ex
        }
        // thumbs: ['http://img3.3lian.com/2013/v10/4/87.jpg'],
        // pictures: ['http://img3.3lian.com/2013/v10/4/87.jpg'],
        // extra: {
        //   scene: ex
        // }
        // content: '分享-详情',
        // href: 'http://blog.csdn.net/zhuming3834',
        // title: 'HGDQ-分享测试-title',
        // content: 'HGDQ-分享测试-content',
      }
      s.send(
        msg,
        function() {
          console.log('分享成功!')
        },
        function(e) {
          console.log('分享失败!')
        }
      )
    },
    copy() {
      let I = document.createElement('input')
      I.value = this.url
      document.body.appendChild(I)
      I.select()
      document.execCommand('Copy')
      document.body.removeChild(I)
      this.$toast('复制成功', 500)
      this.$emit('showMusicShare')
    },
    shareInnerFirend () {
      let imageUrl = ''
      if (this.type === 'voteDetail') {
        imageUrl = this.thumbGif
      } else {
        imageUrl = this.Thumbnail
      }
      let type = 7
      console.log('type改变了吗', type)
      let innerShareData = {
        objectId: 1,
        postType: type,
        title: this.title,
        content: this.content,
        imageUrl,
      }
      console.log('后面的数据是', innerShareData)
      this.$emit('showMusicShare')
      this.$store.commit('setMusicInnerShow', !this.musicInnerShow)
      this.$router.push({name: 'inner_share', params: {innerShareData: JSON.stringify(innerShareData)}})
    }
  }
} 
</script>

<style lang="less">
.musicShare {
  width: 100%;
  height: 100%;
  z-index: 20000;
  position: relative;
  top: 0;
  left: 0;
  .musicMask {
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
    min-height:70.92vw;
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
      .musicShareWrap {
        margin-top: 3.6vw;
        height: 35vw;
        .musicShareUl{
          width: 100vw;
          display:flex;
          justify-content: space-around;
          .musicShareLi{
            width:18vw;
            // height:12vw;
            text-align: center;
            .pluginShareBtn{
              display:inline-block;
              text-align: center;
              width:14.35vw;
              height:14.35vw;
              border-radius: 50%;
            }
            .shareTitle{
              font-size: 3vw;
              color: rgb(127, 127, 127);
              width:100%;
              display:inline-block;
            }
            .weixinBtn{
              background-color: rgb(59, 187, 7);
              line-height:15.54vw;
              .iconWweixinfenxiang{
                font-size:10.2vw;
                color:white;
              }
            }
            .friendsBtn{
              line-height:15.54vw;
              background-color: rgb(159, 206, 24);
              .iconWweixinpengyouquan{
                font-size:10.2vw;
                color:white;
              }
            }
            .innerBtn{
              line-height:15.54vw;
              background:rgb(90, 145, 228);
              .iconWzhifeiji{
                font-size:10.2vw;
                color:white;
              }
            }
            .whiteBtn{
              background:white;
              .whiteFont{
                color: #7f7f7f;
                font-size:9.2vw;
              }
              .iconWjubao1{
                font-size:9vw;
              // line-height:14.35vw;
              }
              .iconWicon1{
                font-size:11vw;
                line-height:15vw;
              }
              
            }
            .noLike{
              .iconWicon1{
                font-size:11vw;
              }
            }
          }
        }
        .musicShareUlOne{
          margin-bottom:2vw;
        }
      }
    }
  }
}
.sharePlay-enter-active,
.sharePlay-leave-active {
  transition: all 1s;
}
.sharePlay-enter,
.sharePlay-leave-to {
  opacity: 0;
  top: 100%;
}
</style>
