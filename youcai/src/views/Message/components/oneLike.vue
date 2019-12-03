<template>
  <div class="favorateLi">
    <div class="userAvatarWrap">
      <Avatar :item="likeUser"
              :size="117"></Avatar>
    </div>
    <div class="likeMain borderB"
         @click="goOrigin">
      <div class="mainTop">
        <div class="topOne">
          <span class="TopTitle">
            <i class="userName">{{item.senderName}}</i>&nbsp;{{messageContent.content.title}}
          </span>
          <span class="TopTime">{{item && item.createTime.substring(5,10)}}</span>
        </div>
        <div class="topTwo"
             v-if="messageContent.content && messageContent.content.imageUrl">
          <img :src="messageContent.content && messageContent.content.imageUrl"
               alt="">
        </div>
      </div>
      <div class="mainBottom"
           v-if="false">
        特别喜欢你啊，加油啊哈哈哈
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from '@/components/Avatar'
export default {
  data () {
    return {
        user: {
            avatar: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1570268367&di=9fa44456ca08aa8d75725b57c7ff968e&imgtype=jpg&er=1&src=http%3A%2F%2Fwww.people.com.cn%2Fmediafile%2Fpic%2F20170306%2F26%2F12565131254318156238.jpg'
        }
    }  
  },
  props: {
    item: {
      type: Object
    }
  },
  components: {
    Avatar
  },
  computed: {
    likeUser () {
          let obj = {
            avatar: this.item.senderAvatar,
            userId: this.item.senderId,
            autheType: null
          }
          return obj
        },
        messageContent () {
          if (this.item.content) {
              return JSON.parse(this.item.content)
          } else {
              return ''
          }
        }
  },
  mounted () {
  },
  methods: {
      goOrigin () {
      if (this.messageContent && this.messageContent.content.postType === 1 || this.messageContent && this.messageContent.content.objectType === 2) { // 表示帖子的发现内页
        this.$router.push({
          name: 'discoverItemOnly',
          params: {
            postId:this.messageContent && this.messageContent.content.objectId ,
          }
        })
      } else if (this.messageContent && this.messageContent.content.postType === 2 || this.messageContent && this.messageContent.content.objectType === 4) { // 表示活动详情页面
        this.$router.push({
          name: 'activityInfo',
          params: {
            id: this.messageContent && this.messageContent.content.objectId
          }
        })
      } else if (this.messageContent && this.messageContent.content.postType === 3 || this.messageContent && this.messageContent.content.objectType === 6) { // 表示优惠详情
        this.$router.push({
          name: 'discount_info',
          params: {
            id: this.messageContent && this.messageContent.content.objectId
          }
        })
      } else if (this.messageContent && this.messageContent.content.postType === 4) { // 表示视频播放
        console.log('视频分享')
      } else if (this.messageContent && this.messageContent.content.postType === 5 || this.messageContent && this.messageContent.content.objectType === 1) { // 表示群组申请列表
        this.$router.push({
          name: 'groupApplyList',
          params: {
            id: this.messageContent && this.messageContent.content.objectId
          }
        })
      } else if (this.messageContent && this.messageContent.content.postType === 6 || this.messageContent && this.messageContent.content.objectType === 3) { // 表示视频播放
        this.$router.push({
          name: 'videoSwiper',
          params: {
            id: this.messageContent && this.messageContent.content.objectId
          }
        })
      } else if (this.messageContent && this.messageContent.content.postType === 7) { // 表示音乐
        // this.$router.push({
        //   name: 'videoSwiper',
        //   params: {
        //     id: this.messageContent && this.messageContent.content.objectId
        //   }
        // })
        console.log('我是音乐')
      } else if (this.messageContent && this.messageContent.content.postType === 8 || this.messageContent && this.messageContent.content.objectType === 7) { // 表示话题评论内部
        this.$router.push({
          name: 'topicComment',
          params: {
            topicAnswerId: this.messageContent && this.messageContent.content.topicCommentId,
            topicId: this.messageContent && this.messageContent.content.objectId
          }
        })
      } else if (this.messageContent && this.messageContent.content.postType === 9 || this.messageContent && this.messageContent.content.objectType === 8) { // 表示别人的主页
        this.$router.push({
          name: 'discoverUser',
          params: {
            id: this.messageContent && this.messageContent.content.objectId,
          }
        })
      } else if (this.messageContent && this.messageContent.content.postType === 10 || this.messageContent && this.messageContent.content.objectType === 9) { // 群详情页面
        this.$router.push({
          name: 'groupInfo',
          params: {
            id: this.messageContent && this.messageContent.content.objectId
          }
        })
      } else if (this.messageContent && this.messageContent.content.postType === 11) { // 表示投票详情页
        this.$router.push({
          name: 'voteList',
          params: {
            id: this.messageContent && this.messageContent.content.objectId
           }
        })
      } else if (this.messageContent && this.messageContent.content.postType === 12) { // 表示投票视频
         this.$router.push({
          name: 'videoVote',
          params: {
            id: this.messageContent && this.messageContent.content.objectId
           }
        })
      } else if (this.messageContent && this.messageContent.content.postType === 13) { // 表示 群聊天设置页
         this.$router.push({
           name: 'groupChatSettings',
           params: {
             id: this.messageContent && this.messageContent.content.objectId,
             // TODO 这里还缺
             isMute:this.setMessage.noInterruption, // 表示是否禁言
             isTop: this.setMessage.top  // 是否置顶
           }
         })
      } else if (this.messageContent && this.messageContent.content.postType === 14 || this.messageContent && this.messageContent.content.objectType === 10) { // 表示话题内页
         this.$router.push({
          name: 'topicItemss',
          params: {
            id: this.messageContent && this.messageContent.content.objectId
           }
        })
      } else if (this.messageContent && this.messageContent.content.postType === 15) { // 表示我的页面
         this.$router.push({
          name: 'my'
        })
      } else if (this.messageContent && this.messageContent.content.postType === 16) { // 表示群二维码
         this.$router.push({
          name: 'groupQR',
          params: {
            id: this.messageContent && this.messageContent.content.objectId
           }
        })
      }
    }
    }
}
</script>

<style lang="less" scoped>
  .favorateLi{
            width:100vw;
            display:flex;
            flex-flow: row nowrap;
            padding:3.6vw 0vw;
            box-sizing: border-box;
            .userAvatarWrap{
                width:18.89vw;
                display:flex;
                justify-content: center;
            }
            .likeMain{
                flex:1;
                padding-right:3.7vw;
                padding-bottom:2vw;
                box-sizing: border-box;
                .mainTop{
                    display:flex;
                    justify-content: space-between;
                    .topOne{
                        flex:1;
                        font-size:0;
                        .TopTitle{
                            font-weight: 500;
                            width:100%;
                            display:inline-block;
                            font-size:4.25vw;
                            .userName{
                                font-weight: 600;
                                font-style:normal;
                            }
                        }
                        .TopTime{
                            font-size:3vw;
                            color:rgb(155, 155, 155);
                        }
                    }
                    .topTwo{
                        width:11.67vw;
                        height:11.67vw;
                        img{
                            width:100%;
                            height:100%;
                            object-fit: cover;
                        }
                    }
                }
                .mainBottom{
                    width:100%;
                    background:#f6f6f6;
                    font-size:3.61vw;
                    color:rgb(112, 112, 112);
                    padding:2.77vw;
                    box-sizing:border-box;
                    margin-top:4vw;
                    margin-bottom:3.4vw;
                    border-radius: 1vw;
                }
            }
        }
</style>
