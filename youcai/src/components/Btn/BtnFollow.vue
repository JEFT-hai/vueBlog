<template>
  <a href="javascript:;"
     v-if='user.userId !== userId'
     @click="setFollow"
     :class="{'userFollowReverse': isFollowing, 'userFollow': !isFollowing}">{{followTitle}}</a>
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
    item: {
      type: Object,
      required: true
    },
    isWhoLookMePage: {
      type: Boolean,
      default: false,
    },
    isAttentionId: {
      type: Boolean,
      default: false // 表示是关注页
    },
    isAddFollow: {
      type: Boolean,
      default: false // 表示是新增关注页
    }
  },
  computed: {
    ...mapState(['follows', 'user']),
    isFollowing () {
      return this.follows && this.follows.length >= 1 && this.follows.indexOf(this.userId) !== -1
    },
    userId () {
      if (this.isWhoLookMePage) { // 表示是谁看过我的页面，需要用initiativeUserId
        return this.item.initiativeUserId
      } else if (this.isAttentionId) { // 表示是关注页面
        return this.item.attentionUserId
      } else {
        return this.item.userId
      }
    },
    followTitle () {
      if (this.isAddFollow) {
        return this.isFollowing ? '已关注' : '回粉'
      } else {
        return this.isFollowing ? '已关注' : '关注'
      }
    }
  },
  methods: {
    ...mapMutations({
      upFollow: 'upFollow',
      upDisFollow: 'upDisFollow'
    }),
    setFollow () {
      let me = this
      if (me.isLoading) {
        return
      }
      if (!this.authentication.isLogin()) {
        this.$router.push({
          name: 'login'
        })
        return
      }
      me.isLoading = true
      if (me.isFollowing) {
        me.deleteFollow()
      } else {
        me.goFollow()
      }
    },
    /**
     * goFollow 关注用户
     */
    goFollow () {
      let me = this
      me.api.process({
        url: 'UserAttention',
        data: {
          attetionUserId: me.userId
        },
        success: function () {
          me.upFollow(me.userId)
        },
        error: function (res) {
          me.$toast(res)
        },
        complete: function () {
          me.isLoading = false
        }
      })
    },
    /**
     * 取消关注用户
     */
    deleteFollow () {
      let me = this
      me.api.delete({
        url: `UserAttention?id=${me.userId}`,
        data: {
          attetionUserId: me.userId
        },
        success: function () {
          me.upDisFollow(me.userId)
        },
        error: function (res) {
          me.$toast(res)
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
</style>
