<template>
  <div class="postActivityPage">
    <PostLogout :confirmMsg="confirmMsg"
                v-if="isShowConfirm"
                @handleConfirm="handleConfirm"
                @really="really"></PostLogout>
    <model v-if="modelShow"
           @modelCallBack="modelCallBack"
           :msg="modelMsg"></model>
    <model v-if="saveDraftsModel"
           @modelCallBack="modelCallBackDraft"
           :msg="modelMsgDraft"></model>
    <jeft-editor :show="hasMask && editorShow"
                 @hideEditor="hideEditorMask"
                 postName="保存"
                 :detail="activity.details"></jeft-editor>
    <v-map v-if="hasMask && addressMask"
           @hideBMapPage="setAddressMask(false)"
           :address="activity.address && activity.address.curTit"
           @subAdd="setAddress"></v-map>
    <!-- <v-tags v-show="hasMask && tagsMask" :labels="tagsLabel" @showLabel="getTags"></v-tags> -->
    <v-tags v-show="hasMask && typeTagsMask"
            title="活动类型"
            :labels="avtivityLabel"
            :maxLength="1"
            @showLabel="getTypeTags"></v-tags>
    <v-picker ref="picker"
              :data="pickerData"
              :title="pickerTitle"
              :selected-index="startSelectedIndex"
              @select="selectPicker"></v-picker>
    <v-picker ref="endPicker"
              :data="pickerData"
              :title="pickerTitle"
              :selected-index="endSelectedIndex"
              @select="selectPicker"></v-picker>
    <v-picker ref="joinEndPicker"
              :data="pickerData"
              :title="pickerTitle"
              :selected-index="endJoinSelectedIndex"
              @select="selectPicker"></v-picker>
    <div class="postCoverWrapper">
      <img v-show="activity.activityImg"
           :src="activity.activityImg">
      <i class="iconWanwan iconWtihuantupian"
         v-show="activity.activityImg">
        <input accept="image/*"
               type="file"
               class="postCoverInput"
               @change="postCoverImage">
      </i>
      <input accept="image/*"
             type="file"
             class="postCoverInput"
             @change="postCoverImage"
             v-show="!activity.activityImg">
      <div class="postCover">
        <div class="imgBg iconWtianjiatupian iconWanwan">
          <!-- <i class="iconWtianjiatupian iconWanwan"></i> -->
        </div>
        <p>添加活动海报</p>
      </div>
    </div>
    <div class>
      <ul class="activityBaseInfo LRForm">
        <li class="LRFormItem borderB">
          <span class="LFormItem">活动标题</span>
          <div class="inputWrapper FormItemContent canClear">
            <input type="text"
                   maxlength="15"
                   v-model="activity.title"
                   placeholder="不超过15个字">
            <i v-show="activity.title && activity.title.length"
               class="inputClose iconWanwan iconWclose"
               @click="clear('activity.title')"></i>
          </div>
        </li>
        <li class="LRFormItem borderB"
            @click="setAddressMask(true)">
          <span class="LFormItem">活动地点</span>
          <p class="FormItemContent"
             v-if="activity.address">{{activity.province}}{{activity.city}}{{activity.district}}</p>
          <p class="FormItemContent"
             v-else></p>
          <p class="RText">
            <span v-show="!activity.address">请选择</span>
            <i class="iconWxiayibu iconWanwan textR"></i>
          </p>
        </li>
        <li class="LRFormItem borderB">
          <span class="LFormItem">详细地点</span>
          <input class="FormItemContent descAddress"
                 v-if="activity.address"
                 v-model="activity.address" />
          <p class="FormItemContent"
             v-else></p>
          <!-- <p class="RText">
            <span v-show="!activity.address">请选择</span>
            <i class="iconWxiayibu iconWanwan textR"></i>
          </p> -->
        </li>
        <li class="LRFormItem borderB">
          <span class="LFormItem">活动时间</span>
          <input name="Name"
                 type="text"
                 v-model="activity.createTime"
                 class="FormItemContent"
                 placeholder="请设置活动开始时间"
                 @click="selectDate(0)"
                 readonly>
        </li>
        <li class="LRFormItem borderB">
          <span class="LFormItem">结束时间</span>
          <input v-model="activity.endTime"
                 class="FormItemContent"
                 placeholder="请设置活动结束时间"
                 @click="selectDate(1)"
                 readonly>
        </li>
        <li class="LRFormItem borderB marginTL">
          <span class="LFormItem">活动结束前均可报名</span>
          <p class="FormItemContent"></p>
          <i :class="endCanJoin?'YNBtn YBtn textR':'YNBtn NBtn textR' "
             @click="endCanJoin = !endCanJoin"></i>
        </li>
        <li class="LRFormItem borderB"
            v-show="!endCanJoin">
          <span class="LFormItem">报名截止时间</span>
          <input v-model="activity.joinEndTime"
                 class="FormItemContent"
                 placeholder="请设置报名截止时间"
                 @click="selectDate(2)"
                 readonly>
        </li>
        <li class="LRFormItem borderB marginTL">
          <span class="LFormItem">免费活动</span>
          <p class="FormItemContent"></p>
          <i :class="isFree?'YNBtn YBtn textR':'YNBtn NBtn textR' "
             @click="isFree = !isFree"></i>
        </li>
        <li class="LRFormItem borderB"
            v-show="!isFree">
          <span class="LFormItem">报名费用</span>
          <input type="number"
                 v-model="activity.fee"
                 class="FormItemContent"
                 placeholder="请设置活动报名费用">
          <i>元</i>
        </li>
        <li class="LRFormItem borderB marginTL"
            @click="setEditorMask(true)">
          <span class="LFormItem">活动详情</span>
          <div class="FormItemContent"
               v-html="details"></div>
          <p class="RText">
            编辑
            <i class="iconWxiayibu iconWanwan textR"></i>
          </p>
        </li>
        <li @click="postActive"
            class="LRFormItem submitPostBtnWrap marginTL">
          <div class="submitPostBtn canSubmitPost">确认修改</div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import PostLogout from '@/views/Discover/components/PostLogout'
