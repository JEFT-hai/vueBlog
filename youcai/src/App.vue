<template>
  <div id="app">
    <div id="appContent"
         :class="{
        is_tabBarVisibility: tabBarVisibility,
        no_scroll: noScroll
      }">
      <!-- <navBar/> -->
      <component :is='navCmp' v-if='showNav'></component>
      <downApp v-if="downAppShow"></downApp>
      <keep-alive>
        <router-view :style='getStyle()' v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <transition name="fade"
                  mode="out-in">
        <router-view v-if="!$route.meta.keepAlive" :style='getStyle()'></router-view>
      </transition>
    </div>
    <tabBar v-show="!downAppShow && tabBarVisibility" />
    <replySet v-show="$route.name === 'discoverReplyList'"
              v-if="false" />
    <music-p v-if="currentIndex >= 0"
             v-show="currentIndex >= 0 && musicSrc && musicPShow && isInMusicPage"></music-p>
    <MusicInner v-if="musicSrc"
                :show="hasMask && musicInnerShow"
                v-show="hasMask && musicInnerShow"></MusicInner>
    <div class="openInApp"
         v-if="downAppShow && link">
      <a :href="link">App内打开</a>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

const navBar = () => import('@/component/global/navbar.vue')
const searchNav = () => import('@/component/global/searchNav.vue')
const searchOnly = () => import('@/component/global/searchOnly.vue')

