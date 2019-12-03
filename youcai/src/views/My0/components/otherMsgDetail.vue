<template>
  <div class="detailWrap">
    <div class="otherMsg">
      <span class="title">账号等级</span>
      <div class="container">
        <div class="member">
          <div class="grade">
            <i class="iconWanwan iconWhuangguanguanjundiyihuiyuan-copy myGrage"></i>
          </div>
          <span class="one">非会员</span>
          <span class="two">成为SVIP</span>
        </div>
        <div class="memberOne">
          <div class="grade">
            <i class="iconWanwan iconWwujiaoxing myGrage"></i>
          </div>
          <span class="one">LV.6</span>
          <span class="two">他的魅力值较高</span>
        </div>
      </div>
    </div>
    <div class="date">
      <span>账号信息</span>
      <span>多录号:&nbsp;{{user.name}}</span>
      <span v-if="user.timeCreate">注册日期:&nbsp;{{user.timeCreate.substring(0,10)}}</span>
    </div>
    <div class="personalMsg"
         v-if="userProfile">
      <span>个人信息</span>
      <span>情感状态: {{userProfile.emotionState === null ? '保密' : userProfile.emotionState}}</span>
      <!-- <span>星座: 水瓶座</span> -->
    </div>
    <div class="personalLabel">
      <span class="title">{{userLabel=== null || userProfile === null ? '标签: 无' : '标签'}}</span>
      <div class="allLabel">
        <span v-for="(oneLabel,index) in userLabel"
              :key="index">{{oneLabel.title}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userProfile: '',
      userLabel: '',
      userId: this.$route.params.id
    }
  },
  props: ['user'],
  created () {
    this.getProfile()
  },
  methods: {
    getProfile () {
      let me = this
      let userId = me.userId
      me.api.get({
        url: `UserProfile/userId?userId=${userId}`,
        success: function (res) {
          me.userProfile = res.userProfile
          me.userLabel = JSON.parse(res.userProfile.lable)
        },
        error: function (res) {
          me.$msg.showError(res.msg)
          me.$refs.scroll && me.$refs.scroll.forceUpdate()
        },
        complete: function () {
          me.$refs.scroll && me.$refs.scroll.forceUpdate()
          me.isLoad = false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.detailWrap{
    width:100%;
    padding-left:4vw;
    box-sizing: border-box;
  .otherMsg{
      width:100%;
      height:43.8vw;
      .title{
          font-size:3.5vw;
          color:#393939;
          font-weight: bold;
      }
      .container{
        display:flex;
        .member{
            width:21.67vw;
            .grade {
            width: 14.53vw;
            height: 8vw;
            line-height:8vw;
            background: #d8e1ef;
            position: relative;
            border-radius: 3vw;
            margin:auto;
            margin-top:3vw;
            margin-bottom:3vw;
            text-align: center;
            .myGrage{
                color:#a7bcd4;
                font-size:6vw;
            }
          }
          .one{
              display:block;
              font-size:3.5vw;
              color:#393939;
              text-align: center;
          }
          .two{
              display:block;
              font-size:3.5vw;
              color:#52c1c8;
              text-align: center;
          }
        }
        .memberOne{
            width:28vw;
            .grade {
            width: 14.53vw;
            height: 8vw;
            line-height:8vw;
            background: #fce0b4;
            position: relative;
            border-radius: 3vw;
            margin:auto;
            margin-top:3vw;
            margin-bottom:3vw;
            text-align: center;
            .myGrage{
                color:#e5b623;
                font-size:6vw;
            }
          }
          .one{
              display:block;
              font-size:3.5vw;
              color:#393939;
              text-align: center;
          }
          .two{
              display:block;
              font-size:3.5vw;
              color:#999999;
              text-align: center;
          }
        }
      }
  }
  .date{
      height:27vw;
      span{
          display:block;
          height:8vw;
          line-height:8vw;
      }
      span:nth-child(1) {
          font-size:3.5vw;
          color:#393939;
          font-weight: bold;
      }
      span:nth-child(2) {
          font-size:3.89vw;
          color:#484848;
      }
      span:nth-child(3) {
          font-size:3.89vw;
          color:#484848;
      }
  }
  .personalMsg{
     height:27vw;
      span{
          display:block;
          height:8vw;
          line-height:8vw;
      }
      span:nth-child(1) {
          font-size:3.5vw;
          color:#393939;
          font-weight: bold;
      }
      span:nth-child(2) {
          font-size:3.89vw;
          color:#484848;
      }
      span:nth-child(3) {
          font-size:3.89vw;
          color:#484848;
      }
  }
  .personalLabel{
     .title{
          font-size:3.5vw;
          color:#393939;
          font-weight: bold;
      }
      .allLabel{
         font-size:3.5vw;
        span{
            display: inline-block;
            height:10vw;
            line-height:10vw;
            padding:0 4vw;
            box-sizing: border-box;
            border:1px solid #cccccc;
            border-radius: 5vw;
            margin:3.24vw 3.24vw 3.24vw 0;
            color:#555555;
         }
      }
  }
}
</style>
