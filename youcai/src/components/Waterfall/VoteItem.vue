<template>
  <li class="voteLi"
      v-if="oneVote"
      :data-index='index'>
    <div class="liImg videoPicWrap"
         @click="goDetail(oneVote.postId, 'picture')"
         v-if="oneVote.postType === 2"
         :style="getStyle(oneVote)">
      <img v-lazy='oneVote.picture'
           alt=""
           class="videoPic">
      <span class="oneIndex"
            :style="voteIndexColor">{{oneVote.voteSort}}</span>
    </div>
    <div class="liImg"
         :style="getStyle(oneVote)"
         @click="goDetail(oneVote.postId, 'picture')"
         v-else>
      <img :src="oneVote.picture"
           alt="">
      <span class="oneIndex"
            :style="voteIndexColor">{{oneVote.voteSort}}</span>
    </div>
    <div class="userVote">
      <div class="voteMsgList">
        <span class="voteTitle">{{voteContent}}</span>
        <span class="voteMsgTwo"
              :style="{color: fontColor}">{{voteCount}}票</span>
      </div>
      <div :class="['voteBtn',{'noVote': noVote}, {'toggle__button--isLoading': isLoading}]"
           @click="handleVote"
           :style="btnStyle">{{voteState}}</div>
      <div class="voteBottom">
      </div>
    </div>
  </li>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  props: {
    voteActivity: {
      type: Object,
      default: null
    },
    selfData : {
      type: Object,
      default: null
    },
    theme: {
      type: Number,
      default: 5
    },
    index: {
      type:Number
    },
    oneVote: {
      type: Object
    },
    isEnd: { // 表示投票是否截止
      type: Boolean
    },
    isImei: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      width: 180,
      isLoading: false,
       // 表示投票状态
      myVote: false, // 表示是否投票
      calculateColor: '',
      voteItem: this.oneVote,
      myColor: ''
    }
  },
  computed: {
    ...mapState(['user', 'voteList']),
    noVote () {
      return this.isEnd || this.isVoted || this.myVote
    },
    voteState () {
      // return this.isVoted ? '已投票':'投票'
      if (this.isEnd) {
        return '已结束'
      } else {
        return this.isVoted ? '已投票' : '投票'
      }
    },
    isInVoteList () {
      return this.voteList && this.voteList.length >= 1 && this.voteList.indexOf(this.oneVote.postId) !== -1
    },
    isVoted () {
      return this.isInVoteList || this.oneVote.isVote
    },
    voteCount () {
      let num = (this.isInVoteList && !this.oneVote.isVote) ? 1 : 0
      return this.oneVote.countVote + num
    },
    voteContent () {
      if (this.oneVote.postTitle) {
        return this.oneVote.postTitle
      } else if (this.oneVote.content) {
        let str = this.oneVote.content
        return str.substring(0,20)
      } else {
        return ''
      }
    },
    userAvatar () {
      let avatar = this.oneVote.avatar === null || this.oneVote.avatar === '' ? 'http://webapp.szwanwan.com/img/default/defaultavatar.png' : this.oneVote.avatar
      return avatar
    },
    voteIndexColor () {
      if (this.theme === 0) {
        return { background: 'rgba(255, 39, 66,.8)'}
      } else if (this.theme === 1) {
        let obj = {
          background: 'rgba(61,141,101,.8)',
        }
        return obj
      } else {
        // console.log('打印', this.selfData && this.selfData.color)
        return { background: this.selfData && this.selfData.color}
      }
    },
    btnStyle () {
      if (this.myVote || this.isEnd || this.oneVote.isVote) {
        return 'rgba(154, 154, 154, 0.8)'
      } else {
        // console.log('没有名中')
        if (this.theme === 0) {
          // console.log('名字0')
        return { background: 'rgba(255, 39, 66,.8)'}
      } else if (this.theme === 1) {
        // console.log('名字1')
        let obj = {
          background: 'rgba(61,141,101,.8)',
        }
        return obj
      } else {
        // console.log('民族3')
        return { background: this.selfData && this.selfData.color}
      }
      }
    },
    fontColor () {
      if (this.theme === 0) {
        return 'rgb(255, 39, 66)'
      } else if (this.theme === 1) {
        return 'rgb(61,141,101)'
      } else {
        return this.selfData && this.selfData.color
      }
    },
    /**
     * leftIndex左边index
     */
    leftIndex () {
      return 2 * this.index
    },
     /**
     * rightIndex右边的index
     */
    rightIndex () {
      return 2 * this.index + 1
    },
  },
  created () {
    this.width = parseInt(document.documentElement.offsetWidth * 0.48)
    console.log(this.isEnd)
  },
  methods: {
    ...mapMutations({
      upVoteList: 'upVoteList'
    }),
    getStyle (item) {
      let me = this
      return {
        width: me.width + 'px',
        height: parseInt(me.width * item.r) + 'px'
      }
    },
    /**
     * handleVote处理投票
     */
    handleVote () {
      if (!this.authentication.isLogin()) {
        this.go.login()
        return
      }
      if (this.isImei) {
        if (!this.getIMEI()) {
          return
        }
      }
      if (this.isEnd) {
        this.$toast('投票活动已结束', 1200)
      } else if (this.voteItem.isVote) {
        this.$toast('已投票', 1200)
      } else {
        let me = this
        if (me.isLoading) {
          return
        }
        me.isLoading = true
        let data = {
          VotePostId: me.oneVote.postId,
          IsVote: true
        }
        if (this.isImei) {
          data.imei = this.getIMEI()
        }
        me.api.process({
          url: 'Vote',
          data: data,
          success: function() {
            me.myVote = true
            me.upVoteList(me.oneVote.postId)
            me.oneVote.countVote += 1
            me.voteItem.isVote = true
            me.calculateColor = {
              background: 'rgb(154, 154, 154)'
            }
            me.$emit('updateCount')
          },
          error: function (res) {
            me.$alert(res ? res : '请求出错')
          },
          complete: function () {
            me.isLoading = false
          }
        })
      }
    },
    /**
     * goHome表示去主页
     */
    goHome () {
      if (this.isAttentionId) { // 表示是我的关注页
        if (this.oneVote.attentionUserId === this.user.userId) { // 去到我的主页
          this.$router.push({ name: 'my' })
        } else { // 去到别人的主页
          this.$router.push({ name: 'discoverUser', params: { id: this.oneVote.attentionUserId } })
        }
      } else { // 表示是用userId
        if (this.oneVote.userId === this.user.userId) { // 去到我的主页
          this.$router.push({ name: 'my' })
        } else { // 去到别人的主页
          this.$router.push({ name: 'discoverUser', params: { id: this.oneVote.userId } })
        }
      }
    },
    goDetail (postId, param) {
      if (this.oneVote.postType === 1) {
          this.$router.push({ name: 'discoverItemOnly', params: { id: this.oneVote.userId, key: param, postId: this.oneVote.postId } })
      } else {
        this.go.nameAParams(
            'voteHVideoDetail',
            {postId: this.oneVote.postId,
              id: this.oneVote.activityId
            }
          )
        // if (this.oneVote.r && this.oneVote.r < 0.7) { // 横屏
          
        // } else {
        //   this.$router.push({ name: 'videoVote', params: { id: this.oneVote.postId } })
        // }
      }
    }
  }
}
</script>

