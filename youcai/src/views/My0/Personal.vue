<template>
  <transition name="mySet">
    <div class="bigWrap">
      <isLoading v-show='upLoading'></isLoading>
      <textArea :textAreaData='initialName'
                :show='textAreaMask'
                v-if="textAreaMask"
                @submitText='getTextAreaData'></textArea>
      <textArea :textAreaData='initialSign'
                :show='textAreaSignMask'
                v-if="textAreaSignMask"
                @submitText='getTextAreaSignData'></textArea>
      <div class="profileWrap">
        <div class="profileHead">
          <div class="leftOne">
            <span class="backto"
                  @click="back">
              <i class="iconWanwan iconWfanhui activityNotice"></i>
            </span>
            <div class="write">
              <span>编辑资料</span>
              <span>完成度&nbsp;{{completedRate}}%</span>
            </div>
          </div>
        </div>
        <ul>
          <li class="userImageUploaderComponent">
            <userImageUploader @allList='getAllList'
                               @upFiles='upUserImages'
                               @deleteFiles='deleteUserImages'
                               @hasChange='hasChangeUserImg'
                               @setAvatar='setUserAvatar'></userImageUploader>
          </li>
          <li class="splitLi">
            必填资料&nbsp;{{baseRoute}}/2
          </li>
          <li class="borderB"
              @click="handleUserName">
            <div class="profileTitle"><span><i class="iconWxinghao iconWanwan"></i>昵称</span></div>
            <div class="profileDetail">
              <span class="descript">{{nickName}}</span>
              <span class="next">
                <i class="iconWanwan iconWright activityNotice"></i>
              </span>
            </div>
          </li>
          <li class="borderB"
              id="user_info_gender"
              @click="showGenderPicker">
            <div class="profileTitle"><span><i class="iconWxinghao iconWanwan"></i>性别</span></div>
            <div class="profileDetail">
              <span class="descript">{{userGender}}</span>
              <span class="next">
                <i class="iconWanwan iconWright activityNotice"></i>
              </span>
            </div>
          </li>
          <li class="splitLi">
            基本资料&nbsp;{{otherBaseRoute}}/5
          </li>
          <li :class="['borderB', 'signLi', {specil:user.personStatement && user.personStatement.length > 14}]"
              @click="handleSign(true)">
            <div class="signTitle">个性签名</div>
            <div class="signDes">
              <span class="sign">{{user.personStatement}}</span>
              <span class="next">
                <i class="iconWanwan iconWright activityNotice"></i>
              </span>
            </div>
          </li>
          <li class="borderB"
              id="user_info_birth"
              @click="showBirthPicker">
            <div class="profileTitle"><span>出生日期</span></div>
            <div class="profileDetail">
              <span class="descript">{{birth}}</span>
              <span class="next">
                <i class="iconWanwan iconWright activityNotice"></i>
              </span>
            </div>
          </li>
          <li class="borderB"
              @click="handleFeeling">
            <div class="profileTitle">情感状态</div>
            <div class="profileDetail">
              <span class="descript">{{user.emotionState}}</span>
              <span class="next">
                <i class="iconWanwan iconWright activityNotice"></i>
              </span>
            </div>
          </li>
          <li class="borderB"
              id="user_info_area"
              @click="showAreaPicker">
            <div class="profileTitle">所在地区</div>
            <div class="profileDetail">
              <span class="descript">{{user.areaProvince}} {{user.areaCity}}</span>
              <span class="next">
                <i class="iconWanwan iconWright activityNotice"></i>
              </span>
            </div>
          </li>
          <li class="borderB industry"
              @click="handleIndustry">
            <div class="profileTitle">职业</div>
            <div class="eachLabel">
              <div class="plase"
                   v-show="!myIndustry.title">请选择职业</div>
              <div class="selectedIndustry"
                   v-show="myIndustry.title">
                <span :class="[{blue:myIndustry.detail === '工' || myIndustry.detail === 'IT' },{yellow:myIndustry.detail === '金' || myIndustry.detail === '交' },{green:myIndustry.detail === '商' || myIndustry.detail === '正' },{plum:myIndustry.detail === '文' || myIndustry.detail === '艺' }]">{{myIndustry.detail}}</span>
                <span>{{myIndustry.title}}</span>
              </div>
              <span class="next">
                <i class="iconWanwan iconWright activityNotice"></i>
              </span>
            </div>
          </li>
          <li class="splitLi">
            其他资料&nbsp;{{otherRouteC}}/2
          </li>
          <li class="borderB label"
              id="user_info_area"
              @click="handleLabel">
            <div class="profileTitle">标签</div>
            <div class="eachLabel">
              <div class="plase"
                   v-show="myLabelTitle.length === 0">请选择标签</div>
              <div class="selectedLabel"
                   :class="{uniquelabel:myLabelTitle.length > 3}"
                   v-show="myLabelTitle.length > 0">
                <span v-for="(item,index) in myLabelTitle"
                      :key="index">{{item.title}}<i v-if='(index + 1) < myLabelTitle.length'>，</i></span>
              </div>
              <span class="next">
                <i class="iconWanwan iconWright activityNotice"></i>
              </span>
            </div>
          </li>
          <li class="borderB label"
              id="user_info_area"
              @click="handleInterset">
            <div class="profileTitle">兴趣爱好</div>
            <div class="eachLabel">
              <div class="plase"
                   v-show="myInterset.length === 0">请选择兴趣</div>
              <div class="selectedLabel"
                   :class="{uniquelabel:myInterset.length > 3}"
                   v-show="myInterset.length > 0">
                <span v-for="(item,index) in myInterset"
                      :key="index">{{item.title}}<i v-if='(index + 1) < myInterset.length'>，</i></span>
              </div>
              <span class="next">
                <i class="iconWanwan iconWright activityNotice"></i>
              </span>
            </div>
          </li>
        </ul>
        <toBeVIPBar v-if='!user.vipLevel' info='秀出个性，照片墙图片上线增加到8张'></toBeVIPBar>
        <ImageEditor v-if="editorShow"
                     :imageList="imageList"
                     @hideEditor="editorShow=false"
                     @addImage="addImage" />
        <div style="height: 2.774vw; background-color: #fff;"></div>
      </div>
      <Feeling v-show="hasMask && isSetFeeling"
               @showFeel="showFeel"></Feeling>
      <Label :chooseData='myLabelTitle'
             v-if="hasMask && isSetLabel"
             @showLabel="showLabel"></Label>
      <Industry v-show="hasMask && isSetIndustry"
                @showIndustry="showIndustry"></Industry>
      <Interset v-if="hasMask && isSetInterset"
                @showInterset="showInterset"
                :chooseData="myInterset"></Interset>
    </div>
  </transition>
