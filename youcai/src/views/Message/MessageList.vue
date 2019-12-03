<template>
  <div class="chatMainPage">
    <div class="messageHead">
      <span class="messageTitle">消息</span>
      <span v-if='$store.state.isZijiren'
            class='broadcast'
            @click="go.name('broadcast')">广播</span>
    </div>
    <div class="helper"
         @click="goHelper"><i class="iconWxiaolu- iconWanwan activityNotice"></i>
      <p class="helperCount"
         v-if="helper && helper.unCountRead">
        {{helper.unCountRead | k}}</p>
    </div>
    <div class="chatMainTop">
      <div class="mainTopOne"
           @click="go.name('message_like')">
        <div class="btnFont fontOne">
          <i class="iconWxin4 iconWanwan activityNotice"></i>
          <span :class="['noReadCount',{specialOne: parseInt(summaryMsg.UnCounttLaC) > 99 &&  parseInt(summaryMsg.UnCounttLaC) < 10000}, {specialTwo: parseInt(summaryMsg.UnCounttLaC) >=10000}]"
                v-if="parseInt(summaryMsg.UnCounttLaC)">{{summaryMsg.UnCounttLaC | k}}</span>
        </div>
        <span class="btnTitle">
          赞和收藏
        </span>
      </div>
      <div class="mainTopOne"
           @click="go.name('message_addFollow')">
        <div class="btnFont fontTwo">
          <i class="iconWtongzhi iconWanwan activityNotice"></i>
          <span :class="['noReadCount',{specialOne: parseInt(summaryMsg.UnCountNotice) > 99 &&  parseInt(summaryMsg.UnCountNotice) < 10000},{specialTwo: parseInt(summaryMsg.UnCountNotice) >=10000}]"
                v-if="parseInt(summaryMsg.UnCountNotice)">{{summaryMsg.UnCountNotice | k}}</span>
        </div>
        <span class="btnTitle">
          通知消息
        </span>
      </div>
      <div class="mainTopOne"
           @click="go.name('message_discuz')">
        <div class="btnFont fontThree">
          <i class="iconWpinglun1 iconWanwan activityNotice"></i>
          <span :class="['noReadCount',{specialOne: parseInt(summaryMsg.UnCountComment) > 99 &&  parseInt(summaryMsg.UnCountComment) < 10000},{specialTwo: parseInt(summaryMsg.UnCountComment) >=10000}]"
                v-if="parseInt(summaryMsg.UnCountComment)">{{summaryMsg.UnCountComment | k}}</span>
        </div>
        <span class="btnTitle">
          评论
        </span>
      </div>
    </div>
    <div class="splitLine"></div>
    <ul class="messageListWrap"
        ref="messageListWrap">
      <li class="noNetwork"
          v-if="!socketStatus"
          @click='replayConnect'>
        <span class="noData">
          <i class="iconWgantanhao iconWanwan activityNotice"></i>
        </span>
        <div class="dataTitle">网络连接不可用<i class="again">点击重新连接</i></div>
      </li>
      <li class="myGroup "
          @click="neabry">
        <span class="groupFont neabryFont">
          <i class="iconWkehuqunzu iconWanwan activityNotice"></i>
        </span>
        <div class="groupTitle">附近群组</div>
      </li>
      <li class="myGroup"
          @click="goMyGroup">
        <span class="groupFont">
          <i class="iconWduoren-copy iconWanwan activityNotice"></i>
        </span>
        <div class="groupTitle">我的群组</div>
      </li>
      <ChatList v-for="(item,index) in sortTopList"
                :key='index'
                :message="item"
                :scrollHeight="scrollHeight"
                :isCanSwiper="isCanSwiper"></ChatList>
      <ChatList v-for="item in sortTimeList"
                :key='item.channelId'
                :message="item"
                :scrollHeight="scrollHeight"
                :isCanSwiper="isCanSwiper"></ChatList>
    </ul>
    <DeleteChat v-if="$store.state.messagePage && $store.state.messagePage.isLongClick"></DeleteChat>
  </div>
</template>

