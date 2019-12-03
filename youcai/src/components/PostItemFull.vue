<template>
  <div class="postItem">
    <div class="postItem-meta">
      <div class="postItem-userAvatar">
        <Avatar :item="item"
                :authOptions='{show: true, hasBorder:true}' />
      </div>
      <div class="postItem-userName"
           @click="goHome">{{item.nickName === '' ? item.name:item.nickName}}</div>
      <div class="postItem-btns">
        <div v-if="canToggle"
             @click="fullScreen"
             @touchstart.stop
             class="postItem-btn postItem__btn--fullScreen">全屏</div>
        <BtnFollow class="postItem-btn postItem-btn-follow"
                   :item="item"
                   v-if="showFollowButton"
                   @touchstart.native.stop />
        <div v-if='$store.state.isInApp && !isVote'
             class="postItem-btn postItem-btn-share shareItemBtn"
             @click.self="showShare(item)"><i class="iconWanwan iconWweixinfenxiang"
             @click.self="showShare(item)"></i></div>
      </div>
    </div>
    <div class="postItem-media">
      <img class="postItemMedia--cover"
           style="width: 100%;"
           v-if="videoCoverShow"
           @click="goVideoDetail()"
           :src="item.picture" />
      <swiper v-if='swiperShow'
              :items="item.imageList"
              :elId="'discover_'+item.postId.substr(0, 5)"
              :autoplay=false />
    </div>
    <div class="postItem-article">
      <div class="postTitle">
        {{item.postTitle}}
      </div>
      <!-- 下面是展开与收起的写法 -->
      <p v-html="itemContent"></p>
      <span class="postItem-article-more"
            @click="showAllContent=!showAllContent"
            v-if="itemContent && item.content.length > limitNum">{{showAllContent ? '收起':'展开'}}</span>
    </div>
    <div class="selfSetBtn">
      <div class="likeLeft">{{format.shortDate(item.timeCreate)}}</div>
      <div class="likeRight"
           @touchstart.stop>
        <div class="selfLike selfOne">
          <BtnLike :item="item"
                   :objectId='item.postId'
                   numPos='sup'
                   :color='btnColor' />
        </div>
        <div class="selfCollect selfOne">
          <BtnLike :item="item"
                   :objectId='item.postId'
                   numPos='sup'
                   :operateType=1
                   :color='btnColor' />
        </div>
        <div class="selfComment selfOne">
          <div class='postItem-meta2-replay'
               @click="setCommentsList">
            <i class="icon-icon_subinfobox1 icon-xiaoxi1 icon iconfont myLike"></i>
            <span class="count"
                  v-show="item.countReply">{{item.countReply}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="postItem-replys"
         v-if="item.postCommentList && item.postCommentList.length>=1 && type !== 'video'"
         @click="goReply">
      <div class="postItem-reply"
           v-for="(reply,index) in item.postCommentList"
           :key="index">
        <span class="postItem-reply-user">{{reply.nickName ? reply.nickName : reply.name}}</span>
        &nbsp;{{reply.content}}
      </div>
      <div class="postItem-reply-meta"
           v-if="item.countReply >= 2">查看{{item.countReply}}条评论</div>
    </div>
    <div class="userInput"
         v-if="type !== 'video'">
      <div class="userAvator">
        <img :src="userAvatar"
             alt="">
      </div>
      <div><input type="text"
               placeholder="添加评论"
               readonly
               @click='emitComments(item)'></div>
    </div>
  </div>
</template>

<script>
import Swiper from '@/components/Swiper/swiper'
import {mapState} from 'vuex'
import Avatar from '@/components/Avatar'
import BtnFollow from '@/components/Btn/BtnFollow'
import BtnLike from '@/components/Btn/BtnLike'
export default {
  components: {
    Avatar,
    Swiper,
    BtnLike,
    BtnFollow
  },
  props: {
    showVideoCover: { // video显示cover不
      type: Boolean,
      default: true
    },
    canToggle: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      required: false
    },
    isVote: {
      default: false,
      type: Boolean
    },
    isFollowPage: { // 表示是在关注页
      default: false,
      type: Boolean
    },
    showFollowButton: {
      type: Boolean,
      required: false,
      default: true
    },
    index: {
      default: 0,
      required: false
    },
    type: {
      default: 0
    },
    limitNum: {
      type: Number,
      default: 100
    }
  },
  data () {
    return {
      showAllContent: false,
      commentsListShow: false
    }
  },
  computed: {
    ...mapState(['user']),
    btnColor () { // 是视频的时候改变按钮颜色 -> 白色
      return (this.item.video && !this.showVideoCover) ? '#fff' : '#444'
    },
    userAvatar () {
      return this.$store.state.user.avatar || 'http://webapp.szwanwan.com/img/default/defaultavatar.png'
    },
    itemContent () {
      if (!this.item || !this.item.content) {
        return ''
      }
      let content = this.item.content.replace(/<[\s\S]*?>/g, '')
      let subContent = content.length <= this.limitNum || this.showAllContent ? content : content.substring(0, this.limitNum - 3) + '...'
      return this.Utility.htmlEncode(subContent).replace(/\r?\n/g, '<br />').replace(/\n/g, '<br />').replace(/\r/g, '<br />')
    },
    videoCoverShow () {
      return this.item.postType ===2 && this.showVideoCover
    },
    swiperShow () {
      return this.item.imageList && this.item.imageList.length
    }
  },
  methods: {
    /**
     * goHome去到个人主页
     */
    goHome () {
      if (!this.$store.state.isInApp) {
        window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=io.dcloud.H50D8112A'
        return
      }
      if (!this.authentication.isLogin()) {
        this.go.login()
        return
      }
      if (this.item.userId === this.user.userId) { // 去到我的主页
        this.$router.push({name: 'my'})
      } else { // 去到别人的主页
        this.$router.push({name: 'discoverUser', params: { id: this.item.userId }})
      }
    },
    goVideoDetail () {
      this.go.nameAid('videoSwiper', this.item.postId)
    },
    goDetail (postId, param) {
      if (this.isFollowPage) {
        this.$router.push({ name: 'discoverItem', params: { id: this.item.userId, key: param, postId: postId } })
      }
    },
    showShare: function (item) {
      // 判断是不是自己的,自己的东西可以删除
      let isDelete = item.userId === this.$store.state.user.userId
      let innerObj = {
        name: this.$route.name,
        objectId: item.postId
      }
      if (this.type === 0) {
        this.$share.open(item, isDelete, 'discover', this.$router.currentRoute.fullPath, innerObj)
      } else {
        this.$share.open(item, isDelete, 'video', this.$router.currentRoute.fullPath, innerObj)
      }
    },
    goReply (item) {
      if (!this.$store.state.isInApp) {
        window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=io.dcloud.H50D8112A'
        return
      }
      if (!this.authentication.isLogin()) {
        this.go.login()
        return
      }
      this.$emit('setCommentsList', true, item)
    },
    goTopic () {
      if (this.item.TopicId <= 0 || this.item.TopicId === 99999) {
        return
      }
      this.$router.push({ name: 'topicItemss', params: { id: this.item.TopicId } })
    },
    setCommentsList (item) {
      this.$emit('setCommentsList', true, item)
    },
    emitComments (item) {
      if (!this.$store.state.isInApp) {
        window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=io.dcloud.H50D8112A'
        return
      }
      if (!this.authentication.isLogin()) {
        this.go.login()
        return
      }
      this.$emit('setCommentsShow', item)
    },
    sendComments () {
      let me = this
      if (me.inputContent.replace(/\s+/g, '') === '') {
        window.weui.toast('评论内容不能为空！')
        return
      } else if (me.inputContent.length >= 256) {
        window.weui.toast('评论内容过长！')
        return
      }
      me.api.process({
        url: 'Comment',
        data: {
          objectId: me.item.postId,
          objectType: 0,
          content: me.inputContent
        },
        success: function () {
          me.$toast('感谢您的评论')
          me.inputContent = ''
        }
      })
    },
    fullScreen () { // 全屏
      this.$emit('fullScreen')
      this.$store.commit('updateVoteBtn', false)
    }
  }
}
</script>

