<template>
  <transition name="mySet">
    <div class="commentBigWrap">
      <span class="share">
        <i @click="showShare(showOneAnswer)" class="iconWanwan iconWweixinfenxiang"></i>

      </span>
      <commentsList v-if='commentsListShow'
                    :countReply='currentItem.countComment'
                    @upcountReply='upcountReply'
                    @setCommentsPlate='setCommentsListShow'
                    :commentsType='commentsType'
                    :commentsId='commentsId'
                    :OneItem="currentTopic"></commentsList>
      <div class="commentHead borderB">
        <div class="commentMsg">
          <div class="title">{{currentTopic.title}}</div>
          <div class="moreComment"
               @click="backTopicItem">
            <span>查看全部{{currentTopic.countComment}}个回答</span>
            <span>
              <i class="iconWanwan iconWxiayibu activityNotice "></i>
            </span>
          </div>
        </div>
      </div>
      <div class="mainWrap">
        <div class="eachHead">
          <div class="userAvator">
            <img :src="!showOneAnswer.avatar ? defaultAvatar : showOneAnswer.avatar"
                 alt="">
            <div class="right"
                 v-if="showOneAnswer.autheType === 1">
              <span class="one">v</span>
            </div>
            <!-- <div class="right">
                      <i class="one">V</i>
                    </div> -->
          </div>
          <div class="userDetail">
            <div class="user">
              <span>{{showOneAnswer.nickName}}</span>
              <BirthGender :userMessage="showOneAnswer"
                           v-if="showOneAnswer"></BirthGender>
              <!-- <span class="yellowGenderLabel">Lv.32</span> -->
            </div>
            <div class="userData">
              <span>{{reallyCreateTime}}</span>
              <!-- <span>26.32km</span> -->
            </div>
          </div>
          <div class="follow">
            <FollowBtn :item="showOneAnswer"></FollowBtn>
          </div>
        </div>
        <div class="jeft-editor-contentShow"
             v-html='oneAnswerContent'></div>
      </div>
      <div class="voteBtn borderT">
        <div :class="['one',{special:voteIndex == 1}]"
             @click="handleVote(1)">
          <span>
            <i class="iconWanwan iconWzantong activityNotice "></i>
          </span>
          <span>赞同</span>
          <span>{{formatVoteCount}}</span>
        </div>
        <div :class="['one',{special:voteIndex == 2}]"
             @click="handleVote(2)">
          <span>
            <i class="iconWanwan iconWbuzantong activityNotice "></i>
          </span>
          <span>反对</span>
          <span>{{formatAgainstCount}}</span>
        </div>
        <div class="two"
             @click="setCommentsListShow(true,showOneAnswer)">
          <span><i class="iconWanwan iconWxiaoxi activityNotice "></i></span>
          <span>评论{{reallyCommentCount}}</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import BirthGender from '@/components/BirthGender'
