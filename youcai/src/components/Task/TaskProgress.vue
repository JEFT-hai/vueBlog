<template>
  <div class="taskProgressListWrap">
    <div :class="['taskProgressList', { short: short }]" ref="taskProgressList">
      <div
        :class="[itm.num ? 'taskProgressItem' : 'taskProgressItem0']"
        v-for="(itm, index) in foldArr"
        :key="index"
      >
        <div :class="['infoItem', {'curItem': curTime === itm.num}]">
          <div class="circle" :style="getStyle(itm.num)">
            <span v-show="itm.num >= curTime">
              <span>+</span>
              <span class="num">{{ getCode(itm.code) }}</span>
            </span>
            <i v-show="itm.num < curTime" class="iconWanwan iconWzhengquecopy isSignIcon"></i>
            <span :class="['vipTip', getTipClass(itm.num)]" v-show='(curTime === itm.num)'>{{tipMsg}}</span>
          </div>
          <div class="progressBar"></div>
        </div>
        <div class="timeNum">{{ itm.num }}{{ item.unit }}</div>
      </div>
      <div class="taskProgressItem">
        <div class="infoItem" @click="openTreasure">
          <div
            :class="['treasureBox', {'openBox': item.isGetBox}]"
            ref="treasureBox"
            :style="getStyle(flexArr.length + 1)"
          ></div>
          <div :class="getClass()"></div>
        </div>
        <div class="timeNum">{{ flexArr.length + 1 }}{{ item.unit }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    item: {
      type: Object,
      default: function() {
        return {}
      }
    },
    short: {
      type: Boolean,
      default: false
    },
    fold: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      treasureShow: false
    }
  },
  computed: {
    ...mapState(['user']),
    tipMsg () {
      let point = this.foldArr.filter((item) => {
        return item.num == this.curTime
      })[0]
      console.log(point)
      return this.user.vipLevel ? `+${point.code}积分, VIP+${point.code}积分!` : 'VIP可领双倍积分哦!'
    },
    curTime() {
      return this.item.isGetBox
        ? this.flexArr.length + 1
        : Math.min(
            Math.max(1, this.item.countOperate + 1),
            this.flexArr.length + 1
          )
    },
    pW() {
      return this.short ? 78 : 90.8
    },
    isFold() {
      return this.fold < this.item.progressArr.length
    },
    flexArr() {
      if (this.item.progressArr && this.item.progressArr.length) {
        return this.item.progressArr.slice(0, this.item.progressArr.length - 1)
      } else {
        let arr = []
        let arrLength = this.item.countTask
        for (let i = 0; i < arrLength; i++) {
          let obj = {
            num: i + 1,
            code: this.item.singleNum
          }
          arr.push(obj)
        }
        return arr.slice(0, arrLength - 1)
      }
    },
    foldArr() {
      if (this.flexArr.length < 9) {
        return this.flexArr
      } else {
        return this.getFold()
      }
    },
    realArr() {
      return this.foldArr.filter(item => {
        return item.num !== 0
      })
    },
    normalC() {
      return (this.pW / this.realArr.length) * 0.53
    },
    circleW() {
      return this.normalC > 7.9 ? 7.9 : this.normalC
    },
    bigCircleW() {
      return this.circleW * 1.76
    }
  },
  methods: {
    getCode (code) {
      let num = this.user.vipLevel ? 2 : 1
      return code * num
    },
    getFold() {
      // 获取折叠/剪切之后的数组 num:0 代表 三个点
      let prveArr = this.flexArr.slice(0, this.curTime)
      let nextArr = this.flexArr.slice(this.curTime, this.flexArr.length)
      let halfNum = parseInt(this.fold / 2)
      if (prveArr.length <= halfNum) {
        // 前面短
        nextArr = nextArr.slice(0, this.fold - prveArr.length)
        nextArr.push({
          code: 0,
          num: 0
        })
      } else if (nextArr.length <= halfNum) {
        // 后面短
        prveArr = prveArr.slice(
          prveArr.length - (this.fold - nextArr.length) + 1,
          prveArr.length
        )
        prveArr.unshift({
          code: 0,
          num: 0
        })
        prveArr.unshift(this.flexArr[0])
      } else {
        prveArr = prveArr.slice(prveArr.length - halfNum, prveArr.length)
        prveArr.unshift({
          code: 0,
          num: 0
        })
        prveArr.unshift(this.flexArr[0])
        nextArr = nextArr.slice(0, halfNum)
        nextArr.push({
          code: 0,
          num: 0
        })
      }
      return prveArr.concat(nextArr)
    },
    getStyle(index) {
      if (index == this.curTime) {
        return {
          width: this.bigCircleW + 'vw',
          height: this.bigCircleW + 'vw',
          backgroundImage: 'linear-gradient(to right, #ed736e, #f89775)',
          fontSize: this.bigCircleW * 0.45 + 'vw'
        }
      } else if (index < this.curTime) {
        return {
          width: this.circleW + 'vw',
          height: this.circleW + 'vw',
          background: 'linear-gradient(45deg, #f77050, #f05667)',
          fontSize: this.circleW * 0.45 + 'vw'
        }
      } else {
        return {
          width: this.circleW + 'vw',
          height: this.circleW + 'vw',
          backgroundColor:
            index > this.flexArr.length ? 'transparent' : '#f9aca1',
          fontSize: this.circleW * 0.45 + 'vw'
        }
      }
    },
    getTipClass (index) {
      let className = ''
      switch (index) {
        case 4:
          // style.transform = 'translate3d(-50%, -100%, 0)'
          // style.left = '50%'
          className = 'middleTip'
          break
        case 5:
        case 6:
        case 7:
          // style.transform = 'translate3d(-100%, -100%, 0)'
          // style.left = '100%'
          className = 'rightTip'
          break
        default:
          className = 'leftTip'
          break
      }
      return className
    },
    getClass() {
      let lastNum =
        this.foldArr[this.foldArr.length - 1] &&
        this.foldArr[this.foldArr.length - 1].num
      if (this.flexArr.length - lastNum > 1) {
        return 'progressBar noProgressBg'
      } else {
        return 'progressBar'
      }
    },
    async openTreasure(e) {
      let me = this
      this.$emit('clickTreasuer')
      if (!e) {
        e = {}
        let box = me.$refs.treasureBox
        e.pageX = box.getBoundingClientRect().left + box.offsetWidth / 2
        e.pageY = box.getBoundingClientRect().top + box.offsetHeight / 2
      }
      if (
        this.curTime < (this.item.countTask || this.flexArr.length + 1) ||
        this.item.isGetBox
      ) {
        console.log('被拦截')
        // 拦截一下
        return
      } else {
        let code = await this.openBox()
        if (code) {
          this.$treasureBox({
            e: e,
            code: code
          }).then(() => {
            me.$emit('addCode', code)
          })
        }
      }
    },
    openBox() {
      let me = this
      return new Promise(resolve => {
        me.api.put({
          url: 'Task',
          data: {
            type: me.item.pointType
          },
          success: function(res) {
            resolve(res)
          },
          error: function(err) {
            me.$alert(err)
            resolve(0)
          }
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.taskProgressList {
  height: 28.9vw;
  width: 90.8vw;
  margin: 0 auto;
  padding: 0.37vw 2vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &.short {
    width: 79vw;
  }
  .taskProgressItem:first-child {
    color: #000;
  }
  .taskProgressItem0 {
    position: relative;
    z-index: 100;
    left: -3.3vw;
    width: 0;
    // padding: 0 5px;
    display: flex;
    flex-direction: column;
    text-align: center;
    box-sizing: content-box;
    .infoItem {
      visibility: visible;
      width: 6.6vw;
      height: 14.8vw;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      color: #fff;
      background-color: #fff;
      .circle {
        visibility: hidden;
      }
      .progressBar {
        position: absolute;
        width: 1.6vw;
        height: 1.6vw;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -1vw, 0);
        background-color: #e89c89;
        border-radius: 50%;
        visibility: visible;
        &::before {
          position: absolute;
          content: "";
          top: 0;
          left: -2.2vw;
          width: 100%;
          height: 100%;
          background-color: #e89c89;
          border-radius: 50%;
        }
        &::after {
          position: absolute;
          content: "";
          top: 0;
          left: 2.2vw;
          width: 100%;
          height: 100%;
          background-color: #e89c89;
          border-radius: 50%;
        }
      }
    }
    .timeNum {
      visibility: hidden;
      height: 7vw;
      line-height: 7vw;
      font-size: 4vw;
      color: #8e8e8e;
    }
  }
  .taskProgressItem {
    flex: 1;
    flex-direction: column;
    text-align: center;
    &:first-child {
      .infoItem {
        .progressBar {
          position: absolute;
          width: 51%;
          height: 2vw;
          top: 50%;
          left: 50%;
          transform: translate3d(0, -1vw, 0);
          background-color: #e89c89;
        }
      }
    }
    &:last-child {
      .infoItem {
        .progressBar {
          position: absolute;
          width: 51%;
          height: 2vw;
          top: 50%;
          right: 50%;
          transform: translate3d(0, -1vw, 0);
          background-color: #e89c89;
          &.noProgressBg {
            visibility: hidden !important;
          }
        }
      }
    }
    .infoItem {
      height: 14.8vw;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      .progressBar {
        position: absolute;
        width: 102%;
        height: 2vw;
        top: 50%;
        left: 0;
        transform: translate3d(0, -1vw, 0);
        background-color: #e89c89;
      }
      .circle,
      .treasureBox {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
      }
      .treasureBox {
        position: relative;
        z-index: 10;
        background-image: url(../../assets/images/chestS.png) !important;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 100%;
        &.openBox{
          background-image: url(../../assets/images/chestO.png) !important;
          background-repeat: no-repeat;
          background-position: center center;
          background-size: 100%;
        }
      }
      .circle {
        position: relative;
        border-radius: 50%;
        z-index: 10;
        .vipTip{
          position: absolute;
          height: 6.3vw;
          line-height: 6.3vw;
          width: 40vw;
          top: -1.5vw;
          font-size: 3.5vw;
          text-align: center;
          border-radius: 3.2vw;
          background-color: #b82020;
          &::after{
            position: absolute;
            content: '';
            top: 100%;
            width: 0;
            height: 0;
            border-width: 4vw;
            border-color: transparent;
            box-sizing: content-box;
            border-style: solid;
            z-index: -1;
          }
          &.leftTip{
            left: 1vw;
            transform: translate3d(0, -100%, 0);
            &::after{
              left: 2vw;
              border-left-color: #b82020;
              border-radius: 2px;
              transform: translate3d(0, -80%, 0);
            }
          }
          &.middleTip{
            left: 50%;
            transform: translate3d(-50%, -100%, 0);
            &::after{
              border-width: 2vw;
              left: 50%;
              border-top-color: #b82020;
              border-radius: 2px;
              transform: translate3d(-50%, -3px, 0);
            }
          }
          &.rightTip{
            left: 100%;
            transform: translate3d(-100%, -100%, 0);
            &::after{
              left: 100%;
              border-right-color: #b82020;
              border-radius: 2px;
              transform: translate3d(-125%, -80%, 0);
            }
          }
        }
        // &::after{
        //     content: '';
        //     position: absolute;
        //     width: 130%;
        //     height: 2vw;
        //     background-color: #fae8df;
        //     top: 50%;
        //     right: -130%;
        //     margin-top: -1vw;
        //     z-index: 1;
        // }
      }
    }
    .timeNum {
      height: 7vw;
      line-height: 7vw;
      font-size: 4vw;
      color: #8e8e8e;
    }
  }
}
</style>
