<template>
  <div class="groupInfoPage" ref='groupInfoPage'>
    <scroll
      ref='scroll'
      :scrollbar="scrollbarObj"
      :pullDownRefresh="false"
      :pullUpLoad="false"
      :bounce= 'false'
      :click= 'true'
      :listenScroll= 'true'
      :listenScrollEnd= 'true'
      @scroll = 'wrapScroll'
      @scroll-end = 'scrollEndWrap'
        >
      <div class="groupSubContent" ref='groupSubContent'>
        <tabMove class="borderB" @scroll='tabMoveScroll' ref='tabMove' :tabData="tabData"
          @touchstart.native="tabTouchStart($event)"
        ></tabMove>
        <div class="pagesTabContent" ref='touchContent'
          @touchstart.prevent="touchstart($event)"
          @touchmove.prevent="touchmove($event)"
          @touchend.prevent="touchend($event)"
        >
          <pageItemTab
            :direction = 'direction'
            :subIsNotTop = 'subIsNotTop'
            :subScrollY = 'subScrollY'
            @pullingDown="onPullingDown"
            @pullingUp="onPullingUp"
            @scroll = 'subScroll'
            @scroll-end = 'subScrollEnd'
          ></pageItemTab>
          <activityPageItemTab
            :direction = 'direction'
            :subIsNotTop = 'subIsNotTop'
            :subScrollY = 'subScrollY'
            @pullingDown="onPullingDown"
            @pullingUp="onPullingUp"
            @scroll = 'subScroll'
            @scroll-end = 'subScrollEnd'
          ></activityPageItemTab>
        </div>
      </div>
    </scroll>
  </div>
