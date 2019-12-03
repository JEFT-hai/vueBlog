<template>
  <div class="rankListPage">
    <span class="rankHead">{{changeColor === 1 ? '人点赞排行榜' : '群点赞排行榜'}}</span>
    <div class="topThreeWrap">
      <div class="topOne">
        <div class="siver"
             @click="goHome(beforeThree[1])">
          <img :src="changeColor === 1 ? beforeThree[1].avatar : beforeThree[1].groupCover"
               alt="">
        </div>
        <div class="score">
          <img src="../../assets/voteImage/yin_meitu.png"
               alt="">
        </div>
        <div class="detailMsg">
          <span class="name">{{changeColor === 1 ? beforeThree[1].nickName : beforeThree[1].groupName}}</span>
          <span class="count">{{changeColor === 1 ? beforeThree[1].likeCount : beforeThree[1].countLike}}票</span>
        </div>
      </div>
      <div class="topTwo">
        <img src="../../assets/voteImage/one.png"
             alt=""
             class="numberOne">
        <div class="gold"
             @click="goHome(beforeThree[0])">
          <img :src="changeColor === 1 ? beforeThree[0].avatar : beforeThree[0].groupCover"
               alt="">
        </div>
        <div class="detailMsg">
          <span class="name">{{changeColor === 1 ? beforeThree[0].nickName : beforeThree[0].groupName}}</span>
          <span class="count">{{changeColor === 1 ? beforeThree[0].likeCount : beforeThree[0].countLike}}票</span>
        </div>
        <div class="score">
          <img src="../../assets/voteImage/jin_meitu.png"
               alt="">
        </div>
      </div>
      <div class="topThree">
        <div class="bronze"
             @click="goHome(beforeThree[2])">
          <img :src="changeColor === 1 ? beforeThree[2].avatar : beforeThree[2].groupCover"
               alt="">
        </div>
        <div class="score">
          <img src="../../assets/voteImage/tong_meitu.png"
               alt="">
        </div>
        <div class="detailMsg">
          <span class="name">{{changeColor === 1 ? beforeThree[2].nickName : beforeThree[2].groupName}}</span>
          <span class="count">{{changeColor === 1 ? beforeThree[2].likeCount : beforeThree[2].countLike}}票</span>
        </div>
      </div>
    </div>
    <div class="rankListWrap">
      <scroll ref="scroll"
              :data="items"
              :scrollbar="scrollbarObj"
              :pullDownRefresh="pullDownRefreshObj"
              :pullUpLoad="pullUpLoadObj"
              :startY="parseInt(startY)"
              @pullingDown="onPullingDown"
              @pullingUp="onPullingUp">
        <ul class="listUl">
          <li v-for="(oneItem, index) in after"
              :key="index"
              @click="goHome(oneItem)">
            <span class="medalState">{{changeColor === 1 ? (userLikeList.length > 3 ? index + 4 : index + 1) : (groupLikeList.length > 3 ? index + 4 : index + 1)}}</span>
            <div class="medalWrap borderB">
              <div class="medalAvatar"
                   v-if="oneItem">
                <img :src="changeColor === 1 ? oneItem.avatar : oneItem.groupCover"
                     alt="">
              </div>
              <span class="medalName">{{changeColor === 1 ? oneItem.nickName : oneItem.groupName}}</span>
              <span class="medalCount">{{changeColor === 1 ? oneItem.likeCount :oneItem.countLike}}票</span>
            </div>
          </li>
        </ul>
      </scroll>
    </div>
  </div>
</template>

