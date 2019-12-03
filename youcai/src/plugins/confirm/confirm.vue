 <template>
  <div class="pop-up"
       v-if="show">
    <div class="popup-mask"
         v-if="hasMark"></div>
    <transition name="bottom">
      <div class="popup-note bottom">
        <div class="pop-content">
          <div :class="['pop-tit', {centerTitle:!msg}]">{{title}}</div>
          <p class="pop-note hasTitle">
            <span class="msg"
                  v-html="msg"></span>
          </p>
          <div class="btn-wrapper"
               v-if="type == 'alert'"
               @click.stop="alertClick">
            <span class="btn btn-block yes-btn">{{alertBtnText}}</span>
          </div>
          <div class="btn-wrapper"
               v-if="type == 'confirm'">
            <span @touchstart.prevent="noClick"
                  class="btn">{{noBtnText}}</span>
            <span @touchstart.prevent="yesClick"
                  class="btn yes-btn">{{yesBtnText}}</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '提示'
    },
    msg: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'alert'
    },
    alertBtnText: {
      type: String,
      default: '我知道了'
    },
    yesBtnText: {
      type: String,
      default: '确定'
    },
    noBtnText: {
      type: String,
      default: '取消'
    },
    hasMark: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      promiseStatus: null,
      show: false
    }
  },
  methods: {
    confirm () {
      let _this = this
      this.show = true
      return new Promise(function(resolve, reject) {
        _this.promiseStatus = { resolve, reject }
      })
    },
    noClick () {
      this.show = false
      this.promiseStatus && this.promiseStatus.reject()
    },
    yesClick () {
      this.show = false
      this.promiseStatus && this.promiseStatus.resolve()
    },
    alertClick () {
      this.show = false
      this.promiseStatus && this.promiseStatus.resolve()
    }
  }
}
</script>
<style lang="less">
.pop-up {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 20000;
  display: flex;
  align-items: center;
  .popup-mask {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.65);
    z-index: 1;
  }
  .popup-note {
    position: relative;
    width: 86vw;
    // height: 44.07vw;
    background-color: white;
    margin: auto;
    border-radius: 2vw;
    padding: 6vw 8.33vw 5.55vw 8.33vw;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    z-index: 2;
    .pop-tit {
      font-size: 5.3vw;
      color: #333333;
      font-weight: 500;
      &.centerTitle {
        text-align: center;
      }
    }
    .hasTitle {
      font-size: 4.17vw;
      color: #333333;
      margin-top: 3.5vw;
    }
    .btn-wrapper {
      margin-top: 9vw;
      display: flex;
      // margin-left: 20vw;
      > span {
        flex: 1;
        max-width: 43vw;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        text-align: center;
        &.btn {
          color: var(--mblue);
          letter-spacing: 1px;
        }
        &.yes-btn {
          color: var(--mRed);
        }
        &.btn-block {
          max-width: 100%;
          // border-top: 1px solid #f0f0f0;
        }
      }
    }
  }
}
</style>