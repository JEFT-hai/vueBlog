<template>
  <a href="javascrip:void(0);" @click="setFollow" :class="{'userFollowReverse': isFollowing, 'userFollow': !isFollowing, 'followOne':recommendFollowClass}">{{isFollowing ? '已关注' : '+关注'}}</a>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      isLoading: false
    }
  },
  props: {
    UserId: {
      type: Number,
      required: true
    },
    recommendFollowClass: {
      type: Boolean
    }
  },
  computed: {
    ...mapState(['counts']),
    isFollowing () {
      let r = this.counts && this.counts.follows && this.counts.follows.length >= 1 && this.counts.follows.indexOf(this.UserId) !== -1
      return r
    }
  },
  methods: {
    ...mapMutations({
      'updateCounts': 'updateCounts'
    }),
    setFollow () {
      let me = this
      if (me.isLoading) {
        return
      }
      me.isLoading = true
      let formData = new FormData()
      formData.append('FollowingId', me.UserId)
      me.api.process({
        file: 'Following',
        method: 'SetFollowing',
        data: formData,
        success: function (res) {
          me.updateCounts(res)
        },
        error: function (res) {
          // me.$msg.showError(res.msg)
        },
        complete: function () {
          me.isLoading = false
        }
      })
    }
  }
}
</script>

<style lang="less" scope>
  .userFollowReverse {
    color: grey;
    border:1px solid rgb(193, 193, 193);
    border-radius:8vw;
    width:15vw;
    height:6vw;
    text-align: center;
    line-height:6vw;
    font-size:3vw;
  }
  .userFollow {
    color: red;
    border:1px solid red;
    border-radius:8vw;
    width:15vw;
    height:6vw;
    text-align: center;
    line-height:6vw;
    font-size:3vw;
  }
  .followOne{
    width:28vw !important;
    height:6vw !important;
    line-height:6vw !important;
    background-color:#f72a4c !important;
    border-radius: 2.8vw !important;
    margin:auto !important;
    color:white !important;
    text-align: center !important;
    font-size:3.8vw !important;
    letter-spacing: 0.3vw !important;
  }
</style>
