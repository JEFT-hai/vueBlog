<template>
  <transition :name="transition">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </transition>
</template>

<script>
export default {
  // name: 'groupMaster',
  data() {
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
        this.transition = 'slide-left';
      } else {
        this.transition = 'slide-right';
      }
    }
  }
}
</script>
<style lang="less" scoped>
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 500ms;
  position: absolute;
  width: 100%;
  height: 100%;
}

.slide-right-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}

.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}

.slide-left-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}

.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
</style>
