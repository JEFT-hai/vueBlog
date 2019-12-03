<template>
  <transition name="transLeft">
    <div class="BMap">
      <div class="BMap_nav tianv--navbar">
        <span class="go_back" @click="hideBMap"></span>
        <input type="search" v-model="searchAddress" id="address_detail" placeholder="选择地址">
        <span v-show="searchAddress" @click="clear_address_detail" class="close_address_detail">x</span>
      </div>
      <div class="pos-icon">
        <div class="obj">
          <span class="inputrighticon icon-jikediancanicon28 icon iconfont"></span>
        </div>
      </div>
      <div id="mapPanel">
        <div style="text-align:center;padding-top:200px;color:#fff;">地图加载中...</div>
      </div>
      <div class="getPos inputrighticon icon-jikediancanicon28 icon iconfont" @click="getPos"></div>
      <div id="m-result">
        <span class="curResult">
          <span class="curTit">{{curTit}}</span>
          <span class="curAddress">{{curAddress}}</span>
        </span>
        <span @click="submitAddress" class="confirm">确定</span>
      </div>
      <div class="cityList" id="cityPanel"></div>
      <div class="poiList" id="poiPanel" v-if="poiShow">
        <div class="content">
          <ul>
            <li v-for="(poi,index) in poiList.data" :key="index" @click="getPoi(poi)">
              <span class="icon-jikediancanicon28 icon iconfont"></span>
              <p class="poi-name">{{poi.name}}</p>
              <p class="poi-address">{{poi.address}}</p>
            </li>
          </ul>
          <div class="empty" v-if="poiList.data.length==0">未找到该地址</div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    address: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
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
    show(newV, oldV) {
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
                16
              )
              me.curTit = local.getResults().getPoi(0).title
              me.curAddress = local.getResults().getPoi(0).address
            }
          })
          local.search(me.address)
        }
      }
      return newV
    }
  },
  created() {
    window.resetMapPos = this.resetMapPos
  },
  methods: {
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
      var p = this.map.getPosition();  //获取marker的位置
		  alert("marker的位置是" + p.lng + "," + p.lat)
    },
    initMap: function() {
      this.map = this.map ? this.map : new window.BMap.Map('mapPanel')
      // 初始城市深圳
      this.map.centerAndZoom(new window.BMap.Point(113.940092,22.531814), this.zoomSize)
      // this.marker = new BMap.Marker(new BMap.Point(113.940092,22.531814)); // 创建点
      this.map.addOverlay(this.marker)
	    // this.marker.addEventListener("click",() => {
      //   this.clickPosPoint()
      // })
      this.map.addEventListener('dragend', () => {
        this.searchNear()
        this.showPoi()
      })
      this.map.addEventListener('click', (e) => {
        // alert(e.point.lng + ", " + e.point.lat)
        console.log(e)
        this.map.centerAndZoom(new window.BMap.Point(e.point.lng, e.point.lat), this.zoomSize)
        // this.marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat))
        this.showPoi()
      })
      // this.getPoi
      this.geoLocation = new window.BMap.Geolocation()
      // this.getPos()
      this.mapShow = true
      this.geoc = new window.BMap.Geocoder()
      this.getDetailPos()
      this.showPoi()
      // if (this.address) {
      //   let me = this
      //   let local = new window.BMap.LocalSearch(this.map, { // 智能搜索
      //     onSearchComplete: function () {
      //       me.targetP = local.getResults().getPoi(0).point // 获取第一个智能搜索的结果
      //       me.map.centerAndZoom(new window.BMap.Point(me.targetP.lng, me.targetP.lat), 16)
      //       me.curTit = local.getResults().getPoi(0).title
      //       me.curAddress = local.getResults().getPoi(0).address
      //     }
      //   })
      //   local.search(me.address)
      // }
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
            me.curTit = local.getResults().getPoi(0).title
            me.curAddress = local.getResults().getPoi(0).address
          }
        })
        local.search(me.address)
      }
    },
    // getPos () {
    //   window.isInAndroid && window.WanAndroid.getReLocation()
    //   if (!window.isInAndroid) {
    //     this.cur_city = this.$store.state.pos.city
    //     this.resetAutocomplete(this.cur_city)
    //     this.curcity = this.cur_city.split('市')[0]
    //     this.map.centerAndZoom(new window.BMap.Point(this.$store.state.pos.longitude, this.$store.state.pos.latitude), 16)
    //     this.showPoi()
    //     return
    //   }
    // },
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
      this.cur_city = this.$store.state.pos.city
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
            // console.log(r, 'getPos', geoL.getStatus(), window.BMAP_STATUS_SUCCESS)
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
      return arr;
    },
    showPoi: function(lng, lat) {
      let me = this
      var center = this.map.getCenter()
      if (lng) {
        center.lng = lng
        center.lat = lat
      }
      console.log(center.lng, center.lat)
      var pt = new window.BMap.Point(center.lng, center.lat)
      var mOption = {
        poiRadius: 60, // 半径为1000米内的POI,默认100米
        numPois: 10 // 列举出50个POI,默认10个
      }
      // this.geoc.getLocation(pt,
      //   function mCallback(rs){
      //       var allPois = rs.surroundingPois; //获取全部POI(半径R的范围 最多12个点)
      //       console.log(allPois);
      //       if(allPois==null || allPois==""){
      //           return;
      //       }
      //       var disMile=[];//储存周围的点和指定点的距离
      //       for(i=0;i<allPois.length;i++){//计算得到的POI坐标和指定坐标的距离
      //           var pointA=new BMap.Point(allPois[i].point.lng,allPois[i].point.lat);
      //           disMile.push({'lng':allPois[i].point.lng,'lat':allPois[i].point.lat,'distance':me.map.getDistance(pointA, pt)}) ;
      //       }
      //       var result=me.arrBubble(disMile);//disMile进行升序排列后的数组
      //       let ponits_ = []
      //       if(result!=null){
      //           if(result.length>=3){//获取最多3个点  可以自己设定  但是最多就12个点
      //               var k1=0;//去掉重复
      //               var k2=0;
      //               var k3=0;
      //               for(var i=0;i<allPois.length;i++){
      //                   if(result[0].lng==allPois[i].point.lng && result[0].lat==allPois[i].point.lat && k1==0){
      //                       ponits_.push({'lng':result[0].lng,'lat':result[0].lat,'address':allPois[i].title});
      //                       k1++;
                           
      //                   }else if(result[1].lng==allPois[i].point.lng && result[1].lat==allPois[i].point.lat && k2==0){
      //                       ponits_.push({'lng':result[1].lng,'lat':result[1].lat,'address':allPois[i].title});
      //                        k2++;
                    
      //                   }else if(result[2].lng==allPois[i].point.lng && result[2].lat==allPois[i].point.lat && k3==0){
      //                       ponits_.push({'lng':result[2].lng,'lat':result[2].lat,'address':allPois[i].title});
      //                        k3++;
      //                   }
      //               }
      //           }else if(result.length==2){
      //               var k1=0;
      //               var k2=0;
      //              for(var i=0;i<allPois.length;i++){
      //                   if(result[0].lng==allPois[i].point.lng && result[0].lat==allPois[i].point.lat && k1==0){
      //                       ponits_.push({'lng':result[0].lng,'lat':result[0].lat,'address':allPois[i].title});
      //                       k1++;
      //                   }else if(result[1].lng==allPois[i].point.lng && result[1].lat==allPois[i].point.lat && k2==0){
      //                       ponits_.push({'lng':result[1].lng,'lat':result[1].lat,'address':allPois[i].title});
      //                       k2++;
      //                   }
      //               }
      //           }else if(result.length==1){
      //                var k1=0;
      //              for(var i=0;i<allPois.length;i++){
      //                   if(result[0].lng==allPois[i].point.lng && result[0].lat==allPois[i].point.lat && k1==0){
      //                       ponits_.push({'lng':result[0].lng,'lat':result[0].lat,'address':allPois[i].title});
      //                       k1++;
      //                   }
      //               }
      //           }
      //       }
      //       console.log(ponits_);
      //       if(ponits_!=null){//这里的points_包含了所需的经纬度和地址信息  具体操作自己设置
      //           for(var i=0;i<ponits_.length;i++){
      //               var pt=new BMap.Point(ponits_[i].lng,ponits_[i].lat);
      //               me.map.addOverlay(new BMap.Marker(pt));
      //           }
      //       }
            
      //   },mOption
    // )
      this.geoc.getLocation(
        pt,
        rs => {
          this.addressComponents = rs.addressComponents
          console.log(rs, 'rs')
          var results = rs.surroundingPois
          var Rlist = []
          if (results.length > 0) {
            console.log(results)
            // let noHouse = results.filter((item, index) => {
            //   return item.Si !== '房地产'
            // })
            // console.log(noHouse, 'noHouse')
            // if (noHouse.length) {
            //   for (var i = 0; i < noHouse.length; ++i) {
            //     // console.log(results[i])      
            //     Rlist.push({
            //       title: noHouse[i].title,
            //       address: noHouse[i].address,
            //       city: noHouse[i].city,
            //       lng: noHouse[i].point.lng,
            //       lat: noHouse[i].point.lat
            //     })
            //   }
            //   this.showList(Rlist)
            // } else {
              for (var i = 0; i < results.length; ++i) {
                // console.log(results[i])           
                Rlist.push({
                  title: results[i].title,
                  address: results[i].address,
                  city: results[i].city,
                  lng: results[i].point.lng,
                  lat: results[i].point.lat
                })
              }
              this.showList(Rlist)
            // }
          }
        },
        mOption
      )
    },
    showList: function(list) {
      // console.log(list, 'list')
      this.r_lat = list[0].lat
      this.r_lng = list[0].lng
      this.curAddress = list[0].address
      this.curTit = list[0].title
    },
    resetAutocomplete: function(_city) {
      if (this.ac) this.ac.dispose()
      _city = _city || this.cur_city
      console.log(this.cur_city)
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
      console.log(poi, 'poi')
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
      console.log(pp)
      if (this.cityName !== '') {
        this.curcity = this.cityName.split('市')[0]
        this.resetAutocomplete(this.cityName)
      }
    },
    searchNear () {
      console.log('开始搜索附近')
      let me = this
      var options = {      
        onSearchComplete: function(results){      
            console.log('results', results)
            if (local.getStatus() == BMAP_STATUS_SUCCESS){
              console.log('results', results)
              // function mCallback(rs){
                let rs = results
            var allPois = rs.Ar; //获取全部POI(半径R的范围 最多12个点)
            console.log(allPois);
            if(allPois==null || allPois==""){
                return;
            }
            var disMile=[];//储存周围的点和指定点的距离
            for(i=0;i<allPois.length;i++){//计算得到的POI坐标和指定坐标的距离
                var pointA=new BMap.Point(allPois[i].point.lng,allPois[i].point.lat);
                disMile.push({'lng':allPois[i].point.lng,'lat':allPois[i].point.lat,'distance':me.map.getDistance(pointA, pt)}) ;
            }
            var result=me.arrBubble(disMile);//disMile进行升序排列后的数组
            let ponits_ = []
            if(result!=null){
                if(result.length>=3){//获取最多3个点  可以自己设定  但是最多就12个点
                    var k1=0;//去掉重复
                    var k2=0;
                    var k3=0;
                    for(var i=0;i<allPois.length;i++){
                        if(result[0].lng==allPois[i].point.lng && result[0].lat==allPois[i].point.lat && k1==0){
                            ponits_.push({'lng':result[0].lng,'lat':result[0].lat,'address':allPois[i].title});
                            k1++;
                           
                        }else if(result[1].lng==allPois[i].point.lng && result[1].lat==allPois[i].point.lat && k2==0){
                            ponits_.push({'lng':result[1].lng,'lat':result[1].lat,'address':allPois[i].title});
                             k2++;
                    
                        }else if(result[2].lng==allPois[i].point.lng && result[2].lat==allPois[i].point.lat && k3==0){
                            ponits_.push({'lng':result[2].lng,'lat':result[2].lat,'address':allPois[i].title});
                             k3++;
                        }
                    }
                }else if(result.length==2){
                    var k1=0;
                    var k2=0;
                   for(var i=0;i<allPois.length;i++){
                        if(result[0].lng==allPois[i].point.lng && result[0].lat==allPois[i].point.lat && k1==0){
                            ponits_.push({'lng':result[0].lng,'lat':result[0].lat,'address':allPois[i].title});
                            k1++;
                        }else if(result[1].lng==allPois[i].point.lng && result[1].lat==allPois[i].point.lat && k2==0){
                            ponits_.push({'lng':result[1].lng,'lat':result[1].lat,'address':allPois[i].title});
                            k2++;
                        }
                    }
                }else if(result.length==1){
                     var k1=0;
                   for(var i=0;i<allPois.length;i++){
                        if(result[0].lng==allPois[i].point.lng && result[0].lat==allPois[i].point.lat && k1==0){
                            ponits_.push({'lng':result[0].lng,'lat':result[0].lat,'address':allPois[i].title});
                            k1++;
                        }
                    }
                }
            }
            console.log(ponits_);
            // if(ponits_!=null){//这里的points_包含了所需的经纬度和地址信息  具体操作自己设置
            //     for(var i=0;i<ponits_.length;i++){
            //         var pt=new BMap.Point(ponits_[i].lng,ponits_[i].lat);
            //         me.map.addOverlay(new BMap.Marker(pt));
            //     }
            // }
            
        // }
                // 判断状态是否正确      
                // var s = [];
                // for (var i = 0; i < results.getCurrentNumPois(); i ++){      
                //     s.push(results.getPoi(i).title + ", " + results.getPoi(i).address);      
                // }      
                // document.getElementById("log").innerHTML = s.join("<br>");      
            }      
        }      
      }
      // var allOverlay = this.map.getOverlays();
      // for (var i = 0; i < allOverlay.length -1; i++){
      //   try{
      //     if(allOverlay[i].getLabel().content  == "搜索到这里"||allOverlay[i].getLabel().content  == "我在这"){
            
      //     }
      //     else{
      //       this.map.removeOverlay(allOverlay[i]);
      //     }
      //   }catch(e){
      //     this.map.removeOverlay(allOverlay[i]);
      //   }
      
      // }
      var selectInfo=document.getElementById("address_detail").value;
      // this.map.centerAndZoom(new BMap.Point(lng, lat), 11);
      //alert('当前点：'+lng+','+lat);
      var local = new window.BMap.LocalSearch(me.map, options )
      console.log('搜索附近')
      var center = this.map.getCenter()
      // if (lng) {
      //   center.lng = lng
      //   center.lat = lat
      // }
      console.log(center.lng, center.lat)
      var pt = new window.BMap.Point(center.lng, center.lat)
      var mOption = {
        poiRadius: 60, // 半径为1000米内的POI,默认100米
        numPois: 10 // 列举出50个POI,默认10个
      }
      local.searchNearby(me.curTit, pt, 100)
      // local.search('商家')
    }
  }
}
</script>
<style lang='less' scoped>
.BMap {
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
    top: 50%;
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
    height: 100vh;
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
    bottom: 100px;
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
    bottom: 10px;
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
