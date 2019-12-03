<template>
  <div class="videoH"
       v-if="item">
    <ReplayConfirm v-if="isShowReplayConfirm"></ReplayConfirm>
    <userInput :toUser="toUser"
               v-if="userInputShow"
               :userInputContent="userInputContent"
               :objectId="item.postId"
               :placeholder="placeholder"
               :type="commentsType"
               @updateComments="updateComments"
               @hideUserInput="hideUserInput" />
    <!-- 二级回复 -->
    <userInputTwo :toUser="toTwoUser"
                  v-if="twoReplayShow"
                  :userInputContent="TwoInputContent"
                  :objectId="item.postId"
                  :placeholder="Twoplaceholder"
                  :type="TwocommentsType"
                  @updateComments="updateTwoComments"
                  @hideUserInput="hideTwoReplay" />
    <v-h :item="item"></v-h>
    <scroll ref="scroll"
            :scrollbar="scrollbarObj"
            :pullDownRefresh="pullDownRefreshObj"
            :pullUpLoad="pullUpLoadObj"
            :startY="0">
      <div class="videoMain">
        <div class="head">
          <div class="postMassage">
            <avatar :item='item'
                    :size=4></avatar>
            <span class="userName"
                  @click="go.user(item.userId)">{{item.nickName}}</span>
            <div class="itemOnlyFollow">
              <div class="folowWrap">
                <BtnFollow :item="item" />
              </div>
            </div>
          </div>
          <div class="morePost"></div>
        </div>
        <div class="activityDesc">
          <div class="activityName borderB">
            <span>正在参加</span>
            <span class="activityTit">【{{item.title}}】</span>
          </div>
        </div>
        <div class="voteNums">
          <div>
            <span class="num">{{item.voteSort}}</span>
            <span class="txt">编号</span>
          </div>
          <div>
            <span class="num">{{allCount}}</span>
            <span class="txt">票数</span>
          </div>
        </div>
        <div class="btnList borderB">
          <div @click="toVote"
               :class="['voteBtn', isVoted ? 'isVoted' : '',  {'toggle__button--isLoading':isLoading}]">{{isVoted?'已投票':'投票'}}</div>
          <div @click="share"
               class="shareBtn">分享</div>
        </div>
        <div class="votedUsers borderB"
             v-if="votesPerson8.length">
          <div class="votedUsersList">
            <div v-for="(item,index) in votesPerson8"
                 :key="index">
              <img :src="item.avatar"
                   alt />
            </div>
          </div>
          <div class="votedTxt">
            <span>已有{{item.countVote}}票数支持</span>
            <span v-if="votesPerson.length > 8"
                  @click='setVotedList(true)'
                  class="moreVotedList">，查看更多</span>
          </div>
        </div>
      </div>
      <div class="activityDescTit">详情</div>
      <ItemContent :item="item"
                   @userReplay="userReplay"
                   :replayList="replayList"
                   :showMoreReplay="showMoreReplay"
                   @moreReplay="moreReplay"
                   @handleReplayConfirm="handleReplayConfirm"
                   :newTwoComment="newTwoComment"></ItemContent>
    </scroll>
    <div class="itemOnlyBottom">
      <span class="bottomReplay"
            @click="userReplay(true)">
        <i class="iconWshuru iconWanwan"></i>
        <i>说点什么...</i>
      </span>
      <div class="likeRight"
           v-if="item">
        <div class="selfLike selfOne">
          <BtnLike :operateType="2"
                   :objectId="item.postId"
                   :item="item"
                   :objectType="0"
                   :btnWeight='1'
                   numPos="sup"
                   :size="2"></BtnLike>
        </div>
        <div class="selfCollect selfOne">
          <BtnLike :operateType="1"
                   :objectId="item.postId"
                   :item="item"
                   :objectType="0"
                   :btnWeight='1'
                   numPos="sup"
                   :size="2"></BtnLike>
        </div>
        <div class="selfComment selfOne"
             @click="userReplay(true)">
          <div class="postItem-meta2-replay">
            <i class="icon-icon_subinfobox1 icon-xiaoxi1 icon iconfont myLike"></i>
            <span class="count"
                  v-show="item.countReply">{{item.countReply}}</span>
          </div>
        </div>
      </div>
    </div>
    <transition name='fadeLeft'>
      <div class='votedUserListTab'
           v-show="votedTabShow">
        <div class="votedHeader">
          <div @click='setVotedList(false)'
               class="backBtn iconWleftBack iconWanwan"></div>
          <div class="tit">投票人列表</div>
          <div class="right"></div>
        </div>
        <div class="votedUserList"
             v-if="votesPerson.length">
          <div class="votedUserItem"
               v-for='(item,index) in votesPerson'
               :key="index">
            <img :src="item.avatar"
                 alt="">
          </div>
        </div>
        <div class="setVotedListBtn"
             @click="setVotedList(false)">返回</div>
      </div>
    </transition>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'

