<template>
  <div class="postActivityPage">
    <!-- <v-editor></v-editor> -->
    <v-map v-if="hasMask && addressMask"
           @hideBMapPage='setAddressMask(false)'
           :address='activity.address && activity.address.curTit'
           @subAdd='setAddress'></v-map>
    <v-picker ref='picker'
              :data='pickerData'
              :title='pickerTitle'
              :selected-index="startSelectedIndex"
              @select='selectPicker'
              @valuechange='valuechangePicker'></v-picker>
    <v-picker ref="endPicker"
              :data='pickerData'
              :title='pickerTitle'
              :selected-index="endSelectedIndex"
              @select='selectPicker'
              @valuechange='valuechangePicker'></v-picker>
    <jeft-editor :show="hasMask && editorShow"
                 @hideEditor="hideEditorMask"
                 postName="保存"
                 :detail="activity.detailContent"></jeft-editor>
    <!-- 海报 -->
    <div class="postCoverWrapper">
      <img :src="activity.filesResults" />
      <i class="iconWanwan iconWtihuantupian"
         v-show="activity.filesResults">
        <input accept="image/*"
               type="file"
               class="postCoverInput"
               @change="postCoverImage" />
      </i>
      <input accept="image/*"
             type="file"
             class="postCoverInput"
             @change="postCoverImage"
             v-show="!activity.filesResults" />
      <div class="postCover">
        <div class="imgBg iconWtianjiatupian iconWanwan">
          <!-- <i class="iconWtianjiatupian iconWanwan"></i> -->
        </div>
        <p>添加活动海报</p>
      </div>
    </div>
    <div class='chooseModel'>
      <div :class="['fItem', {'cur': model === 0}]"
           @click='model = 0'>
        粉色主题
      </div>
      <div :class="['fItem', {'cur': model === 1}]"
           @click='model = 1'>
        绿色主题
      </div>
      <div :class="['fItem', {'cur': model === 'z'}]"
           @click="model = 'z'">
        自定义
      </div>
    </div>
    <div class='chooseType'>
      <div :class="['fItem', {'curType': postType === 2}]"
           @click='postType = 2'>
        视频
      </div>
      <div :class="['fItem', {'curType': postType === 1}]"
           @click='postType = 1'>
        图文
      </div>
      <div :class="['fItem', {'curType': postType === 0}]"
           @click="postType = 0">
        全部
      </div>
    </div>
    <div class="modelPreview">
      <div v-if="model === 0"
           class=''>
        <img src='' />
      </div>
      <div v-if="model === 1"
           class=''>
        <img src='' />
      </div>
      <div v-if="model === 'z'"
           class=''>
        <ul class="activityBaseInfo LRForm">
          <li class="LRFormItem borderB">
            <span class="LFormItem">主题颜色</span>
            <div class="inputWrapper FormItemContent canClear">
              <input type="text"
                     maxLength='15'
                     v-model="tmpStyle.color"
                     placeholder="#ff2742" />
            </div>
          </li>
          <li class="LRFormItem borderB">
            <span class="LFormItem">排行榜颜色</span>
            <div class="inputWrapper FormItemContent canClear">
              <input type="text"
                     maxLength='15'
                     v-model="tmpStyle.rankTopColor"
                     placeholder="#ead076" />
            </div>
          </li>
          <li class="LRFormItem borderB">
            <span class="LFormItem">投票单项主题</span>
            <div class="inputWrapper FormItemContent canClear">
              <input type="Number"
                     maxLength='15'
                     v-model="tmpStyle.itemIndex"
                     placeholder="0" />
            </div>
          </li>
          <li class="LRFormItem borderB">
            <span class="LFormItem">倒计时方式</span>
            <div class="inputWrapper FormItemContent canClear">
              <input type="Number"
                     maxLength='15'
                     v-model="tmpStyle.voteDataIndex"
                     placeholder="0" />
            </div>
          </li>
        </ul>
        <div class='imageWrapper'>
          <div class=''>
            <div>背景应为长图9:16</div>
            <ul ref='imgList'
                class="imgList">
              <li v-if='file.bgResults'
                  ref='imgItem'
                  class="imgCoverItem">
                <img :src="file.bgResults">
              </li>
              <li ref="imageUploadBtn"
                  class="imgCoverItem upLoadImageWrapper iconWxinjian iconWanwan">
                <input ref='upLoadImageFile'
                       id='upLoadImage'
                       type='file'
                       @change="upBg" />
              </li>
            </ul>
          </div>
          <div class=''>
            <div>冠军的头像花环:方图</div>
            <ul ref='imgList'
                class="imgList">
              <li v-if='file.avatarCResults'
                  ref='imgItem'
                  class="imgCoverItem">
                <img :src="file.avatarCResults">
              </li>
              <li ref="imageUploadBtn"
                  class="imgCoverItem upLoadImageWrapper iconWxinjian iconWanwan">
                <input ref='upLoadImageFile'
                       id='upLoadImage'
                       type='file'
                       @change="upAvatarC" />
              </li>
            </ul>
          </div>
          <div class=''>
            <div>排行榜背景: 横图/方图</div>
            <ul ref='imgList'
                class="imgList">
              <li v-if='file.rankTopBgResults'
                  ref='imgItem'
                  class="imgCoverItem">
                <img :src="file.rankTopBgResults">
              </li>
              <li ref="imageUploadBtn"
                  class="imgCoverItem upLoadImageWrapper iconWxinjian iconWanwan">
                <input ref='upLoadImageFile'
                       id='upLoadImage'
                       type='file'
                       @change="upRankTopBg" />
              </li>
            </ul>
          </div>
          <div class=''>
            <div>倒计时背景：横图</div>
            <ul ref='imgList'
                class="imgList">
              <li v-if='file.voteDataBgResults'
                  ref='imgItem'
                  class="imgCoverItem">
                <img :src="file.voteDataBgResults">
              </li>
              <li ref="imageUploadBtn"
                  class="imgCoverItem upLoadImageWrapper iconWxinjian iconWanwan">
                <input ref='upLoadImageFile'
                       id='upLoadImage'
                       type='file'
                       @change="upVoteDataBg" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="">
      <ul class="activityBaseInfo LRForm">
        <li class="LRFormItem borderB">
          <span class="LFormItem">活动标题</span>
          <div class="inputWrapper FormItemContent canClear">
            <input type="text"
                   maxLength='25'
                   v-model="activity.title"
                   placeholder="不超过20个字" />
            <i v-show="activity.title && activity.title.length"
               class="inputClose iconWanwan iconWclose"
               @click="clear('activity.title')"></i>
          </div>
        </li>
        <li class="LRFormItem borderB"
            @click="setAddressMask(true)">
          <span class="LFormItem">活动地点</span>
          <p class='FormItemContent'
             v-if="activity.address">{{activity.address.curAddress}}{{activity.address.curTit}}</p>
          <p class='FormItemContent'
             v-else></p>
          <p class="RText">
            <span v-show='!activity.address'>请选择</span>
            <i class="iconWxiayibu iconWanwan textR"></i>
          </p>
        </li>
        <li class="LRFormItem borderB">
          <span class="LFormItem">活动时间</span>
          <input name="Name"
                 type="text"
                 v-model="activity.startTime"
                 class="FormItemContent"
                 placeholder="请设置活动开始时间"
                 @click="selectDate(0)"
                 readonly />
        </li>
        <li class="LRFormItem borderB">
          <span class="LFormItem">结束时间</span>
          <input v-model="activity.endTime"
                 class="FormItemContent"
                 placeholder="请设置活动结束时间"
                 @click="selectDate(1)"
                 readonly />
        </li>
        <li class="LRFormItem borderB marginTL"
            @click="setEditorMask(true)">
          <span class="LFormItem">活动详情</span>
          <div class="FormItemContent"
               v-html="detailContent"></div>
          <p class="RText">
            编辑
            <i class="iconWxiayibu iconWanwan textR"></i>
          </p>
        </li>
        <li @click="postActive"
            class="LRFormItem submitPostBtnWrap marginTL">
          <div :class="canPost?'submitPostBtn canSubmitPost':'submitPostBtn'">发布投票</div>
        </li>
      </ul>
    </div>
    <div class='backActivityHome iconWfanhui iconWanwan activityNotice'
         @click.self='backActivityHome'></div>
  </div>