import FollowBtn from '@/components/Btn/BtnFollow'
import commentsList from '@/components/comments/commentsList'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      isLoading: false,
      voteCount: '', // 表示赞同的数目
      againstCount: '', // 表示反对的数目
      defaultAvatar: 'http://webapp.szwanwan.com/img/default/defaultavatar.png',
      voteIndex: 0, // 表示是否投票与反对的初始状态 0表示无状态，1表示赞同 2表示反对
      commentsListShow: false, // 显示评论列表
      commentsId: '',
      commentsType: 2,
      topicId: this.$route.params.topicId, // 表示当前话题id
      topicAnswerId: this.$route.params.topicAnswerId, // 表示当前话题当前评论id
      showOneAnswer: {}, // 当前回答列表
      currentTopic: {}, // 当前话题
      oneAnswerCommentList: [], // 表示这个答案的评论数据
      currentItem: [],
      OneItem: {} // 表示一个帖子
    }
  },
  components: {
    BirthGender,
    commentsList,
    FollowBtn
  },
  computed: {
    reallyCreateTime () {
      let bigTime = ''
      if (this.showOneAnswer && this.showOneAnswer.createTime) {
        let time = this.showOneAnswer.createTime.substring(0, 10)
        bigTime = time
      }
      return bigTime
    },
    reallyCommentCount () {
      let count = this.showOneAnswer.countComment === 0 ? '' : this.showOneAnswer.countComment
      return count
    },
    oneAnswerContent () {
      return this.showOneAnswer.content && this.showOneAnswer.content.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    },
    /**
     * formatVoteCount格式化点赞数目
     */
    formatVoteCount () {
       if (this.voteCount > 1000 && this.voteCount <= 9999) {
        let newStr = this.voteCount.toString()
        let str = newStr.substring(0,1)
        return str + 'k'
      } else if (this.voteCount > 10000) {
        let newStr = this.voteCount.toString()
        let str = newStr.substring(0,2)
        return str + 'k'
      } else {
        return this.voteCount
      }
    },
     /**
     * formatVoteCount格式化点赞数目
     */
    formatAgainstCount () {
      if (this.againstCount > 1000 && this.againstCount <= 9999) {
        let newStr = this.againstCount.toString()
        let str = newStr.substring(0,1)
        return str + 'k'
      } else if (this.againstCount > 10000) {
        let newStr = this.againstCount.toString()
        let str = newStr.substring(0,2)
        return str + 'k'
      } else {
        return this.againstCount
      }
      
    }
  },
  mounted () {
    // this.voteIndex = this.showOneAnswer.oprateType
    this.getTopicData()
    this.getCurrentAnswer()
    this.getTopicCommentList()
    this.$share.close()
  },
  activated () {
    this.$share.close()
  },
  methods: {
    ...mapMutations({
      'setCountReply': 'setCountReply'
    }),
    setCommentsListShow (data, item) {
      if (item) {
        this.commentsId = item.topicAnswerId
        let commentlist = this.oneAnswerCommentList.length
        this.setCountReply(commentlist)
        this.currentItem = item
      }
      this.commentsListShow = data
    },
    /**
     * getCurrentAnswer 得到当前话题当前评论的详情数据
     */
    getCurrentAnswer () {
      let me = this
      me.api.get({
        url: `TopicAnswer/1?topicAnswerId=${me.topicAnswerId}`,
        success: function(res) {
          me.showOneAnswer = res
          me.voteCount = me.showOneAnswer.vote
          me.againstCount = me.showOneAnswer.against
          if (me.showOneAnswer.oprateType == 1 ) {
            console.log(me.showOneAnswer.oprateType,'--',me.showOneAnswer.isOpreate)
            me.voteIndex = 1
          } else if (me.showOneAnswer.oprateType == 2 ) {
            me.voteIndex = 2
          } else {
            me.voteIndex = 0
          }
        }
      })
    },
    /**
     *  getTopicData 得到当前话题的数据
     *
    */
    getTopicData () {
      let me = this
      me.api.get({
        url: `TopicDetail?topicId=${me.topicId}&isInApp=${me.$store.state.isInApp}`,
        success: function (res) {
          me.currentTopic = res 
        }
      })
    },
    /**
     * getTopicCommentList 显示话题内页的评论详情页
    */
    getTopicCommentList () {
      // 获得答案详情列表里面的评论列表
      let ObjectId = this.topicAnswerId
      let me = this
      me.api.get({
        url: `Comment?ObjectId=${ObjectId}`,
        success: function (res) {
          me.oneAnswerCommentList = res
        }
      })
    },
    // 显示分享
    showShare: function (item) {
      let innerObj = {
        name: this.$route.name,
        objectId: this.$route.params.topicId,
        topicCommentId: this.$route.params.topicAnswerId
      }
      this.$share.open(item, false, 'topic', this.$router.currentRoute.fullPath, innerObj)
    },
    /**
     * backTopicItem 返回所有评论页
     */
    backTopicItem () {
      this.$router.back()
    },
    /**
     * handleVote 赞同与反对
     */
    handleVote (index) {
      let me = this
      if (!this.$store.state.isInApp) {
        window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=io.dcloud.H50D8112A'
        return
      }
      if (!this.authentication.isLogin()) {
        this.go.login()
        return
      }
      if (me.voteIndex == index) { // 表示是取消操作
          me.userCancel(index)
      } else { // 表示是点击另一个，那么当前需要取消
        if (me.voteIndex != 0 ) { // 不等于0表示之前有状态
          // 第一步需要取消当前的点赞状态
          let p = me.userCancel(me.voteIndex)
          p.then(()=>{
           // 第二步点击的index需要提交
            me.userSubmit(index)
          })
        } else { // 等于0表示之前没有状态，所以就直接提交
          me.userSubmit(index)
        }
      }
    },
    /**
     * 用户是赞同/反对
    */
    userSubmit (index) {
      if (this.isLoading) {
        return
      }
      this.isLoading = true
      let me = this
      let ansewerId = me.showOneAnswer.topicAnswerId
      me.api.put({
        url: 'TopicAnswer',
        data: {
          'topicAnswerId': ansewerId,
          'oprateType': index, // 表示是赞同还是反对
          'isOpreate': true // 表示是点击赞同或者反对
        },
        success: function (res) {
          me.isLoading = false
          if (index === 1) {
            me.voteCount++
          } else if (index === 2) {
            me.againstCount++
          }
          me.voteIndex = index
          console.log('赞同后的index是多少', me.voteIndex)
        }
      })
    },
    /**
     * 用户是取消
     */
    userCancel (index) {
      if (this.isLoading) {
        return
      }
      this.isLoading = true
      return new Promise((resolve, reject)=> {
        let me = this
        let ansewerId = me.showOneAnswer.topicAnswerId
        me.api.delete({
          url: 'TopicAnswer',
          data: { topicAnswerId: ansewerId, oprateType: index, isOpreate: false },
          success: function (res) {
            me.isLoading = false
            if (index === 1) {
              me.voteCount--
            } else if (index === 2) {
              me.againstCount--
            }
            me.voteIndex = 0
            resolve()
            console.log('取消后的voteIndex是多少', me.voteIndex)
          }
        })
      })
    },
    upcountReply () {
      this.currentItem.countComment++
    }
  }
}
</script>

