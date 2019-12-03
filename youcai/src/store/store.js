import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/assets/js/ApiHelper'
import fmt from '@/assets/js/format'
import websocket from './modules/websocket'
import global from './modules/global'
import shopcart from './modules/shopcart'
// import Config from '@/assets/js/config'
// import data from '@/assets/js/data'
/** 登录
 *  1. 将用户登录状态与phone存储本地 (commit userLogin)
 *  2. 更新用户信息State, 并告知 android 用户信息与用户是否是VIP
 *  3. 告知服务器, 用户所在城市
 *  4. 更新用户关注列表
 */
/** 登出
 *  1. 清除用户登录状态与一些使用中的存储  (commit userLogout) // 本地存储 用户登录状态/phone/ud/searchHistory/draft
 *  2. 重置 用户信息State, 点赞/收藏State,告知android 重置VIP
 *  3. 不用告知服务器所在城市
 *  4. 清空用户关注列表
 */
/** VIP
 *  登录/登出/toBeVIP成功
 */
Vue.use(Vuex)

const defaultUser = {
  vipLevel: 0,
  avatar: '',
  birth: '0001-01-01T00:00:00',
  userGender: 0, // 默认性别
  userId: '',
  userMessage: null, //
  userCart: 0, //
  name: '',
  nickName: '',
  personStatement: '',
  attentionCount: 0,
  fansCount: 0,
  likeCount: 0,
  groupCount: 0,
  ownGroupCount: 0,
  timeCreate: '',
  userImages: [],
  userPhone: '',
  userProvince: '',
  userCity: '',
  emailBind: '',
  userFeel: '',
  userCareer: 10,
  userLabel: [],
  userInterest: [],
  emotionState: [],
  lable: ''
}
const defaultCounts = {
  likes: [],
  reads: [],
  follows: [],
  favs: [],
  fans: []
}

