<template>
  <div class="favoratePage">
    <ul class="foaorateUl">
      <NotFound :failTitle="failTitle"
                v-if="!likeList.length"></NotFound>
      <li v-for="(item, index) in likeList"
          :key="index">
        <OneLike :item="item"></OneLike>
      </li>
    </ul>
  </div>
</template>

<script>
import OneLike from './components/oneLike'
import {mapState,mapMutations,mapActions} from 'vuex'
import NotFound from '@/components/requestState/NotFound'
export default {
  data () {
      return {
          user: {
            avatar: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1569302637115&di=1d7d057eea308925d0a0560a856addfc&imgtype=0&src=http%3A%2F%2F00imgmini.eastday.com%2Fmobile%2F20190209%2F20190209090349_eb26f54e98f2ba0e903498f22a72975b_5.jpeg'
          },
          likeList: '',
          failTitle: '还没有点赞信息哦!',
      }
  },
  components: {
      OneLike,
      NotFound
  },
  computed:{
      ...mapState({
          currentChannel: 'currentChannel',
      })
  },
  created() {
        this.setCurrentChannel({
            channelId: '0',
            channelType: 2,
            msg: [],
            set: {}
        })
        this.getMt({
            mt: 0
        }).then((res)=>{
            this.likeList = res
        })
        this.upChannelMsgRead({
            channelId: '0'
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
   .favoratePage{
     width:100vw;
     .foaorateUl{
        width:100%;
        
     }
   } 
</style>
