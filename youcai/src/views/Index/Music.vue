<template>
  <div class="musicBigWrap"
       ref='music'
       v-show="show">
    <div class="musicWrap">
      <div class="musicHead">
        <div class="scrollBar">
          <div class="switchBar">
            <span :class="{active: musicIndex === 1}"
                  @click="handleMusicBar(1)">推荐</span>
            <span @click="handleMusicBar(item.voiceCategoryId)"
                  :class="{active: musicIndex === item.voiceCategoryId}"
                  v-for="(item,index) in musicTitleList"
                  :key="index">{{item.name}}</span>
          </div>
        </div>
      </div>
      <div class="musicMain">
        <scroll ref="scroll"
                :data="musicDetail"
                :scrollbar="scrollbarObj"
                :pullDownRefresh="pullDownRefreshObj"
                :pullUpLoad="pullUpLoadObj"
                :startY="parseInt(startY)"
                @pullingDown="onPullingDown"
                @pullingUp="onPullingUp"
                :isMusic="isMusic"
                @hidddleMusic="hidddleMusic"
                @showMusic="showMusic"
                @scroll='subScroll'
                @scroll-end='subScrollEnd'
                :listenScroll='true'
                :listenScrollEnd='true'
                :preventDefault="true"
                :stopPropagation='true'
                :probeType='1'>
          <div class="list">
            <MusicItem v-for="(item, index) in musicDetail"
                       :key="index"
                       :index="index"
                       :item="item"
                       class="postItem-btn postItem-btn-like"
                       @click.native="setMusicIndex(index)"
                       @showMusicInner="showMusicInner(item)"
                       @playMusic="playMusic"
                       :isCurrent="currentMusic === item"
                       :isPlay="isPlay"></MusicItem>
          </div>
        </scroll>
      </div>
    </div>
  </div>
</template>

