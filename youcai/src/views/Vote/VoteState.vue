<template>
  <div class="voteStatePage">
    <img src="../../assets/voteImage/Bg1.png"
         alt=""
         class="VoteStateImage"
         v-if="theme === 0">
    <img src="../../assets/voteImage/Bg2.png"
         alt=""
         class="VoteStateImage"
         v-if="theme === 1">
    <img :src="selfData.bg"
         alt=""
         v-if="theme === 3"
         class="VoteStateImage" />
    <div class="voteListWrap"
         :style="fontColor">
      <div class="rankHead"
           :style="backColor">
        <img src="../../assets/voteImage/粉色花.png"
             alt=""
             class='topStyle'>
        <span class="rankTitle">排行榜</span>
      </div>
      <div class="voteType">
        <span :class="{specialColor: tabIndex === 1}"
              @click="handLeIndex(1)"
              :style="tabIndex === 1 ? bottomColor : ''">日投票</span>
        <span :class="{specialColor: tabIndex === 2}"
              @click="handLeIndex(2)"
              :style="tabIndex === 2 ? bottomColor : ''">总投票</span>
      </div>
      <div class="voteCountList">
        <scroll ref="scroll"
                :data="voteList"
                :scrollbar="scrollbarObj"
                :pullDownRefresh="pullDownRefreshObj"
                :pullUpLoad="pullUpLoadObj"
                :startY="parseInt(startY)"
                @pullingDown="onPullingDown"
                @pullingUp="onPullingUp">
          <!-- <ul > -->
          <transition-group name="flip-list"
                            class="voteUl"
                            tag="ul">
            <li class="voteLi"
                v-for="(item, index) in endVoteList"
                :key="item.postId"
                @click="goDetail(item, 'picture')">
              <span :class="['voteState',{voteOne: index === 0}, {voteTwo: index === 1}, {voteThree: index === 2}]">{{index + 1}}</span>
              <div class="userAvatar">
                <img :src="item.avatar ? item.avatar : defaultAvatar"
                     alt="">
              </div>
              <span class="userName">{{item.postTitle ? item.postTitle : item.content ? item.content : item.nickName}}</span>
              <span class="voteDayCount"
                    :style="tabIndex === 1  ? myTheme : ''">{{format.formatNum(item.countVoteDay)}}票</span>
              <span class="voteTotalCount"
                    :style="tabIndex === 2  ? myTheme : ''">{{format.formatNum(item.countVote)}}票</span>
            </li>
          </transition-group>
          <!-- </ul> -->
          <div class="noData"
               v-if="isNoData">
            <NotFound :failTitle="failTitle"></NotFound>
          </div>
        </scroll>
      </div>
    </div>
  </div>
</template>

