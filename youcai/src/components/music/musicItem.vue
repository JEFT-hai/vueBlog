<template>
  <div class="musicItemWrap">
    <div class="musicImg">
      <img :src="item.imageUrl"
           alt=""
           @click="setMusicInner">
      <div class="musicMessage">
        <div class="play">
          <span>
            <i class="iconWanwan iconWbofang activityNotice"
               v-show="!(isPlaying && isCurrent)"
               @click='setMusicPlay'></i>
            <!-- <i class="iconWanwan iconWiconstop activityNotice" v-show="isPlaying && isCurrent" @click.stop='handleMusicPlay'></i> -->
          </span>
          <div class="demo-music"
               v-show="isPlaying && isCurrent"
               @click.stop='handleMusicPlay'>
            <div class="music">
              <ul id="waves"
                  class="movement">
                <li class="li1"><span class="ani-li"></span></li>
                <li class="li2"><span class="ani-li"></span></li>
                <li class="li3"><span class="ani-li"></span></li>
              </ul>
              <div class="music-state"></div>
            </div>
          </div>
          <!-- <span>{{item.playCount}}人</span> -->
        </div>
        <span class="musicLabel">{{item.label}}</span>
      </div>
    </div>
    <div class="musicDetail">
      <p>{{item.title}}</p>
      <div class="userMsg">
        <div class="userAvator">
          <img :src="!item.avatar ? defaultAvatar: item.avatar"
               alt="">
        </div>
        <div class="userName">{{item.nickName}}</div>
        <div class="like">
          <btnLike :item='item'
                   :objectId='item.voiceId'
                   :objectType=1
                   class="postItem-btn postItem-btn-like"></btnLike>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import btnLike from '@/components/Btn/BtnLike'
import { mapState, mapMutations, mapGetters } from 'vuex'
export default {
  data () {
    return {
      defaultAvatar: 'http://webapp.szwanwan.com/img/default/defaultavatar.png'
    }
  },
  computed: {
    ...mapState(['isPlaying', 'currentIndex', 'playList', 'squenceList', 'musicMode', 'pieShow', 'currentTime', 'duration', 'musicInnerShow']),
    ...mapGetters(['musicCover', 'musicSrc', 'musicItem', 'musicCurrentTime', 'musicDurationTime']),
    isCurrent () {
      return this.musicItem.voiceId === this.item.voiceId
    },
    realyAvatar () {
      if (this.item.avatar === null || this.item.avatar === '') {
        return this.defaultUserAvatar
      } else {
        return this.item.avatar
      }
    }
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    isPlay: {
      type: Boolean,
      default: false
    }
  },
  components: {
    btnLike
  },
  mounted () {

  },
  methods: {
    ...mapMutations(['setMusicInnerShow']),
    handleInner () {
      this.$emit('showMusicInner')
    },
    handleMusicPlay () {
      this.$store.commit('setMusicPlay', !this.isPlaying)
    },
    setMusicPlay () {
      if (this.musicItem) {
        this.$store.commit('setMusicPlay', !this.isPlaying)
      }
    },
    /**
     * 控制音乐播放
     */
    // handleMusicPlay () {
    //   this.$emit('playMusic', this.item)
    // },
    setMusicInner () {
      this.$store.commit('setMusicInnerShow', !this.musicInnerShow)
    }
  }
}
</script>

<style lang="less" scoped>
.demo-music {
  position: absolute;
  width: 10vw;
  height:4.5vw;
  top:0.5vw;
}
.demo-music .music {
  width:10vw;
  height:100%;
  position: absolute;
  top:0;
  left:0;
}

.demo-music #waves {
  width:10vw;
  height:100%;
  position: absolute;
  top: 0;
  left: 0;
  display:flex;
  flex-flow: row nowrap;
  // padding-left:2vw;
}

.demo-music #waves li {
  position: relative;
  width:1vw;
  margin-right:0.5vw;
}
.demo-music #waves li:nth-child(1) {
  // border:1px solid blue;
  margin-left:0.5vw;
}
.demo-music #waves li span {
  position: absolute;
  bottom: 0;
  display: block;
  height: 100%;
  width: 1vw;
  background: white;
}

