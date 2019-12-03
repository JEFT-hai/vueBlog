<template>
  <swiper :options="swiperOption"
          :class="swiperClass"
          :id='elId'
          ref="swiper">
    <swiper-slide class="swiper-item"
                  v-for="(item, index) in items"
                  :key="index">
      <img :src='item.imageUlr ||  item.imageUrl || item'
           class="swiper-lazy"
           @click="goLink(item, $event)"
           :preview='perviewId' />
    </swiper-slide>
    <div class="swiper-pagination"
         slot="pagination"></div>
  </swiper>
</template>
<script>
export default {
    props: {
      items: {
        type: Array,
        required: true
      },
      canClick: {
        type: Boolean,
        required: false
      },
      elId: {
        type: String,
        required: true
      },
      type: { // 0 activityHome页面 | 1 postInner帖子
        type: Number,
        default: 1
      },
      autoplay: {
        type: [Object, Boolean],
        default: function () {
          return {
            delay: 3000,
            disableOnInteraction: false // 点击|滑动后 是否自动播放
          }
        }
      }
    },
    data() {
      return {
        swiperOption: {
          autoplay: this.autoplay,
          direction: 'horizontal', // 方向
          slidesPerView: 1,
          spaceBetween: 0,
          mousewheel: true,
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          }
        }
      }
    },
    computed: {
      perviewId () {
        return this.canClick ? 0 : this.elId
      },
      swiperClass () {
        let typeClass = '' // 默认值
        switch (this.type) {
          case 0:
            typeClass = 'swiper-activity'
            break
          case 1:
            typeClass = 'swiper-post'
            break
          case 2:
            typeClass = 'swiper-my'
            break
          case 3:
            typeClass = 'swiper-square'
            break
          default:
            typeClass = 'swiper-post'
            break
        }
        return `swiper_${this.elId} ${typeClass}`
      }
    },
    activated () {
      this.autoplay && this.$refs.swiper && this.$refs.swiper.swiper.autoplay.start()
    },
    deactivated () {
      this.autoplay && this.$refs.swiper && this.$refs.swiper.swiper.autoplay.stop()
    },
    methods: {
      goLink (item) {
        if (!this.canClick) {
          return
        }
        this.$router.push({
            name: 'activityInfo',
            params: {
              id: item.targetUrl
            }
        })
      }
    }
}
</script>
<style lang="less">
    // type 0 activity
    .swiper-activity{
        height: 130px;
        .swiper-pagination-bullet{
            width: 4px;
            height:4px;
            border-radius: 2px;
            &.swiper-pagination-bullet-active{
                width: 8px;
                background: #3daf3d;
            }
        }
    }
    // type 1 post 帖子
    .swiper-post{
      max-height: 133vw;
      .swiper-slide {
        img {
          max-height: 133vw;
        }
      }
      .swiper-pagination-bullets {
        bottom: 10px;
        left: 0;
        width: 100%;
      }
      .swiper-pagination-bullet{
        margin: 0 4px;
        &.swiper-pagination-bullet-active{
          background:red;
        }
      }
    }
    // 2 my
    .swiper_my{
      height: 71.85vw;
      .swiper-slide{
        height: 65vw;
        overflow: hidden;
      }
      .swiper-pagination-bullets{
        bottom: 0;
        .swiper-pagination-bullet{
          width:6px !important;
          height:6px !important;
          margin: 0 4px;
          &.swiper-pagination-bullet-active{
            background:red;
          }
        }
      }
    }

    // 3 user
    .swiper-square{
      height: 100vw;
      .swiper-slide {
        img {
          height: 100%;
        }
      }
      .swiper-pagination-bullets{
        .swiper-pagination-bullet{
          margin: 0 4px;
          &.swiper-pagination-bullet-active{
            background:red;
          }
        }
      }
    }
</style>
