<script>
export default {
  data () {
    return {
      touchCurIndex: 0,
      isHTouch: false,
      touchMoveL: 0,
      startX: 0, // 开始触摸的位置
      startY: 0,
      moveX: 0, // 滑动时的位置
      moveY: 0,
      endX: 0,
      endY: 0, // 结束触摸的位置
      disX: 0, // 移动距离
      disY: 0,
      transX: 0,
      startT: 0,
      endT: 0,
      touchChildW: 0
    }
  },
  mounted () {
    this.touchChildW = document.body.offsetWidth
  },
  watch: {
    touchCurIndex (newV) {
      this.$refs.tabMove.tab(newV)
      this.$refs.touchContent.style.transform = 'translate3d(' + -this.touchCurIndex * this.touchChildW + 'px, 0, 0)'
    //   if (!this.allItems[newV].items.length && this.searchContent && !this.allItems[newV].noData) {
    //     this.getSearch()
    //   }
    }
  },
  methods: {
    tabMoveScroll (index) {
      console.log(index)
      this.touchCurIndex !== index && (this.touchCurIndex = index)
    },
    touchstart (e) {
      this.startX = e.touches[0].clientX
      this.startY = e.touches[0].clientY
      this.startT = new Date().getTime()
      this.subIsNotTop && e.stopPropagation()
    //   if (this.direction) {
    //     e.stopPropagation()
    //     return
    //   }
      
    //   console.log(1212)
    //   e.preventDefault()
    //   return false
      // this.startScrollY = 0
    },
    touchmove (ev) {
    //   ev = ev || window.event
    //   ev.preventDefault()
    //   this.direction && ev.stopPropagation()
      if (ev.touches.length === 1) {
        this.moveX = ev.touches[0].clientX
        this.moveY = ev.touches[0].clientY
        this.disX = this.moveX - this.startX
        this.disY = this.moveY - this.startY
        // 手势倾斜角度
        if (this.disY / this.disX > 0.3 || this.disY / this.disX < -0.3) {
          this.isHTouch = false
          return
        }
        this.isHTouch = true
        this.transX = -this.touchCurIndex * this.touchChildW + this.disX >= 0 ? 0 : (-this.touchCurIndex * this.touchChildW + this.disX <= -(this.tabData.length - 1) * this.touchChildW ? -(this.tabData.length - 1) * this.touchChildW : -this.touchCurIndex * this.touchChildW + this.disX)
        this.$refs.touchContent.style.transform = 'translate3d(' + (this.transX) + 'px, 0, 0)'
      }
    },
    touchend (e) {
    //   e.preventDefault()
      this.endX = e.changedTouches[0].clientX
      this.endY = e.changedTouches[0].clientY
      this.endT = new Date().getTime()
      let short = this.endT - this.startT
      if ((this.endX - this.startX > this.touchChildW / 2 || (this.endX - this.startX > 10 && (this.endX - this.startX) / short > 0.5)) && ((this.endY - this.startY < 40 && this.endY - this.startY > -40) || (this.transX))) {
        this.touchCurIndex--
        this.touchCurIndex < 0 && (this.touchCurIndex = 0)
      } else if ((this.startX - this.endX > this.touchChildW / 2 || (this.startX - this.endX > 10 && (this.startX - this.endX) / short > 0.5)) && ((this.endY - this.startY < 40 && this.endY - this.startY > -40) || (this.transX))) {
        this.touchCurIndex++
        this.touchCurIndex > this.tabData.length - 1 && (this.touchCurIndex = this.tabData.length - 1)
      } else {
        this.$refs.touchContent.style.transform = 'translate3d(' + -this.touchCurIndex * this.touchChildW + 'px, 0, 0)'
      }
      this.transX = 0
    }
  }
}
</script>
