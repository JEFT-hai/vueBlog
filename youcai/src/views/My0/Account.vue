<template>
    <div class="accountWrap">
      <ul>
        <li class="borderB">
          <span>用户账号</span>
          <span>{{user.name}}</span>
        </li>
        <li class="borderB" v-show="user.phone">
          <span>用户手机号</span>
          <span>{{user.phone}}</span>
        </li>
        <li class="borderB" v-show="user.wxOpenId">
          <span>用户微信号</span>
          <span>{{user.wxOpenId}}</span>
        </li>
        <li class="borderB" @click="goBindWChat">
          <span>绑定微信号</span>
          <span>
            <i class="myStyle">{{user.wxOpenId ? '已绑定' : '未绑定'}}</i>
            <i class="iconWanwan iconWright activityNotice"></i>
          </span>
        </li>
        <li class="borderB" @click="goBindPhone">
          <span>绑定手机号</span>
          <span>
            <i class="myStyle">{{user.phone ? '已绑定' : '未绑定'}}</i>
            <i class="iconWanwan iconWright activityNotice"></i>
          </span>
        </li>
      </ul>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      userPhone: ''
    }
  },
  computed: {
    ...mapState(['user']),
    phoneFake () {
      if (this.userPhone.length > 10) {
        return this.userPhone.substring(0, 3) + '*****' + this.userPhone.substring(8)
      } else {
        return '*****'
      }
    },
  },
  created () {
    if (!this.user.userPhone) {
      this.userPhone = this.user.userPhone
    } else {
      this.userPhone = localStorage.getItem('my_phone') + ''
    }
  },
  methods: {
    hiddleAccount () {
      this.$emit('hiddleUserAccount')
    },
    goBindWChat () {
      this.$router.push({
        name: 'bindWChat'
      })
    },
    goBindPhone () {
      this.$router.push({
        name: 'bindPhone'
      })
    }
  }
}
</script>

<style lang="less" scoped>

.accountWrap{
  ul{
    li{
      height:13vw;
      line-height:13vw;
      display:flex;
      justify-content: space-between;
      font-size:4vw;
      padding:0 4vw;
      box-sizing: border-box;
      span:nth-child(1) {
        color:#333;
      }
      span:nth-child(2) {
        color:#999;
        .myStyle {
          font-style: normal;
        }
      }
    }
  }
}

</style>
