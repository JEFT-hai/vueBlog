<template>
  <div class="voteDetail">
    <img src="../../assets/voteImage/Bg1.png"
         alt=""
         class="bottomImage"
         v-if="theme === 0">
    <img src="../../assets/voteImage/Bg2.png"
         alt=""
         class="bottomImage"
         v-if="theme === 1">
    <img :src="selfData.bg"
         alt=""
         v-if="theme === 3"
         class="bottomImage">
    <div class="detailMain">
      <div class="voteTime"
           :style="fontColor">
        <span class="titleWrap"
              :style="myTheme">
          <i class="iconWzan1 iconWanwan whiteXin xinOne"></i>
          <i class="time">投票时间</i>
          <i class="iconWzan1 iconWanwan whiteXin xinTwo"></i>
        </span>
        <span class="timeTitle"
              v-if="this.voteActivity.beginTime && this.voteActivity.closeTime">{{calculateTime}}</span>
      </div>
      <div class="voteRules"
           :style="fontColor">
        <span class="titleWrap"
              :style="myTheme">
          <i class="iconWzan1 iconWanwan whiteXin xinOne"></i>
          <i class="time">投票规则</i>
          <i class="iconWzan1 iconWanwan whiteXin xinTwo"></i>
        </span>
        <div class="rulesList">
          <div class="jeft-editor-contentShow"
               v-html='rules'
               v-if="this.voteActivity.voteRule"></div>
          <div class="selfRules"
               v-else>
            <p class="detailContent twoContent">1. 每人每天可给多个参赛作品投票</p>
            <p class="detailContent twoContent">2. 同一参赛作品每人每天限制一票，每天都可投</p>
            <p class="detailContent twoContent">3. 可将投票页分享至微信进行拉票</p>
          </div>
        </div>
      </div>
      <div class="voteDetailWrap"
           :style="fontColor">
        <span class="titleWrap"
              :style="myTheme">
          <i class="iconWzan1 iconWanwan whiteXin xinOne"></i>
          <i class="time">投票详情</i>
          <i class="iconWzan1 iconWanwan whiteXin xinTwo"></i>
        </span>
        <div class="detailList">
          <div class="jeft-editor-contentShow"
               v-html='details'></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      voteId: this.$route.params.id,
      voteActivity: {},
      theme: 5,
      myTheme: '',
      fontColor: '',
      selfData: {},
      pullDownRefresh: false,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: false,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更多数据了',
      isLoading: false,
      items: [],
    }
  },
    watch: {
      theme (newV) {
        if (newV === 0) {
          this.myTheme = {
              background: 'rgb(255, 39, 66)'
          }
          this.bg = {
              background: 'rgba(255, 39, 66,.8)'
          }
          this.fontColor = {
            border: '1px solid rgb(255, 39, 66)'
          }
        } else if (newV === 1) {
          this.myTheme = {
              background: 'rgb(61,141,101)'
          }
          this.fontColor = {
            border: '1px solid rgb(61,141,101)'
          }
        } else {
            this.myTheme = {
                background: this.selfData.color
            }
            this.fontColor = {
              border: '1px solid ' + this.selfData.color
          }
        }
      }
    },
  computed: {
    calculateTime () {
      if (this.voteActivity) {
        let startTime = this.voteActivity.beginTime && this.voteActivity.beginTime.substring(0,10)
        let endTime = this.voteActivity.closeTime && this.voteActivity.closeTime.substring(0,10)
        return startTime + ' 至 ' + endTime
      } else {
        return ''
      }
    },
    details () {
      return this.voteActivity.details && this.voteActivity.details.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    },
    rules () {
      return this.voteActivity.voteRule && this.voteActivity.voteRule.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    }
  },
  mounted () {
    this.getHeadMsg()
  },
  activated () {
    console.log('detailD')
  },
  methods: {
       /**
       * getHeadMsg得到投票活动的头部信息
       */
      getHeadMsg () {
        let me = this
        me.api.get({
          url:`VoteTopic/VoteActivityId?VoteActivityId=${this.voteId}`,
          success: function (res) {
            me.voteActivity = res
            if (res.selfData) {
               me.theme = 3
               me.selfData = JSON.parse(res.selfData)
            } else {
               me.theme = res.fee
            }
          },
          error: function() {
            me.$refs.scroll && me.$refs.scroll.forceUpdate()
          },
          complete: function() {
            me.$refs.scroll && me.$refs.scroll.forceUpdate()
          }
        })
      },
    onPullingDown () {
    },
    onPullingUp () {
    }
  }
}
</script>


