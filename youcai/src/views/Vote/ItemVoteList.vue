<template>
  <div class="voteBigWrap">
    <div v-if="$store.state.isZijiren"
         :class="['voteBtn',{noVote: isEnd}]"
         @click="goVotePost"
         :style="{background: calculateColor}">{{isEnd ? '已结束': '参与活动'}}</div>
    <div class="voteWrap">
      <scroll ref="scroll"
              :data="items"
              :scrollbar="scrollbarObj"
              :pullDownRefresh="pullDownRefreshObj"
              :pullUpLoad="pullUpLoadObj"
              :startY="parseInt(startY)"
              @pullingDown="onPullingDown"
              @pullingUp="onPullingUp"
              :probeType='3'>
        <div class="voteHead">
          <img :src="voteActivity.activityImg"
               alt="">
        </div>
        <div class="voteMessage"
             :style="myTheme">
          <img src="../../assets/voteImage/theme1.jpg"
               alt=""
               v-if="theme === 0">
          <img src="../../assets/voteImage/theme2.jpg"
               alt=""
               v-if="theme === 1">
          <img :src="selfData.voteDataBg"
               alt=""
               v-if="theme === 3">
          <div class="messageWrap">
            <div class="messageTop">
              <span>
                <i class="iconWshijian iconWanwan activityNotice"></i>
              </span>
              <!-- <span class="endTime">投票截止日期&nbsp;{{compluteTime}}&nbsp;{{compluteData}}</span> -->
              <span class="endTime"
                    v-if="voteActivity.endTime">投票截止日期&nbsp;{{isShowTime === 1 ? activityEnd : palyTime}}</span>
            </div>
            <div class="messageMain">
              <div class="one">
                <span>投票项</span>
                <span>{{voteActivity.countVoteItem}}</span>
              </div>
              <div class="one">
                <span>总投票数</span>
                <span>{{totalCount}}</span>
              </div>
              <div class="one">
                <span>总访问数</span>
                <span>{{voteActivity.readTime}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="voteList">
          <ul class="voteUl">
            <waterfall ref="listWrapper"
                       :isRefresh='isRefresh'
                       :addItems='addItems'
                       :vote='true'
                       :theme="theme"
                       @render='render'
                       @renderEnd='renderEnd'
                       @updateCount="updateCount"
                       :selfData="selfData"
                       :voteActivity="voteActivity"
                       :isImei='isImei'></waterfall>
          </ul>
        </div>
        <div>
          <NotFound :failTitle="failTitle"
                    v-if="isFail"></NotFound>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'
import waterfall from '@/components/Waterfall/Waterfall'
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
import NotFound from '@/components/requestState/NotFound'
export default {
  mixins: [scrollMixin],
  components: {
    scroll,
    NotFound,
    waterfall
  },
  data () {
    return {
      title: '',
       // 表示当前的投票活动
      voteActivity: {}, // 投票头部信息
      isLoad: true, // 是否正在加载
      isFail: false, // 是否加载失败
      failTitle: '还没有发表的投票项哦!',
      pullDownRefresh: true,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: true,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更多数据了',
      startY: 0,
      isLoading: true,
      items: [],
      addItems: [],
      curPage: 1,
      pageSize: 20,
      startDate: '',
      endDate: '',
      theme:5,
      myTheme: '',
      calculateColor: '',
      selfData: {},
      totalCount:'',
      isRefresh: false,
      isRenderEnd: false,
      endTime: '',
      downT: '',
      D: 0,
      hD:0,
      H:0,
      hH:0,
      M:0,
      hM: 0,
      S: 0,
      isShowTime: 0,
    }
  },
  watch: {
    theme (newV) {
      if (newV === 0) {
        this.myTheme = {
          color: 'rgb(255, 39, 66)'
        }
        if (this.voteActivity.isEnd) {
          this.calculateColor = 'rgba(154, 154, 154, 0.8)'
        } else {
          this.calculateColor = 'rgba(255, 39, 66,.8)'
        }
      } else if (newV === 1) {
        this.myTheme = {
          color: 'rgb(61,141,101)'
        }
        if (this.voteActivity.isEnd) {
          this.calculateColor = 'rgba(154, 154, 154, 0.8)'
        } else {
          this.calculateColor = 'rgba(61,141,101,.8)'
        }
      } else {
        this.myTheme = {
          color: this.selfData.color
        }
        if (this.voteActivity.isEnd) {
          this.calculateColor = 'rgba(154, 154, 154, 0.8)'
        } else {
          this.calculateColor = this.selfData.color
        }
      }
    },
    S (newV) {
      if (newV == '00' && this.H == '00' && this.M == '00' && this.S == '00') {
        this.isShowTime = 1
        console.log('命中s')
      }
    },
  },
  computed: {
    palyTime () {
      let me = this
      me.calculateTime()
      // eslint-disable-next-line
      me.myTimer = setInterval( () => {
       me.calculateTime()
      },1000)
        if (!me.D && !me.H && !me.M && !me.S) {
          return `${me.compluteTime} ${me.compluteData} (已结束)`
        } else {
          return ` ${me.D} 天 ${me.H} 时 ${me.M} 分 ${me.S} 秒`
        }
    },
    activityEnd () {
      return `${this.compluteTime} ${this.compluteData} (已结束)`
    },
    voteId () {
      return this.$route.params.id
    },
    isImei () {
      return this.voteActivity && this.voteActivity.isImei
    },
    isEnd () {
      return this.voteActivity && this.voteActivity.isEnd
    },
    /**
    * compluteTime计算时间
    */
    compluteTime () {
      return this.voteActivity.closeTime && this.voteActivity.closeTime.substring(0, 10)
    },
    compluteData () {
      return this.voteActivity.closeTime && this.voteActivity.closeTime.substring(11)
    },
    isMyActivity () {
      return this.$store.state.user.userId === this.voteActivity.userId
    }
  },
  created() {
    this.getHeadMsg()
    this.getVoteList()
  },
  activated () {
    this.getHeadMsg()
    this.memoryScroll()
  },
  beforeRouteLeave (to, from, next) {
    if (this.$refs.scroll && this.$refs.scroll.scroll && this.$refs.scroll.scroll.y) {
      from.meta.scrollY = this.$refs.scroll.scroll.y
    }
    clearInterval(this.myTimer)
    next()
  },
  mounted () {
    if (this.theme === 0) {
      this.myTheme = {
        color: 'rgb(255, 39, 66)'
      }
    }
    if (this.theme === 1) {
      this.calculateColor = 'rgba(61,141,101,.8)'
    }
  },
  beforeDestroy () {
    clearInterval(this.interval)
  },
  methods: {
    ...mapMutations({
      clearVoteList: 'clearVoteList'
    }),
    calculateTime () {
      let me = this
      let _date = (me.format.getDate(me.endTime)).getTime()
      let date = new Date().getTime()
      if (_date <= date ) {
        return 0
        } else {
          me.downT = _date - date
          me.D = me.format.formatNumber(parseInt(me.downT / (86400*1000)))
          me.hD = me.downT % (86400 * 1000)
          me.H = me.format.formatNumber(parseInt(me.hD / (3600*1000)))
          me.hH = me.hD % (3600 * 1000)
          me.M = me.format.formatNumber(parseInt(me.hH / (60 * 1000)))
          me.hM = me.hH % (60 * 1000)
          me.S = me.format.formatNumber(parseInt(me.hM / 1000))
       }
    },
    memoryScroll () {
      if (this.$route.meta && this.$route.meta.scrollY) {
        this.scrollTo(0, this.$route.meta.scrollY)
        this.$refs.scroll && this.$refs.scroll.refresh()
      }
    },
    updateCount () {
      this.totalCount++
    },
    /**
    * getHeadMsg得到投票活动的头部信息
    */
    getHeadMsg () {
      let me = this
      me.api.get({
        url: `VoteTopic/VoteActivityId?VoteActivityId=${this.voteId}`,
        success: function (res) {
          me.voteActivity = res
          me.startDate = res.beginTime
          me.endDate = res.closeTime
          me.totalCount = res.countTotalVote
          // me.$route.meta.title=res.title
          me.title = res.title
          me.endTime = res.endTime
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
    * goVotePost去到发布的投票活动
    */
    goVotePost () {
      if (!this.authentication.isLogin()) {
        this.go.login()
        return
      }
      if (this.isEnd) {
        this.$toast('投票活动已结束', 1200)
      } else {
        this.$router.push({ name: 'discoverPost', params: { id: this.voteId } })
      }
    },
    getVoteList() {
      let me = this
      me.isLoading = true
      me.api.get({
        url: `Vote/VoteTopicId?VoteActivityId=${this.voteId}&PageIndex=${me.curPage}&PageSize=${me.pageSize}`,
        success: function(res) {
          if (me.curPage === 1) {
            me.clearVoteList()
            me.isRefresh = true
            if (res.length === 0) {
              me.isFail = true
            }
          }
          me.addItems = res
        },
        error: function() {},
        complete: function() {}
      })
    },
    onPullingDown() {
      this.curPage = 1
      this.getVoteList()
      this.getHeadMsg()
    },
    onPullingUp() {
      // 更新数据
      if (this.isRenderEnd && this.addItems.length) {
        this.curPage++
        this.getVoteList()
      } else {
        this.addItems = []
      }
    },
    render () { // 开始渲染瀑布流
      this.isRefresh = false
    },
    renderEnd (data) { // 是否渲染完毕
      this.isRenderEnd = data
      if (data) {
        if (this.curPage === 1) {
          this.items = []
        }
        this.items = this.items.concat(this.addItems)
        this.$refs.scroll && this.$refs.scroll.forceUpdate()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.voteBigWrap{
    width:100%;
    .voteBtn{
      width:87.8vw;
      height:13.89vw;
      line-height:13.89vw;
      border-radius: 12vw;
      position:fixed;
      z-index:22;
      bottom:14.16vw;
      left:0;
      right:0;
      margin:0 auto;
      // background-color:rgba(255, 40, 66,.8);
      color:white;
      font-size:5.46vw;
      text-align: center;
      align-items: center;
    }
    .noVote{
        background:rgba(154, 154, 154, 0.8);
    }
}
   .voteWrap{
       width:100%;
       height:100%;
       height:calc(100vh - 12vw - 13.15vw);
        width:100%;
        overflow: hidden;
       .goback{
           width:100%;
           height:12vw;
           background-color:white;
           line-height:12vw;
           padding-left:4vw;
           box-sizing: border-box;
       }
       .voteHead{
         position: relative;
           width:100%;
           height:68.99vw;
           overflow: hidden;
           margin-top:2vw;
           img{
               width:100%;
               height:100%;
               object-fit: cover;
           }
           .reviseActivity{
            position: absolute;
            right: 4vw;
            bottom: 4vw;
            width: 12vw;
            border-radius: 50%;
            background: #e7e7e7;
            line-height: 12vw;
            height: 12vw;
            text-align: center;
            color: var(--lGray);
            font-size: var(--title);
          }
       }
       .voteMessage{
           width:100vw;
           height:48.7vw;
           position:relative;
           border:0.1px solid transparent;
           img{
               position:absolute;
               top:0;
               left:0;
               width:100vw;
               height:48.7vw;
               overflow: hidden;
               object-fit: cover;
           }
           p{
               width:100%;
               height:15.74vw;
               text-align: center;
               line-height:15.74vw;
               color:#000;
               font-size:5.74vw;
               position:relative;
               z-index:22;
           }
           .messageWrap{
               width:88.43vw;
               height:28.24vw;
               margin:auto;
               border-radius: 3vw;
               border:0.4vw solid;
               position:relative;
               z-index:22;
               margin-top:10vw;
               .messageTop{
                   width:100%;
                   height:12.41vw;
                   display:flex;
                   justify-content: center;
                   align-items: center;
                   font-size:3.5vw;
                   .activityNotice{
                    //    color: rgb(255, 40, 66);
                       font-size:5vw;
                       margin-right:2vw;
                   }
                   .endTime{
                       color:rgb(9, 9, 9);
                   }
               }
               .messageMain{
                   width:100%;
                   height:16.02vw;
                   display:flex;
                   .one{
                       width:33.33%;
                       height:100%;
                       span{
                           display:inline-block;
                           width:100%;
                            text-align: center;
                       }
                       span:nth-child(1) {
                           font-size:3.5vw;
                           color:#090909;
                       }
                       span:nth-child(2) {
                           font-size:5.1vw;
                           color:#1b1b1b;
                       }
                   }
               }
           }
       }
       .voteList{
           .voteUl{
               width:100%;
              //  padding:0vw 1.3vw 0vw 1.3vw;
               box-sizing: border-box;
               background-color:rgb(244, 249, 250);
           }
       }
   }
</style>
