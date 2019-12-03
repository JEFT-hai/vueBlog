<template>
  <div class="activityInfoPage" ref='activityInfoPage'>
    <ReplayConfirm v-if="isShowReplayConfirm"></ReplayConfirm>
    <userInputTwo :toUser='toTwoUser' v-if='twoReplayShow' :userInputContent='TwoInputContent' :objectId = 'activetyId' :placeholder="Twoplaceholder" :type= "commentsType" @updateComments='updateTwoComments' @hideUserInput='hideTwoReplay' />
    <userInput v-if='hasMask && userInputShow' :userInputContent='userInputContent' :objectId = 'activetyId' :placeholder="placeholder" :type= "commentsType" @updateComments='updateComments' @hideUserInput='hideUserInput' />
    <joinActivity v-if='hasMask && joinActivityMask' @hideJoinActivity='hideJoinActivity' :activetyId='activetyId' :fee='activityDetail.fee'></joinActivity>
    <JoinPeopleList v-if="isShowJoinList" @hiddleJoinList="hiddleJoinList" :activityId="activityDetail.activityId"></JoinPeopleList>
    <div  class="tabBar">
        <i class="iconWanwan iconWleftBack" @click="goBack"></i>
        <tabMove ref='tabMove' :tabData='tabData' @scroll='scroll'></tabMove>
        <i class="iconWanwan iconW7" @click="share(activityDetail)"></i>
    </div>
    <div class="actityInfo" ref="activityInfo" v-if="activityDetail.title">
      <scroll ref="scroll"
        :data="commentList"
        :scrollbar="scrollbarObj"
        :pullDownRefresh="pullDownRefreshObj"
        :pullUpLoad="pullUpLoadObj"
        :startY="parseInt(startY)"
        :listenScroll='listenScroll'
        :listenScrollEnd='listenScrollEnd'
        @scroll="lisScroll"
        @scroll-end='lisScroll'
        @pullingDown='onPullingDown'
        @pullingUp='onPullingUp'
      >
        <div class="banner">
          <img :src="activityDetail.activityImg">
        </div>
        <div class="actityText">
          <div class="title">
          {{activityDetail.title}}
          </div>
          <groupItem v-if="group.userGroupId" @click.native='goGroupInfo' :item='group'></groupItem>
          <ul class="tagList">
            <li v-for='(item, index) in activityDetail.labels' :key='index'>
              <router-link :to="{name: 'activityTag', params: { id: item}}">
                  {{item}}
              </router-link>
            </li>
          </ul>
          <ul class="actityInfoList borderT">
            <!-- <li>
              <i class="leftIcon iconWanwan iconWico_jiankangmenzhen_menzhenshoufei"></i>
              <div class="RL borderB">
                <p>免费</p>
              </div>
            </li> -->
            <li>
              <i class="leftIcon iconWanwan iconWshijian1-copy"></i>
              <div class="RL borderB">
                <p>{{format.formatWeek(activityDetail.beginTime,activityDetail.endTime)}}</p>
              </div>
            </li>
            <!-- <li @click="goGroupInfo" v-if="activityDetail.groupId && activityDetail.groupId !== '00000000-0000-0000-0000-000000000000'">
                <i class="leftIcon iconWanwan iconWduoren-copy"></i>
                <div class="RL borderB">
                  <p class="detailAddress">{{activityDetail.groupName}}</p>
                  <i class='iconWanwan iconWxiayibu'></i>
                </div>
            </li> -->
            <li @click="goItem(activityDetail.street)">
                <i class="leftIcon iconWanwan iconWposition"></i>
                <div class="RL borderB">
                  <p class="detailAddress">{{activityDetail.street}}</p>
                  <i class='iconWanwan iconWxiayibu'></i>
                </div>
            </li>
          </ul>
        </div>
        <div class="activityDesc" ref="activityDesc">
          <div class="descBr borderB">
            详情
          </div>
          <div class="jeft-editor-contentShow" v-html='details'></div>
        </div>
        <div class="commentList" v-if="commentList.length">
          <activityInfoComment :activityCommentList="commentList" :OneItem="activityDetail" :newTwoComment="newTwoComment"></activityInfoComment>
        </div>
      </scroll>
    </div>
    <!-- <ul class="fixBar">
      <li class="oneLi" @click="setUserInputShow(true)">
        <i class="iconWanwan iconWliuyan1"></i>
        <span>留言</span>
      </li>
      <li  class="bigTab Last" @click="goChat">
        进入群聊
      </li>
    </ul> -->
    <div class="fixbtn">
      <span class="btnOne" @click="setUserInputShow(true)">
        <i class="iconWanwan iconWliuyan1"></i>
        <i class="btnFont">留言</i>
      </span>
      <span class="btnTwo" @click="goChat">
        <i class="btnFont">进入群聊</i>
      </span>
    </div>
  </div>
