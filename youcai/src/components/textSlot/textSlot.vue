<template>
  <transition name='toleft'>
    <div :class="title?'textSlotWrap hasTitle':'textSlotWrap'"
         v-if='show'>
      <h2>
        <span @click='textSlotHide'
              class="iconWleftBack iconWanwan"></span>
        {{title}}
      </h2>
      <slot></slot>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  watch: {
    title (newV) {
      return newV
    }
  },
  methods: {
    textSlotHide () {
      this.$emit('textSlotHide')
    }
  }
}
</script>
<style lang='less'>
.textSlotWrap{
  &.hasTitle{
    padding-top: 13.33vw;
    box-sizing:border-box;
  }
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y:scroll;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC","Helvetica Neue",STHeiti,"Microsoft Yahei",Tahoma,Simsun,sans-serif;
  padding: 3vw;
  color:#444;
  background: #fff;
  z-index: 100000;
  &.toleft-enter-active,&.toleft-leave-active{
    transform: translate3d(0,0,0);
    transition: all .35s ease-in-out;
  }
  &.toleft-enter,&.toleft-leave-to{
    transition: all .35s ease-in-out;
    transform: translate3d(100%,0,0);
  }
  &::-webkit-scrollbar{
    display:none;
  }
  h2{
    position:fixed;
    width: 100vw;
    height:13.33vw;
    line-height:13.33vw;
    text-align:center;
    top: 0;
    left:0;
    background:#fff;
    font-size: 4.5vw;
    font-weight: 500;
    box-shadow: 0 1px 0 #efefef;
    span{
      position: absolute;
      left: 5vw;
      color: #444;
    }
  }
  h4{
      margin: 3vw 0 1vw;
      text-align: center;
      font-size:4.5vw;
      font-weight: 500;
  }
  h5{
    padding: 2vw 0 1vw;
    font-size: 4.5vw;
    font-weight: 500;
  }
  p{
    font-size: 3.3vw;
    // text-indent: 2em;
  }
}
</style>