<script>
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
import NotFound from '@/components/requestState/NotFound'
import {mapState,mapMutations} from 'vuex'
export default {
  name: 'voteState',
  mixins: [scrollMixin],
  data () {
    return {
      title: '',
      defaultAvatar: 'http://webapp.szwanwan.com/img/default/defaultavatar.png',
      tabIndex: 1,
      isNoData: false,
      voteId: this.$route.params.id, // 表示当前的投票活动
      voteActivity: null, // 投票头部信息
      voteList: [], // 投票项
      voteRellyList: [],
      isLoad: true, // 是否正在加载
      isFail: false, // 是否加载失败
      failTitle: '还没有发表的投票项哦!',
      pullDownRefresh: true,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: false,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更多数据了',
      isLoading: true,
      items: [],
      curPage: 1,
      pageSize: 60,
      theme: 5,
      myTheme: '',
      fontColor: '',
      selfData: {},
      myTopColor: '',
      backColor: '',
      bottomColor: ''
    }
  },
    components: {
        scroll,
        NotFound
    },
    watch: {
      theme (newV) {
        if (newV === 0) {
          this.myTheme = {
            color: 'rgb(255, 39, 66)'
          }
          this.myTopColor = {
              color: 'rgb(255, 39, 66)'
            }
          this.fontColor = {
            border: '2px solid rgb(255, 39, 66)'
          }
          this.bottomColor = {
            borderBottom: '2px solid rgb(255, 39, 66)'
          }
          this.backColor = {
            background: 'rgb(255, 39, 66)'
          }
        } else if (newV === 1) {
          this.myTheme = {
              color: 'rgb(61,141,101)'
          }
          this.myTopColor = {
              color: 'rgb(61,141,101)'
            }
          this.fontColor = {
            border: '2px solid rgb(61,141,101)'
          }
          this.bottomColor = {
            borderBottom: '2px solid rgb(61,141,101)'
          }
          this.backColor = {
            background: 'rgb(61,141,101)'
          }
        } else {
            this.myTheme = {
              color: this.selfData.color
            }
            this.myTopColor = {
              color: this.selfData.rankTopColor
            }
             this.fontColor = {
              border: '2px solid ' + this.selfData.color
          }
          this.bottomColor = {
            borderBottom: '2px solid ' + this.selfData.color
          }
          this.backColor = {
            background: this.selfData.color,
          }
        }
      }
    },
    computed : {
      ...mapState(['isShowVoteStatePage']),
      voteListDay () {
        function compare(property){
            return function(a,b){
                var value1 = a[property]
                var value2 = b[property]
                return value2 - value1
            }
        }
        // eslint-disable-next-line
        let arr = this.voteList.sort(compare('countVoteDay'))
        return arr
      },
      endVoteList () { // 投票列表
          if (this.tabIndex === 1) {
            return this.voteListDay
          } else {
            return this.voteRellyList
          }
        }
    },
    created () {
      this.getHeadMsg()
      this.getVoteList()
    },
    activated () {
      console.log('每一次进来')
      this.getVoteList()
      this.$refs.scroll && this.$refs.scroll.forceUpdate()
    },
    methods: {
      ...mapMutations(['updateVotePage']),
      goDetail (oneVote, param) { // 去到投票的详情
        if (!this.isShowVoteStatePage) {
          this.updateVotePage(true)
        }
        if (oneVote.postType === 1) {
            this.$router.push({ name: 'discoverItemOnly', params: { id: oneVote.userId, key: param, postId: oneVote.postId } })
        } else {
          this.go.nameAParams('voteHVideoDetail', {'postId':oneVote.postId, id: oneVote.activityId})
        }
      },
      handLeIndex (index) {
        this.tabIndex = index
        this.rebuildScroll()
      },
      /**
       * getHeadMsg得到投票活动的头部信息
       */
      getHeadMsg () {
        let me = this
        me.api.get({
          url:`VoteTopic/VoteActivityId?VoteActivityId=${this.voteId}`,
          success: function (res) {
            me.voteActivity = res
            me.title=res.title
            console.log('state')
            if (res.selfData) {
               me.theme = 3
               me.selfData = JSON.parse(res.selfData)
            } else {
               me.theme = res.fee
            }
          }
        })
      },
      /**
       * getVoteList得到投票项
       */
      getVoteList () {
        console.log('是否调用了')
        let me = this
        let number = 1
        me.api.get({
          url: `Vote/VoteTopicId?VoteActivityId=${this.voteId}&PageIndex=${me.curPage}&PageSize=${me.pageSize}&Order=${number}`,
          success: function(res) {
            me.curPage === 1 && (me.voteList = [])
            me.voteList = me.voteList.concat(res)
            me.voteRellyList = res
            if (me.curPage === 1 && res.length <= 0) {
              me.isNoData = true
            }
          },
          error: function (res) {
            me.$msg.showError(res.msg)
            me.$refs.scroll && me.$refs.scroll.forceUpdate()
          },
          complete: function () {
            me.$refs.scroll && me.$refs.scroll.forceUpdate()
            me.isLoading = false
          }
        })
      },
      onPullingDown () {
        this.curPage = 1
        this.getVoteList()
      },
      onPullingUp () {
        // 更新数据
        // this.curPage++
        // this.getVoteList()
      },
      /**
       * goVotePost去到发布的投票活动
       */
       goVotePost () {
         if (this.isEnd) {
             this.$toast('投票活动已结束', 500)
         } else {
             this.$router.push({ name: 'vote_post', params: {id: this.voteId} })
         }
       }
    }
}
</script>

