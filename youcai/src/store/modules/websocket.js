import api from '@/assets/js/ApiHelper'
import sql from '@/assets/js/webSql'
// import $ from '@/assets/js/ajax'
import fmt from '@/assets/js/format'
import router from '@/router'
let wsUrl = process.env.VUE_APP_WSURL
// FIXME: 群中显示昵称 与 设置他人的备注昵称 应该从服务器更新状态 -> 之后写存储
const moduleWS = {
  namespaced: true,
  state: {
    lulu: {
      userId: '20ea9e26-0cb4-457c-bb7f-88290c85c30a',
      avatar: require('@/assets/images/duolu.jpg'),
      nickName: '多录小助手'
    },
    id: null,
    websocket: null,
    channelList: [], //channelType 0 单聊 || 1 群聊 || 2赞与收藏等
    currentChannel: {
      channelId: '',
      channelType: 0,
      msg: [],
      set: {}
    },
    summaryMsg: {
      UnCountRead: 0,
      UnCounttLaC: 0, // 赞与收藏
      UnCountNotice: 0,
      UnCountComment: 0
    }, //消息状态
    socketStatus: false,
    reconnectTime: 3,
    tryTime: 0
  },
  getters: {
    getWebsocket(state) {
      return state.websocket
    }
  },
  mutations: {
    upDateWebsocket(state) {
      let rendom = parseInt(Math.random() * (99999 - 10000) + 10000)
      state.websocket = new ReconnectingWebSocket(`${wsUrl}ws?token=${localStorage.getItem('ud')}&time=${rendom}`)
    },
    setChannels(state, payload) {
      state.channelList = payload.channelList
    },
    resetCurrentChannel(state) {
      state.currentChannel = {
        channelId: '',
        msg: [],
        set: {}
      }
    },
    setCurrentChannel(state, payload) {
      state.currentChannel = Object.assign({}, state.currentChannel, payload)
    },
    upSummaryMsg(state, payload) {
      state.summaryMsg = Object.assign({}, state.summaryMsg, payload)
    },
    setTryTime(state, payload) {
      state.tryTime = payload
    }
  },
  actions: {
    async upUnCountRead(context) { // 更新未读消息总数
      let groups = `groups_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`
      let sum = await sql.selectData({
        select: `SELECT COUNT(channelId) AS UnCountRead FROM ${groups} WHERE read=0`
      })
      let UnCounttLaC = await sql.selectData({
        select: `SELECT COUNT(channelId) AS UnCounttLaC FROM ${groups} WHERE read=0 AND channelId="0" 
        UNION
        SELECT COUNT(channelId) AS UnCountNotice FROM ${groups} WHERE read=0 AND channelId="1" 
        UNION
        SELECT COUNT(channelId) AS UnCountComment FROM ${groups} WHERE read=0 AND channelId="2"`
      })
      let UnCountNotice = await sql.selectData({
        select: `SELECT COUNT(channelId) AS UnCountNotice FROM ${groups} WHERE read=0 AND channelId="1" `
      })
      let UnCountComment = await sql.selectData({
        select: `SELECT COUNT(channelId) AS UnCountComment FROM ${groups} WHERE read=0 AND channelId="2"`
      })
      let obj = {
        UnCountRead: sum[0].UnCountRead,
        UnCounttLaC: UnCounttLaC[0].UnCounttLaC,
        UnCountNotice: UnCountNotice[0].UnCountNotice,
        UnCountComment: UnCountComment[0].UnCountComment,
      }
      context.commit('upSummaryMsg', sum[0])
      return sum[0]
    },
    async openSql(context, payload) {
      await sql.open(payload)
      let user = `user_${context.rootState.user.userId || localStorage.getItem('ud')}`
      if (payload.formName === user) { // 每次更改用户自己的信息都会更新user数据库
        context.dispatch('insertForm', {
          formName: user,
          keys: ['avatar', 'nickName', 'userId'],
          arr: [context.rootState.user]
        })
      }
    },
    delSql(context, payload) {
      sql.delForm({
        formName: payload
      })
    },
    async insertForm(context, payload) {
      if (payload.formName === 'user') {
        payload.formName = `${payload.formName}_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`
      }
      await sql.insertForm(payload)
    },
    closeWebsocket(context) { // 关闭websocket
      context.state.websocket && context.state.websocket.close()
      context.commit('upSummaryMsg', {
        UnCountRead: 0,
        UnCounttLaC: 0, // 赞与收藏
        UnCountNotice: 0,
        UnCountComment: 0
      })
    },
    connectWebsocket(context) { // 连接websocket
      return new Promise((resolve) => {
        if (!localStorage.getItem('ud') || (context.state.websocket && (context.state.websocket.readyState == 0 || context.state.websocket.readyState == 1))) {
          if (context.state.websocket) {
            context.state.websocket.reconnectAttempts = 0
          }
          resolve()
          return
        }
        context.commit('upDateWebsocket')
        // 只有定义了onopen方法，才能继续实现接收消息，即在使用的地方调用onmessage方法。
        context.state.websocket.onopen = function () {
          // console.log('open')
        }
        context.state.websocket.onerror = function (e) { // TODO：要设置ws连接失败状态，要用户重连
          console.log('wxError', e, context.state.socketStatus)
        }
        context.state.websocket.onclose = function () { // TODO：要设置ws连接失败状态，要用户重连
          // context.commit('setSocketStatus', false)
          console.log('wxClose', context.state.websocket, context.state.socketStatus)
        }
        context.state.websocket.ontokenErr = function (e) {
          context.dispatch('userLogoutAsync', {}, {
            root: true
          })
          let reason = e.reason ? (typeof (e.reason) === 'string' ? e.reason : JSON.stringify(e.reason)) : '连接失败'
          router.push({
            name: 'loginChoose'
          })
          window.$alert && window.$alert(reason)
        }
        context.state.websocket.onmessage = function (e) {
          try {
            var msg = e.data && JSON.parse(e.data)
            console.log(msg, 'msg')
            if (msg.c.ReceiveId) {
              msg.c.ReceiverId = msg.c.ReceiveId
              delete msg.c.ReceiveId
            }
            msg.c.mt = msg.mt
            switch (msg.mt) {
              case 3: //  群聊
                msg.c.channelId = msg.c.ReceivGroupId
                var newMsg = {}
                newMsg = JSON.parse(JSON.stringify(msg.c))
                delete newMsg.ReceivGroupId
                context.dispatch('onMessage', newMsg)
                break
              case 4: // 单聊
                msg.c.channelId = msg.c.SenderId
                context.dispatch('onMessage', msg.c)
                break
              case 5:
                context.dispatch('upUnCountRead')
                // context.commit('upSummaryMsg', msg.c)
                break
              default:
                0, 1, 2
                context.dispatch('onMessage', msg.c)
                break
            }
          } catch (e) {
            return
          }
        }
      })
    },
    /*
     * 下面是获取获取与更新 user/group 的一系列方法
     */
    async insertUser(context, payload) {
      let user = `user_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`
      let sqlHas = await sql.selectData({
        formName: user,
        select: `select * from ${user} where userId="${payload.userId}"`
      })
      if (sqlHas && sqlHas.length) { // 有更新
        let obj = Object.assign({}, {
          by: 'user'
        }, payload)
        sql.upItemData({
          formName: user,
          obj: obj
        })
      } else { // 没有插入
        sql.insertData({
          formName: user,
          obj: payload
        })
      }
    },
    async upUser(context, payload) {
      let userId = payload.userId
      let formName = `user_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`
      let groupName = `groups_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`
      let channelName = `channelList_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`
      sql.selectData({
        formName: formName,
        select: `select * from ${formName} where userId="${userId}"`
      }).then((res) => {
        if (!res || !res.length) {
          sql.upItemData({
            formName: formName,
            obj: {
              by: 'userId',
              userId: payload.userId,
              nickName: payload.nickName,
              avatar: payload.avatar
            }
          })
        }
        if (res && res.length && payload.avatar !== res[0].avatar || payload.nickName !== res[0].nickName) {
          sql.upItemData({
            formName: formName,
            obj: {
              by: 'userId',
              userId: payload.userId,
              nickName: payload.nickName,
              avatar: payload.avatar
            }
          })
          sql.upItemData({
            formName: groupName,
            obj: {
              by: 'senderId',
              senderId: payload.userId,
              senderName: payload.nickName,
              senderAvatar: payload.avatar
            }
          })
          sql.upItemData({
            formName: channelName,
            obj: {
              by: 'channelId',
              channelId: payload.userId,
              channelName: payload.nickName,
              channelAvatar: payload.avatar
            }
          })
        }
      })
    },
    async upGroup(context, payload) {
      let userGroupId = payload.userGroupId
      let formName = `userGroup_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`
      // let groupName = `groups_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`
      let channelName = `channelList_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`
      sql.selectData({
        formName: formName,
        select: `select * from ${formName} where groupId="${userGroupId}"`
      }).then((res) => {
        if (!res || !res.length) {
          sql.upItemData({
            formName: formName,
            obj: {
              by: 'groupId',
              groupId: payload.userGroupId,
              groupName: payload.groupName,
              groupCover: payload.groupCover
            }
          })
        }
        if (res && res.length && payload.groupCover !== res[0].groupCover || payload.groupName !== res[0].groupName) {
          sql.upItemData({
            formName: formName,
            obj: {
              by: 'groupId',
              groupId: payload.userGroupId,
              groupName: payload.groupName,
              groupCover: payload.groupCover
            }
          })
          // sql.upItemData({
          //   formName: groupName,
          //   obj: {
          //     by: 'senderId',
          //     senderId: payload.userId,
          //     senderName: payload.nickName,
          //     senderAvatar: payload.avatar
          //   }
          // })
          sql.upItemData({
            formName: channelName,
            obj: {
              by: 'channelId',
              channelId: payload.userGroupId,
              channelName: payload.groupName,
              channelAvatar: payload.groupCover
            }
          })
        }
      })
    },
    async getUser(context, payload) {
      let userId = payload.userId
      let formName = `user_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`
      let sqlHas = null
      if (userId === context.state.lulu.userId) {
        sqlHas = [context.state.lulu]
      } else {
        sqlHas = await sql.selectData({
          formName: formName,
          select: `select * from ${formName} where userId='${userId}'`
        })
      }

      return new Promise((resolve, reject) => {
        if (sqlHas && sqlHas.length) { // 有数据
          resolve(sqlHas[0])
        } else {
          api.get({
            url: `UserMain/userId?userId=${userId}`,
            success: function (res) {
              let obj = {
                by: 'userId',
                userId: res.userId,
                nickName: res.nickName,
                avatar: res.avatar
              }
              sql.upItemData({
                formName: formName,
                obj: obj
              })
              resolve(obj)
            },
            error: function (err) {
              reject(err)
            }
          })
        }
      })
    },
    async getGroup(context, payload) {
      let groupId = payload.groupId
      let formName = `userGroup_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`
      let sqlHas = await sql.selectData({
        formName: formName,
        select: `select * from ${formName} where groupId="${groupId}"`
      })
      return new Promise((resolve, reject) => {
        if (sqlHas && sqlHas.length) { // 有数据
          resolve(sqlHas[0])
        } else {
          api.get({
            url: `UserGroup/GroupId?GroupId=${groupId}`,
            success: function (res) {
              let obj = {
                by: 'groupId',
                groupId: res.userGroupId,
                groupName: res.groupName,
                groupCover: res.groupCover
              }
              sql.upItemData({
                formName: formName,
                obj: obj
              })
              resolve(obj)
            },
            error: function (err) {
              reject(err)
            }
          })
        }
      })
    },

    async getChannelList(context) { // 从sql获取当前会话列表
      let channelList = `channelList_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`
      let channelSet = `channelSet_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`

      let channels = await sql.selectData({
        formName: `${channelList}`,
        select: `SELECT * from ${channelList} LEFT JOIN ${channelSet} ON ${channelList}.channelId=${channelSet}.channelSetId order by createTime desc`
      })
      channels = channels ? channels : []
      let results = []
      if (channels.length) {
        for (let i = 0; i < channels.length; i++) {
          results.push(channels[i])
        }
        context.commit('setChannels', {
          channelList: results
        })
      } else {
        let channelSets = await sql.selectData({
          formName: channelSet,
          select: `SELECT * from ${channelSet}`
        })
        if (!channelSets || !channelSets.length) {
          context.dispatch('getRemoteChannelList')
        } else {
          context.commit('setChannels', {
            channelList: []
          })
        }
      }
    },
    getRemoteChannelList() {
      api.get({
        url: 'ws/chat-list',
        type: 'ws',
        success: function () {},
        error: function () {}
      })
    },
    async getRemoteMsg(context) { // 同步频道的服务器历史消息
      if (!context.state.currentChannel.msg.length) {
        return
      } else {
        let url = 'ws/receive-last-msg'
        if (context.state.currentChannel.msg[0].imGroupDetailChatId) {
          url = `${url}?ImGroupDetailChatId=${context.state.currentChannel.msg[0].imGroupDetailChatId}`
        } else if (context.state.currentChannel.msg[0].imChatId) {
          url = `${url}?ImSingleChatId=${context.state.currentChannel.msg[0].imChatId}`
        } else {
          return
        }
        api.get({
          url: url,
          type: 'ws',
          success: function () {},
          error: function () {}
        })
      }
    },
    /*
     * 对会话channelItem的一系列操作 删除某个会话 && 清空聊天消息
     */
    async delChannelItem(context, payload) { // 删除某个会话 -> 清空改会话消息(FIXME:有待商议) -> 删除会话列表单条Item
      await context.dispatch('delChannelListItem', payload)
      await context.dispatch('delChannelMsg', payload)
    },
    async delChannelMsg(context, payload) { // 清空某channel的消息(包括未读消息)->全设为已读->上传服务器->再删除
      let groups = `groups_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`
      await context.dispatch('upChannelMsgRead', payload)
      context.dispatch('sendMsgRead', payload)
      return sql.delItemData({
        formName: `${groups}`,
        where: `channelId = "${payload.channelId}"`
      })
    },
    async delChannelListItem(context, payload) { // 删除会话列表单条Item -> 重置置顶聊天
      let channelList = `channelList_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`
      return sql.delItemData({
        formName: `${channelList}`,
        where: `channelId = "${payload.channelId}"`
      }).then(() => {
        context.dispatch('getChannelList')
        context.dispatch('upUnCountRead')
        context.dispatch('setChannelTop', {
          channelId: payload.channelId,
          top: 0
        })
      })
    },
    /*
     * 更新会话列表
     */
    async upChannelListState(context, payload) { // 有新消息(不管未读还是已读) -> 更新会话列表 && 未读消息总数
      let groups = `groups_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`
      let channelList = `channelList_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`
      let isChat = payload.channelId.length > 3
      let mt = ''
      if (isChat) {
        mt = '(mt=3 OR mt=4)'
      } else {
        mt = `(mt=${parseInt(payload.channelId)})`
      }
      let channelUnRead = await sql.selectData({
        formName: `${groups}`,
        select: `SELECT COUNT(channelId) AS channelUnReadCount FROM ${groups} WHERE read=0 AND (channelId="${payload.channelId}") AND ${mt}`
      })
      let channelUnReadCount = channelUnRead[0].channelUnReadCount
      let channelMsg = await sql.selectData({ // 应该是必有的
        formName: `${groups}`,
        select: `SELECT * FROM ${groups} WHERE (channelId="${payload.channelId}") AND ${mt} ORDER BY createTime DESC`
      })
      let channel = await sql.selectData({
        formName: `${channelList}`,
        select: `SELECT * FROM ${channelList} WHERE (channelId="${payload.channelId}")`
      })
      let createTime = (channelMsg && channelMsg.length) ? channelMsg[0].createTime : (channel && channel.length) ? channel[0].createTime : ''
      let SenderId = (channelMsg && channelMsg.length) ? channelMsg[0].senderId : ''
      let content = (channelMsg && channelMsg.length) ? channelMsg[0].content : ''
      let senderName = (channelMsg && channelMsg.length) ? channelMsg[0].senderName : ''
      let senderAvatar = (channelMsg && channelMsg.length) ? channelMsg[0].senderAvatar : ''
      let channelName = (channelMsg && channelMsg.length) ? payload.channelId === SenderId ? channelMsg[0].senderName : channelMsg[0].receiverName : (channel && channel.length) ? channel[0].channelName : ''
      let channelAvatar = (channelMsg && channelMsg.length) ? payload.channelId === SenderId ? channelMsg[0].senderAvatar : channelMsg[0].receiverAvatar : (channel && channel.length) ? channel[0].channelAvatar : ''
      let status = (channelMsg && channelMsg.length) ? channelMsg[0].status : 1
      if (channel && channel.length) { // 在 channelList中  更新channelList中的payload.channelId state
        await sql.upItemData({
          formName: `${channelList}`,
          obj: {
            by: 'channelId',
            channelId: `${payload.channelId}`,
            unCountRead: `${channelUnReadCount}`,
            senderId: SenderId,
            createTime: createTime,
            content: content,
            senderName: senderName,
            senderAvatar: senderAvatar,
            channelName: channelName,
            channelAvatar: channelAvatar,
            status: status
          }
        })
      } else { // 会话列表中没有 && 有未读消息
        if (channelMsg && channelMsg.length) { // 有未读消息 || 已读
          if (isChat) {
            await sql.insertData({
              formName: `${channelList}`,
              obj: {
                channelId: `${payload.channelId}`,
                unCountRead: `${channelUnReadCount}`,
                channelType: channelMsg[0].imChatId ? 0 : (channelMsg[0].imGroupDetailChatId ? 1 : `${context.state.currentChannel.channelType}`),
                senderId: channelMsg[0].senderId,
                createTime: channelMsg[0].createTime,
                content: channelMsg[0].content,
                senderName: channelMsg[0].senderName,
                senderAvatar: channelMsg[0].senderAvatar,
                channelName: channelName,
                channelAvatar: channelAvatar,
                status: status
              }
            })
          } else { // 赞 等 更新频道的未读总数
            let obj = {}
            if (payload.channelId === '0') {
              obj.UnCounttLaC = `${channelUnReadCount}`
            } else if (payload.channelId === '1') {
              obj.UnCountNotice = `${channelUnReadCount}`
            } else if (payload.channelId === '2') {
              obj.UnCountComment = `${channelUnReadCount}`
            }
            context.commit('upSummaryMsg', obj)
          }
        }
      }
      context.dispatch('getChannelList')
      context.dispatch('upUnCountRead')
    },
    /*
     * 一系列 send 操作  文字 || 图片 || 站内分享 || 重发
     */
    async sendImgMsg(context, payload) { // 获取图片base64 -> onMessage -> loading -> 上传获得网址并sendMsg更新状态与数据库status && content
      let groups = `groups_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`
      let base64Url = await context.dispatch('readerFile', payload, { // 获取base64Url
        root: true
      })
      let createTime = fmt.date(new Date(), 'yyyy-MM-ddThh:mm:ssZ') // 本地存储 -> loading
      payload.createTime = createTime
      await context.dispatch('onMessageAsync', {
        receiverId: payload.receiverId,
        createTime: payload.createTime,
        content: JSON.stringify({
          type: 'img',
          content: base64Url
        }),
        status: 2
      })
      let url = await context.dispatch('upImage', {
        file: payload.e.target.files[0]
      }, { // 上传文件服务器获取http网址
        root: true
      })
      if (!url) { // 上传图片失败
        sql.upForm({
          formName: `${groups}`,
          where: `createTime="${createTime}"`,
          set: 'status=0'
        })
      } else {
        await context.dispatch('apiSendMsg', {
          receiverId: payload.receiverId,
          createTime: payload.createTime,
          content: JSON.stringify({
            type: 'img',
            content: url
          })
        })
      }
    },
    async reSendMsg(context, payload) { // 删除现有的item -> 在现有的数据基础上接着上传 loading -> sendMsg更新状态与数据库status && content
      let groups = `groups_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`
      sql.delItemData({ // 删除现有的该条数据
        formName: `${groups}`,
        where: `createTime="${payload.createTime}"`
      })
      if (JSON.parse(payload.content).type === 'img') {
        let url = JSON.parse(payload.content).content // 重新上传 || 如果有网址就不再重新上传
        let createTime = fmt.date(new Date(), 'yyyy-MM-ddThh:mm:ssZ') // 本地存储 -> loading
        payload.createTime = createTime
        await context.dispatch('onMessageAsync', {
          receiverId: payload.receiverId,
          createTime: payload.createTime,
          content: JSON.stringify({
            type: 'img',
            content: url
          }),
          status: 2
        })
        if (url.indexOf('http://') < 0) { // 上传图片文件服务器时出错
          let file = await context.dispatch('dataURLtoFile', {
            dataUrl: url
          }, {
            root: true
          })
          url = await context.dispatch('upImage', {
            file: file
          }, { // 上传文件服务器获取http网址
            root: true
          })
        }
        if (!url) { // 上传图片失败
          sql.upForm({
            formName: `${groups}`,
            where: `createTime="${createTime}"`,
            set: 'status=0'
          })
        } else {
          await context.dispatch('apiSendMsg', {
            receiverId: payload.receiverId,
            createTime: payload.createTime,
            content: JSON.stringify({
              type: 'img',
              content: url
            })
          })
        }
      } else if (JSON.parse(payload.content).type === 'text') {
        let groups = `groups_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`
        await sql.delItemData({ // 删除现有的该条数据
          formName: `${groups}`,
          where: `createTime="${payload.createTime}"`
        })
        context.dispatch('sendMsg', payload)
      }
    },
    async sendShare(context, payload) { // 站内分享
      let createTime = fmt.date(new Date(), 'yyyy-MM-ddThh:mm:ssZ')
      payload.createTime = createTime
      payload.channelType = payload.conversationType === 'private' ? 0 : 1
      payload.receiverId = payload.targetId
      payload.content = JSON.stringify({
        type: 'share',
        content: {
          content: payload.content,
          imageUrl: payload.imageUrl,
          objectId: payload.objectId,
          postType: payload.postType,
          title: payload.title,
          topicCommentId: payload.topicCommentId, // 表示话题评论页的id
          postUserName: payload.postUserName,
          postUserAvatar: payload.postUserAvatar,
          hideUser: payload.hideUser
        }
      })
      await context.dispatch('onMessageAsync', payload)
      payload._this.$router.replace({
        name: 'chatRoom',
        params: {
          name: payload.name,
          id: payload.receiverId,
          type: payload.channelType,
          share: true
        }
      })
      await context.dispatch('apiSendMsg', payload)
    },
    testHasOtherMsg(context, payload = {
      msg: []
    }) { // 检查有没有分享出去的信息
      let groups = `groups_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`
      let length = payload.msg.length - 1
      let startTime = payload.msg && payload.msg[length] && payload.msg[length].createTime
      let timeLimit = ''
      if (startTime) {
        timeLimit = `createTime > "${startTime}" AND`
      }
      let select = `SELECT * FROM ${groups} WHERE ${timeLimit} (channelId="${context.state.currentChannel.channelId}") ORDER BY createTime ASC`
      return new Promise((resolve, reject) => {
        sql.selectData({
          formName: `${groups}`,
          select: select
        }).then((res) => {
          let results = []
          if (res.length) {
            for (let i = 0; i < res.length; i++) {
              results.push(res[i])
            }
            // let newMsg = payload.msg.concat(results)
            // context.dispatch('setCurrentChannelAsync', { // 显示未读消息到当前channel
            //   msg: newMsg
            // })
          }
          resolve(results)
        }).catch((err) => {
          reject(err)
        })
      })
    },
    async sendMsg(context, payload) { // 发送消息 -> 先存到数据库再发送到服务器之后根据结果更新数据库 0 单聊 ||  1 群聊
      let createTime = fmt.date(new Date(), 'yyyy-MM-ddThh:mm:ssZ')
      payload.createTime = createTime
      await context.dispatch('onMessageAsync', payload)
      return await context.dispatch('apiSendMsg', payload)
    },
    apiSendMsg(context, payload) { // 自己发送的消息用http发送给服务器并根据服务器给的状态来更新数据库的状态
      let groups = `groups_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`
      let channelType = (parseInt(payload.channelType) === 0 || parseInt(payload.channelType)) ? parseInt(payload.channelType) : parseInt(context.state.currentChannel.channelType)
      let isInChatroom = payload.receiverId === context.state.currentChannel.channelId
      let createTime = payload.createTime
      return new Promise((resolve, reject) => {
        let url = 'ws/send-msg'
        switch (channelType) {
          case 0:
            break
          case 1:
            url = 'ws/send-channelmsg'
            break
        }
        let data = {
          receiverId: payload.receiverId,
          content: payload.content
        }
        if (payload.receiverId === context.state.lulu.userId) {
          let c = JSON.parse(payload.content)
          c.isHelper = true
          data.content = JSON.stringify(c)
        }
        api.process({
          url: url,
          data: data,
          type: 'ws',
          success: function (res) { // 更新imChatId
            let set = ''
            set = res.imChatId ?
              `imChatId="${res.imChatId}"` :
              res.imGroupDetailChatId ?
              `imGroupDetailChatId="${res.imGroupDetailChatId}"` :
              ''
            if (set) { // 更新imChatId
              if (JSON.parse(payload.content).type === 'img') { // 图片 status与content也要更新
                set = `${set}, content='${payload.content}', status=1`
              }
            } else { // 发送失败的情况
              set = 'status=0'
              if (JSON.parse(payload.content).type === 'img') { // 图片 status与content也要更新
                set = `${set}, content='${payload.content}'`
              }
            }
            sql.upForm({
              formName: `${groups}`,
              where: `createTime="${createTime}"`,
              set: set
            }).then(() => {
              context.dispatch('upChannelListState', {
                channelId: payload.receiverId
              })
              if (isInChatroom) { // 单聊 ||群聊
                context.dispatch('getChannelLocalMsg', {
                  refresh: true
                })
              }
            })
            resolve()
          },
          error: function (err) { // 更新status为发送失败
            sql.upForm({
              formName: `${groups}`,
              where: `createTime="${createTime}"`,
              set: 'status=0'
            }).then(() => {
              context.dispatch('upChannelListState', {
                channelId: payload.receiverId
              })
              if (isInChatroom) { // 单聊 ||群聊
                context.dispatch('getChannelLocalMsg', {
                  refresh: true
                })
              }
            })
            reject(err)
          }
        })
      })
    },
    async onMessageAsync(context, payload) { // 整合一下数据再给 onMessage
      payload.SenderId = context.rootState.user.userId || localStorage.getItem('ud')
      let msgObj = {
        channelId: payload.receiverId,
        receiverId: payload.receiverId,
        content: payload.content,
        createTime: payload.createTime,
        SenderId: payload.SenderId,
        senderAvatar: context.rootState.user.avatar,
        senderName: context.rootState.user.nickName
      }
      if (payload.status) {
        msgObj.status = payload.status
      }
      (parseInt(context.state.currentChannel.channelType) || parseInt(payload.channelType)) ? (msgObj.ImGroupDetailChatId = '1', msgObj.mt = 3) : (msgObj.ImChatId = '1', msgObj.mt = 4)
      await context.dispatch('onMessage', msgObj)
    },
    async onMessage(context, payload = {}) { // 接收消息 4 单聊 || 群聊
      if (payload.mt !== 3 && payload.mt !== 4) { // 不是聊天将channelId置为mt
        payload.channelId = (payload.mt).toString()
      }
      let groups = `groups_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`
      if (payload.IsRead === false || payload.IsRead) { // 服务器验证的message(有可能重复)
        let has = ''
        if (payload.ImChatId) {
          has = await sql.selectData({
            select: `select * from ${groups} where imChatId="${payload.ImChatId}" ORDER BY createTime DESC LIMIT 0,1`
          })
        } else if (payload.ImGroupDetailChatId) {
          has = await sql.selectData({
            select: `select * from ${groups} where ImGroupDetailChatId="${payload.ImGroupDetailChatId}" ORDER BY createTime DESC LIMIT 0,1`
          })
        } else if (payload.ImOtherMessageId) {
          has = await sql.selectData({
            select: `select * from ${groups} where ImOtherMessageId="${payload.ImOtherMessageId}" ORDER BY createTime DESC LIMIT 0,1`
          })
        }
        if (has && has.length) { // 本地数据库里面没有
          console.log(has, 'has', '去重了')
          return
        }
      }
      // let user = `user_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`
      let isInChatroom = payload.channelId === context.state.currentChannel.channelId
      let lastTime = fmt.getDate(Date.now() - 1 * 60 * 1000) // 时间查询优化
      let between = await sql.selectData({
        select: `SELECT COUNT(channelId) AS count FROM ${groups} WHERE (channelId="${payload.channelId}") AND (mt=3 OR mt=4) AND (createTime > "${lastTime}")`
      })
      payload.showTime = between[0].count ? 0 : 1
      payload.read = payload.IsRead ? 1 : (isInChatroom ? 1 : payload.SenderId === (context.rootState.user.userId || localStorage.getItem('ud')) ? 1 : 0)
      delete payload.IsRead
      if (payload.SenderId === payload.receiverId || payload.SenderId === payload.ReceiverId) {
        console.log('自己给自己发信息了', payload)
      }
      if (payload.Content) {
        let c = JSON.parse(payload.Content)
        if (c && c.isHelper) {
          console.log('这是给小助手发的')
          payload.receiverId = context.state.lulu.userId
        }
      }
      let receiver = {}
      if (payload.ImChatId) { // 单聊
        receiver = await context.dispatch('getUser', {
          userId: payload.receiverId || payload.ReceiverId
        })
        payload.receiverName = receiver.nickName
        payload.receiverAvatar = receiver.avatar
      }
      if (payload.ImGroupDetailChatId) { // 群聊
        receiver = await context.dispatch('getGroup', {
          groupId: payload.channelId
        })
        payload.receiverName = receiver.groupName
        payload.receiverAvatar = receiver.groupCover
      }

      let sender = await context.dispatch('getUser', {
        userId: payload.SenderId
      })
      payload.senderName = sender.nickName
      payload.senderAvatar = sender.avatar

      return new Promise((resolve, reject) => {
        sql.insertData({
            formName: `${groups}`,
            obj: payload
          })
          .then(() => {
            if (!payload.read) {
              context.dispatch('updateBadgerNumber', {
                channelId: payload.channelId
              })
            }
            if (isInChatroom) { // 单聊 ||群聊
              context.dispatch('getChannelLocalMsg', {
                refresh: true
              })
            }
            context.dispatch('upChannelListState', { // 更新 channelList状态
              channelId: payload.channelId
            })
            resolve()
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    async getUnReadMsg(context, payload) { // 获取未读消息大于等于10条全显示，小于10条或者没有取最后10条
      if (!context.rootState.user.userId && !localStorage.getItem('ud')) {
        return
      }

      let channelId = (payload && payload.channelId) || context.state.currentChannel.channelId
      let inChannelListState = context.state.channelList.filter((item) => {
        return item.channelId === channelId
      })[0]
      if (!inChannelListState || !inChannelListState.unCountRead) { // 不在列表里面(就是没有未读消息)或者没有未读消息
        await context.dispatch('getChannelLocalMsg', {
          refresh: true
        })
        // context.dispatch('testHasOtherMsg')
      } else {
        let groups = `groups_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`
        if (inChannelListState.unCountRead >= 10) {
          let select = `SELECT * FROM ${groups} WHERE read=0 AND (channelId="${channelId}") ORDER BY createTime ASC`
          return sql.selectData({
            formName: `${groups}`,
            select: select
          }).then((res) => {
            if (res.length >= 10) { // 有未读消息且大于10条
              let results = []
              for (let i = 0; i < res.length; i++) {
                results.push(res[i])
              }
              context.dispatch('setCurrentChannelAsync', { // 显示未读消息到当前channel
                msg: results
              })
              context.dispatch('upChannelMsgRead', { // 设置该channel的消息为已读
                channelId: channelId,
                where: `read=0 AND (channelId="${channelId}")`
              })
            } else {
              context.dispatch('getChannelLocalMsg', {
                refresh: true
              })
              context.dispatch('upChannelMsgRead', { // 设置该channel的消息为已读
                channelId: channelId,
                where: `read=0 AND (channelId="${channelId}")`
              })
            }
          })
        } else {
          await context.dispatch('getChannelLocalMsg', {
            refresh: true
          })
          context.dispatch('upChannelMsgRead', { // 设置该channel的消息为已读
            channelId: channelId,
            where: `read=0 AND (channelId="${channelId}")`
          })
        }
      }

    },
    upChannelMsgRead(context, payload) { // 设为已读 -> 将某频道的消息全置为已读 || 并更新全局会话状态
      let groups = `groups_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`
      let channelId = payload.channelId
      if ((channelId || channelId === '0') && !payload.where) {
        payload.where = `read=0 AND (channelId="${channelId}")`
      }
      return sql.upForm({
        formName: `${groups}`,
        where: payload.where,
        set: payload.set || 'read = 1'
      }).then(() => {
        context.dispatch('upChannelListState', { // 更新会话列表状态
          channelId: channelId
        })
        context.dispatch('updateBadgerNumber', {
          channelId: channelId
        })
      })
    },
    upChannelMsgUnRead(context, payload) { // 设为未读
      let groups = `groups_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`
      let channelId = payload.channelId
      payload.where = `createTime = (SELECT createTime FROM ${groups} WHERE (channelId="${channelId}") ORDER BY createTime DESC LIMIT (0,1))`
      payload.set = 'read = 0'
      context.dispatch('upChannelMsgRead', payload)
    },
    getChannelLocalMsg(context, payload = {}) { // 获取当前的channel的数据
      let groups = `groups_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`
      let startIndex = 0
      let endIndex = 10
      let timeLimit = ''
      let sizeLimit = `LIMIT ${startIndex},${endIndex}`
      let startTime = context.state.currentChannel.msg && context.state.currentChannel.msg[0] && context.state.currentChannel.msg[0].createTime
      if (startTime) {
        if (payload.refresh) { // 更新数据
          timeLimit = `createTime >= "${startTime}" AND`
          sizeLimit = ''
        } else { // 加载更多
          timeLimit = `createTime < "${startTime}" AND`
        }
      }
      let select = payload.select || `SELECT * FROM ${groups} WHERE ${timeLimit} (channelId="${context.state.currentChannel.channelId}") ORDER BY createTime DESC`
      if (!payload.all) {
        select = `SELECT * FROM (${select} ${sizeLimit})  ORDER BY createTime ASC`
      }
      return sql.selectData({
        formName: `${groups}`,
        select: select
      }).then((res) => {
        let results = []
        for (let i = 0; i < res.length; i++) {
          results.push(res[i])
        }
        if (!results.length && context.state.currentChannel.msg.length) { // 向服务器获取历史消息
          context.dispatch('getRemoteMsg')
        }
        if (!payload.refresh) {
          results = results.concat(context.state.currentChannel.msg)
        }
        parseInt(context.state.currentChannel.channelType) !== 2 && context.dispatch('setCurrentChannelAsync', {
          msg: results
        })
      })
    },
    async sendMsgRead(context, payload = {}) { // 给服务器最后一条已读信息的id 单聊已读 || 群聊已读
      let userId = context.rootState.user.userId || localStorage.getItem('ud')
      let groups = `groups_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`
      let channelId = payload.channelId ? payload.channelId : context.state.currentChannel.channelId
      let lastNew = await sql.selectData({ // 按照时间排序 查找第一条数据 => 最后一条数据
        formName: `${groups}`,
        select: `SELECT * FROM ${groups} WHERE (ImChatId is not null OR imGroupDetailChatId is not null OR imOtherMessageId is not null) AND (status!=0) AND (channelId="${channelId}") AND (senderId !="${userId}") ORDER BY createTime DESC LIMIT 0,1`
      })
      return new Promise((resolve, reject) => {
        if (lastNew[0]) {
          let url = `ws/send-msg-read?imChatId=${lastNew[0].imChatId}`
          switch (parseInt(context.state.currentChannel.channelType)) {
            case 0:
              break
            case 1:
              url = `ws/group-msg-read?imGroupDetailId=${lastNew[0].imGroupDetailChatId}`
              break
            case 2:
              url = `ws/other-msg-read?imOtherMsgId=${lastNew[0].imOtherMessageId}`
          }
          api.get({
            url: url,
            type: 'ws',
            success: function (res) {
              resolve(res)
            },
            reject: function (err) {
              reject(err)
            }
          })
        } else {
          resolve()
        }
      })
    },
    async leaveCurrentChannel(context) { // 离开聊天室的操作 1. 给服务器最后一条已读信息的id ，2. 重置当前聊天室的信息
      await context.dispatch('sendMsgRead')
      context.commit('resetCurrentChannel')
    },
    async updateBadgerNumber(context, payload) { // 有未知消息告知android
      let totalCount = await context.dispatch('upUnCountRead')
      let noInterruption = await context.dispatch('getChannelSet', {
        channelId: payload.channelId
      })
      let interrupt = !noInterruption.length ? true : noInterruption[0].noInterruption ? false : true
      window.isInAndroid && window.WanAndroid.updateBadgerNumber(parseInt(totalCount.UnCountRead), interrupt)
    },
    /*
     * 以下为获取点赞 0与收藏 && 新增关注 && 评论的方法
     */
    async getMt(context, payload) { // 获取赞 mt: 0
      let formName = `groups_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`
      let mt = payload.mt
      let where = `mt=${mt}`
      if (payload.read !== undefined) { // 有read(0 未读 || 1 已读)
        where = `${where} AND read=${payload.read}`
      }
      return new Promise((resolve, reject) => {
        sql.selectData({
          select: `SELECT * from ${formName} where ${where} ORDER BY createTime Desc`
        }).then((res) => {
          let arr = []
          for (let i = 0; i < res.length; i++) {
            arr.push(res[i])
          }
          resolve(arr)
        }).catch(() => {
          reject([])
        })
      })
    },
    /*
     * 以下为设置的一系列操作  置顶 && 设置提醒 && 设置聊天背景
     */
    async setCurrentChannelAsync(context, payload) { // 异步设置当前频道的信息&&set 并获取   
      let channelId = `${context.state.currentChannel.channelId}`
      let channelType = context.state.currentChannel.channelType
      let channelData = {}
      if (!channelType) { // user
        channelData = await context.dispatch('getUser', {
          userId: channelId
        })
        payload.channelName = channelData.nickName
        payload.channelAvatar = channelData.avatar
      } else {
        channelData = await context.dispatch('getGroup', {
          groupId: channelId
        })
        payload.channelName = channelData.groupName
        payload.channelAvatar = channelData.groupCover
      }
      let set = await context.dispatch('getChannelSet', {
        channelId: channelId
      })
      payload.channelId = channelId
      let otherMsg = []
      if (payload.msg) {
        otherMsg = await context.dispatch('testHasOtherMsg', payload)
      }
      payload.msg = payload.msg ? payload.msg.concat(otherMsg) : [].concat(otherMsg)
      let newP = Object.assign({}, payload, {
        set: set
      })
      context.commit('setCurrentChannel', newP)
    },
    async getChannelSet(context, payload) { // 获取频道的设置信息
      let channelSet = `channelSet_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`
      let set = await sql.selectData({
        select: `select * from ${channelSet} where channelSetId="${payload.channelId}"`
      })
      let allSet = await sql.selectData({
        select: `select * from ${channelSet} where channelSetId="allChannel"`
      })
      let obj = Object.assign({}, {
        bg: null,
        top: 0,
        topTime: null,
        noInterruption: 0
      }, (set && set[0]) ? set[0] : {})
      obj.bg = (set[0] && set[0].bg) ? set[0].bg : ((allSet && allSet.length) ? allSet[0] && allSet[0].bg : null)
      return obj
    },
    async setChannelTop(context, payload) { // 设置或取消 置顶聊天  (设置置顶 &&  取消置顶) -> 之后要更新channelList状态
      let channelSet = `channelSet_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`
      let channelList = `channelList_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`
      await sql.upItemData({
        formName: channelSet,
        obj: {
          by: 'channelSetId',
          channelSetId: payload.channelId,
          top: `${payload.top}`,
          topTime: fmt.date(new Date(), 'yyyy-MM-ddThh:mm:ssZ')
        }
      })
      if (payload.top) {
        await sql.sql({ // channelList中没有就插入
          sql: `INSERT OR IGNORE into ${channelList} (channelId) VALUES ("${payload.channelId}")`
        }).catch(() => {
          console.log('置顶更新channelList出错')
        })
      }
      await context.dispatch('getChannelList') // 更新会话列表
    },
    async setChannelNoInterrupt(context, payload) { // 设置频道是否免打扰 0 免打扰 || 1 默认打扰
      let channelSet = `channelSet_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`
      return sql.upItemData({
        formName: channelSet,
        obj: {
          by: 'channelSetId',
          channelSetId: payload.channelId,
          noInterruption: `${payload.noInterrupt}`
        }
      })
    },
    async setChannelBg(context, payload) { // 设置聊天背景  channelId不传为所有
      let channelSet = `channelSet_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`
      let bg = payload.bg
      if (payload.e) {
        bg = await context.dispatch('upImage', {
          file: payload.e.target.files[0]
        }, { // 上传文件服务器获取http网址
          root: true
        })
      }
      if (!payload.channelId) { // 所有的聊天背景
        sql.upForm({
          formName: channelSet,
          where: 'channelSetId != "allChannel"',
          set: 'bg=null'
        }).then(() => {
          sql.upItemData({
            formName: channelSet,
            obj: {
              by: 'channelSetId',
              channelSetId: 'allChannel',
              bg: bg
            }
          })
        }).catch((err) => {
          console.log('删除数据表失败', err)
        })
      } else {
        return sql.upItemData({
          formName: channelSet,
          obj: {
            by: 'channelSetId',
            channelSetId: payload.channelId,
            bg: bg
          }
        })
      }
    },
    async getLastMsg(context) {
      let group = `groups_${fmt.id(context.rootState.user.userId || localStorage.getItem('ud'))}`
      let imGroupDetailChatId = await sql.selectData({
        select: `select * from ${group} where (status=1) AND (imGroupDetailChatId IS NOT NULL) ORDER BY createTime DESC LIMIT 0,1`
      })
      let imChatId = await sql.selectData({
        select: `select * from ${group} where (status=1) AND (imChatId IS NOT NULL) ORDER BY createTime DESC LIMIT 0,1`
      })
      let imOtherMessageId = await sql.selectData({
        select: `select * from ${group} where (status=1) AND (imOtherMessageId IS NOT NULL) ORDER BY createTime DESC LIMIT 0,1`
      })
      return new Promise((resolve) => {
        let url = ''
        if (imGroupDetailChatId && imGroupDetailChatId[0]) {
          url = `ImGroupDetailChatId=${imGroupDetailChatId[0].imGroupDetailChatId}`
        }
        if (imChatId && imChatId[0]) {
          url = `${url}&imSingleChatId=${imChatId[0].imChatId}`
        }
        if (imOtherMessageId && imOtherMessageId[0]) {
          url = `${url}&ImOtherMessageId=${imOtherMessageId[0].imOtherMessageId}`
        }
        resolve(url)
      })
    },
    receiveLastMsg(context, payload) {
      let url = 'ws/receive-last-msg'
      if (!payload.url) {
        return
      }
      url = `${url}?${payload.url}`

      api.get({
        url: url,
        type: 'ws',
        success: function () {},
        error: function () {

        }
      })
    },
    selectSql(context, payload) {
      return sql.selectData({
        formName: payload.formName,
        select: payload.select
      })
    }
  }
}

export default moduleWS
