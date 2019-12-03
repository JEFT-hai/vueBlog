<template>
  <keep-alive :include="/Home$/">
    <router-view></router-view>
  </keep-alive>
</template>

<script>
export default {
  name: 'discoverMaster'
}
</script>
