<template>
  <transition name="mySet">
    <div class="musicInnterWrap"
         ref='musicInnerWrap'>
      <MusicShare :item="musicInnerData"
                  :isDelete="isDelete"
                  type="discover"
                  v-if="isMusic"
                  @showMusicShare="showMusicShare"></MusicShare>
      <div class='musicInner'
           :style="{'transform': transform}">
        <commentsList :isMusic="isMusicPage"
                      v-if="commentsListShow"
                      :countReply="currentItem.countReply"
                      @setCommentsPlate="setCommentsListShow"
                      @upcountReply="upcountReply"
                      :commentsType="commentsType"
                      :commentsId="commentsId"
                      :OneItem="musicInnerData"></commentsList>
        <musicPlayList v-show="musicPlayListshow"></musicPlayList>
        <div class="musicPlayListshowMask"
             v-show="musicPlayListshow"
             @click="setMusicPlayList(false)"></div>
        <div class="back borderB">
          <span @click="setMusicInner">
            <i class="iconWanwan iconWfanhui activityNotice"></i>
          </span>
          <span>声音</span>
        </div>
        <div class="innerHead">
          <div class="headLeft">
            <div class="userAvator">
              <img :src="!musicInnerData.avatar ? defaultAvatar : musicInnerData.avatar"
                   alt>
            </div>
            <div class="userName">{{musicInnerData.nickName}}</div>
          </div>
          <div class="headRight">
            <div class="followBtn">
              <BtnFollow :item="musicInnerData"></BtnFollow>
            </div>
            <span class="share"
                  @click="showMusicShare(true)"><i class="iconWanwan iconWweixinfenxiang activityNotice"></i></span>
          </div>
        </div>
        <div class="innerContent">
          <div class="swiperWrap">
            <!-- <div class="image">
                  <img :src="musicInnerData.imageUrl" alt="">
            </div>-->
            <MySwiper v-if="show"
                      @prveMusic="prveMusic"
                      @nextMusic="nextMusic"></MySwiper>
          </div>
          <div class="musicPlayBar">
            <div class="fontWrap">
              <div class="fontScroll">
                <span class="musicTitle titleTwo">{{musicInnerData.title}}</span>
              </div>
            </div>
            <div class="musicBar"
                 @click="setCurrentTime">
              <span class="longBigBar"
                    id="longBar"
                    ref="bgBar"></span>
              <span class="sortBar"
                    ref="timeBar"
                    @touchstart.prevent="startChangeCurrentTime"
                    @touchend.prevent="endChangeCurrentTime"
                    @touchmove.prevent="moveChangeCurrentTime"
                    id="div2"></span>
              <span ref="playBar"></span>
              <div class="playTime">
                <span class="startTime">{{musicCurrentTime}}</span>
                <span class="endTime">{{musicDurationTime}}</span>
              </div>
            </div>
            <div class="playTool">
              <div class="toolWrap">
                <span>
                  <i class="iconWanwan iconWshangyishou-copy activityNotice"
                     @click="prveMusic"></i>
                </span>
                <div class="middleBtnWrap">
                  <span class="middleBtn">
                    <i class="iconWanwan iconWbofang myRotate"
                       :class="{pause:!isPlaying}"
                       @click="handleMusicPlay"></i>
                    <i class="iconWanwan iconWiconstop-copy myRotate"
                       :class="{play:isPlaying}"
                       @click="handleMusicPlay"></i>
                  </span>
                </div>

                <span>
                  <i class="iconWanwan iconWxiayishou-copy activityNotice"
                     @click="nextMusic"></i>
                </span>
              </div>
              <div class="musicCount"
                   @click="setMusicPlayList(true)">
                <i class="iconWanwan iconWyinleku activityNotice"></i>
              </div>
            </div>
          </div>
          <div class="musicMessageNav">
            <div class="stateBtn1"
                 @click="btnClickLike(2)">
              <i class="icon iconfont icon-icon_subinfobox1 myLike"
                 :class="{'icon-redxin-copy': isLike, 'icon-favorites': !isLike}"></i>
              <!-- eslint-disable-next-line -->
              <i class="count">{{formatTotalLike}}</i>
            </div>
            <div class="stateBtn2"
                 @click="btnClickFav(1)">
              <i class="icon iconfont icon-icon_subinfobox2 myLike"
                 :class="{'icon-wjx-shixin': isFavs, 'icon-wjx': !isFavs}"></i>
              <!-- eslint-disable-next-line -->
              <i class="count">{{formatTotalCollection}}</i>
            </div>
            <div class="stateBtn3"
                 @click="setCommentsListShow(true, musicInnerData)">
              <i class="icon-icon_subinfobox1 icon-xiaoxi1 iconfont myLike"></i>
              <i class="mycount">{{formatCountReplay}}</i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import MusicShare from '@/components/music/musicShare'