<style lang="less" scoped>
    .voteLi{
        width:100%;
        border-radius: 2vw;
        margin-top:2vw;
        background: #fff;
        .liImg{
            position:relative;
            video{
              width: 100%;
              height: auto;
            }
            .oneIndex{
              position:absolute;
              top:0;
              right:3vw;
              z-index:2233;
              background:rgba(255, 39, 66,.5);
              opacity: 0.9;
              border-radius: 0 0 0.5vw 0.5vw;
              min-width:6vw;
              height:7vw;
              padding:0 1vw;
              box-sizing: border-box;
              font-size:4vw;
              text-align: center;
              line-height:7vw;
              color:white;
            }
        }
        .videoPicWrap {
          display: table-cell;
          vertical-align: middle;
          .videoPic {
            vertical-align: middle;
          }
        }
        .userVote{
            width:100%;
            box-sizing: border-box;
            border-radius: 0 0 2vw 2vw;
            background-color:white;
            padding-bottom:2vw;
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
            }
            .noVote{
                background:rgb(154, 154, 154)!important;
            }
            .voteMsgList{
              width:100%;
              font-size:0;
              .voteTitle {
                display:inline-block;
                width:100%;
                max-height:16vw;
                text-overflow: ellipsis;
                word-break: break-all;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                display: -webkit-box;
                text-align: center;
                font-size: 3.7vw;
                margin:auto;
                padding:1vw 3vw;
                box-sizing: border-box;
                word-wrap: break-word;
                word-break: break-all;
              }
              .special{
                font-size:3.3vw;
                padding:0 3vw;
                box-sizing: border-box;
              }
              .voteMsgTwo {
                display:inline-block;
                width:100%;
                text-align: center;
                color:rgb(255, 39, 66);
                font-size:3.7vw;
              }
            }
            .voteBottom{
                display:flex;
                justify-content: space-between;
                .userMsg{
                    display:flex;
                    margin-top:3vw;
                    .userAvatar{
                        width:5.4vw;
                        height:5.4vw;
                        border-radius: 50%;
                        overflow: hidden;
                        img{
                            width:5.4vw;
                            height:5.4vw;
                        }
                    }
                    .userName{
                        font-size:3vw;
                        color:#333;
                        margin-left:1vw;
                        width:13vw;
                        overflow:hidden;
                        text-overflow:ellipsis;
                        white-space:nowrap;
                        word-wrap: break-word;
                        word-break: break-all;
                    }
                }
                .like{
                  margin-top:2vw;
                }
            }
        }
    }
</style>
