<template>
  <div ref='hVideoPlayer'
       :class="[isHorizontal ?'':'blackBg','hVideoPlayer',model === 'v'?'v':'h', isLoading?'isLoading':'']">
    <div v-show="model === 'h'"
         class="maskBg"></div>
    <div :style="style">
      <div :class="['player',reverse?'r':'']"
           @click.stop='changeShowControl'>
        <video-player class="video-player vjs-custom-skin"
                      ref="videoPlayer"
                      :playsinline="true"
                      :options="playerOptions"
                      @play="onPlayerPlay($event)"
                      @pause="onPlayerPause($event)"
                      @statechanged="playerStateChanged($event)"
                      @timeupdate="playerCurrentTime(data)"
                      @ready="playerReadied($event)"></video-player>
      </div>
      <div v-show="showControl"
           @click='back'
           class="backBtn iconWleftBack iconWanwan"></div>
      <div v-if="isLoading"
           class="video--loading">
        <div class="loadingTxt">资源加载中...</div>
        <div class="loadingBar">
          <div class="loadingBarInner"></div>
        </div>
      </div>
      <div v-show='showControl && !isLoading'
           :style="controlStyle"
           class="playControl visible">
        <div class="playControlContent">
          <div :class="['pauseBtn', isPlay ?'iconWiconstop' : 'iconWbofang', 'iconWanwan']"
               @click.stop="togglePlay"></div>
          <div class="curTime">{{currentTime}}</div>
          <div class="playProgess"
               @click.stop="setCurrentTime">
            <span class="bgBar"
                  ref="bgBar"></span>
            <span class="playerPoint"
                  ref="timeBar"
                  @touchstart.prevent="startChangeCurrentTime"
                  @touchend.prevent="endChangeCurrentTime"
                  @touchmove.prevent="moveChangeCurrentTime"
                  id="div2"></span>
            <span class="playerProgress"
                  ref="playBar"></span>
          </div>
          <div class="curTime">{{duration}}</div>
          <div @click.self='toggleMode'
               :class="['fullScreenBtn','iconWanwan',{'iconWziyuanldpi1' : model === 'v'}, {'iconWsuoxiao1':model==='h' || model === 'b'}]"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import tellPlayTimeMixin from '@/components/video/tellPlayTimeMixin'

