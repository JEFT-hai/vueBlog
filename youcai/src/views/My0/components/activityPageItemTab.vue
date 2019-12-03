<template>
  <div class="activityTabContent TabContentItemPage">
    <!-- <notFound v-if='noData' :failTitle='noDataT' :iconClass='iconClass'></notFound> -->
    <div v-if='noData'>
      <NotFound :failTitle="noDataT"></NotFound>
    </div>
    <scroll ref="scroll"
            :data="allData"
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
            :bounce='subIsNotTop'
            :startY='subScrollY'
            :scrollToY='subScrollY'
            :probeType='3'>
      <div>
        <activityItem v-for='(item, index) in allData'
                      :item='item'
                      :key='index'></activityItem>
      </div>
    </scroll>
  </div>
</template>
<script>
const DIRECTION_V = 'vertical'
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
import activityItem from '@/components/activityItem'
// import notFound from '@/components/requestState/noData'
import NotFound from '@/components/requestState/NotFound'
export default {
  props: {
    userId: {
      require: true
    },
    routerType: {
      default: 2
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
      subIsNotTop: true,
      tabIndex: 0,
      items: [],
      curPage: 1,
      pageSize: 8,
      allData: [],
      name: 'groupActivity',
      isLoading: false,
      noData: false,
      noDataT: '还没有报名的活动',
      iconClass: 'iconWyonghujiaose_wushuju',
      pullDownRefresh: false,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: true,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更多活动了',
    }
  },
  mixins: [scrollMixin],
  components: {
    scroll,
    activityItem,
    NotFound
  },
  watch: {
    direction () {
      this.rebuildScroll()
    },
    subIsNotTop (newV) {
      return newV
    }
  },
  mounted() {
    this.initData()
  },
  activated () {
      if (this.$store.state.isRefreshMyPage && this.$store.state.isRefreshMyPage.isRefreshActivity) {
        this.curPage = 1,
        this.addItems.length = 0
        this.isRefresh = true
        this.initData()
      }
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
    // 方法
    initData () {
      let me = this
      me.isLoading = true
      let activityUrl = ''
      let userId = this.userId
      if (me.routerType === 1) {
        activityUrl = `ActivityParticipate?PageIndex=${me.curPage}&PageSize=${me.pageSize}`
      } else {
        activityUrl = `ActivityParticipate?UserId=${userId}&PageIndex=${me.curPage}&PageSize=${me.pageSize}`
      }
      me.api.get({
        url: activityUrl,
        success: function (res) {
          me.allData = me.allData.concat(res)
          if (!me.allData.length) {
            me.noData = true
          }
        },
        error: function (res) {
          me.$msg.showError(res.msg)
          me.$refs.scroll && me.$refs.scroll.forceUpdate()
        },
        complete: function () {
          me.$refs.scroll && me.$refs.scroll.forceUpdate()
          me.isLoad = false
        }
      })
    }
  }
}
</script>
