<template>
  <transition name="fadeLeft">
    <div v-show="itemShow"
         class="page-content form_primary"
         ref="itemWrapper">
      <div class="no_data"
           v-if="isLoading">
        <div class="weui-loadmore">
          <i class="weui-loading"></i>
          <span class="weui-loadmore__tips">正在加载</span>
        </div>
      </div>
      <div class="no_data"
           v-else-if="items.length<=0">
        <div class="weui-loadmore weui-loadmore_line">
          <span class="weui-loadmore__tips">暂无数据</span>
        </div>
      </div>
      <div class="page__bd postItemContainer-list"
           v-else>
        <div v-for="item in items"
             :key="item.Id">
          <PostItemFull :item="item"
                        :favs="favs"
                        :likes="likes"
                        :showFollowButton="true"
                        @showShare="showShare" />
        </div>
        <div class="pullup-wrapper"
             v-if="pullUpLoad && !isLoading">
          <div class="before-trigger"
               v-if="!isPullUpLoad">
            <span>{{pullUpTxt}}</span>
          </div>
          <div class="after-trigger"
               v-else>
            <loading></loading>
          </div>
        </div>
      </div>
      <div ref="pulldown"
           class="pulldown-wrapper"
           :style="pullDownStyle"
           v-if="pullDownRefresh && !isLoading">
        <div class="before-trigger"
             v-if="beforePullDown">
          <bubble :y="bubbleY"></bubble>
        </div>
        <div class="after-trigger"
             v-else>
          <div v-if="isPullingDown"
               class="loading">
            <loading></loading>
          </div>
          <div v-else>
            <span>{{refreshTxt}}</span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'
