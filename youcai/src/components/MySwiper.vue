<template>
  <div class="ry-content">
    <div class="swiper-container ry-swiper"
         id="rySwiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide"
             v-for="(oneImg,index) in squencelist"
             :key="index">
          <a href="javascript:;"
             class="ry-item">
            <dl>
              <dt>
                <img :src="oneImg.imageUrl"
                     class="ry-cert">
              </dt>
              <dd>勇往直前说道做到的漩涡鸣人</dd>
            </dl>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
export default {
  data() {
    return {
      musicInnerData: {},
      current: '',
      myIndex: '',
      // 是否是由touch事件触发的音乐切换
      isTouchEvent: false,
      isTouchEventTwo: false
    }
  },
  computed: {
    ...mapState([
      'isPlaying',
      'currentIndex',
      'playList',
      'squencelist',
      'musicMode',
      'pieShow',
      'musicInnerShow',
      'changeRage'
    ]),
    ...mapGetters([
      'musicCover',
      'musicSrc',
      'musicItem',
      'musicCurrentTime',
      'musicDurationTime'
    ])
  },
  watch: {
    // 监听currentIndex
    currentIndex (newV, oldV) {
      if (newV || newV === 0) {
        this.isTouchEvent = false
        this.mySwiper.slideTo(newV)
      }
    }
  },
  mounted() {
    // activeIndex 是当前的swiperIndex
    this.mySwiper = new Swiper('#rySwiper', {
      pagination: '.swiper-pagination',
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',
      autoplay: 100,
      loop: false,
      slidesPerView: 'auto',
      centeredSlides: true,
      observer: true, //修改swiper自己或子元素时，自动初始化swiper
      observeParents: true,
      initialSlide : this.currentIndex, // 初始化index
      on: {
        touchStart: swiper => {
          this.isTouchEvent = true
          this.isTouchEventTwo = false
        },
        slidePrevTransitionEnd: () => {
          // 上一张
          if (this.isTouchEvent) {
            // 这里是为了不让swiper来回触发，乱跳
            this.mySwiper && this.setMusicIndex(this.mySwiper.activeIndex)
          }
        },
        slideNextTransitionEnd: () => {
          // 下一张
          if (this.isTouchEvent) {
            // 这里是为了不让swiper来回触发，乱跳
            this.mySwiper && this.setMusicIndex(this.mySwiper.activeIndex)
          }
        }
      }
    })
  },
  methods: {
    ...mapMutations({
      'setMusicIndex': 'setMusicIndex'
    }),
    /**
     * getCurrentBtnImg得到当前点进来的图片
     */
    getCurrentBtnImg() {
      let index = this.squencelist.indexOf(this.musicItem)
      this.current = index
      return
    },
    initSwiper() {
      this.getCurrentBtnImg()
      let myIndex = this.current
      this.mySwiper = new Swiper('#rySwiper', {
        pagination: '.swiper-pagination',
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        autoplay: 100,
        loop: false,
        slidesPerView: 'auto',
        centeredSlides: true,
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true,
        shortSwipes : false, // 只能长切换
        on: {
          touchStart: swiper => {
            this.isTouchEventTwo = true
            console.log(this.isTouchEventTwo)
            this.isTouchEvent = false
          },
          slidePrevTransitionEnd: () => {
            // 上一张
            console.log('--', this.isTouchEventTwo)
            if (this.isTouchEventTwo) {
              // 这里是为了不让swiper来回触发，乱跳
              this.$emit('prveMusic')
            }
          },
          slideNextTransitionEnd: () => {
            // 下一张
            console.log('next2')

            console.log('--', this.isTouchEventTwo)
            if (this.isTouchEventTwo) {
              // 这里是为了不让swiper来回触发，乱跳
              console.log('下一首')
              this.$emit('nextMusic')
            }
          },
          updated: () => {
            console.log('更新了')
          }
        }
      })
      this.mySwiper.slideTo(myIndex)
    }
  }
}
</script>
<style lang="less" scoped>
* {
  padding: 0;
  margin: 0;
}
a {
  text-decoration: none;
}
.ry-content {
  position: relative;
}
.ry-swiper {
  width: 100%;
  cursor: pointer;
  padding: 0 0 3vw 0;
  box-sizing: border-box;
}
.ry-pagination {
  margin-top: 20px;
}
.ry-swiper .swiper-slide {
  width: 67.4vw;
  height: 67.4vw;
  border-radius: 3vw 3vw 3vw 3vw;
  background-color: #fff;
  opacity: 0.7;
  transform: scale(0.8);
  -webkit-transform: scale(0.8);
  -moz-transform: scale(0.8);
  -webkit-transition: transform 1s;
  -moz-transition: transform 1s;
}
.ry-swiper .swiper-slide-active {
  transform: scale(1);
  opacity: 1;
  z-index: 10;
}
.ry-swiper .swiper-slide.swiper-slide-prev {
  transform: scale(0.8);
}

.ry-swiper .swiper-slide.swiper-slide-next {
  transform: scale(0.8);
}

.ry-item {
  display: block;
  width: 67.4vw;
  height: 67.4vw;
  border-radius: 3vw 3vw 3vw 3vw;
  overflow: hidden;
  text-align: center;
  color: #505050;
  font-size: 16px;
}

.ry-swiper .swiper-slide-active .ry-item {
  box-shadow: 0 2px 10px rgba(55, 139, 236, 0.29);
}

.ry-item dt {
  display: block;
  width: 67.4vw;
  height: 67.4vw;
  overflow: hidden;
}

.ry-item img {
  width: 67.4vw;
  height: 67.4vw;
  border-radius: 3vw 3vw 3vw 3vw;
}

.ry-item dd {
  margin-top: 22px;
}
</style>