</template>
<script>
const DIRECTION_V = 'vertical'
import Swiper from '@/components/Swiper'
import tabMove from '@/components/tabMove'
import loading from '@/components/requestState/isLoading'
import notFound from '@/components/requestState/noData'
import ShowContent from '@/components/ShowContent'
import activityItem from '@/components/activityItem'
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
import scrollPagesMixin from '@/components/Search/scrollPagesMixin'
import pageItemTab from './components/pageItemTab'
import activityPageItemTab from './components/activityPageItemTab'
import textArea from '@/components/TextArea'
export default {
  mixins: [scrollMixin, scrollPagesMixin],
  components: {
    Swiper,
    tabMove,
    loading,
    notFound,
    scroll,
    ShowContent,
    activityItem,
    pageItemTab,
    textArea,
    activityPageItemTab
  },
  data () {
    return {
      textAreaMask: false, // 用户申请入群的taxtArea
      initialName: {
        maxLen: 25,
        title: '申请入群',
        inputText: `大家好，我是${this.$store.state.user.nickName}`,
        inputHolderText: '',
        toast: '介绍一下自己吧'
      },
      joinState:0 ,
      groupId: this.$route.params.id,
      groupMember: [],
      wrapIsBottom: false,
      transY: 0,
      // tabData: ['群动态', '群活动'],
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
      // groupDirection: 'vertical',
      allItems: [{
        items: [],
        pageIndex: 1,
        pageSize: 6,
        name: 'groupDynamic',
        isLoading: false,
        noData: false,
        noDataT: '没有找到相关群动态，换个词试试吧',
        iconClass: 'iconWwushuju'
      }],
      groupInfo: {},
      tagsLabel: [
        {
          title: '交友',
          tags: ['70后', '80后', '90后', '聚会', '同城', '同乡']
        },
        {
          title: '生活',
          tags: ['狗', '花草', '宗教', '宠物', '茶文化', '家居', '健康', '母婴', '购物', '时尚','美容', '车友']
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
  created() {
    this.getGroupInfo()
  },
  computed: {
    groupType () {
      let me = this
      return this.tagsLabel.filter((item, index) => {
        return item.tags.indexOf(me.groupInfo.lable) >= 0
      })[0]
    },
    direction () {
      return this.wrapIsBottom ? this.transX ? '' : DIRECTION_V : ''
      // return this.canDirection ? this.transX ? '' : DIRECTION_V : ''
    },
    subIsNotTop () {
      return this.subScrollY < 0 ? true : false
    },
    isInGroup () {
      let me = this
      return this.groupMember.filter((item, index) => {
        return item.userId === me.$store.state.user.userId
      })[0]
    },
    isGroupLeader () {
      let me = this
      let groupLeader = this.groupMember.filter((item, index) => {
        return item.memberRole === 2
      })[0]
      return groupLeader && groupLeader.userId === me.$store.state.user.userId
    },
    imageUlrs () {
      let imageUlrs = []
      this.groupInfo.imageUlrs.map((item, index) => {
        imageUlrs.push(item.imageUrl)
      })
      return imageUlrs
    }
  },
  mounted () {
    setTimeout(() => {
      // console.log(this.$refs.scroll, 'scroll')
    }, 500)
  },
  watch: {
    direction (newV) {
      // this.rebuildScroll()
    },
    touchCurIndex (newV) {
      
    }
  },
  methods: {
    getGroupInfo () {
      let me = this
      me.api.get({
        url: `UserGroup/GroupId?GroupId=${me.groupId}&Lon=${me.$store.state.pos.longitude}&Lat=${me.$store.state.pos.latitude}`,
        success: function (res) {
          me.groupInfo = res
          me.joinState = res.askState
          res.userGroupId && me.getGroupMember()
        }
      })
    },
    getGroupMember () {
      let me = this
      me.api.get({
        url: `GroupMember?GroupId=${me.groupInfo.userGroupId}`,
        success: function (res) {
          me.groupMember = res
        }
      })
    },
    joinGroup (msg) {
      let me = this
      me.api.process({
        url: 'GroupMember',
        data: {
          groupId: me.groupId,
          askRemark: msg
        },
        success: function (res) {
          me.joinState = 1
          console.log('joinGroup', res)
        }
      })
    },
    goGroupMember () {
      let me = this
      me.$router.push({
        name: 'groupMemberList',
        params: {
          id: me.groupId
        }
      })
    },
    reviseGroup () {
      let me = this
      me.$router.push({
        name: 'groupRevise',
        params: {
          id: me.groupId
        }
      })
    },
    subScroll (pos) {
      this.subScrollY = pos.y > 0 ? 0 : pos.y
    },
    subScrollEnd (pos) {
      this.subScrollY = pos.y > 0 ? 0 : pos.y
    },
    wrapScroll (pos) {
      this.wrapScrollY = pos.y
      if (pos.y === this.$refs.groupInfoPage.offsetHeight - this.$refs.groupInfoPageContent.offsetHeight) {
        this.wrapIsBottom = true
      } else {
        this.wrapIsBottom = false
      }
    },
    onPullingUp (index) {
      // 更新数据
      // this.allItems[index].pageIndex++
      // this.getSearch()
    },
    onPullingDown (index) {
    },
    tabTouchStart (e) {
      // console.log(this.subIsNotTop, this.wrapIsBottom, 'tab')
      // this.subIsNotTop && e.stopPropagation()
    },
    scrollEndWrap (pos) {
      // console.log(pos.y, 'wrapEnd')
      if (pos.y === this.$refs.groupInfoPage.offsetHeight - this.$refs.groupInfoPageContent.offsetHeight) {
        this.wrapIsBottom = true
      } else {
        this.wrapIsBottom = false
      }
    },
    /**
     * goGroupScore群等级页面
     */
    goGroupScore () {
      // this.$router.push({name: 'groupScore', params: {id: 1}})
      // console.log('进入到群等级页面')
    },
    setTextAreaMask (data) {
      this.textAreaMask = data
    },
    getTextAreaData (data) {
      console.log(data, 'sds')
      if (data) {
        this.joinGroup(data.inputText)
      }
      this.setTextAreaMask(false)
      // console.log(data.inputText, 'sdfsd')
    }
  }
}
</script>
<style lang="less">
.ListItem{
  height: 20vw;
}
.groupInfoPage{
  height: calc(100vh - 12vw);
  color: var(--dGray);
  // overflow: hidden;
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
        }
      }
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
        li{
          flex: 1;
          text-align: center;
          max-width: 30vw;
          > div{
            position: relative;
            height: 26.5vw;
            width: 26.5vw;
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
            img{
              height:100%;
              width:100%;
              border-radius: 50%;
              border: 1px solid #eee;
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
  .groupSubContent{
    .tabList{
      height: 15.8vw;
      line-height: 15.8vw;
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
      width: 200vw;
      background: #fff;
      overflow: hidden;
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
