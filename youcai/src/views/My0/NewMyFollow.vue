<template>
  <div class="myFollowWrap">
    <span class="findTitle">{{routerType === 1 ? '我的关注' : '他的关注'}}</span>
    <!--TODO: 下面的表示查找页页面 -->
    <span class="findUser"
          @click="goFindGroup">
      <i class="iconWanwan iconWguanzhu-copy activityNotice"></i>
    </span>
    <div class="contentTitle">
      <div class="titleOne">
        <div class="contentEach"
             :class="{'isColor':changeColor === 1}"
             ref="one">
          <span @click="myFollowUser(1)">用户</span>
        </div>
        <div class="contentEach"
             :class="{'isColor':changeColor === 2}"
             ref="two">
          <span @click="myFollowTopic(2)">话题</span>
        </div>
        <div class="contentEach"
             :class="{'isColor':changeColor === 3}"
             ref="three">
          <span @click="myFollowActivity(3)">活动</span>
        </div>
      </div>
      <div class="contentShift">
        <span class="shift"
              ref="myShift"></span>
      </div>
    </div>
    <div class="allFollow">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
       // 表示用户的id
      routerId:this.$route.params.id,
      routerType: parseInt(this.$route.params.type), // 1表示我的关注页，2表示别人的关注页
      isColor: false,
      isShowUser: '',
      isShowActivity: '',
      isShowTopic: false,
      isShowGroup: false,
      enterName: ''
    }
  },
  computed: {
    // hasMask 用来处理安卓返回键
    ...mapState(['hasMask', 'changeColor'])
  },
  watch: {
    changeColor () {
      this.$nextTick(() => {
        this.setClick(false)
      })
    }
  },
  activated () {
    this.routerId = this.$route.params.id
    this.routerType = parseInt(this.$route.params.type) // 1表示我的关注页，2表示别人的关注页
  },
  mounted () {
    if (this.changeColor === 1) {
      this.$router.replace({
        name: 'follow_user'
      })
    } else if (this.changeColor === 2) {
      this.$router.replace({
        name: 'follow_topic'
      })
    } else {
      this.$router.replace({
        name: 'follow_activity'
      })
    }
    this.initShift()
  },
  methods: {
    ...mapMutations({
      'setMask': 'setMask',
      'setClick': 'setClick',
      'upColor': 'upColor'
    }),
    /**
     * shift导航条的初始位置
     * initShift
     */
    initShift () {
      if (this.changeColor === 1) {
        this.$refs.myShift.style.transform = 'translateX(' + (0) + 'vw)'
      } else if (this.changeColor === 2) {
        this.$refs.myShift.style.transform = 'translateX(' + 19 + 'vw)'
      } else {
        this.$refs.myShift.style.transform = 'translateX(' + 38 + 'vw)'
      }
    },
    myFollowUser (index) {
      this.setClick(true)
      this.isShowUser = true
      this.isShowActivity = false
      this.isShowTopic = false
      this.isShowGroup = false
      this.upColor(index)
      this.$refs.myShift.style.transform = 'translateX(' + (0) + 'vw)'
      this.$router.replace({
        name: 'follow_user'
      })
    },
    myFollowTopic (index) {
      this.setClick(true)
      this.isShowUser = false
      this.isShowActivity = false
      this.isShowTopic = true
      this.isShowGroup = false
      this.upColor(index)
      this.$refs.myShift.style.transform = 'translateX(' + 19.5 + 'vw)'
      this.$router.replace({
        name: 'follow_topic'
      })
    },
    myFollowActivity (index) {
      this.setClick(true)
      this.isShowUser = false
      this.isShowActivity = true
      this.isShowTopic = false
      this.isShowGroup = false
      this.upColor(index)
      this.$refs.myShift.style.transform = 'translateX(' + 38 + 'vw)'
      this.$router.replace({
        name: 'follow_activity'
      })
    },
    /**
     * goFindGroup查找群组
     */
    goFindGroup () {
      this.$router.push({name: 'user_Group'})
    }
  }
}
</script>

<style lang="less" scoped>
.myFollowWrap{
    width:100%;
    height:calc(100vh - 12vw);
    overflow: hidden;
    .findTitle{
      width:85vw;
      display:inline-block;
      height:14vw;
      line-height:14vw;
      padding-left:30vw;
      box-sizing: border-box;
      position:fixed;
      top:0vw;
      left:14vw;
      z-index:2000;
      color:#666;
    }
    .findUser{
         display:inline-block;
         height:14vw;
         line-height:14vw;
         position:fixed;
         top:0vw;
         right:4vw;
         z-index:2002;
         .activityNotice{
           color: #333333;
           font-size: 6vw;
         }
       }
    .contentTitle{
      height:13vw;
      width:58vw;
      margin:auto;
      padding-top:2vw;
      display: flex;
      flex-flow: row wrap;
      .titleOne{
        width:100%;
        height:7vw;
        display: flex;
        justify-content: space-around;
        .contentEach{
          width:13.89vw;
          text-align: center;
          font-size:4.25vw;
          color:#999999;
          position:relative;
        }
        .isColor{
          color:#333333;
        }
      }
      .contentShift{
        width:100%;
        height:4vw;
        position:relative;
        .shift{
          display:inline-block;
          width:8vw;
          height:2px;
          position:absolute;
          left:6vw;
          top:0.2vw;
          transition: all 0.35s;
          background:rgb(247, 42, 76);
        }
      }
    }
    .allFollow{
      width:100%;
      height: calc(100vh - 101px);
      overflow: scroll;
    }
}
</style>
