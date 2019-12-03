<template>
  <div class="postShopPage">
    <pickerCityList :show='hasMask && pickerCityMask' @hidePickerCity='setPickerCity(false)' @pickerCity='pickerCity'></pickerCityList>
    <textArea
      :textAreaData="shopDesc"
      :show="textAreaMask"
      v-if="textAreaMask"
      @submitText="getTextAreaData"
    ></textArea>
    <v-map
      v-if="hasMask && addressMask"
      :title="shop.title"
      :address="shop.address && shop.address.curTit"
      @hideBMapPage="setAddressMask(false)"
      @subAdd="setAddress"
    ></v-map>
    <v-tags
      v-show="hasMask && tagsMask"
      @showLabel="getTags"
      :labels="tagsLabel"
      :maxLength=1
      title="商户类型"
      :isNeedTitle="isNeedTitle"
      @groupCategory="shopCategory"
    ></v-tags>
    <ShopTime v-show="timeMask" @setTimeMask="setTimeMask" @eachTime="eachTime"></ShopTime>
    <imageList @upFiles="getFiles" :canUploadVideo="canUploadVideo" :maxLength=5></imageList>
    <div>
      <ul class="shopBaseInfo LRForm">
        <li class="LRFormItem borderB">
          <span class="LFormItem">商户名</span>
          <div class="inputWrapper FormItemContent canClear">
            <input type="text" maxlength="10" v-model="shop && shop.title" placeholder="不超过10个字">
            <i
              v-show="shop.title && shop.title.length"
              class="inputClose iconWanwan iconWclose"
              @click="clear('shop.title')"
            ></i>
          </div>
        </li>
        <li class="LRFormItem borderB" @click="setTagsMask(true)">
          <span class="LFormItem">商户类型</span>
          <p class="FormItemContent">
            <span v-if="shop.tags">{{shop.tags[0]}}</span>
            <span v-for="(item, index) in shop.tags" :key="index" v-show="index">{{'、' + item}}</span>
          </p>
          <p class="RText">
            <span v-show="!shop.tags || (shop.tags && !shop.tags.length)">请选择</span>
            <i class="iconWxiayibu iconWanwan textR"></i>
          </p>
        </li>
        <!-- <li class="LRFormItem borderB" @click="setPickerCity(true)">
          <span class="LFormItem">城市</span>
          <p class="FormItemContent">
            <span v-if="posCity">{{posCity}}</span>
          </p>
          <p class="RText">
            <span v-show="!posCity">请选择</span>
            <i class="iconWxiayibu iconWanwan textR"></i>
          </p>
        </li> -->
        <li class="LRFormItem borderB" @click="setAddressMask(true)">
          <span class="LFormItem">地址</span>
          <p class="FormItemContent" v-if="shop.address">{{shop.address.province}}{{shop.address.city}}</p>
          <p class="FormItemContent" v-else></p>
          <p class="RText">
            <span v-show="!shop.address">请选择</span>
            <i class="iconWxiayibu iconWanwan textR"></i>
          </p>
        </li>
        <li class="LRFormItem borderB">
          <span class="LFormItem">详细地址</span>
          <input class="FormItemContent" v-if="shop.address" v-model="calculateAddress"></input>
          <p class="FormItemContent" v-else></p>
          <!-- <p class="RText">
            <span v-show="!shop.address">请选择</span>
            <i class="iconWxiayibu iconWanwan textR"></i>
          </p> -->
        </li>
        <li class="LRFormItem borderB">
          <span class="LFormItem">联系人</span>
          <div class="inputWrapper FormItemContent canClear">
            <input type="text" maxlength="10" v-model="shop.name" placeholder="不超过10个字">
            <i
              v-show="shop.name && shop.name.length"
              class="inputClose iconWanwan iconWclose"
              @click="clear('shop.name')"
            ></i>
          </div>
        </li>
        <li class="LRFormItem borderB">
          <span class="LFormItem">联系电话</span>
          <div class="inputWrapper FormItemContent canClear">
            <!-- <input type="text" maxlength="12" v-model="shop.phone" placeholder="座机号格式为:区号-电话号"> -->
            <input class="phoneInput" name="phone" type="number" placeholder="座机号格式为:区号-电话号" v-model="shop.phone" oninput="if(value.length>11)value=value.slice(0,12)"/>
            <i
              v-show="shop.phone && shop.phone.length"
              class="inputClose iconWanwan iconWclose"
              @click="clear('shop.phone')"
            ></i>
          </div>
        </li>
        
        <li class="LRFormItem borderB" @click="setTimeMask(true)">
          <span class="LFormItem">营业时间</span>
          <p class="FormItemContent" v-if="shop.week">{{shop.week}}</p>
          <p class="FormItemContent" v-else></p>
          <p class="RText">
            <span v-show="!shop.week">请选择</span>
            <i class="iconWxiayibu iconWanwan textR"></i>
          </p>
        </li>
        <li @click="postActive" class="LRFormItem submitPostBtnWrap lastLi">
          <div :class="canPost?'submitPostBtn canSubmitPost':'submitPostBtn'">提交申请</div>
        </li>
        <li class="shopTip">创建商户需审核，请认真填写</li>
      </ul>
    </div>
  </div>
