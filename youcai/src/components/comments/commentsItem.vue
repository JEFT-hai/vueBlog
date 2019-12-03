<template>
  <li class="commentsItem borderB">
    <div class="avatar"
         @click='goUserPersonal()'>
      <img :src="userAvatar"
           alt
           v-if="item != null" />
    </div>
    <div class='discuzInfo'>
      <div class="oneReplayLike"
           v-if="!isMusic">
        <span class="oneLike">
          <i class="icon iconfont icon-icon_subinfobox1 myLike"
             :class="{'icon-redxin-copy': item.isLike, 'icon-favorites': !item.isLike}"
             @click="handleOneReplay"></i>
        </span>
        <span :class="['oneLikeCount',{oneLikeStyle: item.countLike > 9}]"><i v-show="item.countLike">{{item.countLike}}</i></span>
      </div>
      <p class="title">{{item.nickName}}<span class="authorStyle"
              v-if="item.userId === postDetail.userId">作者</span></p>
      <div class="comments"
           @click="showTwoInput(item)">
        <p v-html="item.content"
           class="commentContent"></p>
        <span class="createTime">{{format.shortDate(item.createTime)}}</span>
      </div>
      <div class="twoCommentWrap">
        <TwoComment :postDetail="postDetail"
                    :oneReplay="item"
                    :newTwoComment="newTwoComment"
                    :TwoCommentObj="TwoCommentObj"
                    @updateCount="updateCount"
                    v-if="isShow"></TwoComment>
      </div>
      <div class="MoreReplayList"
           v-if="item.countChildComment > 1 && isShowMoreTwo">
        <span class="TwoMoreReplay"
              @click="getMoreList(item)">查看更多回复</span>
      </div>
    </div>
  </li>
</template>
<script>
import { mapState, mapMutations } from 'vuex'

