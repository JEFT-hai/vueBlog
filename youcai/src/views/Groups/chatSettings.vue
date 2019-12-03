<template>
  <div class="chatSettings">
    <Comfirm :confirmTitle="confirmTitle"
             :confirmMsg="confirmMsg"
             v-if="isConfirm"
             @really="really"
             @handleConfirm="handleConfirm"></Comfirm>
    <SetGroupName :groupId="groupId"
                  @goName="goName"
                  v-if="hasMask && isShowGroupName"
                  :groupName="groupName"></SetGroupName>
    <div class="groupItem groupLinkItem  borderB"
         @click='goGroupInfo'>
      <div class="avatar"><img :src='groupInfo.groupCover' /></div>
      <div class="groupItemInfo">
        <div class="groupName">{{groupInfo.groupName}}</div>
        <div class="groupDesc">{{groupInfo.groupStatement}}</div>
      </div>
      <div class='groupItemMore'>
        资料
        <i class="iconWxiayibu iconWanwan textR"></i>
      </div>
    </div>
    <div class='groupMemberListWrapper groupLinkItem borderB'
         @click="goGroupMember">
      <div class="groupMemberListTitle">群成员 {{groupInfo.countMember}}</div>
      <div class="groupMemberListWrap">
        <ul class='groupMemberList'>
          <li class="specialLi"
              v-if="isGroupLeader || joinState === 2"
              @click.stop="share">
            <span class="addBtn">+</span>
            <p class="addFriend">邀请好友</p>
          </li>
          <li v-for='(item, index) in calculateMembetr'
              :key="index">
            <div class='userAvatar'>
              <img :src="item.avatar"
                   :class="{defaultStyle: item.avatar === 'http://file.szwanwan.com:8888/group1/M00/00/48/rBpkyFzourOAHyA6AABbcMMe0wc315.png'}" />
            </div>
            <p class="groupTag"
               v-if="item.memberRole === 2">群主</p>
            <p class="groupTag"
               v-if="item.memberRole === 1">管理员</p>
          </li>
        </ul>
        <span class="textR"><i class="iconWxiayibu iconWanwan"></i></span>
      </div>
    </div>
    <div class="shareGroupBtn"
         @click.stop="share">
      分享群组
    </div>
    <div class='groupQrCode borderB'
         @click="go.nameAid('groupQR', groupId)">
      <span class="groupTitle">群二维码</span>
      <span class="rightQr"><i class="iconWerweima iconWanwan"></i></span>
    </div>
    <div class='groupApplyListWrapper groupLinkItem borderB'
         @click="goGroupApply"
         v-if='isGroupLeader && groupApply.length'>
      <div class="groupApplyListTitle">申请入群列表</div>
      <div class="groupApplyListWrap">
        <ul class='groupApplyList'>
          <li v-for='(item, index) in groupApply'
              :key="index">
            <div class="userAvatar">
              <img :src="item.avatar"
                   :class="{defaultStyle: item.avatar === 'http://file.szwanwan.com:8888/group1/M00/00/48/rBpkyFzourOAHyA6AABbcMMe0wc315.png'}" />
            </div>
          </li>
        </ul>
        <span class="textR"><i class="iconWxiayibu iconWanwan"></i></span>
      </div>
    </div>
    <div class="setGroupBtn">
      <p>基础设置</p>
      <ul class="setGroupUl">
        <li class="setLiOne"
            @click="reviseGroup"
            v-if="isGroupLeader || myIsManager">
          <span>修改群组资料</span>
          <span>
            <i></i>
            <i class="iconWxiayibu iconWanwan"></i>
          </span>
        </li>
        <li class="setLiOne"
            @click="goGroupMember"
            v-if="isGroupLeader">
          <span>管理群</span>
          <span>
            <i></i>
            <i class="iconWxiayibu iconWanwan"></i>
          </span>
        </li>
        <li class="setLiTwo"
            @click="goName(true)">
          <span>本群昵称</span>
          <span>
            <i class="name">{{groupName}}</i>
            <i class="iconWxiayibu iconWanwan"></i>
          </span>
        </li>
        <li class="setLiThree"
            @click="handleMute">
          <span>消息免打扰</span>
          <div :class="['noticeBtn',{changeBtn: isMute == 1}]">
            <span :class="{changeRed: isMute == 1}"
                  ref="muteBtn"></span>
          </div>
        </li>
        <li class="setLiTwo"
            @click="handleTop">
          <span>置顶聊天</span>
          <div :class="['noticeBtn',{changeBtn: isTopBtn == 1}]">
            <span :class="{changeRed: isTopBtn == 1}"
                  ref="topBtn"></span>
          </div>
        </li>
        <li class="setLiTwo"
            @click="setChatBg">
          <span>设置聊天背景</span>
          <span>
            <i class="iconWxiayibu iconWanwan"
               :class="{rotate: isShowBg}"></i>
          </span>
        </li>
        <li :class="['imageWrap',{noHeight: isShowBg}]">
          <div class="imageUpload iconWxinjian iconWanwan">
            <input type="file"
                   name=""
                   id=""
                   accept="image/*"
                   class="imageInput"
                   @change="postCoverImage">
          </div>
          <div class="imageShow"
               v-if="activity.filesResults">
            <img :src="activity.filesResults"
                 alt="">
          </div>
          <div class="setBgWrap">
            <span class="confirmSubmit submitOne"
                  @click="submitConfirmOnly">应用当前</span>
            <span class="confirmSubmit submitOne"
                  @click="submitConfirmAll">应用所有</span>
            <span class="confirmSubmit "
                @click="deleteBg">删除背景</span>
          </div>
        </li>
        <li class="setLiTwo"
            @click="clearReport">
          <span>清空聊天记录</span>
          <span>
            <i class="iconWxiayibu iconWanwan"></i>
          </span>
        </li>
        <li class="setLiTwo"
            @click="goReport">
          <span>举报</span>
          <span>
            <i class="iconWxiayibu iconWanwan"></i>
          </span>
        </li>
        <li class="setLiTwo"
            @click="handleConfirm"
            v-if="isInGroup">
          <span>{{isGroupLeader ? '解散并退出该群' : '退出该群'}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import Comfirm from '@/components/confirm'
import SetGroupName from './components/SetGroupName'
import GroupStateBase from './components/GroupStateBase'
export default {
  mixins: [GroupStateBase],
  data () {
    return {
      groupId: this.$route.params.id,
      groupName: '', // 设置的群昵称
      isOne: false, // 表示置顶聊天开启
      isTwo: false, // 开启消息免打扰
      isTopBtn: parseInt(this.$route.params.isTop), // 是否置顶 1表示免打扰 0 表示没有
      isMute: parseInt(this.$route.params.isMute), // 是否禁言 1表示免打扰 0 表示没有
      groupInfo: {},
      groupMember: [],
      groupApply: [],
      groupManage: [], // 表示管理人列表
      confirmTitle: '',
      confirmMsg: '',
      isConfirm: false,
      isShowGroupName: false, // 是否显示群昵称
      // 背景
      isShowBg: false,
      allImages: [],
      allImagesFiles: [],
      type: 'image',
      files: [],
      fileItem: {},
      filesResults: [],
      activity: {},
      DeleteImageMask: false,
      inputE: null, // input事件的e
    }
  },
  components: {
    Comfirm,
    SetGroupName
  },
  watch: {
    groupId () {
      let blank = null
      this.updateGroupChatSet(blank)
    }
  },
  mounted () {
    this.$share.close()
    this.getGroupInfo()
    this.getGroupMember()
    this.getGroupApplyMember()
    window.isInAndroid && window.WanAndroid.imgCropType(0, 1) // 方图
  },
  activated () {
    this.$share.close()
    this.groupId = this.$route.params.id // 群组id
  },
  computed: {
    ...mapState(['groupManageList', 'hasMask', 'groupChatSetData']),
    /**
     * calculateMembetr计算成员
     */
    calculateMembetr () {
      if (this.joinState === 2 && !this.isGroupLeader) { // 表示我在这个群里面
        return this.groupMember.slice(0, 3)
      } else if (this.isGroupLeader) { // 表示我是群主
        return this.groupMember.slice(0, 3)
      } else {
        return this.groupMember.slice(0, 4)
      }
    }
  },
  methods: {
    ...mapMutations({
      'updateGroupManageList': 'updateGroupManageList',
      'setMask': 'setMask',
      'updateGroupChatSet': 'updateGroupChatSet'
    }),
    ...mapActions('ws',{
      delChannelMsg: 'delChannelMsg',
      setChannelTop: 'setChannelTop', // 设置消息置顶
      upChannelMsgUnRead: 'upChannelMsgUnRead', // 设置未读
      upChannelMsgRead: 'upChannelMsgRead', // 设置已读
      delChannelItem: 'delChannelItem', // 删除某频道
      getChannelSet: 'getChannelSet', // 获得每一条会话的设置信息
      setChannelNoInterrupt: 'setChannelNoInterrupt', // 消息免打扰
      setChannelBg: 'setChannelBg', // 设置聊天背景
      upGroup: 'upGroup',
    }),
    setChatBg () {
       console.log('设置聊天背景')
       this.isShowBg = !this.isShowBg
     },
    goReport () {
      this.$router.push({
        name: 'report',
        params: { id: this.groupId, type: 'noMusic' }
      })
    },
    clearReport () {
      this.$confirm({
                  title: '确定要清空聊天记录吗？',
                  yesBtnText: '确认',
                  type: 'confirm'
              }).then(() => {
                  let obj = {
                    channelId: this.groupId
                  }
                  let p = this.delChannelMsg(obj)
                  p.then(()=>{
                    this.$toast('消息已清空')
                    //  this.$router.back()
                  }).catch((error)=>{
                    console.log('清空消息失败', error)
                  })
              }).catch(() => {
                  // console.log('cancel')
              })
      

     },
    /**
     * goName去设置群昵称的页
     */
    goName (data, name) {
      // this.$router.push({name: 'groupName', id: this.groupId})
      this.isShowGroupName = data
      this.setMask(data)
      if (name) {
        this.groupName = name
      }
    },
    /**
     * groupNotice去消息提醒
     */
    goNotice () {
      this.$router.push({ name: 'groupNotice' })
    },
    handleConfirm (data) {
      this.isConfirm = data
      if (this.isGroupLeader) {
        this.confirmMsg = '确定要解散并退出该群吗,一旦解散不可恢复?'
      } else {
        this.confirmMsg = '确定要退出该群吗,一旦退出不可再申请'
      }
    },
    /**
     * really 表示退出该群
     */
    really () {
      if (this.isGroupLeader) { // 表示是群主
        let me = this
        me.api.delete({
          url: 'GroupManage',
          data: {
            groupId: me.groupId
          },
          success: function () {
            me.$router.push({ name: 'message' })
          }
        })
      } else { // 表示是管理员
        let me = this
        me.api.put({
          url: 'GroupMember',
          data: {
            groupId: me.groupId
          },
          success: function () {
            me.isConfirm = false
            me.$router.push({ name: 'message' })
          }
        })
      }
    },
     /**
     * handleTop处理置顶
     */
    handleTop () {
      let channel = {
        channelId: this.groupId
      }
      let top = ''
      if (this.isTopBtn) { // 如果是置顶，那么就取消
        top = 0
        this.isTopBtn = 0
      } else { // 如果没有置顶，那么就置顶
        top = 1
        this.isTopBtn = 1
      }
      let obj = {
        channelId: channel.channelId,
        top,
      }
      let p = this.setChannelTop(obj)
      p.then(()=>{
        if (this.isTopBtn) {
          this.$refs.topBtn.style.transform = 'translateX(' + 100 + '%)'
          
        } else {
          this.$refs.topBtn.style.transform = 'translateX(' + 0 + ')'
        }
      }).catch((error)=>{
        console.log('设置置顶失败', error)
      })
      
    },
    /**
     * handleMute处理屏蔽
     */
    handleMute () {
      console.log('打印这个idttt', this.groupId)
      let channel = {
        channelId: this.groupId
      }
      let noInterrupt = ''
      if (this.isMute) { // isMute 为1 表示免打扰， 那么就要取消
        noInterrupt = 0
        this.isMute = 0
      } else { // 如果isMute 为 0 表示是打扰，那么就要设置免打扰
        noInterrupt = 1
        this.isMute = 1
      }
      let obj = {
        channelId: channel.channelId,
        noInterrupt,
      }
      let p = this.setChannelNoInterrupt(obj)
      p.then(()=>{
        if (this.isMute) {
          this.$refs.muteBtn.style.transform = 'translateX(' + 100 + '%)'
        } else {
          this.$refs.muteBtn.style.transform = 'translateX(' + 0 + '%)'
        }
      }).catch((error) => {
        console.log('设置免打扰失败', error)
      })

    },
    /**
     * goSetting去设置页
     */
    goSetting () {
      let index = ''
      if (this.isGroupLeader) {
        index = 1 // 1表示是群组
      } else {
        index = 2 // 表示是成员
      }
      this.$router.push({ name: 'groupSet', params: { type: index, groupId: this.groupId } })
    },
    /**
    * 管理员列表
    */
    getGroupManageList () {
      let arr = this.groupMember.filter((item) => {
        return item.memberRole === 1
      })
      this.updateGroupManageList(arr)
      this.groupManage = this.$store.state.groupManageList
    },
    /**
     * getGroupInfo获得群组信息
     */
    getGroupInfo () {
      let me = this
      me.api.get({
        url: `UserGroup/GroupId?GroupId=${me.groupId}&Lon=${me.$store.state.pos.longitude}&Lat=${me.$store.state.pos.latitude}`,
        success: function (res) {
          me.groupInfo = res
          me.confirmTitle = res.groupName
          me.joinState = res.askState
          me.groupName = res.groupNickName
          me.memberState = res.memberState
          console.log(res, 'group')
          me.upGroup(res)
        }
      })
    },
    /**
     * getGroupMember得到成员列表
     */
    getGroupMember () {
      let me = this
      me.api.get({
        url: `GroupMember?GroupId=${me.groupId}`,
        success: function (res) {
          me.groupMember = res
          me.getGroupManageList()
        }
      })
    },
    /**
     * getGroupApplyMember得到申请人员列表
     */
    getGroupApplyMember () {
      let me = this
      me.api.get({
        url: 'GroupManage',
        success: function (res) {
          if (res.length) {
            me.groupApply = res.filter((item) => {
              return item.userGroupId === me.groupId
            })
          }
        }
      })
    },
    /**
     * goGroupInfo去群详情
     */
    goGroupInfo () {
      let me = this
      me.$router.push({
        name: 'groupInfo',
        params: {
          id: me.groupId
        }
      })
    },
    /**
     * goGroupApply去到群申请列表
     */
    goGroupApply () {
      let me = this
      me.$router.push({
        name: 'groupApplyList',
        params: {
          id: me.groupId
        }
      })
    },
    /**
     * addManage 增加管理员用户
     */
    addManage () {
      this.$router.push({
        name: 'groupManageList',
        params: {
          id: this.groupId
        } })
    },
       postCoverImage (e) {
      let me = this
      console.log('打印这个e', e)
      this.inputE = e
      if (e.target.files[0].type.indexOf('image') >= 0) {
        var reader = new FileReader()
        var file = e.target.files[0]
        console.log('打印这个file', file)
        reader.onloadstart = function (e) {
          // console.log('开始读取....')
        }
        reader.onprogress = function (e) {
          // console.log('正在读取中....')
        }
        reader.onabort = function (e) {
          // console.log('中断读取....')
        }
        reader.onerror = function (e) {
          // console.log('读取异常....')
        }
        reader.onload = function (e) {
          me.$set(me.files, 0, file)
          me.$set(me.activity, 'filesResults', e.target.result)
          // me.activity.filesResults = e.target.result
          // console.log('这个图片', this.allImages)
        }
       
        reader.readAsDataURL(file)
         console.log('打印这个图片', this.activity.filesResults)
      }
    },
    submitConfirmOnly () {
      if (!this.activity.filesResults) {
        this.$toast('请选择背景图片')
        return
      }
      let p = this.upFileThumbnail()
      p.then(()=>{
        let obj = {
          bg: this.activity.filesResults,
          e: this.inputE,
          channelId:this.groupId,
        }
        let res = this.setChannelBg(obj)
        res.then(()=>{
          this.$toast('设置成功')
        }).catch((error) => {
          console.log('设置背景图片失败', error)
        })
      })
      
    },
    submitConfirmAll () {
      if (!this.activity.filesResults) {
        this.$toast('请选择背景图片')
        return
      }
      let p = this.upFileThumbnail()
      p.then(()=>{
        let obj = {
          bg: this.activity.filesResults,
          e: this.inputE,
        }
        let res = this.setChannelBg(obj)
        res.then(()=>{
          this.$toast('设置成功')
        }).catch((error) => {
          console.log('设置背景图片失败', error)
        })
      })
      
    },
    deleteBg () { // 重置当前聊天背景
      let objOne = {
        channelId:this.groupId,
      }
      let o = this.getChannelSet(objOne)
      o.then((res)=>{
        if (!res.bg) {
          this.$toast('还没有设置背景哦!')
        } else {
          let obj = {
            bg: null,
            e: this.inputE,
            channelId:this.groupId,
          }
          let res = this.setChannelBg(obj)
          res.then(()=>{
            this.$toast('删除成功')
          }).catch((error) => {
            console.log('设置背景图片失败', error)
          })
          }
      })
    },
    upFileThumbnail () {
      let me = this
      return new Promise((resolve, reject) => {
        if (me.activity.filesResults && me.activity.filesResults.indexOf('http://') < 0 && me.activity.filesResults.indexOf('https://') < 0) {
          var fd = new FormData()
          fd.append('1', me.files[0])
          me.api.file({
            url: 'file',
            data: fd,
            success: (res) => {
              console.log('打印这个res', res)
              me.$set(me.activity, 'filesResults', res.split(',')[0])
              resolve()
            }
          })
        } else {
          resolve()
        }
      })
    },
  }
}
</script>
<style lang="less">
  .chatSettings{
    .setting{
      height:12vw;
      width:8vw;
      text-align: center;
      line-height:13.5vw;
      position:fixed;
      top:0;
      right:3vw;
      z-index:1000;
      .activityNotice{
        color:#666;
        font-size:5vw;
      }
    }
    .groupQrCode {
      height: 14vw;
      line-height:14vw;
      display: flex;
      padding: 0 3vw;
      .groupTitle {
        flex: 1;
      }
      .rightQr{
        display: inline-block;
        text-align: center;
        width: 12vw;
      }
    }
    .SignOut{
      width: 87.8vw;
      height: 13.89vw;
      line-height: 13.89vw;
      border-radius: 12vw;
      position: fixed;
      z-index: 22;
      bottom: 4.16vw;
      left: 0;
      right: 0;
      margin: 0 auto;
      background-color: rgba(255, 40, 66, 0.8);
      color: white;
      font-size: 5.46vw;
      text-align: center;
      align-items: center;
    }
    .groupLinkItem{
      padding: 3vw;
    }
    .groupItem{
      width: 100%;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      &.borderT:before {
        background-color: #f0f0f0;
        z-index: 200;
      }
      .avatar{
        width: 19.63vw;
        height: 19.63vw;
        // margin-left: 4vw;
        margin-right: 3vw;
        border-radius: 50%;
        overflow: hidden;
        border: 1px solid #f3f3f3;
        img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .groupItemInfo{
        flex: 1;
        max-width: 52vw;
        .groupName{
          height: 8vw;
          line-height: 8vw;
          font-size: 4.8vw;
          font-weight: bold;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        .groupDesc{
          margin-top: 1vw;
          font-size: 3.4vw;
          color: var(--lGray);
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
      .groupItemMore{
        color: var(--lGray);
        text-align: right;
        width: 20vw;
        height: 100%;
      }
    }
    .groupApplyListWrapper{
      width: 100%;
      box-sizing: border-box;
      .groupApplyListWrap{
        display: flex;
        // padding: 3vw 0;
        // align-items: center;
        max-height: 45vw;
        overflow: hidden;
        .groupApplyList{
          flex: 1;
          max-width: 90vw;
          font-size: 0;
          li{
            position: relative;
            display: inline-block;
            // flex: 1;
            width: 22.5vw;
            margin-top: 3vw;
            text-align: center;
            .userAvatar{
              height: 18vw;
              width: 18vw;
              border-radius: 50%;
              box-sizing: border-box;
              border: 1px solid #e8e8e8;
              overflow: hidden;
              position:relative;
              img{
                width:100%;
                height:100%;
                overflow: hidden;
              }
            }
            .defaultStyle{
              width:13vw;
              height:13vw;
              position:absolute;
              top:0;
              right:0;
              bottom:0;
              left:1vw;
              margin:auto;
            }
            .groupTag{
                position: absolute;
                left: 50%;
                margin-left: -8.65vw;
                width: 12.8vw;
                height: 5.56vw;
                line-height: 5.56vw;
                margin-top: -2.78vw;
                color: #fff;
                font-size: var(--nText);
                background: var(--mRed);
                border-radius: 2.78vw;
                text-align: center;
            }
          }
        }
        .textR{
          display: inline-block;
          width: 4vw;
          color: var(--lGray);
          position: relative;
          i {
            position: absolute;
            content: '';
            top: 50%;
            right: 0;
            margin-top: -13px;
            height: 26px;
            width: 16px;
          }
        }
      }
    }
    .shareGroupBtn{
      width:91vw;
      border-radius: 9vw;
      height:13.89vw;
      border:1px solid rgb(243,243,243);
      margin:auto;
      margin-top:5vw;
      margin-bottom:5vw;
      line-height:13.89vw;
      text-align: center;
      font-weight: bold;
    }
    .groupMemberListWrapper{
      width: 100%;
      box-sizing: border-box;
      .addMangeMember{
        display:inline-block;
        width:7vw;
        height:7vw;
        border-radius: 50%;
        text-align: center;
        line-height:7vw;
        color:red;
        margin-left:10vw;
      }
      .groupMemberListWrap{
        display: flex;
        padding: 3vw 0;
        // align-items: center;
        max-height: 45vw;
        overflow: hidden;
        .groupMemberList{
          flex: 1;
          max-width: 90vw;
          font-size: 0;
          display: flex;
          // border:1px solid blue;
          justify-content: space-between !important;
          li{
            position: relative;
            display: inline-block;
            // flex: 1;
            width: 22.5vw;
            margin-bottom: 5vw;
            text-align: center;
            .userAvatar{
              height: 18vw;
              width: 18vw;
              border-radius: 50%;
              box-sizing: border-box;
              border: 1px solid #e8e8e8;
              position:relative;
              overflow: hidden;
              img{
                width:100%;
                height:100%;
                overflow: hidden;
              }
            }
            .defaultStyle{
              widows: 14vw;
              height:14vw;
              position:absolute;
              top:0;
              bottom:0;
              right:0;
              left:1vw;
              margin:auto;
              overflow: hidden;
            }
            .groupTag{
                position: absolute;
                left: 50%;
                margin-left: -8.65vw;
                width: 12.8vw;
                height: 5.56vw;
                line-height: 5.56vw;
                margin-top: -2.78vw;
                color: #fff;
                font-size: var(--nText);
                background: var(--mRed);
                border-radius: 2.78vw;
                text-align: center;
            }
            .otherMember{
                position: absolute;
                bottom:-6vw;
                left: 50%;
                margin-left: -9.65vw;
                width: 14.8vw;
                height: 5.56vw;
                line-height: 5.56vw;
                margin-top: -2.78vw;
                color: var(--lGray);
                font-size: var(--nText);
                // background: var(--mRed);
                border-radius: 2.78vw;
                text-align: center;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space:nowrap;
            }
          }
          .specialLi{
            flex: 1;
            text-align: center;
            max-width: 22.5vw;
            position:relative;
          .addBtn{
            display:inline-block;
            height: 18vw;
            width: 18vw;
            border-radius: 50%;
            background: rgb(243, 243, 243);
            text-align: center;
            line-height:18vw;
            font-size:7vw;
            color:#666;
          }
          .addFriend{
            width:100%;
            position:absolute;
            top:18vw;
            left:0;
            font-size: var(--nText);
            color: #6e6e6e;
          }
        }
        }
        .textR{
          display: inline-block;
          width: 4vw;
          color: var(--lGray);
          position: relative;
          i {
            position: absolute;
            content: '';
            top: 50%;
            right: 0;
            margin-top: -13px;
            height: 26px;
            width: 16px;
          }
        }
      }
    }
    .setGroupBtn{
      width:100%;
      padding:3vw;
      box-sizing: border-box;
      p{
        font-size:3.5vw;
        margin-bottom:1vw;
        font-weight: bold;
      }
      .setGroupUl{
        li{
          height:15vw;
          display:flex;
          align-items: center;
          justify-content: space-between;
          span:nth-child(2) {
            .smallTitle{
              display:inline-block;
              height:15vw;
              line-height:15vw;
              margin-right:4vw;
              font-size:3.5vw;
              font-style: normal;
              color:rgb(151, 149, 145);
            }
            .name{
              font-style: normal;
              display: inline-block;
              height: 15vw;
              line-height: 15vw;
              margin-right: 4vw;
              font-size: 3.5vw;
              font-style: normal;
              color: #979591;
            }
            .iconWxiayibu{
              display:inline-block;
              height:15vw;
              line-height:16vw;
              color:var(--lGray);
              transition:all 0.5s;
            }
            .rotate{
              transform:rotate(90deg);
              transition:all 0.5s;
            }
          }
          .noticeBtn{
                    border-radius: 4vw;
                    width:11.67vw;
                    height:6.11vw;
                    position: relative;
                    background-color:rgb(220, 220, 220);
                    border:1px solid rgb(220, 220, 220);
                    transition: all 0.5s;
                    // border:1px solid blue;
                    span{
                        position:absolute;
                        top:0;
                        left:0;
                        display:inline-block;
                        width:5.5vw;
                        height:5.5vw;
                        border-radius: 50%;
                        background-color:white;
                        transition: all 0.5s;
                    }
                    .changeRed{
                        background:rgb(255, 255, 255);
                        transform: translateX(100%);
                    }
                }
                .changeBtn{
                    background-color:rgb(255, 39, 66);
                    border:1px solid rgb(255, 39, 66);
                }
        }
            .imageWrap{
          width:100%;
          height:0vw;
          overflow: hidden;
          padding-left:4vw;
          box-sizing: border-box;
          transition:  all 0.5s;
          .imageUpload{
            width:20vw;
            height:20vw;
            background:rgb(224, 224, 224);
            border-radius: 1vw;
            position:relative;
            color: white;
            font-size:9vw;
            text-align: center;
            line-height:20vw;
            .imageInput{
              position: absolute;
              outline: none;
              z-index: 1;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              opacity: 0;
            }
            &::after {
              position: absolute;
              top: 0;
              left: 0;
              font-size:7vw;
              content: " ";
              display:inline-block;
              width: 20vw;
              height: 20vw;
            }
          }
          .imageShow{
            position:absolute;
            width:20vw;
            height:20vw;
            background:rgb(224, 224, 224);
            border-radius: 1vw;
            border:1px solid rgb(224,224,224);
            img{
              width:100%;
              height:100%;
              object-fit: cover;
            }
          }
          .setBgWrap{
            .confirmSubmit{
              border:1px solid rgb(224, 224, 224);
              border-radius: 2vw;
              text-align: center;
              padding:2vw;
              box-sizing: border-box;
              font-size:3.5vw;
            }
             .submitOne{
              margin-right:2vw;
            }
          }
          
        }
        .noHeight{
          height:30vw;
          overflow: hidden;
        }
      }
    }
  }
</style>
