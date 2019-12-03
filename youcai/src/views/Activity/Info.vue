<template>
  <div class="activityInfoPage"
       ref='activityInfoPage'>
    <ReplayConfirm v-if="isShowReplayConfirm"></ReplayConfirm>
    <userInputTwo :toUser='toTwoUser'
                  v-if='twoReplayShow'
                  :userInputContent='TwoInputContent'
                  :objectId='activetyId'
                  :placeholder="Twoplaceholder"
                  :type="commentsType"
                  @updateComments='updateTwoComments'
                  @hideUserInput='hideTwoReplay' />
    <userInput v-if='hasMask && userInputShow'
               :userInputContent='userInputContent'
               :objectId='activetyId'
               :placeholder="placeholder"
               :type="commentsType"
               @updateComments='updateComments'
               @hideUserInput='hideUserInput' />
    <div class="tabBar">
      <i class="iconWanwan iconWfanhui"
         @click="goBack"></i>
      <tabMove ref='tabMove'
               :tabData='tabData'
               @scroll='scroll'></tabMove>
      <i class="iconWanwan iconWweixinfenxiang"
         @click="share(activityDetail)"></i>
    </div>
    <div class="actityInfo"
         ref="activityInfo"
         v-if="activityDetail.title">
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
              @pullingUp='onPullingUp'>
        <div class="banner">
          <img :src="activityDetail.activityImg">
        </div>
        <div class="actityText">
          <div class="title">
            <span class="activityTitle">{{activityDetail.title}}</span>
            <span class="modifyFont reviseActivity"
                  @click="go.nameAid('activityRevise', activetyId)"
                  v-if="isMyActivity"><i class="iconWbianji1 iconWanwan"></i></span>
          </div>
          <groupItem v-if="group.userGroupId"
                     @click.native='goGroupInfo'
                     :item='group'></groupItem>
          <ul class="tagList">
            <li v-for='(item, index) in activityDetail.labels'
                :key='index'>
              <router-link :to="{name: 'activityTag', params: { id: item}}">
                {{item}}
              </router-link>
            </li>
          </ul>
          <ul class="actityInfoList borderT">
            <li>
              <i class="leftIcon iconWanwan iconWico_jiankangmenzhen_menzhenshoufei"></i>
              <div class="RL borderB">
                <p v-if='activityDetail.fee'>{{activityDetail.fee}}元</p>
                <p v-else>免费</p>
              </div>
            </li>
            <li>
              <i class="leftIcon iconWanwan iconWshijian1-copy"></i>
              <div class="RL borderB">
                <p>{{format.formatWeek(activityDetail.beginTime,activityDetail.endTime)}}</p>
              </div>
            </li>
            <li @click="goItem(activityDetail.address)">
              <i class="leftIcon iconWanwan iconWposition"></i>
              <div class="RL borderB">
                <p class="detailAddress">{{activityDetail.address}}</p>
                <i class='iconWanwan iconWxiayibu'></i>
              </div>
            </li>
          </ul>
        </div>
        <div class="activityDesc"
             ref="activityDesc">
          <div class="descBr borderB">
            详情
          </div>
          <div class="activityDetail jeft-editor-contentShow"
               v-html='details'></div>
        </div>
        <div class="commnetWrap"
             ref='commentWrap'>
          <div class="descBr borderB">
            留言区
          </div>
          <div class="commentList"
               v-if="commentList.length">
            <activityInfoComment :activityCommentList="commentList"
                                 :OneItem="activityDetail"
                                 :newTwoComment="newTwoComment"></activityInfoComment>
          </div>
          <div class="noData"
               v-else>
            <span class="iconWzanwupinglun iconWanwan"></span>
            <span>暂无留言, 快抢沙发吧</span>
          </div>
        </div>
      </scroll>
    </div>
    <ul class="fixBar"
        v-if="!isMyActivity">
      <li class="hasRLine borderT"
          @click='saveOprate'>
        <i :class="['iconWanwan','iconWweibiaoti105',{isCollection: collection}]"></i>
        <span v-show='!collection'>关注</span>
        <span class='isCollection'
              v-show='collection'>已关注</span>
      </li>
      <li class="borderT"
          @click='setUserInputShow(true)'>
        <i class="iconWanwan iconWliuyan1"></i>
        <span>留言</span>
      </li>
      <li class="bigTab"
          @click='bigTabClick'>
        {{myState}}
      </li>
    </ul>
    <ul class="fixBar"
        v-else>
      <li class="createLiOne"
          @click="go.nameAid('activityJoinList', activetyId)">报名列表</li>
      <li class="createLiTwo"
          @click='goGroup'>进入群聊</li>
    </ul>
  </div>
