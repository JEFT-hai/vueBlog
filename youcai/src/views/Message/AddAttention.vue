<template>
  <div class="attentionWrap">
    <div class="load"
         v-if="isLoad">
      <loading></loading>
    </div>
    <div class="attenInner">
      <scroll ref="scroll"
              :data="attentionList"
              :scrollbar="scrollbarObj"
              :pullDownRefresh="pullDownRefreshObj"
              :pullUpLoad="pullUpLoadObj"
              :startY="parseInt(startY)"
              @pullingDown="onPullingDown"
              @pullingUp="onPullingUp">
        <ul>
          <li class="attentionLi borderB"
              v-for="(attention,index) in attentionList"
              :key="index">
            <div class="userAvatar"
                 @click="goHome(attention)">
              <img :class="{defaultStyle: attention.avatar === null}"
                   :src="attention.avatar === null ? defaultUserAvatar : attention.avatar "
                   alt="">
            </div>
            <div class="userMessage">
              <div class="whoFollow">
                <span>{{attention.nickName}}&nbsp;</span>
                <span>开始{{attention.title}}你了</span>
              </div>
              <span class="time">{{attention.createTime.substring(0,10)}}</span>
            </div>
            <div class="goFollow">
              <!-- <BtnFollow :item="attention"></BtnFollow> -->
            </div>
          </li>
        </ul>
        <div class="noData">
          <NotFound :failTitle="failTitle"
                    v-if="isFail"></NotFound>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
import Loading from '../../components/requestState/Loading'
import NotFound from '../../components/requestState/NotFound'
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
import { mapState } from 'vuex'
export default {
  mixins: [scrollMixin],
  data () {
    return {
      defaultUserAvatar: 'http://webapp.szwanwan.com/img/default/defaultavatar.png',
      attentionList: [], // 新增关注的内容
      isLoad: true, // 是否正在加载
      isFail: false, // 是否加载失败
      failTitle: '还没有新增的粉丝哦',
      pullDownRefresh: true,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: true,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更过数据了',
      isLoading: true,
      items: [],
      curPage: 1,
      pageSize: 7
    }
  },
  components: {
    Loading,
    NotFound,
    scroll
  },
  mounted () {
    this.getAddentionList()
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    goHome (item) {
       if (item.userId === this.user.userId) { // 去到我的主页
          this.$router.push({ name: 'my' })
        } else { // 去到别人的主页
          this.$router.push({ name: 'discoverUser', params: { id: item.userId } })
        }
    },
    /**
     * getAddentionList获得评论消息列表
    */
    getAddentionList () {
      let me = this
      me.api.get({
        url: `Message/id?MessageType=${3}&PageIndex=${me.curPage}&PageSize=${me.pageSize}`,
        success: function (res) {
          me.curPage === 1 && (me.attentionList = [])
          me.attentionList = me.attentionList.concat(res.list)
          if (me.attentionList.length > 0) {
            me.isLoad = false
            me.isFail = false
          } else if (me.attentionList.length === 0) {
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
        }
      })
    },
    onPullingDown () {
      this.curPage = 1
      this.getAddentionList()
    },
    onPullingUp () {
      // 更新数据
      this.curPage++
      this.getAddentionList()
    },
  }
}
</script>

<style lang="less" scoped>
.attentionWrap{
    width:100%;
    height:100%;
    .attenInner{
      height:calc(100vh - 12vw);
      width:100%;
      .noData{
        border:1px solid white;
        width:100%;
        height:80vw;
        padding-top:5vw;
        box-sizing: border-box;
      }
    }
    ul{
        width:100%;
        .attentionLi{
            width:100%;
            height:21.3vw;
            padding:4vw;
            box-sizing: border-box;
            display:flex;
            justify-content: space-between;
            .userAvatar{
              width:11.57vw;
              height:11.57vw;
              border-radius: 50%;
              overflow: hidden;
              border:1px solid rgb(243,243,243);
              position:relative;
              img{
                position:absolute;
                top:0;
                bottom:0;
                right:0;
                left:0;
                margin:auto;
                width:100%;
                height:100%;
              }
              .defaultStyle{
                width:9vw;
                height:9vw;
              }
            }
            .userMessage{
                width:54.63vw;
                height:100%;
                font-size:0;
                .whoFollow{
                    width:100%;
                    span:nth-child(1) {
                        display:inline-block;
                        width:27vw;
                        overflow:hidden;
                        text-overflow:ellipsis;
                        white-space:nowrap;
                        font-size:3.8vw;
                        font-weight: bold;
                        color:#333;
                    }
                    span:nth-child(2) {
                        display:inline-block;
                        width:25vw;
                        overflow:hidden;
                        text-overflow:ellipsis;
                        white-space:nowrap;
                        font-size:3.8vw;
                        color:#333;
                    }
                }
                .time{
                    font-size:3.14vw;
                    color:#999;
                }
            }
            .goFollow{
                width:21.02vw;
                height:100%;
                display:flex;
                justify-content: center;
                align-items: center;
            }
        }
    }
}
</style>
