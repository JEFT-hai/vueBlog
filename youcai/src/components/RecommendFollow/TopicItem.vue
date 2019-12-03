<template>
  <li class="TopicListWrap borderB" >
    <div class="topicImg" @click.stop="gotoItem(topic)">
        <img :src="topic.image" alt="">
    </div>
    <div class="topicTitle" @click.stop="gotoItem(topic)" >
        <span class="title">{{topic.title}}</span>
        <div class="detail">
            <span class="one">话题</span>
            <span class="three">热度&nbsp;{{topic.hotDegree}}</span>
        </div>
    </div>
    <div @click='handleFollow(topic.topicId)' :class="['followBtn',{followed: isFollow}]" v-if="routerType === 1">
        {{isFollow ? '已关注':'关注'}}
    </div>
    <div class="otherfollow" v-else>
    </div>
  </li>
</template>
<script>
export default {
  props: {
    topic: {
      type: Object
    },
    isAttention: {
      type: Boolean
    }
  },
  data () {
    return {
      isFollow: this.isAttention,
      routerType: parseInt(this.$route.params.type)
    }
  },
  mounted () {
    console.log("答应routreType")
  },
  methods: {
    // 方法
    gotoItem (item) {
      this.$router.push({ name: 'topicItemss', params: { id: item.topicId } })
    },
    handleFollow (topicId) {
      let me = this
      if (this.isFollow) {
        me.api.process({
            url: 'Topic',
            data: {
            'topicId': topicId,
            'isAttention': false // 表示取消关注
            },
            success: function (res) {
                me.isFollow = false
            }
        })
      } else {
        me.api.process({
          url: 'Topic',
          data: {
            'topicId': topicId,
            'isAttention': true // 表示去关注
          },
          success: function (res) {
            me.isFollow = true
          }
        })
      }
    }
  }
}
</script>
<style lang='less'>
.TopicListWrap{
     width:100%;
     padding:4vw;
     box-sizing: border-box;
     display:flex;
     justify-content: space-between;
     align-items: center;
     .topicImg{
         width:11.57vw;
         height:11.57vw;
         border-radius: 1vw;
         overflow: hidden;
         margin-right:4vw;
         img{
             width:100%;
             height:100%;
         }
     }
     .topicTitle{
         width:50vw;
         .title{
             font-size:4vw;
             color:#333333;
         }
         .detail{
             font-size:3.42vw;
             color:#676767;
             display:flex;
             .one::after{
                content:'.';
                display:inline-block;
                width:4vw;
                position:relative;
                top:-1vw;
                text-align: center;
             }
         }
     }
     .followBtn{
        width:15vw;
        height:6vw;
        border:1px solid red;
        color:red;
        border-radius: 8vw;
        text-align: center;
        line-height:6vw;
        font-size:3vw;
    }
    .followed{
        border:1px solid red;
        color:rgb(154, 154, 154);
        border:1px solid rgb(154, 154, 154)
    }
    .otherfollow{
      width:15vw;
        height:6vw;
        // border:1px solid red;
        // color:red;
        border-radius: 8vw;
        text-align: center;
        line-height:6vw;
        font-size:3vw;
    }
 }
</style>
