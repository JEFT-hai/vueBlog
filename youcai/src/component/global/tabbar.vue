<template>
  <div class="tabbar-wrap">
    <router-link class="tabbar-item" v-for='item in routerArray' :key='item.name' :to='{name: item.name}'>
      {{item.text}}
    </router-link>
  </div>
</template>

<script>
export default {
  data () {
    return {
      routerArray: [{
        text: '首页',
        name: 'index'
      },{
        text: '商城',
        name: 'shop'
      },{
        text: '找人',
        name: 'seek'
      },{
        text: '我的',
        name: 'my'
      }]
    }
  }
}
</script>

<style lang='less'>
  .tabbar-wrap{
    position: fixed;
    z-index: 100000;
    left: 0;
    bottom: 0;
    width: 100vw;
    height: 12vw;
    display: flex;
    align-items: center;
    box-shadow: 0 0 1px #ccc;
    background-color: #fff;
    .tabbar-item{
      flex: 1;
      text-align: center;
      color: #a2a2a2;
      &.router-link-exact-active{
        color: #333;
        font-weight: bold;
      }
    }
  }
</style>