export default new Vuex.Store({
  modules: {
    ws: websocket,
    gl: global,
    sc: shopcart
  },
  state: {
    defaultBirth: '0001-01-01T00:00:00',
    noneAvator: 'http://webapp.szwanwan.com/img/default/defaultavatar.png',
    defaultAvatarList: ['http://file.szwanwan.com:8888/group1/M00/00/48/rBpkyFzourOAHyA6AABbcMMe0wc315.png'], // 默认头像列表
    avatarDefault: 'http://file.szwanwan.com:8888/group1/M00/00/48/rBpkyFzourOAHyA6AABbcMMe0wc315.png',
    postCategory: {
      categorys: [],
      items: []
    },
    user: JSON.parse(JSON.stringify(defaultUser)),
    // userBusiness
    messageCount: 0, // 消息数据
    isFansChange: 1, // 表示粉丝页
    userGroupIndex: 1, // 表示找人和找群的index,1表示找人，2表示找群
    groupManageList: [], // 群管理员数据
    groupChatSetData: null, // 群group聊天设置里面的数据
    personalSetData: null, // 个人设置里面的数据
    masterCurTab: '', // 发布动态里面的数据
    replayConfirm: '', // 回复评论的title
    twoReplayShow: false, // 表示是否显示回复
    twoReplayList: [], // 二级评论数据
    isShowReplayConfirm: false, // 是否显示回复确认框
    postDraftState: -1, // 是否启用草稿
    initRoutePath: '', // 进入发页的初始路径
    isRefreshMyPage: { // 表示是否刷新我的页面
      isRefreshPost: false, // 表示刷新我的动态
      isRefreshCollect: false, // 表示刷新我的收藏
      isRefreshActivity: false // 表示刷新我报名的活动
    },
    isCallWXBind: false, // 表示是手机号登录，需要绑定微信
    isShowVote: true, // 表示是否显示投票按钮
    Actions: {
      likes: []
    },
    voteList: [],
    follows: [],
    likes: [],
    disLikes: [],
    favs: [],
    disFavs: [],
    counts: {
      likes: defaultCounts.likes,
      reads: defaultCounts.reads,
      follows: defaultCounts.follows,
      favs: defaultCounts.favs,
      fans: defaultCounts.fans
    },
    meta: {
      title: ''
    },
    pos: {
      longitude: '1',
      latitude: '2',
      city: '',
      loctype: 0,
      province: ''
    },
    activeConditions: {
      activehots: [],
      activetimes: [],
      activetypes: [],
      activeFrees: [{
          label: '全部',
          value: 0
        },
        {
          label: '免费',
          value: 1
        },
        {
          label: '付费',
          value: 2
        }
      ]
    },
    app: {
      version: '6'
    },
    navTit: '',
    hasMask: false,
    hasSubMask: false,
    searchHistory: [],
    defaultAvator: '', // 其他用户默认头像
    isPlaying: false, // music的播放状态
    playlist: [], // music的播放列表
    squencelist: [], // music的播放队列
    currentIndex: -1, // 当前播放音乐
    musicMode: 0, // 当前播放音乐模式 0 列表循环 1 单曲循环 2 随机播放
    pieShow: true, // 是否显示音乐
    musicInnerShow: false,
    currentTime: '00:00',
    duration: '00:00',
    changeRage: 0,
    musicPage: '',
    countReply: 0,
    TotalLike: 0,
    videoSrc: '',
    isInApp: true, // 是否是微信环境
    isZijiren: true, // 是否是自己人
    myFollowFrom: '',
    isClick: false,
    draftsIndex: -1, // 草稿箱的Index
    shouldShowModel: true, // activityPost是否检测草稿箱
    changeColor: 1, // my_follow 的tab
    isCallMyAttention: false, // 表示刚进页面是否调用我的关注列表方法
    isShowVoteStatePage: false, // 表示默认显示投票排行榜的一页
    bindCodeTimer: null, //手机验证码计时器
    bindCodeWaitTime: null, // 手机验证码倒数时间
    myNeedBack: false,
    rebuild: false,
    operatorType: '',
    networkType: '',
    postType: 0, // 首页发现页的postType
    isReallyBack: false,
    postCurTab: 0, // postTab
    networkState: '1', // 网络环境状态
    phoneCodeTimer: null, //手机验证码计时器
    phoneCodeWaitTime: null, // 手机验证码倒数时间
    showBgLoading: true,
    // scrollPosY: 0
    // isInApp: !(window.location.origin.indexOf('http://webapp.szwanwan.com') >= 0)
    messagePage: { // 消息页需要用到的数据
      isLongClick: false,
      chatId: '',
      height: 0,
      scrollHeight: 0,
      top: null
    },

  },
  getters: {
    reallyHeight: state => () => (state.messagePage.height - state.messagePage.scrollHeight),
    hasBaseInfo: state => () => !(state.user.nickName === state.user.name || !state.user.gender),
    userIsLogin: state => {
      return state.user.userId >= 1
    },
    userAvatar: state => {
      return (state.user.avatar && state.user.avatar.length >= 1 && state.user.avatar !== defaultUser.avatar) ? (state.user.avatar) : defaultUser.avatar
    },
    userBirth: state => {
      return state.user.birth && state.user.birth.length >= 1 ? state.user.birth : defaultUser.birth
    },
    musicCover: state => {
      return (state.squencelist && state.squencelist.length) ? (state.squencelist && state.squencelist[state.currentIndex].imageUrl) : ''
    },
    musicSrc: state => {
      if (state.currentIndex < 0) {
        return ''
      }
      return state.squencelist.length ? state.squencelist[state.currentIndex].voiceUrl : ''
    },
    musicItem: state => {
      return state.squencelist.length ? state.squencelist[state.currentIndex] : {}
    },
    musicCurrentTime: state => {
      const min = parseInt(state.currentTime / 60) <= 9 ? '0' + parseInt(state.currentTime / 60) : parseInt(state.currentTime / 60)
      const sec = parseInt(state.currentTime % 60) <= 9 ? '0' + parseInt(state.currentTime % 60) : parseInt(state.currentTime % 60)
      if (isNaN(min)) {
        return '00:00'
      }
      return min + ':' + sec
    },
    musicDurationTime: state => {
      const min = parseInt(state.duration / 60) <= 9 ? '0' + parseInt(state.duration / 60) : parseInt(state.duration / 60)
      const sec = parseInt(state.duration % 60) <= 9 ? '0' + parseInt(state.duration % 60) : parseInt(state.duration % 60)
      if (isNaN(min)) {
        return '00:00'
      }
      return min + ':' + sec
    }
  },
  // TODO: 与changeColor相关的 弃用的函数应该删掉
  // FIXME: 书写顺序 -> 重要的 | 用户信息相关 | 全局都用的函数 在前面 
  mutations: {
    hideBgLoading(state) {
      state.showBgLoading = false
    },
    setMask(state, payload) { // 设置是否有浮层 | 有浮层 -> 物理返回键不返回 -> 关闭浮层
      state.hasMask = payload
      window.isInAndroid && window.WanAndroid.openTopics(payload)
    },
    setSubMask(state, payload) { // 是否有二级浮层 -> 未启用
      state.hasSubMask = payload
      window.isInAndroid && window.WanAndroid.openTopics(payload)
    },
    setUserStatus(state, payload) { // 设置用户是否是自己人
      state.isZijiren = payload
    },
    setNetwork(state, payload) { // 设置网络状态
      state.networkState = payload
    },
    /** 更新用户信息
     *  1. 更新用户state
     *  2.1 告知android 用户基本信息
     *  2.2 告知android 是否是vip
     *  3. 本地存储 userId
     */ 
    updateUserInfo(state, payload) { // 更新用户信息 告知android用户名字等信息 
      Object.assign(state.user, payload)
      window.isInAndroid && window.WanAndroid.startRongMsg(payload.userId, payload.nickName || payload.name, payload.avatar)
      window.isInAndroid && window.WanAndroid.setVip(!!payload.vipLevel)
      localStorage.setItem('ud', payload.userId)
    },
    /*
     * 用户登录And登出逻辑
     */
    userLogin(state, payload) { // 存储用户信息
      const userToken = payload.userToken
      localStorage.setItem('Headers_Authorization', userToken)
      localStorage.setItem('tianv_login_Time', new Date().valueOf() + '') // 存储登录的时间
      // 存储电话号码
      if (payload.userPhone && payload.userPhone.length >= 1) {
        localStorage.setItem('my_phone', payload.userPhone)
      }
      Object.assign(state.user, {
        userPhone: payload.userPhone
      })
    },
    updateUserInfoItem (state, payload) { // 更改用户某一项信息
      Object.assign(state.user, payload)
    },
    userLogout(state) { // 用户登出 -> 清空请求头 && 重置user信息
      localStorage.removeItem('my_phone') // 清空电话信息
      localStorage.removeItem('Headers_Authorization') // 清空请求头
      localStorage.removeItem('ud') // 清空用户Id
      // 清除进入task页面的时间
      localStorage.setItem(`${fmt.id(state.user.userId)}visitTaskTime`, '')
      // XXX: 不能清空H5存储，因为草稿箱用h5存储的
      // 缺点 -> 占用存储空间 | 用户切换账号 用同样的草稿箱 | 用户登出草稿箱清除 
      state.searchHistory = [] // 清空搜索信息
      localStorage.setItem('searchHistory', '')
      // 清空点赞state
      state.disLikes = []
      state.likes = []
      state.favs = []
      state.disFavs = []
      Object.assign(state.user, defaultUser)
      window.isInAndroid && window.WanAndroid.setVip(false)
    },
    /*
     * 更新用户位置信息
     */
    userPos(state, payload) { // 存储用户的位置信息
      payload.longitude && (state.pos.longitude = payload.longitude)
      payload.latitude && (state.pos.latitude = payload.latitude)
      payload.city && (state.pos.city = payload.city)
      payload.address && (state.pos.address = payload.address)
      payload.loctype && (state.pos.loctype = payload.loctype)
      payload.province && (state.pos.province = payload.province)
      localStorage.setItem('longitude', payload.longitude)
      localStorage.setItem('latitude', payload.latitude)
      localStorage.setItem('my_city', payload.city)
      localStorage.setItem('my_address', payload.address)
    },

    userPhoneType(state, payload) { // 用户手机号码 类型 | 联通 | 移动 -> 能不能使用一键登录
      if (payload.operatorType) {
        state.operatorType = payload.operatorType
      }
      if (payload.networkType) {
        state.networkType = payload.networkType
      }
    },
    /* 
     * vuex 与 本地存储 searchHistory状态 | 搜索历史
     */
    setSearchHistoryArr(state) { // 获取搜索历史
      state.searchHistory = JSON.parse(localStorage.getItem('searchHistory'))
    },
    setSearchHistory(state, payload) {
      for (let i = 0; i < state.searchHistory.length; i++) {
        if (state.searchHistory[i].value === payload.value) {
          state.searchHistory.splice(i, 1)
        }
      }
      state.searchHistory.unshift(payload)
      localStorage.setItem('searchHistory', JSON.stringify(state.searchHistory))
    },
    clearSearchHistory(state) {
      state.searchHistory = []
      localStorage.setItem('searchHistory', '')
    },
    /*
     * updateDraftState 更新草稿
     */
    updateDraftState(state, payload) {
      state.postDraftState = payload
    },
    /*
     * 以下6个方法为存储 是否 关注、点赞、收藏的状态列表
     */
    upFollow(state, payload) {
      state.follows.push(payload)
    },
    upVoteList(state, payload) {
      state.voteList.push(payload)
    },
    clearVoteList(state) {
      state.voteList = []
    },
    upDisFollow(state, payload) {
      state.follows.splice(state.follows.indexOf(payload), 1)
    },
    upLike(state, payload) {
      if (state.disLikes.indexOf(payload) >= 0) {
        state.disLikes.splice(state.disLikes.indexOf(payload), 1)
      }
      state.likes.push(payload)
    },
    upDisLike(state, payload) {
      if (state.likes.indexOf(payload) >= 0) {
        state.likes.splice(state.likes.indexOf(payload), 1)
      }
      state.disLikes.push(payload)
    },
    upFav(state, payload) {
      if (state.disFavs.indexOf(payload) >= 0) {
        state.disFavs.splice(state.disFavs.indexOf(payload), 1)
      }
      state.favs.push(payload)
    },
    upDisFav(state, payload) {
      if (state.favs.indexOf(payload) >= 0) {
        state.favs.splice(state.favs.indexOf(payload), 1)
      }
      state.disFavs.push(payload)
    },

    setRebuild(state, payload) {
      state.rebuild = payload
    },
    /**
     * updateChangeFans 更新粉丝页changeColor
     */
    updateChangeFans(state, payload) {
      state.isFansChange = payload
    },
    /**
     * updateUserGroup 更新找人和找群里的changeColor
     */
    updateUserGroup(state, payload) {
      state.userGroupIndex = payload
    },
    /*
     * updateGroupManageList 更新群管理员数据
     */
    updateGroupManageList(state, payload) {
      state.groupManageList = payload
    },
    /*
     * updateGroupChatSet 更新群聊设置数据
     */
    updateGroupChatSet(state, payload) {
      state.groupChatSetData = payload
      if (payload) {
        state.groupChatSetData.isTop = payload.isTop // 是否置顶 true表示置顶
        state.groupChatSetData.isMute = payload.isMute // 是否免打扰 0表示免打扰
        state.groupChatSetData.groupId = payload.groupId // 是否免打扰 0表示免打扰
      }
    },
    /*
     * updatePersonChatSet 更新群聊设置数据
     */
    updatePersonChatSet(state, payload) {
      state.personalSetData = payload
      if (payload) {
        state.personalSetData.isTop = payload.isTop // 是否置顶 true表示置顶
        state.personalSetData.isMute = payload.isMute // 是否免打扰 0表示免打扰
        state.personalSetData.userId = payload.userId
      }
    },
    /**
     * updateMasterCurTab  切换 POST curTab
     */
    updateMasterCurTab(state, payload) {
      state.masterCurTab = payload
      if (payload) {
        state.masterCurTab = payload.curTab
      }
    },
    /**
     * updateMasterCurTab  切换 POST curTab
     */
    upPostCurTab(state, payload) {
      state.postCurTab = payload
    },
    /*
     * updateReplayTitle 更新二级评论title
     */
    updateReplayTitle(state, payload) {
      state.replayConfirm = payload
    },
    updateReplayState(state, payload) {
      state.twoReplayShow = payload
    },
    /**
     * updateReplayList 更新二级评论数据
     */
    updateReplayList(state, payload) {
      state.twoReplayList = payload
    },
    /**
     * updateShowConfirm 更新显示评论回复确认框
     */
    updateShowConfirm(state, payload) {
      state.isShowReplayConfirm = payload
    },
    /*
     * updateShowConfirm 更新显示评论回复确认框
     */
    updateInitPath(state, payload) {
      state.initRoutePath = payload
    },
    /**
     * updateMyPage 更新我的页面数据
     */
    updateMyPage(state, payload) { // 修改, 直接传一个属性进来，会重置另外两个为undefined,收藏帖子与收藏音乐应该有两个字段(不然也会重置)
      state.isRefreshMyPage = Object.assign({}, state.isRefreshMyPage, payload)
      // state.isRefreshMyPage.isRefreshPost = payload.isRefreshPost
      // state.isRefreshMyPage.isRefreshActivity = payload.isRefreshActivity
      // state.isRefreshMyPage.isRefreshCollect = payload.isRefreshCollect // 等于1的时候更新我的收藏帖子，等于2的时候更新收藏我的音乐
      // console.log(state.isRefreshMyPage, 'state.isRefreshMyPage')
    },
    updateCallWXState(state, payload) {
      state.isCallWXBind = payload
    },
    updateVoteBtn(state, payload) {
      state.isShowVote = payload
    },
    /*
     * my_follow 的 changeColor
     */
    upColor(state, payload) {
      state.changeColor = payload
    },
    updateCallState(state, payload) { // 表示更新调用状态, payload： false,表示没有调用，为true表示调用过了，进入这个页面就不再调用
      state.isCallMyAttention = payload
    },
    updateVotePage(state, payload) { // 为false表示表示默认显示投票列表页，为true表示默认显示投票排行榜那页
      state.isShowVoteStatePage = payload
    },
    updateNeedBack(state, payload) {
      state.myNeedBack = payload
    },
    // 设置绑定手机号倒数时间
    setBindWaitCodeTime(state, payload) {
      state.bindCodeWaitTime = payload ? payload : 60
      state.bindCodeTimer = setInterval(function () {
        state.bindCodeWaitTime--
        if (state.bindCodeWaitTime <= 0) {
          clearInterval(state.bindCodeTimer)
        }
      }, 1000)
    },
    updateFollowList(state) { // 表示退出登录把follow数据清空
      state.follows.length = 0
    },
    /*
     * discover 的 category
     */
    upCategory(state, payload) {
      state.postCategory.categorys = payload.categorys
      state.postCategory.items = payload.items
    },
    /*
     * 设置是否显示model
     */
    activityPostNoModel(state, payload) {
      state.shouldShowModel = payload
    },
    /*
     * 设置 draftsIndex
     */
    upDraftsIndex(state, payload) {
      state.draftsIndex = payload
    },
    /*
     * 是不是my-follow内部点击
     */
    setClick(state, payload) {
      state.isClick = payload
    },
    /*
     * my_follow 的 from 路由存储
     */
    upMyFollowFrom(state, payload) {
      state.myFollowFrom = payload
    },
    updateCounts(state, payload) {
      if (payload && payload.likes) {
        state.counts.likes = payload.likes
      }
      if (payload && payload.follows) {
        state.counts.follows = payload.follows
      }
      if (payload && payload.reads) {
        state.counts.reads = payload.reads
      }
      if (payload && payload.favs) {
        state.counts.favs = payload.favs
      }
      if (payload && payload.fans) {
        state.counts.fans = payload.fans
      }
    },
    updateMetaTitle(state, payload) { // 动态改变meta的title
      state.meta.title = payload
      window.document.title = payload
    },
    updateActiveConditions(state, payload) { // 更新活动的Picker 选项
      if (payload && payload.activehots) {
        state.activeConditions.activehots = payload.activehots
      }
      if (payload && payload.activetimes) {
        state.activeConditions.activetimes = payload.activetimes
      }
      if (payload && payload.activetypes) {
        state.activeConditions.activetypes = payload.activetypes
      }
    },
    updateMessagePage(state, payload) {
      state.messagePage.isLongClick = payload.isLongClick
      state.messagePage.chatId = payload.chatId
      state.messagePage.height = payload.height
      state.messagePage.scrollHeight = payload.scrollHeight
      state.messagePage.top = payload.top

    },
    updateApp(state, payload) { // 更新app的版本
      state.app.version = payload.version
    },
    /*
     * 首页操作
     */
    togglePostType(state, payload) { // 切换首页Discover的post类型 0 全部 | 1 图文 | 2 视频
      state.postType = payload
      localStorage.setItem('postType', payload)
    },
    /*
     * 一系列music的操作
     */
    setMusicPlay(state, payload) {
      state.isPlaying = payload
    },
    setMusicPlayList(state, payload) {
      state.playList = payload
    },
    setMusicSquencelist(state, payload) {
      state.squencelist = payload
    },
    setMusicPieShow(state, payload) {
      state.pieShow = payload
    },
    setMusicIndex(state, payload) {
      state.currentIndex = payload
    },
    setMusicInnerShow(state, payload) {
      state.musicInnerShow = payload
    },
    setMusicItemDetail(state, payload) {
      state.currentTime = payload.currentTime.toFixed(2)
      state.duration = payload.duration.toFixed(2)
    },
    setMusicChangeRage(state, payload) {
      state.changeRage = payload
    },
    setMusicMode(state) {
      state.musicMode = state.musicMode + 1
      if (state.musicMode > 2) {
        state.musicMode = 0
      }
    },
    setMusicNext(state) {
      const length = state.squencelist.length
      if (state.musicMode === 0 || state.musicMode === 1) {
        state.currentIndex = (state.currentIndex + 1) % length
      } else {
        state.currentIndex = Math.floor(Math.random() * length)
      }
      state.isPlaying = true
    },
    setMusicPrve(state) {
      const length = state.squencelist.length
      if (state.musicMode === 0 || state.musicMode === 1) {
        state.currentIndex = (state.currentIndex - 1 + length) % length
      } else {
        state.currentIndex = Math.floor(Math.random() * length)
      }
      state.isPlaying = true
    },
    setMusicPage(state, payload) {
      state.musicPage = payload
    },
    // musicEnd

    setCountReply(state, payload) {
      state.countReply = payload
    },
    /*
     * 设置当前video的播放源
     */
    setVideo(state, payload) {
      state.videoSrc = payload
    },
    /*
     * group状态
     */
    // 更新groupNumber
    upUserGroupNumber(state) {
      state.user.groupCount++
      state.user.ownGroupCount++
    },
    //
    upIsReallyBack(state, payload) {
      state.isReallyBack = payload
    },
    // 设置倒数时间
    setWaitCodeTime(state, payload) {
      state.phoneCodeWaitTime = payload ? payload : 60
      state.phoneCodeTimer = setInterval(function () {
        state.phoneCodeWaitTime--
        if (state.phoneCodeWaitTime <= 0) {
          clearInterval(state.phoneCodeTimer)
        }
      }, 1000)
    },
    setNavTit(state, payload) {
      state.navTit = payload
    },
    setVIP (state, payload) {
      state.user.vipLevel = payload.vipLevel
      window.isInAndroid && window.WanAndroid.setVip(!!payload.vipLevel)

    }
  },
  actions: {
    async userLoginSuccess(context, _this) {
      context.commit('userLogin', _this.user)
      await context.dispatch('getUserMain', _this.me)
      await context.dispatch('upDateUserCity', _this.me)

      await context.dispatch('getAttentionList', _this.me)
      _this.me.$nextTick(() => {
        _this.me.initSql()
        if (!context.state.ws.socketStatus) { // 登录成功就链接websocket
          context.dispatch('ws/connectWebsocket')
        }
      })
      // let recommend = await context.dispatch('isRecommend', _this.me) // 不要选择分类了
      // return recommend
      _this.me.$router.replace({
        name: 'loginSuccess'
      })
      window.isInAndroid && window.WanAndroid.closeCMCCLoginActivity()
    },
    getUserMain(context, _this) { // 获取用户信息并更新存储状态
      return new Promise((resolve, reject) => {
        _this.api.get({
          url: 'UserMain',
          success: function (res) {
            // 更新用户的信息
            if (res) {
              context.commit('updateUserInfo', res)
              context.dispatch('ws/upUser', res)
            }
            resolve()
          },
          error: function () {
            reject()
          }
        })
      })
    },
    getAttentionList(context, _this) { // 获取用户关注列表
      return new Promise((resolve, reject) => {
        _this.api.get({
          url: 'UserAttention/id?PageIndex=1&PageSize=1000',
          success: function (res) {
            context.commit('updateCallState', true)
            res.forEach((item) => {
              context.commit('upFollow', item.attentionUserId)
            })
            resolve()
          },
          error: function (err) {
            reject(err)
          }
        })
      })
    },
    isRecommend(context, _this) { // 获取用户是否添加感兴趣的标签 并 路由跳转 || loginSuccess的最后一步
      return new Promise((resolve, reject) => {
        _this.api.get({
          url: 'Recommend',
          success: function (res) {
            //  res表示是否填过推荐
            if (!res) {
              _this.$router.replace({
                name: 'recommentLabel'
              })
            } else {
              _this.$router.replace({
                name: 'loginSuccess'
              })
              window.isInAndroid && window.WanAndroid.closeCMCCLoginActivity()
            }
            resolve(res)
          },
          error: function (err) {
            reject(err)
          }
        })
      })
    },
    upDateUserCity(context, _this) { // 更新用户所在城市
      return new Promise((resolve, reject) => {
        if (context.state.pos.province && context.state.pos.city && context.state.user.userId) {
          _this.api.process({
            url: 'UserCity',
            data: {
              currentAreaProvince: context.state.pos.province,
              currentAreaCity: context.state.pos.city
            },
            success: function () {
              resolve()
            },
            error: function () {
              reject()
            }
          })
        } else {
          resolve()
        }
      })
    },
    userLogoutAsync(context) {
      context.commit('userLogout')
      context.commit('updateFollowList')
      context.dispatch('ws/closeWebsocket')
      window.isInAndroid && window.WanAndroid.logoutDuo(this.user.userId)
    },
    readerFile(context, payload) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader()
        reader.onload = function (e) {
          resolve(e.target.result)
        }
        reader.onerror = function (e) {
          reject(e)
        }
        reader.readAsDataURL(payload.e.target.files[0])
      })
    },
    upImage(context, payload) {
      return new Promise((resolve, reject) => {
        var fd = new FormData()
        fd.append(1, payload.file)
        api.file({
          url: 'FileThumbnail',
          data: fd,
          success: (res) => {
            let rs = res.split(',')[1]
            console.log(res)
            resolve(rs)
          },
          error: function (res) {
            reject(res)
          }
        })
      })
    },
    dataURLtoFile(context, payload) {
      let dataUrl = payload.dataUrl
      let arr = dataUrl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      let file = new File([u8arr], '1234', {
        type: mime
      })
      return file
    },
    async toBeVIP (context, payload) {
      return new Promise ((resolve, reject) => {
        if (payload && payload._this){
          payload._this.$confirm({
            title: '兑换VIP',
            msg: '确定花费1000积分兑换VIP？',
            type: 'confirm'
          }).then(() => {
            api.process({
              url: 'Vip',
              data: {
                point: 1000
              },
              success: function() {
                context.commit('setVIP', {
                  vipLevel: 1
                })
                resolve()
              },
              error: function(err) {
                reject(err)
              }
            })
          }).catch(() => {
            console.log('取消了')
          })
        } else {
          api.process({
            url: 'Vip',
            data: {
              point: 1000
            },
            success: function() {
              context.commit('setVIP', {
                vipLevel: 1
              })
              resolve()
            },
            error: function(err) {
              reject(err)
            }
          })
        }
      })
    }
  }
})
