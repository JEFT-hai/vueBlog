<template>
  <div class="chatRoomPage">
    <span class="chatTitle" ref="chatTitle">{{ name }}</span>
    <span class="chatSeting" @click="goSetting">...</span>
    <div class="mainContent" ref="mainContent">
      <div
        :class="[{ toTop: toTop }, 'chatList']"
        :style="backColor"
        ref="chatList"
      >
        <scroll
          ref="scroll"
          :startY="parseInt(startY)"
          :pullDownRefresh="pullDownRefreshObj"
          :pullUpLoad="pullUpLoadObj"
          @pullingDown="onPullingDown"
          :data="currentChannel.msg"
          :bounce="bounce"
        >
          <OneMessage
            ref="message"
            v-for="(item, index) in currentChannel.msg"
            :key="index"
            :messageDetail="item"
            :groupMember="groupMember"
            :setMessage="setMessage"
          ></OneMessage>
        </scroll>
      </div>
      <div :class="[{ toTop: inputTop }, 'chatInputWrap']" ref="chatInputWrap">
        <div class="chatInput">
          <div class="btnWrap">
            <span class="getImage getBtn">
              <i class="iconWzhaopian iconWanwan activityNotice">
                <input
                  type="file"
                  @change="upImage"
                  accept="image/png, image/jpeg, image/gif, image/jpg"
                />
              </i>
            </span>
            <span
              class="getEmoji getBtn"
              ref="emojiBtn"
              @click="toggleEmojiShow()"
            >
              <i
                :class="[
                  emojiShow ? 'iconWjianpan' : 'iconWemoji_icon',
                  'iconWanwan',
                  'activityNotice'
                ]"
              ></i>
            </span>
          </div>

          <div class="inputWrap">
            <textarea
              class="textarea"
              v-model="channelMsg.content"
              v-grow-height="0"
              ref="inputInner"
              placeholder="发送消息"
              @focus="inputFocus"
              @blur="blur"
              @keyup.enter="submit"
            />
            <button @click="submit" class="send">
              <i class="iconWjiantou-copy iconWanwan activityNotice"></i>
            </button>
          </div>
        </div>
        <emoji
          v-if="emojiShow"
          v-click-outside="hide"
          @insert="insert"
          @del="del"
        ></emoji>
      </div>
    </div>
  </div>
</template>

<script>
import emojis from '@/assets/js/emojis';
import emoji from '@/components/emoji/emoji';

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import scroll from '@/components/scroll/scroll';
import scrollMixin from '@/components/scroll/scrollMixin';
import OneMessage from '@/views/Message/components/OneMessage';

