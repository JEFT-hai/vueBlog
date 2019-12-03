<template>
  <li class="groupMember">
    <div class="userAvator"
         @click="goUser">
      <img :class="{defaultStyle: item.avatar === null || item.avatar === '' || item.avatar === 'http://file.szwanwan.com:8888/group1/M00/00/48/rBpkyFzourOAHyA6AABbcMMe0wc315.png'}"
           :src="item.avatar === null || item.avatar === '' ? defaultAvatar : item.avatar"
           alt="">
    </div>
    <div class="message">
      <!-- <div class="userName">{{item.nickName === null || item.nickName === '' ? item.name : item.nickName}}</div> -->
      <div class="userName">{{item.groupNickName ? item.groupNickName : item.nickName ? item.nickName : item.name}}</div>
      <div class="userCode">
        <span :class="{pinkGenderLabel:item.gender === 2, blueGenderLabel:item.gender !== 2}">
          <i class="iconWanwan iconWnan-copy activityNan"
             v-if="item.gender === 1 || item.gender === 0 "></i>
          <i class="iconWanwan iconWnv3-copy activityNv"
             v-else></i>
          <!-- <i class="age">{{userAge}}</i> -->
        </span>
        <!-- <span class="yellowGenderLabel">
              会员
          </span> -->
      </div>
      <div class="userMsg"
           v-if="isShowFansCount">
        <!-- <span>128个动态</span> -->
        <span>{{item.fansCount}}个粉丝</span>
      </div>
      <div class="userMsg2"
           v-if="!isShowFansCount">
        <!-- <span>姓名:{{item.realName}}</span>
          <span>手机号:{{item.phone}}</span> -->
        <span>{{item.fansCount}}个粉丝</span>
      </div>
    </div>
    <!-- 表示是群主的话不显示这些按钮 -->
    <div class="btnList"
         v-if="!isMaster && role && !isMySelf && !myIsManage">
      <!-- 现在的移出群 -->
      <div class="showMoreBtn"
           @click.stop="handleBtnUl(true)"
           ref="moreBtn"
           v-if="!isMaster && role && !isMySelf">
        <span class="iconWshezhi iconWanwan activityNotice"></span>
      </div>
    </div>
  </li>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import ForbidWord from './forbidWord'
