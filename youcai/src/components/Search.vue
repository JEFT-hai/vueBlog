<template>
    <div class='searchPage'>
        <div class='search-header borderB'>
            <div class="serch_wrap">
                 <div class="goback">
                    <i @click="flag" class="iconWanwan iconWleftBack goto-right"></i>
                 </div>
                 <div class="search_inner">
                    <i class="icon iconfont icon-fangdajing searchFind"></i>
                    <form action="" onsubmit="return false;">
                     <input ref='searchPageInput' type="search" :placeholder="placeholder" class="serch_box" v-model='searchContent' @keyup.enter="getSearch" @input="handleContent">
                    </form>
                    <span class="searchClear" v-show="searchContent.length" @click="clearContent">
                      <i class="iconWanwan iconWquxiao-copy-copy activityNotice"></i>
                    </span>
                </div>
                <div class="searchFound" @click="getSearch">
                  搜索
                </div>
            </div>
        </div>
        <tabMove @scroll='tabMoveScroll' ref='tabMove' :tabData="tabData"></tabMove>
        <div class="searchContent" ref='touchContent'
          
          @touchstart="touchstart($event)"
          @touchmove="touchmove($event)"
          @touchend="touchend($event)"
        >
          <div class="dynamicsTabContent TabContentItemPage">
            <scroll ref="dynamics"
                :data="allItems[0].items"
                :scrollbar="scrollbarObj"
                :pullDownRefresh="pullDownRefreshObj"
                :pullUpLoad="pullUpLoadObj"
                :startY="parseInt(startY)"
                @pullingDown="onPullingDown(0)"
                @pullingUp="onPullingUp(0)"
                :direction='direction'
        >
                <show-content ref='listWrapper' :itemsA="itemsA" :itemsB="itemsB" ></show-content>
            </scroll>
          </div>
          <div class="usersTabContent TabContentItemPage">
            <scroll ref="users"
                :data="allItems[1].items"
                :scrollbar="scrollbarObj"
                :pullDownRefresh="pullDownRefreshObj"
                :pullUpLoad="pullUpLoadObj"
                :startY="parseInt(startY)"
                @pullingDown="onPullingDown(1)"
                @pullingUp="onPullingUp(1)"
                :direction='direction'
        >
              <div>
                <user-list :items='allItems[1].items' ></user-list>
              </div>
            </scroll>
          </div>
          <div class="activityTabContent TabContentItemPage">
            <scroll ref="activity"
                :data="allItems[2].items"
                :scrollbar="scrollbarObj"
                :pullDownRefresh="pullDownRefreshObj"
                :pullUpLoad="pullUpLoadObj"
                :startY="parseInt(startY)"
                @pullingDown="onPullingDown(2)"
                @pullingUp="onPullingUp(2)"
                :direction='direction'
        >
              <div>
                <activityItem v-for='(item, index) in allItems[2].items' :item='item' :key='index'></activityItem>
              </div>
            </scroll>
          </div>
          <div class="groupsTabContent TabContentItemPage">4444</div>
        </div>
    </div>
</template>

