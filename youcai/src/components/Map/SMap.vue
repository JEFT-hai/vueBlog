<template>
  <transition name="transLeft">
    <div class="SMap">
      <div class="BMap_nav tianv--navbar">
        <span class="go_back"
              @click="hideBMap"></span>
        <input type="search"
               v-model="searchAddress"
               id="address_detail"
               placeholder="选择地址">
        <span v-show="searchAddress"
              @click="clear_address_detail"
              class="close_address_detail">x</span>
      </div>
      <div class="pos-icon">
        <div class="obj">
          <span class="inputrighticon icon-jikediancanicon28 icon iconfont"></span>
        </div>
      </div>
      <div id="mapPanel">
        <div style="text-align:center;padding-top:200px;color:#fff;">地图加载中...</div>
      </div>
      <div class="getPos inputrighticon icon-jikediancanicon28 icon iconfont"
           @click="getPos"></div>
      <div class="cityList"
           id="cityPanel"></div>
      <div class="poiList"
           id="poiPanel"
           v-if="poiShow">
        <div class="content">
          <ul>
            <li v-for="(poi,index) in poiList.data"
                :key="index"
                @click="getPoi(poi)">
              <span class="icon-jikediancanicon28 icon iconfont"></span>
              <p class="poi-name">{{poi.name}}</p>
              <p class="poi-address">{{poi.address}}</p>
            </li>
          </ul>
          <div class="empty"
               v-if="poiList.data.length==0">未找到该地址</div>
        </div>
      </div>
      <div class="pointLists">
        <scroll ref="scroll"
                :data="items">
          <ul class="pointItemList">
            <li @click='selectItem(item)'
                :class="['pointItem','borderB',{'selectItem': curItem === item}]"
                v-for="(item,index) in items"
                :key="index">
              <div class='leftIcon'>
                <i :class="curItem === item ? 'iconWanwan iconWdingwei1': 'iconWanwan iconWyuanquan'"></i>
              </div>
              <div class="addressInfo">
                <div class='addressTitle'>
                  {{item.title}}
                </div>
                <p class='addressDesc'>
                  {{item.address}}
                </p>
              </div>
            </li>
          </ul>
        </scroll>
      </div>
    </div>
  </transition>
