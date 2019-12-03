<template>
  <div class="whoLookPage">
    <div class="load"
         v-if="isLoad">
      <loading></loading>
    </div>
    <div class="load"
         v-if="noData">
      <NotFound :failTitle="failTitle"></NotFound>
    </div>
    <div class="visitorTitle"
         v-if="user.vipLevel == 0 &&  whoLookMe.length">
      <span class="lately">最近10位</span><span class="more">VIP尊享查看更多听众特权</span>
    </div>
    <div class="whoLookUl" v-if="whoLookMe.length">
      <scroll ref="scroll"
              :data="items"
              :scrollbar="scrollbarObj"
              :pullDownRefresh="pullDownRefreshObj"
              :pullUpLoad="pullUpLoadObj"
              :startY="parseInt(startY)"
              @pullingDown="onPullingDown"
              @pullingUp="onPullingUp">
        <ul class="whoUl"
            v-if="items.length">
          <li class="oneUser borderB"
              v-for="(userMessage,index) in items"
              :key="index">
            <div class="userAvator"
                 @click="goHome(userMessage)">
              <img :class="{defaultStyle: userMessage.avatar === null || userMessage.avatar === '' || userMessage.avatar === 'http://webapp.szwanwan.com/img/default/defaultavatar.png'}"
                   :src="userMessage.avatar === null || userMessage.avatar === ''? defaultAvatar : userMessage.avatar"
                   alt="">
              <div class="right"
                   v-if="userMessage.autheType === 1">
                <i class="one">V</i>
              </div>
              <!-- <div class="right">
                                <i class="one">V</i>
                            </div> -->
            </div>
            <div class="message">
              <div class="userName">{{userMessage.nickName}}</div>
              <div class="userCode">
                <!-- <span class="pinkGenderLabel">
                                    <i class="iconWanwan iconWnan-copy activityNan"></i>
                                    <i class="iconWanwan iconWnv3-copy activityNv"></i>
                                    <i class="age">18</i>
                                </span>
                                <span class="yellowGenderLabel">
                                    会员
                                </span> -->
                <span>最后一次来访时间</span>
              </div>
              <div class="userMsg">
                <span>{{userMessage.visitTime.substring(0,10)}}</span>
              </div>
            </div>
            <div class="follow">
              <div class="child">
                <BtnFollow :item="userMessage"
                           :isWhoLookMePage="isWhoLookMePage"></BtnFollow>
              </div>
            </div>
          </li>
        </ul>
      </scroll>
    </div>
    <div class="visitorMask" v-if="user.vipLevel == 0 && whoLookMe.length">
      <span class="maskOne">查看更多听众</span>
      <span class="maskTwo">想要查看更多最近听众?开通VIP吧</span>
    </div>
  </div>
</template>

