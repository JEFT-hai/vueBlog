<template>
  <div class="personalDecoratePage">
    <!-- <div class="personalHead">
      <span class="headFont"></span>
      <span class="headTitle">个性化装扮,打造出不一样的你</span>
    </div> -->
    <div class="personalMain">
      <!-- <div class="mainBar">
        <span>头像挂件</span>
        <span>昵称特效</span>
      </div> -->
      <div class="oneContent">
        <p>头像挂件</p>
        <span class="contentTitle">VIP用户尊享头像挂件装扮特权，精美头像挂件任意挑选，彰显个性，你就是与众不同! </span>
      </div>
      <div class="avatarDecorate">
        <div class="avatarImg">
          <span class="time">8:18</span>
          <span class="flag">
            <i class="iconWxinhao1 iconWanwan"></i>
            <i class="iconWxinhao iconWanwan"></i>
            <i class="iconWdianchi iconWanwan"></i>
          </span>
        </div>
        <div class="userMsg">
          <div class="msgOne">
            <div class="avatarWrap">
              <!-- <div class="myAvatar"> -->
              <img :src="avatarPath"
                   alt=""
                   class="myAvatar">
              <!-- </div> -->
              <div class="hangerImgWrap">
                <img class="hangerImg"
                     src="img/星球.f251ebfb.png"
                     alt="" />
              </div>
            </div>
            <div class="name">
              <span>{{user.nickName ? user.nickName: user.name}}</span>
              <span><i class="iconWdengji iconWanwan"></i></span>
            </div>
          </div>
          <div class="msgTwo">
            <div class="boxOne">
              <span>{{format.formatNum(user.fansCount)}}</span>
              <span>粉丝</span>
            </div>
            <div class="boxOne">
              <span>{{format.formatNum(user.attentionCount)}}</span>
              <span>关注</span>
            </div>
            <div class="boxOne">
              <span>{{format.formatNum(user.likeCount)}}</span>
              <span>获赞</span>
            </div>
          </div>
          <div class="msgThree">
            <span>等级</span>
            <span><i class="iconWxingxing2 iconWanwan"></i><i class="fontStyle">LV8</i></span>
            <span><i class="iconWhuangguan iconWanwan"></i><i class="fontStyle">国王</i></span>
          </div>
        </div>
      </div>
      <div class="chatLook">
        <span @click="go.name('hanger')">去看看</span>
      </div>
      <!-- <div class="oneContent">
        <p>二、昵称特效</p>
        <span class="contentTitle">VIP用户尊享昵称装扮特权，做人群中最闪亮的那颗星! </span>
      </div>
      <div class="specialColor">
        <img src=""
             alt="">
      </div>
      <div class="chatLook">
        <span>去看看</span>
      </div> -->
    </div>
  </div>
</template>

<script>
// const toBeVIPBar = resolve => require(['./components/ToBeVIPBar.vue'], resolve)
import {mapState} from 'vuex'
export default {
  data () {
      return {
          defaultUserAvatar: require('@/assets/images/userBg.jpg')
      }
  },
  computed: {
    ...mapState(['user']),
    avatarPath () {
      return this.user.avatar ? this.user.avatar : this.defaultUserAvatar
    },
  },
  components: {
    //   toBeVIPBar,
  }
}
</script>

