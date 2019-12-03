<template>
  <div class="input_container">
    <div class="input">
      <!-- input number maxlength不生效 -->
      <input ref='phoneCode'
             type="number"
             inputmode="numeric"
             autocomplete="off"
             name="phoneCode"
             v-model="phoneCode"
             placeholder="请输入验证码"
             oninput="if(value.length>6)value=value.slice(0,6)" />
    </div>
    <div class="input_panel">
      <a href="javascript:;"
         tabindex="-1"
         class="input_panel_sms"
         :class="{is_loading:phoneCodeLoading,is_waiting:!!phoneCodeWaitTime}"
         @click="PhoneCodeRefresh"><span>{{phoneCodeMessage}}</span></a>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'getPhoneCode',
  props: {
    phoneNum: {
      type: String
    },
    phoneState:{
      type: Boolean,
      default:false
    }
  },
  data () {
    return {
      phoneCode: '',
      phoneCodeToken: '',
      phoneCodeMessage: '获取验证码',
      phoneCodeLoading: false,
      phoneCodeTimer: null
    }
  },
  computed: {
    ...mapState({
      phoneCodeWaitTime: 'phoneCodeWaitTime'
    })
  },
  watch: {
    phoneCode (newV) {
      this.$emit('upPhoneCode', newV)
    },
    phoneCodeWaitTime (newV, oldV) {
      if(newV) {
        this.phoneCodeMessage = `重新发送(${newV})`
      } else if (oldV) {
        this.phoneCodeMessage = '重新发送'
      } else {
        this.phoneCodeMessage = '获取验证码'
      }
    }
  },
  methods: {
    ...mapMutations({
      setWaitCodeTime: 'setWaitCodeTime'
    }),
    // 获取验证码
    PhoneCodeRefresh: function () {
      let me = this
      if (me.phoneCodeLoading || me.phoneCodeWaitTime) {
        return
      }
      me.phoneCodeLoading = true
      if (!me.phoneState) {
        me.$toast('请输入正确的手机号')
        me.phoneCodeLoading = false
        return
      }
      me.api.process({
        url: 'PhoneCode',
        data: {
          'relate': me.phoneNum
        },
        success: function (res) {
          console.log('打印这个resyyy', res)
          me.$emit('upPhoneToken', res.token)
          me.phoneCode = ''
          me.setWaitCodeTime()
        },
        error: function (err) {
          me.$alert(err)
        },
        complete: function () {
          me.phoneCodeLoading = false
        }
      })
    }
  }
}
</script>