<style lang="less">
.postItemContainer-list {
  background-color: #f3f3f3;
}
  .postItem {
    overflow: hidden;
    margin-bottom: 2.666vw;
    padding-bottom: 2.666vw;
    background-color: #ffffff;
    >div {
      padding: 0 5vw;
      &.postItem-media {
        padding: 0;
      }
      &.postItem-replys {
        padding: 1.333vw;
      }
    }
  }
  .postItem-meta {
    margin-top: 2.666vw;
    display: flex;
    height: 10vw;
    align-items: center;
    position: relative;
    .postItem-userAvatar {
      width: 10vw;
      height:10vw;
      border-radius:50%;
      // overflow:hidden;
      position: relative;
      box-shadow: 0px 0px 1px #efefef;
      
    }
    .right{
      position:absolute;
      bottom:-0.5vw;
      left:10vw;
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
    .postItem-userName {
      width:50vw;
      font-size: 4vw;
      font-weight: bold;
      margin-left: 1.666vw;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .postItem-btns {
      width: 35vw;
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: flex-end;
      .postItem__btn--fullScreen{
        border-radius: 8vw;
        width: 15vw;
        height: 6vw;
        line-height: 6vw;
        text-align: center;
        font-size: 3vw;
        color: #fdd900;
        box-sizing: content-box;
        border: 1px solid currentColor;
        margin-right: 5vw;
      }
      .postItem-btn-follow {
        // color: var(--main-color);
        // border-color: var(--main-color);
        border-radius: 8vw;
        width: 15vw;
        height: 6vw;
        text-align: center;
        line-height: 6vw;
        font-size: 3vw;
      }
      .postItem-btn-share {
        // width: 6vw;
        text-align: right;
        font-weight: bold;
      }
    }
  }
  .postItem-media {
    margin-top: 2.666vw;
  }
  .postItem-article {
    word-break: break-all;
    margin: 2.666vw 0;
  }
  .postItem-article-more {
    font-weight: bold;
    margin-top:2vw;
    display:inline-block;
  }
  .postItem-tags {
    margin-bottom: 2.666vw;
  }
  .postItem-tag {
    padding: 1.389vw 3.426vw 1.389vw 1.489vw;
    background-color: #eef1f6;
    border-radius: 3.704vw;
    font-size: 3.704vw;
    color: #689dfb;
    margin-right: 1.852vw;
    &:before {
      content: '#';
      display: inline;
      border-radius: 1.944vw;
      background-color: #689dfb;
      margin-right: 1.481vw;
      color: #ffffff;
      font-size: 1.852vw;
    }
  }
  .postItem-meta2 {
    display: flex;
    height: 10vw;
    .postItem-btn {
      color: #333;
      min-width: 8vw;
      padding: 0 2vw;
      box-sizing: border-box;
      i {
        font-weight: bold;
        font-size: 5.833vw;
        &.icon-redxin-copy {
          color: red;
        }
        &.icon-wjx-shixin {
          color: #fdd900;
        }
      }
      span {
        // margin: 0 0.4vw;
        font-size: 3vw;
        vertical-align: text-top;
      }
    }
    .postItem-btn-share {
      padding-left: 0;
      flex: 1;
    }
  }
  .postItem-replys {
    background-color: #f1f1f1;
    border-radius: 2vw;
    margin: 2.666vw;
    margin-top: 0;
    font-size: 3.2vw;
    .postItem-reply {
      .postItem-reply-user {
        font-weight: bold;
        &::after {
          content: ':'
        }
      }
    }
    .postItem-reply-meta {
      color: #999;
    }
  }
  .userInput{
    display:flex;
    margin-bottom:3vw;
    .userAvator{
      width:9vw;
      height:9vw;
      border-radius: 50%;
      margin-left:-2vw;
      overflow: hidden;
      img{
        width:9vw;
        height:auto;
      }
    }
    input{
      width:70vw;
      margin-left:3vw;
      height:9vw;
      border:none;
      outline:none;
    }
  }
  .postItem-time {
    color: #999;
    font-size: 3.2vw;
  }

.postItem-media {
  margin-top: 2.666vw;
}
.shareItemBtn{
  letter-spacing: 1px;
  margin-left: 1vw;
  width:10vw;
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
.postItem-meta .postItem-btns .postItem-btn-share{
  // padding-top: 0.5vw;
}
.postTitle{
  font-size:4.5vw;
  font-weight: bold;
  margin-bottom:2vw;
  width:100%;
  // padding:0 4vw;
  box-sizing: border-box;
}
.selfSetBtn{
  display:flex;
  height:13vw;
  .likeLeft{
    // width:14vw;
    height:13vw;
    line-height:13vw;
    font-size: 4vw;
    color: var(--noLikeXin);
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
        font-size: 6.833vw;
        &.icon-redxin-copy {
          color: red;
        }
        &.icon-wjx-shixin {
          color: #fdd900;
        }
      }
    }
    .selfComment{
      .postItem-meta2-replay {
        .myLike{
          color:var(--noLikeXin);
          font-weight: 500;
          font-size: 6.833vw;
        }
        .count{
          font-size: 4vw;
          vertical-align: text-top;
          // color:var(--noLikeXin);
          color:#999;
        }
      }
    }
  }
}
.userInput .userAvator{
  border:1px solid rgb(243,243,243);
  img{
    width: 100%;
    height: 100%;
  }
}
</style>
