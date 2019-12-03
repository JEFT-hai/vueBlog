<template>
  <div class='user_login'>
    <div class="loginNotice">
      <span class="backOther"
            @click="goBack">
        <i class="iconWanwan iconWquxiao activityNotice"></i>
      </span>
      <div class="user_login_header">
        <div>
          <Logo />
        </div>
        <div>自己人手机账号登录</div>
      </div>
    </div>
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
            <input type="number"
                   oninput="if(value.length>11)value=value.slice(0,11)"
                   v-model="zijirenNumber"
                   @keyup.enter="zijirenLogin">
          </div>
          <div class="clearInput"
               v-show="zijirenNumber.length > 0"
               @click="zijirenNumber=''">
            <i class="iconWanwan iconWquxiao-copy-copy activityNotice"></i>
          </div>
        </div>
      </div>
      <div class="buttons">
        <div class="button_container">
          <button :class="['button', 'button-fill', 'button-primary', 'color-primary', {rightNowLogin: !zijirenNumberState}, {rightNowLoginSuccess: zijirenNumberState}]">登录</button>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import { mapMutations } from 'vuex' 
export default {
    data () {
      return {
        zijirenNumber: '',
        isLoading: false // zijiren loading状态
      }
    },
    components: {
      Logo: () => import('@/components/logo.vue'),
    },
    computed: {
      zijirenNumberState () {
        return (/^1(3|4|5|6|7|8|9)\d{9}$/).test(this.zijirenNumber)
      }
    },
    methods: {
      submit () {
        if (this.isLoading) {
            return
        }
        if (!this.zijirenNumberState) {
          this.$toast('请输入正确的手机号', 1200)
          return
        }
        this.isLoading = true
        let me = this
        me.api.process({
          url: 'UserAbc',
          data: {
            phone: this.zijirenNumber
          },
          success: function (res) {
            let user = {
              userToken: res,
              userPhone: me.zijirenNumber
            }
            me.$store.dispatch('userLoginSuccess', {me:me,user:user})
          },
          error: function(err) {
            me.$alert(err)
          },
          complete:function(){
            console.log('是这里吗')
            me.isLoading = false
          }
        })
      },
      goBack () {
        this.$router.back()
      }
    }
}
</script>
<style lang="less">
.loginNotice{
      position:relative;
      .backOther{
        display:inline-block;
        color:rgb(150, 150, 150);
        font-size:6.5vw;
        position:absolute;
        top:4vw;
        left:4vw;
        .activityNotice{
          color:#cccccc;
          font-size:4vw;
        }
      }
    }
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
