<template>
  <div class="bindPhonePage">
    <div class="afterBindWrap"
         v-if="user.phone">
      <span class="phone">
        <i class="iconWanwan iconWshouji activityNotice"></i>
        <i class="right iconWanwan iconWzhengquecopy"></i>
      </span>
      <p v-if="user.phone">绑定的手机号:{{user.phone}}</p>
    </div>
    <div class="beforeBindWrap" v-if="!user.phone">
    <!-- <div class="beforeBindWrap"> -->
      <span class="bindTitle">绑定手机号,解锁更多新功能,其他的小鹿鹿们都已经绑定手机号啦~</span>
      <div class="phoneBox">
        <div class="boxOne borderB">
          <input type="number"
                 oninput="if(value.length>11)value=value.slice(0,11)"
                 v-model="userPhone"
                 placeholder="请输入手机号码" />
        </div>
        <div class="boxTwo borderB">
          <input type="number"
                 oninput="if(value.length>11)value=value.slice(0,6)"
                 v-model="userCode"
                 placeholder="请输入短信验证码" />
          <span class="codeBtn"
                @click="getCode"
                :class="{loading:phoneCodeLoading,waiting:!!bindCodeWaitTime}">{{phoneCodeMessage}}</span>
        </div>
        <div :class="[{gotoBind:isBegin},{grayB: !isBegin}]"
             @click="gotoBind">
          {{bindState}}
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
export default {
  data () {
    return {
      token: '',
        isBegin: true,
        userPhone: '',
        userCode: '',
        phoneCodeToken: '',
        phoneCodeMessage: '获取验证码',
        phoneCodeLoading: false,
        phoneCodeTimer: null
    }
  },
  computed: {
    ...mapState(['user', 'bindCodeWaitTime']),
    phoneState () {
       let rightRules = /^1[3456789]\d{9}$/
       return rightRules.test(this.userPhone)
    },
    bindState () {
      return this.isBegin ? '去绑定' : '已绑定'
    }
  },
  watch: {
    bindCodeWaitTime (newV, oldV) {
      console.log('打印新知', newV)
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
      setBindWaitCodeTime: 'setBindWaitCodeTime'
    }),
    // 获取验证码
    getCode () {
      let me = this
      if (me.phoneCodeLoading || Math.abs(me.bindCodeWaitTime)) {
          console.log('点不动')
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
          'relate': me.userPhone
        },
        success: function (res) {
          me.phoneCode = ''
          me.setBindWaitCodeTime()
          console.log('打印这个res', res)
          me.token = res.token
        },
        error: function (err) {
          me.$alert(err)
        },
        complete: function () {
          me.phoneCodeLoading = false
        }
      })
    },
    gotoBind () {
      let me = this
      if (!me.isBegin) {
        return me.$toast('已绑定', 1200)
      }
      me.api.process({
        url: 'AccountBand',
        data: {
            token: me.token,
            code: me.userCode
        },
        success: function () {
         me.$toast('绑定成功', 1200)
         me.isBegin = false
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

<style lang="less" scoped>
 .bindPhonePage{
   width:100vw;
   .afterBindWrap{
       width:100%;
       .phone{
           display:inline-block;
           width:100vw;
           text-align: center;
           position:relative;
           .activityNotice{
               font-size:22vw;
               color:rgb(101, 101, 101);
           }
           .right{
             position:absolute;
             bottom:7vw;
             left:50vw;
             width:10vw;
             height:10vw;
             color:white;
             background:rgb(255, 39, 66);
             border-radius: 50%;
             text-align: center;
             line-height: 10vw;
           }
       }
       p{
         width:100vw;
         margin-top:10vw;
         text-align: center;
       }
   }
   .beforeBindWrap{
    width:100vw;
    .bindTitle{
      display:inline-block;
      width:100vw;
      padding:1vw 4vw;
      box-sizing: border-box;
      color:rgb(199, 199, 199);
      background:rgb(250, 250, 250);
    }
    .phoneBox{
      width:80vw;
      margin:auto;
      margin-top:10vw;
      .boxOne{
        width:100%;
        height:15vw;
        display:flex;
        align-items: center;
        input{
            width:70vw;
            height:7vw;
            color:#333;
            border:none;
            outline: none;
        }
      }
      .boxTwo{
        width:100%;
        height:15vw;
        display:flex;
        align-items: center;
        input{
            width:50vw;
            height:7vw;
            color:#333;
            border:none;
            outline: none;
        }
        .codeBtn{
          color:rgb(95, 174, 231);
          display:inline-block;
          margin-left:2vw;
        }
        .loading{
            opacity: 0.2;
        }
        .waiting{
           opacity: 1 !important;
           color: #666 !important; 
        }
      }
      .gotoBind{
        width:67vw;
        height:10vw;
        border-radius: 6vw;
        background:rgb(255, 39, 66);
        color:white;
        margin:auto;
        margin-top:10vw;
        text-align: center;
        font-size:4vw;
        line-height:10vw;
      }
      .grayB{
        background: rgb(250, 250, 250);
        color:117, 117, 117;
      }
    }
   }
 }
</style>