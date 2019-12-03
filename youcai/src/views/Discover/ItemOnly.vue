<template>
  <div class="itemOnlyPage"
       v-if="postDetail">
    <ReplayConfirm v-if="isShowReplayConfirm"></ReplayConfirm>
    <userInput :toUser='toUser'
               v-if='userInputShow'
               :userInputContent='userInputContent'
               :objectId='postDetail.postId'
               :placeholder="placeholder"
               :type="commentsType"
               @updateComments='updateComments'
               @hideUserInput='hideUserInput' />
    <!-- 二级回复 -->
    <userInputTwo :toUser='toTwoUser'
                  v-if='twoReplayShow'
                  :userInputContent='TwoInputContent'
                  :objectId='postDetail.postId'
                  :placeholder="Twoplaceholder"
                  :type="TwocommentsType"
                  @updateComments='updateTwoComments'
                  @hideUserInput='hideTwoReplay' />
    <div class="itemOnlyHead">
      <div class="postMassage">
        <Avatar :item='postDetail'
                :size=4
                :isItemOnly="true"></Avatar>
        <span class="userName"
              @click="go.user(postDetail.userId)">{{postDetail.nickName}}</span>
        <div class="itemOnlyFollow">
          <div class="folowWrap">
            <BtnFollow :item="postDetail" />
          </div>
          <span class="itemShare"
                @click.stop="showShare(postDetail)">
            <i class="iconWanwan iconWweixinfenxiang"></i>
          </span>
        </div>
      </div>
      <div class="morePost"></div>
    </div>
    <div class="itemOnlyBottom">
      <span class="bottomReplay"
            @click="userReplay(true)">
        <i class="iconWshuru iconWanwan"></i>
        <i>说点什么...</i>
      </span>
      <div class="likeRight">
        <div class="selfLike selfOne"
             v-if="postDetail">
          <BtnLike :operateType="2"
                   :objectId="postDetail.postId"
                   :item="postDetail"
                   :objectType="0"
                   :btnWeight='1'
                   numPos="sup"
                   :size="2"></BtnLike>
        </div>
        <div class="selfCollect selfOne"
             v-if="postDetail">
          <BtnLike :operateType="1"
                   :objectId="postDetail.postId"
                   :item="postDetail"
                   :objectType="0"
                   :btnWeight='1'
                   numPos="sup"
                   :size="2"></BtnLike>
        </div>
        <div class="selfComment selfOne"
             @click="gotoComment">
          <div class='postItem-meta2-replay'>
            <i class="icon-icon_subinfobox1 icon-xiaoxi1 icon iconfont myLike"></i>
            <span class="count"
                  v-show="postDetail.countReply">{{postDetail.countReply}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="itemOnlyMain">
      <scroll ref="scroll"
              :data="items"
              :bounce='bounce'
              :scrollbar="scrollbarObj"
              :pullDownRefresh="pullDownRefreshObj"
              :pullUpLoad="pullUpLoadObj"
              :startY="parseInt(startY)"
              @pullingDown="onPullingDown"
              @pullingUp="onPullingUp">
        <ItemContent :item="postDetail"
                     @userReplay="userReplay"
                     :replayList="replayList"
                     :showMoreReplay="showMoreReplay"
                     @moreReplay="moreReplay"
                     :newTwoComment="newTwoComment"></ItemContent>
        <div class="relevantRecomment">
          <span class="title">相关推荐</span>
          <waterfall :addItems='addItems'
                     :isRefresh='isRefresh'
                     @render='render'
                     @renderEnd='renderEnd'></waterfall>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import scrollMixin from '@/components/scroll/scrollMixin'
import commentsMixin from '@/components/comments/commentsMixin'
import Avatar from '@/components/Avatar'
import BtnLike from '@/components/Btn/BtnLike'
import userInputTwo from '@/components/comments/userInputTwo'
import ReplayConfirm from '@/views/Discover/components/ReplayConfirm'
import scroll from '@/components/scroll/scroll'
import userInput from '@/components/comments/userInput'
import BtnFollow from '@/components/Btn/BtnFollow'
import ItemContent from './components/ItemOnlyFull.vue'
import waterfall from '@/components/Waterfall/Waterfall'
export default {
  mixins: [scrollMixin, commentsMixin],
  components: {
    Avatar,
    scroll,
    userInput,
    BtnFollow,
    BtnLike,
    ItemContent,
    waterfall,
    ReplayConfirm,
    userInputTwo
  },
  data () {
    return {
      onePage: 1, // 第一条数据
      oneSize:1,
      postDetail: null,
      pageIndex: 1, 
      pageSize: 10,
      bounce:{'top': false, 'left':false, 'right':false, 'bottom': true}, // scroll参数start
      startY: 0,
      pullDownRefresh: false,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: true,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更多推荐了', // scroll参数end
      curPage: 2, // scroll 数据参数start
      relevantSize: 16,
      items: [],
      addItems: [],
      isRefresh: false,
      isRenderEnd: false, // scroll 数据参数start
      isLoading: false,
      type: 0,
      startTime: 0,
      endTime: 0
    }
  },
  created () {
    this.getPostDetail()
    this.getRelevantList()
    this.$share.close()
    // this.setStartTime()
  },
  beforeDestroy () {
    // this.setEndTime()
  },
  computed: {
    ...mapState(['user', 'twoReplayShow', 'replayConfirm', 'isShowReplayConfirm']),
    postId () {
      return this.$route.params.postId
    },
    Twoplaceholder () {
      return '回复.' + this.replayConfirm.nickName
    }
  },
  watch: {
    postId () {
      this.pageIndex = 1
      this.replayList = []
      this.addItems = []
      this.getPostDetail()
      this.getReplayList()
      this.getRelevantList()
      let itemContentPage = document.getElementById('itemContentPage')
      let scroll = this.$refs.scroll
      scroll.scrollToElement(itemContentPage)
    }
  },
  methods: {
    ...mapMutations(['updateReplayState', 'updateShowConfirm', 'updateMyPage', 'updateNeedBack']),
    // 告知浏览时间逻辑
    setStartTime () {
      this.startTime = (new Date()).getTime()
    },
    setEndTime () {
      this.endTime = (new Date()).getTime()
      this.tellLookTime()
    },
    tellLookTime () {
      let me = this
      let readTime = parseInt((this.endTime - this.startTime)/ 1000)
      if (readTime >= 1) {
        let data = {
          postId: this.postDetail.postId,
          ReadTime: readTime
        }
        me.api.process({
          url: 'PostDetails',
          data: data,
          success: function() {
            console.log('tellTime')
          },
          error: function(err){
            console.log(err)
          }
        })
      }
    },
    // 获取数据逻辑
    getPostDetail () { // 获取主题数据(第一条)
      var me = this
      me.api.get({
        url: `PostDetails?PostId=${me.postId}&PageIndex=${me.onePage}&PageSize=${me.oneSize}`,
        success: function (res) {
          me.postDetail = res[0]
        },
      })
    },
    /*
    * 以下是 waterfall相关函数
    */
    getRelevantList () {
      let me = this
      me.isLoading = true
      me.api.get({
        url: `PostDetails?PostId=${me.postId}&PageIndex=${me.curPage}&PageSize=${me.relevantSize}`,
        success: function(res) {
          if (me.curPage === 2) {
            me.isRefresh = true
          }
          me.addItems = res
        },
        error: function() {},
        complete: function() {
          me.isLoading = false
        }
      })
    },
    onPullingDown() {
      this.curPage = 1
      this.getRelevantList()
    },
    onPullingUp() { // 更新数据
      if (this.isRenderEnd) {
        this.curPage++
        this.getRelevantList()
      }
    },
    render () { // 开始渲染瀑布流
      this.isRefresh = false
    },
    renderEnd (data) { // 是否渲染完毕
      this.isRenderEnd = data
      if (data) {
        if (this.curPage === 2) {
          this.items = []
        }
        this.items = this.items.concat(this.addItems)
        this.$refs.scroll && this.$refs.scroll.forceUpdate()
      }
    },
    showShare (item) { // 分享
      // 判断是不是自己的,自己的东西可以删除
      let isDelete = this.postDetail.userId === this.$store.state.user.userId
      if (item.userId === this.$store.state.user.userId) { // 表示我的帖子
        let obj = {
                isRefreshPost: true
              }
        this.updateMyPage(obj)
      }
      let innerObj = {
        name: this.$route.name,
        objectId: item.postId
      }
      if (this.type === 0) {
        this.$share.open(item, isDelete, 'discover', this.$router.currentRoute.fullPath, innerObj)
      } else {
        this.$share.open(item, isDelete, 'video', this.$router.currentRoute.fullPath, innerObj)
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .itemOnlyPage{
    width:100%;
    .itemOnlyHead{
      height: 13.34vw;
      width:100vw;
      position:fixed;
      background:white;
      top:0;
      left:16.48vw;
      z-index:100;
      .postMassage{
        width:100%;
        height:100%;
        display:flex;
        align-items: center;
        .userAvatar{
          width:9.07vw;
          height:9.07vw;
          border-radius: 50%;
          border:1px solid rgb(243,243,243);
          img{
            width:100%;
            height:100%;
          }
        }
      .right{
        position: absolute;
        bottom:1.7vw;
        left:5vw;
        z-index:12;
        background:white;
        box-shadow: 0 0 1px #eeee;
        width: 5.5vw;
        height:5.5vw;
        border-radius: 50%;
        display:flex;
        .one{
          margin:auto;
          width:4.68vw;
          height:4.68vw;
          border-radius: 50%;
          background: linear-gradient(to right bottom,#e37782, #f56b80,#ff5363,#ff405b, #fc3f58);
          color:white;
          line-height: 5vw;
          text-align: center;
          // display:flex;
          // justify-content: center;
          // align-items: center;
          font-size:3.5vw;
          font-weight: 500;
          box-sizing: border-box;
          font-family: Times, TimesNR, 'New Century Schoolbook', Georgia, 'New York', serif;
        }
    }
    .authentication {
    &.hasABorder{
      padding: 0.5vw;
    }
    position: absolute;
     bottom:1.7vw;
     left:5vw;
    width: 5vw;
    height: 5vw;
    border-radius: 50%;
    color: white;
    box-sizing: border-box;
    font-size: 3.7vw;
    font-weight: 500;
    font-family: Times, TimesNR, 'New Century Schoolbook', Georgia, 'New York', serif;
    background: #fff;
    overflow: hidden;
    .authenticationTxt{
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: -webkit-gradient(linear, left top, right bottom, from(#e37782), color-stop(#f56b80), color-stop(#ff5363), color-stop(#ff405b), to(#fc3f58));
      background: linear-gradient(to right bottom, #e37782, #f56b80, #ff5363, #ff405b, #fc3f58);
    }
  }
        .userName{
          margin-left:2.96vw;
          font-size:3.88vw;
          font-weight: 500;
          width:40vw;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        }
        .itemOnlyFollow{
          // width:28vw;
          height:100%;
          display:flex;
          align-items: center;
          margin-left:2vw;
          justify-content: space-between;
          .folowWrap{
            width:17vw;
          }
          .itemShare{
            margin-right:2vw;
            width:10vw;
            text-align: center;
            .iconW7{
              font-size:4.7vw;
              font-weight: 500;
            }
            .iconWweixinfenxiang{
              font-size:5vw;
              font-weight: 500;
              background:rgb(59, 187, 7);
              width:8vw;
              height:8vw;
              text-align: center;
              line-height:8vw;
              border-radius: 50%;
              display:inline-block;
              color:white;
            }
          }
        }
      }
      
    }
    .itemOnlyBottom{
      width:100%;
      height:12.31vw;
      background:white;
      position:fixed;
      bottom:0;
      left:0;
      z-index:2;
      display:flex;
      align-items: center;
      .bottomReplay{
        display:inline-block;
        width:36.92vw;
        height:7.5vw;
        line-height:7.5vw;
        border-radius: 4vw;
        margin-left:4vw;
        background:rgb(245, 245, 245);
        color:#666;
        .iconWshuru{
          font-size:4vw;
          margin-left:4vw;
        }
        i:nth-child(2) {
          font-size:3vw;
          font-style: normal;
          margin-left:2vw;
        }
      }
      .likeRight{
        flex:1;
        display:flex;
        align-items: center;
        justify-content:flex-end;
        .selfOne{
          width:16vw;
          height:100%;
          display:flex;
          align-items: center;
          justify-content: flex-end;
          i {
            font-weight: 500;
            font-size: 5.833vw;
            &.icon-redxin-copy {
              color: red;
            }
            &.icon-wjx-shixin {
              color: #fdd900;
            }
          }
        }
        .selfComment{
          margin-right:4vw;
          .postItem-meta2-replay {
            .myLike{
              color:var(--noLikeXin);
              font-weight: 600;
              font-size: 6.833vw;
            }
            .count{
              font-size: 4vw;
              vertical-align: text-top;
              color:var(--noLikeXin);
              // color:#999;
              margin-top:-1.7vw;
              display:inline-block;
            }
          }
        }
      }
    }
    .itemOnlyMain{
      height:calc(100vh - 13.34vw - 12.31vw);
      overflow: hidden;
      background: #f4f9fa;
      .relevantRecomment{
        width:100%;
        box-sizing:border-box;
        background:#f4f9fa;
        .title{
          display:inline-block;
          height:12.03vw;
          line-height:12.03vw;
          font-size:3.7vw;
          color:#828785;
          margin-left:4vw;
        }
      }
    }
  } 
</style>