import authentication from '@/assets/js/LoginHelper'
import BtnFollow from '@/components/Btn/BtnFollow'
import { mapState, mapGetters, mapMutations } from 'vuex'
import musicPlayList from '@/components/music/musicPlayList'
import commentsList from '@/components/comments/commentsList'
import MySwiper from '@/components/MySwiper'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isMusicPage: true, // 表示是音乐页
      defaultAvatar: 'http://webapp.szwanwan.com/img/default/defaultavatar.png',
      tag: true,
      timer: '',
      moveTimer: '',
      longBar: '',
      progressBar: '',
      touch: {},
      newProgress: 0,
      isShowComment: false,
      musicPlayListshow: false,
      musicInnerData: {}, // music内页详细数据
      commentsListShow: false, // 显示评论列表
      commentsType: 1,
      commentsId: '', // 表示评论列表的id
      operationType: 'voice',
      objectId: '', // 操作的id
      objectType: '', // 操作的类型
      likeState: '', // 表示点赞的状态
      countTotalLike: '', // 表示点赞的数据,
      countTotalCollection: '', // 表示收藏的数据
      currentItem: [],
      transform: '',
      isMusic: false, // 表示是音乐页的举报
      isDelete: false, // 表示是否是删除自己的动态
      
    }
  },
  components: {
    BtnFollow,
    musicPlayList,
    commentsList,
    MySwiper,
    MusicShare
  },
  computed: {
    ...mapState([
      'isPlaying',
      'currentIndex',
      'playList',
      'squenceList',
      'musicMode',
      'pieShow',
      'currentTime',
      'duration',
      'musicInnerShow',
      'countReply',
      'likes',
      'disLikes',
      'favs',
      'disFavs'
    ]),
    ...mapGetters([
      'musicCover',
      'musicSrc',
      'musicItem',
      'musicCurrentTime',
      'musicDurationTime'
    ]),
    // 点赞
    isLike() {
      let isLike =
        this.likes &&
        this.likes.length >= 1 &&
        this.likes.indexOf(this.objectId) !== -1
      let disLikes =
        this.disLikes &&
        this.disLikes.length >= 1 &&
        this.disLikes.indexOf(this.objectId) !== -1
      if (isLike) {
        return true
      } else if (disLikes) {
        return false
      } else {
        return this.musicInnerData.isLike
      }
    },
    // 收藏
    isFavs() {
      let isFavs =
        this.favs &&
        this.favs.length >= 1 &&
        this.favs.indexOf(this.objectId) !== -1
      let disFavs =
        this.disFavs &&
        this.disFavs.length >= 1 &&
        this.disFavs.indexOf(this.objectId) !== -1
      if (isFavs) {
        return true
      } else if (disFavs) {
        return false
      } else {
        return this.musicInnerData.isCollection
      }
    },
    /**
     * formatTotalLike格式化总的喜欢数
     */
    formatTotalLike() {
      if (this.countTotalLike > 1000 && this.countTotalLike <= 9999) {
        let newStr = this.countTotalLike.toString()
        let str = newStr.substring(0, 1)
        return str + 'k'
      } else if (this.countTotalLike > 10000) {
        let newStr = this.countTotalLike.toString()
        let str = newStr.substring(0, 2)
        return str + 'k'
      } else {
        return this.countTotalLike <= 0 ? '' : this.countTotalLike
      }
    },
    /**
     * formatTotalCollection格式化收藏数
     */
    formatTotalCollection() {
      if (
        this.countTotalCollection > 1000 &&
        this.countTotalCollection <= 9999
      ) {
        let newStr = this.countTotalCollection.toString()
        let str = newStr.substring(0, 1)
        return str + 'k'
      } else if (this.countTotalCollection > 10000) {
        let newStr = this.countTotalCollection.toString()
        let str = newStr.substring(0, 2)
        return str + 'k'
      } else {
        return this.countTotalCollection <= 0 ? '' : this.countTotalCollection
      }
    },
    /**
     * formatCountReplay格式化评论数
     */
    formatCountReplay() {
      if (
        this.musicInnerData.countReply > 1000 &&
        this.musicInnerData.countReply <= 9999
      ) {
        let newStr = this.musicInnerData.countReply.toString()
        let str = newStr.substring(0, 1)
        return str + 'k'
      } else if (this.musicInnerData.countReply > 10000) {
        let newStr = this.musicInnerData.countReply.toString()
        let str = newStr.substring(0, 2)
        return str + 'k'
      } else {
        return this.musicInnerData.countReply <= 0
          ? ''
          : this.musicInnerData.countReply
      }
    }
  },
  mounted () {
    this.getMusicInner()
    if (!this.$refs.musicInnerWrap || !this.$refs.musicInnerWrap.offsetHeight) {
      this.transform  = 'scale(1)'
    } else if (this.$refs.musicInnerWrap.offsetHeight > window.innerHeight) {
      this.transform  = 'scale(' + window.innerHeight / this.$refs.musicInnerWrap.offsetHeight + ')'
    } else {
      this.transform  = 'scale(1)'
    }
    console.log(this.transform, 'transform', window.innerHeight / this.$refs.musicInnerWrap.offsetHeight)
  },
  watch: {
    currentTime(newV) {
      // 拖动的时候不要watch
      if (newV >= 0 && !this.touch.init) {
        let moveDisRate = newV / this.duration
        this.changeProgress(moveDisRate)
      }
    },
    musicSrc() {
      this.getMusicInner()
    }
  },
  methods: {
    ...mapState(['squencelist']),
    ...mapMutations([
      'setMusicChangeRage',
      'setMusicNext',
      'setMusicPrve',
      'setMusicInnerShow',
      'setCountReply',
      'upLike',
      'upDisLike',
      'upFav',
      'upDisFav',
      'updateMyPage'
    ]),
    /**
     * 音乐分享
     */
    showMusicShare () {
      // console.log('打印路径', this.$router.currentRoute.fullPath)
      // this.isMusic = data
      // this.$share.open(item, false, 'music', this.$router.currentRoute.fullPath)
      // console.log('打印这个音乐数据', this.musicInnerData)
      // return
      let innerObj = {
        name: this.$route.name,
        objectId: this.musicInnerData.voiceId
      }
      this.$share.open(this.musicInnerData, false, 'music', this.$router.currentRoute.fullPath, innerObj)
    },
    /**
     * btnClickLike 点赞
     */
    btnClickLike(stateIndex) {
      let me = this
      if (!authentication.isLogin()) {
        this.go.login()
        return
      }
      if (!me.isLike) {
        // 如果是没有点赞状态
        me.submitLike(stateIndex)
      } else {
        // 如果是取消状态
        me.cancelLike(stateIndex)
      }
    },
    /**
     * 改变点赞的类型
     */
    changType(index) {
      // 如果是post类型
      let me = this
      if (me.operationType === 'post') {
        // 表示是post类型
        // eslint-disable-next-line
        return
      } else {
        me.objectType = 1 // 表示是声音
      }
    },
    /**
     * submitLike 用户点赞
     */
    submitLike(index) {
      let me = this
      // 改变点赞的类型
      me.changType(index)
      me.api.process({
        url: 'Operate',
        data: {
          objectId: me.objectId,
          oprateType: index,
          objectType: me.objectType,
          isCancel: true // true表示点赞 false表示取消点赞
        },
        success: function(res) {
          if (index === 2) {
            me.upLike(me.objectId)
            me.countTotalLike++
          } else {
            me.upFav(me.objectId)
            me.countTotalCollection++
            let obj = {
              isRefreshCollect: 2, // 2表示对音乐的收藏
            }
            me.updateMyPage(obj)
          }
        }
      })
    },
    /**
     * cancelLike 取消点赞
     */
    cancelLike(index) {
      let me = this
      me.changType(index)
      me.api.process({
        url: 'Operate',
        data: {
          objectId: me.objectId,
          oprateType: index,
          objectType: me.objectType,
          isCancel: false // 为flase表示取消点赞操作
        },
        success: function(res) {
          if (index === 2) {
            // 表示赞
            me.upDisLike(me.objectId)
            me.countTotalLike--
          } else {
            // 表示收藏
            me.upDisFav(me.objectId)
            me.countTotalCollection--
            let obj = {
              isRefreshCollect: 2, // 2表示对音乐的收藏
            }
            me.updateMyPage(obj)
          }
        }
      })
    },
    // 点赞结束
    // 收藏开始
    btnClickFav(stateIndex) {
      console.log('音乐的收藏')
      let me = this
      if (!this.authentication.isLogin()) {
        this.go.login()
        return
      }
      if (!me.isFavs) {
        // 如果是没有收藏状态
        me.submitLike(stateIndex)
      } else {
        // 如果是取消状态
        me.cancelLike(stateIndex)
      }
    },
    /**
     * getMusicInner 获得声音内页的数据
     */
    getMusicInner() {
      let me = this
      let musicId = me.musicItem.voiceId
      console.log('打印这个id', musicId)
      me.api.get({
        url: `Voice/id?VoiceId=${musicId}`,
        success: function(res) {
          me.musicInnerData = res
          // 改变音乐id
          me.objectId = res.voiceId
          me.likeState = res.isLike
          me.countTotalLike = res.countLike
          me.countTotalCollection = res.countCollection
        }
      })
    },
    setCurrentTime(e) {
      let progressBar = this.$refs.bgBar
      let progressPoint = this.$refs.timeBar
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
      this.changeProgress(this.newProgress)
      this.$store.commit('setMusicChangeRage', this.newProgress)
    },
    startChangeCurrentTime(e) {
      this.touch.init = true
      // 开始滑动的位置
      this.touch.startX = e.touches[0].pageX
      // 当前偏移
      this.touch.left = this.$refs.playBar.clientWidth
    },
    moveChangeCurrentTime(e) {
      let progressBar = this.$refs.bgBar
      // let progress = this.$refs.playBar
      let progressPoint = this.$refs.timeBar
      if (!this.touch.init) return
      // 滑动的差值
      let deltaX = e.touches[0].pageX - this.touch.startX
      // 进度条的差值，大于0，小于总长度
      let newWidth = Math.min(
        progressBar.clientWidth - progressPoint.clientWidth,
        Math.max(0, this.touch.left + deltaX - progressPoint.clientWidth / 2)
      )
      this.newProgress =
        newWidth / (progressBar.clientWidth - progressPoint.clientWidth)
      this.changeProgress(this.newProgress)
      // this.emitProgress()
      this.$store.commit('setMusicChangeRage', this.newProgress)
    },
    endChangeCurrentTime(e) {
      this.touch.init = false
    },
    changeProgress(newRate) {
      let progressBar = this.$refs.bgBar
      let progress = this.$refs.playBar
      let progressPoint = this.$refs.timeBar
      progress.style.width =
        newRate * (progressBar.clientWidth - progressPoint.clientWidth) +
        progressPoint.clientWidth / 2 +
        'px'
      progressPoint.style.left =
        newRate * (progressBar.clientWidth - progressPoint.clientWidth) + 'px'
    },
    handleMusicPlay() {
      this.$store.commit('setMusicPlay', !this.isPlaying)
    },
    nextMusic() {
      this.$store.commit('setMusicNext')
    },
    prveMusic() {
      this.$store.commit('setMusicPrve')
    },
    setMusicMode(str) {
      this.$store.commit('setMusicMode', str)
    },
    setMusicInner() {
      this.$store.commit('setMusicInnerShow', !this.musicInnerShow)
      this.$store.commit('setMask', false)
    },
    setMusicPlayList(data) {
      this.musicPlayListshow = data
    },
    // 设置评论
    setCommentsListShow(data, item) {
      if (item) {
        this.commentsId = item.voiceId
        // this.countReply = item.countReply
        this.setCountReply(item.countReply)
      }
      item && (this.currentItem = item)
      this.commentsListShow = data
    },
    // setCommentsListShow (data, item) {
    //   if (item) {
    //     this.commentsId = item.voiceId
    //     this.$store.commit('setCountReply', item.countReply)
    //   }
    //   this.commentsListShow = data
    // },
    upDateCountReply() {},
    upDateMusicInnerData(item) {
      this.musicInnerData = item
      console.log('答应新的', item, this.musicInnerData)
    },
    upcountReply() {
      this.currentItem.countReply++
    }
  }
}
</script>

