<template>
  <div class="transparent">
  </div>
</template>
<script>
export default {
  beforeRouteEnter (to, from, next) {
    if (to.params.userId) {
      window.isInAndroid && window.WanAndroid.startConversation(to.params.type, to.params.userId, to.params.userName)
    }
    // window.goLink('discoverUser', '0b5c8cd3-52f4-4c92-9e75-0589b0473899')
    next()
  }
}
</script>
<style lang="less">
  .transparent{
    height: 100%;
    width: 100%;
    background: transparent;
  }
</style>