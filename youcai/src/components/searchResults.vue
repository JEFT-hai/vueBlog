<template>
  <transition name='slide'>
    <div v-show='show' class='tep_searchPage'>
      <div class='topSearchNav'>
        <div class='SearchInputWrap'>
          <span class='Icon icon iconfont icon-fangdajing'></span>
          <input v-model='SearchKey' id='address_key' class='SearchInput' placeholder='搜索地点' />
          <span @click="clearSearchKey" v-show="SearchKey" class="clearSearchKey">x</span>
        </div>
        <span class='cancelSearchBtn' @click='cancelSearch'>取消</span>
      </div>
      <div ref='searchListWrapper' class='SearchResultsWrapper'>
        <ul  class='SearchResultsContent'>
          <li v-show="!SearchKey && poiList.length" @click="selectPos()">
            <div class='addressInfo'>
              <p class='addressName addressNameOnly'>不显示位置</p>
            </div>
          </li>
          <li v-for='(item,index) in poiList' :key='index' :class="touchIndex === index ? 'touching':''" @click='selectPos(item)'  @touchstart='touchstart(index)' @touchmove='touchmove($event)' @touchend='touchend(item)'>
            <div class='addressInfo'>
              <p v-show='item.name' class='addressName'>{{item.name}}</p>
              <p v-show='item.title' class='addressName'>{{item.title}}</p>
              <p class='addressDesc'>{{item.address}}</p>
            </div>
            <div v-show="selectdPos===item.title || selectdPos===item.name || item.title === yourPos" class="selectedIcon">></div>
          </li>
          <li class="noAfter" v-show="isLoading || noMoreData">
            <p v-show="isLoading && !noMoreData"><i class='searchLoadingIcon'>loading</i></p>
            <p v-show="!isLoading && noMoreData" class="noMoreData">没有更多数据了...</p>
          </li>
        </ul>
        <div id='searchMap' style='display: none;'></div>
        <div v-show='!poiList.length && SearchKey' class="fail">
            <div class="failImg">
                <img src="../assets/images/searchFail.png" />
            </div>
            <span class="failMsg" style='color: gray;'>没有找到相关地址&nbsp;换个词试试吧</span>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    yourPos: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      searchAddress: '',
      map: null,
      geoLocation: null,
      geoc: null,
      mapShow: false,
      ac: null,
      cur_city: '',
      r_address: '',
      cityName: '',
      r_city: '',
      r_name: '',
      r_lng: '',
      r_lat: '',
      poiShow: false,
      curTit: 'Loading...',
      curAddress: '',
      curcity: '定位中',
      local: null,
      addressComponents: {},
      ac: null,
      poiList: [],
      selectdPos: '',
      touchIndex: -1,
      SearchKey: '',
      dropDown: false,
      serachPageIndex: 0,
      isLoading: false,
      noMoreData: false
    }
  },
  computed: {
    ...mapState(['pos'])
  },
  mounted () {
    this.searchNearList()
    this.$nextTick(() => {
      this.initMap()
    })
    // console.log('这个页面在网页上显示可能会报错, 网页不支持搜索功能')
  },
  watch: {
    SearchKey: function (newV, oldV) {
      if (newV.replace(/\s+/g, '').length !== 0) {
        // 每次新输入值， 就将pageIndex重置, 有无更多数据重置
        this.serachPageIndex = 0
        this.noMoreData = false
        // this.searchList(newV, this.serachPageIndex)
      } else {
        this.searchNearList()
      }
    },
    yourPos: function (newV, oldV) {
      this.yourPos = newV
    }
  },
  methods: {
    initMap () {
      this.map = new window.BMap.Map('searchMap')
      this.resetAutocomplete(this.cur_city)
    },
    _initScroll () {
      var me = this
      this.scroll = new window.BScroll(this.$refs.searchListWrapper, {
        click: true,
        scroll: true
      })
      this.scroll.on('touchEnd', (pos) => {
        // 上拉加载 总高度>下拉的高度+10 触发加载更多
        if ((this.scroll.maxScrollY > pos.y + 10) && !me.isLoading) {
          me.isLoading = true
          me.serachPageIndex++
          !me.SearchKey && me.searchNearList(me.serachPageIndex)
          me.SearchKey && me.searchList(me.SearchKey, me.serachPageIndex)
          // 使用refresh 方法 来更新scroll  解决无法滚动的问题
          // this.scroll.refresh()
        }
      })
    },
    cancelSearch () {
      this.$emit('emitHide', this.selectdPos)
      this.SearchKey = ''
    },
    selectPos (item) {
      if (item) {
        this.selectdPos = item.name ? item.name : item.title ? item.title : ''
        this.$emit('emitHide', this.selectdPos)
      } else {
        this.selectdPos = ''
        this.$emit('emitHide', '')
      }
      this.SearchKey = ''
    },
    hide () {
      this.$emit('hideSearchPage')
    },
    touchstart (index) {
      this.touchIndex = index
      this.touchMoved = false
    },
    touchmove (e) {
      this.touchIndex = -1
    },
    touchend (item) {
      if (this.touchIndex !== -1) {
        this.selectPos(item)
      }
      this.touchIndex = -1
    },
    searchNearList (index) {
      var me = this
      var pt = new window.BMap.Point(me.$store.state.pos.longitude, me.$store.state.pos.latitude)
      var myGeo = new window.BMap.Geocoder()
      var mOption = {
        poiRadius: 1000, // 半径为1000米内的POI,默认100米
        numPois: 20 + (20 * index) // 列举出50个POI,默认10个
      }

      myGeo.getLocation(pt, function (rs) {
        var results = rs.surroundingPois
        console.log(rs)
        me.cur_city = rs.addressComponents.city
        if (!index) {
          me.poiList = results
          me.$nextTick(() => {
            me._initScroll()
          })
        } else {
          me.isLoading = false
          if (results.length === me.poiList.length) {
            me.noMoreData = true
          }
          me.poiList = results
          me.scroll.refresh()
        }
      }, mOption)
    },
    getPoi: function (poi) {
      this.poiShow = false
      this.local = new window.BMap.LocalSearch(this.map, { // 智能搜索
        onSearchComplete: this.searchDone
      })
      let _value = poi
      this.r_address = _value.address + _value.name
      this.local.search(this.r_address)
    },
    searchDone: function () {
      var pp = this.local.getResults().getPoi(0).point // 获取第一个智能搜索的结果
      this.map.centerAndZoom(pp, 17)
      this.showPoi(pp.lng, pp.lat)
      if (this.cityName !== '') {
        this.curcity = this.cityName.split('市')[0]
        this.resetAutocomplete(this.cityName)
      }
    },
    resetAutocomplete: function (_city) {
      if (this.ac) this.ac.dispose()
      _city = _city || this.cur_city
      console.log('reset')
      this.ac = new window.BMap.Autocomplete({
        'input': 'address_key',
        'location': _city,
        'onSearchComplete': this.SearchingCmplt
      })
    },
    SearchingCmplt: function (AutocompleteResult) {
      var poiDetails = []
      for (var i = 0; i < AutocompleteResult.getNumPois(); i++) {
        if (AutocompleteResult.getPoi(i)) {
          poiDetails.push({
            name: AutocompleteResult.getPoi(i).business,
            address: AutocompleteResult.getPoi(i).city + AutocompleteResult.getPoi(i).district,
            city: AutocompleteResult.getPoi(i).city.split('省').length > 1 ? AutocompleteResult.getPoi(i).business : AutocompleteResult.getPoi(i).city,
            district: AutocompleteResult.getPoi(i).district
          })
        }
      }
      this.poiList = {
        data: []
      }
      // if (!index) {
      //   me.poiList = result.poiList
      //   me.scroll.refresh()
      // } else {
      //   me.poiList = me.poiList.concat(result.poiList)
      //   me.scroll.refresh()
      // }
      console.log(poiDetails)
      this.poiList = poiDetails
      this.poiList.data = poiDetails
      this.poiShow = true
    },
    clearSearchKey () {
      this.SearchKey = ''
    }
  }
}
</script>
<style lang="less" scoped>
  .toLeft-enter,.toLeft-leave-active {
    left: 100vw;
  }
  .toLeft-enter-active,.toLeft-leave-active{
    transition: all 0.3s ease-in-out;
  }
  .toLeft-enter-active, .toLeft-leave-active {
    transition: left .5s;
  }
  .toLeft-enter, .toLeft-leave-to /* .toLeft-leave-active below version 2.1.8 */ {
    left: 100px;
  }
  .tep_searchPage{
    position:fixed;
    top:0;
    left:0;
    height:100vh;
    width:100vw;
    background:#fefefe;
    z-index:10000;
    box-sizing: border-box;
    padding-top: 60px;
    .topSearchNav{
      position: absolute;
      z-index: 99;
      top: 0;
      left: 0;
      width: 100%;
      height: 60px;
      line-height: 60px;
      padding-left: 4vw;
      background-color: #fff;
      box-shadow: 0 2px 1px #f8f8f8;
      font-size: 0;
      .SearchInputWrap{
        position: relative;
        width: 79.7vw;
        height: 8vw;
        line-height: 8vw;
        display: inline-block;
        font-size: 14px;
        .clearSearchKey{
          position: absolute;
          width: 16px;
          right:0!important;
          top:0;
          height: 100%;
          color: #1ea7fe;
        }
        .icon-fangdajing{
          height: 8vw;
          line-height: 8vw;
          text-align: center;
          &:before{
            top: 0;
            left: 0;
            right: 0;
            bottom:0;
            margin:auto;
          }
        }
        span{
          position: absolute;
          width: 32px;
          height: 100%;
          top: 0;
          color: #9f9f9f;
        }
        .Icon{
          left: 0;
        }
        .SearchInput{
          outline: none;
          border: none;
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          padding-left: 32px;
          text-align: left;
          height: 8vw;
          line-height: 8vw;
          background: #f0f0f0;
          border-radius: 4vw;
          color: #333;
        }
      }
      .cancelSearchBtn{
        display: inline-block;
        text-align: center;
        width: 16vw;
        height: 100%;
        font-size: 14px;
        color: #5e5e5e;
      }
    }
    .SearchResultsWrapper{
      position: absolute;
      top: 60px;
      left: 0;
      bottom: 0;
      width: 100vw;
      .fail{
        width:100%;
        height:50vw;
        position:relative;
        top:20vw;
        .failImg{
          width:30vw;
          position:absolute;
          top:0;
          left:35vw;
          img{
              width:100%;
          }
        }
        .failMsg{
          position:absolute;
          left:20vw;
          top:25vw;
          color:rgb(127,127,127);
        }
      }
      .SearchResultsContent{
      li.touching{
        background-color: #ddd;
      }
      li.noAfter{
        &:after{
          display: none;
        }
        p{
          height: 10.666vw;
          line-height: 10.666vw;
          text-align: center;
          font-size: 10px;
          color: #aaa;
          i{
            font-style: normal;
          }
        }
        .searchLoadingIcon{
          height: 10.666vw;
          line-height: 10.666vw;
          text-align: center;
          font-size: 10px;
          color: #aaa;
        }
      }
      li {
        &:after{
          position: absolute;
          content: '';
          display: block;
          bottom:0;
          left: 4vw;
          right: 0;
          height: 1px;
          background-color: #e8e8e8;
        }
        @media only screen and (-webkit-min-device-pixel-ratio:1.5) {
          &:after{
            transform: scaleY(0.7);
          }
        }
        @media only screen and (-webkit-min-device-pixel-ratio:2) {
          &:after{
            transform: scaleY(0.5);
          }
        }
        @media only screen and (-webkit-min-device-pixel-ratio:3) {
          &:after{
            transform: scaleY(0.34);
          }
        }
        position: relative;
        display: inline-block;
        height: 16vw;
        width:100vw;
        box-sizing: border-box;
        padding: 2.6666vw 0 2.6666vw 4vw;
        .addressInfo{
          display:inline-block;
          font-size: 0;
          height:10.6666vw;
          width:86.66vw;
          .addressName.addressNameOnly{
            height:10.6666vw;
            line-height:10.6666vw;
          }
          .addressName{
            height: 6.4vw;
            line-height: 6.4vw;
            width: 100%;
            font-size: 14px;
            font-weight: bold;
            color: #2e2e2e;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
          .addressDesc{
            height: 4.266vw;
            width: 100%;
            line-height: 4.266vw;
            font-size: 10px;
            color: #b8b8b8;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            -webkit-text-size-adjust:none;
          }
        }
        .selectedIcon{
          display:inline-block;
          vertical-align: top;
          width:9.3vw;
          height: 10.6666vw;
          line-height: 10.6666vw;
          font-size:16px;
          text-align:center;
          color: #f00;
        }
        .selectedIconOnly.selectedIcon{
          color: #5e5e5e;
          font-size: 12px;
        }
      }
    }
    }
  }
</style>
