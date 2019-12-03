<template>
  <div class="flowerWrap wrapper"
       ref='wrapperLeft'>
    <ul class="flowerScroll"
        id="flowerS">
      <li v-for="(oneLi, index) in count"
          :key="index"
          class="oneLi option">{{oneLi}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
      return {
          count: [0,1,2,3,4,5,6,7,8,9],
          initM: {
            type: Number,
            default: 0
          },
      }
  },
  props: {
      countNumber: {
          type: Number,
          default: ''
      }
  },
  mounted() {
     let p = this.initPicker()
     p.then(()=>{
         let child = document.getElementById('flowerS')
         let allChild = child.childNodes
         this.scrollLeft.scrollToElement(allChild[this.countNumber], 1000,)
     })
  },
  methods: {
        initPicker() {
        return new Promise((resolve)=>{
            this.$nextTick(() => {
                    this.scrollLeft = new window.BScroll(this.$refs.wrapperLeft, {
                        scrollY: true,
                    })
                    if (this.countNumber === 0) {
                      this.scrollLeft.disable()
                    }
                    this.scrollLeft.on('scrollEnd', () => {
                        this.scrollLeft.disable()
                    })
            })
            resolve()
        })
    }
  }
}
</script>

<style lang="less" scoped>
.flowerWrap{
    height:7.78vw;
    width:6.75vw;
    overflow:hidden;
    margin-right:1vw;
    .flowerScroll{
        height:80vw;
        width:6.75vw;
      .oneLi{
          display:inline-block;
          width:6.75vw;
          height:7.78vw;
          background:rgba(255,255,255,.5);
          color:white;
          font-size:4.9vw;
          text-align: center;
          line-height:7.78vw;
          margin-right:1vw;
      }
    }
}
</style>
