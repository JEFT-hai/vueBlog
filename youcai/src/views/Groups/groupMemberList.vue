<template>
  <div class="groupMemberListPage">
    <!-- <span class="operateDetail" v-if="isGroupLeader || userRole === 1">点击成员右下角操作图标,进行管理</span> -->
    <ForbidWord v-show="isSelectTime"
                :item="oneItem"></ForbidWord>
    <MaskList v-if="showMask"
              :distance="distance"
              :showMask="showMask"
              @hiddleMaskF="hiddleMaskF"
              :item="oneItem"
              @removeMember="removeMember"
              :userRole="userRole"
              @callBackList="callBackList"></MaskList>
    <div class='groupMemberListTitle'>
      <span class="goBack"
            @click="goBack"><i class="iconWfanhui iconWanwan activityNotice"></i></span>
      <span>成员列表</span>
      <span>({{countMember}})</span>
    </div>
    <div class="groupMemberList">
      <scroll ref="scroll"
              :data="groupMember"
              :scrollbar="scrollbarObj"
              :pullDownRefresh="pullDownRefreshObj"
              :pullUpLoad="pullUpLoadObj"
              :startY="parseInt(startY)"
              @pullingDown="onPullingDown"
              @pullingUp="onPullingUp">
        <div class="item">
          <div class='itemTitle'>群主</div>
          <ul>
            <groupMemberItem :role='userRole'
                             :isMaster='isMaster'
                             :isGroupLeader='isGroupLeader'
                             :groupId='groupId'
                             :item='groupHeader[0]'></groupMemberItem>
          </ul>
        </div>
        <div class='item'
             :role='userRole'
             v-if='groupManageList.length'>
          <div class='itemTitle'>群管理员</div>
          <ul>
            <groupMemberItem :role='userRole'
                             :isGroupLeader='isGroupLeader'
                             :groupId='groupId'
                             v-for="(item, index) in groupManageList"
                             :key="index"
                             :item='item'
                             @removeMember="removeMember"
                             @handleMask="handleMask"
                             :myManager="myManager"></groupMemberItem>
          </ul>
        </div>
        <div class='item'
             v-if='groupNormalList.length'>
          <div class='itemTitle'>群成员</div>
          <ul>
            <groupMemberItem :role='userRole'
                             :isGroupLeader='isGroupLeader'
                             :groupId='groupId'
                             v-for="(item, index) in groupNormalList"
                             :key="index"
                             :item='item'
                             @removeMember="removeMember"
                             @handleMask="handleMask"></groupMemberItem>
          </ul>
        </div>
      </scroll>
    </div>
  </div>
