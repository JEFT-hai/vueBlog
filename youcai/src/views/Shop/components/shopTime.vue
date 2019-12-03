<template>
  <transition name="set">
    <div class="shopTimeWrap">
      <TimePicker :isShow="isShowDetailTime"
                  v-if="isShowDetailTime"
                  @selectDetailTime="selectDetailTime"
                  :bh="bh"
                  :bm="bm"
                  :eh="eh"
                  :em="em"
                  @rightBtn="rightBtn"></TimePicker>
      <div class="timeHead">
        <span @click="back"><i class="iconWfanhui iconWanwan activityNotice"></i></span>
        <span>营业时间</span>
      </div>
      <div class="selectTime">
        <p>营业日</p>
        <div class="timeWrap">
          <div class="timeOne timeEach"
               @click="handleIndex(1, '周一至周五')">
            <span class="timeTitle">周一至周五</span>
            <div class="selectLabel">
              <span class="noRight"
                    v-show="selectIndex !== 1">
                <i></i>
              </span>
              <span class="right"
                    v-show="selectIndex === 1">
                <i class="iconWanwan iconWzhengquecopy activityNotice"></i>
              </span>
            </div>
          </div>
          <div class="timeTwo timeEach"
               @click="handleIndex(2, '周一至周日')">
            <span class="timeTitle">周一至周日</span>
            <div class="selectLabel">
              <span class="noRight"
                    v-show="selectIndex !== 2">
                <i></i>
              </span>
              <span class="right"
                    v-show="selectIndex === 2">
                <i class="iconWanwan iconWzhengquecopy activityNotice"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="shopDuration">
        <p>营业时段</p>
        <div class="selectDuration borderB"
             @click="selectDetailTime(true)">
          <span class="goSelect"
                v-if="!calculateTime">请选择营业时段</span>
          <span class="confirmTime"
                v-else>{{calculateTime}}</span>
          <i class="iconWxiayibu iconWanwan textR"></i>
        </div>
        <div class="totalDay"
             @click="handleTwentyFour('24小时')">
          <div class="selectLabel">
            <span class="noRight"
                  v-show="selectDuration !== '24小时'">
              <i></i>
            </span>
            <span class="right"
                  v-show="selectDuration === '24小时'">
              <i class="iconWanwan iconWzhengquecopy activityNotice"></i>
            </span>
          </div>
          <span class="timeTitle">24小时营业</span>
        </div>
      </div>
      <div class="confirm"
           @click="confirmTime">
        确定
      </div>
    </div>
  </transition>
</template>

<script>
import TimePicker from './TimePicker'
export default {
  data () {
    return {
      isShowDetailTime: false, // 是否显示详细时间
      selectIndex: 1,
      selectWeek: '周一至周五',
      selectDuration: '', // 营业时段
      selectedTime: '', //选择的营业时间
      bh: 10,
      bm: 0,
      eh: 21,
      em: 0,
      userSelectBH: '', // 用户选择的开始时间小时
      userSelectBM: '', // 用户选择的开始时间分
      userSelectEH: '', // 用户选择的结束时间小时
      userSelectEM: '', // 用户选择的结束时间分
      calculateTime: '',
    }
  },
  components: {
    TimePicker
  },
  methods: {
    /**
     * back返回键
     */
    back () {
      this.$emit('setTimeMask', false)
    },
    handleIndex (data, week) {
      this.selectIndex = data
      this.selectWeek = week
      // this.$emit('selectWeek', this.selectWeek)
    },
    /**
     * 处理24小时
     */
    handleTwentyFour (data) {
      if (this.selectDuration === '24小时') {
        this.selectedTime = ''
        this.selectDuration = ''
        this.bh = 10
        this.eh = 21
      } else {
       this.selectedTime = data
       this.selectDuration = data
       this.calculateTime = data
       // 更改选择的时间段
        this.bh = 10
        this.eh = 10
      }
    },
    /**
     * 选择详细的时间
     */
    selectDetailTime (data) {
      this.isShowDetailTime = data
    },
    rightBtn (data) {
      if (data.begin.hour === data.end.hour && data.begin.minute === data.end.minute) {
        this.calculateTime = '24小时'
        console.log('24小时')
        this.selectDuration = '24小时'
      } else {
        console.log('不是24')
        this.bh = data.begin.hour
        this.bm = data.begin.minute
        this.eh = data.end.hour
        this.em = data.end.minute
        this.selectDuration = ''
        this.calculateTime = this.formatTime(this.bh) + ':' + this.formatTime(this.bm) + '-' + this.formatTime(this.eh) + ':' + this.formatTime(this.em)
      }
      this.isShowDetailTime = false
    },
    formatTime(timeNum) {
       return timeNum < 10 ? '0' + timeNum : timeNum + ''
    },
    /**
     * 确定营业时间 confirmTime
     */
    confirmTime () {
      if (!this.selectWeek) {
        this.$toast('请选择营业日', 1500)
        return
      }
      if (!this.calculateTime) {
        this.$toast('请选择营业时段', 1500)
        return
      }
      let startTime = ''
      let endTime = ''
      if (this.calculateTime === '24小时') {
        startTime = '00:00'
        endTime = '00:00'
      } else {
        startTime = this.calculateTime.substring(0,5)
        endTime = this.calculateTime.substring(6)
      }
      let objTime = {
        selectWeek: this.selectWeek, // 营业周期
        startTime , // 营业开始时间
        endTime
      }
      console.log('打印zhege objTime',objTime)
      this.$emit('eachTime', false,objTime)
    }
  }
}
</script>

