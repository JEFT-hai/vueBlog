<template>
  <form method="post"
        action="javascript:;"
        @submit.prevent="submit">
    <div class="inputs myLoginPage">
      <div class="input_container usePhoneLogin">
        <div class="input_media">
          <a href="javascript:;"
             tabindex="-1"
             class="input_media_country">+86</a>
        </div>
        <div class="input">
          <input id='loginPhoneNum'
                 type="Number"
                 name="phone"
                 placeholder="请输入手机号码"
                 v-model="phone"
                 class="userGoLogin"
                 oninput="if(value.length>11)value=value.slice(0,11)" />
        </div>
        <div class="clearInput"
             v-show="phone.length > 0"
             @click="clearPhone">
          <i class="iconWanwan iconWquxiao-copy-copy activityNotice"></i>
        </div>
      </div>
      <PhoneCodeComponent ref='PhoneCodeComponent'
                          :phoneNum='phone'
                          :phoneState='phoneState'
                          @upPhoneCode="getPhoneCode"
                          @upPhoneToken='getPhoneToken'
                          @fail="showError" />
    </div>
    <div class="buttons">
      <div class="button_container">
        <button :class="['button', 'button-fill', 'button-primary', 'color-primary', {rightNowLogin: !canLogin}, {rightNowLoginSuccess: canLogin}]">登录</button>
      </div>
    </div>
  </form>
</template>

<script>
import PhoneCodeComponent from '../components/phoneCode.vue'
import { mapState, mapMutations,mapActions } from 'vuex'
export default {
  components: {
    PhoneCodeComponent
  },
  data () {
    return {
      phone: '',
      phoneCode: '',
      phoneToken: '',
      formLoading: false // 请求状态
    }
  },
  computed: {
    ...mapState(['user']),
    phoneState () {
      return (/^1(3|4|5|6|7|8|9)\d{9}$/).test(this.phone)
    },
    phoneCodeState () {
      return this.phoneCode.trim().length === 6
    },
    canLogin () {
      return  this.phoneState && this.phoneCodeState
    }
  },
  methods: {
    ...mapMutations({
      'updateCounts': 'updateCounts',
      'updeteMessageCount': 'updeteMessageCount',
      'upFollow': 'upFollow',
      'updateCallState': 'updateCallState'
    }),
    ...mapActions({
      userLoginSuccess: 'userLoginSuccess'
    }),
    clearPhone () {
      this.phone = ''
    },
    getPhoneCode (data) {
      this.phoneCode = data
    },
    getPhoneToken (data) {
      this.phoneToken = data
    },
    async submit () {
      let me = this
      if (me.formLoading) {
        return
      }
      me.formLoading = true
      let data = {
        'token': me.phoneToken,
        'code': me.phoneCode
      }
      me.api.process({
        url: 'User',
        data: data,
        success: function (res) {
          let user = {
            userToken: res,
            userPhone: me.phone
          }
          me.userLoginSuccess({me:me,user:user}) // 登录成功之后进行一系列的请求与更新信息
        },
        error: function (res) {
          res = typeof(res) === 'string' ? res : JSON.stringify(res)
          me.$alert(res)
        },
        complete: function () {
          me.formLoading = false
        }
      })
      return false
    }
  }
}
</script>

<style lang="less" scoped>
.rightNowLoginSuccess {
  width:85% !important;
  margin:auto !important;
  margin-top:10vw !important;
  background-color:rgb(255, 39, 66) !important;
  border:none !important;
  border-radius: 5vw !important;
  font-size:4.3vw !important;
  letter-spacing: 0.5vw;
  color:white !important;
}
.myLoginPage{
  width:86% !important;
  margin:auto !important;
  margin-top:10vw !important;
  .input_container{
    border-bottom:1px solid rgb(243,243,243);
  }
  .usePhoneLogin{
    position:relative;
    .userGoLogin{
      outline:none;
      border:none;
    }
    .clearInput{
      width:4vw;
      height:4vw;
      border-radius: 50%;
      color:white;
      font-size:3vw;
      line-height:4vw;
      text-align: center;
      position: absolute;
      right:5vw;
      background-color:rgb(140, 140, 140);
      .activityNotice{
        font-size:3vw;
      }
    }
  }
}
.zijirenLogin{
  margin-top:5vw;
  span{
    margin-left:3vw;
  }
}
.rightNowLogin{
  width:85% !important;
  margin:auto !important;
  margin-top:10vw !important;
  background-color:rgb(230, 230, 230) !important;
  border:none !important;
  border-radius: 5vw !important;
  font-size:4.3vw !important;
  letter-spacing: 0.5vw;
  color:white !important;
}
</style>
