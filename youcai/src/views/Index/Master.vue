<template>
  <div class="NavigationBar"
       id='IndexMaster'
       ref='IndexWrapper'
       :style='{willChange: willChange}'>
    <Search :tabList="searchTabList"
            v-if="searchMask"
            :searchType="searchType"
            @flas="setSearchMask(false)"
            :placeholder="searchplaceholder"></Search>
    <div class='fixedSearch'
         ref='fixedSearch'
         v-if="!listenPAS.subWrapTop">
      <div :class="['searchWrap',{smallSearchWrap: !listenPAS.subWrapTop}]">
        <i class="iconWsearch iconWanwan"></i>
        <input @click='setSearchMask(true)'
               type="text"
               placeholder="大家都在搜'去哪玩'"
               readonly />
      </div>
      <p class="scan"
         v-if="!listenPAS.subWrapTop"
         @click='scanQRCode'>
        <i class="iconWanwan iconWtubiaozhizuomoban"></i>
      </p>
    </div>
    <div class="NavHead"
         ref='topHeader'>
      <div class="headerUiWrap"
           ref='headerUiWrap'>
        <ul class="headUl"
            ref='headerUi'>
          <li @click="showFollow"
              :class="{'active':currTab==='follow'}"
              ref="headerUifollow">关注</li>
          <li @click="showDiscover"
              :class="{'active':currTab==='discover'}"
              ref="headerUidiscover">发现</li>
          <li @click="showMusic"
              :class="{'active':currTab==='music'}"
              ref="headerUimusic">声音</li>
          <li @click="showTopic"
              :class="{'active':currTab==='topic'}"
              ref="headerUitopic">话题</li>
        </ul>
        <i class="tabBottom"
           :style="{transform: 'translate3d(' + headerUiWrapCurLeft + ', 0, 0)'}"></i>
      </div>
    </div>
    <div class="navMain"
         ref='indexMain'>
      <transition name="fade">
        <tabFollow ref='follow'
                   :searchTitle="followSearchTitle"
                   v-bind:follow="msg"
                   v-if="!FF"
                   :show="currTab==='follow'"
                   @scroll='scroll'
                   @scroll-end='scrollEnd' />
      </transition>
      <transition name="fade">
        <tabDiscover ref="discover"
                     @canclick="canclick"
                     :searchTitle="discoverSearchTitle"
                     v-if="!FD"
                     :show="currTab==='discover'"
                     @scroll='scroll'
                     @scroll-end='scrollEnd' />
      </transition>
      <transition name="fade">
        <tabMusic ref="music"
                  :hasNewMusic="hasNewMusicList"
                  :searchTitle="topicSearchTitle"
                  v-bind:music="msg"
                  v-if="!FM"
                  :show="currTab==='music'"
                  @scroll='scroll'
                  @scroll-end='scrollEnd' />
      </transition>
      <transition name="fade">
        <tabTopic ref="topic"
                  :searchTitle="topicSearchTitle"
                  v-bind:topic="msg"
                  v-if="!FT"
                  :show="currTab==='topic'"
                  @scroll='scroll'
                  @scroll-end='scrollEnd' />
      </transition>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import upDateMask from '@/components/mixins/upDateMask'

