<template>
  <li class="commentLi">
    <div class="avatar"
         @click.stop="goUserHome">
      <!-- <img :src="replay.avatar"
           alt=""> -->
      <Avatar :item='replay'
              :size=9
              @goUserHome="goUserHome"
              :isComment="isComment"></Avatar>
    </div>
    <div class="oneReplay borderB">
      <span class="replayName">{{replay.nickName}}</span>
      <div class="oneReplayLike">
        <span class="oneLike fadeBtn"
              :class="{'is_loading': isLoading}">
          <i class="icon iconfont icon-icon_subinfobox1 myLike"
             :class="{'icon-redxin-copy': replay.isLike, 'icon-favorites': !replay.isLike}"
             @click="handleOneReplay"></i>
        </span>
        <span :class="['oneLikeCount',{oneLikeStyle: replay.countLike > 9}]"><i v-show="replay.countLike">{{calculateCountLike}}</i></span>
      </div>
      <div class="replayWrap">
        <span class="replayConent"
              @click="twoReplay(replay)">{{replay.content}}</span>
        <span class="time"
              @click="twoReplay(replay)">{{format.shortDate(replay.createTime)}}</span>
      </div>
      <div class="twoCommentWrap">
        <TwoComment :postDetail="item"
                    :oneReplay="replay"
                    :newTwoComment="newTwoComment"
                    :TwoCommentObj="TwoCommentObj"
                    @updateCount="updateCount"
                    @updateChildCount="updateChildCount"
                    v-if="isShow"></TwoComment>
      </div>
      <div class="MoreReplayList"
           v-if="replay.countChildComment > 1 && isShowMoreTwo">
        <span class="TwoMoreReplay"
              @click="getMoreList(replay)">查看更多回复</span>
      </div>
    </div>
  </li>
</template>

