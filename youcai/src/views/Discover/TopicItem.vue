<template>
  <div class="topicInnerBig">
    <div class="topicInnerWrap">
      <vue-editor :EditorTitle='topicInnerDetail.title'
                  :topicId='topicId'
                  :show='hasMask && vueEditorShow'
                  @hideEditor='hideEditor'></vue-editor>
      <div class="joinAnswer"
           v-show="!isGotoComment"
           @click='setVueEditor(true)'>参与话题</div>
      <span class="shareTopic">
        <i @click="showShare(topicInnerDetail)"
           class="iconWanwan iconWweixinfenxiang"></i>
      </span>
      <div class="scrollWrap"
           v-show="!isGotoComment">
        <scroll ref="scroll"
                :data="answerList"
                :scrollbar="scrollbarObj"
                :pullDownRefresh="pullDownRefreshObj"
                :pullUpLoad="pullUpLoadObj"
                :startY="parseInt(startY)"
                @pullingDown="onPullingDown"
                @pullingUp="onPullingUp">
          <div class="topicList">
            <div class="topicHead">
              <div class="headImg">
                <img :src="topicInnerDetail.image"
                     alt="">
              </div>
              <div class="topicProblem">
                <div class="topicTitle">{{topicInnerDetail.title}}</div>
                <div class="problemDes">
                  <p v-html="itemContent"></p>
                  <span class="showMore"
                        @click="showAllContent=!showAllContent"
                        v-if="itemContent && itemContent.length > 36">{{showAllContent ? '收起':'展开问题描述'}}</span>
                  <p class="originSource"
                     v-if="topicInnerDetail.originSource">
                    <router-link class="goLink"
                                 :to="{name: 'otherPage', params:{
                    id: topicInnerDetail.originSource,
                    tit: topicInnerDetail.tit
                  }}"><span class="iconWanwan iconWlianjie">&nbsp;</span>查看原文</router-link>
                    <span>&nbsp;原文转载自{{fromUrl}},著作权归作者所有</span>
                  </p>
                </div>
              </div>
              <div class="problemDetail">
                <div class="detailLeft">
                  <span>{{topicInnerDetail.countAttention}}人关注</span>
                  <span>{{topicInnerDetail.countComment}}条回答</span>
                </div>
                <div :class="['detailRight',{followed: isFollowTopic}]"
                     @click="handleFollow">{{isFollowTopic ? '已关注': '关注话题'}}</div>
              </div>
            </div>
            <div class="split">
              <div class="splitLeft">{{topicInnerDetail.countComment}}个回答</div>
              <div class="splitRight">
                <span @click="handleSelected">{{labelTitle}}</span>
                <span @click="handleSelected">
                  <i class="iconWanwan iconWxiangxia1 activityNotice"></i>
                </span>
                <transition name="mySet">
                  <div class="selectBtn"
                       v-if="isSelectLabel">
                    <div class="btnOne"
                         @click="handleSelected(0)">
                      <span>按质量排序</span>
                      <span><i class="iconWanwan iconWgou activityNotice"
                           v-show="index===0"></i></span>
                    </div>
                    <div class="btnOne"
                         @click="handleSelected(1)">
                      <span>按时间排序</span>
                      <span><i class="iconWanwan iconWgou activityNotice"
                           v-show="index===1"></i></span>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
            <div class="commentList">
              <div v-html='textData'></div>
              <ul class="commentUl">
                <topicCommentItem @showTopicCommentInner="showTopicCommentInner"
                                  v-for="(oneAnswer,index) in answerList"
                                  :key="index"
                                  :oneAnswer="oneAnswer"></topicCommentItem>
              </ul>
            </div>
          </div>
        </scroll>
      </div>
    </div>
  </div>
</template>

