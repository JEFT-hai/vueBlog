<template>
  <div class="topicItem"
       @click="go.nameAid('topicItemss', `${item.topicId}`)">
    <span :class="['hotCount',{noHot:index > 11}]">{{index + 1}}</span>
    <div class="topicContent">
      <span>{{item.Description && item.Description.length >= 1? item.Description : item.title}}</span>
      <span>{{format.formatNum(item.hotDegree)}}&nbsp;热度</span>
    </div>
    <div class="topicImg">
      <img :src="item.image"
           alt="">
    </div>
  </div>
</template>
<script>
export default {
    props: {
        item: {
            type: Object,
            default: null
        },
        index:{
            type: Number,
            default: 0
        }
    }
}
</script>
<style lang="less">
.topicItem{
  width: 100%;
  padding:4vw 3vw;
  box-sizing: border-box;
  display:flex;
  justify-content: space-between;
  display:flex;
  justify-content: space-between;
    .hotCount{
      display:inline-block;
      font-size:4.26vw;
      color:rgb(255, 39, 66);
      font-weight:bold;
      // padding-top:5vw;
    }
    .noHot{
        color:rgb(154, 154, 154);
    }
    .topicContent{
        width:53.7vw;
        span:nth-child(1) {
        display:block;
        font-size:4.26vw;
        color:#1a1a1a;
        font-weight:bold;
        }
        span:nth-child(2) {
        display:block;
        font-size:3.34vw;
        color:#999999;
        }
    }
    .topicImg{
        width:31.39vw;
        height:21.39vw;
        overflow:hidden;
        border-radius: 1vw;
        position:relative;
        img{
        width:31.39vw;
        height:auto;
        border-radius: 1vw;
        top:0;
        bottom:0;
        left:0;
        right:0;
        margin:auto;
        }
    }
}
  
</style>
