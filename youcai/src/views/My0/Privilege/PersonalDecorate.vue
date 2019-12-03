<template>
  <div class="personalDecoratePage">
    <div class="personalHead">
        <span class="headFont"></span>
        <span class="headTitle">个性化装扮,打造出不一样的你</span>
    </div>
    <div class="personalMain">
        <div class="mainBar">
            <span>头像挂件</span>
            <span>昵称特效</span>
        </div>
        <div class="oneContent">
            <p>一、头像挂件</p>
            <span class="contentTitle">VIP用户尊享头像挂件装扮特权，精美头像挂件任意挑选，彰显个性，你就是与众不同! </span>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    
}
</script>

<style lang="less" scoped>
   .personalDecoratePage{
      .personalHead{
          width:100vw;
          height:39.25vw;
          background:pink;
          span{
              display:inline-block;
              width:100vhw;
          }
          .headTitle{
              text-align: center;
              color:rgb(232, 213, 172);
              font-size:4.7vw;
          }
      }
      .personalMain{
          padding-top:4.53vw;
          box-sizing: border-box;
        .mainBar{
          margin:auto;
          width:91.57vw;
          border:1px solid rgb(238, 239, 236);
          display:flex;
          justify-content:space-between;
          span{
              display:inline-block;
              flex:1;
              text-align: center;
              font-size:4.44vw;
              height:11.48vw;
              line-height:11.48vw;
              background:lightblue;
          }
          span:first-child{
              border-right:1px solid rgb(238, 239, 236);
          }
        }
        .oneContent{
            padding:5.4vw 4vw 0 4vw;
            box-sizing: border-box;
            font-size:0;
            p{
                font-size:5vw;
                margin-bottom:4.44vw;
            }
            .contentTitle{
                font-size:4vw;
                color:#828380;
            }
        }
      }
   }
</style>