import PostItemFull from './PostView/PostItemFull'
import Share from './components/Share'
import Bubble from '@/components/bubble.vue'
import Loading from '@/components/loading/loading.vue'
// import ReplySet from './components/ReplySet'
export default {
  components: {
    Share,
    PostItemFull,
    Bubble,
    Loading,
    itemShow: false
  },
  props: {
    data: {
      type: Array,
      default: function () {
        return []
      }
    },
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    listenBeforeScroll: {
      type: Boolean,
      default: false
    },
    listenScrollEnd: {
      type: Boolean,
      default: false
    },
    scrollbar: {
      type: null,
      default: false
    },
    pullDownRefresh: {
      type: null,
      default: true
    },
    pullUpLoad: {
      type: null,
      default: true
    },
    startY: {
      type: Number,
      default: 0
    },
    refreshDelay: {
      type: Number,
      default: 20
    },
    freeScroll: {
      type: Boolean,
      default: true
    },
    mouseWheel: {
      type: Boolean,
      default: false
    },
    bounce: {
      default: true
    },
    zoom: {
      default: false
    },
    searchTitle: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isPicture: false,
      isLoading: true,
      itemId: 0,
      items: [],
      replys: [],
      likes: [], // 我喜欢的
      saves: [], // 我收藏的
      favs: [],
      likeReplys: [],
      isLike: false, // 喜欢点赞
      isSave: false, // 收藏
      likeNumber: 0,
      saveNumber: 0,
      isFollow: false, // 是否关注
      isShare: false,
      userComment: '', // 用户的评论信息,
      discovers: [],
      shareItem: {},
      curNum: 3,
      beforePullDown: true,
      isRebounding: false,
      isPullingDown: false,
      pullDownStyle: '',
      bubbleY: 0,
      pullupMsg: '上拉加载',
      isPullUpLoad: false,
      pullUpDirty: true
    }
  },
  watch: {
    items () {
      setTimeout(() => {
        this.forceUpdate(true)
      }, this.refreshDelay)
    }
  },
  computed: {
    ...mapState(['user']),
    pullUpTxt () {
      const moreTxt = (this.pullUpLoad && '加载中')
      const noMoreTxt = (this.pullUpLoad && '没有更多数据了')
      return this.pullUpDirty ? moreTxt : noMoreTxt
    },
    refreshTxt () {
      return (this.pullDownRefresh && '刷新成功')
    }
  },
  created () {
    this.pullDownInitTop = -50
  },
  mounted () {
    this.isPicture = this.$route.params.key === 'picture'
    console.log(this.$route)
    var me = this
    let id = parseInt(this.$route.params.id)
    if (isNaN(id) || id <= 0) {
      return
    }
    this.itemId = id
    me.isLoading = true
    let formData = new FormData()
    formData.append('id', id)
    me.api.process({
      file: 'Post',
      method: 'GetDiscover',
      data: formData,
      success: function (res) {
        me.allData = res.items
        me.items = res.items.slice(0, me.curNum)
        me.likes = res.likes
        me._initScroll()
      },
      error: function (res) {
        // me.$msg.showError(res.msg)
      },
      complete: function () {
        me.isLoading = false
      }
    })
  },
  methods: {
    refreshData () {
      var me = this
      let id = parseInt(this.$route.params.id)
      if (isNaN(id) || id <= 0) {
        return
      }
      this.itemId = id
      let formData = new FormData()
      formData.append('id', id)
      me.api.process({
        file: 'Post',
        method: 'GetDiscover',
        data: formData,
        success: function (res) {
          me.allData = res.items
          me.items = res.items.slice(0, me.curNum)
          me.likes = res.likes
        },
        error: function (res) {
          me.$msg.showError(res.msg)
        },
        complete: function () {
          // me.isLoading = false
        }
      })
    },
    showShare: function (item) {
      this.shareItem = item
      // this.$msg.showError('暂不能分享')
      this.isShare = !this.isShare
    },
    cancel () {
      this.isShare = !this.isShare
    },
    updateLikes (likes) {
      this.likes = likes
    },
    updateSaves (saves) {
      this.saves = saves
    },
    updateLikeReplys (likeReplys) {
      this.likeReplys = likeReplys
    },
    display () {
      this.isDisplayContent = !this.isDisplayContent
    },
    // 处理用户的评论
    handleComment () {
      let userMsg = {
        'userAvator': '/assets/images/avatar.jpg',
        'userName': '用户02',
        'commentCount': '12',
        'commentDetail': this.userComment
      }
      if (this.userComment.length > 0) {
        // 用户评论的信息传入到discuz页面
        this.$router.push({ name: 'discuz', params: { id: this.item.Id, userMsg } })
      }
    },
    increaseReplay: function (data) {
      this.$router.go(0)
    },
    goTopic (item) {
      if (item.CategoryId <= 0 || item.CategoryId === 99999) {
        return
      }
      this.$router.push({ name: 'topicItemss', params: { id: item.CategoryId } })
    },
    disable () {
      this.scroll && this.scroll.disable()
    },
    enable () {
      this.scroll && this.scroll.enable()
    },
    refresh () {
      this.scroll && this.scroll.refresh()
    },
    _initScroll () {
      // var me = this
      if (!this.$refs.itemWrapper) {
        return
      }
      // if (this.$refs.listWrapper && (this.pullDownRefresh || this.pullUpLoad)) {
      //   this.$refs.listWrapper.style.minHeight = `${getRect(this.$refs.itemWrapper).height + 1}px`
      // }
      let options = {
        probeType: this.probeType,
        click: this.click,
        scrollY: this.freeScroll,
        scrollX: false,
        scrollbar: this.scrollbar,
        pullDownRefresh: this.pullDownRefresh,
        pullUpLoad: this.pullUpLoad,
        startY: this.startY,
        freeScroll: this.freeScroll,
        mouseWheel: this.mouseWheel,
        bounce: this.bounce,
        zoom: this.zoom
      }
      this.scroll = new window.BScroll(this.$refs.itemWrapper, options)

      if (this.pullDownRefresh) {
        this._initPullDownRefresh()
      }

      if (this.pullUpLoad) {
        this._initPullUpLoad()
      }
    },
    _initPullDownRefresh () {
      this.scroll.on('pullingDown', () => {
        // console.log('down')
        this.beforePullDown = false
        this.isPullingDown = true
        this.refreshData()
        // this.$emit('pullingDown')
      })
      this.scroll.on('scroll', (pos) => {
        if (!this.pullDownRefresh) {
          return
        }
        if (this.beforePullDown) {
          this.bubbleY = Math.max(0, pos.y + this.pullDownInitTop)
          this.pullDownStyle = `top:${Math.min(pos.y + this.pullDownInitTop, 10)}px`
        } else {
          this.bubbleY = 0
        }
        if (this.isRebounding) {
          this.pullDownStyle = `top:${10 - (this.pullDownRefresh.stop - pos.y)}px`
        }
      })
    },
    _initPullUpLoad () {
      this.scroll.on('pullingUp', () => {
        this.isPullUpLoad = true
        // this.disable()
        // setTimeout(() => {
        this.curNum += 4
        this.items = this.allData.slice(0, this.curNum)
        // this.refresh()
        // this.enable()
        // }, 2000)
      })
    },
    forceUpdate (dirty) {
      if (this.pullDownRefresh && this.isPullingDown) {
        this.isPullingDown = false
        this._reboundPullDown().then(() => {
          this._afterPullDown()
        })
      } else if (this.pullUpLoad && this.isPullUpLoad) {
        this.isPullUpLoad = false
        this.scroll.finishPullUp()
        this.pullUpDirty = dirty
        this.refresh()
      } else {
        this.refresh()
      }
    },
    _reboundPullDown () {
      const { stopTime = 600 } = this.pullDownRefresh
      return new Promise((resolve) => {
        setTimeout(() => {
          this.isRebounding = true
          this.scroll.finishPullDown()
          resolve()
        }, stopTime)
      })
    },
    _afterPullDown () {
      setTimeout(() => {
        this.pullDownStyle = `top:${this.pullDownInitTop}px`
        this.beforePullDown = true
        this.isRebounding = false
        this.refresh()
      }, this.scroll.options.bounceTime)
    }
  }
}
</script>

<style lang="less" scope>
#appContent{
  overflow: hidden;
}
.ten-gray{
  height:10px;
  background-color:#efefef;
}
.page-content{
  position: relative;
  height:calc(100vh - 50px);
  overflow: hidden;
  .pulldown-wrapper {
    position: absolute;
    width: 100%;
    left: 0;
    display: flex;
    justify-content:center;
    align-items:center;
    transition: all;
    .after-trigger{
      margin-top: 10px;
    }
  }
  .pullup-wrapper{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 0;
  }
}
 .page__bd{
    .weui-panel{
      .itemcontent{
        width:90%;
        margin:auto;
        margin-top:4vw;
        margin-bottom:2vw;
         .seeMore{
          font-size:4.1vw;
          font-weight: bold;
        }
      }
      .user_use{
        width:98%;
        margin:auto;
      }
    }
    .comment_list{
        margin-top:2vw;
        .comment_ul{
          background-color:rgb(243, 243, 243);
          border-radius: 3vw;
          width:97%;
          margin:auto;
          .viewcomments{
            padding-left: 14px;
            color: #989898;
          }
        }
      }
  }
  .big{
    .icon-wjx-shixin:before {
    color:rgb(253, 217, 0) !important;
  }
  .icon-redxin-copy:before {
    color:red !important;
  }

}
.user_login_type .tianv--pngicon-weixin:before {
    width: 23px;
}
</style>
