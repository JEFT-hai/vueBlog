<template>
  <transition name="Fadeleft">
    <div v-show='show' class='BMap'>
      <div class='BMap_nav tianv--navbar'>
        <span class='go_back' @click='hideBMap'></span>
        <input v-model='searchAddress' id='address_detail' />
      </div>
      <div id='mapPanelB'>
        <div style='text-align:center;padding-top:200px;color:#fff;'>地图加载中...</div>
      </div>
      <div id='m-result'>
        <span class='curResult'>
          <span class='curTit'>
            {{curTit}}
          </span>
          <span class='curAddress'>
            {{curAddress}}
          </span>
        </span>
        <span @click='hideBMap' class='confirm'>确定</span>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    searchAddress: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      map: null,
      geoLocation: null,
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
      targetP: {}
    }
  },
  watch: {
    searchAddress (newV, oldV) {
      return newV
    },
    show (newV, oldV) {
      newV && this.initMap()
      return newV
    }
  },
  created () {
    this.show && this.initMap()
  },
  methods: {
    hideBMap: function () {
      this.$emit('hideBMapPage')
    },
    initMap: function () {
      this.map = new window.BMap.Map('mapPanelB')
      // 初始城市深圳
      this.searchAddress && this.getPoi(this.searchAddress)
    },
    getPoi: function (_address) {
      let me = this
      let local = new window.BMap.LocalSearch(this.map, { // 智能搜索
        onSearchComplete: function () {
          me.targetP = local.getResults().getPoi(0).point // 获取第一个智能搜索的结果
          let point = new window.BMap.Point(me.targetP.lng, me.targetP.lat)
          me.map.centerAndZoom(point, 16)
          let marker = new window.BMap.Marker(point) // 创建标注
          me.map.addOverlay(marker)
          me.curTit = local.getResults().getPoi(0).title
          me.curAddress = local.getResults().getPoi(0).address
        }
      })
      local.search(_address)
    }
  }
}
</script>
<style lang='less' scoped>
 .Fadeleft-enter,.Fadeleft-leave-active {
    left: 100vw;
  }
  .Fadeleft-enter-active,.Fadeleft-leave-active{
    transition: all 0.3s ease-in-out;
  }
.BMap {
position:fixed;
top:0;
left:0;
height:100vh;
width:100vw;
background:#fff;
z-index:10000;
.tianv--navbar{
position:absolute;
top:0;
left:0;
z-index:100;
height:50px;
line-height:50px;
background:#fefefe;
}
.BMap_nav {
.go_back{
display:inline-block;
width: 4.44vw;
height: 4.44vw;
padding: 0.72vw;
font-size: 12px;
color: #666;
}
#address_detail{
width:65vw;
height:30px;
line-height:30px;
color: #333;
font-size: 15px;
margin-left: 30px;
padding-left: 10px;
outline: none;
border:none;
border-bottom:1px solid #eee;
background: transparent;
}
.close_address_detail{
display: inline-block;
font-size: 15px;
color:#1ea7fe;
margin-left: -10px;
}
}
.pos-icon {
position:absolute;
z-index: 90;
left: 45%;
top: 45%;
width: 40px;
height: 40px;
color:#f00;
.icon {
display:block;
font-size:26px;
text-align:center;
}
}
#mapPanelB {
top:0;
left:0;
width:100vw;
height:100vh;
.anchorBL{
top:50px!important;
}
}
.getPos{
position:absolute;
z-index:90;
height: 10vw;
line-height: 10vw;
width: 10vw;
bottom: 100px;
left: 5vw;
text-align: center;
border-radius: 5px;
font-size: 18px;
color: #1ea7fe;
background: #fcfcfc;
box-shadow: 0 2px 2px #7b7b7b;
}
#m-result{
position:absolute;
z-index: 90;
height:60px;
width:90vw;
left:5vw;
bottom: 10px;
text-align: center;
background:#fff;
border-radius: 8px;
box-shadow: 0 2px 2px #b7b7b7;
overflow:hidden;
.curResult{
display: block;
margin-right: 18%;
line-height: 20px;
box-sizing: border-box;
padding: 0 6px;
overflow:hidden;
span{
display: block;
}
.curTit{
height: 38px;
line-height: 32px;
padding: 4px 0 2px;
box-sizing:border-box;
font-size: 20px;
color: #555;
}
.curAddress{
height:20px;
line-height: 20px;
color: #999;
font-size: 14px;
text-overflow:ellipsis;
white-space:nowrap;
overflow:hidden;
}
}
.confirm{
position: absolute;
right: 0;
top: 0;
width: 18%;
height: 60px;
line-height: 60px;
color: #fff;
background: #1ea7fe;
}
}
#poiPanel{
position: absolute;
z-index: 99;
left: 0;
top: 0;
width: 100%;
height: 100%;
padding-top: 65px;
overflow: scroll;
overflow-x: hidden;
box-sizing: border-box;
background: #f0f0f0;
.content{
margin: 0 10px;
border-radius: 4px;
background: #fff;
.empty{
height: 20px;
line-height: 20px;
}
li{
position: relative;
height: 60px;
text-align: left;
padding-left: 60px;
.icon{
position: absolute;
top: 0;
left: 0;
height: 60px;
width: 60px;
line-height: 50px;
text-align: center;
font-size: 16px;
}
p{
height: 30px;
line-height: 30px;
}
.poi-name{
font-size: 15px;
}
.poi-address{
font-size: 13px;
color: #90909b;
}
}
li + li {
  border-top: 1px solid #f1f1f6;
}
}
}
}
</style>
