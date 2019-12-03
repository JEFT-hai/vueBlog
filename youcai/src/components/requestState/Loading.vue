<template>
  <div class="loadWrap">
    <img src="./loading.gif" alt="" class="loadImg">
    <p class="loadDes">loading</p>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="less" scoped>
.loadWrap{
  width:30vw;
  height:30vw;
  margin:auto;
  text-align: center;
  margin-top:7vw;
  .loadImg{
    width:8vw;
    height: 8vw;
    margin:auto;
  }
  .loadDes{
    font-size:4vw;
    color:rgb(127,127,127);
    margin:auto;
    letter-spacing:0.3vw;
  }

}
</style>