<script>
import topicCommentItem from '@/components/TopicAbout/topicCommentItem'
// import topicVote from '@/components/TopicAbout/topicVote'
import vueEditor from '@/components/VueEditor'
import { mapState, mapMutations } from 'vuex'
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
export default {
  mixins: [scrollMixin],
  data () {
    return {
      topic: {},
      topicInnerDetail: {}, // 话题内页详细数据
      answerList: [],
      isGotoComment: false, // 是否跳到评论详情页
      isSelectLabel: false, // 是否选择标签
      index: 0, // 默认按质量排序
      labelTitle: '按质量排序',
      problemTitle: '我前段时间回老家，我妈拉着我去菜市场买菜，我不想去，我妈批评我说："这么大个人了，菜都不想去买，你们年轻人就是懒',
      showOneAnswer: {}, // 需要显示哪个回答
      oneAnswerCommentList: [], // 显示回答item的评论信息
      vueEditorShow: false,
      EditorTitle: '参与话题',
      followTopicTitle: '关注话题',
      textData: '',
      showAllContent: false, // 是否显示所有
      isFollowTopic: '', // 表示用户是否要关注
      imageList: [],
      topicId: this.$route.params.id, // 表示目前显示哪一条
      pullDownRefresh: true,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: true,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更过数据了',
      isLoading: true,
      items: [],
      curPage: 1,
      pageSize: 7
    }
  },
  components: {
    scroll,
    topicCommentItem,
    vueEditor
  },
  mounted () {
    // 得到话题内页详细列表的信息
    this.getTopicItemDetail()
    // this.isFollowTopic = this.topicInnerDetail && this.topicInnerDetail.isAttention
    // 得到话题
    this.getAnswerList()
    this.$share.close()
  },
  activated () {
    this.$share.close()
  },
  computed: {
    ...mapState(['hasMask']),
    itemContent () {
      if (!this.topicInnerDetail || !this.topicInnerDetail.content) {
        return ''
      }
      let content = this.topicInnerDetail.content
      let subContent = content.length <= 36 || this.showAllContent ? content : content.substring(0, 36) + '...'
      return subContent
    },
    fromUrl () {
      if (!this.topicInnerDetail.originSource){
        return ''
      } else {
        let originSource = this.topicInnerDetail.originSource.replace('https://', '').replace('http://', '')
        let min = Math.min(originSource.indexOf('?') > 0 ? originSource.indexOf('?'): 0, originSource.indexOf('/') > 0 ? originSource.indexOf('/') : 0)
        let max = Math.max(originSource.indexOf('?') > 0 ? originSource.indexOf('?'): 0, originSource.indexOf('/') > 0 ? originSource.indexOf('/') : 0)
        return min ? this.topicInnerDetail.originSource.slice(0, min) : max ? this.topicInnerDetail.originSource.slice(0, max) : this.topicInnerDetail.originSource
      }
      
    }
  },
  methods: {
    ...mapMutations({ 'setMask': 'setMask' }),
    /**
     * getTopicItemDetail 得到话题内页数据
     */
    getTopicItemDetail () {
      let me = this
      me.api.get({
        url: `TopicDetail?topicId=${me.topicId}&isInApp=${me.$store.state.isInApp}`,
        success: function (res) {
          me.topic = res
          me.topicInnerDetail = res
          me.isFollowTopic = res.isAttention
        }
      })
    },
    /**
     * handleFollow 处理用户关注话题
     */
    handleFollow () {
      if (!this.$store.state.isInApp) {
        window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=io.dcloud.H50D8112A'
        return
      }
      if (!this.authentication.isLogin()) {
        this.go.login()
        return
      }
      if (this.isFollowTopic) {
        let me = this
        let topicId = me.topicInnerDetail && me.topicInnerDetail.topicId
        me.api.process({
          url: 'Topic',
          data: {
            'topicId': topicId,
            'isAttention': false // 表示取消关注
          },
          success: function () {
            me.isFollowTopic = false
          }
        })
      } else {
        let me = this
        let topicId = me.topicInnerDetail && me.topicInnerDetail.topicId
        me.api.process({
          url: 'Topic',
          data: {
            'topicId': topicId,
            'isAttention': true // 表示去关注
          },
          success: function () {
            me.isFollowTopic = true
          }
        })
      }
    },
    /**
     * showTopicCommentInner 显示话题内页的评论详情页
     */
    showTopicCommentInner (oneAnswer) {
      console.log('打印一下oneAnswer',oneAnswer)
      let topicAnswerId = oneAnswer.topicAnswerId
      this.$router.push({ name: 'topicComment', params: { topicId: this.topicId, topicAnswerId: topicAnswerId } })
    },
    /**
     * hiddleTopicItem 隐藏话题内页的评论详情页
     */
    hiddleTopicItem () {
      this.setMask(false)
      this.isGotoComment = false
    },
    /**
     * handleSelected () 处理选择答案排序的标签
     */
    handleSelected (index) {
      if (this.isSelectLabel) {
        this.index = index
        this.isSelectLabel = false
        if (index === 0) {
          this.labelTitle = '按质量排序'
          this.index = index
          this.getAnswerList()
        }
        if (index === 1) {
          this.labelTitle = '按时间排序'
          this.index = index
          this.getAnswerList()
        }
      } else {
        this.isSelectLabel = true
      }
    },
    setVueEditor (data) {
      if (!this.$store.state.isInApp) {
        window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=io.dcloud.H50D8112A'
        return
      }
      if (!this.authentication.isLogin()) {
        this.go.login()
        return
      }
      this.setMask(data)
      this.vueEditorShow = data
    },
    hideEditor () {
      this.setVueEditor(false)
    },
    /**
     * 回答列表,按
     */
    getAnswerList () {
      let me = this
      // me.index = 1 // 表示默认按质量排序
      me.api.get({
        url: `TopicAnswer?TopicId=${me.topicId}&SortCloume=${me.index}&PageIndex=${me.curPage}&PageSize=${me.pageSize}`,
        success: function (res) {
          console.log('回答列表',res)
          me.curPage === 1 && (me.answerList = [])
          me.answerList = me.answerList.concat(res)
        },
        error: function (res) {
          me.$msg.showError(res.msg)
          me.$refs.scroll && me.$refs.scroll.forceUpdate()
        },
        complete: function () {
          me.$refs.scroll && me.$refs.scroll.forceUpdate()
        }
      })
    },
    onPullingDown () {
      this.curPage = 1
      this.getAnswerList()
    },
    onPullingUp () {
      // 更新数据
      this.curPage++
      this.getAnswerList()
    },
     // 显示分享
    showShare: function (item) {
      let innerObj = {
        name: this.$route.name,
        objectId: item.topicId
      }
      this.$share.open(item, false, 'topicItem', this.$router.currentRoute.fullPath, innerObj)
    },
  }
}
</script>
<style lang="less" scoped>
.mySet-enter-active,.mySet-leave-active{
    transition:all 0.5s;
}
.mySet-enter,.mySet-leave-to{
    opacity:0;
}
.topicInnerBig{
  height:calc(100vh - 12vw);
  width:100%;
  overflow: hidden;
}
.topicInnerWrap{
  .shareTopic{
    height:12vw;
    line-height:12vw;
    position:fixed;
    top:0;
    right:4vw;
    z-index:1000;
    font-weight: bold;
    letter-spacing: 1px;
    width:80vw;
    text-align: right;
    i{
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
              font-size:5vw;
              position:relative;
              top:0;
              bottom:0;
              margin:auto 0;
    }
  }
  .joinAnswer{
    width:88vw;
    height:14.17vw;
    background-color:rgba(255, 40, 66,.8);
    position:fixed;
    left:0;
    right:0;
    bottom:6.9vw;
    z-index: 2;
    color:white;
    text-align: center;
    line-height:14.17vw;
    border-radius: 8vw;
    font-size:5vw;
    margin:auto;
  }
 .scrollWrap{
  width:100%;
  height:calc(100vh - 12vw);
  overflow: hidden;
  .topicList{
    .topicHead{
      width:100%;
      // height:99.25vw;
      .headImg{
        width:100%;
        height:46.3vw;
        overflow: hidden;
        position:relative;
        img{
          width:100%;
          height:auto;
          position:absolute;
          top:0;
          bottom:0;
          right:0;
          left:0;
          margin:auto;
        }
      }
      .topicProblem{
        width:93%;
        margin:auto;
        .topicTitle{
          width:100%;
          font-size:4.6vw;
          color:#191919;
          font-weight: bold;
          margin-top:1vw;
        }
        .problemDes{
          width:100%;
          font-size:4vw;
          color:#444444;
          margin-top:0.5vw;
          
          .originSource{
            line-height: 8vw;
            .goLink{
              display: inline-block;
              color: #618fc8;
            }
          }
          p{
            font-size:4vw;
            color:#444444;
          }
          .showMore{
            font-weight: bold;
          }
        }
      }
      .problemDetail{
        width:93%;
        margin:auto;
        margin-top:2vw;
        margin-bottom:3vw;
        display:flex;
        justify-content: space-between;
        align-items: center;
        font-size:3.7vw;
        color:#444444;
        .detailLeft{
          span:nth-child(1){
          margin-right:4vw;
        }
        }
        .detailRight{
          width:27.96vw;
          height:7vw;
          background-color:#ff2842;
          border-radius: 4vw;
          color:white;
          text-align: center;
          line-height:7vw;
        }
        .followed{
          background-color:rgba(154, 154, 154,.8);
        }
      }
    }
    .split{
      width:100%;
      height:10.83vw;
      background-color:#ebebeb;
      font-size:4vw;
      color:#999999;
      display:flex;
      justify-content: space-between;
      align-items: center;
      .splitLeft{
        margin-left:4vw;
      }
      .splitRight{
        margin-right:4vw;
        position:relative;
        span:nth-child(1) {
          margin-right:2.7vw;
        }
        .selectBtn{
          width:32vw;
          height:19vw;
          border:1px solid rgb(243,243,243);
          position:absolute;
          padding-left:2vw;
          padding-top:3vw;
          box-sizing: border-box;
          top:-2vw;
          left:-1vw;
          background-color:white;
          color:#444444;
          font-size:4vw;
          border-radius: 1vw;
          .btnOne{
            width:30vw;
            height:6vw;
            margin-bottom:1vw;
          }
          .activityNotice{
            color:blue;
            font-weight: 500;
          }
        }
      }
    }
  }
 }
}
</style>
