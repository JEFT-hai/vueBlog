<template>
  <div class="channel__account">
    <transition :name='transition'>
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
export default {
  data () {
    return {
      transition: ''
      // transition: 'slide-left'
    }
  },
  watch: {
    $route(to, from) {
      // if (!to.meta.index || !from.meta.index) {
      //   return
      // }
      // if (to.meta.index > from.meta.index) {
      //   this.transition = 'slide-left'
      // } else {
      //   this.transition = 'slide-right'
      // }
    }
  }
}
</script>
<style lang="less">
.channel__account{
  width: 100%;
  height: 100%;
}
</style>