<style lang="less" scoped>
.commentBigWrap{
    .share{
      width:80vw;
      text-align: right;
      position:fixed;
      top:0vw;
      height:12vw;
      line-height:12vw;
      right:4vw;
      z-index:1000;
      font-weight: bold;
      letter-spacing: 1px;
      background:white;
      .iconWweixinfenxiang{
        font-style: normal;
      font-weight: 500;
              background:rgb(59, 187, 7);
              width:8vw;
              height:8vw;
              text-align: center;
              line-height:8vw;
              border-radius: 50%;
              display:inline-block;
              color:white;
              // position:relative;
              // top:0;
              // bottom:0;
              // margin:auto 0;
      }
    }
    .commentHead{
        width:100%;
        position: fixed;
        left:0;
        padding-top:1vw;
        box-sizing:border-box;
        z-index: 98;
        background-color:white;
        .commentMsg{
            width:93%;
            margin:auto;
            padding-bottom: 2vw;
            box-sizing: border-box;
             .title{
                font-size:4.6vw;
                color:#191919;
                font-weight: bold;
            }
            .moreComment{
                color:#999999;
                font-size:4vw;
                margin-top:5vw;
                span:nth-child(2){
                    margin-left:1vw;
                }
            }
        }
    }
    .mainWrap{
        height: calc(100vh - 34vw);
        overflow-y: scroll;
        padding-bottom:15vw;
        box-sizing: border-box;
        .eachHead{
            width:93%;
            height:17.04vw;
            margin:auto;
            display:flex;
            align-items: center;
            justify-content: space-between;
            .userAvator{
                width:12.69vw;
                height:12.69vw;
                border-radius: 50%;
                border:1px solid rgb(243,243,243);
                position:relative;
                img{
                    width:12.69vw;
                    height: 100%;
                    overflow: hidden;
                    border-radius: 50%;
                }
                .right{
                  position:absolute;
                  bottom:0vw;
                  right:-1vw;
                  z-index:12;
                  background:white;
                  box-shadow: 0 0 1px #eeee;
                  width: 5vw;
                  height:5vw;
                  border-radius: 50%;
                //   border:1px solid blue;
                  .one{
                    position:absolute;
                    top:0;
                    left:0;
                    right:0;
                    bottom:0;
                    margin:auto;
                    display:inline-block;
                    width:4.18vw;
                    height:4.18vw;
                    border-radius: 50%;
                    // background:rgb(255, 39, 66);
                    background: linear-gradient(to right bottom,#e37782, #f56b80,#ff5363,#ff405b, #fc3f58);
                    color:white;
                    line-height: 4.5vw;
                    text-align: center;
                    font-size:12px;
                    font-weight: 500;
                    font-family: Times, TimesNR, 'New Century Schoolbook', Georgia, 'New York', serif;
                  }
              }
            }
            .userDetail{
                margin-left:-11vw;
                width:50vw;
                .user{
                    display:flex;
                    align-items: center;
                    flex-flow: row wrap;
                    span:nth-child(1){
                      font-size:4.17vw;
                      color:#333333;
                      margin-right:1vw;
                      font-weight: bold;
                      max-width:50vw;
                      overflow:hidden;
                      text-overflow:ellipsis;
                      white-space:nowrap;
                      word-wrap: break-word;
                      word-break: break-all;
                    }
                }
                .userData{
                    color:#999999;
                    font-size:3.24vw;
                  //   span:nth-child(1)::after{
                  //       content:'.';
                  //       display:inline-block;
                  //       width:4vw;
                  //       position:relative;
                  //       top:-1vw;
                  //       text-align: center;
                  //  }
                }
            }
            .follow{
                width:16vw;
                height:6vw;
            }
        }
        .content{
            width:93%;
            margin:auto;
            .detailItem{
                margin: 3vw 0;
                font-size: var(--mText) !important;
                color:var(--dGray) !important;
                letter-spacing:2px;
                word-wrap: break-word;
                word-break: break-all;
                .text{
                display: inline-block;
                margin-left: 1.5vw;
                }
                img{
                border-radius: 0.8vw;
                }
            }
        }
    }
    .voteBtn{
        height:13.43vw;
        width:100%;
        display:flex;
        position:fixed !important;
        bottom:0;
        left:0;
        background: #fff;
        .one{
            height:9.5vw;
            width:27.5vw;
            background-color:rgb(247, 247, 247);
            border-radius: 1vw;
            margin-right:3vw;
            color:#999;
            font-size:3.7vw;
            display:flex;
            justify-content: space-around;
            align-items: center;
            padding-left:1vw;
            padding-right:1vw;
            box-sizing: border-box;
            margin-top:2vw;
            margin-left:4vw;
        }
        .special{
            color:red;
            .activityNotice{
                color:red;
            }
        }
        .two{
            height:13.43vw;
            width:27.5vw;
            display:flex;
            flex-flow: row wrap;
            align-items: center;
            font-size:3.7vw;
            margin-left:5vw;
            span{
                display:inline-block;
                height:5vw;
                width:100%;
                color:#999;
                text-align: center;
            }
            span:nth-child(2) {
                margin-top:-4vw;
            }
        }
    }
}
</style>
