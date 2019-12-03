<script>
import { mapMutations} from 'vuex'
export default {
  data() {
    return {
      userInputShow: false,
      toUser: '',
      userInputContent: '',
      placeholder: '默默收藏不如评论',
      commentsType: 0,
      replayList: [],
      showMoreReplay: true,
      // 二级回复
      toTwoUser: '',
      TwoInputContent: '',
      TwocommentsType: 0,
      newTwoComment: {},
    }
  },
  created () {
    this.getReplayList()
  },
  methods: {
    ...mapMutations(['updateReplayState', 'updateShowConfirm']),
    handleReplayConfirm (data) {
      this.showReplayConfirm = data
    },
    hideUserInput () { // hideUserInput隐藏用户评论的评论框
      // this.$emit('setCommentsPlate', false)
      this.userInputShow = false
    },
    updateComments (data) { // updateComments更新一级评论数据
      if (data) {
        this.replayList.unshift(data)
        this.hideUserInput()
        this.postDetail.countReply++
      }
      this.userInputContent = ''
      this.toUser = ''
    },
    userReplay (data) { // userReplay用户评论
      this.userInputShow = data
    },
    /**
     * getReplayList得到回复列表数据
     */
    getReplayList () {
      let me = this
      me.api.get({
        url: `Comment?ObjectId=${me.postId}&PageIndex=${me.pageIndex}&PageSize=${me.pageSize}`,
        success: function (res) {
          me.replayList = me.replayList.concat(res)
          if (res.length === 0) {
            me.showMoreReplay = false
          }
        }
      })
    },
    moreReplay () { // moreReplay查看更多评论
      this.pageIndex++
      this.getReplayList()
    },
    gotoComment () { // gotoComment去到评论区
      let commentUl = document.getElementById('commentList')
      let scroll = this.$refs.scroll
      scroll.scrollToElement(commentUl,1000)
    },
    hideTwoReplay () { // 二级回复
      this.updateReplayState(false)
    },
    updateTwoComments (data) { // updateTwoComments更新二级评论列表
      if (data) {
        this.newTwoComment = data
        this.hideTwoReplay()
      }
      this.TwoInputContent = ''
      this.toTwoUser = ''
    }
  }
}
</script>
