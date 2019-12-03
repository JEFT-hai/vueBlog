<template>
  <li class="chatListWrap"
      ref="liWrap">
    <div :class="['chatListLi',{longBg:isLongClick}, {isTop: message.top === 1}, 'list-item']"
         data-type="0"
         ref="oneChat">
      <div class="chatListBox"
           @touchstart="gotouchstart"
           @touchmove="gotouchmove"
           @touchend="gotouchend">
        <div class="avatarType">
          <span :class="['avatarNotice',{notice: message.type === 'notice'}]"
                v-if="messageContent.type === 'notice'">
            <i :class="['iconWanwan', 'activityNotice',{iconWtongzhi : message.type === 'notice'}]"></i>
          </span>
          <div class="otherAvatar"
               @click.stop="goMessageInner(message)">
            <div class="userAvatar"
                 v-if="message.channelType == 0">
              <Avatar :item='userMessage'
                      :size=118
                      :canClick="false"></Avatar>
            </div>
            <div class="groupAvatar"
                 v-if="message.channelType == '1'">
              <img :src="message.channelAvatar"
                   alt="">
            </div>
          </div>
        </div>
        <div class="messageDetail borderB"
             @click.stop="goMessageInner(message)">
          <div :class="['detailMain',{bigTime: caculateTime.length > 5}]">
            <span class='detailTitle'>
              {{message.channelName}}
            </span>
            <span class='detailContent'>
              <i class="messageLoading iconWzuojiantou iconWanwan"
                 v-if="message.status === 2"></i>
              <i class="messageFail iconWgantanhao1 iconWanwan"
                 v-if="message.status === 0"></i>
              <i v-if="message.channelType">{{message.senderName}}:&nbsp;</i>
              {{showContent}}</span>
          </div>
          <div :class="['detailOther',{detailTime: caculateTime.length > 5}]">
            <span :class="['detailTime',{moreTime: caculateTime.length > 5}]">{{caculateTime}}</span>
            <span class="detailUpdate"
                  v-if="!true"></span>
            <span v-if="message.noInterruption == '1'"
                  class="setInterrupt">
              <i class="iconWxiaoximiandarao iconWanwan activityNotice"></i>
              <i class="inturruptAndCount"
                 v-if="message.noInterruption == '1' && message.unCountRead"></i>
            </span>
            <span :class="['detailCount',{countThree: message.unCountRead > 99 && message.unCountRead <= 999 || message.unCountRead > 9999 && message.unCountRead <= 99999}, {countZone: message.unCountRead <= 0 && !isLongClick},{longBtn: isLongClick && message.unCountRead <= 0}, {isTop: message.top === 1 && message.unCountRead <= 0}]"
                  v-else>{{calaulateCount}}</span>
          </div>
        </div>
      </div>
      <div class="btn-box"
           @touchstart="touchstart($event)"
           @touchmove="touchmove($event)"
           @touchend="touchend($event)">
        <span class="btn btnOne"
              @click="setTop">{{message.top === 1 ? '取消置顶' : '置顶'}}</span>
        <span class="btn btnTwo"
              @click="setRead">{{message.unCountRead ? '标为已读' : '标为未读'}}</span>
        <span class="btn btnThree"
              @click="setDel">删除</span>
      </div>
    </div>
    <!-- <div class="list-item add"></div> -->
  </li>
</template>

