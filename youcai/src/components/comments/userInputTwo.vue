<template>
  <div class='userCommentInputPage'>
    <div class='userCommentInputMask'
         @click.prevent='hideUserInput'></div>
    <div class='userCommentInputBottom'>
      <div class='userCommentInputWrap'>
        <textarea ref='twoTextArea'
                  v-grow-height="0"
                  maxlength="256"
                  class='textarea'
                  v-model='twoTextArea'
                  type='submit'
                  @keyup.enter='twoSend'
                  :placeholder="placeholder" />
        <i :class="['iconWanwan', showEmoji?'iconWjianpan':'iconWbiaoqing', 'emojiBtn']" @click="toggleEmoji()"></i>
        <div class="sendUserComment" @click="twoSend">
          <span>
            发送
          </span>
        </div>
      </div>
      <div class='emojiPanel' v-show="showEmoji">
        <ul class='emojiList'>
          <li v-for="(item, index) in emojis" :key="index" @click="chooseEmoji(item)">
            <img :src="item.src">
          </li>
        </ul>
        <ul class="emojiTabList borderT">
          <li class="curTab">
            <img src="emoji/0.gif" >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  props: {
    objectId: {
      type: String,
      required: false
    },
    toUser: {
      type: String,
      required: false
    },
    type: {
      type: Number,
      required: false,
      default: 0
    },
    placeholder: {
      type: String,
      required: false,
      default: '评论一下吧...'
    },
    userInputContent: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isLoading: false,
      twoTextArea: this.userInputContent,
      emojis: window.emojis,
      showEmoji: false
    }
  },
  mounted () {
    this.$refs.twoTextArea.focus()
    console.log('replayConfirm是', this.replayConfirm)
  },
  watch: {
    twoTextArea (newV, oldV) {
      if (newV.length < oldV.length) { // 删除
        let end = oldV.match(/(\[\w*\])$/g) && oldV.match(/(\[\w*\])$/g)[0].replace('[', '').replace(']', '')
        let isEmoji = this.emojis.filter((item, index) => {
          return item.name === end
        })
        if (isEmoji.length) {
          this.twoTextArea = oldV.replace(/(\[\w*\])$/g, '')
        } else {
          return newV
        }
      } else {
        return newV
      }
    }
  },
  computed: {
    ...mapState(['replayConfirm']),
    userAvatar () {
      return this.$store.state.user.avatar || '/assets/images/avatar.jpg'
    },
    userName () {
      return this.$store.state.user.nickName
    }
  },
  methods: {
    toggleEmoji () {
      this.showEmoji && this.$refs.twoTextArea.focus()
      !this.showEmoji && this.$refs.twoTextArea.blur()
      this.$nextTick(() => {
        this.showEmoji = !this.showEmoji
      })
    },
    chooseEmoji (item) {
      if (item.name !== '删除') {
        this.twoTextArea += '[' + item.name + ']'
      } else {
        if (this.twoTextArea) {
          this.twoTextArea = this.twoTextArea.slice(0, -1)
        }
      }
    },
    hideUserInput () {
      this.$emit('hideUserInput', this.twoTextArea)
    },
    twoSend () {
      let me = this
      if (this.isLoading) {
        return
      }
      this.isLoading = true
      // return
      if (!this.$store.getters.hasBaseInfo()) {
        this.showConfirm.toPersonal()
        return
      }
      if (me.twoTextArea.replace(/\s+/g, '') === '') {
        me.$toast('评论内容不能为空！')
        return
      } else if (me.twoTextArea.length >= 256) {
        me.$toast('评论内容过长！')
        return
      }
      let data = {
        objectId: me.objectId,
        objectType: me.type,
        content: me.twoTextArea,
        parentCommentId: me.replayConfirm.commentId,
        previousUserId: me.replayConfirm.userId
      }
      if (me.replayConfirm.type === 3) { // 表示三级评论
        data.parentCommentId =  me.replayConfirm.parentCommentId
        data.childParentCommentId = me.replayConfirm.childParentCommentId
      }
      if (this.toUser) {
        data.parentCommentId = this.toUser
      }
      me.$uploading(false, '提交中')
      me.api.process({
        url: 'Comment',
        data: data,
        success: function (res) {
          me.isLoading = false
          if (me.replayConfirm.type == 3) {
            console.log('我是三啊')
            me.$emit('updateComments', {
              commentId: res,
              avatar: me.$store.state.user.avatar,
              userId: me.$store.state.user.userId,
              content: me.twoTextArea,
              objectId: me.objectId,
              objectType: me.type,
              createTime: new Date(),
              nickName: me.userName,
              parentCommentId: me.replayConfirm.parentCommentId,
              childParentCommentId: me.replayConfirm.childParentCommentId,
              isLike: false,
              countLike: 0,
              nickNameSe: me.replayConfirm.nickName,
              userIdSe:me.replayConfirm.userId
            })
          } else {
            console.log('我是二')
            me.$emit('updateComments', {
              // commentId: res,
              avatar: me.$store.state.user.avatar,
              userId: me.$store.state.user.userId,
              content: me.twoTextArea,
              objectId: me.objectId,
              objectType: me.type,
              createTime: new Date(),
              nickName: me.userName,
              commentIdSe: me.replayConfirm.commentId,
              commentId: res,
              isLike: false,
              countLike: 0,
            })
          }
          
          me.twoTextArea = ''
        },
        error: function (err) {
          me.$error(true, err)
        },
        complete: function() {
          me.isLoading = false
        }
      })
    }
  }
}
</script>
<style lang="less">
.userCommentInputPage{
  position: fixed;
  width: 100vw;
  height: 100vh;
  bottom: 0;
  left: 0;
  z-index: 20000;
  .userCommentInputMask{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: transparent;
    z-index: 100;
  }
  .userCommentInputBottom{
    position: absolute;
    width:100vw;
    height: auto;
    bottom: 0;
    left: 0;
    background: #fff;
    z-index: 200;
    .emojiPanel{
      width: 100vw;
      img{
        display: inline-block;
        vertical-align: middle;
      }
      .emojiList{
        box-sizing: border-box;
        width: 100vw;
        padding: 3vw;
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        li{
          width: 13vw;
          height: 18vw;
          line-height: 18vw;
          text-align: center;
          // flex: 1;
          img{
            font-size: 0;
            width: 10vw;
            height: 10vw;
          }
        }
      }
      .emojiTabList{
        position: relative;
        height: 9vw;
        line-height: 9vw;
        li.curTab{
          background: #d9d9d9;
        }
        li{
          display: inline-block;
          vertical-align: top;
          width: 15.7vw;
          height: 9vw;
          text-align: center;
          img{
            width: 8vw;
            height: 8vw;
            margin-bottom: 0.5vw;
          }
        }
      }
    }
  }
  .userCommentInputWrap{
    position: relative;
    width: 100vw;
    padding: 2vw 0;
    display: flex;
    background: #fff;
    .textarea{
      flex: 1;
      color: #5f5f5f;
      height: 5vw;
      line-height: 5vw;
      border-radius: 5vw;
      border: 1px solid #9d9d9d;
      padding:2vw 11vw 2vw 3vw;
      margin-left: 2.8vw;
      // box-sizing: border-box;
      font-size: var(--mText);
      outline: 0 none;
      overflow-y: hidden;
      resize: none;
      word-break: break-all;
    }
    .emojiBtn {
      position: absolute;
      bottom: 2vw;
      right: 13.9vw;
      text-align: center;
      width: 12vw;
      height: 9vw;
      line-height: 9vw;
      font-size: 5vw;
    }
    .sendUserComment{
      position: relative;
      width: 13.9vw;
      text-align:center;
      font-size: var(--title);
      color: #909090;
      vertical-align: text-bottom;
      span{
        position: absolute;
        width: 100%;
        bottom: 0;
        right: 0;
        height: 9vw;
        line-height: 9vw;
      }
    }
  }
}
</style>
