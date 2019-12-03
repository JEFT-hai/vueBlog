<template>
  <ul class="twoCommentList">
    <li class="oneComment"
        v-for="(item, index) in commentList"
        :key="index">
      <div class="twoCommentMsg">
        <div class="twoAvatar"
             @click.stop="goUser(item)">
          <!-- <img :src="item.avatar"
               alt=""> -->
          <Avatar :item='item'
                  :size=7
                  @goUserHome="goUser"
                  :isComment="isComment" :isItemOnly="true"></Avatar>
        </div>
        <span class="twoName">{{item.nickName}}</span>
        <span class="author"
              v-if="item.userId === postDetail.userId">作者</span>
      </div>
      <div class="twoReplayLike">
        <span class="oneLike">
          <i class="icon iconfont icon-icon_subinfobox1 myLike"
             :class="{'icon-redxin-copy': item.isLike, 'icon-favorites': !item.isLike}"
             @click="handleTwoReplay(item)"></i>
        </span>
        <span :class="['twoLikeCount',{twoLikeStyle: item.countLike > 9}]"><i v-show="item.countLike">{{item.countLike}}</i></span>
      </div>
      <div class="twoCommentContent">
        <span class="twoContent"
              v-if="item.userIdSe === oneReplay.userId"
              @click="goThreeReplay(item)">{{item.content}}</span>
        <!-- <span class="twoContent" v-else-if="item.userIdSe !== oneReplay.userId && item.userIdSe === postDetail.userId" @click="goThreeReplay(item)">回复<i class="commentName" >{{item.nickNameSe}}</i><i class="commentName">(作者)</i>:&nbsp;{{item.content}}</span> -->
        <span class="twoContent"
              v-else
              @click="goThreeReplay(item)">回复<i class="commentName">{{item.nickNameSe}}</i>:&nbsp;{{item.content}}</span>
        <span class="twoTime"
              @click="goThreeReplay(item)">{{format.shortDate(item.createTime)}}</span>
      </div>
    </li>
  </ul>
</template>