<script>
import MusicItem from '@/components/music/musicItem'
import { mapState, mapMutations } from 'vuex'
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
export default {
  mixins: [scrollMixin],
  props: {
    hasNewMusic: {
      type: Boolean,
      default: true
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      canClick: true, // 表示可以点击轮播图
      isShowMusic: true, // 表示是显示音乐
      isMusic: true, // 表示是音乐页
      pullDownRefresh: true,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: true,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更过数据了',
      isLoading: true,
      items: [],
      curPage: 1,
      pageSize: 6,
      hasNewMusicList: this.hasNewMusic,
      activityTopImg: {
        Pictures:
          '/files/upload/ec4bad44c14f492aabf14c7f37449e42.jpg,/files/upload/2106b9c10fd84d639e79a613e4c67940.jpg,/files/upload/c29ebf7c59724873b57ed7ba0b480fc6.jpg,/files/upload/21bcac1d5448416cbb21beba66eea939.jpg,/files/upload/e8893237611c4e7b86aea55781c30dbd.jpg,/files/upload/ab53ee1275f748dc83186c4640b1ae0d.jpg,/files/upload/0ed2ec2c7844474b98e44abc67005e05.jpg,/files/upload/7c32829280374e979d4275375b6e2171.jpg'
      },
      musicIndex: 1,
      musicTopImg: {}, // 轮播图数据
      musicTitleList: [], // 标题栏数据
      musicDetail: [], // 内容数据
      musicSrc: '', // 音频地址
      isPlay: false, // 音频否播放
      currentMusic: {}, // 当前播放音频
      musicLabel: {}, // 音乐标签
      currentMusicTime: '', // 当前播放音乐总的时长
      isRecommend: true, // 表示默认是推荐列表
      musicSwiperImg: '' // 表示声音轮播图数据
    }
  },
  components: {
    scroll,
    MusicItem
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
      'musicInnerShow'
    ]),
    rotate() {
      return this.isPlaying
    }
  },
  beforeDestroy() {
    // this.$store.commit('setMusicPage', false)
  },
  mounted() {
    // this.$store.commit('setMusicPage', true)
    // console.log(this.$store.state.currentIndex >= 0, this.$store.getters.musicSrc, this.$store.state.isInMusicPage)
    // 获取音乐标签
    this.getMusicCategory()
    // 获取音乐推荐内容
    this.getMusicList(1)
    // 获取音乐轮播图数据
    // this.getMusicSwiper()
  },
  watch: {
    show() {
      if (this.show && this.curPage === 1) {
        this.$nextTick(() => {
          this.$refs.scroll && this.$refs.scroll.refresh()
        })
      }
    }
  },
  methods: {
    ...mapMutations([
      'setMusicPlayList',
      'setMusicSquencelist',
      'setMusicPieShow',
      'setMusicPage',
      'setMusicInnerShow',
      'setRebuild'
    ]),
    subScroll (pos) {
      this.$emit('scroll', pos)
      this.postScrollY = pos.y
      // console.log(this.$refs.scroll.scroll.movingDirectionY)
      if (this.$refs.scroll.scroll.movingDirectionY < 0) {
        this.scrollState = -1
      }
    },
    subScrollEnd (pos) {
      this.$emit('scroll-end', pos)
      this.postScrollY = pos.y
    },
    setMusicIndex(index) {
      this.$store.commit('setMusicPlayList', this.musicDetail)
      this.$store.commit('setMusicSquencelist', this.musicDetail)
      this.$store.commit('setMusicIndex', index)
      this.$store.commit('setMask', true)
    },
    /**
     * handleMusicBar处理音乐导航标题部分的列表数据
     */
    handleMusicBar(index) {
      this.curPage = 1
      this.musicIndex = index
      this.musicDetail = []
      this.rebuildScroll()
      // console.log("导航")
      this.getMusicList(index)
    },
    /**
     * 播放音乐
     */
    playMusic(item) {
      if (this.currentMusic === item) {
        if (!this.isPlay) {
          this.musicLabel.play()
          this.isPlay = true
        } else {
          this.musicLabel.pause()
          this.isPlay = false
        }
      } else {
        this.currentMusic = item
        this.musicSrc = item.musicSrc
        this.musicLabel.load()
        this.musicLabel.play()
        this.isPlay = true
      }
    },
    showMusicInner(item) {
      // 判断当前播放和想要播放的是否一样
      if (this.currentMusic !== item) {
        if (this.isPlay) {
          this.musicLabel.pause()
        }
        this.currentMusic = item
        this.musicSrc = item.musicSrc
        this.musicLabel.load()
        if (this.isPlay) {
          this.musicLabel.play()
        }
      }
      if (this.musicSrc === '') {
        this.musicSrc = item.musicSrc
        // 注意，重新赋值了src,一定要load加载一遍
        this.musicLaelb.load()
      }
      this.isShowMusicInner = true
    },
    changePlayState(isPlay) {
      if (isPlay) {
        this.isPlay = true
      } else {
        this.isPlay = !this.isPlay
      }
      if (this.isPlay) {
        this.musicLabel.play()
      } else {
        this.musicLabel.pause()
      }
    },
    hiddleMusicInner1() {
      this.isShowMusicInner = false
    },
    /**
     * getMusicCategory 获取声音类别列表
     */
    getMusicCategory() {
      let me = this
      me.api.get({
        url: 'VoiceCategory',
        success: function(res) {
          me.musicTitleList = res
        }
      })
    },
    /**
     * getMusicList 获取声音列表数据
     */
    getMusicList(index) {
      let me = this
      let MusicUrl = ''
      this.musicIndex = index
      if (this.musicIndex === 1) {
        // 表示是推荐内容
        me.isRecommend = true
        MusicUrl = `Voice?IsRecommend=${me.isRecommend}&PageIndex=${
          me.curPage
        }&PageSize=${me.pageSize}`
      } else {
        // 表示不是推荐内容
        me.isRecommend = false
        MusicUrl = `Voice?VoiceCategoryId=${me.musicIndex}&IsRecommend=${
          me.isRecommend
        }&PageIndex=${me.curPage}&PageSize=${me.pageSize}`
      }
      me.api.get({
        url: MusicUrl,
        success: function(res) {
          me.curPage === 1 && (me.musicDetail = [])
          me.musicDetail = me.musicDetail.concat(res)
          // me.musicDetail = res
        },
        error: function(res) {
          // me.$msg.showError(res.msg)
          me.$nextTick(() => {
            me.$refs.scroll && me.$refs.scroll.forceUpdate()
          })
        },
        complete: function() {
          me.$nextTick(() => {
            me.$refs.scroll && me.$refs.scroll.forceUpdate()
          })
          // me.isLoading = false
        }
      })
    },
    onPullingDown() {
      this.curPage = 1
      this.getMusicList(this.musicIndex)
    },
    onPullingUp() {
      // 更新数据
      this.curPage++
      this.getMusicList(this.musicIndex)
    },
    /**
     * getMusicSwiper 获取声音轮播图数据
     */
    getMusicSwiper() {
      let arr = []
      let me = this
      me.api.get({
        url: 'Banner',
        success: function(res) {
          res.map(item => {
            arr.push(item.imageUlr)
          })
          me.musicSwiperImg = arr.join(' ,') || arr[0]
        }
      })
    },
    // 隐藏音乐轮播图
    hidddleMusic() {
      this.isShowMusic = false
    },
    // 显示音乐轮播图
    showMusic() {
      this.isShowMusic = true
    }
    // setMusicInner () {
    //   console.log("打印一下啊",this.musicInnerShow)
    //   this.$store.commit('setMusicInnerShow', !this.musicInnerShow)
    // }
  }
}
</script>

<style lang="less" scoped>
.musicBigWrap {
  height: calc(100vh - 11.03vw);
}
.bigM {
  background: white;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
}
.musicWrap {
  width: 100%;
  height: calc(100vh - 11.03vw -  11vw - 12vw);
  // margin-top: 25vw;
  box-sizing: border-box;
  //  overflow: scroll;
  .musicHead {
    width: 100%;
    //  height: 46.56vw;
    //  border:1px solid red;
    .images {
      width: 95%;
      height: 35.56vw;
      margin: auto;
      border-radius: 2vw;
      overflow: hidden;
      transition: all 0.25s;
    }
    .noHeight {
      width: 95%;
      height: 0vw;
      margin: auto;
      border-radius: 2vw;
      overflow: hidden;
      transition: all 0.25s;
    }
    .scrollBar {
      width: 95%;
      height: 11vw;
      margin-left: 4vw;
      overflow: scroll;
      .switchBar {
        min-width: 130vw;
        height: 10.83vw;
        line-height: 10.83vw;
        span {
          margin-right: 6vw;
          height: 8vw;
          line-height: 8vw;
          display: inline-block;
          color: #999999;
          font-size: 4vw;
          text-align: center;
        }
        .active {
          font-size: 4.5vw;
          color: #000000;
        }
      }
    }
  }
  .musicMain {
    width: 100%;
    height: calc(100vh - 25vw - 11vw);
    overflow: hidden;
    .list {
      width: 100%;
      background-color: var(--mBg);
      padding: 2vw 1.8vw;
      box-sizing: border-box;
      display: flex;
      flex-flow: row wrap;
      justify-content: space-between;
      .postItem-btn {
        i {
          font-weight: bold;
          font-size: 5.3333vw;
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
    }
  }
}
</style>
