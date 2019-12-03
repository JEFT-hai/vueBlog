<template>
  <div class="messageNotice">
    <div class="head">
      <span>消息提醒</span>
    </div>
    <ul>
      <li @click="selectLi(1)">
        <div class="title">
          <span>开启</span>
          <span>正常接受本群消息通知提醒</span>
        </div>
        <span v-show="index === 1">
          <i class="iconWanwan iconWgou activityNotice"></i>
        </span>
      </li>
      <li @click="selectLi(2)">
        <div class="title">
          <span>免打扰</span>
          <span>正常接受本群消息通知, 但不会有声音和震动提醒</span>
        </div>
        <span v-show="index === 2">
          <i class="iconWanwan iconWgou activityNotice"></i>
        </span>
      </li>
      <li @click="selectLi(3)">
        <div class="title">
          <span>屏蔽</span>
          <span>接受本群消息通知, 但没有推送提醒</span>
        </div>
        <span v-show="index === 3">
          <i class="iconWanwan iconWgou activityNotice"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
   data () {
       return {
           index: 1
       }
   },
   methods: {
     selectLi (index) {
         this.index = index
     }
   }
}
</script>

<style lang="less" scoped>
   .messageNotice{
     width:100%;
     height:100%;
      .head{
           position:fixed;
           top:0;
           left:14vw;
           height:12vw;
           line-height:13vw;
           width:85%;
           display:flex;
           justify-content: space-between;
           z-index:1000;
           font-size:4.5vw;
       }
       ul{
           width:100%;
           li{
               padding:4vw;
               box-sizing: border-box;
               width:100%;
               height:24vw;
               display:flex;
               justify-content: space-between;
               align-items: center;
               .title{
                  height:100%;
                  span:nth-child(1) {
                      color:#252525;
                      font-size: 4.44vw;
                      display:inline-block;
                      width:100%;
                  }
                  span:nth-child(2) {
                      font-size:3.4vw;
                      color:#959595;
                  }
               }
               .activityNotice{
                 color:#189cfe;
               }
           }
       }
   } 
</style>