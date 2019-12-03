<template>
  <div v-if='show' class="reCommentsPlate">
    <h3>共 {{itm.total}} 条回复
      <span @click="hideReCommentsPlate">x</span>
    </h3>
    <div class="reCommentsList">
      <scroll ref="scroll"
                :data="items"
                :scrollbar="scrollbarObj"
                :pullDownRefresh="pullDownRefreshObj"
                :pullUpLoad="pullUpLoadObj"
                :startY="parseInt(startY)"
                @pullingDown="onPullingDown"
                @pullingUp="onPullingUp"
        >
        <ul>
          <recommentsItem class="CommentT" :item='itm' />
          <recommentsItem :item='itm' />
          <recommentsItem :item='itm' />
          <!-- <recommentsItem v-for="(item, index) in items"  :item='item' :key='index' /> -->
          <!-- <li v-for="(item, index) in items" :key='index'>
            <a class="avatar">
                <img :src="config.imageOrigin + item.userAvator" alt v-if="item != null" />
            </a>
            <div class='discuzInfo'>
                <p class="title">{{item.userName}}</p>
                <p class="comments">{{item.commentDetail}}</p>
                <div class="bottomInfo">
                  <p class="createTime" v-if='item.createTime.length > 12'>{{item.createTime.substr(5,11)}}</p>
                  <p class="createTime" v-else>{{item.createTime}}</p>
                  <p class="reComment">
                    <i>s</i>
                    <span>{{item.total}}</span>
                  </p>
                </div>
            </div>
          </li> -->
        </ul>
      </scroll>
    </div>
    <UserInput :activetyId = parseInt(activetyId) :toUser='itm' @updateComments='updateComments' />
  </div>
</template>
<script>
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
import UserInput from './userInputComments'
import recommentsItem from './reCommentsItem'
export default {
  mixins: [scrollMixin],
  components: {
    scroll,
    UserInput,
    recommentsItem
  },
  props: {
    activetyId: {
      type: Number,
      required: false
    },
    itm: {
      type: Object,
      required: false
    },
    show: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      pullDownRefresh: false,
      pullUpLoad: true,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更过数据了',
      items: [],
      curPage: 1,
      pageSize: 10
    }
  },
  mounted () {
    this.getActivetyDetailComments()
  },
  methods: {
    getActivetyDetailComments () {
      var me = this
      let formData = new FormData()
      // formData.append('activetyId', me.activetyId)
      formData.append('activityCommentId', me.itm.activityCommentId)
      formData.append('pageIndex', me.curPage)
      formData.append('pageSize', me.pageSize)
      me.api.process({
        file: 'Activity',
        method: 'ChildActivityComments',
        data: formData,
        success: function (res) {
          console.log(res, 121)
          me.items = me.items.concat(res.list)
        },
        error: function (res) {
          // me.$msg.showError(res.msg)
          me.$refs.scroll && me.$refs.scroll.forceUpdate()
        },
        complete: function () {
          me.$refs.scroll && me.$refs.scroll.forceUpdate()
        }
      })
    },
    hideReCommentsPlate () {
      this.$emit('hideReCommentsPlate')
    },
    updateComments (data) {
      this.items.unshift(data)
    },
    onPullingDown () {
    },
    onPullingUp () {
      // 更新数据
    //   this.curPage++
      this.getActivetyDetailComments()
    }
  }
}
</script>
<style lang="less">
.reCommentsPlate{
  position: fixed;
  z-index: 10001;
  background:#fff;
  height: 100vh;
  width:100vw;
  top: 0;
  left:0;
//   overflow:hidden;
  .list-wrapper{
    background-color: #fafafa;
  }
  .userInputComments{
    position: absolute;
    width:100vw;
    bottom: 0;
    left:0;
  }
  h3{
    position: relative;
    height:12.5vw;
    line-height:12.5vw;
    font-size: 4vw;
    color: #393939;
    text-align:center;
    font-weight: bold;
    border-bottom: 1px solid #e5e5e5;
    span{
      position: absolute;
      width: 12.5vw;
      height: 12.5vw;
      right:0;
      top: 0;
      text-align: center;
      line-height:12.5vw;
      font-size: 4vw;
    }
  }
  .reCommentsList {
    height: calc(100vh - 100px);
    background-color: #fafafa;
    ul{
      overflow: hidden;
      li{
        background: #f6f6f6;
        &::after{
          left: 17.866vw;
        }
      }
      .CommentT{
        background:#fff;
      }
    }
  }
}
</style>
