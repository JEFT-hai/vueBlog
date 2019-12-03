<template>
  <li class="noFoundWrapLi">
    <span class="clearFollow"
          @touchend="clearTheFollow(eachFollow)">
      <i class="iconWanwan iconWquxiao activityNotice"></i>
    </span>
    <div class="userAvator"
         @click="goHome">
      <!-- <router-link :to="{ name: 'discoverUser', params: { Name: eachFollow.attentionUserId }}"> -->
      <img :class="{defaultStyle: !eachFollow.avatar}"
           :src="userReallyAvator"
           alt="">
      <!-- </router-link> -->
      <div class="right"
           v-if="eachFollow.autheType === 1">
        <i class="one">v</i>
      </div>
    </div>
    <div class="userDetail">
      <span :class="['userName',{special: eachFollow.nickName.length > 7}]">{{eachFollow.nickName}}</span>
      <span class="userInterest">你可能感兴趣的人</span>
      <span class="userDes">
        粉丝:&nbsp;{{eachFollow.fansCount}}
      </span>
    </div>
    <div class="followHer">
      <div :class="{'nofollowIt':!isFollowing,'followIt':isFollowing}">
        <BtnFollow :item="eachFollow"></BtnFollow>
      </div>
    </div>
  </li>
</template>

<script>
import BtnFollow from '@/components/Btn/BtnFollow'
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      isFollow: false, // 表示默认用户是否关注
      defaultAvatar: 'http://webapp.szwanwan.com/img/default/defaultavatar.png',
      recommendFollowClass: false
    }
  },
  props: {
    eachFollow: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState(['follows', 'disFollows','user']),
    isFollowing () {
      let isFollow = this.follows && this.follows.length >= 1 && this.follows.indexOf(this.eachFollow.userId) !== -1
      let isDisFollow = this.disFollows && this.disFollows.length >= 1 && this.disFollows.indexOf(this.eachFollow.userId) !== -1
      if (isFollow) {
        return true
      } else if (isDisFollow) {
        return false
      } else {
        return this.eachFollow.isAttention
      }
    },
    userReallyAvator () {
      if (this.eachFollow.avatar === null || this.eachFollow.avatar === '') {
        return 'http://webapp.szwanwan.com/img/default/defaultavatar.png'
      } else {
        return this.eachFollow.avatar
      }
    }
  },
  components: {
    BtnFollow
  },
  methods: {
    ...mapMutations(['updateNeedBack']),
    goHome () {
      if (this.eachFollow.userId === this.user.userId) { // 去到我的主页
        this.updateNeedBack(true)
        this.$router.push({ name: 'my' })
      } else { // 去到别人的主页
        this.$router.push({ name: 'discoverUser', params: { id: this.eachFollow.userId } })
      }
    },
    clearTheFollow (item) {
      this.$emit('userClearCommend', item)
    },
    goFollow () {
      this.isFollow = !this.isFollow
      this.$emit('checkLogin')
    }
  }
}
</script>

<style lang="less" scoped>
.noFoundWrapLi{
  vertical-align: top;
  display:inline-block;
  width:34.67vw;
  height:52.4vw;
  background-color:rgb(255, 255, 255);
  border-radius: 3vw;
  padding-top:3vw;
  margin-right:1.4vw;
  position:relative;
  box-sizing: border-box;
  .clearFollow{
    position:absolute;
    right:3vw;
    .activityNotice{
      color:#cccccc;
      font-size:3vw;
    }
  }
  .userAvator{
    width:19.2vw;
    height:19.2vw;
    border-radius: 50%;
    margin:auto;
    border:1px solid rgb(243,243,243);
    // overflow:hidden;
    position:relative;
    img{
       position:absolute;
       top:0;
       left:0;
       right:0;
       bottom:0;
       margin:auto;
       width:100%;
       height:100%;
       border-radius: 50%;
       overflow: hidden;
    }
    .defaultStyle{
       width:15vw;
       height:15vw;
       overflow: hidden;
    }
    .right{
                  position:absolute;
                  bottom:0vw;
                  right:-0.5vw;
                  z-index:12;
                  background:white;
                  box-shadow: 0 0 1px #eeee;
                  width: 6vw;
                  height:6vw;
                  border-radius: 50%;
                  .one{
                    position:absolute;
                    top:0;
                    left:0;
                    right:0;
                    bottom:0;
                    margin:auto;
                    // display:flex;
                    // justify-content: center;
                    // align-items: center;
                    width:5.18vw;
                    height:5.18vw;
                    border-radius: 50%;
                    background: linear-gradient(to right bottom,#e37782, #f56b80,#ff5363,#ff405b, #fc3f58);
                    color:white;
                    line-height: 5.18vw;
                    text-align: center;
                    font-size:5vw;
                    font-weight: 500;
                    // padding-right:1vw;
                    box-sizing: border-box;
                    font-family: Times, TimesNR, 'New Century Schoolbook', Georgia, 'New York', serif;
                  }
                }
  }
  .userDetail{
    margin-top:2vw;
    .userName{
      display:block;
      text-align: center;
      color:#363636;
      font-size:3.73vw;
      font-weight: bold;
    }
    .special{
      font-size:3vw;
    }
    .userInterest{
      margin-top:1vw;
      display:block;
      width:28vw;
      margin-left:3vw;
      text-align: center;
      color:#6f6f6f;
      font-size:3.5vw;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
      word-wrap: break-word;
      word-break: break-all;
    }
    .userDes{
      margin-top:1vw;
      display:block;
      width:28vw;
      margin-left:3vw;
      text-align: center;
      color:#6f6f6f;
      font-size:3.5vw;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
      word-wrap: break-word;
      word-break: break-all;
    }
  }
  .followHer{
    width:100%;
    margin-top:2vw;
  .nofollowIt >a {
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
    border:none !important;
    }
  .followIt >a {
    width:28vw !important;
    height:6vw !important;
    line-height:6vw !important;
    background-color:rgb(154, 154, 154) !important;
    border-radius: 2.8vw !important;
    margin:auto !important;
    color:white !important;
    text-align: center !important;
    font-size:3.8vw !important;
    letter-spacing: 0.3vw !important;
    border:none !important;
    }
  }
}
</style>
