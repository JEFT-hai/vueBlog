<template>
  <div class="soli_discover_home">
    <div id='baiduM' style='display:none'></div>
    <div class="banner_box">
      <router-link :to="{name: 'discoverinfo', params: { id: 1}}">
        <img src="http://shop_api.tianvcms.com/files/avatar/b4c1cf1c06974f87a8970f5fe579c78d.jpg" />
      </router-link>
    </div>
    <div class="select_box">
      <span class="select active iconfont" @click="showTypePicker">{{activetype}}<b>&#xe66b;</b></span>
      <span class="select iconfont" @click="showTimePicker">{{activeTime}}<b>&#xe66b;</b></span>
      <span class="select iconfont"  @click="showHotPicker">{{activeHot}}<b>&#xe66b;</b></span>
      <span class="onlyCity">只看同城</span><input type="checkbox" name="samecity" value="true"  class="userInput"/>
    </div>
    <!-- 分界线 -->
    <div v-for="(item,index) in activities" :key="index">
      <div class="soli-nav-line"></div>
        <div class="banner_box2">
          <div class="relative">
            <div class="discover_title">{{item.title}}</div>
            <router-link :to="{name: 'discoverinfo', params: { id:item.id}}"><img class="bg_img" :src="item.activityImg" /></router-link>
          </div>
          <div class="padding_lr20"><span class="time">{{item.begin_time}}</span><span class="address">{{item.address}}<span class="distance">&nbsp;{{item.distance}}</span></span></div>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'discoverHome',
  data () {
    return {
      activetypes: [],
      activetype: '全类型',
      activetimes: [],
      activehots: [],
      activetypeid: 0,
      activetimeid: 0,
      activehotid: 0,
      activities: [],
      activeTime: '全时段',
      activeHot: '热门点击',
      map: null,
      geoLocation: null,
      local: null,
      mylocal: {},
      targetP: {}
    }
  },
  created () {
    this.loadingMap('Gq7gTjpOaZIhkGs0l4MEOA1BkFsoATaP').then(() => {
      this.initMap()
    })
  },
  mounted () {
    this.getHomeData()
    // eslint-disable-next-line
    axios.get('/mock/').then(res => {
      let response = res.data.activities
      this.activities = response
    })
  },
  methods: {
    initMap: function () {
      this.map = new window.BMap.Map('baiduM')
      this.geoLocation = new window.BMap.Geolocation()
      this.getPos()
    },
    getPos: function () {
      let geoL = this.geoLocation
      geoL.getCurrentPosition((r) => {
        if (geoL.getStatus() === window.BMAP_STATUS_SUCCESS) {
          this.mylocal.lng = r.point.lng
          this.mylocal.lat = r.point.lat
          this.activities.map((item, index) => {
            this.getPoi(item)
          })
        } else {
          console.log('err')
        }
      }, { enableHighAccuracy: true })
    },
    getPoi: function (item) {
      let me = this
      let local = new window.BMap.LocalSearch(this.map, { // 智能搜索
        onSearchComplete: function () {
          let targetP = local.getResults().getPoi(0).point // 获取第一个智能搜索的结果
          let pointA = new window.BMap.Point(me.mylocal.lng, me.mylocal.lat)
          let pointB = new window.BMap.Point(targetP.lng, targetP.lat)
          let distance = me.map.getDistance(pointA, pointB)
          item.distance = distance < 1000 ? parseInt(distance) + 'm' : (distance / 1000).toFixed(2) + 'km'
        }
      })
      local.search(item.address)
    },
    // 选择类型
    showTypePicker () {
      let me = this
      var values = me.data.activetypes
      let defaultValue = 0
      // eslint-disable-next-line
      weui.picker(values, {
        id: 'active_list_typePicker',
        defaultValue: [defaultValue],
        onConfirm: result => { // 这里改为箭头函数，是为了使下面的this是vm实例对象
          me.data.activetypeid = result[0].value
          this.activetype = result[0].label
          this.getlistsearch()
        }
      })
      return false
    },
    // 选择时段
    showTimePicker () {
      let me = this
      var values = me.data.activetimes
      let defaultValue = 0
      // eslint-disable-next-line
      weui.picker(values, {
        id: 'active_list_timePicker',
        defaultValue: [defaultValue],
        onConfirm: result => {
          me.data.activetimeid = result[0].value
          this.activeTime = result[0].label
          this.getlistsearch()
        }
      })
      return false
    },
    // 选择热门
    showHotPicker () {
      let me = this
      var values = me.data.activehots
      let defaultValue = 0
      // eslint-disable-next-line
      weui.picker(values, {
        id: 'active_list_hotPicker',
        defaultValue: [defaultValue],
        onConfirm: result => {
          me.data.activehotid = result[0].value
          this.activeHot = result[0].label
          this.getlistsearch()
        }
      })
      return false
    },
    // submitData: function (method, val) {
    //   let me = this
    //   if (me.formLoading) {
    //     return
    //   }
    //   me.formLoading = true
    //   let formData = new FormData()
    //   formData.append('val', val)
    //   me.api.process({
    //     file: 'User',
    //     method: method,
    //     data: formData,
    //     success: function (res) {
    //       me.updateUserInfo(res.userInfo)
    //     },
    //     error: function (res) {
    //       me.showError(res.msg)
    //     },
    //     complete: function () {
    //       me.formLoading = false
    //     }
    //   })
    //   return false
    // },
    getlistsearch () {
    },
    getHomeData () {
      let me = this
      // eslint-disable-next-line
        axios.get('/mock/').then(res => {
        me.data.activetypes = res.data.activetypes
        me.data.activetimes = res.data.activetimes
        me.data.activehots = res.data.activehots
      })
    }
  }
}
</script>

<style lang="less" scope>
  .soli_discover_home{
    .select_box{
      width:97%;
      margin:auto;
      display:flex;
      flex-direction: row no-wrap;
      justify-content: space-around;
      .onlyCity{
        font-size: 3vw;
      }
    }
    .bg_img {
      width: 100%;
      height: 40vw;
    }
  }
</style>