import TwoComment from '@/components/comments/TwoCommentList'
export default {
  data () {
    return {
      isLoading: false, 
      // 二级评论
      isShowMoreTwo: true, // 表示是否显示回复更多
      oneItem: null,
      pageIndex: 0,
      isShow: true,
      TwoCommentObj: {
         pageIndex: 0,
         oneItem: null
      },
      isStyle: false,
      isBlack: false
    }
  },
  components: {
    TwoComment
  },
  props: {
    item: {
      type: Object,
      default: null
    },
    postDetail : {
      type: Object, // 表示一个帖子
      default: null
    },
    // 二级评论
    newTwoComment: {
      type: Object
    },
    replayList: {
      type: Array
    },
    isMusic: {
      type: Boolean // 表示是否是声音的页
    }
  },
  computed: {
    ...mapState(['user']),
    userAvatar () {
      return this.item.avatar || 'http://webapp.szwanwan.com/img/default/defaultavatar.png'
    },
    content () {
      let me = this
      window.emojis.forEach((item) => {
        var regexp = new RegExp('\\[' + item.name + '\\]', 'gm')
        var result = me.item.content.replace(regexp, '<img class="emoji" src="' + item.src + '"/>')
        me.$set(me.item, 'content', result)
      })
      return this.item.content
    }
  },
  watch: {
    replayList () {
      this.isShow = false
      this.$nextTick(() =>{ // 让组件局部刷新
        this.isShow = true
        this.TwoCommentObj.pageIndex = 0
        this.isShowMoreTwo = true
      })
    },
  },
  methods: {
    ...mapMutations(['updateReplayTitle', 'updateShowConfirm', 'updateNeedBack']),
    showTwoInput (item) {
      if (this.isMusic) {
        return
      }
      this.updateReplayTitle(item)
      this.updateShowConfirm(true)
    },
    setUserInputShow () {
      this.$emit('toUser')
    },
    goItem () {
      if (this.item.userId === this.user.userId) { // 去到我的主页
        this.$router.push({ name: 'my' })
      } else { // 去到别人的主页
        this.$router.push({ name: 'discoverUser', params: { id: this.item.userId } })
      }
    },
    goUserPersonal () {
      if (this.item.userId === this.$store.state.user.userId) {
        this.updateNeedBack(true)
        this.go.name('my', 'log')
      } else {
        this.go.nameAid('discoverUser', this.item.userId, 'log')
      }
    },
    // 二级回复
       /**
     * getMoreList 得到更多的二级评论
     */
    getMoreList (item) {
      this.oneItem = item
      this.TwoCommentObj.pageIndex++
      this.TwoCommentObj.oneItem = item
    },
    /**
     * updateCount没有更多评论是，查看更多评论按钮隐藏
     */
    updateCount () {
      this.isShowMoreTwo = false
    },
    /**
     * handleOneReplay处理一级评论的点赞
     */
    handleOneReplay () {
      console.log('我点赞了哦')
      if (this.isLoading) {
        return
      }
      this.isLoading = true
      let me = this
      me.api.process({
          url: 'Operate',
          data: {
            objectId: me.item.commentId,
            operateType: 2,
            objectType: 5, // 表示评论
            isCancel: !me.item.isLike,
          },
          success: function () {
            me.isLoading = false
              if (me.item.isLike) { // 表示需要取消
                me.item.isLike = false
                me.item.countLike--
              } else { // 表示需要点赞
                me.item.isLike = true
                me.item.countLike++
              }
          }
        })
    }
  }
}
</script>
<style lang="less">
  li.commentsItem{
    padding-top: 4vw;
    box-sizing: border-box;
    width: 100vw;
    display: flex;
    position: relative;
    .avatar {
      width:15.2vw;
      text-align: right;
      // border:1px solid red;
      img{
        display: inline-block;
        width: 11.2vw;
        height: 11.2vw;
        border-radius: 50%;
        box-shadow: 0 0 3px #e0e0e0;
        overflow: hidden;
      }
    }
    .discuzInfo {
      flex:1;
      padding-left: 2.666vw;
      padding-right:4vw;
      box-sizing: border-box;
      position:relative;
      .oneReplayLike{
               position:absolute;
               right:4vw;
               top:0vw;
               width:17vw;
               height:13vw;
               .oneLike{
                 width:100%;
                 text-align: right;
                 display:inline-block;
                 position:relative;
                 .myLike{
                   font-size:5vw;
                   z-index:11;
                   position:relative;
                 }
                 .redXinBefore{
                   animation: bigRed 0.5s 0s linear forwards;
                 }
                  .icon-redxin-copy{
                   color:red;
                 }
                 .blackBefore{
                   animation: bigBlack 0.5s 0.2s linear forwards;
                 }
                 .redMove{
                   display:inline-block;
                   position: absolute;;
                   top:-1vw;
                   right:-0.2vw;
                   z-index:8;
                   width:5vw;
                   height:5vw;
                   border-radius: 50%;
                   background:white;
                   animation: redAnimation 1s 0s linear forwards ;
                   opacity: 0.7;
                 }
               }
               .oneLikeCount{
                 color:#666;
                 font-size:3.3vw;
                 width:100%;
                 display:inline-block;
                 text-align: right;
                 padding-right:1.5vw;
                 box-sizing: border-box;
                 i{
                   font-style: normal;
                 }
               }
               .oneLikeStyle{
                 padding-right:0vw;
               }
             }
      .title{
          height: 10vw;
          line-height: 10vw;
          font-size: 3.73vw;
          font-weight: 700;
          color:#333;
          width:65vw;
          .authorStyle{
              display:inline-block;
              width:8vw;
              height:5vw;
              font-size:12px;
              background:rgb(245, 245, 245);
              border-radius: 1vw;
              // margin-top:0.5vw;
              text-align: center;
              line-height:5vw;
              color:#666;
              margin-left:2vw;
          }
      }
      .bottomInfo{
          display:flex;
          height: 4.8vw;
          line-height: 4.8vw;
          margin-bottom: 3.2vw;
          font-size: 2.4vw;
          color:#909090;
          width:65vw;
          .createTime{
            flex: 1;
          }
          .reComment{
          width: 10vw;
          text-align: center;
          i{
              display:inline-block;
              margin-right: 1.5vw;
          }
          }
      }
      .comments{
          padding:3px 0 6px;
          width:65vw;
          display:flex;
          flex-flow: row wrap;
          align-items: center;
          .commentContent{
            font-size: 3.9vw;
            color:#3f3f3f;
            img.emoji{
              display: inline-block;
              vertical-align: top;
              height: 6vw;
              width: 6vw;
              padding: 0 0.3vw;
            }
          }
          .createTime{
            color:#979797;
                font-size:3.2vw;
                margin-left:2vw;
                display:inline-block;
          }
      }
      .MoreReplayList{
              margin-left:8.5vw;
              .TwoMoreReplay{
                  font-size:4vw;
                  color:rgb(81, 134, 187);
                  width:30vw;
                  display:inline-block;
                  height:6vw;
                  line-height:6vw;
              }
      }
    }
  }
</style>