<script>
import ChatList from '@/views/Message/components/ChatList'
import {mapState,mapMutations,mapActions} from 'vuex'
import DeleteChat from '@/views/Message/components/DeleteChat' 
export default {
  data () {
    return {
      isCanSwiper: true,
      scrollHeight: 0, // 滚动高度
      m1 : 0,     // 滚动的值
      m2 : 0,    // 对比时间的值
      timer : null,
      UnCounttLaC: 9999,
    }
  },
  components: {
    ChatList,
    DeleteChat,
  },
  computed: {
    ...mapState('ws',{
        lulu: 'lulu',
        channelList: 'channelList',
        websocket: 'websocket', // 为true表示连接，false表示断开连接
        summaryMsg: 'summaryMsg'
    }),
    noHelperChannelList () {
      return this.channelList.filter((item) => {
        return item.channelId !== this.lulu.userId
      })
    },
    helper () {
      return this.channelList.filter((item) => {
        return item.channelId === this.lulu.userId
      })[0]
    },
    socketStatus(){
      return this.websocket && (this.websocket.readyState == 1)
    },
    sortTopList () { // 设置置顶的列表排序
      if (this.noHelperChannelList.length) {
        let newChannelList = this.noHelperChannelList.filter((item)=> {return item.top === 1})
        let arr = newChannelList.sort(this.sortTwoCate)
        return arr
      } else {
        return this.noHelperChannelList
      }
    },
    sortTimeList () { // 没有置顶的列表，按发送时间排序
      if (this.noHelperChannelList.length) {
        let newChannelList = this.noHelperChannelList.filter((item)=> {return item.top == 0 || item.top == null})
        let arr = newChannelList.sort(this.sortTimeCate)
        return arr
      } else {
        return this.noHelperChannelList
      }
    }
  },
  activated(){
    this.getChannelList()
    if (this.websocket && !this.socketStatus){
      this.connectWebsocket()
    }
  },
  // created (){
  //     this.getChannelList()
  //     if (this.websocket && !this.socketStatus){
  //       this.connectWebsocket()
  //     }
  // },
  mounted () {
    this.$refs.messageListWrap.addEventListener('scroll', this.debounceScroll)
  },
  methods: {
       ...mapMutations('ws', {
       }),
      ...mapActions('ws', {
          joinChannel: 'joinChannel',
          getChannelList: 'getChannelList',
          connectWebsocket: 'connectWebsocket'
      }),
      goHelper () {
        this.go.nameAParams('chatRoom', {
          id: this.lulu.userId,
          type:0,
          name: this.lulu.nickName
      })
      },
      goLike () {
          this.$router.push({name: 'message_like'})
      },
      goFollow () {
          this.$router.push({name: 'message_addFollow'})
      },
          /*
      * 页面跳转函数
      */
      neabry () { // neabry附近人或者群 | 要有 定位 && 登录
        this.$store.commit('updateUserGroup', 2)
        this.go.name('user_Group', ['pos', 'login'])
      },
      goMyGroup () {
        this.$router.push({
          name: 'mailList'
        })
      },
      goDiscuz () {
          this.$router.push({name: 'message_discuz'})
      },
      /**
      * goFindGroup查找群组
      */
      goFindGroup () {
        this.$router.push({name: 'user_Group'})
      },
      debounceScroll (e) {
        this.scrollHeight = e.target.scrollTop // 当前元素滚动距离
        this.isCanSwiper = false
        clearTimeout(this.timer) // 每次滚动前 清除一次
        this.timer = setTimeout(()=>{
          this.resetScroll(e)
        },100)
        this.m1 = e.target.scrollTop
      },
      resetScroll(e){
        this.m2 = e.target.scrollTop
        if(this.m2 == this.m1){
          this.isCanSwiper = true
        }
      },
      replayConnect () { // 重新连接
        this.connectWebsocket()
      },
      sortTwoCate (a,b) {
        if (a['top'] === 1 && b['top'] === 1) {
          a.topTime = a.topTime && a.topTime.replace(/T/g, ' ')
          a.topTime = a.topTime && a.topTime.replace(/Z/g, '')
          b.topTime = b.topTime && b.topTime.replace(/T/g, ' ')
          b.topTime = b.topTime && b.topTime.replace(/Z/g, '')
          let aTime = new Date(a.topTime).getTime()
          let bTime = new Date(b.topTime).getTime()
          if (aTime > bTime) {
            return -1
          } else {
            return 1
          }
        } else {
          if (a['top'] > b['top']) {
            return -1
          } else {
            return 1
          }
        }
      },
      sortTimeCate (a, b) {
        a.createTime = a.createTime && a.createTime.replace(/T/g, ' ')
        a.createTime = a.createTime && a.createTime.replace(/Z/g, '')
        b.createTime = b.createTime && b.createTime.replace(/T/g, ' ')
        b.createTime = b.createTime && b.createTime.replace(/Z/g, '')
        let aTime = new Date(a.createTime).getTime()
        let bTime = new Date(b.createTime).getTime()
        if (aTime > bTime) {
          return -1
        } else {
          return 1
        }
      }
  }
}
</script>

