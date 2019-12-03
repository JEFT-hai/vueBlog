<template>
  <div class="myHomePage"
       ref='groupInfoPage'>
    <taskSign :show="signTabShow"
              :item="loginItem"
              @hideSignTab="setSignTab(false)"
              @signTask="signTask"></taskSign>
    <div class="myHomeUp">
      <span class="one">
        <i class="iconWanwan iconWfanhui activityNotice"
           @click="toBack"
           v-show="$store.state.myNeedBack"></i>
      </span>
      <div class="two">
        <span :class="['name', {vipColor: user.vipLevel}]">{{user.nickName}}</span>
        <span class="code">多录号:&nbsp;{{user.name}}</span>
      </div>
      <span class="three">
        <i class="iconWanwan iconWweixinfenxiang activityNotice"
           @click="showShare()"></i>
      </span>
    </div>
    <scroll ref='scroll'
            :scrollbar="scrollbarObj"
            :pullDownRefresh="false"
            :pullUpLoad="false"
            :bounce='false'
            :click='false'
            :listenScroll='true'
            :listenScrollEnd='true'
            @scroll='wrapScroll'
            @scroll-end='scrollEndWrap'>
      <div class="groupInfoPageContent"
           ref='groupInfoPageContent'>
        <div class="myHomeHead">
          <div class="myhomeImg">
            <swiper :items="userImages"
                    elId="my"
                    :autoplay=false
                    :type=2 />
            <!-- <span class="noImg"
                  v-else
                  @click="handlePersonal">
              <i class="iconWanwan iconWzhaoxiang activityNotice"></i>
              <i class="imgTitle">马上设置专属你的照片墙吧！</i>
            </span> -->
          </div>
        </div>
        <div class="topHome"
             ref="boxItem">
          <div class="myMain borderB">
            <div class="myMainUp">
              <div class='userAvator'>
                <avatar class=""
                        :item='user'
                        :canClick='false'
                        :size='20'
                        :isMyHome="true"></avatar>
              </div>
              <div class="userMsg">
                <div class="one">
                  <div class="each"
                       @click="goFollow">
                    <span class="eachCount">{{format.formatNum(user.attentionCount)}}</span>
                    <span class="eachFont">关注</span>
                  </div>
                  <div class="each"
                       @click="goFans(1)">
                    <span class="eachCount">{{format.formatNum(user.fansCount)}}</span>
                    <span class="eachFont">粉丝</span>
                  </div>
                  <div class="each"
                       @click="goFans(2)">
                    <span class="eachCount">{{format.formatNum(user.likeCount)}}</span>
                    <span class="eachFont">获赞</span>
                  </div>
                  <div class="each"
                       @click="goFans(3)">
                    <span class="eachCount">{{format.formatNum(user.groupCount)}}</span>
                    <span class="eachFont">群组</span>
                  </div>
                </div>
                <div class="two">
                  <span class="writeDes"
                        @click="handlePersonal">编辑资料</span>
                  <span class="setting"
                        @click='goSet'>
                    <i class="iconWanwan iconWshezhi activityNotice"></i>
                  </span>
                </div>
              </div>
            </div>
            <div class="myMainDown">
              <div class="userState">
                <span class="address">{{user.areaProvince}}</span>
                <div class="gender">
                  <span :class="{pinkGenderLabel:user.gender === 2,blueGenderLabel:user.gender !== 2}">
                    <i class="iconWanwan iconWnan-copy activityNan"
                       v-if="user.gender === 1 || user.gender === 0 "></i>
                    <i class="iconWanwan iconWnv3-copy activityNv"
                       v-else></i>
                    <!-- <i class="age">{{userAge}}</i> -->
                  </span>
                  <!-- <span class="yellowGenderLabel">Lv.39</span> -->
                </div>
                <div v-if="user.vipLevel" class="Member">
                          <i :class="['vipIcon', {notVip: !user.vipLevel}]"></i>
                          <!-- <span>R会员</span>
                          <i class="iconWanwan iconWright activityNotice"></i> -->
                </div>
              </div>
              <div class="authen"
                   v-if="user.userAuthen">
                <span class="autenStyle">V认证:</span><span class="detail">{{user.userAuthen && user.userAuthen.releaseContent}}</span>
              </div>
              <div class="userDes">
                <span>{{user.personStatement === undefined ? '这家伙很懒什么都没写' :user.personStatement}}</span>
              </div>
            </div>
          </div>
          <div class="homeData borderB">
            <div class="dataOne data"
                 @click="hiddleScore">
              <span>
                <i class="iconWanwan iconWzuanshi-copy activityNotice"></i>
              </span>
              <span>等级会员</span>
            </div>
            <div class="dataTwo data"
                 @click="hiddleXiao">
              <span>
                <i class="iconWanwan iconWjia1 activityNotice"></i>
              </span>
              <span>我的草稿</span>
            </div>
            <div class="dataThree data"
                 @click="hiddleTesk">
              <span class="work">
                <i class="iconWanwan iconWhuaduo-copy-copy activityNotice"></i>
              </span>
              <span>任务中心</span>
            </div>
            <div class="dataFour data"
                 @click="showWhoLook">
              <span class="see">
                <i class="iconWanwan iconWmenu-s-copy activityNotice"></i>
              </span>
              <span>谁看过我</span>
            </div>
          </div>
          <div class="splitLine"></div>
        </div>
        <div class="groupSubContent"
             ref='groupSubContent'>
          <tabMove class="borderB"
                   @scroll='tabMoveScroll'
                   ref='tabMove'
                   :tabData="tabData"
                   @touchstart.native="tabTouchStart($event)"
                   :currentTab='currentIndex'></tabMove>
          <div class="pagesTabContent"
               ref='touchContent'
               @touchstart="touchstart($event)">
            <pageItemTab v-if="user.userId"
                         :userId='user.userId'
                         :routerType='routerType'
                         :direction='direction'
                         :subIsNotTop='subIsNotTop'
                         :subScrollY='subScrollY'
                         @pullingDown="onPullingDown"
                         @pullingUp="onPullingUp"
                         @scroll='subScroll'
                         @scroll-end='subScrollEnd'></pageItemTab>
            <HomeCollection v-if="user.userId"
                            :userId='user.userId'
                            :routerType='routerType'
                            :direction='direction'
                            :subIsNotTop='subIsNotTop'
                            :subScrollY='subScrollY'
                            @pullingDown="onPullingDown"
                            @pullingUp="onPullingUp"
                            @scroll='subScroll'
                            @scroll-end='subScrollEnd'></HomeCollection>
            <activityPageItemTab v-if="user.userId"
                                 :userId='user.userId'
                                 :routerType='routerType'
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
import taskMixin from '@/components/Task/TaskMixin'

