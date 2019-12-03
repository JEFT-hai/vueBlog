<template>
  <div class="musicCollection">
    <div class="musicMain"
         v-if="musicDetail.length > 0">
      <div class="list">
        <MusicItem v-for="(item, index) in musicDetail"
                   :key="index"
                   :index='index'
                   :item="item"
                   class="postItem-btn postItem-btn-like"
                   @click.native='setMusicIndex(index)'
                   @showMusicInner="showMusicInner(item)"
                   @playMusic="playMusic"
                   :isCurrent="currentMusic === item"
                   :isPlay="isPlay"></MusicItem>
      </div>
    </div>
    <div v-else>
      <NotFound :failTitle="failTitle"></NotFound>
    </div>
  </div>
</template>

<script>
import MusicItem from '@/components/music/musicItem'
import { mapMutations } from 'vuex'
import NotFound from '@/components/requestState/NotFound'
export default {
  data () {
      return {
        curPage: 1,
        pageSize: 1000,
        isLoad: true, // 是否正在加载
        isFail: false, // 是否加载失败
        failTitle: '还没有收藏的音乐哦!',
        // musicDetail: '', // 音乐列表数据
        musicSrc: '', // 音频地址
        isPlay: false, // 音频否播放
        currentMusic: {}, // 当前播放音频
        isShowMusicInner: false, // 是否显示音乐内页
        musicLabel: {}, // 音乐标签
        currentMusicTime: '', // 当前播放音乐总的时长
      }
  },
  components: {
    MusicItem,
    NotFound
  },
  props: ['musicDetail'],
  mounted () {
    // this.getMusicDetail()
  },
  methods: {
    ...mapMutations(['setMusicPlayList', 'setMusicIndex', 'setMusicSquencelist', 'setMusicPieShow', 'setMusicPage', 'setMask']),
    setMusicIndex (index) {
      // if (this.hasNewMusicList) {
        // this.hasNewMusicList = false
        this.$store.commit('setMusicPlayList', this.musicDetail)
        this.$store.commit('setMusicSquencelist', this.musicDetail)
        this.$store.commit('setMusicIndex', index)
        this.$store.commit('setMask', true)
    },
     showMusicInner (item) {
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
     playMusic (item) {
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
    changePlayState (isPlay) {
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
    hiddleMusicInner1 () {
      this.isShowMusicInner = false
    },
  }
}
</script>

<style lang="less" scoped>
   .musicCollection{
       .musicMain{
           width:100%;
          //  height:93vw;
          //  overflow: scroll;
          //  margin-bottom:12vw;
          //  border:1px solid red;
           .list{
             width:100%;
             background-color:var(--mBg);
             padding:2vw 1.8vw;
             box-sizing: border-box;
             display:flex;
             flex-flow:row wrap;
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