<script>
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
import {mapState, mapMutations} from 'vuex'
export default {
  mixins: [scrollMixin],
  data () {
    return {
      changeColor: this.$store.state.userGroupIndex,
      userLikeList: [],
      groupLikeList: [],
      failTitle: '还没有人来访,赶快去看看别人吧!',
      pullDownRefresh: true,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: true,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更多数据了',
      isLoading: true,
      items: [],
      curPage: 1,
      pageSize: 10
    }
  },
  components: {
    scroll
  },
  computed: {
    ...mapState(['user', 'pos']),
     beforeThree () {
          if (this.changeColor === 1 && this.userLikeList.length >= 3) {
              let arr = []
              arr = this.userLikeList.slice(0,3)
              return arr
          } else if (this.changeColor === 2 && this.groupLikeList.length >= 3){
            let arr = []
            arr = this.groupLikeList.slice(0,3)
            return arr
          } else {
            return []
          }
        },
        after () {
          if (this.changeColor === 1 && this.userLikeList.length > 3) {
            let arr = []
            arr = this.userLikeList.slice(3)
            return arr
          } else if (this.changeColor === 2 && this.groupLikeList.length > 3) {
            let arr = []
             arr = this.groupLikeList.slice(3)
            return arr
          }
          else {
            return this.voteList
          }
        }
  },
  created () {
    if (this.changeColor === 1) {
      this.getUserLikeList()
    } else {
      this.getGroupLikeList()
    }
  },
  // mounted () {
  //   if (this.changeColor === 1) {
  //     this.getUserLikeList()
  //   } else {
  //     this.getGroupLikeList()
  //   }
  // },
  methods: {
    ...mapMutations(['updateNeedBack']),
    getUserLikeList () {
      let me = this
      let userUrl = ''
      if (!me.pos.longitude && !me.pos.latitude) {
          userUrl = `UserRecommend/like?PageIndex=${me.curPage}&PageSize=${me.pageSize}`
        } else {
           userUrl = `UserRecommend/like?PageIndex=${me.curPage}&PageSize=${me.pageSize}&Longitude=${me.pos.longitude}&Latitude=${me.pos.latitude}`
      }
      me.api.get({
        url: userUrl,
        success: function (res) {
          me.curPage === 1 && (me.userLikeList = [])
          me.userLikeList = me.userLikeList.concat(res)
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
    getGroupLikeList () {
       let me = this
      let userUrl = ''
      if (!me.pos.longitude && !me.pos.latitude) {
          userUrl = `UserGroupList/like?PageIndex=${me.curPage}&PageSize=${me.pageSize}`
        } else {
           userUrl = `UserGroupList/like?PageIndex=${me.curPage}&PageSize=${me.pageSize}&Longitude=${me.pos.longitude}&Latitude=${me.pos.latitude}`
      }
      me.api.get({
        url: userUrl,
        success: function (res) {
          me.curPage === 1 && (me.groupLikeList = [])
          me.groupLikeList = me.groupLikeList.concat(res)
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
      if (this.changeColor === 1) {
        this.getUserLikeList()
      } else {
        this.getGroupLikeList()
      }
    },
    onPullingUp () {
      // 更新数据
      this.curPage++
      if (this.changeColor === 1) {
        this.getUserLikeList()
      } else {
        this.getGroupLikeList()
      }
    },
    goHome (item) {
      if (this.changeColor === 1) {
        if (item.userId === this.user.userId) { // 去到我的主页
          this.updateNeedBack(true)
          this.$router.push({ name: 'my' })
        } else { // 去到别人的主页
          this.$router.push({ name: 'discoverUser', params: { id: item.userId } })
        }
      } else {
        this.$router.push({ name: 'groupInfo', params: { id: item.userGroupId} })
      }
    },
  }
}
</script>

<style lang="less" scoped>
  .rankListPage{
    height:(100vh - 7vw);
    overflow: hidden;
    .rankHead{
      height:13.34vw;
      line-height:13.34vw;
      width:30vw;
      z-index:1000;
      position:fixed;
      top:0;
      right:0;
      left:0;
      margin:0 auto;
      text-align: center;
    }
    .topThreeWrap{
      width:100vw;
      height:44.16vw;
      background:#f0eeef;
      display:flex;
      flex-flow: row nowrap;
      align-items: flex-end;
      padding-bottom:3vw;
      box-sizing: border-box;
      justify-content: space-between;
      .topOne{
        width:32vw;
        height:32.13vw;
        background:white;
        border-radius: 2vw 2vw 0vw 0vw;
        display:flex;
        justify-content: center;
        position:relative;
        .siver{
          width:18vw;
          height:18vw;
          background:rgb(218, 218, 234);
          border-radius: 50%;
          position:relative;
          display:flex;
          img{
            width:14vw;
            height:14vw;
            overflow: hidden;
            border-radius: 50%;
            object-fit: cover;
            position:absolute;
            top:0;
            right:0;
            left:0;
            bottom:0;
            margin:auto;
          }
          
        }
        .score{
          position:absolute;
          top:14vw;
          z-index: 100;
          img{
            width: 8vw;
            height: 8vw;
            overflow: hidden;
          }
        }
        .detailMsg{
          width:100%;
          height:10vw;
          position:absolute;
          bottom:0;
          font-size: 0;
          text-align: center;
          .name{
            display:inline-block;
            width:100%;
            font-size:3vw;
            color:#333;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
          }
          .count{
            display:inline-block;
            width:100%;
            font-size:3vw;
            color:rgb(254, 63, 90);
          }
        }
      }
      .topTwo{
        width:32vw;
        height:36.53vw;
        background:white;
        border-radius: 2vw 2vw 0vw 0vw;
        display:flex;
        justify-content: center;
        position:relative;
         .numberOne{
            width:20vw;
            height:23vw;
            position:absolute;
            // top:-4vw;
            // left:2.5vw;
          }
        .gold{
          width:18vw;
          height:18vw;
          // background:rgb(218, 218, 234);
          border-radius: 50%;
          position:relative;
          display:flex;
          img{
            width:14vw;
            height:14vw;
            overflow: hidden;
            border-radius: 50%;
            object-fit: cover;
            position:absolute;
            top:0;
            right:0;
            left:0;
            bottom:0;
            z-index:22;
            margin:auto;
          }
         
        }
        .score{
          position:absolute;
          top:14vw;
          z-index: 100;
          img{
            width: 8vw;
            height: 8vw;
            overflow: hidden;
          }
        }
        .detailMsg{
          width:100%;
          height:10vw;
          position:absolute;
          bottom:0;
          font-size: 0;
          text-align: center;
          .name{
            display:inline-block;
            width:100%;
            font-size:3vw;
            color:#333;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
          }
          .count{
            display:inline-block;
            width:100%;
            font-size:3vw;
            color:rgb(254, 63, 90);
          }
        }
      }
      .topThree{
        width:32vw;
        height:32.13vw;
        background:white;
        border-radius: 2vw 2vw 0vw 0vw;
        display:flex;
        justify-content: center;
        position: relative;
        .bronze{
          width:18vw;
          height:18vw;
          background:rgb(245, 169, 140);
          border-radius: 50%;
          position:relative;
          display:flex;
          img{
            width:14vw;
            height:14vw;
            overflow: hidden;
            border-radius: 50%;
            object-fit: cover;
            position:absolute;
            top:0;
            right:0;
            left:0;
            bottom:0;
            margin:auto;
          }
        }
        .score{
          position:absolute;
          top:14vw;
          z-index: 100;
          img{
            width: 8vw;
            height: 8vw;
            overflow: hidden;
          }
        }
        .detailMsg{
          width:100%;
          height:10vw;
          position:absolute;
          bottom:0;
          font-size: 0;
          text-align: center;
          .name{
            display:inline-block;
            width:100%;
            font-size:3vw;
            color:#333;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
          }
          .count{
            display:inline-block;
            width:100%;
            font-size:3vw;
            color:rgb(254, 63, 90);
          }
        }
      }
    }
    .rankListWrap{
      width:100%;
            margin-top:2vw;
            height:calc(100vh - 59vw);
            overflow: hidden;
      .listUl{
            width:100%;
            li{
                display:flex;
                height:20.46vw;
                align-items: center;
                padding-left:4vw;
                box-sizing: border-box;
                .medalState{
                   min-width: 4.4vw;
                  font-size:4vw;
                  color:rgb(163, 163, 163);
                }
                .medalWrap{
                    width:90%;
                    margin-left:4vw;
                    display:flex;
                    align-items: center;
                    position:relative;
                    height:20.46vw;
                    .medalAvatar{
                        width:14.35vw;
                        height:14.35vw;
                        border-radius: 50%;
                        overflow: hidden;
                        img{
                            height:100%;
                            width:100%;
                             border-radius: 50%;
                        }
                    }
                    .medalName{
                      display:inline-block;
                        font-size:3.7vw;
                        margin-left:5vw;
                        width:35vw;
                        max-height:15vw;
                        word-wrap: break-word;
                        word-break: break-all;
                        overflow:hidden;
                        text-overflow:ellipsis;
                        white-space:nowrap;
                    }
                    .medalCount{
                        font-size:3.7vw;
                        color:rgb(255, 39, 66);
                        position:absolute;
                        right:4vw;
                    }
                }                
            }
        }
    }
  }
</style>