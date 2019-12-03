<template>
  <div class="postActivityPage">
    <group-list v-show="hasMask && groupListMask"
                @chooseGroup='chooseGroup'
                @hideGroupMask='setChooseGroup(false)'></group-list>
    <model v-if="modelShow"
           @modelCallBack="modelCallBack"
           :msg="modelMsg"></model>
    <model v-if="saveDraftsModel"
           @modelCallBack="modelCallBackDraft"
           :msg="modelMsgDraft"></model>
    <jeft-editor :show="hasMask && editorShow"
                 @hideEditor="hideEditorMask"
                 postName="保存"
                 :detail="activity.detailContent"></jeft-editor>
    <v-map v-if="hasMask && addressMask"
           @hideBMapPage="setAddressMask(false)"
           :address="activity.address && activity.address.curTit"
           @subAdd="setAddress"></v-map>
    <v-tags v-show="hasMask && tagsMask"
            :labels="tagsLabel"
            @showLabel="getTags"></v-tags>
    <v-tags v-show="hasMask && typeTagsMask"
            title="活动类型"
            :labels="avtivityLabel"
            :maxLength="1"
            @showLabel="getTypeTags"></v-tags>
    <v-picker ref="picker"
              :data="pickerData"
              :title="pickerTitle"
              :selected-index="startSelectedIndex"
              @select="selectPicker"
              @valuechange="valuechangePicker"></v-picker>
    <v-picker ref="endPicker"
              :data="pickerData"
              :title="pickerTitle"
              :selected-index="endSelectedIndex"
              @select="selectPicker"
              @valuechange="valuechangePicker"></v-picker>
    <v-picker ref="joinEndPicker"
              :data="pickerData"
              :title="pickerTitle"
              :selected-index="endJoinSelectedIndex"
              @select="selectPicker"
              @valuechange="valuechangePicker"></v-picker>
    <div class="postCoverWrapper"
         :style="{backgroundImage:'url('+businessMsg.businessImg+')'}">
      <img v-show="activity.filesResults"
           :src="activity.filesResults">
      <i class="iconWanwan iconWtihuantupian"
         v-show="activity.filesResults">
        <input accept="image/*"
               type="file"
               class="postCoverInput"
               @change="postCoverImage">
      </i>
      <input accept="image/*"
             type="file"
             class="postCoverInput"
             @change="postCoverImage"
             v-show="!activity.filesResults">
      <div class="postCover">
        <div class="imgBg iconWtianjiatupian iconWanwan">
        </div>
        <p>添加优惠海报</p>
      </div>
    </div>
    <div class>
      <ul class="activityBaseInfo LRForm">
        <li class="LRFormItem borderB">
          <span class="LFormItem">优惠标题</span>
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
        <li class="LRFormItem borderB">
          <span class="LFormItem">优惠时间</span>
          <input name="Name"
                 type="text"
                 v-model="activity.startTime"
                 class="FormItemContent"
                 placeholder="请设优惠开始时间"
                 @click="selectDate(0)"
                 readonly>
        </li>
        <li class="LRFormItem borderB">
          <span class="LFormItem">结束时间</span>
          <input v-model="activity.endTime"
                 class="FormItemContent"
                 placeholder="请设置优惠结束时间"
                 @click="selectDate(1)"
                 readonly>
        </li>
        <li class="LRFormItem borderB marginTL"
            @click="setEditorMask(true)">
          <span class="LFormItem">优惠详情</span>
          <div class="FormItemContent"
               v-html="detailContent"></div>
          <p class="RText">
            编辑
            <i class="iconWxiayibu iconWanwan textR"></i>
          </p>
        </li>
        <li @click="postActive"
            class="LRFormItem submitPostBtnWrap marginTL">
          <div :class="canPost?'submitPostBtn canSubmitPost':'submitPostBtn'">发布优惠</div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import JeftEditor from '@/components/VueEditor'
