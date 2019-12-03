<template>
  <div class="navbarPage">
    <span class="navbarBack"
          v-show="goBackVisibility"><i class="iconWfanhui iconWanwan activityNotice"></i></span>
    <span class="title"
          @click="goBack">
      <span class="titleInner">{{title}}</span></span>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  created () {
    window.goBack = this.goBack
  },
  computed: {
    ...mapState({
      navTit: 'navTit'
    }),
    routeClass () {
      let path = ('' + this.$route.path).replace(/^\//g, '')
      let pathName = path.indexOf('/') === -1 ? path : path.split('/')[0]
      return 'head' + pathName
    },
    goBackVisibility () {
      return (this.$route.path !== ('/message/') && this.$route.path !== ('/discover/'))
    },
    title () {
      return this.$route.meta === null || typeof (this.$route.meta.title) !== 'string' ? '' : this.$route.meta.title || this.navTit
    }
  },
  watch: {
    $route: {
      immediate: true,
      deep: true,
      handler (newV) {
        this.newTitle = newV.meta.title
      }
    }
  },
  methods: {
    goBack () {
      if (window.history.length <= 1) {
        this.$router.push({path:'/'})
        return false
      } else {
        this.$router.go(-1)
      }
      // if (['my_set', 'postPost', 'postActivity', 'userChatSettings', 'groupChatSettings'].indexOf(this.$route.name) >= 0) {
      //   this.$router.go(-1)
      //   return
      // }
      // if (window.history.length >= 1) {
      //   this.$router.go(-1)
      // }
      // let matched = this.$route.matched[this.$route.matched.length - 1]
      // let link = typeof (matched.parent) === 'undefined' ? '/' : (matched.parent.path.replace(/\/$/, '') + '/')
      // if (matched.path.endsWith('/') && matched.path === matched.parent.path + '/' && typeof (matched.parent.parent) !== 'undefined') {
      //   link = matched.parent.parent.path
      // }
      // this.$router.replace(link)
    },
    getParentLink () {
      let path = this.$route.path.replace(/\/$/, '') // "/my/about/changes/"
      if (path.length <= 1 || path.indexOf('/') === path.lastIndexOf('/')) {
        return '/'
      } else {
        return path.substring(0, path.lastIndexOf('/') + 1)
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .navbarPage{
    height:13.34vw;
    width:100%;
    background:white;
    position:fixed;
    top:0;
    left:0;
    z-index:99;
    .navbarBack{
      height:13.34vw;
      line-height:13.6vw;
      position:relative;
      left:7.5vw;
      top:0;
      z-index:99;
      .activityNotice{
        font-size:4.5vw;
        font-weight: bold;
      }
    }
    .title{
      position:fixed;
      top:0;
      z-index: 99;
      width:100%;
      height:13.34vw;
      display:flex;
      align-items: center;
      justify-content: center;
      font-size:4.63vw;
      .titleInner{
        display: inline-block;
        max-width: 66vw;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
</style>
