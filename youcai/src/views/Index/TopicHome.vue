<template>
  <div v-show="show"
       class="topicWrap"
       id="topicWrap">
    <scroll ref="scroll"
            :data="items"
            :scrollbar="scrollbarObj"
            :pullDownRefresh="pullDownRefreshObj"
            :pullUpLoad="pullUpLoadObj"
            :startY="parseInt(startY)"
            @pullingDown="onPullingDown"
            @pullingUp="onPullingUp"
            @scroll='subScroll'
            @scroll-end='subScrollEnd'
            :listenScroll='true'
            :listenScrollEnd='true'
            :preventDefault="true"
            :stopPropagation='true'
            :probeType='1'>
      <div class="topicMain">
        <div class="split"></div>
        <ul class="topicUl">
          <li class="borderB"
              v-for="(item,index) in items"
              :key="index">
            <topicItem :item='item'
                       :index='index'></topicItem>
            <!-- <span :class="['hotCount',{noHot:index > 11}]">{{index + 1}}</span>
            <div class="topicContent">
              <span>{{item.Description && item.Description.length >= 1? item.Description : item.title}}</span>
              <span>{{format.formatNum(item.hotDegree)}}&nbsp;热度</span>
            </div>
            <div class="topicImg">
              <img :src="item.image"  alt="">
            </div> -->
          </li>
        </ul>
      </div>
    </scroll>
  </div>
</template>

<script>
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'

import topicItem from '@/views/Discover/components/topicItem'
export default {
  mixins: [scrollMixin],
  components: {
    scroll,
    topicItem
  },
  props: {
    show: {
      type: Boolean,
      default: false
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
      pageSize: 5
    }
  },
  watch: {
    formLoading: function (isLoading) {
      let me = this
      me.$msg.updateLoading(isLoading)
    },
    searchTitle () {
      console.log('discover数据改变,根据要搜索的字段去请求后台接口', this.searchTitle)
    },
    isLoading () {
      return !this.items.length
    },
    show () {
      if (this.show && this.curPage === 1) {
        this.$nextTick(() => {
          this.$refs.scroll && this.$refs.scroll.refresh()
        })
      }
    }
  },
  activated () {
    // this.$refs.scroll && this.$refs.scroll.forceUpdate()
  },
  created () {
    this.getData()
  },
  methods: {
    subScroll (pos) {
      this.$emit('scroll', pos)
    },
    subScrollEnd (pos) {
      this.$emit('scroll-end', pos)
    },
    // 方法
    gotoItem (item) {
      this.$router.push({ name: 'topicItemss', params: { id: item.topicId } })
    },
    // 获取关注页数据
    getData () {
      let me = this
      me.api.get({
        url: `Topic?PageIndex=${me.curPage}&PageSize=${me.pageSize}`,
        success: function (res) {
          me.curPage === 1 && (me.items = [])
          me.items = me.items.concat(res)
        },
        error: function (res) {
          me.$msg.showError(res.msg)
          me.$refs.scroll && me.$refs.scroll.forceUpdate()
        },
        complete: function () {
          me.$refs.scroll && me.$refs.scroll.forceUpdate()
          // me.isLoading = false
        }
      })
    },
    onPullingDown () {
      this.curPage = 1
      this.getData()
    },
    onPullingUp () {
      // 更新数据
      this.curPage++
      this.getData()
    }
  }
}
</script>

<style lang="less">
.topicWrap{
  width:100%;
  position:relative;
  // margin-top: 25vw;
  height: calc(100vh - 11.03vw);
}
.topicMain{
    .split{
      width:100%;
      height:2.22vw;
      background-color:var(--mBg);
    }
    .topicUl{
      li{
        width:100%;
        
        box-sizing: border-box;
      }
    }
  }
</style>
