<template>
  <div class="groupListPage">
      <div class="load" v-if="isLoad">
        <Loading></Loading>
      </div>
      <div class="noData" v-if="createGroupList.length <= 0 && joinGroupList.length <= 0">
          <NotFound :failTitle="failTitleBoth" ></NotFound>
      </div>
      <div class="groupListWrap" v-else>
        <scroll ref="scroll"
            :data="joinGroupList"
            :scrollbar="scrollbarObj"
            :pullDownRefresh="pullDownRefreshObj"
            :pullUpLoad="pullUpLoadObj"
            :startY="parseInt(startY)"
            @pullingDown="onPullingDown"
            @pullingUp="onPullingUp"
          >
          <div class="myGroups">
            <div class="myCreateGroup">
                <p class="groupTitle">我创建的群组</p>
                <ul id="groupUl" v-show="!isLoad">
                  <group-item v-for="(item, index) in createGroupList" @click.native="goGroup(item)" :key='index' :item='item'></group-item>
                </ul>
                <div class="noData" v-if="createGroupList.length <= 0">
                  <NotFound :failTitle="failTitleOne" ></NotFound>
                </div>
            </div>
            <div class="myJoinGroup">
                <p class="groupTitle">我加入的群组</p>
                <ul id="groupUl" v-show="!isLoad">
                  <group-item v-for="(item, index) in joinGroupList" @click.native="goGroup(item)" :key='index' :item='item'></group-item>
                </ul>
                <div class="noData" v-if="joinGroupList.length <= 0">
                  <NotFound :failTitle="failTitleTwo" ></NotFound>
                </div>
            </div>
          </div>
        </scroll>
      </div>
    </div>
</template>

<script>
// import groupList from '@/components/RecommendFollow/GroupList'
import groupItem from '@/components/List/groupItem'
// import RecommendGroupList from '@/components/RecommendFollow/recommendGroupList'
import Loading from '@/components/requestState/Loading'
import NotFound from '@/components/requestState/NotFound'
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
import {mapState} from 'vuex'
export default {
  mixins: [scrollMixin],
  components: {
    scroll,
    // userMessage,
    Loading,
    NotFound,
    // groupList,
    groupItem
  },
  props: {

  },
  computed: {
    ...mapState(['pos'])
  },
  data () {
    return {
      routerId: this.$route.params.id, // 表示用户id
      routerType: parseInt(this.$route.params.routerType), // 1表示我的主页，2表示他人的主页
      isLoad: true, // 是否正在加载
      isFail: false, // 是否加载失败
      failTitleBoth: '没有任何群组哦!',
      failTitleOne: '还没有创建的群组哦!',
      failTitleTwo: '还没有加入的群组哦!',
      pullDownRefresh: false, // 表示是否上拉刷新
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: true,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更多数据了',
      isLoading: true,
      joinGroupList: [],
      curPage: 1,
      pageSize: 7,
      createGroupList: [] // 我创建的群组
    }
  },
  mounted () {
    this.getGroupList()
    this.getCreateGropList()
  },
  methods: {
    /**
     * getCreateGropList得到我创建的群组列表
     */
    getCreateGropList () {
      let me = this
      let url = ''
      url = 'UserGroupList?PageIndex=1&PageSize=50&GroupType=1'
      if (me.pos.longitude && me.pos.latitude) {
        url = `${url}&Lon=${me.pos.longitude}&Lat=${me.pos.latitude}`
      }
      me.api.get({
        url: url,
        success: function (res) {
          me.createGroupList.length && (me.isFail = false)
          me.createGroupList = res
        },
        complete: function () {
          me.isLoad = false
        }
      })
    },
    /**
     * getGroupList获取我加入的群列表
     */
    getGroupList () {
      let me = this
      let url = ''
      url = `UserGroupList?PageIndex=${me.curPage}&PageSize=${me.pageSize}&GroupType=2`
      if (me.pos.longitude && me.pos.latitude) {
        url = `${url}&Lon=${me.pos.longitude}&Lat=${me.pos.latitude}`
      }
      me.api.get({
        url: url,
        success: function (res) {
          me.curPage === 1 && (me.joinGroupList = [])
          me.joinGroupList = me.joinGroupList.concat(res)
          me.joinGroupList.length && (me.isFail = false)
        },
        complete: function () {
          me.isLoad = false
          me.$refs.scroll && me.$refs.scroll.forceUpdate()
        }
      })
    },
    onPullingUp () {
      this.curPage++
      this.getGroupList()
    },
    onPullingDown () {
      this.curPage = 1
      this.getGroupList()
    },
    goGroup (item) {
      if (this.routerType === 1) {
        window.goDialog('group', item.userGroupId, item.groupName)
      } else {
        this.$router.push({ name: 'groupInfo', params: { id: item.userGroupId} })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.groupListPage{
    width:100%;
    .groupListWrap{
        height:calc(100vh - 12vw);
        overflow: hidden;
        .groupTitle{
            width:100%;
            height:7vw;
            padding:0 4vw;
            box-sizing: border-box;
            margin-bottom:4vw;
            margin-top:5vw;
        }
    }
}
</style>
