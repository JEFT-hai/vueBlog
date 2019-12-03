<template>
  <div class="channel__activity">
    <transition :name='transition'>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'activityMaster',
  data () {
    return {
      transition: 'slide-left'
    }
  },
  watch: {
    $route(to, from) {
      if (!to.meta.index || !from.meta.index) {
        return
      }
      if (to.meta.index > from.meta.index) {
        this.transition = 'slide-left'
      } else {
        this.transition = 'slide-right'
      }
    }
  }
}
</script>
<style lang="less">
.channel__activity{
  width: 100%;
  height: 100%;
}
</style>