<script>
import Avatar from '@/components/Avatar'
import { mapState , mapMutations, mapActions} from 'vuex'
export default {
  data () {
    return {
      timeOutEvent: 0,
      // isLongClick: false, // 表示是长按
      // 滑动删除
      startX: 0, // 初始位置
      endX: 0, // 结束位置

      // 下面是新的
      startPosition: {},
      deltaX: 0,
      endPosition: {},
    }
  },
  components: {
    Avatar
  },
  props: {
    message: {
      type: Object,
      required: true
    },
    scrollHeight: {
      type: Number
    },
    isCanSwiper: {
      type: Boolean
    }
  },
  computed: {
    ...mapState(['messagePage']),
    calaulateCount () {
      if (this.message.unCountRead >= 1000) {
        let newStr = this.message && this.message.unCountRead.toString()
        let str = newStr.substring(0,newStr.length - 3)
        return str + 'k'
      } else {
        return this.message.unCountRead
      }
    },
    messageContent () {
      if (this.message.content) {
         return JSON.parse(this.message.content)
      } else {
        return ''
      }
    },
    caculateTime() {
      if (this.message.status === 0) {
        return '发送失败'
      }
      let createTime = this.message && this.message.createTime
            // 今天的日期数据
            let today = new Date()
            let tYear = today.getFullYear()
            let tTime = today.getTime()
            let tHours = today.getHours()
            let tMinutes = today.getMinutes()
            let tSeconds = today.getSeconds()
            let tMilliseconds = today.getMilliseconds()
            let date = new Date(new Date(createTime).getTime() - 8*60*60*1000)
            let dDay = date.getDay()
            let dDate = date.getDate()
            let dMonth = date.getMonth() + 1
            let dYear = date.getFullYear()
            let dTime = date.getTime()
            // 一个星期的时间戳 
            let weekTime =  6 * 24 * 60 * 60 * 1000
            // 一天时间戳
            let oneDayTime =  1 * 24 * 60 * 60 * 1000
            // 当天时间戳
            let todayTime = tHours * 60 *  60 * 1000 + tMinutes * 60 * 1000 + tSeconds * 1000 + tMilliseconds
            if (tTime < dTime) {
                console.log('计算日期大于当前日期！')
                return
            }
            if (tYear === dYear) {
                // 同年
                if (tTime - dTime <= weekTime) {
                    // 同月 并且在一个星期内
                    if (tTime - dTime <= (oneDayTime + todayTime)) {
                        // 今天和昨天
                        if (tTime - dTime <= todayTime) {
                          return this.message && this.message.createTime.substring(11,16)
                        } else {
                          let str1 = '昨天'
                          let str2 = this.message && this.message.createTime.substring(11,16)
                          return str1 + ' ' + str2
                        } 
                    } else {
                        // 两天外
                        switch (dDay) {
                            case 0: 
                                dDay = '天'
                                break
                            case 1: 
                                dDay = '一'
                                break
                            case 2: 
                                dDay = '二'
                                break
                            case 3: 
                                dDay = '三'
                                break
                            case 4: 
                                dDay = '四'
                                break
                            case 5: 
                                dDay = '五'
                                break
                            case 6: 
                                dDay = '六'
                        }
                        return '星期' + dDay
                    }

                } else {
                    // 不同月 并且不在一个星期内 显示月份
                    dMonth = dMonth < 10 ? '0' + dMonth : dMonth
                    dDate = dDate < 10 ? '0' + dDate : dDate
                    return  dMonth + '-' + dDate
                }
            } else {
                // 不同年 显示年份
                dMonth = dMonth < 10 ? '0' + dMonth : dMonth
                dDate = dDate < 10 ? '0' + dDate : dDate
                return dYear + '-' + dMonth + '-' + dDate
            }
    },
    userMessage () {
      let obj = {
        avatar: this.message && this.message.channelAvatar,
        userId: this.message && this.message.channelId
      }
      return obj
    },
    showContent () {
      if (this.messageContent.type === 'img') {
        return '图片'
      } else if (this.messageContent.type === 'text') {
        return this.messageContent.content
      } else if (this.messageContent.type === 'share') {
        if (this.messageContent.content.content) {
          return this.messageContent.content.content
        } else {
          return '图片'
        }
      } else if (this.messageContent.type === 'warn') {
        return this.messageContent.content.content
      }
      else {
        return ''
      }
    },
    isLongClick () {
      if (this.messagePage.chatId == this.message.channelId) {
        return this.messagePage.isLongClick
      } else {
        return false
      }
    }
  },
  watch: {
    isCanSwiper (val) {
      if (!val) { // 如果处于当前其中一个是左滑动状态，那么在滚动时，就需要复位
        this.restSlide()
      }
    },
    deltaX (newX) {
      if (Math.abs(newX) >= 20) {
        this.restSlide()
      }
    },
  },
  methods: {
    ...mapMutations(['updateMessagePage']),
    ...mapActions('ws',{
      setChannelTop: 'setChannelTop',
      upChannelMsgUnRead: 'upChannelMsgUnRead', // 设置未读
      upChannelMsgRead: 'upChannelMsgRead', // 设置已读
      delChannelItem: 'delChannelItem', // 删除某频道
      getChannelSet: 'getChannelSet' // 获得每一条会话的设置信息
    }),
    setRead () { // 设置未读或者已读
      let obj = {
        channelId: this.message.channelId
      }
      if (this.message.unCountRead) { // 设为已读
        let p = this.upChannelMsgRead(obj)
        p.then(()=>{
          this.restSlide() // 移动复位
        }).catch((error)=>{
          console.log('设置错误', error)
        })
      } else {
        let p = this.upChannelMsgUnRead(obj)
        p.then(()=>{
          this.restSlide() // 移动复位
        }).catch((error)=>{
          console.log('设为未读错误', error)
        })
      }
    },
    setTop () { // 设置置顶或者取消置顶
      let channel = {
        channelId: this.message.channelId
      }
      let top = this.message.top === 1 ? 0 : 1
      let obj = {
        channelId: channel.channelId,
        top
      }
      let p = this.setChannelTop(obj)
      p.then(()=>{
        this.restSlide()
      }).catch((error)=>{
        console.log('设置置顶失败', error)
      })
    },
    setDel () { // 删除聊天
      let obj = {
        channelId: this.message.channelId
      }
      let p = this.delChannelItem(obj)
      p.then(()=>{
        this.restSlide()
      }).catch((error)=>{
        console.log('删除失败', error)
      })
    },
    goMessageInner (channel) {
      if (this.messagePage.isLongClick) {
        return
      }
      let isShare = this.messageContent.type === 'share' ? true : false
      this.go.nameAParams('chatRoom', {
        id:channel.channelId,
        type:channel.channelType,
        share: isShare,
        name: channel.channelName
      })
    },
    // 长按事件
    gotouchstart(e){
      this.restSlide()
      // 记录初始位置
      this.startX = e.touches[0].clientX
      // 之前的
      clearTimeout(this.timeOutEvent) 
      this.timeOutEvent = 0
      this.timeOutEvent = setTimeout(()=>{
          //执行长按要执行的内容，
          // this.isLongClick = true
          let oneChat = this.$refs.oneChat
          let height = oneChat.offsetTop  + document.documentElement.scrollTop
          let obj = {
            isLongClick: true,
            chatId: this.message.channelId,
            height: height,
            scrollHeight: this.scrollHeight, // 滚动条滚动的距离
            top: this.message.top // 表示消息是否置顶
          }
          this.updateMessagePage(obj)
      },600)
    },
    //手释放，如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
    gotouchend(e){
        clearTimeout(this.timeOutEvent)
          if(this.timeOutEvent!=0){
            //这里写要执行的内容（尤如onclick事件）
         }
         if (!this.isCanSwiper) { // 表示不能向左滑动
           return
         }
        // 当前滑动的父级元素
          let parentElement = e.currentTarget.parentElement
          // 记录结束位置
          this.endX = e.changedTouches[0].clientX
          // 左滑
          if ( parentElement.dataset.type == 0 && this.startX - this.endX > 30) {
            this.restSlide()
            parentElement.dataset.type = 1
          }
          // 右滑
          if ( parentElement.dataset.type == 1 && this.startX - this.endX < - 30 ) {
            this.restSlide()
            parentElement.dataset.type = 0
          }
          this.startX = 0
          this.endX = 0
    },
     // 判断当前是否有滑块处于滑动状态
        checkSlide() {
          let listItems = document.querySelectorAll('.list-item')
          for (let i = 0 ; i < listItems.length ; i++) {
            if (listItems[i].dataset.type == 1) {
              return true
            }
          }
          return false
        },
        restSlide() {
          let listItems = document.querySelectorAll('.list-item')
          // 复位
          for ( let i = 0 ; i < listItems.length ; i++) {
            listItems[i].dataset.type = 0
          }
        },
    //如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按 
    gotouchmove(){
        clearTimeout(this.timeOutEvent)
        this.timeOutEvent = 0
    },
    // 删除按钮，置顶按钮操作
    touch (event){ // 以下是touch事件
      event = event || window.event 
      switch (event.type) {
        case 'touchstart': 
          var touch = event.touches[0]
          this.startPosition = {
            x: touch.pageX,
            y: touch.pageY
          }
          break 
        case 'touchend':
          break
        case 'touchmove': 
          touch = event.touches[0]
          this.endPosition = {
            x: touch.pageX,
            y: touch.pageY
          }
          this.deltaX = this.endPosition.x - this.startPosition.x

          break
      }
    }, 
    touchstart (e) {
      this.touch(e)
    },
    touchmove (e) {
      this.touch(e)
    },
    touchend (e ){
      this.touch(e)
    }
  }

}
</script>