</template>
<script>
import VMap from '@/components/Map/SMap.vue'
import VTags from '@/components/VTags'
import textArea from '@/components/TextArea'
import imageList from '@/components/upLoader/imageUploader'
import { mapState, mapMutations } from 'vuex'
import pickerCityList from '@/views/Activity/components/pickerCityList'
import ShopTime from './components/shopTime'
export default {
  components: {
    VMap,
    VTags,
    textArea,
    imageList,
    pickerCityList,
    ShopTime,
  },
  data() {
    return {
      isNeedTitle: true, // 表示需要传title
      selectTitle: '', // 选择的标签title
      isCreate: false, // 表示是否创建；了
      businessUser: {},
      pickerCityMask: false, // 表示选择城市
      shopLabelCategoty: '', // 群组的标签类别
      oneCreat: true, // 表示第一次创建
      addressMask: false,
      tagsMask: false,
      textAreaMask: false,
      timeMask: false, // 营业时间
      shop: {},
      canUploadVideo: false,
      tagsLabel: [
        {
          title: '教育培训',
          tags: ['留学', '职业培训', '语言培训', '兴趣生活', '成人学历提升', '升学辅导', '教育院校', '在线教育', '音乐培训', '驾驶培训', '美术书法培训', '其他教育培训']
        },
        {
          title: '餐饮',
          tags: [
            '水果生鲜',
            '火锅',
            '小吃快餐',
            '自助餐',
            '日本菜',
            '韩国菜',
            '北京菜',
            '川菜',
            '湘菜',
            '台湾菜',
            '特色菜',
            '西餐',
            '饮品店',
            '其他餐饮',
            '面包甜点',
            '烧烤',
            '粤菜',
            '食品保健',
          ]
        },
        {
          title: '丽人',
          tags: ['美发', '美甲', '美容美体', '化妆品', '养发', '纹身', '舞蹈', '瑜伽', '美睫纹绣']
        },
        {
          title: '医疗',
          tags: ['中医', '药店', '体检中心', '口腔齿科', '医疗器械', '采供血机构', '保健疗养院', '诊所', '眼科']
        },
        {
          title: '休闲娱乐',
          tags: ['网吧/电竞', '汽车影院', '密室', '舞厅', '酒吧', '茶馆', '互动影院', '桌游', '游戏厅', 'VR', 'DIY手工坊', '真人CS','采摘/农家乐']
        },
        {
          title: '结婚',
          tags: [
            '婚纱摄影',
            '成人写真',
            '司仪主持',
            '婚纱礼服',
            '婚礼跟拍',
            '彩妆造型',
            '婚宴场地',
            '婚车租赁',
            '婚庆公司',
            '婚戒首饰',
            '婚礼喜品',
            '西服定制',
            '旅拍'
          ]
        },
        {
          title: '生活服务',
          tags: [
            '商务服务',
            '心理咨询',
            '自行车租赁',
            '文印图文',
            '公司企业',
            '房屋地产',
            '文化传媒',
            '交通票务',
            '公共服务',
            '彩票',
            '快照',
            '金融',
            '其他生活服务',
            '网站'
          ]
        },
        {
          title: '亲子',
          tags: [
            '幼儿教育',
            '育婴童摄影',
            '母婴用品',
            '亲子游乐',
            '婴幼服务',
            '其他亲子',
            '孕产服务'
          ]
        },
        {
          title: '宠物',
          tags: [
            '宠物食品用品',
            '猫舍犬舍',
            '宠物店',
            '宠物医院',
            '其他宠物'
          ]
        },
        {
          title: '爱车',
          tags: [
            '其他爱车',
            '加油充电',
            '救援理赔',
            '服务区',
            '维修保养',
            '配件厂商',
            '停车场',
            '买车卖车',
            '租车',
            '美容汽车',
          ]
        },
        {
          title: '运动健身',
          tags: [
            '球类运动',
            '游泳',
            '武术格斗',
            '体育场馆',
            '休闲运动',
            '健身中心'
          ]
        },
        {
          title: '酒店',
          tags: [
            '其他酒店',
            '四星级/高档',
            '五星级/豪华',
            '特色酒店',
            '二星级及以下/经济',
            '度假村/别墅',
            '青年旅舍',
            '客栈旅舍',
            '酒店式公寓',
            '三星级/舒适'
          ]
        },
        {
          title: '家装',
          tags: [
            '家装展会',
            '定制家居',
            '其他家装',
            '装修设计',
            '家具家居',
            '建材',
            '家用电器',
            '家装卖场',
            '甲醛检测治理',
          ]
        },
        {
          title: '旅游',
          tags: [
            '景点',
            '其他旅游',
            '旅游票务',
            '水上项目',
            '旅行社',
            '游乐园',
            '旅游项目',
            '城市观光',
          ]
        },
        {
          title: '购物',
          tags: [
            '杂货礼品',
            '电子数码',
            '服饰鞋包',
            '文物古玩',
            '自行/电动车及配件',
            '运动户外',
            '轻奢',
            '钟表',
            '快时尚',
            '文化办公',
            '集市',
            '乐器',
            '居家日用',
            '奢侈品',
            '折扣店',
            '免税店',
            '批发店',
            '眼镜',
            '综合商场',
            '烟酒茶叶',
            '超市便利',
            '图书音像',
            '其他购物'
          ]
        },
        {
          title: '电影演出赛事',
          tags: [
            '大型演出',
            '演艺公司',
            '赛事',
            '影视公司',
            '其他电影演出赛事',
            '院线影院',
            '演出场馆',
            '演出票务',
          ]
        },
      ],
      curCity: '',
      curPage: 1,
      pageSize: 4,
      activities: [],
      allActiveType: {},
      activeType: {},
      calculateAddress: ''
    }
  },
  computed: {
    ...mapState({
      hasMask: 'hasMask',
      pos: 'pos'
    }),
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
      let region = window.regionData.filter((item, index) => {
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
    canPost() {
      // var s =
      //   this.shop.name &&
      //   this.shop.address &&
      //   (this.shop.tags && this.shop.tags.length) &&
      //   this.shop.desc &&
      //   (this.shop.files && this.shop.files.length)
      // return s
      return true
    }
  },
  watch: {
    selectedIndex(newV) {
      return newV
    },
    shop(newV) {
      return newV
    }
  },
  beforeDestroy() {
    window.isInAndroid && window.WanAndroid.imgCropType(0)
  },
  created () {
    window.isInAndroid && window.WanAndroid.imgCropType(1, 5)
  },
  methods: {
    ...mapMutations({
      setMask: 'setMask'
    }),
    /**
     * shopCategory选择标签的title
     */
    shopCategory (data) {
      this.selectTitle = data
      console.log("data:hahahah",data)
    },
    getFiles(data) {
      this.$set(this.shop, 'files', data)
    },
    clear(str) {
      if (str.indexOf('.') > 0) {
        let a1 = str.split('.')
        this[a1[0]][a1[1]] = ''
      } else {
        this[str] = ''
      }
    },
    setTextArea(data) {
      this.textAreaMask = data
    },
    getTextAreaData(data) {
      if (data) {
        this.$set(this.shop, 'desc', data.inputText)
        this.$set(this.shopDesc, 'inputText', data.inputText)
      }
      this.setTextArea(false)
    },
    setAddressMask(data) {
      this.addressMask = data
      this.setMask(data)
    },
    setAddress(data) {
      console.log('打印这个数据', data)
      this.$set(this.shop, 'address', data)
      let a1 = this.shop.address && this.shop.address.curTit
      let a2 = this.shop.address && this.shop.address.curAddress
      this.calculateAddress = a1 + a2
      this.setAddressMask(false)
    },
    setTagsMask(data) {
      this.tagsMask = data
      this.setMask(data)
    },
    /**
     * setTimeMask选择时间
     */
    setTimeMask(data) {
      this.timeMask = data
      this.setMask(data)
    },
    /**
     * 营业时间
     */
    eachTime (state,data) {
      this.shop.startTime = data.startTime
      this.shop.endTime = data.endTime
      this.shop.week = data.selectWeek
      this.timeMask = state
      this.setMask(state)
    },
    getTags(data) {
      data && this.$set(this.shop, 'tags', data) && this.setTagsMask(false)
      !data && this.setTagsMask(false)
    },
    // 新
    upFileThumbnail() {
      let me = this
      me.$uploading(true, '创建中...')
      return new Promise((resolve, reject) => {
        var fd = new FormData()
        fd.append('1', me.shop.files[0])
        me.api.file({
          url: 'FileThumbnail',
          data: fd,
          success: res => {
            me.shop.filesResults = []
            me.shop.filesResults.push(res.split(',')[1])
            resolve()
          },
          error: function() {
            // me.formLoading = false
            // me.$toast('上传失败')
            me.$error(true, '创建失败', 200)
            reject()
          }
        })
      })
    },
    postImageList() {
      let me = this
      return new Promise((resolve, reject) => {
        if (this.shop.files.length > 1) {
          var fd = new FormData()
          for (let i = 1; i < this.shop.files.length; i++) {
            fd.append('1' + i, this.shop.files[i])
          }
          me.api.file({
            url: 'file',
            data: fd,
            success: res => {
              me.shop.filesResults = me.shop.filesResults.concat(
                res.split(',')
              )
              resolve()
            },
            error: res => {
              reject()
              me.$error(true, '创建失败', 50)
            }
          })
        } else {
          resolve()
        }
      })
    },
    postActive() {
      console.log('addre', this.shop.address)
      console.log('打印地址', this.calculateAddress)
      // return
      if (!this.oneCreat) {
        return
      }
      if (!this.shop.title) {
        this.$toast('请输入商户名')
        return
      }
      if (!this.shop.tags || (this.shop.tags && !this.shop.tags.length)) {
        this.$toast('请选择商户类型')
        return
      }
      // if (!this.posCity) {
      //   this.$toast('请输入选择城市')
      //   return
      // }
      if (!this.shop.name) {
        this.$toast('请输入联系人')
        return
      }
      if (!this.shop.phone) {
        this.$toast('请输入联系电话')
        return
      }
      if (!this.shop.week) {
        this.$toast('请选择营业时间')
        return
      }
      let rightPhone = /^[1][3,4,5,7,8][0-9]{9}$/
      var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/
      var PhoneFour = /^400[0-9]{7}/
      var PhoneEgiht = /^800[0-9]{7}/
      // if (!rightPhone.test(this.shop.phone) || !isPhone) {
      //   this.$toast('请输入正确的联系电话')
      //   return  
      // }
      if (rightPhone.test(this.shop.phone) || isPhone.test(this.shop.phone) || PhoneFour.test(this.shop.phone) || PhoneEgiht.test(this.shop.phone)) {
        console.log("验证正确")
      } else {
        this.$toast('请输入正确的联系电话')
        return
      }
      if (!this.shop.address) {
        this.$toast('请选择地址')
        return
      }
      if (!this.calculateAddress) {
        this.$toast('请输入详细地址')
        return
      }
      console.log("打印一下",this.shop.files)
      if (!this.shop.files && !this.shop.files.length) {
        this.$toast('请上传群头像/图片')
        return
      }
      var me = this
      console.log('地址', this.calculateAddress)
      let p = this.upFileThumbnail()
      p.then(me.postImageList)
        .then(res => {
          let imageList = []
          for (let i = 0; i < me.shop.files.length; i++) {
            imageList.push(me.shop.filesResults[i])
          }
          me.api.process({
            url: 'UserBusiness',
            data: {
              businessImg: me.shop.filesResults[0], // 封面图片
              images: imageList, // 店面海报列表
              businessName: me.shop.title,
              businessType: me.shop.tags[0],
              businessTypeCategory: me.selectTitle, // 表示分类的大标题
              contractName: me.shop.name,
              businessPhone: me.shop.phone,
              province: me.shop.address.province,
              city: me.shop.address.city,
              startTime: me.shop.startTime,
              endTime: me.shop.endTime,
              week: me.shop.week ,
              street: me.calculateAddress,
              // address: `${me.shop.address.curTit}`,
              latitude: me.shop.address.latitude,
              longitude: me.shop.address.longitude
            },
            success: function() {
              me.oneCreat = false
              me.$success(true, '创建成功', 500)
              // me.$toast('创建群组成功，等待审核')
              me.go.refreshUser()
              me.$router.back()
            },
            error: function() {
              me.$error(true, '创建失败', 500)
              // me.$toast('发布失败')
            }
          })
        })
        .catch(res => {
          me.$error(true, '创建失败', 500)
        })
    },
    // 新
    setPickerCity (data) {
      this.pickerCityMask = data
      this.setMask(data)
    },
    pickerCity (item) {
      this.curCity = item
      this.setPickerCity(false)
      this.resetPage()
      this.curPage = 1
    //   this.initTypes()
      // this.resetData()
    },
     // 选择类型
    resetPage () {
      this.$refs.scroll && this.$refs.scroll.forceUpdate()
      this.setMask(false)
      this.setActionMask(false)
      this.curPickerItem = {}
    },
    // initTypes () {
    //   this.activeType = this.activeConditions.activetypes[0] && this.activeConditions.activetypes[0]
    //   this.activeTime = this.activeConditions.activetimes[0] && this.activeConditions.activetimes[0]
    //   this.activeFree = this.activeConditions.activeFrees[0] && this.activeConditions.activeFrees[0]
    //   // this.activeConditions.activeHots = this.regionList
    //   this.activeHot = this.regionList[0]
    //   this.getHomeData(this.activetype)
    // },
    setActionMask (data) {
      this.pickerShow && this.setPicker(false)
      this.actionMask = data
      this.setMask(data)
    }
  }
}
</script>
<style lang="less">
.LRForm .LRFormItem .iconWanwan.iconWperson-fill {
  color: var(--mRed);
}
.shopBaseInfo {
  .shopTip {
    margin-top: -4vw;
    font-size: var(--nText);
    text-align: center;
    color: var(--lGray);
    background: #fff;
  }
}
.postShopPage {
  color: var(--dGray);
  .postCoverWrapper {
    height: 44.53vw;
    background: #e7e7e7;
    .postCover {
      padding: 5.55vw 0;
      text-align: center;
      .imgBg {
        width: 22vw;
        height: 22vw;
        line-height: 22vw;
        font-size: 12vw;
        border-radius: 50%;
        background: #fff;
        margin: 0 auto;
      }
      p {
        height: 10.9vw;
        line-height: 10.9vw;
        font-size: var(--mText);
        letter-spacing: 1px;
        font-weight: bold;
      }
    }
  }
  .lastLi{
    // margin-top:5vw;
  }
}
</style>
