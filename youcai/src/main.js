import 'babel-polyfill'
import mock from '@/assets/data/api.js'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import data from '@/assets/js/data'
import config from '@/assets/js/config'
import api from '@/assets/js/ApiHelper'
import store from './store/store'
import format from '@/assets/js/format'
import utility from '@/assets/js/utility'
import VueLazyload from 'vue-lazyload'
// 引用分享插件
import SharePlugin from './plugins/share/sharePlugin'
import Alert from './plugins/alert/Alert'
import toast from './plugins/toast/toast'
import upload from './plugins/upLoad/upload'
import BigLoad from './plugins/loading/bigLoad'
import Confirm from './plugins/confirm/confirm'
import Operate from './plugins/operate/operate' // 下载图片
import authentication from '@/assets/js/LoginHelper'
import VideoPlayer from 'vue-video-player'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import autoTextarea from '@/assets/js/textarea'
// import preview from 'vue-photo-preview' // preview
import preview from './plugins/preview/preview'
import 'vue-photo-preview/dist/skin.css' // preview

import vueTreasureBox from './plugins/treasure/treasureBox'

import '@/assets/less/mixin.less'

Vue.use(preview)
Vue.use(router)
Vue.use(SharePlugin, router)
Vue.use(VueLazyload, {
  // error: require('./assets/images/imgError.png'),
  attempt: 5,
  // loading: 'http://webapp.szwanwan.com/img/default/cover.png'
})
Vue.use(Alert)
Vue.use(toast)
Vue.use(BigLoad)
Vue.use(upload)
Vue.use(Confirm)
Vue.use(vueTreasureBox)
Vue.use(Operate)
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.use(VideoPlayer)
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper, /* { default global options } */ )
// Vue.use(window.VueAwesomeSwiper)
Vue.config.productionTip = false

// TODO 这个文件的代码要整理

Vue.prototype.data = data
Vue.prototype.config = config
Vue.prototype.api = api
// Vue.prototype.validate = validate
Vue.prototype.format = format
Vue.prototype.utility = utility
// Vue.prototype.loadingMap = loadingMap
Vue.prototype.authentication = authentication