<style lang="less" scoped>
.chatListWrap{
  overflow: hidden;
  width:100vw;
}
.chatListLi{
  height:20.37vw;
  position:relative;
  .chatListBox{
    display:flex;
    flex-flow: row nowrap;
    width:100vw;
    height:20.37vw;
    .avatarType{
      width:20vw;
      height:100%;
      display:flex;
      justify-content: center;
      align-items: center;
      .avatarNotice{
          display:inline-block;
          width:11.85vw;
          height:11.85vw;
          border-radius: 50%;
          text-align: center;
          line-height:11.85vw;
          .activityNotice{
              color:white;
              font-size:6vw;
          }
      }
      .notice{
          background:rgb(255, 173, 35);
      }
      .otherAvatar{
          .groupAvatar{
               width:11.85vw;
               height:11.85vw;
               border-radius: 50%;
               overflow: hidden;
               border:1px solid #eee;
               img{
                   width:100%;
                   height:100%;
                   object-fit: cover;
               }
          }
      }
      
    }
    .messageDetail{
            flex:1;
            height:20.37vw;
            display:flex;
            flex-flow: row nowrap;
            .detailMain{
              width:62.54vw;
              height:100%;
              font-size:0;
              display:flex;
              flex-flow: row wrap;
              align-content: center;
              .detailTitle{
                  display:inline-block;
                  width:100%;
                  font-size:4.44vw;
                  font-weight: 500;
              }
              .detailContent{
                  display:inline-block;
                  width:100%;
                  font-size:4vw;
                  color:rgb(159, 159, 159);
                  overflow:hidden;
                  text-overflow:ellipsis;
                  white-space:nowrap;
                  word-wrap: break-word;
                  word-break: break-all;
                  i{
                    font-style:normal;
                  }
                  .messageLoading{
                    font-size:3vw;
                    margin-right:1vw;
                  }
                  .messageFail{
                    font-size:3vw;
                    color:red;
                    margin-right:1vw;
                  }
              }
            }
            .bigTime{
              width:56.54vw;
            }
            .detailOther{
                width:15vw;
                height:100%;
                display:flex;
                flex-flow: row wrap;
                justify-content: flex-end;
                align-content: center;
                .detailTime{
                    display:inline-block;
                    color:rgb(150, 150, 150);
                    width:100%;
                    text-align: right;
                    font-size:3.5vw;
                }
                .moreTime{
                  font-size:3vw;
                }
                .detailUpdate{
                  width:2.68vw;
                  height:2.68vw;
                  background:rgb(248, 36, 56);
                  border-radius: 50%;
                }
              .setInterrupt{
                .activityNotice{
                  font-size:3.7vw;
                  color:rgb(164, 164, 164);
                }
                .inturruptAndCount{
                  display:inline-block;
                  width:2vw;
                  height:2vw;
                  border-radius: 50%;
                  background:rgb(255, 39, 66);
                  margin-left:2vw;
                }
              }
              .detailCount {
                  display:inline-block;
                  width:5vw;
                  height:5vw;
                  border-radius:50%;
                  background:rgb(248, 36, 56);
                  color:white;
                  font-size:12px;
                  text-align: center;
                  line-height:5vw;
              }
              .countThree{
                  width:7vw;
                  height:7vw;
                  line-height:7vw;
              }
              .countZone{
                background:white;
              }
              .isTop{
                background:rgb(242, 242, 242);
                color:rgb(242, 242, 242);
              }
              .longBtn{
                background:rgb(227, 227, 227) !important;
                color:rgb(227, 227, 227) !important;
              }
              

            }
            .detailTime{
              width:20vw;
            }
      }
  }
  .btn-box {
    height:100%;
    position: absolute;
    top: 0;
    right: -70vw;
    font-size:0;
    .btn {
      display: inline-block;
      width:23.33vw;
      height:20.37vw;
      text-align: center;
      line-height:20.37vw;
      color:white;
      font-size:4.3vw;
    }
    .btnOne{
      background:#c8c7cd;
    }
    .btnTwo{
      background:#fe9d00;
    }
    .btnThree {
      background:#fe3c30;
    }
  }
}
.longBg{
  background:rgb(227, 227, 227) !important;
}
.isTop{
  background: rgb(242, 242, 242);
}
  .list-item {
    position: relative;
    -webkit-transition: transform 0.2s;
    transition: transform 0.5s;
  }
  .list-item[data-type='0'] {
    transform: translate3d(0,0,0);
  }
  .list-item[data-type="1"]{
    transform: translate3d(-70vw,0,0);
  }
</style>
