<template>
  <ul class="socreExplain">
    <li class="bigLi borderB">
      <p>什么是群组等级</p>
      <span class="smaillTitle">群组等级是群组活跃程度和活跃时间的体现</span>
    </li>
    <!-- <li class="bigLi borderB">
            <p>群组等级升级要求</p>
            <span class="seeMore">点击查看</span>
        </li> -->
    <li class="bigLi borderB">
      <p>如何快速提升群组等级</p>
      <span :class="['seeMore',{isBtn:isMore}]"
            @click="lookMore">{{isMore ? '收起': '点击查看'}}</span>
      <ul :class="['hiddleUl',{haveHeight: isMore}]">
        <li>群组中&nbsp;1-3人说话=活跃1天</li>
        <li>群组中&nbsp;4-10人说话=活跃1.2天</li>
        <li>群组中&nbsp;11-40人说话=活跃1.3天</li>
        <li>群组中&nbsp;41-75以上人说话=活跃1.5天</li>
      </ul>
    </li>
    <li class="bigLi borderB">
      <p>群组会员等级对群成员上限特权的说明</p>
      <div class="socreState">
        <span class="state">会员等级</span>
        <ul class="smaillUl">
          <li>
            <span>VIP1</span>
            <span>150人会员群</span>
          </li>
          <li>
            <span>VIP2</span>
            <span>200人会员群</span>
          </li>
          <li>
            <span>VIP3</span>
            <span>300人会员群</span>
          </li>
          <li>
            <span class="special">SVIP1</span>
            <span class="limit">可增加5个群上限人数到500人</span>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  data () {
    return {
      isMore: false
    }
  },
  methods: {
    lookMore () {
      this.isMore = !this.isMore
    }
  }
}
</script>

<style lang="less" scoped>
    .socreExplain{
      width:100%;
      height:100%;
      font-size: 0;
      padding:0vw 4vw;
      box-sizing: border-box;
      .bigLi{
        width:100%;
        padding:4.4vw 0;
        box-sizing: border-box;
        p{
            font-size:4.07vw;
        }
        .smaillTitle{
            font-size:3.5vw;
            color:#969696;
        }
        .seeMore{
            font-size:3.7vw;
            color:rgb(100, 136, 253);
        }
        .isBtn{
            color:black;
        }
        .hiddleUl{
            width:70vw;
            height:0vw;
            transition:all 0.5s;
            padding:0vw 4vw;
            box-sizing: border-box;
            overflow: hidden;
            li{
                font-size: 3.5vw;
                color: #969696;
                margin-bottom:1vw;
            }
        }
        .haveHeight{
            height:30vw;
        }
        .socreState{
            display:flex;
            .state{
                font-size:4.07vw;
            }
            .smaillUl{
                margin-left:4vw;
                li{
                    margin-bottom:2vw;
                    span:nth-child(1) {
                        display:inline-block;
                        width:10vw;
                        height:6vw;
                        color:white;
                        line-height:6vw;
                        text-align: center;
                        font-size:3.5vw;
                        background:#ffd031;
                        border-radius: 1vw;
                    }
                    span:nth-child(2) {
                        width:8vw;
                        height:5vw;
                        color:#969696;
                        font-size:3.5vw;
                        margin-left:4vw;
                    }
                    .special{
                        background-color:#f8a55a !important;
                        width:11vw !important;
                    }
                    .limit{
                        margin-left:3vw !important;
                    }
                }
            }
        }
      }
    }
</style>