<style lang="less" scoped>
   .chatMainPage{
       width:100vw;
       height:calc(100vh - 12vw);
       overflow: hidden;
       position:fixed;
       top:0;
       left:0;
        .messageHead{
          position: relative;
          width:100vw;
          height:13.34vw;
          background:white;
          font-size:4vw;
          display:flex;
          justify-content: center;
          font-size:0;
         .broadcast{
          position: absolute;
          width: 13.34vw;
          height: 100%;
          top: 0;
          left: 0;
          font-size: 4vw;
          line-height: 13.34vw;
          text-align: center;
         }
         .messageBack{
           display:inline-block;
           height:13.34vw;
           line-height:13.34vw;
           padding-left:7.5vw;
           box-sizing: border-box;
           .activityNotice{
             font-size: 4.5vw;
             font-weight: bold;
           }
         }
         .messageTitle{
           display:inline-block;
           color:#666;
           font-size:4.2vw;
           height:13.34vw;
           line-height:13.34vw;
         }
         .findUser{
           display:inline-block;
           padding-right:4vw;
           box-sizing: border-box;
           height:13.34vw;
           line-height:13.34vw;
           .activityNotice{
             color: #333333;
             font-size: 6vw;
           }
         }
       }
       .helper{
         position: fixed;
         bottom:14vw;
         right:4.5vw;
         z-index:99;
         text-align: center;
         line-height: 11.85vw;
         width:11.85vw;
         height:11.85vw;
         border-radius: 50%;
        //  background:linear-gradient(to right bottom, rgb(253, 128, 209), rgb(250, 118, 213), rgb(252, 112, 223), rgb(252, 112, 218));
         background:white;
         box-shadow: 0 0 10px #ccc;
         .activityNotice{
           color:rgb(255, 40, 66);
           font-size:9vw;
         }
         .helperCount{
            position: absolute;
            font-style: normal;
            top: 0vw;
            right: 0vw;
            height: 4vw;
            line-height: 4vw;
            min-width: 2vw;
            padding: 0 1vw;
            box-sizing: border-box;
            z-index: 100;
            color: white;
            font-size: 3vw;
            &::after{
              content: "";
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate3d(-50%, -50%, 0);
              display: block;
              padding-top: 100%;
              width: 100%;
              height: 0;
              background-color: #ff2742;
              border-radius: 50%;
              z-index: -1;
            }
         }
       }
       .chatMainTop{
         width:100vw;
         height:32.96vw;
         display:flex;
         flex-flow: row nowrap;
         justify-content: space-between;
         padding:0 5.9vw;
         box-sizing: border-box;
         .mainTopOne{
            width:21.30vw;
            height:32.96vw;
            display:flex;
            flex-flow: row wrap;
            justify-content: center;
            font-size:0;
            .btnFont{
                width:11.11vw;
                height:11.11vw;
                border-radius: 2vw;
                color:white;
                margin-top:7.31vw;
                text-align: center;
                line-height: 11.11vw;
                position:relative;
                .noReadCount{
                  position: absolute;
                  right:-3vw;
                  top:-2vw;
                  z-index:22;
                  width:5vw;
                  height:5vw;
                  border-radius: 50%;
                  border:2px solid white;
                  background:rgb(255, 39, 66);
                  color:white;
                  font-size:12px;
                  text-align: center;
                  line-height: 5vw;
                }
                .specialOne{
                  width:6vw;
                  height:6vw;
                  right:-4vw;
                  top:-2.5vw;
                  line-height: 6vw;
                  border:1px solid blue;
                }
                .specialTwo{
                  width:7vw;
                  height:7vw;
                  right:-4vw;
                  top:-2.5vw;
                  line-height: 7vw;
                }
            }
            .fontOne{
              background:rgb(255, 82, 105);
              .activityNotice{
                  color:white;
                  font-size:6vw;
                }
            }
            .fontTwo{
              background:rgb(52, 150, 252);
              .activityNotice{
                  color:white;
                  font-size:7vw;
                }
            }
            .fontThree{
              background:rgb(68, 217, 167);
              .activityNotice{
                  color:white;
                  font-size:6vw;
                }
            }
            .btnTitle{
              width:100%;
              height:6vw;
              font-size:4vw;
              text-align: center;
              margin-top:-2vw;
            }
         }
       }
       .splitLine{
          width:100vw;
          height:2.5vw;
          background:rgb(247, 247, 247);
       }
       .messageListWrap{
         height:calc(100vh - 12vw - 48.8vw);
         overflow-y: scroll;
           .noNetwork{
              display:flex;
              width:100%;
              height:20.37vw;
              background:#fdefec;
              .noData{
                width:20vw;
                height:100%;
                display:flex;
                justify-content: center;
                align-items: center;
                .activityNotice{
                   color:red;
                   font-size:6vw;
                }
              }
              .dataTitle{
                width:80vw;
                height:20.37vw;
                line-height:20.37vw;
                color:#7f7f7f;
                position:relative;
                .again{
                   position:absolute;
                   top:0;
                   right:2vw;
                   height:20.37vw;
                   line-height:20.37vw;
                   font-size:3vw;
                   font-style: normal;
                   color: #969696;
                }
              }
           }
           .myGroup{
              display:flex;
              width:100%;
              height:20.37vw;
              .groupFont{
                  width:20vw;
                  height:100%;
                  display:flex;
                  justify-content: center;
                  align-items: center;
                  .activityNotice{
                      display:inline-block;
                      width:11.85vw;
                      height:11.85vw;
                      border-radius: 50%;
                      text-align: center;
                      line-height:11.85vw;
                      background: rgb(9, 187, 7);
                      color:white;
                      font-size:6vw;
                  }
              }
              .neabryFont{
                .activityNotice{
                  // background:rgb(132, 199, 205);
                  background:linear-gradient(to right bottom, rgb(239, 223, 8), rgb(252, 206, 7), rgb(251, 198, 6),rgb(254, 185, 15));
                }
              }
              .groupTitle{
                   height:20.37vw;
                   line-height:20.37vw;
              }
           }
       }
   }
</style>
