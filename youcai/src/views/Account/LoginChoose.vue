<template>
  <div class="bigLoginWrap loginChoosePage">
    <div class="page hashPage user_login"
         id="user_login_byphone">
      <div class="page-content">
        <div class="loginNotice">
          <span class="backOther"
                @click="goBack">
            <i class="iconWanwan iconWquxiao activityNotice"></i>
          </span>
        </div>
        <div class="loginChooseTitle">登录多录， 体验更多功能</div>
        <div class="loginTypeBtnList">
          <p class="loginTypeBtn loginCmcc"
             @click="goLoginCMCC">本机号码一键登录</p>
          <p class="loginTypeBtn loginVerification "
             @click="go.name('loginByPhone')">手机号码验证登录</p>
          <p v-if="$store.state.isZijiren"
             class="loginTypeBtn loginVerification"
             @click="go.name('loginByUs')">自己人手机号码验证登录</p>
        </div>
        <div class='tipInfo'>未注册手机验证后自动登录</div>
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
export default {
  methods: {
    goLoginCMCC () { // 一键登录
      window.isInAndroid && window.WanAndroid.CMCCLogin()
    },
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
.loginChoosePage{
  height:100%;
  position:relative;
  top:0;
  left:0;
  z-index:20000;
  background-color:white;
  &.loginChoosePage{
    .loginNotice {
        position: relative;
        height: 16vw;
        .backOther{
            color: #969696;
            font-size: 6.5vw;
            display: inline-block;
            color: #969696;
            font-size: 6.5vw;
            position: absolute;
            top: 4vw;
            left: 4vw;
            .activityNotice {
                color: #cccccc;
                font-size: 4vw;
            }
        }
    }
    .loginChooseTitle {
        margin-top: 15vw;
        text-align: center;
        font-size: 5vw;
        color: #1c1c1c;
        font-weight: bold;
    }
    .loginTypeBtnList {
        padding-top: 8vw;
        .loginTypeBtn{
            height: 11.6vw;
            line-height: 11.6vw;
            width: 84vw;
            margin: 7vw auto 0;
            border-radius: 1.2vw;
            text-align: center;
            font-size: 4.5vw;
            letter-spacing: 1px;
            &.loginCmcc{
                background-color: #ff2742;
                background: var(--mRed);
                color: #fff;
            }
            &.loginVerification {
                background: #f6f6f6;
                color: #8a8a8a;
            }
        }
    }
    .tipInfo {
        height: 20vw;
        line-height: 20vw;
        width: 100%;
        font-size: 3.6vw;
        color: #9b9b9b;
        text-align: center;
    }
    .zijirenLogin{
      span{
        margin-left:3vw;
      }
    }
  }
}
.user_login{
  .userAggree{
    text-align: center;
    color:rgb(127,127,127);
    font-size:3vw;
    margin-top:10vw;
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
