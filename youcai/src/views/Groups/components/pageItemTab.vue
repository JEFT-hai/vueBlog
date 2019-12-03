<template>
  <div class="activityTabContent TabContentItemPage">
    <!-- <loading v-if='isLoading'></loading> -->
    <notFound
      v-if="noData"
      :failTitle="noDataT"
      :iconClass="iconClass"
    ></notFound>
    <scroll
      ref="scroll"
      :data="items"
      :scrollbar="scrollbarObj"
      :pullDownRefresh="pullDownRefreshObj"
      :pullUpLoad="pullUpLoadObj"
      @pullingDown="onPullingDown"
      @pullingUp="onPullingUp"
      @scroll="subScroll"
      @scroll-end="subScrollEnd"
      :click="true"
      :listenScroll="true"
      :listenScrollEnd="true"
      :direction="direction"
      :bounce="bounce"
      :startY="subScrollY"
      :scrollToY="subScrollY"
      :probeType="1"
    >
      <waterfall
        ref="listWrapper"
        :addItems="addItems"
        :isRefresh="isRefresh"
        @render="render"
        @renderEnd="renderEnd"
      ></waterfall>
    </scroll>
  </div>
</template>
<script>
import scroll from '@/components/scroll/scroll';
import scrollMixin from '@/components/scroll/scrollMixin';
import waterfall from '@/components/Waterfall/Waterfall';
import notFound from '@/components/requestState/noData';
export default {
  mixins: [scrollMixin],
  components: {
    scroll,
    waterfall,
    notFound
  },
  props: {
    groupId: {
      require: true
    },
    direction: {
      // 控制渲染scroll | 关键代码
      type: String,
      default: 'vertical'
    },
    subScrollY: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isRefresh: true, // 是否是刷新
      isRenderEnd: false, // 是否渲染完毕
      stop: false,
      isFail: false, // 表示没有数据
      failTitle: '还没有群动态哦!',
      subIsNotTop: true,
      tabIndex: 0,
      items: [],
      pageIndex: 1,
      pageSize: 8,
      addItems: [],
      name: 'groupActivity',
      isLoading: false,
      noDataT: '该群还没有群动态，快去发布吧',
      iconClass: 'iconWzanwudongtai',
      pullDownRefresh: false,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: true,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更多群动态了',
      bounce: { top: false, left: false, right: false }
    }
  },
  computed: {
    noData() {
      // 是否有数据
      return !this.items.length
    }
  },
  watch: {
    direction() {
      // 检测direction，重置scroll | 关键
      this.rebuildScroll()
    },
    subIsNotTop(newV) {
      return newV
    },
    groupId() {
      this.pageIndex = 1
      this.items.length = 0
      this.initData()
    }
  },
  created() {
    this.initData()
  },
  methods: {
    subScroll(pos) {
      this.$emit('scroll', pos)
    },
    subScrollEnd(pos) {
      this.$emit('scroll-end', pos)
    },
    onPullingDown() {
      this.$emit('pullingDown', this.tabIndex)
      this.pageIndex = 1
      this.initData()
    },
    onPullingUp() {
      this.$emit('pullingUp', this.tabIndex)
      this.pageIndex++
      this.initData()
    },
    initData() {
      // 获取群组的动态
      let me = this
      me.isLoading = true
      if (me.pageIndex == 1) {
        me.isRefresh = true
      }
      me.api.get({
        url: `PostGroup?PageIndex=${me.pageIndex}&PageSize=${me.pageSize}&GroupId=${me.groupId}`,
        success: function(res) {
          me.addItems = res
        },
        error: function() {},
        complete: function() {}
      })
    },
    render() {
      // 开始渲染瀑布流
      this.isRefresh = false
    },
    renderEnd(data) {
      // 是否渲染完毕
      this.isRenderEnd = data
      if (data) {
        if (this.pageIndex === 1) {
          this.items = []
        }
        this.items = this.items.concat(this.addItems)
        this.$emit('renderEnd')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.noData {
  width: 100%;
  height: 81vw;
  border: 1px solid white;
}
</style>
<style lang="less">
.activityTabContent {
  background: #f3f3f3;
  .showWrap {
    background: transparent;
  }
}
</style>
