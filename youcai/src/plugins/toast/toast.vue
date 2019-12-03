<template>
  <transition name="fadeIn">
    <div class="toastWrapper" v-if="show">
      {{info}}
    </div>
  </transition>
</template>
<script>
export default {
  name: 'Share',
  props: {
    info: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 添加一个属性 show，来动态控制 这个组件的显示和隐藏, 默认是隐藏的
      show: false
    }
  }
}
</script>
<style lang="less" scoped>
.toastWrapper{
  &.fadeIn-enter-active,&.fadeIn-leave-active{
    transition: all .1s ease-out;
  }
  &.fadeIn-enter,&.fadeIn-leave-to {
    top: 0;
  }
  position: fixed;
  z-index:30000;
  line-height:8vw;
  border-radius: 5px;
  background: rgba(0, 0, 0, .8);
  top: 35%;
  left: 50%;
  padding: 0 5vw;
  transform: translate3d(-50%, 0, 0);
  font-size: var(--mText);
  color: #efefef;
  letter-spacing: 2px;
}
</style>