<style lang="less" scoped>
@keyframes movePause {
  0% {
    transform: rotate(0deg);
    opacity: 0;
  }
  100% {
    transform: rotate(360deg);
    opacity: 1;
  }
}
@keyframes movePlay {
  0% {
    transform: rotate(0deg);
    opacity: 0;
  }
  100% {
    transform: rotate(360deg);
    opacity: 1;
  }
}
// 表示蓝色，前面一个
@keyframes moveOne {
  0% {
    right: -70vw;
    opacity: 1;
  }
  100% {
    right: 70vw;
    opacity: 1;
  }
}
@keyframes moveTwo {
  0% {
    right: -50vw;
    opacity: 1;
  }
  100% {
    right: 5 0vw;
    opacity: 1;
  }
}
.musicInnterWrap {
  position: fixed;
  min-height: 100%;
  width: 100vw;
  top: 0;
  left: 0;
  z-index: 10000;
  background: rgb(245, 245, 245);
  // overflow: scroll;
  .musicInner {
    transform-origin: 50% 0;
  }
  .musicPlayListshowMask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 101;
  }
  &.mySet-enter-active,
  &.mySet-leave-active {
    transition: all 0.75s ease;
  }
  &.mySet-enter,
  &.mySet-leave-to {
    top: 200vw;
    opacity: 0.5;
  }
  .back {
    width: 100%;
    height: 12vw;
    line-height: 12vw;
    position: relative;
    text-align: center;
    color: #666;
    span:nth-child(1) {
      position: absolute;
      left: 7.5vw;
      .activityNotice {
        color: #666;
        font-size:4.5vw;
        font-weight: bold;
      }
    }
  }
  .innerHead {
    width: 93%;
    height: 15.74vw;
    margin: auto;
    display: flex;
    justify-content: space-between;
    .headLeft {
      display: flex;
      align-items: center;
      height: 15.74vw;
      .userAvator {
        width: 9.26vw;
        height: 9.26vw;
        border: 1px solid rgb(243, 243, 243);
        overflow: hidden;
        border-radius: 50%;
        border: 1px solid rgb(197, 197, 197);
        img {
          width: 9.26vw;
          height: 9.26vw;
        }
      }
      .userName {
        font-size: 4.8vw;
        color: #181818;
        margin-left: 2.3vw;
      }
    }
    .headRight {
      display: flex;
      align-items: center;
      height: 15.74vw;
      .share {
        height: 8vw;
        line-height: 6vw;
        margin-left: 2.3vw;
        font-weight: bold;
        color: #181818;
        letter-spacing: 3px;
        .activityNotice{
          // color:white;
          // font-size: 6.3vw;
          // font-weight: 500;
          // text-shadow: 0 0 3px #000;
              font-size:5vw;
              font-weight: 500;
              background:rgb(59, 187, 7);
              width:8vw;
              height:8vw;
              text-align: center;
              line-height:8vw;
              border-radius: 50%;
              display:inline-block;
              color:white;
        }
      }
    }
  }
  .innerContent {
    width: 100%;
    position: relative;
    .swiperWrap {
      width: 100%;
      //  height:60.79vw;
      .image {
        width: 67.4vw;
        height: 67.4vw;
        border-radius: 3vw 3vw 3vw 3vw;
        overflow: hidden;
        margin: auto;
        img {
          width: 67.4vw;
          height: 67.4vw;
          border-radius: 3vw 3vw 3vw 3vw;
        }
      }
    }

    .musicPlayBar {
      width: 100%;
      padding: 0 4vw;
      box-sizing: border-box;
      margin-top: 3vw;
      .fontWrap {
        width: 67.4vw;
        margin: auto;
        border-radius: 0vw 0vw 3vw 3vw;
        //  background-color:white;
      }
      .fontScroll {
        width: 55vw;
        height: 12.31vw;
        margin: auto;
        position: relative;
        overflow: hidden;
      }
      .musicTitle {
        display: inline-block;
        height: 12.31vw;
        line-height: 12.31vw;
        text-align: center;
        color: #4c4c4c;
        font-size: 5.8vw;
      }
      .titleOne {
        display: inline-block;
        width: 50vw;
        position: absolute;
        top: 0;
        right: -50vw;
        animation: moveTwo 15s 0s linear forwards infinite;
      }
      .titleTwo {
        display: inline-block;
        //  width:50vw;
        position: absolute;
        top: 0;
        white-space: nowrap;
        right: -70vw;
        animation: moveOne 15s 0s linear forwards infinite;
      }
      .titleThree {
        display: inline-block;
        width: 50vw;
        position: absolute;
        top: 0;
        left: 0vw;
      }
      .playTool {
        width: 100%;
        height: 25vw;
        display: flex;
        align-items: center;
        margin-top: 7vw;
        position: relative;
        .myAudio {
          border: 1px solid blue;
          width: 20vw;
          height: 30vw;
        }
        .toolWrap {
          width: 54.48vw;
          height: 24.43vw;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 4.35vw;
          box-sizing: border-box;
          span:nth-child(1) {
            .activityNotice {
              font-size: 5vw;
              color: rgb(170, 170, 170);
            }
          }
          .middleBtnWrap {
            width: 20vw;
            height: 20vw;
            border-radius: 50%;
            position: relative;
            background: rgba(255, 192, 203, 0.5);
          }
          .middleBtn {
            width: 13.7vw;
            height: 13.7vw;
            margin: auto;
            background-color: rgb(255, 39, 66);
            border-radius: 50%;
            text-align: center;
            line-height: 13.7vw;
            color: white;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            .myRotate {
              display: inline-block;
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              color: rgb(255, 39, 66);
            }
            .pause {
              text-align: center;
              display:inline-block;
              line-height: 13.7vw;
              z-index: 2;
              opacity: 0;
              animation: movePause ease 0.5s 0s forwards;
              color: white;
              padding-left: 1vw;
              box-sizing: border-box;
              font-size: 7vw;
            }
            .play {
              text-align: center;
              display:inline-block;
              line-height: 13.7vw;
              color: white;
              z-index: 2;
              animation: movePlay ease 0.5s 0s forwards;
              font-size: 7vw;
            }
          }
          span:nth-child(3) {
            .activityNotice {
              font-size: 5vw;
              color: rgb(170, 170, 170);
            }
          }
        }
        .musicCount {
          width: 13.7vw;
          height: 13.7vw;
          border-radius: 50%;
          margin-left: 3.33vw;
          text-align: center;
          line-height: 13.7vw;
          color: #4c4c4c;
          position: absolute;
          top: 0;
          right: 4vw;
          bottom: 0;
          margin: auto 0;
          .activityNotice {
            font-size: 6vw;
            color: rgb(120, 120, 120);
          }
        }
      }
      .musicBar {
        width: 100%;
        height: 4vw;
        margin-bottom: 6.56vw;
        margin-top: 24.8vw;
        position: relative;
        display: flex;
        flex-flow: row wrap;
        box-sizing: border-box;
        .longBigBar {
          display: inline-block;
          width: 100%;
          height: 1.3vw;
          background-color: #d2d2d2;
          border-radius: 2vw;
          margin-top: 2vw;
        }
        .sortBar {
          display: inline-block;
          width: 15px;
          height: 15px;
          position: absolute;
          z-index: 100;
          left: 0;
          top: -0.7vw;
          background-color: rgb(255, 39, 66);
          border-radius: 50%;
          box-sizing: content-box;
          border: 5px solid pink !important;
        }
        span:nth-child(3) {
          display: inline-block;
          width: 0vw;
          height: 1.3vw;
          background-color: rgb(255, 39, 66);
          border-radius: 2vw 0 0 2vw;
          position: absolute;
          top: 2vw;
          left: 0;
        }
        .playTime {
          width: 100%;
          position: absolute;
          top: -6.5vw;
          left: 0;
          display: flex;
          justify-content: space-between;
          .startTime {
            display: inline-block;
            font-size: 3.42vw;
            color: #666;
          }
          .endTime {
            display: inline-block;
            font-size: 3.42vw;
            color: #666;
          }
        }
      }
    }
    .musicMessageNav {
      position: absolute;
      top: 93vw;
      right: 0vw;
      left: 0;
      margin: auto;
      width: 60vw;
      height: 10vw;
      text-align: center;
      display: flex;
      justify-content: space-between;
      .stateBtn1 {
        width: 17vw;
        height: 11vw;
        font-size: 0;
        i {
          display: inline-block;
          height: 4.5vw;
          font-size: 4vw;
          font-style: normal;
          color: #333;
          line-height: 4.5vw;
        }
        .icon-redxin-copy {
          color: red !important;
        }
        .myLike {
          font-size: 5.833vw;
          font-weight: 500;
          padding-top: 1.5vw;
          box-sizing: border-box;
        }
        .count {
          vertical-align: top;
          color:#999;
        }
      }
      .stateBtn2 {
        width: 17vw;
        height: 11vw;
        font-size: 0;
        i {
          display: inline-block;
          height: 4.5vw;
          font-size: 4vw;
          font-style: normal;
          color: #333;
          line-height: 4.5vw;
        }
        .icon-wjx-shixin {
          color: rgb(253, 217, 0);
        }
        .myLike {
          font-size: 5.86vw;
          font-weight: 500;
          padding-top: 1.5vw;
          box-sizing: border-box;
        }
        .count {
          vertical-align: top;
          color:#999;
        }
      }
      .stateBtn3 {
        width: 17vw;
        height: 11vw;
        font-size: 0;
        i {
          display: inline-block;
          height: 100%;
          font-size: 4vw;
          font-style: normal;
          color: #333;
          line-height: 4.5vw;
        }
        .myLike {
          font-size: 5.833vw;
          font-weight: 500;
          padding-top: 1.5vw;
          box-sizing: border-box;
        }
        .mycount {
          vertical-align: top;
          color:#999;
        }
      }
    }
  }
}
</style>
