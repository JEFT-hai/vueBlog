<template>
  <div id="app">
    <a-side></a-side>
  </div>
</template>

<script>
const ASide = resolve => require(['@/components/Aside/Aside'], resolve)
export default {
  name: 'app',
  components: {
    ASide
  }
}
</script>

<style>
@import url('~@/assets/css/normalize.css');
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
