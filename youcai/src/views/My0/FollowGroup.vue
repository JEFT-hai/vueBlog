<template>
  <div class="groupListPage">
    <!-- <div class="noData" v-if="isFail">
          <NotFound :failTitle="failTitleBoth" ></NotFound>
      </div> -->
    <div class="groupListWrap">
      <scroll ref="scroll"
              :data="joinGroupList"
              :scrollbar="scrollbarObj"
              :pullDownRefresh="pullDownRefreshObj"
              :pullUpLoad="pullUpLoadObj"
              :startY="parseInt(startY)"
              @pullingDown="onPullingDown"
              @pullingUp="onPullingUp">
        <div class="myGroups">
          <div class="noData"
               v-if="isFailOne && isFailTwo">
            <NotFound :failTitle="failTitleBoth"></NotFound>
          </div>
          <div class="myCreateGroup"
               v-if="createGroupList.length">
            <p class="groupTitle">{{routerType === 1 ? '我创建的群组': '他创建的群组'}}</p>
            <ul id="groupUl">
              <group-item v-for="(item, index) in createGroupList"
                          @click.native="goGroup(item)"
                          :key='index'
                          :item='item'></group-item>
            </ul>
          </div>
          <div class="myJoinGroup"
               v-if="joinGroupList.length">
            <p class="groupTitle">{{routerType === 1 ? '我加入的群组' : '他加入的群组'}}</p>
            <ul id="groupUl">
              <group-item v-for="(item, index) in joinGroupList"
                          @click.native="goGroup(item)"
                          :key='index'
                          :item='item'></group-item>
            </ul>
          </div>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
import groupItem from '@/components/List/groupItem'
import NotFound from '@/components/requestState/NotFound'
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
import {mapState} from 'vuex'
export default {
  mixins: [scrollMixin],
  components: {
    scroll,
    NotFound,
    groupItem
  },
  computed: {
    ...mapState(['pos'])
  },
  data () {
    return {
      routerId: this.$route.params.id, // 表示用户id
      routerType: parseInt(this.$route.params.routerType), // 1表示我的主页，2表示他人的主页
      isLoad: true, // 是否正在加载
      isFailOne: false,
      isFailTwo: false,
      failTitleBoth: '没有任何群组哦!',
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
      if (me.routerType === 1) { // 表示我的页面
        url = 'UserGroupList?PageIndex=1&PageSize=50&GroupType=1'
      } else {
        url = `UserGroupList?PageIndex=1&PageSize=50&GroupType=1&UserId=${me.routerId}`
      }
      if (me.pos.longitude && me.pos.latitude) {
        url = `${url}&Lon=${me.pos.longitude}&Lat=${me.pos.latitude}`
      }
      me.api.get({
        url: url,
        success: function (res) {
          me.createGroupList.length && (me.isFail = false)
          me.createGroupList = res
          if (me.createGroupList.length <= 0) {
            me.isFailOne = true
          }
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
      
      if (me.routerType === 1) { // 表示我的页面
        url = `UserGroupList?PageIndex=${me.curPage}&PageSize=${me.pageSize}&GroupType=2`
      } else {
        url = `UserGroupList?PageIndex=${me.curPage}&PageSize=${me.pageSize}&GroupType=2&UserId=${me.routerId}`
      }
      if (me.pos.longitude && me.pos.latitude) {
        url = `${url}&Lon=${me.pos.longitude}&Lat=${me.pos.latitude}`
      }
      me.api.get({
        url: url,
        success: function (res) {
          me.curPage === 1 && (me.joinGroupList = [])
          me.joinGroupList = me.joinGroupList.concat(res)
          me.joinGroupList.length && (me.isFail = false)
          if (me.joinGroupList.length <= 0) {
            me.isFailTwo = true
          }
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
        // window.goDialog('group', item.userGroupId, item.groupName)
          this.go.nameAParams('chatRoom', {
            id:item.userGroupId,
            type:1,
            share: false,
            name: item.groupName
        })
      } else {
        this.$router.push({ name: 'groupInfo', params: { id: item.userGroupId} })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.groupListWrap {
    height:calc(100vh - 25vw);
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
.followGroupWrap{
    width:100%;
    height:100%;
    .groupHead{
        width:100%;
        height:75.46vw;
        background-color:rgb(250, 250, 250);
        padding-left:4vw;
        padding-top:7.8vw;
        box-sizing: border-box;
        .headTitle{
            font-size:4vw;
            color:#333333;
        }
        .headContent{
            width:100%;
            height:60vw;
            padding-top:2vw;
            box-sizing: border-box;
        }
    }
    .grounpJoin{
        width:100%;
        .joinTitle{
            height:13.52vw;
            line-height:13.52vw;
            font-size:4vw;
            color:#333333;
            padding-left:4vw;
        }
        .split{
            width:100%;
            height:3.7vw;
            background-color:rgb(249, 249, 249);
        }
        .commonMain{
            padding-left:4vw;
            box-sizing: border-box;
        }
    }
}
</style>
