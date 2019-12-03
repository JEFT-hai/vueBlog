<template>
  <li class="oneUser">
    <div class="userAvator">
      <!-- <img :class="{defaultStyle: userMessage.avatar === null || userMessage.avatar === '' || userMessage.avatar == 'http://webapp.szwanwan.com/img/default/defaultavatar.png'}"
           :src="userMessage.avatar === null || userMessage.avatar === '' ? defaultAvatar : userMessage.avatar"
           alt="">
      <div class="right"
           v-if="userMessage.autheType === 1">
        <i class="one">v</i>
      </div> -->
      <Avatar class="flex--left"
              :item='userMessage'
              :size=19
              :authOptions="authOptions"
              @goHome="goHome"
              :isUserMessage="isUserMessage" :isItemOnly="true"></Avatar>
    </div>
    <div class="message"
         @click="goHome">
      <div class="userName">{{userMessage.nickName === null || userMessage.nickName === '' ? userMessage.name : userMessage.nickName}}</div>
      <div class="userCode">
        <span :class="{pinkGenderLabel:userMessage.gender === 2,blueGenderLabel:userMessage.gender !== 2}">
          <i class="iconWanwan iconWnan-copy activityNan"
             v-if="userMessage.gender === 1 || userMessage.gender === 0 "></i>
          <i class="iconWanwan iconWnv3-copy activityNv"
             v-else></i>
          <!-- <i class="age">{{userAge}}</i> -->
        </span>
        <!-- <span class="yellowGenderLabel">
                    会员
                </span> -->
        <span class="distance"
              v-if="calculateDistance && isNeedDistance">{{calculateDistance}}km</span>
      </div>
      <div class="userMsg"
           v-if="isShowFansCount">
        <!-- <span>128个动态</span> -->
        <span>{{userMessage.fansCount}}个粉丝</span>
      </div>
      <div class="userMsg2"
           v-if="!isShowFansCount">
        <span>姓名:{{userMessage.realName}}</span>
        <span>手机号:{{userMessage.phone}}</span>
      </div>
    </div>
    <div class="follow"
         @click.stop>
      <div class="child">
        <BtnFollow :item="userMessage"
                   v-if="isInnerShare"
                   :isAttentionId="isAttentionId"
                   :isMyFollow="isMyFollow"></BtnFollow>
      </div>
    </div>
  </li>
</template>

<script>
import Avatar from '@/components/Avatar'
import BtnFollow from '@/components/Btn/BtnFollow'
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      isUserMessage: true,
      userInitBirth: this.userMessage.birth,
      defaultAvatar: 'http://webapp.szwanwan.com/img/default/defaultavatar.png',
      authOptions: { // 认证
          show: true, // 是否显示认证logo
          hasBorder: true, // 认证logo是否有边框
          fontSize: 6, // 字体
      },
    }
  },
  props: {
    isShowFansCount: {
      type: Boolean,
      default: true
    },
    item: {
      type: Object
    },
    userMessage: {
      type: Object
    },
    isAttentionId: {
      type: Boolean,
      default: false
    },
    isNeedDistance: { // 表示是否需要显示距离
      type: Boolean,
      default: false
    },
    isInnerShare: { // 表示是否是内部分享页
      type: Boolean,
      default: true // true表示不是内部分享，false表示是内部分享页
    },
    isMyFollow: { //表示我自己的关注页，那个关注按钮不显示
      type: Boolean, 
      default: false
    }
  },
  computed: {
    ...mapState(['user']),
    // 用户资料年龄
    userAge () {
      let userBirth = this.userInitBirth
      let data = new Date()
      let year = data.getFullYear()
      let month = data.getMonth() + 1
      let day = data.getDate()
      let birthYear = parseInt(userBirth.substring(0, 4))
      let birthMonth = parseInt(userBirth.substring(5, 7))
      let ageYear = year - birthYear
      let birthDay = parseInt(userBirth.substring(8, 10))
      // 如果当前月份小于生日月份就要减1岁
      let change = month > birthMonth || month === birthMonth ? 0 : -1
      // 只有当生日月份当前月份相等时 才判断 day
      if (month === birthMonth) {
        change = day > birthDay || day === birthDay ? 0 : -1
      }
      if (ageYear + change === 2018) {
        return 0
      } else {
        return ageYear + change
      }
    },
    /**
     * calculateDistance计算距离
    */
    calculateDistance () {
       if (this.userMessage && this.userMessage.distance) {
         let current = this.userMessage.distance / 1000
         return this.toDecimal2(current)
       } else {
           return 0
       }
    }
  }, 
  components: {
    BtnFollow,
    Avatar
  },
  methods: {
    ...mapMutations({
      'setClick': 'setClick',
      'updateNeedBack':'updateNeedBack'
    }),
    goHome () {
      this.setClick(true)
      if (!this.isInnerShare) {
        console.log('我是内部分享呢')
        this.$emit('goInnerShare', this.userMessage, 'private')
        return
      }
      if (this.isAttentionId) { // 表示是我的关注页
          // this.$router.push({ name: 'discoverUser', params: { id: this.userMessage.attentionUserId } })
        if (this.userMessage.attentionUserId === this.user.userId) { // 去到我的主页
          this.updateNeedBack(true)
          this.$router.push({ name: 'my' })
        } else { // 去到别人的主页
          this.$router.push({ name: 'discoverUser', params: { id: this.userMessage.attentionUserId } })
        }
      } else { // 表示是用userId
        if (this.userMessage.userId === this.user.userId) { // 去到我的主页
        this.updateNeedBack(true)
          this.$router.push({ name: 'my' })
        } else { // 去到别人的主页
          this.$router.push({ name: 'discoverUser', params: { id: this.userMessage.userId } })
        }
      }
    },
        /**
     * toDecimal2保留两位小数
     */
    toDecimal2(x) {
        var f = parseFloat(x) 
        if (isNaN(f)) { 
            return false
        } 
        var f = Math.round(x * 100) / 100 
        var s = f.toString()
        var rs = s.indexOf('.')
        if (rs < 0) { 
            rs = s.length 
            s += '.'
        } 
        while (s.length <= rs + 2) { 
            s += '0'
        } 
        return s
    }
  }
}
</script>

