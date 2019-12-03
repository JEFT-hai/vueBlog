<template>
  <div class="VoteListPage">
    <div v-if='inVoteList'>
      <span class="voteTitle">{{title}}</span>
      <span class="shareBtn"
            @click="share()">
        <i class="iconWanwan iconWweixinfenxiang activityNotice"></i>
      </span>
      <div class="voteBottom">
        <div :class="['bottomOne']"
             @click="handleIndex(0)"
             :style="curIndex === 0  ? myTheme : ''">
          <span class="one">
            <i class="iconWanwan iconWziyuan1 activityNotice"></i>
          </span>
          <span class="two">首页</span>
        </div>
        <div :class="['bottomOne']"
             @click="handleIndex(1)"
             :style="curIndex === 1  ? myTheme : ''">
          <span class="one">
            <i class="iconWanwan iconWpaiming activityNotice"></i>
          </span>
          <span class="two">投票排名</span>
        </div>
        <div :class="['bottomOne']"
             @click="handleIndex(2)"
             :style="curIndex === 2  ? myTheme : ''">
          <span class="one">
            <i class="iconWanwan iconWxiangqing activityNotice"></i>
          </span>
          <span class="two">活动详情</span>
        </div>
      </div>
    </div>
    <div class="voteMain">
      <keep-alive :exclude='excludeRoute'>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
export default {
  data () {
    return {
      excludeRoute: 'voteHVideoDetail,videoVote',
      voteId: this.$route.params.id, // 表示当前的投票活动
      curIndex: 0,
      myDay: '',
      myH: '',
      myM: '',
      selfData: '',
      theme: 5, // 表示没有命中
      myTheme: '',
      voteActivity: {},
      isPath: null,
      title: ''
    }
  },
  computed: {
    ...mapState(['isShowVoteStatePage']),
    inVoteList () {
      let arr = this.excludeRoute.split(',')
      return arr.indexOf(this.$route.name) === -1
    }
  },
  watch: {
    curIndex (newV) {
      if (newV === 0 || newV === 2) {
        console.log('我是改变里的值', newV)
        if (this.isShowVoteStatePage) {
          this.updateVotePage(false)
        }
      }
    },
    theme (newV) {
        if (newV === 0) {
          this.myTheme = {
            color: 'rgb(255, 39, 66)'
          }
        } else if (newV === 1) {
          this.myTheme = {
              color: 'rgb(61,141,101)'
          }
        } else {
            this.myTheme = {
              color: this.selfData.color
            }
        }
      }
  },
  created ()  {
    this.getHeadMsg()
    this.$share.close()
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.isPath = from
    })
  },
  methods: {
    ...mapMutations(['updateVotePage']),
    share () {
      let isDelete = false
      let innerObj = {
        name: this.$route.name,
        objectId: this.voteId
      }
      let isDeleteActivity = ''
      if (this.voteActivity.userId === this.$store.state.user.userId) {
        isDeleteActivity = true
      }
      this.$share.open(this.voteActivity, isDelete, 'vote', this.$router.currentRoute.fullPath, innerObj, isDeleteActivity, this.isPath)
    },
     handleIndex (index) {
       this.curIndex = index
       if (index === 0) {
         this.$router.replace({
           name: 'voteList',
           params: {postId: this.voteId}
         })
       } else if (index === 1) {
         this.$router.replace({
           name: 'voteState',
           params: {postId: this.voteId}
         })
       } else {
         this.$router.replace({
           name: 'voteDetail',
           params: {postId: this.voteId}
         })
       }
     },
         /**
    * getHeadMsg得到投票活动的头部信息
    */
    getHeadMsg () {
      let me = this
      me.api.get({
        url: `VoteTopic/VoteActivityId?VoteActivityId=${me.voteId}`,
        success: function (res) {
          me.voteActivity = res
          me.title= res.title
          // me.startDate = res.beginTime
          // me.endDate = res.closeTime
          if (res.selfData) {
            me.theme = 3
            me.selfData = JSON.parse(res.selfData)
          } else {
            me.theme = res.fee
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.shareBtn {
  position: fixed;
  z-index: 10000;
  top:0;
  right:0;
  width: 14vw;
  text-align: center;
  font-size: 6vw;
  height:13.3vw;
  line-height: 13.3vw;
  .activityNotice{
    font-size:5vw;
              font-weight: 500;
              background:rgb(59, 187, 7);
              width:8vw;
              height:8vw;
              text-align: center;
              line-height:8vw;
              border-radius: 50%;
              display:inline-block;
              color:white;
  }
}
    .VoteListPage{
        width:100%;
        height:100%;
        .voteTitle{
          position:fixed;
          width:70vw;
          top:0;
          left:0;
          right:0;
          margin:0 auto;
          z-index:1000;
          height:13.34vw;
          line-height:13.34vw;
          text-align: center;
          font-size:4.6vw;
          font-weight: 500;
        }
        .voteBottom{
          width:100%;
          height:13.15vw;
          background:white;
          display:flex;
          justify-content: space-around;
          position:fixed;
          left:0;
          bottom:0;
          z-index:200;
          font-size:0;
          .bottomOne {
              width:20vw;
              height:100%;
              color:#727272;
              .one{
                  display:inline-block;
                  width:100%;
                  text-align: center;
                  height:5vw;
                  .activityNotice{
                    font-size:5vw;
                  }
              }
              .two{
                  display:inline-block;
                  width:100%;
                  text-align: center;
                  height:5vw;
                  font-size:4vw;
              }
              
          }
          .activite{
                color:rgb(255, 39, 66);
           }
        }
    }
</style>
