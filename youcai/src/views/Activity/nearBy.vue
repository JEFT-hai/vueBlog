<template>
  <div class="nearActivityPage">
    <loading v-if="isLoading"></loading>
    <notFound v-if="noData"
              :failTitle="noDataT"
              :iconClass="iconClass"></notFound>
    <scroll v-if="!noData"
            ref="scroll"
            :data="items"
            :scrollbar="scrollbarObj"
            :pullDownRefresh="pullDownRefreshObj"
            :pullUpLoad="pullUpLoadObj"
            @pullingDown="onPullingDown()"
            @pullingUp="onPullingUp()">
      <activityItem v-for="(item, index) in items"
                    :item="item"
                    :key="index"></activityItem>
    </scroll>
  </div>
</template>
<script>
import activityItem from '@/components/activityItem'
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
import loading from '@/components/requestState/isLoading'
import notFound from '@/components/requestState/noData'
export default {
  mixins: [scrollMixin],
  components: {
    activityItem,
    scroll,
    loading,
    notFound
  },
  data() {
    return {
      pullDownRefresh: true,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: true,
      bounce: false,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更多活动了',
      items: [],
      pageIndex: 1,
      pageSize: 6,
      searchOrder: 0,
      totalNotes: 0,
      filterIndex: 2,
      isLoading: false,
      noData: false,
      noDataT: '您的附近暂时没有活动',
      iconClass: 'iconWwushuju',
      name: 'dynamics'
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData () {
      let me = this
      me.api.get({
        url: `Activity?Lon=${me.$store.state.pos.longitude}&Lat=${me.$store.state.pos.latitude}&Distance=5&PageIndex=${me.pageIndex}&PageSize=${me.pageSize}`,
        success: function(res) {
          console.log(res)
          if (me.pageIndex === 1) {
            me.items = []
          }
          me.items = me.items.concat(res)
        },
        complete: function() {
          !me.items.length && (me.noData = true)
          me.items.length && (me.noData = false)
          me.$refs.scroll && me.$refs.scroll.refresh()
        }
      })
    },
    onPullingDown() {
      this.pageIndex = 1
      this.getData()
    },
    onPullingUp() {
      this.pageIndex++
      this.getData()
    }
  }
}
</script>
<style lang="less">
.nearActivityPage {
  width: 100%;
  height: calc(100vh - 13vw);
  overflow: hidden;
}
</style>