import model from '@/components/model/model'
import VMap from '@/components/Amap'
import VTags from '@/components/VTags'
import VPicker from '@/components/picker'
import { mapState, mapMutations, mapGetters } from 'vuex'
import groupList from '@/views/Activity/components/pickerGroupList'
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
    JeftEditor,
    model,
    groupList
  },
  data() {
    return {
      businessId: this.$route.params.businessId, // 商家id
      businessMsg:{}, // 商家信息
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
      tagsLabel: [
        {
          title: '交友',
          tags: ['聚会', '聊天', '相亲', '志同道合', '有趣', '高颜值']
        },
        {
          title: '才艺',
          tags: [
            '音乐',
            '舞蹈',
            '读书',
            '绘画',
            '书法',
            '棋牌',
            '手工',
            '花艺',
            '茶艺',
            '球类',
            '跆拳道',
            '摄影',
            '传统文化',
            '文艺范',
            '学习'
          ]
        },
        {
          title: '出游',
          tags: ['短途', '中长途', '懒人周末', '徒步', '自驾游', '组团']
        },
        {
          title: '亲子',
          tags: [
            '户外',
            '室内',
            '才艺',
            '游戏',
            '亲子游',
            '育儿',
            '家庭教育',
            '小初高'
          ]
        },
        {
          title: '运动',
          tags: ['瑜伽', '马拉松', '健身', '塑形', '养生']
        },
        {
          title: '运动',
          tags: ['瑜伽', '马拉松', '健身', '塑形', '养生']
        },
        {
          title: '美容',
          tags: ['护肤', '美妆', '穿搭']
        },
        {
          title: '公益',
          tags: ['志愿者', '慈善']
        },
        {
          title: '心理',
          tags: ['心理咨询', '心理健康检查']
        },
        {
          title: '职场',
          tags: ['企业', '企业招商', '行业活动']
        },
        {
          title: '讲座',
          tags: ['学术', '职业发展规划', '个人经历']
        },
        {
          title: '演出展览',
          tags: ['舞台剧', '演唱会', '音乐节', '戏曲', '主题展览']
        },
        {
          title: '体育赛事',
          tags: ['篮球', '足球', '青少年', '比赛', '主题展览']
        }
      ]
    }
  },
  computed: {
    ...mapState({
      activeConditions: 'activeConditions',
      hasMask: 'hasMask',
      draftsIndex: 'draftsIndex',
      shouldShowModel: 'shouldShowModel'
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
    canPost() {
      // var s =
      //   this.activity.title &&
      //   this.activity.address &&
      //   this.activity.startTime &&
      //   this.activity.endTime &&
      //   this.activity.group.userGroupId &&
      //   (this.endCanJoin || this.activity.joinEndTime) &&
      //   (this.isFree || this.activity.cost) &&
      //   this.activity.detailContent
      // return s
      return true
    },
    detailContent() {
      if (!this.activity.detailContent) {
        return
      }
      return this.activity.detailContent
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
    }
  },
  created() {
    !this.avtivityLabel[0].tags.length && this.getActiveConditions()
    this.getBusinessMsg()
  },
  mounted() {
    window.isInAndroid && window.WanAndroid.imgCropType(1, 1)
    if (this.draftsIndex >= 0) {
      this.activity = JSON.parse(localStorage.getItem('activeDrafts'))[
        this.draftsIndex
      ]
      return
    } else if (!this.shouldShowModel) {
      return
    } else if (
      JSON.parse(localStorage.getItem('activeDrafts')) &&
      JSON.parse(localStorage.getItem('activeDrafts')).length
    ) {
      this.$set(
        this.modelMsg,
        'title',
        `检测到您有${
          JSON.parse(localStorage.getItem('activeDrafts')).length
        }封草稿`
      )
      this.modelShow = true
    }
  },
  beforeDestroy() {
    window.isInAndroid && window.WanAndroid.imgCropType(0)
    this.upDraftsIndex(-1)
    this.activityPostNoModel(true)
  },
  routerBeforeLeave(to, from, next) {
    next(false)
    if (!this.activity.title || !this.activity.title.trim()) {
      next()
    } else {
      if (to.name === 'activityHome') {
        this.modelShow = true
        next(false)
      }
    }
  },
  watch: {
    editorShow (newV) {
      if (newV && newV === true) {
        window.isInAndroid && window.WanAndroid.imgCropType(0, 1) // 方图
      } else {
        window.isInAndroid && window.WanAndroid.imgCropType(1, 1) // 横
      }
    },
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
    }
  },
  methods: {
    ...mapMutations({
      updateActiveConditions: 'updateActiveConditions',
      setMask: 'setMask',
      upDraftsIndex: 'upDraftsIndex',
      activityPostNoModel: 'activityPostNoModel',
      setClick: 'setClick'
    }),
    chooseGroup (item) {
      this.$set(this.activity, 'group', item)
      this.setChooseGroup(false)
    },
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
    saveActive() {
      if (!this.activity.title || !this.activity.title.trim()) {
        this.$toast('请输入活动标题')
        return
      }
      let me = this
      let p = me.upFileThumbnail()
      p.then(() => {
        let drafts = JSON.parse(localStorage.getItem('activeDrafts'))
        // 没有保存过草稿
        if (!drafts) {
          drafts = []
        }
        this.activity.saveTime = this.format.date(
          new Date(),
          'yyyy-MM-dd hh:mm'
        )
        // 进入页面启用草稿箱
        if (this.draftsIndex >= 0) {
          drafts[this.draftsIndex] = this.activity
        } else {
          // 进入页面没有启用草稿
          drafts.unshift(this.activity)
        }
        localStorage.setItem('activeDrafts', JSON.stringify(drafts))
        me.$toast('保存草稿成功')
        me.setClick(true)
        setTimeout(() => {
          this.$router.replace({
            name: 'messagedraft'
          })
        }, 200)
      })
    },
    modelCallBack(data) {
      if (data) {
        this.setClick(true)
        this.$router.replace({
          name: 'messagedraft'
        })
      }
      this.modelShow = false
    },
    modelCallBackDraft(data) {
      if (data) {
        let me = this
        let p = me.upFileThumbnail()
        p.then(() => {
          let drafts = JSON.parse(localStorage.getItem('activeDrafts'))
          // 没有保存过草稿
          if (!drafts) {
            drafts = []
          }
          this.activity.saveTime = this.format.date(
            new Date(),
            'yyyy-MM-dd hh:mm'
          )
          // 进入页面启用草稿箱
          if (this.draftsIndex >= 0) {
            drafts[this.draftsIndex] = this.activity
          } else {
            // 进入页面没有启用草稿
            drafts.unshift(this.activity)
          }
          localStorage.setItem('activeDrafts', JSON.stringify(drafts))
          me.$toast('保存草稿成功')
          me.setClick(true)
          setTimeout(() => {
            this.$router.push({
              name: 'activityHome'
            })
          }, 200)
        })
      } else {
        this.$router.push({
          name: 'activityHome'
        })
      }
      this.saveDraftsModel = false
    },
    postCoverImage(e) {
      let me = this
      if (e.target.files[0].type.indexOf('image') >= 0) {
        var reader = new FileReader()
        var file = e.target.files[0]
        reader.onloadstart = function(e) {
        }
        reader.onprogress = function(e) {
        }
        reader.onabort = function(e) {
        }
        reader.onerror = function(e) {
        }
        reader.onload = function(e) {
          me.$set(me.files, 0, file)
          me.$set(me.activity, 'filesResults', e.target.result)
        }
        reader.readAsDataURL(file)
      }
    },
    postCover() {
    },
    upFileThumbnail() {
      let me = this
      return new Promise((resolve, reject) => {
        if (
          me.activity.filesResults &&
          me.activity.filesResults.indexOf('http://') < 0
        ) {
          var fd = new FormData()
          fd.append('1', me.files[0])
          me.api.file({
            url: 'FileThumbnail',
            data: fd,
            success: res => {
              me.$set(me.activity, 'filesResults', res.split(',')[1])
              resolve()
            }
          })
        } else {
          resolve()
        }
      })
    },
    clear(str) {
      if (str.indexOf('.') > 0) {
        let a1 = str.split('.')
        this[a1[0]][a1[1]] = ''
      } else {
        this[str] = ''
      }
    },
    setChooseGroup (data) {
      this.setMask(data)
      this.groupListMask = data
    },
    setAddressMask(data) {
      this.setMask(data)
      this.addressMask = data
    },
    setAddress(data) {
      this.$set(this.activity, 'address', data)
      this.setAddressMask(false)
    },
    setTagsMask(data) {
      this.setMask(data)
      this.tagsMask = data
    },
    setTypeTagsMask(data) {
      this.setMask(data)
      this.typeTagsMask = data
    },
    getTypeTags(data) {
      data &&
        this.$set(this.activity, 'typeTag', data) &&
        this.setTypeTagsMask(false)
      !data && this.setTypeTagsMask(false)
    },
    getTags(data) {
      data && this.$set(this.activity, 'tags', data) && this.setTagsMask(false)
      !data && this.setTagsMask(false)
    },
    selectDate(index) {
      this.pickerData = []
      var date = new Date()
      this.curPicker = index
      this.pickerData.push(
        { flex: 2, data: this.initDate(date) },
        { flex: 1, data: Hours },
        { flex: 1, data: Mins }
      )
      index === 0 &&
        (this.pickerTitle = '设置优惠开始时间') &&
        this.$refs.picker.show()
      index === 1 &&
        (this.pickerTitle = '设置优惠结束时间') &&
        this.$refs.endPicker.show()
      index === 2 &&
        (this.pickerTitle = '设置报名截止时间') &&
        this.$refs.joinEndPicker.show()
    },
    selectPicker(pickerSelectedVal, selectedIndex, data3) {
      this.curPicker === 0 &&
        (this.startSelectedIndex = selectedIndex) &&
        (this.startSelected = pickerSelectedVal) &&
        this.$set(
          this.activity,
          'startTime',
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
    valuechangePicker(pickerSelectedVal, selectedIndex, data3) {
      // this.curPicker === 0 && (this.startSelectedIndex = selectedIndex) && (this.startSelected = pickerSelectedVal) && (this.activity.startTime = pickerSelectedVal[0].value + ' ' + pickerSelectedVal[1].value + ' ' + pickerSelectedVal[1].text + ':' + pickerSelectedVal[2].text)
      // this.curPicker === 1 && (this.endSelectedIndex = selectedIndex) && (this.endSelected = pickerSelectedVal) && (this.startSelected = pickerSelectedVal) && (this.$set(this.activity, 'endTime', pickerSelectedVal[0].value + ' ' + pickerSelectedVal[1].value + ' ' + pickerSelectedVal[1].text + ':' + pickerSelectedVal[2].text))
      // this.curPicker === 2 && (this.endJoinSelectedIndex = selectedIndex) && (this.endJoinSelected = pickerSelectedVal) && (this.$set(this.activity, 'joinEndTime', pickerSelectedVal[0].value + ' ' + pickerSelectedVal[1].value + ' ' + pickerSelectedVal[1].text + ':' + pickerSelectedVal[2].text))
    },
    initDate(date) {
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
    postActive() {
      if (!this.activity.title) {
        this.$toast('请输入优惠标题')
        return
      }
      if (!this.activity.startTime) {
        this.$toast('请输入优惠起始时间')
        return
      }
      if (!this.activity.endTime) {
        this.$toast('请输入优惠结束时间')
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
      if (this.endSelectedIndex < this.endJoinSelectedIndex) {
        this.$alert('报名截止时间必须在结束之前')
        return
      }
      if (!this.activity.detailContent) {
        this.$toast('请输入优惠详情')
        return
      }
      if (this.isUploading) {
        return
      }
      let me = this
      me.isUploading = true
      let p = this.upFileThumbnail()
      let startTime = new Date(
        me.activity.startTime.replace(/\s*[\u4e00-\u9fa5]/g, '')
      )
      let endTime = new Date(
        me.activity.endTime.replace(/\s*[\u4e00-\u9fa5]/g, '')
      )
      if (endTime < this.format.date(new Date(), 'yyyy/MM/dd hh:mm')) {
        this.$toast('优惠结束时间必须晚于现在')
        return
      }
      p.then(() => {
        me.$uploading(true, null, 0)
        me.api.process({
          url: 'BusinessActivity',
          data: {
            title: me.activity.title,
            userBusinessId:me.businessId,
            activityImg: me.activity.filesResults ? me.activity.filesResults : me.businessMsg.businessImg,
            beginTime: startTime,
            endTime: endTime,
            details: me.activity.detailContent,
          },
          success: function() {
            me.setClick(true)
            me.isUploading = false
            me.$success(true, null, 50)
            me.$router.back()
          },
          error: function() {
            me.$error(true, null, 50)
          }
        })
      })
    },
    setEditorMask(data) {
      this.setMask(data)
      this.editorShow = data
    },
    hideEditorMask(data) {
      data && this.$set(this.activity, 'detailContent', data)
      this.setEditorMask(false)
    },
    backActivityHome() {
      if (!this.activity.title || !this.activity.title.trim()) {
        this.$router.push({
          name: 'activityHome'
        })
      } else {
        this.saveDraftsModel = true
      }
    },
    /**
     * getBusinessMsg获得商家信息
     */
    getBusinessMsg () {
      let me = this
      me.api.get({
        url: `UserBusiness/businessId?businessId=${me.businessId}`,
        success: function (res) {
          me.businessMsg = res
        }
      })
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
  color: var(--dGray);
  .postCoverWrapper {
    position: relative;
    height: 46.25vw;
    background: #e7e7e7;
    overflow: hidden;
    background-size:cover;
    background-repeat:no-repeat;
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
        color:white;
      }
    }
  }
}
</style>
