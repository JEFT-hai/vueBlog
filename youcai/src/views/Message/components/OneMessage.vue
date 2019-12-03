<template>
  <div class="messageList" ref="message" @click="reSend">
    <div class="sendTime" v-if="messageDetail.showTime">
      <span class="timeSpan">{{ caculateTime }}</span>
    </div>
    <div class="myMessage" v-if="isMy">
      <MessageType
        :messageDetail="messageDetail"
        :groupIdentify="groupIdentify"
        :setMessage="setMessage"
        :isItemOnly="true"
      ></MessageType>
      <div class="userMessage">
        <Avatar
          :item="sender"
          :size="11"
          :isGroupChat="isGroupChat"
          :groupIdentify="groupIdentify"
        ></Avatar>
      </div>
    </div>
    <div class="otherMessage" v-if="!isMy">
      <div class="userMessage">
        <Avatar
          :item="sender"
          :size="11"
          :isGroupChat="isGroupChat"
          :groupIdentify="groupIdentify"
          :isItemOnly="true"
        ></Avatar>
      </div>
      <MessageType
        :messageDetail="messageDetail"
        :groupIdentify="groupIdentify"
        :setMessage="setMessage"
      ></MessageType>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import MessageType from '@/views/Message/components/MessageType';
import Avatar from '@/components/Avatar';
import { mapState } from 'vuex';
export default {
  components: {
    MessageType,
    Avatar
  },
  props: {
    messageDetail: {
      // 表示当前显示的消息
      type: Object,
      required: true
    },
    groupMember: {
      // 群成员
      type: Array
    },
    setMessage: {
      type: Object
    }
  },
  computed: {
    ...mapState(['user']),
    ...mapState('ws', {
      lulu: 'lulu'
    }),
    // isLulu() {
    //   return (
    //     this.messageDetail && this.messageDetail.senderId !== this.lulu.userId
    //   )
    // },
    isMy() {
      // 发送消息的是否是我自己
      return (
        this.messageDetail && this.messageDetail.senderId === this.user.userId
      )
    },
    // 发送者
    sender() {
      let obj = {
        avatar: this.messageDetail && this.messageDetail.senderAvatar,
        userId: this.messageDetail && this.messageDetail.senderId
      }
      return obj
    },
    caculateTime() {
      let createTime = this.messageDetail.createTime
      // 今天的日期数据
      let today = new Date()
      let tYear = today.getFullYear()
      let tTime = today.getTime()
      let tHours = today.getHours()
      let tMinutes = today.getMinutes()
      let tSeconds = today.getSeconds()
      let tMilliseconds = today.getMilliseconds()
      let date = new Date(new Date(createTime).getTime() - 8 * 60 * 60 * 1000)
      let dDay = date.getDay()
      let dDate = date.getDate()
      let dMonth = date.getMonth() + 1
      let dYear = date.getFullYear()
      let dTime = date.getTime()
      // 一个星期的时间戳
      let weekTime = 6 * 24 * 60 * 60 * 1000
      // 一天时间戳
      let oneDayTime = 1 * 24 * 60 * 60 * 1000
      // 当天时间戳
      let todayTime =
        tHours * 60 * 60 * 1000 +
        tMinutes * 60 * 1000 +
        tSeconds * 1000 +
        tMilliseconds
      if (tTime < dTime) {
        console.log('计算日期大于当前日期！')
        return;
      }
      if (tYear === dYear) {
        // 同年
        if (tTime - dTime <= weekTime) {
          // 同月 并且在一个星期内
          if (tTime - dTime <= oneDayTime + todayTime) {
            // 今天和昨天
            if (tTime - dTime <= todayTime) {
              return (
                this.messageDetail &&
                this.messageDetail.createTime.substring(11, 16)
              )
            } else {
              let str1 = '昨天';
              let str2 =
                this.messageDetail &&
                this.messageDetail.createTime.substring(11, 16)
              return str1 + ' ' + str2
            }
          } else {
            // 两天外
            switch (dDay) {
              case 0:
                dDay = '天';
                break
              case 1:
                dDay = '一';
                break
              case 2:
                dDay = '二';
                break
              case 3:
                dDay = '三';
                break
              case 4:
                dDay = '四';
                break
              case 5:
                dDay = '五';
                break
              case 6:
                dDay = '六';
            }
            let str2 =
              this.messageDetail &&
              this.messageDetail.createTime.substring(11, 16)
            return '星期' + dDay + ' ' + str2
          }
        } else {
          // 不同月 并且不在一个星期内 显示月份
          dMonth = dMonth < 10 ? '0' + dMonth : dMonth
          dDate = dDate < 10 ? '0' + dDate : dDate
          let str2 =
            this.messageDetail &&
            this.messageDetail.createTime.substring(11, 16)
          return dMonth + '-' + dDate + ' ' + str2
        }
      } else {
        // 不同年 显示年份
        let str2 =
          this.messageDetail && this.messageDetail.createTime.substring(11, 16)
        dMonth = dMonth < 10 ? '0' + dMonth : dMonth
        dDate = dDate < 10 ? '0' + dDate : dDate
        return dYear + '-' + dMonth + '-' + dDate + ' ' + str2
      }
    },
    // 是否是群聊
    isGroupChat() {
      if (this.messageDetail.imGroupDetailChatId) {
        return true
      } else {
        return false
      }
    },
    groupIdentify() {
      // 在群里面的身份
      let role = 0
      for (let i = 0; i < this.groupMember.length; i++) {
        if (this.messageDetail) {
          if (this.groupMember[i].userId == this.messageDetail.senderId) {
            role = this.groupMember[i].memberRole
            break;
          } else {
            role = 0
          }
        }
      }
      return role
    }
  },
  methods: {
    ...mapActions('ws', {
      reSendMsg: 'reSendMsg'
    }),
    reSend() {
      // 重新发送的方法
      if (this.messageDetail.state === 0) {
        this.reSendMsg(this.messageDetail)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.messageList {
  width: 100vw;
  padding: 3vw;
  padding-top: 5vw;
  box-sizing: border-box;
  .sendTime {
    width: 100%;
    height: 9vw;
    line-height: 9vw;
    font-size: 3vw;
    text-align: center;
    margin-bottom: 6vw;
    .timeSpan {
      background: rgba(255, 255, 255, 0.7);
      border-radius: 1vw;
      padding: 1vw;
      box-sizing: border-box;
      color: black;
    }
  }
  .myMessage {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    .userMessage {
      margin-left: 3vw;
    }
  }
  .otherMessage {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    // margin-top:4vw;
    //   justify-content: flex-end;
    .userMessage {
      margin-right: 3vw;
    }
  }
}
</style>
