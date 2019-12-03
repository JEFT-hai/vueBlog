<template>
  <div class="activityTabContent TabContentItemPage">
    
    <scroll ref="scroll"
        :data="allData"
        :scrollbar="scrollbarObj"
        :pullDownRefresh="pullDownRefreshObj"
        :pullUpLoad="pullUpLoadObj"
        @pullingDown="onPullingDown"
        @pullingUp="onPullingUp"
        @scroll = 'subScroll'
        @scroll-end = 'subScrollEnd'
        :listenScroll= 'true'
        :listenScrollEnd= 'true'
        :direction='direction'
        :bounce = 'subIsNotTop'
        :startY = 'subScrollY'
        :scrollToY = 'subScrollY'
        :probeType='2'
>
        <div>
          <otherMessage :user="user"></otherMessage>
        </div>
    </scroll>
  </div>
</template>
<script>
const DIRECTION_V = 'vertical'
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
import otherMessage from '@/views/My0/components/otherMsgDetail'
export default {
  props: {
    userId: {
      require: true
    },
    direction: '',
    // subIsNotTop: false,
    subScrollY: 0,
    user: {
      require: true
    }
  },
  data () {
    return {
      // groupId: this.$route.params.id, // 表示群组id
      subIsNotTop: true,
      tabIndex: 0,
      items: [],
      curPage: 1,
      pageSize: 8,
      allData: [],
      name: 'groupActivity',
      isLoading: false,
      noData: false,
      noDataT: '该群还没有群活动，快去创建吧',
      iconClass: 'iconWyonghujiaose_wushuju',
      pullDownRefresh: false,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: false,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更多群活动了',
    }
  },
  mixins: [scrollMixin],
  components: {
    scroll,
    otherMessage
  },
  watch: {
    direction (newV) {
      this.rebuildScroll()
    },
    subIsNotTop (newV) {
      // this.rebuildScroll()
      return newV
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
      // this.initData()
    },
    onPullingUp () {
      this.$emit('pullingUp', this.tabIndex)
      this.curPage++
      // this.initData()
    },
    // 方法
    initData () {
      let me = this
      me.isLoading = true
      me.api.get({
        // url: `ActivityGroup?PageIndex=${me.curPage}&PageSize=${me.pageSize}&GroupId=${me.groupId}`,
        url: `ActivityParticipate?UserId=${me.userId}&PageIndex=${me.curPage}&PageSize=${me.pageSize}`,
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
