<template>
     <div class="distanceWrap">
        <div class="selectAddress" @click="showSearchPage">
          <div :class="yourPos ? 'myAddress hasAddress': 'myAddress'">
            <span class="inputrighticon icon-jikediancanicon28 icon iconfont" ></span>
            <span class="yourAddress" v-show='yourPos'>{{yourPos}}</span>
            <span class="yourAddress" v-show='!yourPos'>你的位置</span>
            <i class="ft"></i>
          </div>
        </div>
        <div ref='NearListWrapper' :class="yourPos?'NearListWrapper noAfter':'NearListWrapper'" v-show="!yourPos">
          <ul ref='NearListContent' class='NearListContent' >
            <li ref="list" v-for='(item,index) in nearList' :key='index'  @click='selectPos(item)'>
              <span>{{item.title}}</span>
            </li>
            <li ref="findMoreRes" class="findMoreRes" @click='showSearchPage'>
              <span>查看更多</span>
            </li>
          </ul>
        </div>
        <div id='hideMap' style='display:none'></div>
        <s-results :yourPos='yourPos' ref="sResults" :show="showSearchResults" @emitHide='hideSearchPage'></s-results>
      </div>
</template>
<script>
import SResults from '@/components/searchResults'
import { mapState } from 'vuex'
import upDateMask from '@/components/mixins/upDateMask'
export default {
  mixins: [upDateMask],
  data () {
    return {
      mayYourPos: [],
      yourPos: '',
      showSearchResults: false,
      nearList: [],
      pt: null
    }
  },
  components: {
    SResults
  },
  computed: {
    ...mapState(['pos'])
  },
  mounted () {
    this.getPos()
  },
  methods: {
    _initScroll () {
      var me = this
      var width = 0
      for (let i = 0; i < me.nearList.length; i++) {
        width += me.$refs.list[i].getBoundingClientRect().width + 11
      }
      this.$refs.NearListContent.style.width = width + me.$refs.findMoreRes.getBoundingClientRect().width + 'px'
      this.scroll = new window.BScroll(this.$refs.NearListWrapper, {
        click: true,
        scrollX: true
      })
    },
    selectPos (item) {
      this.yourPos = item ? item.title : ''
    },
    hideSearchPage (data) {
      if (!data) {
        this.scroll.refresh()
      }
      this.yourPos = data
      // this.hideMask()
      this.showSearchResults = false
      this.$refs.sResults.searchNearList()
    },
    showSearchPage () {
      // this.setMask()
      this.showSearchResults = true
    },
    getPos () {
      var me = this
      if (me.$store.state.pos.longitude) {
        me.searchNearList()
      } else {
        var geoL = new window.BMap.Geolocation()
        // let geoL = this.geoLocation
        geoL.getCurrentPosition((r) => {
          // console.log(r, 'getPos', geoL.getStatus(), window.BMAP_STATUS_SUCCESS)
          let me = this
          if (geoL.getStatus() === window.BMAP_STATUS_SUCCESS) {
            // this.cur_city = r.address.city
            console.log(r, 'dsjfksj')
            me.$store.commit('userPos', { longitude: r.longitude, latitude: r.latitude, city: r.address.city, address: `${r.address.district}${r.address.street}` })
            me.searchNearList()
            // this.resetAutocomplete(this.cur_city)
            // this.curcity = this.cur_city.split('市')[0]
            // this.map.centerAndZoom(new window.BMap.Point(r.point.lng, r.point.lat), 16)
            // this.showPoi()
          } else {
            console.log('err')
          }
        }, { enableHighAccuracy: true })
      }
    },
    searchNearList () {
      var me = this
      var pt = new window.BMap.Point(me.$store.state.pos.longitude, me.$store.state.pos.latitude)
      var myGeo = new window.BMap.Geocoder()
      var mOption = {
        poiRadius: 1000, // 半径为1000米内的POI,默认100米
        numPois: 6 // 列举出50个POI,默认10个
      }
      myGeo.getLocation(pt, function (rs) {
        var results = rs.surroundingPois
        me.nearList = results
        me.$nextTick(() => {
          me._initScroll()
        })
      }, mOption)
    }
  }
}
</script>

<style lang="less" scoped>
  .toLeft-enter,.toLeft-leave-active {
    left: 100vw;
    transition: all 0.3s ease-in-out;
  }
  .toLeft-enter-active,.toLeft-leave-active{
    left: 0;
    transition: all 0.3s ease-in-out;
  }
 .distanceWrap{
    .selectAddress{
      width:100vw;
      height:10vw;
      display: flex;
      justify-content: space-between;
      margin-top:2vw;
      margin:auto;
      text-align: center;
      line-height: 10vw;
      color:rgb(196, 193, 204);
      box-sizing: border-box;
      padding:0 4vw;
      .hasAddress.myAddress{
        span {
          color: #4b8bdb;
          font-size: 15px;
        }
      }
      .myAddress{
        width: 100%;
        text-align: left;
        overflow: hidden;
        span{
          display: inline-block;
          vertical-align: middle;
        }
        .yourAddress{
          width: 80vw;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          padding-left:2.93vw;
          color: #969696;
          font-size: 14px;
        }
        .ft{
          height: 100%;
          float: right;
          position: relative;
          font-size: 14px;
          display: inline-block;
          vertical-align: middle;
          padding-right: 13px;
          &:after {
            content: " ";
            display: inline-block;
            height: 6px;
            width: 6px;
            border-width: 2px 2px 0 0;
            border-color: #c8c8cd;
            border-style: solid;
            -webkit-transform: matrix(.71,.71,-.71,.71,0,0);
            transform: matrix(.71,.71,-.71,.71,0,0);
            top: -2px;
            position: absolute;
            top: 50%;
            margin-top: -4px;
            right: 2px;
          }
        }
      }
      .go_back {
        width:  4.44vw;
        height: 4.44vw;
        &::before {
          content: "";
          position: absolute;
          top: 102vw;
          right:5vw;
          width: 2.5vw;
          height: 2.5vw;
          color: rgb(196, 193, 204);
          border-left: 1px solid currentColor;
          border-top: 1px solid currentColor;
          transform: rotate(140deg);
        }
      }
    }
    .noAfter.NearListWrapper{
      &:after{
        display: none;
      }
    }
    .NearListWrapper{
      position: relative;
      height: 11.2vw;
      width: 100vw;
      margin-top: 10px;
      overflow: hidden;
      .NearListContent{
        height: 11.2vw;
        padding: 0 15px;
        li{
          display:inline-block;
          height:100%;
          margin-right:11px;
          span{
            display: inline-block;
            height: 6.4vw;
            line-height: 6.4vw;
            font-size: 12px;
            padding: 0 2.93vw;
            border-radius: 3.2vw;
            background-color: #f6f6f6;
            color:#808080;
          }
        }
        .findMoreRes{
          margin-right: 0;
        }
      }
      &:after{
        position: absolute;
        content: '';
        display: block;
        bottom:0;
        left: 4vw;
        right: 4vw;
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
    }
    .distance{
      border-bottom:0.1vw solid rgb(234,234,234);
      margin:auto;
      width:94%;
      height:12vw;
      display: flex;
      justify-content: space-between;
      margin-top:2vw;
      margin-bottom: 4vw;
      span{
        padding-left:3vw;
        padding-right:3vw;
        box-sizing: border-box;
        display: inline-block;
        height:7vw;
        background-color:rgb(245, 245, 245);
        border-radius: 3vw;
        font-size:3vw;
        color:rgb(127,127,127);
        text-align: center;
        line-height: 7vw;
      }
    }
 }
</style>
