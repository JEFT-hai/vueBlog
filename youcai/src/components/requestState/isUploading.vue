<template>
  <div class="loadingWrap">
    <div class='loadingInner'>
      <img src="./loading.gif" alt="" class="loadImg">
      <p class="loadDes">loading</p>
    </div>
    <div class='successInner'>
      <img src="./loading.gif" alt="" class="loadImg">
      <p class="loadDes">loading</p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    show (newV, oldV) {
      if (oldV && !newV) {
        
      }
    }  
  }
}
</script>

<style lang="less" scoped>
.loadingWrap{
  position: absolute;
  width:100%;
  height:100%;
  z-index: 10000;
  .loadingInner{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 20%;
    left: 0;
    text-align: center;
  }
  .loadImg{
    display: inline-block;
    width: 14vw;
    height: 14vw;
    margin-bottom: 3vw;
    // background: rgba(0, 0, 0, 0.6);
  }
  .loadDes{
    font-size: 4.4vw;
    color:rgb(127,127,127);
    letter-spacing: 2px;
  }
}
</style>
