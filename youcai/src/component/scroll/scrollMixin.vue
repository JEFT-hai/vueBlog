
<script>
export default {
  data () {
    return {
      scrollbar: false,
      scrollbarFade: false,
      pullDownRefreshThreshold: 90,
      pullDownRefreshStop: 40,
      pullUpLoadThreshold: 0,
      startY: 0,
      scrollToX: 0,
      scrollToY: -200,
      scrollToTime: 700,
      scrollToEasing: 'bounce',
      scrollToEasingOptions: ['bounce', 'swipe', 'swipeBounce']
    }
  },
  computed: {
    scrollbarObj: function () {
      return this.scrollbar ? { fade: this.scrollbarFade } : false
    },
    pullDownRefreshObj: function () {
      return this.pullDownRefresh ? {
        threshold: parseInt(this.pullDownRefreshThreshold),
        stop: parseInt(this.pullDownRefreshStop),
        txt: this.pullUpLoadTxt
      } : false
    },
    pullUpLoadObj: function () {
      return this.pullUpLoad ? {
        threshold: parseInt(this.pullUpLoadThreshold),
        txt: { more: this.pullUpLoadMoreTxt, noMore: this.pullUpLoadNoMoreTxt }
      } : false
    }
  },
  watch: {
    scrollbarObj: {
      handler () {
        this.rebuildScroll()
      },
      deep: true
    },
    pullDownRefreshObj: {
      handler (val) {
        const scroll = this.$refs.scroll.scroll
        if (val) {
          scroll.openPullDown()
        } else {
          scroll.closePullDown()
        }
      },
      deep: true
    },
    pullUpLoadObj: {
      handler (val) {
        const scroll = this.$refs.scroll.scroll
        if (val) {
          scroll.openPullUp()
        } else {
          scroll.closePullUp()
        }
      },
      deep: true
    }
  },
  methods: {
    scrollToBottom(num){
      let maxScrollY = this.$refs.scroll.scroll.maxScrollY >= -1 
                      ? this.$refs.scroll.scroll.maxScrollY 
                      : num 
                        ? this.$refs.scroll.scroll.maxScrollY + num 
                        : this.$refs.scroll.scroll.maxScrollY
      console.log(maxScrollY, 'maxScrollY')
      if (maxScrollY < -1){
        this.scrollTo(0, maxScrollY)
      }
    },
    scrollTo (x, y) {
      // expect a number, not string
      const scrollToTime = Number(this.scrollToTime)
      // const scrollToY = Number(this.scrollToY)
      // const scrollToX = Number(this.scrollToX)
      this.$refs.scroll.scrollTo(x, y, scrollToTime)
    },
    scrollToElement(el,timing){
      this.$refs.scroll.scrollToElement(el, timing, false, true, 'easing')
    },
    autoPullDownRefresh () {
      this.$refs.scroll.autoPullDownRefresh()
    },
    updateScrollToY (val) {
      this.scrollToY = val
    },
    rebuildScroll () {
      this.$nextTick(() => {
        this.$refs.scroll && this.$refs.scroll.destroy()
        this.$refs.scroll && this.$refs.scroll.initScroll()
      })
    }
  }
}
</script>
