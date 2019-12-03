<template>
  <div class="deleteChatPage"
       @click="cancleDelete">
    <div class="deleteTool"
         ref="deleteTool">
      <div class="toolOne"
           ref="toolBoxOne">
        <span @click.stop="btnTop">{{this.messagePage.top === 1 ? '取消置顶' : '置顶聊天'}}</span>
        <span @click.stop="btnDelete">删除聊天</span>
      </div>
      <div class="toolTwo"
           ref="toolBoxTwo"></div>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex'
export default {
  computed: {
    ...mapState(['messagePage']),
    currentHeight () {
      return this.messagePage.height - this.messagePage.scrollHeight - this.$refs.toolBoxOne.offsetHeight
    }
  },
  mounted () {
    let deleteTool = this.$refs.deleteTool
    deleteTool.style.top = this.currentHeight + 'px'
  },
  methods: {
    ...mapMutations(['updateMessagePage']),
    ...mapActions('ws',{
      setChannelTop: 'setChannelTop',
      upChannelMsgUnRead: 'upChannelMsgUnRead',
      delChannelItem: 'delChannelItem',
    }),
    cancleDelete () {
      let obj = {
          isLongClick: false,
          chatId: '',
          height:0,
          top: null
      }
      this.updateMessagePage(obj)
    },
    btnTop () {
      let channel = {
        channelId: this.messagePage.chatId
      }
      let top = this.messagePage.top === 1 ? 0 : 1
      let obj = {
        channelId: channel.channelId,
        top
      }
      let p = this.setChannelTop(obj)
      p.then(()=>{
        this.cancleDelete()
      }).catch((error)=>{
        console.log('设置置顶失败', error)
      })
    },
    btnDelete () {
      let obj = {
        channelId: this.messagePage.chatId
      }
      let p = this.delChannelItem(obj)
      p.then(()=>{
        this.cancleDelete()
      }).catch((error)=>{
        console.log('删除失败', error)
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .deleteChatPage{
      width:100vw;
      height:100vh;
      position:fixed;
      top:0;
      left:0;
      z-index:20000;
      display:flex;
      justify-content: center;
      .deleteTool{
          width:35.64vw;
          position:relative;
          top:0;
          display:block;
          .toolOne{
            width:35.64vw;
            height:12.03vw;
            border-radius: 2vw;
            background:black;
            display:flex;
            justify-content: space-between;
            color:white;
            span{
                display:inline-block;
                width:17.82vw;
                height:12.03vw;
                line-height:12.03vw;
                text-align: center;
                font-size:3.5vw;
            }
            span:nth-child(1) {
              border-right:1px solid #ccc;
            }
          }
          .toolTwo{
            width:0;
            height:0;
            border-left:4vw solid transparent;
            border-right:4vw solid transparent;
            border-top:4vw solid black;
            bottom:0;
            right:0;
            left:0;
            margin:0 auto;
          }
      }
  }  
</style>