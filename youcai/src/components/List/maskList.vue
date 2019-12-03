<template>
  <div class="maskList"
       @click.stop="hiddleMask(false)"
       v-if="showMask">
    <ForbidWord v-show="isSelectTime"
                @handleForbidWord="handleForbidWord"
                :item="item"></ForbidWord>
    <Comfirm v-show="isShowConfirm"
             :confirmTitle='confirmTitle'
             @handleConfirm="handleConfirm"
             @really="really"></Comfirm>
    <ul :class="['btnUl',{haveBtnUl:showMask}]"
        ref="mask"
        :style="{left: myX,top: myY}">
      <li @click.stop="handleManage"
          v-if="userRole == 2">{{item && item.memberRole == 1 ? '撤销管理员': '设为管理员'}}</li>
      <li @click.stop="handleTransfer" v-if="userRole == 2">
        设为群主
      </li>
      <!-- <li  @click.stop="handleConfirm(true)" v-if="item.memberRole != 1">移除</li> -->
      <li @click.stop="handleConfirm(true)"
          v-if="userRole == 2">移除</li>
     
      <li @click.stop="forbid(true)"
          :class='[{grayForbid: item && item.isGag}]'>{{item && item.isGag ? '已禁言' : '禁言'}}</li>
    </ul>
  </div>
</template>

<script>
import ForbidWord from '@/components/List/forbidWord'
import Comfirm from '@/components/confirm'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'Share',
  data() {
    return {
      isLoading: false, // 表示是否已经请求
      confirmTitle: '确定要移除该成员吗',
      shares: {},
      isShowBtnUl: false, // 按钮列表
      mask: this.$refs.mask,
      isForbidState: this.item && this.item.isGag, // 表示禁言状态
      isSelectTime: false, // 表示不显示禁言时长组件
      isShowConfirm: false, // 表示显示移除组件
      changeManage: this.item && this.item.memberRole === 1 ? true : false, // member === 1表示是已经是管理员
      initManageState: this.item && this.item.memberRole === 1 ? true : false // 表示初始管理员状态
    }
  },
  props: ['distance', 'showMask', 'item', 'userRole'], // userRole表示我在这个群里的角色
  components: {
    ForbidWord,
    Comfirm
  },
  computed: {
    ...mapState({
      'user': 'user',
      'groupManageList': 'groupManageList'
    }),
    myX () {
      if (this.distance) {
        return this.distance.x - 60 + 'px'
      }
    },
     myY () {
      if (this.distance) {
        return this.distance.y - 110 + 'px'
      }
    }
  },
  methods: {
    ...mapMutations({
      'updateGroupManageList': 'updateGroupManageList' // 更新管理员列表
    }),
    /**
     * hiddleMask 隐藏mask
     */
    hiddleMask (data) {
      // this.isShowConfirm = false
      // this.isSelectTime = false
      this.$emit('hiddleMaskF',data)
    },
    /**
     * forbid我是禁言
     */
    forbid (data) {
      this.handleForbidWord(data)
    },
    /**
     * 设置禁言时间
     */
    handleForbidWord (data,time) {
      let me = this
      if (me.item && me.item.isGag) { // 表示已经禁言就需要取消禁言
        me.api.process({
            url: 'GroupMemberManage',
            data: {
              userGroupid: me.item.userGroupId,
              memberId: me.item.userId,
              isOperate: false,
            },
            success: function () {
              me.item.isGag = !me.item.isGag
              console.log('取消禁言成功',me.item.isGag)
            }
          })
      } else { // 表示没有禁言就需要禁言
        me.isSelectTime = data
        if (time) {
          me.selectTime = time
          me.api.process({
            url: 'GroupMemberManage',
            data: {
              userGroupid: me.item.userGroupId,
              memberId: me.item.userId,
              isOperate: true,
              minute: me.selectTime
            },
            success: function () {
              me.item.isGag = !me.item.isGag
            }
          })
        }
      }
      
    },
    /**
     * removeMemberSon移除群成员
     */
    removeMemberSon () {
      let me = this
      if (me.isLoading) {
        return
      }
      me.isLoading = true
      me.api.delete({
        url: 'GroupMember',
        data: {
          groupId: me.item.userGroupId,
          memberId: me.item.userId,
        },
        success: function () {
          me.isLoading = false
          me.$emit('removeMember',me.item,me.item.memberRole)
          me.$emit('hiddleMaskF',false)
        },
        error: function (res) {
          me.$toast(res)
        },
        complete: function() {
          me.isLoading = false
        }
      })
    },
    /**
     * handleConfirm取消显示移除的组件
     */
    handleConfirm (data) {
      this.isShowConfirm = data
    },
    handleTransfer () { // 转让群主
      console.log('只有群主才能转让为群主呢')
      let me = this
      if (me.isLoading) {
        return
      }
      me.isLoading = true
      me.api.put({
        url: 'GroupMemberSet',
        data: {
          groupId: me.item.userGroupId,
          newOwnerId: me.item.userId
        },
        success: function () {
          me.$toast('转让成功')
          me.isLoading = false
          me.$emit('callBackList')
        },
        error: function (res) {
          me.$toast(res)
        },
        complete: function() {
          me.isLoading = false
        }
      })
    },
    /**
     * 确定移除
     */
    really () {
      console.log('我是确定移除',this.isRemove)
      this.removeMemberSon()
      this.isShowConfirm = false
    },
    /**
     * 设置为管理员
     */
    handleManage () {
      let me = this
      if (me.isLoading) {
        return
      }
      if (!(this.item && this.item.memberRole === 1 ? true : false) && me.$store.state.groupManageList && me.$store.state.groupManageList.length >= 2) {// 表示设为管理员
         // 表示已经有两位管理员了
        me.$toast('最多只能设置2位管理员', 500)
        return
      }
      me.isLoading = true
      this.setManage()
    },
    /**
     * setManage设为管理员
    */
    setManage () {
      let me = this
      me.api.process({
        url: 'GroupManage',
        data: {
          userGroupId: me.item.userGroupId,
          memberId: me.item.userId,
          isOperate: !(me.item && me.item.memberRole === 1 ? true : false)
        },
        success: function () {
          me.$emit('hiddleMaskF', false)
          me.$toast('设置成功', 1200)
          me.isLoading = false
          console.log('设置成功管理员长度是', me.$store.state && me.$store.state.groupManageList.length)
          if (me.item && me.item.memberRole === 1 ? true : false) { // 如果是管理员
            me.changeManage = false
            me.item.memberRole = 0
          } else { // 表示不是管理员
            me.item.memberRole = 1
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
        },
        error: function (res) {
          me.$toast(res)
        },
        complete: function() {
          me.isLoading = false
        }
      })
    },
  }
}
</script>