</template>
<script>
// import VEditor from '@/components/Editor'
import JeftEditor from '@/components/VueEditor'
// import model from '@/components/model/model'
import VMap from '@/components/Amap'
// import VTags from '@/components/VTags'
import VPicker from '@/components/picker'
import { mapState, mapMutations, mapGetters } from 'vuex'
const Hours = [{ text: '00', value: '凌晨' }, { text: '01', value: '凌晨' }, { text: '02', value: '凌晨' }, { text: '03', value: '凌晨' }, { text: '04', value: '凌晨' }, { text: '05', value: '上午' }, { text: '06', value: '上午' }, { text: '07', value: '上午' }, { text: '08', value: '上午' }, { text: '09', value: '上午' }, { text: 10, value: '上午' }, { text: 11, value: '上午' }, { text: 12, value: '下午' }, { text: 13, value: '下午' }, { text: 14, value: '下午' }, { text: 15, value: '下午' }, { text: 16, value: '下午' }, { text: 17, value: '下午' }, { text: 18, value: '下午' }, { text: 19, value: '晚上' }, { text: 20, value: '晚上' }, { text: 21, value: '晚上' }, { text: 22, value: '晚上' }, { text: 23, value: '晚上' }]
const Mins = [{ text: '00' }, { text: '01' }, { text: '02' }, { text: '03' }, { text: '04' }, { text: '05' }, { text: '06' }, { text: '07' }, { text: '08' }, { text: '09' }, { text: 10 }, { text: 11 }, { text: 12 }, { text: 13 }, { text: 14 }, { text: 15 }, { text: 16 }, { text: 17 }, { text: 18 }, { text: 19 }, { text: 20 }, { text: 21 }, { text: 22 }, { text: 23 }, { text: 24 }, { text: 25 }, { text: 26 }, { text: 27 }, { text: 28 }, { text: 29 }, { text: 30 }, { text: 31 }, { text: 32 }, { text: 33 }, { text: 34 }, { text: 35 }, { text: 36 }, { text: 37 }, { text: 38 }, { text: 39 }, { text: 40 }, { text: 41 }, { text: 42 }, { text: 43 }, { text: 44 }, { text: 45 }, { text: 46 }, { text: 47 }, { text: 48 }, { text: 49 }, { text: 50 }, { text: 51 }, { text: 52 }, { text: 53 }, { text: 55 }, { text: 55 }, { text: 56 }, { text: 57 }, { text: 58 }, { text: 59 }]
export default {
  components: {
    VMap,
    VPicker,
    // VEditor,
    JeftEditor,
  },
  data () {
    return {
      voteId: this.$route.params.id,
      detail: ['', '', '',''],
      model: 0, // 主题类型 0 pink | 1 green | 'z' 自定义
      postType: 2, // 活动类型 0 全部 | 1 图文 | 2 视频
      endCanJoin: true,
      isFree: true,
      activity: {// 投票活动信息

      },
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
      tmpStyle: {},
      file: {} // 存储所有file的对象
    }
  },
  computed: {
    ...mapState({
      'activeConditions': 'activeConditions',
      'hasMask': 'hasMask',
      'draftsIndex': 'draftsIndex',
      'shouldShowModel': 'shouldShowModel'
    }),
    ...mapGetters({
      'avtivityLabel': 'activityType'
    }),
    avtivityLabel () {
      let avtivityLabel = [{
        title: '活动类型',
        tags: []
      }]
      this.activeConditions.activetypes.map((item, index) => {
        index && avtivityLabel[0].tags.push(item.label)
      })
      return avtivityLabel
    },
    canPost () {
      var s = this.activity.title && this.activity.address && this.activity.startTime && this.activity.endTime && (this.endCanJoin || this.activity.joinEndTime) && (this.isFree || this.activity.cost)
      return s
    },
    detailContent () { 
      if (!this.activity.detailContent) {
        return
      }
      return this.activity.detailContent.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    }
  },
  created () {
    !this.avtivityLabel[0].tags.length && this.getActiveConditions()
    this.getHeadMsg()
  },
  mounted () {
    window.isInAndroid && window.WanAndroid.imgCropType(4, 1) // 横
  },
  beforeDestroy () {
    window.isInAndroid && window.WanAndroid.imgCropType(0)
    this.upDraftsIndex(-1)
    this.activityPostNoModel(true)
  },
  watch: {
    selectedIndex (newV) {
      return newV
    },
    activity (newV) {
      return newV
    }
  },
  methods: {
    ...mapMutations({
      'updateActiveConditions': 'updateActiveConditions',
      'setMask': 'setMask',
      'upDraftsIndex': 'upDraftsIndex',
      'activityPostNoModel': 'activityPostNoModel',
      'setClick': 'setClick'
    }),
    upBg (e) {
      let me = this
      if (e.target.files[0].type.indexOf('image') >= 0) {
        var reader = new FileReader()
        var file = e.target.files[0]
        reader.onload = function (e) {
          me.$set(me.file, 'bgFile', file)
          me.$set(me.file, 'bgResults', e.target.result)
          // me.activity.filesResults = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    upAvatarC (e) {
      let me = this
      if (e.target.files[0].type.indexOf('image') >= 0) {
        var reader = new FileReader()
        var file = e.target.files[0]
        reader.onload = function (e) {
          me.$set(me.file, 'avatarCFile', file)
          me.$set(me.file, 'avatarCResults', e.target.result)
          // me.activity.filesResults = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    upRankTopBg (e) {
      let me = this
      if (e.target.files[0].type.indexOf('image') >= 0) {
        var reader = new FileReader()
        var file = e.target.files[0]
        reader.onload = function (e) {
          me.$set(me.file, 'rankTopBgFile', file)
          me.$set(me.file, 'rankTopBgResults', e.target.result)
          // me.activity.filesResults = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    upVoteDataBg (e) {
      let me = this
      if (e.target.files[0].type.indexOf('image') >= 0) {
        var reader = new FileReader()
        var file = e.target.files[0]
        reader.onload = function (e) {
          me.$set(me.file, 'voteDataBgFile', file)
          me.$set(me.file, 'voteDataBgResults', e.target.result)
          // me.activity.filesResults = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    postCoverImage (e) {
      let me = this
      if (e.target.files[0].type.indexOf('image') >= 0) {
        var reader = new FileReader()
        var file = e.target.files[0]
        reader.onloadstart = function () {
        }
        reader.onprogress = function () {
        }
        reader.onabort = function () {
        }
        reader.onerror = function () {
        }
        reader.onload = function (e) {
          me.$set(me.files, 0, file)
          me.$set(me.activity, 'filesResults', e.target.result)
          // me.activity.filesResults = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    postCover () {
      console.log(this.files)
    },
    upFileThumbnail () {
      let me = this
      return new Promise((resolve) => {
        if (me.activity.filesResults && me.activity.filesResults.indexOf('http://') < 0 && me.activity.filesResults.indexOf('https://') < 0) {
          var fd = new FormData()
          fd.append('1', me.files[0])
          if (me.model === 'z' ) { // 自定义
            me.file.bgFile && fd.append('1', me.file.bgFile)
            me.file.avatarCFile && fd.append('1', me.file.avatarCFile)
            me.file.rankTopBgFile && fd.append('1', me.file.rankTopBgFile)
            me.file.voteDataBgFile && fd.append('1', me.file.voteDataBgFile)
          }
          me.api.file({
            url: 'file',
            data: fd,
            success: (res) => {
              me.$set(me.activity, 'filesResults', res.split(',')[0])
              me.file.bgFile && me.$set(me.tmpStyle, 'bg', res.split(',')[1])
              me.file.avatarCFile && me.$set(me.tmpStyle, 'championAvatar', res.split(',')[2])
              me.file.rankTopBgFile && me.$set(me.tmpStyle, 'rankTopBg', res.split(',')[3])
              me.file.voteDataBgFile && me.$set(me.tmpStyle, 'voteDataBg', res.split(',')[4])
              resolve()
            }
          })
        } else {
          resolve()
        }
      })
    },
    clear (str) {
      if (str.indexOf('.') > 0) {
        let a1 = str.split('.')
        this[a1[0]][a1[1]] = ''
      } else {
        this[str] = ''
      }
    },
    setAddressMask (data) {
      this.setMask(data)
      this.addressMask = data
    },
    setAddress (data) {
      this.$set(this.activity, 'address', data)
      this.setAddressMask(false)
    },
    setTagsMask (data) {
      this.setMask(data)
      this.tagsMask = data
    },
    setTypeTagsMask (data) {
      this.setMask(data)
      this.typeTagsMask = data
    },
    getTypeTags (data) {
      data && (this.$set(this.activity, 'typeTag', data)) && this.setTypeTagsMask(false)
      !data && this.setTypeTagsMask(false)
    },
    getTags (data) {
      data && (this.$set(this.activity, 'tags', data)) && this.setTagsMask(false)
      !data && this.setTagsMask(false)
    },
    selectDate (index) {
      this.pickerData = []
      var date = new Date()
      this.curPicker = index
      this.pickerData.push({ flex: 2, data: this.initDate(date) }, { flex: 1, data: Hours }, { flex: 1, data: Mins })
      index === 0 && (this.pickerTitle = '设置活动开始时间') && this.$refs.picker.show()
      index === 1 && (this.pickerTitle = '设置活动结束时间') && this.$refs.endPicker.show()
      index === 2 && (this.pickerTitle = '设置报名截止时间') && this.$refs.joinEndPicker.show()
    },
    selectPicker (pickerSelectedVal, selectedIndex) {
      this.curPicker === 0 && (this.startSelectedIndex = selectedIndex) && (this.startSelected = pickerSelectedVal) && (this.$set(this.activity, 'startTime', pickerSelectedVal[0].value + ' ' + pickerSelectedVal[1].value + ' ' + pickerSelectedVal[1].text + ':' + pickerSelectedVal[2].text))
      this.curPicker === 1 && (this.endSelectedIndex = selectedIndex) && (this.endSelected = pickerSelectedVal) && (this.$set(this.activity, 'endTime', pickerSelectedVal[0].value + ' ' + pickerSelectedVal[1].value + ' ' + pickerSelectedVal[1].text + ':' + pickerSelectedVal[2].text))
      this.curPicker === 2 && (this.endJoinSelectedIndex = selectedIndex) && (this.endJoinSelected = pickerSelectedVal) && (this.$set(this.activity, 'joinEndTime', pickerSelectedVal[0].value + ' ' + pickerSelectedVal[1].value + ' ' + pickerSelectedVal[1].text + ':' + pickerSelectedVal[2].text))
      if (this.endCanJoin && this.curPicker === 1) {
        // this.$set(this.activity, 'joinEndTime', this.activity.endTime)
        (this.endJoinSelectedIndex = selectedIndex) && (this.endJoinSelected = pickerSelectedVal) && (this.$set(this.activity, 'joinEndTime', pickerSelectedVal[0].value + ' ' + pickerSelectedVal[1].value + ' ' + pickerSelectedVal[1].text + ':' + pickerSelectedVal[2].text))
      }
    },
    valuechangePicker () {
      // this.curPicker === 0 && (this.startSelectedIndex = selectedIndex) && (this.startSelected = pickerSelectedVal) && (this.activity.startTime = pickerSelectedVal[0].value + ' ' + pickerSelectedVal[1].value + ' ' + pickerSelectedVal[1].text + ':' + pickerSelectedVal[2].text)
      // this.curPicker === 1 && (this.endSelectedIndex = selectedIndex) && (this.endSelected = pickerSelectedVal) && (this.startSelected = pickerSelectedVal) && (this.$set(this.activity, 'endTime', pickerSelectedVal[0].value + ' ' + pickerSelectedVal[1].value + ' ' + pickerSelectedVal[1].text + ':' + pickerSelectedVal[2].text))
      // this.curPicker === 2 && (this.endJoinSelectedIndex = selectedIndex) && (this.endJoinSelected = pickerSelectedVal) && (this.$set(this.activity, 'joinEndTime', pickerSelectedVal[0].value + ' ' + pickerSelectedVal[1].value + ' ' + pickerSelectedVal[1].text + ':' + pickerSelectedVal[2].text))
    },
    initDate (date) {
      // let me = this
      let weekData = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      let startWeekDay = (new Date(date)).getDay()
      let listWeek = weekData.slice(startWeekDay)
      let dayData = []
      // var data = ''
      let y = date.getFullYear()
      for (let m = date.getMonth() + 1; m <= 12; m++) {
        var dEnd
        dEnd = [1, 3, 5, 7, 8, 10, 12].indexOf(m) >= 0 ? 31 : [2].indexOf(m) >= 0 ? (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 29 : 28 : 30
        let startDay = (m === date.getMonth() + 1) ? date.getDate() : 1
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
        dEnds = [1, 3, 5, 7, 8, 10, 12].indexOf(m) >= 0 ? 31 : [2].indexOf(m) >= 0 ? (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 29 : 28 : 30
        let endDay = (m === date.getMonth() + 1) ? date.getDate() - 1 : dEnds
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
    postActive () {
      // let t = this.upFileThumbnail().then(() => {
      //   console.log(this.tmpStyle)
      // })
      // return
      // this.activity.title && this.activity.address && this.activity.tags.length && this.activity.startTime && this.activity.endTime && (this.endCanJoin || this.activity.joinEndTime) && (this.isFree || this.activity.cost)
      // console.log('打印一下哇', this.activity.detailContent)
      // return
      if (!this.activity.filesResults) {
        this.$toast('请设置活动封面')
        return
      }
      if (!this.activity.title) {
        this.$toast('请输入活动标题')
        return
      }
      if (!this.activity.address) {
        this.$toast('请输入活动地点')
        return
      }
      if (!this.activity.startTime) {
        this.$toast('请输入活动起始时间')
        return
      }
      if (!this.activity.endTime) {
        this.$toast('请输入活动结束时间')
        return
      }
      if (this.endSelectedIndex[0] * 3600 + this.endSelectedIndex[1] * 60 + this.endSelectedIndex[1] <= this.startSelectedIndex[0] * 3600 + this.startSelectedIndex[1] * 60 + this.startSelectedIndex[1] + 30) {
        this.$alert('结束时间必须晚于起始时间至少半小时')
        return
      }
      if (this.endSelectedIndex < this.endJoinSelectedIndex) {
        this.$alert('报名截止时间必须在结束之前')
        return
      }
      // if (this.endSelectedIndex < this.endJoinSelectedIndex) {
      //   this.$alert('报名截止时间必须在结束之前')
      //   return
      // }
      if (!this.activity.detailContent) {
        this.$toast('请输入活动详情')
        return
      }
      this.$uploading(true, '上传中...')
      let p = this.upFileThumbnail()
      let me = this
      me.isFree && me.$set(me.activity, 'cost', 0)
      me.endCanJoin && me.$set(me.activity, 'joinEndTime', me.activity.endTime)
      let startTime = new Date(me.activity.startTime.replace(/\s*[\u4e00-\u9fa5]/g, '') + 'Z')
      let endTime = new Date(me.activity.endTime.replace(/\s*[\u4e00-\u9fa5]/g, '')  + 'Z')
      let joinEndTime = new Date(me.activity.joinEndTime.replace(/\s*[\u4e00-\u9fa5]/g, '')  + 'Z')
      if (endTime < this.format.date(new Date(), 'yyyy/MM/dd hh:mm')) {
        this.$toast('活动结束时间必须晚于现在')
        return
      }
      p.then(() => {
        let data = {
          title: me.activity.title,
          activityImg: me.activity.filesResults,
          beginTime: startTime,
          endTime: endTime,
          address: `${me.activity.address.curAddress}${me.activity.address.curTit}`,
          city: me.activity.address.city,
          province: me.activity.address.province,
          district: me.activity.address.district,
          fee: me.activity.cost,
          closeTime: joinEndTime,
          labels: me.activity.tags,
          details: me.activity.detailContent,
          latitude: me.activity.address.latitude,
          longitude: me.activity.address.longitude,
          activityType: 1, // 1表示投票活动
          postType: me.postType // 表示只能发图片的投票活动，0表示视频和图片都可以,2表示视频
        }
        if (me.model !== 'z') {
          data.fee = me.model
        } else {
          data.selfData = JSON.stringify(me.tmpStyle)
        }
        me.api.process({
          url: 'Activity',
          data: data,
          success: function () {
            me.setClick(true)
            me.$success(true, '创建成功', 500)
            me.$router.push({
              path: '/activity',
              query: {
                refresh: true
              }
            })
          },
          error: function () {
            me.$error(true, '创建失败', 500)
          }
        })
      })
    },
    setEditorMask (data) {
      this.setMask(data)
      this.editorShow = data
    },
    hideEditorMask (data) {
      data && this.$set(this.activity, 'detailContent', data)
      // this.activity.detailContent = data
      this.setEditorMask(false)
    },
    backActivityHome () {
      // if (!this.activity.title || !this.activity.title.trim()) {
      //   this.$router.push({
      //     name: 'activityHome'
      //   })
      // } else {
      //   this.saveDraftsModel = true
      // }
      this.$router.back()
    },
    // 修改投票信息
        /**
       * getHeadMsg得到投票活动的头部信息
       */
    getHeadMsg () {
      let me = this
      let voteId = this.$route.params.id
      me.api.get({
        url:`VoteTopic/VoteActivityId?VoteActivityId=${voteId}`,
        success: function (res) {
          // me.activity = res
          console.log('打印投票活动信息', me.activity)
          // me.activity.filesResults = res.activityImg
          console.log('封面是', me.activity.filesResults)
          if (!res.selfData) {
            me.model = res.fee
          }
          me.postType = res.postType
          //
          me.activity.title = res.title
          me.activity.filesResults = res.activityImg
          me.startTime = res.beginTime
          // beginTime: startTime,
          me.endTime = res.endTime
          me.activity.address = res.assredd
          // address: `${me.activity.address.curAddress}${me.activity.address.curTit}`,
          // city: me.activity.address.city,
          me.activity.address.city = res.city
          me.activity.address.province = res.province
          // district: me.activity.address.district,
          me.district = me.activity.address.district
          // fee: me.activity.cost
          me.activity.cost  = res.fee
          // closeTime: joinEndTime,
          me.joinEndTime = res.closeTime
          // labels: me.activity.tags,
          me.activity.tags = res.labels
          me.activity.detailContent = res.details
          // details: me.activity.detailContent,
          // voteRule: me.activity.rulesContent, // 投票规则
          me.activity.rulesContent = res.voteRule
          me.activity.address.latitude = res.latitude
          // latitude: me.activity.address.latitude,
          // longitude: me.activity.address.longitude,
          me.activity.address.longitude = res.longitude
          me.postType = res.postType
          // postType: me.postType // 表示只能发图片的投票活动，0表示视频和图片都可以,2表示视频
        }
      })
    },
  }
}
</script>
<style lang="less">
.imageWrapper{
  padding: 2.78vw;
}
.imgList{
  padding: 2.78vw 0;
  font-size: 0;
  position: relative;
  min-height: 30.2vw;
  .imgCoverItem{
    position: relative;
    width: 22.25vw;
    height: 22.25vw;
    border-radius: 1.11vw;
    display: inline-block;
    vertical-align: top;
    overflow: hidden;
    margin-left: 1.4vw;
    margin-bottom: 1.4vw;
    text-align: center;
    font-size: 12vw;
    line-height: 23.25vw;
    color: #fff;
    img{
      width: 100%;
      min-height: 100%;
    }
  }
  .upLoadImageWrapper{
    position: relative;
    background: #e0e0e0;
    #upLoadImage{
      position: absolute;
      outline: none;
      z-index: 1;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }
}
.chooseType, .chooseModel{
  display: flex;
  height: 10vw;
  line-height: 10vw;
  .fItem{
    flex: 1;
    text-align: center;
  }
  .cur{
    color:#ff2742;
  }
  .curType{
    color:#ff2742;
  }
}
.saveActive{
  position: fixed;
  height: 13vw;
  line-height: 13vw;
  top: 0;
  right: 2vw;
  font-size: 3.6vw;
  color: var(--lGray);
  z-index:300;
}
.backActivityHome{
  position: fixed;
  height: 13vw;
  width: 14vw;
  text-align: left;
  padding-left: 5vw;
  left: 0;
  top: 0;
  line-height: 13vw;
  // font-size: 3.6vw;
  background: #fff;
  // color: var(--dGray);
  z-index: 300;
  font-size:4.5vw;
  font-weight: bold;
}
.LRForm .LRFormItem .iconWanwan.iconWperson-fill{
  color: var(--mRed);
}
.postActivityPage{
  // padding-top: 12vw;
  color: var(--dGray);
  .postCoverWrapper{
    position: relative;
    height: 56.25vw;
    background: #e7e7e7;
    overflow: hidden;
    img{
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
    .iconWtihuantupian{
      position: absolute;
      right: 4vw;
      bottom: 4vw;
      height: 12vw;
      width: 12vw;
      border-radius:50%;
      background: #e7e7e7;
      line-height: 12vw;
      height: 12vw;
      text-align: center;
      color: var(--lGray);
      font-size: var(--title);
    }
    .postCover{
      padding-top: 11vw;
      text-align: center;
      .imgBg{
        width: 26vw;
        height: 26vw;
        line-height: 22vw;
        font-size: 12vw;
        border-radius: 50%;
        background: #fff;
        margin: 0 auto;
      }
      p{
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
