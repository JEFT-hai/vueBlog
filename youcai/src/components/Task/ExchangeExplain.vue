<template>
  <div class="exchangePage"
       @click="hiddleShow(false)">
    <div class="exchangeWrap">
      <p class="exchangeTitle">兑换说明</p>
      <div class="exchangeContent ">
        <div class="contentWrap">
           <p>1. 1000积分兑换1个月vip</p>
           <p>2. 在商城中兑换商品</p>
        </div>
        <div class="back borderT"
             @click.stop="hiddleShow(false)">我知道了</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
      hiddleShow (data) {
          this.$emit('handlePage', data)
      }
  }
}
</script>

<style lang="less" scoped>
   .exchangePage{
       width:100vw;
       height:100vh;
       background:rgba(0,0,0,.7);
       position:fixed;
       top:0;
       left:0;
       z-index:100;
       display:flex;
       justify-content: center;
       align-items: center;
       .exchangeWrap{
           width:80.27vw;
           height:74.81vw;
           background:white;
           border-radius: 4vw;
           font-size:0;
           padding:4vw 3vw 3vw 3vw;
           box-sizing: border-box;
           .exchangeTitle{
               font-size:3.9vw;
               font-weight: bold;
               text-align: center;
           }
           .exchangeContent{
               width:100%;
               height:62vw;
               font-size:4vw;
               color:rgb(145, 145, 145);
               .contentWrap{
                 height:48vw;
                 padding-top:3vw;
                 box-sizing: border-box;
                 p{
                   height:10vw;
                   line-height:10vw;
                 }
               }
               .back{
                   height:11.94vw;
                   color:rgb(21, 139, 209);
                   line-height:11.94vw;
                   font-size:5vw;
                   text-align: center;
                   margin-top:3vw;
               }
           }
           
       }
   }
</style>