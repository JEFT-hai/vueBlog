<template>
  <transition name='fadeTop'>
    <div class="musicPlayListWrap">
      <div class="playMode borderB"
           @click="setMusicMode">

        <i :class="['iconWanwan','activityNotice',{iconWsuijibofang1:playMode === '随机播放'},{iconWshunxubofang1:playMode === '顺序播放'},{iconWdanquxunhuan:playMode === '单曲循环'}]"></i>
        <i class="count">{{playMode}}</i>
      </div>
      <div class="scroll">
        <ul class="musicPlayList">
          <li class="musicPlayListItem borderB"
              v-for='(item, index) in squencelist'
              :key='index'
              @click="setMusicIndex(index)">
            <div class='musicPlayListItemDetail'>
              <span class="musicName">{{item.title}}</span>
              <span class="musicAuthor">-{{item.userName}}</span>
            </div>
            <div class='musicPlayListItemDuration'></div>
          </li>
        </ul>
      </div>

    </div>
  </transition>
</template>
<script>
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
import { mapState, mapGetters, mapMutations } from 'vuex'
export default {
  mixins: [scrollMixin],
  computed: {
    ...mapState(['isPlaying', 'currentIndex', 'playList', 'squencelist', 'musicMode', 'pieShow', 'musicInnerShow', 'changeRage']),
    playMode () {
        if (this.musicMode === 0) {
            return '顺序播放'
        } else if (this.musicMode === 1) {
            return '单曲循环'
        } else {
            return '随机播放'
        }
    }
  },
  data () {
    return {
      pullDownRefresh: true,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: true,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更过数据了',
      isLoading: true,
      items: [],
      curPage: 1,
      pageSize: 7
    }
  },
  components: {
    scroll
  },
  methods: {
    ...mapMutations(['setMusicMode', 'setMusicIndex']),
    setMusicMode () {
      this.$store.commit('setMusicMode')
      this.$toast(this.playMode)
    },
    setMusicIndex (index) {
      this.$store.commit('setMusicIndex', index)
    }
  }
}
</script>
<style lang="less">
.musicPlayListWrap{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  z-index: 500;
  background: #fff;
  border-radius: 1.11vw 1.11vw 0 0;
  &.fadeTop-enter-active, &.fadeTop-leave-active{
    transition:all 0.75s ease;
  }
  &.fadeTop-enter, &.fadeTop-leave-to{
    bottom: -100%;
    opacity: 0.5;
  }
  .musicPlayList{
    height:90vw;
    width:100%;
  }
  .scroll{
    width:100%;
    height:90vw;
    overflow: scroll;
    .musicPlayList{
      min-height:100vw;
    }
  }
  .playMode{
    height: 11.11vw;
    line-height: 11.11vw;
    margin: 0 4.44vw;
    color: var(--mGray);
    font-size: var(--mText);
    padding-left: 2vw;
    box-sizing: border-box;
      .activityNotice{
        display:inline-block;
        width:6vw;
        height:11.11vw;
        color:#aaa;
        font-size:4.26vw;
      }
      .count{
        font-style: normal;
      }
  }
  .musicPlayListItem {
    display: flex;
    margin: 0 4.44vw;
    height: 15.8vw;
    line-height: 15.8vw;
    .musicPlayListItemDetail{
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 0;
        padding-left: 2vw;
        .musicName {
            font-size: var(--mText);
            color: var(--dGray);
            display: inline-block;
            margin-right: 2vw;
        }
        .musicAuthor{
            font-size: var(--sText);
            color: var(--lGray);
        }
    }
    .musicPlayListItemDuration{
        width: 17.6vw;
    }
  }
}
</style>
