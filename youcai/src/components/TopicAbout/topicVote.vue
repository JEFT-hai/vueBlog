<template>
    <div class="voteWrap">
        <div class="goback">
            <span>
                <i class="iconWfanhui iconWanwan activityNotice"></i>
            </span>
        </div>
        <div class="voteHead">
            <img src="../../assets/images/topicvote.png" alt="">
        </div>
        <div class="voteMessage">
            <p>最美穿搭达人</p>
            <div class="messageWrap">
                <div class="messageTop">
                    <span>
                        <i class="iconWshijian iconWanwan activityNotice"></i>
                    </span>
                    <span>活动已经结束&nbsp;2018年&nbsp;12月&nbsp;30日&nbsp;0时&nbsp;0分</span>
                </div>
                <div class="messageMain">
                    <div class="one">
                        <span>投票项</span>
                        <span>10</span>
                    </div>
                    <div class="one">
                        <span>总投票数</span>
                        <span>10</span>
                    </div>
                    <div class="one">
                        <span>总访问数</span>
                        <span>11791</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="voteList">
            <ul class="voteUl">
                <VoteItem></VoteItem>
                <VoteItem></VoteItem>
                <VoteItem></VoteItem>
                <VoteItem></VoteItem>
            </ul>
        </div>
    </div>
</template>

<script>
import VoteItem from './voteItem'
export default {
    components: {
        VoteItem
    }
}
</script>

<style lang="less" scoped>
   .voteWrap{
       width:100%;
       height:100%;
       position:absolute;
       top:0;
       left:0;
       z-index: 101;
       .goback{
           width:100%;
           height:12vw;
           background-color:white;
           line-height:12vw;
           padding-left:4vw;
           box-sizing: border-box;
       }
       .voteHead{
           width:100%;
           height:68.99vw;
           img{
               width:100%;
               height:100%;
           }
       }
       .voteMessage{
           width:100%;
           height:48.7vw;
           background: url('../../assets/images/topicBg2.jpg') no-repeat;
           background-size: cover;
           p{
               width:100%;
               height:15.74vw;
               text-align: center;
               line-height:15.74vw;
               color:#000;
               font-size:5.74vw;
           }
           .messageWrap{
               width:88.43vw;
               height:28.24vw;
               margin:auto;
               border-radius: 3vw;
               border:0.4vw solid #e62849;
               .messageTop{
                   width:100%;
                   height:12.41vw;
                   display:flex;
                   justify-content: center;
                   align-items: center;
                   font-size:3.5vw;
                   .activityNotice{
                       color:#e62849;
                       font-size:5vw;
                       margin-right:2vw;
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
               display:flex;
               width:100%;
               padding:0vw 1.3vw;
               box-sizing: border-box;
               flex-flow: row wrap;
               justify-content: space-between;
               background-color:rgb(244, 249, 250);
           }
       }
   } 
</style>