export default {
  mixins: [scrollMixin],
  components: {
    scroll,
    OneMessage,
    emoji
  },
  data() {
    return {
      backColor: {},
      cursorP: 0,
      startY: 0,
      bounce: { top: true, bottom: false },
      pullDownRefresh: true,
      pullUpLoadTxt: '加载成功',
      pullUpLoad: false,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '上拉加载',
      channelMsg: {
        type: 'text',
        content: ''
      },
      busy: false,
      groupMember: [],
      setMessage: {
        bg: null,
        channelSetId: '',
        noInterruption: 0,
        top: 0,
        topTime: ''
      },
      emojiShow: false,
      toTop: false,
      inputTop: false,
      isToggle: false,
      emojis: emojis
    }
  },
  computed: {
    ...mapState(['user']),
    ...mapState('ws', {
      lulu: 'lulu',
      currentChannel: 'currentChannel',
      websocket: 'websocket'
    }),
    ...mapGetters('ws', {
      getWebsocket: 'getWebsocket'
    }),
    channelId() {
      return this.$route.params.id
    },
    channelType() {
      return this.$route.params.type
    },
    groupId() {
      if (this.channelType == 1) {
        return this.$route.params.id
      } else {
        return '';
      }
    },
    name() {
      return this.$route.params.name
    },
    prevContent() {
      return this.channelMsg.content.slice(0, this.cursorP)
    },
    nextContent() {
      return this.channelMsg.content.slice(
        this.cursorP,
        this.channelMsg.content.length
      )
    }
  },
  watch: {
    channelId: {
      immediate: true,
      handler(newV) {
        this.setCurrentChannel({
          channelId: newV,
          channelType: parseInt(this.channelType),
          msg: [],
          set: {}
        })
        this.getUnReadMsg().then(() => {
          this.$nextTick(() => {
            setTimeout(() => {
              this.toBottom()
              this.$refs.scroll && this.$refs.scroll.forceUpdate()
            }, 100)
          })
        })
      }
    },
    currentChannel: {
      immediate: true,
      deep: true,
      handler(newV, oldV) {
        if (newV) {
          this.setMessage.bg = newV.set && newV.set.bg
          if (this.setMessage.bg) {
            this.backColor = {
              background: `url(${this.setMessage.bg})`,
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed',
              backgroundPosition: 'center',
              backgroundSize: 'cover'
            }
            this.setMessage.channelSetId = newV.set && newV.set.channelSetId
            this.setMessage.noInterruption = parseInt(
              newV.set && newV.set.noInterruption
            )
            this.setMessage.top = newV.set && newV.set.top
            this.setMessage.topTime = newV.set && newV.set.topTime
          }
          if (
            oldV &&
            oldV.msg &&
            oldV.msg.length &&
            oldV.msg[oldV.msg.length - 1] === newV.msg[newV.msg.length - 1]
          ) {
            // 表示是刷新不用到底部
            return
          } else {
            // 表示是不是刷新，需要到底部
            this.$nextTick(() => {
              setTimeout(() => {
                if (this.testToBottom()) {
                  this.toBottom()
                }
              }, 300)
            })
          }
        }
      }
    },
    'channelMsg.content': {
      handler: function(newV, oldV) {
        this.cursorP = this.cursorP - oldV.length + newV.length
        if (newV.length > 200) {
          this.$toast('每次输入最多200字', 800)
          return oldV
        }
        return this.Utility.htmlEncode(newV)
          .replace(/\r?\n/g, '')
          .replace(/\n/g, '')
          .replace(/\r/g, '')
      }
    }
  },

  beforeCreate() {
    if (parseInt(this.$route.params.type) === 1) {
      let me = this
      me.api.get({
        url: `GroupMember?GroupId=${this.$route.params.id}`,
        success: function(res) {
          me.groupMember = res
          me.$nextTick(() => {
            me.$store.dispatch('ws/insertForm', {
              formName: 'user',
              keys: ['avatar', 'nickName', 'userId'],
              arr: res
            })
          })
        }
      })
    }
  },
  beforeRouteLeave(to, from, next) {
    this.leaveCurrentChannel()
    next()
  },
  mounted() {
    let obj = {
      channelId: this.currentChannel && this.currentChannel.channelId
    }
    this.getChannelSet(obj)
    window.isInAndroid && window.WanAndroid.imgCropType(6, 1)
    this.testHelper()
  },
  beforeDestroy() {
    window.isInAndroid && window.WanAndroid.imgCropType(0)
  },
  directives: {
    'click-outside': {
      bind(el, binding, vNode) {
        if (typeof binding.value !== 'function') {
          return
        }
        const bubble = binding.modifiers.bubble
        const handler = e => {
          if (bubble || (!el.contains(e.target) && el !== e.target)) {
            binding.value(e)
          }
        }
        el.__vueClickOutside__ = handler
        document.addEventListener('click', handler)
      },
      unbind(el, binding) {
        document.removeEventListener('click', el.__vueClickOutside__)
        el.__vueClickOutside__ = null
      }
    }
  },
  methods: {
    ...mapMutations({
      setNavTit: 'setNavTit'
    }),
    ...mapMutations('ws', {
      setCurrentChannel: 'setCurrentChannel'
    }),
    ...mapActions('ws', {
      onMessage: 'onMessage',
      leaveCurrentChannel: 'leaveCurrentChannel',
      sendMsg: 'sendMsg',
      sendMsgRead: 'sendMsgRead',
      getChannelLocalMsg: 'getChannelLocalMsg',
      getUnReadMsg: 'getUnReadMsg',
      sendImgMsg: 'sendImgMsg',
      setChannelBg: 'setChannelBg',
      testHasOtherMsg: 'testHasOtherMsg',
      getChannelSet: 'getChannelSet' // 获得设置的信息
    }),
    testHelper() {
      if (this.currentChannel.channelId !== this.lulu.userId) {
        console.log(
          '不是助手',
          this.currentChannel.channelId,
          this.lulu.userId
        )
        return;
      } else {
        console.log(this.currentChannel)
        this.$nextTick(() => {
          setTimeout(() => {
            if (!this.currentChannel.msg.length) {
              this.onMessage({
                Content: JSON.stringify({
                  type: 'text',
                  content: '你好，我是多录小助手，有任何问题都可以问我哦~'
                }),
                ImChatId: '20ea9e26-0cb4-457c-bb7f-88290c85c30a',
                CreateTime: '2019-11-11T15:59:50.7947925Z',
                ReceiverId: this.user.userId,
                SenderId: '20ea9e26-0cb4-457c-bb7f-88290c85c30a',
                channelId: '20ea9e26-0cb4-457c-bb7f-88290c85c30a',
                mt: 4
              })
            }
          }, 300)
        })
      }
    },
    hide(e) {
      if (this.$refs.emojiBtn.contains(e.target)) {
        return
      }
      if (this.emojiShow) {
        this.toggleEmojiShow()
      }
    },
    onPullingDown() {
      this.getChannelLocalMsg({
        refresh: false
      })
    },
    inputFocus() {
      this.toBottom()
      if (this.emojiShow) {
        this.toggleEmojiShow()
      }
    },
    submit(e) {
      if (this.busy) {
        return
      }
      let sendContent = this.channelMsg
      if (!sendContent.content.trim()) {
        this.$toast('不能发送空白内容')
        return;
      }
      this.busy = true
      this.$set(
        this.channelMsg,
        'content',
        this.Utility.htmlEncode(this.channelMsg.content)
          .replace(/\r?\n/g, '')
          .replace(/\n/g, '')
          .replace(/\r/g, '')
      )
      this.sendMsg({
        receiverId: this.channelId,
        content: JSON.stringify(this.channelMsg),
        channelType: this.channelType
      })
        .then(() => {
          this.$refs.inputInner.style.height = '22px';
          this.channelMsg.content = '';
          this.busy = false
        })
        .catch(() => {
          this.channelMsg.content = '';
          this.$nextTick(() => {
            this.toBottom()
          })
          this.busy = false
        })
    },
    upImage(e) {
      if (this.busy) {
        return
      }
      let me = this
      this.busy = true
      if (e.target.files[0].type.indexOf('image') >= 0) {
        // 确认是图片
        me.sendImgMsg({
          e: e,
          receiverId: this.channelId,
          channelType: this.channelType
        })
          .then(() => {
            e.target.value = '';
            this.$nextTick(() => {
              this.toBottom()
            })
            this.busy = false
          })
          .catch(() => {
            e.target.value = '';
            this.$nextTick(() => {
              this.toBottom()
            })
            this.busy = false
          })
      }
    },
    goSetting() {
      // 去到设置页面
      if (this.currentChannel.channelType === 0) {
        this.$router.push({
          name: 'userChatSettings',
          params: {
            id: this.currentChannel.channelId,
            isMute: this.setMessage.noInterruption, // 1 表示免打扰 0 没有免打扰默认设置
            isTop: this.setMessage.top // 1表示置顶  0表示没有置顶
          }
        })
      } else {
        this.$router.push({
          name: 'groupChatSettings',
          params: {
            id: this.currentChannel.channelId,
            isMute: this.setMessage.noInterruption, // 1 表示免打扰 0 没有免打扰默认设置
            isTop: this.setMessage.top // 1表示置顶  0表示没有置顶
          }
        })
      }
    },
    toBottom() {
      this.scrollToBottom()
    },
    testToBottom() {
      if (this.$refs.scroll.scroll.maxScrollY < -1) {
        return true
      } else {
        let innerHeight = 0
        if (this.$refs.message && this.$refs.message.length) {
          for (let i = 0; i < this.$refs.message.length; i++) {
            innerHeight += this.$refs.message[i].$refs.message.offsetHeight
          }
        }
        if (innerHeight > this.$refs.scroll.scroll.scrollerHeight) {
          return true
        }
      }
      return false
    },
    /*
     * 以下是表情逻辑
     */
    blur(e) {
      let Sel = 0
      if (document.selection) {
        Sel = document.selection.createRange()
      } else {
        Sel = e.target.selectionStart
      }
      this.cursorP = Sel
    },
    toggleEmojiShow() {
      let wW = document.documentElement.clientWidth
      this.emojiShow = !this.emojiShow
      if (this.emojiShow) {
        // 显示表情
        this.isToggle = true
        if (this.$refs.scroll.scroll.maxScrollY < -1) {
          this.toTop = true
        } else {
          let innerHeight = 0
          if (this.$refs.message && this.$refs.message.length) {
            for (let i = 0; i < this.$refs.message.length; i++) {
              innerHeight += this.$refs.message[i].$refs.message.offsetHeight
            }
          }
          if (
            innerHeight + wW * 0.67 >
            this.$refs.scroll.scroll.scrollerHeight
          ) {
            let fall = parseInt(
              this.$refs.scroll.scroll.scrollerHeight -
                (innerHeight + wW * 0.67)
            )
            this.$set(
              this.backColor,
              'transform',
              `translate3d(0, ${fall}px, 0)`
            )
          }
        }
        // this.inputTop = true
        this.isToggle = false
      } else {
        this.toTop = false
        this.inputTop = false
        this.$set(this.backColor, 'transform', '')
      }
    },
    insert(data) {
      this.channelMsg.content = this.prevContent + data + this.nextContent
    },
    async del() {
      if (!this.prevContent || !this.prevContent.length) {
        return
      } else if (this.prevContent.length === 1) {
        this.channelMsg.content =
          this.prevContent.slice(0, this.prevContent.length - 1) +
          +this.nextContent
      } else {
        let isEmoji = await this.complete()
        let sliceNum = isEmoji ? 2 : 1
        this.channelMsg.content =
          this.prevContent.slice(0, this.prevContent.length - sliceNum) +
          this.nextContent
      }
    },
    complete() {
      let substring = this.prevContent.slice(-2)
      for (let i = 0; i < substring.length; i++) {
        let hs = substring.charCodeAt(i)
        if (0xd800 <= hs && hs <= 0xdbff) {
          if (substring.length > 1) {
            let ls = substring.charCodeAt(i + 1)
            let uc = (hs - 0xd800) * 0x400 + (ls - 0xdc00) + 0x10000
            if (0x1d000 <= uc && uc <= 0x1f77f) {
              return true
            }
          }
        } else if (substring.length > 1) {
          let ls = substring.charCodeAt(i + 1)
          if (ls == 0x20e3) {
            return true
          }
        } else {
          if (0x2100 <= hs && hs <= 0x27ff) {
            return true
          } else if (0x2b05 <= hs && hs <= 0x2b07) {
            return true
          } else if (0x2934 <= hs && hs <= 0x2935) {
            return true
          } else if (0x3297 <= hs && hs <= 0x3299) {
            return true
          } else if (
            hs == 0xa9 ||
            hs == 0xae ||
            hs == 0x303d ||
            hs == 0x3030 ||
            hs == 0x2b55 ||
            hs == 0x2b1c ||
            hs == 0x2b1b ||
            hs == 0x2b50
          ) {
            return true
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.chatRoomPage {
  .chatTitle {
    position: fixed;
    top: 0vw;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 50vw;
    height: 13.34vw;
    text-align: center;
    line-height: 13.34vw;
    z-index: 100;
  }
  .chatSeting {
    position: fixed;
    top: 0vw;
    right: 0;
    margin: 0 auto;
    width: 15vw;
    height: 13.34vw;
    text-align: center;
    line-height: 11.34vw;
    z-index: 100;
    font-size: 5vw;
    font-weight: bolder;
  }
  .mainContent {
    width: 100vw;
    height: calc(100vh - 13.34vw);
    background: rgb(245, 245, 245);
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
    .chatList {
      height: calc(100vh - 27.78vw);
      transition: all 0.35s ease-in-out;
      background-position: center;
      background-size: cover;
    }
    .toTop {
      transform: translate3d(0, -67vw, 0);
      // height: calc(100vh - 26.78vw - 67vw);
    }
    .chatInputWrap {
      min-height: 14.44vw;
      width: 100vw;
      position: fixed;
      z-index: 1000;
      bottom: 0;
      left: 0;
    }
    .chatInput {
      position: relative;
      min-height: 14.44vw;
      display: flex;
      //    flex-flow: row nowrap;
      //    justify-content: space-around;
      align-items: center;
      background-color: #f5f5f5;
      .btnWrap {
        position: absolute;
        left: 0;
        bottom: 0;
        height: 14.44vw;
        width: 28vw;
        //    line-height: 14.44vw;
        display: flex;
        align-items: center;
        justify-content: space-around;
      }
      .getBtn {
        display: inline-block;
        width: 11.3vw;
        height: 11.3vw;
        border-radius: 50%;
        border: 1px solid rgb(208, 208, 208);
        // margin-right:2vw;
        text-align: center;
        line-height: 12vw;
        .activityNotice {
          font-size: 7vw;
          font-weight: 500;
          color: rgb(41, 41, 41);
        }
        &.getImage {
          position: relative;
          input {
            position: absolute;
            opacity: 0;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
          }
        }
      }
      .inputWrap {
        // height:10vw;
        width: 68vw;
        margin-left: 30vw;
        display: flex;
        justify-content: space-between;
        align-items: center;
        // padding:0 4vw;
        // margin-bottom: 1vw;
        box-sizing: border-box;
        .textarea {
          flex: 1;
          display: flex;
          align-items: center;
          height: 20px;
          line-height: 24px;
          padding: 2vw 10vw 2vw 4vw;
          margin-bottom: 1vw;
          font-size: 4.5vw;
          border: none;
          outline: none;
          border: 1px solid rgb(208, 208, 208);
          border-radius: 20px;
          background: rgb(245, 245, 245);
          box-sizing: content-box;
        }
        input::-webkit-input-placeholder,
        textarea::-webkit-input-placeholder {
          color: rgb(205, 205, 205);
        }
        .send {
          position: absolute;
          z-index: 100;
          bottom: 3.6vw;
          right: 3.3vw;
          display: inline-block;
          width: 7.4vw;
          height: 7.4vw;
          background: rgb(57, 166, 249);
          color: white;
          border: none;
          outline: none;
          border-radius: 50%;
          margin-top: -1px;
        }
      }
    }
  }
}
</style>
