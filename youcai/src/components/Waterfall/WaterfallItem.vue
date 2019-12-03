<template>
  <div class="waterfallItem">
    <div class="waterfallItemCover"
         :style="getStyle(item)"
         @click="goDetail(item.postId)">
      <div v-if='this.item.postType === 2'
           class="iconWanwan iconWshipin1 videoPlayerIcon"></div>
      <img class="waterfallItemCover__img"
           v-lazy='finalCover'
           :key='finalCover'
           alt="postCover" />
    </div>
    <div class='waterfallItemMain'>
      <article class="waterfallItemArticle"
               @click="goDetail(item.postId)">
        {{calculateContent}}
      </article>
      <div class="waterfallItemUserInfo waterfallItem__flex--line">
        <Avatar class="flex--left"
                :item='item'
                :size=5></Avatar>
        <div class="flex--middle waterfallItem-userName"
             @click="go.user(item.userId)">{{reallyName}}</div>
        <b-like class="flex--right postItem-btn"
                :objectId='item.postId'
                :item="item"
                :operateType='operateType'
                :isLink='isLink' />
      </div>
    </div>
  </div>
</template>
<script>
import Avatar from '@/components/Avatar'
import BtnLike from '@/components/Btn/BtnLike'
import { mapState } from 'vuex'
export default {
  components: {
    Avatar,
    'b-like': BtnLike
  },
  props: {
    item: {
      type: Object,
      default: null
    },
    isDiscoterOnly: { // 表示是否是发现页
      type: Number,
      default: 0
    },
    isRelevant: {
      type: Number,
      default: 0,
    }
  },
  data () {
    return {
      width: parseInt(document.documentElement.offsetWidth * 0.479),
      defaultUserAvatar: 'http://webapp.szwanwan.com/img/default/defaultavatar.png',
      finalCover: null,
      elCover: null
    }
  },
  computed: {
    ...mapState({
      'user': 'user',
      'waterfallScrollEnd': 'waterfallScrollEnd',
      'networkState': 'networkState'
    }),
    isLink () {
      return !!this.item.activityId
    },
    isVote () {
      return this.item.activityId
    },
    operateType () {
      return this.isVote ? 3 : 2
    },
    showVideoIcon () {
      return this.coverImg === this.item.videoCover
    },
    coverImg () {
      // if (!this.networkState && this.item.videoCover) {
      //   return this.item.videoCover
      // }
      return this.item.picture || (this.item.imageList && this.item.imageList[0])
    },
    videoCover () {
      return this.item.videoCover ? this.item.videoCover: this.coverImg
    },
    calculateImage () {
      if (this.isRelevant) {
        return this.item && this.item.imageList[0]
      } else {
        return this.item.picture 
      }
    },
    /**
     * reallyName用户真正的姓名
     */
    reallyName () {
      if (this.item.nickName === null || this.item.nickName === null) {
        return this.item.name
      } else {
        return this.item.nickName
      }
    },
    calculateContent () { // 检测是否有
      return this.item.postTitle ? this.item.postTitle : this.item.content
    }
  },
  watch: {
    networkState:  {
      immediate: true,
      handler (newV) {
        if (!this.finalCover) {
          if (this.item.postType === 1) {
            this.finalCover = this.coverImg
          } else if (newV == '1') { // wifi
            this.finalCover = this.coverImg
          } else if (newV == '2') { // 移动
            this.finalCover = this.videoCover
          }
        }
      }
    }
  },
  methods: {
    goDetail (postId) {
      if (this.item.activityId) { // 投票
        if (this.item.postType === 2) { // 视频
          console.log('是我吗', this.item)
          this.go.nameAParams('voteHVideoDetail', { postId: postId,id: this.item.activityId })
        }  else {
          this.go.nameAParams('discoverItemOnly', { postId: postId })
        }
      } else { // 帖子
        if (this.item.postType === 2) { // 视频
          this.go.nameAid('videoSwiper', postId)
        }  else {
          this.go.nameAParams('discoverItemOnly', { postId: postId })
        }
      }
    },
    getStyle (item) {
      let me = this
      return {
        width: me.width + 'px',
        height: parseInt(me.width * item.r) + 'px'
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .waterfallItem {
    .waterfallItemCover {
      position: relative;
      background-color: #efefef;
      .videoPlayerIcon{
        position: absolute;
        top: 2.8vw;
        right: 2.8vw;
        width: 5vw;
        height: 5vw;
        line-height: 5vw;
        color: #fff;
        font-size: 3.6vw;
        border-radius: 50%;
        background-color: rgba(0,0,0,0.5);
        text-align: center;
      }
      .waterfallItemCover__img{
        width: 100%;
        height: 100%;
      }
      overflow: hidden;
    }
    .waterfallItemArticle{
      margin:2.5vw 0;
      line-height: 5.83vw;
      font-size: 4.4vw;
      font-weight: bold;
      letter-spacing: 1px;
      color: #222;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .waterfallItemMain{
      padding: 0 2.8vw 2.8vw;
      .waterfallItem__flex--line {
        display: flex;
        align-items: center;
        height: 6.4vw;
        .flex--left {
          width: 6.4vw;
          height: 6.4vw;
          margin-right: 1.7vw;
        }
        .flex--middle {
          flex: 1;
          line-height: 6.4vw;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          &.waterfallItem-userName {
            font-size: 3.4vw;
            color: #333;
            letter-spacing: 1px;
          }
        }
        .flex--right{
          max-width: 18vw;
          text-align: right;
        }
      }
    }
  }
</style>
