<template>
  <span :class="['effectTxt', effect]" :data-text='text'>{{ text }}</span>
</template>

<script>
export default {
  props: {
    effect: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: '多录'
    },
    textEffect:{
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="less">
@import url("~@/assets/less/nameColor.less");
</style>