Vue.prototype.BASE_URL = process.env.BASE_URL
Vue.prototype.initSql = function () {
  let userId = store.state.user.userId || localStorage.getItem('ud')
  if (!userId) {
    return
  }
  let userStr = userId.replace(/-/g, '')
  // store.dispatch('ws/delSql', `groups_${userStr}`)
  // store.dispatch('ws/delSql', `channelList_${userStr}`)
  // store.dispatch('ws/delSql', `user_${userStr}`)
  // store.dispatch('ws/delSql', `userGroup_${userStr}`)
  // store.dispatch('ws/delSql', `channelSet_${userStr}`)
  // return
  store.dispatch('ws/openSql', {
    formName: `groups_${userStr}`,
    keys: 'read bit DEFAULT 0, status int DEFAULT 1,mt int DEFAULT 0, createTime timestamp,showTime bit, content,channelId, imChatId, receiverId, receiverName, receiverAvatar, senderId, senderName, senderAvatar, imGroupDetailChatId, imOtherMessageId'
  })
  store.dispatch('ws/openSql', {
    formName: `channelList_${userStr}`,
    keys: 'channelId UNIQUE, channelName, status int DEFAULT 1, channelAvatar, channelType, unCountRead int DEFAULT 0, senderId, senderName, senderAvatar, createTime, content'
  })
  store.dispatch('ws/openSql', {
    formName: `user_${userStr}`,
    keys: 'userId UNIQUE, nickName, avatar, remarkName'
  })
  store.dispatch('ws/openSql', {
    formName: `userGroup_${userStr}`,
    keys: 'groupId UNIQUE, groupName, groupCover'
  })
  store.dispatch('ws/openSql', {
    formName: `channelSet_${userStr}`,
    keys: 'channelSetId UNIQUE, bg, noInterruption DEFAULT 0, top int DEFAULT 0, topTime timestamp'
  })
}
/** 
 * DIRECTIVE
*/
Vue.directive('growHeight', {
  componentUpdated: function (el, bonding) {
    const grow = el.getAttribute('data-grow')
    if (grow === 'false') {
      autoTextarea(el, bonding.value)
      el.setAttribute('data-grow', 'true')
    }
  },
  inserted: function (el) {
    el.setAttribute('data-grow', 'false')
  }
})
/** 
 * FILTER
*/
Vue.filter('k', function (val) {
  if (!val) return 0
  let len = parseInt(val).toString().length
  if (len > 3) {
    return parseInt(val).toString().slice(0, len - 3) + 'k'
  } else {
    return val
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

Vue.prototype.$msg = utility.msg
Vue.prototype.showError = utility.msg.showError

Vue.prototype.getMock = function (key) {
  return mock[key]
}
Vue.prototype.getImg = function (url) {
  console.log(url)
  return require(url)
}
Vue.prototype.$intercept = {
  hasBaseInfo() {
    console.log(store.state)
  }
}
Vue.prototype.refreshPost = function () {
  store.commit('updateMyPage', {
    isRefreshPost: true
  })
}
Vue.prototype.getIMEI = function () { // 调用获取用户手机IMEI的函数
  if (!localStorage.getItem('IMEI')) {
    window.isInAndroid && window.WanAndroid.getIMEI()
  }
  return localStorage.getItem('IMEI')
}
Vue.prototype.showConfirm = {
  toPersonal: function () {
    Vue.prototype.$confirm({
      title: '为了您更好的体验',
      msg: '请完善用户必填信息: 昵称、性别、头像',
      yesBtnText: '去完善',
      type: 'confirm'
    }).then(() => {
      router.push({
        name: 'my_personal'
      })
    }).catch(() => {})
  },
  toGroup: function () {
    Vue.prototype.$confirm({
      title: '您必须先创建群组',
      msg: '才能发布活动',
      yesBtnText: '创建群组',
      type: 'confirm'
    }).then(() => {
      router.push({
        name: 'groupCreate'
      })
    }).catch(() => {})
  }
}

Vue.prototype.go = {
  refreshUser: function () {
    // 每次刷新页面都获取用户个人信息
    api.get({
      url: 'UserMain',
      success: function (res) {
        // 更新用户的信息
        window.isInAndroid && window.WanAndroid.startRongMsg(res.userId, res.nickName || res.name, res.avatar)
        console.log('startRongMsg')
        if (res) {
          store.commit('updateUserInfo', res)
        }
        if (res.counts) {
          store.commit('updateCounts', res.counts)
        }
      },
      error: function () {}
    })
  },
  login: function () {
    if (store.state.operatorType === '2') {
      router.push({
        name: 'login'
      })
    } else {
      router.push({
        name: 'loginChoose'
      })
    }
  },
  user: function (userId) {
    if (!store.state.isInApp) {
      window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=io.dcloud.H50D8112A'
      return
    }
    if (!authentication.isLogin()) {
      Vue.prototype.go.login()
      return
    }
    if (userId === store.state.user.userId) { // 去到我的主页
      store.commit('updateNeedBack', true)
      router.push({
        name: 'my'
      })
    } else { // 去到别人的主页
      router.push({
        name: 'discoverUser',
        params: {
          id: userId
        }
      })
    }
  },
  nameAParams: function (name, params, limits) {
    if (!limits || !limits.length) {
      router.push({
        name: name,
        params: params
      })
      return
    } else {
      if (!authentication.isLogin() && limits.indexOf('log') >= 0) {
        Vue.prototype.go.login()
        return
      }
      if ((!store.state.pos.longitude || !store.state.pos.latitude) && limits.indexOf('pos') >= 0) {
        window.isInAndroid && window.WanAndroid.getLocation()
        console.log('没有定位')
        return
      }
      if (limits.indexOf('base') >= 0 && !store.getters.hasBaseInfo) {
        Vue.prototype.showConfirm.toPersonal()
        return
      }
    }
    router.push({
      name: name,
      params: params
    })
  },
  nameAid: function (name, id, limits) {
    if (!limits || !limits.length) {
      router.push({
        name: name,
        params: {
          id: id
        }
      })
      return
    } else {
      if (!authentication.isLogin() && limits.indexOf('log') >= 0) {
        Vue.prototype.go.login()
        return
      }
      if ((!store.state.pos.longitude || !store.state.pos.latitude) && limits.indexOf('pos') >= 0) {
        window.isInAndroid && window.WanAndroid.getLocation()
        return
      }
      if (limits.indexOf('base') >= 0 && !store.getters.hasBaseInfo) {
        Vue.prototype.showConfirm.toPersonal()
        return
      }
    }
    router.push({
      name: name,
      params: {
        id: id
      }
    })
  },
  name: function (name, limits) {
    if (!limits || !limits.length) {
      router.push({
        name: name
      })
      return
    } else {
      if (!authentication.isLogin() && limits.indexOf('log') >= 0) {
        Vue.prototype.go.login()
        return
      }
      if ((!store.state.pos.longitude || !store.state.pos.latitude) && limits.indexOf('pos') >= 0) {
        window.isInAndroid && window.WanAndroid.getLocation()
        return
      }
      if (limits.indexOf('base') >= 0 && !store.getters.hasBaseInfo) {
        Vue.prototype.showConfirm.toPersonal()
        return
      }
    }
    router.push({
      name: name
    })
  },
  back: function () {
    if (window.history.length <= 1) {
      router.push({
        path: '/'
      })
      return false
    } else {
      router.back()
    }
  }
}

Vue.prototype.ArrayHelper = {
  findIndex(arr, val) {
    if (!arr || !arr.length || arr.length <= 0) {
      return -1
    }
    for (let index in arr) {
      let item = arr[index]
      if (item === val) {
        return index
      }
    }
    return -1
  }
}

Vue.prototype.Utility = {
  htmlEncode(str) {
    if (typeof (str) === 'undefined' || str === null || str.length <= 0) {
      return ''
    }
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/ /g, '&nbsp;').replace(/'/g, '&#39;').replace(/"/g, '&quot;')
  },
  findIndex(arr, val) {
    if (!arr || !arr.length || arr.length <= 0) {
      return -1
    }
    for (let index in arr) {
      let item = arr[index]
      if (item === val) {
        return index
      }
    }
    return -1
  },
  getImagePath(path) {
    return (path && path.length >= 1 && path.indexOf('/') === 0) ? (config.imageOrigin + path) : path
  },
  getImages(pictures) {
    if (!pictures || pictures.length <= 0) {
      return []
    } else if (pictures.indexOf(',') === -1) {
      return [pictures]
    } else {
      return pictures.split(',')
    }
  },
  getAvatar(avatar) {
    let defaultUserAvatar = '/assets/images/avatar.jpg'
    return (avatar && avatar.length >= 1 && avatar !== defaultUserAvatar && defaultUserAvatar.indexOf(avatar) === -1) ? (config.imageOrigin + avatar) : defaultUserAvatar
  }
}

// window.$toast = $toast
// 发布动态
const PUBLISH = '/discover/post'
// 我的
const MY = '/my/'
// 消息
const MESSAGE = '/message'

router.beforeEach(function (to, from, next) {
  if (!to.name && window.history.length <= 2) { // 网上没有路由的情况 -> 微信回来 || 复制网址
    router.push({
      name: 'index'
    })
    return
  }
  // 从草稿箱进入activityPost
  if (to.name === 'activityPost' && (from.name === 'message' || from.name === 'messagedraft')) {
    if (store.state.draftsIndex < 0) {
      store.commit('activityPostNoModel', false)
    }
    store.commit('setClick', false)
  }
  // 从草稿箱进入 postActivity
  if (to.name === 'postActivity' && (from.name === 'message' || from.name === 'messagedraft')) {
    if (store.state.draftsIndex < 0) {
      store.commit('activityPostNoModel', false)
    }
    store.commit('setClick', false)
  }
  // activityPost不是点击事件跳转的就回到activityHome
  if (from.name === 'activityPost' && !store.state.isClick && (to.name === 'messagedraft' || to.name === 'message')) {
    router.push({
      name: 'activityHome'
    })
    next(false)
    return
  }
  // if (to.name === 'my') {
  //   api.get({
  //     url: 'UserMain',
  //     success: function (res) {
  //       // 更新用户的信息
  //       if (res) {
  //         store.commit('updateUserInfo', res)
  //       }
  //     }
  //   })
  // }
  // 要跳转的路径
  let path = to.path
  if (path === PUBLISH || path === MY || path === MESSAGE) {
    // 这里需要登录
    authentication.authorization(store, router, to, next)
  } else {
    next()
  }
})