import { videoPlayer } from 'vue-video-player'
import { mapState, mapMutations } from 'vuex'
export default {
  mixins: [tellPlayTimeMixin],
  components: {
    videoPlayer
  },
  props: {
    item: {
      type: Object
    }
  },
  data() {
    return {
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: true, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:10', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            // eslint-disable-next-line
            type: 'video/ogg',
            // eslint-disable-next-line
            type: 'video/webm',
            // eslint-disable-next-line
            type: 'video/mp4',
            src: this.item.video // 你的m3u8地址（必填）
          }
        ],
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
      isLoading: true,
      model: 'v', // 播放模式 'v' | 'h'
      itemStyle: '', // 初始组件就计算全屏时候的style
      controlHStyle: '', // 初始组件就计算全屏时候 control的style
      controlStyle: '', // control的style
      style: '', // 应用的style
      reverse: false, // 是否镜面
      currentTime: 0,
      curTime: 0,
      duration: 0,
      durationTime: 0,
      isPlay: false,
      progressBar: '',
      touch: {},
      newProgress: 0,
      showControl: true,
      itemData: {},
      commentsListShow: false, // 显示评论列表
      commentsType: 0,
      commentsId: '',
      inputContent: '',
      userInputContent: '',
      hasMusic: false,
      placeholder: '留下您的精彩评论吧！',
      userInputShow: false,
      limitNum: 40,
      playCount: 0,
      videoDom: null,
      isHorizontal: true
    }
  },
  created() {
    this.resetVideo()
    this.itemCover && this.$set(this.playerOptions, 'poster', this.itemCover)
  },
  beforeDestroy () {
    this.PostVideoDetails()
  },
  mounted() {
    this.videoDom = this.$refs.hVideoPlayer.getElementsByTagName('video')[0]
  },
  computed: {
    ...mapState({
      hasMask: 'hasMask'
    }),
    player() {
      return this.$refs.videoPlayer.player
    },
    postId () {
      return this.item && this.item.postId
    },
    itemCover () {
      return this.item.videoCover
    }
  },
  watch: {
    // 弹出框关闭后暂停 否则一直在播放 state从弹出框组件传值
    state: function(val) {
      if (val) {
        this.$refs.videoPlayer.player.pause()
      }
    },
    model(newV) { // 切换 全屏模式
      newV === 'h' && this.chooseH()
      newV === 'b' && this.chooseB()
      if (newV === 'v') {
        if (this.isHorizontal) {
          this.style = ''
          this.controlStyle = ''
        } else {
          this.chooseV()
        }
      }
    },
    curTime (newV) { // 播放时间
    // console.log(newV, 'curTime')
      // 拖动的时候不要watch
      if (newV >= 0 && !this.touch.init) {
        let moveDisRate = newV / this.durationTime
        this.changeProgress(moveDisRate)
      }
    },
    hasMask (newV, oldV) {
      if (!newV && oldV) { // hasMask 为否 就退出全屏
        this.model = 'v'
      }
    }
  },
  methods: {
    ...mapMutations({
      setMask: 'setMask'
    }),
    resetVideo () {
      let wW = document.documentElement.clientWidth
      let wH = document.documentElement.clientHeight
      if (this.item.height > this.item.wight) { // 竖屏模式
        this.$set(this.playerOptions, 'aspectRatio', '16:9')
        this.isHorizontal = false
        return
      }
      this.$set(this.playerOptions, 'aspectRatio', `${parseInt(this.item.wight)}:${parseInt(this.item.height)}`)
      let ratio = this.playerOptions.aspectRatio.split(':')
      let pH = (wW * ratio[1]) / ratio[0] / 2
      let tH = (wH / 2) - pH + 'px'
      let scale = `${parseInt(this.item.wight)}` / `${parseInt(this.item.height)}`
      let controlScale = wH / wW / scale
      this.itemStyle = `transform: translate3d(0,${tH},0) rotate(90deg) scale(${scale});`
      this.controlHStyle = `transform: scale(${controlScale});`
    },
    back () { // 退出页面 | 退出全屏
      if (this.model === 'h' || this.model === 'b') {
        this.model = 'v'
        this.showControl = (this.model === 'v')
        this.setMask(false)
      } else {
        this.$router.back()
      }
    },
    toggleMode() { // 切换FullScreen
      if (!this.isHorizontal) {
        this.toggleBig()
      } else {
        this.toggleHV()
      }
    },
    toggleBig () {
      this.model = this.model === 'b' ? 'v' : 'b'
      this.setMask(this.model === 'b')
    },
    toggleHV () {
      this.model = this.model === 'h' ? 'v' : 'h'
      this.showControl = (this.model === 'v')
      this.setMask(this.model === 'h')
    },
    chooseH () { // 横屏模式
      this.style = this.itemStyle
      this.controlStyle = this.controlHStyle
    },
    chooseB () { // 放大模式
      let wW = document.documentElement.clientWidth
      let wH = document.documentElement.clientHeight
      this.$set(this.playerOptions, 'aspectRatio', `${parseInt(wW)}:${parseInt(wH)}`)
      this.setMask(true)
    },
    chooseV () { // 小屏模式
      if (!this.isHorizontal){
        console.log('v')
        this.$set(this.playerOptions, 'aspectRatio', '16:9')
      }
    },
    changeShowControl() { // 切换显示controls
      this.showControl = !this.showControl
    },
    toSlowly () { // 慢速播放
    //   this.videoDom.playbackRate = 0.7
      let rate = this.$refs.videoPlayer.player.playbackRate() == 1 ? 0.6 : 1
      this.$toast(rate == 1 ? '正常播放' : '慢速播放')
      this.$refs.videoPlayer.player.playbackRate(rate)
    },
    toReverse () { // 反向
      this.reverse = !this.reverse
      this.$toast(this.reverse ? '镜面模式' : '正常模式')
    },
    onPlayerPlay() {
      console.log('onPlayer')
      this.isPlay = true
    },
    onPlayerPause() {
      this.isPlay = false
    },
    playerStateChanged() { // 播放时间
      this.curTime = this.player.currentTime() && this.player.currentTime()
      this.durationTime = this.player.duration()
      this.currentTime = this.format.toMinOne(this.player.currentTime())
      this.duration = this.format.toMinOne(this.player.duration())
    },
    playerReadied() {
      console.log('ready')
      this.$refs.videoPlayer.player.play()
      this.isLoading = false
    },
    playerCurrentTime() {
    },
    togglePlay() { // 播放 | 暂停
      console.log()
      if (this.isPlay) {
        this.$refs.videoPlayer.player.pause()
      } else {
        this.$refs.videoPlayer.player.play()
      }
    },
    setCurrentTime(e) {
      let progressBar = this.$refs.bgBar
      // let progress = this.$refs.playBar
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
              (progressBar.getBoundingClientRect().height - progressPoint.getBoundingClientRect().height)
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
          progressBar.getBoundingClientRect().height - progressPoint.getBoundingClientRect().height,
          Math.max(0, this.touch.left + deltaX - progressPoint.getBoundingClientRect().height / 2)
        )
        this.newProgress =
        newWidth / (progressBar.getBoundingClientRect().height - progressPoint.getBoundingClientRect().height)
      }
      
      this.changeProgress(this.newProgress)
      // this.emitProgress()
      // this.$store.commit('setMusicChangeRage', this.newProgress)
      this.player.currentTime(this.newProgress * this.durationTime)
    },
    endChangeCurrentTime () {
      this.touch.init = false
    },
    changeProgress (newRate) {
      let progressBar = this.$refs.bgBar
      let progress = this.$refs.playBar
      let progressPoint = this.$refs.timeBar
      if (this.$refs.lbgBar) {
        let lprogressBar = this.$refs.lbgBar
        let lprogress = this.$refs.lplayBar
        lprogress.style.width =
        newRate * (lprogressBar.clientWidth) + 'px'
      }
      progress.style.width =
        newRate * (progressBar.clientWidth) + 'px'
      progressPoint.style.left =
        newRate * (progressBar.clientWidth) - progressPoint.clientWidth/2  + 'px'
    }
  }
}
</script>
<style lang="less">
@keyframes  longer {
  0%{
    width: 0;
  }
  100%{
    width: 100%;
  }
}
.hVideoPlayer {
  &.blackBg{
    background: #000;
  }
  &.isLoading{
    .vjs-big-play-button{
      display: none!important;
    }
  }
  width: 100vw;
  touch-action: none;
  position: fixed;
  z-index: 200;
  top: 0;
  left: 0;
  .video--loading{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    // background-color: #333;
    z-index: 100;
    .loadingTxt{
      position: absolute;
      width: 100%;
      height: 6vw;
      line-height: 6vw;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      color: #fff;
      text-align: center;
      font-size: 14px;
      letter-spacing: 1px;
    }
    .loadingBar{
      position: absolute;
      width: 100%;
      height: 1px;
      bottom: 10vw;
      left: 0;
      background-color: #ccc;
      .loadingBarInner{
        position: absolute;
        height: 100%;
        left: 50%;
        top: 0;
        transform: translate3d(-50%,0,0);
        background-color: #fff;
        animation: longer 0.5s infinite 0.2s ease-in-out;
      }
    }
  }
  .maskBg{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000;
  }
  &.h{
    z-index: 100000;
  }
  .player.r{
    transform: rotateY(180deg);
    transform-origin: center 0;
  }
  .iconWleftBack {
    position: absolute;
    z-index: 200;
    left: 0;
    top: 0;
    width: 12vw;
    height: 12vw;
    line-height: 12vw;
    background-color: transparent;
    color: #fff;
    text-shadow: 1px 1px 1px #333, 2px 2px 2px #333;
    text-align: center;
  }
  .playModels {
    position: absolute;
    width: 30vw;
    height: 12vw;
    line-height: 12vw;
    top: 0;
    right: 0;
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    > div {
        display: inline-block;
        width: 9vw;
        height: 9vw;
        line-height: 9vw;
        background: rgba(0,0,0,0.6);
        text-align: center;
        color: #fff;
        font-size: 3.6vw;
        border-radius: 50%;
        margin-right: 4vw;
    }
  }
  .playControl {
    &.visible {
      visibility: visible;
      .playProgess {
        position: relative;
        flex: 1;
      }
      .fullScreenBtn{
        width: 12vw;
        text-align: center;
      }
    }
    &.notVisible {
      visibility: hidden;
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
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 100%;
      color: #f9f9f9;
      .pauseBtn, .fullScreenBtn{
        // position: absolute;
        text-align: center;
        width: 12vw;
        height: 12vw;
        left: 0;
        bottom: 0;
        z-index: 10;
      }
      .curTime,.fullScreenBtn{
        width: 12vw;
        height: 100%;
        text-align: center;
        font-size: var(--nText);
        letter-spacing: 1px;
      }
    }
  }
  .playProgess {
    position: absolute;
    width: 100%;
    height: 1px;
    left: 0;
    bottom: 0;
    // background: #c7b9b3;
    // background: #79716c !important;
    // background: #79716c !important;
    .bgBar {
      visibility: visible !important;
      position: absolute;
      z-index: 1;
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
      border-radius: 50%;
      background: rgba(255,255,255,0.5) !important;
    //   margin-top: -1px;
      transform: translate3d(0, -8px, 0);
      &::before,&::after{
        position: absolute;
        z-index: 110;
        content: '';
        width: 4px;
        height: 4px;
        left: 50%;
        top: 50%;
        background: #fff;
        border-radius: 50%;
        transform: translate3d(-50%, -50%, 0);
        opacity: 1;
      }
    }
    .playerProgress {
      visibility: visible !important;
      position: absolute;
      z-index: 99;
      height: 1px;
      left: 0;
      top: 0;
      background: #ff2742 !important;
    }
  }
}
.player{
  touch-action: none;
  position: relative;
  z-index: 100;
  div{
    background-color: transparent;
  }
  .video-player {
    position: relative;
    background-color: transparent;
    .vjs-tech {
      z-index: -1;
    }
  }
}
.vjs-has-started.vjs-user-inactive.vjs-playing .vjs-control-bar,
.vjs-custom-skin > .video-js .vjs-control-bar {
  display: none !important;
}
.video-js .vjs-modal-dialog {
  display: none !important;
}
.vjs-custom-skin > .video-js .vjs-big-play-button {
  top: 40% !important;
}
</style>
