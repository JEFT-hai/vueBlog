<template>
  <el-row class="accountPage" type="flex" justify="center">
    <el-col :xs='20' :sm='16' :md='12' :lg='10'>
        <register></register>
    </el-col>
  </el-row>
</template>

<script>
const register = resolve => require(['./components/Register.vue'], resolve)
export default {
    components:{
        register
    }
}
</script>
  
<style lang='less'>
  #app{
    margin-top: 0;
  }
  .accountPage{
    margin: 0;
    padding-top: 14vh;
    height: 100vh;
    background-color: #2d2e39;
    overflow: hidden;
    // display: inline-block;
  }
</style>