const tabFollow = () => import('./Follow.vue')
const tabDiscover = () => import('./Discover.vue')
const tabTopic = () => import('./TopicHome.vue')
const tabMusic = () => import('./Music.vue')
const Search = () => import('@/components/Search/Search')
export default {
  mixins: [upDateMask],
  components: {
    tabFollow,
    tabDiscover,
    tabTopic,
    tabMusic,
     Search
  },
  data() {
    return {
      showBgLoading: true,
      hasNewMusicList: true,
      searchMask: false,
      searchType: '动态',
      searchTabList: ['动态', '用户', '声音', '群组'],
      FF: true,
      FT: true,
      FM: true,
      FD: false,
      currTab: '',
      curraa: 'buhao',
      msg: [],
      followSearchTitle: '',
      discoverSearchTitle: '',
      topicSearchTitle: '',
      musicSearchTitle: '',
      searchplaceholder: '搜一下吧',
      tabcanclick: true,
      listenPAS: {
        isParentTop: true,
        isSubTop: true,
        subWrapTop: false,
        subDirection: 0 // 1 向上
      },
      moveStart: 0,
      moveY: 0,
      moveScrollY: 0,
      boundaryY: 0,
      wrapBoundaryY: 0,
      boundaryScrollY: 0,
      subBoundaryScrollY: 0,
      isToTop: false,
      nearScale: {
        transform: 'scale(1)'
      },
      curCity: '',
      isToToping: false,
      willChange: 'auto',
      isScrollToTop: false,
      fixTabCurLeft: 0,
      headerUiWrapCurLeft: 0,
      tabData : ['follow', 'discover', 'music', 'topic'],
      timer: 0, // 返回顶部的时间戳
      isTouching: false // 是否正在滑动
    }
  },
  activated () {
    this.$share.close()
    this.memoryScroll()
  },
  created () {
    // 将当前的currTab设为 'discover'
    this.currTab = 'discover'
  },
  mounted () { // 渲染完毕监听页面滚动
    if (this.$store.state.isCallMyAttention || !this.authentication.isLogin()) {
      return
    } else {
      this.getAttentionList()
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.$refs[this.currTab].$refs.scroll && this.$refs[this.currTab].$refs.scroll.scroll && this.$refs[this.currTab].$refs.scroll.scroll.y) {
      from.meta.scrollY = this.$refs[this.currTab].$refs.scroll.scroll.y
    }
    next()
  },
  computed: {
    ...mapState({
      isPlaying: 'isPlaying',
      pos: 'pos',
      musicPage: 'musicPage',
      postType: 'postType'
    }),
    posCity () { // 当前的城市
      if (this.curCity) {
        return this.curCity
      } else {
        if (this.pos.city) {
          return this.pos.city.split('市')[0]
        } else {
          return '深圳'
        }
      }
    },
    maxScrollTop () { // 计算出 页面滚动的最大值
      return this.$refs.topHeader.offsetHeight - this.$refs.fixedSearch.offsetHeight
    },
    searchTitle() { // 根据tab改变search的placeholder
      if (this.currTab === 'music') {
        return '世界很大，多录陪你'
      } else if (this.currTab === 'topic') {
        return '发生的新鲜事儿'
      } else {
        return '大家都在搜活动攻略'
      }
    }
  },
  watch: {
    musicPage (newV) {
      newV === 'music' && this.showMusicss()
    },
    $route (to) {
      if (to.name === 'index' && to.query && to.query.id && to.query.tab) {
        this.showMusicss()
      }
    },
    currTab (newV) { // 根据当前的currTab改变fixTab的下标线
      this.tabData.findIndex((value) => {
        return value === newV
      })
      this.$refs[`fix${newV}`] && (this.fixTabCurLeft = this.$refs[`fix${newV}`].offsetLeft + this.$refs[`fix${newV}`].offsetWidth / 2 + 'px')
      this.$refs[`headerUi${newV}`] && (this.headerUiWrapCurLeft = this.$refs[`headerUi${newV}`].offsetLeft + this.$refs[`headerUi${newV}`].offsetWidth / 2 + 'px')
    }
  },
  methods: {
    ...mapMutations([
      'userPos',
      'setMask',
      'updateActiveConditions',
      'setMusicPage',
      'setMusicPlayList',
      'setMusicSquencelist',
      'setMusicPieShow',
      'setMusicPage',
      'setMusicInnerShow',
      'updateUserGroup',
      'setRebuild',
      'togglePostType',
      'setTimer',
      'updateCallState',
      'upFollow'
    ]),
    memoryScroll () {
      if (this.$route.meta && this.$route.meta.scrollY) {
        this.$refs[this.currTab].$refs.scroll.scrollTo(0, this.$route.meta.scrollY)
        this.$refs[this.currTab].$refs.scroll && this.$refs[this.currTab].$refs.scroll.refresh()
      } else{
        this.$nextTick(()=>{
          this.$refs[this.currTab] && this.$refs[this.currTab].$refs.scroll && this.$refs[this.currTab].$refs.scroll.refresh()
        })
      }
    },
    onScroll(){
    },
    /**
     * getAttentionList获得关注用户的用户列表
     */
    getAttentionList () {
      let me = this
      me.api.get({
        url: 'UserAttention/id?PageIndex=1&PageSize=1000',
        success: function (res) {
          let arr = []
          res.forEach((item) =>{
            arr.push(item.attentionUserId)
            me.upFollow(item.attentionUserId)
          })
          me.updateCallState(true)
        }
      })
    },
    /*
    * 下面是两个检测状态的函数，用于activited, 检测 滚动应有的位置 && 当前的页面tab
    */
    testScrollTopStatus () { // 检测滚动条应有的位置
      if (this.listenPAS.subWrapTop) {
        document.body.querySelector('#appContent').scrollTop = this.maxScrollTop
      }
      if (this.listenPAS.isParentTop) {
        document.body.querySelector('#appContent').scrollTop = 0
      }
    },
    testCurrTab () { // 检测当前的currTab
      if (this.currTab === 'discover') {
        this.$refs.discover && this.$refs.discover.$refs.scroll.refresh()
      } else if (this.currTab === 'music') {
        this.$refs.music && this.$refs.music.$refs.scroll.refresh()
      } else if (this.currTab === 'topic') {
        this.$refs.topic && this.$refs.topic.$refs.scroll.refresh()
      }
      if (this.$route.query.tab && this.$route.query.id) {
        this.showMusicss()
      }
    },
    scroll () {
    },
    scrollEnd () {
    },
    /*
     * 页面跳转函数
     */
    neabry (index) { // neabry附近人或者群 | 要有 定位 && 登录
      this.updateUserGroup(index)
      this.go.name('user_Group', ['pos', 'login'])
    },
    shopList () { // 附近优惠
      this.$router.push({name: 'show_list'})
    },
    canclick(data) {
      this.tabcanclick = data
    },
    /*
    * 显示searchMask
    */
    setSearchMask(data) {
      this.searchMask = data
      // this.setMask(data)
      !data && this.$store.commit('setMusicPage', this.currTab)
    },
    /*
    * 以下四个函数 是切换cuurTab显示相应的页面
    */
    showFollow() {
      this.currTab = 'follow'
      this.searchType = '动态'
      this.FF = false
      this.$store.commit('setMusicPage', 'follow')
    },
    showDiscover() {
      this.currTab = 'discover'
      this.searchType = '动态'
      this.$store.commit('setMusicPage', 'discover')
      this.FD = false
    },
    showMusic() {
      if (!this.tabcanclick) {
        return
      }
      this.currTab = 'music'
      this.searchType = '声音'
      this.FM = false
      this.$store.commit('setMusicPage', 'music')
    },
    showTopic() {
      this.currTab = 'topic'
      this.searchType = '话题'
      this.$store.commit('setMusicPage', 'topic')
      this.FT = false
    },
    /*
    * 扫描二维码
    */
    scanQRCode () {
      window.isInAndroid && window.WanAndroid.scanQRCode()
    },
    /*
    * activited 显示music页面
    */
    showMusicss () {
      this.showMusic()
      let me = this
      let musicId = this.$route.query.id
      if (!musicId) {
        return
      }
      me.api.get({
        url: `Voice/id?VoiceId=${musicId}`,
        success: function(res) {
          let curMusicItem = []
          curMusicItem.push(res)
          me.$store.commit('setMusicPlayList', curMusicItem)
          me.$store.commit('setMusicSquencelist', curMusicItem)
          me.$store.commit('setMusicIndex', 0)
          me.$store.commit('setMask', true)
          me.$store.commit('setMusicInnerShow', true)
          me.$router.replace({ path: '/index' })
        }
      })
    }
  }
}
</script>
<style lang="less">
.headerUiWrap {
  position: relative;
  .togglePostType {
    position: absolute;
    top: 0;
    right: 0;
    width: 11.76vw;
    height: 11.76vw;
    line-height: 11.76vw;
    color: #666;
    font-size: 5vw;
    text-align: center;
  }
  .tabBottom {
    position: absolute;
    left: 0;
    bottom: 1px;
    width: 7.6vw;
    height: 2px;
    margin-left: -3.8vw;
    background: var(--mRed);
    transition: all 0.25s ease-in-out;
  }
}

