<template>
  <div class="scrollPages">
    <tabMove @scroll='tabMoveScroll'
             ref='tabMove'
             :tabData="tabData"></tabMove>
    <div class="searchContent"
         ref='touchContent'
         @touchstart="touchstart($event)"
         @touchmove="touchmove($event)"
         @touchend="touchend($event)"
         :style="{width: tabData.length * 100 + 'vw'}">
      <div class="dynamicsTabContent TabContentItemPage">
        <div class='results'>
          <loading v-if='allItems[0].isLoading'></loading>
          <notFound v-if='allItems[0].noData'
                    :failTitle='allItems[0].noDataT'
                    :iconClass='allItems[0].iconClass'></notFound>
          <div class='scrollWrapper'
               v-if='!allItems[0].noData'>
            <scroll ref="dynamics"
                    :data="allItems[0].items"
                    :scrollbar="scrollbarObj"
                    :pullDownRefresh="pullDownRefreshObj"
                    :pullUpLoad="pullUpLoadObj"
                    :startY="parseInt(scrollStartY)"
                    @pullingDown="onPullingDown(0)"
                    @pullingUp="onPullingUp(0)"
                    :direction='direction'>
              <Waterfall ref='listWrapper'
                         class='searchWaterFallList'
                         :isRefresh='isRefresh'
                         :addItems='allItems[0].addItems'
                         @render='render'
                         @renderEnd='renderEnd'></Waterfall>
            </scroll>
          </div>
        </div>
      </div>
      <div class="usersTabContent TabContentItemPage">
        <loading v-if='allItems[1].isLoading'></loading>
        <notFound v-if='allItems[1].noData'
                  :failTitle='allItems[1].noDataT'
                  :iconClass='allItems[1].iconClass'></notFound>
        <scroll ref="users"
                :data="allItems[1].items"
                :scrollbar="scrollbarObj"
                :pullDownRefresh="pullDownRefreshObj"
                :pullUpLoad="pullUpLoadObj"
                :startY="parseInt(scrollStartY)"
                @pullingDown="onPullingDown(1)"
                @pullingUp="onPullingUp(1)"
                :direction='direction'>
          <div>
            <user-list :items='allItems[1].items'></user-list>
          </div>
        </scroll>
      </div>
      <div class="activityTabContent TabContentItemPage">
        <loading v-if='allItems[2].isLoading'></loading>
        <notFound v-if='allItems[2].noData'
                  :failTitle='allItems[2].noDataT'
                  :iconClass='allItems[2].iconClass'></notFound>
        <scroll :ref="allItems[2].name"
                :data="allItems[2].items"
                :scrollbar="scrollbarObj"
                :pullDownRefresh="pullDownRefreshObj"
                :pullUpLoad="pullUpLoadObj"
                :startY="parseInt(scrollStartY)"
                @pullingDown="onPullingDown(2)"
                @pullingUp="onPullingUp(2)"
                :direction='direction'>
          <div v-if="allItems[2].name && allItems[2].name === 'activity'">
            <activityItem v-for='(item, index) in allItems[2].items'
                          :item='item'
                          :key='index'></activityItem>
          </div>
          <div class='voiceList'
               v-if="allItems[2].name && allItems[2].name === 'voice'">
            <MusicItem v-for="(item, index) in allItems[2].items"
                       :key="index"
                       :index='index'
                       :item="item"
                       class="postItem-btn postItem-btn-like"
                       @click.native='setMusicIndex(index, item)'
                       @showMusicInner="showMusicInner(item)"
                       @playMusic="playMusic"
                       :isCurrent="currentMusic === item"
                       :isPlay="isPlay"></MusicItem>
          </div>
          <div v-if="allItems[2].name && allItems[2].name === 'shop'">
            <ShopItem @click.native="go.nameAParams('business_home', {'businessId': item.userBusinessId})"
                      v-for='(item, index) in allItems[2].items'
                      :userBusiness='item'
                      :key='index'></ShopItem>
          </div>
        </scroll>
      </div>
      <div class="activityTabContent TabContentItemPage">
        <loading v-if='allItems[3].isLoading'></loading>
        <notFound v-if='allItems[3].noData'
                  :failTitle='allItems[3].noDataT'
                  :iconClass='allItems[3].iconClass'></notFound>
        <scroll :ref="allItems[3].name"
                :data="allItems[3].items"
                :scrollbar="scrollbarObj"
                :pullDownRefresh="pullDownRefreshObj"
                :pullUpLoad="pullUpLoadObj"
                :startY="parseInt(scrollStartY)"
                @pullingDown="onPullingDown(3)"
                @pullingUp="onPullingUp(3)"
                :direction='direction'>
          <div class="topicMain"
               v-if="allItems[3].name && allItems[3].name === 'topic'">
            <div class="split"></div>
            <ul class="topicUl">
              <li class="borderB"
                  v-for="(item,index) in allItems[3].items"
                  :key="index"
                  @click.stop="gotoItem(item)">
                <span :class="['hotCount',{noHot:index > 11}]">{{index + 1}}</span>
                <div class="topicContent">
                  <span>{{item.Description && item.Description.length >= 1? item.Description : item.title}}</span>
                  <span>{{item.hotDegree}}&nbsp;热度</span>
                </div>
                <div class="topicImg">
                  <img :src="item.image"
                       alt="">
                </div>
              </li>
            </ul>
          </div>
          <div v-if="allItems[3].name && allItems[3].name === 'group'">
            <groupItem @click.native='goGroupInfo(item)'
                       v-for='(item, index) in allItems[3].items'
                       :item='item'
                       :key='index'></groupItem>
          </div>
          <div v-if="allItems[3].name && allItems[3].name === 'activity'">
            <activityItem v-for='(item, index) in allItems[3].items'
                          :item='item'
                          :key='index'></activityItem>
          </div>
        </scroll>
      </div>
      <div class="groupsTabContent TabContentItemPage">
        <loading v-if='allItems[4].isLoading'></loading>
        <notFound v-if='allItems[4].noData'
                  :failTitle='allItems[4].noDataT'
                  :iconClass='allItems[4].iconClass'></notFound>
        <scroll :ref="allItems[4].name"
                :data="allItems[4].items"
                :scrollbar="scrollbarObj"
                :pullDownRefresh="pullDownRefreshObj"
                :pullUpLoad="pullUpLoadObj"
                :startY="parseInt(scrollStartY)"
                @pullingDown="onPullingDown(4)"
                @pullingUp="onPullingUp(4)"
                :direction='direction'>
          <div class="topicMain"
               v-if="allItems[4].name && allItems[4].name === 'topic'">
            <div class="split"></div>
            <ul class="topicUl">
              <li class="borderB"
                  v-for="(item,index) in allItems[4].items"
                  :key="index"
                  @click.stop="gotoItem(item)">
                <span :class="['hotCount',{noHot:index > 11}]">{{index + 1}}</span>
                <div class="topicContent">
                  <span>{{item.Description && item.Description.length >= 1? item.Description : item.title}}</span>
                  <span>{{item.hotDegree}}&nbsp;热度</span>
                </div>
                <div class="topicImg">
                  <img :src="item.image"
                       alt="">
                </div>
              </li>
            </ul>
          </div>
          <div v-if="allItems[4].name && allItems[4].name === 'group'">
            <groupItem @click.native='goGroupInfo(item)'
                       v-for='(item, index) in allItems[4].items'
                       :item='item'
                       :key='index'></groupItem>
          </div>
        </scroll>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import tabMove from '@/components/tabMove'

