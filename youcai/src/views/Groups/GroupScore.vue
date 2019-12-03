<template>
  <div class="GroupScore">
    <div class="scoreTitle">中老年结伴旅游旅居群</div>
    <span class="share"><i class="iconWanwan iconWshare activityNotice"></i></span>
    <div class="scoreState">
      <div class="star">
        <i class="iconWanwan iconWstar1 activityNotice"></i>
        <i class="count">9</i>
      </div>
      <div class="scoreDay">
        <p>已活跃155天&nbsp;<i class="specialFont">1.3</i>倍加速中</p>
        <span>超过交友-交友分类下<i class="specialFont">90%</i>的群组</span>
      </div>
      <div class="scoreBar"
           id="scoreBar">
        <span id="longBar"></span>
        <span id="sortBar"></span>
      </div>
      <div class="scoreTotal">
        <span>9级(活跃130天)</span>
        <span>10级(活跃190天)</span>
      </div>
    </div>
    <ul class="scoreUl">
      <li class="borderB oneLi"
          @click="goExplain">
        <span>群组等级说明</span>
        <span><i class="iconWanwan iconWright activityNotice"></i></span>
      </li>
      <li class="borderB twoLi">
        <span>活跃</span>
        <span>已达到活跃要求，展示活跃标签</span>
      </li>
      <li class="borderB threeLi">
        <span>VIP1</span>
        <span>当前为150人群</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      startDay:130, // 表示起点
      endDay:190, // 表示终点
      currentDay:155 // 当前活跃天数
    }
  },
  activated () {
    setTimeout(() => {
        this.calculateLongWidth()
    },1000)
  },
  methods: {
    /**
     * calculateLongWidth计算进度条的宽度
     */
    calculateLongWidth () {
      // 长的bar
      let longBar = document.getElementById('longBar')
      // 短的bar
      let sortBar = document.getElementById('sortBar')
      // 短的bar的宽度
      let sortWidth = sortBar.offsetWidth
      // 得到比例
      let distance = (this.currentDay - this.startDay) / (this.endDay - this.startDay)
      // 得到总的进度条宽度
      let scoreBar = document.getElementById('scoreBar')
      let width = (scoreBar.offsetWidth - sortWidth) * distance
      longBar.style.width = width + 'px'
      sortBar.style.left = width + 'px'
    },
    /**
     * goExplain 去到群等级说明页
     */
    goExplain () {
      this.$router.push({name: 'scoreExplain'})
    }
  }
}
</script>

<style lang="less" scoped>
@keyframes moveScale {
  0%{transform:scale(0); opacity:0.6;}
  100%{ transform:scale(1);opacity:1;}
}
    .GroupScore{
        font-size:0;
        background:#fafafa;
        width:100%;
        height:100%;
        .scoreTitle{
            position:fixed;
            top:0;
            right:0;
            left:0;
            margin:0 auto;
            width:70vw;
            height:12vw;
            text-align: center;
            line-height:12vw;
            color:black;
            font-size:6.2vw;
            z-index:1000;
        }
        .share{
            position:fixed;
            z-index:1000;
            top:0;
            right:2vw;
            height:12vw;
            line-height:12vw;
            width:7vw;
            .activityNotice{
                font-size:6.1vw;
                color:#999;
                font-weight: 500;
            }
        }
        .scoreState{
            width:100%;
            padding:0 4vw;
            padding-top:11.9vw;
            box-sizing: border-box;
            background:#fafafa;
            height:60.74vw;
            .star{
                width:15.7vw;
                height:7vw;
                border-radius: 4vw;
                margin:auto;
                background-color:#fe8c56;
                display:flex;
                align-items: center;
                justify-content: center;
                padding:0 1vw;
                box-sizing: border-box;
                animation: moveScale 0.7s 0s  forwards;
                .activityNotice{
                    color:rgb(252, 229, 49);
                    font-size:5vw;
                }
                .count{
                    color:white;
                    font-size:3.7vw;
                    font-style: normal;
                }
            }
            .scoreDay{
                .specialFont{
                    font-style: normal;
                    color:rgb(25, 111, 255);
                }
                p{
                    width:100%;
                    text-align: center;
                    color:#1e1e1e;
                    font-size:3.89vw;
                    margin-top:7vw;
                }
                span{
                    width:100%;
                    display:inline-block;
                    text-align: center;
                    font-size:3.5vw;
                    color:#aaa;
                }
            }
            .scoreBar{
                width:100%;
                background:#f0f0f0;
                height:1vw;
                position:relative;
                margin-top:5vw;
                span:nth-child(1) {
                    width:0vw;
                    height:1vw;
                    position:absolute;
                    top:0;
                    left:0;
                    background:#6488fd;
                    transition:all 0.5s;
                }
                span:nth-child(2) {
                    width:1.8vw;
                    height:1.8vw;
                    border-radius: 50%;
                    position:absolute;
                    top:-0.5vw;
                    left:0vw;
                    background:#6488fd;
                    transition:all 0.5s;
                }
            }
            .scoreTotal{
                width:100%;
                display:flex;
                justify-content: space-between;
                font-size:3.4vw;
                color:#aaa;
                margin-top:2vw;
            }
        }
        .scoreUl{
            width:100%;
            padding:0 4vw;
            box-sizing: border-box;
            background:white;
            color:rgb(59, 59, 59);
            li{
                width:100%;
                height:13.8vw;
            }
            .oneLi{
                font-size:4.5vw;
                display:flex;
                align-items: center;
                justify-content: space-between;
            }
            .twoLi{
                display:flex;
                align-items: center;
                span:nth-child(1) {
                    width: 11vw;
                    height: 5.8vw;
                    line-height:5.8vw;
                    border-radius: 3vw;
                    text-align: center;
                    background-color:rgb(154, 218, 63);
                    font-size:3vw;
                    color:white;
                }
                span:nth-child(2) {
                    margin-left:5.8vw;
                    line-height:4.2vw;
                    text-align: center;
                    font-size:4.16vw;
                }
            }
            .threeLi{
                display:flex;
                align-items: center;
                span:nth-child(1) {
                    width: 14vw;
                    height: 5.8vw;
                    line-height:5.8vw;
                    border-radius: 3vw;
                    text-align: center;
                    background-color:rgb(253, 208, 76);
                    font-size:3vw;
                    color:white;
                }
                span:nth-child(2) {
                    margin-left:3vw;
                    line-height:4.2vw;
                    text-align: center;
                    font-size:4.16vw;
                }
            }
        }
    }
</style>