</template>
<script>
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
export default {
  components: {
    scroll
  },
  mixins: [scrollMixin],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    address: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      subwayP: {},
      curItem: [],
      items: [],
      searchAddress: '',
      map: null,
      marker: null,
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
      zoomSize: 18
    }
  },
  mounted() {
    this.initMap()
  },
  watch: {
    searchAddress: function(newV, oldV) {
      if (newV.replace(/\s+/g, '').length === 0) {
        this.poiShow = false
      }
    },
    show (newV, oldV) {
      this.clear_address_detail()
      if (newV === true) {
        !this.address && this.getPos()
        if (this.address) {
          let me = this
          let local = new window.BMap.LocalSearch(this.map, {
            // 智能搜索
            onSearchComplete: function() {
              me.targetP = local.getResults().getPoi(0).point // 获取第一个智能搜索的结果
              me.map.centerAndZoom(
                new window.BMap.Point(me.targetP.lng, me.targetP.lat),
                me.zoomSize
              )
              me.curTit = local.getResults().getPoi(0).title
              me.curAddress = local.getResults().getPoi(0).address
            }
          })
          local.search(me.address)
        }
      }
      return newV
    },
    curItem (newV, oldV) {

    }
  },
  created () {
    // window.resetMapPos = this.resetMapPos
  },
  methods: {
    selectItem (item) {
      this.curItem = item
      this.map.centerAndZoom(new window.BMap.Point(item.point.lng, item.point.lat), this.zoomSize)
      this.submitItem()
      // this.searchNear('地铁')
    },
    submitItem () {
      let data = {
        curTit: this.curItem.title,
        curAddress: this.curItem.address,
        longitude: this.curItem.point.lng,
        latitude: this.curItem.point.lat,
        city: this.curItem.city,
        province: this.curItem.province,
        district: this.curItem.address,
        toSubway: this.curItem.toSubway || ''
      }
      this.$emit('subAdd', data)
    },
    hideBMap: function() {
      this.$emit('hideBMapPage')
    },
    clear_address_detail: function() {
      this.searchAddress = ''
    },
    submitAddress: function() {
      let data = {
        curTit: this.curTit,
        curAddress: this.curAddress,
        longitude: this.r_lng,
        latitude: this.r_lat,
        city: this.addressComponents.city,
        province: this.addressComponents.province,
        district: this.addressComponents.district
      }
      this.$emit('subAdd', data)
    },
    // initMap: function () {
    //   this.map = this.map ? this.map : new window.BMap.Map('mapPanel')
    //   // 初始城市深圳
    //   this.map.centerAndZoom(new window.BMap.Point(114.02597366, 22.54605355), 16)
    //   this.map.addEventListener('dragend', () => {
    //     this.showPoi()
    //   })
    //   this.geoLocation = new window.BMap.Geolocation()
    //   this.getPos()
    //   this.mapShow = true
    //   this.geoc = new window.BMap.Geocoder()
    // },
    clickPosPoint () {
      this.map.getPosition()  //获取marker的位置
    },
    initMap: function() {
      this.map = this.map ? this.map : new window.BMap.Map('mapPanel')
      // 初始城市深圳
      this.map.centerAndZoom(new window.BMap.Point(113.940092,22.531814), this.zoomSize)
      // this.marker = new window.BMap.Marker(new window.BMap.Point(113.940092,22.531814)) // 创建点
      this.map.addOverlay(this.marker)
	    // this.marker.addEventListener('click',() => {
      //   this.clickPosPoint()
      // })
      this.map.addEventListener('dragend', () => {
        // this.searchNear()
        this.showPoi()
      })
      this.map.addEventListener('click', (e) => {
        this.map.centerAndZoom(new window.BMap.Point(e.point.lng, e.point.lat), this.zoomSize)
        this.showPoi()
      })
      // this.getPoi
      this.geoLocation = new window.BMap.Geolocation()
      // this.getPos()
      this.mapShow = true
      this.geoc = new window.BMap.Geocoder()
      this.getDetailPos()
      
    },
    getDetailPos() {
      !this.address && this.getPos()
      if (this.address) {
        let me = this
        let local = new window.BMap.LocalSearch(this.map, {
          // 智能搜索
          onSearchComplete: function() {
            me.resetAutocomplete(me.cur_city)
            me.targetP = local.getResults().getPoi(0).point // 获取第一个智能搜索的结果
            me.map.centerAndZoom(
              new window.BMap.Point(me.targetP.lng, me.targetP.lat),
              me.zoomSize
            )
            let p = me.showPoi()
            p.then(() => {
              me.items.unshift(local.getResults().getPoi(0))
              me.curTit = local.getResults().getPoi(0).title
              me.curAddress = local.getResults().getPoi(0).address
              me.curItem = local.getResults().getPoi(0)
            })
          }
        })
        local.search(me.address)
        // me.showPoi()
        // me.title && me.searchNear(me.title)
      }
    },
    resetMapPos (data) {
      data = JSON.parse(data)
      let me = this
      if (data.loctype === 61 || data.loctype === 65 || data.loctype === 161) {
        this.$store.commit('userPos', data)
        this.cur_city = data.city
        this.resetAutocomplete(this.cur_city)
        this.curcity = this.cur_city.split('市')[0]
        this.map.centerAndZoom(
          new window.BMap.Point(data.longitude, data.latitude),
          this.zoomSize
        )
        this.showPoi()
        return
      }
    },
    getPos: function() {
      window.isInAndroid && window.WanAndroid.getReLocation()
      this.cur_city = this.$store.state.pos.city || '深圳市'
      this.resetAutocomplete(this.cur_city)
      if (!window.isInAndroid) {
        this.noAndroidMap()
      }
      // if (!window.isInAndroid) {
        
      this.curcity = this.cur_city.split('市')[0]
      this.map.centerAndZoom(new window.BMap.Point(this.$store.state.pos.longitude, this.$store.state.pos.latitude), this.zoomSize)
      this.showPoi()
      return
      // }
    },
    noAndroidMap () {
      if (
          this.$store.state.pos.city &&
          this.$store.state.pos.loctype !== 62
        ) {
          this.cur_city = this.$store.state.pos.city
          this.resetAutocomplete(this.cur_city)
          this.curcity = this.cur_city.split('市')[0]
          this.map.centerAndZoom(
            new window.BMap.Point(
              this.$store.state.pos.longitude,
              this.$store.state.pos.latitude
            ),
            this.zoomSize
          )
          this.showPoi()
          return
        }
        let geoL = this.geoLocation
        geoL.getCurrentPosition(
          r => {
            if (geoL.getStatus() === window.BMAP_STATUS_SUCCESS) {
              this.cur_city = r.address.city
              this.resetAutocomplete(this.cur_city)
              this.curcity = this.cur_city.split('市')[0]
              this.map.centerAndZoom(
                new window.BMap.Point(r.point.lng, r.point.lat),
                this.zoomSize
              )
              this.showPoi()
            } else {
              console.log('err')
            }
          },
          { enableHighAccuracy: true }
        )
    },
    arrBubble (arr) {
      for(var i=0;i<arr.length;i++){
          for(var j=0;j<arr.length-1;j++){
              if(arr[j+1].distance<arr[j].distance){
                  var temp=arr[j]
                      arr[j]=arr[j+1]
                      arr[j+1]=temp
              }
          }   
      }
      return arr
    },
    showPoi: function(lng, lat) {
      return new Promise ((resolve, reject) => {
        let me = this
        var center = this.map.getCenter()
        if (lng) {
          center.lng = lng
          center.lat = lat
        }
        var pt = new window.BMap.Point(center.lng, center.lat)
        var mOption = {
          poiRadius: 60, // 半径为1000米内的POI,默认100米
          numPois: 10 // 列举出50个POI,默认10个
        }
        this.geoc.getLocation(
          pt,
          rs => {
            this.addressComponents = rs.addressComponents
            var results = rs.surroundingPois
            var Rlist = []
            if (results.length > 0) {
              me.items = []
              me.items = me.items.concat(results)
              me.curItem = me.items[0]
              for (var i = 0; i < results.length; ++i) {  
                  Rlist.push({
                      title: results[i].title,
                      address: results[i].address,
                      city: results[i].city,
                      lng: results[i].point.lng,
                      lat: results[i].point.lat
                  })
              }
              this.showList(Rlist)
              this.searchNear()
              me.title && this.searchNear(me.title)
            } else {
              me.items = []
              Rlist.push({
                title: me.searchAddress ? me.searchAddress : '',
                address: rs.address ? rs.address : '',
                city: rs.addressComponents.city ? rs.addressComponents.city : '',
                lng: center.lng,
                lat: center.lat
              })
              this.showList(Rlist)
              this.searchNear(me.searchAddress ? me.searchAddress : rs.address)
            }
            resolve()
          },
          mOption
        )
      })
    },
    showList: function(list) {
      this.r_lat = list[0].lat
      this.r_lng = list[0].lng
      this.curAddress = list[0].address
      this.curTit = list[0].title
    },
    resetAutocomplete: function(_city) {
      if (this.ac) this.ac.dispose()
      _city = _city || this.cur_city
      this.ac = new window.BMap.Autocomplete({
        input: 'address_detail',
        location: _city,
        onSearchComplete: this.SearchingCmplt
      })
    },
    SearchingCmplt: function(AutocompleteResult) {
      var poiDetails = []
      for (var i = 0; i < AutocompleteResult.getNumPois(); i++) {
        if (AutocompleteResult.getPoi(i)) {
          poiDetails.push({
            name: AutocompleteResult.getPoi(i).business,
            address:
              AutocompleteResult.getPoi(i).city +
              AutocompleteResult.getPoi(i).district,
            city:
              AutocompleteResult.getPoi(i).city.split('省').length > 1
                ? AutocompleteResult.getPoi(i).business
                : AutocompleteResult.getPoi(i).city,
            district: AutocompleteResult.getPoi(i).district
          })
        }
      }
      this.poiList = {
        data: []
      }
      this.poiList.data = poiDetails
      this.poiShow = true
    },
    getPoi: function(poi) {
      this.poiShow = false
      this.local = new window.BMap.LocalSearch(this.map, {
        // 智能搜索
        onSearchComplete: this.searchDone
      })
      let _value = poi
      this.r_address = _value.address + _value.name
      this.local.search(this.r_address)
    },
    searchDone: function() {
      var pp = this.local.getResults().getPoi(0).point // 获取第一个智能搜索的结果
      this.map.centerAndZoom(pp, this.zoomSize)
      this.showPoi(pp.lng, pp.lat)
      if (this.cityName !== '') {
        this.curcity = this.cityName.split('市')[0]
        this.resetAutocomplete(this.cityName)
      }
    },
    searchNear (title) {
      let me = this
      var options = {
        onSearchComplete: function(results){
            if (local.getStatus() == BMAP_STATUS_SUCCESS){
              // function mCallback(rs){
                let rs = results
              var allPois = rs.Ar //获取全部POI(半径R的范围 最多12个点)
              if(allPois==null || allPois=='' || !allPois.length){
                return
              }
              var disMile=[]//储存周围的点和指定点的距离
              for(i=0;i<allPois.length;i++){//计算得到的POI坐标和指定坐标的距离
                  var pointA=new window.BMap.Point(allPois[i].point.lng,allPois[i].point.lat)
                  disMile.push({'lng':allPois[i].point.lng,'lat':allPois[i].point.lat,'distance':me.map.getDistance(pointA, pt)}) 
              }
              var result=me.arrBubble(disMile)//disMile进行升序排列后的数组
              let ponits_ = []
              if(result!=null){
                  if(result.length>=3){//获取最多3个点  可以自己设定  但是最多就12个点
                      var k1=0//去掉重复
                      var k2=0
                      var k3=0
                      for(var i=0;i<allPois.length;i++){
                          if(result[0].lng==allPois[i].point.lng && result[0].lat==allPois[i].point.lat && k1==0){
                              // ponits_.push({'lng':result[0].lng,'lat':result[0].lat,'address':allPois[i].title});
                              ponits_.push(allPois[i])
                              k1++
                            
                          }else if(result[1].lng==allPois[i].point.lng && result[1].lat==allPois[i].point.lat && k2==0){
                              // ponits_.push({'lng':result[1].lng,'lat':result[1].lat,'address':allPois[i].title});
                              ponits_.push(allPois[i])
                              k2++
                      
                          }else if(result[2].lng==allPois[i].point.lng && result[2].lat==allPois[i].point.lat && k3==0){
                              // ponits_.push({'lng':result[2].lng,'lat':result[2].lat,'address':allPois[i].title});
                              ponits_.push(allPois[i])
                              k3++
                          }
                      }
                  }else if(result.length==2){
                      var k1=0
                      var k2=0
                    for(var i=0;i<allPois.length;i++){
                          if(result[0].lng==allPois[i].point.lng && result[0].lat==allPois[i].point.lat && k1==0){
                              // ponits_.push({'lng':result[0].lng,'lat':result[0].lat,'address':allPois[i].title});
                              ponits_.push(allPois[i])
                              k1++
                          }else if(result[1].lng==allPois[i].point.lng && result[1].lat==allPois[i].point.lat && k2==0){
                              // ponits_.push({'lng':result[1].lng,'lat':result[1].lat,'address':allPois[i].title});
                              ponits_.push(allPois[i])
                              k2++
                          }
                      }
                  }else if(result.length==1){
                      var k1=0
                    for(var i=0;i<allPois.length;i++){
                          if(result[0].lng==allPois[i].point.lng && result[0].lat==allPois[i].point.lat && k1==0){
                              // ponits_.push({'lng':result[0].lng,'lat':result[0].lat,'address':allPois[i].title});
                              ponits_.push(allPois[i])
                              k1++
                          }
                      }
                  }
              }
              if (title === '地铁') {
                if (!ponits_.length) {
                  me.submitItem()
                  return
                }
                me.subwayP = ponits_[0]
                me.searchSubway()
                return
              }
                let other = []
                ponits_.map((item, index) => {
                    me.items.map((itm, idx) => {
                        if (itm.title === item.title) {
                          ponits_.splice(index, 1)
                        }
                    })
                })
                me.items.splice(1, 0, ...ponits_)
                // ponits_.map((item, index) => {
                //   me.items.splice(1 + index, 0, item)
                // })
                if (allPois.length > 3) {
                    other = allPois.filter((aItem, aIndex) => {
                        return ponits_.indexOf(aItem) < 0
                    })
                    other.map((item, index) => {
                        me.items.map((itm, idx) => {
                            if (itm.title === item.title) {
                               other.splice(index, 1)
                            }
                        })
                    })
                    me.items = me.items.concat(other)
                }
            }
        }
      }
      // this.map.centerAndZoom(new BMap.Point(lng, lat), 11);
      //alert('当前点：'+lng+','+lat);
      var local = new window.BMap.LocalSearch(me.map, options )
      var center = this.map.getCenter()
      // if (lng) {
      //   center.lng = lng
      //   center.lat = lat
      // }
      var pt = new window.BMap.Point(center.lng, center.lat)
      if (title) {
        if (title === '地铁') {
          local.searchNearby(title, pt, 2000)
        } else {
          local.searchNearby(title, pt, 150)
        }
      } else {
        local.searchNearby(me.curTit, pt, 150)
      }
    },
    searchSubway () {
      let me = this
      var output = `距离${me.subwayP.address}${me.subwayP.title}地铁站`
      var searchComplete = function (results){
        if (transit.getStatus() != BMAP_STATUS_SUCCESS){
          return
        }
          var plan = results.getPlan(0)
          // output += plan.getDuration(true) + "\n"  //获取时间
          output += plan.getDistance(true) + '\n'  //获取距离
          me.curItem.toSubway = output
          me.submitItem()
      }
      var transit = new window.BMap.WalkingRoute(me.map, {renderOptions: {map: me.map},
        onSearchComplete: searchComplete
        // onPolylinesSet: function(){
        //   setTimeout(function(){alert(output)},"1000")
        // }
      })
        var start=new window.BMap.Point(me.subwayP.point.lng, me.subwayP.point.lat)
        var end=new window.BMap.Point(me.curItem.point.lng, me.curItem.point.lat)
      transit.search(start, end)
    }
  }
}
</script>
<style lang='less' scoped>
.SMap {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: #fff;
  z-index: 10000;
  &.transLeft-enter-active,
  &.transLeft-leave-active {
    transition: all 0.25s ease;
  }
  &.transLeft-enter,
  &.transLeft-leave-to {
    left: 100vw;
  }
  .pointLists{
    position: absolute;
    width: 100%;
    height: 40vh;
    top: 60vh;
    left: 0;
    .pointItem {
        height: 14.5vw;
        display: flex;
        align-items: center;
        &.selectItem {
            .addressInfo{
                flex: 1;
                overflow: hidden;
                .addressTitle{
                    color: var(--mblue);
                }
            }
            .iconWanwan {
                color: var(--mblue);
            }
        }
        .leftIcon {
            height: 14.5vw;
            line-height: 14.5vw;
            width: 11.5vw;
            text-align: center;
        }
        .addressInfo{
            flex: 1;
            overflow: hidden;
            .addressTitle{
                height: 6.2vw;
                line-height: 6.2vw;
                font-size: 4.3vw;
                font-weight: bold;
                color: var(--dGray);
            }
            .addressDesc{
                height: 4.8vw;
                line-height: 4.8vw;
                font-size: 3.6vw;
                color: var(--lGray);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
  }
  .tianv--navbar {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    height: 50px;
    line-height: 50px;
    background: #fefefe;
  }
  .BMap_nav {
    .go_back {
      display: inline-block;
      width: 4.44vw;
      height: 4.44vw;
      padding: 0.72vw;
      font-size: 12px;
      color: #666;
    }
    #address_detail {
      width: 65vw;
      height: 30px;
      line-height: 30px;
      color: #333;
      font-size: 15px;
      margin-left: 30px;
      padding-left: 10px;
      outline: none;
      border: none;
      border-bottom: 1px solid #eee;
      background: transparent;
    }
    .close_address_detail {
      display: inline-block;
      font-size: 15px;
      color: #1ea7fe;
      margin-left: -10px;
    }
  }
  .pos-icon {
    position: absolute;
    z-index: 90;
    left: 50%;
    top: 30vh;
    width: 40px;
    height: 40px;
    line-height: 40px;
    margin-left: -20px;
    margin-top: -27px;
    color: #f00;
    .obj{
      height: 40px;
      line-height: 40px;
    }
    .icon {
      display: block;
      font-size: 26px;
      text-align: center;
    }
  }
  #mapPanel {
    top: 0;
    left: 0;
    width: 100vw;
    height: 60vh;
    .anchorBL {
      top: 50px !important;
    }
  }
  .getPos {
    position: absolute;
    z-index: 90;
    height: 10vw;
    line-height: 10vw;
    width: 10vw;
    top: calc(60vh - 12vw);
    left: 5vw;
    text-align: center;
    border-radius: 5px;
    font-size: 18px;
    color: #1ea7fe;
    background: #fcfcfc;
    box-shadow: 0 2px 2px #7b7b7b;
  }
  #m-result {
    position: absolute;
    z-index: 90;
    height: 60px;
    width: 90vw;
    left: 5vw;
    top: 50vh;
    text-align: center;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 2px #b7b7b7;
    overflow: hidden;
    .curResult {
      display: block;
      margin-right: 18%;
      line-height: 20px;
      box-sizing: border-box;
      padding: 0 6px;
      overflow: hidden;
      span {
        display: block;
      }
      .curTit {
        height: 38px;
        line-height: 32px;
        padding: 4px 0 2px;
        box-sizing: border-box;
        font-size: 20px;
        color: #555;
      }
      .curAddress {
        height: 20px;
        line-height: 20px;
        color: #999;
        font-size: 14px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
    .confirm {
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
  #poiPanel {
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
    .content {
      margin: 0 10px;
      border-radius: 4px;
      background: #fff;
      .empty {
        height: 20px;
        line-height: 20px;
      }
      li {
        position: relative;
        height: 60px;
        text-align: left;
        padding-left: 60px;
        .icon {
          position: absolute;
          top: 0;
          left: 0;
          height: 60px;
          width: 60px;
          line-height: 50px;
          text-align: center;
          font-size: 16px;
        }
        p {
          height: 30px;
          line-height: 30px;
        }
        .poi-name {
          font-size: 15px;
        }
        .poi-address {
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