</template>
<script>
import tabMove from '@/components/tabMove'
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
import userInput from '@/components/comments/userInput'
import groupItem from '@/components/List/groupItem'
import { mapState, mapMutations } from 'vuex'
import activityInfoComment from './components/activityInfoComment'
import userInputTwo from '@/components/comments/userInputTwo'
import ReplayConfirm from '@/views/Discover/components/ReplayConfirm'
export default {
  mixins: [scrollMixin],
  components: {
    tabMove,
    scroll,
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
      return this.activityDetail.details.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/(<img)/g, '<img preview=\'activity\'')
    },
    isMyActivity () {
      return this.$store.state.user.userId === this.activityDetail.userId
    },
    Twoplaceholder () {
      return '回复.' + this.replayConfirm.nickName
    },
    myState () {
      if (this.isClosed) {
        return '已结束'
      } else if (this.isBusiness || this.activityDetail.isParticipate) {
        return '进入群聊'
      } else if (this.activityDetail.isParticipate) {
        return '已报名'
      } else {
        return '我要报名'
      } 
    }
  },
  data () {
    return {
      pullDownRefresh: false,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: true,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更多留言了',
      curPage: 1,
      pageSize: 3,
      commentList: [], // 活动详情的评论
      placeholder: '留下您的精彩评论吧！',
      userInputShow: false,
      userInputContent: '',
      routerType: parseInt(this.$route.params.type), // 1表示我创建的活动
      mySelfBusiness: parseInt(this.$route.params.business), // 1表示我是商家，0表示我是普通用户
      isBusiness: '', // 表示是否是商家
      bounce: true,
      listenScroll: true,
      listenScrollEnd: true,
      tabData: ['活动', '详情', '留言区'],
      activetyId: this.$route.params.id,
      activityDetail: {},
      commentsType: 3,
      collection: false,
      group: {},
      // 二级评论
      isOneLevel: true, // 表示显示一级评论输入框
      toTwoUser: '',
      TwoInputContent: '',
      TwocommentsType: 3,
      newTwoComment: {},
      isPath: null, // 表示从哪个页面过来的
    }
  },
  activated () { // 修改成功 回来刷新数据
    this.getActivetyDetail()
  },
  created () {
    this.getActivetyDetail()
    this.getActivityCommentList()
    // this.$share.close()
  },
  beforeRouteEnter(to, from, next) {
    next((vm)=>{
      vm.isPath = from.name
    })
  },
  methods: {
    ...mapMutations({
      'setCountReply': 'setCountReply',
      'setMask': 'setMask',
      'updateReplayState': 'updateReplayState',
      'updateShowConfirm': 'updateShowConfirm'
    }),
    bigTabClick () {
      if (this.isClosed) {
        return
      } else if (this.isBusiness) {
        this.goGroupInfo()
      } else if (!this.activityDetail.isParticipate) {
        // this.setJoinActivity(true)
        this.go.nameAParams('activityJoin', {
          id: this.activetyId,
          fee: this.activityDetail.fee
        })
      } else if (this.activityDetail.isParticipate) { // 表示已经报名直接进入群聊
          this.go.nameAParams('chatRoom', {
          id: this.activityDetail.groupId,
          type:1,
          share: false,
          name: this.activityDetail.groupName
        })
      }
      
    },
    hideJoinActivity (data) { // 参与活动成功
      this.joinActivityMask = false
      data && (this.activityDetail.isParticipate = true)
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
        this.go.login()
        return
      }
      this.userInputShow = data
      this.setMask(data)
    },
    setJoinActivity (data) {
      if (!this.$store.state.isInApp) {
        window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=io.dcloud.H50D8112A'
        return
      }
      if (!this.authentication.isLogin()) {
        this.go.login()
        return
      }
      this.setMask(data)
      this.joinActivityMask = data
    },
    hideUserInput (content) {
      if (!this.$store.state.isInApp) {
        window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=io.dcloud.H50D8112A'
        return
      }
      if (!this.authentication.isLogin()) {
        this.go.login()
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
        this.go.login()
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
      console.log(index)
      switch (index) {
        case 0:
          this.scrollTo(0, 0)
          break
        case 1:
          this.scrollTo(0, -this.$refs.activityDesc.offsetTop + 8)
          break
        case 2:
          this.scrollTo(0, -this.$refs.commentWrap.offsetTop + 8)
          break
      }
    },
    lisScroll (data) { // 监听页面滚动 选中相应的tab
      if (-data.y + 10 > -this.$refs.scroll.scroll.maxScrollY || -data.y >= this.$refs.commentWrap.offsetTop - 8) {
        this.$refs.tabMove.curTab = 2
      } else if (-data.y >= this.$refs.activityDesc.offsetTop - 8) {
        this.$refs.tabMove.curTab = 1
      } else if (-data.y < this.$refs.activityDesc.offsetTop + 50) {
        this.$refs.tabMove.curTab = 0
      }
    },
    goBack () {
      this.$router.back()
    },
    share (item) {
       let innerObj = {
        name: this.$route.name,
        objectId: item.activityId
      }
      let isDeleteActivity = ''
      if (item.userId === this.$store.state.user.userId) {
         isDeleteActivity = true
        console.log('我是相等')
      }
      console.log('分享里面', this.isPath)
      this.$share.open(item, false, 'activity', this.$router.currentRoute.fullPath, innerObj, isDeleteActivity, this.isPath)
    },
    getActivetyDetail () {
      var me = this
      me.api.get({
        'url': `ActivityDetails?ActivityId=${me.activetyId}`,
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
              // me.$refs.scroll && me.$refs.scroll.forceUpdate()
            }, 300)
          })
        }
      })
    },
    goItem () { // 打开android地图
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
        this.go.nameAParams('chatRoom', {
          id: me.activityDetail.groupId,
          type:1,
          share: false,
          name: me.activityDetail.groupName
        })
      } else {
        return
      }
      if (this.messagePage.isLongClick) {
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
          console.log('活动的评论',res)
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
      console.log('上拉刷新')
      this.getActivityCommentList()
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
        console.log('回复评论成功')
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
  height:100vh;
  box-sizing: border-box;
  padding-top: 12vw;
  padding-bottom: 13vw;
  overflow-y: scroll;
  .fixBar{
    display: flex;
    position: fixed;
    width: 100vw;
    height: 13vw;
    line-height:13vw;
    bottom: 0;
    left: 0;
    text-align: center;
    .hasRLine{
      position: relative;
      &::after {
        position:absolute;
        content:'';
        right:0;
        top: 50%;
        width:1px;
        height: 6.48vw;
        margin-top: -3.24vw;
        background:#e7e7e7;
      }
    }
    li {
      flex: 1;
      padding-top:2.13vw;
      background: #f9f9f9;
      i {
        display: block;
        font-size: 5.5vw;
        height: 6.3vw;
        line-height: 6.3vw;
        color: var(--mGray);
      }
      .iconWweibiaoti105{
        color: #ccc;
      }
      .isCollection{
        color: var(--mRed);
      }
      span{
        display: block;
        height:3.7vw;
        line-height:3.7vw;
        font-size: var(--sText);
        color: var(--dGray);
      }
    }
    .bigTab {
      flex:2;
      padding: 0;
      background: var(--mRed);
      font-size: 5vw;
      color: #fff;
    }
    .Last{
      flex:2;
      width:46vw;
      position: fixed;
      z-index: 222;
      bottom:0;
      right:0;
    }
    .createLiOne{
      padding:0;
      height:13vw;
      line-height:13vw;
      font-size: 5vw;
    }
    .createLiTwo{
      padding:0;
      height:13vw;
      line-height:13vw;
      background: var(--mRed);
      font-size: 5vw;
      color: #fff;
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
    padding: 0 7.5vw 0 7.5vw;
    box-sizing: border-box;
    color: var(--dGray);
    background: #fff;
    box-shadow: 0 1px 0 #f9f9f9;
    i{
      color: var(--lGray);
      font-size: var(--title);
    }
    .iconWleftBack{
        text-align: left;
        font-size: 4.63vw;
        font-weight: bold;

    }
    .iconWfanhui{
      text-align: left;
      font-size: 4.63vw;
      font-weight: bold;
      color:black;
    }
    .iconWweixinfenxiang{
              font-weight: 500;
              background:rgb(59, 187, 7);
              width:8vw;
              height:8vw;
              text-align: center;
              line-height:8vw;
              border-radius: 50%;
              display:inline-block;
              color:white;
              position:relative;
              top:0;
              bottom:0;
              margin:auto 0;
    }
  }
  .actityInfo{
    height: calc(100vh - 25vw);
    background: var(--mBg);
    overflow: hidden;
    .banner{
      position: relative;
      height: 47.5vw;
      width: 100vw;
      overflow: hidden;
      img{
        width: 100%;
        height: auto;
      }
      .reviseActivity{
        position: absolute;
        right: 4vw;
        bottom: 4vw;
        width: 12vw;
        border-radius: 50%;
        background: #e7e7e7;
        line-height: 12vw;
        height: 12vw;
        text-align: center;
        color: var(--lGray);
        font-size: var(--title);
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
            .activityTitle{
              font-size:var(--title);
              color: var(--dGray);
            }
            .modifyFont{
              display:inline-block;
              margin-left:13vw;
              width: 12vw;
              border-radius: 50%;
              background: #e7e7e7;
              line-height: 12vw;
              height: 12vw;
              text-align: center;
              color: var(--lGray);
              font-size: var(--title);
              // line-height:7vw;
              .iconWbianji1{
                color: var(--lGray);
                font-size: 6vw;
                font-weight: 400;
              }
            }
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
    .Detail{
      padding:1.5vw;
      .detailItem{
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
  .commnetWrap{
    background: #fff;
    .noData{
      .iconWzanwupinglun{
        display:inline-block;
        width:100%;
        height:5vw;
        text-align: center;
        font-size:12vw;
        color:#999;
        font-weight: bold;
      }
      span:nth-child(2) {
        display:inline-block;
        width:100%;
      //  height:5vw;
        font-size:4vw;
        text-align: center;
        color:#999;
      }
    }
  }
}
</style>
