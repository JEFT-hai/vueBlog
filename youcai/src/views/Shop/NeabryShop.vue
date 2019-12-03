<template>
  <div class="shopListWrap">
    <div class="showListHead">
      <div :class="['findTool','borderB']">
        <div class="one"
             @click="createShop">
          <span class="people">
            <i class="iconWanwan iconWduoren-copy activityNotice "></i>
          </span>
          <span>创建商家</span>
        </div>
        <div class="two"
             @click="createDiscount">
          <span class="qiqiu">
            <i class="iconWanwan iconWqiqiu_Solid activityNotice "></i>
          </span>
          <span>发布优惠</span>
        </div>
      </div>
    </div>
    <div class="filterList">
      <ul class="ulOne">
        <li>
          <div class="condition"
               @click="handleSelected">
            <span>{{labelTitle}}</span>
            <span><i class="iconWanwan iconWxiangxia1 activityNotice"></i></span>
          </div>
          <span class="title"
                @click="handleShopDistance(true)">距离&nbsp;{{distanceTitle}}</span>
        </li>
      </ul>
      <ul :class="['distanceList',{haveHeightUl:isShowDistance}]">
        <li @click="handleDistanceIndex(1)">
          <span>1千米</span>
          <span><i class="iconWanwan iconWgou activityNotice"
               v-show="distanceIndex===1"></i></span>
        </li>
        <li class=""
            @click="handleDistanceIndex(3)">
          <span>3千米</span>
          <span><i class="iconWanwan iconWgou activityNotice"
               v-show="distanceIndex===3"></i></span>
        </li>
        <li class=""
            @click="handleDistanceIndex(5)">
          <span>5千米</span>
          <span><i class="iconWanwan iconWgou activityNotice"
               v-show="distanceIndex===5"></i></span>
        </li>
        <li class=""
            @click="handleDistanceIndex(20)">
          <span>附近全部</span>
          <span><i class="iconWanwan iconWgou activityNotice"
               v-show="distanceIndex===0"></i></span>
        </li>
      </ul>
      <div :class="['selectBtn',{haveBtnHeight:isSelectLabel}]">
        <div class="btnOne"
             @click="handleSelected(1)">
          <span>综合排序</span>
          <span><i class="iconWanwan iconWgou activityNotice"
               v-show="index===1"></i></span>
        </div>
        <div class="btnOne"
             @click="handleSelected(2)">
          <span>时间排序</span>
          <span><i class="iconWanwan iconWgou activityNotice"
               v-show="index===2"></i></span>
        </div>
      </div>
    </div>
    <div class="mask"
         v-show="isShowDistance || isSelectLabel"
         @click.stop="hiddleMask">
    </div>
    <ul class="shopList"
        v-if="shopNeabryList.length">
      <scroll ref="scroll"
              :data="activities"
              :scrollbar="scrollbarObj"
              :pullDownRefresh="pullDownRefreshObj"
              :pullUpLoad="pullUpLoadObj"
              :startY="parseInt(startY)"
              @pullingDown="onPullingDown"
              @pullingUp="onPullingUp"
              :scrollX='true'
              class="mBg">
        <NeabryShopItem v-for="(item,index) in shopNeabryList"
                        :key="index"
                        :userBusiness="item"
                        :isBusinessUser="isBusinessUser"></NeabryShopItem>
      </scroll>
    </ul>
    <NotFound :failTitle="failTitle"
              v-else></NotFound>
  </div>
</template>

