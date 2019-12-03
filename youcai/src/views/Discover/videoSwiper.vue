<template>
  <div class="videoSwiperPage">
    <div class="swiperHeader" v-show="lockItem !== currentItem">
      <!-- 返回 -->
      <div v-show="showTop" class="goBack" @click.stop="go.back($route)">
        <i class="iconWanwan iconWfanhui activityNotice"></i>
      </div>
      <!-- 分享 -->
      <div v-show="showTop" class="goShare" @click.stop="swiperShare">
        <i class="iconWanwan iconWweixinfenxiang activityNotice"></i>
      </div>
    </div>
    <commentsList
      v-if="hasMask && commentsListShow"
      :countReply="currentItem.countReply"
      @setCommentsPlate="setCommentsListShow"
      @upcountReply="upcountReply"
      :commentsType="commentsType"
      :commentsId="commentsId"
      :OneItem="currentItem"
    ></commentsList>
    <userInput
      v-if="hasMask && userInputShow"
      :userInputContent="userInputContent"
      :objectId="commentsId"
      :placeholder="placeholder"
      :type="commentsType"
      @updateComments="updateComments"
      @hideUserInput="hideUserInput"
    />
    <div class="swiper-container" id="videoPageSwiper">
      <div class="videoSwiperItem swiper-wrapper">
        <div
          :class="['swiper-slide', { 'swiper-no-swiping': lockItem === item }]"
          v-for="(item, index) in items"
          :key="index"
        >
          <viderPlayer
            ref="videoPlayer"
            @showControl="setControl"
            @setUserInputShow="setUserInputShow"
            @setCommentsListShow="setCommentsListShow"
            @toggoleModel="toggleModel"
            :itemData="item"
            :changeControl="changeControl"
          ></viderPlayer>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import viderPlayer from '@/components/videoPlayer';
