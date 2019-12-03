<template>
  <div class="playerContainer playerWrapper">
    <div class="videoDetail" v-show="!showControl">
      <PostItemFull
        v-if="itemData.postId"
        v-show="isInVmodel"
        :limitNum="limitNum"
        @setCommentsList="setCommentsListShow(true, itemData)"
        :item="itemData"
        :showVideoCover="false"
        :canToggle="!!canToggle"
        @fullScreen="toggleMode()"
        type="video"
      />
      <div class="inputComments" v-show="isInVmodel" @touchstart.stop>
        <i class="iconWxiepinglun iconWanwan"></i>
        <input
          type="text"
          v-model="inputContent"
          placeholder="添加评论"
          readonly
          @click.self="setUserInputShow(true)"
        />
      </div>
    </div>
    <!-- 返回 -->
    <!-- <div class='goBack'
         v-show="!isInVmodel && showControl"
         @click.stop="goBack">
      <i class="iconWanwan iconWfanhui activityNotice"></i>
    </div> -->
    <!-- 分享 -->
    <!-- <div class="goShare"
         v-show="isInVmodel"
         @click.stop='share'>
      <i class="iconWanwan iconWfenxiang1 activityNotice"></i>
    </div> -->
    <!-- 全屏之后的返回 -> 回到竖屏 -->
    <div
      class="toggleV"
      v-show="model === 'h' && showControl"
      @click="setModel('v')"
      :style="toggleVStyle"
    >
      <div class="button--toggleV iconWanwan iconWfanhui"></div>
      <div class="toggleV__title" v-if="itemData.title">
        {{ itemData.title }}
      </div>
    </div>
    <!-- 一系列控制按钮 -->
    <div
      :class="['playControl', showControl ? 'visible' : 'notVisible']"
      v-if="isInVmodel"
    >
      <div class="playControlContent">
        <div class="playBtnWrap">
          <div
            :class="[
              'pauseBtn',
              isPlay ? 'iconWiconstop' : 'iconWbofang',
              'iconWanwan'
            ]"
            @click.stop="togglePlay"
          ></div>
        </div>
        <div class="curTime">{{ currentTime }}/{{ duration }}</div>
        <div
          :class="[
            'button--toggleScreen',
            'iconWanwan',
            { iconWsuoxiao1: model === 'h' }
          ]"
          v-if="canToggle"
          @click="toggleMode"
        >
          <span class="button__toggle--inner" v-if="model === 'v'">全屏</span>
        </div>
      </div>
      <div class="playProgess" @click.stop="setCurrentTime">
        <span class="bgBar" ref="bgBar"></span>
        <span
          class="playerPoint"
          ref="timeBar"
          @touchstart.prevent="startChangeCurrentTime"
          @touchend.prevent="endChangeCurrentTime"
          @touchmove.prevent="moveChangeCurrentTime"
        ></span>
        <span class="playerProgress" ref="playBar"></span>
      </div>
    </div>
    <transition name="fadeIn">
      <div
        :class="[
          'playControl',
          'hPlaycontrol',
          showControl ? 'visible' : 'notVisible'
        ]"
        v-if="!isInVmodel"
        :style="progressBarStyle"
      >
        <div class="playControlContent">
          <div class="playBtnWrap">
            <div
              :class="[
                'pauseBtn',
                isPlay ? 'iconWiconstop' : 'iconWbofang',
                'iconWanwan'
              ]"
              @click.stop="togglePlay"
            ></div>
          </div>
          <div class="curTime">{{ currentTime }}/{{ duration }}</div>
          <div
            :class="[
              'button--toggleScreen',
              'iconWanwan',
              { iconWsuoxiao1: model === 'h' }
            ]"
            v-if="canToggle"
            @click="toggleMode"
          >
            <span class="button__toggle--inner" v-if="model === 'v'">全屏</span>
          </div>
        </div>
        <div class="playProgess" @click.stop="setCurrentTime">
          <span class="bgBar" ref="bgBar"></span>
          <span
            class="playerPoint"
            ref="timeBar"
            @touchstart.prevent="startChangeCurrentTime"
            @touchend.prevent="endChangeCurrentTime"
            @touchmove.prevent="moveChangeCurrentTime"
          ></span>
          <span class="playerProgress" ref="playBar"></span>
        </div>
      </div>
    </transition>
    <!-- player -->
    <div
      :class="['player', model === 'h' ? 'modelH' : 'modelV']"
      :style="style"
      @click="changeShowControl"
    >
      <video-player
        class="video-player vjs-custom-skin"
        ref="videoPlayer"
        :playsinline="true"
        :options="playerOptions"
        @play="onPlayerPlay($event)"
        @ended="onPlayerEnded($event)"
        @pause="onPlayerPause($event)"
        @statechanged="playerStateChanged($event)"
        @timeupdate="playerCurrentTime(data)"
        @ready="playerReadied($event)"
      >
      </video-player>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import tellPlayTimeMixin from '@/components/video/tellPlayTimeMixin';