<style lang="less" scoped>
.flip-list-move {
  transition: transform 0.75s;
}
  .voteStatePage{
     width:100%;
     height:calc(100vh - 13.34vw);
     position:relative;
     overflow: hidden;
     .VoteStateImage{
        position:absolute;
        top:0;
        left:0;
        width:100%;
        height:calc(100vh - 13.34vw);
        object-fit: cover;
     }
     .VoteTop{
       position:absolute;
       top:15vw;
       left:0;
       right:0;
       margin:0 auto;
        .flag{
            width:66vw;
            height:31vw;
            overflow: hidden;
            position:absolute;
            top:-13vw;
            left:0;
            right:0;
            margin:0 auto;
            z-index:100;
        }
        .title{
            width:100%;
            text-align: center;
            position:absolute;
            // top:1vw;
            left:0;
            right:0;
            margin:0 auto;
            z-index:101;
            font-size:5vw;
            font-weight: bold;
            font-family:Times, TimesNR, 'New Century Schoolbook', Georgia, 'New York', serif;
        }
        .pinkTitle{
           top:-2vw;
        }
     }
     .voteListWrap{
       width:90vw;
       position: relative;
       top:10vw;
       left:0;
       right:0;
       margin:auto;
       height:calc(100vh - 40vw);
       border:3px solid;
       background:white;
       border-radius: 4vw;
       .rankHead{
         width:41.11vw;
         height:10vw;
         position:absolute;
         border-radius: 2vw;
         top:-5vw;
           left:0;
           right:0;
           margin:0 auto;
           font-size:5vw;
           font-weight: bold;
           font-family:Times, TimesNR, 'New Century Schoolbook', Georgia, 'New York', serif;
           .topStyle{
             width:12vw;
             height:13vw;
             position: absolute;
             left:-8vw;
           }
         .rankTitle{
           position:absolute;
           top:0;
           left:0;
           right:0;
           bottom:0;
           margin:auto;
           font-size:5vw;
           font-weight: bold;
           font-family:Times, TimesNR, 'New Century Schoolbook', Georgia, 'New York', serif;
           width:20vw;
           height:10vw;
           line-height:10vw;
           text-align: center;
           color:white;
         }
       }
       .voteType{
          width:90vw;
          height:19vw;
          display:flex;
          justify-content: flex-end;
          align-items: baseline;
          padding-top:6vw;
          padding-right:2vw;
          box-sizing: border-box;
          span{
            color:#999;
            padding:1vw;
            box-sizing: border-box;
          }
          span:nth-child(1) {
            margin-right:4vw;
          }
          .specialColor{
            color:black;
            font-weight: bold;
          }
       }
       .voteCountList{
         width:90vw;
         height:calc(100vh - 60vw);
         overflow: hidden;
         .voteUl{
           .voteLi{
             width:100vw;
             height:15vw;
             display:flex;
             flex-flow: row nowrap;
             align-items: center;
             .voteState{
               width: 7vw;
               font-size:4vw;
               color:rgb(163, 163, 163);
               display:inline-block;
               margin-left:2vw;
               font-family:Times, TimesNR, 'New Century Schoolbook', Georgia, 'New York', serif;
             }
             .voteOne{
               color:red;
               font-size:5vw;
               font-weight: bold;
             }
             .voteTwo{
               color:rgb(209, 73, 48);
               font-size:5vw;
               font-weight: bold;
             }
             .voteThree{
               color: rgb(245, 169, 140);
               font-size:5vw;
               font-weight: bold;
             }
             .userAvatar{
               width:11vw;
               height:11vw;
               border-radius: 50%;
               border:1px solid #eee;
               overflow: hidden;
               margin-left:2vw;
               img{
                 width:100%;
                 height:100%;
               }
             }
             .userName{
               display:inline-block;
               width:29vw;
              //  height:10vw;
               overflow:hidden;
               text-overflow:ellipsis;
               white-space:nowrap;
               word-wrap: break-word;
               word-break: break-all;
               margin-left:2vw;
               margin-right:2vw;
               font-size:3.7vw;
             }
             .voteDayCount{
               width:15vw;
               display:inline-block;
               text-align: center;
               font-size:3.7vw;
               color:black;
             }
             .voteTotalCount{
               margin-left:1vw;
               width:15vw;
               display:inline-block;
               text-align: center;
               font-size:3.7vw;
             }
           }
         }
       }
     }
  }
</style>
