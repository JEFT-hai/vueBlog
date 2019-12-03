<template>
  <div class="groupInfoPage" ref="groupInfoPage">
    <div v-if="$store.state.isZijiren" @click="goChatSeting">群设置</div>
    <span class="groupInfoBack"
      ><i class="iconWfanhui iconWanwan activityNotice" @click="goBack"></i
    ></span>
    <div class="shareIcon" @click="reviseGroup" v-if="isGroupLeader">
      <i class="iconWanwan iconWbianji"></i>
    </div>
    <span class="shareBtn" v-else>
      <i class="iconWanwan iconW7 activityNotice" @click="share()"></i>
    </span>
    <div class="groupFixed" v-show="wrapIsBottom">
      <!-- <span>返回</span> -->
      <div class="otherFixedTwo">
        <span class="name">{{ groupInfo.groupName }}</span>
        <!-- <span class="code">多录号:&nbsp;{{otherUserMsg.name}}</span> -->
      </div>
    </div>
    <div
      class="joinGroup"
      @click="setTextAreaMask(true)"
      v-if="$store.state.isInApp && !isInGroup && joinState === 0"
    >
      申请入群
    </div>
    <div
      class="joinGroup grayColor"
      v-if="$store.state.isInApp && !isInGroup && joinState === 1"
    >
      等待审核
    </div>
    <!-- <div class="joinGroup" @click='reviseGroup' v-if="$store.state.isInApp && isGroupLeader">修改群资料</div> -->
    <div class="joinGroup" @click="goGroupRoom" v-if="isGoChat">进入群聊</div>
    <textArea
      :textAreaData="initialName"
      :show="textAreaMask"
      v-if="textAreaMask"
      @submitText="getTextAreaData"
    ></textArea>
    <!-- <div class='shareIcon' @click='share' v-if="isGroupLeader || joinState === 2"><i class="iconWanwan iconWxiugaiziliao"></i></div> -->
    <scroll
      ref="scroll"
      :scrollbar="scrollbarObj"
      :pullDownRefresh="false"
      :pullUpLoad="false"
      :bounce="false"
      :click="true"
      :listenScroll="true"
      :listenScrollEnd="true"
      @scroll="wrapScroll"
      @scroll-end="scrollEndWrap"
    >
      <!-- <Swiper></Swiper> -->
      <div class="groupInfoPageContent" ref="groupInfoPageContent">
        <div class="groupImg" v-if="groupInfo.imageUlrs">
          <swiper
            :items="groupInfo.imageUlrs"
            :elId="groupId.slice(0, 5)"
            :type="3"
            :autoplay="false"
          />
        </div>
        <div class="groupDetail">
          <div class="groupTitle">{{ groupInfo.groupName }}</div>
          <div class="groupTagList">
            <span class="wanwanNum">多录群号: {{ groupInfo.groupNumber }}</span>
            <div class="tagList">
              <span>
                <i class="iconWanwan iconWstar1 activityNotice"></i
                ><i class="text">{{ groupInfo.groupLevel }}</i>
              </span>
              <span>{{ groupInfo.countMember }}人</span>
              <span>{{ groupLikeCount }}赞</span>
            </div>
          </div>
          <div
            :class="['groupLike', { groupLikeConfirm: groupLike }]"
            @click="handleLike"
          >
            <span>
              <i
                :class="[
                  'iconWanwan',
                  'activityNotice',
                  { iconWxin1: !groupLike },
                  { iconWredXin: groupLike }
                ]"
              ></i>
            </span>
            <span :class="['normalFont', { whiteFont: groupLike }]">{{
              groupLike ? "已赞" : "点赞"
            }}</span>
            <!-- <span :class="{myScale:groupLike}"></span> -->
            <span
              :class="[
                'myXin',
                { myOne: groupLike },
                { otherOne: groupLike === false }
              ]"
              ><i class="iconWanwan iconWxinaixin-copy xinOne"></i
            ></span>
            <span
              :class="[
                'myXin',
                { myTwo: groupLike },
                { otherTwo: groupLike === false }
              ]"
              ><i class="iconWanwan iconWxinaixin-copy xinTwo"></i
            ></span>
            <span
              :class="[
                'myXin',
                { myThree: groupLike },
                { otherThree: groupLike === false }
              ]"
              ><i class="iconWanwan iconWxinaixin-copy xinThree"></i
            ></span>
          </div>
          <div class="groupDesc">
            {{ groupInfo.groupStatement }}
          </div>
          <ul class="groupInfoTags">
            <li @click="goGroupScore">
              <p class="blue">群等级</p>
              <span>LV{{ groupInfo.groupLevel }}</span>
            </li>
            <li>
              <p class="pink">群分类</p>
              <span>
                <i v-if="groupType">{{ groupType.title }}</i>
                <i>-{{ groupInfo.lable }}</i>
              </span>
            </li>
            <li>
              <!-- <p class="">4.24km</p> -->
              <p>地点</p>
              <span class="groupAddressDesc">{{ groupInfo.address }}</span>
            </li>
          </ul>
          <!-- <div class="groupProperty">
          <p class="groupItemTitle">群属性</p>
          <ul class="groupPropertyList borderB">
            <li class='borderB'>
              <div>
                <i class="iconWanwan iconWstar1"></i>
                <span class="propertyNum">151</span>
              </div>
              <p class="property">消息数量</p>
            </li>
            <li class='borderB'>
              <div>
                <i class="iconWanwan iconWstar1"></i>
                <span class="propertyNum">{{groupInfo.averageAge}}</span>
              </div>
              <p class="property">平均年龄</p>
            </li>
            <li class='borderB'>
              <div>
                <i class="iconWanwan iconWstar1"></i>
                <span class="propertyNum">{{groupInfo.countMember}}</span>
              </div>
              <p class="property">活跃人数</p>
            </li>
            <li class='borderB'>
              <div>
                <i class="iconWanwan iconWstar1"></i>
                <span class="propertyNum">{{groupInfo.countFemale}}</span>
              </div>
              <p class="property">女性人数</p>
            </li>
          </ul>
        </div> -->
          <div class="groupUser borderB">
            <p class="groupItemTitle" @click="goGroupMember">
              <span>群成员 {{ groupInfo.countMember }}</span>
              <i class="iconWxiayibu iconWanwan textR"></i>
            </p>
            <ul class="groupUserList">
              <li
                class="specialLi"
                v-if="isGroupLeader || joinState === 2"
                @click="share"
              >
                <span class="addBtn">+</span>
                <p class="addFriend">邀请好友</p>
              </li>
              <li v-for="(item, index) in calculateMembetr" :key="index">
                <div>
                  <div class="userAvatar">
                    <img
                      :src="item.avatar"
                      :class="{
                        defaultAvatar:
                          item.avatar ===
                          'http://file.szwanwan.com:8888/group1/M00/00/48/rBpkyFzourOAHyA6AABbcMMe0wc315.png'
                      }"
                    />
                  </div>

                  <p v-if="item.memberRole === 2">群主</p>
                  <p v-if="item.memberRole === 1">管理员</p>
                </div>
                <p>
                  {{ item.groupNickName ? item.groupNickName : item.nickName }}
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div class="groupSubContent" ref="groupSubContent">
          <tabMove
            class="borderB"
            @scroll="tabMoveScroll"
            ref="tabMove"
            :tabData="tabData"
            @touchstart.native="tabTouchStart($event)"
          ></tabMove>
          <div
            class="pagesTabContent"
            ref="touchContent"
            @touchstart="touchstart($event)"
            @touchmove="touchmove($event)"
            @touchend="touchend($event)"
          >
            <pageItemTab
              v-if="groupInfo.userGroupId"
              :groupId="groupInfo.userGroupId"
              :direction="direction"
              :subIsNotTop="subIsNotTop"
              :subScrollY="subScrollY"
              @pullingDown="onPullingDown"
              @pullingUp="onPullingUp"
              @scroll="subScroll"
              @scroll-end="subScrollEnd"
              @renderEnd="renderEnd"
            ></pageItemTab>
            <activityPageItemTab
              v-if="groupInfo.userGroupId"
              :groupId="groupInfo.userGroupId"
              :direction="direction"
              :subIsNotTop="subIsNotTop"
              :subScrollY="subScrollY"
              @pullingDown="onPullingDown"
              @pullingUp="onPullingUp"
              @scroll="subScroll"
              @scroll-end="subScrollEnd"
            ></activityPageItemTab>
          </div>
        </div>
      </div>
    </scroll>
  </div>