<style lang="less" scoped>
  .oneUser{
    display:flex;
    // align-content: center;
    align-items: center;
    width:100%;
    padding-top:2vw;
    padding-bottom:2vw;
    box-sizing: border-box;
    .userAvator{
        box-sizing: border-box;
        margin-left:4vw;
        // width:19.2vw;
        // height:19.2vw;
        // border-radius: 50%;
        // border:1px solid rgb(243,243,243);
        // overflow: hidden;
        position:relative;
        // z-index: 99;
        img{
            position:absolute;
            top:0;
            left:0;
            right:0;
            bottom:0;
            margin:auto;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            overflow: hidden;
        }
        .defaultStyle{
            width:15vw;
            height:15vw;
            border-radius: 0;
            overflow: hidden;
        }
        .right{
                  position:absolute;
                  bottom:0vw;
                  right:-0.5vw;
                  z-index:1000;
                  background:white;
                  box-shadow: 0 0 1px #eeee;
                  width: 6vw;
                  height:6vw;
                  border-radius: 50%;
                  display:flex;
                  .one{
                    margin:auto;
                    width:5.18vw;
                    height:5.18vw;
                    border-radius: 50%;
                    background: linear-gradient(to right bottom,#e37782, #f56b80,#ff5363,#ff405b, #fc3f58);
                    color:white;
                    line-height: 5.18vw;
                    text-align: center;
                    // display:flex;
                    // justify-content: center;
                    // align-items: center;
                    font-size:5vw;
                    font-weight: 500;
                    // padding-right:1vw;
                    box-sizing: border-box;
                    font-family: Times, TimesNR, 'New Century Schoolbook', Georgia, 'New York', serif;
                  }
                }
    }
    .message{
        margin-left:3vw;
        flex: 1;
        overflow: hidden;
        .userName{
            // max-width:45vw;
            font-size:4vw;
            color:#3c3c3c;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            word-wrap: break-word;
            word-break: break-all;
        }
        .userCode{
            display:flex;
            margin-top:0.5vw;
            .distance{
               margin-left:3vw;
               color:#999999;
               font-size:3.24vw;
            }
        }
        .userMsg{
            color:#676767;
            font-size:3.5vw;
            margin-top:0.5vw;
            span:nth-child(1) {
                margin-right:5vw;
            }
        }
        .userMsg2{
                        display:flex;
                        flex-flow: row wrap;
                        color:#676767;
                        font-size:3.5vw;
                        margin-top:0.5vw;
                        width:50vw;
                        span:nth-child(1) {
                            display:inline-block;
                            width:50vw;
                            margin-right:2vw;
                        }
                        span:nth-child(2) {
                            display:inline-block;
                            width:50vw;
                            margin-right:2vw;
                        }
                    }
    }
    .follow{
        width:20vw;
        display:flex;
        margin-right:2vw;
        .child{
            margin:auto;
        }
    }
  }
</style>