.demo-music #waves .li1 span {
  animation: waves 0.6s linear 0s infinite alternate;
  -webkit-animation: waves 0.6s linear 0s infinite alternate;
}

.demo-music #waves .li2 span {
  animation: waves 0.9s linear 0s infinite alternate;
  -webkit-animation: waves 0.9s linear 0s infinite alternate;
}

.demo-music #waves .li3 span {
  animation: waves 1s linear 0s infinite alternate;
  -webkit-animation: waves 1s linear 0s infinite alternate;
}

.demo-music #waves .li4 span {
  animation: waves 0.8s linear 0s infinite alternate;
  -webkit-animation: waves 0.8s linear 0s infinite alternate;
}

.demo-music #waves .li5 span {
  animation: waves 0.7s linear 0s infinite alternate;
  -webkit-animation: waves 0.7s linear 0s infinite alternate;
}

.demo-music #waves .li6 span {
  animation: waves 0.5s linear 0s infinite alternate;
  -webkit-animation: waves 0.5s linear 0s infinite alternate;
}
@-webkit-keyframes waves {
  10% {
    height: 20%;
  }
  20% {
    height: 60%;
  }
  40% {
    height: 40%;
  }
  50% {
    height: 100%;
  }
  100% {
    height: 50%;
  }
}

@keyframes waves {
  10% {
    height: 20%;
  }
  20% {
    height: 60%;
  }
  40% {
    height: 40%;
  }
  50% {
    height: 100%;
  }
  100% {
    height: 50%;
  }
}
.musicItemWrap{
    width:47.24vw;
    height:66.48vw;
    border-radius: 1.3333vw;
    background-color:white;
    display:inline-block;
    margin-bottom:3vw;
    .musicImg{
      width:47.24vw;
      height:46.24vw;
      overflow: hidden;
      border-radius: 1.3333vw 1.3333vw 0 0;
      position:relative;
      img{
          width:47.24vw;
          height: 100%;
          border-radius: 1.3333vw 1.3333vw 0 0;
          object-fit: cover;
      }
      .musicMessage{
          width:100%;
          height:7vw;
          display:flex;
          justify-content: space-between;
          align-items: center;
          position:absolute;
          left:0;
          bottom:0vw;
          color:white;
          font-size:3vw;
          padding:0 1.5vw;
          box-sizing: border-box;
          background: linear-gradient(to bottom, transparent, rgba(0,0,0,.4));
          box-sizing: border-box;
          .musicLabel{
              display:flex;
              padding:0.5vw 1vw;
              box-sizing: border-box;
              justify-content: center;
              align-items: center;
              border-radius: 1vw;
              background:#10c2b0;
          }
      }
    }
    .musicDetail{
        width:100%;
        height:17.78vw;
        padding:0vw 2vw;
        padding-top:1.5vw;
        box-sizing: border-box;
        p{
          color:#010101;
          font-size:4.35vw;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
          // font-weight:bold;
        }
        .userMsg{
            width:100%;
            height:9.07vw;
            display:flex;
            justify-content: space-between;
            align-items: center;
            .userAvator{
                width:7vw;
                height:7vw;
                border-radius: 50%;
                overflow: hidden;
                box-shadow: 0px 0px 1px #efefef;
                img{
                    width:7vw;
                    height:7vw;
                }
            }
            .userName{
                width:20vw;
                text-overflow:ellipsis;
                white-space:nowrap;
                overflow: hidden;
                font-size:3.956vw;
                margin-left:-4vw;
                color:#343434;
            }
            .like{
                .postItem-meta2 {
                  display: flex;
                  height: 10vw;
                  .postItem-btn {
                    color: #333;
                    min-width: 8vw;
                    padding: 0 2vw;
                    i {
                      font-weight: bold;
                      font-size: 5.3333vw;
                      color:#333 !important;
                      &.icon-redxin-copy {
                        color: red;
                      }
                      &.icon-wjx-shixin {
                        color: #fdd900;
                      }
                    }
                    span {
                      font-size: 3vw;
                      vertical-align: text-top;
                    }
                  }
                  .postItem-btn-share {
                    padding-left: 0;
                    flex: 1;
                  }
              }
            }
        }
    }
}
</style>