</template>

<script>
import ImageEditor from '@/components/ImageEditor'
import Feeling from '@/views/My0/components/Feeling'
import Label from '@/views/My0/components/Label'
import Industry from '@/views/My0/components/Industry'
import Interset from '@/views/My0/components/Interset'
import userImageUploader from '@/components/upLoader/userImageUploader'
import textArea from '@/components/TextArea'
import isLoading from '@/components/requestState/isLoading'
import toBeVIPBar from '@/components/Vip/ToBeVIPBar'

import { mapMutations, mapState } from 'vuex'
export default {
  data () {
    return {
      userOriginData: '', // 用户的原始数据
      hasChange: false, // 数据是否改变
      hasChangeImg: false, // 用户照片&&头像是否改变
      isBack: false, // 表示是返回键
      upLoading: false,
      user: {},
      baseRoute: 0,
      otherBaseRoute: 0,
      otherRouteC: 0,
      completedRate: 0,
      userGender: '',
      formLoading: false,
      editorShow: false,
      editorSrc: '',
      showVideoUploader: true,
      fileItems: [{ fileId: '', filePath: '', upload: { isUploading: false, percent: 0 } }],
      imageList: [],
      uploadId: 10000,
      isSetSign: false, // 设置签名
      isSetUserName: false, // 设置用户name
      // initialSign: '还没有简介哦',
      isSetFeeling: false, // 处理用户情感状态
      initFeel: {
        id: 1,
        title: '保密'
      },
      isSetLabel: false, // 处理用户的标签
      myLabelTitle: [], // 用户选择标签
      isSetIndustry: false, // 处理用户行业
      myIndustry: {}, // 用户选择的行业
      isSetInterset: false, // 用户用户兴趣
      myInterset: [], // 用户选择的兴趣
      userSelectBirth: '', // 用户选择的生日
      upImages: [],
      deleteImages: [],
      newUrl: [],
      upUrlIndex: 0,
      deleteImageIndex: 0,
      userAvatarIndex: 0,
      allList: [],
      textAreaMask: false,
      textAreaSignMask: false,
      initialName: {
        maxLen: 10,
        title: '修改昵称',
        inputText: '',
        inputHolderText: '还没有昵称哦',
        toast: '昵称不能为空'
      },
      initialSign: {
        maxLen: 50,
        title: '修改签名',
        inputText: '',
        inputHolderText: '还没有签名哦',
        toast: '签名不能为空'
      },
      userProfileId: '',
      changedAvatar: '' // 改变的头像
    }
  },
  components: {
    toBeVIPBar,
    ImageEditor,
    Feeling,
    Label,
    Industry,
    Interset,
    userImageUploader,
    textArea,
    isLoading
  },
  computed: {
    ...mapState({
      'hasMask': 'hasMask'
    }),
    introduction () {
      if (this.user.personStatement === undefined) {
        return this.initialSign
      } else {
        // eslint-disable-next-line
        this.initialSign = this.user.personStatement
        return this.initialSign
      }
    },
    /**
     * birth格式化用户的生日
     */
    birth () {
      let data = ''
      if (this.user.birth === this.$store.state.defaultBirth) {
        return ''
      }
      if (this.user.birth) {
        let res = this.user.birth.substring(0, 10)
        data = res
      }
      return data
    },
    nickName () {
      if (this.user.nickName === this.$store.state.user.name) {
        return ''
      } else {
        return this.user.nickName
      }
    },
    hasBaseInfo () {
      if (!this.allList.length && this.$store.state.user.avatar === this.$store.state.noneAvator ) {
        return '请设置头像'
      }
      if (!this.nickName) {
        return '请设置昵称'
      }
      if (!this.user.gender) {
        return '请选择性别'
      }
      return ''
    }
  },
  watch: {
    user: {
      // immediate: true,
      deep: true,
      handler (newV) {
        this.hasChange = true
        this.upBaseRoute()
        this.upOtherBaseRoute()
        this.otherRoute()
        let allL = this.baseRoute + this.otherBaseRoute + this.otherRouteC
        this.completedRate = parseInt(allL / 9 * 100)
        return newV
      }
    },
    myLabelTitle (newV) {
      newV && newV.length && this.$set(this.user, 'lable', JSON.stringify(newV))
    },
    myIndustry (newV) {
      newV && newV.length && this.$set(this.user, 'book', JSON.stringify(newV))
    },
    myInterset (newV) {
      newV && newV.length && this.$set(this.user, 'movie', JSON.stringify(newV))
    },
    hasMask (newV) {
      if (!newV) {
        let pickerWrap = document.getElementsByClassName('weui-picker')[0] && document.getElementsByClassName('weui-picker')[0].parentNode
        pickerWrap && document.body.removeChild(pickerWrap)
        this.setFalse()
      }
    }
  },
  mounted () {
    this.getUserProfile()
  },
  methods: {
    ...mapMutations({
      'updateUserInfo': 'updateUserInfo',
      'setMask': 'setMask'
    }),
    getAllList (items) {
      this.allList = items
    },
    upBaseRoute () {
      let baseRoute = 0
      if (this.nickName !== '') {
        baseRoute++
      }
      if (this.user.gender) {
        baseRoute++
      }
      this.baseRoute = baseRoute
    },
    upOtherBaseRoute () {
      let count = 0
      if (this.user.birth !== this.$store.state.defaultBirth) {
        count++
      }
      if (this.user.emotionState) {
        count++
      }
      if (this.user.personStatement) {
        count++
      }
      if (this.user.areaProvince) {
        count++
      }
      // FIXME:职业无数据
      if (this.user.book) {
        count++
      }
      this.otherBaseRoute = count
    },
    otherRoute () {
      let count = 0
      if (this.user.movie) {
        count++
      }
      if (this.user.lable) {
        count++
      }
      this.otherRouteC = count
    },
    /**
     * showGenderPicker 性别选择
     */
    showGenderPicker: function () {
      let me = this
      var values = me.data.ToPicker(me.data.user.genders)
      values.splice(0, 1)
      let defaultValue = me.user.gender
      me.setMask(true)
      // eslint-disable-next-line
      weui.picker(values, {
        id: 'user_info_genderPicker',
        defaultValue: [defaultValue],
        onConfirm: function (result) {
          me.$set(me.user, 'gender', result[0].value)
          me.userGender = result[0].label
        },
        onClose: function () {
          me.setMask(false)
        }
      })
    },
    /**
     * showBirthPicker 选择出生日期
     */
    showBirthPicker () {
      let me = this
      let date = new Date()
      let dateYear = date.getFullYear()
      var label = me.user.birth || '2000-01-01'
      var defaultValue = [parseInt(label.substr(0, 4)), parseInt(label.substr(5, 2)), parseInt(label.substr(8, 2))]
      this.setMask(true)
      // eslint-disable-next-line
      weui.datePicker({
        id: 'user_info_birthPicker',
        start: dateYear - 100,
        end: dateYear,
        defaultValue: defaultValue,
        onConfirm: function (result) {
          let val = result[0].value + '-' + result[1].value + '-' + result[2].value
          me.$set(me.user, 'birth', val)
          me.userSelectBirth = val
        },
        onClose: function () {
          me.setMask(false)
        }
      })
      // return false
    },
    /**
     * showAreaPicker 选择地区
     */
    showAreaPicker: function () {
      let me = this
      // eslint-disable-next-line
      let data = cityData
      let defP = data.find(t => t.label === (me.user.userProvince || '广东省'))
      let defC = defP.children.find(t => t.label === (me.user.userCity || '深圳市'))
      // eslint-disable-next-line
      weui.picker(data, {
        id: 'user_info_area_picker',
        depth: 2,
        defaultValue: [defP.value, defC.value],
        onConfirm: function (result) {
          let p = data.find(t => t.value === result[0].value)
          let c = p.children.find(t => t.value === result[1].value)
          me.$set(me.user, 'areaProvince', p.label)
          me.$set(me.user, 'areaCity', c.label)
        },
        onClose: function () {
        }
      })
      return false
    },
    // 显示个性签名
    handleSign (data) {
      this.textAreaSignMask = data
    },
    // 显示用户昵称
    handleUserName () {
      // this.isSetUserName = true
      this.textAreaMask = true
    },
    /**
     * showSign 显示签名页
     */
    showSign () {
      this.isSetSign = false
    },
    /**
     * showUserName 显示用户昵称页
     */
    showUserName () {
      this.isSetUserName = false
    },
    // 处理用户的情感状态
    handleFeeling () {
      this.setMask(true)
      this.isSetFeeling = true
    },
    showFeel (item) {
      this.setMask(false)
      this.isSetFeeling = false
      // this.user.emotionState = item
      this.$set(this.user, 'emotionState', item.title)
    },
    // 处理用户的标签
    handleLabel () {
      this.setMask(true)
      this.isSetLabel = true
    },
    showLabel (item = []) {
      this.setMask(false)
      this.isSetLabel = false
      this.myLabelTitle = item
      this.$set(this.user, 'label', JSON.stringify(item))
    },
    // 处理用户的行业
    handleIndustry () {
      this.setMask(true)
      this.isSetIndustry = true
    },
    showIndustry (item = {}) {
      this.setMask(false)
      this.isSetIndustry = false
      this.myIndustry = item
      this.$set(this.user, 'book', JSON.stringify(item))
    },
    // 处理用户的兴趣
    handleInterset () {
      this.setMask(true)
      this.isSetInterset = true
    },
    showInterset (item = []) {
      this.setMask(false)
      this.isSetInterset = false
      this.myInterset = item
      this.$set(this.user, 'movie', JSON.stringify(item))
    },
    upUserImages (data) {
      this.upImages = data
    },
    deleteUserImages (data) {
      this.deleteImages = data
    },
    setUserAvatar (index) {
      this.userAvatarIndex = index
    },
    getTextAreaData (data) {
      if (data) {
        this.$set(this.user, 'nickName', data.inputText)
        this.$set(this.initialName, 'inputText', data.inputText)
      }
      this.textAreaMask = false
    },
    getTextAreaSignData (data) {
      if (data) {
        this.$set(this.user, 'personStatement', data.inputText)
        this.$set(this.initialSign, 'inputText', data.inputText)
      }
      this.handleSign(false)
    },
    setFalse () {
      let me = this
      let arr = ['isSetFeeling', 'isSetLabel', 'isSetIndustry', 'isSetInterset']
      arr.map((item) => {
        me[item] = false
      })
    },
    hasChangeUserImg (data) {
      this.hasChangeImg = data
    },
    /**
     * getUserProfile() 获得用户详细信息
     */
    getUserProfile () {
      let me = this
      me.api.get({
        url: 'UserProfile/userId',
        success: (res) => {
          for (let key in res.user) {
            if (res.user[key] || res.user[key] === 0) {
              me.$set(me.user, key, res.user[key])
            }
          }
          for (let key in res.userProfile) {
            if (res.userProfile[key] || res.userProfile[key] === 0) {
              me.$set(me.user, key, res.userProfile[key])
            }
          }
          // 存储用户的原始数据，退出时用来比较是否改变了数据
          me.userOriginData = JSON.stringify(me.user)
          // 将用户信息给对应的字段
          res.userProfile.userProfileId && (me.userProfileId = res.userProfile.userProfileId)
          res.userProfile.lable && (me.myLabelTitle = JSON.parse(res.userProfile.lable))
          res.userProfile.movie && (me.myInterset = JSON.parse(res.userProfile.movie))
          res.userProfile.book && (me.myIndustry = JSON.parse(res.userProfile.book))
          me.userGender = me.user.gender === 0 ? '' : me.user.gender === 1 ? '男' : me.user.gender === 2 ? '女' : ''
          me.$set(me.initialName, 'inputText', me.nickName)
          me.$set(me.initialSign, 'inputText', me.user.personStatement)
        }
      })
    },
    /** 以下全部是 保存用户信息的函数
     * 退出时检测数据是否改变，改变就提交并保存数据 */
    back () {
      // 要检测数据与图片(头像)是否改变
      if (this.userOriginData === JSON.stringify(this.user) && !this.hasChangeImg) { // 没有数据改变
        this.$router.back()
        return
      }
      this.postUserProfile()
    },
    async queue (arr, fn) { // 异步队列顺序执行
      let res = ''
      for (let i = 0; i < arr.length; i++) {
        res = await fn(arr[i])
      }
      return await res
    },
    /*
    * post队列
    * TODO: 这样就可以写上传进度了
    */
    async queuePost (arr) {
      this.$uploading(true, '保存中...')
      let res = 'ok'
      for (let i = 0; i < arr.length; i++) {
        res && (res = await arr[i]().catch((err) => { // 捕获err停止队列
          this.upErr(err)
        }))
      }
      if (res) { // 完成了
        // 更新用户信息后 给android再更新一遍
        window.isInAndroid && window.WanAndroid.updateUserInfo(this.user.userId, this.user.nickName, this.user.avatar)
        this.$success(true, '设置资料成功', 600)
        setTimeout(() => {
          this.$router.back()
        }, 600)
      }
      return await res
    },
    upErr (err) { // 错误处理 | 这里照片墙 | 头像是与 上传数据分开的不用清楚已上传的图片 | 让提交数据在前就好了
      this.$error(true, typeof(err) == 'string' ? err : '保存失败', 1000)
    },
    /**
     * postUserProfile修改个人信息
     * 用 async 异步执行 
     * 上传资料 -> 修改头像? -> Y -> 修改邮箱 -> 更新资料
     * 上传资料 -> 修改头像? -> N -> 更新资料
     */
    postUserProfile () {
      this.queuePost([
        this.postUserProfileSync,
        this.upImage,
        this.upUserPhoteQueue, 
        this.delUserPhotoQueue,
        this.getUserImage,
        this.upUserAvatar,
        this.upUserData
      ])
    },
    /** 以下七个函数是异步保存用户数据的函数
     * 对应 postUserProfile 的七个函数
     */
    postUserProfileSync () { // 1. 上传用户资料
      let me = this
      return new Promise ((resolve, reject) => {
        let userP = {
          emotionState: me.user.emotionState,
          lable: me.user.lable,
          movie: me.user.movie,
          book: me.user.book
        }
        if (me.userProfileId) {
          userP.userProfileId = me.userProfileId
          // userP.userId = me.user.userId
        }
        me.api.process({
          url: 'UserProfile',
          data: {
            user: me.user,
            userProfile: userP
          },
          success: function () {
            resolve('ok')
          },
          error: function (err) {
            reject(err)
          }
        })
      })
    },
    /*
    * 照片墙操作
    */
    upImage () { // 1. 获取照片墙网址List
      let me = this
      return new Promise ((resolve, reject) => {
        if (this.upImages.length) { // 有照片墙
          var fd = new FormData()
          for (let i = 0; i < this.upImages.length; i++) {
            fd.append('1' + i, this.upImages[i])
          }
          me.api.file({
            url: 'file',
            data: fd,
            success: (res) => {
              me.newUrl = res.split(',')
              resolve('ok')
            },
            error: function (err) {
              reject(err)
            }
          })
        } else {
          resolve('ok')
        }
      })
    },
    upUserPhoteQueue () { // 2. 上传照片墙ItemQueue
      return new Promise((resolve, reject) => {
        if (this.upImages.length) {
          this.queue(this.newUrl, this.upUserPhotoItem).then(() => {
            resolve('ok')
          }).catch((err) => {
            reject(err)
          })
        } else {
          resolve('ok')
        }
      })
    },
    upUserPhotoItem (data) { // 2.1 上传照片墙Item
      return new Promise ((resolve, reject) => {
        this.api.process({
          url: 'UserImage',
          data: {
            ImageUrl: data
          },
          success: function() {
            resolve('ok')
          },
          error: function () {
            reject()
          }
        })
      })
    },
    delUserPhotoQueue () { // 3. 删除照片墙Item与queue配合
      return new Promise((resolve, reject) => {
        if (this.deleteImages.length) {
          this.queue(this.deleteImages, this.delUserPhotoItem).then(() => {
            resolve('ok')
          }).catch((err) => {
            reject(err)
          })
        } else {
          resolve('ok')
        }
      })
    },
    delUserPhotoItem (data) { // 3.1 删除照片墙Item
      return new Promise ((resolve, reject) => {
        this.api.delete({
          url: 'UserImage?id=' + data,
          success: function () {
            resolve('ok')
          },
          error: function () {
            reject()
          }
        })
      })
    },
    getUserImage () {  // 4. 获取用户是否改变了头像 | 改变了 -> 返回头像地址 | 没改变 -> false
      let me = this
      return new Promise((resolve, reject) => {
        me.api.get({
          url: 'UserImage',
          success: (res) => {
            if (res && res.length && res[me.userAvatarIndex].imageUrl !== me.$store.state.user.avatar) {
              me.changedAvatar = res[me.userAvatarIndex]
            } else {
              me.changedAvatar = null
            }
            resolve('ok')
          },
          error: (err) => {
            reject(err)
          }
        })
      })
    },
    upUserAvatar () { // 5. 设置用户头像
      let me = this
      return new Promise ((resolve, reject) => {
        if (me.changedAvatar) { // 改变头像了
          me.api.put({
            url: 'UserImage?id=' + me.changedAvatar.userImageId,
            success: function () {
              window.isInAndroid && window.WanAndroid.updateUserInfo(me.user.userId, me.user.nickName ,me.changedAvatar.imageUrl)
              resolve('ok')
            },
            error: function (err) {
              reject(err)
            }
          })
        } else {
          resolve('ok')
        }
      })
    },
    upUserData () { // 6. 每次更改用户信息都刷新数据
      let me = this
      return new Promise ((resolve, reject) => {
        me.api.get({
          url: 'UserMain',
          success: function (res) {
            // 更新用户的信息
            if (res) {
              me.updateUserInfo(res)
            }
            resolve('ok')
          },
          error: (err) => {
            reject(err)
          }
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.iconWxinghao{
  display: inline-block;
  vertical-align: top;
  font-size: var(--sText);
  color: var(--mRed);
  width: 1.2vw;
  height: 1.2vw;
  transform: scale(.4);
  margin-top: 1.4vw;
  margin-right: 1vw;
}
.bigWrap{
  width:100%;
  height:100vh;
  overflow: hidden;
  background-color:white;
  position:fixed;
  top:0;
  left:0;
  z-index: 1001;
  &.mySet-enter-active,&.mySet-leave-active{
    transition: all 0.5s;
  }
  &.mySet-enter,&.mySet-leave-to{
    left:100vw;
    opacity:0;
  }
    .profileWrap{
      width:100%;
      height:100%;
      overflow: scroll;
      color:#333333;
      .profileHead{
        width:100%;
        padding-left:4vw;
        padding-right:4vw;
        box-sizing: border-box;
        height:13.2vw;
        position:fixed;
        top:0;
        left:0vw;
        z-index: 1000;
        display:flex;
        justify-content: space-between;
        align-items: center;
        background-color:white;
        .leftOne{
          width:50vw;
          height:100%;
          display:flex;
          flex-flow: row wrap;
          .backto{
            display:inline-block;
            height:100%;
            line-height:13.2vw;
            margin-right:3vw;
            font-size:4.5vw;
            font-weight: bold;
          }
          .write{
            position:relative;
            span:nth-child(1) {
              display:inline-block;
              font-size:4.3vw;
              color:#333333;
              font-weight: 500;
              width:40vw;
              position:absolute;
              top:1vw;
              left:0;
            }
            span:nth-child(2) {
              display:inline-block;
              font-size:3.33vw;
              color:#999999;
              width:40vw;
              position:absolute;
              top:7vw;
              left:0;
            }
          }
        }
        .rightTwo{
          width:25vw;
          height:8vw;
          border-radius: 4vw;
          background-color:#ff2842;
          text-align: center;
          line-height:8vw;
          color:white;
          font-size:4.5vw;
        }
      }
      ul{
        width:100%;
        margin-top:13.2vw;
        .userImageUploaderComponent{
          min-height: 38vw;
          height: auto;
        }
        li{
          height:15.7vw;
          display:flex;
          justify-content: space-between;
          line-height:15.7vw;
          padding-left:4.5vw;
          padding-right:4vw;
          box-sizing: border-box;
          .profileDetail{
            width:65vw;
            display:flex;
            .descript{
              display:inline-block;
              width:90vw;
              text-align: right;
              color:#ababab;
            }
            .next{
              display:inline-block;
              width:10vw;
              text-align: right;
              .activityNotice{
                color:#cccccc;
              }
            }
          }
        }
        .uniqueLi{
          height:18vw;
          line-height: 18vw;
          justify-content: space-between;
          .profileTitle{
              width:45vw;
            }
          .myUnique{
            display:flex;
            align-items: center;
            .userModifyAvator{
              width:15vw !important;
              height:15vw !important;
              border-radius: 50%;
              img{
                width:100% !important;
                height:auto !important;
                border-radius: 50% !important;
              }
            }
            .profileDetail{
              display:flex;
              align-items: center;
            }
          }
          .profileImgStyle{
            display:inline-block;
            text-align: right;
            width:7vw;
              margin-left:2vw;
              .activityNotice{
                color:#cccccc;
              }
          }
        }
        .signLi{
          .signTitle{
            display:flex;
            align-items: center;
          }
          .signDes{
            display: flex;
            text-align: right;
            .sign{
              display:inline-block;
              width:59.5vw;
              color:#ababab;
              word-wrap: break-word;
              word-break: break-all;
            }
            .next{
              margin-left:1.5vw;
              color:#cccccc;
              display:flex;
              align-items: center;
            }
          }
        }
        .specil{
          height:inherit;
          line-height:5vw;
          padding-top:2vw;
          padding-bottom:2vw;
          box-sizing: border-box;
        }
        .splitLi{
          height:12vw;
          background-color:var(--mBg);
          line-height:12vw;
          color:#333333;
          // font-size:4.8vw;
          // font-weight: 500;
          padding-left:3vw;
          box-sizing: border-box;
        }
        .label{
          // border:none;
            .eachLabel{
              width:69vw;
              display:flex;
              justify-content: flex-end;
              overflow:hidden;
              text-overflow:ellipsis;
              white-space:nowrap;
              color:#ababab;
              .plase{
                margin-right:2vw;
                color:#ababab;
              }
              .uniquelabel{
                width:65vw;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space:nowrap;
                margin-right:1vw;
                span{
                  color:#ababab;
                }
              }
              .activityNotice{
                color:#cccccc;
              }
          }
        }
        .industry{
          .eachLabel{
              width:69vw;
              display:flex;
              justify-content: flex-end;
              overflow:hidden;
              text-overflow:ellipsis;
              white-space:nowrap;
              .plase{
                margin-right:2vw;
                color:#ababab;
              }
              .selectedIndustry{
                display:flex;
                align-items: center;
                margin-right:2vw;
                color:#ababab;
                span:nth-child(1){
                      display:inline-block;
                      width:6vw;
                      height:4vw;
                      color:white;
                      font-size:3vw;
                      border-radius: 3vw;
                      text-align: center;
                      line-height:4vw;
                      margin-right:2vw;
                  }
                  .blue{
                      background-color:#87bae8;
                  }
                  .yellow{
                      background-color:#f5b068;
                  }
                  .green{
                      background-color:#a3e038;
                  }
                  .plum{
                      background-color:#be86e4;
                  }
              }
              .activityNotice{
                color:#cccccc;
              }
          }
        }
      }
  }
}
</style>
