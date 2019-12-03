<template>
  <div class="chatDiscuzPage">
    <NotFound :failTitle="failTitle"
              v-if="!discuzList.length"></NotFound>
    <ChatDiscuzItem v-for="(item, index) in discuzList"
                    :key="index"
                    :item="item"></ChatDiscuzItem>
  </div>
</template>

<script>
import ChatDiscuzItem from '@/views/Message/components/ChatDiscuzItem'
import {mapState,mapMutations,mapActions} from 'vuex'
import NotFound from '@/components/requestState/NotFound'
export default {
  data () {
    return {
      discuzList: '',
      failTitle: '还没有评论消息哦!',
    }
  },
  components: {
    ChatDiscuzItem,
    NotFound
  },
    computed:{
      ...mapState({
          currentChannel: 'currentChannel',
      })
  },
  created() {
        this.setCurrentChannel({
            channelId: '2',
            channelType: 2,
            msg: [],
            set: {}
        })
        this.getMt({
            mt: 2
        }).then((res)=>{
            this.discuzList = res
        })
        this.upChannelMsgRead({
            channelId: '2'
        })
  },
  beforeRouteLeave(to, from, next){
        this.leaveCurrentChannel()
        next()
  },
  watch: {
      currentChannel:{
        deep: true,
        handler: function(newV){
            console.log('currentChannel', newV)
        }
      }
  },
  methods:{
      ...mapMutations('ws', {
        setCurrentChannel: 'setCurrentChannel'
      }),
      ...mapActions('ws', {
        getMt: 'getMt',
        leaveCurrentChannel: 'leaveCurrentChannel',
        upChannelMsgRead: 'upChannelMsgRead'
      })
  }
}
</script>

<style lang="less" scoped>
  .chatDiscuzPage{
    width:100vw;
  }
</style>

