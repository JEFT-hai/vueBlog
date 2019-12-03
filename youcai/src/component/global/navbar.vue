<template>
  <div class="navbar-wrap" v-if="showNav">
    <div class="navbar-inner borderB">
      <div class="navbar-icon navbar-icon--left navbar-icon--back iconWanwan iconWfanhui" @click='go.back()'></div>
      <div class="navbar-head--inner navbar-input--wrap">
        {{tit}}
      </div>
      <div class="navbar-icon navbar-icon--right navbar-btn--wrap"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('gl', {
      navTit: 'navTit'
    }),
    showNav () {
      return this.$route.meta.nav
    },
    tit () {
      return this.navTit ? this.navTit : ((this.$route.meta.nav && this.$route.meta.nav.tit) || 'NAV')
    }
  }
}
</script>

<style lang='less'>
.navbar-wrap{
  height: 13vw;
  line-height: 13vw;
  background-color: #fff;
  .navbar-inner{
    position: fixed;
    z-index: 100001;
    top: 0;
    left: 0;
    width: 100vw;
    height: 13vw;
    display: flex;
    align-items: center;
    &.borderB{
      &::after{
        background-color: #ccc!important;
      }
    }
    .navbar-icon{
      padding: 0 4vw;
      width: 12vw;
      &.navbar-icon--left{
        text-align: left;
      }
      &.navbar-icon--right{
        text-align: right;
      }
    }
    .navbar-head--inner{
      flex: 1;
      font-size: 5vw;
      letter-spacing: 1px;
      text-align: center;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}
</style>
