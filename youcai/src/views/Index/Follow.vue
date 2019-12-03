<template>
  <div class="followBig"
       v-show='show'>
    <commentsList v-if='hasMask && commentsListShow'
                  :countReply='currentItem.countReply'
                  @upcountReply='upcountReply'
                  @setCommentsPlate='setCommentsListShow'
                  :commentsType='commentsType'
                  :commentsId='commentsId'
                  :OneItem="OneItem"></commentsList>
    <userInput v-if='hasMask && userInputShow'
               :userInputContent='userInputContent'
               :objectId='commentsId'
               :placeholder="placeholder"
               :type="commentsType"
               @updateComments='updateComments'
               @hideUserInput='hideUserInput' />
    <div class="no_data"
         style="padding-top: 15vw;"
         v-if="isLoad">
      <div>
        <Loading></Loading>
      </div>
    </div>
    <div class="noFollowUser"
         v-if="isFail">
      <div v-if="isShowRecommend">
        <Recommend @hiddleRecommend="hiddleRecommend"></Recommend>
      </div>
    </div>
    <!-- <div class="endFile">
      <NotFound failTitle="还没有关注的人哦" v-show="isShowEndFail"></NotFound>
  </div> -->
    <div class='followWrap'>
      <scroll ref="scroll"
              :data="items"
              :scrollbar="scrollbarObj"
              :pullDownRefresh="pullDownRefreshObj"
              :pullUpLoad="pullUpLoadObj"
              :startY="parseInt(startY)"
              @pullingDown="onPullingDown"
              @pullingUp="onPullingUp"
              @scroll='subScroll'
              @scroll-end='subScrollEnd'
              :listenScroll='true'
              :listenScrollEnd='true'
              :preventDefault="true"
              :stopPropagation='true'
              :probeType='1'>
        <div class="postItemContainer-list">
          <PostItemFull @setCommentsList='setCommentsListShow(true, item)'
                        @setCommentsShow='setCommentsShow'
                        v-for="item in items"
                        :key="item.Id"
                        :item="item"
                        :likes="likes"
                        :favs="likes"
                        :isFollowPage="isFollowPage" />
        </div>
      </scroll>
    </div>
  </div>
</template>
<script>
import PostItemFull from '@/components/PostItemFull'
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
import Loading from '../../components/requestState/Loading'
import Recommend from '../../components/RecommendFollow/Recommend'
import commentsList from '@/components/comments/commentsList'
import userInput from '@/components/comments/userInput'
import { mapState, mapMutations } from 'vuex'
export default {
  mixins: [scrollMixin],
  name: 'follow',
  components: {
    PostItemFull,
    scroll,
    Loading,
    Recommend,
    commentsList,
    userInput,
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isFollowPage: true, // 表示是关注页
      isShowEnderror: false, //是否显示最后失败内容
      failTitle: '还没有关注的人哦!', 
      isShowRecommend: true,
      placeholder: '留下您的精彩评论吧！', // 评论
      userInputShow: false,
      userInputContent: '', // 评论End
      isLoad: true,
      isFail: false,
      pullDownRefresh: true,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: true,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更多数据了',
      isLoading: true,
      likes: [],
      likeReplys: [],
      userComment: '', // 用户输入的评论
      focusDetail: [], // 首页关注页的数据
      commentData: [], // 评论数据
      isShare: false,
      items: [],
      curPage: 1,
      pageSize: 3,
      noData: false,
      commentsListShow: false, //显示评论列表
      commentsType: 0,
      commentsId: '',
      currentItem: [],
      OneItem: {} // 表示一个帖子
    }
  },
  computed: {
    ...mapState({
      'hasMask': 'hasMask'
    })
  },
  watch: {
    formLoading: function (isLoading) {
      let me = this
      me.$msg.updateLoading(isLoading)
    },
    searchTitle () {
      console.log('discover数据改变,根据要搜索的字段去请求后台接口', this.searchTitle)
    },
    show () {
      if (this.show && this.curPage === 1) {
        this.getData()
      }
    }
  },
  created () {
    this.getData()
    console.log('哈哈哈')
  },
  activated () {
    console.log('我再次回来')
  },
  methods: {
    ...mapMutations({
      'setCountReply': 'setCountReply',
      'setMask': 'setMask'
    }),
    subScroll (pos) {
      this.$emit('scroll', pos)
    },
    subScrollEnd (pos) {
      this.$emit('scroll-end', pos)
    },
    /**
     * 删除推荐
     */
    hiddleRecommend () {
      this.isShowRecommend = false
      // this.isShowEndFail = true
      // this.isFail = false
    },
    setUserInputShow (data) {
      this.userInputShow = data
      this.setMask(data)
    },
    setCommentsShow (item) {
      this.commentsId = item.postId
      this.currentItem = item
      this.setUserInputShow(true)
    },
    updateComments () {
      this.currentItem.countReply++
      this.setUserInputShow(false)
    },
    hideUserInput (content) {
      this.userInputContent = content
      this.setUserInputShow(false)
    },
    // 获取关注页数据
    getData () {
      let me = this
      // me.isLoading = true
      me.api.get({
        url: `PostAttention?PageIndex=${me.curPage}&PageSize=${me.pageSize}`,
        success: function (res) {
          me.curPage === 1 && (me.items = [])
          me.items = me.items.concat(res)
          me.isLoading && me.items.length && (me.isLoading = false)
          me.likes = res.likes
          if (me.items.length > 0) {
            me.isLoad = false
            me.isFail = false
          } else if (me.items.length === 0) {
            me.isLoad = false
            me.isFail = true
          }
        },
        error: function (res) {
          me.$msg.showError(res.msg)
        },
        complete: function () {
          // me.isLoading = false
          me.$nextTick(() => {
            me.$refs.scroll && me.$refs.scroll.forceUpdate()
          })
        }
      })
    },
    updateLikes (likes) {
      this.likes = likes
    },
    updateLikeReplys (likeReplys) {
      this.likeReplys = likeReplys
    },
    getSaveNum (id) {
      var me = this
      let formData = new FormData()
      formData.append('id', id)
      me.api.process({
        file: 'Post',
        method: 'GetItem',
        data: formData,
        success: function (res) {
          this.commentData = res.replys
          me.focusDetail.forEach(item => {
            if (item.Id === id) {
              me.$set(item, 'saveNumber', res.saveNumber)
              if (res.saves.indexOf(id) !== -1) {
                me.$set(item, 'isFocus', true)
              } else {
                me.$set(item, 'isFocus', false)
              }
            }
          })
        },
        error: function (res) {
          me.$msg.showError(res.msg)
        },
        complete: function () {
          me.isLoading = false
        }
      })
    },
    allComment (Id) {
      this.focusDetail.forEach(ele => {
        if (ele.Id === Id) {
          this.$router.push({ name: 'discuz', params: { id: ele.Id } })
        }
      })
    },
    InputComment (Id) {
      this.focusDetail.forEach(item => {
        if (Id === item.Id) {
          let userMsg = {
            'userAvator': '/assets/images/avatar.jpg',
            'userName': '用户02',
            'commentCount': '12',
            'commentDetail': this.userComment
          }
          if (this.userComment.length > 0) {
            // 用户评论的信息传入到discuz页面
            this.$router.push({ name: 'discuz', params: { id: this.item.Id, userMsg } })
          }
        }
      })
    },
    increaseReplay: function () {
      this.$router.go(0)
    },
    onPullingDown () {
      this.curPage = 1
      this.getData()
    },
    onPullingUp () {
      // 更新数据
      this.curPage++
      this.getData()
    },
    // 设置评论
    setCommentsListShow (data, item) {
      if (item) {
        this.commentsId = item.postId
        // this.countReply = item.countReply
        this.OneItem = item // 表示一个帖子
        this.setCountReply(item.countReply)
      }
      item && (this.currentItem = item)
      this.commentsListShow = data
      this.setMask(data)
    },
    upcountReply () {
      this.currentItem.countReply++
    }
  }
}
</script>

