<template>
  <div class="fansWrap">
    <!-- 下面是找人找群按钮 -->
    <span class="findUser"
          @click="goFindGroup">
      <i class="iconWanwan iconWguanzhu-copy activityNotice"></i>
    </span>
    <div class="fansHead">
      {{routerType === 1 ? '我的' : '他的'}}{{title}}
    </div>
    <div class="navBar">
      <div class="contentTitle">
        <div class="titleOne">
          <div class="contentEach"
               :class="{'isColor':changeColor === 1}"
               ref="one">
            <span @click="myFans(1)">粉丝</span>
          </div>
          <div class="contentEach"
               :class="{'isColor':changeColor === 2}"
               ref="two">
            <span @click="myPraised(2)">获赞</span>
          </div>
          <div class="contentEach"
               :class="{'isColor':changeColor === 3}"
               ref="three">
            <span class="myGroup"
                  @click="myGroup(3)">群组</span>
          </div>
        </div>
        <div class="contentShift">
          <span class="shift"
                ref="myShift"></span>
        </div>
      </div>
    </div>
    <div class="followWrap">
      <!-- <div class="fansList">
        <FollowFans v-if="changeColor === 1"
                    :routerType="routerType"
                    :routerId="routerId"></FollowFans>
      </div>
      <div class="likeList">
        <LikeMeList v-if="changeColor === 2"
                    :routerType="routerType"
                    :routerId="routerId"></LikeMeList>
      </div>
      <div class="groupList">
        <FollowGroup v-if="changeColor === 3"></FollowGroup>
      </div> -->
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      routerType: parseInt(this.$route.params.routerType), // 1表示我的主页，2表示别人的主页
      routerId: this.$route.params.id, // 表示传过来的userId
      changeColor: this.$store.state.isFansChange
    }
  },
  watch: {
    changeColor (newV) {
      this.$route.params.type = parseInt(newV)
      console.log('changeColor是', newV, this.$route.params)
      // this.$router.push({
      //     params: this.$route.params
      // })
      
    }
  },
  computed: {
    ...mapState(['isFansChange']),
    title () {
      return this.changeColor === 1 ? '粉丝' : this.changeColor === 2 ? '获赞' : '群组'
    }
  },
  mounted () {
    this.initShift()
  },
  methods: {
    /**
     * goFindGroup查找群组
     */
    goFindGroup () {
      this.$router.push({name: 'user_Group'})
    },
    /**
     * initShift 初始化shift的位置
     */
    initShift () {
      let index = this.changeColor
      if (index === 1) {
        this.$refs.myShift.style.transform = 'translateX(' + (-19.5) + 'vw)'
        this.$router.replace({
        name: 'follow_fans'
      })
      } else if (index === 2) {
        this.$refs.myShift.style.transform = 'translateX(' + 0 + 'vw)'
        this.$router.replace({
        name: 'like_me'
      })
      } else {
        this.$refs.myShift.style.transform = 'translateX(' + (19.5) + 'vw)'
        this.$router.replace({
        name: 'follow_group'
      })
      }
    },
    myFans (index) {
      this.changeColor = index
      this.$refs.myShift.style.transform = 'translateX(' + (-19.5) + 'vw)'
      this.$router.replace({
        name: 'follow_fans'
      })
    },
    myPraised (index) {
      this.changeColor = index
      this.$refs.myShift.style.transform = 'translateX(' + 0 + 'vw)'
      this.$router.replace({
        name: 'like_me'
      })
    },
    myGroup (index) {
      this.changeColor = index
      this.$refs.myShift.style.transform = 'translateX(' + 19.5 + 'vw)'
      this.$router.replace({
        name: 'follow_group'
      })
    }
  }
}
</script>

<style lang="less" scoped>
   .fansWrap{
       width:100%;
       height:100%;
       height:calc(100vh - 12vw);
       overflow: hidden;
       .findUser{
         display:inline-block;
         height:12vw;
         line-height:13.5vw;
         position:fixed;
         top:0vw;
         right:4vw;
         z-index:3002;
         .activityNotice{
           color: #333333;
           font-size: 6vw;
         }
       }
       .fansHead{
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
       .navBar{
           width:100%;
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
                  .myGroup{
                    position: relative;
                    i{
                      font-style: normal;
                    }
                    i:nth-child(2){
                      position:absolute;
                      top:-3.5vw;
                      right:-3.3vw;
                      font-size:4vw;
                    }
                  }
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
                  background-color:rgb(255, 39, 66);
                  position:absolute;
                  left:25vw;
                  top:0.2vw;
                  transition: all 0.35s;
                }
              }
            }
       }
       .followWrap{
         height:calc(100vh - 25vw);
       }
   }
</style>
