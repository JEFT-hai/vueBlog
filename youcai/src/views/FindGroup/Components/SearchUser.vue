<template>
    <div class="findUserWrap">
        <div class="findInput">
            <span class="search">
                <i class="iconWanwan iconWsearch activityNotice "></i>
            </span>
            <input type="search" placeholder="请输入用户名或手机号搜索" v-model="userWord" @keyup.enter="getSearchUser"  @focus="focusfns">
            <span class="goSearch" @click="getSearchUser">搜索</span>
            <span class="clear" v-if="userWord" @click="clearWord"><i class="iconWquxiao-copy-copy iconWanwan activityNotice"></i></span>
        </div>
        <div class="myUser" v-if="userList.length">
          <scroll ref="scroll"
                  :data="userList"
                  :scrollbar="scrollbarObj"
                  :pullDownRefresh="pullDownRefreshObj"
                  :pullUpLoad="pullUpLoadObj"
                  :startY="parseInt(startY)"
                  @pullingUp="onPullingUp"
              >
                <p class="noPosition" v-if="!userList && !pos.longitude && !pos.latitude">开启定位才能查看附近的人哦</p>
                <UserMessage v-for="(oneUser,index) in userList" :key="oneUser.userId" :userMessage="oneUser" :isNeedDistance=true></UserMessage>
          </scroll>
        </div>
          <div>
               <NotFound :failTitle="failTitle" v-if="isFail"></NotFound>
          </div>
    </div>
</template>

<script>
import UserMessage from '@/components/userMessage'
import Loading from '@/components/requestState/Loading'
import NotFound from '@/components/requestState/NotFound'
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
import {mapState} from 'vuex'
export default {
  mixins: [scrollMixin],
  data () {
    return {
      userWord: '', // 搜索关键字
      userList: [], // 搜索用户列表
      isLoad: false, // 是否正在加载
      isFail: false, // 是否加载失败
      failTitle: '没有找到该用户哦',
      pullDownRefresh: false,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: true,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更多数据了',
      isLoading: true,
      curPage: 1,
      pageSize: 10
    }
  },
  components: {
    UserMessage,
    Loading,
    NotFound,
    scroll
  },
  computed: {
    ...mapState(['user', 'pos'])
  },
  watch: {
    userWord (newV) {
      if (newV.length <= 0) {
        this.userList = []
      }
    }
  },
  created () {
    this.writePosition()
    if (this.pos.longitude && this.pos.latitude) { // 如果有经纬度
      this.guessUser()
    }
  },
  methods: {
    /**
     * focusfns获得焦点
     */
    focusfns () {
      this.curPage = 1
    },
     /**
     * 得到搜索的用户
     */
    getSearchUser () {
       let me = this
      //  me.curPage = 1
      //  me.userList.length = 0
       if (this.userWord.length >= 12) {
         this.$toast('关键字长度不能大于12', 500)
         return
       } else if (this.userWord.length <= 0) {
         this.$toast('请输入正确的关键字', 500)
         return
       } else {
        let myStr = me.userWord.toString()
        let SearchUrl = ''
        if (!me.pos.longitude && !me.pos.latitude) {
          SearchUrl = `UserRecommend/id?SearchWord=${myStr}&PageIndex=${me.curPage}&PageSize=${me.pageSize}`
        } else {
          SearchUrl = `UserRecommend/id?SearchWord=${myStr}&PageIndex=${me.curPage}&PageSize=${me.pageSize}&Longitude=${me.pos.longitude}&Latitude=${me.pos.latitude}`
        }
         me.api.get({
          url: SearchUrl,
          success: function (res) {
            me.curPage === 1 && (me.userList = [])
            me.userList = me.userList.concat(res)
            if (me.userList.length > 0) {
              me.isLoad = false
              me.isFail = false
            } else if (me.userList.length === 0) {
              me.isLoad = false
              me.isFail = true
            }
          },
          error: function (res) {
            me.$refs.scroll && me.$refs.scroll.forceUpdate()
          },
          complete: function () {
            me.$refs.scroll && me.$refs.scroll.forceUpdate()
            // me.isLoading = false
          }
         })
       }
    },
    onPullingDown () {
    },
    onPullingUp () {
      // 更新数据
      this.curPage++
      if (!this.userWord) {
        this.guessUser()
      } else {
        this.getSearchUser()
      }
    },
    /**
     * clearWord清掉关键字
     */
    clearWord () {
      this.userWord = ''
      this.isFail = false
    },
    guessUser () {
      let me = this
      let meUrl = ''
      if (!me.pos.longitude && !me.pos.latitude) {
        meUrl = `UserRecommend?PageIndex=${me.curPage}&PageSize=${me.pageSize}`
      } else {
        meUrl = `UserRecommend?Longitude=${me.pos.longitude}&Latitude=${me.pos.latitude}&PageIndex=${me.curPage}&PageSize=${me.pageSize}`
      }
      me.api.get({
        url: meUrl ,
        success: function (res) {
          me.curPage === 1 && (me.userList = [])
          let newRes= res.filter((item, index) =>{
            return item.userId !== me.user.userId
          })
          me.userList = me.userList.concat(newRes)
        },
        error: function (res) {
          me.$refs.scroll && me.$refs.scroll.forceUpdate()
        },
        complete: function () {
          me.$refs.scroll && me.$refs.scroll.forceUpdate()
          // me.isLoading = false
        }
      })
    },
    /**
     * writePosition 修改用户地理位置
     */
    writePosition () {
      let me = this
      me.api.process({
        url: 'UserRecommend',
        data: {
          longitude: me.pos && me.pos.longitude,
          latitude: me.pos && me.pos.latitude
        },
        success: function (res) {
        },
        error: function (res) {
        },
        complete: function () {
          me.$refs.scroll && me.$refs.scroll.forceUpdate()
          // me.isLoading = false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.findUserWrap{
            margin-top:4vw;
            overflow: hidden;
            width:100%;
            height:100%;
            .findInput{
                    width:80vw;
                    margin-left:4vw;
                    height:10.37vw;
                    border-radius: 5vw;
                    background-color:#f3f3f3;
                    position:relative;
                    .search{
                        display:inline-block;
                        width:15vw;
                        height:100%;
                        line-height:10.37vw;
                        text-align: center;
                        .activityNotice{
                            color:#cdcdcd;
                            font-size:5vw;
                        }
                    }
                    input{
                        width:60vw;
                        background-color:#f3f3f3;
                        border:none;
                        outline: none;
                        color:#999;
                        font-size:4.5vw;
                    }
                    input::-webkit-input-placeholder {
                    /* placeholder颜色  */
                    color: #cdcdcd;
                    }
                    .goSearch{
                      width:10.37vw;
                      height:10.37vw;
                      position:absolute;
                      top:0;
                      right:-13vw;
                      line-height:10.37vw;
                    }
                    .clear{
                      width:4.5vw;
                      height:4.5vw;
                      position:absolute;
                      top:0;
                      bottom:0;
                      margin:auto 0;
                      right:2vw;
                      line-height:4.5vw;
                      text-align: center;
                      border-radius: 50%;
                      color:white;
                      background:rgb(140, 140, 140);
                    }
            }
            .myUser{
                width:100%;
                padding-top:5vw;
                box-sizing: border-box;
                height:calc(100vh - 38vw);
                overflow: hidden;
                .noPosition{
                  width:100%;
                  height:30vw;
                  text-align: center;
                  line-height:30vw;
                }
            }
        }
</style>