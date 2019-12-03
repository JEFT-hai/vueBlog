<template>
  <div class="swiper-container discoverSwiperContainer"
       :id="'post_swiper_'+elId"
       v-if="show">
    <div class="swiper-wrapper">
      <div class="swiper-slide"
           v-for="(image,index) in images"
           :key="index">
        <!-- <img :src="config.imageOrigin+image" alt :data-src="config.imageOrigin+image" class="swiper-lazy" /> -->
        <img alt
             :src="image"
             :data-src="image"
             @click="canClick ? handleClick(image) : ''"
             preview="elId">
      </div>
    </div>
    <div class="swiper-pagination"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mySwiper: null,
      show: this.pictures
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
    images() {
      return this.pictures.split(',')
    }
  },
  watch: {
    elId (newV) {
      // console.log('elid变化率', newV)
      // this.mySwiper = null
      // this.elId = newV
      // this.swiperInit()
    },
    pictures(newV) {
      return newV
    },
    images(newV) {
      // this.mySwiper && this.mySwiper.lockSwipeToPrev()
      // this.mySwiper && this.mySwiper.lockSwipeToNext()
      this.$nextTick(() => {
        this.swiperInit()
      })
      return newV
    }
  },
  mounted() {
    // if (this.images.length <= 1) {
    // var loop = (this.images.length > 1) ? true : false
    // }
    // console.log(loop, 'loop')
    // eslint-disable-next-line
    this.mySwiper = new Swiper('#post_swiper_' + this.elId, {
      zoom: true,
      allowTouchMove: true,
      passiveListeners: false,
      loop: false,
      lazyLoading: true,
      observer: true,
      initialSlide: 0,
      observer: true, // 修改swiper自己或子元素时，自动初始化swiper
      observeParents: true,
      pagination: {
        el: '.swiper-pagination'
      },
      on: {
        // 4.4.5
        zoomChange: function(scale, imageEl, slideEl) {
          console.log(scale, 'scale')
        }
      }
    })
  },
  methods: {
    /**
     * 点击轮播图
     */
    handleClick(image) {
      // this.allImg.forEach(item => {
      //   if (image === item.activityImg) {
      //     this.$router.push({ name: 'discoverinfo', params: { id: item.id } })
      //   }
      // })
      console.log('轮播图点击')
    },
    swiperInit() {
      // if (this.images.length <= 1) {
      // var loop = (this.images.length > 1) ? true : false
      // }
      // console.log('重新loop', loop)
      console.log('我是重新new')
      this.mySwiper = new Swiper('#post_swiper_' + this.elId, {
        zoom: true,
        // zoomToggle :false, //设置为false 不允许双击缩放，只允许手机端缩放
        passiveListeners: false,
        // allowTouchMove: true,
        loop: false,
        lazyLoading: false,
        observer: true,
        initialSlide: 0,
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true,
        pagination: {
          el: '.swiper-pagination'
        }
      })
    }
  }
}
</script>
<style lang="less">
.discoverSwiperContainer {
  .swiper-slide {
    img {
      max-height: 133vw;
    }
  }
  .swiper-pagination-bullet{
      &.swiper-pagination-bullet-active{
        background:red;
      }
    }
}
</style>