</template>
<script>
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
import groupMemberItem from '@/components/List/groupMember'
import ForbidWord from '@/components/List/forbidWord'
import MaskList from '@/components/List/maskList'
import {mapMutations } from 'vuex'
import GroupStateBase from './components/GroupStateBase'
export default {
  mixins: [scrollMixin, GroupStateBase],
  components:{
    scroll,
    groupMemberItem,
    ForbidWord,
    MaskList
  },
  data () {
    return {
      myManager: true, // 表示是管理员列表
      showMask: false, // 是否显示mask
      distance: {}, // 距离
      oneItem: {}, // 表示点击的item
      isForbidState: '', // 表示禁言状态
      isSelectTime: false, // 表示不显示禁言时长
      isLoad: true, // 是否正在加载
      isFail: false, // 是否加载失败
      isMaster: true, // 表示是群主
      groupMember: [], // 所有群成员
      groupManageList: [], //管理员列表
      groupNormalList: [], // 普通用户列表
      pullDownRefresh: false,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: true,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更多数据了',
      isLoading: true,
      items: [],
      curPage: 1,
      pageSize: 7,
      countMember: 0
    }
  },
  activated() {
    this.groupId =  this.$route.params.id
    this.curPage = 1
    this.getGroupMember()
    this.getGroupInfo()
  },
  computed: {
    groupHeader () {
      return this.groupMember.filter((item) => {
        return item.memberRole === 2
      })
    },
    /**
     * userRole 判断我在不在这个群里面
     */
    userRole () {
      let groupItem = this.groupMember.filter((item) => {
        return item.userId === this.$store.state.user.userId
      })
      if (groupItem.length) {
        return groupItem[0].memberRole
      } else {
        return 0
      }
    }
  },
  watch: {
    isGroupLeader (newV) {
      return newV
    },
    userRole (newV) {
      return newV
    }
  },
  methods: {
    ...mapMutations({
      'updateGroupManageList': 'updateGroupManageList' // 更新管理员列表
    }),
    /**
     * showForbid显示禁言
     */
    showForbid (obj) {
      this.isForbidState = obj.item.isGag
      this.oneItem = obj.item
      this.handleForbidWord(obj)
    },
    getGroupInfo () {
      let me = this
      let url = 'UserGroup/GroupId'
      if (this.groupId.length < 8) {
        url = `${url}?GroupNumber=${me.groupId}`
      } else {
        url = `${url}?GroupId=${me.groupId}`
      }
      if (me.$store.state.pos.longitude && me.$store.state.pos.latitude) {
        url = `${url}&Lon=${me.$store.state.pos.longitude}&Lat=${me.$store.state.pos.latitude}`
      }
      me.api.get({
        url: url,
        success: function (res) {
          me.countMember = res.countMember
        }
      })
    },
    /**
     * handleForbidWord 设置禁言时间
     */
    handleForbidWord (obj) {
      let me = this
      if (me.isForbidState) { // 表示已经禁言就需要取消禁言
        me.api.process({
            url: 'GroupMemberManage',
            data: {
              userGroupid: obj.item.userGroupId,
              memberId: obj.item.userId,
              isOperate: false,
            },
            success: function (res) {
              me.isForbidState = false
              console.log('取消禁言成功',res)
              me.$router.go(0)
            }
          })
      } else { // 表示没有禁言就需要禁言
        me.isSelectTime = obj.data
        if (obj.time) {
          // me.selectTime = obj.time
          me.api.process({
            url: 'GroupMemberManage',
            data: {
              userGroupid: obj.item.userGroupId,
              memberId: obj.item.userId,
              isOperate: true,
              minute: obj.time
              // minute: me.selectTime
            },
            success: function (res) {
              me.isForbidState = true
              console.log('禁言成功',res)
              me.$router.go(0)
            }
          })
        }
      }
    },
    // 隐藏maskList组件
    hiddleMaskF (data) {
      this.showMask = data
    },
    //处理showMask
    handleMask (obj) {
      this.showMask = obj.data
      this.distance = obj.distance
      this.oneItem = obj.item
    },
    /**
     * getGroupMember得到成员列表
     */
    getGroupMember () {
      let me = this
      me.api.get({
        url: `GroupMember?GroupId=${me.groupId}&PageIndex=${me.curPage}&PageSize=${me.pageSize}`,
        success: function (res) {
          me.curPage === 1 && (me.groupMember = [])
          me.groupMember = me.groupMember.concat(res)
          me.groupManage()
          me.updateGroupManageList(me.groupManageList)
          me.groupNormal()
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
    /**
     * groupManage 得到管理员列表
    */
    groupManage () {
      this.groupManageList =  this.groupMember.filter((item) => {
        return item.memberRole === 1
      })
    },
     /**
     * groupNormal得到普通用户列表
     */
    groupNormal () {
      this.groupNormalList = this.groupMember.filter((item) => {
        return item.memberRole === 0
      })
    },
    goBack () {
      this.hiddleMaskF(false)
      this.$router.go(-1)
    },
    onPullingDown () {
      this.curPage = 1
      this.getGroupMember()
    },
    onPullingUp () {
      // 更新数据
      this.curPage++
      this.getGroupMember()
    },
    /**
     * removeMember 移除管理员
     */
    removeMember (item, data) {
      if (data === 0) { // 表示移除普通成员
        this.groupNormalList.splice(item,1)
      } else if (data === 1) {
        this.groupManageList.splice(item,1)
      } else {
        return
      }
    },
    callBackList () { // 重新调用成员列表
       console.log('重新调用吗')
       this.curPage = 1
       this.getGroupMember()
       this.showMask = false
    }
  }
}
</script>
<style lang='less' scoped>
  .groupMemberListPage{
    width:100%;
    height:100%;
    position:relative;
    .operateDetail{
      width:90%;
      height:8vw;
      background:rgba(0,0,0,.5);
      color:white;
      position:fixed;
      bottom:2vw;
      z-index:2;
      line-height:8vw;
      text-align: center;
      left:0;
      right:0;
      margin:0 auto;
    }
    .groupMemberListTitle{
      position: relative;
      height:13vw;
      line-height:13vw;
      text-align: center;
      color: var(--dGray);
      font-size: 4.16vw;
      font-weight: bold;
      .goBack{
        position: absolute;
        top: 0;
        left: 0;
        width: 14vw;
        text-align: center;
      }
    }
    .groupMemberList{
      // border:1px solid red;
      position: absolute;
      top: 13vw;
      left: 0;
      bottom: 0;
      right: 0;
      width: 100%;
      .item{
        .itemTitle{
          height:10vw;
          line-height: 10vw;
          font-size: var(--mText);
          padding-left: 5vw;
          color: var(--dGray);
        }
      }
    }
  }
</style>
