<template>
    <div class="myActivityList">
        <div v-if="isLoad">
            <Loading></Loading>
        </div>
        <div class="no_data" v-if="myCreated.length <= 0 && myJoined.length <= 0">
            <NotFound :failTitle="failTitle"></NotFound>
        </div>
        <div class="activityListWrap" v-else>
          <scroll ref="scroll"
                  :data="myJoined"
                  :scrollbar="scrollbarObj"
                  :pullDownRefresh="pullDownRefreshObj"
                  :pullUpLoad="pullUpLoadObj"
                  :startY="parseInt(startY)"
                  @pullingDown="onPullingDown"
                  @pullingUp="onPullingUp"
          >
            <div class="joinedList">
                <div class="split"></div>
                <div class="joinTitle">我创建的活动</div>
                <ul class="createWrap" v-if="myCreated.length > 0">
                    <ActivityItem v-for="(item,index) in myCreated" :key="index" :item="item" :isMyCreate="isMyCreate"></ActivityItem>
                </ul>
                <div class="no_data" v-if="isFailCreate">
                    <NotFound :failTitle="failTitleCreate"></NotFound>
                </div>
            </div>
            <div class="followList">
                <div class="split"></div>
                <div class="joinTitle">我报名的活动</div>
                <ul class="joinWrap" v-if="myJoined.length > 0">
                    <ActivityItem v-for="(item,index) in myJoined" :key="index" :item="item"></ActivityItem>
                </ul>
                <div class="no_data" v-if="isFailJoin">
                    <NotFound :failTitle="failTitleJoin"></NotFound>
                </div>
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
      isMyCreate: 1, // 1表示是我创建的活动, 2表示不是我创建的活动
      isLoad: true,
      failTitle: '还没有活动哦',
      isFailCreate: false,
      failTitleCreate: '还没有创建的活动哦!',
      isFailJoin: false,
      failTitleJoin: '还没有报名的活动哦!',
      myJoined: [], // 我加入的活动信息
      myCreated: [], // 我创建的活动,
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
  mounted () {
    this.getJoinList()
    this.getCreateList()
  },
  methods: {
    /**
     * getCreateList 得到我创建的活动列表
     */
    getCreateList () {
      let me = this
      me.api.get({
        url: `Activity/id?PageIndex=${1}&PageSize=${100}`,
        success: function (res) {
          me.myCreated = res
          if (me.myCreated.length > 0) {
            me.isLoad = false
            me.isFailCreate = false
          } else if (me.myJoined.length === 0) {
            me.isLoad = false
            me.isFailCreate = true
          }
        },
        complete: function () {
          me.isLoad = false
        }
      })
    },
    /**
     * getJoinList 得到加入的活动列表
     */
    getJoinList () {
      var me = this
      me.api.get({
        url: `ActivityParticipate?PageIndex=${me.curPage}&PageSize=${me.pageSize}`,
        success: function (res) {
          me.curPage === 1 && (me.myJoined = [])
          me.myJoined = me.myJoined.concat(res)
          if (me.myJoined.length > 0) {
            me.isLoad = false
            me.isFailJoin = false
          } else if (me.myJoined.length === 0) {
            me.isLoad = false
            me.isFailJoin = true
          }
        },
        error: function (res) {
          me.$msg.showError(res.msg)
          me.$refs.scroll && me.$refs.scroll.forceUpdate()
          me.isLoad = false
        },
        complete: function () {
          me.$refs.scroll && me.$refs.scroll.forceUpdate()
          me.isLoad = false
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
 .myActivityList{
     padding-top:2vw;
     box-sizing: border-box;
     .activityListWrap{
       height:calc(100vh - 15vw);
       overflow: hidden;
        .joinedList{
        .split{
            width: 100%;
            height: 4vw;
            background-color: var(--mBg);
        }
        .joinTitle{
            padding-left: 4vw;
            box-sizing: border-box;
            width: 100%;
            height: 13.43vw;
            line-height: 13.43vw;
            font-size: 4vw;
            color: #333333;
        }
        padding-bottom:7vw;
        box-sizing: border-box;
      }
     .followList{
       .split{
            width: 100%;
            height: 4vw;
            background-color: var(--mBg);
         }
        .joinTitle{
            padding-left: 4vw;
            box-sizing: border-box;
            width: 100%;
            height: 13.43vw;
            line-height: 13.43vw;
            font-size: 4vw;
            color: #333333;
        }
      }
    }
 }
</style>
