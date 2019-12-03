<template>
  <div class="setWrap">
    <router-view></router-view>
    <div class="split"></div>
    <div class="setMain">
      <ul>
        <li class="lilist borderB" @click="handlePersonal">
          <span class="eachLi">个人资料</span>
          <span class="next">
            <i class="iconWanwan iconWcaidan activityNotice"></i>
          </span>
        </li>
        <li class="lilist borderB" @click="handleUserAccount">
          <span class="eachLi">账号与安全</span>
          <span class="next">
            <i class="iconWanwan iconWright activityNotice"></i>
          </span>
        </li>
        <li class="lilist borderB" @click="cancelUser">
          <span class="eachLi">注销账号</span>
          <span class="next">
            <i class="iconWanwan iconWright activityNotice"></i>
          </span>
        </li>
        <li class="split"></li>
        <li class="lilist borderB" @click="goBlackList">
          <span class="eachLi">黑名单</span>
          <span class="next">
            <i class="iconWanwan iconWright activityNotice"></i>
          </span>
        </li>
        <li class="lilist borderB" @click="goAbout">
          <span class="eachLi">关于多录</span>
          <span class="next">
            <i class="iconWanwan iconWright activityNotice"></i>
          </span>
        </li>
        <li class="lilist borderB" @click="handleSupport">
          <span class="eachLi">意见反馈</span>
          <span class="next">
            <i class="iconWanwan iconWright activityNotice"></i>
          </span>
        </li>
        <li class="lilist borderB" @click="handleRight">
          <span class="eachLi">申请认证</span>
          <span class="next">
            <i class="iconWanwan iconWright activityNotice"></i>
          </span>
        </li>
        <li class="split"></li>
        <router-link :to="{ name: 'logout' }" class="link" v-if="userIsLogin">
          <li class="lilist borderB">
            <span class="eachLi">登出账户</span>
            <span class="next">
              <i class="iconWanwan iconWright activityNotice"></i>
            </span>
          </li>
        </router-link>
        <li class="lilist borderB" @click="handleLogoutNotice">
          <span class="eachLi">登出账户</span>
          <span class="next">
            <i class="iconWanwan iconWright activityNotice"></i>
          </span>
        </li>
      </ul>
    </div>
    <MessageNotice
      v-show="isShowMsgNotice"
      @hiddleNotice="hiddleNotice"
    ></MessageNotice>
    <LogoutNotice
      v-show="hasMask && isShowLogout"
      @hiddleOutNotice="hiddleOutNotice"
      @reallyLogout="reallyLogout"
    ></LogoutNotice>
    <!-- <UserAccount v-show="hasMask && isShowUserAccount"
                 @hiddleUserAccount="hiddleUserAccount"></UserAccount> -->
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex';
import MessageNotice from '@/views/My0/components/MessageNotice';
import LogoutNotice from '@/views/My0/components/LogoutNotice';
// import UserAccount from '@/views/My0/components/UserAccount'
export default {
  data() {
    return {
      isShowMsgNotice: false,
      isShowLogout: false,
      isShowUserAccount: false, // 显示用户账号
      isShowProfile: false, // 显示个人资料主页
      isShowAbout: false, // 显示关于信息
      isShowSupport: false // 显示反馈信息
    }
  },
  components: {
    MessageNotice,
    LogoutNotice
    // UserAccount,
  },
  computed: {
    ...mapState(['user', 'hasMask']),
    ...mapGetters(['userAvatar', 'userIsLogin'])
  },
  methods: {
    ...mapMutations({
      setMask: 'setMask',
      updateFollowList: 'updateFollowList'
    }),
    ...mapActions({
      userLogoutAsync: 'userLogoutAsync'
    }),
    goBlackList() {
      this.$router.push({ name: 'black_list' })
    },
    /**
     * handlePersonal显示用户主页
     */
    handlePersonal() {
      this.$router.push({ name: 'my_personal' })
    },
    /**
     * handlePersonal 隐藏用户主页
     */
    hiddlePersonal() {
      this.setMask(false)
      this.isShowProfile = false
    },
    /**
     * handleAbout 显示关于信息
     */
    handleAbout() {
      this.$router.push({ name: 'my_about' })
    },
    /**
     * hiddleAbout 隐藏关于信息
     */
    hiddleAbout() {
      this.setMask(false)
      this.isShowAbout = false
    },
    /**
     * handleSupport 显示反馈信息
     */
    handleSupport() {
      this.$router.push({ name: 'my_feedBack' })
    },
    /**
     * handleRight 显示认证信息
     */
    handleRight() {
      if (this.user.userAuthen) {
        this.$router.push({ name: 'modify_right' })
      } else {
        this.$router.push({ name: 'my_right' })
      }
    },
    /**
     * hiddleSupport 隐藏反馈信息
     */
    hiddleSupport() {
      this.setMask(false)
      this.isShowSupport = false
    },
    handleMsgNotice() {
      this.setMask(true)
      this.isShowMsgNotice = true
      this.setFalse('isShowMsgNotice')
    },
    hiddleNotice() {
      this.setMask(false)
      this.isShowMsgNotice = false
    },
    handleLogoutNotice() {
      this.setMask(true)
      this.isShowLogout = true
      this.setFalse('isShowLogout')
    },
    cancelUser() {
      this.$confirm({
        title: '注销',
        msg: '确定要注销该账号？',
        type: 'confirm'
      })
        .then(() => {
          this.userLogoutAsync()
          this.$router.replace({ name: 'index' })
          this.$toast('注销账号成功')
        })
        .catch(() => {})
    },
    // 取消退出登录
    hiddleOutNotice() {
      this.setMask(false)
      this.isShowLogout = false
    },
    // 退出登录
    reallyLogout() {
      this.$router.push({ name: 'logout' })
    },
    // 显示用户账号页
    handleUserAccount() {
      // this.setMask(true)
      // this.isShowUserAccount = true
      // this.setFalse('isShowUserAccount')
      console.log('不行吗')
      this.$router.push({
        name: 'account'
      })
    },
    // 隐藏用户账号页
    hiddleUserAccount() {
      this.setMask(true)
      this.isShowUserAccount = false
    },
    goAbout() {
      this.$router.push({
        name: 'my_about'
      })
    },
    setFalse(str) {
      let me = this
      let arr = [
        'isShowMsgNotice',
        'isShowLogout',
        'isShowUserAccount',
        'isShowProfile',
        'isShowAbout',
        'isShowSupport'
      ]
      arr.map(item => {
        if (item !== str) {
          me[item] = false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.setWrap {
  .split {
    width: 100%;
    height: 3.05vw;
    background-color: var(--mBg);
  }
  .setMain {
    width: 100%;
    ul {
      .lilist {
        width: 100%;
        height: 13.7vw;
        line-height: 13.7vw;
        padding-left: 4.44vw;
        box-sizing: border-box;
        display: flex;
        color: #333333;
        .eachLi {
          display: inline-block;
          width: 91%;
        }
        .next {
          .activityNotice {
            color: #cccccc;
          }
        }
      }
    }
  }
}
</style>
