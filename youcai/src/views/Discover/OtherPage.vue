<template>
  <div class="otherPage">
    <iframe class="iframe"
            :src="iUrl"
            frameborder="0"></iframe>
  </div>
</template>
<script>
export default {
  data(){
    return{
      iUrl: this.$route.params.id,
      tit: this.$route.params.tit
    }
  },
  watch: {
    tit: {
      immediate: true,
      handler:((newV)=>{
        return newV
      })
    }
  },
  mounted(){
    this.$store.commit('setNavTit', this.tit)
  }
}
</script>
<style lang="less" scoped>
  .otherPage{
    width: 100%;
    height: 100%;
    .iframe{
      width: 100%;
      height: 100%;
      overflow-y: scroll;
    }
  }
</style>