<style lang="less" scope>
.followBig{
  // margin-top: 22vw;
  .noFollowUser{
    margin-bottom:50vw;
  }
  .endFile{
  }
}
.followWrap{
  position: relative;
  height: calc(100vh - 11.03vw);
  overflow: hidden;
  .pulldown-wrapper {
    position: absolute;
    width: 100%;
    left: 0;
    display: flex;
    justify-content:center;
    align-items:center;
    transition: all;
    .after-trigger{
      margin-top: 10px;
    }
  }
  .pullup-wrapper{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 0;
  }
}
.follow_container{
  position: relative;
  top:22vw;
  .page__bd{
    margin-top:3vw;
    .publishComment{
      width:80%;
      margin:auto;
      border-bottom:1px solid rgb(243, 243, 243);
      .user_comment{
        width:70vw;
        margin-left:2vw;
        height:7vw;
        border:none;
        outline: none;
      }
    }
  }
  .follow_top{
    width:100%;
    height:10vw;
    position: relative;
    .follow_avator{
      width:10vw;
      height:10vw;
      overflow: hidden;
      margin-left:5vw;
      border-radius:50%;
      img{
        width:100%;
        height:auto;
      }
    }
    .follow_user{
        display:inline-block;
        position:absolute;
        top:2vw;
        left:17vw;
        font-size:4vw;
    }
    .follow_share{
        display:inline-block;
        width:10vw;
        position:absolute;
        top:0;
        right:0;
        font-weight: bold;
    }
  }
  .weui-panel {
    width: 100%;
    .itemcontent{
      width: 90%;
      margin: auto;
      margin-top:4vw;
      margin-bottom:2vw;
      // 下面是让单词强行换行
      word-wrap: break-word;
      word-break: break-all;
       .seeMore{
          font-size:4.1vw;
          font-weight: bold;
        }
    }
  }
  .wrap-contain {
    .unique-up {
      margin-top:0vw;
    }
  }
  .big{
    .icon-wjx-shixin:before {
    color:rgb(253, 217, 0) !important;
    }
    .icon-redxin-copy:before {
    color:red !important;
    }
  }
}
.noFollow{
  position:relative;
  top:50vw;
  text-align: center;
  .noFollowImg{
    width:50vw;
    margin:auto;
  }
  .noFollowDes{
    font-size:4vw;
    color:rgb(127,127,127);
    font-weight: bold;
  }
}
.refreshDes{
      display:inline-block;
      width:20vw;
      height:8vw;
      background-color:rgba(0,0,0,.8);
      color:white;
      border-radius: 3vw;
      text-align: center;
      line-height:8vw;
      padding-left:1vw;
      padding-right:1vw;
}
</style>