import pageItemTab from './components/pageItemTab'
import activityPageItemTab from './components/activityPageItemTab'
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
import HomeCollection from '@/views/My0/components/HomeCollection'
export default {
  mixins: [scrollMixin, scrollPagesMixin, taskMixin],
  components: {
    // GroupSwiper,
    avatar,
    Swiper,
    tabMove,
    scroll,
    pageItemTab,
    activityPageItemTab,
    HomeCollection
  },
  data () {
    return {
      currentIndex: 0,
      isShowBack: true,
      routerType: 1, // 1表示我的主页
      isLoading: true,
      userId: '', // 用户的id
      userInitBirth: '', // 用户的初始生日
      changeColor: 2,
      Pictures: '/files/upload/2106b9c10fd84d639e79a613e4c67940.jpg,/files/upload/c29ebf7c59724873b57ed7ba0b480fc6.jpg,/files/upload/21bcac1d5448416cbb21beba66eea939.jpg,/files/upload/e8893237611c4e7b86aea55781c30dbd.jpg,/files/upload/ab53ee1275f748dc83186c4640b1ae0d.jpg,/files/upload/0ed2ec2c7844474b98e44abc67005e05.jpg,/files/upload/7c32829280374e979d4275375b6e2171.jpg',
      userDynamicCount: '', // 其他用户发表的动态
      activityList: [], // 用户参加的活动列表
      // 上面的是新的
      fromWeixin: false,
      wrapIsBottom: false,
      transY: 0,
      tabData: ['动态', '收藏', '活动'],
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
      // touchChildN: 0,
    }
  },
  beforeRouteLeave (to, from, next) {
    this.$route.params.from = ''
     let obj = {
     isRefreshPost: false,
     isRefreshCollect: false,
     isRefreshActivity: false
    }
    this.updateMyPage(obj)
    this.updateNeedBack(false)
    next()
  },
  computed: {
    ...mapState(['follows', 'disFollows', 'user', 'isFansChange']),
    ...mapGetters(['userIsLogin', 'userBirth']),
      // 用户的头像
    userAvatar () {
      let avatar = this.user.avatar === null || this.user.avatar === '' ? 'http://webapp.szwanwan.com/img/default/defaultavatar.png' : this.user.avatar
      return avatar
    },
    userImages () {
      return (this.user.userImages && this.user.userImages.length) ? this.user.userImages : [require('@/assets/images/userBg.jpg')]
    },
    // 用户资料年龄
    userAge () {
      let data = new Date()
      let year = data.getFullYear()
      let month = data.getMonth() + 1
      let day = data.getDate()
      let birthYear = parseInt(this.userBirth.substring(0, 4))
      let birthMonth = parseInt(this.userBirth.substring(5, 7))
      let ageYear = year - birthYear
      let birthDay = parseInt(this.userBirth.substring(8, 10))
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
    // 用户资料地址
    userAddress () {
      return this.user.areaProvince
    },
    direction () {
      return this.wrapIsBottom ? this.transX ? '' : DIRECTION_V : ''
      // return this.canDirection ? this.transX ? '' : DIRECTION_V : ''
    },
    subIsNotTop () {
      return this.subScrollY < 0 ? true : false
    },
    imageUlrs () {
      let imageUlrs = []
      this.groupInfo.imageUlrs.map((item) => {
        imageUlrs.push(item.imageUrl)
      })
      return imageUlrs
    }
  },
  created () {
    // 获得别人的主页信息
    // this.getOtherUser()
    this.$share.close()
  },
  activated () {
    this.$refs.scroll && this.$refs.scroll.forceUpdate()
    this.$share.close()
    this.getUserMain(this)
  },
  methods: {
     ...mapMutations({
      'setMask': 'setMask',
      'updateChangeFans': 'updateChangeFans',
      'updateMyPage': 'updateMyPage',
      'updateNeedBack': 'updateNeedBack'
    }),
    ...mapActions({
      getUserMain: 'getUserMain'
    }),
    share () {
      this.$share.open(this.groupInfo, false, 'groupInfo', this.$router.currentRoute.fullPath)
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
    touchstart (e) {
      this.subIsNotTop && e.stopPropagation()
    },
    scrollEndWrap (pos) {
      if (pos.y === this.$refs.groupInfoPage.offsetHeight - this.$refs.groupInfoPageContent.offsetHeight) {
        this.wrapIsBottom = true
      } else {
        this.wrapIsBottom = false
      }
    },
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
      window.goDialog('private', me.user.userId, me.user.nickName || me.user.name)
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
      this.$router.push({ name: 'my_follows', params: { id: this.user.userId, type: 1, label: 1 } })
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
      this.$router.push({ name: 'my_followme', params: { id: this.user.userId, routerType: 1} })
      console.log('去到粉丝页 ')
    },
    calculateDynamicList (items) {
      this.userDynamicCount = items
    },
    /**
     * handleLabel处理收藏的标签
    */
    handleLabel (index) {
      this.specialCollection = index
    },
    /**
     * calculateCollection 计算收藏的数量
     */
    calculateCollection (count) {
      this.collectionCount = count
    },
    /**
     * calculateMusic 计算收藏的数量
     */
    calculateMusic (count) {
      this.musicCount = count
    },
    /**
     * handlePersonal显示用户主页
     */
    handlePersonal () {
      // this.isShowProfile = true
      this.$router.push({ name: 'my_personal' })
    },
    // 计算用户参加的活动
    calculateActivity (items) {
      this.activityList = items
    },
    /**
     * showShare 展示分享
     */
    showShare: function () {
       let innerObj = {
        name: this.$route.name,
        objectId: this.user.userId
      }
      this.$share.open(this.user, false, 'user', '/user/' + this.user.userId, innerObj)
    },
    toBack () {
      this.$router.back()
    },
    /**
     * 隐藏谁看过你
     */
    showWhoLook () {
      this.$router.push({ name: 'my_whoLook' })
    },
    /**
     * 等级
     */
    hiddleScore () {
      this.$router.push({ name: 'my_score' })
    },
    /**
     * 处理小窝
     */
    hiddleXiao () {
      this.$router.push({ name: 'my_xiao' })
    },
    /**
     * 处理任务
    */
    hiddleTesk () {
      this.$router.push({ name: 'taskCenter' })
    },
    goSet () {
      this.$router.push({
        name: 'my_set'
      })
    },
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
.ListItem{
  height: 20vw;
}
.myHomePage{
  height: 100vh;
  color: var(--dGray);
  // overflow: hidden;
  .otherHomeBack{
    width:10vw;
    height:12vw;
    line-height:12vw;
    position:fixed;
    z-index:20;
    left:4vw;
    top:0;
    color: #a2a2a2;
  }
  .myHomeUp{
      position: fixed;
      top:0;
      left:0;
      width:100%;
      height:12.13vw;
      display:flex;
      justify-content: space-between;
      text-align: center;
      background-color:white;
      box-shadow: 0 0 1px #fafafa;
      z-index: 12;
      .activityNotice{
        font-size:4.63vw;
        color:#999999;
      }
      .one{
        display:inline-block;
        width:12vw;
        line-height:12.4vw;
      }
      .two{
        flex-grow: 1;
        display:flex;
        flex-flow: row wrap;
        .name{
          display:inline-block;
          width:100%;
          height:6vw;
          // line-height:12vw;
          font-size:4.25vw;
          font-weight: bold;
          letter-spacing: 0.4vw;
          color:#333333;
        }
        .code{
          margin-top:1vw;
          height:4.2vw;
          line-height:4.2vw;
          display:inline-block;
          width:100%;
          font-size:2.8vw;
          color:#999999;
          letter-spacing: 0.3vw;
        }
      }
      .three{
        display:inline-block;
        width:12vw;
        line-height:12.4vw;
        .iconWweixinfenxiang{
          // font-size:4.63vw;
          // color:#999999;
          // font-weight: 500;
          font-style: normal;
             font-weight: 500;
              background:rgb(59, 187, 7);
              width:8vw;
              height:8vw;
              text-align: center;
              line-height:9vw;
              border-radius: 50%;
              display:inline-block;
              color:white;
              font-size:5vw;
        }
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
    .myHomeHead{
            padding-top:12vw;
            box-sizing: border-box;
            height:83.85vw;
            position:relative !important;
            .myhomeImg{
              width:100vw;
              height:71.85vw;
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
          }
    .topHome{
          .myMain{
            padding-bottom:2vw;
            box-sizing: border-box;
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
                  display: flex;
                  font-size:0;
                  box-sizing:border-box;
                  .one{
                    padding:0;
                    margin:auto;
                    display:inline-block;
                    line-height: 4.58vw;
                    text-align: center;
                    box-sizing: border-box;
                    width:5.18vw;
                    height:5.18vw;
                    border-radius: 50%;
                    background: linear-gradient(to right bottom,#e37782, #f56b80,#ff5363,#ff405b, #fc3f58);
                    color:white;
                    font-size:5.5vw;
                    font-weight: 500;
                    font-family: Times, TimesNR, 'New Century Schoolbook', Georgia, 'New York', serif;
                  }
                }
              }
              .userMsg{
                flex: 1;
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
                      line-height:3vw;
                      font-size:4vw;
                    }
                    .eachFont{
                      color:#999999;
                      margin-top:0vw;
                      font-size:4vw;
                    }
                  }
                }
                .two{
                  display: flex;
                  padding-left:3vw;
                  font-size:0;
                  margin-top:2.5vw;
                  display:flex;
                  align-items: baseline;
                  position:relative;
                  .writeDes{
                    display:inline-block;
                    text-align: center;
                    width:46.48vw;
                    height:6.6vw;
                    line-height: 6.48vw;
                    border:1px solid #e6e6e6;
                    border-radius: 3.24vw;
                    color:#333333;
                    font-size:4.17vw;
                  }
                  .setting{
                    margin-left:1.9vw;
                    display:flex;
                      justify-content: center;
                      align-items: center;
                      width: 9.7vw;
                      height:6.48vw;
                      border:1px solid #e6e6e6;
                      border-radius: 3.24vw;
                      position:absolute;
                      bottom:0;
                      right:3vw;
                    .activityNotice{
                      color:#676767;
                      font-size:5.5vw;
                      height:6.48vw;
                      line-height:7vw;
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
                  color:#333;
                  // letter-spacing: 0.2vw;
                  position:relative;
                  &::after{
                    content:'';
                    width:2vw;
                    height:5.3vw;
                    margin-left:2vw;
                    position:absolute;
                    top:0;
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
                  .vipIcon{
                    height: 5.3vw;
                    line-height: 5.3vw;
                    width: 5.8vw;
                    margin: 0 2vw;
                  }
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
              }
              .authen{
                width:100%;
                display:flex;
                // align-items: center;
                flex-flow: row wrap;
                font-size:4vw;
                color:#333333;
                margin-bottom:2vw;
                .autenStyle{
                  display:inline-block;
                  margin-right:2vw;
                  color:rgb(255, 39, 66);
                  font-family: Times, TimesNR, 'New Century Schoolbook', Georgia, 'New York', serif;
                  font-weight: bold;
                }
                .detail{
                  flex:1;
                }
              }
              .userDes{
                width:92%;
                font-size:0;
                span{
                  // display:inline-block;
                 font-size:4vw;
                 color:#333333;
                 width:100%;
                  word-wrap: break-word;
                  word-break: break-all;
                  margin-bottom:3.7vw;
                }
              }
            }
          }
          .homeData{
            width:100%;
            height:23.98vw;
            display:flex;
            justify-content: space-around;
            font-size:3.42vw;
            color:#292929;
            .data{
              width:16.67vw;
              height:100%;
              span:first-child{
                display:inline-block;
                width:100%;
                height:14.44vw;
                text-align:center;
                padding-top:3.5vw;
                box-sizing: border-box;
                .activityNotice{
                  color:rgb(255, 39, 66);
                  font-size:8vw;
                  text-align: center;
                }
              }
              span:nth-child(2){
                display:inline-block;
                width:100%;
                text-align: center;
              }
            }
            .dataThree{
              .work{
                position:relative;
              }
              .work::before{
                content:'';
                height: 0;
                width: 0;
                border-left: 1.7vw solid transparent;
                border-right: 1.7vw solid transparent;
                border-bottom: 4vw solid #f35b2c;
                position:absolute;
                top:2.4vw;
                right:3.5vw;
                transform: rotate(218deg);
              }
              .work::after{
                content:'任务';
                display:inline-block;
                width:10.18vw;
                height:4vw;
                line-height:4vw;
                border-radius: 3vw;
                background: linear-gradient(to right, #f35b2c,#ef5141, #f85062);
                position:absolute;
                top:1vw;
                right:-4vw;
                font-size:2vw;
                color:white;
              }
            }
            .dataFour{
                .see{
                  position:relative;
                }
                .see::after{
                    content:'';
                    display:inline-block;
                    width:1.5vw;
                    height:1.5vw;
                    border:1px solid #f35b2c;
                    border-radius:50%;
                    background: linear-gradient(to right, #f35b2c,#ef5141, #f85062);
                    position:absolute;
                    top:4vw;
                    right:2.7vw;
                }
              }
          }
          .splitLine{
            width:100%;
            height:1.78vw;
            background-color:var(--mBg);
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
