<template>
  <div class="userList">
    <div class="userItem borderB"
         v-for="(d, index) in items"
         :key="index">
      <avatar class="searchAvatar"
              :item='d'
              :size='2'></avatar>
      <div class="body"
           @click="gotoItem(d.userId)">
        <div class="xingming">{{d.nickName}}</div>
        <div class="fensi">粉丝数：{{d.fansCount}}</div>
      </div>
      <btn-follow :item='d'></btn-follow>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import btnFollow from '@/components/Btn/BtnFollow'
import avatar from '@/components/Avatar'
export default {
  props: {
    items: {
      type: Array
    }
  },
  computed: {
    ...mapGetters(['userAvatar'])
  },
  components: {
    btnFollow,
    avatar
  },
  methods: {
    gotoItem (Id) {
      this.$router.push({ name: 'discoverUser', params: { id: Id } })
    }
  }
}
</script>
<style lang="less" scoped>
.userList{
  .userItem{
    display: flex;
    padding: 10px 15px;
    align-items: center;
    position:relative;
    .searchAvatar{
      margin-right:2vw;
    }
    .body{
        flex: 1;
        font-size: 2.593vw;
        line-height: 5.370vw;
        color: #898989;

        .xingming {
          font-size: 3.519vw;
          color: #373737;
          font-weight: bold;

          .level {
            line-height: 3.519vw;
            height: 3.519vw;
            padding: 0 0.833vw 0 2.037vw;
            background-color: #dd4726;
            border-radius: 0.556vw;
            color: #ffffff;
            font-size: 1.852vw;
            margin-left: 3.704vw;

            .jinpai {
              background-color: #c1a580;
              border: 0.463vw solid #a68758;
              border-radius: 1.667vw;
              font-family: Arial;
              height: 3.519vw;
              line-height: 3.519vw;
              vertical-align: middle;
              padding: 0 0.833vw;
              position: absolute;
              margin-left: -4.630vw;
              margin-top: 0.463vw;
              color: #7f633b;
            }

            .yinpai {
              background-color: #d9d9d9;
              border: 0.463vw solid #b3b3b3;
              border-radius: 1.667vw;
              font-family: Arial;
              height: 3.519vw;
              line-height: 3.519vw;
              vertical-align: middle;
              padding: 0 0.833vw;
              position: absolute;
              margin-left: -4.630vw;
              margin-top: 0.463vw;
              color: #7c7c7c;
            }
          }

          .color {
            color: #8bd8f6;
          }
      }
    }
  }
}
</style>
