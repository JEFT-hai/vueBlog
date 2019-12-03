<template>
  <div class="itemContentPage"
       id="itemContentPage">
    <div class="imageWrap">
      <swiper :items="item.imageList"
              :autoplay=false
              :elId="'discover_'+item.postId.substr(0, 5)"
              v-if="item.imageList.length" />
    </div>
    <div class="contentWrap">
      <p>{{item.postTitle}}</p>
      <div class="content"
           v-html="itemContent"></div>
      <div class="time borderB">
        <span class="timeSpan">{{format.shortDate(item.timeCreate)}}</span>
        <span class="readSpan">阅读&nbsp;{{item.countRead}}</span>
      </div>
      <div class="itemCommentWrap"
           id="commentList">
        <div class="commentTitle"
             v-show="item.countReply">共{{item.countReply}}条评论</div>
        <div class="itemReplay">
          <div class="avatar">
            <!-- <img :src="user.avatar"
                 alt=""> -->
            <Avatar :item='user'
                    :size=9
                    :canClick="canClick"
                    :isItemOnly="true"></Avatar>
          </div>
          <span class="replayBtn"
                @click="userComment">说点什么...</span>
        </div>
        <div class="noData"
             v-if="replayList.length <= 0">
          <span class="iconWzanwupinglun iconWanwan"></span>
          <span>暂无评论, 快抢沙发吧</span>
        </div>
        <ul class="commentList">
          <LookMoreTwo v-for="(replay, index) in replayList"
                       :replay="replay"
                       :newTwoComment="newTwoComment"
                       :item="item"
                       :key="index"
                       :replayList="replayList"></LookMoreTwo>
          <div class="replayList"
               v-if="showMoreReplay">
            <span class="moreReplay"
                  v-if="item && item.countReply > 10"
                  @click="handleTwoReplay">{{calculateCount}}</span>
          </div>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from '@/components/Avatar'
import Swiper from '@/components/Swiper/swiper'
import LookMoreTwo from '@/views/Discover/components/LookMoreTwo'
import {mapState, mapMutations} from 'vuex'
export default {
  props: {
    newTwoComment: {
      type: Object
    },
    item: {
      type: Object,
      default: null
    },
    replayList: {
      type: Array
    },
    showMoreReplay: {
      type: Boolean
    }
  },
  data () {
    return {
      canClick: false,
      TwoPageIndex: 1,
      oneItem: null,
      failTitle: '暂无评论,快抢沙发吧!',
      pageIndex: 1,
      pageSize: 10,
      calculateCount: '展开更多评论',
      // 二级评论
      userInputShow: false,
      toUser: '',
      userInputContent: '',
      placeholder: '默默收藏不如评论',
      commentsType: 0,
    }
  },
  components: {
    Swiper,
    LookMoreTwo,
    Avatar
  },
  computed: {
    ...mapState(['user', 'twoReplayShow']),
    imageList () {
      return this.item.imageList && this.item.imageList.length && this.item.imageList.join(',')
    },
    itemContent () {
      if (!this.item || !this.item.content) {
        return ''
      }
      return this.Utility.htmlEncode(this.item.content).replace(/\r?\n/g, '<br />').replace(/\n/g, '<br />').replace(/\r/g, '<br />')
    },
  },
  watch: {
    oneItem () {
      this.pageIndex = 2
    }
  },
  methods: {
    ...mapMutations(['updateReplayTitle', 'updateReplayState']),
    twoReplay (replayOne) {
      this.updateReplayTitle(replayOne)
    },
    getMoreList (item) { // getMoreList 得到更多的二级评论
      this.oneItem = item
      this.pageIndex++
    },
    handleTwoReplay () {
      this.$emit('moreReplay')
    },
    userComment () {
      this.$emit('userReplay', true)
    },
    hideTwoReplay () { // hideTwoReplay隐藏用户评论的评论框
      this.updateReplayState(false)
    },
    updateTwoComments (data) { // updateTwoComments更新评论数据
      if (data) {
        this.replayList.unshift(data)
        this.hideTwoReplay()
        this.postDetail.countReply++
      }
      this.userInputContent = ''
      this.toUser = ''
    },
  }
}
</script>

<style lang="less" scoped>
 .itemContentPage{
   width:100%;
   background:white;
   .imageWrap{
     width:100%;
   }
   .contentWrap{
     width:100%;
     p{
       font-size:4.5vw;
       font-weight: bold;
       margin-bottom:2vw;
       width:100%;
       padding:0 4vw;
       box-sizing: border-box;
     }
     .content{
       width:92%;
       margin-left:4.8vw;
       box-sizing: border-box;
       font-size:4.5vw;
       word-wrap: break-word;
       word-break: break-all;
     }
     .time{
       width:90%;
       height:10vw;
       font-size:4.5vw;
       color:#8a8a8a;
       margin:auto;
       line-height: 10vw;
       .timeSpan{
       }
       .readSpan{
         margin-left:12vw;
       }
     }
     .itemCommentWrap{
       width:100%;
       padding:3.8vw 4vw 0;
       box-sizing:border-box;
       .commentTitle{
         font-size:3.5vw;
         color:#747474;
         margin-bottom:4vw;
       }
       .itemReplay{
         display:flex;
         .replayBtn{
           width:79.81vw;
           height:9vw;
           line-height:9vw;
           background: #f5f5f5;
           border-radius: 10vw;
           display:inline-block;
           margin-left:2.87vw;
           padding-left:4vw;
           box-sizing: border-box;
           font-size:4vw;
           color:#979797;
         }
       }
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
       .commentList{
         padding:3.89vw 0 4.35vw 0;
         box-sizing: border-box;
         .replayList{
          .moreReplay{
            font-size:4vw;
            color:rgb(81, 134, 187);
            width:100%;
            display:inline-block;
            height:10vw;
            line-height:10vw;
            text-align: center;
          }
         }
       }
     }
   }
 }
</style>
