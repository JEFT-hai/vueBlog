<template>
  <div class="shop-page">
    <goods-left class="goods-left"
      :curTab='curTab'
      @setCategory='setCategory'
    ></goods-left>
    <scroll class="goods-right" ref='scroll'>
      <goods-item v-for="(item,index) in goods" :key='index' :item='item'></goods-item>
    </scroll>
  </div>
</template>

<script>
/** 商城页面
 *  1. 左右结构，左侧点击要自适应头部与底部滚动，右侧每次更新要初始化到顶部
 *  2. FIXME: good-item
*/
const scroll = resolve => require(['@/component/scroll/scroll'], resolve)
const goodsLeft = resolve => require(['@/component/formation/goodsLeft'], resolve)
const goodsItem = resolve => require(['@/component/items/good'], resolve)
import scrollMixin from '@/component/scroll/scrollMixin'
export default {
  mixins: [scrollMixin],
  components: {
    goodsLeft,
    scroll,
    goodsItem
  },
  data () {
    return {
      curTab: '有才推荐',
      goods: []
    }
  },
  watch: {
    curTab (newV) { // 用watch可以过滤掉重复点击当前curtab
      this.getNewGoods(newV)
    }
  },
  created () {
    this.getNewGoods(this.curTab)
  },
  methods: {
    setCategory (item) {
      this.curTab = item
    },
    getNewGoods (name) {
      let goods = this.getMock('goods')
      if (isNaN(Number(name))) {
        this.goods = goods[name]
      } else {
        this.goods = goods['all']
      }
      this.$refs.scroll && this.$refs.scroll.scroll.scrollTo(0, 0)
    }
  }
}
</script>

<style lang='less'>
.shop-page{
  width: 100vw;
  height: calc(100vh - 12vw);
  display: flex;
  background-color: #f6f6f6;
  .goods-left{
    width: 21.3vw;
  }
  .goods-right{
    width: 78.7vw;
    background-color: #fff;
  }
}
</style>
