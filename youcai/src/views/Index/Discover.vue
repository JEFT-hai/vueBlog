<template>
  <div class="page-content discoverWrap" v-show="show">
    <loading v-if="isLoading"></loading>
    <notFound v-if="noData"></notFound>
    <scroll
      ref="scroll"
      class="zq-waterfall"
      :data="items"
      :scrollbar="scrollbarObj"
      :pullDownRefresh="pullDownRefreshObj"
      :pullUpLoad="pullUpLoadObj"
      :startY="parseInt(startY)"
      :bounce="bounce"
      @pullingDown="onPullingDown"
      @pullingUp="onPullingUp"
      @scroll="subScroll"
      @scroll-end="subScrollEnd"
      :listenScroll="true"
      :listenScrollEnd="true"
      :preventDefault="true"
      :stopPropagation="stop"
      :probeType="3"
    >
      <Waterfall
        :addItems="addItems"
        :isRefresh="isRefresh"
        :preloadWebp="false"
        :addMethod="addMethod"
        @render="render"
        @renderEnd="renderEnd"
      ></Waterfall>
    </scroll>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import scrollMixin from '@/components/scroll/scrollMixin';
import indexDBMixin from '@/components/mixins/indexDBMixin';

const loading = () => import('@/components/requestState/isLoading')
const notFound = () => import('@/components/requestState/noData')
const scroll = () => import('@/components/scroll/scroll')
const Waterfall = () => import('@/components/Waterfall/Waterfall')

export default {
  mixins: [scrollMixin, indexDBMixin],
  components: {
    scroll,
    Waterfall,
    loading,
    notFound
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showBgLoading: true,
      isRenderEnd: false,
      isRefresh: false,
      isDiscoterOnly: 1,
      bounce: { top: true, left: false, right: false },
      stop: false,
      startY: 0,
      pullDownRefresh: true,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: true,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '上拉加载',
      items: [],
      isLoading: false,
      likes: [],
      scrollTop: 0,
      itemsA: [],
      itemsB: [],

      addMethod: 'app', // waterfall 参数
      addItems: [],
      allData: [],
      pageIndex: 1,
      pageSize: 10,
      postScrollY: 0,
      scrollState: 1, // 1 enable
      isTop: true,
      isWrapTop: true
    }
  },
  computed: {
    ...mapState({
      postType: 'postType'
    }),
    noData() {
      return !this.items.length && !this.isLoading
    }
  },
  watch: {
    show(newV) {
      if (newV) {
        this.$nextTick(() => {
          this.$refs.scroll && this.$refs.scroll.refresh()
        })
      }
    },
    postScrollY(newV) {
      newV && (this.isTop = false)
    },
    isRefresh(newV) {
      return newV
    }
  },
  beforeCreate() {
    // next()
    this.isLoading = true
  },
  created() {
    this.initData()
  },
  methods: {
    ...mapMutations({
      hideBgLoading: 'hideBgLoading',
      setMusicPage: 'setMusicPage',
      setRebuild: 'setRebuild'
    }),
    resetData() {
      this.rebuild = true
      this.onPullingDown()
    },
    subScroll(pos) {
      this.$emit('scroll', pos)
      this.postScrollY = pos.y
      if (this.$refs.scroll.scroll.movingDirectionY < 0) {
        this.scrollState = -1
      }
    },
    subScrollEnd(pos) {
      this.$emit('scroll-end', pos)
      this.postScrollY = pos.y
    },
    /**
     * 获取瀑布流数据
     *  */
    initData() {
      let me = this
      if (me.pageIndex === 1 && me.noData) {
        me.isLoading = true
      }
      me.api.get({
        url: `Post/?PageIndex=${me.pageIndex}&PageSize=${me.pageSize}&postType=${me.postType}`,
        success: function(res) {
          // if (me.pageIndex === 1) {
          //   me.isRefresh = true
          // }
          if (me.pageIndex === 1) {
            me.addMethod = 'prep';
          } else {
            me.addMethod = 'app';
          }
          me.addItems = res
        },
        error: function(err) {
          console.log(err)
          me.initIndexDB()
          me.items = me.items.concat([])
        },
        complete: function() {
          me.isLoading = false
        }
      })
    },
    onPullingDown() {
      // 下拉刷新
      this.pageIndex = 1
      this.pageSize = 10
      this.initData()
    },
    onPullingUp() {
      // 上拉加载数据
      if (this.isRenderEnd) {
        // 要上一次渲染完毕才可以触发
        this.pageIndex++
        this.initData()
      }
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
          if (!this.addItems.length && this.items.length) {
            // 上拉刷新没有数据的时候
            this.$toast('已无更多推荐数据')
            this.items = this.items.concat(this.addItems)
            return;
          }
          this.items = []
          this.items = this.items.concat(this.addItems)
        } else {
          this.items = this.items.concat(this.addItems)
        }
      }
    }
  }
}
</script>

<style lang="less" scope>
@import url(../../assets/less/pages.less);
.zq-waterfall {
  // padding-top:1.66vw !important;
}
.pulldown-wrapper {
  background: transparent !important;
}
.zq-waterfall .content {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  border: 2.315vw solid transparent;
  padding: 0 !important;
}
.discoverWrap {
  background-color: #f3f3f3;
  position: relative;
  height: calc(100vh - 11.03vw);
  width: 100%;
  // position: fixed;
  // width: 100%;
  // top: 24vw;
  // bottom: 12vw;
  overflow: hidden;
  .pulldown-wrapper {
    position: absolute;
    width: 100%;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all;
    .after-trigger {
      margin-top: 10px;
    }
  }
  .pullup-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 0;
  }
  .soli_discover {
    padding-top: 0 !important;
    margin-top: 0 !important;
    // margin-top: 26.333vw;
  }
  .bottom-tip {
    // position: absolute;
    // bottom: 0;
    width: 100%;
    text-align: center;
    height: 30px;
    line-height: 30px;
    font-size: 10px;
    color: #aaa;
  }
  .refreshDes {
    display: inline-block;
    width: 20vw;
    height: 8vw;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    border-radius: 3vw;
    text-align: center;
    line-height: 8vw;
    padding-left: 1vw;
    padding-right: 1vw;
  }
}
</style>