<script>
import Avatar from '@/components/Avatar'
import { mapMutations } from 'vuex'
import TwoComment from '@/components/comments/TwoCommentList'
export default {
  data () {
    return {
      isComment: true,
      isLoading: false,
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
     TwoComment,
     Avatar
  },
  props: {
    item: {
      type: Object
    },
    replay: {
      type: Object
    },
    newTwoComment: {
      type: Object
    },
    replayList: {
      type: Array
    },
  },
  computed: {
    calculateCountLike () {
      if (this.replay.countLike > 1000 && this.replay.countLike <= 9999) {
        let newStr = this.replay.countLike && this.replay.countLike.toString()
        let str = newStr.substring(0,1)
        return str + 'k'
      } else if (this.replay.countLike >= 10000) {
        let newStr = this.replay.countLike && this.replay.countLike.toString()
        let str = newStr.substring(0,2)
        return str + 'k'
      } else {
        return this.replay.countLike
      }
    }
  },
  watch: {
    replayList (newV) {
      this.isShow = false
      this.$nextTick(() =>{ // 让组件局部刷新
        console.log('haha')
        this.isShow = true
        // this.isShowMore = true
        this.isShowMoreTwo = true
        this.TwoCommentObj.pageIndex = 0
      })
    },
  },
  methods: {
    ...mapMutations(['updateReplayTitle', 'updateShowConfirm', 'updateNeedBack']),
    goUserHome () {
      console.log('是我的')
      if (this.replay.userId === this.$store.state.user.userId) { // 去到我的主页
        this.updateNeedBack(true)
        this.$router.push({ name: 'my' })
      } else { // 去到别人的主页
        this.$router.push({ name: 'discoverUser', params: { id: this.replay.userId } })
      }
    },
    twoReplay (replayOne) {
    //   this.$emit('handleReplayConfirm', true)
      this.updateReplayTitle(replayOne)
      this.updateShowConfirm(true)
    },
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
    updateCount (data) {
      this.isShowMoreTwo = false
    },
    /**
     * updateChildCount更新二级回复的数量
     */
    updateChildCount () {
      // console.log('评论的item是', this.replay)
      // console.log('更新钱', this.replay.countChildComment)
      // this.replay.countChildComment++
      // console.log('更新后', this.replay.countChildComment)
    },
    /**
     * handleOneReplay处理一级评论的点赞
     */
    handleOneReplay () {
      console.log('我点赞了哦')
      let me = this
      if (me.isLoading) {
        return
      }
      me.isLoading = true
      me.api.process({
          url: 'Operate',
          data: {
            objectId: me.replay.commentId,
            operateType: 2,
            objectType: 5, // 表示评论
            isCancel: !me.replay.isLike,
          },
          success: function (res) {
            me.isLoading = false
              console.log('成功')
              if (me.replay.isLike) { // 表示需要取消
              console.log('我需要取消')
                // me.isBlack = true
                
                me.replay.isLike = false
                me.replay.countLike--
                // setTimeout(()=>{
                //   me.isBlack = false
                // }, 2000)
              } else { // 表示需要点赞
                // me.isStyle = true
                me.replay.isLike = true
                me.replay.countLike++
              }
          },
          error: function (res) {
            me.isLoading = false
            me.$toast(res)
          }
        })
    }
  }
}
</script>

<style lang="less" scoped>
@keyframes redAnimation {
  0%{
    transform: scale(0);
    border:1px solid white;
  }
  20%{
    transform: scale(1);
    border:1px solid pink;
  }
  50%{
    transform: scale(1.5);
    border:1px solid pink;
  }
  100%{
    transform: scale(1.7);
    border:1px solid white;
  }
}
@keyframes bigRed {
  0%{
    transform: scale(0.5);
    // border:1px solid white;
  }
  50%{
    transform: scale(1.5);
    // border:1px solid pink;
  }
  70%{
    transform: scale(1.7);
    // border:1px solid pink;
  }
  100%{
    transform: scale(1);
    // border:1px solid white;
  }
}
@keyframes bigBlack {
  0%{
    transform: scale(0);
    // border:1px solid white;
  }
  50%{
    transform: scale(0.2);
    // border:1px solid pink;
  }
  70%{
    transform: scale(0.5);
    // border:1px solid pink;
  }
  100%{
    transform: scale(1);
    // border:1px solid white;
  }
}
 .commentLi{
           display:flex;
           padding-top:4vw;
           box-sizing: border-box;
           .avatar{
            // width:9vw;
            // height:9vw;
            // border-radius: 50%;
            // overflow: hidden;
            // border:1px solid rgb(243,243,243);
            // img{
            //   width:100%;
            //   height:100%;
            // }
           }
           .oneReplay{
             flex:1;
             margin-left:2.87vw;
             font-size:0;
             padding-bottom:2vw;
             box-sizing: border-box;
             position:relative;
             .replayWrap{
               width:70vw;
             }
             .replayName{
               display:inline-block;
               font-size:3.8vw;
               width:60vw;
               color:#979797;
               display:inline-block;
             }
             .oneReplayLike{
               position:absolute;
               right:0;
               top:0vw;
               width:10vw;
               height:13vw;
               .oneLike{
                 width:100%;
                 text-align: right;
                 display:inline-block;
                 position:relative;
                //  padding-right:1vw;
                //  box-sizing: border-box;
                 .myLike{
                   font-size:5vw;
                   z-index:11;
                   position:relative;
                 }
                //  .icon-redxin-copy{
                //    color:red;
                //  }
                 .redXinBefore{
                  //  border:1px solid blue;
                   animation: bigRed 0.5s 0s linear forwards;
                 }
                  .icon-redxin-copy{
                   color:red;
                 }
                 .blackBefore{
                  //  border:1px solid blue;
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
             .replayConent{
               display:inline-block;
               font-size:3.9vw;
               word-wrap: break-word;
               word-break: break-all;
             }
             .time{
               color:#979797;
               font-size:3.8vw;
               margin-left:2vw;
               display:inline-block;
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