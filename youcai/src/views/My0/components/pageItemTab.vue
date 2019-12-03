<template>
  <div class="activityTabContent TabContentItemPage">
    <div v-if='isNoData'>
      <NotFound :failTitle="noDataT"></NotFound>
    </div>
    <scroll ref="scroll"
            :data="items"
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

      <waterfall ref='listWrapper'
                 :addItems='addItems'
                 :isRefresh='isRefresh'
                 @render='render'
                 @renderEnd='renderEnd'></waterfall>
    </scroll>
  </div>
</template>
<script>
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
import NotFound from '@/components/requestState/NotFound'
import Waterfall from '@/components/Waterfall/Waterfall'
export default {
  props: {
    initCount: {
      default: false
    },
    routerType: {
      default: 2
    },
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
      isRenderEnd: false,
      isRefresh: false,
      isNoData: false, // 没有数据
      stop: false,
      isFail: false, // 表示没有数据
      failTitle: '还没有动态哦!',
      // groupId: this.$route.params.id, // 表示群组id
      subIsNotTop: true,
      tabIndex: 0,
      items: [],
      curPage: 1,
      pageSize: 10,
      itemsA: [],
      itemsB: [],
      addItems: [],
      allData: [],
      name: 'groupActivity',
      isLoading: false,
      noData: false,
      noDataT: '还没有动态哦',
      iconClass: 'iconWzanwudongtai',
      pullDownRefresh: false,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: true,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更多动态了',
      bounce:{'top': false, 'left':false, 'right':false}
    }
  },
  mixins: [scrollMixin],
  components: {
    scroll,
    NotFound,
    Waterfall
  },
  watch: {
    direction () {
      this.rebuildScroll()
    },
    subIsNotTop (newV) {
      return newV
    }
  },
  activated () {
    if (this.$store.state.isRefreshMyPage && this.$store.state.isRefreshMyPage.isRefreshPost) {
      console.log('我是需要重新刷新')
      this.curPage = 1,
      this.addItems.length = 0
      this.isRefresh = true
      this.initData()
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    subScroll (pos) {
      this.$emit('scroll', pos)
    },
    subScrollEnd (pos) {
      this.$emit('scroll-end', pos)
    },
    onPullingDown () {
      this.$emit('pullingDown', this.tabIndex)
      this.curPage = 1
      this.initData()
    },
    onPullingUp () {
      this.$emit('pullingUp', this.tabIndex)
      this.curPage++
      this.initData()
    },
    /** 
     * 获取瀑布流数据
     *  */
    initData() {
      let me = this
      me.isLoading = true
      let postUrl = ''
      if (me.routerType == 1) {
        postUrl = `Post/id?PageIndex=${me.curPage}&PageSize=${me.pageSize}`
      } else {
        // postUrl = `Post/id?UserId=${me.userId}&PageIndex=${me.curPage}&PageSize=${me.pageSize}`
        postUrl = `Post/post-list?PostUserId=${me.userId}&PageIndex=${me.curPage}&PageSize=${me.pageSize}`
      }
      me.api.get({
        url: postUrl,
        success: function(res) {
          if (me.curPage === 1) {
            if (!res.length) {
              me.isNoData = true
              me.addItems.length = 0
              me.items.length = 0
            } else {
              me.isNoData = false
            }
            me.isRefresh = true
            me.addItems = res
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
  // .noData{
  //   width:100%;
  //   height:81vw;
  //   border:1px solid white;
  //   // border:1px solid blue;
  // }
     .noData{
      width:100%;
      // height:20vw;
    }
</style>
<style lang="less">
  .activityTabContent{
    .discover.postItemContainer-waterfall{
      // padding-left: 0.9vw !important;
    }
 
    .showWrap{
      background: transparent;
    }
  }
</style>
