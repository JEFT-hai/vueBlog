<template>
  <div class="activityPage">
    <pickerCityList :show='hasMask && pickerCityMask'
                    @hidePickerCity='setPickerCity(false)'
                    @pickerCity='pickerCity'></pickerCityList>
    <div v-show="hasMask && actionMask"
         class="acMask"
         @click="setActionMask(false)"></div>
    <pickerList :show='hasMask && pickerShow'
                :pickerItem='curPickerItem'
                :items='pickerItems'
                :pickerTop='pickerTop'
                :pickerLeft='pickerLeft'
                @hidePicker='setPicker(false)'
                @picker='picker'></pickerList>
    <Search :tabList='searchTabList'
            v-if='hasMask && searchMask'
            :searchType='searchType'
            @flas='setSearchMask(false)'
            placeholder='搜出你想要的活动吧!'></Search>
    <div class='activitySearch'>
      <p class='position'
         @click="setPickerCity(true)">
        <i class="iconWposition iconWanwan"></i>
        {{posCity}}
      </p>
      <div class="searchWrap">
        <i class="iconWsearch iconWanwan"></i>
        <input @click='setSearchMask(true)'
               type="text"
               placeholder="大家都在搜'去哪玩'"
               readonly />
      </div>
      <p class="moreActions"
         @click="setActionMask(true)">
        <i class="iconWet-more iconWanwan"></i>
      </p>
      <transition name='fadeIn'>
        <div v-show="actionMask"
             class="actionMask">
          <div class="closeAction iconWanwan iconWquxiao"
               @click="setActionMask(false)"></div>
          <ul>
            <!-- <li @click="goPost">
                    <i class="iconWanwan iconWfabuhuodong" style="font-weight: bold;"></i>
                    <p class="borderB">发布活动</p>
                  </li> -->
            <!-- <li @click="goMailList">
                    <i class="iconWanwan iconWfabuhuodong"></i>
                    <p class="borderB">通讯录</p>
                  </li> -->
            <li @click="goPersonChat"
                v-if='$store.state.isZijiren'>
              <i class="iconWanwan iconWxinjian"></i>
              <p class="borderB">去到个人消息</p>
            </li>
            <li @click="goGroupChat"
                v-if='$store.state.isZijiren'>
              <i class="iconWanwan iconWxinjian"></i>
              <p class="borderB">去到群聊消息</p>
            </li>
            <li @click="goChatList"
                v-if='$store.state.isZijiren'>
              <i class="iconWanwan iconWxinjian"></i>
              <p class="borderB">通讯录</p>
            </li>
            <li @click="goVote"
                v-if='$store.state.isZijiren'>
              <i class="iconWanwan iconWfabuhuodong"></i>
              <p class="borderB">投票活动</p>
            </li>
            <!-- <li @click="goCreate">
                    <i class="iconWanwan iconWxinjian"></i>
                    <p class="borderB">我要建群</p>
                  </li> -->
            <li @click="goSetting"
                v-if='$store.state.isZijiren'>
              <i class="iconWanwan iconWxinjian"></i>
              <p class="borderB">设置资料</p>
            </li>
            <li @click="goSetPersonal"
                v-if='$store.state.isZijiren'>
              <i class="iconWanwan iconWxinjian"></i>
              <p class="borderB">个人消息设置</p>
            </li>

            <li @click="goG">
              <i class="iconWanwan iconWwodehuodong"></i>
              <p class="borderB">我的活动</p>
            </li>
            <li @click='goVideo'>
              <i class="iconWanwan iconWchakantieziguanzhu"
                 style="font-weight: bold;"></i>
              <p class="borderB">我的关注</p>
            </li>
            <li @click='goGroupList'>
              <i class="iconWanwan iconWduoren-copy"></i>
              <p class="borderB">我的群组</p>
            </li>
          </ul>
        </div>
      </transition>
    </div>
    <ul class="tabList fixedTabList "
        v-if="showFixed"
        ref='tabList'>
      <li :class="activeType.value!==0?'curTab':''"
          @click="showPicker('activetypes', 'activeType', activeType, $event)">
        <span v-show="!activeType.label || activeType.label === '全部'">分类</span>
        <span v-show="activeType.label !== '全部'">{{activeType.label}}</span>
        <i :class="curPickerItem === activeType?'iconWxiangxia1 iconWanwan rotate':'iconWxiangxia1 iconWanwan'"></i>
      </li>
      <li :class="activeHot.value!==0?'curTab':''"
          @click="showPicker('activehots', 'activeHot', activeHot, $event)">
        <!-- <span >{{activeHot.label}}</span> -->
        <span v-show="!activeHot.label || activeHot.label === '全部'">位置</span>
        <span v-show="activeHot.label !== '全部'">{{activeHot.label}}</span>
        <i :class="curPickerItem === activeHot?'iconWxiangxia1 iconWanwan rotate':'iconWxiangxia1 iconWanwan'"></i>
      </li>
      <li :class="activeTime.value!=='0'?'curTab':''"
          @click="showPicker('activetimes', 'activeTime', activeTime, $event)">
        <span>{{activeTime.label}}</span>
        <i :class="curPickerItem === activeTime?'iconWxiangxia1 iconWanwan rotate':'iconWxiangxia1 iconWanwan'"></i>
      </li>
      <li :class="activeFree.value!==0?'curTab':''"
          @click="showPicker('activeFrees', 'activeFree', activeFree, $event)">
        <span v-show="!activeFree.label || activeFree.label === '全部'">价格</span>
        <span v-show="activeFree.label !== '全部'">{{activeFree.label}}</span>
        <i :class="curPickerItem === activeFree?'iconWxiangxia1 iconWanwan rotate':'iconWxiangxia1 iconWanwan'"></i>
      </li>
    </ul>
    <div class="contentList">
      <loading v-if='isLoading'></loading>
      <notFound v-if='noData'
                :failTitle='noDataT'
                :iconClass='iconClass'></notFound>
      <div class='scrollWrapper'
           v-if='!noData && !isLoading'>
        <scroll ref="scroll"
                :data="activities"
                :scrollbar="scrollbarObj"
                :pullDownRefresh="pullDownRefreshObj"
                :pullUpLoad="pullUpLoadObj"
                :startY="parseInt(startY)"
                @pullingDown="onPullingDown"
                @pullingUp="onPullingUp"
                :listenScroll="true"
                :listenScrollEnd="true"
                @scroll="scroll"
                @scroll-end="scrollEnd"
                :scrollX='true'
                :probeType='3'
                class="mBg">
          <swiper v-if="hasBanner"
                  ref='activitySwiper'
                  :type='0'
                  elId='activity'
                  :items='bannerData'
                  :canClick='true'></swiper>
          <ul class="tabList">
            <li :class="activeType.value!==0?'curTab':''"
                @click="showPicker('activetypes', 'activeType', activeType, $event)">
              <span v-show="!activeType.label || activeType.label === '全部'">分类</span>
              <span v-show="activeType.label !== '全部'">{{activeType.label}}</span>
              <i :class="curPickerItem === activeType?'iconWxiangxia1 iconWanwan rotate':'iconWxiangxia1 iconWanwan'"></i>
            </li>
            <li :class="activeHot.value!==0?'curTab':''"
                @click="showPicker('activehots', 'activeHot', activeHot, $event)">
              <!-- <span >{{activeHot.label}}</span> -->
              <span v-show="!activeHot.label || activeHot.label === '全部'">位置</span>
              <span v-show="activeHot.label !== '全部'">{{activeHot.label}}</span>
              <i :class="curPickerItem === activeHot?'iconWxiangxia1 iconWanwan rotate':'iconWxiangxia1 iconWanwan'"></i>
            </li>
            <li :class="activeTime.value!=='0'?'curTab':''"
                @click="showPicker('activetimes', 'activeTime', activeTime, $event)">
              <span>{{activeTime.label}}</span>
              <i :class="curPickerItem === activeTime?'iconWxiangxia1 iconWanwan rotate':'iconWxiangxia1 iconWanwan'"></i>
            </li>
            <li :class="activeFree.value!==0?'curTab':''"
                @click="showPicker('activeFrees', 'activeFree', activeFree, $event)">
              <span v-show="!activeFree.label || activeFree.label === '全部'">价格</span>
              <span v-show="activeFree.label !== '全部'">{{activeFree.label}}</span>
              <i :class="curPickerItem === activeFree?'iconWxiangxia1 iconWanwan rotate':'iconWxiangxia1 iconWanwan'"></i>
            </li>
          </ul>
          <ul>
            <activityItem v-for="item in activities"
                          :key="item.activityId"
                          :item='item'></activityItem>
          </ul>
        </scroll>
      </div>
    </div>
  </div>
