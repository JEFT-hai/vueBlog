<template>
  <div class='downApp' @click='goDown'>
    <!-- <div class="appImg">
      <img src='../assets/images/appIcon.png' />
    </div> -->
    <div class='middle'>
      <div class='appName'>多录</div>
      <!-- <div class="appName">世界很大 多录一下</div> -->
      <!-- <div class="starList">
        <span v-for="(item, index) in scoreArray" :key='index' class="iconWanwan iconWmn_xingxing_fill bgIcon">
          <i class="iconWanwan iconWmn_xingxing_fill redIcon" :style="{width: item * 100 + '%'}"></i>
        </span>
      </div> -->
    </div>
    <div class='downloadBtnWrap'>
      <div class="downloadBtn">下载 App</div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      score: 3.8
    }
  },
  computed: {
    scoreArray () {
      let i = 1;
      let arr = []
      for (i; i < this.score; i++) {
        arr.push(1)
      }
      arr.push(this.score - arr.length)
      for (let j = Math.ceil(this.score); j < 5; j++) {
        arr.push(0)
      }
      return arr
    }
  },
  methods: {
    goDown () {
      window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=io.dcloud.H50D8112A'
    }
  }
}
</script>
<style lang="less">
  .downApp{
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 12vw;
    line-height:12vw;
    display: flex;
    background: #fff;
    border-bottom: 1px solid #eee;
    // justify-content: center;
    align-items: center;
    z-index: 10001;
    .appImg{
      width: 9.5vw;
      height: 9.5vw;
      margin: 0 3.2vw 0 2vw;
      border-radius: 2vw;
      overflow: hidden;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .middle{
      flex: 1;
      color: #fff;
      .appName{
        font-size: 6vw;
        // padding-top: 2vw;
        height: 6vw;
        line-height: 6vw;
        box-sizing: border-box;
        // color: var(--lGray);
        color: var(--mRed);
        padding-left: 5vw;
        letter-spacing: 3px;
      }
      .starList{
        height: 6vw;
        line-height:6vw;
        .bgIcon{
          position: relative;
          display: inline-block;
          height: 6vw;
          line-height: 6vw;
          width: 3.2vw;
          margin-right: 2vw;
        }
        .iconWanwan{
          color: #999;
          font-size: 3.2vw;
        }
        .redIcon{
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          color: #ff2742;
          overflow: hidden;
        }
      }
    }
    .downloadBtnWrap{
      width: 18vw;
      text-align: center;
      margin-right: 4vw;
      box-sizing: border-box;
      .downloadBtn{
        // height: 6.8vw;
        // line-height: 6.8vw;
        // border-radius: 1vw;
        font-size: 4vw;
        width: 100%;
        color: #ff2742;
        // border:1px solid currentColor;
      }
    }
  }
</style>
