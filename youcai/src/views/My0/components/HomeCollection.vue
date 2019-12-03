<template>
  <div class="activityTabContent TabContentItemPage homeCollectionWrap">
    <scroll ref="scroll"
            :data="changeData"
            :scrollbar="scrollbarObj"
            :pullDownRefresh="pullDownRefreshObj"
            :pullUpLoad="pullUpLoadObj"
            @pullingDown="onPullingDown"
            @pullingUp="onPullingUp"
            @scroll='subScroll'
            @scroll-end='subScrollEnd'
            :click='true'
            :listenScroll='true'
            :listenScrollEnd='true'
            :direction='direction'
            :bounce="bounce"
            :startY='subScrollY'
            :scrollToY='subScrollY'
            :probeType='1'>
      <div class="allCount borderB">
        <div :class="['countOne',{countTwo:specialCollection === 1}]"
             @click="handleLabel(1)">
          <span>笔记</span>
          <span v-show="allData.length > 0">{{allData.length}}</span>
        </div>
        <div :class="['countOne',{countTwo:specialCollection === 2}]"
             @click="handleLabel(2)">
          <span>声音</span>
          <span v-show="musicDetail.length > 0">{{musicDetail.length}}</span>
        </div>
      </div>
      <div>
        <Waterfall v-show="specialCollection === 1"
                   :addItems='addItems'
                   :isRefresh='isRefresh'
                   :preloadWebp=false
                   @render='render'
                   @renderEnd='renderEnd'></Waterfall>
        <div v-if="specialCollection == 1 && isNoData">
          <NotFound :failTitle="failTitle"></NotFound>
        </div>
        <MusicCollection v-show="specialCollection === 2"
                         :musicDetail="musicDetail"></MusicCollection>
      </div>
    </scroll>
  </div>
</template>
<script>
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
import Waterfall from '@/components/Waterfall/Waterfall'
import MusicCollection from '@/views/My0/components/MusicCollection'
import NotFound from '@/components/requestState/NotFound'
import {mapState} from 'vuex'
export default {
  mixins: [scrollMixin],
  props: {
    userId: {
      require: true
    },
    direction: {
      type: String,
      default: ''
    },
    // subIsNotTop: false,
    subScrollY: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      isNoData: false,
      isRenderEnd: false,
      isRefresh: false,
      musicDetail: [],
      specialCollection: 1,
      stop: false,
      isFail: false, // 表示没有数据
      failTitle: '还没有收藏的动态哦!',
      subIsNotTop: true,
      tabIndex: 0,
      items: [],
      curPage: 1,
      pageSize: 8,
      itemsA: [],
      itemsB: [],
      addItems: [],
      allData: [],
      name: 'groupActivity',
      isLoading: false,
      noData: false,
      noDataT: '还没有收藏的动态哦',
      iconClass: 'iconWzanwudongtai',
      pullDownRefresh: false,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: true,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更多动态了',
      bounce:{'top': false, 'left':false, 'right':false}
    }
  },
  computed: {
    ...mapState(['isRefreshMyPage']),
    changeData () {
      if (this.specialCollection == 1) {
        return this.allData
      } else {
        return this.musicDetail
      }
    }
  },
  components: {
    Waterfall,
    scroll,
    NotFound,
    MusicCollection
  },
  watch: {
    direction () {
      this.rebuildScroll()
    },
    subIsNotTop (newV) {
      // this.rebuildScroll()
      return newV
    }
  },
  activated () {
    if (this.isRefreshMyPage.isRefreshCollect && this.isRefreshMyPage.isRefreshCollect === 1) { // 1表示收藏的帖子发生变化
      this.curPage = 1,
      this.addItems.length = 0
      this.isRefresh = true
      this.initData()
    } else if (this.isRefreshMyPage.isRefreshCollect && this.isRefreshMyPage.isRefreshCollect === 2) {// 2表示收藏的音乐发生变化
       this.curPage = 1
       this.getMusicDetail()
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
     /**
       * getMusicDetail得到收藏music数据
    */
    getMusicDetail () {
        let me = this
        me.api.get({
          url: `MyCollection/id?PageIndex=${me.curPage}&PageSize=${me.pageSize}`,
          success: function (res) {
            me.curPage === 1 && (me.musicDetail = [])
            me.musicDetail = me.musicDetail.concat(res)
          },
          complete: function () {
            me.$refs.scroll && me.$refs.scroll.forceUpdate()
          }
        })
      },
    handleLabel (index) {
     this.specialCollection = index
     this.curPage = 1
     if (this.specialCollection === 2) {
         this.getMusicDetail()
     }
    },
    subScroll (pos) {
      this.$emit('scroll', pos)
    },
    subScrollEnd (pos) {
      this.$emit('scroll-end', pos)
    },
    onPullingDown () {
      this.$emit('pullingDown', this.tabIndex)
      this.curPage = 1
      if (this.specialCollection === 1) {
        this.initData()
      } else {
        this.getMusicDetail()
      }
    },
    onPullingUp () {
      this.$emit('pullingUp', this.tabIndex)
      this.curPage++
      if (this.specialCollection === 1) {
        this.initData()
      } else {
        this.getMusicDetail()
      }
    },
    /** 
     * 获取瀑布流数据
     *  */
    initData() {
      let me = this
      me.isLoading = true
      me.api.get({
        url: `MyCollection?PageIndex=${me.curPage}&PageSize=${me.pageSize}`,
        success: function(res) {
          if (me.curPage === 1) {
            if (!res.length) {
              me.isNoData = true
            }
            me.isRefresh = true
          }
          me.addItems = res
        },
        error: function() {},
        complete: function() {
          me.$refs.scroll && me.$refs.scroll.forceUpdate()
        }
      })
    },
    render () { // 开始渲染瀑布流
      this.isRefresh = false
    },
    renderEnd (data) { // 是否渲染完毕
      this.isRenderEnd = data
      if (data) {
        if (this.curPage === 1) {
          this.items = []
        }
        this.items = this.items.concat(this.addItems)
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .noData{
    width:100%;
    height:81vw;
    border:1px solid white;
  }
</style>
<style lang="less">
  .homeCollectionWrap{
    height:calc(100vh - 35.39vw) !important;
  }
  .activityTabContent{
    .allCount{
                width:100%;
                height:11.39vw;
                display:flex;
                align-items: center;
                padding-left:4vw;
                box-sizing: border-box;
                .countOne{
                  padding:2vw;
                  box-sizing: border-box;
                  height:7.03vw;
                  border-radius: 3vw;
                  display:flex;
                  align-items: center;
                  justify-content: center;
                  font-size:4vw;
                  color:#333333;
                  margin-right:2vw;
                  span:first-child::after{
                    content:'.';
                    width:4vw;
                    position:relative;
                    top:-1vw;
                    display:inline-block;
                    left:0vw;
                    text-align: center;
                  }
                }
                .countTwo{
                  background-color:#f0f0f0;
                }
              }
    .showWrap{
      background: transparent;
    }
  }
</style>
