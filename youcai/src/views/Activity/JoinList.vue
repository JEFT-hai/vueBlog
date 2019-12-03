<template>
  <div class="bigPeople">
    <div v-if="isLoad">
      <Loading></Loading>
    </div>
    <div class="peopleList"
         v-if="!isLoad">
      <div class="popleWrap">
        <scroll ref="scroll"
                :data="peopleList"
                :scrollbar="scrollbarObj"
                :pullDownRefresh="pullDownRefreshObj"
                :pullUpLoad="pullUpLoadObj"
                :startY="parseInt(startY)"
                @pullingDown="onPullingDown"
                @pullingUp="onPullingUp">
          <ul>
            <UserMessage v-for="(onePeople,index) in peopleList"
                         :userMessage="onePeople"
                         :key="index"
                         :isShowFansCount="isShowFansCount"></UserMessage>
          </ul>
          <div class="no_data">
            <NotFound :failTitle="failTitle"
                      v-if="isFail"></NotFound>
          </div>
        </scroll>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from '@/components/requestState/Loading'
import NotFound from '@/components/requestState/NotFound'
import UserMessage from '@/components/userMessage'
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
export default {
  mixins: [scrollMixin],
  data () {
    return {
      activityId: this.$route.params.id,
      isShowFansCount: false, // 是否显示粉丝数
      isLoad: true,
      isFail: false,
      failTitle: '还没有人报名哦',
      formLoading: false,
      peopleList: [], // 参加人员列表
      userBirth: '',
      defaultAvatar: 'http://webapp.szwanwan.com/img/default/defaultavatar.png',
      pullDownRefresh: true,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: true,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更多数据了',
      isLoading: true,
      curPage: 1,
      pageSize: 7
      
    }
  },
  components: {
    scroll,
    Loading,
    NotFound,
    UserMessage
  },
  mounted () {
    this.getJoinList()
  },
  methods: {
    handleJoin () {
      this.$emit('hiddleJoinList')
    },
    /**
     * getJoinList 得到报名人的列表
     */
    getJoinList () {
      let me = this
      let ActivityId = me.activityId
      me.api.get({
        url: `ActivityParticipate/ActivityId?ActivityId=${ActivityId}&PageIndex=${me.curPage}&PageSize=${me.pageSize}`,
        success: function (res) {
          me.curPage === 1 && (me.peopleList = [])
          me.peopleList = me.peopleList.concat(res)
          if (me.peopleList.length > 0) {
            me.isLoad = false
            me.isFail = false
          } else if (me.peopleList.length === 0) {
            me.isLoad = false
            me.isFail = true
          }
        },
        error: function (res) {
          me.$msg.showError(res.msg)
          me.$refs.scroll && me.$refs.scroll.forceUpdate()
        },
        complete: function () {
          me.$refs.scroll && me.$refs.scroll.forceUpdate()
          // me.isLoading = false
        }
      })
    },
    onPullingDown () {
      this.curPage = 1
      this.getJoinList()
    },
    onPullingUp () {
      // 更新数据
      this.curPage++
      this.getJoinList()
    }
  }
}
</script>

<style lang="less" scoped>
.bigPeople{
  .peopleList{
      .peopleTitle{
        width: 100%;
        height: 12vw;
        position: relative;
        display:flex;
        justify-content: center;
        align-items: center;
        span:nth-child(1) {
          display:inline-block;
          font-size: 4.16vw;
          color: #666;
        }
        span:nth-child(2) {
            display:inline-block;
            height:12vw;
            line-height:12vw;
            color:var(--lGray);
            font-size:var(--title);
            position:absolute;
            top:0;
            left:7.5vw;
            bottom:0;
            .activityNotice{
              font-size:4.63vw;
              font-weight: bold;
            }
        }
      }
      .popleWrap{
          width:100%;
          height:calc(100vh - 12vw);
          overflow: hiddle;
      }
   }
}
</style>
