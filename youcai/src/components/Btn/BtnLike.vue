<template>
  <a href="javascript:;"
     v-color='color'
     @click.stop="btnClick"
     :class="['toggleLike__btn',numPos, 'fadeBtn', {'is_loading': isLoading}]"
     id="firstLike">
    <i v-if='operateType===3'
       :class="['iconWanwan', 'icon--vote', {'iconWtoupiao': isVote, 'iconWvote': !isVote}, {weightFont: btnWeight === 1}]"></i>
    <i v-if='operateType===2'
       :class="['iconfont', 'icon--like', {'icon-redxin-copy': isLike, 'icon-favorites': !isLike}, {weightFont: btnWeight === 1}]"></i>
    <i v-if='operateType===1'
       :class="['iconfont', 'icon--fav', {'icon-wjx-shixin': isFavs, 'icon-wjx': !isFavs}, {weightFont: btnWeight === 1}]"></i>
    <span :class="['count', {'countTotal--size':size == 1}, {'countSmall': size === 2}]"
          v-if="countTotal">{{format.formatNum(countTotal)}}</span>
  </a>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  props: {
    operateType: { // 类型 | 1 收藏 | 2 点赞 | 3 投票
      type: Number,
      default: 2
    },
    objectId: { // 点赞的 id
      type: String,
      default: ''
    },
    item: { // item数据
      type: Object,
      required: true
    },
    objectType: { // 操作的类型 0 动态；1 声音;2 活动;3 用户;4 群组:5 评论
      type: Number,
      default: 0
    },
    size: { // num的大小
      type: Number,
      default: 1
    },
    numPos: { // num的位置
      type: String,
      default: 'middle'
    },
    color: { // 按钮的默认颜色
      type: String,
      default: '#444'
    },
    btnWeight: { // 表示按钮图标的字体样式
      type: Number,
      default: 0
    },
    isLink: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isLoading: false,
      likeState: this.item && this.item.isLike, // 表示点赞的状态
      favsState: this.item && this.item.isCollection,
      voteState: this.item && this.item.isVote
    }
  },
  computed: {
    // 将like、dislike, favs, disFavs数据存储到state中
    ...mapState(['likes', 'disLikes', 'favs', 'disFavs', 'voteList']),
    // 以下状态 判断item是否在 like、dislike, favs, disFavs, voteList 中。
    isInLikeList () {
      return this.likes && this.likes.length >= 1 && this.likes.indexOf(this.objectId) !== -1
    },
    isInDislikeList () {
      return this.disLikes && this.disLikes.length >= 1 && this.disLikes.indexOf(this.objectId) !== -1
    },
    isInFavsList () {
      return this.favs && this.favs.length >= 1 && this.favs.indexOf(this.objectId) !== -1
    },
    isInDisfavsList () {
      return this.disFavs && this.disFavs.length >= 1 && this.disFavs.indexOf(this.objectId) !== -1
    },
    isInVoteList () {
      return this.voteList && this.voteList.length >= 1 && this.voteList.indexOf(this.objectId) !== -1
    },
    // 以下状态 -> 是否 isLike && isFavs
    isLike () {
      if (this.isInLikeList) {
        return true
      } else if (this.isInDislikeList) {
        return false
      } else {
        return this.likeState
      }
    },
    isFavs () {
      if (this.isInFavsList) {
        return true
      } else if (this.isInDisfavsList) {
        return false
      } else {
        return this.favsState
      }
    },
    isVote () {
      if (this.isInVoteList) {
        return true
      } else {
        return this.voteState
      }
    },
    // 动态显示的最终的num
    countTotal () {
      if (this.operateType === 1) {
        return this.item && this.item.countCollection + this.changeNum
      } else if (this.operateType === 2) {
        return this.item && this.item.countLike + this.changeNum
      } else if (this.operateType === 3) {
        return this.item && this.item.countVote + this.changeNum
      }
      return 0
    },
    // 计算是否有变化, 1 | -1 | 0
    changeNum () {
      let num = 0
      if (this.operateType === 1) {
        num = this.isInFavsList ? (!this.favsState ? 1 : 0) : this.isInDisfavsList ? (this.favsState ? -1 : 0) : 0
      } else if (this.operateType === 2) {
        num = this.isInLikeList ? (!this.likeState ? 1 : 0) : this.isInDislikeList ? (this.likeState ? -1 : 0) : 0
      } else if (this.operateType === 3) {
        num = this.isInVoteList ? (!this.voteState ? 1 : 0) : 0
      }
      return num
    }
  },
  watch: {
    item (newV) {
      console.log(newV)
      return newV
    }
  },
  directives: {
    'color':  function (el, binding) {
      el.style.color = binding.value
    }
  },
  methods: {
    ...mapMutations({
      'upLike': 'upLike', // 点赞
      'upDisLike': 'upDisLike',
      'upFav': 'upFav', // 收藏
      'upDisFav': 'upDisFav',
      'upVoteList': 'upVoteList', // 投票
      'updateMyPage': 'updateMyPage' // 更新我的
    }),
    btnClick () {
      let me = this
      if (!this.$store.state.isInApp) {
        window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=io.dcloud.H50D8112A'
        return
      }
      if (!this.authentication.isLogin()) {
        this.go.login()
        return
      }
      console.log(me.isLink, me.operateType === 3, me.operateType)
      if (me.isLink && me.operateType === 3) { // 投票 && 是链接
        if (me.item.postType === 2) {
          this.go.nameAParams('voteHVideoDetail', {'postId': me.objectId, id: me.item.activityId})
        } else {
          this.go.nameAParams('discoverItemOnly', { postId: me.objectId })
        }
        return
      }
      if (me.isLoading || me.isVote || (me.operateType === 3 && this.onceVote && !me.getIMEI())) { // 正在loading || 已经投过票了 => 返回
        return
      }
      console.log(me.isVote)
      // 
      me.isLoading = true
      let url = ''
      let data = {}
      switch (this.operateType) {
        case 1: 
          url = 'Operate'
          data = {
            'objectId': me.objectId,
            'oprateType': me.operateType,
            'objectType': me.objectType,
            'isCancel': !me.isFavs // true 收藏 | false 取消
          }
          break
        case 2:
          url = 'Operate'
          data = {
            'objectId': me.objectId,
            'oprateType': me.operateType,
            'objectType': me.objectType,
            'isCancel': !me.isLike // true 点赞 | false 取消
          }
          break
        case 3:
          url = 'Vote'
          data = {
            votePostId: me.objectId,
            isVote: true // 投票不能取消  && 每天可以投一次
          }
          break
      }
      me.api.process({
        url: url,
        data: data,
        success: function() {
          if (me.operateType === 1) { // 收藏
            me.updateMyPage({isRefreshCollect: 1}) // 更新store的状态，去更新我的收藏页面
            if (me.isFavs) {
              me.upDisFav(me.objectId)
            } else {
              me.upFav(me.objectId)
            }
          } else if (me.operateType === 2) {  // 点赞
            if (me.isLike) {
              me.upDisLike(me.objectId)
            } else {
              me.upLike(me.objectId)
            }
          } else if (me.operateType === 3) { // 投票
            me.upVoteList(me.objectId)
          }
        },
        error: function (err) {
          me.$alert(typeof(err)==='string' ? err : JSON.stringify(err))
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
.toggleLike__btn{
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .iconfont, .iconWanwan{
    display: flex;
    align-items: center;
    height: 100%;
    padding-top: 2px;
    box-sizing: border-box;
    &.icon-redxin-copy, &.iconWtoupiao {
      color: var(--mRed) !important;
    }
    &.icon-wjx-shixin{
      color: #fdd900 !important;
    }
  }
  .weightFont{
    font-weight: 600;
    font-size: 6.86vw;
  }
  .count{
    font-size: 3.6vw;
  }
  .countSmall{
    font-size: 3vw;
    vertical-align: text-top;
    color:var(--noLikeXin);
  }
  &.middle{
    .count {
      min-width: 4vw;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  &.sup{
    .iconfont{
      // font-weight: bold;
      font-size: 6.83vw;
    }
    .count {
      margin-top: -2.5vw;
      font-size: 4vw;
      display: inline-block;
      vertical-align: text-top;
    }
  }
}
</style>
