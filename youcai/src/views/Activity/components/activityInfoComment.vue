<template>
    <div class="activityCommentWrap">
        <h3>共{{activityCommentList.length}}条评论</h3>
        <ul>
           <commentsItem v-for="(item, index) in activityCommentList"  :item='item' :key='index' :postDetail="OneItem" :newTwoComment="newTwoComment"
           :replayList="activityCommentList"/>
        </ul>
    </div>
</template>

<script>
import commentsItem from '@/components/comments/commentsItem'
export default {
  components: {
    commentsItem
  },
  props: {
    activityCommentList: {
      type: Array
    },
    OneItem: {
      type: Object
    },
    newTwoComment: {
      type: Object
    }
  }
}
</script>

<style lang="less" scoped>
 .activityCommentWrap{
     width:100%;
     h3{
        height: 12.5vw;
        line-height: 12.5vw;
        font-size: 4vw;
        color: #393939;
        text-align: center;
        font-weight: bold;
        border-bottom: 1px solid #e5e5e5;
        background: #fff;
     }
 }   
</style>
