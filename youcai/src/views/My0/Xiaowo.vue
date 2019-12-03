<template>
  <div class="lookMeWrap">
    <div>
      <NotFound :failTitle="failTitle"></NotFound>
    </div>
  </div>
</template>

<script>
import NotFound from '@/components/requestState/NotFound'
export default {
  data () {
    return {
      defaultAvatar: '../../../assets/images/defaultavatar.png',
      whoLookMe: [], // 谁看过我用户列表
      isLoad: true, // 是否正在加载
      isFail: false, // 是否加载失败
      failTitle: '敬请期待哦!'
    }
  },
  components: {
    NotFound
  },
  methods: {
    hiddleLook (data) {
      this.$emit('hiddleXiao', data)
    }
  }
}
</script>

<style lang="less" scoped>
    .lookMeWrap{
        width:100%;
        height:100%;
    }
</style>