<style lang="less" scoped>
  .voteDetail{
    width:100vw;
    height:100vh;
    .bottomImage{
       overflow: hidden;
       width:100%;
       height:calc(100vh - 13.34vw - 13.15vw);
       position:fixed;
       top:13.34vw;
       left:0;
       object-fit: cover;
   }
   .detailMain{
     width:100vw;
    //  height:90vh;
     left:0;
     z-index:11;
     width:90%;
    //  min-height:calc(100vh - 40vw);
    //  overflow:scroll;
     margin:auto;
     margin-bottom:20vw;
     border-radius: 2vw;
     position:relative;
     z-index:98;
     top:10vw;
     .voteTime{
       width:100%;
       border:1px solid ;
       border-radius: 2vw;
       position:relative;
       background:white;
      //  border:1px solid blue;
       height:23vw;
       .titleWrap{
         position:absolute;
         top:-5vw;
         left:0;
         right:0;
         margin:0 auto;
         color:white;
         width:40vw;
         height:10vw;
         border-radius: 5vw;
        display:flex;
        justify-content: space-between;
        align-items: center;
        z-index:222;
        .whiteXin{
          color:white;
          font-size:5vw;
        }
        .xinOne{
          margin-left:3vw;
        }
         .xinTwo{
          margin-right:3vw;
        }
        .time{
          font-style: normal;
          font-size:4.5vw;
        }
       }
       .timeTitle{
         width:100%;
         position:absolute;
         left:0;
         bottom:5vw;
         text-align: center;
         font-size: 4.4vw;
          line-height: 1.5;
          // margin: 1.5vw 0 0 0;
          letter-spacing: 0.3vw;
       }
     }
     .voteRules{
       width:100%;
       border:1px solid;
       border-radius: 2vw;
       position:relative;
       background:white;
       padding:3vw 0;
       box-sizing: border-box;
       margin-top:15vw;
       .titleWrap{
         position:absolute;
         top:-5vw;
         left:0;
         right:0;
         margin:0 auto;
         color:white;
         width:40vw;
         height:10vw;
         border-radius: 5vw;
        display:flex;
        justify-content: space-between;
        align-items: center;
        z-index:222;
        .whiteXin{
          color:white;
          font-size:5vw;
        }
        .xinOne{
          margin-left:3vw;
        }
         .xinTwo{
          margin-right:3vw;
        }
        .time{
          font-style: normal;
          font-size:4.5vw;
        }
       }
       .rulesList{
         padding:3vw 0vw;
         box-sizing: border-box;
         .selfRules{
           width:100%;
           padding:0 4vw;
           box-sizing: border-box;
           p{
             font-size: 4.4vw;
             line-height: 2;
             letter-spacing: 0.3vw;
           }
         }
       }
     }
     .voteDetailWrap{
       width:100%;
       border:1px solid ;
       border-radius: 2vw;
       position:relative;
       background:white;
       padding:3vw 0;
       box-sizing: border-box;
       margin-top:15vw;
       margin-bottom: 20vw;
       .titleWrap{
         position:absolute;
         top:-5vw;
         left:0;
         right:0;
         margin:0 auto;
         color:white;
         width:40vw;
         height:10vw;
         border-radius: 5vw;
        display:flex;
        justify-content: space-between;
        align-items: center;
        z-index:222;
        .whiteXin{
          color:white;
          font-size:5vw;
        }
        .xinOne{
          margin-left:3vw;
        }
         .xinTwo{
          margin-right:3vw;
        }
        .time{
          font-style: normal;
          font-size:4.5vw;
        }
       }
       .detailList{
         padding:3vw 0vw 12vw 0vw;
         box-sizing: border-box;
       }
     }
   }
  }
</style>