export default {
   data () {
    return {
      selectTime: '', // 选择禁言的时间
      isSelectTime: false, // 表示不显示禁言时长
      userInitBirth: this.item.birth,
      defaultAvatar: 'http://webapp.szwanwan.com/img/default/defaultavatar.png',
      isManage: this.cancelManage, // 表示是管理员需要取消,
      isNoraml: this.isSetManage, // 表示平民需要设置管理员
      isForbidState: this.item.isGag, // 表示禁言状态
      changeManage: this.item.memberRole === 1 ? true : false, // member === 1表示是已经是管理员
      initManageState: this.item.memberRole === 1 ? true : false // 表示初始管理员状态
    }
  },
  props: {
    onlyManage: { // 表示是需要显示管理员列表，不需要显示禁言和移出
      default: false,
      type: Boolean
    },
    isMaster: { // 表示群主那里不显示这个按钮
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: function () {
        return {}
      }
    },
    showPost: {
      type: Boolean,
      default: true
    },
    isShowFansCount: {
      type: Boolean,
      default: true
    },
    isGroupLeader: {
      type: Boolean,
      default: false
    },
    isSetManage: { // 表示是设置为管理员
      type: Boolean,
      default: false
    },
    cancelManage: { // 表示是取消管理员
      type: Boolean,
      default: false
    },
    groupId: {
      type: String,
      default: ''
    },
    role: {
      type: Number,
      default: false
    },
    myManager: { // 表示是管理员列表
      type: Boolean,
      default: false
    }
  },
  components: {
    ForbidWord
  },
  watch: {
    isGroupLeader (newV, oldV) {
      console.log('zizujian', newV)
      return newV
    }
  },
  computed: {
    ...mapState({
      'user': 'user',
      'groupManageList': 'groupManageList'
    }),
    userAge () {
      if (!this.userInitBirth) {
        return 0
      }
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
    },
    /**
     * 计算是不是自己
     */
    isMySelf () {
      return this.user.userId === this.item.userId
    },
    /**
     * 判断如果我是管理员，并且是管理员列表，那么在其他的管理员的地方就不能显示那个按钮，因为不能我是管理员没有对其他管理员操作的权利
     */
    myIsManage () {
      if (this.myManager && this.role === 1) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    ...mapMutations({
      'updateGroupManageList': 'updateGroupManageList', // 更新管理员列表
      'updateNeedBack': 'updateNeedBack'
    }),
    /**
     * handleBtnUl处理管理人按钮
     */
    handleBtnUl (data) {
      // 得到点击三角形的位置
      let moreBtn = this.$refs.moreBtn
      let distance = moreBtn.getBoundingClientRect()
      let x = distance.x
      let y = distance.y
      let obj = {
        data,
        distance,
        item: this.item
      }
      this.$emit('handleMask', obj)
    },
    setNewGroupMember (num) {
      let me = this
      me.api.put({
        url: 'GroupManage',
        data: {
          userGroupAskId: me.groupId,
          askState: num,
        },
        success: function (res) {
          console.log('manage', res)
        }
      })
    },
    /**
     * removeMemberSon移除群成员
     */
    removeMemberSon () {
      console.log('打印role',this.item.memberRole)
      let me = this
      me.api.delete({
        url: 'GroupMember',
        data: {
          groupId: me.item.userGroupId,
          memberId: me.item.userId,
        },
        success: function (res) {
          console.log('移除成功',res)
          console.log('打印一下role',)
          me.$emit('removeMember',me.item,me.item.memberRole)
        }
      })
    },
    /**
     * setManage设为管理员
     */
    setManage () {
      let me = this
      console.log('store里面的groupManageList',me.$store.state.groupManageList.length)
      console.log('管理员',!me.changeManage && me.$store.state.groupManageList && me.$store.state.groupManageList.length >= 2)
      if (!me.changeManage && me.$store.state.groupManageList && me.$store.state.groupManageList.length >= 2) {// 表示设为管理员
         // 表示已经有两位管理员了
        me.$toast('最多只能设置2位管理员', 500)
        return
      }
      me.api.process({
        url: 'GroupManage',
        data: {
          userGroupId: me.item.userGroupId,
          memberId: me.item.userId,
          isOperate: !me.changeManage
        },
        success: function (res) {
          if (me.changeManage) { // 如果是管理员
            me.initManageState = false
            me.changeManage = false
          } else { // 表示不是管理员
            me.initManageState = true
            me.changeManage = true
          }
          let currentArr =  me.groupManageList
            if (me.groupManageList.length === 0) {
              currentArr.push(me.item)
              me.updateGroupManageList(currentArr)
            } else {
              let pushIndex = -1
              me.groupManageList.forEach((item,index) =>{
              if (me.item.userId === item.userId) {
                // currentArr.splice(index,1)
                pushIndex = index
                return
              }
            })
            if (pushIndex === -1) {
               currentArr.push(me.item)
            } else {
               currentArr.splice(pushIndex,1)
            }
            
            me.updateGroupManageList(currentArr)
          }
        }
      })
    },
    /**
     * 去到用户主页
     */
    goUser () {
      if (this.item.userId === this.$store.state.user.userId) { // 去到我的主页
        this.updateNeedBack(true)
        this.$router.push({ name: 'my' })
      } else { // 去到别人的主页
        this.$router.push({ name: 'discoverUser', params: { id: this.item.userId } })
      }
    },
  }
}
</script>
<style lang="less" scoped>
  .groupMember{
    display:flex;
    // align-content: center;
    align-items: center;
    width:100%;
    padding-top:3vw;
    padding-bottom:3vw;
    box-sizing: border-box;
    .itemTitle{
      height:10vw;
      line-height: 10vw;
      font-size: var(--mText);
      padding-left: 5vw;
      color: var(--dGray);
    }
    .userAvator{
        box-sizing: border-box;
        margin-left:4vw;
        width:19.2vw;
        height:19.2vw;
        border-radius: 50%;
        border:1px solid rgb(243,243,243);
        overflow: hidden;
        position:relative;
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
        }
        .defaultStyle{
            width:13vw;
            height:13vw;
            border-radius: 0;
        }
    }
    .message{
        margin-left:3vw;
        flex: 1;
        .userName{
            max-width:45vw;
            font-size:4vw;
            color:#3c3c3c;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            word-wrap: break-word;
            word-break: break-all;
        }
        .userCode{
            display:flex;
            margin-top:0.5vw;
        }
        .userMsg{
            color:#676767;
            font-size:3.5vw;
            margin-top:0.5vw;
            span:nth-child(1) {
                margin-right:5vw;
            }
        }
        .userMsg2{
                        display:flex;
                        flex-flow: row wrap;
                        color:#676767;
                        font-size:3.5vw;
                        margin-top:0.5vw;
                        width:50vw;
                        span:nth-child(1) {
                            display:inline-block;
                            width:50vw;
                            margin-right:2vw;
                        }
                        span:nth-child(2) {
                            display:inline-block;
                            width:50vw;
                            margin-right:2vw;
                        }
                    }
    }
    .follow{
        width:20vw;
        display:flex;
        margin-right:2vw;
        .child{
            margin:auto;
        }
    }
    .btnList{
      width: 30vw;
      height: 19.2vw;
      position:relative;
      .showMoreBtn{
        width: 15vw;
        height:6vw;
        line-height:6vw;
        position:absolute;
        bottom:0;
        right:0;
        span{
          color:#d9d9d9;
          font-size:5.5vw;
        }
      }
      // span{
      //   &.gray{
      //     color: var(--lGray);
      //   }
      //   flex: 1;
      //   display: inline-block;
      //   font-size: var(--nText);
      //   color: var(--mRed);
      //   height: 19.2vw;
      //   line-height: 19.2vw;
      //   i{
      //     display: inline-block;
      //     height:5vw;
      //     line-height: 5vw;
      //     padding: 0 2vw;
      //     border: 1px solid currentColor;
      //     border-radius: 2.5vw;
      //     font-style: normal;
      //   }
      // }
    }
    .btnAdd{
      // border:1px solid red;
    }
  }
</style>