<script>
import BtnFollow from '@/components/Btn/BtnFollow'
import Loading from '@/components/requestState/Loading'
import NotFound from '@/components/requestState/NotFound'
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
import { mapState } from 'vuex'
export default {
  mixins: [scrollMixin],
  data () {
    return {
      defaultAvatar: 'http://webapp.szwanwan.com/img/default/defaultavatar.png',
      noData: false, // 没有数据
      whoLookMe: [], // 谁看过我用户列表
      isLoad: true, // 是否正在加载
      isFail: false, // 是否加载失败
      failTitle: '还没有人来访,赶快去看看别人吧!',
      pullDownRefresh: false,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: true,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更多数据了',
      isLoading: true,
      items: [],
      curPage: 1,
      pageSize: 10,
      isWhoLookMePage: true,
      vipLevel: '', // vip等级
    }
  },
  components: {
    scroll,
    BtnFollow,
    Loading,
    NotFound
  },
  computed: {
    ...mapState(['user']),
  },
  created () {
    
  },
  mounted () {
    this.getWhoLook()
  },
  methods: {
     /**
     * goHome去到个人主页
     */
    goHome (item) {
      if (item.initiativeUserId === this.user.userId) { // 去到我的主页
        this.$router.push({name: 'my'})
      } else { // 去到别人的主页
        this.$router.push({ name: 'discoverUser', params: { id: item.initiativeUserId } })
      }
    },
    /**
     * getWhoLook 得到谁看过我用户列表
     */
    getWhoLook () {
      let me = this
      me.api.get({
        url: `UserFootprint?PageIndex=${me.curPage}&PageSize=${me.pageSize}`,
        success: function (res) {
          me.curPage === 1 && (me.items = [])
          me.items = me.items.concat(res)
          if (me.curPage === 1 && !res.length) {
            me.noData = true
          }
          if (me.curPage === 1) {
            me.whoLookMe = res
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
      this.getWhoLook()
    },
    onPullingUp () {
      // 更新数据
      // this.curPage++
      // this.getWhoLook()
      if (this.user.vipLevel) {
        this.curPage++
        this.getWhoLook()
      }
    }
  }
}
</script>


<style lang="less" scoped>
  .whoLookPage{
    width:100vw;
    height:calc(100vh - 12.34vw);
    .visitorTitle{
              height:12vw;
              padding-left:4vw;
              box-sizing: border-box;
              background:white;
              .lately{
                font-size:4.7vw;
                margin-right:2vw;
                display:inline-block;
                height:12vw;
                line-height:12vw;
              }
              .more{
                font-size:3.5vw;
                color:rgb(65, 76, 86);
                display:inline-block;
                height:12vw;
                line-height:12vw;
              }
    }
    .whoLookUl{
            height:calc(100vh - 24vw);
            overflow: hidden;
            .whoUl{
                width:100%;
                .oneUser{
                    display:flex;
                    align-content: center;
                    width:100%;
                    padding-top:2vw;
                    padding-bottom:2vw;
                    box-sizing: border-box;
                    .userAvator{
                        margin-left:4vw;
                        width:19.2vw;
                        height:19.2vw;
                        border-radius: 50%;
                        border:1px solid rgb(243,243,243);
                        position:relative;
                        img{
                            position:absolute;
                            top:0;
                            left:0;
                            right:0;
                            bottom:0;
                            margin:auto;
                            width:19.2vw;
                            height:19.2vw;
                            border-radius: 50%;
                            overflow: hidden;
                        }
                        .defaultStyle{
                            width:15vw;
                            height:15vw;
                            border-radius: 0;
                            overflow: hidden;
                        }
                        .right{
                            position:absolute;
                            bottom:0vw;
                            right:-0.5vw;
                            z-index:12;
                            background:white;
                            box-shadow: 0 0 1px #eeee;
                            width: 6vw;
                            height:6vw;
                            border-radius: 50%;
                            display:flex;
                            .one{
                                margin:auto;
                                display:inline-block;
                                width:5.18vw;
                                height:5.18vw;
                                border-radius: 50%;
                                // background:rgb(255, 39, 66);
                                background: linear-gradient(to right bottom,#e37782, #f56b80,#ff5363,#ff405b, #fc3f58);
                                color:white;
                                line-height: 5.5vw;
                                text-align: center;
                                font-size:3.7vw;
                                font-weight: 500;
                                box-sizing: border-box;
                                font-family: Times, TimesNR, 'New Century Schoolbook', Georgia, 'New York', serif;
                            }
                        }
                    }
                    .message{
                        margin-left:3vw;
                        flex: 1;
                        .userName{
                            font-size:4vw;
                            color:#3c3c3c;
                        }
                        .userCode{
                            display:flex;
                            margin-top:0.5vw;
                            color:#676767;
                            font-size:3.5vw;
                        }
                        .userMsg{
                            color:#676767;
                            font-size:3.5vw;
                            margin-top:0.5vw;
                            span:nth-child(1) {
                                margin-right:5vw;
                            }
                        }
                    }
                    .follow{
                        width:20vw;
                        display:flex;
                        margin-right:3vw;
                        .child{
                            margin:auto;
                        }
                    }
                }
            }
    }
    .visitorMask{
      width:100vw;
      height:54.35vw;
      position:fixed;
      bottom:0;
      left:0;
      z-index:22;
      background: linear-gradient(to bottom, rgba(255,255,255,.1) ,rgba(255,255,255,.7), rgb(255,255,255));
      display:flex;
      flex-flow: row wrap;
      padding-top:4vw;
      box-sizing: border-box;
      // align-items: center;
      .maskOne{
        display:inline-block;
        width:50.74vw;
        height:11.20vw;
        background:rgb(255, 86, 84);
        border-radius: 6vw;
        color:white;
        font-size:5vw;
        text-align: center;
        line-height:11.20vw;
        margin:auto;
        position: relative;
        overflow: hidden;
        &:after{
          display:inline-block;
          content: 'VIP';
          width:18vw;
          height:8vw;
          background:rgb(183, 32, 32);
          position:absolute;
          top:1vw;
          right:-5vw;
          z-index:33;
          transform:rotate(60deg);
          // border-radius: 6vw;
          font-size:4vw;
          line-height:8vw;
          
        }
      }
      .maskTwo{
        display:inline-block;
        width:100%;
        // height:11.20vw;
        font-size:3.7vw;
        text-align: center;
      }
    }
  }
</style>