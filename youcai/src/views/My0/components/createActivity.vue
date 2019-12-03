<template>
<div class="joinActivityWrap" id="userJoined">
  <div v-if="isLoad">
    <Loading></Loading>
  </div>
  <div class="activityBig">
    <scroll ref="scroll"
                  :data="myJoined"
                  :scrollbar="scrollbarObj"
                  :pullDownRefresh="pullDownRefreshObj"
                  :pullUpLoad="pullUpLoadObj"
                  :startY="parseInt(startY)"
                  @pullingDown="onPullingDown"
                  @pullingUp="onPullingUp"
          >
        <ul v-if="!isLoad">
          <ActivityItem v-for="(item,index) in myJoined" :key="index" :item="item"></ActivityItem>
        </ul>
        <div class="no_data" v-if="isFail">
            <NotFound :failTitle="failTitle"></NotFound>
        </div>
    </scroll>
  </div>
</div>
</template>

<script>
import Loading from '@/components/requestState/Loading'
import NotFound from '@/components/requestState/NotFound'
import ActivityItem from '@/components/activityItem'
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
export default {
  mixins: [scrollMixin],
  data () {
    return {
      userId: this.$route.params.id,
      myJoined: [],
      isLoad: true,
      isFail: false,
      failTitle: '还没有关注的活动哦',
      formLoading: false,
      pullDownRefresh: false, // 下拉刷新
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: true,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更多数据了',
      isLoading: true,
      items: [],
      curPage: 1,
      pageSize: 7
    }
  },
  components: {
    Loading,
    NotFound,
    ActivityItem,
    scroll
  },
  props: ['routerType'],
  mounted () {
    this.getFollowActivity()
  },
  methods: {
    /**
     * getFollowActivity 获得关注的活动列表
     */
    getFollowActivity () {
      var me = this
      let activityUrl = ''
      let UserId = me.userId
      if (this.routerType === 1) {
        activityUrl = `Activity/id?PageIndex=${me.curPage}&PageSize=${me.pageSize}`
      } else {
        activityUrl = `Activity/id?UserId=${UserId}&PageIndex=${me.curPage}&PageSize=${me.pageSize}`
      }
      me.api.get({
        url: activityUrl,
        success: function (res) {
          me.curPage === 1 && (me.myJoined = [])
          me.myJoined = me.myJoined.concat(res)
          if (me.myJoined.length > 0) {
            me.isLoad = false
            me.isFail = false
          } else if (me.myJoined.length === 0) {
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
        }
      })
    },
    onPullingDown () {
      this.curPage = 1
      this.getFollowActivity()
    },
    onPullingUp () {
      // 更新数据
      this.curPage++
      this.getFollowActivity()
    }
  }
}
</script>

<style lang="less" scoped>
  .activityBig{
    height:calc(100vh - 25vw);
    overflow: hidden;
    .no_data{
      padding-top:5vw;
      box-sizing: border-box;
    }
  }
</style>
