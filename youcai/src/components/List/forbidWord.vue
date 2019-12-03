<template>
<!-- <transition name="sharePlay"> -->
  <div class="forbidWordWrapBig">
    <div class="maskForbid" @click.stop="hiddleForbid(false)"></div>
    <div class="content">
        <p>选择禁言时长</p>
        <ul>
          <li class="borderB" @click.stop="selectIndex(1,false)">
            <span>2小时</span>
            <span v-show="index === 1"><i class="iconWanwan iconWgou activityNotice"></i></span>
          </li>
          <li class="borderB" @click.stop="selectIndex(2,false)">
            <span>1天</span>
            <span v-show="index === 2"><i class="iconWanwan iconWgou activityNotice"></i></span>
          </li>
          <li class="borderB" @click.stop="selectIndex(3,false)">
            <span>1个月</span>
            <span v-show="index === 3"><i class="iconWanwan iconWgou activityNotice"></i></span>
          </li>
        </ul>
    </div>
  </div> 
<!-- </transition> -->
 
</template>

<script>
export default {
  data () {
    return {
      index: 1,
      selectTime: ''
    }
  },
  methods: {
    selectIndex (myIndex,data) {
      this.index = myIndex
      let time = ''
      if (this.index === 1) {
        time = 2 * 60
      } else if (this.index === 2) {
        time = 24 * 60
      } else if (this.index === 3) {
        time = 24 * 30 * 60
      }
      this.selectTime = time
      this.$emit('handleForbidWord',data,this.selectTime)
    },
    hiddleForbid (data) {
      this.$emit('handleForbidWord',data)
    }
  }
}
</script>

<style lang="less" scoped>
.sharePlay-enter-active,.sharePlay-leave-active{
    transition: all 1s;
}
.sharePlay-enter,.sharePlay-leave-to{
  opacity: 0;
}
  .forbidWordWrapBig{
    width:100%;
    height:100vh;
    position:fixed;
    top:0;
    left:0;
    z-index:10000;
    .maskForbid{
      width:100%;
      height:40vh;
      background:rgba(0,0,0,.7);
    }
    .content{
      width:100%;
      height:60vh;
      background:white;
      padding-top:5vw;
      box-sizing: border-box;
      p{
        width:100%;
        text-align: center;
      }
      ul{
        margin-top:20vw;
        li{
          height:13vw;
          padding:0 8vw;
          box-sizing: border-box;
          display:flex;
          align-items: center;
          justify-content: space-between;
        }
      }
    }
  }
</style>