<template>
  <transition name="Fadeleft">
    <div class="treasureBoxWrap" v-show="show">
      <div class="navbarPage">
        <span @click="hidePage" class="navbarBack"
          ><i class="iconWfanhui iconWanwan activityNotice"></i
        ></span>
        <span class="title">
          <span class="titleInner">开宝箱，领积分</span></span
        >
      </div>
      <div class="rotateBg"></div>
      <transition>
        <div
          v-if="!state"
          class="treasureBox_close treasureBox"
          @click="openBox"
          key="close"
        ></div>
        <div v-else class="treasureBox_open treasureBox" key="open">
          <div class="treasureBox_content">
            <div class="codeLine">
              <span class="codeNum codeIcon iconWanwan iconWbonus-line"
                >&nbsp;</span
              ><span class="codeNum">+{{ code }}</span>
            </div>
          </div>
        </div>
      </transition>
      <div v-if="!state" class="tips">
        <i class="arrow"></i>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    code: {
      type: Number,
      default: 500
    }
  },
  data() {
    return {
      state: false,
      shake: false
    }
  },
  methods: {
    openBox() {
      this.state = true
    },
    hidePage() {
      this.$emit('hideBox', this.code)
    }
  }
}
</script>
<style lang="less" scoped>
@keyframes shake {
  0% {
    -webkit-transform: scale(1);
  }
  6% {
    -webkit-transform: scale(0.9) rotate(-8deg);
    -webkit-transform: scale3d(1, 1, 1) rotate(0, 0, 1, -8deg);
  }
  18%,
  30%,
  42% {
    -webkit-transform: scale(1.1) rotate(8deg);
    -webkit-transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 8deg);
  }
  12%,
  24%,
  36%,
  48% {
    -webkit-transform: scale(1.1) rotate(-8deg);
    -webkit-transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -8deg);
  }
  54% {
    -webkit-transform: scale(1);
    -webkit-transform: scale3d(1, 1, 1);
  }
  60% {
    -webkit-transform: scale(1);
    -webkit-transform: scale3d(1, 1, 1);
  }
  80% {
    -webkit-transform: scale(1) translate(0px, 150px);
    -webkit-transform: scale3d(1, 1, 1) translate3d(0px, 150px, 0);
  }
  90% {
    -webkit-transform: scale(1) translate(0px, 130px);
    -webkit-transform: scale3d(1, 1, 1) translate3d(0px, 130px, 0);
  }
  100% {
    -webkit-transform: scale(1) translate(0px, 150px);
    -webkit-transform: scale3d(1, 1, 1) translate3d(0px, 150px, 0);
  }
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  99% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes fade2 {
  0% {
    -webkit-transform: translate(0px, 30px);
    opacity: 0;
  }
  70% {
    -webkit-transform: translate(0px, -20px);
    opacity: 1;
  }

  100% {
    -webkit-transform: translate(0px, 0px);
    opacity: 1;
  }
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes move {
  0% {
    -webkit-transform: translate(0px, 0px);
  }
  100% {
    -webkit-transform: translate(0px, -5px);
  }
}
.treasureBoxWrap {
  &.Fadeleft-enter,
  &.Fadeleft-leave-active {
    left: 100vw;
  }
  &.Fadeleft-enter-active,
  &.Fadeleft-leave-active {
    transition: all 0.3s ease-in-out;
  }
  position: fixed;
  z-index: 100000;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  padding-top: 180px;
  background-color: #fff4d2;
  .rotateBg {
    position: absolute;
    z-index: 1;
    background: url(../../assets/images/light.png) 0 0 no-repeat;
    background-size: 452px auto;
    width: 452px;
    height: 510px;
    max-height: 100%;
    left: 50%;
    margin-left: -226px;
    top: -25px;
    animation: rotate 10s infinite linear;
  }
  .tips {
    position: relative;
    width: 166px;
    height: 60px;
    margin: 10px auto;
    transform: translateX(-15px);
    background: url(../../assets/images/txt-tips-open.png) 0px 0px no-repeat;
    background-size: 190px auto;
    -webkit-transition: all 0.5s;
    .arrow {
      width: 26px;
      height: 60px;
      background: url(../../assets/images/txt-tips-open.png) right 0px no-repeat;
      background-size: 190px auto;
      position: absolute;
      display: block;
      top: 0px;
      right: -32px;
      -webkit-animation: move 0.7s linear infinite alternate;
    }
  }
  .navbarPage {
    height: 13.34vw;
    width: 100%;
    color: #e59c00;
    position: fixed;
    z-index: 10000;
    top: 0;
    left: 0;
    background-color: transparent;
    .navbarBack {
      display: inline-block;
      width: 13.34vw;
      height: 13.34vw;
      line-height: 13.6vw;
      position: relative;
      left: 7.5vw;
      top: 0;
      z-index: 10001;
      .activityNotice {
        font-size: 4.5vw;
        font-weight: bold;
      }
    }
    .title {
      position: fixed;
      top: 0;
      z-index: 99;
      width: 100%;
      height: 13.34vw;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 4.63vw;
      .titleInner {
        display: inline-block;
        max-width: 66vw;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
  .treasureBox {
    width: 320px;
    height: 135px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }
  .treasureBox_close {
    background: url(../../assets/images/chest.png) no-repeat 0px 0px;
    background-size: 320px auto;
    &.v-leave-active,
    &.v-leave-to {
      animation: shake 1.2s linear;
      -webkit-animation-fill-mode: forwards;
      transition: all 1.2s;
    }
  }
  .treasureBox_open {
    position: relative;
    z-index: 1;
    height: 150px;
    background: url(../../assets/images/chest.png) no-repeat 0px -137px;
    background-size: 320px auto;
    -webkit-transform: scale(1) translate(0px, 150px);
    &.v-enter {
      opacity: 0;
    }
    &.v-enter,
    &.v-enter-active {
      animation: fadeIn 1.21s linear;
      -webkit-animation-fill-mode: forwards;
      transition: all 0;
    }
    &:after {
      width: 320px;
      height: 68px;
      background: url(../../assets/images/chest-open-blur.png) no-repeat 0px 0px;
      background-size: 320px auto;
      position: relative;
      z-index: 1;
      position: absolute;
      left: 0px;
      top: -5px;
      content: "";
      display: block;
    }
    .treasureBox_content {
      position: absolute;
      z-index: 9;
      bottom: -27px;
      left: 50%;
      width: 276px;
      margin: 27px 0 118px -138px;
      padding: 30px 0px 50px;
      text-align: center;
      background: url(../../assets/images/open-bg-top.png) center top no-repeat,
        url(../../assets/images/open-bg-bottom.png) center bottom no-repeat;
      background-size: 276px auto;
      animation: fade2 0.2s 0s linear forwards;
      &:before {
        width: 100%;
        position: absolute;
        top: 12px;
        bottom: 80px;
        left: 0px;
        content: "";
        background: #fff;
        border-left: #e59c00 1px solid;
        border-right: #e59c00 1px solid;
        box-sizing: border-box;
      }
      .codeLine {
        position: relative;
        z-index: 10;
        min-height: 100px;
        line-height: 100px;
        font-size: 0;

        .codeNum {
          color: #ff6000;
          font-size: 24px;
        }
      }
    }
  }
  .shake {
    animation: shake 1.2s linear;
    -webkit-animation-fill-mode: forwards;
  }
}
</style>
