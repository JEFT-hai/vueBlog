<template>
  <div class="activityList">
    <div class="activityHead">
      <span @click="handleIndex(1)"
            :class='{special: index === 1}'>关注的活动</span>
      <span @click="handleIndex(2)"
            :class='{special: index === 2}'>发布的活动</span>
    </div>
    <div class="mainActivity">
      <FollowActivity :routerType="routerType"
                      :userId="userId"
                      v-if="index === 1"></FollowActivity>
      <CreateActivity :routerType="routerType"
                      :userId="userId"
                      v-if="index === 2"></CreateActivity>
    </div>
  </div>
</template>

<script>
import FollowActivity from '@/views/My0/components/followActivity'
import CreateActivity from '@/views/My0/components/createActivity'
export default {
  data () {
    return {
      index: 1,
      userId: this.$route.params.id,
      routerType: parseInt(this.$route.params.type), // 1表示我的关注页，2表示别人的关注页
    }
  },
  // props: ['routerType'],
  components: {
    FollowActivity,
    CreateActivity
  },
  mounted () {
  },
  methods: {
    handleIndex (index) {
      this.index = index
    }
  }
}
</script>

<style lang="less" scoped>
  .activityList{
    width:100%;
    .activityHead{
        height:10vw;
        display:flex;
        justify-content: space-around;
        align-items: center;
        span{
            text-align: center;
            font-size: 4.25vw;
            color: #999999;
        }
        .special{
          color:#333333;
        }
    }
  }
</style>