<template>
  <div class="treasureBoxWrap" v-show="show">
    <div class="rotateBg"></div>
    <transition
      v-on:before-enter="beforeEnter"
      v-on:enter="enter"
      v-on:after-enter="afterEnter"
      v-on:enter-cancelled="enterCancelled"
      v-on:before-leave="beforeLeave"
      v-on:leave="leave"
      v-on:after-leave="afterLeave"
      v-on:leave-cancelled="leaveCancelled"
    >
      <div
        v-if="!state"
        class="treasureBox_close treasureBox"
        key="close"
      ></div>
      <div v-else class="treasureBox_open treasureBox" key="open">
        <div class="treasureBox_content">
          <div class="codeLine">
            <span class="codeNum codeIcon iconWanwan iconWbonus-line"
              >&nbsp;</span
            ><span class="codeNum">x{{ code }}</span>
          </div>
        </div>
        <div class="bulingbuling">
          <span
            v-for="item in 40"
            :key="item"
            :class="['bulingItem', 'bulingItem' + item]"
          ></span>
        </div>
        <i class="closeBtn iconWclose iconWanwan" @click="hideBox"></i>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  data() {
    return {
      promiseStatus: null,
      show: false,
      code: 0,
      state: false,
      e: null
    }
  },
  methods: {
    confirm() {
      let _this = this
      return new Promise((resolve, reject) => {
        _this.promiseStatus = { resolve, reject }
      })
    },
    hideBox() {
      this.show = false
      this.state = false
      return this.promiseStatus && this.promiseStatus.resolve(this.code)
    },
    showBox(opts) {
      this.show = true
      this.state = true
      this.code = opts.code
      this.e = opts.e
    },
    getR(arr) {
      return arr[Math.floor(Math.random() * arr.length)]
    },
    rand(num1, num2) {
      return num1 + Math.random() * (num2 - num1)
    },
    // --------
    // 进入中
    // --------

    beforeEnter: function(el) {
      // ...
      if (el.className.indexOf('treasureBox_open') != -1) {
        // 打开箱子
        let bulings = el.getElementsByClassName('bulingItem')
        let topArr = [68, 75, 78, 80, 82, 84, 85]
        let bgArr = [
          require('@/assets/images/jb1.png'),
          require('@/assets/images/jb2.png'),
          require('@/assets/images/jb3.png'),
          require('@/assets/images/jb4.png'),
          require('@/assets/images/jb5.png')
        ]
        let leftArr = [55, 70, 85, 100, 115]
        if (bulings.length) {
          for (let i = 0; i < bulings.length; i++) {
            bulings[i].style.top = this.getR(topArr) + 'px';
            bulings[i].style.left = this.getR(leftArr) + 'px';
            bulings[i].style.backgroundImage = `url(${this.getR(bgArr)})`
            bulings[i].style.backgroundSize = '100%';
          }
        }
      }
    },
    // 当与 CSS 结合使用时
    // 回调函数 done 是可选的
    enter: function(el, done) {
      // ...
      if (el.className.indexOf('treasureBox_close') != -1) {
        window.Velocity(el, { opacity: 0 }, { duration: 10, complete: done })
        return;
      }
      window.Velocity(el, { opacity: 0 }, { duration: 1300 })
      window.Velocity(el, { opacity: 1 }, { duration: 50 })
      let bulings = el.getElementsByClassName('bulingItem')
      let topArr = [68, 75, 78, 80, 82, 84, 85]
      let dir = [-1, 1, 0, 1, -1]
      let scale = [0.9, 1.1]
      let deg = ['-30deg', '-20deg', '-10deg', '0', '10deg', '20deg', '30deg']

      if (bulings.length) {
        for (let i = 0; i < bulings.length; i++) {
          let d = this.getR(dir)
          let v = this.rand(60, 100)
          let g = -9.8
          let theta = (this.rand(80, 89) * Math.PI) / 180
          let scaleN = this.rand(scale)
          let deg2 = this.getR(deg)
          let td = this.getR(topArr)
          window.Velocity(bulings[i], { opacity: 0 }, { duration: 1300 })
          window.Velocity(bulings[i], { opacity: 1 }, { duration: 50 })
          let t = 0
          while (t < 1000) {
            let sT = t / 100
            let ux = Math.cos(theta) * v * d
            let uy = Math.sin(theta) * v - -g * sT
            let ny = -(uy * sT + 0.25 * g * Math.pow(sT, 2))
            let nx = 105 + ux * sT
            if (ny >= 65) {
              ny = td
            }
            if (nx < 10) {
              nx = this.getR([0, 5, 10])
            }
            if (nx > 190) {
              nx = 190
            }
            let nObj = {
              top: ny + 'px',
              left: nx + 'px',
              scale: scaleN,
              rotateZ: deg2
            }
            window.Velocity(bulings[i], nObj, {
              duration: 50,
              complete: (t += 50)
            })
          }
        }
      }
    },
    afterEnter: function() {
      // ...
    },
    enterCancelled: function() {
      // ...
    },

    // --------
    // 离开时
    // --------

    beforeLeave: function(el) {
      if (el.className.indexOf('treasureBox_open') != -1) {
        return
      }
      let e = this.e

      el.style.position = 'fixed';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.top = e.pageY + 'px';
      el.style.left = e.pageX + 'px';
      el.style.marginLeft = '-15px';
      el.style.opacity = 1
      if (e.pageY < 120) {
        el.style.transition = 'all 0.5s ease-out-cric';
      } else {
        el.style.transition = 'all 0.5s ease-in-quint';
      }
      // ...
    },
    // 当与 CSS 结合使用时
    // 回调函数 done 是可选的
    leave: function(el, done) {
      if (el.className.indexOf('treasureBox_open') != -1) {
        done()
        return;
      }
      let dW = document.body.offsetWidth
      window.isInAndroid && window.WanAndroid.startTreasureSound()
      window.Velocity(
        el,
        { top: '120px', left: dW / 2 + 'px' },
        { duration: 300 }
      )
      window.Velocity(el, { scale: 1.5, rotateZ: '-8deg' }, { duration: 50 }) // 6
      window.Velocity(el, { scale: 2, rotateZ: '-8deg' }, { duration: 50 }) // 12
      window.Velocity(el, { scale: 2.5, rotateZ: '8deg' }, { duration: 50 }) // 18
      window.Velocity(el, { scale: 3, rotateZ: '-8deg' }, { duration: 50 }) // 24
      window.Velocity(el, { scale: 3.5, rotateZ: '8deg' }, { duration: 50 }) // 30
      window.Velocity(el, { scale: 4, rotateZ: '-8deg' }, { duration: 50 }) // 36
      window.Velocity(el, { scale: 4.5, rotateZ: '8deg' }, { duration: 50 }) // 42
      window.Velocity(el, { scale: 5, rotateZ: '-8deg' }, { duration: 50 }) // 48
      window.Velocity(el, { scale: 6.5, rotateZ: '0' }, { duration: 50 }) // 54
      window.Velocity(el, { scale: 7 }, { duration: 50 }) // 60
      window.Velocity(el, { scale: 7, top: '410px' }, { duration: 200 }) // 80
      window.Velocity(el, { scale: 7, top: '380px' }, { duration: 100 }) // 90
      window.Velocity(
        el,
        { scale: 7, top: '410px' },
        { duration: 100, complete: done }
      ) // 100 共 1000ms
      // ...
      // done()
    },
    afterLeave: function() {
      // ...
    },
    // leaveCancelled 只用于 v-show 中
    leaveCancelled: function() {
      // ...
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
    margin-top: 57px;
    opacity: 0;
  }
  70% {
    margin-top: 7px;
    opacity: 1;
  }

  100% {
    margin-top: 27px;
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
@keyframes bulingbuling {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
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
  // background-color: #FFF4D2;
  background-color: rgba(0, 0, 0, 0.5);
  .rotateBg {
    position: absolute;
    z-index: 1;
    background: url(../../assets/images/light.png) 0 0 no-repeat;
    background-size: 482px auto;
    width: 482px;
    height: 510px;
    max-height: 100%;
    left: 50%;
    margin-left: -226px;
    top: -25px;
    animation: rotate 10s infinite linear;
  }
  .treasureBox {
    width: 320px;
    height: 135px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }
  .treasureBox_close {
    background: url(../../assets/images/chestS.png) no-repeat 0px center;
    background-size: 100% auto;
    transform: translate3d(-50%, -50%, 0);
    // &.v-leave-active,&.v-leave-to{
    //   transition: all 0.5s cubic-bezier(1,.2,0,.88);
    // animation:shake 1.2s linear;-webkit-animation-fill-mode:forwards;
    // transition: all 1.2s;
    // }
  }
  .treasureBox_open {
    position: fixed;
    width: 210px;
    height: 210px;
    top: 280px;
    left: 187.5px;
    margin-left: -105px;
    // transform: scale(6);
    z-index: 1;
    opacity: 0;
    background: url(../../assets/images/chestO.png) no-repeat 0px center;
    background-size: 100% auto;
    // -webkit-transform: scale(1) translate(0px,150px);
    // &.v-enter{
    //     opacity: 0;
    // }
    // &.v-enter,&.v-enter-active{
    //     animation:fadeIn 1.21s linear;-webkit-animation-fill-mode:forwards;
    //     transition: all 0;
    // }
    &:after {
      width: 100%;
      height: 100%;
      background: url(../../assets/images/chestOB.png) no-repeat 0px center;
      background-size: 100% auto;
      z-index: 1;
      position: absolute;
      left: 0px;
      top: 0;
      content: "";
      display: block;
    }
    .treasureBox_content {
      position: fixed;
      z-index: 9;
      top: 344px;
      left: 50%;
      width: 276px;
      margin: 27px 0 118px -138px;
      padding: 30px 0px 50px;
      text-align: center;
      transform: translate3d(0, -100%, 0);
      background: url(../../assets/images/open-bg-top.png) center top no-repeat,
        url(../../assets/images/open-bg-bottom.png) center bottom no-repeat;
      background-size: 276px auto;
      animation: fade2 0.2s 0s linear forwards;
      // background-color: #ff6000;
      &:before {
        width: 100%;
        position: absolute;
        top: 10px;
        bottom: 79px;
        left: 0px;
        content: "";
        background: #fff;
        border-left: #e59c00 1px solid;
        border-right: #e59c00 1px solid;
        border-top: none;
        border-bottom: none;
        box-sizing: border-box;
        // background-color: #ff6000;
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
    .bulingbuling {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 56%;
      z-index: 200;
      .bulingItem {
        position: absolute;
        display: inline-block;
        width: 30px;
        height: 30px;
        background-repeat: no-repeat;
        // transition: all 1s cubic-bezier(.59, .02,.6,.02) 1.3s;
      }
      .bulingItem1 {
        background-image: url(../../assets/images/jb1.png);
        background-size: 100%;
      }
      .bulingItem2 {
        background-image: url(../../assets/images/jb2.png);
        background-size: 100%;
      }
      .bulingItem3 {
        background-image: url(../../assets/images/jb3.png);
        background-size: 100%;
      }
      .bulingItem4 {
        background-image: url(../../assets/images/jb4.png);
        background-size: 100%;
      }
      .bulingItem5 {
        background-image: url(../../assets/images/jb5.png);
        background-size: 100%;
      }
      // animation: bulingbuling 0.35s once;
      // animation-iteration-count:3;
    }
    .closeBtn {
      position: absolute;
      top: 230px;
      left: 50%;
      height: 12vw;
      width: 12vw;
      line-height: 12vw;
      text-align: center;
      transform: translate3d(-50%, 0, 0);
      font-size: 10vw;
      color: #fff;
      padding: 3vw;
    }
  }
  .shake {
    animation: shake 1.2s linear;
    -webkit-animation-fill-mode: forwards;
  }
}
</style>
