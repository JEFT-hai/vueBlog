<template>
  <div class="fansListUl">
    <div class="fanListWrap">
      <scroll ref="scroll"
              :data="items"
              :scrollbar="scrollbarObj"
              :pullDownRefresh="pullDownRefreshObj"
              :pullUpLoad="pullUpLoadObj"
              :startY="parseInt(startY)"
              @pullingDown="onPullingDown"
              @pullingUp="onPullingUp">
        <div class="myFans">
          <div class="noData"
               v-show="isFail">
            <NotFound :failTitle="failTitle"></NotFound>
          </div>
          <ul id="fanUl"
              v-show="!isLoad">
            <userMessage :userMessage="user"
                         v-for="(user,index) in items"
                         :key="index"></userMessage>
          </ul>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
import NotFound from '@/components/requestState/NotFound'
import userMessage from '@/components/userMessage'
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
export default {
  mixins: [scrollMixin],
  components: {
    scroll,
    userMessage,
    NotFound
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    // routerType: {
    //   type: Number
    // },
    // routerId: {
    //   type: String
    // }
  },
  data () {
    return {
      routerId: this.$route.params.id,
      routerType: parseInt(this.$route.params.routerType), // 1表示我的关注页，2表示别人的关注页
      isLoad: true, // 是否正在加载
      isFail: false, // 是否加载失败
      failTitle: '还没有粉丝哦!',
      pullDownRefresh: false, // 下拉刷新
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: true,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更多数据了',
      isLoading: true,
      items: [],
      curPage: 1,
      pageSize: 7
    }
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
        this.getFansList()
      }
    }
  },
  created () {
    this.getFansList()
  },
  methods: {
    // 获取粉丝页的数据
    getFansList () {
      let me = this
      let fansUrl = ''
      if (me.routerType === 1) {
        fansUrl = `UserAttention?PageIndex=${me.curPage}&PageSize=${me.pageSize}`
      } else {
        let UserId = me.routerId
        fansUrl = `UserAttention?UserId=${UserId}&PageIndex=${me.curPage}&PageSize=${me.pageSize}`
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
            me.isLoad = false
            me.isFail = true
          }
        },
        error: function () {
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
      this.getFansList()
    },
    onPullingUp () {
      // 更新数据
      this.curPage++
      this.getFansList()
    }
  }
}
</script>

<style lang="less" scoped>
    .fansListUl{
      height:100%;
      position:relative;
      top:0;
      left:0;
      z-index: 1000;
      .fanListWrap{
        height:calc(100vh - 25vw);
        overflow: hidden;
        .myFans{
          .noData{
            margin-top:20vw;
            border:1px solid white;
          }
        }
      }
    }
</style>
