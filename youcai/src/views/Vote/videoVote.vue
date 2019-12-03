<template>
  <div class="videoSwiperPage">
    <div :class="['voteBtn',{noVote:voteActivity.isEnd || isInitVote || myVote}]"
         @click="handleVote"
         v-if="$store.state.isShowVote">{{voteState}}</div>
    <commentsList v-if='hasMask && commentsListShow'
                  :countReply='currentItem.countReply'
                  @setCommentsPlate='setCommentsListShow'
                  @upcountReply='upcountReply'
                  :commentsType='commentsType'
                  :commentsId='commentsId'
                  :OneItem="currentItem"></commentsList>
    <userInput v-if='hasMask && userInputShow'
               :userInputContent='userInputContent'
               :objectId='commentsId'
               :placeholder="placeholder"
               :type="commentsType"
               @updateComments='updateComments'
               @hideUserInput='hideUserInput' />
    <div class="swiper-container"
         id="videoPageSwiper">
      <div class="videoSwiperItem swiper-wrapper">
        <div class="swiper-slide"
             v-for="(item, index) in items"
             :key="index">
          <viderPlayer :voteActivity='voteActivity'
                       @setUserInputShow='setUserInputShow'
                       @setCommentsListShow='setCommentsListShow'
                       :itemData='item'></viderPlayer>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import viderPlayer from '@/components/videoPlayer'
import commentsList from '@/components/comments/commentsList'
import userInput from '@/components/comments/userInput'
export default {
  name: 'videoVote',
  components: {
    viderPlayer,
    commentsList,
    userInput
  },
  computed: {
    ...mapState(['isPlaying', 'hasMask', 'hasSubMask']),
    player () {
      return this.$refs.videoPlayer.player
    }
  },
  data () {
    return {
      placeholder: '',
      myVote: false, // 表示是否投票
      voteState: '',
      isInitVote: '',
      currentItem: {},
      itemData: {},
      items: [],
      mySwiper: null,
      commentsListShow: false, // 显示评论列表
      commentsType: 0,
      commentsId: '',
      inputContent: '',
      userInputContent: '',
      userInputShow: false,
      initialSlide: 0,
      pageIndex: 1,
      pageSize: 4,
      voteId: this.$route.params.id,
      voteActivity: {}
    }
  },
  created () {
    this.getVoteDetail()
    if (this.isPlaying) {
      this.hasMusic = true
      this.setMusicPlay(false)
    }
    this.getVideoDetail()
    // 兼容全面屏 头部
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
      setVideo: 'setVideo',
      setMask: 'setMask'
    }),
    getVoteDetail () {
      let me = this
      me.api.get({
        url: `VoteDetails?VotePostId=${me.voteId}`,
        success: function (res) {
          me.voteActivity = res
          me.voteState = res.isVote ? '已投票' : '投票'
          me.isInitVote = res.isVote
        }
      })
    },
    /**
     * handleVote处理投票
     */
    handleVote () {
      if (this.isEnd) {
        this.$toast('投票活动已结束', 1200)
      } else if (this.voteActivity.isVote) {
        this.$toast('已投票', 1200)
      } else {
        let me = this
        me.api.process({
          url: 'Vote',
          data: {
            VotePostId: me.voteId,
            IsVote: true
          },
          success: function () {
            me.myVote = true
            me.voteState = '已投票'
          }
        })
      }
    },
    setCommentsListShow (data, item) {
      if (item) {
        this.currentItem = item
        this.commentsId = item.postId
      }
      this.commentsListShow = data
      this.setMask(data)
    },
    updateComments () {
      this.currentItem.countReply++
      this.setUserInputShow(false)
    },
    upcountReply () {
      this.currentItem.countReply++
    },
    hideUserInput (content) {
      this.userInputContent = content
      this.setUserInputShow(false)
    },
    setUserInputShow (data, item) {
      if (!this.$store.state.isInApp) {
        window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=io.dcloud.H50D8112A'
        return
      }
      if (!this.authentication.isLogin()) {
        this.go.login()
        return
      }
      if (item) {
        this.currentItem = item
        this.commentsId = item.postId
      }
      this.userInputShow = data
      this.setMask(data)
      if (!data) {
        setTimeout(() => {
          this.changeControl = data
        }, 350)
      } else {
        this.changeControl = data
      }
    },
    getVideoDetail () {
      let me = this
      me.api.get({
        url: `PostVideoDetails?PostId=${me.$route.params.id}`,
        success: function (res) {
          me.setVideo(res.video)
          me.items = me.items.concat(res)
        }
      })
    }
  }
}
</script>
<style lang='less'>
  .videoSwiperPage{
    width: 100vw;
    height: 100vh;
    .voteBtn{
      width:27.31vw;
      height:7.6vw;
      background-color: #ff2842;
      border-radius: 5vw;
      margin:auto;
      color:white;
      font-size:3.7vw;
      text-align:center;
      line-height:7.6vw;
      position:fixed;
      top:6vw;
      left:0;
      z-index:10000;
      right:0;
      margin:0 auto;
    }
    .noVote{
        background:rgb(154, 154, 154) !important;
    }
    .swiper-container {
        width: 100%;
        height: 100%;
    }
  }
</style>
