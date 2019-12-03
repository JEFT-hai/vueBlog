<template>
  <div class="activityTabContent TabContentItemPage">
    <!-- <loading v-if='isLoading'></loading> -->
    <notFound v-if='noData'
              :failTitle='noDataT'
              :iconClass='iconClass'></notFound>
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
      <!-- <slot> -->
      <!-- <div class="ListItem" v-for='item in [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]' :key='item' >{{item}}</div> -->
      <div>
        <activityItem v-for='(item, index) in allData'
                      :item='item'
                      :key='index'></activityItem>
        <!-- <show-content ref='listWrapper' :itemsA="itemsA" :itemsB="itemsB"></show-content> -->
      </div>
      <!-- </slot> -->
    </scroll>
  </div>
</template>
<script>
const DIRECTION_V = 'vertical'
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
import activityItem from '@/components/activityItem'
import notFound from '@/components/requestState/noData'
export default {
  props: {
    groupId: {
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
      pullUpLoad: true,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更多群活动了',
    }
  },
  activated () {
    // this.onPullingDown()
    this.curPage = 1
    this.initData()
  },
  mixins: [scrollMixin],
  components: {
    scroll,
    activityItem,
    notFound
  },
  watch: {
    direction () {
      this.rebuildScroll()
    },
    subIsNotTop (newV) {
      // this.rebuildScroll()
      return newV
    },
    groupId () {
      this.curPage = 1
      this.allData.length = 0
      this.initData()
    }
  },
  mounted() {
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
    // 方法
    initData () {
      let me = this
      me.isLoading = true
      me.api.get({
        url: `ActivityGroup?PageIndex=${me.curPage}&PageSize=${me.pageSize}&GroupId=${me.groupId}`,
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
