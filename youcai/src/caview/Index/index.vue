<template>
  <div class="index-page">
    <scroll
      class="index-main"
      ref='scroll'
      :data="designs"
      :bounce='true'
      :pullUpLoad="pullUpLoadObj"
      @pullingUp="onPullingUp"
    >
      <div class="categories">
        <div class='categories'>
          <div class='category-item'>
            <div class='category-icon iconfont fangwu'></div>
            <div class='category-tit'>家装案例</div>
          </div>
          <div class='category-item'>
            <div class='category-icon iconfont celiang'></div>
            <div class='category-tit'>装修攻略</div>
          </div>
          <div class='category-item'>
            <div class='category-icon iconfont sofa'></div>
            <div class='category-tit'>居住升级</div>
          </div>
          <div class='category-item'>
            <div class='category-icon iconfont gift'></div>
            <div class='category-tit'>打卡领卷</div>
          </div>
        </div>
      </div>
      <div class='entries'>
        <div class="entry-item" v-for="item in entries" :key='item.tit' :style='{background: `url(${item.bg})`,backgroundSize: "cover"}'>
          <div class="entry-tit">{{item.tit}}</div>
          <div class="entry-desc">{{item.desc}}</div>
        </div>
      </div>
      <swiper :items='swiperItems'></swiper>
      <div class="design-wrap">
        <div class="design-tit">为你推荐</div>
        <design-item v-for="(item, index) in designs" :key='item.tit + index' :item='item'></design-item>
      </div>
    </scroll>
  </div>
  
</template>

<script>
const swiper = resolve => require(['@/component/swiper/swiper'], resolve)
const scroll = resolve => require(['@/component/scroll/scroll'], resolve)
const designItem = resolve => require(['@/component/items/design'], resolve)
import scrollMixin from '@/component/scroll/scrollMixin'
export default {
  mixins: [scrollMixin],
  components: {
    swiper,
    scroll,
    designItem
  },
  data () {
    return {
      pullUpLoad: true,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '-- 我也是有底线的 --',
      swiperItems: [{
        img: require('../../assets/y/index/slider/banner1.jpg')
      },
      {
        img: require('../../assets/y/index/slider/banner2.jpg')
      },{
        img: require('../../assets/y/index/slider/banner3.jpg')
      }],
      entries: [
        {
          tit: '各类工种',
          desc: '申请入驻入口',
          bg: require('../../assets/y/index/entry_write.png'),
          href: ''
        },
        {
          tit: '工程项目',
          desc: '招才发布入口',
          bg: require('../../assets/y/index/entry_public.png'),
          href: ''
        }
      ],
      rollings: ['xxx雇佣了xx', 'ss被sss雇佣了'],
      designs: [],
      pageIndex: 1,
      pageSize: 10,
      moreData: ''
    }
  },
  created () {
    this.designs = this.getMock('designs')
    console.log(this.designs)
  },
  methods: {
    onPullingUp () {
      this.pageIndex++
      this.newData = this.pageIndex < 3 ? this.designs : []
      this.designs = this.designs.concat(this.newData)
      this.$refs.scroll && this.$refs.scroll.forceUpdate()
    }
  }
}
</script>

<style lang='less'>
.index-page{
  background-color: #f3f3f3;
  .index-main{
    width: 100vw;
    height: calc(100vh - 33vw);
    padding: 0 5vw;
    background-color: #fff;
    overflow: hidden;
    // .scroll-content{
    //   background-color: #fff;
    // }
    .categories{
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .category-item{
        width: 15vw;
        // height: 22vw;
        text-align: center;
        .category-icon{
            display: block;
            height: 15vw;
            line-height: 15vw;
            font-size: 10vw;
            &.fangwu{
              background: url('../../assets/y/index/fangwu.png') center center no-repeat;
              background-size: contain;
            }
            &.gift{
              background: url('../../assets/y/index/gift.png') center center no-repeat;
              background-size: contain;
            }
            &.sofa{
              background: url('../../assets/y/index/sofa.png') center center no-repeat;
              background-size: contain;
            }
            &.celiang{
              background: url('../../assets/y/index/celiang.png') center center no-repeat;
              background-size: contain;
            }
            background-size: contain;
        }
        .category-tit{
            height: 7vw;
            line-height: 7vw;
            font-size: 3.15vw;
            color: #999;
        }
      }
    }
    .entries{
      width: 100%;
      margin: 6vw 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      .entry-item{
        width: 42.4vw;
        height: 29vw;
        border-radius: 0.5vw;
        background-color: #ccc;
        padding: 2vw 3vw;
        box-sizing: border-box;
        .entry-tit{
            font-size: 4.6vw;
            height: 7.2vw;
            line-height: 7.2vw;
            letter-spacing: 1px;
            color: #3a3e01;
        }
        .entry-desc{
            font-size: 3.6vw;
            height: 5.8vw;
            line-height: 5.8vw;
            color: #4d452e;
        }
      }
    }
    .design-tit{
        height: 10vw;
        line-height: 10vw;
        font-size: 4.5vw;
        font-weight: 600;
        margin-top: 10vw;
    }
  }
}
</style>