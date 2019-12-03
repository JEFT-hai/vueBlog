<template>
  <div class="page hashPage user_login">
    <div class="page-content">
      <div class="user_login_header">
        <div><img src="@/assets/images/icon_success.png" /></div>
        <div>登录成功</div>
      </div>
      <div class="user_login_formcontainer">
        <div class="buttons">
          <div class="button_container">
            <router-link class="button button-fill button-primary color-primary"
                         :to="{name: 'index'}">返回首页</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted () {
    setTimeout(() => {
      this.$router.replace({ name: 'index' })
    }, 1000)
  },
}
</script>
