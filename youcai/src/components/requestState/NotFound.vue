<template>
  <div class="noFoundWrap">
     <!-- <span class="tubiao">
       <i class="iconWanwan iconWico_meiyoushuju activityNotice"></i>
     </span> -->
     <div class="tubiao">
       <img src="../../assets/images/noFound.png" alt="">
     </div>
     <span class="title">{{failTitle}}</span>
  </div>
</template>

<script>
export default {
  props: {
    failTitle: {
      type: String
    }
  }
}
</script>

<style lang="less" scoped>
.noFoundWrap{
  width:100%;
  .tubiao{
    width:40vw;
    height:30vw;
    margin:auto;
    margin-top:15vw;
    text-align: center;
    overflow: hidden;
    img{
      width:100%;
      height:auto;
    }
  }
  .title{
    display:block;
    height:7vw;
    text-align:center;
    margin-top:5vw;
    letter-spacing: 0.3vw;
  }
}
</style>