// import VEditor from '@/components/Editor'
import JeftEditor from '@/components/VueEditor'
import model from '@/components/model/model'
import VMap from '@/components/Amap'
import VTags from '@/components/VTags'
import VPicker from '@/components/picker'
import { mapState, mapMutations, mapGetters } from 'vuex'
import groupList from './components/pickerGroupList'
const Hours = [
  { text: '00', value: '凌晨' },
  { text: '01', value: '凌晨' },
  { text: '02', value: '凌晨' },
  { text: '03', value: '凌晨' },
  { text: '04', value: '凌晨' },
  { text: '05', value: '上午' },
  { text: '06', value: '上午' },
  { text: '07', value: '上午' },
  { text: '08', value: '上午' },
  { text: '09', value: '上午' },
  { text: 10, value: '上午' },
  { text: 11, value: '上午' },
  { text: 12, value: '下午' },
  { text: 13, value: '下午' },
  { text: 14, value: '下午' },
  { text: 15, value: '下午' },
  { text: 16, value: '下午' },
  { text: 17, value: '下午' },
  { text: 18, value: '下午' },
  { text: 19, value: '晚上' },
  { text: 20, value: '晚上' },
  { text: 21, value: '晚上' },
  { text: 22, value: '晚上' },
  { text: 23, value: '晚上' }
]
const Mins = [
  { text: '00' },
  { text: '01' },
  { text: '02' },
  { text: '03' },
  { text: '04' },
  { text: '05' },
  { text: '06' },
  { text: '07' },
  { text: '08' },
  { text: '09' },
  { text: 10 },
  { text: 11 },
  { text: 12 },
  { text: 13 },
  { text: 14 },
  { text: 15 },
  { text: 16 },
  { text: 17 },
  { text: 18 },
  { text: 19 },
  { text: 20 },
  { text: 21 },
  { text: 22 },
  { text: 23 },
  { text: 24 },
  { text: 25 },
  { text: 26 },
  { text: 27 },
  { text: 28 },
  { text: 29 },
  { text: 30 },
  { text: 31 },
  { text: 32 },
  { text: 33 },
  { text: 34 },
  { text: 35 },
  { text: 36 },
  { text: 37 },
  { text: 38 },
  { text: 39 },
  { text: 40 },
  { text: 41 },
  { text: 42 },
  { text: 43 },
  { text: 44 },
  { text: 45 },
  { text: 46 },
  { text: 47 },
  { text: 48 },
  { text: 49 },
  { text: 50 },
  { text: 51 },
  { text: 52 },
  { text: 53 },
  { text: 55 },
  { text: 55 },
  { text: 56 },
  { text: 57 },
  { text: 58 },
  { text: 59 }
]
export default {
  components: {
    VMap,
    VTags,
    VPicker,
    // VEditor,
    JeftEditor,
    model,
    groupList,
    PostLogout
  },
  data() {
    return {
      toTip: true, //  返回提示不  -> 没修改 || 修改了没提交 || 返回 -> 提示
      Oactivity: {}, // originActivity 保存原始数据
      activetyId: this.$route.params.id,
      path: '',
      isReallyBack: false, // 是否真的想退出
      isShowConfirm: false,
      confirmMsg: '', // 退出消息
      draftsList: [], // 草稿箱list
      groupListMask: false,
      isUploading: false,
      endCanJoin: true,
      isFree: true,
      activity: {},
      addressMask: false,
      tagsMask: false,
      typeTagsMask: false,
      pickerData: [],
      startSelectedIndex: [0, 6, 6],
      endSelectedIndex: [0, 7, 7],
      endJoinSelectedIndex: [0, 7, 7],
      startSelected: [],
      endSelected: [],
      endJoinSelected: [],
      curPicker: 0,
      pickerTitle: '选择活动开始时间',
      editorShow: false,
      files: [],
      filesResults: '',
      modelShow: false,
      modelMsg: {
        info: '是否启用草稿',
        title: '检测到您有草稿',
        L: '取消',
        R: '确定'
      },
      saveDraftsModel: false, // 显示提醒 -> 存草稿
      modelMsgDraft: {
        info: '方便下次发布活动哦',
        title: '是否保存草稿',
        L: '取消',
        R: '确定'
      },
      calculateCity: '', // 详细地点
      date: this.format.getDate(new Date())
    }
  },
  computed: {
    ...mapState({
      activeConditions: 'activeConditions',
      hasMask: 'hasMask'
    }),
    ...mapGetters({
      avtivityLabel: 'activityType'
    }),
    avtivityLabel() {
      let avtivityLabel = [
        {
          title: '活动类型',
          tags: []
        }
      ]
      this.activeConditions.activetypes.map((item, index) => {
        index && avtivityLabel[0].tags.push(item.label)
      })
      return avtivityLabel
    },
    details() {
      if (!this.activity.details) {
        return
      }
      return this.activity.details
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
    }
  },
  created() {
    !this.avtivityLabel[0].tags.length && this.getActiveConditions()
    this.getActivity()
  },
  activated () {
    this.toTip = true // 每次进来将是否提示flag置否
  },
  mounted() {
    window.isInAndroid && window.WanAndroid.imgCropType(1, 1) // 横
  },
  beforeDestroy() {
    window.isInAndroid && window.WanAndroid.imgCropType(0)
  },
  beforeRouteLeave (to, from, next) {
    if (this.toTip) {
      this.$confirm({
          title: '提示',
          msg: '确认退出修改活动？',
          yesBtnText: '确定',
          type: 'confirm'
        }).then(() => {
          // this.toTip = true
          next()
        }).catch(() => {
          next(false)
        })
    } else {
      next()
    }
  },
  watch: {
    selectedIndex(newV) {
      return newV
    },
    activity(newV) {
      return newV
    },
    hasMask(newV) {
      if (!newV) {
        this.addressMask = false
        this.tagsMask = false
        this.editorShow = false
      }
    },
    /** 编辑器中image要横图 */
    editorShow (newV) {
      if (newV) {
        window.isInAndroid && window.WanAndroid.imgCropType(0, 1) // 横
      } else {
        window.isInAndroid && window.WanAndroid.imgCropType(1, 1) // 方
      }
    }
  },
  methods: {
    ...mapMutations({
      updateActiveConditions: 'updateActiveConditions',
      setMask: 'setMask',
      upDraftsIndex: 'upDraftsIndex',
      setClick: 'setClick',
      updateMasterCurTab: 'updateMasterCurTab',
      upPostCurTab: 'upPostCurTab'
    }),
    /** 清空 input的value 或obj的某个属性 */
    clear(str) { // 清空每个值或者属性
      if (str.indexOf('.') > 0) {
        let a1 = str.split('.')
        this[a1[0]][a1[1]] = ''
      } else {
        this[str] = ''
      }
    },
    /** 
     * 获取活动信息
     */
    getActivity () {
      var me = this
      me.api.get({
        'url': `ActivityDetails?ActivityId=${me.activetyId}`,
        success: function (res) {
          me.activity = JSON.parse(JSON.stringify(res))
          me.Oactivity = JSON.parse(JSON.stringify(res))
          // 获取活动类型
          // let typeTag = me.activeConditions.activetypes.filter((item, index) => { 
          //   return item.value == res.activityCategoryId
          // })[0]
          // me.$set(me.activity, 'typeTag', typeTag)
          // console.log(typeTag)
          // 获取pickerIndex
            // pickerStart date
          if (new Date(me.activity.beginTime).getTime() <  me.date.getTime()) { // 起始时间小于现在
            me.date = new Date(me.activity.beginTime)
          }
          console.log(new Date(), me.date, 'me.date')
          console.log(new Date(res.beginTime + 'Z'), 'bb')
            // begin
          let d = parseInt((new Date(res.beginTime).getTime() - me.date.getTime()) / (86400 * 1000))
          if ((me.format.date(res.beginTime, 'hhmmss') < me.format.date(me.date, 'hhmmss'))) {
            d = d  + 1
          }
          let h = (new Date(res.beginTime)).getHours()
          let m = (new Date(res.beginTime)).getMinutes()
          me.$set(me.startSelectedIndex, 0, d)
          me.$set(me.startSelectedIndex, 1, h)
          me.$set(me.startSelectedIndex, 2, m)
          me.$set(me.activity, 'createTime', me.format.date(res.beginTime, 'yyyy/MM/dd ' + me.getWeekDay(res.beginTime) + ' ' + me.getHalfDay(res.beginTime) + ' hh:mm'))
            // end
          let ed = parseInt((new Date(res.endTime).getTime() - me.date.getTime()) / (86400 * 1000))
          if ((me.format.date(res.endTime, 'hhmmss') < me.format.date(me.date, 'hhmmss'))) {
            ed = ed  + 1
          }
          let eh = (new Date(res.endTime)).getHours()
          let em = (new Date(res.endTime)).getMinutes()
          me.$set(me.endSelectedIndex, 0, ed)
          me.$set(me.endSelectedIndex, 1, eh)
          me.$set(me.endSelectedIndex, 2, em)
          me.$set(me.activity, 'endTime', me.format.date(res.endTime, 'yyyy/MM/dd ' + me.getWeekDay(res.endTime) + ' ' + me.getHalfDay(res.endTime) + ' hh:mm'))
          // endCanJoin
          me.endCanJoin = res.endTime === res.closeTime
          let cd = parseInt((new Date(res.closeTime).getTime() - me.date.getTime()) / (86400 * 1000))
          if ((me.format.date(res.closeTime, 'hhmmss') < me.format.date(me.date, 'hhmmss'))) {
            cd = cd  + 1
          }
          let ch = (new Date(res.closeTime)).getHours()
          let cm = (new Date(res.closeTime)).getMinutes()
          me.$set(me.endJoinSelectedIndex, 0, cd)
          me.$set(me.endJoinSelectedIndex, 1, ch)
          me.$set(me.endJoinSelectedIndex, 2, cm)
          me.$set(me.activity, 'joinEndTime', me.format.date(res.closeTime, 'yyyy/MM/dd ' + me.getWeekDay(res.closeTime) + ' ' + me.getHalfDay(res.closeTime) + ' hh:mm'))
          // fee
          me.isFree = res.fee ? false : true
          !me.isFree && me.$set(me.activity,'fee', res.fee)
        },
        complete: function () {
        }
      })
    },
    /** 上传封面:读取imgFIle */
    postCoverImage(e) {
      let me = this
      if (e.target.files[0].type.indexOf('image') >= 0) {
        var reader = new FileReader()
        var file = e.target.files[0]
        reader.onload = function(e) {
          me.upFileThumbnail(file)
        }
        reader.readAsDataURL(file)
      }
    },
    /** 上传封面图片并赋值给 activity.activityImg */
    upFileThumbnail(file) {
      let me = this
      return new Promise((resolve, reject) => { 
        var fd = new FormData()
        fd.append('1', file)
        me.api.file({
            url: 'FileThumbnailOnly',
            data: fd,
            success: res => {
                me.$set(me.activity, 'activityImg', res)
                resolve()
            }
        })
      })
    },
    /** 选择地址并更新 */
    setAddress(data) {
      this.$set(this.activity, 'address', data.curTit + data.curAddress)
      this.$set(this.activity, 'province', data.province)
      this.$set(this.activity, 'city', data.city)
      this.$set(this.activity, 'district', data.district)
      this.$set(this.activity, 'longitude', data.longitude)
      this.$set(this.activity, 'latitude', data.latitude)
      this.setAddressMask(false)
    },
    /** 隐藏/显示 选择地址Mask */
    setAddressMask(data) {
      this.setMask(data)
      this.addressMask = data
    },
    /** 
     * 获取 活动类型列表
     */
    getActiveConditions() {
      var me = this
      me.api.get({
        url: 'Condition/id',
        success: function(res) {
          let allActiveType = res
          allActiveType.activetypes.unshift({
            label: '全部',
            value: 0
          })
          allActiveType.activetypes.map((item, index) => {
            index && me.avtivityLabel[0].tags.push(item.label)
          })
          me.$store.commit('updateActiveConditions', allActiveType)
        }
      })
    },
    /** 选择活动类型 */
    getTypeTags(data) {
      if (data) {
        let activityTypeTagId = this.activeConditions.activetypes.filter((item, index) => {
            return item.label === data[0]
        })[0]
        this.$set(this.activity, 'typeTag', activityTypeTagId)
      }
      this.setTypeTagsMask(false)
    },
    /** 隐藏/显示 选择活动类型Mask */
    setTypeTagsMask(data) {
      this.setMask(data)
      this.typeTagsMask = data
    },
    /** 接受Editor的值并隐藏editorMask */
    hideEditorMask(data) {
      data && this.$set(this.activity, 'details', data)
      // this.activity.details = data
      this.setEditorMask(false)
    },
    /** 控制EditorMaks 的显隐 */
    setEditorMask(data) {
      this.setMask(data)
      this.editorShow = data
    },
    /** 初始化时间列表 活动开始 | 活动结束 | 活动截止报名 */
    selectDate(index) {
      this.pickerData = []
      let date = this.date
      this.curPicker = index
      this.pickerData.push(
        { flex: 2, data: this.initDate(date) },
        { flex: 1, data: Hours },
        { flex: 1, data: Mins }
      )
      index === 0 &&
        (this.pickerTitle = '设置活动开始时间') &&
        this.$refs.picker.show()
      index === 1 &&
        (this.pickerTitle = '设置活动结束时间') &&
        this.$refs.endPicker.show()
      index === 2 &&
        (this.pickerTitle = '设置报名截止时间') &&
        this.$refs.joinEndPicker.show()
    },
    /** 选择时间并赋值 活动开始 | 活动结束 | 活动截止报名 */
    selectPicker(pickerSelectedVal, selectedIndex, data3) { 
      this.curPicker === 0 &&
        (this.startSelectedIndex = selectedIndex) &&
        (this.startSelected = pickerSelectedVal) &&
        this.$set(
          this.activity,
          'createTime',
          pickerSelectedVal[0].value +
            ' ' +
            pickerSelectedVal[1].value +
            ' ' +
            pickerSelectedVal[1].text +
            ':' +
            pickerSelectedVal[2].text
        )
      this.curPicker === 1 &&
        (this.endSelectedIndex = selectedIndex) &&
        (this.endSelected = pickerSelectedVal) &&
        this.$set(
          this.activity,
          'endTime',
          pickerSelectedVal[0].value +
            ' ' +
            pickerSelectedVal[1].value +
            ' ' +
            pickerSelectedVal[1].text +
            ':' +
            pickerSelectedVal[2].text
        )
      this.curPicker === 2 &&
        (this.endJoinSelectedIndex = selectedIndex) &&
        (this.endJoinSelected = pickerSelectedVal) &&
        this.$set(
          this.activity,
          'joinEndTime',
          pickerSelectedVal[0].value +
            ' ' +
            pickerSelectedVal[1].value +
            ' ' +
            pickerSelectedVal[1].text +
            ':' +
            pickerSelectedVal[2].text
        )
      if (this.endCanJoin && this.curPicker === 1) {
        // this.$set(this.activity, 'joinEndTime', this.activity.endTime)
        (this.endJoinSelectedIndex = selectedIndex) &&
          (this.endJoinSelected = pickerSelectedVal) &&
          this.$set(
            this.activity,
            'joinEndTime',
            pickerSelectedVal[0].value +
              ' ' +
              pickerSelectedVal[1].value +
              ' ' +
              pickerSelectedVal[1].text +
              ':' +
              pickerSelectedVal[2].text
          )
      }
    },
    /** 获取 星期几 */
    getWeekDay (date) {
        let weekData = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        let index = this.format.getDate(date).getDay()
        return weekData[index]
    },
    /** 获取 上午/下午/晚上 */
    getHalfDay (date) {
        let h = this.format.getDate(date).getHours()
        let textH = Hours.filter((item, index) => {
            return parseInt(item.text) == h
        })[0]
        return textH.value
    },
    /** 初始化时间列表 给picker */
    initDate(date) { // 初始化时间 一年
      // let me = this
      let weekData = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      let startWeekDay = new Date(date).getDay()
      let listWeek = weekData.slice(startWeekDay)
      let dayData = []
      // var data = ''
      let y = date.getFullYear()
      for (let m = date.getMonth() + 1; m <= 12; m++) {
        var dEnd
        dEnd =
          [1, 3, 5, 7, 8, 10, 12].indexOf(m) >= 0
            ? 31
            : [2].indexOf(m) >= 0
            ? (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0
              ? 29
              : 28
            : 30
        let startDay = m === date.getMonth() + 1 ? date.getDate() : 1
        for (let d = startDay; d <= dEnd; d++) {
          !listWeek.length && (listWeek = listWeek.concat(weekData))
          let weekDay = listWeek.shift()
          var data = m + '月' + d + '日' + ' ' + weekDay
          let m2 = m >= 10 ? m : '0' + m
          let d2 = d >= 10 ? d : '0' + d
          var sss = {
            value: y + '/' + m2 + '/' + d2 + ' ' + weekDay,
            text: data
          }
          dayData.push(sss)
        }
      }
      y = y + 1
      for (let m = 1; m <= date.getMonth() + 1; m++) {
        let dEnds
        dEnds =
          [1, 3, 5, 7, 8, 10, 12].indexOf(m) >= 0
            ? 31
            : [2].indexOf(m) >= 0
            ? (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0
              ? 29
              : 28
            : 30
        let endDay = m === date.getMonth() + 1 ? date.getDate() - 1 : dEnds
        for (let d = 1; d <= endDay; d++) {
          !listWeek.length && (listWeek = listWeek.concat(weekData))
          let weekDay = listWeek.shift()
          var datas = m + '月' + d + '日' + ' ' + weekDay
          let m2 = m >= 10 ? m : '0' + m
          let d2 = d >= 10 ? d : '0' + d
          var ssss = {
            value: y + '/' + m2 + '/' + d2 + ' ' + weekDay,
            text: datas
          }
          dayData.push(ssss)
        }
      }
      return dayData
    },
    /*
     *  postActivity 确认修改
     */
    postActive() {
      if (!this.activity.activityImg) {
        this.$toast('请设置活动封面')
        return
      }
      if (!this.activity.title) {
        this.$toast('请输入活动标题')
        return
      }
      if (!this.activity.province || !this.activity.city || !this.activity.district) {
        this.$toast('请输入活动地点')
        return
      }
      if (!this.activity.address) {
        this.$toast('请输入活动详细地点')
        return
      }
      if (!this.activity.createTime) {
        this.$toast('请输入活动起始时间')
        return
      }
      if (!this.activity.endTime) {
        this.$toast('请输入活动结束时间')
        return
      }
      if (
        this.endSelectedIndex[0] * 3600 +
          this.endSelectedIndex[1] * 60 +
          this.endSelectedIndex[1] <=
        this.startSelectedIndex[0] * 3600 +
          this.startSelectedIndex[1] * 60 +
          this.startSelectedIndex[1] +
          30
      ) {
        this.$alert('结束时间必须晚于起始时间至少半小时')
        return
      }
      
      if (!this.activity.details) {
        this.$toast('请输入活动详情')
        return
      }
      let me = this
      
      me.isFree && me.$set(me.activity, 'fee', 0)
      me.endCanJoin && me.$set(me.activity, 'joinEndTime', me.activity.endTime)
      // 上传时间 伪装成 国际时间， 后台再次返回是 同值的 北京时间
      let createTime = new Date(
        me.activity.createTime.replace(/\s*[\u4e00-\u9fa5]/g, '') + 'Z'
      )
      let endTime = new Date(
        me.activity.endTime.replace(/\s*[\u4e00-\u9fa5]/g, '') + 'Z'
      )
      let joinEndTime = new Date(
        me.activity.joinEndTime.replace(/\s*[\u4e00-\u9fa5]/g, '') + 'Z'
      )
      if (endTime.getTime() < joinEndTime.getTime()) {
        this.$alert('报名截止时间必须在结束之前')
        return
      }
      let reviseKey = []
      let reviseObj = {
        activityId: me.Oactivity.activityId
      }
      let hasRevise = false
      for (let key in me.Oactivity) {
        if (JSON.stringify(me.Oactivity[key]) !== JSON.stringify(me.activity[key]) && key != 'endTime' && key != 'createTime' && key != 'groupName') {
            reviseKey.push(key)
            reviseObj[key] = me.activity[key]
            hasRevise = true
        }
      }
      if (createTime.getTime() !== me.format.getZ(me.Oactivity.beginTime).getTime()) {
        reviseKey.push('beginTime')
        reviseObj['beginTime'] = createTime
        hasRevise = true
      }
      if (endTime.getTime() !== me.format.getZ(me.Oactivity.endTime).getTime()) {
        reviseKey.push('endTime')
        reviseObj['endTime'] = endTime
        hasRevise = true
      }
      if (joinEndTime.getTime() !== me.format.getZ(me.Oactivity.closeTime).getTime()) {
        reviseKey.push('closeTime')
        reviseObj['closeTime'] = joinEndTime
        hasRevise = true
      }
      if (hasRevise) {
        me.$uploading(true, '上传中', 0)
        me.api.put({
          url: 'ActivityParticipate',
          data: reviseObj,
          success: function() {
            me.$success(true, '上传成功', 500)
            me.toTip = false
            setTimeout(() => {
              me.$router.back()
            }, 500)
          },
          error: function (err) {
            me.$error(true, err, 500)
          },
        })
      } else {
        me.$confirm({
          title: '检测到您没有修改内容',
          msg: '不再修改活动？',
          yesBtnText: '返回上一页',
          type: 'confirm'
        }).then(() => {
          me.toTip = false
          me.$router.back()
        }).catch(() => {
          
        })
      }
      return 
    }
  }
}
</script>
<style lang="less">
.saveActive {
  position: fixed;
  height: 13vw;
  line-height: 13vw;
  top: 0;
  right: 2vw;
  font-size: 3.6vw;
  color: var(--lGray);
  z-index: 300;
}
.backActivityHome {
  position: fixed;
  height: 13.34vw;
  width: 14vw;
  text-align: left;
  padding-left: 3vw;
  left: 0;
  top: 0;
  line-height: 13.34vw;
  font-size: 3.6vw;
  background: #fff;
  color: var(--dGray);
  z-index: 300;
}
.LRForm .LRFormItem .iconWanwan.iconWperson-fill {
  color: var(--mRed);
}
.postActivityPage {
  // padding-top: 12vw;
  color: var(--dGray);
  .postCoverWrapper {
    position: relative;
    height: 46.25vw;
    background: rgb(240, 240, 243);
    overflow: hidden;
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .postCoverInput {
      position: absolute;
      outline: none;
      z-index: 1;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
    .iconWtihuantupian {
      position: absolute;
      right: 4vw;
      bottom: 4vw;
      height: 12vw;
      width: 12vw;
      border-radius: 50%;
      background: #e7e7e7;
      line-height: 12vw;
      height: 12vw;
      text-align: center;
      color: var(--lGray);
      font-size: var(--title);
    }
    .postCover {
      padding-top: 7vw;
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
        padding-top: 2vw;
        height: 12vw;
        line-height: 12vw;
        font-size: var(--mText);
        letter-spacing: 1px;
        font-weight: bold;
      }
    }
  }
}
</style>
