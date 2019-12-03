<template>
    <div class="blackList">
        <div class="load" v-if="isLoad">
            <loading></loading>
        </div>
        <ul class="userWrap" v-if="backlist.length">
            <scroll ref="scroll"
                  :data="backlist"
                  :scrollbar="scrollbarObj"
                  :pullDownRefresh="pullDownRefreshObj"
                  :pullUpLoad="pullUpLoadObj"
                  :startY="parseInt(startY)"
                  @pullingDown="onPullingDown"
                  @pullingUp="onPullingUp"
              >
                <li v-for="(oneBlack, index) in backlist" :key="index">
                    <div class="userAvator" >
                        <img :class="{defaultStyle: oneBlack.avatar === null || oneBlack.avatar === '' || oneBlack.avatar == 'http://webapp.szwanwan.com/img/default/defaultavatar.png'}" :src="oneBlack.avatar === null || oneBlack.avatar === '' ? defaultAvatar : oneBlack.avatar" alt="">
                    </div>
                    <div class="userName">{{oneBlack.nickName === null || oneBlack.nickName === '' ? oneBlack.name : oneBlack.nickName}}</div>
                    <div class="bthCancel" @click.stop="cancelClick(oneBlack)">{{isCancel ? '已取消' : '取消'}}</div>
                </li>
            </scroll>
        </ul>
        <div v-else>
            <NotFound :failTitle="failTitle" v-if="isFail"></NotFound>
        </div>
    </div>
</template>

<script>
import Loading from '@/components/requestState/Loading'
import NotFound from '@/components/requestState/NotFound'
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
export default {
  mixins: [scrollMixin],
  data () {
    return {
      backlist: [],
      isLoad: true, // 是否正在加载
      isFail: false, // 是否加载失败
      failTitle: '黑名单为空哦！',
      pullDownRefresh: false,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: true,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更多数据了',
      isLoading: true,
      curPage: 1,
      pageSize: 7,
      isCancel: false
    }
  },
  components: {
    Loading,
    NotFound,
    scroll
  },
  created () {
    this.getBlackList()
  },
  methods: {
    getBlackList () {
      let me = this
      me.api.get({
        url: `UserBlackList?PageIndex=${me.curPage}&PageSize=${me.pageSize}`,
        success: function (res) {
          me.curPage === 1 && (me.backlist = [])
          me.backlist = me.backlist.concat(res)
          if (me.backlist.length > 0) {
            me.isLoad = false
            me.isFail = false
          } else if (me.backlist.length === 0) {
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
          me.isLoad = false
        }
      })
    },
    onPullingDown () {
      this.curPage = 1
      this.getBlackList()
    },
    onPullingUp () {
      // 更新数据
      this.curPage++
      this.getBlackList()
    },
    cancelClick (item) {
      if (this.isCancel) {
        this.$toast('已取消')
        return
      }
      let me = this
      me.api.put({
        url: 'UserBlackList',
        data: {
          guestUserId: item.userId
        },
        success: function (res) {
          me.isCancel = true
          me.$toast('取消成功')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
   .blackList{
     width:100%;
     height:100%;
     .userWrap{
        width:100%;
        height:calc(100vh - 12vw);
        overflow: hidden;
        li{
                width:100%;
                height:25vw;
                display:flex;
                align-items: center;
                justify-content: space-between;
                padding:0 4vw;
                box-sizing: border-box;
                .userAvator{
                    box-sizing: border-box;
                    width:19.2vw;
                    height:19.2vw;
                    border-radius: 50%;
                    border:1px solid rgb(243,243,243);
                    overflow: hidden;
                    position: relative;
                    img{
                        position:absolute;
                        top:0;
                        left:0;
                        right:0;
                        bottom:0;
                        margin:auto;
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        overflow: hidden;
                    }
                    .defaultStyle{
                        width:15vw;
                        height:15vw;
                        border-radius: 0;
                        overflow: hidden;
                    }
                }
                .userName{
                  flex:1;
                  margin-left:4vw;
                }
                .bthCancel{
                    padding:0 2vw;
                    box-sizing: border-box;
                    height:8vw;
                    border-radius: 4vw;
                    border:1px solid red;
                    text-align: center;
                    color:#666;
                }
        }
     }
   } 
</style>