</template>
<script>
import tabMove from '@/components/tabMove'
// import joinActivity from './components/joinActivity'
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
// import JoinPeopleList from './components/joinPeopleList'
import userInput from '@/components/comments/userInput'
import groupItem from '@/components/List/groupItem'
import { mapState, mapMutations } from 'vuex'
import activityInfoComment from '@/views/Activity/components/activityInfoComment'
import userInputTwo from '@/components/comments/userInputTwo'
import ReplayConfirm from '@/views/Discover/components/ReplayConfirm' 
export default {
  mixins: [scrollMixin],
  components: {
    tabMove,
    // joinActivity,
    scroll,
    // JoinPeopleList,
    userInput,
    groupItem,
    activityInfoComment,
    userInputTwo,
    ReplayConfirm
  },
  computed: {
    ...mapState(['hasMask','twoReplayShow', 'replayConfirm', 'isShowReplayConfirm']),
    isClosed () {
      return this.format.getDate(this.activityDetail.closeTime) < new Date()
    },
    details () {
      return this.activityDetail.details.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    },
    isMyActivity () {
      return this.$store.state.user.userId === this.activityDetail.userId
    },
    Twoplaceholder () {
      return '回复.' + this.replayConfirm.nickName
    }
  },
  data () {
    return {
      meIsInGroup: '', // 我是否在群里面
      pullDownRefresh: false,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: true,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更多数据了',
      curPage: 1,
      pageSize: 3,
      commentList: [], // 活动详情的评论
      placeholder: '留下您的精彩评论吧！',
      userInputShow: false,
      userInputContent: '',
      isShowJoinList: false, // 是否显示报名人列表
      routerType: parseInt(this.$route.params.type), // 1表示我创建的活动
      mySelfBusiness: parseInt(this.$route.params.business), // 1表示我是商家，0表示我是普通用户
      isBusiness: '', // 表示是否是商家
      bounce: true,
      listenScroll: true,
      listenScrollEnd: true,
      tabData: ['优惠', '详情'],
      activetyId: this.$route.params.id,
      activityDetail: {},
      joinActivityMask: false,
      commentsType: 4,
      collection: false,
      group: {},
       // 二级评论
      isOneLevel: true, // 表示显示一级评论输入框
      toTwoUser: '',
      TwoInputContent: '',
      TwocommentsType: 4,
      newTwoComment: {},
    }
  },
  created () {
    this.getActivetyDetail()
    this.getActivityCommentList()
  },
  mounted () {
    this.$share.close()
  },
  activated () {
    this.$share.close()
    
  },
  methods: {
    ...mapMutations({
      'setCountReply': 'setCountReply',
      'setMask': 'setMask',
      'updateReplayState': 'updateReplayState',
      'updateShowConfirm': 'updateShowConfirm'
    }),
    /**
     * handlePeopleList 处理报名人数列表
     */
    handlePeopleList () {
      this.isShowJoinList = true
    },
    hiddleJoinList () {
      this.isShowJoinList = false
    },
    hideJoinActivity (data) {
      this.joinActivityMask = false
      data && (this.activityDetail.isPaticipate = true)
    },
    updateComments (data) { // 评论
      // this.$toast('评论成功！')
      this.userInputContent = ''
      this.setUserInputShow(false)
      if (data) {
        this.commentList.unshift(data)
        // this.hideUserInput()
        // this.postDetail.countReply++
        this.setUserInputShow(false)
        this.userInputContent = ''
      }
      this.userInputContent = ''
      this.toUser = ''
    },
    setUserInputShow (data) {
      if (!this.$store.state.isInApp) {
        window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=io.dcloud.H50D8112A'
        return
      }
      if (!this.authentication.isLogin()) {
        this.$router.push({
          name: 'login'
        })
        return
      }
      this.userInputShow = data
      this.setMask(data)
    },
    setJoinActivity (data) {
      this.setMask(data)
      this.joinActivityMask = data
    },
    hideUserInput (content) {
      if (!this.$store.state.isInApp) {
        window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=io.dcloud.H50D8112A'
        return
      }
      if (!this.authentication.isLogin()) {
        this.$router.push({
          name: 'login'
        })
        return
      }
      this.userInputContent = content
      this.setUserInputShow(false)
    },
    saveOprate () { // 关注
      let me = this
      if (!this.$store.state.isInApp) {
        window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=io.dcloud.H50D8112A'
        return
      }
      if (!this.authentication.isLogin()) {
        this.$router.push({
          name: 'login'
        })
        return
      }
      me.api.process({
        url: 'Operate',
        data: {
          objectId: me.activetyId,
          oprateType: 1,
          objectType: 2,
          isCancel: !me.collection
        },
        success: function () {
          me.collection = !me.collection
        }
      })
    },
    scroll (index) {
      if (!index) {
        this.scrollTo(0, 0)
      } else {
        this.scrollTo(0, -this.$refs.activityDesc.offsetTop + 8)
      }
    },
    lisScroll (data) {
      if (-data.y >= this.$refs.activityDesc.offsetTop - 8) {
        this.$refs.tabMove.curTab = 1
      } else if (-data.y < this.$refs.activityDesc.offsetTop + 50) {
        this.$refs.tabMove.curTab = 0
      }
    },
    goBack () {
      if (window.history.length >= 1) {
        this.$router.go(-1)
      }
      let matched = this.$route.matched[this.$route.matched.length - 1]
      let link = typeof (matched.parent) === 'undefined' ? '/' : (matched.parent.path.replace(/\/$/, '') + '/')
      if (matched.path.endsWith('/') && matched.path === matched.parent.path + '/' && typeof (matched.parent.parent) !== 'undefined') {
        link = matched.parent.parent.path
      }
      this.$router.replace(link)
    },
    share (item) {
      let innerObj = {
        name: this.$route.name,
        objectId: item.activityId
      }
      this.$share.open(item, false, 'activity', this.$router.currentRoute.fullPath, innerObj)
    },
    getActivetyDetail () {
      var me = this
      me.api.get({
        'url': `BusinessActivity/id?BusinessActivityId=${me.activetyId}`,
        success: function (res) {
          me.activityDetail = res
          me.collection = me.activityDetail.isCollection
          res.groupId !== me.$store.state.defaultGroupId && me.getGroupInfo()
          if (res.userBusinessId != '00000000-0000-0000-0000-000000000000') {
            me.isBusiness = true
          } else {
            me.isBusiness = false
          }
        },
        complete: function () {
          me.$nextTick(() => {
            setTimeout(() => {
              me.$refs.scroll && me.$refs.scroll.forceUpdate()
            }, 300)
          })
        }
      })
    },
    goItem () {
      window.isInAndroid && window.WanAndroid.startBDMap(this.activityDetail.latitude, this.activityDetail.longitude)
    },
    getGroupInfo () {
      let me = this
      me.api.get({
        'url': `UserGroup/GroupId?GroupId=${me.activityDetail.groupId}`,
        success: function (res) {
          me.group = res
        }
      })
    },
    goGroup () {
      let me = this
      if (me.activityDetail.groupId && me.activityDetail.groupId !== '00000000-0000-0000-0000-000000000000') {
        me.$router.push({ name: 'dialog', params: { 
          type: 'group',
          userId: me.activityDetail.groupId,
          userName: me.activityDetail.groupName
        } })
      } else {
        return
      }
    },
    goGroupInfo () {
      let me = this
      this.$router.push({ name: 'groupInfo', params: { id: me.activityDetail.groupId} })
    },
    /**
     * getActivityCommentList 得到活动的评论数据
     */
    getActivityCommentList () {
      let me = this
      me.api.get({
        url: `Comment?ObjectId=${me.activetyId}&PageIndex=${me.curPage}&PageSize=${me.pageSize}`,
        success: function (res) {
          me.curPage === 1 && (me.commentList = [])
          me.commentList = me.commentList.concat(res)
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
      this.getActivityCommentList()
    },
    onPullingUp () {
      // 更新数据
      this.curPage++
      this.getActivityCommentList()
    },
    /**
     * goChat进入群聊
     */
    goChat () {
      let p = this.isGroupMember()
      p.then(() => {
        if (this.meIsInGroup) { // 表示我在群里面直接进入群聊
        // window.goDialog('group', this.activityDetail.groupId, this.group.groupName)
          this.go.nameAParams('chatRoom', {
            id: this.activityDetail.groupId,
            type:1,
            share: false,
            name: this.activityDetail.groupName
          })
        } else {
            let b = this.applayGroup()
            b.then(() => {
                window.goDialog('group', this.activityDetail.groupId, this.group.groupName)
            })
        }
      })
    },
    /**
     * isGroupMember 是否是群成员
    */
    isGroupMember () {
      let me = this
      return new Promise((resolve, reject) =>{
        me.api.get({
          url:`GroupMemberManage?GroupId=${me.activityDetail.groupId}`,
          success: function (res) {
              me.meIsInGroup = res
              resolve()
          },
          error: function() {
            me.$error(true, '请求失败', 1200)
            reject()
          }
       })
      })
    },
    /**
     * 申请进群 applayGroup
     */
    applayGroup () {
      let me = this
      me.$uploading(true, '申请中...')
      return new Promise((resolve,reject) =>{
        me.api.process({
            url: 'GroupMember',
            data: {
                groupId: me.activityDetail.groupId,
                isSkip: true // 表示不需要审核
            },
            success: function () {
                me.$uploading(false, '修改资料中...')
                resolve()
            },
            error: function() {
                me.$error(true, '请求失败', 1200)
                reject()
            }
        })
      })
      
    },
        // 二级回复
    hideTwoReplay () {
      this.updateReplayState(false)
    },
    /**
     * updateTwoComments更新二级评论列表
     */
    updateTwoComments (data) {
      if (data) {
        this.newTwoComment = data
        this.hideTwoReplay()
      }
      this.TwoInputContent = ''
      this.toTwoUser = ''
    },
  }
}
</script>
<style lang="less">
.activityInfoPage{
  height:100%;
  box-sizing: border-box;
  overflow: hidden;
  .fixBar{
    display: flex;
    position: fixed;
    width: 100vw;
    height: 13vw;
    line-height:13vw;
    bottom: 0;
    left: 0;
    text-align: center;
    z-index: 33;
  }
  .fixbtn{
    display: flex;
    justify-content:space-between;
    position: fixed;
    width: 100vw;
    height: 13vw;
    line-height:13vw;
    bottom: 0;
    left: 0;
    text-align: center;
    z-index: 33;
    background-color:white;
    span{
      display:inline-block;
      flex:1;
      
    }
    .btnOne{
      background: rgb(249, 249, 249);
      background:var(--mBg);
      i{
        color:var(--dGray);
        font-style: normal;
        font-size: 5vw;
      }
    }
    .btnTwo{
      background:var(--mRed);
      font-size: 5vw;
      i{
        font-style: normal;
        color:white;
      }
    }
  }
  .tabBar{
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    width:100vw;
    height: 12vw;
    line-height: 12vw;
    font-size: var(--nText);
    display: flex;
    padding: 0 3vw;
    color: var(--dGray);
    background: #fff;
    box-shadow: 0 1px 0 #f9f9f9;
    i{
      // color: var(--lGray);
      // font-size: var(--title);
      font-size:4.5vw;
      font-weight: bold;
      color:#666;
    }
    .iconWleftBack{
        text-align: left;
    }
    .iconW7{
        text-align: right;
    }
  }
  .actityInfo{
    height: calc(100vh - 25vw);
    background: var(--mBg);
    overflow: hidden;
    .banner{
      height: 47.5vw;
      width: 100vw;
      overflow: hidden;
      img{
        width: 100%;
        height: auto;
      }
    }
    .actityText{
        margin-bottom: 2vw;
        > ul {
          padding: 0 3.7vw;
          background: #fff;
        }
        > .title{
            line-height: 5.74vw;
            padding: 4.7vw 3.7vw 2.55vw;
            font-size:var(--title);
            color: var(--dGray);
            background: #fff;
            font-weight: bold;
        }
        .tagList{
          //   padding:0 5.55vw 0 2.8vw;
          font-size: 0;
          background: #fff;
          border-radius:0 0 1.11vw 1.11vw;
          li{
            display: inline-block;
            font-size: var(--nText);
            height: 8.15vw;
            line-height: 8.15vw;
            width: 15vw;
            text-align: center;
            margin: 2.6vw 2.6vw 3.33vw 0;
            border: 1px solid #e7e7e7;
            border-radius: 0.926vw;
            color:  var(--mGray);
            background:#fff;
            padding: 0;
            overflow: hidden;
            a{
              color: inherit;
            }
          }
        }
        .borderT {
          &::before{
            background-color: #f9f9f9 !important;
          }
        }
        .actityInfoList{
            padding-right: 0;
          li{
            display:flex;
            height: 12.87vw;
            line-height: 12.87vw;
            .detailAddress{
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            > i{
                width: 8.7vw;
                color: #d3d6d6;
                font-size: var(--title);
            }
            .RL{
                flex: 1;
                overflow: hidden;
                padding:0 3.7vw 0 1vw;
                display: flex;
                &::after{
                  background-color: #f9f9f9 !important;
                  left: 1vw;
                }
                p{
                  flex: 1;
                  font-size: var(--mText);
                  color: var(--mGray);
                  // max-width: 83.9vw;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  white-space: nowrap;
                }
                > i{
                    width: 3.7vw;
                    text-align: right;
                    font-size: var(--mText);
                    color: #b1b1b1;
                }
            }
          }
        }
    }
  }
  .activityDesc{
    background: #fff;
    padding-bottom: 3vw;
    .descBr{
      height: 14.72vw;
      line-height: 14.72vw;
      font-size: var(--title);
      color: var(--dGray);
      margin: 2vw 4.6vw 0;
      padding-left: 2.3vw;
      &::before{
        position: absolute;
        content: '';
        width: 0.83vw;
        height: 3.8vw;
        top: 50%;
        margin-top: -1.9vw;
        left:0;
        background-color: var(--mRed);
      }
      &::after{
        background-color: #f9f9f9 !important;
      }
    }
    .Detail{
      padding:1.5vw;
      .detailItem{
        // padding: 2vw;
        // box-sizing: border-box;
        margin: 3vw 0;
        font-size: var(--mText) !important;
        color:var(--dGray) !important;
        letter-spacing:2px;
        word-wrap: break-word;
        word-break: break-all;
        .text{
          display: inline-block;
          margin-left: 1.5vw;
        }
        img{
          border-radius: 0.8vw;
        }
      }
    }
  }
}
</style>
