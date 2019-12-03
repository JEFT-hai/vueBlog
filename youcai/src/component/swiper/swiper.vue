<template>
  <swiper
    :class="['swiper-wrap', swiperClass]"
    :options='options'
    :id='elId'
    ref='swiper'>
      <swiper-slide v-for='item in items' :key='item.img' class="swiper-item" @click='goLink(item.router || 0)'>
          <img class="swiper-img" :src="item.img" alt="">
      </swiper-slide>
      <div class="swiper-pagination" :style="{width: `${1.25*(items.length + 1)}vw`}"
         slot="pagination">
         <span class="swiper-pagination-bullet swiper-pagination-bullet-active">121</span>
      </div>
  </swiper>
</template>

<script>
/** img_swiper组件
 *  1. 传入不同的swiperType计算出不同的swiperClass来改变swiper的样式
 *  2. 传入的items的item有router与img属性
*/
export default {
    props: {
        items: {
            type: Array,
            required: true
        },
        swiperType: {
            type: String,
            default: ''
        },
        autoplay: {
            type: [Object, Boolean],
            default: function () {
                return {
                    delay: 5000,
                    disableOnInteraction: false // 点击|滑动后 是否自动播放
                }
            }
        }
    },
    data () {
        return {
            options: {
                autoplay: this.autoplay,
                loop : true,
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
        elId () {
            return this.items[0].img
        },
        swiperClass () {
            let swiperClass = ''
            switch (this.swiperType) {
                case '':
                  swiperClass = 'swiper-index'
                  break
                default :
                  swiperClass = 'swiper-index'
                  break
            }
            return swiperClass
        }
    },
    activated () {
      this.autoplay && this.$refs.swiper && this.$refs.swiper.swiper.autoplay.start()
    },
    deactivated () {
      this.autoplay && this.$refs.swiper && this.$refs.swiper.swiper.autoplay.stop()
    },
    methods: {
        goLink (router) {
            if (!router) {
                return
            }
            this.$router.push(router)
        }
    }
}
</script>

<style lang='less'>
.marginLeft(@n, @i:1) when (@i <= @n) {
  &:nth-child(@{i}) {
    transform: translate3d(1.25vw * (@i - 1), 0, 0)
  }
  .marginLeft(@n,(@i + 1));
}
// .cc(@count) when (@count > 0) {
//     .cc((@count -1));
//     &:nth-child((@count)) {
//         margin-left: (1.25vw * @count);
//     }
// }
.swiper-wrap{
    position: relative;
    width: 100%;
    height: 39vw;
    border-radius: 1vw;
    overflow: hidden;
    .swiper-img{
        width: 100%;
        height: 100%;
    }
    .swiper-pagination{
        position: absolute;
        left: 50%;
        bottom: 2.8vw;
        height: 0.8vw;
        border-radius: 0.4vw;
        overflow: hidden;
        transform: translate3d(-50%, 0, 0);
        background-color: #aaa;
        // display: flex;
        font-size: 0;
        .swiper-pagination-bullet{
            position: absolute;
            top: 0;
            left: 0;
            width: 2.5vw;
            height: 100%;
            margin: 0;
            padding: 0;
            background-color: transparent;
            &.swiper-pagination-bullet-active{
                background-color: #222;
            }
            .marginLeft(10);
        }
        
    }
    
}
</style>