<script>
import tabMove from '@/components/tabMove'
import BtnFollow from '../views/Discover/components/btn_follow'
import activityItem from '@/components/activityItem'
import ShowContent from '@/components/ShowContent'
import UserList from '@/components/UserList'
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
import { mapGetters } from 'vuex'
const DIRECTION_V = 'vertical'
export default {
  mixins: [scrollMixin],
  props: {
    searchType: {
      type: Number,
      default: 0
    },
    placeholder: {
      type: String,
      default: '搜一下吧'
    }
  },
  components: {
    BtnFollow,
    ShowContent,
    scroll,
    tabMove,
    UserList,
    activityItem
  },
  mounted() {
    this.$refs.searchPageInput.focus()
    this.$refs.tabMove.tab(this.searchType)
    this.$refs.touchContent.style.transform = 'translate3d(' + -this.touchCurIndex * this.touchChildW + 'px, 0, 0)'
  },
  data () {
    return {
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
      startT: 0,
      endT: 0,
      searchIndex: 1,
      searchSize: 10,
      searchContent: '',
      searchUserArr: [], // 搜索的用户列表
      searchAllArr: [], // 搜索的全部列表
      showType: false, // 是否显示搜索列表
      isUnique: true,
      rightFilter: '', // 筛选的样式
      items: [],
      allData: [],
      itemsA: [],
      itemsB: [],
      addItems: [],
      filterIndex: 2,
      totalNotes: '', // 全部笔记
      pullDownRefresh: false,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: true,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更过数据了',
      tabData: ['动态', '用户', '活动', '群组'],
      allItems: [{
        items: [],
        pageIndex: 1,
        pageSize: 6,
        searchOrder: 0,
        totalNotes: 0,
        name: 'dynamics'
      }, {
        items: [],
        pageIndex: 1,
        pageSize: 10,
        name: 'users'
      }, {
        items: [],
        pageIndex: 1,
        pageSize: 4,
        name: 'activity'
      }, {
        items: [],
        pageIndex: 1,
        pageSize: 6,
        name: 'groups'
      }]
    }
  },
  computed: {
    ...mapGetters(['userAvatar']),
    touchChildLen () {
      return this.$refs.touchContent.childElementCount
    },
    touchChildW () {
      return this.$refs.touchContent.firstElementChild.offsetWidth
    },
    direction () {
      return this.isHTouch ? '' : DIRECTION_V
    }
  },
  watch: {
    touchCurIndex (newV) {
      this.$refs.tabMove.tab(newV)
      this.$refs.touchContent.style.transform = 'translate3d(' + -this.touchCurIndex * this.touchChildW + 'px, 0, 0)'
      if (!this.allItems[newV].items.length && this.searchContent) {
        this.getSearch(newV)
      }
    }
  },
  methods: {
    getSearch () {
      let me = this
      let formData = new FormData()
      let methodName = ''
      let index = this.touchCurIndex
      if (index === 0) {
        methodName = 'SearchPostList'
      } else if (index === 1) {
        methodName = 'SearchUserList'
      } else if (index === 2) {
        me.getActivity()
        return
      }
      formData.append('pageIndex', me.allItems[index].pageIndex)
      formData.append('pageSize', me.allItems[index].pageSize)
      formData.append('search', me.searchContent)
      me.allItems[index].searchOrder && formData.append('order', me.allItems[index].searchOrder)
      me.api.process({
        file: 'Post',
        method: methodName,
        data: formData,
        success: function (res) {
          me.allItems[index].items = me.allItems[index].items.concat(res.list)
          !index && (me.addItems = res.list)
          res.totalCount && (me.allItems[index].totalNotes = res.totalCount)
          !index && me.addData()
        },
        error: function (res) {
          me.$msg.showError(res.msg)
        },
        complete: function () {
          me.$refs[ me.allItems[index][name]] && me.$refs[ me.allItems[index][name]].forceUpdate()
        }
      })
    },
    getActivity () {
      var me = this
      let formData = new FormData()
      // this.onlyCity && formData.append('city', me.$store.state.pos.city)
      formData.append('typeactiveTypese', 0)
      formData.append('activeTimes', 0)
      formData.append('activeHots', 1)
      formData.append('city', '深圳市')
      formData.append('pageIndex', me.allItems[2].pageIndex)
      formData.append('pageSize', me.allItems[2].pageSize)
      me.api.process({
        file: 'Activity',
        method: 'GetActivitys',
        data: formData,
        success: function (res) {
          me.allItems[2].items = me.allItems[2].items.concat(res.list)
        },
        error: function (res) {
          me.$msg.showError(res.msg)
        },
        complete: function () {
          // me.isLoading = false
          me.$refs[ me.allItems[2][name]] && me.$refs[ me.allItems[2][name]].forceUpdate()
        }
      })
    },
    tabMoveScroll (index) {
      console.log(index, 90)
      this.touchCurIndex !== index && (this.touchCurIndex = index)
    },
    touchstart (e) {
      this.startX = e.touches[0].clientX
      this.startY = e.touches[0].clientY
      this.startT = new Date().getTime()
      console.log(this.touchChildLen, 34)
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
        if (this.disY/this.disX > .3 || this.disY/this.disX < -0.3) {
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
      console.log(this.endX - this.startX, short)
      // if (!this.isHTouch) {
      //   return
      // }
      if (this.endX - this.startX > this.touchChildW / 2 || (this.endX - this.startX > 10 && (this.endX - this.startX)/short > .5 )) {
        this.touchCurIndex--
        this.touchCurIndex < 0 && (this.touchCurIndex = 0)
        // this.$refs.touchContent.style.transform = 'translate3d(' + -this.touchCurIndex * this.touchChildW + 'px, 0, 0)'
        // let transT = (-this.touchCurIndex * this.touchChildW - (this.transX))/1000
        // this.$refs.touchContent.style.transition = 'all ' + transT + 's linear'
      } else if (this.startX - this.endX > this.touchChildW / 2 || (this.startX - this.endX > 10 && (this.startX - this.endX)/short > .5)) {
        this.touchCurIndex++
        this.touchCurIndex > this.tabData.length - 1 && (this.touchCurIndex = this.tabData.length - 1)
        // this.$refs.touchContent.style.transform = 'translate3d(' + -this.touchCurIndex * this.touchChildW + 'px, 0, 0)'
        // let transT = (-this.touchCurIndex * this.touchChildW - (this.transX))/500
        // this.$refs.touchContent.style.transition = 'all ' + transT + 's linear'
      } else {
        this.$refs.touchContent.style.transform = 'translate3d(' + -this.touchCurIndex * this.touchChildW + 'px, 0, 0)'
      }
    },
    handleContent () {
      this.searchContent.trim()
      if (this.searchContent.length > 15) {
        // eslint-disable-next-line
        weui.topTips('关键字应小于15', {
          duration: 1000
        })
      }
    },
    handleFilter (index, order) {
      this.filterIndex = index
      this.searchOrder = order
      this.resetData()
      this.getSearchAll()
    },
    addData () {
      let elLeft = this.$el.querySelector('.zq-waterfall-left')
      let elRight = this.$el.querySelector('.zq-waterfall-right')
      if (this.addItems && this.addItems.length > 0) {
        let that = this
        for (let i = 0; i < this.addItems.length; i++) {
          let item = this.addItems[i]
          if (item.Thumbnail && item.Thumbnail.length >= 1) {
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
            }, i * 3)
          }
        }
      }
    },
    allList () {
      this.isUnique = true
    },
    UserList () {
      this.isUnique = false
      this.getSearchUser()
    },
    clearContent () {
      this.showType = false
      this.searchContent = ''
    },
    getSearchAllList () {
      this.resetData()
      this.showType = true
      this.getSearchAll()
      this.getSearchUser()
    },
    resetData () {
      this.itemsA = []
      this.itemsB = []
      this.allData = []
      this.addItems = []
      this.searchIndex = 1
    },
    // 搜索用户列表
    getSearchUser () {
      var me = this
      let formData = new FormData()
      formData.append('pageIndex', me.searchIndex)
      formData.append('pageSize', me.searchSize)
      formData.append('search', me.searchContent)
      me.api.process({
        file: 'Post',
        method: 'SearchUserList',
        data: formData,
        success: function (res) {
          me.searchUserArr = res.list
        },
        error: function (res) {
          me.$msg.showError(res.msg)
        },
        complete: function () {
        }
      })
    },
    // 搜索全部列表
    getSearchAll () {
      
    },
    flag () {
      this.$emit('flas', this.cruuaa)
    },
    onPullingDown (index) {
      this.searchIndex = 1
      this.getSearch(index)
    },
    onPullingUp (index) {
      // 更新数据
      this.allItems[index].pageIndex++
      this.getSearch(index)
    }
  }
}
</script>

