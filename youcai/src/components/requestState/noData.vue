<template>
  <div class="noDataWrap">
    <div class="noDataInner">
        <i :class="iconClass + ' iconWanwan'"></i>
    </div>
    <p class="title">{{failTitle}}</p>
  </div>
</template>

<script>
export default {
  props: {
    failTitle: {
      type: String,
      default: '没有找到数据'
    },
    iconClass: {
      type: String,
      default: 'iconWico_meiyoushuju'
    }
  }
}
</script>

<style lang="less" scoped>
.noDataWrap{
  position: absolute;
  top: 0;
  left:0;
  bottom: 0;
  right: 0;
  background: transparent;
  text-align: center;
  .title{
    position: absolute;
    width: 100%;
    height: 12vw;
    line-height: 12vw;
    letter-spacing: 1px;
    font-size: 4.5vw;
    top: 40%;
    left: 0;
    color: var(--lGray);
}
  .noDataInner{
    position: absolute;
    height: 40%;
    width: 100%;
    top: 0;
    left: 0;
    .iconWanwan{
      position: absolute;
      width: 26vw;
      height: 26vw;
      font-size: 20vw;
      top: 65%;
      left: 50%;
      margin-left: -13vw;
      margin-top: -13vw;
      color: var(--lGray);
    }
  }
}
</style>
