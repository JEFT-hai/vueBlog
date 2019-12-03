<template>
  <div class="flowerDetail">
    <ExchangeExplain @handlePage="handlePage"
                     v-if="isShowExchange"></ExchangeExplain>
    <div class="flowerHead">
      <span class="activityNotice">积分</span>
      <div class='numberWrap'>
        <!-- <span v-for="(flowers,index) in item.flowersCount.length"
              :key="index"
              class="flowersBox">{{item.flowersCount.substr(index,1)}}</span> -->
        <FlowerScroll v-for="(flowers,index) in item.flowersCount.length"
                      :key="index"
                      :countNumber="parseInt(item.flowersCount.substr(index,1))"></FlowerScroll>
      </div>
    </div>
    <div class="flowerList">
      <div class="flowerCount">
        <div class="flowerTitle"
             @click="handlePage(true)">积分兑换<i class="iconWwenhao iconWanwan activityNotice"></i></div>
        <div class="flowerTrade">
          <span class="isCan">当前拥有积分<i>&nbsp;{{item.flowersCount}}&nbsp;</i></span>
          <span class="rightNow" v-if='!user.vipLevel' @click="rightExchange">立即兑换</span>
          <span class="rightNow" v-else >已兑换</span>
        </div>
      </div>
      <div class="tradeDetail borderB">交易明细</div>
      <NotFound v-if="noData" :failTitle="failTitle"></NotFound>
      <ul class="flowersUl" v-else>
        <scroll ref="scroll"
                :data="items"
                :scrollbar="scrollbarObj"
                :pullDownRefresh="pullDownRefreshObj"
                :pullUpLoad="pullUpLoadObj"
                :startY="parseInt(startY)"
                @pullingDown="onPullingDown"
                @pullingUp="onPullingUp">
          <li class="flowersLi"
              v-for="(item,index) in integralDetail"
              :key="index">
            <div class="rewardContent">
              <span class="title">{{item.reason}}</span>
              <span class="time">{{item.createTime.substring(0,10)}}&nbsp;{{item.createTime.substring(11,16)}}</span>
            </div>
            <div class="rewardFlowers">+{{item.point}}</div>
          </li>
          
        </scroll>
      </ul>
    </div>
  </div>
</template>

<script>
import ExchangeExplain from '@/components/Task/ExchangeExplain'
import FlowerScroll from '@/components/Task/flowersCountScroll'
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
import NotFound from '@/components/requestState/NotFound'

import { mapState, mapActions } from 'vuex'
export default {
  mixins: [scrollMixin],
   data () {
     return {
       item: {
         flowersCount: '',
       },
       isShowExchange: false,
       integralDetail: '', // 积分详情
       taskState: '', // 任务状态
       failTitle: '还没有积分哦,马上去做任务吧!',
        noData: false,
        pullDownRefresh: false,
        pullUpLoadTxt: '刷新成功',
        pullUpLoad: true,
        pullUpLoadMoreTxt: '加载更多',
        pullUpLoadNoMoreTxt: '没有更多数据了',
        isLoading: true,
        items: [],
        curPage: 1,
        pageSize: 7,
        busy: false
     }
   },
   components: {
     ExchangeExplain,
     FlowerScroll,
     scroll,
     NotFound
   },
   created(){
     this.getCodeDetail()
     this.getTaskState()
   },
   computed: {
     ...mapState(['user']),
   },
   methods:{
     ...mapActions(['toBeVIP']),
     rightExchange () { // 兑换VIP 
        // if (this.item && this.item.flowersCount < 1000) {
        //   console.log('小于1000')
        //   return
        // }
        let me = this
        if (me.busy) {
          return
        }
        this.toBeVIP()
            .then(() => {
              me.busy = false
            })
            .catch((err) => {
              me.$toast(err)
              me.busy = false
            })

     },
     getCodeDetail () {
       let me = this
       me.api.get({
         url: `Task/point-detail?PageIndex=${me.curPage}&PageSize=${me.pageSize}`,
         success: function(res) {
          me.curPage === 1 && (me.integralDetail = [])
          me.integralDetail = me.integralDetail.concat(res)
          if (me.curPage === 1 && res.length === 0) {
            console.log('不是吧', res)
            me.noData = true
          }
          if (me.integralDetail.length > 0) {
            // me.isLoad = false
            // me.isFail = false
          } else if (me.integralDetail.length === 0) {
            // me.isLoad = false
            // me.isFail = true
          }
         },
         error: function (res) {
            me.$msg.showError(res.msg)
            me.$refs.scroll && me.$refs.scroll.forceUpdate()
          },
          complete: function () {
            me.$refs.scroll && me.$refs.scroll.forceUpdate()
            me.isLoad = false
          }
       })
     },
     getTaskState () {
       let me = this
       me.api.get({
          url: 'Task',
          success: function(res){
            me.item.flowersCount = res.taskPoint + ''
            console.log('打印一下', me.flowersCount)
          },
          error: function(err){
            me.$toast(err)
          }
        })
     },
     handlePage (data) {
       this.isShowExchange = data
     },
     onPullingDown () {
      this.curPage = 1
      this.getCodeDetail()
     },
     onPullingUp () {
        // 更新数据
        this.curPage++
        this.getCodeDetail()
     }
   }
}
</script>