<script>
import NeabryShopItem from '@/views/Shop/components/neabryShopItem'
import { mapState, mapMutations } from 'vuex'
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
import NotFound from '@/components/requestState/NotFound'
export default {
  mixins: [scrollMixin],
  components: {
    scroll,
    NotFound,
    NeabryShopItem
  },
  data () {
    return {
      isSelectLabel: false, // 是否显示筛选条件
      isShowDistance: false, 
      shopNeabryList: [], // 附近商家列表
      distanceIndex: 20, // 表示距离title
      isCreate: false,
      userBusiness: {}, // 表示商家用户
      isBusinessUser: false, // 是否是商家
      labelTitle: '综合排序',
      index: 1,
      failTitle: '还没有附近商家哦!',
      orderType: 1, // 表示默认综合排序
      isZijiren: window.isZijiren,
      pullDownRefresh: true,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: true,
      bounce: false,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更多商家了',
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
      bottomOhter: []
    }
  },
  created () {
    this.getNeabryList()
  },
  mounted() {
    this.$nextTick(() => {
      let toDay = this.format.date(new Date(), 'yyyy-MM-dd')
      let activityEnterNum = (JSON.parse(localStorage.getItem('activityTime')) && JSON.parse(localStorage.getItem('activityTime')).number) || 0
      let activityLastTime = (JSON.parse(localStorage.getItem('activityTime')) && JSON.parse(localStorage.getItem('activityTime')).time) || toDay
      if (!activityEnterNum) {
        this.actionMask = true
        localStorage.setItem('activityTime',
          JSON.stringify({
            number: 1,
            time: toDay
          })
        )
      } else if (activityEnterNum < 4 && activityLastTime < toDay) {
        this.actionMask = true
        localStorage.setItem('activityTime',
          JSON.stringify({
            number: ++activityEnterNum,
            time: toDay
          })
        )
      }
    })
  },
  activated () {
    this.$refs.scroll && this.$refs.scroll.refresh()
  },
  computed: {
    ...mapState(['user','activeConditions', 'pos', 'hasMask']),
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
      if (region[0].locationAreas[0].areaName !== '全部') {
        region[0].locationAreas.unshift({
          areaName: '全部',
          locationAreaId: region[0].locationAreaId,
          locationCityId: region[0].locationCityId
        })
      }
      region[0].locationAreas.map((item, index) => {
        item.label = item.areaName
        item.value = index
      })
      return region[0].locationAreas
    },
    distanceTitle () {
      if (this.distanceIndex === 1) {
        return '1千米'
      } else if (this.distanceIndex === 3) {
        return '3千米'
      } else if (this.distanceIndex === 5) {
        return '5千米'
      } else if (this.distanceIndex === 20) {
        return '附近全部'
      }
    }
  },
  watch: {
    regionList (newV, oldV) {
      this.$set(this.allActiveType, 'activehots', newV)
      this.$store.commit('updateActiveConditions', this.allActiveType)
    }
  },
  methods: {
    ...mapMutations(['userPos', 'updateActiveConditions', 'setMask', 'upColor', 'updateChangeFans']),
    /**
     * hiddleMask隐藏mask
     */
    hiddleMask () {
      this.isSelectLabel = false
      this.isShowDistance = false
    },
    /**
     * handleDistanceIndex处理距离的选项
     */
    handleDistanceIndex (index) {
      this.distanceIndex = parseInt(index)
      this.isShowDistance = false
      this.resetData()
    },
    handleShopDistance (data) {
      if (this.isShowDistance) {
        this.isShowDistance = false
      } else {
        this.isShowDistance = true
      }
    },
    /**
     * createShop创建商家
    */
    createShop () {
      if (!this.authentication.isLogin()) {
        this.go.login()
        return
      }
      if (!this.$store.getters.hasBaseInfo()) {
        this.showConfirm.toPersonal()
        return
      }
      if (!this.user.userBusiness) {
        this.$router.push({name: 'create_shop'}) 
      } else if (this.user.userBusiness.businessState === 0) {
        this.$router.push({name: 'look_shop'}) // 表示审核商家
      } else {
        this.$router.push({name: 'modify_shop', params: {businessId: this.user.userBusiness.userBusinessId}}) // 表示修改商家
      }
    },
    // /**
    //  * goCreate 
    //  */
    // goCreate () {
    //   if (!this.$store.state.isInApp) {
    //     window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=io.dcloud.H50D8112A'
    //     return
    //   }
    //   if (!this.authentication.isLogin()) {
    //     this.go.login()
    //     return
    //   }
    //   if (!this.$store.getters.hasBaseInfo()) {
    //     this.showConfirm.toPersonal()
    //     return
    //   }
    //   this.$router.push({ name: 'groupCreate' })
    // },
     /**
     * createDiscount创建优惠活动
     */
    createDiscount () {
      if (!this.authentication.isLogin()) {
        this.go.login()
        return
      }
      if (!this.$store.getters.hasBaseInfo()) {
        this.showConfirm.toPersonal()
        return
      }
      if (!this.user.userBusiness) {
        this.$toast('您需要先创建商家才能发布优惠', 700)
        return
      }
      if (!this.pos.longitude && !this.pos.latitude) {
        this.$toast('您需要开启定位才能发布优惠', 700)
        window.isInAndroid && window.WanAndroid.getLocation()
        return
      } else {
        this.$router.push({name: 'release_discount', params:{businessId: this.userBusiness && this.userBusiness.userBusinessId}})
      }
    },
    /**
     * handleSelected () 处理选择答案排序的标签
    */
    handleSelected (index) {
      if (this.isSelectLabel) {
        this.index = index
        this.isSelectLabel = false
        this.orderType = index
        if (index === 1) {
          this.labelTitle = '综合排序'
          this.index = index
          this.resetData()
        }
        if (index === 2) {
          this.labelTitle = '时间排序'
          this.index = index
          this.resetData()
        }
      } else {
        this.isSelectLabel = true
      }
    },
    /**
    * getNeabryList 得到附近商家列表
    */
    getNeabryList () {
      let me = this
      let newUrl = `UserBusiness?PageIndex=${me.curPage}&PageSize=${me.pageSize}&Longitude=${me.pos.longitude}&Latitude=${me.pos.latitude}&OrderType=${me.orderType}&Distance=${me.distanceIndex}`
      me.api.get({
          url: newUrl,
          success: function (res) {
          me.curPage === 1 && (me.shopNeabryList = [])
          me.shopNeabryList = me.shopNeabryList.concat(res)
          if (me.shopNeabryList.length > 0) {
              me.isLoad = false
              me.isFail = false
          } else if (me.shopNeabryList.length === 0) {
              me.isLoad = false
              me.isFail = true
          }
        },
        error: function (res) {
        me.$msg.showError(res.msg)
        me.$refs.scroll && me.$refs.scroll.forceUpdate()
        },
        complete: function () {
            me.$refs.scroll && me.$refs.scroll.forceUpdate()
            me.isLoad = false
        }
    })
   },
    resetData () {
      this.curPage = 1
      this.getNeabryList()
    },
    onPullingDown () {
      this.resetData()
    },
    onPullingUp () {
      // 更新数据
      this.curPage++
      this.getNeabryList()
    }
  }
}

