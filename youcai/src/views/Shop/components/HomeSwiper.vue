<template>
  <div class="swiper-container"
       :id="'post_swiper_'+elId"
       v-if='show'>
    <div class="swiper-wrapper">
      <div class="swiper-slide myHomeSwiper"
           v-for="(image,index) in images"
           :key="index">
        <img alt
             :src="image"
             :data-src="image"
             @click="canClick ? handleClick(image) : ''" />
      </div>
    </div>
    <div class="swiper-pagination homeSwiperPoint"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      mySwiper: null,
      show: this.pictures,
    }
  },
  props: {
    pictures: {
      type: String,
      required: true
    },
    elId: {
      type: String,
      required: true
    },
    canClick: {
      type: Boolean,
      required: false
    },
    allImg: {
      type: Array,
      required: false
    }
  },
  computed: {
    images () {
      let arr = this.pictures.split(',')
      // eslint-disable-next-line
      this.titleTwo = arr.length
      return arr
    }
  },
  watch: {
    pictures (newV) {
      return newV
    },
    images (newV) {
      this.$nextTick(() => {
        this.swiperInit()
      })
      return newV
    }
  },
  mounted () {
    // eslint-disable-next-line
    this.mySwiper = new Swiper('#post_swiper_'+this.elId, {
      loop: false,
      lazyLoading: true,
      initialSlide : 0,
      observer: true, //修改swiper自己或子元素时，自动初始化swiper
      observeParents:true,
      pagination: {
        el: '.swiper-pagination'
      }
    })
  },
  methods: {
    /**
     * 点击轮播图
     */
    handleClick () {
    },
    swiperInit () {
      // eslint-disable-next-line
      this.mySwiper = new Swiper('#post_swiper_'+this.elId, {
        // zoom: true,
        // zoomToggle :false, //设置为false 不允许双击缩放，只允许手机端缩放
        passiveListeners: false,
        // allowTouchMove: true,
        loop: false,
        lazyLoading: false,
        observer: true,
        initialSlide :0,
        observeParents:true,
        pagination: {
          el: '.swiper-pagination'
        },
      })
    }
  }
}
</script>

<style lang="less" scoped>
.swiper-container{
    height:65vw !important;
    overflow: hidden;
    .swiper-wrapper{
        height:56vw !important;
        .myHomeSwiper{
          height:56vw !important;
          overflow: hidden !important;
          position:relative;
          img{
            width:100%;
            height:100%;
            object-fit: cover;
            // position:absolute;
            // top:0;
            // left:0;
            // right:0;
            // bottom:0;
            // margin:auto;
            // border:1px solid green;
          }
        }
    }
}
.count{
  display:inline-block;
  width:11.2vw;
  height:4.5vw;
  text-align: center;
  line-height:4.5vw;
  color:white;
  background:rgba(0,0,0,.5);
  position:absolute;
  top:55vw;
  right:4.44vw;
  z-index: 22;
  border-radius: 3vw;
  font-size:3vw;
}
 .swiper-pagination{
    position: absolute;
    bottom:3.5vw;
 }
</style>

<style lang="less">  // 使用两个style表示是为了解决vue中style使用scoped不能修改第三方组件的样式
  .homeSwiperPoint{
    .swiper-pagination-bullet{
      width:6px !important;
      height:6px !important;
      margin-right:-0.1vw !important;
    }
  }
</style>
