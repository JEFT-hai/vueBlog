<template>
  <transition name="mySet">
    <div class="timePickerWrap">
      <div class="myMask"
           @click="hiddle"></div>
      <div class="mySelect">
        <div class="header borderB">
          <span @click="leftBtnClick"
                class="leftBtn">{{leftBtnName}}</span>
          <span class="title">{{title}}</span>
          <span @click="rightBtnClick"
                class="rightBtn">{{rightBtnName}}</span>
        </div>
        <transition name="bottomSet">
          <div class="content">
            <div class="select leftSelect">
              <p>开始时间</p>
              <VTimePicker :initH="bh"
                           :initM="bm"
                           @selectTime="beginTime"
                           class="timePicker"></VTimePicker>
            </div>
            <div class="select rightSelect">
              <p>结束时间</p>
              <VTimePicker :initH="eh"
                           :initM="em"
                           @selectTime="endTime"
                           class="timePicker"></VTimePicker>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </transition>

</template>

<script>
import VTimePicker from './VTimeScroll'
export default {
    name: 'timePicker',
    data() {
        return {
            begin: {
                hour: this.bh,
                minute: this.bm
            },
            end: {
                hour: this.eh,
                minute: this.em
            }
        }
    },
    props: {
        leftBtnName: {
            type: String,
            default: '取消'
        },
        rightBtnName: {
            type: String,
            default: '确定'
        },
        title: {
            type: String,
            default: '选择营业时间'
        },
        isShow: {
            type: Boolean,
            default: false
        },
        bh: {
            type: Number,
            default: 0
        },
        bm: {
            type: Number,
            default: 0
        },
        eh: {
            type: Number,
            default: 0
        },
        em: {
            type: Number,
            default: 0
        }
    },
    mounted () {
        console.log(this.bh)
    },
    methods: {
        beginTime(data) {
            this.begin.hour = data.hour
            this.begin.minute = data.minute
        },
        endTime(data) {
            this.end.hour = data.hour
            this.end.minute = data.minute
        },
        leftBtnClick() {
            this.$emit('selectDetailTime', false)
        },
        rightBtnClick() {
            if (this.checkRightTime(this.begin, this.end)) {
                this.$emit('rightBtn', {begin: this.begin, end: this.end})
            } else {
                return 
            }
            
        },
        checkRightTime(begin, end) {
            let bHour = parseInt(begin.hour)
            let bMinute =parseInt(begin.minute)
            let eHour = parseInt(end.hour)
            let eMinute = parseInt(end.minute)
            if (bHour > eHour || (eHour - bHour == 1 && bMinute < eMinute)) {
                this.$toast('结束时间应大于或等于开始时间', 1500)
                return false
            } else {
                return true
            }
        },
        /**
         * hiddle隐藏
         */
        hiddle () {
          this.$emit('selectDetailTime', false)
        }
    },
    components: {
        VTimePicker
    }
}
</script>

<style lang="less" scoped>
.mySet-enter-active,.mySet-leave-active{
    transition:all 0.5s;
}
.mySet-enter,.mySet-leave-to{
    opacity:0;
}
.timePickerWrap{
    width:100%;
    height:100%;
    position: fixed;
    top: 0;
    z-index: 1000;
    .myMask{
      width:100%;
      height:50%;
      background-color:rgba(0,0,0,.5);
    }
    .mySelect{
      width:100%;
      height:50%;
      background:white;
      position:relative;
      .header {
        display: flex;
        justify-content: space-around;
        width: 100%;
        height: 14vw;
        align-items: center;
        font-weight: 500;
        .rightBtn {
          color: var(--mRed);
        }
     }
    .content{
        display: flex;
        justify-content: space-around;
        position:position;
        bottom:0;
        left:0;
          &.bottomSet-enter-active,&.bottomSet-leave-active{
            transition:all 0.5s ease;
          }
          &.bottomSet-enter,&.bottomSet-leave-to{
            bottom:-100vw;
            opacity: 0.5;
          }
    //   &.bottomSet-enter, &.bottomSet-leave-to{
    //     transform: translate3d(0, 273px, 0);
    //   }
    //   &.bottomSet-enter-active, &.bottomSet-leave-active{
    //     transition: all .3s ease-in-out;
    //   }
        .select{
            height: 74vw;
            text-align: center;
            width: 100%;
            p{
                height: 8vw;
                line-height: 8vw;
            }
       }
      
     }
    }
}
    // .mask {
    //     width: 100%;
    //     height: 100vh;
    //     position: fixed;
    //     top: 0;
    //     background: rgba(0, 0, 0, .3);
    //     animation: mask 0.4s forwards;
    // }
    // .picker {
    //     width: 100%;
    //     height: 50vh;
    //     position: fixed;
    //     background: white;
    //     animation: pickerUp .4s forwards;
    // }
    // .header {
    //     display: flex;
    //     justify-content: space-around;
    //     width: 100%;
    //     height: 14vw;
    //     align-items: center;
    //     font-weight: 500;
    // }
    // .rightBtn {
    //     color: var(--mRed);
    // }
    // .picker .content{
    //     display: flex;
    //     justify-content: space-around;
    //     z-index: 9999;
    // }
    // .picker .content .select{
    //     height: 42vh;
    //     text-align: center;
    //     width: 100%;
    // }
    // .picker .content p{
    //     height: 5vh;
    //     line-height: 6vh;
    // }
    // .timePicker {
    //     height: 35vh;
    // }
    // .pickerDown {
    //     width: 100%;
    //     height: 50vh;
    //     position: fixed;
    //     background: white;
    //     animation: pickerDown 0.4s forwards;
    // }
    // .fade {
    //     width: 100%;
    //     height: 100vh;
    //     position: fixed;
    //     top: 0;
    //     background: rgba(0, 0, 0, .3);
    //     animation: fade .4s forwards;
    // }
    // @keyframes mask {
    //     from {
    //         background: rgba(0, 0, 0, 0);
    //     }
    //     to {
    //         background: rgba(0, 0, 0, .3);
    //         z-index: 9998;
    //     }
    // }
    // @keyframes fade {
    //     from {
    //         background: rgba(0, 0, 0, .3);
    //     }
    //     to {
    //         background: rgba(0, 0, 0, 0);
    //         z-index: -99999;
    //     }
    // }
    // @keyframes pickerDown {
    //     from {
    //         bottom: 0;
    //     }
    //     to {
    //         bottom: -50vh;
    //     }
    // }
    // @keyframes pickerUp {
    //     from {
    //         bottom: -50vh;
    //     }
    //     to {
    //         bottom: 0;
    //     }
    // }
</style>
