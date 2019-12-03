<template>
  <div class="tabList">
    <span ref="tabItem" v-for="(item,index) in tabData" :key="index" :class="curTab===index?'curTab':''" @click="tab(index)">{{item}}</span>
    <i class="tabBottom" :style="{transform: 'translate3d(' + curLeft + ', 0, 0)'}"></i>
  </div>
</template>
<script>
export default {
  props: {
    tabData: {
      type: Array,
      default: null
    },
    currentTab: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      curTab: this.currentTab,
      curLeft: '0'
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.caculateLeft()
    })
  },
  watch: {
    curTab () {
      this.caculateLeft()
    }
  },
  methods: {
    tab (index) {
      this.curTab = index
      this.$emit('scroll', index)
    },
    caculateLeft () {
      this.$refs.tabItem[0] && (this.curLeft = this.$refs.tabItem[this.curTab].offsetLeft + this.$refs.tabItem[this.curTab].offsetWidth / 2 + 'px')
    }
  }
}
</script>
<style lang="less" scoped>
    .tabList{
        flex: 1;
        font-size: 0;
        text-align: center;
        position:relative;
        justify-content: center;
        span{
          display:inline-block;
          width: 16vw;
          text-align: center;
          font-size: var(--mTitle);
        }
        .curTab{
          // font-weight: bold;
          // color: var(--mRed);
          font-size: var(--mTitle);
          transition: all 0.2s ease;
        }
        .tabBottom{
          position: absolute;
          left: 0;
          bottom: 1.2vw;
          width: 7.6vw;
          height: 0.5vw;
          margin-left: -3.8vw;
          background: var(--mRed);
          transition: all 0.25s ease-in-out;
        }
    }
</style>