import commentsList from '@/components/comments/commentsList';
import userInput from '@/components/comments/userInput';
export default {
  components: {
    viderPlayer,
    commentsList,
    userInput
  },
  data() {
    return {
      showTop: true, // 显示返回 与 分享
      placeholder: '',
      lockItem: {},
      currentItem: {},
      itemData: {},
      items: [],
      mySwiper: null,
      commentsListShow: false, // 显示评论列表
      commentsType: 0,
      commentsId: '',
      inputContent: '',
      userInputContent: '',
      userInputShow: false,
      initialSlide: 0,
      pageIndex: 1,
      pageSize: 4,
      changeControl: false // 用来重置playControl的显示
    }
  },
  computed: {
    ...mapState(['isPlaying', 'hasMask', 'hasSubMask']),
    player() {
      return this.$refs.videoPlayer.player
    }
  },
  created() {
    if (this.isPlaying) {
      this.hasMusic = true
      this.setMusicPlay(false)
    }
    this.getVideoDetail()
    // 兼容全面屏 头部
    window.isInAndroid && window.WanAndroid.startPlayVideo(true)
  },
  beforeDestroy() {
    if (this.hasMusic) {
      this.setMusicPlay(true)
    }
    window.isInAndroid && window.WanAndroid.startPlayVideo(false)
  },
  beforeRouteLeave(to, from, next) {
    this.getCurrentVideoPlayer()
    console.log(to, 'to')
    next()
  },
  methods: {
    ...mapMutations({
      setVideo: 'setVideo',
      setMask: 'setMask',
      updateMyPage: 'updateMyPage',
      setMusicPlay: 'setMusicPlay' // 控制音乐播放冲突
    }),
    setControl(data) {
      this.showTop = data
    },
    getCurrentVideoPlayer() {
      this.mySwiper &&
        (this.mySwiper.activeIndex || this.mySwiper.activeIndex === 0) &&
        this.$refs.videoPlayer[this.mySwiper.activeIndex] &&
        this.$refs.videoPlayer[this.mySwiper.activeIndex].PostVideoDetails()
    },
    goBack() {
      this.$router.back()
    },
    setCommentsListShow(data, item) {
      if (item) {
        this.currentItem = item
        this.commentsId = item.postId
      }
      this.commentsListShow = data
      this.setMask(data)
    },
    updateComments() {
      this.currentItem.countReply++
      this.setUserInputShow(false)
    },
    upcountReply() {
      this.currentItem.countReply++
    },
    hideUserInput(content) {
      this.userInputContent = content
      this.setUserInputShow(false)
    },
    setUserInputShow(data, item) {
      if (!this.$store.state.isInApp) {
        window.location.href =
          'https://a.app.qq.com/o/simple.jsp?pkgname=io.dcloud.H50D8112A';
        return
      }
      if (!this.authentication.isLogin()) {
        this.go.login()
        return;
      }
      if (item) {
        this.currentItem = item
        this.commentsId = item.postId
      }
      this.userInputShow = data
      this.setMask(data)
      if (!data) {
        setTimeout(() => {
          this.changeControl = data
        }, 350)
      } else {
        this.changeControl = data
      }
    },
    getVideoDetail() {
      let me = this
      me.api.get({
        url: `PostVideoDetails?PostId=${me.$route.params.id}`,
        success: function(res) {
          me.setVideo(res.video)
          me.currentItem = res
          me.items = me.items.concat(res)
          me.getNext()
        }
      })
    },
    getNext() {
      let me = this
      let url = 'PostVideoDetails/id';
      if (me.$store.state.pos.city) {
        url = `${url}?AreaCity=${me.$store.state.pos.city}`
      } else {
        url = `${url}?AreaCity=深圳市`
      }
      url = `${url}&pageIndex=${me.pageIndex}`
      me.api.get({
        url: url,
        success: function(res) {
          me.items = me.items.concat(res)
          setTimeout(() => {
            me.initSwiper()
          })
        }
      })
    },
    getNextI() {
      let me = this
      let url = 'PostVideoDetails/id';
      if (me.$store.state.pos.city) {
        url = `${url}?AreaCity=${me.$store.state.pos.city}`
      } else {
        url = `${url}?AreaCity=深圳市`
      }
      url = `${url}&pageIndex=${me.pageIndex}`
      me.api.get({
        url: url,
        success: function(res) {
          me.items = me.items.concat(res)
        }
      })
    },
    initSwiper() {
      let me = this
      this.mySwiper = new window.Swiper('#videoPageSwiper', {
        noSwiping: true, // 禁止滑动
        direction: 'vertical', // swiper方向
        loop: false, // 是否循环
        initialSlide: me.initialSlide, // 初始化index
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: false, //修改swiper的父元素时，自动初始化swiper
        onSlideChangeEnd: function(swiper) {
          swiper.update()
          me.mySwiper.startAutoplay()
          me.mySwiper.reLoop()
        },
        on: {
          init: function() {
            //Swiper初始化了
            // me.setVideo(me.items[this.mySwiper.activeIndex].video)
          },
          touchStart: () => {},
          slidePrevTransitionEnd: () => {
            // 上一张
            me.setVideo(me.items[me.mySwiper.activeIndex].video)
            me.currentItem = me.items[me.mySwiper.activeIndex]
          },
          slideNextTransitionEnd: () => {
            // 下一张
            me.setVideo(me.items[me.mySwiper.activeIndex].video)
            me.currentItem = me.items[me.mySwiper.activeIndex]
            // me.initialSlide = me.mySwiper.activeIndex
            if (me.mySwiper.activeIndex === me.items.length - 2) {
              me.pageIndex++
              me.getNextI()
            }
          }
        }
      })
    },
    toggleModel(data, item) {
      if (data === 'h') {
        this.lockItem = item
      } else {
        this.lockItem = []
      }
    },
    swiperShare() {
      let isDelete = this.currentItem.userId === this.$store.state.user.userId
      if (isDelete) {
        this.updateMyPage({
          isRefreshPost: true
        })
      }
      let innerObj = {
        name: this.$route.name,
        objectId: this.currentItem.postId
      }
      this.$share.open(
        this.currentItem,
        isDelete,
        'video',
        this.$router.currentRoute.fullPath,
        innerObj
      )
    }
  }
}
</script>
<style lang="less">
.videoSwiperPage {
  width: 100vw;
  height: 100vh;
  .swiperHeader {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    height: 20vw;
    width: 100%;
    background: transparent;
    .goBack {
      position: absolute;
      width: 10vw;
      height: 10vw;
      top: 5vw;
      left: 5vw;
      text-align: center;
      font-size: 6vw;
      line-height: 10vw;
      color: #fff;
      z-index: 200;
      i {
        display: block;
      }
      .activityNotice {
        font-size: 4.63vw;
        font-weight: bold;
        text-shadow: 0 0 3px #000;
        color: white;
      }
    }
    .goShare {
      position: absolute;
      top: 4.8vw;
      right: 5vw;
      z-index: 200;
      // font-weight: bold;
      letter-spacing: 1px;
      .activityNotice {
        // color:white;
        // font-size: 6.3vw;
        // font-weight: 500;
        // text-shadow: 0 0 3px #000;
        font-size: 5vw;
        font-weight: 500;
        background: rgb(59, 187, 7);
        width: 8vw;
        height: 8vw;
        text-align: center;
        line-height: 8vw;
        border-radius: 50%;
        display: inline-block;
        color: white;
      }
    }
  }
  .swiper-container {
    width: 100%;
    height: 100%;
  }
}
</style>
