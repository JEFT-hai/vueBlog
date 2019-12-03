<template>
  <div class="groupMemberListPage">
    <div class='groupMemberListTitle'>
      <span class="goBack"
            @click="goBack"><i class="iconWfanhui iconWanwan activityNotice"></i></span>
      <span>申请入群成员列表</span>
      <span>({{groupMember.length}})</span>
    </div>
    <div class="groupMemberList">
      <scroll ref="scroll"
              :data="items"
              :scrollbar="scrollbarObj"
              :pullDownRefresh="pullDownRefreshObj"
              :pullUpLoad="pullUpLoadObj"
              :startY="parseInt(startY)"
              @pullingDown="onPullingDown"
              @pullingUp="onPullingUp">
        <div class='item'
             v-if='groupMember.length'>
          <ul>
            <groupMemberItem class="borderT"
                             :groupId='groupId'
                             :btnType='btnType'
                             @click.native='goUser(item)'
                             v-for="(item, index) in groupMember"
                             :key="index"
                             :item='item'></groupMemberItem>
              
          </ul>
        </div>
        <NotFound :failTitle="failTitle"
                    v-if="!groupMember.length"></NotFound>
      </scroll>
    </div>
  </div>
</template>
<script>
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
import groupMemberItem from '@/components/List/applyGroupItem'
import GroupStateBase from './components/GroupStateBase'
import NotFound from '@/components/requestState/NotFound'
export default {
  mixins: [scrollMixin, GroupStateBase],
  components:{
    scroll,
    groupMemberItem,
    NotFound
  },
  data () {
    return {
      failTitle:'目前还没有申请入群的人哦!',
      groupMember: [],
      pullDownRefresh: false,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: false,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '上拉加载',
      number: 10,
      items: [],
      btnType: 1
    }
  },
  created() {
    this.getGroupApplyMember()
  },
  methods: {
    getGroupApplyMember () {
      let me = this
      me.api.get({
        url: 'GroupManage',
        success: function (res) {
          if (res.length) {
            me.groupMember = res
            me.groupMember = res.filter((item) => {
              return item.userGroupId === me.groupId
            })
          }
        }
      })
    },
    goBack () {
      this.$router.go(-1)
    },
    onPullingDown () {
    },
    onPullingUp () {
    }
  }
}
</script>
<style lang='less'>
  .groupMemberListPage{
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
