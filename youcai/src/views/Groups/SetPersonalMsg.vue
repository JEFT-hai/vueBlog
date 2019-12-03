<template>
  <div class="setPersonalPage">
    <Comfirm v-show="isShowConfirm"
             :confirmTitle='confirmTitle'
             :confirmMsg='confirmMsg'
             @handleConfirm="handleConfirm"
             @really="really"></Comfirm>
    <div class="head">
      <span>聊天设置</span>
    </div>
    <div class="user borderB"
         @click="goHome">
      <div class="userAvatar">
        <img :src="user.avatar === null || user.avatar === '' ? defaultAvatar : user.avatar"
             alt="">
      </div>
      <div class="userMsg">
        <span>{{user.nickName}}</span>
        <span :class="{pinkGenderLabel:user.gender === 2,blueGenderLabel:user.gender !== 2}">
          <i class="iconWanwan iconWnan-copy activityNan"
             v-if="user.gender === 1 || user.gender === 0 "></i>
          <i class="iconWanwan iconWnv3-copy activityNv"
             v-else></i>
          <!-- <i class="age">{{userAge}}</i> -->
        </span>
      </div>
      <span class="next">
        <i class="iconWxiayibu iconWanwan"></i>
      </span>
    </div>
    <ul class="setGroupUl">
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
        <div :class="['noticeBtn',{changeBtn: isTopBtn}]">
          <span :class="{changeRed: isTopBtn}"
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
      <li class="setLiFour"
          @click="handleConfirm(true)">
        <span>拉黑</span>
        <span class="blackState">
          <i class="blackFont"
             v-if="blackState">已拉黑</i>
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
    </ul>
  </div>
</template>

