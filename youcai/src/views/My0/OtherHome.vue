<template>
  <div class="otherHomePage"
       ref='groupInfoPage'>
    <div class="otherBtn">
      <div @click="messageUser">私信</div>
      <div :class="{'nofollowIt':!isFollowing,'followIt':isFollowing}">
        <btnFollow :item="otherUserMsg"></btnFollow>
      </div>
    </div>
    <span class="otherHomeBack"><i class="iconWfanhui iconWanwan activityNotice"
         @click="goBack"></i></span>
    <span class="shareBtn">
      <i class="iconWanwan iconWweixinfenxiang activityNotice"
         @click="share()"></i>
    </span>
    <div class="otherFixed"
         v-show="wrapIsBottom">
      <!-- <span>返回</span> -->
      <div class="otherFixedTwo">
        <span class="name">{{otherUserMsg.nickName}}</span>
        <span class="code">多录号:&nbsp;{{otherUserMsg.name}}</span>
      </div>
    </div>
    <scroll ref='scroll'
            :scrollbar="scrollbarObj"
            :pullDownRefresh="false"
            :pullUpLoad="false"
            :bounce='false'
            :click='true'
            :listenScroll='true'
            :listenScrollEnd='true'
            @scroll='wrapScroll'
            @scroll-end='scrollEndWrap'>
      <div class="groupInfoPageContent"
           ref='groupInfoPageContent'>
        <div :class="['otherHead', {noHeightBig:!userImageList.length}]">
          <div :class="['myhomeImg',{noHeight:!userImageList.length}]">
            <swiper :items="userImageList"
                    :elId="user.userId.slice(0, 5)"
                    :type='3'
                    :autoplay=false />
          </div>
        </div>
        <div class="otherMiddle">
          <div class="myMainUp"
               ref='canvas'>
            <div class="userAvator">
              <avatar class=""
                      :item='otherUserMsg'
                      :canClick='false'
                      :size='20'></avatar>
            </div>
            <div class="userMsg">
              <div class="user">
                <span class="name">{{otherUserMsg.nickName}}</span>
                <span class="code">多录号:&nbsp;{{otherUserMsg.name}}</span>
              </div>
              <div class="one">
                <div class="each"
                     @click="goFollow">
                  <span class="eachCount">{{format.formatNum(otherUserMsg.attentionCount)}}</span>
                  <span class="eachFont">关注</span>
                </div>
                <div class="each"
                     @click="goFans(1)">
                  <span class="eachCount">{{format.formatNum(otherUserMsg.fansCount)}}</span>
                  <span class="eachFont">粉丝</span>
                </div>
                <div class="each"
                     @click="goFans(2)">
                  <span class="eachCount">{{format.formatNum(otherUserMsg.likeCount)}}</span>
                  <span class="eachFont">获赞</span>
                </div>
                <div class="each"
                     @click="goFans(3)">
                  <span class="eachCount">{{format.formatNum(otherUserMsg.groupCount)}}</span>
                  <span class="eachFont">群组</span>
                </div>
              </div>
            </div>
          </div>
          <div class="myMainDown">
            <div class="userState">
              <span class="address">{{otherUserMsg.areaProvince}}</span>
              <div class="gender">
                <span :class="{pinkGenderLabel:otherUserMsg.gender === 2,blueGenderLabel:otherUserMsg.gender !== 2}">
                  <i class="iconWanwan iconWnan-copy activityNan"
                     v-if="otherUserMsg.gender === 0 || otherUserMsg.gender === 1 "></i>
                  <i class="iconWanwan iconWnv3-copy activityNv"
                     v-else></i>
                  <!-- <i class="age">{{userAge}}</i> -->
                </span>
                <!-- <span class="yellowGenderLabel">Lv.39</span> -->
              </div>
              <!-- <div class="Member">
                        <span>会员</span>
                        <i class="iconWanwan iconWright activityNotice"></i>
                      </div> -->
              <div :class="['userLike',{userLikeConfirm:userLike}]"
                   @click="handleLike">
                <span>
                  <i :class="['iconWanwan', 'activityNotice',{iconWxin1:!userLike},{iconWredXin:userLike}]"></i>
                </span>
                <span :class="['normalFont',{whiteFont: userLike}]">{{userLike ? '已赞' : '点赞'}}</span>
                <!-- <span :class="{myScale:userLike}"></span> -->
                <span :class="['myXin',{myOne:userLike}, {otherOne: userLike === false}]"><i class="iconWanwan iconWxinaixin-copy xinOne"></i></span>
                <span :class="['myXin',{myTwo:userLike}, {otherTwo: userLike === false}]"><i class="iconWanwan iconWxinaixin-copy xinTwo"></i></span>
                <span :class="['myXin', {myThree:userLike},{otherThree: userLike === false}]"><i class="iconWanwan iconWxinaixin-copy xinThree"></i></span>
              </div>
            </div>
            <div class="authen"
                 v-if="otherUserMsg.userAuthen">
              <span class="autenStyle">V认证:</span><span class="detail">{{otherUserMsg.userAuthen && otherUserMsg.userAuthen.releaseContent}}</span>
            </div>
            <div class="userDes">{{otherUserMsg.personStatement === null ? '这家伙很懒什么都没写' :otherUserMsg.personStatement}}</div>
          </div>
        </div>
        <div class="groupSubContent"
             ref='groupSubContent'>
          <tabMove class="tabList borderB"
                   @scroll='tabMoveScroll'
                   ref='tabMove'
                   :tabData="tabData"
                   @touchstart.native="tabTouchStart($event)"></tabMove>
          <div class="pagesTabContent"
               ref='touchContent'
               @touchstart="touchstart($event)">
            <pageItemTab v-if="userId"
                         :userId='userId'
                         :direction='direction'
                         :subIsNotTop='subIsNotTop'
                         :subScrollY='subScrollY'
                         @pullingDown="onPullingDown"
                         @pullingUp="onPullingUp"
                         @scroll='subScroll'
                         @scroll-end='subScrollEnd'></pageItemTab>
            <OtherDetailMsg v-if="userId"
                            :userId='userId'
                            :user='otherUserMsg'
                            :direction='direction'
                            :subIsNotTop='subIsNotTop'
                            :subScrollY='subScrollY'
                            @pullingDown="onPullingDown"
                            @pullingUp="onPullingUp"
                            @scroll='subScroll'
                            @scroll-end='subScrollEnd'></OtherDetailMsg>
            <activityPageItemTab v-if="userId"
                                 :userId='userId'
                                 :direction='direction'
                                 :subIsNotTop='subIsNotTop'
                                 :subScrollY='subScrollY'
                                 @pullingDown="onPullingDown"
                                 @pullingUp="onPullingUp"
                                 @scroll='subScroll'
                                 @scroll-end='subScrollEnd'></activityPageItemTab>
          </div>
        </div>
      </div>
    </scroll>
  </div>