<style lang="less" scope>
@keyframes moveTop {
  0%{
    transform: translateY(0);
  }
   100%{
    transform: translateY(-50vw);
   }
}
.maskList{
  width:100%;
  height:calc(100vh - 12vw);
  position: absolute;
  top:12vw;
  left:0;
  z-index:11;
    .btnUl{
        width:27.85vw;
        height:24vw;
        position:absolute;
        left:0;
        top:0;
        // z-index:2000;
        border-radius: 1vw;
        li{
          color:#666;
          // border-bottom:1px solid #eee;
          margin-bottom:0.5vw;
        }
        li:last-child{
          border-bottom:none;
        }
      }
      .haveBtnUl{
        margin-top:2vw;
        width:27.85vw;
        height:33vw;
        position:absolute;
        left:0;
        top:0;
        box-shadow: 2px 2px 5px rgba(0,0,0,.5);
        // animation: moveTop 0.5s linear  forwards;
        background:white;
        display:flex;
        flex-flow: row wrap;
        align-items: center;
        li{
          width:100%;
          height:8vw;
          line-height:8vw;
          padding-left:2vw;
          box-sizing: border-box;
        }
      }
      .grayForbid{
        color: var(--lGray);
      }
}
.sharePlay-enter-active,
.sharePlay-leave-active {
  transition: all 1s;
}
.sharePlay-enter,
.sharePlay-leave-to {
  opacity: 0;
  top: 0;
}
</style>
