<template>
  <transition name='fadeUp'>
    <div class="commentsPlate"
         :style="{'height': height + 'px'}">
      <ReplayConfirm v-if="isShowReplayConfirm"></ReplayConfirm>
      <userInput :toUser='toUser'
                 v-if='userInputShow'
                 :userInputContent='userInputContent'
                 :objectId='commentsId'
                 :placeholder="placeholder"
                 :type="commentsType"
                 @updateComments='updateComments'
                 @hideUserInput='hideUserInput' />
      <div class='commentsPlateMask'
           @click='hideCommentsPlate'
           :style="{'height':top}"></div>
      <div class='commentsPlateContent'
           :style="{'height': height * 0.75 + 'px'}">
        <h3>共 {{countReply}} 条评论
          <span @click="hideCommentsPlate">
            <i class="iconWanwan iconWquxiao activityNotice"></i>
          </span>
        </h3>
        <div class="commentsList">
          <scroll ref="scroll"
                  :data="items"
                  :scrollbar="scrollbarObj"
                  :pullDownRefresh="pullDownRefreshObj"
                  :pullUpLoad="pullUpLoadObj"
                  :startY="parseInt(startY)"
                  @pullingDown="onPullingDown"
                  @pullingUp="onPullingUp"
                  class="my-follow">
            <ul>
              <commentsItem v-for="(item, index) in items"
                            :item='item'
                            :key='index'
                            @reComment='reComment'
                            :postDetail="OneItem"
                            :newTwoComment="newTwoComment"
                            :replayList="items"
                            :isMusic="isMusic" />
            </ul>
          </scroll>
        </div>
        <!-- <UserInput :objectId = 'commentsId' :type='commentsType' @updateComments='updateComments' /> -->
        <div class='userInputComments'
             v-if="isOneLevel">
          <p class="UserAvator"><img :src="userAvatar"
                 alt=""></p>
          <div class="inputWrap">
            <!-- <input v-if='toUser' :placeholder="'回复:'+toUser.userName" type="text"> -->
            <input placeholder="默默收藏不如评论"
                   v-model='userInputContent'
                   ref='inputContent'
                   type="text"
                   readonly
                   @click='setUserInputShow(true)'>
          </div>
          <p class="sendComments"
             @click='setUserInputShow(true)'>发送</p>
        </div>
        <userInputTwo :toUser='toTwoUser'
                      v-if='twoReplayShow'
                      :userInputContent='TwoInputContent'
                      :objectId='commentsId'
                      :placeholder="Twoplaceholder"
                      :type="commentsType"
                      @updateComments='updateTwoComments'
                      @hideUserInput='hideTwoReplay' />
      </div>
    </div>
  </transition>
