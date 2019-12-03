<template>
  <div class="followTopicWrap">
    <!-- <div class="load" v-if="isLoad">
            <loading></loading>
        </div> -->
    <div class="scrollTopicWrap">
      <scroll ref="scroll"
              :data="topicAttentionList"
              :scrollbar="scrollbarObj"
              :pullDownRefresh="pullDownRefreshObj"
              :pullUpLoad="pullUpLoadObj"
              :startY="parseInt(startY)"
              @pullingDown="onPullingDown"
              @pullingUp="onPullingUp">
        <div class="myFollowTopic"
             v-if="!isLoad">
          <div :class="[{split:routerType === 1},{noSplit: routerType === 2}]"></div>
          <div :class="[{TopicHead:routerType === 1},{borderB:routerType === 1},{noHeight:routerType === 2}]">
            <span v-show="routerType === 1">你可能感兴趣的话题</span>
          </div>
          <div class="followMain">
            <TopicList v-show="routerType === 1"
                       :topicAttentionList="recommendTopicList"
                       :isAttention='false'></TopicList>
          </div>
          <div class="intersetTopic"></div>
          <div :class="[{split:routerType === 1},{noSplit: routerType === 2}]"></div>
          <div class="TopicHead borderB">
            <span>{{routerType === 1 ? '我关注的话题' :'他关注的话题'}}</span>
          </div>
          <div class="followMain">
            <TopicList :topicAttentionList="topicAttentionList"
                       :isAttention='true'></TopicList>
          </div>
        </div>
        <div>
          <NotFound :failTitle="failTitle"
                    v-if="isFail"></NotFound>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
import TopicList from '@/components/RecommendFollow/TopicList'
import Loading from '@/components/requestState/Loading'
import NotFound from '@/components/requestState/NotFound'
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
export default {
    mixins: [scrollMixin],
  data () {
    return {
      routerId: this.$route.params.id,
      routerType: parseInt(this.$route.params.type), // 1表示我的关注页，2表示别人的关注页
      pullDownRefresh: true,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: true,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更多数据了',
      isLoading: true,
      items: [],
      curPage: 1,
      pageSize: 7,
      isLoad: true, // 是否正在加载
      isFail: false, // 是否加载失败
      failTitle: '还没有关注的话题哦!',
      recommendTopicList: [], // 推荐关注话题列表
      topicAttentionList: [] // 话题关注列表
    }
  },
  components: {
    TopicList,
    Loading,
    NotFound,
    scroll,
  },
  // props: ['routerId','routerType'],
  mounted () {
    this.getTopicAttention()
    this.getRecommendList()
  },
  methods: {
      /**
       * getTopicAttention 获得关注话题列表
       */
      getTopicAttention () {
        let me = this
        let userId = this.routerId
        let TopicUrl = ''
       if (me.routerType === 1) {
          TopicUrl = `TopicAttention?PageIndex=${me.curPage}&PageSize=${me.pageSize}`
       } else {
          TopicUrl = `TopicAttention?UserId=${userId}&PageIndex=${me.curPage}&PageSize=${me.pageSize}`
      }
      me.api.get({
        url: TopicUrl,
        success: function (res) {
          // me.topicAttentionList = res
          me.curPage === 1 && (me.topicAttentionList = [])
          me.topicAttentionList = me.topicAttentionList.concat(res)
          if (me.topicAttentionList.length > 0) {
            me.isLoad = false
            me.isFail = false
          } else if (me.topicAttentionList.length === 0) {
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
      this.getTopicAttention()
    },
    onPullingUp () {
      // 更新数据
      this.curPage++
      this.getTopicAttention()
    },
    /**
      * getRecommendList 获得推荐关注话题的列表
    */
    getRecommendList () {
      let me = this
      let PageSize = 4
      me.api.get({
        url: `Topic?PageSize=${PageSize}`,
        success: function (res) {
          me.recommendTopicList = res
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.followTopicWrap{
    width:100%;
    height:calc(100vh - 30vw);
    overflow: hidden;
    .split{
        width:100%;
        height:2.77vw;
        background-color:var(--mBg);
    }
    .noSplit{
        height:0.1vw;
        background: white;
    }
    .TopicHead{
        padding-left:4vw;
        box-sizing: border-box;
        width:100%;
        height:13.43vw;
        line-height:13.43vw;
        font-size:4vw;
        color:#333333;
    }
    .noHeight{
        height:0.1vw;
        background: white;
    }
    .scrollTopicWrap{
      height:calc(100vh - 30vw);
      overflow: hidden;
    }
}
</style>
