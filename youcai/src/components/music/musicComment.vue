<template>
    <transition name="moveTop">
        <div class="musicCommentWrap">
        <div class="mask" @click="handleComment"></div>
                <div class="content">
                    <div class="commentCount">
                        <span>共836条评论</span>
                        <span @click="handleComment"><i class="iconWanwan iconWquxiao-copy-copy activityNotice"></i></span>
                    </div>
                <div class="commentList borderB"></div>
                </div>
        </div>
     </transition>
</template>

<script>
export default {
  methods: {
    handleComment () {
      this.$emit('hiddleComment')
    }
  }
}
</script>

<style lang="less" scoped>

    .musicCommentWrap{
        width:100%;
        height:100vh;
        position:absolute;
        top:0;
        left:0vw;
        z-index:200;
        &.moveTop-enter-active,&.moveTop-leave-active{
          transition:all 0.5s ease;
        }
        &.moveTop-enter,&.moveTop-leave-to{
          top:100vh;
        }
        .mask{
            height:40%;
            width:100%;
        }
        .content{
            width:100%;
            height:60%;
            background-color:white;
            .commentCount{
                width:100%;
                height:12.78vw;
                position:relative;
                display:flex;
                justify-content: center;
                align-items: center;
                span:nth-child(1) {
                    font-size:4.8vw;
                    color:#333;
                }
                span:nth-child(2) {
                    position:absolute;
                    right:4vw;
                    .activityNotice{
                        font-size:5vw;
                        color:#333;
                    }
                }
            }
        }
    }
</style>
