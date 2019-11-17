<template>
  <div id="app">
    <template v-if='isMain'>
      <a-side :class="['pageAside', {'pageAsideLeft': asideShow}]" :asideShow='asideShow' @toggleAside='toggleAsideShow'></a-side>
      <div :class="['pageContent', {'pageContent-margin': asideShow}]">
        <page-header class="pageHeader" :asideShow='asideShow' @toggleAside='toggleAsideShow'></page-header>
        <router-view></router-view>
      </div>
    </template>
    <router-view v-else></router-view>
  </div>
</template>

<script>
const ASide = resolve => require(['@/components/Aside/Aside'], resolve)
const PageHeader = resolve => require(['@/components/Header/PageHeader'], resolve)
export default {
  name: 'app',
  data () {
    return {
      asideShow: true
    }
  },
  components: {
    ASide,
    PageHeader
  },
  computed:{
    isMain () {
      return !this.$route.meta.noAside
    }
  },
  methods: {
    toggleAsideShow () {
      this.asideShow = !this.asideShow
    }
  }
}
</script>

<style lang='less'>
@import url('~@/assets/css/normalize.css');
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  .pageAside{
    @media screen and (max-width: 768px) {
      display: none;
    }
    transition: transform 0.6s ease;
    transform: translate3d(-100%, 0, 0);
    &.pageAsideLeft{
      transform: translate3d(0, 0, 0);
    }
  }
  .pageContent{
    transition: all 0.6s ease;
    @media screen and (max-width: 1200px) {
      margin-left: 0!important;
    }
    @media screen and (max-width: 768px) {
      .pageHeader{
        display: none;
      }
    }
    &.pageContent-margin{
      margin-left: 380px;
    }
  }
}


</style>