</template>
<script>
// import groupList from '@/components/RecommendFollow/recommendGroupList'
import pickerList from './components/pickerList'
import pickerCityList from './components/pickerCityList'
import activityItem from '@/components/activityItem'
import pickerMixin from './components/pickerMixin'
import { mapState, mapMutations } from 'vuex'
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
// import upDateMask from '@/components/mixins/upDateMask'
import Search from '@/components/Search/Search'
import loading from '@/components/requestState/isLoading'
import notFound from '@/components/requestState/noData'
import swiper from '@/components/Swiper/swiper'
export default {
  mixins: [scrollMixin, pickerMixin],
  name: 'discoverHome',
  components: {
    // groupList,
    scroll,
    pickerList,
    activityItem,
    pickerCityList,
    Search,
    loading,
    notFound,
    swiper
  },
  data () {
    return {
      searchMask: false,
      searchType: '活动',
      searchTabList: ['动态', '用户', '活动', '群组'],
      pullDownRefresh: true,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: true,
      bounce: false,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更多活动了',
      activities: [],
      allActiveType: {},
      activeType: {},
      activeTime: {},
      activeHot: {},
      activeFree: {},
      map: null,
      geoLocation: null,
      local: null,
      mylocal: {},
      targetP: {},
      curPage: 1,
      pageSize: 4,
      allImg: [],
      onlyCity: false,
      actionMask: false,
      pickerCityMask: false,
      curCity: '',
      isLoading: false,
      noData: false,
      noDataT: '没有找到相关活动，换个关键字试试吧',
      iconClass: 'iconWjigou_wushuju',
      top2: [],
      bottomOhter: [],
      bannerData: [],
      showFixed: false,
      scrollYNow: 0,
      scrollIsEnd: false,
      toTop: false
    }
  },
  created () {
    this.getBanner()
    this.getActiveConditions()
  },
  activated () {
    // if (this.$route.query.refresh) {
    //   this.getHomeData(true)
    //   this.$nextTick(() => {
    //     this.$refs.scroll && this.$refs.scroll.refresh()
    //   })
    // } else {
    //   this.$refs.scroll && this.$refs.scroll.refresh()
    // }
  },
  computed: {
    ...mapState(['user', 'activeConditions', 'pos', 'hasMask']),
    posCity () {
      if (this.curCity) {
        return this.curCity
      } else {
        if (this.pos.city) {
          return this.pos.city.split('市')[0]
        } else {
          return '深圳'
        }
      }
    },
    regionList () {
      let region = window.regionData.filter((item) => {
        return item.cityName.split('市')[0] === this.posCity
      })
      // console.log(region[0].locationAreas[0].areaName, 'region')
      if (region[0] && region[0].locationAreas[0].areaName !== '全部') {
        region[0] && region[0].locationAreas.unshift({
          areaName: '全部',
          locationAreaId: region[0].locationAreaId,
          locationCityId: region[0].locationCityId
        })
      }
      region[0] && region[0].locationAreas.map((item, index) => {
        item.label = item.areaName
        item.value = index
      })
      return region[0] && region[0].locationAreas
    },
    hasBanner () { // 是否显示轮播图
      return this.bannerData.length
    },
    bannerH () { // 轮播图的高度
      return this.hasBanner ? 130 : 0
    }
  },
  watch: {
    regionList (newV) {
      this.$set(this.allActiveType, 'activehots', newV)
      this.$store.commit('updateActiveConditions', this.allActiveType)
    },
    posCity () {
      console.log('我是切换城市')
      this.getBanner()
    }
  },
  methods: {
    ...mapMutations(['userPos', 'updateActiveConditions', 'setMask', 'upColor', 'updateChangeFans']),
    getBanner () {
      let me = this
      me.api.get({
        url: `Banner?bannerPosition=1&City=${me.posCity}市`,
        success: function (res) {
          me.bannerData = res
        }
      })
    },
    // 选择类型
    resetPage () {
      this.$refs.scroll && this.$refs.scroll.forceUpdate()
      this.setMask(false)
      this.setActionMask(false)
      this.curPickerItem = {}
    },
    initTypes () {
      this.activeType = this.activeConditions.activetypes[0] && this.activeConditions.activetypes[0]
      this.activeTime = this.activeConditions.activetimes[0] && this.activeConditions.activetimes[0]
      this.activeFree = this.activeConditions.activeFrees[0] && this.activeConditions.activeFrees[0]
      // this.activeConditions.activeHots = this.regionList
      this.activeHot = this.regionList[0]
      this.getHomeData(this.activetype)
    },
    submitData: function (method, val) {
      let me = this
      if (me.formLoading) {
        return
      }
      me.formLoading = true
      let formData = new FormData()
      formData.append('val', val)
      me.api.process({
        file: 'User',
        method: method,
        data: formData,
        success: function (res) {
          me.updateUserInfo(res.userInfo)
        },
        error: function (res) {
          me.showError(res.msg)
        },
        complete: function () {
          me.formLoading = false
        }
      })
      return false
    },
    getHomeData (Update) {
      var me = this
      // !me.activities.length && (me.isLoading = true)
      !Update && !me.activities.length && (me.isLoading = true)
      me.noData = false
      let IsFee = !(me.activeFree.value === 1)
      let url = `Activity?ActiveTimes=${me.activeTime.value}&City=${me.posCity}市&PageIndex=${me.curPage}&PageSize=${me.pageSize}`
      if (me.activeType.value) {
        url = `${url}&ActivityCategoryId=${me.activeType.value}`
      }
      if (me.activeFree.value) {
        url = `${url}&IsFee=${IsFee}`
      }
      if (me.activeHot.value) {
        url = `${url}&District=${me.activeHot.label}`
      }
      me.api.get({
        url: url,
        success: function (res) {
          me.curPage === 1 && (me.activities = [])
          me.activities = me.activities.concat(res)
          !me.activities.length && (me.noData = true)
          // eslint-disable-next-line
          me.activities.length && (me.showFixed = (me.curPage !== 1), me.scrollYNow = 0)
        },
        complete: function () {
          me.isLoading = false
        }
      })
    },
    resetData () {
      // this.activities = []
      this.curPage = 1
      this.getHomeData(true)
    },
    getActiveConditions () {
      var me = this
      // let formData = new FormData()
      // formData.append('id', id)
      me.api.get({
        url: 'Condition/id',
        success: function (res) {
          me.allActiveType = res
          me.allActiveType.activetypes.unshift({
            label: '全部',
            value: 0
          })
          me.allActiveType.activehots = me.regionList
          me.$store.commit('updateActiveConditions', me.allActiveType)
          me.initTypes()
        }
      })
    },
    onPullingDown () {
      this.resetData()
    },
    onPullingUp () {
      // 更新数据
      this.curPage++
      this.getHomeData()
    },
    setActionMask (data) {
      this.pickerShow && this.setPicker(false)
      this.actionMask = data
      this.setMask(data)
    },
    setPickerCity (data) {
      this.pickerCityMask = data
      this.setMask(data)
    },
    pickerCity (item) {
      this.curCity = item
      this.setPickerCity(false)
      this.resetPage()
      this.curPage = 1
      this.initTypes()
      // this.resetData()
    },
    setSearchMask (data) {
      this.searchMask = data
      this.setMask(data)
    },
    /**
     * goMailList去 通讯录
     */
    goMailList () {
      this.$router.push({ name: 'mailList' })
    },
    goPost () {
      if (!this.$store.state.isInApp) {
        window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=io.dcloud.H50D8112A'
        return
      }
      if (!this.authentication.isLogin()) {
        this.go.login()
        return
      }
      if (!this.$store.state.user.groupCount) {
        this.$alert('您必须先创建群组，才能发布活动', 1500)
        return
      }
      this.setActionMask(false)
      this.$router.push({ name: 'activityPost' })
    },
    goCreate () {
      if (!this.$store.state.isInApp) {
        window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=io.dcloud.H50D8112A'
        return
      }
      if (!this.authentication.isLogin()) {
        this.go.login()
        return
      }
      this.setActionMask(false)
      this.$router.push({ name: 'groupCreate' })
    },
    goSetting () {
      this.$router.push({ name: 'groupChatSettings',
        params: {
          id: '74a43a19-befa-4e0f-a5d2-91e29d51ea7d',
          isTop: false,
          isMute: 1
        }
      })
    },
    goSetPersonal () {
      this.$router.push({ name: 'userChatSettings',
        params: {
          id: 'e5b32372-fabb-489c-ae40-8c00bf47d3af', // 79f1eb63-11ff-4b6d-bc7e-aa07557d9cdd  e5b32372-fabb-489c-ae40-8c00bf47d3af
          isTop: false,
          isMute: 1
        }
      })
    },
    goG () {
      this.setActionMask(false)
      // this.$router.push({ name: 'groupInfo', params: { id: 1 } })
      this.$router.push({ name: 'activityList' })
    },
    goVideo () {
      this.setActionMask(false)
      this.$store.commit('upColor', 3)
      // this.$router.push({ name: 'videoPlayer', params: { id: 1 } })
      this.$router.push({ name: 'my_follows', params: { id: this.user.userId, type: 1, label: 3 } })
    },
    goVote () { // 去投票页
      this.setActionMask(false)
      this.$router.push({ name: 'activityVote' })
      // this.$router.push({name: 'groupMemberList'})
    },
    goPersonChat () {
      this.$router.push({name: 'person_chat'})
    },
    goGroupChat () {
      this.$router.push({name: 'group_chat'})
    },
    goChatList () {
      this.$router.push({name: 'home_chat'})
    },
    goGroupList () {
      this.setActionMask(false)
      this.$store.commit('updateChangeFans', 3)
      this.$router.push({ name: 'my_followme', params: { id: this.user.userId, routerType: 1 } })
    },
    scroll (pos) {
      if (pos.y + this.bannerH < 0) {
        this.scrollYNow = pos.y
        this.showFixed = true
      } else {
        this.scrollYNow = pos.y
        this.showFixed = false
      }
    },
    scrollEnd () {
      if (this.toTop) {
        this.showPicker(this.isPicker.name, this.isPicker.str, this.isPicker.item, this.isPicker.event)
      } else {
        return
      }
      this.toTop = false
    }
  }
}
</script>
<style lang="less">
.fixedTabList{
  position: fixed !important;
  top: 11.03vw;
  left: 0;
  width: 100vw;
  // display: none !important;
  &.showFixedTabList{
    display: flex !important;
  }
}
@keyframes rotate18 {
  0%{
    transform: rotate(0);
  }
  100%{
    transform: rotate(180deg);
  }
}
  .activityPage{
      background: #fff;
    .guideMask{
      box-sizing: content-box;
      position: fixed;
      z-index:100;
      top: 0;
      right: 0;
      width: 14vw;
      height: 11vw;
      // overflow: hidden;
      &::before{
        position: absolute;
        content: '';
        width: 100%;
        height: 100%;
        right: -1000px;
        top: -1000px;
        border-width: 1000px;
        border-style: solid;
        border-color: rgba(0, 0, 0, .7);
        border-radius: 50%;
        box-shadow: inset 0 0 5px 2px rgba(0,0,0,.75);
      }
    }
    .acMask{
      position: fixed;
      z-index:15;
      top: 0;
      left: 0;
      bottom:0;
      right: 0;
      background: transparent;
    }
    i{
        color: var(--mRed);
    }
    .activitySearch{
        position: relative;
        display: flex;
        width: 100vw;
        height: 8.33vw;
        line-height: 8.33vw;
        padding: 1.8vw 0 0.9vw;
        box-sizing: content-box;
        .actionMask{
          &.fadeIn-enter-active, &.fadeIn-leave-active{
            transition: opacity .2s ease-in-out;
          }
          &.fadeIn-leave-active{
            transition: opacity .05s ease-in-out;
          }
          &.fadeIn-enter, &.fadeIn-leave-to{
            opacity: 0;
          }
          position: absolute;
          z-index: 20;
          top: 13.33vw;
          right: 2vw;
          width: 42vw;
          border-radius: 1.11vw;
          background: #fff;
          .closeAction{
            position: absolute;
            top: -11.4vw;
            right: 0;
            height: 11.4vw;
            line-height: 11.4vw;
            width: 10.55vw;
            border-radius: 1.11vw 1.11vw 0 0;
            background: #fff;
            box-shadow: 0 1px 5px #999999;
            text-align: center;
            font-size: var(--mText);
            color: var(--mRed);
            &::after{
              position: absolute;
              content: '';
              width: 110%;
              height: 6px;
              top: 100%;
              right: 0;
              background: #fff;
            }
          }
          ul{
            box-shadow: 0 1px 5px #999999;
            li{
              display: flex;
              height:12.4vw;
              line-height: 12.4vw;
              i{
                width: 15.3vw;
                text-align: center;
                font-size: 6vw;
              }
              p{
                flex: 1;
                color: var(--dGray);
                font-size: var(--nText);
                text-align: left;
              }
            }
          }
        }
        p{
            text-align: center;
            color: var(--mRed);
            font-size: var(--mText);
        }
        .position{
            width:21.48vw;
            color: var(--dGray);
            i{
              color: var(--mGray);
            }
        }
        .searchWrap{
            flex: 1;
            background-color: #f5f5f5;
            color: var(--lGray);
            border-radius: 4.17vw;
            display: flex;
            i{
                width: 7.4vw;
                text-align: center;
                color: inherit;
            }
            input{
                flex: 1;
                border: none;
                outline: none;
                vertical-align: top;
                height: 8.33vw;
                line-height: 8.33vw;
                background-color: transparent;
                letter-spacing: 1px;
            }
        }
        .moreActions{
          width: 14.07vw;
          .iconWet-more{
            color: var(--dGray);
          }
        }
    }
    .tabList{
        display:flex;
        height: 9.25vw;
        line-height: 9.25vw;
        color: var(--nText);
        position: relative;
        z-index: 10;
        background: #fff;
        box-shadow: 0 0px 1px #fafafa;
        font-weight: bold;
        .curTab{
          color: var(--mRed);
        }
        .rotate{
          animation: rotate18 .2s 1 ease;
          transform: rotate(180deg);
          color: var(--mRed);
        }
        li{
            flex: 1;
            text-align: center;
            font-size: var(--nText);
            color: var(--mGray);
            i{
                display: inline-block;
                margin-left: 1.1vw;
                color: inherit;
                // transform: rotate(180deg);
                // font-size: var(--nText);
            }
            span {
                display: inline-block;
            }
        }
    }
    .contentList{
      position: relative;
      // height: calc(100vh - 9.25vw - 8.33vw - 12vw - 2.7vw);
      height: calc(100vh - 8.33vw - 12vw - 2.7vw);
      background: var(--mBg);
      overflow: hidden;
      .scrollWrapper{
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
    }
  }
</style>