import scrollMixin from '@/components/scroll/scrollMixin'
import commentsMixin from '@/components/comments/commentsMixin'

import avatar from '@/components/Avatar'
import videoH from '@/components/video/hVideo'
import userInput from '@/components/comments/userInput'
import userInputTwo from '@/components/comments/userInputTwo'
import ReplayConfirm from '@/views/Discover/components/ReplayConfirm'
import scroll from '@/components/scroll/scroll'
import ItemContent from './components/ItemOnlyFull.vue'
import BtnFollow from '@/components/Btn/BtnFollow'
import BtnLike from '@/components/Btn/BtnLike'
export default {
  mixins: [scrollMixin, commentsMixin],
  components: {
    avatar,
    'v-h': videoH,
    scroll,
    userInput,
    BtnFollow,
    BtnLike,
    ReplayConfirm,
    userInputTwo,
    ItemContent
  },
  data () {
    return {
      isLoading: false,
      id: this.$route.params.id,
      postId: this.$route.params.id,
      item: null, // 视频详情数据
      postDetail: null, // 视频详情数据 mixin
      isPostDeail: true,
      votesPerson: [],
      pullDownRefresh: false,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: false,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '上拉加载',
      pageIndex: 1,
      pageSize: 5,
      votedTabShow: false // votedTab
    }
  },
  computed: {
    ...mapState(['isPlaying', 'hasMask', 'user', 'twoReplayShow', 'replayConfirm', 'isShowReplayConfirm', 'voteList']),
    votesPerson8 () {
      return this.votesPerson.slice(0, 8)
    },
    activityName () {
      return this.item.title.indexOf('活动') >=0 ? '' : '投票活动'
    },
    voteState () {
      return this.isVoted ? '已投票':'投票'
    },
    isInVoteList () {
      return this.voteList && this.voteList.length >= 1 && this.voteList.indexOf(this.postId) !== -1
    },
    isVoted () {
      return this.isInVoteList || this.item.isVote
    },
    allCount () {
      let num = (this.isInVoteList && !this.item.isVote) ? 1 : 0
      return this.item.countVote + num
    }
  },
  created () {
    if (this.isPlaying) {
      this.hasMusic = true
      this.setMusicPlay(false)
    }
    this.getVideoDetail()
    this.getVotePerson()
    window.isInAndroid && window.WanAndroid.startPlayVideo(true)
  },
  beforeDestroy () {
    if (this.hasMusic) {
      this.setMusicPlay(true)
    }
    window.isInAndroid && window.WanAndroid.startPlayVideo(false)
  },
  methods: {
    ...mapMutations({
      setMask: 'setMask',
      'setMusicPlay': 'setMusicPlay',
      upVoteList:'upVoteList'
    }),
    /** 
     * 获取投票详情
     */
    getVideoDetail () {
      let me = this
      me.api.get({
        url: `VoteDetails?VotePostId=${me.id}`,
        success: function (res) {
          me.item = res
          me.postDetail = res
          console.log(res)
        }
      })
    },
    /**
     * getVotePerson
     */
    getVotePerson() {
      let me = this
      me.api.get({
        url: `Vote?VotePostId=${me.id}`,
        success: function (res) {
          me.votesPerson = res
        }
      })
    },
    /** 投票 */
    toVote () {
      let me = this
      if (!this.$store.state.isInApp) {
        window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=io.dcloud.H50D8112A'
        return
      }
      if (!this.authentication.isLogin()) {
        this.go.login()
        return
      }
      if (this.item.isVote) {
        return
      }
      if (this.isLoading) {
        return
      }
      me.isLoading = true
      me.api.process({
        url: 'vote',
        data: {
          'votePostId': me.id,
          'isVote': true
        },
        success: function () {
          me.isLoading = false
          // me.item.isVote = true
          // me.item.countVote = me.item.countVote + 1
          me.upVoteList(me.postId)
        },
        error: function (res) {
          me.isLoading = false
          me.$error(true, res ? res: '投票失败', 500)
        }
      })
    },
    /** 分享 */
    share () {
      let objectId = ''
      objectId = this.item.postId
      let innerObj = {
        name: this.$route.name,
        objectId,
      }
      this.$share.open(this.item, false, 'voteDetail', this.$router.currentRoute.fullPath, innerObj)
    },
    setVotedList (data) {
      this.votedTabShow = data
      this.setMask(data)
    }
  }
}
</script>
<style lang="less">
#app .borderT:before {
  background-color: #eee;
}
.videoH {
  position: relative;
  padding-top: 62vw;
  .list-wrapper {
    // height: calc(100% - 12.3vw);
    padding-bottom: 12.3vw;
  }
  .activityDescTit {
    height: 5vw;
    line-height: 5vw;
    font-size: 4.6vw;
    color: #333;
    font-weight: bold;
    margin: 2vw 0 2vw 3vw;
    border-left: 3px solid #ff2742;
    padding-left: 10px;
  }
  .videoMain {
    margin: 0 3vw;
    .head {
      height: 13.34vw;
      width: 100%;
      box-sizing: border-box;
      background: white;
      .postMassage {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        position:relative;
        .userName {
          flex: 1;
          margin-left: 3vw;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        .right {
          position: absolute;
          bottom: 1.7vw;
          left: 5vw;
          z-index: 12;
          background: white;
          width: 5.5vw;
          height: 5.5vw;
          border-radius: 50%;
          .one {
            position:absolute;
            top:0;
            left:0;
            right:0;
            bottom:0;
            margin: auto;
            // padding:-0.5vw 0 0 0.5vw;
            width: 4.68vw;
            height: 4.68vw;
            border-radius: 50%;
            background: linear-gradient(
              to right bottom,
              #e37782,
              #f56b80,
              #ff5363,
              #ff405b,
              #fc3f58
            );
            color: white;
            line-height: 4.68vw;
            padding-left:0.5vw;
            box-sizing:border-box;
            text-align: center;
            font-size: 3.5vw;
            font-weight: 500;
            box-sizing: border-box;
            font-family: Times, TimesNR, 'New Century Schoolbook', Georgia,
              'New York', serif;
          }
        }
      }
    }
    .activityDesc {
      .activityName {
        height: 10vw;
        line-height: 10vw;
        .activityTit {
          color: var(--mRed);
        }
      }

      .activityDescContent {
        line-height: 4.2vw;
        font-size: 3.8vw;
        color: #333;
      }
    }
    .voteNums {
      display: flex;
      justify-content: space-around;
      margin: 3vw 0 2vw;
      > div {
        width: 40vw;
        text-align: center;
        > span {
          &.num {
            height: 5.8vw;
            line-height: 5.8vw;
            font-size: 4.3vw;
            color: var(--mRed);
            font-weight: bold;
          }
          &.txt {
            height: 4.3vw;
            line-height: 4.3vw;
            font-size: 3.6vw;
            color: #000;
          }
          display: block;
        }
      }
    }
    // 投票 | 分享
    .btnList {
      padding: 3vw 0;
      display: flex;
      justify-content: space-around;
      > div {
        width: 37vw;
        text-align: center;
        height: 11vw;
        line-height: 11vw;
        font-size: 4.5vw;
        border-radius: 5.8vw;
        font-weight: bold;
        box-sizing: content-box;
      }
      .voteBtn {
        color: #fff;
        border: none;
        background-color: var(--mRed);
        &.isVoted {
          color: #fff;
          background-color: #ccc;
          border: 2px solid #ccc;
        }
      }
      .shareBtn {
        color: var(--mRed);
        background-color: #fff;
        border: 2px solid currentColor;
      }
    }
    // 投票人列表
    .votedUsers {
      margin: 3vw 0;
      .votedUsersList {
        line-height: 10.8vw;
        text-align: center;
        > div {
          display: inline-block;
          width: 10.8vw;
          height: 10.8vw;
          text-align: center;
          > img {
            width: 8vw;
            height: 8vw;
            border-radius: 50%;
            overflow: hidden;
          }
        }
      }
      .votedTxt {
        text-align: center;
        height: 4.8vw;
        line-height: 4.8vw;
        font-size: 3.6vw;
        color: #333;
        letter-spacing: 1px;
        .moreVotedList {
          color: var(--mRed);
        }
      }
    }
  }
  .itemOnlyBottom {
    width: 100%;
    height: 12.31vw;
    background: white;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    .bottomReplay {
      display: inline-block;
      width: 36.92vw;
      height: 7.5vw;
      line-height: 7.5vw;
      border-radius: 4vw;
      margin-left: 4vw;
      background: rgb(245, 245, 245);
      color: #666;
      .iconWshuru {
        font-size: 4vw;
        margin-left: 4vw;
      }
      i:nth-child(2) {
        font-size: 3vw;
        font-style: normal;
        margin-left: 2vw;
      }
    }
    .likeRight {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .selfOne {
        width: 16vw;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        i {
          font-weight: 600;
          font-size: 5.833vw;
          &.icon-redxin-copy {
            color: red;
          }
          &.icon-wjx-shixin {
            color: #fdd900;
          }
        }
      }
      .selfComment {
        margin-right: 4vw;
        .postItem-meta2-replay {
          .myLike {
            color: var(--noLikeXin);
            font-weight: 600;
            font-size: 5.833vw;
          }
          .count {
            font-size: 3vw;
            vertical-align: text-top;
            color: var(--noLikeXin);
            // color:#999;
          }
        }
      }
    }
  }
  // 投票的人列表(全部)
  .votedUserListTab {
    &.fadeLeft-enter, &.fadeLeft-leave-to{
      left: 100vw;
    }
    &.fadeLeft-enter-active, &.fadeLeft-leave-active{
      transition: all 0.35s ease-in-out;
    }
    .votedHeader {
      padding: 0 3vw;
      height: 12vw;
      line-height: 12vw;
      display: flex;
      box-shadow: 0 0 1px #eee;
      .backBtn, .right{
        width: 12vw;
        text-align: center;

      }
      .tit{
        flex: 1;
        text-align: center;
      }
    }
    position: fixed;
    z-index: 10001;
    height: 100vh;
    width: 100vw;
    left: 0;
    top: 0;
    background-color: #fff;
    .votedUserList{
      margin:5vw;
      height: 75vh;
      width: 100%;
      overflow-y: scroll;
      font-size: 0;
      .votedUserItem {
        display: inline-block;
        width: 18vw;
        height: 18vw;
        text-align: center;
        img {
          display: inline-block;
          width: 14.4vw;
          height: 14.4vw;
          border-radius: 50%;
          overflow: hidden;
        }
      }
    }
    .setVotedListBtn{
      margin: 4vw auto 0;
      width: 46vw;
      height: 11vw;
      line-height: 11vw;
      font-size: 3.9vw;
      text-align: center;
      color: rgb(255, 39, 66);
      border-radius: 4vw;
      border: 2px solid currentColor;
      box-sizing: content-box;
    }
  }
}
</style>
