<template>
  <div class="joinActivityPage">
    <div class="pickerBlock">
      <div class="tabHeader borderB">
        报名信息
      </div>
      <div class="pickerBlock_content">
        <div class="formBlock">
          <p>
            <span>姓名</span>
            <i class="iconWxinghao iconWanwan"></i>
          </p>
          <div class="inputWrapper">
            <input v-model="userName"
                   type="text"
                   placeholder="请填写你的姓名" />
            <i v-show="userName.length"
               class="inputClose iconWanwan iconWclose"
               @click="clear('userName')"></i>
          </div>
        </div>
        <div class="formBlock">
          <p>
            <span>电话</span>
            <i class="iconWxinghao iconWanwan"></i>
            <span class="phoneErr"
                  v-show="phoneErr">手机号码格式错误</span>
          </p>
          <div class="inputWrapper">
            <input type="number"
                   placeholder="请填写你的电话"
                   v-model="phoneNum"
                   @blur="textPhone" />
            <i v-show="phoneNum.length"
               class="inputClose iconWanwan iconWclose"
               @click="clear('phoneNum')"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="pickerBlock">
      <div class="tabHeader borderB">
        {{isFree}}
      </div>
      <div class="pickerBlock_content">
        <div class="totalRMB">
          总计:
          <i class="iconWrmb iconWanwan"></i>
          <i>{{fee}}</i>
        </div>
      </div>
    </div>
    <div class="joinActivityBtn _confirmBtn"
         @click="joinActivity">
      确认报名
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  computed: {
    isFree () {
      return !this.fee ? '免费' : '收费'
    }
  },
  data () {
    return {
      phoneErr: false,
      phoneNum: '',
      userName: '',
      activetyId: this.$route.params.id,
      fee: this.$route.params.fee
    }
  },
  methods: {
    ...mapMutations(['updateMyPage']),
    clear (str) {
      this[str] = ''
    },
    setCurSex (index) {
      if (this.curSex === index) {
        this.curSex = -1
      } else {
        this.curSex = index
      }
    },
    hideJoinActivity () {
      this.$emit('hideJoinActivity')
    },
    textPhone () {
      if (!(/^1[34578]\d{9}$/.test(this.phoneNum))) {
        this.phoneErr = true
      } else {
        this.phoneErr = false
      }
    },
    joinActivity () {
      if (!this.userName) {
        this.$toast('请输入正确的姓名')
        return
      } else if (!this.phoneNum || this.phoneErr) {
        this.$toast('请输入正确的电话')
        return
      }
      let me = this
      me.$uploading(true, '提交中...')
      me.api.put({
        url: 'Activity',
        data: {
          'activityId': me.activetyId,
          'realName': me.userName,
          'phone': me.phoneNum
        },
        success: function () {
          let obj = {
            isRefreshActivity: true,
          } 
          me.updateMyPage(obj)
          me.$success(true, '报名成功，我们会尽快与你联系', 1200)
          setTimeout(() => {
            me.$router.back()
          }, 1200)
        },
        error: ( (res) => {
          me.$error(true, res, 500)
        })
      })
    }
  }
}
</script>
<style lang="less">
.joinActivityPage{
    color: var(--dGray);
    .phoneErr {
        color: var(--mRed);
        display: inline-block;
        margin-left: 4vw;
    }
    .joinActivityBtn{
        margin-top: 20.46vw;
    }
    .pickerBlock_content{
        padding-bottom: 5.18vw;
        .totalRMB{
            text-align: right;
            font-size: var(--nText);
            i{
                font-size: var(--title);
                color: var(--mRed);
                font-style: normal;
            }
        }
        .formBlock{
            padding: 0 2.13vw;
            font-size: var(--mText);
            letter-spacing: 1px;
            .inputWrapper{
              display: flex;
              border-radius: 4.5vw;
              margin-bottom: 1.94vw;
              height: 9vw;
              line-height: 9vw;
              border: 1px solid #e7e7e7;
              box-sizing: border-box;
              .inputClose{
                width: 6vw;
                font-size: var(--sText);
                text-align: center;
              }
              input{
                outline: none;
                border: none;
                padding-left: 2.78vw;
                flex: 1;
                letter-spacing: 1px;
                background: transparent;
              }
            }
            p{
                height: 11.11vw;
                line-height:11.11vw;
                font-size: 0;
                span{
                    font-size: var(--mText);
                }
                .iconWxinghao{
                    display: inline-block;
                    vertical-align: top;
                    font-size: var(--sText);
                    color: var(--mRed);
                    width: 1.2vw;
                    height: 1.2vw;
                    transform: scale(.4);
                    margin-top: 1.4vw;
                }
            }
            .btnList{
                .sexBtn{
                    display:inline-block;
                    width: 12vw;
                    height:9vw;
                    line-height:9vw;
                    text-align: center;
                    border: 1px solid #e7e7e7;
                    margin-right: 4vw;
                    border-radius: 1.11vw;
                    font-size: var(--mText);
                }
                .sexBtn.curSex{
                    color: var(--mRed);
                    border-color: currentColor;
                }
            }
        }
    }
}
</style>
