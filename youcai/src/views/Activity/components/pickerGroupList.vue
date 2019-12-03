<template>
  <transition name="toLeft">
    <div class="myGroupListPage">
      <div class="tabNav">
            <i class="iconWanwan iconWfanhui activityNotice" @click='hideGroupMask'></i>
            <p>群组列表</p>
        </div>
      <div class="load" v-if="isLoad">
        <Loading></Loading>
      </div>
      <div class="groupListWrap" v-else>
        <scroll
          ref="scroll"
          :data="createGroupList"
          :scrollbar="scrollbarObj"
          :pullDownRefresh="pullDownRefreshObj"
          :pullUpLoad="pullUpLoadObj"
          :startY="parseInt(startY)"
          @pullingDown="onPullingDown"
          @pullingUp="onPullingUp"
        >
          <div class="myGroups">
            <div class="myCreateGroup">
              <ul id="groupUl">
                <group-item
                  v-for="(item, index) in createGroupList"
                  @click.native="chooseGroup(item)"
                  :key="index"
                  :item="item"
                ></group-item>
              </ul>
            </div>
          </div>
        </scroll>
      </div>
    </div>
  </transition>
</template>

<script>
// import groupList from '@/components/RecommendFollow/GroupList'
import groupItem from '@/components/List/groupItem'
// import RecommendGroupList from '@/components/RecommendFollow/recommendGroupList'
import Loading from '@/components/requestState/Loading'
import NotFound from '@/components/requestState/NotFound'
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
import { mapState } from 'vuex'
export default {
  mixins: [scrollMixin],
  components: {
    scroll,
    // userMessage,
    Loading,
    NotFound,
    // groupList,
    groupItem
  },
  props: {},
  computed: {
    ...mapState(['pos'])
  },
  data() {
    return {
      isLoad: true, // 是否正在加载
      isFail: false, // 是否加载失败
      failTitleBoth: '没有任何群组哦!',
      failTitleOne: '还没有创建的群组哦!',
      failTitleTwo: '还没有加入的群组哦!',
      pullDownRefresh: false, // 表示是否上拉刷新
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: false,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更过数据了',
      isLoading: true,
      curPage: 1,
      pageSize: 7,
      createGroupList: [] // 我创建的群组
    }
  },
  mounted() {
    this.getCreateGropList()
  },
  methods: {
    /**
     * getCreateGropList得到我创建的群组列表
     */
    getCreateGropList() {
      let me = this
      let url = `UserGroupList?PageIndex=1&PageSize=50&GroupType=1`
      if (me.pos.longitude && me.pos.latitude) {
        url = `${url}&Lon=${me.pos.longitude}&Lat=${me.pos.latitude}`
      }
      me.api.get({
        url: url,
        success: function(res) {
          me.createGroupList.length && (me.isFail = false)
          me.createGroupList = res
          console.log('我创建的群组')
        },
        complete: function() {
          me.isLoad = false
        }
      })
    },
    onPullingUp() {
      this.curPage++
      this.getGroupList()
    },
    onPullingDown() {
      this.curPage = 1
      this.getGroupList()
    },
    chooseGroup(item) {
      this.$emit('chooseGroup', item)
    },
    hideGroupMask () {
        this.$emit('hideGroupMask')
    }
  }
}
</script>

<style lang="less" scoped>
.myGroupListPage {
  position: fixed;
  top: 0;
  left: 0;
  width:100vw;
  height: 100vh;
  padding-top: 12vw;
  box-sizing: border-box;
  background: #fff;
  overflow: hidden;
  z-index: 10000;
  &.toLeft-enter-active,
  &.toLeft-leave-active {
    transition: all 0.5s linear;
  }
  &.toLeft-enter,
  &.toLeft-leave-to {
    transform: translate3d(100%, 0, 0);
  }
  .groupTitle {
    width: 100%;
    height: 7vw;
    padding: 0 4vw;
    box-sizing: border-box;
    margin-bottom: 4vw;
    margin-top: 5vw;
  }
}
.followGroupWrap {
  width: 100%;
  height: 100%;
  .groupHead {
    width: 100%;
    height: 75.46vw;
    background-color: rgb(250, 250, 250);
    padding-left: 4vw;
    padding-top: 7.8vw;
    box-sizing: border-box;
    .headTitle {
      font-size: 4vw;
      color: #333333;
    }
    .headContent {
      width: 100%;
      height: 60vw;
      padding-top: 2vw;
      box-sizing: border-box;
    }
  }
  .grounpJoin {
    width: 100%;
    .joinTitle {
      height: 13.52vw;
      line-height: 13.52vw;
      font-size: 4vw;
      color: #333333;
      padding-left: 4vw;
    }
    .split {
      width: 100%;
      height: 3.7vw;
      background-color: rgb(249, 249, 249);
    }
    .commonMain {
      padding-left: 4vw;
      box-sizing: border-box;
    }
  }
}
</style>
