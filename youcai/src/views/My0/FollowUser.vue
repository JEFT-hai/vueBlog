<template>
  <div class="followUserWrap">
    <div class="followUserScroll">
      <scroll ref="scroll"
              :data="items"
              :scrollbar="scrollbarObj"
              :pullDownRefresh="pullDownRefreshObj"
              :pullUpLoad="pullUpLoadObj"
              :startY="parseInt(startY)"
              @pullingDown="onPullingDown"
              @pullingUp="onPullingUp">
        <div class="followUserContainer"
             id="userContainer">
          <div :class="[{recommendMain:routerType === 1},{noHeight: routerType === 2}]"
               ref="recommendH"
               v-if="recommendList.length  && isShowRecommend">
            <recommend :isLogin="isLogin"
                       v-if="routerType === 1"
                       @hiddleRecommend="hiddleRecommend"></recommend>
          </div>
          <div class="friendWrap"
               v-show="!isLoad">
            <div class="title"
                 ref="titleH">{{routerType === 1 ? '我关注的好友' : '他关注的好友'}}</div>
            <ul class="allFollowFirend borderT"
                id="allFollowH">
              <UserMessage v-for="(eachUser,index) in items"
                           :key="index"
                           :userMessage="eachUser"
                           :isAttentionId="isAttentionId"
                           :isMyFollow="isMyFollow"></UserMessage>
            </ul>
          </div>
          <div :class="['noFollowList',{followListed:items.length >= 3}]"
               ref="noFollowH">
            <NotFound failTitle="还没有关注的人哦"
                      v-show="isNoData"></NotFound>
          </div>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
import recommend from '@/components/RecommendFollow/Recommend'
import UserMessage from '@/components/userMessage'
import NotFound from '@/components/requestState/NotFound'
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
export default {
  mixins: [scrollMixin],
  data () {
    return {
      routerId:this.$route.params.id,
      routerType: parseInt(this.$route.params.type), // 1表示我的关注页，2表示别人的关注页
      isNoData: false,
      isAttentionId: true, // 表示是关注页，，要用attentionUserId才是关注的用户id,而userId是他自己
      isShowRecommend: true, // 是否显示推荐列表
      recommendList: [],// 推荐的用户列表
      isLoad: true, // 是否正在加载
      isFail: false, // 是否加载失败
      failTitle: '还没有关注的人哦!',
      isLogin: true, // 表示用户已经登录
      pullDownRefresh: true,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: true,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更多数据了',
      isLoading: true,
      items: [], // 关注的用户列表
      curPage: 1,
      pageSize: 6
    }
  },
  // props: ['routerId', 'routerType'],
  components: {
    scroll,
    recommend,
    UserMessage,
    NotFound
  },
  watch: {
    formLoading: function (isLoading) {
      let me = this
      me.$msg.updateLoading(isLoading)
    },
    isLoading () {
      return !this.items.length
    },
    show () {
      if (this.show && this.curPage === 1) {
        this.getFollowList()
      }
    },

  },
  computed: {
    isMyFollow () {
      if (this.routerType === 1) {
        return true
      } else {
        return false
      }
    }
  },
  created () {
    this.getFollowList()
    this.getRecommend()
  },
  
  methods: {
    hiddleRecommend () {
      this.isShowRecommend = false
    },
    /**
     * 推荐用户列表
     */
    getRecommend () {
      let me = this
      me.api.get({
        url: 'UserRecommend',
        success: function (res) {
          me.recommendList = me.recommendList.concat(res)
        }
      })
    },
    // 获取关注页的数据
    getFollowList () {
      let me = this
      let fansUrl = ''
      if (me.routerType === 1) {
        fansUrl = `UserAttention/id?PageIndex=${me.curPage}&PageSize=${me.pageSize}`
      } else {
        let UserId = me.routerId
        fansUrl = `UserAttention/id?UserId=${UserId}&PageIndex=${me.curPage}&PageSize=${me.pageSize}`
      }
      me.api.get({
        url: fansUrl,
        success: function (res) {
          me.curPage === 1 && (me.items = [])
          me.items = me.items.concat(res)
          if (me.items.length > 0) {
            me.isLoad = false
            me.isFail = false
          } else if (me.items.length === 0) {
             me.isNoData = true
            me.isLoad = false
            me.isFail = true
          }
        },
        error: function (res) {
          me.$msg.showError(res.msg)
          me.$refs.scroll && me.$refs.scroll.forceUpdate()
        },
        complete: function () {
          me.$refs.scroll && me.$refs.scroll.forceUpdate()
          // me.isLoading = false
        }
      })
    },
    onPullingDown () {
      this.curPage = 1
      this.getFollowList()
    },
    onPullingUp () {
      // 更新数据
      this.curPage++
      this.getFollowList()
    }
  }
}
</script>

<style lang="less" scoped>
.followUserWrap{
    width:100%;
    .followUserScroll{
      width:100%;
      height:calc(100vh - 25vw);
      overflow: hidden;
      .followUserContainer{
        .recommendMain{
            height:72vw;
            box-sizing: border-box;
        }
        .noHeight{
          height:0.5vw;
        }
        .friendWrap{
            width:100%;
            box-sizing: border-box;
            .title{
                height:11vw;
                line-height:11vw;
                font-size:3.7vw;
                padding-left:4vw;
                box-sizing: border-box;
            }
            .allFollowFirend{
              padding-top:2vw;
              box-sizing: border-box;
              .noFollowList{
                height:90vw;
                width:100%;
              }
              .followListed{
                height:10vw;
              }
            }
        }
      }
    }
}
</style>