</template>
<script>
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
// import UserInput from './userInputComments'
import commentsItem from './commentsItem'
import { mapState, mapMutations } from 'vuex'
import userInput from '@/components/comments/userInput'
import userInputTwo from '@/components/comments/userInputTwo'
import ReplayConfirm from '@/views/Discover/components/ReplayConfirm'
export default {
  mixins: [scrollMixin],
  components: {
    scroll,
    userInput,
    commentsItem,
    userInputTwo,
    ReplayConfirm,
  },
  props: {
    commentsId: {
      type: String,
      required: false
    },
    commentsType: {
      type: Number,
      default: 0
    },
    countReply: {
      type: Number,
      default: 0
    },
    OneItem: {
      type: Object,
      default: null
    },
    isMusic: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    countReply (newV) {
      return newV
    }
  },
  data () {
    return {
      pullDownRefresh: false,
      pullUpLoad: true,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更过数据了',
      items: [],
      curPage: 1,
      pageSize: 10,
      totalCount: this.countReply,
      height: window.innerHeight,
      top: window.innerHeight * 0.25 + 'px',
      userInputShow: false,
      userInputContent: '',
      placeholder: '默默收藏不如评论',
      toUser: '',
      // 二级评论
      isOneLevel: true, // 表示显示一级评论输入框
      toTwoUser: '',
      TwoInputContent: '',
      TwocommentsType: 0,
      newTwoComment: {},
    }
  },
  computed: {
    ...mapState(['hasMask', 'user', 'twoReplayShow', 'replayConfirm', 'isShowReplayConfirm']),
    userAvatar () {
      return this.$store.state.user.avatar || 'http://webapp.szwanwan.com/img/default/defaultavatar.png'
    },
    userName () {
      return this.$store.state.user.nickName
    },
    item () {
      return {
        userId: this.$store.state.userId,
        content: this.userInputContent,
        objectId: this.commentsId,
        objectType: this.commentsType,
        createTime: new Date(),
        nickName: this.userName
      }
    },
    Twoplaceholder () {
      return '回复.' + this.replayConfirm.nickName
    }
  },
  mounted () {
    this.getCommentsList()
    console.log('打印这个id', this.commentsId)
    console.log('这个帖子是多少啊', this.OneItem)
  },
  methods: {
    ...mapMutations({
      'setCountReply': 'setCountReply',
      'setMask': 'setMask',
      'setSubMask': 'setSubMask',
      'updateReplayState': 'updateReplayState',
      'updateShowConfirm': 'updateShowConfirm'
    }),
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
      // this.setSubMask(data)
    },
    hideUserInput (content) {
      this.userInputContent = content
      this.setUserInputShow(false)
    },
    getCommentsList () {
      let me = this
      me.api.get({
        url: `Comment?ObjectId=${me.commentsId}&PageIndex=${me.curPage}&PageSize=${me.pageSize}`,
        success: function (res) {
          me.items = me.items.concat(res)
        },
        complete: function () {
          me.$refs.scroll && me.$refs.scroll.forceUpdate()
        }
      })
    },
    hideCommentsPlate () {
      this.$emit('setCommentsPlate', false)
    },
    // emitUpcountReply () {
    //   this.$emit('upcountReply')
    // },
    updateComments (data) {
      console.log('打印这个data', data)
      if (data) {
        this.items.unshift(data)
        // this.setCountReply(this.countReply + 1)
        this.$emit('upcountReply')
        this.setUserInputShow(false)
      }
      this.setUserInputShow(false)
      this.userInputContent = ''
      this.toUser = ''
      this.$refs.scroll && this.$refs.scroll.forceUpdate()
      // this.curPage = 1
      // this.items = []
      // this.getCommentsList()
    },
    reComment (data) {
      console.log(data)
      this.toUser = data.userId
      this.setUserInputShow(true)
      // this.$emit('reComment', data)
    },
    onPullingDown () {
    },
    onPullingUp () {
      // 更新数据
      this.curPage++
      this.getCommentsList()
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
    }
  }
}
</script>
<style lang="less">
.commentsPlate{
  position: fixed;
  z-index: 10001;
  background: transparent;
  width:100vw;
  // height: 100vh;
  top: 0;
  left:0;
  box-shadow: 0 0 3px #e1e1e1;
  &.fadeUp-enter-active, &.fadeUp-leave-acitve{
    transition: all 0.25s ease-in-out;
  }
  &.fadeUp-enter, &.fadeUp-leave-to{
    transform: translate3d(0, 100%, 0);
  }
  .commentsPlateMask{
    width: 100%;
    background: transparent;
  }
//   overflow:hidden;
  .commentsPlateContent{
    position: relative;
    width: 100vw;
    background:#fff;
    h3{
      position: relative;
      height:12.5vw;
      line-height:12.5vw;
      font-size: 4vw;
      color: #393939;
      text-align:center;
      font-weight: bold;
      border-bottom: 1px solid #e5e5e5;
      background: #fff;
      span{
        position: absolute;
        width: 12.5vw;
        height: 12.5vw;
        right:0;
        top: 0;
        text-align: center;
        line-height:12.5vw;
        font-size: 4vw;
        .activityNotice{
          color:#ccc;
          font-size:4vw;
        }
      }
    }
    .commentsList {
      position: absolute;
      width: 100%;
      top: 12.5vw;
      bottom: 15vw;
      left: 0;
      background: #fff;
      ul{
        overflow: hidden;
      }
    }
    .userInputComments{
      position: absolute;
      width: 100vw;
      bottom: 0;
      left: 0;
      display:flex;
      height: 15vw;
      line-height:15vw;
      box-sizing: border-box;
      box-shadow: 0 0 3px #e0e0e0;
      border-top: 1px solid #efefef;
      background:#fff;
      overflow: hidden;
      .sendComments{
        height: 100%;
        width: 12vw;
        text-align: center;
        color: #6592ac;
        font-size: 4vw;
        font-weight: bold;
      }
      .inputWrap{
        flex:1;
        display: inline-block;
        vertical-align: top;
        padding: 0 2vw;
        box-sizing: border-box;
        margin-top: 2.5vw;
        input{
          width: 100%;
          line-height:10vw;
          display: inline-block;
          vertical-align: top;
          outline:none;
          height: 10vw;
          padding: 0 4vw;
          font-size: 3.8vw;
          box-sizing:border-box;
          border-radius: 5vw;
          border: 1px solid #cecece;
        }
      }
      .UserAvator{
        margin-left: 3vw;
        margin-top: 2.5vw;
        width: 9.9vw;
        height: 9.9vw;
        line-height: 10vw;
        border-radius: 50%;
        box-shadow: 0 0 1px #e0e0e0;
        overflow: hidden;
        img{
          width:100%;
          height:100%;
        }
      }
    }
  }
}
</style>