<style lang="less" scoped>
  .flowerDetail{
    width:100vw;
    overflow-x: hidden;
      .flowerHead{
        height:23.89vw;
        width:100vw;
        background:pink;
        display:flex;
        justify-content: center;
        background: url('../../assets/images/yellowBg.jpg') no-repeat;
        background-size:100% 100%;
        .activityNotice{
          color:white;
          font-size:5vw;
          margin-right:2vw;
          display:inline-block;
          line-height:13vw;
        }
        .numberWrap{
          margin-top:3vw;
          display:flex;
          flex-flow: row nowrap;
        }
      }
      .flowerList{
        width:100vw;
        border:1px solid white;
        position:relative;
        .flowerCount{
          position:absolute;
          top:-9.62vw;
          left:0;
          right:0;
          margin:0 auto;
          width:94.72vw;
          height:18.89vw;
          font-size:0;
          background:white;
          box-shadow: 0 0 4px #ccc;
          .flowerTitle{
            width:24.26vw;
            height:5.8vw;
            background:rgb(253, 201, 97);
            text-align: center;
            line-height:5.8vw;
            border-radius: 0 0 2vw 0vw;
            color:white;
            font-size:3.7vw;
            .activityNotice{
              color:white;
              font-size:4vw;
              margin-left:1vw;
            }
          }
          .flowerTrade{
            margin-top:2vw;
            padding:0 2vw;
            box-sizing: border-box;
            display:flex;
            justify-content: space-between;
            .isCan{
              font-size:4.3vw;
              i{
                font-style: normal;
                font-size:6vw;
                font-weight: bolder;
                position:relative;
                bottom:-0.5vw;
                right:0;
              }
            }
            .rightNow{
              display:inline-block;
              width:22.87vw;
              height:7.8vw;
              background:rgb(253, 205, 198);
              color:white;
              font-size:3.5vw;
              border-radius: 4vw;
              text-align: center;
              line-height:7.8vw;
            }
          }
        }
        .tradeDetail{
          width:100vw;
          height:11.29vw;
          padding-left:5.37vw;
          box-sizing: border-box;
          font-size:4.17vw;
          line-height:11.29vw;
          margin-top:9.62vw;
        }
        .flowersUl{
          height:calc(100vh - 58vw);
          overflow: hidden;
          .flowersLi{
            padding:3.7vw 3vw 3.7vw 5.37vw;
            box-sizing: border-box;
            display:flex;
            justify-content: space-between;
            align-items: center;
            font-size:0;
            .rewardContent{
              width:60vw;
              .title{
                display:inline-block;
                width:100%;
                font-size:4.17vw;

              }
              .time{
                margin-top:2vw;
                font-size:3.7vw;
                color:rgb(128, 128, 128);
              }
            }
            .rewardFlowers{
              font-size:3.7vw;
              color:rgb(128, 128, 128);
            }
          }
        }
      }
  }  
</style>