<template>
  <div class="bigLoginWrap">
    <div class="page hashPage user_login"
         id="user_login_byphone">
      <div class="page-content">
        <div class="loginNotice">
          <span class="backOther"
                @click="goBack">
            <i class="iconWanwan iconWquxiao activityNotice"></i>
          </span>
          <div class="user_login_header">
            <div>
              <Logo />
            </div>
            <div>手机账号登录</div>
          </div>
        </div>
        <div class="user_login_formcontainer">
          <FormsLoginByPhone />
        </div>
        <p v-if="$store.state.isZijiren"
           class="loginByPhoneZijiren loginTypeBtn loginVerification"
           @click="go.name('loginByUs')">自己人手机号码验证登录</p>
        <div class="user_login_type_container">
          <h3><span>微信登录</span></h3>
          <div class="loginWeixin"
               @click='wxLogin'>
            <i class="iconWanwan iconWwchart"></i>
          </div>
        </div>
        <div class="userAggree">
          登录注册代表同意
          <span @click="go.name('agreement')">用户协议</span>
          和
          <span @click="go.name('privacy')">隐私条款</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FormsLoginByPhone from './components/LoginByPhone.vue'
export default {
  data () {
    return {
      title: '用户注册协议',
      name: ''
    }
  },
  components: {
    Logo: () => import('@/components/logo.vue'),
    FormsLoginByPhone
  },
  methods: {
    wxLogin () { // 微信登录
      window.isInAndroid && window.WanAndroid.wxLogin()
    },
    goBack () {
      this.$router.back()
    }
  }
}
</script>
<style lang="less" scoped>
.loginByPhoneZijiren{
    height: 11.6vw;
    line-height: 11.6vw;
    width: 84vw;
    margin: 7vw auto 0;
    border-radius: 1.2vw;
    text-align: center;
    font-size: 4.5vw;
    letter-spacing: 1px;
    background: #f6f6f6;
    color: #8a8a8a;
}
.user_login_type_container{
  margin-top: 6vw;
  h3:after, h3:before{
    width: 20vw!important;
  }
   .loginWeixin{
    width:15vw;
    height:15vw;
    background-color: #00be00!important;
    border-radius: 50%;
    margin:auto;
    margin-top:2vw;
    display:flex;
    justify-content: center;
    .iconWwchart{
      text-align: center;
      line-height:15vw;
      color:white;
      font-size:9vw;
    }
  }
}
.weixinLogin{
  background-color: #00be00!important;
  display:flex;
  justify-content:center;
  align-items: center;
  .iconWwchart{
    color:white;
    font-size:6vw;
  }
}
.bigLoginWrap{
  height:100%;
  position:relative;
  top:0;
  left:0;
  z-index:20000;
  background-color:white;
}
.user_login{
  .page-content{
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
  }
  .userAggree{
    text-align: center;
    color:rgb(127,127,127);
    font-size:3vw;
    margin-top:20vw;
    span{
      color:rgb(46, 165, 229)
    }
 }
}
.user_login_links{
    text-align: center;
    .link-agreement{
      &:first-child{
        border-left: none;
      }
      display: inline-block;
      padding: 0 2.67vw;
      border-left: 1px solid #ccc;
      font-size: 3.74vw;
      line-height: 150%;
      color: #9b9b9b;
    }
}
</style>
