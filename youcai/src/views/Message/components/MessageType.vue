<template>
  <div class="messageTypePage">
    <div class="recevierName">
      <span v-if="messageDetail.senderId !== user.userId">{{
        messageDetail.senderName
      }}</span>
    </div>
    <div class="detailContent">
      <div class="sendStatus" v-if="messageDetail.status != 1">
        <span
          class="iconWgantanhao iconWanwan activityNotice"
          v-if="messageDetail.status === 0"
        ></span>
        <img
          src="../../../assets/images/loading2.gif"
          alt=""
          v-if="messageDetail.status === 2"
        />
      </div>
      <div
        :class="[
          'fontType',
          {
            isMyMessage:
              messageDetail.senderId === user.userId &&
              !messageDetail.imGroupDetailChatId
          },
          {
            isGroupOwner:
              messageDetail.imGroupDetailChatId && groupIdentify == 2
          },
          { isManage: messageDetail.imGroupDetailChatId && groupIdentify === 1 }
        ]"
        v-if="messageContent.type == 'text' || messageContent.type == 'warn'"
      >
        {{
          messageContent.type == "text"
            ? messageContent.content
            : messageContent.content.content
        }}
      </div>
      <div class="imageType" v-if="messageContent.type === 'img'">
        <!-- <img src="http://photocdn.sohu.com/20160805/Img462750894.jpg" alt=""> -->
        <img :src="messageContent.content" alt="" preview="elId" down="elId" />
      </div>
      <div
        class="innerShare"
        v-if="messageContent.type === 'share'"
        @click="goOrigin"
      >
        <div class="imgContent" v-if="messageContent.content.imageUrl">
          <img :src="messageContent.content.imageUrl" alt="" />
          <span class="viedoType" v-if="messageContent.content.postType === 6">
            <i class="iconWanwan iconWshipin1 videoPlayerIcon"></i>
          </span>
        </div>
        <div class="fontContent">
          <p class="contentTile" v-if="messageContent.content.content">
            {{ messageContent.content.content }}
          </p>
          <div class="shareUser" v-if="showShareUser">
            <!-- <Avatar :item="sendUser"
                    :size="5"></Avatar> -->
            <div class="userWrap">
              <img
                :src="
                  messageContent && messageContent.content.postUserAvatar
                    ? messageContent && messageContent.content.postUserAvatar
                    : defaultAvatar
                "
                alt=""
              />
            </div>
            <span class="userName">{{
              messageContent && messageContent.content.postUserName
            }}</span>
          </div>
        </div>
      </div>
      <div class="groupOtherNotice" v-if="messageContent.type == 'notice'">
        <div class="noticeWrap borderB">
          <div class="userAvatar">
            <img
              src="http://www.guangyuanol.cn/uploads/allimg/180507/13131CJ4-0.jpg"
              alt=""
            />
          </div>
          <span class="noticeDetail">
            翻白眼被任命为群组管理员
          </span>
        </div>
        <p class="goDetail">
          查看详情
        </p>
      </div>
    </div>
  </div>
</template>