<style lang="less">
.searchPage{
  border:1px solid blue;
  background: #fff;
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  z-index: 1000;
  .search-header{
    background-color: white;
    color:rgb(127,127,127);
    font-size: 1vw;
    .tabList{
      height: 12vw;
      line-height: 12vw;
      margin-top: 1vw;
      .tabBottom{
        bottom: 2vw;
      }
    }
    .searchClassify{
      width: 100vw;
      font-size: 0;
      text-align: center;
      span{
        display:inline-block;
        width:19.2vw;
        height:7.34vw;
        padding: 4vw 0 2vw;
        line-height: 7.34vw;
        font-size:4vw;
        text-align: center;
        color:#999;
      }
      .searchUnique{
        // border-bottom:2px solid rgb(255, 39, 66);
        color:#232323;
      }
    }
    .serch_wrap{
      width:100%;
      height:10vw;
      display: flex;
      .goback{
        padding-top:0.5vw;
        margin-left:1vw;
        height:10vw;
        line-height:10vw;
        .goto-right{
          transform:rotate(180deg);
          margin-left:2vw;
          margin-top:2.5vw;
        }
      }
      .search_inner{
        width:75%;
        height:7vw;
        margin-left:4vw;
        margin-top:2vw;
        background-color:rgb(245, 245, 245);
        border-radius: 2vw;
        display: flex;
        form {
          input {
            width: 100%;
            height: 100%;
          }
        }
        .searchFind{
          color:rgb(127,127,127);
          margin-top:1.5vw;
          margin-left:2vw;
        }
        .serch_box{
          width:50vw;
          border:none;
          outline:none;
          margin-left:2vw;
          background-color:rgb(245, 245, 245);
        }
        .searchClear{
          display:inline-block;
          width:4vw;
          height:4vw;
          background-color:rgb(140, 140, 140);
          color:white;
          font-size:3.5vw;
          text-align: center;
          border-radius: 50%;
          margin-left:10vw;
          margin-top:1.5vw;
          line-height: 4vw;
        }
    }
    .searchFound{
      width:10vw;
      height:7vw;
      margin-left:3vw;
      margin-top:2vw;
      font-size:4vw;
      letter-spacing: 0.3vw;
    }
   }

  }
  .searchContent{
    font-size: 0;
    height: calc(100vh - 23vw);
    width: 400vw;
    background: #f9f9f9;
    overflow: hidden;
    .TabContentItemPage{
      display: inline-block;
      vertical-align: top;
      width: 100vw;
      height:100%;
      font-size: var(--mText);
    }
    .dynamicsTabContent{
      background: #0f0;
    }
  }
}
</style>
