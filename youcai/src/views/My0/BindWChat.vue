<template>
  <div class="bindWChatPage">
    <div class="afterBindWrap" v-if="user.wxOpenId">
      <span class="phone">
        <i class="iconWanwan iconWweixin activityNotice"></i>
      </span>
      <p >绑定的微信号:{{user.wxOpenId}}</p>
    </div>
    <div class="beforeBind" v-if="!user.wxOpenId">
        <span class="bindTitle">绑定微信号,发现更多同伴哦,赶快绑定微信号吧~</span>
        <div :class="[{gotoBind:isBegin},{grayB: !isBegin}]" @click="gotoBind">
            {{bindState}}
        </div>
    </div>
  </div>
 
</template>

<script>
import {mapState, mapMutations} from 'vuex'
export default {
  data () {
    return {
     isBegin: true,
     isLoading: false
    }
  },
  computed: {
    ...mapState(['user']),
    bindState () {
      return this.isBegin ? '去绑定' : '已绑定'
    }
  },
  methods: {
      ...mapMutations(['updateCallWXState']),
     gotoBind () {
        if (this.isLoading) {
            return
        }
        this.isLoading = true
        this.updateCallWXState(true)
        window.isInAndroid && window.WanAndroid.wxLogin()

      },
  }
}
</script>

<style lang="less" scoped>
 .bindWChatPage{
   width:100vw;
   .afterBindWrap{
       width:100%;
       .phone{
           display:inline-block;
           width:100vw;
           text-align: center;
           position:relative;
           .activityNotice{
               font-size:16vw;
               color:rgb(17, 172, 54);
           }
       }
       p{
         width:100vw;
         margin-top:10vw;
         text-align: center;
       }
   }
   .beforeBind{
    .bindTitle{
      display:inline-block;
      width:100vw;
      padding:1vw 4vw;
      box-sizing: border-box;
      color:rgb(199, 199, 199);
      background:rgb(250, 250, 250);
    }
    .gotoBind{
        width:67vw;
        height:10vw;
        border-radius: 6vw;
        background:rgb(255, 39, 66);
        color:white;
        margin:auto;
        margin-top:10vw;
        text-align: center;
        font-size:4vw;
        line-height:10vw;
      }
      .grayB{
        background: rgb(250, 250, 250);
        color:117, 117, 117;
      }

   }
 }
</style>