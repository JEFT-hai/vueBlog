<template>
  <router-link :to="{ name: 'discoverUser', params: { Name: item.UserId }}">
    <img class="weui-media-box__thumb userPhoto" :src="avatarPath" alt v-if="item != null" />
  </router-link>
</template>

<script>
export default {
  data () {
    return {
      defaultUserAvatar: '/assets/images/avatar.jpg'
    }
  },
  props: {
    item: {
      type: Object,
      required: false
    }
  },
  computed: {
    avatarPath () {
      let avatar = this.item.UserAvatar
      // return avatar ? (this.config.imageOrigin + avatar) : this.defaultUserAvatar
      return (avatar && avatar.length >= 1 && avatar.indexOf('/') === 0) ? (this.config.imageOrigin + avatar) : this.defaultUserAvatar
    }
  }
}
</script>

<style>
.userPhoto{
  width:10vw;
  height:10vw;
  border-radius: 50%;
}
</style>
