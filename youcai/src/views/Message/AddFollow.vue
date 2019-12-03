<template>
  <div class="addFollowPage">
    <ul class="addFollowUl">
      <NotFound :failTitle="failTitle"
                v-if="!followList.length"></NotFound>
      <li v-for="(item, index) in followList"
          :key="index">
        <OneAddFollow :item="item"></OneAddFollow>
      </li>
    </ul>
  </div>
</template>

<script>
import OneAddFollow from './components/oneAddFollow'
import {mapState,mapMutations,mapActions} from 'vuex'
import NotFound from '@/components/requestState/NotFound'
export default {
  data () {
      return {
          followList: '',
          failTitle: '还没有通知消息哦!',
      }
  },
  components: {
      OneAddFollow,
      NotFound
  },
    computed:{
      ...mapState({
          currentChannel: 'currentChannel',
      })
  },
  created() {
        this.setCurrentChannel({
            channelId: '1',
            channelType: 2,
            msg: [],
            set: {}
        })
        this.getMt({
            mt: 1
        }).then((res)=>{
          console.log(res, 'res')
            this.followList = res
        })
        this.upChannelMsgRead({
            channelId: '1'
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
  .addFollowPage{
      width:100vw;
      .addFollowUl{
        margin-top:2vw;
      }
  }  
</style>