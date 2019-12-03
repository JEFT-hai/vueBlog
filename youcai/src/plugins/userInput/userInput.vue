<template>
  <div class='userCommentInputWrap'>
    <textarea v-grow-height="0" maxlength="500" class='textarea' type='submit' placeholder="评论一下吧..." />
    <div class="sendUserComment">
    <span>
        发送
    </span>
    </div>
  </div>
</template>
<style lang="less">
  .userCommentInputWrap{
    position: absolute;
    width:100vw;
    height: auto;
    bottom: 0;
    left: 0;
    padding: 2vw 0;
    display: flex;
    z-index: 300;
    background: #fff;
    .textarea{
      flex: 1;
      color: #5f5f5f;
      height: 5vw;
      line-height: 5vw;
      border-radius: 4.4vw;
      border: 1px solid #9d9d9d;
      padding:2.4vw 3vw;
      margin-left: 2.8vw;
      // box-sizing: border-box;
      font-size: var(--mText);
      outline: 0 none;
      overflow: hidden;
      word-break: break-all;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 0 8px rgba(82, 168, 236, 0.6);
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
</style>