<style lang="less" scoped>
   .personalDecoratePage{
      .personalHead{
          width:100vw;
          height:39.25vw;
          background:pink;
          span{
              display:inline-block;
              width:100vhw;
          }
          .headTitle{
              text-align: center;
              color:rgb(232, 213, 172);
              font-size:4.7vw;
          }
      }
      .personalMain{
          padding-top:4.53vw;
          box-sizing: border-box;
        .mainBar{
          margin:auto;
          width:91.57vw;
          border:1px solid rgb(238, 239, 236);
          display:flex;
          justify-content:space-between;
          span{
              display:inline-block;
              flex:1;
              text-align: center;
              font-size:4.44vw;
              height:11.48vw;
              line-height:11.48vw;
          }
          span:first-child{
              border-right:1px solid rgb(238, 239, 236);
          }
        }
        .oneContent{
            padding:5.4vw 4vw 0 4vw;
            box-sizing: border-box;
            font-size:0;
            p{
                font-size:5vw;
                margin-bottom:4.44vw;
            }
            .contentTitle{
                font-size:4vw;
                color:#828380;
            }
        }
        .avatarDecorate{
          width:87.5vw;
          margin:auto;
          margin-top:4vw;
          box-shadow: 0px 0px 2px #ccc;
          padding-bottom:2vw;
          box-sizing: border-box;
          .avatarImg{
              width:100%;
              height:37.31vw;
              background:url('../../../../assets/images/change4.png')  no-repeat;
              background-size:cover;
              display:flex;
              justify-content: space-between;
              .time{
                display:inline-block;
                margin-left:4vw;
                color:white;
              }
              .flag{
                display:inline-block;
                margin-right:4vw;
                color:white;
                i{
                  margin-left:1vw;
                }
              }
          }
          .userMsg{
              width:100%;
              .msgOne{
                  display:flex;
                  flex-flow: row nowrap;
                  .avatarWrap{
                    width:27.16vw;
                    height:27.16vw;
                    position:relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    margin-top:-17vw;
                    margin-left:2vw;
                    .myAvatar{
                        width:19.16vw;
                        height:19.16vw;
                        border-radius: 50%;
                        overflow: hidden;
                        position:absolute;
                    }
                  }
                  .name{
                      margin-left:2vw;
                      span:nth-child(1){
                          font-size:4.9vw;
                          font-weight: bold;
                          display:inline-block;
                          height:12vw;
                      }
                      span:nth-child(2) {
                          display:inline-block;
                          height:12vw;
                          .iconWdengji{
                            color:rgb(234, 36, 28);
                            font-size:6vw;
                            display:inline-block;
                            height:10vw;
                          }
                          .level{
                              display:inline-block;
                              width:10vw;
                              height:5vw;
                              background:rgb(175, 23, 28);
                              color:white;
                              font-size:3vw;
                              font-style:normal;
                              text-align: center;
                              border-radius: 4vw;
                              line-height:5vw;
                          }
                      }
                      
                  }
              }
              .msgTwo{
                  display:flex;
                  flex-flow: row nowrap;
                  width:85%;
                  margin:auto;
                  margin-top:-2vw;
                  .boxOne{
                      flex:1;
                      font-size:0;
                      span{
                          display:inline-block;
                          width:100%;
                          text-align: center;
                          font-size:4vw;
                      }
                      span:nth-child(2) {
                        font-size:3vw;
                        color:#bababa;
                      }
                  }
              }
              .msgThree{
                  margin-top:2vw;
                  padding-left:5vw;
                  padding-bottom:1vw;
                  box-sizing: border-box;
                  height:8vw;
                  span:nth-child(1) {
                     font-size:4vw;
                     color:#bababa;
                     margin-right:4vw;
                  }
                  span:nth-child(2) {
                      font-size:0;
                      display:inline-block;
                      height:8vw;
                      .iconWxingxing2{
                         color:rgb(255, 164, 12);
                          font-size:5vw;
                      }
                      .fontStyle{
                          background:rgb(194, 76, 60);
                          font-size:3vw;
                          display:inline-block;
                          border-radius: 3vw;
                          height:5vw;
                          width:10vw;
                          color:white;
                          font-style: normal;
                          text-align: center;
                          line-height:5vw;
                      }
                  }
                  span:nth-child(3) {
                      font-size:0;
                      display:inline-block;
                      height:8vw;
                      margin-left:2vw;
                      .iconWhuangguan{
                         color:rgb(252, 158, 16);
                          font-size:5vw;
                      }
                      .fontStyle{
                          background:rgb(194, 76, 60);
                          font-size:3vw;
                          display:inline-block;
                          border-radius: 3vw;
                          height:5vw;
                          width:10vw;
                          color:white;
                          font-style: normal;
                          text-align: center;
                          line-height:5vw;
                      }
                  }
              }
          }
        }
        .chatLook{
            width:100vw;
            height:25vw;
            display:flex;
            justify-content: center;
            align-items: center;
            span{
                display:inline-block;
                width:25.64vw;
                height:9.62vw;
                background:rgb(250, 208, 157);
                font-size:4.7vw;
                color:#a57c4c;
                border-radius: 5vw;
                text-align: center;
                line-height:9.62vw;
            }
        }
      }
   }
</style>