const downApp = () => import('@/components/downApp')
const musicP = () => import('@/components/music/musicPie.vue')
const tabBar = () => import('@/component/global/tabbar.vue')
const MusicInner = () => import('@/components/music/MusicInner')
export default {
  components: {
    navBar: navBar,
    tabBar: tabBar,
    musicP,
    MusicInner,
    downApp,
    searchNav,
    searchOnly
  },
  data() {
    return {
      // showBgLoading: true,
      curAppVersion: '',
      apkUrl: '',
      upDateMsg: {
        title: ''
      },
      link: '',
      curRoute: {},

      showNav: false,
      navCmp: ''
    }
  },
  computed: {
    ...mapState([
      'showBgLoading',
      'app',
      'isPlaying',
      'hasMask',
      'pos',
      'musicInnerShow',
      'isPlaying',
      'musicPage',
      'currentIndex',
      'isCallWXBind',
      'networkState'
    ]),
    ...mapGetters(['musicSrc']),
    // 是否是在 music页面, discover页面play的时候才显示
    isInMusicPage() {
      if (this.musicPage === 'music') {
        return true
      } else if (this.musicPage === 'discover' && this.isPlaying) {
        return true
      } else {
        return false
      }
    },
    showBar() {
      if (this.$route.name === null && this.$route.path === '/') {
        return false
      }
      if (
        this.$route.path.indexOf('/account') === 0 &&
        this.$route.path.indexOf('/account/privacy') !== 0 &&
        this.$route.path.indexOf('/account/agreement') !== 0
      ) {
        return false
      }
      if (this.$route.name && this.$route.name === 'start') {
        return false
      }
      return true
    },
    navBarVisibility() {
      if (!this.$store.state.isInApp) {
        return false
      }
      let hasTabBar = // 在下面定义的router里面的name，然后就可以不出现导航条
        [
          'musicInner',
          'videoSwiper',
          'agreementPage',
          'activityInfo',
          'activityTag',
          'videoPlayer',
          // 'voteHVideoDetail',
          'groupMemberList',
          'groupApplyList',
          'dialog',
          'discoverUser',
          'groupInfo',
          'videoVote',
          'videoH',
          'taskCenter',
          'hanger',
          'nameColor',
          'privilegeDetail',
          'beVIP',

          'search'
        ].indexOf(this.$route.name) >= 0
      if (hasTabBar) {
        return false
      }
      if (this.$route.meta.noNav) {
        return false
      }
      return this.showBar && !this.tabBarVisibility
    },
    tabBarVisibility() {
      let hasTabBar =
        this.showBar &&
        [
          'index',
          'shop',
          'seek'
        ].indexOf(this.$route.name) >= 0
      // console.log(this.tabBarVisibility, 'tabBarV')
      return hasTabBar
    },
    noScroll() {
      let hasTabBar =
        this.showBar &&
        [
          'home',
          'index',
          'topic',
          'discoverindex',
          'activityHome',
          'activityInfo',
          'discoverItem',
          'discover',
          'discoverchome',
          'topicinfo',
          'message',
          'eco'
        ].indexOf(this.$route.name) >= 0
      return hasTabBar
    },
    keepAlive() {
      let hasTabBar =
        this.showBar &&
        [
          'home',
          'index',
          'topic',
          'discoverindex',
          // 'activityHome',
          'discoverchome',
          'discover',
          'topicinfo',
          'eco',
          'my',
          'messageList',
          'groupMemberList',
          'groupInfo'
        ].indexOf(this.$route.name) >= 0
      return hasTabBar
    },
    musicPShow() {
      let isIndex = ['index'].indexOf(this.$route.name) >= 0
      if (!isIndex) {
        return false
      } else {
        return true
      }
    },
    downAppShow() {
      return !this.$store.state.isInApp
    },
    hasNav() {
      let hasTabBar =
        ['activityInfo', 'activityTag', 'videoPlayer', 'videoSwiper'].indexOf(
          this.$route.name
        ) >= 0
      if (hasTabBar) {
        return false
      }
      if (this.navBarVisibility) {
        return true
      }
      return this.downAppShow
    }
  },
  watch: {
    link(newV) {
      return newV
    },
    isInMusicPage(newV) {
      return newV
    },
    upDateMsg(newV) {
      return newV
    },
    keepAlive(newV) {
      // this.$route.meta.keepAlive = newV
      newV && (this.$route.meta.keepAlive = newV)
    },
    hasMask(newV) {
      !newV && this.setMusicInnerShow(false)
    },
    $route(to) {
      if (to.meta && to.meta.nav && to.meta.nav.type) {
        this.showNav = true
        switch (to.meta.nav.type) {
          case 'search':
            this.navCmp = 'searchNav'
            break
          case 'nav':
            this.navCmp = 'nav'
            break
          case 'searchOnly':
            this.navCmp = 'searchOnly'
            break
          default:
            this.navCmp = to.meta.nav.type
            break
        }
      } else {
        this.showNav = false
      }
      // 微信分享出去的网页监听当前页面的路由，决定回到app的哪一页
      if (this.downAppShow) {
        this.curRoute.name = to.name
        if (to.name === 'index') {
          this.curRoute.query = to.query
          let query = encodeURIComponent(
            `duolu://io.dcloud.H50D8112A/main?name=${this.curRoute.name}`
          )
          if (this.curRoute.query) {
            query =
              query +
              encodeURIComponent(
                `&query=${JSON.stringify(this.curRoute.query)}`
              )
          }
          this.link =
            'https://a.app.qq.com/o/simple.jsp?pkgname=io.dcloud.H50D8112A&android_schema=' +
            query
        } else {
          // 群组
          this.curRoute.params = to.params
          if (
            this.curRoute.name === 'groupQR' ||
            this.curRoute.name === 'groupInfo'
          ) {
            this.curRoute.name = 'groupInfo'
            Object.assign(this.curRoute.params, { from: 'weixin' })
          }
          let params = encodeURIComponent(
            `duolu://io.dcloud.H50D8112A/main?name=${this.curRoute.name}`
          )
          if (this.curRoute.params) {
            params =
              params +
              encodeURIComponent(
                `&params=${JSON.stringify(this.curRoute.params)}`
              )
          }
          this.link =
            'https://a.app.qq.com/o/simple.jsp?pkgname=io.dcloud.H50D8112A&android_schema=' +
            params
        }
      }
    }
  },
  created() {
    // 每次刷新页面都获取用户个人信息 && 关注列表
    // if (this.authentication.isLogin()) {
    //   this.$store.dispatch('getAttentionList', this)
    //   this.$store.dispatch('getUserMain', this)
    //   this.$store.dispatch('ws/connectWebsocket')
    //   this.initSql()
    // }
    // 以下是android方法与暴露给Android的方法 b
    window.isInAndroid = false
    window.isInAndroid && window.WanAndroid.getLocation() // 获取地理位置
    window.isInAndroid && this.getNetworkType() // 获取 移动还是联通
    window.isInAndroid && window.WanAndroid.getNetwork() // 获取网络内容
    window.onGetTokenComplete = this.onGetTokenComplete
    window.goLinkFromWX = this.goLinkFromWX
    window.goQueryFromWX = this.goQueryFromWX
    window.goLinkParams = this.goLinkParams
    window.onGetWxTokenComplete = this.onGetWxTokenComplete
    window.updeteMessageCount = this.updeteMessageCount
    window.setUserStatus = this.setUserStatus // 用户状态
    window.setNetwork = this.setNetwork // 网络状态
    window.getIMEICallBack = this.getIMEICallBack // 获取用户IMEI
    window.scrollOn = this.scrollOn
    // 以下是IOS的配置以及方法
    window.isInIOS = false
    // 设置用户是否是自己人
    // this.setUserStatus(true)
  },
  mounted() {
    this.$nextTick(() => {
      this.getIMEI()
    })
    window.goLink = this.goLink // android跳转
    // 参数 name, id
    /*
     * name 到用户详情 discoverUser
     * name 到聊天设置 groupChatSettings id
     * 
     * name 到图文动态 discoverItemOnly id
     * name 话题详情 topicItemss, id: 话题id
     * name 到视频 videoSwiper id
     * 
     * name 到搜索群组页面 user_Group 不传id
     * name 到消息页面 messageList 不传id 
     * name 到申请人列表 groupApplyList id:groupId
     * name 到群详情 groupInfo id: groupId
     * name 用户协议 agreementPage, id：'agreement'
     * name 隐私条款 agreementPage, id：'privacy'
     * name 活动详情 activityInfo, id: 活动的id
     
     * name 话题答案详情 topicComment id: 话题id, otherId: 答案的id
     * name 优惠详情 discount_info, id：优惠的id
     * name 声音 music, id:音乐的id
     */
    window.goDialog = this.goDialog // type userId userName
    window.goIndexAndRefresh = this.goIndexAndRefresh
    window.toast = this.$toast
    window.error = this.$error
    window.ifMask = this.ifMask
    window.hideMask = this.hideMask
    window.$toast = this.$toast
    window.$alert = this.$alert
    window.setUserLocaltion = this.setUserLocaltion
    window.goParams = this.goParams // 表示置顶群聊
    window.goMyGroupList = this.goMyGroupList // 跳到我的群

    window.goPerson = this.goPerson // 傳userId
    window.goGroupInfo = this.goGroupInfo //傳groupId

    // 获取动态分类
    this.getCategory()
    window.isInIOS && window.webkit.messageHandlers.hello.postMessage(null)
  },
  beforeDestroy() {
    console.log('destory')
    this.closeWebsocket()
  },
  methods: {
    ...mapMutations({
      updateApp: 'updateApp',
      setMask: 'setMask',
      userPos: 'userPos',
      upCategory: 'upCategory',
      setMusicInnerShow: 'setMusicInnerShow',
      updeteMessageCount: 'updeteMessageCount',
      userPhoneType: 'userPhoneType',
      setMusicIndex: 'setMusicIndex',
      setMusicSquencelist: 'setMusicSquencelist',
      setMusicPlayList: 'setMusicPlayList',
      setUserStatus: 'setUserStatus', // 设置用户是否是自己人
      setNetwork: 'setNetwork', // 设置网络状态
      updateCallWXState: 'updateCallWXState' // 表示更新调用微信状态
    }),
    ...mapActions({
      closeWebsocket: '/ws/closeWebsocket',
      connectWebsocket: '/ws/connectWebsocket'
    }),
    getStyle () {
      let h = 0
      if (this.tabBarVisibility) {
        h += 12
      }
      if (this.showNav) {
        if (this.navCmp === 'searchNav') {
          h += 21
        }
        if (this.navCmp === 'nav') {
          h += 13
        }
        if (this.navCmp === 'searchOnly') {
          h += 12.6
        }
      }
      return {
        height: `calc(100vh - ${h}vw)`
      }
    },
    goQueryFromWX(name, query) {
      // 音乐
      if (name === 'index') {
        this.$router.replace({ path: '/index', query: JSON.parse(query) })
      }
    },
    goLinkFromWX(name, params) {
      // 从微信进入app
      console.log('wx', name)
      console.log('wx', params)
      if (params) {
        if (name === 'vote') {
          // 投票列表
          this.$router.push({ name: 'voteList', params: JSON.parse(params) })
        } else if (name === 'voteDetail') {
          console.log('voteDetail', 'goLinkFromWX')
          this.$router.push({
            name: 'voteTransfer',
            params: JSON.parse(params)
          })
        } else if (
          this.$route.name === 'groupInfo' &&
          !this.authentication.isLogin()
        ) {
          this.$router.replace({ name: 'discoverindex' })
        } else if (this.$route.name === name) {
          this.$router.replace({ name: name, params: JSON.parse(params) })
          this.$router.go(0)
        } else {
          if (
            (name === 'discoverItemOnly' || name === 'discoverItem') &&
            JSON.parse(params).postId
          ) {
            this.$router.push({
              name: 'discoverItemOnly',
              params: JSON.parse(params)
            })
            return
          }
          this.$router.push({ name: name, params: JSON.parse(params) })
        }
      } else {
        this.$router.push({ name: name })
      }
    },
    /**
     * goMyGroupList
     */
    goMyGroupList(name, params) {
      if (params) {
        this.$router.push({ name: name, params: JSON.parse(params) })
      } else {
        this.$router.push({ name: name })
      }
    },
    goLink(name, id, otherId) {
      console.log(this.$route.name)
      // if(this.$route.name === name){
      //   return
      // }
      if (name === 'music') {
        this.$route.push({ path: '/index', query: { tab: 'music', id: id } })
      } else if (name === 'topicComment') {
        this.$router.push({
          name: name,
          params: { topicId: otherId, topicAnswerId: id }
        })
      } else if (
        name === 'discoverUser' &&
        id === this.$store.state.user.userId
      ) {
        this.$router.push({ name: 'my' })
      } else if (name === 'discoverItemOnly' || name === 'videoPlayer') {
        this.$router.push({ name: name, params: { postId: id } })
      } else if (!id && name) {
        this.$router.push({ name: name })
      } else {
        this.$router.push({ name: name, params: { id: id } })
      }
    },
    goDialog(type, userId, userName) {
      if (!userName) {
        return
      }
      this.$router.push({
        name: 'dialog',
        params: {
          type: type,
          userId: userId,
          userName: userName
        }
      })
    },
    getIMEICallBack(str) {
      // 获取用户手机 IMEI，getIMEI的回调
      localStorage.setItem('IMEI', str)
    },
    getNetworkType() {
      // 获取移动还是联通
      let data = JSON.parse(window.WanAndroid.getNetworkType())
      console.log('网络类型', data)
      this.$store.commit('userPhoneType', data)
    },
    onGetWxTokenComplete(code) {
      // 微信登录
      if (this.isCallWXBind) {
        // 表示手机号登录,绑定微信
        this.callBind(code)
        this.updateCallWXState(false)
        return
      }
      let me = this
      me.api.put({
        url: 'WxOpen',
        data: {
          code: code
        },
        success: function(res) {
          let user = {
            userToken: res
          }
          me.$store.dispatch('userLoginSuccess', { me: me, user: user })
        },
        error: function(e) {
          console.log(e.Message)
          console.log('微信登录失败')
        }
      })
    },
    callBind(code) {
      //手机号登录，用微信绑定
      let me = this
      me.api.put({
        url: 'AccountBand',
        data: {
          code: code
        },
        success: function(res) {
          console.log('手机号登录绑定微信成功了', res)
          me.$toast('绑定微信号成功', 1200)
          me.$router.replace({
            name: 'account'
          })
        },
        error: function(err) {
          me.$alert(err)
        },
        complete: function() {}
      })
    },
    onGetTokenComplete(jsonData) {
      // 一键登录
      // login之后的tocken
      let data = JSON.parse(jsonData)
      if (data.resultCode === '103000') {
        this.loginCMCCToken(data.token)
      }
    },
    loginCMCCToken(token) {
      let me = this
      me.api.process({
        url: 'UserCmcc',
        data: {
          token: token
        },
        success: function(res) {
          let user = {
            userToken: res
          }
          me.$store.dispatch('userLoginSuccess', { me: me, user: user })
        },
        error: function(e) {
          console.log(e.response.request.responseText)
          console.log(token)
          console.log('上传token失败')
        }
      })
    },
    goIndexAndRefresh() {
      let me = this
      me.$router.push({
        path: '/index',
        query: {
          refresh: true
        }
      })
    },
    modelCallBack() {
      this.upDateMsg = {}
      // data && this.upDateApp()
    },
    ifMask() {
      return this.hasMask
    },
    hideMask() {
      this.$store.commit('setMask', false)
    },
    setUserLocaltion(data) {
      data = JSON.parse(data)
      let me = this
      if (data.loctype === 50) {
        this.$store.commit('userPos', data)
      } else if (
        data.loctype === 61 ||
        data.loctype === 65 ||
        data.loctype === 161
      ) {
        this.$store.commit('userPos', data)
        if (this.$store.state.user.userId && data.city) {
          me.api.process({
            url: 'UserCity',
            data: {
              currentAreaProvince: data.province,
              currentAreaCity: data.city
            },
            success: function() {
              console.log('userCity')
            },
            error: function() {
              console.log('fail userCity')
            }
          })
        }
      } else if (data.loctype === 62) {
        this.$toast('定位失败，请检查是否开启定位')
        this.$store.commit('userPos', {
          loctype: 62
        })
      } else if (data.loctype === 63) {
        this.$toast('网络异常')
      } else if (data.loctype > 500 && data.loctype < 700) {
        this.$toast('参数错误')
      } else {
        this.$toast('其他错误')
      }
    },
    showMusicsss() {
      window.goQueryFromWX(
        'index',
        JSON.stringify({
          tab: 'music',
          id: '6552ff64-ed40-4e57-a111-ea8d092b6a34'
        })
      )
    },
    getCategory() {
      let me = this
      me.api.get({
        url: 'PostCategory',
        success: function(res) {
          me.$store.commit('upCategory', res)
        },
        error: function() {
          console.log('cate fail')
        }
      })
    },
    getLocation() {
      let toDay = this.format.date(new Date(), 'yyyy-MM-dd')
      let locationLastTime =
        JSON.parse(localStorage.getItem('locationTime')) || '0'
      let me = this
      if (locationLastTime < toDay) {
        let geoL = new window.BMap.Geolocation()
        geoL.getCurrentPosition(
          r => {
            if (geoL.getStatus() === window.BMAP_STATUS_SUCCESS) {
              if (r.address.province && r.address.city) {
                if (!this.$store.state.pos.city) {
                  let address = {
                    longitude: r.longitude,
                    latitude: r.latitude,
                    city: r.address.city,
                    address: r.address.district + r.address.street,
                    province: r.address.province
                  }
                  this.$store.commit('userPos', address)
                }
                me.api.process({
                  url: 'UserCity',
                  data: {
                    currentAreaProvince: r.address.province,
                    currentAreaCity: r.address.city
                  }
                })
              }
            }
          },
          { enableHighAccuracy: true }
        )
      }
    },
    goParams(name, params) {
      if (params) {
        this.$router.push({ name: name, params: JSON.parse(params) })
      } else {
        this.$router.push({ name: name })
      }
    },
    scrollOn() {
      console.log('点亮屏幕了', '重连')
      this.connectWebsocket()
    }
  }
}
</script>