</script>

<style lang="less" scoped>
.mySet-enter-active,.mySet-leave-active{
    transition:all 0.5s;
}
.mySet-enter,.mySet-leave-to{
    opacity:0;
}
 .shopListWrap{
    .showListHead{
        background:white;
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
      .findTool{
                    width:100%;
                    height:19.17vw;
                    display:flex;
                    font-size:3.7vw;
                    color:#333;
                    .one{
                        width:46.3vw;
                        height:100%;
                        display:flex;
                        justify-content: center;
                        align-items: center;
                        position: relative;
                        .people{
                            margin-right:2vw;
                            .activityNotice{
                                font-size:8vw;
                                color:rgb(11, 220, 207);
                            }
                        }
                    }
                    .one::after{
                        content:'';
                        width:0.2vw;
                        height:10vw;
                        position:absolute;
                        top:0;
                        right:0;
                        bottom:0;
                        margin:auto 0;
                        background:#ebebeb;
                    }
                    .two{
                        width:46.3vw;
                        height:100%;
                        display:flex;
                        justify-content: center;
                        align-items: center;
                        .qiqiu{
                            margin-right:2vw;
                            .activityNotice{
                                font-size:7vw;
                                color:#fd7098;
                            }
                        }
                    }
                }
    }
    .filterList{
        width:100%;
        height:13.43vw;
        position:relative;
        .ulOne{
            padding-left:4vw;
            box-sizing: border-box;
            li{
                height:13.43vw;
                display:flex;
                align-items: center;
                .condition{
                    display:flex;
                    color:#010101;
                    font-weight: 500;
                    align-items: center;
                    span:nth-child(1) {
                      margin-right:2.6vw;
                    }
                }
                .title{
                    color:#010101;
                    margin-left:9.17vw;
                    font-weight: 500;
                }
            }
        }
        .distanceList{
          width: 25vw;
          height:0vw;
          background:white;
          box-shadow: 0 0 1px #eeee;
          position:absolute;
          top:12.5vw;
          left:36vw;
          z-index:12;
          border-radius: 0 0 1vw 1vw;
          // transition:all 0.5s;
          overflow: hidden;
          li{
            height:8vw;
            line-height:8vw;
            padding-left:2vw;
            font-size:4vw;
            color:#666;
            span:nth-child(2) {
              margin-left:3vw;
              .activityNotice{
                color:#189cfe;
              }
            }
          }
        }
        .haveHeightUl{
          height:33vw;
          // transition:all 0.5s;
        }
        .selectBtn{
          width:32vw;
          height:0vw;
          position:absolute;
          // padding-left:2vw;
          // padding-top:3vw;
          box-sizing: border-box;
          top:12.5vw;
          left:0vw;
          background-color:white;
          color:#444444;
          font-size:4vw;
          border-radius: 1vw;
          z-index: 12;
          overflow: hidden;
          // transition:all 0.5s;
          border-radius: 0 0 1vw 1vw;
          // box-shadow: 0 0 1px #eee;
          .btnOne{
            width:30vw;
            height:6vw;
            margin-bottom:1vw;
            margin-left:2vw;
            margin-top:2vw;
          }
          .activityNotice{
            color:#189cfe;
            font-weight: 500;
            margin-left:3vw;
          }
        }
        .haveBtnHeight{
          height:20vw;
          // transition:all 0.5s;
        }
    }
    .mask{
      width:100%;
      height:180vw;
      position:fixed;
      top:44vw; 
      left:0;
      z-index:11;
      background-color:rgba(0,0,0,.5);
    }
    .shopList{
      width:100%;
      height:131vw;
      overflow: hidden;
      height:calc(100vh - 45vw);
    }
 }
</style>