<script>
// import Avatar from '@/components/Avatar'
import { mapState } from 'vuex';
export default {
  data() {
    return {
      defaultAvatar: require('@/assets/images/userBg.jpg')
    }
  },
  components: {
    // Avatar
  },
  props: {
    messageDetail: {
      type: Object,
      default: function() {
        return {
          msgType: 2 // 1.表示文字消息， 2.表示图片消息， 3.表示站内转发消息
        }
      }
    },
    groupIdentify: {
      type: Number // 表示群的身份
    },
    setMessage: {
      type: Object
    }
  },
  computed: {
    ...mapState([
      'user',
      'isPlaying',
      'currentIndex',
      'playList',
      'squenceList',
      'musicMode',
      'pieShow',
      'currentTime',
      'duration',
      'musicInnerShow'
    ]),
    messageContent() {
      if (this.messageDetail.content === 'undefined') {
        return {
          content: JSON.stringify({ type: 'text', content: '错误的信息' })
        }
      }
      let obj = JSON.parse(this.messageDetail && this.messageDetail.content)
      return obj
    },
    sendUser() {
      let obj = {
        userId: this.messageDetail.SenderId,
        avatar: this.messageDetail.senderAvatar
      }
      return obj
    },
    showShareUser() {
      return (
        this.messageContent.content.postUserName !== undefined &&
        !this.messageContent.content.hideUser
      )
    }
  },
  mounted () {
    console.log('打印一下', this.messageDetail)
  },
  methods: {
    goOrigin() {
      if (
        (this.messageContent && this.messageContent.content.postType === 1) ||
        (this.messageContent && this.messageContent.content.objectType === 2)
      ) {
        // 表示帖子的发现内页
        this.$router.push({
          name: 'discoverItemOnly',
          params: {
            postId: this.messageContent && this.messageContent.content.objectId
          }
        })
      } else if (
        (this.messageContent && this.messageContent.content.postType === 2) ||
        (this.messageContent && this.messageContent.content.objectType === 4)
      ) {
        // 表示活动详情页面
        this.$router.push({
          name: 'activityInfo',
          params: {
            id: this.messageContent && this.messageContent.content.objectId
          }
        })
      } else if (
        (this.messageContent && this.messageContent.content.postType === 3) ||
        (this.messageContent && this.messageContent.content.objectType === 6)
      ) {
        // 表示优惠详情
        this.$router.push({
          name: 'discount_info',
          params: {
            id: this.messageContent && this.messageContent.content.objectId
          }
        })
      } else if (
        this.messageContent &&
        this.messageContent.content.postType === 4
      ) {
        // 表示视频播放
        console.log('视频分享')
      } else if (
        (this.messageContent && this.messageContent.content.postType === 5) ||
        (this.messageContent && this.messageContent.content.objectType === 1)
      ) {
        // 表示群组申请列表
        this.$router.push({
          name: 'groupApplyList',
          params: {
            id: this.messageContent && this.messageContent.content.objectId
          }
        })
      } else if (
        (this.messageContent && this.messageContent.content.postType === 6) ||
        (this.messageContent && this.messageContent.content.objectType === 3)
      ) {
        // 表示视频播放
        this.$router.push({
          name: 'videoSwiper',
          params: {
            id: this.messageContent && this.messageContent.content.objectId
          }
        })
      } else if (
        this.messageContent &&
        this.messageContent.content.postType === 7
      ) {
        // 表示音乐
        // this.$router.push({
        //   name: 'videoSwiper',
        //   params: {
        //     id: this.messageContent && this.messageContent.content.objectId
        //   }
        // })
        this.$store.commit('setMusicInnerShow', !this.musicInnerShow)
      } else if (
        (this.messageContent && this.messageContent.content.postType === 8) ||
        (this.messageContent && this.messageContent.content.objectType === 7)
      ) {
        // 表示话题评论内部
        this.$router.push({
          name: 'topicComment',
          params: {
            topicAnswerId:
              this.messageContent && this.messageContent.content.topicCommentId,
            topicId: this.messageContent && this.messageContent.content.objectId
          }
        })
      } else if (
        (this.messageContent && this.messageContent.content.postType === 9) ||
        (this.messageContent && this.messageContent.content.objectType === 8)
      ) {
        // 表示别人的主页
        this.$router.push({
          name: 'discoverUser',
          params: {
            id: this.messageContent && this.messageContent.content.objectId
          }
        })
      } else if (
        (this.messageContent && this.messageContent.content.postType === 10) ||
        (this.messageContent && this.messageContent.content.objectType === 9)
      ) {
        // 群详情页面
        this.$router.push({
          name: 'groupInfo',
          params: {
            id: this.messageContent && this.messageContent.content.objectId
          }
        })
      } else if (
        this.messageContent &&
        this.messageContent.content.postType === 11
      ) {
        // 表示投票详情页
        this.$router.push({
          name: 'voteList',
          params: {
            id: this.messageContent && this.messageContent.content.objectId
          }
        })
      } else if (
        this.messageContent &&
        this.messageContent.content.postType === 12
      ) {
        // 表示投票视频
        this.$router.push({
          name: 'videoVote',
          params: {
            id: this.messageContent && this.messageContent.content.objectId
          }
        })
      } else if (
        this.messageContent &&
        this.messageContent.content.postType === 13
      ) {
        // 表示 群聊天设置页
        this.$router.push({
          name: 'groupChatSettings',
          params: {
            id: this.messageContent && this.messageContent.content.objectId,
            // TODO 这里还缺
            isMute: this.setMessage.noInterruption, // 表示是否禁言
            isTop: this.setMessage.top // 是否置顶
          }
        })
      } else if (
        (this.messageContent && this.messageContent.content.postType === 14) ||
        (this.messageContent && this.messageContent.content.objectType === 10)
      ) {
        // 表示话题内页
        this.$router.push({
          name: 'topicItemss',
          params: {
            id: this.messageContent && this.messageContent.content.objectId
          }
        })
      } else if (
        this.messageContent &&
        this.messageContent.content.postType === 15
      ) {
        // 表示我的页面
        this.$router.push({
          name: 'my'
        })
      } else if (
        this.messageContent &&
        this.messageContent.content.postType === 16
      ) {
        // 表示群二维码
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
.messageTypePage {
  .recevierName {
    font-size: 3.5vw;
    color: rgb(150, 150, 150);
    margin-top: -6vw;
    padding-left: 1vw;
    box-sizing: border-box;
    height: 6vw;
    width: 100%;
  }
  .detailContent {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    font-size: 0;
    .sendStatus {
      margin-right: 2vw;
      width: 6vw;
      overflow: hidden;
      .activityNotice {
        color: red;
        font-size: 5vw;
      }
    }
    .fontType {
      display: inline-block;
      padding: 2vw 3vw;
      box-sizing: border-box;
      border-radius: 6vw;
      // border:1px solid #cacaca;
      max-width: 60vw;
      font-size: 4.5vw;
      background: white;
    }
    .isMyMessage {
      border: none;
      background: rgb(57, 166, 249);
      color: white;
    }
    .isGroupOwner {
      border: none;
      background: rgb(255, 222, 115) !important;
      color: white;
    }
    .isManage {
      border: none;
      background: rgb(150, 238, 235) !important;
      color: white;
    }
    .imageType {
      width: 55.56vw;
      border-radius: 6vw 6vw 6vw 6vw;
      img {
        width: 55.56vw;
        height: auto;
        object-fit: cover;
        overflow: hidden;
        border-radius: 6vw 6vw 6vw 6vw;
      }
    }
    .innerShare {
      border-radius: 6vw;
      width: 44.44vw;
      .imgContent {
        width: 44.44vw;
        height: 44.44vw;
        border-radius: 6vw 6vw 0vw 0vw;
        overflow: hidden;
        position: relative;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          background: #eee;
        }
        .viedoType {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;
          z-index: 1000;
          background: rgba(0, 0, 0, 0.5);
          width: 8.6vw;
          height: 8.6vw;
          border-radius: 50%;
          text-align: center;
          line-height: 8.6vw;
          .videoPlayerIcon {
            color: white;
            font-size: 6vw;
          }
        }
      }
      .fontContent {
        width: 100%;
        padding: 3vw;
        box-sizing: border-box;
        background: rgb(246, 246, 246);
        border-radius: 0vw 0vw 6vw 6vw;
        //  border:1px solid blue;
        box-shadow: 0 0 2px #ccc;
        .contentTile {
          width: 100%;
          // text-align: center;
          font-size: 3.7vw;
          font-weight: bold;
          margin-bottom: 2vw;
          overflow: hidden;
          text-overflow: ellipsis; //文本溢出显示省略号
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
        .shareUser {
          display: flex;
          flex-flow: row nowrap;
          .userWrap {
            width: 5vw;
            height: 5vw;
            overflow: hidden;
            border-radius: 50%;
            border: 1px solid #eee;
            img {
              width: 5vw;
              height: 5vw;
              object-fit: cover;
            }
          }
          .userName {
            margin-left: 2vw;
            font-size: 3.33vw;
            color: rgb(177, 177, 177);
            display: inline-block;
            width: 30vw;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            word-wrap: break-word;
            word-break: break-all;
          }
        }
      }
    }
    .groupOtherNotice {
      width: 75.74vw;
      padding: 3vw 0vw;
      box-sizing: border-box;
      border-radius: 4vw;
      background: white;
      .noticeWrap {
        width: 100%;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        padding: 0 4vw 2vw 4vw;
        box-sizing: border-box;
        .userAvatar {
          width: 16.67vw;
          height: 16.67vw;
          overflow: hidden;
          border-radius: 2vw;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
        .noticeDetail {
          display: inline-block;
          font-size: 3.7vw;
          margin-left: 3vw;
        }
      }
      .goDetail {
        padding: 3vw 4vw 0vw 4vw;
        box-sizing: border-box;
        font-size: 3.7vw;
        color: #a8a8a8;
      }
    }
  }
}
</style>