import PostItemFull from '@/components/PostItemFull';
import { videoPlayer } from 'vue-video-player';

export default {
  mixins: [tellPlayTimeMixin],
  props: {
    itemData: {
      type: Object
    },
    voteActivity: {
      type: Object,
      default: null
    },
    changeControl: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      model: 'v',
      style: '',
      progressBarStyle: '',
      toggleVStyle: '',
      dH: 0,
      dW: 0,
      playerOptions: {
        // playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: true, // 导致视频一结束就重新开始。
        preload: 'none', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '9:16', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: false, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            // eslint-disable-next-line
            type: "video/ogg",
            // eslint-disable-next-line
            type: "video/webm",
            // eslint-disable-next-line
            type: "video/mp4",
            src: this.itemData.video // 你的m3u8地址（必填）
          }
        ],
        // poster: '',
        poster: 'http://webapp.szwanwan.com/img/default/cover.png', // 你的封面地址
        width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: false,
          durationDisplay: false,
          remainingTimeDisplay: false,
          fullscreenToggle: false, // 全屏按钮
          volumeMenuButton: false
        }
      },
      currentTime: 0,
      curTime: 0,
      duration: 0,
      durationTime: 0,
      isPlay: false,
      progressBar: '',
      touch: {},
      newProgress: 0,
      showControl: false,
      hasMusic: false,
      placeholder: '留下您的精彩评论吧！',
      userInputShow: false,
      limitNum: 40,
      inputContent: ''
    }
  },
  computed: {
    ...mapState(['isPlaying', 'hasMask', 'hasSubMask', 'videoSrc']),
    postId() {
      return this.itemData && this.itemData.postId
    },
    player() {
      return this.$refs.videoPlayer.player
    },
    canToggle() {
      // 是否可以缩放 height
      return (
        this.itemData &&
        this.itemData.wight &&
        this.itemData.height &&
        this.itemData.height < this.itemData.wight
      )
    },
    isInVmodel() {
      return !this.canToggle || (this.canToggle && this.model === 'v')
    },
    itemCover() {
      return this.itemData && this.itemData.videoCover
    }
  },
  watch: {
    hasPost(newV) {
      this.itemData.hasPost = newV
    },
    itemCover(newV) {
      if (newV) {
        this.$set(this.playerOptions, 'poster', newV)
      }
    },
    hasMask(newV, oldV) {
      if (!newV && oldV && this.canToggle) {
        this.setModel('v')
      }
    },
    changeControl(newV, oldV) {
      if (!newV && oldV) {
        setTimeout(() => {
          this.showControl = false
        }, 350)
      }
    },
    videoSrc(newV, oldV) {
      this.textPhone()
      console.log(newV, oldV)
      if (newV === this.itemData.video) {
        this.player.currentTime(0)
        setTimeout(() => {
          this.$refs.videoPlayer.player.play()
        }, 100)
      } else {
        setTimeout(() => {
          this.$refs.videoPlayer.player.pause()
        }, 100)
        !this.hasPost &&
          oldV === this.itemData.video &&
          this.PostVideoDetails()
      }
    },
    // 更改视频源 videoUrl从弹出框组件传值
    videoUrl: function(val) {
      if (val !== '') {
        this.$refs.videoPlayer.player.src(val)
      }
    },
    // 弹出框关闭后暂停 否则一直在播放 state从弹出框组件传值
    state: function(val) {
      if (val) {
        this.$refs.videoPlayer.player.pause()
      }
    },
    curTime(newV) {
      // 拖动的时候不要watch
      if (newV >= 0 && !this.touch.init) {
        let moveDisRate = newV / this.durationTime
        this.changeProgress(moveDisRate)
      }
    },
    itemData(newV) {
      return newV
    }
  },
  components: {
    videoPlayer,
    PostItemFull
  },
  created() {
    this.itemCover && this.$set(this.playerOptions, 'poster', this.itemCover)
  },
  mounted() {
    this.$nextTick(() => {
      this.textPhone()
    })
  },
  methods: {
    ...mapMutations({
      setCountReply: 'setCountReply',
      setMusicPlay: 'setMusicPlay',
      setMask: 'setMask',
      updateMyPage: 'updateMyPage'
    }),
    textPhone() {
      // 检测手机屏幕
      this.dH = Math.ceil(document.documentElement.clientHeight)
      this.dW = Math.ceil(document.documentElement.clientWidth)
      if (this.canToggle) {
        this.$set(this.playerOptions, 'aspectRatio', `${this.dW}:${this.dH}`)
        let controlScale =
          this.playerOptions.aspectRatio.split(':')[1] /
          this.playerOptions.aspectRatio.split(':')[0]
        this.progressBarStyle = `transform-origin: left bottom;z-index: 100001; transform: translate3d(0, -100vh, 0) rotate(90deg) scale(${controlScale});`
      }
    },
    updateComments() {
      this.itemData.countReply++
      this.setUserInputShow(false)
    },
    setUserInputShow(data) {
      if (!this.$store.state.isInApp) {
        window.location.href =
          'https://a.app.qq.com/o/simple.jsp?pkgname=io.dcloud.H50D8112A';
        return
      }
      if (!this.authentication.isLogin()) {
        this.go.login()
        return;
      }
      this.$emit('setUserInputShow', data, this.itemData)
      this.userInputShow = data
      this.setMask(data)
      if (!data) {
        setTimeout(() => {
          this.showControl = data
        }, 350)
      } else {
        this.showControl = data
      }
    },
    goBack() {
      if (this.model === 'h' || this.model === 'b') {
        this.setModel('v')
      } else {
        this.$router.back()
      }
    },
    changeShowControl() {
      this.showControl = !this.showControl
      this.$emit('showControl', !this.showControl)
    },
    onPlayerPlay() {
      this.isPlay = true
    },
    onPlayerPause() {
      this.isPlay = false
    },
    onPlayerEnded() {
      console.log('end')
    },
    playerStateChanged() {
      this.curTime = this.player.currentTime() && this.player.currentTime()
      this.durationTime = this.player.duration()
      this.currentTime = this.format.toMinOne(this.player.currentTime())
      this.duration = this.format.toMinOne(this.player.duration())
    },
    playerReadied() {
      if (this.videoSrc === this.itemData.video && !this.isPlay) {
        this.player.currentTime(0)
        this.$refs.videoPlayer.player.play()
      }
    },
    playerCurrentTime() {},
    togglePlay() {
      if (this.isPlay) {
        this.$refs.videoPlayer.player.pause()
      } else {
        this.$refs.videoPlayer.player.play()
      }
    },
    setCurrentTime(e) {
      let progressBar = this.$refs.bgBar
      let progressPoint = this.$refs.timeBar
      if (this.model === 'v') {
        this.newProgress = Math.min(
          Math.max(
            0,
            (e.clientX -
              progressBar.getBoundingClientRect().left -
              progressPoint.clientWidth / 2) /
              (progressBar.clientWidth - progressPoint.clientWidth)
          ),
          1
        )
      } else {
        this.newProgress = Math.min(
          Math.max(
            0,
            (e.clientY -
              progressBar.getBoundingClientRect().top -
              progressPoint.getBoundingClientRect().height / 2) /
              (progressBar.getBoundingClientRect().height -
                progressPoint.getBoundingClientRect().height)
          ),
          1
        )
      }
      this.changeProgress(this.newProgress)
      this.player.currentTime(this.newProgress * this.durationTime)
    },
    startChangeCurrentTime(e) {
      this.touch.init = true
      // 开始滑动的位置
      this.touch.startX = e.touches[0].pageX
      this.touch.startY = e.touches[0].pageY
      // 当前偏移
      this.touch.left = this.$refs.playBar.clientWidth
      if (this.model === 'h') {
        this.touch.left = this.$refs.playBar.getBoundingClientRect().height
      }
    },
    moveChangeCurrentTime(e) {
      let progressBar = this.$refs.bgBar
      // let progress = this.$refs.playBar
      let progressPoint = this.$refs.timeBar
      if (!this.touch.init) return
      // 滑动的差值
      let deltaX = e.touches[0].pageX - this.touch.startX
      if (this.model === 'h') {
        deltaX = e.touches[0].pageY - this.touch.startY
      }
      // 进度条的差值，大于0，小于总长度
      let newWidth = Math.min(
        progressBar.clientWidth - progressPoint.clientWidth,
        Math.max(0, this.touch.left + deltaX - progressPoint.clientWidth / 2)
      )
      this.newProgress =
        newWidth / (progressBar.clientWidth - progressPoint.clientWidth)
      if (this.model === 'h') {
        newWidth = Math.min(
          progressBar.getBoundingClientRect().height -
            progressPoint.getBoundingClientRect().height,
          Math.max(
            0,
            this.touch.left +
              deltaX -
              progressPoint.getBoundingClientRect().height / 2
          )
        )
        this.newProgress =
          newWidth /
          (progressBar.getBoundingClientRect().height -
            progressPoint.getBoundingClientRect().height)
      }
      this.changeProgress(this.newProgress)
      this.player.currentTime(this.newProgress * this.durationTime)
    },
    endChangeCurrentTime() {
      this.touch.init = false
    },
    changeProgress(newRate) {
      let progressBar = this.$refs.bgBar
      let progress = this.$refs.playBar
      let progressPoint = this.$refs.timeBar
      progress.style.width =
        newRate * (progressBar.clientWidth - progressPoint.clientWidth) +
        progressPoint.clientWidth -
        1 +
        'px';
      progressPoint.style.left =
        newRate * (progressBar.clientWidth - progressPoint.clientWidth) + 'px';
    },
    // 设置评论
    setCommentsListShow(data, item) {
      if (!this.$store.state.isInApp) {
        window.location.href =
          'https://a.app.qq.com/o/simple.jsp?pkgname=io.dcloud.H50D8112A';
        return
      }
      if (!this.authentication.isLogin()) {
        this.go.login()
        return;
      }
      this.$emit('setCommentsListShow', data, item)
    },
    share() {
      let isDelete = this.itemData.userId === this.$store.state.user.userId
      if (isDelete) {
        let obj = {
          isRefreshPost: true
        }
        this.updateMyPage(obj)
      }
      let objectId = '';
      if (this.voteActivity) {
        objectId = this.voteActivity.postId
      } else {
        objectId = this.itemData.postId
      }
      let innerObj = {
        name: this.$route.name,
        objectId
      }
      if (this.voteActivity) {
        this.$share.open(
          this.voteActivity,
          false,
          'voteDetail',
          this.$router.currentRoute.fullPath,
          innerObj
        )
      } else {
        this.$share.open(
          this.itemData,
          isDelete,
          'video',
          this.$router.currentRoute.fullPath,
          innerObj
        )
      }
    },
    /** 切换视频模式 */
    toggleMode() {
      if (this.model === 'v') {
        this.model = 'h';
        this.showControl = false
        this.setMask(true)
        this.$emit('toggoleModel', 'h', this.itemData)
        let scale
        scale = this.itemData.wight / this.itemData.height
        this.style = `position: fixed;z-index: 100000; transform: rotate(90deg) scale(${scale});`
        let transX = 100 - 10 * scale
        this.toggleVStyle = `z-index: 100001; transform-origin: left bottom;transform: translate3d(${transX}vw, -10vw, 0) rotate(90deg) scale(${scale});`
      } else {
        this.setModel('v')
      }
    },
    setModel(data) {
      if (data === 'v') {
        this.model = 'v';
        this.setMask(false)
        this.$emit('toggoleModel', 'v', this.itemData)
        this.style = '';
        // this.progressBarStyle = ''
        this.showControl = false
      }
      this.$store.commit('updateVoteBtn', true)
    }
  }
}
</script>
<style lang="less">
.playerContainer {
  background: #000;
  // height: 100%;
  height: 100vh;
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 10000;
  .postItem {
    margin-bottom: 0;
    padding-bottom: 0;
    color: #fff;
    .postItem-meta2-replay .myLike,
    .postItem-meta2-replay .count,
    .postItem-meta2 .postItem-btn,
    .myLike {
      color: #fff;
    }
    .selfSetBtn .likeLeft {
      display: none;
    }
    // .fadeBtn .iconfont,
    .selfSetBtn .likeRight .selfComment .postItem-meta2-replay .myLike,
    .count {
      color: #fff;
    }
    .selfSetBtn .likeRight .selfComment .postItem-meta2-replay .count {
      color: #fff;
      display: inline-block;
      margin-top: -1.9vw;
    }
    .postItem-meta .postItem-btns .postItem-btn-share {
      display: none;
      position: absolute;
      top: 5vw;
      right: 5vw;
      z-index: 200;
    }
    .postItem-meta2 .postItem-btn {
      min-width: 16vw;
    }
  }
  .inputComments {
    position: absolute;
    z-index: 10001;
    width: 40vw;
    height: 12vw;
    bottom: 0;
    left: 0;
    line-height: 12vw;
    background: transparent;
    display: flex;
    .iconWxiepinglun {
      display: block;
      width: 12vw;
      height: 12vw;
      text-align: center;
      font-size: 5.8vw;
      color: #aaa;
    }
    input {
      outline: none;
      border: none;
      display: block;
      background: transparent;
      flex: 1;
      max-width: 28vw;
      height: 100%;
      &::placeholder {
        color: #aaa;
      }
    }
  }
  .toggleV {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 10vw;
    z-index: 10001;
    display: flex;
    align-items: center;
    color: #fff;
    transition: all 0.35s ease-in-out;
    .button--toggleV {
      width: 10vw;
      height: 10vw;
      line-height: 10vw;
      font-size: 3vw;
      text-align: center;
    }
    .toggleV__title {
      flex: 1;
      color: #fff;
      font-size: 3.6vw;
      padding-left: 5vw;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
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
      color: white;
      font-size: 6.3vw;
      font-weight: 500;
      text-shadow: 0 0 3px #000;
    }
  }
  .player {
    width: 100%;
    height: 100%;
    transition: all 0.35s ease-in-out;
    div {
      background-color: transparent;
    }
    .vjs-poster {
      background-color: #000;
    }
    background-color: transparent;
    .video-js .vjs-tech {
      z-index: -1;
    }
    &.modelH {
      .vjs-big-play-button {
        transform: scale(0.6);
      }
    }
  }
  .videoDetail {
    background-color: transparent;
    position: absolute;
    width: 100%;
    height: auto;
    left: 0;
    bottom: 0;
    z-index: 300;
    > * {
      background-color: transparent;
    }
    .userHeader {
      width: 100%;
      height: 10vw;
      line-height: 10vw;
    }
  }
  .playControl {
    &.fadeIn-enter,
    &.fadeIn-leave-to {
      opacity: 0;
    }
    &.fadeIn-enter-active,
    &.fadeIn-leave-active {
      transition: all 0.1s ease 0.35s;
    }
    &.fadeIn-leave-active {
      transition: none;
    }
    &.visible {
      visibility: visible;
    }
    &.notVisible {
      visibility: hidden;
    }
    &.hPlaycontrol {
      height: 8vw;
      line-height: 8vw;
      .playControlContent {
        .pauseBtn {
          width: 8vw;
          height: 8vw;
          font-size: 3vw;
        }
        .curTime {
          width: 20vw !important;
          font-size: 3vw !important;
        }
        .button--toggleScreen {
          font-size: 3vw;
          text-align: center;
          width: 8vw;
          height: 8vw;
        }
      }
      .playerPoint {
        position: absolute;
        z-index: 100;
        top: 0;
        left: 0;
        width: 10px;
        height: 10px;
        box-sizing: border-box;
        border-radius: 5px;
        background: #fff !important;
        transform: translate3d(0, -50%, 0);
        &::after {
          content: "";
          position: absolute;
          width: 21px;
          height: 21px;
          top: 50%;
          left: 50%;
          transform: translate3d(-50%, -50%, 0);
          border-radius: 50%;
        }
      }
    }
    position: absolute;
    width: 100%;
    height: 12vw;
    line-height: 12vw;
    bottom: 0;
    left: 0;
    z-index: 200;
    .playControlContent {
      display: flex;
      // justify-content: space-between;
      width: 100%;
      height: 100%;
      color: #f9f9f9;
      .playBtnWrap {
        flex: 1;
      }
      .pauseBtn {
        // position: absolute;
        text-align: center;
        width: 12vw;
        height: 12vw;
        left: 0;
        bottom: 0;
        z-index: 10;
      }
      .curTime {
        width: 28vw;
        height: 100%;
        text-align: center;
        font-size: var(--title);
        letter-spacing: 1px;
      }
      .button--toggleScreen {
        text-align: center;
        width: 12vw;
        height: 12vw;
        font-size: var(--title);
        .button__toggle--inner {
          display: inline-block;
          margin-top: 2vw;
          width: 10vw;
          height: 6vw;
          line-height: 6vw;
          border: 1px solid currentColor;
          border-radius: 3.1vw;
          font-size: 3.6vw;
        }
      }
    }
  }
  .playProgess {
    position: absolute;
    width: 100%;
    height: 4px;
    left: 0;
    top: 0;
    .bgBar {
      // visibility: visible!important;
      position: absolute;
      width: 100%;
      height: 1px;
      top: 0;
      left: 0;
      // border-radius: 50%;
      background: #79716c !important;
    }
    .playerPoint {
      position: absolute;
      z-index: 100;
      top: 0;
      left: 0;
      width: 16px;
      height: 16px;
      box-sizing: border-box;
      border-radius: 50%;
      background: #fff !important;
      transform: translate3d(0, -50%, 0);
      &::after {
        content: "";
        position: absolute;
        width: 32px;
        height: 32px;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
        border-radius: 50%;
      }
    }
    .playerProgress {
      // visibility: visible!important;
      position: absolute;
      height: 1px;
      left: 0;
      top: 0;
      background: #fff !important;
    }
  }
}
.player {
  touch-action: none;
  position: relative;
  z-index: 100;
}
.vjs-has-started.vjs-user-inactive.vjs-playing .vjs-control-bar,
.vjs-custom-skin > .video-js .vjs-control-bar {
  display: none !important;
}
.video-js .vjs-modal-dialog {
  display: none !important;
}
.vjs-custom-skin > .video-js .vjs-big-play-button {
  top: 50% !important;
}
</style>
