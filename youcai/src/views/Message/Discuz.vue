<template>
  <div class="messageDWrap">
    <div class="load"
         v-if="isLoad">
      <loading></loading>
    </div>
    <div class="messageMain">
      <scroll ref="scroll"
              :data="Dicuzmsg"
              :scrollbar="scrollbarObj"
              :pullDownRefresh="pullDownRefreshObj"
              :pullUpLoad="pullUpLoadObj"
              :startY="parseInt(startY)"
              @pullingDown="onPullingDown"
              @pullingUp="onPullingUp">
        <ul class="commentUl">
          <!-- <li class="borderB" v-for="(comment,index) in Dicuzmsg" :key="index">
            <div class="commentHead">
              <div class="MyAvatar">
                <img src="http://img4.imgtn.bdimg.com/it/u=1671789140,435698588&fm=26&gp=0.jpg" alt="">
              </div>
              <div class="myMsg">
                <span>miluhua麋鹿</span>
                <span>2019-02-21</span>
                <span>厉害了，一定会瘦</span>
              </div>
            </div>
            <div class="commentMiddle">
              <div class="main">
                <span>@小富婆&nbsp;</span>
                <span>厉害了，一定会瘦,的案件十分电视机分厘卡就撒地方按附件爱林俊杰发上帝就发ask极度疯狂垃圾地方 对方哈哈哈哈</span>
              </div>
              <div class="commentMsg">
                <img src="http://img.52z.com/upload/news/image/20171114/20171114060729_57737.jpg" alt="">
              </div>
            </div>
            <div class="commentBottom">
              <div class="one">
                  <span>阅读&nbsp;</span>
                  <span>11315</span>
                </div>
                <div class="two">
                  <span>
                    <i class="icon iconfont icon-icon_subinfobox1 myLike icon-favorites"></i>
                    <i>4</i>
                  </span>
                  <span>
                    <i class="icon-icon_subinfobox1 icon-xiaoxi1 icon iconfont myLike"></i>
                  </span>
              </div>
            </div>
          </li> -->
          <li class="commentLi borderB"
              v-for="(eachComment, index) in Dicuzmsg"
              :key="index">
            <div class="userAvatar"
                 @click="goHome(eachComment)">
              <img :class="{defaultStyle: eachComment.avatar === null}"
                   :src="eachComment.avatar === null ? defaultUserAvatar : eachComment.avatar"
                   alt="">
            </div>
            <div class="commentMes">
              <span>{{eachComment.nickName}}</span>&nbsp;<span>{{eachComment.title}}了您的动态</span>
            </div>
            <span class="time">{{eachComment.createTime.substring(0,10)}}</span>
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
  name: 'home',
  mixins: [scrollMixin],
  data () {
    return {
      defaultUserAvatar: 'http://webapp.szwanwan.com/img/default/defaultavatar.png',
      Dicuzmsg: [],
      isLoad: true, // 是否正在加载
      isFail: false, // 是否加载失败
      failTitle: '还没有你参与的评论回复哦',
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
  computed: {
    ...mapState(['user'])
  },
  components: {
    Loading,
    NotFound,
    scroll
  },
  mounted () {
    this.getCommentList()
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
     * getLikeMessageList获得评论消息列表
     */
    getCommentList () {
      let me = this
      me.api.get({
        url: `Message/id?MessageType=${2}&PageIndex=${me.curPage}&PageSize=${me.pageSize}`,
        success: function (res) {
          me.curPage === 1 && (me.Dicuzmsg = [])
          me.Dicuzmsg = me.Dicuzmsg.concat(res.list)
          if (me.Dicuzmsg.length > 0) {
            me.isLoad = false
            me.isFail = false
          } else if (me.Dicuzmsg.length === 0) {
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
      this.getCommentList()
    },
    onPullingUp () {
      // 更新数据
      this.curPage++
      this.getCommentList()
    },
    handleLike (Id) {
      this.Dicuzmsg.forEach(item => {
        if (item.id === Id) {
          item.IsLike = !item.IsLike
          if (item.IsLike) {
            item.commentslikecount--
          } else {
            item.commentslikecount++
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.messageDWrap{
  width:100%;
  height:100%;
  .messageMain{
    width:100%;
    height:calc(100vh - 12vw);
    .commentUl{
      width:100%;
      margin-top:1.5vw;
      .commentLi{
        padding:4vw;
        box-sizing: border-box;
        display:flex;
        justify-content: space-between;
        align-items: center;
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
        .commentMes{
          width:55vw;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
          span:nth-child(1) {
            display:inline-block;
            font-size:3.8vw;
            font-weight: bold;
            color:#333;
          }
          span:nth-child(2) {
            font-size:3.8vw;
            color:#333;
          }

        }
        .time{
          font-size:3.8vw;
          color:#999;
        }
      }
      // li{
      //   padding:4vw;
      //   box-sizing: border-box;
      //   .commentHead{
      //     width:100%;
      //     display:flex;
      //     .MyAvatar{
      //       width:11.85vw;
      //       height:11.85vw;
      //       border-radius: 50%;
      //       overflow: hidden;
      //       border:1px solid rgb(243,243,243);
      //       img{
      //         width:11.85vw;
      //         height:auto;
      //       }
      //     }
      //     .myMsg{
      //       margin-left:3.2vw;
      //       span:nth-child(1) {
      //         color:#262626;
      //         font-size:3.7vw;
      //         display:block;
      //         font-weight: bold;
      //       }
      //       span:nth-child(2) {
      //         color:#a2a2a2;
      //         font-size:3vw;
      //         display:block;
      //       }
      //       span:nth-child(3) {
      //         color:#686868;
      //         font-size:3.7vw;
      //         display:block;
      //       }
      //     }
      //   }
      //   .commentMiddle{
      //     width:100%;
      //     height:20.65vw;
      //     background-color:rgb(245, 245, 245);
      //     border-radius: 2vw;
      //     font-size:3.7vw;
      //     display:flex;
      //     margin-top:2vw;
      //     .main{
      //       width:72.22vw;
      //       height:100%;
      //       padding:2vw;
      //       box-sizing: border-box;
      //       overflow: hidden;
      //       text-overflow:ellipsis;//文本溢出显示省略号
      //       display: -webkit-box;
      //       -webkit-line-clamp: 3;
      //       -webkit-box-orient: vertical;
      //       span:nth-child(1) {
      //         color:rgb(255, 39, 66);
      //       }
      //       span:nth-child(2) {
      //         color:#a2a2a2;
      //       }
      //     }
      //     .commentMsg{
      //       width:20.65vw;
      //       height:20.65vw;
      //       border-radius: 2vw;
      //       overflow: hidden;
      //       img{
      //         width:20.65vw;
      //         height:auto;
      //       }
      //     }
      //   }
      //   .commentBottom{
      //     display:flex;
      //     height:8.8vw;
      //     align-items: center;
      //     justify-content: space-between;
      //     .one{
      //       font-size:3.7vw;
      //       color:#686868;
      //     }
      //     .two{
      //       span:nth-child(1) {
      //         i{
      //           font-style: normal;
      //           color:#686868;
      //           font-size:3.4vw;
      //         }
      //         .myLike{
      //             color:#686868;
      //             font-weight: bold;
      //             font-size:5vw;
      //             margin-right:0.5vw;
      //         }
      //       }
      //       span:nth-child(2) {
      //         margin-right:2vw;
      //         margin-left:10vw;
      //          i{
      //           font-style: normal;
      //         }
      //         .myLike{
      //             color:#686868;
      //             font-weight: bold;
      //             font-size:5vw;
      //             margin-right:2vw;
      //         }
      //       }
      //     }
      //   }
      // }
    }
    .noData{
      padding-top:5vw;
      box-sizing: border-box;
      width:100%;
      height:100vw;
      border:1px solid white;
    }
  }
}
</style>
