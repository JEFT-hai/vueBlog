<template>
  <div class="textAreaPage">
    <div class="textAreaPageMask"
         @click="SubmitText(false)"></div>
    <transition name="transTop">
      <div id='textAreaPageMain'
           class="textAreaPageMain"
           ref='textAreaPageMain'
           v-show="show">
        <div class="textAreaPageTitle">
          <span>{{data.title}}</span>
          <span class="clear"
                @click="SubmitText(false)">
            <i class="iconWanwan iconWquxiao activityNotice"></i>
          </span>
          <span @click="SubmitText(true)">完成</span>
        </div>
        <div class="textAreaPageContent">
          <textarea type='text'
                    ref="inputTextArea"
                    @focus="transitionT"
                    class="inputTextArea"
                    :maxlength="data.maxLen && data.maxLen"
                    name="signature"
                    v-model="data.inputText"
                    :placeholder="data.inputHolderText"
                    @keydown.enter='SubmitText(true)'></textarea>
          <div class="inputTextLimit"
               v-if="data.maxLen">
            <!-- <span>{{data.maxLen - data.inputText.length}}&nbsp;</span> -->
            <span v-if='data.inputText'>{{data.maxLen - data.inputText.length}}&nbsp;</span>
            <span v-else>{{data.maxLen}}&nbsp;</span>
          </div>
        </div>
        <!-- <div class="textAreaPageConfirm" >确定</div> -->
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    textAreaData: {
      type: Object,
      default: null
    }
  },
  mounted () {
    // this.$refs.inputTextArea.focus()
    // this.transY = this.$refs.textAreaPageMain.getBoundingClientRect().top + this.$refs.textAreaPageMain.offsetHeight - this.$refs.inputTextArea.getBoundingClientRect().bottom
    for (let key in this.textAreaData) {
      this.$set(this.data, key, this.textAreaData[key])
    }
    // console.log(this.data)
    this.transitionT()
  },
  data () {
    return {
      data: {},
      reallySubmit: false, // 用户确认提交
      transY: 0
    }
  },
  methods: {
    SubmitText (data) {
      if (data) {
        if (this.data.inputText === '' && this.data.toast) {
          this.$toast(this.data.toast)
          return
        }
        this.$emit('submitText', this.data)
      } else {
        this.$emit('submitText')
      }
      // this.$emit('submitText')
    },
    transitionT () {
      // this.$refs.textAreaPageMain.style.transform = 'translateY(' + -this.transY + 'px)'
      this.$nextTick(() => {
        this.$refs.inputTextArea.focus()
        // this.$refs.textAreaPageMain.scrollIntoView()
        // document.getElementById('textAreaPageMain').scrollIntoView()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.textAreaPage{
  width:100%;
  height:100vh;
  position:fixed;
  bottom: 0;
  left:0;
  z-index: 10000;
  &.transTop-enter-active,&.transTop-leave-active{
    transform: translate3d(0, 0, 0);
    transition:all 1s;
  }
  &.transTop-enter,&.transTop-leave-to{
    transform: translate3d(0, 100%, 0);
    // opacity: 0;
  }
  .textAreaPageMask{
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    background-color:rgba(0,0,0,.5);
  }
  .textAreaPageMain{
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
    background-color:#fff;
    z-index: 10;
    &.transTop-enter-active,&.transTop-leave-active{
      transition:all .35s ease;
    }
    &.transTop-enter,&.transTop-leave-to{
      transform: translate3d(0, 100%, 0);
      // opacity: 0;
    }
    .textAreaPageTitle{
      position:relative;
      height:11.85vw;
      span:first-child{
          display:inline-block;
          width:100%;
          height:100%;
          text-align: center;
          color:#333333;
          font-size:4vw;
          line-height:11.85vw;
          letter-spacing: 0.3vw;
      }
      span:nth-child(2){
          position:absolute;
          left: 4vw;
          top:0;
          display:inline-block;
          line-height:11.8vw;
          .activityNotice{
            color:#cccccc;
            font-size:4vw;
          }
      }
      span:last-child{
          position:absolute;
          right:6vw;
          top:0;
          display:inline-block;
          line-height:11.8vw;
          color: var(--mRed);
          .activityNotice{
            color:#cccccc;
            font-size:4vw;
          }
      }
    }
    .textAreaPageContent{
      position: relative;
      width:88%;
      margin:auto;
      border:1px solid #e7e7e7;
      border-radius: 2vw;
      padding-top:3vw;
      margin-bottom:10vw;
      .inputTextArea{
        width:90%;
        height:40vw;
        margin-left:4vw;
        border:none;
        outline: none;
        resize:none;
      }
      .inputTextLimit{
        position: absolute;
        bottom: 3vw;
        z-index: 100;
        width:15%;
        margin-top:2vw;
        margin-left:86%;
        display:flex;
        padding-left:4vw;
        color:#999999;
        font-size:4vw;
        span{
            text-align: right;
        }
      }
    }
    .textAreaPageConfirm{
      width:70%;
      height:11vw;
      border-radius: 5vw;
      text-align: center;
      line-height:11vw;
      color:white;
      font-size:4.6vw;
      letter-spacing: 0.5vw;
      background-color: var(--mRed);
      border:none;
      outline:none;
      position:absolute;
      left:0;
      right:0;
      bottom:10;
      margin:0 auto;
    }
  }
}

</style>