<script>
import Avatar from '@/components/Avatar'
import {mapState, mapMutations} from 'vuex'
export default {
  data () {
    return {
      isComment: true,
      pageIndex: 0,
      pageSize: 5,
      commentList: [],
      showTwoMore: true,
    }
  },
  components: {
    Avatar
  },
  props: {
    totalComment: {
      type: Array
    },
    newTwoComment: {
      type: Object
    },
    oneReplay: {
      type: Object
    },
    postDetail: {
      type: Object
    },
    TwoCommentObj : {
      type: Object
    }
  },
  watch: {
    newTwoComment (newV) { // 更新用户刚评论的数据
    console.log('二级新出现的评论', newV)
      if (newV.commentIdSe === this.oneReplay.commentId && this.replayConfirm.type != 3) {
        console.log('新出现的二级评论222')
        this.commentList.push(newV)
      } else if (this.replayConfirm.type == 3) {
        if (newV.parentCommentId === this.oneReplay.commentId && newV.childParentCommentId === this.replayConfirm.childParentCommentId) {
          this.commentList.push(newV)
        }
      }
      this.$emit('updateChildCount')
    },
    'TwoCommentObj.pageIndex': { // 监视对象的特定属性
       handler (newV) {
         let me = this
         console.log('newV', newV)
         if (me.TwoCommentObj.oneItem && me.TwoCommentObj.oneItem.commentId  === me.oneReplay.commentId) {
           this.pageIndex = newV
           this.pageSize = 5
          //  if (newV == 1) {
          //    console.log('我等于1哦')
          //    me.commentList = []
          //  }
           me.getTwoCommentList(newV)
           
         } else {
           this.pageIndex = 0
         }
       }
    },
  },

  computed: {
    ...mapState(['replayConfirm'])
  },
  mounted () {
    if (this.oneReplay.contentSe) {
      let arr = [{ // 因为第一条的二级评论是一级评论自带的
        avatar: this.oneReplay.avatarSe,
        nickName: this.oneReplay.nickNameSe,
        nickNameSe: this.oneReplay.nickNameSe,
        content: this.oneReplay.contentSe,
        createTime: this.oneReplay.createTimeSe,
        userIdSe: this.oneReplay.userId,
        objectId: this.oneReplay.objectId,
        commentId: this.oneReplay.commentId, // 当前评论的id
        commentIdSe: this.oneReplay.commentIdSe, // 父评论id
        userId: this.oneReplay.userIdSe,
        isLike: this.oneReplay.isLikeSe,
        countLike: this.oneReplay.countLikeSe
      }]
      this.commentList = arr
    }
  },
  methods: {
    ...mapMutations(['updateReplayList','updateReplayTitle', 'updateShowConfirm', 'updateNeedBack']),
    goUser (item) {
      if (item.userId === this.$store.state.user.userId) { // 去到我的主页
        this.updateNeedBack(true)
        this.$router.push({ name: 'my' })
      } else { // 去到别人的主页
        this.$router.push({ name: 'discoverUser', params: { id: item.userId } })
      }
    },
    /**
     * handleTwoReplay处理一级评论的点赞
     */
    handleTwoReplay (item) {
      let me = this
      let objectId = ''
      if (item.commentId === me.oneReplay.commentId) { // 表示是、第一条的时候没有请求，一级评论直接带过来的id
        objectId = item.commentIdSe
        console.log('我是第一条')
      } else { // 表示请求了
        objectId = item.commentId
        console.log('我是请求的数据')
      }
      me.api.process({
          url: 'Operate',
          data: {
            objectId: objectId,
            operateType: 2,
            objectType: 5, // 表示评论
            isCancel: !item.isLike,
          },
          success: function (res) {
              console.log('成功')
              if (item.isLike) { // 表示需要取消
              console.log('我需要取消')
                item.isLike = false
                item.countLike--
              } else { // 表示需要点赞
                item.isLike = true
                item.countLike++
                console.log('我需要点赞')
              }
          }
        })
    },
    /**
     * getTwoCommentList得到二级评论列表
     */
    getTwoCommentList (index) {
      let me = this
      let ObjectId = this.oneReplay.objectId
      let CommentId = this.oneReplay.commentId
      me.api.get({
        url: `CommentTwoLevel?ObjectId=${ObjectId}&CommentId=${CommentId}&PageIndex=${me.pageIndex}&PageSize=${me.pageSize}`,
        success: function (res) {
          me.commentList = me.commentList.concat(res)
          if (index == 1) {
             console.log('删掉了')
             me.commentList.shift()
           }
          console.log('哈哈')
          if (!res.length) { // 如果没有更多二级评论，隐藏显示更多
            me.$emit('updateCount')
          }
        }
      })
    },
    goThreeReplay(item) {
      console.log('item是多少哇一个小评论', item)
      console.log('打印这个---一个大评论', this.oneReplay)
      item.type = 3
      item.parentCommentId = this.oneReplay.commentId
      // item.childParentCommentId = item.commentId
      if (item.commentId === this.oneReplay.commentId) { // 因为第一条是一级评论带过来的数据，所以它的评论id和一级评论id相等
        item.childParentCommentId = item.commentIdSe
      } else { // 表示不是第一条
        item.childParentCommentId = item.commentId
      }
      this.updateReplayTitle(item)
      this.updateShowConfirm(true)
    }
  }
}
</script>

<style lang="less" scoped>
 .twoCommentList{
    width:100%;
    // height:20vw;
    font-size:4vw;
    .oneComment{
      width:100%;
      padding:2vw 0;
      box-sizing: border-box;
      position:relative;
      .twoCommentMsg{
        width:60vw;
        display:flex;
        .twoAvatar{
          
        }
        .twoName{
          margin-left:2vw;
          font-size:3.5vw;
          color:#929292;
          display:inline-block;
          max-width: 20vw;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        }
        .author{
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
      .twoReplayLike{
        position:absolute;
        right:0;
        top:0;
        width:10vw;
        height:14vw;
         .oneLike{
                 width:100%;
                 text-align: right;
                 display:inline-block;
                //  padding-right:1vw;
                //  box-sizing: border-box;
                 .myLike{
                   font-size:5vw;
                 }
                 .icon-redxin-copy{
                   color:red;
                 }
               }
               .twoLikeCount{
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
               .twoLikeStyle{
                 padding-right:0vw;
               }
      }
      .twoCommentContent{
        width:70vw;
        padding-left:8.5vw;
        box-sizing: border-box;
        .twoContent{
          font-size: 3.9vw;
          color:#363636;
          .commentName{
            font-style:normal;
            color:#5186bb;
            display:inline-block;
            padding:0 0.5vw;
            box-sizing: border-box;
          }
        }
        .twoTime{
          font-size:3.3vw;
          color:#a2a2a2;
          margin-left:2vw;
        }
      }
    }
 }   
</style>