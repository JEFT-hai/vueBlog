<template>
  <div class="integerItemWrap">
    <scroll ref='scroll'
            class="integerScroll"
            :startY='0'>
      <span ref="integerItem"
            :id='"integerItem" + index'
            class="integerItem"
            v-for="(item,index) in 11"
            :key='index'>{{index >= 10 ? 0 : index}}</span>
    </scroll>
  </div>
</template>
<script>
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
export default {
  mixins:[scrollMixin],
  components:{
      scroll
  },
  props: {
    value: {
      type: Number,
      default: 9,
      required: true
    }
  },
  watch: {
    value:{
        immediate: true,
        handler: function (newV, oldV) {
            if (!oldV || oldV <= newV){
                this.scrollToNum(newV)
            } else {
                let nextTime = ((11 - oldV) / (11 + newV - oldV))*500
                this.scrollToNum(10, nextTime)
                setTimeout(()=>{
                    this.scrollToNum(0, 0)
                    this.scrollToNum(newV, 500 - nextTime)
                }, nextTime + 30)
            }
        }
    }
  },
  mounted(){
    this.$nextTick(()=>{
        setTimeout(()=>{
            this.$refs.scroll.disable()
        }, 30)
    })
  },
  methods: {
      scrollToNum(num, time){
        time = (time || time == 0) ? time : 500
        this.$nextTick(()=>{
            setTimeout(()=>{
                this.$refs.scroll.scrollToElement(this.$refs.integerItem[num], time, true, true)
            }, 30)
        })
      }
  }
}
</script>
<style lang="less" scoped>
  .integerItemWrap{
    .integerScroll{
        display: inline-block;
        text-align: center;
        width: 6.6vw;
        height: 8vw;
        line-height: 8vw;
        font-size: 5.5vw;
        color: #fff;
        background-color: #f77067;
        border-radius: 1px;
        overflow: hidden;
        .integerItem{
            display: inline-block;
            width: 100%;
            height: 100%;
        }
    }
    .integerInner{
        display: inline-block;
        text-align: center;
        width: 6.6vw;
        height: 8vw;
        line-height: 8vw;
        font-size: 5.5vw;
        color: #fff;
        background-color: #f77067;
        border-radius: 1px;
    }
  }
</style>