.fixedSearch{
// display: none !important;
position: fixed;
top: 0;
left: 0;
display: flex;
width: 100vw;
height: 8.33vw;
line-height: 8.33vw;
padding: 1.8vw 0vw 0.9vw ;
z-index: 100;
background: #fff;
box-sizing: content-box;

.headUlWrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  position: relative;
  .headUl {
    display: flex;
    width: 60vw;
    li {
      flex: 1;
      width: 11.94vw;
      text-align: center;
      line-height: 8.7vw;
      color: #999999;
      font-size: 4.5vw;
      &.active {
        color: #1a1a1a;
        font-weight: 500;
      }
    }
  }
  .fixtabBottom{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 7.6vw;
    height: 2px;
    margin-left: -3.8vw;
    background: var(--mRed);
    transition: all 0.25s ease-in-out;
  }
}

p {
text-align: center;
color: var(--mRed);
font-size: var(--mText);
}
.position {
width: 15.48vw;
color: var(--dGray);
text-align: center;
padding-left: 3vw;
}
.searchWrap {
// width: 80vw;
flex: 1;
height: 8.7vw;
line-height: 8.7vw;
border-radius: 4vw;
display: flex;
background-color: #f5f5f5;
margin-left:3vw;
color:#767676;
.iconWsearch{
margin-left:3vw;
margin-right:3vw;
}
input {
flex: 1;
border: none;
outline: none;
vertical-align: top;
height: 8.7vw;
line-height: 8.7vw;
background-color: transparent;
letter-spacing: 1px;
}
}
.smallSearchWrap{
// width:70vw;
}
.scan {
  margin-top: 2px;
  height:8.7vw;
  line-height: 8.7vw;
  width: 12vw;
  text-align: center;
  .iconWanwan {
    color: var(--dGray);
    font-size: var(--BTitle);
    font-weight: bold;
  }
}
.goBackTop{
width:12vw;
height:8.7vw;
margin-left:2vw;
font-size: 0;
display:flex;
flex-flow: row wrap;
justify-content: center;
.activityNotice{
height:4vw;
line-height:5vw;
width: 4vw;
// color:rgb(255, 39, 66);
background: linear-gradient(to top right, #ff4f27, #fe81af);
-webkit-background-clip: text;
color:transparent;
}
.backfont{
font-size:3vw;
display:inline-block;
width:100%;
height:4vw;
text-align: center;
line-height: 4vw;
color:#767676;
}
}
}
// #appContent.no_scroll {
//   overflow: scroll !important;
// }
.nearListWrap{
  height: 28vw;
  .nearList{
    display: flex;
    width:100%;
    height:28vw;
    box-sizing: border-box;
    // align-items: center;
    justify-content: center;
    // background: #ff2742;
    background: #fff;
    li{
      flex: 1;
      text-align: center;
      // transform: scale(0.8);
      transform-origin: center bottom;
      .nearBg{
        display: inline-block;
        width: 13.9vw;
        height: 11vw;
        margin-top: 5.55vw;
        border-radius: 5.4vw;
        background: linear-gradient(to right, #46e5ca, #0be496);
        color:#fff;
        line-height: 11vw;
        .iconWanwan {
          font-size: 7.7vw;
        }
        &.nearbg2 {
          background: linear-gradient(to right, #faa54e, #f8816b);
        }
        &.nearbg3 {
          background: linear-gradient(to bottom, #ff771a, #ff4a72);
        }
        &.nearbg4 {
          background: linear-gradient(to top right, #8ff65c, #b8eb00);
        }
      }
      > p {
        height: 9.1vw;
        line-height: 9.1vw;
        font-size: var(--mText);
        font-weight: bold;
        color: var(--dGray);
        // letter-spacing: 1px;
      }
    }
  }
}

.NavigationBar {
  .NavHead {
    padding-top: 11.03vw;
    width: 100%;
    // height: 24.4vw;
    background-color: white;
    // position: fixed;
    top: 0;
    left: 0;
    z-index: 888;
    .headUl {
      width: 60vw;
      height: 11.76vw;
      margin: auto;
      display: flex;
      justify-content: space-between;
      li {
        width: 11.94vw;
        text-align: center;
        line-height: 11.94vw;
        color: #999999;
        font-size: 4.5vw;
      }
      .active {
        color: #1a1a1a;
        font-weight: 500;
      }
    }
    .contentShift {
      width: 60vw;
      height: 3vw;
      position: absolute;
      top: 9vw;
      left: 0;
      right: 0;
      margin: 0 auto;
      .shift {
        display: inline-block;
        width: 8vw;
        height: 2px;
        background-color: rgb(255, 39, 66);
        position: absolute;
        left: 18vw;
        top: 0.5vw;
        transition: all 0.35s;
      }
    }
    .userInputWrap {
      width: 100%;
      display: flex;
      height: 8.51vw;
      .userInput {
        flex: 1;
        overflow: hidden;
        // width: 94.44vw;
        height: 8.51vw;
        background-color: rgb(245, 245, 245);
        border-radius: 4vw;
        display: flex;
        align-items: center;
        font-size: 3.89vw;
        color: #999999;
        justify-content: center;
        margin: auto;
        .userInputBtn {
          flex: 1;
          overflow: hidden;
          width: 95%;
          height: 7vw;
          line-height: 7vw;
          border-radius: 4vw;
          display: flex;
          justify-content: center;
          span:nth-child(1) {
            margin-right: 2vw;
          }
        }
      }
      .goBackTop{
        width:12vw;
        text-align:center;
        height: 8.51vw;
        line-height: 8.51vw;
      }
    }
  }
}
</style>
