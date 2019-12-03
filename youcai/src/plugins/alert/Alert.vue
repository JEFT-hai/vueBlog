<template>
  <transition name="fadeIn">
    <div class="alertPage"
         v-if="show">
      <div class='alertModel'>
        <div class="alertTitle">
          {{info}}
        </div>
        <div class="okBtn"
             @click="show = false">
          确定
        </div>
      </div>
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
.alertPage{
  &.fadeIn-enter-active,&.fadeIn-leave-active{
    transition: opacity .15s ease;
  }
  &.fadeIn-enter,&.fadeIn-leave-to {
    opacity: 0;
  }
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right:0;
  width: 100vw;
  height:100vh;
  background: rgba(0, 0, 0, .7);
  z-index: 100000;
  .alertModel{
    position: absolute;
    top: 50%;
    left:50%;
    transform: translate3d(-50%, -50%, 0);
    border-radius: 1.11vw;
    max-height: 100vh;
    width: 80vw;
    background: #fff;
    text-align: center;
    letter-spacing: 1px;
    .alertTitle{
      line-height: 10vw;
      padding: 2vw 4vw;
      border-bottom: 1px solid #f7f7f7;
    }
    .okBtn {
      height: 12vw;
      line-height: 12vw;
      color: var(--mblue);
    }
  }
}
</style>
