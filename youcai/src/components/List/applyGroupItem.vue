<template>
  <li class="groupMember">
    <div class="userAvator">
      <img :class="{defaultStyle: item.avatar === null || item.avatar === '' || item.avatar === 'http://file.szwanwan.com:8888/group1/M00/00/48/rBpkyFzourOAHyA6AABbcMMe0wc315.png'}"
           :src="item.avatar === null || item.avatar === '' ? defaultAvatar : item.avatar"
           alt="">
    </div>
    <div class="message">
      <div class="userName">
        <span>{{item.nickName === null || item.nickName === '' ? item.name : item.nickName}}</span>
      </div>
      <!-- <div class="userCode"> -->

      <!-- <span class="yellowGenderLabel">
            会员
          </span> -->
      <!-- </div> -->
      <div class="applyGroupName">
        申请加入 {{item.groupName}}
      </div>
      <div class="applyInfo">
        {{item.askRemark}}
      </div>
    </div>
    <div class="btnList">
      <span v-if="applyState === 0"
            class="agree"
            @click.stop="setNewGroupMember(1)"><i>同意</i></span>
      <span v-if="applyState === 0"
            class="notAgree"
            @click.stop><i @click.stop="setNewGroupMember(2)">x</i></span>
      <span class='gray'
            v-if="applyState === 2"><i>已拒绝</i></span>
      <span v-if="applyState === 1"><i>已批准</i></span>
    </div>
  </li>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    item: {
      type: Object,
      default: function () {
        return {}
      }
    },
    showPost: {
      type: Boolean,
      default: true
    },
    isShowFansCount: {
      type: Boolean,
      default: true
    },
    btnType: {
      type: Number,
      default: 0
    },
    groupId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isLoading: false, // 表示是第一次点击
      userInitBirth: this.item.birth,
      defaultAvatar: 'http://webapp.szwanwan.com/img/default/defaultavatar.png',
      applyState: 0
    }
  },
  computed: {
    ...mapState({
      'user': 'user'
    }),
    userAge () {
      if (!this.userInitBirth) {
        return 18
      }
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
    }
  },
  methods: {
    setNewGroupMember (num) {
      let me = this
      if (this.isLoading) {
        return
      }
      this.isLoading = true
      me.api.put({
        url: 'GroupManage',
        data: {
          userGroupAskId: me.item.userGroupAskId,
          askState: num,
        },
        success: function (res) {
          console.log('manage', res)
          me.applyState = num
          me.isLoading = false
        },
        error: function (res) {
          me.isLoading = false
          me.$toast(res)
        },
        complete: function() {
          me.isLoading = false
        }
      })
     
    }
  }
}
</script>
<style lang="less" scoped>
  .groupMember{
    display:flex;
    // align-content: center;
    align-items: center;
    width:100%;
    padding-top:3vw;
    padding-bottom:3vw;
    box-sizing: border-box;
    .blueGenderLabel{
      line-height: 5vw;
      transform: scale(0.8);
      vertical-align: middle;
      margin-right: 0;
      margin-top: 1vw;
    }
    .itemTitle{
      height:10vw;
      line-height: 10vw;
      font-size: var(--mText);
      padding-left: 5vw;
      color: var(--dGray);
    }
    .userAvator{
        box-sizing: border-box;
        margin-left:4vw;
        width:19.2vw;
        height:19.2vw;
        border-radius: 50%;
        border:1px solid rgb(243,243,243);
        overflow: hidden;
        position:relative;
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
        }
        .defaultStyle{
            width:14vw;
            height:14vw;
            border-radius: 0;
            left:1vw;
        }
    }
    .message{
        margin-left:3vw;
        flex: 1;
        .applyGroupName{
          height: 5vw;
          line-height: 5vw;
          font-size: var(--mText);
          color: #000;
          margin: 1vw 0;
        }
        .applyInfo{
            // height: 5.55vw;
            line-height: 5.55vw;
            font-size: 4vw;
            color: var(--lGray);
        }
        .userName{
            // max-width:45vw;
            height: 6.4vw;
            line-height: 6.4vw;
            font-size:4.2vw;
            font-weight: bold;
            color:#000;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            word-wrap: break-word;
            word-break: break-all;
            span{
                display: inline-block;
                vertical-align: top;
            }
        }
        .userCode{
            display:flex;
            margin-top:0.5vw;
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
    .btnList{
      width: 22vw;
      height: 19.2vw;
      line-height: 19.2vw;
      text-align: center;
      display: flex;
      span{
        &.agree{
          flex: 2;
        }
        &.notAgree{
          i{
            border: none;
            font-size: var(--mTitle);
          }
        }
        &.gray{
          color: var(--lGray);
        }
        flex: 1;
        display: inline-block;
        font-size: var(--nText);
        color: var(--mRed);
        height: 19.2vw;
        line-height: 19.2vw;
        i{
          display: inline-block;
          height:5.4vw;
          line-height: 5.4vw;
          padding: 0 2.5vw;
          border: 1px solid currentColor;
          border-radius: 2.7vw;
          font-style: normal;
        }
      }
    }
  }
</style>
