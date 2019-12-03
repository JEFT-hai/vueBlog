<template>
  <div class="page hashPage user_login">
    <div class="page-content">
      <div class="user_login_header">
        <div><img src="@/assets/images/icon_success.png" /></div>
        <div>退出登录成功</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  mounted () {
    let me = this
    me.userLogoutAsync()
    setTimeout(function () {
      me.$router.replace({ name: 'index' })
    }, 1000)
  },
  methods: {
    ...mapActions({
      'userLogoutAsync': 'userLogoutAsync'
    })
  }
}
</script>
