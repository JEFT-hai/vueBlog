<template>
  <div class="musicPieWrap">
    <div :class="rotate ? 'rotate musicPie' : 'musicPie'" v-show="pieShow" @click='setMusicInner'>
      <img :src='musicCover' />
      <audio id="musicAudio" ref='musicAudio' :loop='musicMode === 1'>
        <source :src='playSrc' type="audio/MPEG">
      </audio>
    </div>
    <div class="jumpMusic" v-show="rotate">
      <span class="musicOne"><i class="iconWanwan iconWyinfu2 activityNotice"></i></span>
      <span class="musicTwo"><i class="iconWanwan iconWyinfu1 activityNotice"></i></span>
      <span class="musicThree"><i class="iconWanwan iconWyinfu2 activityNotice"></i></span>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
export default {
  data () {
    return {
      playSrc: '',
      musicLabel: {}
    }
  },
  created () {
    this.playSrc = this.musicSrc
    this.resetMusic()
  },
  mounted () {
    // this.$refs.musicAudio.play()
    let me = this
    this.musicLabel = document.getElementById('musicAudio')
    this.musicLabel.addEventListener('timeupdate', function (e) {
      me.$store.commit('setMusicItemDetail', {
        currentTime: me.musicLabel.currentTime,
        duration: me.musicLabel.duration
      })
    })
    this.musicLabel.addEventListener('ended', function (e) {
      me.$store.commit('setMusicNext')
    })
    this.musicLabel.addEventListener('pause', function (e) {
    })
    this.$nextTick(() => {
      this.musicLabel.play()
      this.$store.commit('setMusicPlay', true)
    })
  },
  computed: {
    ...mapState(['isPlaying', 'currentIndex', 'playList', 'squenceList', 'musicMode', 'pieShow', 'musicInnerShow', 'changeRage']),
    ...mapGetters(['musicCover', 'musicSrc']),
    rotate () {
      return this.isPlaying
    }
  },
  watch: {
    musicSrc (newV, oldV) {
      oldV && newV && this.resetMusic()
    },
    isPlaying (newV) {
      if (!newV) {
        this.musicLabel.pause()
      } else {
        this.musicLabel.play()
      }
    },
    changeRage (newV) {
      this.musicLabel.currentTime = newV * this.musicLabel.duration
    }
  },
  methods: {
    ...mapMutations(['setMusicPlay', 'setMusicInnerShow', 'setMusicItemDetail', 'setMusicIndex', 'setMusicNext']),
    resetMusic () {
      this.playMusic()
    },
    /**
     * 播放音乐
     */
    playMusic () {
      if (this.playSrc === this.musicSrc) {
        if (!this.isPlaying) {
          // this.musicLabel.play()
          // this.setMusicPlay(true)
          this.$store.commit('setMusicPlay', true)
        } else {
          // this.musicLabel.pause()
          // this.setMusicPlay(false)
          this.$store.commit('setMusicPlay', false)
        }
      } else {
        this.playSrc = this.musicSrc
        this.musicLabel.load()
        this.musicLabel.play()
        // this.setMusicPlay(true)
        this.$store.commit('setMusicPlay', true)
      }
    },
    setMusicInner () {
      this.$store.commit('setMask', true)
      this.$store.commit('setMusicInnerShow', !this.musicInnerShow)
    }
  }
}
</script>
<style lang="less">
@keyframes jumpOne {
  0% {
    transform: scale(0.6) rotate(0);
    opacity: 0;
  }
  7% {
    transform: translate3d(-2vw, -0.5vw, 0) scale(0.65) rotate(5deg);
    opacity: 0.3;
  }
  14% {
    transform: translate3d(-4vw, -1vw, 0) scale(0.7) rotate(10deg);
    opacity: 0.6;
  }
  22% {
    transform: translate3d(-6vw, -1.4vw, 0) scale(0.8) rotate(15deg);
    opacity: 0.8;
  }
  30% {
    transform: translate3d(-8vw, -2.4vw, 0) scale(0.95) rotate(22deg);
    opacity: 0.9;
  }
  38% {
    transform: translate3d(-10vw, -4vw, 0) scale(1) rotate(27deg);
    opacity: 1;
  }
  47% {
    transform: translate3d(-12vw, -5.6vw, 0) scale(0.97) rotate(35deg);
    opacity: 0.9;
  }
  56% {
    transform: translate3d(-14vw, -8vw, 0) scale(0.95) rotate(45deg);
    opacity: 0.9;
  }
  77% {
    transform: translate3d(-16vw, -16vw, 0) scale(0.95) rotate(30deg);
    opacity: 0.5;
  }
  100% {
    transform: translate3d(-12vw, -25vw, 0) scale(1) rotate(20deg);
    opacity: 0;
  }
}
@keyframes jumpTwo {
  0% {
    transform: scale(0.6) rotate(0);
    opacity: 0;
  }
  7% {
    transform: translate3d(-2vw, -0.5vw, 0) scale(0.65) rotate(7deg);
    opacity: 0.3;
  }
  14% {
    transform: translate3d(-4vw, -1vw, 0) scale(0.7) rotate(14deg);
    opacity: 0.6;
  }
  22% {
    transform: translate3d(-6vw, -1.4vw, 0) scale(0.8) rotate(22deg);
    opacity: 0.8;
  }
  30% {
    transform: translate3d(-8vw, -2.4vw, 0) scale(0.95) rotate(30deg);
    opacity: 0.9;
  }
  38% {
    transform: translate3d(-10vw, -4vw, 0) scale(1) rotate(35deg);
    opacity: 1;
  }
  47% {
    transform: translate3d(-12vw, -5.6vw, 0) scale(0.97) rotate(40deg);
    opacity: 0.9;
  }
  56% {
    transform: translate3d(-14vw, -8vw, 0) scale(0.95) rotate(45deg);
    opacity: 0.9;
  }
  77% {
    transform: translate3d(-16vw, -16vw, 0) scale(0.95) rotate(30deg);
    opacity: 0.5;
  }
  100% {
    transform: translate3d(-12vw, -25vw, 0) scale(1) rotate(20deg);
    opacity: 0;
  }
}
.musicPieWrap{
  .jumpMusic{
     position:fixed;
     bottom:16vw;
     right:4vw;
     z-index:100;
     width:16vw;
     height:16vw;
     border-radius:50%;
     > span {
       width: 16px;
       height: 16px;
       line-height: 16px;
       bottom: -16px;
       left: 50%;
       margin-left: -8px;
     }
     .musicOne{
       position:absolute;
       z-index:30000;
       color: rgb(193, 193, 193);
       opacity: 0;
       animation: jumpOne 3s linear infinite forwards;
     }
     .musicTwo{
       position:absolute;
       z-index:30001;
       color: rgb(193, 193, 193);
       opacity: 0;
       animation: jumpTwo 3s 1s linear infinite forwards;
     }
     .musicThree {
       position:absolute;
       z-index:30001;
       color: rgb(193, 193, 193);
       opacity: 0;
       animation: jumpTwo 3s 2s linear infinite forwards;
     }
   }
}
  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .musicPie{
    &.rotate{
      animation: rotate 8s infinite linear;
    }
    position: fixed;
    width: 16vw;
    height:16vw;
    bottom: 16vw;
    // border: 2.9vw solid rgb(193, 193, 193);
    background-color:rgb(193, 193, 193);
    border-radius: 50%;
    right: 4vw;
    z-index: 10000;
    display:flex;
    align-items: center;
    justify-content: center;
    img{
      width: 70%;
      height: 70%;
      border-radius: 50%;
      
    }
    // &::after{
    //   position: absolute;
    //   width: 100%;
    //   height:100%;
    //   content: '';
    //   top: 2px;
    //   left: 0;
    //   z-index: -1;
    //   border-radius: 50%;
    //   background: #efefef;
    //   box-shadow: 0 0 2px #efefef;
    // }
  }
</style>