</template>
<script>
const DIRECTION_V = 'vertical';
import Swiper from '@/components/Swiper/swiper';
import tabMove from '@/components/tabMove';
import scroll from '@/components/scroll/scroll';
import scrollMixin from '@/components/scroll/scrollMixin';
import scrollPagesMixin from '@/components/Search/scrollPagesMixin';
import pageItemTab from './components/pageItemTab';
import activityPageItemTab from './components/activityPageItemTab';
import textArea from '@/components/TextArea';
import { mapState } from 'vuex';
import GroupStateBase from './components/GroupStateBase';
export default {
  mixins: [scrollMixin, scrollPagesMixin, GroupStateBase],
  components: {
    Swiper,
    tabMove,
    scroll,
    pageItemTab,
    textArea,
    activityPageItemTab
  },
  data() {
    return {
      // joinState: '',
      isClickLike: false, // 表示是否点击点赞
      isLoading: false,
      isShowBack: true,
      groupLikeCount: '', // 表示点赞数量
      isNeedAnimation: false,
      groupLike: true,
      userImageList: [],
      fromWeixin: false,
      textAreaMask: false, // 用户申请入群的taxtArea
      initialName: {
        maxLen: 25,
        title: '申请入群',
        inputText: `大家好，我是${this.$store.state.user.nickName}`,
        inputHolderText: '',
        toast: '介绍一下自己吧'
      },
      groupMember: [],
      wrapIsBottom: false,
      transY: 0,
      tabData: ['群动态', '群活动'],
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
      allItems: [
        {
          items: [],
          pageIndex: 1,
          pageSize: 6,
          name: 'groupDynamic',
          isLoading: false,
          noData: false,
          noDataT: '没有找到相关群动态，换个词试试吧',
          iconClass: 'iconWwushuju'
        }
      ],
      groupInfo: {},
      tagsLabel: [
        {
          title: '交友',
          tags: ['70后', '80后', '90后', '聚会', '同城', '同乡']
        },
        {
          title: '生活',
          tags: [
            '狗',
            '花草',
            '宗教',
            '宠物',
            '茶文化',
            '家居',
            '健康',
            '母婴',
            '购物',
            '时尚',
            '美容',
            '车友'
          ]
        },
        {
          title: '兴趣',
          tags: ['文学', '摄影', '音乐', '影视', '动漫', '舞蹈', '游戏']
        },
        {
          title: '玩乐',
          tags: ['棋牌', '旅游', '星座', 'K歌', '泡吧', '美食']
        },
        {
          title: '运动',
          tags: ['瑜伽', '马拉松', '健身', '塑形', '养生', '跑步', '台球']
        }
      ]
    }
  },
  activated() {
    this.$share.close()
    this.groupId = this.$route.params.id
    this.isClickLike = false
    if (this.$route.params && this.$route.params.from === 'weixin') {
      this.fromWeixin = true
      this.joinGroupSkip()
    }
    this.getGroupInfo()
  },
  beforeRouteLeave(to, from, next) {
    this.$route.params.from = '';
    next()
  },
  computed: {
    ...mapState(['groupUserList']),
    /**
     * isGoChat表示是显示进入群聊
     */
    isGoChat() {
      // $store.state.isInApp && joinState === 2 || isGroupLeader
      if (this.$store.state.isInApp) {
        if (
          (this.joinState === 2 && this.memberState === 0) ||
          (this.isGroupLeader && this.memberState === 0)
        ) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    userImages() {
      let arr = []
      this.userImageList.map(item => {
        arr.push(item.imageUrl)
      })
      let str = arr.join(' ,') || arr[0]
      return str
    },
    /**
     * calculateMembetr计算成员
     */
    calculateMembetr() {
      if (this.joinState === 2 && !this.isGroupLeader) {
        // 表示我在这个群里面
        return this.groupMember.slice(0, 2)
      } else if (this.isGroupLeader) {
        // 表示我是群主
        return this.groupMember.slice(0, 2)
      } else {
        return this.groupMember.slice(0, 3)
      }
    },
    groupType() {
      let me = this
      return this.tagsLabel.filter(item => {
        return item.tags.indexOf(me.groupInfo.lable) >= 0
      })[0]
    },
    direction() {
      return this.wrapIsBottom ? (this.transX ? '' : DIRECTION_V) : '';
      // return this.canDirection ? this.transX ? '' : DIRECTION_V : ''
    },
    subIsNotTop() {
      return this.subScrollY < 0 ? true : false
    },
    imageUlrs() {
      let imageUlrs = []
      this.groupInfo.imageUlrs.map(item => {
        imageUlrs.push(item.imageUrl)
      })
      return imageUlrs
    }
  },
  methods: {
    renderEnd() {
      this.$refs.scroll && this.$refs.scroll.forceUpdate()
    },
    /**
     * goChatSeting
     */
    goChatSeting() {
      this.$router.push({
        name: 'groupChatSettings',
        params: {
          id: this.groupInfo.userGroupId,
          isTop: false,
          isMute: 1
        }
      })
    },
    goBack() {
      this.$router.back()
    },
    /**
     * handleLike 处理是否喜欢用户
     */
    handleLike() {
      if (this.isClickLike) {
        return
      }
      this.isClickLike = true
      let me = this
      if (me.isNeedAnimation) {
        me.isNeedAnimation = false
      }
      me.isNeedAnimation = true
      if (!this.$store.state.isInApp) {
        window.location.href =
          'https://a.app.qq.com/o/simple.jsp?pkgname=io.dcloud.H50D8112A';
        return
      }
      if (!this.authentication.isLogin()) {
        this.go.login()
        return;
      }
      if (me.groupLike) {
        return
      } else {
        me.api.process({
          url: 'Operate',
          data: {
            objectId: me.groupId,
            oprateType: 2,
            objectType: 4,
            isCancel: true // true表示点赞 false表示取消点赞
          },
          success: function() {
            me.isClickLike = false
            me.groupLike = true
            me.isNeedAnimation = true
            me.groupLikeCount++
          }
        })
      }
    },
    /**
     * getGroupInfo得到群组信息
     */
    getGroupInfo() {
      let me = this
      let url = 'UserGroup/GroupId';
      if (this.groupId.length < 8) {
        url = `${url}?GroupNumber=${me.groupId}`
      } else {
        url = `${url}?GroupId=${me.groupId}`
      }
      if (me.$store.state.pos.longitude && me.$store.state.pos.latitude) {
        url = `${url}&Lon=${me.$store.state.pos.longitude}&Lat=${me.$store.state.pos.latitude}`
      }
      me.api.get({
        url: url,
        success: function(res) {
          me.groupInfo = res
          me.userImageList = res.imageUlrs
          me.groupLike = res.isLike
          me.memberState = res.memberState
          if (res.countLike >= 1000 && res.countLike <= 9999) {
            let newStr = res.countLike.toString()
            let str = newStr.substring(0, 1)
            me.groupLikeCount = str + 'k';
          } else if (res.countLike >= 10000) {
            let newStr = res.countLike.toString()
            let str = newStr.substring(0, 2)
            me.groupLikeCount = str + 'k';
          } else {
            me.groupLikeCount = res.countLike
          }
          if (!me.fromWeixin || me.joinState !== 2) {
            me.joinState = res.askState
          }
          res.userGroupId && me.getGroupMember()
        }
      })
    },
    getGroupMember() {
      let me = this
      me.api.get({
        url: `GroupMember?GroupId=${me.groupInfo.userGroupId}`,
        success: function(res) {
          me.groupMember = res
          // if (me.isGoChat){
          //   me.$store.dispatch('ws/insertForm', {
          //     formName: 'user',
          //     keys: ['avatar', 'nickName', 'userId'],
          //     arr: res
          //   })
          // }
        }
      })
    },
    joinGroupSkip() {
      let me = this
      me.api.process({
        url: 'GroupMember',
        data: {
          groupId: me.groupId,
          isSkip: true
        },
        success: function() {
          me.joinState = 2
        }
      })
    },
    joinGroup(msg) {
      let me = this
      me.api.process({
        url: 'GroupMember',
        data: {
          groupId: me.groupInfo.userGroupId,
          askRemark: msg
        },
        success: function() {
          me.isLoading = false
          me.joinState = 1
        },
        error: function(res) {
          if (typeof res === 'string') {
            me.$toast(res)
          } else {
            me.$toast('申请失败')
          }
        }
      })
    },
    subScroll(pos) {
      this.subScrollY = pos.y > 0 ? 0 : pos.y
    },
    subScrollEnd(pos) {
      this.subScrollY = pos.y > 0 ? 0 : pos.y
    },
    wrapScroll(pos) {
      this.wrapScrollY = pos.y
      if (pos.y <= -200) {
        this.isShowBack = false
      } else {
        this.isShowBack = true
      }
      if (
        pos.y ===
        this.$refs.groupInfoPage.offsetHeight -
          this.$refs.groupInfoPageContent.offsetHeight
      ) {
        this.wrapIsBottom = true
      } else {
        this.wrapIsBottom = false
      }
    },
    onPullingUp() {},
    onPullingDown() {},
    tabTouchStart() {
      // this.subIsNotTop && e.stopPropagation()
    },
    // touchStart (e) {
    //   this.subIsNotTop && e.stopPropagation()
    // },
    scrollEndWrap(pos) {
      if (
        pos.y ===
        this.$refs.groupInfoPage.offsetHeight -
          this.$refs.groupInfoPageContent.offsetHeight
      ) {
        this.wrapIsBottom = true
      } else {
        this.wrapIsBottom = false
      }
    },
    /**
     * goGroupScore群等级页面
     */
    goGroupScore() {
      // this.$router.push({name: 'groupScore', params: {id: 1}})
    },
    setTextAreaMask(data) {
      if (data && this.isLoading) {
        return
      }
      this.textAreaMask = data
    },
    getTextAreaData(data) {
      if (data) {
        this.isLoading = true
        this.joinGroup(data.inputText)
      }
      this.setTextAreaMask(false)
    },
    goGroupRoom() {
      // this.go.nameAParams('chatRoom', {
      //     id: this.groupId,
      //     type: 1
      // })
      // console.log('是进入群聊呢',this.groupInfo.groupName)
      // return
      this.go.nameAParams('chatRoom', {
        id: this.groupId,
        type: 1,
        share: false,
        name: this.groupInfo.groupName
      })
      // return
      // window.goDialog('group', this.groupInfo.userGroupId, this.groupInfo.groupName)
    }
  }
}
</script>
<style lang="less">
@keyframes moveScale {
  0% {
    background: white;
    transform: scale(0);
    opacity: 1;
  }
  50% {
    background: white;
    transform: scale(2);
    opacity: 0.6;
  }
  100% {
    background: white;
    transform: scale(2.1);
    opacity: 0;
  }
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
.ListItem {
  height: 20vw;
}
.groupInfoPage {
  height: 100vh;
  color: var(--dGray);
  // border:1px solid  blue;
  overflow: hidden;
  .groupInfoBack {
    width: 10vw;
    height: 13.34vw;
    line-height: 13.6vw;
    position: fixed;
    z-index: 300;
    left: 7.5vw;
    top: 0;
    .activityNotice {
      color: white;
      font-size: 4.63vw;
      font-weight: bold;
      text-shadow: 0 0 4px #000;
    }
  }
  .groupFixed {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 22;
    width: 100%;
    height: 12vw;
    background: white;
    .otherFixedTwo {
      width: 50vw;
      margin: auto;
      font-size: 0;
      .name {
        display: inline-block;
        width: 50vw;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-wrap: break-word;
        word-break: break-all;
      }
    }
    .name {
      display: inline-block;
      width: 100%;
      height: 12vw;
      line-height: 12vw;
      font-size: 4.25vw;
      font-weight: bold;
      letter-spacing: 0.4vw;
      color: #333333;
      // margin:auto;
      text-align: center;
    }
    .code {
      height: 4.2vw;
      line-height: 4.5vw;
      display: inline-block;
      width: 100%;
      font-size: 2.8vw;
      color: #999999;
      letter-spacing: 0.3vw;
      // margin:auto;
      text-align: center;
    }
  }
  .shareIcon {
    position: fixed;
    top: 0;
    right: 0;
    width: 15vw;
    height: 12vw;
    line-height: 12.7vw;
    text-align: center;
    z-index: 300;
    .iconWbianji {
      font-size: 6vw;
      font-weight: bold;
      color: white;
      text-shadow: 0 0 4px #000;
    }
  }
  .joinGroup {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 6.9vw;
    width: 88vw;
    height: 14.17vw;
    background-color: rgba(255, 40, 66, 0.9);
    z-index: 2;
    color: white;
    text-align: center;
    line-height: 14.17vw;
    border-radius: 8vw;
    font-size: 5vw;
    margin: auto;
    &.grayColor {
      color: #fff;
      background-color: var(--lGray);
    }
  }
  .groupDetail {
    padding: 0 3.7vw;
    position: relative;
    margin-top: 2vw;
    .groupTitle {
      font-size: 6vw;
      height: 9.25vw;
      line-height: 9.25vw;
      letter-spacing: 2px;
    }
    .groupTagList {
      font-size: 0;
      height: 5.9vw;
      line-height: 5.9vw;
      margin-bottom: 3vw;
      display: flex;
      .wanwanNum {
        display: inline-block;
        font-size: var(--nText);
        color: var(--lGray);
        margin-right: 2vw;
      }
      .tagList {
        width: 50vw;
        text-align: center;
        font-size: 0;
        display: flex;
        align-items: center;
        span {
          display: inline-block;
          width: 11vw;
          height: 5.8vw;
          border-radius: 3vw;
          margin-left: -0.5vw;
          font-size: 11px;
          color: white;
          text-align: center;
          line-height: 5.8vw;
          transform: scale(0.8);
          .iconWanwan {
            margin-left: -1vw;
            margin-right: 1vw;
          }
          .text {
            // line-height: 5.75vw;
            vertical-align: top;
          }
          i {
            display: inline-block;
            font-style: normal;
          }
        }
        span:nth-child(1) {
          background-color: #fe8d54;
          // margin-right: -1vw;
          .activityNotice {
            color: #fdda35;
          }
        }
        span:nth-child(2) {
          background-color: #4dd3e7;
        }
        span:last-child {
          margin-left: -1vw;
          background-color: #9bd941;
          line-height: 6vw;
        }
      }
    }
    .groupLike {
      width: 13.11vw;
      height: 13.11vw;
      border-radius: 50%;
      margin-left: 25vw;
      background: white;
      box-shadow: 0px 0px 2px rgb(197, 197, 197);
      display: flex;
      text-align: center;
      align-content: center;
      flex-flow: row wrap;
      position: absolute;
      top: 0vw;
      right: 4vw;
      transition: all 0.2s;
      z-index: 20000;
      span:nth-child(1) {
        display: inline-block;
        width: 13.11vw;
        height: 7vw;
        line-height: 8vw;
        position: relative;
        z-index: 20000;
      }
      .normalFont {
        display: inline-block;
        width: 13.11vw;
        color: #666;
        font-size: 3vw;
        height: 5vw;
      }
      .whiteFont {
        color: white;
      }
      .myXin {
        // border:1px solid blue;
        position: absolute;
        bottom: 3vw;
        left: 3.5vw;
        opacity: 0;
        background: linear-gradient(
          to left,
          #ff8a81,
          #fe6fa3
        ); // 给字体设置渐变
        -webkit-background-clip: text;
        color: transparent;
      }
      .myOne {
        animation: floatOne 1.5s linear forwards;
        font-size: 3vw;
        z-index: 20000;
      }
      .otherOne {
        animation: OtherfloatOne 1.5s linear forwards;
        font-size: 3vw;
        z-index: 20000;
      }
      .myTwo {
        animation: floatTwo 1.5s linear forwards;
        font-size: 5vw;
        z-index: 20000;
        .xinTwo {
          font-size: 5.5vw;
        }
      }
      .otherTwo {
        animation: OtherfloatTwo 1.5s linear forwards;
        font-size: 5vw;
        z-index: 20000;
        .xinTwo {
          font-size: 5.5vw;
        }
      }
      .myThree {
        animation: floatThree 1.5s linear forwards;
        font-size: 3vw;
        z-index: 20000;
      }
      .otherThree {
        animation: OtherfloatThree 1.5s linear forwards;
        font-size: 3vw;
        z-index: 20000;
      }
      .myScale {
        display: inline-block;
        position: absolute;
        top: 2vw;
        left: 0;
        right: 0;
        margin: 0 auto;
        width: 3.5vw;
        height: 3.5vw;
        border-radius: 50%;
        // border:1px solid pink;
        border: 1px solid rgba(255, 192, 203, 0.6);
        // box-shadow: 0 0 2px rgb(243,243,243);
        animation: moveScale 0.7s 0s forwards;
        //  background: linear-gradient(to right, red, blue);
        // -webkit-background-clip: text;
        // color: transparent;
      }
      .activityNotice {
        font-size: 6vw;
        color: rgb(253, 133, 132);
      }
      .iconWredXin {
        color: white;
      }
    }
    .groupLikeConfirm {
      background: linear-gradient(
        to left,
        rgb(255, 138, 129),
        rgb(254, 111, 163)
      );
      transition: all 0.2s;
    }

    .groupDesc {
      line-height: 6.66vw;
      color: var(--mGray);
      font-size: var(--mText);
    }
    .groupInfoTags {
      display: flex;
      margin: 4.9vw 0;
      li {
        flex: 1;
        min-height: 20.37vw;
        border-radius: 3vw;
        border: 1px solid #cdcdcd;
        padding: 0 3vw;
        p {
          margin-top: 2.4vw;
          letter-spacing: 1px;
        }
        i {
          font-style: normal;
        }
        span {
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
    .groupProperty {
      .groupItemTitle {
        height: 7.7vw;
        line-height: 7.7vw;
        font-size: 4.6vw;
      }
      .groupPropertyList {
        font-size: 0;
        li {
          display: inline-block;
          height: 26vw;
          width: 38vw;
          padding-top: 5.46vw;
          margin-left: 2vw;
          box-sizing: border-box;
          &:nth-child(2n) {
            margin-left: 12vw;
          }
          > div {
            height: 10vw;
            line-height: 10vw;
            font-size: 6vw;
            .iconWanwan {
              display: inline-block;
              width: 10vw;
              color: var(--mRed);
            }
          }
          .property {
            height: 7.7vw;
            line-height: 7.7vw;
            color: var(--lGray);
            font-size: var(--mText);
            letter-spacing: 1px;
          }
        }
      }
    }
    .groupUser {
      .groupItemTitle {
        display: flex;
        margin: 3vw 0;
        span {
          flex: 1;
        }
        i {
          width: 10vw;
          text-align: center;
          font-size: 4vw;
          color: var(--lGray);
        }
      }
      .groupUserList {
        display: flex;
        width: 100%;
        overflow: hidden;
        .specialLi {
          flex: 1;
          text-align: center;
          max-width: 30vw;
          position: relative;
          .addBtn {
            display: inline-block;
            height: 26.5vw;
            width: 26.5vw;
            border-radius: 50%;
            background: rgb(243, 243, 243);
            text-align: center;
            line-height: 26.5vw;
            font-size: 7vw;
            color: #666;
          }
          .addFriend {
            width: 100%;
            position: absolute;
            top: 26.5vw;
            left: 0;
            font-size: var(--nText);
            color: #6e6e6e;
          }
        }
        li {
          flex: 1;
          text-align: center;
          max-width: 30vw;
          > div {
            position: relative;
            height: 26.5vw;
            width: 26.5vw;
            margin: 0 auto;
            p {
              position: absolute;
              left: 50%;
              margin-left: -6.4vw;
              width: 12.8vw;
              height: 5.56vw;
              line-height: 5.56vw;
              margin-top: -2.78vw;
              color: #fff;
              font-size: var(--nText);
              background: var(--mRed);
              border-radius: 2.78vw;
            }
            .userAvatar {
              width: 100%;
              height: 100%;
              border: 1px solid #eee;
              border-radius: 50%;
              position: relative;
              img {
                height: 100%;
                width: 100%;
                border-radius: 50%;
              }
              .defaultAvatar {
                width: 18vw;
                height: 18vw;
                border-radius: 0;
                position: absolute;
                top: 0;
                bottom: 0;
                right: 0;
                left: 1vw;
              }
            }
          }
          p {
            height: 11.11vw;
            line-height: 11.11vw;
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
  .groupInfoPageContent {
    min-height: 150vh;
    .groupImg {
      width: 100%;
      // height:69.81vw;
      height: 100vw;
      overflow: hidden;
    }
  }
  .groupSubContent {
    .tabList {
      height: 15.8vw;
      line-height: 15.8vw;
      span {
        width: 39vw;
      }
      i {
        bottom: 2.4vw;
      }
    }
    .pagesTabContent {
      font-size: 0;
      height: calc(100vh - 24vw);
      width: 200vw;
      background: #fff;
      overflow: hidden;
      .DynamicTabContent {
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
.shareBtn {
  width: 10vw;
  height: 13.34vw;
  line-height: 13.6vw;
  position: fixed;
  z-index: 100;
  right: 1.5vw;
  top: 0;
  .activityNotice {
    color: white;
    font-size: 4.63vw;
    font-weight: bold;
    text-shadow: 0 0 4px #000;
  }
}
</style>