<style lang="less">
// @import url("./assets/icon/iconfont.css");
// @import url("./assets/icon/iconfont2.css");
// @import url("./assets/icon/iconfont3.css");
// @import url("./assets/iconfont/iconfont.css");
// @import url(".//assets/css/weui/weui.min.css");

@import url("~@/assets/css/config.css");
@import url("~@/assets/css/common.css");
@import url("~@/assets/css/style.css");
@import url("~@/assets/less/home.less");
@import url("~@/assets/less/info.less");
@import url("~@/assets/less/settings.less");
@import url("~@/assets/less/discover.less");
@import url("~@/assets/less/component.less");
@import url("~@/assets/less/login.less");
@import url("~@/assets/less/form.less");
@import url("~@/assets/less/about.less");
@import url("~@/assets/css/icon.css");
@import url("~@/assets/less/pagesmaster.less");
@import url("~@/assets/less/pages.less");
@import url("~@/assets/less/vip.less");
.vipColor{
  color: var(--mRed)!important;
}
#appContent.no_scroll {
  overflow: hidden !important;
  .page {
    overflow: hidden !important;
    .redhead {
      overflow: hidden !important;
    }
  }
}
.zq-waterfall {
  padding: 0 !important;
  border-top: 1px solid #f3f3f3 !important;
  .discover {
    padding-left: 0.9vw;
  }
}
.pullup-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
  background-color: #fff;
  .before-trigger {
    font-size: 16px;
    color: #aaa;
  }
}
.openInApp {
  position: fixed;
  bottom: 12vw;
  left: 0;
  height: 9vw;
  line-height: 9vw;
  width: 100%;
  text-align: center;
  z-index: 10001;
  a {
    color: #fff;
    display: inline-block;
    padding: 0 3vw;
    border-radius: 5vw;
    background: var(--mRed);
  }
}
</style>