</template>
<script>
const DIRECTION_V = 'vertical'
import avatar from '@/components/Avatar'
import Swiper from '@/components/Swiper/swiper'
import tabMove from '@/components/tabMove'
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
import scrollPagesMixin from '@/components/Search/scrollPagesMixin'
import pageItemTab from './components/pageItemTab'
import activityPageItemTab from './components/activityPageItemTab'
import {mapState, mapMutations} from 'vuex'
import OtherDetailMsg from '@/views/My0/components/otherDetailMsg'
import btnFollow from '@/components/Btn/BtnFollow'
export default {
  mixins: [scrollMixin, scrollPagesMixin],
  components: {
    avatar,
    Swiper,
    tabMove,
    scroll,
    pageItemTab,
    activityPageItemTab,
    OtherDetailMsg,
    btnFollow
  },
  data () {
    return {
      isClickLike: false, // 表示是否点击点赞按钮
      currentIndex: 0,
      isShowBack: true,
      isNeedAnimation: false,
      routerType: 2, // 2表示对方的主页
      isLoading: true,
      userImageList: [], // 表示用户照片墙
      userId:this.$route.params.id, // 用户的id
      otherUserMsg: {}, // 别人主页信息
      userInitBirth: '', // 用户的初始生日
      userLike: '', // 是否对当前用户喜欢
      isFollow: false,
      isShare: false,
      changeColor: 2,
      Pictures: '/files/upload/2106b9c10fd84d639e79a613e4c67940.jpg,/files/upload/c29ebf7c59724873b57ed7ba0b480fc6.jpg,/files/upload/21bcac1d5448416cbb21beba66eea939.jpg,/files/upload/e8893237611c4e7b86aea55781c30dbd.jpg,/files/upload/ab53ee1275f748dc83186c4640b1ae0d.jpg,/files/upload/0ed2ec2c7844474b98e44abc67005e05.jpg,/files/upload/7c32829280374e979d4275375b6e2171.jpg',
      // 上面的是新的
      fromWeixin: false,
      textAreaMask: false, // 用户申请入群的taxtArea
      wrapIsBottom: false,
      transY: 0,
      itemsA: [],
      itemsB: [],
      scrollStartY: 0,
      pullDownRefresh: false,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: true,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更过数据了',
      canDirection: false,
      subScrollY: 0,
      wrapScrollY: 0,
      allItems: [{
        items: [],
        pageIndex: 1,
        pageSize: 6,
        name: 'groupDynamic',
        isLoading: false,
        noData: false,
        noDataT: '还没有发表动态哦',
        iconClass: 'iconWwushuju'
      }]
    }
  },
  computed: {
    ...mapState(['follows', 'disFollows', 'user', 'isFansChange']),
    // 表示关注状态
    tabData () {
      return this.$store.state.isInApp ? ['动态', '资料', '活动'] : ['动态']
    },
    isFollowing () {
      let isFollow = this.follows && this.follows.length >= 1 && this.follows.indexOf(this.userId) !== -1
      let isDisFollow = this.disFollows && this.disFollows.length >= 1 && this.disFollows.indexOf(this.userId) !== -1
      if (isFollow) {
        return true
      } else if (isDisFollow) {
        return false
      } else {
        return this.otherUserMsg.isAttention
      }
    },
    // 用户的头像
    userAvatar () {
      let avatar = this.otherUserMsg.avatar === null || this.otherUserMsg.avatar === '' ? 'http://webapp.szwanwan.com/img/default/defaultavatar.png' : this.otherUserMsg.avatar
      return avatar
    },
    // 用户资料年龄
    userAge () {
      let userBirth = this.userInitBirth
      let data = new Date()
      let year = data.getFullYear()
      let month = data.getMonth() + 1
      let day = data.getDate()
      let birthYear = parseInt(userBirth.substring(0, 4))
      let birthMonth = parseInt(userBirth.substring(5, 7))
      let ageYear = year - birthYear
      let birthDay = parseInt(userBirth.substring(8, 10))
      // 如果当前月份小于生日月份就要减1岁
      let change = month > birthMonth || month === birthMonth ? 0 : -1
      // 只有当生日月份当前月份相等时 才判断 day
      if (month === birthMonth) {
        change = day > birthDay || day === birthDay ? 0 : -1
      }
      if (ageYear + change === 2018) {
        return 0
      } else {
        return ageYear + change
      }
    },
    direction () {
      return this.wrapIsBottom ? this.transX ? '' : DIRECTION_V : ''
      // return this.canDirection ? this.transX ? '' : DIRECTION_V : ''
    },
    subIsNotTop () {
      return this.subScrollY < 0 ? true : false
    }
  },
  created () {
    // 获取别人的id
    this.$share.close()
    // this.userId = this.$route.params.id
    // 获得别人的主页信息
    this.getOtherUser()
  },
  activated () {
    this.$share.close()
  },
  methods: {
     ...mapMutations({
      'setMask': 'setMask',
      'updateChangeFans': 'updateChangeFans'
    }),
    goBack () {
      this.$router.back()
    },
    share () {
      let innerObj = {
        name: this.$route.name,
        objectId: this.otherUserMsg.userId
      }
      this.$share.open(this.otherUserMsg, false, 'user', this.$router.currentRoute.fullPath, innerObj)
    },
    subScroll (pos) {
      this.subScrollY = pos.y > 0 ? 0 : pos.y
    },
    subScrollEnd (pos) {
      this.subScrollY = pos.y > 0 ? 0 : pos.y
    },
    wrapScroll (pos) {
      this.wrapScrollY = pos.y
      if (pos.y <= (-200)) {
        this.isShowBack = false
      } else {
        this.isShowBack = true
      }
      if (pos.y === this.$refs.groupInfoPage.offsetHeight - this.$refs.groupInfoPageContent.offsetHeight) {
        this.wrapIsBottom = true
      } else {
        this.wrapIsBottom = false
      }
    },
    onPullingUp () {
    },
    onPullingDown () {
    },
    tabTouchStart () {
    },
    scrollEndWrap (pos) {
      // console.log(pos.y, 'wrapEnd')
      if (pos.y === this.$refs.groupInfoPage.offsetHeight - this.$refs.groupInfoPageContent.offsetHeight) {
        this.wrapIsBottom = true
      } else {
        this.wrapIsBottom = false
      }
    },
    setTextAreaMask (data) {
      this.textAreaMask = data
    },
    getTextAreaData (data) {
      if (data) {
        this.joinGroup(data.inputText)
      }
      this.setTextAreaMask(false)
    },
    /**
     * messageUser私信
     */
    messageUser () {
      let me = this
      if (!this.authentication.isLogin()) {
        this.go.login()
        return
      }
      if (!this.$store.getters.hasBaseInfo()) {
        this.showConfirm.toPersonal()
        return
      }
      this.go.nameAParams('chatRoom', {
        id:me.otherUserMsg.userId,
        type:0,
        share: false,
        name: me.otherUserMsg.nickName ? me.otherUserMsg.nickName : me.otherUserMsg.name
      })
      return
       window.goDialog('private', me.otherUserMsg.userId, me.otherUserMsg.nickName || me.otherUserMsg.name)
    },
    /**
     * goFollow 去到粉丝页面
     * params: index :1表示粉丝 2表示获赞 3表示群组
     */
    goFollow () {
      if (!this.$store.state.isInApp) {
        window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=io.dcloud.H50D8112A'
        return
      }
      if (!this.authentication.isLogin()) {
        this.go.login()
        return
      }
      this.$router.push({ name: 'my_follows', params: { id: this.otherUserMsg.userId, type: 2, label: 1 } })
    },
    /**
     * goFans 去到粉丝页面
     * params: index :1表示粉丝 2表示获赞 3表示群组
     */
    goFans (index) {
      if (!this.$store.state.isInApp) {
        window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=io.dcloud.H50D8112A'
        return
      }
      if (!this.authentication.isLogin()) {
        this.go.login()
        return
      }
      this.updateChangeFans(index)
      this.$router.push({ name: 'my_followme', params: { id: this.otherUserMsg.userId, routerType: 2} })
    },
    /**
     * 得到其他用户的信息
     */
    getOtherUser () {
      let me = this
      let userId = this.userId
      me.api.get({
        url: `UserMain/userId?userId=${userId}`,
        success: function (res) {
          me.otherUserMsg = res
          me.userInitBirth = res.birth
          me.userImageList = (res.userImages && res.userImages.length) ? res.userImages : [require('@/assets/images/userBg.jpg')]
          console.log(me.userImageList, 'me.userImageList')
          me.userLike = res.isLike
        }
      })
    },
    /**
     * handleLike 处理是否喜欢用户
     */
    handleLike () {
      if (this.isClickLike) {
        return
      }
      this.isClickLike = true
      let me = this
      if (me.isNeedAnimation) {
        me.isNeedAnimation = false
        console.log()
      }
      me.isNeedAnimation = true
      if (!this.$store.state.isInApp) {
        window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=io.dcloud.H50D8112A'
        return
      }
      if (!this.authentication.isLogin()) {
        this.go.login()
        return
      }
      if (me.userLike) {
        return
      } else {
        me.api.process({
          url: 'Operate',
          data: {
            'objectId': me.userId,
            'oprateType': 2,
            'objectType': 3,
            'isCancel': true // true表示点赞 false表示取消点赞
          },
          success: function () {
            me.userLike = true
            me.isNeedAnimation = true
          }
        })
      }
    },
    // 处理分享
    showShare: function (id) {
      this.$share.open({ Id: id, Content: '123', TopicTitle: 'title' })
    }
  }
}
</script>
<style lang="less" scoped>
 @keyframes moveScale {
  0%{background: white; transform:scale(0); opacity:1;}
  50%{background:white; transform:scale(2);opacity:0.6;}
  100%{background: white; transform:scale(2.1);opacity:0}
}
@keyframes floatOne {
  0% {
    // transform:;
    opacity: 0;
  }
  7% {
    transform: translate3d(-1vw, -0.5vw, 0);
    opacity: 0.3;
  }
  14% {
    transform: translate3d(-3vw, -1vw, 0);
    opacity: 0.6;
  }
  22% {
    transform: translate3d(-5vw, -1.4vw, 0);
    opacity: 0.8;
  }
  30% {
    transform: translate3d(-7vw, -2.4vw, 0);
    opacity: 0.9;
  }
  38% {
    transform: translate3d(-9vw, -4vw, 0);
    opacity: 1;
  }
  47% {
    transform: translate3d(-11vw, -5.6vw, 0);
    opacity: 0.9;
  }
  56% {
    transform: translate3d(-13vw, -8vw, 0);
    opacity: 0.9;
  }
  77% {
    transform: translate3d(-11vw, -16vw, 0);
    opacity: 0.5;
  }
  100% {
    transform: translate3d(-9vw, -18vw, 0);
    opacity: 0;
  }
}
@keyframes OtherfloatOne {
  0% {
    // transform:;
    opacity: 0;
  }
  7% {
    transform: translate3d(-1vw, -0.5vw, 0);
    opacity: 0.3;
  }
  14% {
    transform: translate3d(-3vw, -1vw, 0);
    opacity: 0.6;
  }
  22% {
    transform: translate3d(-5vw, -1.4vw, 0);
    opacity: 0.8;
  }
  30% {
    transform: translate3d(-7vw, -2.4vw, 0);
    opacity: 0.9;
  }
  38% {
    transform: translate3d(-9vw, -4vw, 0);
    opacity: 1;
  }
  47% {
    transform: translate3d(-11vw, -5.6vw, 0);
    opacity: 0.9;
  }
  56% {
    transform: translate3d(-13vw, -8vw, 0);
    opacity: 0.9;
  }
  77% {
    transform: translate3d(-11vw, -16vw, 0);
    opacity: 0.5;
  }
  100% {
    transform: translate3d(-9vw, -18vw, 0);
    opacity: 0;
  }
}
@keyframes floatTwo {
  0% {
    // transform:;
    opacity: 0;
  }
  7% {
    transform: translate3d(-0.5vw, -0.5vw, 0);
    opacity: 0.3;
  }
  14% {
    transform: translate3d(-1vw, -1vw, 0);
    opacity: 0.6;
  }
  22% {
    transform: translate3d(-1.5vw, -1.4vw, 0);
    opacity: 0.8;
  }
  30% {
    transform: translate3d(-2vw, -2.4vw, 0);
    opacity: 0.9;
  }
  38% {
    transform: translate3d(-2.5vw, -4vw, 0);
    opacity: 1;
  }
  47% {
    transform: translate3d(-3vw, -5.6vw, 0);
    opacity: 0.9;
  }
  56% {
    transform: translate3d(-2.5vw, -8vw, 0);
    opacity: 0.9;
  }
  77% {
    transform: translate3d(-2vw, -16vw, 0);
    opacity: 0.5;
  }
  100% {
    transform: translate3d(-1.5vw, -25vw, 0);
    opacity: 0;
  }
}
@keyframes OtherfloatTwo {
  0% {
    // transform:;
    opacity: 0;
  }
  7% {
    transform: translate3d(-0.5vw, -0.5vw, 0);
    opacity: 0.3;
  }
  14% {
    transform: translate3d(-1vw, -1vw, 0);
    opacity: 0.6;
  }
  22% {
    transform: translate3d(-1.5vw, -1.4vw, 0);
    opacity: 0.8;
  }
  30% {
    transform: translate3d(-2vw, -2.4vw, 0);
    opacity: 0.9;
  }
  38% {
    transform: translate3d(-2.5vw, -4vw, 0);
    opacity: 1;
  }
  47% {
    transform: translate3d(-3vw, -5.6vw, 0);
    opacity: 0.9;
  }
  56% {
    transform: translate3d(-2.5vw, -8vw, 0);
    opacity: 0.9;
  }
  77% {
    transform: translate3d(-2vw, -16vw, 0);
    opacity: 0.5;
  }
  100% {
    transform: translate3d(-1.5vw, -25vw, 0);
    opacity: 0;
  }
}
@keyframes floatThree {
  0% {
    // transform:;
    opacity: 0;
  }
  7% {
    transform: translate3d(1vw, -0.5vw, 0);
    opacity: 0.3;
  }
  14% {
    transform: translate3d(3vw, -1vw, 0);
    opacity: 0.6;
  }
  22% {
    transform: translate3d(5vw, -1.4vw, 0);
    opacity: 0.8;
  }
  30% {
    transform: translate3d(7vw, -2.4vw, 0);
    opacity: 0.9;
  }
  38% {
    transform: translate3d(8vw, -4vw, 0);
    opacity: 1;
  }
  47% {
    transform: translate3d(10vw, -5.6vw, 0);
    opacity: 0.9;
  }
  56% {
    transform: translate3d(8vw, -8vw, 0);
    opacity: 0.9;
  }
  77% {
    transform: translate3d(6vw, -16vw, 0);
    opacity: 0.5;
  }
  100% {
    transform: translate3d(6vw, -22vw, 0);
    opacity: 0;
  }
}
@keyframes OtherfloatThree {
  0% {
    // transform:;
    opacity: 0;
  }
  7% {
    transform: translate3d(1vw, -0.5vw, 0);
    opacity: 0.3;
  }
  14% {
    transform: translate3d(3vw, -1vw, 0);
    opacity: 0.6;
  }
  22% {
    transform: translate3d(5vw, -1.4vw, 0);
    opacity: 0.8;
  }
  30% {
    transform: translate3d(7vw, -2.4vw, 0);
    opacity: 0.9;
  }
  38% {
    transform: translate3d(8vw, -4vw, 0);
    opacity: 1;
  }
  47% {
    transform: translate3d(10vw, -5.6vw, 0);
    opacity: 0.9;
  }
  56% {
    transform: translate3d(8vw, -8vw, 0);
    opacity: 0.9;
  }
  77% {
    transform: translate3d(6vw, -16vw, 0);
    opacity: 0.5;
  }
  100% {
    transform: translate3d(6vw, -22vw, 0);
    opacity: 0;
  }
}
.ListItem{
  height: 20vw;
}
.otherHomePage{
  height: 100vh;
  color: var(--dGray);
  // overflow: hidden;
  .otherBtn{
    position:fixed;
    z-index: 100;
    bottom:3.15vw;
    width:100%;
    height:14.16vw;
    padding:0 4vw;
    box-sizing: border-box;
    display:flex;
    justify-content: center;
    div{
      display:inline-block;
      width:42.78vw;
      height:100%;
      border-radius: 7vw;
      text-align: center;
      line-height:14.16vw;
      color:white;
      font-size:5vw;
    }
    div:nth-child(1) {
      background-color:rgba(230, 145, 60,.8);
      margin-right:2.6vw;
    }
    .nofollowIt >a {
      width:42.78vw !important;
      height:100% !important;
      line-height:14.16vw !important;
      background-color:rgba(247, 42, 76,.8) !important;
      border-radius: 7vw !important;
      margin:auto !important;
      color:white !important;
      text-align: center !important;
      font-size:5vw !important;
      border:none !important;
      }
    .followIt >a {
        width:42.78vw !important;
        height:100% !important;
        line-height:14.16vw !important;
        background-color:rgba(154, 154, 154,.8) !important;
        border-radius: 7vw !important;
        margin:auto !important;
        color:white !important;
        text-align: center !important;
        font-size:5vw !important;
        border:none !important;
      }
  }
  .otherHomeBack{
    width:10vw;
    height:13.34vw;
    line-height:13.6vw;
    position:fixed;
    z-index:20;
    left:7.5vw;
    top:0;
    .activityNotice{
      color: white;
      font-size: 4.63vw;
      font-weight: bold;
      text-shadow: 0 0 4px #000;
    }
  }
  .shareBtn{
    width:10vw;
    height:13.34vw;
    line-height:13.6vw;
    position:fixed;
    z-index:20;
    right: 1.5vw;
    top:0;
    .activityNotice{
      // color: white;
      // font-size: 4.63vw;
      // font-weight: bold;
      // text-shadow: 0 0 4px #000;
      font-style: normal;
      font-weight: 500;
              background:rgb(59, 187, 7);
              width:8vw;
              height:8vw;
              text-align: center;
              line-height:8.5vw;
              border-radius: 50%;
              display:inline-block;
              color:white;
              font-size:5vw;
    }
  }
  .otherFixed{
    position:fixed;
    top:0;
    left:0;
    z-index:22;
    width:100%;
    height:12vw;
    background:white;
    .otherFixedTwo{
      width:50vw;
      margin:auto;
      font-size:0;
    }
    .name{
          display:inline-block;
          width:100%;
          height:6vw;
          line-height:6vw;
          font-size:4.25vw;
          font-weight: bold;
          letter-spacing: 0.4vw;
          color:#333333;
          // margin:auto;
          text-align: center;
        }
        .code{
          height:4.2vw;
          line-height:4.5vw;
          display:inline-block;
          width:100%;
          font-size:2.8vw;
          color:#999999;
          letter-spacing: 0.3vw;
          // margin:auto;
          text-align: center;
        }
  }
  .shareIcon{
    position: fixed;
    top: 0;
    right: 0;
    width: 15vw;
    height: 12vw;
    line-height: 12.7vw;
    text-align: center;
    z-index: 300;
    .iconWbianji{
      font-size:6vw;
      color:#666;
      font-weight: bold;
    }
  }
  .joinGroup{
    position:fixed;
    left:0;
    right:0;
    bottom:6.9vw;
    width:88vw;
    height:14.17vw;
    background-color:rgba(255, 40, 66, .9);
    z-index: 2;
    color:white;
    text-align: center;
    line-height:14.17vw;
    border-radius: 8vw;
    font-size:5vw;
    margin:auto;
    &.grayColor{
      color: #fff;
      background-color: var(--lGray);
    }
  }
  .groupDetail{
    padding: 0 3.7vw;
    position:relative;
    .groupTitle{
      font-size: 6vw;
      height: 9.25vw;
      line-height: 9.25vw;
      letter-spacing: 2px;
    }
    .groupTagList{
      font-size: 0;
      height:5.9vw;
      line-height:5.9vw;
      margin-bottom: 3vw;
      display:flex;
      .wanwanNum{
        display: inline-block;
        font-size: var(--nText);
        color: var(--lGray);
        margin-right: 2vw;
      }
      .tagList{
        width:50vw;
        text-align: center;
        font-size: 0;
        display:flex;
        align-items: center;
        span{
          display:inline-block;
          width: 11vw;
          height: 5.8vw;
          border-radius: 3vw;
          margin-left: -0.5vw;
          font-size: 11px;
          color:white;
          text-align: center;
          line-height: 5.8vw;
          transform: scale(0.8);
          .iconWanwan{
            margin-left: -1vw;
            margin-right: 1vw;
          }
          .text{
            // line-height: 5.75vw;
            vertical-align: top;
          }
          i{
            display: inline-block;
            font-style: normal;
          }
        }
        span:nth-child(1){
          background-color:#fe8d54;
          // margin-right: -1vw;
          .activityNotice{
            color:#fdda35;
          }
        }
        span:nth-child(2){
          background-color:#4dd3e7;
        }
        span:last-child{
          margin-left: -1vw;
          background-color:#9bd941;
          line-height:6vw;
        }
      }
    }
    .groupLike{
                  width:13.11vw;
                  height:13.11vw;
                  border-radius: 50%;
                  margin-left:25vw;
                  background:white;
                  box-shadow: 0px 0px 2px rgb(197,197,197);
                  display:flex;
                  text-align: center;
                  align-content: center;
                  flex-flow: row wrap;
                  position: absolute;
                  top:0vw;
                  right:4vw;
                  transition: all 0.2s;
                  z-index: 20000;
                  span:nth-child(1){
                    display:inline-block;
                    width:13.11vw;
                    height:7vw;
                    line-height:8vw;
                    position:relative;
                    z-index: 20000;
                  }
                  .normalFont{
                    display:inline-block;
                    width:13.11vw;
                    color:#666;
                    font-size:3vw;
                    height:5vw;
                  }
                  .whiteFont{
                    color:white;
                  }
                  .myXin{
                    // border:1px solid blue;
                    position:absolute;
                    bottom:3vw;
                    left:3.5vw;
                    opacity: 0;
                    background: linear-gradient(to left, #FF8A81, #FE6FA3); // 给字体设置渐变
                    -webkit-background-clip: text;
                    color: transparent;
                  }
                  .myOne{
                    animation: floatOne 1.5s linear forwards;
                    font-size:3vw;
                    z-index: 20000;
                  }
          
                  .myTwo{
                    animation: floatTwo 1.5s linear forwards;
                    font-size:5vw;
                    z-index:20000;
                    .xinTwo{
                      font-size:5.5vw;
                    }
                  }
                  .myThree{
                    animation: floatThree 1.5s linear  forwards;
                    font-size:3vw;
                    z-index:20000;
                  }
                  .myScale{
                    display:inline-block;
                    position:absolute;
                    top:2vw;
                    left:0;
                    right:0;
                    margin:0 auto;
                    width:3.5vw;
                    height:3.5vw;
                    border-radius: 50%;
                    // border:1px solid pink;
                    border:1px solid rgba(255, 192, 203,.6);
                    // box-shadow: 0 0 2px rgb(243,243,243);
                    animation: moveScale 0.7s 0s  forwards;
                    //  background: linear-gradient(to right, red, blue);
                    // -webkit-background-clip: text;
                    // color: transparent;
                  }
                  .activityNotice{
                    font-size: 6vw;
                    color:rgb(253, 133, 132);
                  }
                  .iconWredXin{
                    color:white;
                  }
                }
                .groupLikeConfirm{
                  background: linear-gradient(to left, rgb(255, 138, 129), rgb(254, 111, 163));
                  transition: all 0.2s;
                }


    .groupDesc{
      line-height:6.66vw;
      color: var(--mGray);
      font-size: var(--mText);
    }
    .groupInfoTags{
      display: flex;
      margin: 4.9vw 0;
      li{
        flex: 1;
        min-height: 20.37vw;
        border-radius: 3vw;
        border: 1px solid #cdcdcd;
        padding: 0 3vw;
        p{
          margin-top: 2.4vw;
          letter-spacing: 1px;
        }
        i{
          font-style: normal;
        }
        span{
          display: inline-block;
          // max-width: 20vw;
          line-height: 5.92vw;
          color: var(--lGray);
          font-size: var(--nText);
          // text-overflow: ellipsis;
          // overflow: hidden;
          // white-space: nowrap;
        }
      }
      li + li {
        margin-left: 4.1vw;
      }
    }
    .groupProperty{
      .groupItemTitle{
        height: 7.7vw;
        line-height: 7.7vw;
        font-size: 4.6vw;
      }
      .groupPropertyList{
        font-size: 0;
        li{
          display: inline-block;
          height: 26vw;
          width: 38vw;
          padding-top: 5.46vw;
          margin-left: 2vw;
          box-sizing: border-box;
          &:nth-child(2n) {
            margin-left: 12vw;
          }
          > div{
            height: 10vw;
            line-height: 10vw;
            font-size: 6vw;
            .iconWanwan{
              display:inline-block;
              width: 10vw;
              color: var(--mRed);
            }
          }
          .property{
            height: 7.7vw;
            line-height: 7.7vw;
            color: var(--lGray);
            font-size: var(--mText);
            letter-spacing: 1px;
          }
        }
      }
    }
    .groupUser{
      .groupItemTitle{
        display: flex;
        margin: 3vw 0;
        span{
          flex: 1;
        }
        i{
          width: 10vw;
          text-align: center;
          font-size: 4vw;
          color: var(--lGray);
        }
      }
      .groupUserList{
        display: flex;
        width:100%;
        overflow: hidden;
        .specialLi{
          flex: 1;
          text-align: center;
          max-width: 30vw;
          position:relative;
          .addBtn{
            display:inline-block;
            height: 26.5vw;
            width: 26.5vw;
            border-radius: 50%;
            background: rgb(243, 243, 243);
            text-align: center;
            line-height:26.5vw;
            font-size:7vw;
            color:#666;
          }
          .addFriend{
            width:100%;
            position:absolute;
            top:26.5vw;
            left:0;
            font-size: var(--nText);
            color: #6e6e6e;
          }
        }
        li{
          flex: 1;
          text-align: center;
          max-width: 30vw;
          > div{
            position: relative;
            height: 26.5vw;
            width: 26.5vw;
            margin: 0 auto;
            p{
              position: absolute;
              left: 50%;
              margin-left: -6.4vw;
              width:12.8vw;
              height: 5.56vw;
              line-height: 5.56vw;
              margin-top: -2.78vw;
              color:#fff;
              font-size: var(--nText);
              background: var(--mRed);
              border-radius: 2.78vw;
            }
            .userAvatar{
              width:100%;
              height:100%;
              border: 1px solid #eee;
              border-radius: 50%;
              position:relative;
              img{
                height:100%;
                width:100%;
                border-radius: 50%;
              }
              .defaultAvatar{
                width:18vw;
                height:18vw;
                border-radius: 0;
                position:absolute;
                top:0;
                bottom:0;
                right:0;
                left:1vw;
              }
            }
          }
          p{
            height: 11.11vw;
            line-height:11.11vw;
            font-size: var(--nText);
            color: #6e6e6e;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
        }
        li + li {
          margin-left: 4vw;
        }
      }
    }
  }
  .groupInfoPageContent{
    .otherHead{
            .myhomeImg{
              width:100vw;
              height:100vw;
              overflow: hidden;
              .noImg{
                display:flex;
                margin:auto;
                width:70vw;
                height:65vw;
                justify-content: center;
                flex-flow: row wrap;
                align-content: center;
                .activityNotice{
                  display:inline-block;
                  width:70vw;
                  text-align: center;
                  height:10vw;
                  color:rgb(255, 39, 66);
                  font-size:7vw;
               }
               .imgTitle{
                 font-style: normal;
               }
              }
            }
            .noHeight{
              height:12vw;
            }
      }
      .noHeightBig{
        height:12vw;
      }
    .otherMiddle{
              width:100%;
              padding-bottom:2vw;
              padding-top:2vw;
              box-sizing: border-box;
              position:relative;
              .myMainUp{
                display: flex;
                height:20.56vw;
                .userAvator{
                  width: 34.63vw;
                  display:flex;
                  align-items: center;
                  justify-content: center;
                  position:relative;
                  .avatarWrap{
                    width:20.56vw;
                    height:20.56vw;
                    border-radius: 50%;
                    box-shadow: 0px 0px 1px #efefef;
                    overflow: hidden;
                    position:relative;
                  }
                  img{
                    position:absolute;
                    top:0;
                    left:0;
                    right:0;
                    bottom:0;
                    margin:auto;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                  }
                  .defaultStyle{
                    width:14vw;
                    height:14vw;
                    border-radius: 0;
                  }
                  .right{
                    position:absolute;
                    bottom:0vw;
                    right:6.5vw;
                    z-index:12;
                    background:white;
                    width: 6.2vw;
                    height:6vw;
                    border-radius: 50%;
                    font-size: 0;
                    .one{
                      position:absolute;
                      top:0;
                      right:0;
                      left:0;
                      bottom:0;
                      margin:auto;
                      width:5.18vw;
                      height:5.18vw;
                      border-radius: 50%;
                      background: linear-gradient(to right bottom,#e37782, #f56b80,#ff5363,#ff405b, #fc3f58);
                      color:white;
                      line-height: 5.18vw;
                      text-align: center;
                      box-sizing: border-box;
                      font-size:5.5vw;
                      font-weight: 500;
                      font-family: Times, TimesNR, 'New Century Schoolbook', Georgia, 'New York', serif;
                    }
                  }
                }
                .userMsg{
                  flex: 1;
                  font-size:0;
                  padding:0;
                  margin:0;
                  .user{
                    height:10vw;
                    font-size:0;
                    padding-left:4vw;
                    box-sizing: border-box;
                    .name{
                      font-size:4.53vw;
                      color:#000000;
                      display:inline-block;
                      padding:0;
                      height:4vw;
                      line-height:4vw;
                      margin-top:0.5vw;
                    }
                    .code{
                      height:4vw;
                      padding:0;
                      font-size:3vw;
                      color:#999;
                      display:inline-block;
                      width:100%;
                      line-height:4vw;
                      margin-top:0.5vw;
                    }
                  }
                  .one{
                    display:flex;
                    text-align: center;
                    font-size: 0;
                    height:10vw;
                    .each{
                      flex: 1;
                      span{
                        display: block;
                        color:#333333;
                        font-size:3.7vw;
                      }
                      .eachCount{
                        font-size:4vw;
                        margin-top:-0.4vw;
                      }
                      .eachFont{
                        color:#999999;
                        margin-top:-2vw;
                        font-size:4vw;
                      }
                    }
                  }
                }
              }
              .myMainDown{
                margin-top:4.8vw;
                width:95vw;
                margin-left:4vw;
                font-size:0;
                .userState{
                  height:5.3vw;
                  display:flex;
                  align-items: center;
                  margin-bottom:5.56vw;
                  .address{
                    display:inline-block;
                    padding-right:2.22vw;
                    height:5.3vw;
                    line-height:5.3vw;
                    font-size:4vw;
                    color:#333333;
                    position:relative;
                    &::after{
                      content:'';
                      width:2vw;
                      height:5.3vw;
                      margin-left:2vw;
                      position:absolute;
                      top:0vw;
                      right:0;
                      border-right:1px solid #e6e6e6;
                    }
                  }
                  .gender{
                    display:flex;
                    justify-content: space-around;
                    margin-left:2.5vw;
                    &::after{
                      content:'';
                      width:2vw;
                      height:5.3vw;
                      // margin-left:2vw;
                      border-right:1px solid #e6e6e6;
                    }
                }
                  .Member{
                    display:flex;
                    height:100%;
                    align-items: center;
                    span{
                      color:rgb(255, 39, 66);
                      display:inline-block;
                      margin-left:3vw;
                      letter-spacing: 0.2vw;
                      font-size:3.6vw;
                    }
                    .activityNotice{
                      display:inline-block;
                      color:#cccccc;
                      margin-left:1vw;
                      height:100%;
                      line-height:6.3vw;
                    }
                  }
                  .userLike{
                    width:13.11vw;
                    height:13.11vw;
                    border-radius: 50%;
                    margin-left:25vw;
                    background:white;
                    box-shadow: 0px 0px 2px rgb(197,197,197);
                    display:flex;
                    text-align: center;
                    align-content: center;
                    flex-flow: row wrap;
                    position: absolute;
                    top:23vw;
                    right:4vw;
                    transition: all 0.2s;
                    span:nth-child(1){
                      display:inline-block;
                      width:13.11vw;
                      height:7vw;
                      line-height:8vw;
                      position:relative;
                      z-index: 2;
                    }
                    .normalFont{
                      display:inline-block;
                      width:13.11vw;
                      color:#999999;
                      font-size:3vw;
                      height:5vw;
                    }
                    .whiteFont{
                      color:white;
                    }
                    .myXin{
                      position:absolute;
                      bottom:3vw;
                      left:3.5vw;
                      opacity: 0;
                      background: linear-gradient(to left, #FF8A81, #FE6FA3); // 给字体设置渐变
                      -webkit-background-clip: text;
                      color: transparent;
                    }
                    .myOne{
                      animation: floatOne 1.5s linear forwards;
                      font-size:3vw;
                    }
                    .otherOne{
                      animation: OtherfloatOne 1.5s linear forwards;
                      font-size:3vw;
                      z-index: 20000;
                    }
                    .myTwo{
                      animation: floatTwo 1.5s linear forwards;
                      font-size:5vw;
                      .xinTwo{
                        font-size:5.5vw;
                      }
                    }
                    .otherTwo{
                      animation: OtherfloatTwo 1.5s linear forwards;
                      font-size:5vw;
                      .xinTwo{
                        font-size:5.5vw;
                      }
                    }
                    .myThree{
                      animation: floatThree 1.5s linear  forwards;
                      font-size:3vw;
                    }
                    .otherThree{
                      animation: OtherfloatThree 1.5s linear  forwards;
                      font-size:3vw;
                    }
                    .myScale{
                      display:inline-block;
                      position:absolute;
                      top:2vw;
                      left:0;
                      right:0;
                      margin:0 auto;
                      width:3.5vw;
                      height:3.5vw;
                      border-radius: 50%;
                      border:1px solid rgba(255, 192, 203,.6);
                      animation: moveScale 0.7s 0s  forwards;
                    }
                    .activityNotice{
                      font-size: 6vw;
                      color:rgb(253, 133, 132);
                    }
                    .iconWredXin{
                      color:white;
                    }
                  }
                  .userLikeConfirm{
                    background: linear-gradient(to left, rgb(255, 138, 129), rgb(254, 111, 163));
                    transition: all 0.2s;
                  }
                }
                .shopMsg{
                  width:80vw;
                  display:flex;
                  flex-flow: row wrap;
                  margin-bottom:3vw;
                  span{
                    font-size:4vw;
                    display:inline-block;
                    width:100%;
                    color:#333333;
                  }
                }
                .authen{
                  width:100%;
                  display:flex;
                  flex-flow: row wrap;
                  font-size:4vw;
                  color:#333333;
                  margin-bottom:2vw;
                  margin-top:1vw;
                  border:#ffde73;
                  .autenStyle{
                    display:inline-block;
                    margin-right:2vw;
                  }
                  .detail{
                    flex:1;
                  }
                }
                .userDes{
                  // font-size:3.7vw;
                  // color:#333333;
                  // letter-spacing: 0.2vw;
                  width:92%;
                  font-size:4vw;
                  color:#333333;
                  // letter-spacing: 0.2vw;
                  word-wrap: break-word;
                  word-break: break-all;
                  margin-bottom:3vw;
                }
              }
        }
  }
  .groupSubContent{
    .tabList{
      height: 10.8vw;
      line-height: 10.8vw;
      span{
        width: 39vw;
      }
      i{
        bottom: 2.4vw;
      }
    }
    .pagesTabContent{
      font-size: 0;
      height: calc(100vh - 24vw);
      // width: 200vw;
      background: #fff;
      // overflow: hidden;
      padding-top:2vw;
      box-sizing: border-box;
      width:300vw !important;
      .DynamicTabContent{
        background: #0f0;
      }
      .TabContentItemPage {
        position: relative;
        display: inline-block;
        vertical-align: top;
        width: 100vw;
        height: 100%;
        font-size: var(--mText);
      }
    }
  }
}
</style>