<script>
import Comfirm from '@/components/confirm'
import {mapState, mapMutations,mapActions} from 'vuex'
export default {
  data () {
    return {
      isShowBg: false,
      user: {},
      userId: this.$route.params.id,
      isShowConfirm: false,
      confirmTitle: '提示',
      confirmMsg: '拉黑后将不会收到对方发来的信息(可在我的-设置-黑名单中取消)',
      userInitBirth: '',
      isTopBtn: parseInt(this.$route.params.isTop), // 是否置顶 1表示免打扰 0 表示没有
      isMute: parseInt(this.$route.params.isMute), // 是否禁言 1表示免打扰 0 表示没有
      blackState: false,
      defaultAvatar: 'http://webapp.szwanwan.com/img/default/defaultavatar.png',
      // 图片
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
    Comfirm
  },
  watch: {
    userId (newV) {
      let blank = null
      this.updatePersonChatSet(blank)
    }
  },
  computed: {
    ...mapState(['personalSetData']),
       // 用户资料年龄
    userAge () {
      let userBirth = this.userInitBirth
      let data = new Date()
      let year = data.getFullYear()
      let month = data.getMonth() + 1
      let day = data.getDate()
      let birthYear = parseInt(userBirth.substring(0, 4))
      let birthMonth = parseInt(userBirth.substring(5, 7))
      let ageYear = year - birthYear
      let birthDay = parseInt(userBirth.substring(8, 10))
      // 如果当前月份小于生日月份就要减1岁
      let change = month > birthMonth || month === birthMonth ? 0 : -1
      // 只有当生日月份当前月份相等时 才判断 day
      if (month === birthMonth) {
        change = day > birthDay || day === birthDay ? 0 : -1
      }
      if (ageYear + change === 2018) {
        return 0
      } else {
        return ageYear + change
      }
    }
   },
  created () {
    this.getOtherUser()
  },
  mounted () {
    window.isInAndroid && window.WanAndroid.imgCropType(0, 1) // 方图
  },
  methods: {
    ...mapMutations({
      'updatePersonChatSet': 'updatePersonChatSet'
    }),
    ...mapActions('ws',{
      delChannelMsg: 'delChannelMsg', // 清空聊天记录
      setChannelTop: 'setChannelTop', // 设置消息置顶
      upChannelMsgUnRead: 'upChannelMsgUnRead', // 设置未读
      upChannelMsgRead: 'upChannelMsgRead', // 设置已读
      delChannelItem: 'delChannelItem', // 删除某频道
      getChannelSet: 'getChannelSet', // 获得每一条会话的设置信息
      setChannelNoInterrupt: 'setChannelNoInterrupt', // 消息免打扰
      setChannelBg: 'setChannelBg', // 设置聊天背景
      upUser: 'upUser'
    }),
    /**
     * handleTop处理置顶
     */
    handleTop () {
      let channel = {
        channelId: this.userId
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
      let channel = {
        channelId: this.userId
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
    goReport () {
      this.$router.push({
          name: 'report',
          params: { id: this.userId, type: 'noMusic'}
      })
    },
    /**
     * 获得user信息
     */
    getOtherUser () {
      let me = this
      let userId = this.userId
      me.api.get({
        url: `UserMain/userId?userId=${userId}`,
        success: function (res) {
          me.user = res
          me.userInitBirth = res.birth
          me.upUser(res)
          
        }
      })
    },
    /**
     * goName去设置群昵称的页
    */
    goName () {
        this.$router.push({name: 'groupName'})
    },
    /**
    * groupNotice去消息提醒 
    */
     goNotice () {
        this.$router.push({name: 'groupNotice'})
     },
     setChatBg () {
       console.log('设置聊天背景')
       this.isShowBg = !this.isShowBg
     },
     clearReport () { // 清空聊天记录
      this.$confirm({
                  title: '确定要清空聊天记录吗？',
                  yesBtnText: '确认',
                  type: 'confirm'
              }).then(() => {
                  let obj = {
                    channelId: this.userId
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
     handleConfirm (data) {
       if (this.blackState) {
         return
       }
        this.isShowConfirm = data
     },
     really () {
       this.isShowConfirm = false
       let me = this
       me.api.process({
         url: 'UserBlackList',
         data: {
           guestUserId: me.userId,
         },
         success: function () {
           me.blackState = true
           me.$toast('拉黑成功')
           window.isInAndroid && window.WanAndroid.addToBlacklist(me.userId)
         }
      })
    },
    goHome () {
      this.$router.push({ name: 'discoverUser', params: { id: this.user.userId } })
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
          channelId:this.userId,
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
        channelId:this.userId,
      }
      let o = this.getChannelSet(objOne)
      o.then((res)=>{
        if (!res.bg) {
          this.$toast('还没有设置背景哦!')
        } else {
          let obj = {
            bg: 'white',
            e: this.inputE,
            channelId:this.userId,
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

<style lang="less" scoped>
   .setPersonalPage{
     width:100%;
     height:100%;
     overflow-x: hidden;
     .head{
           position:fixed;
           top:0;
           left:14vw;
           height:12vw;
           line-height:13vw;
           width:85%;
           display:flex;
           justify-content: space-between;
           z-index:1000;
           font-size:4.5vw;
       }
     .user{
         width:100%;
         height:27.22vw;
         padding:4vw;
         box-sizing: border-box;
         display:flex;
         align-items: center;
        .userAvatar{
            width:17.04vw;
            height:17.04vw;
            box-shadow: 0 0 1px #eee;
            border-radius: 50%;
            overflow: hidden;
        }
        .userMsg{
            margin-left:4vw;
            flex:1;
            display:flex;
            align-items: center;
            span:nth-child(1) {
              font-size:4.53vw;
              margin-right:2vw;
            }
        }
        .next{
            color: var(--lGray);
        }
     }
    .setGroupUl{
        padding:4vw;
        box-sizing: border-box;
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
            // width:50vw;
            // display:flex;
            // justify-content: space-between;
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
        .setLiFour{
          .blackState{
            .blackFont{
              color:#999;
              font-size:3vw;
              font-style:normal;
            }
          }
        }
      }
   }
</style>
