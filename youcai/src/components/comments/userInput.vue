<template>
  <div class='userCommentInputPage'>
    <div class='userCommentInputMask'
         @click.prevent='hideUserInput'></div>
    <div class='userCommentInputBottom'>
      <div class='userCommentInputWrap'>
        <textarea ref='textareaInput'
                  v-grow-height="0"
                  maxlength="256"
                  class='textarea'
                  v-model='textareaInput'
                  type='submit'
                  @focus='hideEmoji'
                  @blur='blur'
                  @keyup.enter='sendComments'
                  :placeholder="placeholder" />
        <i ref='emojiBtn' :class="['iconWanwan', showEmoji?'iconWjianpan':'iconWbiaoqing', 'emojiBtn']" @click="toggleEmoji()"></i>
        <div class="sendUserComment" @click="sendComments">
          <span>
            发送
          </span>
        </div>
      </div>
      <emoji v-if='showEmoji'
               v-click-outside="hideEmoji"
               @insert="insert"
               @del='del'></emoji>
    </div>
  </div>
</template>
<script>
import emojis from '@/assets/js/emojis'
import emoji from '@/components/emoji/emoji'

export default {
  components: {
    emoji
  },
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
      cursorP: 0,
      isLoading: false, 
      textareaInput: this.userInputContent,
      emojis: window.emojis,
      showEmoji: false
    }
  },
  mounted () {
    this.$refs.textareaInput.focus()
  },
  watch: {
    textareaInput (newV, oldV) {
      this.cursorP = this.cursorP - oldV.length + newV.length
      if (newV.length > 200){
          this.$toast('每次输入最多200字', 800)
          return oldV
      }
    }
  },
  computed: {
    userAvatar () {
      return this.$store.state.user.avatar || '/assets/images/avatar.jpg'
    },
    userName () {
      return this.$store.state.user.nickName
    },
    prevContent(){
        return this.textareaInput.slice(0, this.cursorP)
    },
    nextContent(){
        return this.textareaInput.slice(this.cursorP, this.textareaInput.length)
    }
  },
  directives: {
        'click-outside': {
            bind(el, binding, vNode) {
                if (typeof binding.value !== 'function') {
                    return
                }
                const bubble = binding.modifiers.bubble
                const handler = (e) => {
                    if (bubble || (! el.contains(e.target) && el !== e.target)) {
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
    blur(e){
      let Sel = 0
      if (document.selection) {
          Sel = document.selection.createRange()
      } else {
          Sel = e.target.selectionStart
      }
      this.cursorP = Sel
    },
    insert (data) {
        this.textareaInput = this.prevContent + data + this.nextContent
    },
    async del () {
        if (!this.prevContent || !this.prevContent.length){
            return
        } else if(this.prevContent.length === 1){
            this.textareaInput = this.prevContent.slice(0, this.prevContent.length-1) + + this.nextContent
        } else {
            let isEmoji = await this.complete()
            let sliceNum = isEmoji ? 2 : 1
            this.textareaInput = this.prevContent.slice(0, this.prevContent.length-sliceNum) + this.nextContent
        }
    },
    complete (){
        let substring = this.prevContent.slice(-2)
        for (let i = 0; i < substring.length; i++) {
            let hs = substring.charCodeAt(i)
            if (0xd800 <= hs && hs <= 0xdbff) {
                if (substring.length > 1) {
                    let ls = substring.charCodeAt(i + 1)
                    let uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000
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
                } else if (0x2B05 <= hs && hs <= 0x2b07) {
                    return true
                } else if (0x2934 <= hs && hs <= 0x2935) {
                    return true
                } else if (0x3297 <= hs && hs <= 0x3299) {
                    return true
                } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030 || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b || hs == 0x2b50) {
                    return true
                }
            }
        }
    },
    hideEmoji(e){
      if (e && this.$refs.emojiBtn.contains(e.target)){
        return
      }
      this.showEmoji = false
    },
    toggleEmoji () {
      console.log('this.showEmoji', this.showEmoji)
      // this.showEmoji && this.$refs.textareaInput.focus()
      // !this.showEmoji && this.$refs.textareaInput.blur()
      // this.$nextTick(() => {
        this.showEmoji = !this.showEmoji
      // })
    },
    chooseEmoji (item) {
      if (item.name !== '删除') {
        this.textareaInput += '[' + item.name + ']'
      } else {
        if (this.textareaInput) {
          this.textareaInput = this.textareaInput.slice(0, -1)
        }
      }
    },
    hideUserInput () {
      this.$emit('hideUserInput', this.textareaInput)
    },
    sendComments () {
      let me = this
      if (this.isLoading) {
        return
      }
      this.isLoading = true
      
      if (!this.$store.getters.hasBaseInfo()) {
        this.showConfirm.toPersonal()
        return
      }
      if (me.textareaInput.replace(/\s+/g, '') === '') {
        me.$toast('评论内容不能为空！')
        return
      } else if (me.textareaInput.length >= 256) {
        me.$toast('评论内容过长！')
        return
      }
      let data = {
        objectId: me.objectId,
        objectType: me.type,
        content: me.textareaInput
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
          me.$emit('updateComments', {
            avatar: me.$store.state.user.avatar,
            userId: me.$store.state.user.userId,
            content: me.textareaInput,
            objectId: me.objectId,
            objectType: me.type,
            createTime: new Date(),
            nickName: me.userName,
            commentId: res,
            countChildComment: 0,
            contentSe: '',
            isLike: false,
            countLike: 0,
          })
          me.textareaInput = ''
        },
        error: function (err) {
          me.isLoading = false
          me.$error(true, err)
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
    // position: fixed !important;
    position: relative;
    left:0;
    bottom:0;
    width: 100vw;
    padding: 2vw 0;
    display: flex;
    background: #fff;
  .textarea{
      flex: 1;
      color: #5f5f5f;
      height: 5vw;
      line-height: 5vw;
      // max-height: 40px;
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
