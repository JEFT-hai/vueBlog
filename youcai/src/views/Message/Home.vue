<template>
  <div class="messageWrap">
  </div>
</template>
<script>
export default {
  name: 'messageHome',
  created () {
    // window.WanAndroid.showMsgFragment(true)
    // if (this.$route.params.userId) {
    //   window.isInAndroid && window.WanAndroid.startConversation(this.$route.params.type, this.$route.params.userId, this.$route.params.userName)
    // } else {
    window.isInAndroid && window.WanAndroid.showMsgFragment(true)
  },
  beforeRouteLeave (to, from, next) {
    window.isInAndroid && window.WanAndroid.showMsgFragment(false)
    next()
  }
}
</script>