<style lang="less" scoped>
.shopTimeWrap{
  width:100%;
  height:100%;
  position:fixed;
  top:0;
  left:0;
  z-index: 1000;
  background-color:white;
  &.set-enter-active,&.set-leave-active{
    transition:all 0.5s;
  }
  &.set-enter,&.set-leave-to{
    left:100vw;
    opacity: 5.2;
  }
  .timeHead{
    width:100%;
    height:12vw;
    position:relative;
    span:nth-child(1) {
      display:inline-block;
      height:12vw;
      line-height:12vw;
      margin-left:4vw;
    }
    span:nth-child(2) {
        width:20vw;
        height:12vw;
        text-align: center;
        line-height:12vw;
        position:absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
        margin:auto;
        font-size: 4.16vw;
        color:#666;
    }
  }
  .selectTime{
    width:100%;
    padding:4vw 4vw 0 4vw;
    box-sizing: border-box;
    p{
      font-size:4.44vw;
      font-weight: bold;
    }
    .timeWrap{
      display:flex;
      justify-content: space-between;
      .timeEach{
        width:40vw;
        height:10vw;
        display:flex;
        align-items: center;
        justify-content: space-between;
        .selectLabel{
          height:100%;
          line-height:11.5vw;
          margin-right:6vw;
                 span{
                     width:5vw;
                     height:5vw;
                     border-radius: 50%;
                     display:inline-block;
                 } 
                 .noRight {
                   border:1px solid rgb(227,227,227);
                 }
                .right{
                     background-color:rgb(254, 41, 66);
                     border:1px solid rgb(254, 41, 66);
                     position:relative;
                     .activityNotice{
                         display:inline-block;
                         color:white;
                         font-size:3vw;
                         border-radius: 50%;
                         width:100%;
                         height:100%;
                         position:absolute;
                         top:0;
                         left:0;
                         right:0;
                         bottom:0;
                         margin:auto;
                         line-height:6vw;
                         text-align: center;
                     }
                 }
       }
      }
    }
  }
  .shopDuration{
    width:100%;
    padding:4vw 4vw 0 4vw;
    box-sizing: border-box;
    margin-bottom:20vw;
    p{
      font-size:4.44vw;
      font-weight: bold;
    }
    .selectDuration{
      height:12vw;
      display:flex;
      align-items: center;
      justify-content: space-between;
      .goSelect {
            font-size: var(--nText);
            color: var(--lGray);
      }
      .confirmTime{

      }
      i{
        color: var(--lGray);
        text-align: right;
      }
    }
    .totalDay{
      display: flex;
      height:15vw;
      align-items: center;
      width:35vw;
       .selectLabel{
          height:100%;
          line-height:17vw;
          margin-right:3vw;
                 span{
                     width:5vw;
                     height:5vw;
                     border-radius: 50%;
                     display:inline-block;
                 } 
                 .noRight {
                   border:1px solid rgb(227,227,227);
                 }
                .right{
                     background-color:rgb(254, 41, 66);
                     border:1px solid rgb(254, 41, 66);
                     position:relative;
                     .activityNotice{
                         display:inline-block;
                         color:white;
                         font-size:3vw;
                         border-radius: 50%;
                         width:100%;
                         height:100%;
                         position:absolute;
                         top:0;
                         left:0;
                         right:0;
                         bottom:0;
                         margin:auto;
                         line-height:6vw;
                         text-align: center;
                     }
                 }
       }
    }
  }
  .confirm{
        width: 87.78vw;
        height: 14vw;
        line-height: 14vw;
        text-align: center;
        border-radius: 7vw;
        background: #ff2742;
        color: #fff;
        font-size: 5vw;
        letter-spacing: 2px;
        margin:auto;
    }
}
</style>
