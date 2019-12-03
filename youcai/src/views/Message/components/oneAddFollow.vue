<template>
  <div class="addFollowLi">
    <div class="userAvatarWrap">
      <Avatar :item="likeUser"
              :size="119"></Avatar>
    </div>
    <div class="addFollowMain borderB">
      <div class="followOne" @click="goOrigin">
        <span class="followTitle">
          <i>{{item.senderName}}</i>&nbsp;{{messageContent.content.title}}
        </span>
        <span class="followTime">{{item.createTime.substring(5,10)}}</span>
      </div>
      <div class="followTwo">
        <div class="applyDetail" v-if="messageContent.content.objectType == 8" @click="goApply">
          详情
        </div>
        <BtnFollow :item="likeUser"
                   :isAddFollow="true" v-else></BtnFollow>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from '@/components/Avatar'
import BtnFollow from '@/components/Btn/BtnFollow'
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
    Avatar,
    BtnFollow
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
    console.log('每一个item', this.item)
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
    },
    goApply () {
      this.$router.push({
          name: 'groupApplyList',
          params: {
            id: this.messageContent && this.messageContent.content.objectId
          }
        })
    }
    }
}
</script>

<style lang="less" scoped>
    .addFollowUl{
          padding-top:4vw;
          box-sizing: border-box;
          .addFollowLi{
              display:flex;
              flex-flow: row nowrap;
               .userAvatarWrap{
                width:19.90vw;
                display:flex;
                justify-content: center;
              }
              .addFollowMain{
                  flex:1;
                  font-size:0;
                  display:flex;
                  flex-flow: row nowrap;
                  justify-content: space-between;
                  align-items: center;
                  padding-bottom:3vw;
                  padding-right:4vw;
                  box-sizing: border-box;
                  .followOne{
                     width:50vw;
                     .followTitle{
                         width:100%;
                         display:inline-block;
                         font-size:4vw;
                         font-weight: 500;
                         i{
                             font-style:normal;
                             font-weight: 600;
                         }
                     }
                     .followTime{
                         width:100%;
                         display:inline-block;
                         font-size:3vw;
                         color:#949494;
                     }
                  }
                  .followTwo{
                    .applyDetail{
                      display:inline-block;
                      color: red;
                      border: 1px solid red;
                      border-radius: 8vw;
                      width: 15vw;
                      height: 6vw;
                      text-align: center;
                      line-height: 6vw;
                      font-size: 3vw;
                    }
                  }
              }
          }
      }
</style>