import activityItem from '@/components/activityItem'
import MusicItem from '@/components/music/musicItem'
import ShopItem from '@/views/Shop/components/neabryShopItem'

import loading from '@/components/requestState/isLoading'
import notFound from '@/components/requestState/noData'

import groupItem from '@/components/List/groupItem'
import UserList from '@/components/UserList'
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'

import Waterfall from '@/components/Waterfall/Waterfall'
const DIRECTION_V = 'vertical'
export default {
  mixins: [scrollMixin],
  props: {
    searchT: {
      type: String,
      default: '动态'
    },
    searchContent: {
      type: String,
      default: ''
    },
    tabList: {
      type: Array,
      default: null
    }
  },
  components: {
    scroll,
    tabMove,
    UserList,
    activityItem,
    groupItem,
    loading,
    notFound,
    MusicItem,
    ShopItem,
    Waterfall
  },
  mounted () {
    this.$refs.tabMove.tab(this.searchType)
    this.getSearch(this.touchCurIndex)
    this.touchChildW = document.body.offsetWidth
    this.$refs.touchContent.style.transform = 'translate3d(' + -this.touchCurIndex * this.touchChildW + 'px, 0, 0)'
  },
  data () {
    return {
      isRefresh: false, // 是否是刷新数据
      hasNewMusicList: true,
      hasSearch: false,
      isHTouch: false,
      touchMoveL: 0,
      touchCurIndex: this.searchType,
      startX: 0, // 开始触摸的位置
      startY: 0,
      moveX: 0, // 滑动时的位置
      moveY: 0,
      endX: 0,
      endY: 0, // 结束触摸的位置
      disX: 0, // 移动距离
      disY: 0,
      transX: 0,
      startT: 0,
      endT: 0,
      touchChildW: 0,
      searchIndex: 1,
      searchSize: 10,
      searchUserArr: [], // 搜索的用户列表
      searchAllArr: [], // 搜索的全部列表
      showType: false, // 是否显示搜索列表
      items: [],
      allData: [],
      itemsA: [],
      itemsB: [],
      addItems: [],
      filterIndex: 2,
      totalNotes: '', // 全部笔记
      scrollStartY: 0,
      pullDownRefresh: false,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: true,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更多数据了',
      tabData: this.tabList,
      isPlay: false, // 音频否播放
      currentMusic: {}, // 当前播放音频
      isShowMusicInner: false, // 是否显示音乐内页
      allItems: [{
        items: [],
        pageIndex: 1,
        pageSize: 10,
        searchOrder: 0,
        totalNotes: 0,
        filterIndex: 2,
        isLoading: false,
        noData: false,
        noDataT: '没有找到相关动态，换个词试试吧',
        iconClass: 'iconWwushuju',
        name: 'dynamics'
      }, {
        items: [],
        pageIndex: 1,
        pageSize: 10,
        isLoading: false,
        noData: false,
        noDataT: '没有找到相关用户，换个词试试吧',
        iconClass: 'iconWyonghujiaose_wushuju',
        name: 'users'
      }, {
        items: [],
        pageIndex: 2,
        pageSize: 4,
        isLoading: false,
        noData: false,
        noDataT: '没有找到相关声音，换个词试试吧',
        iconClass: 'iconWyonghujiaose_wushuju',
        name: 'a'
      }, {
        items: [],
        pageIndex: 1,
        pageSize: 6,
        isLoading: false,
        noData: false,
        noDataT: '没有找到相关活动，换个词试试吧',
        iconClass: 'iconWyonghujiaose_wushuju',
        name: 'b'
      },
      {
        items: [],
        pageIndex: 1,
        pageSize: 6,
        isLoading: false,
        noData: false,
        noDataT: '没有找到相关活动，换个词试试吧',
        iconClass: 'iconWyonghujiaose_wushuju',
        name: 'b'
      }]
    }
  },
  created () {
    for(let i = 2; i < this.tabData.length; i++) {
      if (this.tabData[i] === '声音') {
        this.allItems[i].name = 'voice'
        this.allItems[i].noDataT = '没有找到相关声音，换个词试试吧'
      } else if (this.tabData[i] === '话题') {
        this.allItems[i].name = 'topic'
        this.allItems[i].noDataT = '没有找到相关话题，换个词试试吧'
      } else if (this.tabData[i] === '活动') {
        this.allItems[i].name = 'activity'
        this.allItems[i].noDataT = '没有找到相关活动，换个词试试吧'
      } else if (this.tabData[i] === '群组') {
        this.allItems[i].name = 'group'
        this.allItems[i].noDataT = '没有找到相关群组，换个词试试吧'
      } else if (this.tabData[i] === '商家') {
        this.allItems[i].name = 'shop'
        this.allItems[i].noDataT = '没有找到相关商家，换个词试试吧'
      }
    }
  },
  computed: {
    ...mapState({
      'playlist': 'playlist',
      'squencelist': 'squencelist',
      'pos': 'pos'
    }),
    touchChildLen () {
      return this.$refs.touchContent.childElementCount
    },
    // touchChildW () {
    //   return this.$refs.touchContent.firstElementChild.offsetWidth
    // },
    direction () {
      return this.transX ? '' : DIRECTION_V
    },
    searchType () {
      return this.tabData.indexOf(this.searchT) >= 0 ? this.tabData.indexOf(this.searchT) : 0
    }
  },
  watch: {
    allItems (newV) {
      console.log(newV)
    },
    touchCurIndex (newV, oldV) {
      this.$refs.tabMove.tab(newV)
      this.$refs.touchContent.style.transform = 'translate3d(' + -this.touchCurIndex * this.touchChildW + 'px, 0, 0)'
      if (!this.allItems[newV].items.length && this.searchContent && !this.allItems[newV].noData && (oldV || oldV === 0)) {
        this.getSearch()
      } else if (this.allItems[newV].searchContent && this.searchContent !== this.allItems[newV].searchContent) {
        this.getSearch(newV)
      }
      (newV || newV === 0) && this.$refs[this.allItems[newV].name] && this.$refs[this.allItems[newV].name].refresh()
      if (this.tabData[newV] === '声音') {
        this.$store.commit('setMusicPage', 'music')
      } else {
        this.$store.commit('setMusicPage', 'notMusic')
      }
    }
  },
  methods: {
    ...mapMutations(['setSearchHistory', 'setMusicPlayList', 'setMusicSquencelist', 'setMusicPieShow', 'setMusicPage', 'setMask']),
    gotoItem (item) {
      this.$router.push({ name: 'topicItemss', params: { id: item.topicId } })
    },
    reset () {
      for (let i = 0; i < this.allItems.length; i++) {
        this.allItems[i].items = []
        this.allItems[i].pageIndex = 1
      }
      this.itemsA = []
      this.itemsB = []
    },
    /**
    * 获取搜索到的数据
    */
    getSearch (value) {
      this.$emit('blur')
      let me = this
      let index = this.touchCurIndex
      if (value || value === 0) {
        this.reset()
        index = value
        this.$store.commit('setSearchHistory', {
          value: this.searchContent,
          type: this.tabData[this.touchCurIndex]
        })
      }
      let url = ''
      if (me.allItems[index].pageIndex === 1) {
        this.allItems[index].items = []
      }
      if (this.tabData[index] === '动态') {
        // me.getPost()
        url = `Post?SearchWord=${me.searchContent}&pageIndex=${me.allItems[0].pageIndex}&pageSize=${me.allItems[0].pageSize}`
      } else if (this.tabData[index] === '用户') {
        // me.getUserList()
        url = `UserRecommend/id?SearchWord=${me.searchContent}&pageIndex=${me.allItems[me.touchCurIndex].pageIndex}&pageSize=${me.allItems[me.touchCurIndex].pageSize}`
      } else if (this.tabData[index] === '活动') {
        // me.getActivity()
        url = `Activity?SearchWord=${me.searchContent}&pageIndex=${me.allItems[me.touchCurIndex].pageIndex}&pageSize=${me.allItems[me.touchCurIndex].pageSize}`
      } else if (this.tabData[index] === '声音') {
        // me.getVoice()
        url = `Voice?SearchWord=${me.searchContent}&pageIndex=${me.allItems[me.touchCurIndex].pageIndex}&pageSize=${me.allItems[me.touchCurIndex].pageSize}`
      } else if (this.tabData[index] === '话题') {
        // me.getTopic()
        url = `Topic?Word=${me.searchContent}&pageIndex=${me.allItems[me.touchCurIndex].pageIndex}&pageSize=${me.allItems[me.touchCurIndex].pageSize}`
      } else if (this.tabData[index] === '群组') {
        // me.getTopic()
        url = `UserGroup?SearchWord=${me.searchContent}&pageIndex=${me.allItems[me.touchCurIndex].pageIndex}&pageSize=${me.allItems[me.touchCurIndex].pageSize}`
        if (me.pos.longitude && me.pos.latitude) {
          url = `${url}&Lon=${me.pos.longitude}&Lat=${me.pos.latitude}`
        }
      } else if (this.tabData[index] === '商家') {
        // me.getTopic()
        url = `UserBusiness?SearchWord=${me.searchContent}&pageIndex=${me.allItems[me.touchCurIndex].pageIndex}&pageSize=${me.allItems[me.touchCurIndex].pageSize}&OrderType=1`
        if (me.pos.longitude && me.pos.latitude) {
          url = `${url}&Lon=${me.pos.longitude}&Lat=${me.pos.latitude}`
        }
      }
      this.allItems[index].searchContent = this.searchContent
      !me.allItems[index].items.length && this.$set(this.allItems[index], 'isLoading', true)
      this.$set(me.allItems[index], 'noData', false)
      // formData.append('pageIndex', me.allItems[index].pageIndex)
      // formData.append('pageSize', me.allItems[index].pageSize)
      // formData.append('search', me.searchContent)
      // me.allItems[index].searchOrder !== undefined && formData.append('order', me.allItems[index].searchOrder)
      me.api.get({
        url: url,
        success: function (res) {
          if (index === 0) {
            if (me.allItems[index].pageIndex === 1) {
              console.log('刷新数据')
              me.isRefresh = true
            }
            me.allItems[0].addItems = res
          }
          console.log(res)
          me.allItems[index].items = me.allItems[index].items.concat(res)
          !index && (me.addItems = res)
          // res.totalCount && (me.allItems[index].totalNotes = res.totalCount)
          !index && me.addData()
          !me.allItems[index].items.length && me.$set(me.allItems[index], 'noData', true)
        },
        complete: function () {
          me.$set(me.allItems[index], 'isLoading', false)
          me.$nextTick(() => {
            me.$refs[me.allItems[index].name] && me.$refs[me.allItems[index].name].forceUpdate()
          })
        }
      })
    },
    setMusicIndex (index) {
      if (this.tabData[this.touchCurIndex] === '声音') {
        this.hasNewMusicList = false
        this.$store.commit('setMusicPlayList', this.allItems[this.touchCurIndex].items)
        this.$store.commit('setMusicSquencelist', this.allItems[this.touchCurIndex].items)
        this.$store.commit('setMusicIndex', index)
        this.$store.commit('setMask', true)
      }
    },
    tabMoveScroll (index) {
      this.touchCurIndex !== index && (this.touchCurIndex = index)
    },
    touchstart (e) {
      this.startX = e.touches[0].clientX
      this.startY = e.touches[0].clientY
      this.startT = new Date().getTime()
      // this.startScrollY = 0
    },
    touchmove (ev) {
      ev = ev || window.event
      ev.preventDefault()
      if (ev.touches.length === 1) {
        this.moveX = ev.touches[0].clientX
        this.moveY = ev.touches[0].clientY
        this.disX = this.moveX - this.startX
        this.disY = this.moveY - this.startY
        // 手势倾斜角度
        if (this.disY / this.disX > 0.3 || this.disY / this.disX < -0.3) {
          this.isHTouch = false
          return
        }
        this.isHTouch = true
        this.transX = -this.touchCurIndex * this.touchChildW + this.disX >= 0 ? 0 : (-this.touchCurIndex * this.touchChildW + this.disX <= -(this.tabData.length - 1) * this.touchChildW ? -(this.tabData.length - 1) * this.touchChildW : -this.touchCurIndex * this.touchChildW + this.disX)
        this.$refs.touchContent.style.transform = 'translate3d(' + (this.transX) + 'px, 0, 0)'
      }
    },
    touchend (e) {
      this.endX = e.changedTouches[0].clientX
      this.endY = e.changedTouches[0].clientY
      this.endT = new Date().getTime()
      let short = this.endT - this.startT
      if ((this.endX - this.startX > this.touchChildW / 2 || (this.endX - this.startX > 10 && (this.endX - this.startX) / short > 0.5)) && ((this.endY - this.startY < 40 && this.endY - this.startY > -40) || (this.transX))) {
        this.touchCurIndex--
        this.touchCurIndex < 0 && (this.touchCurIndex = 0)
      } else if ((this.startX - this.endX > this.touchChildW / 2 || (this.startX - this.endX > 10 && (this.startX - this.endX) / short > 0.5)) && ((this.endY - this.startY < 40 && this.endY - this.startY > -40) || (this.transX))) {
        this.touchCurIndex++
        this.touchCurIndex > this.tabData.length - 1 && (this.touchCurIndex = this.tabData.length - 1)
      } else {
        this.$refs.touchContent.style.transform = 'translate3d(' + -this.touchCurIndex * this.touchChildW + 'px, 0, 0)'
      }
      this.transX = 0
    },
    addData () {
      let elLeft = this.$el.querySelector('.zq-waterfall-left')
      let elRight = this.$el.querySelector('.zq-waterfall-right')
      if (this.addItems && this.addItems.length > 0) {
        let that = this
        for (let i = 0; i < this.addItems.length; i++) {
          let item = this.addItems[i]
          // if (item.Thumbnail && item.Thumbnail.length >= 1) {
          setTimeout(() => {
            if (!elLeft || !elRight) {
              return
            }
            let boxA = elLeft.clientHeight
            let boxB = elRight.clientHeight
            if (boxA > boxB) {
              that.itemsB.push(item)
            } else {
              that.itemsA.push(item)
            }

            if (i === this.addItems.length - 1) {
              that.$nextTick(() => {
                // that.allItems[that.touchCurIndex].items = that.allItems[that.touchCurIndex].items.concat(that.addItems)
            //     if (that.allItems[that.touchCurIndex].pageIndex === 1) {
            //       that.allData = []
            //       // that.allData = that.allData.concat(res)
                // that.allItems[that.touchCurIndex].items = that.allItems[that.touchCurIndex].items.concat(res)
            //     }
                that.$refs[that.allItems[that.touchCurIndex].name] && that.$refs[that.allItems[that.touchCurIndex].name].forceUpdate()
              })
            }
          }, 1)
          // }
        }
      }
    },
    resetData () {
      this.itemsA = []
      this.itemsB = []
      this.allData = []
      this.addItems = []
      this.searchIndex = 1
    },
    onPullingDown (index) {
      this.searchIndex = 1
      this.getSearch(index)
    },
    onPullingUp (index) {
      // 更新数据
      this.allItems[index].pageIndex++
      this.getSearch()
    },
    // music
    playMusic (item) {
      if (this.currentMusic === item) {
        if (!this.isPlay) {
          this.musicLabel.play()
          this.isPlay = true
        } else {
          this.musicLabel.pause()
          this.isPlay = false
        }
      } else {
        this.currentMusic = item
        this.musicSrc = item.musicSrc
        this.musicLabel.load()
        this.musicLabel.play()
        this.isPlay = true
      }
    },
    showMusicInner (item) {
      // 判断当前播放和想要播放的是否一样
      if (this.currentMusic !== item) {
        if (this.isPlay) {
          this.musicLabel.pause()
        }
        this.currentMusic = item
        this.musicSrc = item.musicSrc
        this.musicLabel.load()
        if (this.isPlay) {
          this.musicLabel.play()
        }
      }
      if (this.musicSrc === '') {
        this.musicSrc = item.musicSrc
        // 注意，重新赋值了src,一定要load加载一遍
        this.musicLaelb.load()
      }
      this.isShowMusicInner = true
    },
    changePlayState (isPlay) {
      if (isPlay) {
        this.isPlay = true
      } else {
        this.isPlay = !this.isPlay
      }
      if (this.isPlay) {
        this.musicLabel.play()
      } else {
        this.musicLabel.pause()
      }
    },
    hiddleMusicInner1 () {
      this.isShowMusicInner = false
    },
    goGroupInfo (item) {
      this.$router.push({ name: 'groupInfo', params: { id: item.userGroupId} })
    },
    render () { // 开始渲染瀑布流
      this.isRefresh = false
    },
    renderEnd (data) { // 是否渲染完毕
      this.isRenderEnd = data
      if (data) {
        if (this.allItems[0].pageIndex === 1) {
          this.allItems[0].items = []
        }
        this.allItems[0].items = this.allItems[0].items.concat(this.allItems[0].addItems)
      }
    }
  }
}
</script>
<style lang="less">
  .scrollPages{
    .tabList{
      height: 12vw !important;
      line-height: 12vw !important;
      margin-top: 1vw;
      .tabBottom{
        bottom: 2vw;
      }
    }
    .voiceList{
      width: 100%;
      // background-color: var(--mBg);
      padding: 2vw 1.8vw;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-orient: horizontal;
      -webkit-box-direction: normal;
      -ms-flex-flow: row wrap;
      flex-flow: row wrap;
      -webkit-box-pack: justify;
      -ms-flex-pack: justify;
      justify-content: space-between;
    }
    .dynamicsTabContent{
      background: var(--mBg);
      .results{
        .filterList{
          display: flex;
          height: 10.5vw;
          line-height: 10.5vw;
          background: #fff;
          p{
            width: 30vw;
            padding-left: 4vw;
            font-size: var(--sText);
            color: var(--lGray);
          }
          .filterBtn {
            flex: 1;
            display: flex;
            text-align: center;
            justify-content: center;
            font-size: 0;
            .confirmFilter{
              color: var(--dGray);
            }
            span{
              display: inline-block;
              width: 16vw;
              text-align: center;
              font-size: var(--sText);
              color: var(--lGray);
            }
          }
        }
        .searchWaterFallList{
          padding-left:0.925vw !important;
          padding-top: 1.9vw !important;
          background: transparent;
        }
      }
    }
  }
</style>
