<template>
  <div class="page-content form_primary">
    <span v-if="!this.isVote"
          class="saveDraft"
          @click="saveDraft">
      存草稿
    </span>
    <div class="fixedHead">
      <span @click="goBack"><i class="iconWfanhui iconWanwan activityNotice"></i></span>
      <span>{{pageTit}}</span>
    </div>
    <form method="post"
          action="javascript:;"
          @submit.prevent="submit"
          v-bind:class="{is_loading:formLoading}">
      <input type="hidden"
             name="Id"
             :value="item.Id" />
      <div class="postMain">
        <!-- FIXME:可以用scroll || transform效果更好 -->
        <!-- transition 效果不太好 -->
        <imageList class="trans"
                   v-show='!isFocus'
                   :maxLength=9
                   @upFiles='getFiles'
                   @upFilesResults='upFilesResults'
                   :imagesList="imageUlrs"></imageList>
        <div class="postTitle">
          <input type="text"
                 class="postInputTitle"
                 placeholder="加个标题会有更多赞哦"
                 maxlength="20"
                 v-model="inputTitle"
                 @focus="getTitleFocus"
                 @blur="getTitleBlur">
          <span class="titleCount">{{inputTitleCount}}</span>
        </div>
        <div class="weui-cell userTopic">
          <div class="weui-cell__bd"
               id='IndexMaster'
               @touchstart="touchstart($event)"
               @touchmove="touchmove($event)"
               @touchend="touchend($event)"
               ref='IndexWrapper'>
            <textarea :maxlength="maxTextCount"
                      name="content"
                      ref="postInput"
                      :class="['postInputContent',{moreHeight: isFocus}]"
                      placeholder="这一刻，想说点什么..."
                      v-model="item.Content"
                      @focus="getFocus"
                      @blur="getBlur"></textarea>
            <div class="contentCount">
              <div class="allCount">{{itemContentLength}} / {{maxTextCount}}</div>
            </div>
          </div>
        </div>
        <span class="cutting"></span>
      </div>
      <div class="post">
        <button class="btn_primary postBtn "><span>发布</span></button>
      </div>
    </form>
    <toBeVIPBar v-if='!user.vipLevel' info='上传视频时间上限提高到2分钟'></toBeVIPBar>
  </div>
</template>

<script>
/** 上传帖子页面，笔记/视频
 * 1. 简单验证 笔记必须有title / content
 * 2. 可以存草稿 | 从草稿箱取数据
 * 3. 上传前先读取首图/封面图片的数据
 */
import imageList from '@/components/upLoader/imageUploader'
import upDateMask from '@/components/mixins/upDateMask'
import toBeVIPBar from '@/components/Vip/ToBeVIPBar'
import { mapMutations, mapState } from 'vuex'
export default {
  mixins: [upDateMask],
  components: {
    imageList,
    toBeVIPBar
  },
  data () {
    return {
      progress: 0, // 上传进度
      path: '',
      isReallyBack: false, // 是否真的想退出
      topic: { id: 0, title: '' },
      formLoading: false,
      inputTitle: '',
      inputTitleCount: 20,
      item: {
        Id: 0, CategoryId: 0, Content: '', Pictures: '', files: [], 
      },
      postType: 1,
      files: [],
      newUrl: '',
      newImageList: [],
      // 下面是新的
      startPosition: {},
      deltaY: 0,
      endPosition: {},
      isFocus: false, // 是否定位到光标位置
      draftImage: [], // 草稿图片
      drafts: {},
      imageUlrs: [],
      myDraftList: [],
      coverImg: '',
      coverData: {},
      isBeforePath: '',
      activityId: this.$route.params.id
    }
  },
  computed: {
    ...mapState(['postDraftState', 'user']), // 草稿箱的状态 -> 草稿的index
    pageTit () {
      return this.isVote ? '参与投票活动' : '发布动态'
    },
    isVote () {
      return !!this.activityId
    },
    hasContent () { // 检测是否有内容 | 有内容就提示是否真的退出
      return (this.item.Content || this.item.files.length || this.inputTitle)
    },
    hasMust () {
      if (this.isVote) {
        return !!(this.inputTitle && this.inputTitle.length > 0)
      } else {
        return this.item.Content || this.inputTitle
      }
    },
    hasMustToast () {
      return this.isVote ? '参与投票作品必须有标题' : '标题和内容不能都为空哦!'
    },
    itemContentLength () {
      if (this.item.Content && this.item.Content.length <= 0 || !this.item.Content) {
        return 0
      } else {
         return this.item.Content && this.item.Content.length
      }
    },
    CategoryId () {
      return this.item.CategoryId
    },
    maxTextCount () {
      if (this.postType === 1) {
        return 2000
      } else {
        return 200
      }
    }
  },
  watch: {
    'item.files' () {
      this.$nextTick(() => {
        this.resetImgCropType()
      })
    },
    postDraftState (newV) {
      if (newV || newV == 0) {
        this.inputTitle = this.myDraftList[newV] && this.myDraftList[newV].title
        this.item.Content = this.myDraftList[newV] && this.myDraftList[newV].content
        this.imageUlrs = this.myDraftList[newV] && this.myDraftList[newV].imgs
        this.draftImage = this.myDraftList[newV] && this.myDraftList[newV].imgs
      }
    },
    inputTitle (newV) {
      if (newV.length > 0) {
        this.inputTitleCount = newV.length
      }
    },
    deltaY (newY) {
      if (Math.abs(newY) >= 20) {
        let postInput = this.$refs.postInput
        postInput.blur()
        this.isFocus = false
      }
    },
    isReallyBack (newV) {
      if (newV) {
        if (this.path === 'postActivity') {
          this.upPostCurTab(1)
          this.$router.replace({name: this.path})
          return
        }
        this.$router.push({name: this.path})
      }
    }
  },
  beforeDestroy () {
    window.isInAndroid && window.WanAndroid.closePublish()
  },
  created () {
    this.testPostDraft()
  },
  mounted () {
    window.postVideo = this.postVideoCallback
    window.isInAndroid && window.WanAndroid.imgCropType(0, 9)
    this.upPostCurTab(0)
  },
  beforeRouteEnter(to, from, next) {
    next((vm)=>{
      vm.isBeforePath = from.name
    })
  },
  beforeRouteLeave(to, from, next) {
    if (this.hasContent && !this.isReallyBack) {
      this.path = to.name
      this.showBackConfirm()
      return
    } else {
      this.updateDraftState(-1)
      next()
    }
  },
  methods: {
    ...mapMutations({
      updateMasterCurTab: 'updateMasterCurTab',
      upIsReallyBack: 'upIsReallyBack',
      upPostCurTab: 'upPostCurTab',
      updateDraftState: 'updateDraftState',
      updateMyPage: 'updateMyPage'
    }),
    /*
    * 以下是草稿函数
    */
    testPostDraft () { // 检测是否有草稿 && 是否从草稿页面进来的
      if (this.isVote) { // 投票活动不检测
        return
      }
      let draftCreate = JSON.parse(localStorage.getItem('postDraftList'))
      if (!draftCreate) {
        localStorage.setItem('postDraftList', JSON.stringify(this.myDraftList))
      }
      this.myDraftList = JSON.parse(localStorage.getItem('postDraftList'))
      //  this.myDraftList 为null时候, 没有length
      if (this.myDraftList && (!!this.myDraftList.length && this.$store.state.postDraftState === -1)){
        this.showDraftConfirm()
      }
      // 保存草稿
      if (this.postDraftState != -1) {
        let newV = this.postDraftState
        this.inputTitle = this.myDraftList[newV] && this.myDraftList[newV].title
          this.item.Content = this.myDraftList[newV] && this.myDraftList[newV].content
          this.imageUlrs = this.myDraftList[newV] && this.myDraftList[newV].imgs
          this.draftImage = this.myDraftList[newV] && this.myDraftList[newV].imgs
      }
    },
    saveDraft () { // 存草稿 -> 只支持图文 this.postType 1
      let me = this
      if (this.postType === 2) {
        me.$toast('视频暂时不支持草稿哦', 1000)
        return
      }
      if (me.item.files && me.item.files.length <= 0) {
        me.$toast('请选择图片', 1000)
        return
      }
      if (me.inputTitle) {
        let title = me.inputTitle
        me.drafts.title = title
      }
      if (me.item.Content) {
        let content = me.item.Content
        me.drafts.content = content
      }
      let p = this.crateDraftImage()
      p.then(()=>{
        if (me.draftImage && me.draftImage.length > 0) {
          me.drafts.imgs = me.draftImage
          me.drafts.saveTime = me.format.date(
          new Date(),
          'yyyy-MM-dd hh:mm'
        )
          me.myDraftList.push(me.drafts)
          localStorage.setItem('postDraftList', JSON.stringify(me.myDraftList))
          me.$toast('保存草稿成功',1200)
          me.isReallyBack = true
          me.$router.back()
        }
      })
    },
    crateDraftImage () { // 上传草稿箱图片
      return new Promise ((resolve, reject) => {
        let me = this
        if (me.item.files.length >= 1) {
          var fd = new FormData()
          let markIndex = []
          for (let i = 0; i < me.item.files.length; i++) {
            if (me.item.files[i].type) {
              markIndex.push(i)
              fd.append('1' + i, me.item.files[i])
            }
          }
          if (markIndex.length) {
            me.api.file({
              url: 'file',
              data: fd,
              success: res => {
                let newR = res.split(',')
                markIndex.map((item, index) => {
                  me.draftImage[item] = newR[index]
                })
                resolve('ok')
              },
              error: () => {
                // me.$toast('上传失败')
                reject()
              }
            })
          } else {
            resolve('ok')
          }
        } else {
          resolve('ok')
        }
      })
    },
    showDraftConfirm () { // 显示草稿confirm
      this.$confirm({
        title: `检测到您有${this.myDraftList.length}封草稿`,
        msg: '是否启用草稿？',
        type: 'confirm',
        yesBtnText: '确定',
        noBtnText: '取消'
      }).then(() => {
        this.$router.push({ name: 'my_xiao' })
      }).catch(() => {})
    },
    
    // 上面是新的
    getFiles (data, type) { // 获取数据 && 判断是图文 1 || 视频 2
      this.$set(this.item, 'files', data)
      if (type === 'video') {
        this.postType = 2
      } else {
        this.postType = 1
      }
    },
    upFilesResults (data) {
      this.coverImg = data[0]
      this.$set(this.item, 'fileResults', data)
    },
    async resetImgCropType () {
      if (!this.coverImg || !this.item.files.length) {
        return
      }
      let imgData = await this.getImgInfo(this.coverImg)
      let cropType = imgData.width < imgData.height ? 3 : 2
      let remainNum = 9 - this.item.files.length
      window.isInAndroid && window.WanAndroid.imgCropType(cropType, remainNum)
    },
    upErr (err) {
      this.newImageList = [] // 清空图片列表
      this.$error(false, typeof(err) == 'string' ? err : JSON.stringify(err))
    },
    async queue (arr){
      let res = 'ok'
      for (let i = 0; i<arr.length;i++) {
        res && (res = await arr[i]().catch((err) => {
          this.upErr(err)
        }))
      }
      console.log(res, 'queue')
      return res
    },
    submit: function () { // 提交
      let me = this
      console.log(this.hasMust)
      if (!this.hasMust) {
        me.$toast(this.hasMustToast)
        return
      }
      if (this.postType === 2) { // 上传视频
        me.postVideo()
      } else {
        if (!me.item.files.length) {
          me.$alert('至少发布一张图片哦')
        } else { // 上传图文
          me.postPictureQueue()
        }
      }
      this.isReallyBack = true
    },
    postVideo () {
      // this.$uploading(true, '上传中...')
      this.queue([this.upFileThumbnail, this.getImgInfo]).then((res) => {
        console.log(res, 'videoQueueRes')
        window.isInAndroid && window.WanAndroid.uploadVoteVideo()
      }).catch((err) => {
        this.upErr(err)
      })
    },
    postPictureQueue () {
      this.$uploading(true, '上传中...')
      this.queue([this.upFileThumbnail, this.getImgInfo, this.upImage, this.postPicture]).then((res) => {
        if (res) {
          if (this.postDraftState != -1) {
            this.myDraftList.splice(this.postDraftState, 1)
            localStorage.setItem('postDraftList', JSON.stringify(this.myDraftList))
          }
          this.updateMyPage({isRefreshPost: true})
          this.$success(true, '上传成功', 500)
          setTimeout(() => {
            this.$router.go(-1)
          }, 500)
        }
      }).catch((err) => {
        this.upErr(err)
      })
    },
    async postVideoCallback (url) {
      let me = this
      if (url) {
        await me.getImgInfo()
      }
      return new Promise ((resolve, reject) => {
        let data = {}
        if (window.isInAndroid && this.$store.state.pos.city) {
          data.areaProvince = this.$store.state.pos.province
          data.areaCity = this.$store.state.pos.city
          data.longitude = this.$store.state.pos.longitude
          data.latitude = this.$store.state.pos.latitude
        } else if (!window.isInAndroid) {
          data.areaProvince = this.$store.state.user.areaProvince
          data.areaCity = this.$store.state.user.areaCity
        }
          data.video = url.split(',')[0]
          data.picture = url.split(',')[1]
          data.pictureGif = url.split(',')[2]
          data.videoTime = url.split(',')[3]
          data.postType = 2
          data.videoCover = me.thumbNail // 视频封面
          
          if (me.item.Content && me.item.Content.length > 1) {
            data.content = me.item.Content
          }
          if (me.inputTitle && me.inputTitle.length > 1) {
            data.postTitle = me.inputTitle
          }
          data.height = me.coverData.height
          data.wight = me.coverData.width

          if (me.isVote) { // 投票
            data.activityId = me.activityId
            data.objectType = 1
          }
          me.api.process({
            url: 'Post',
            data: data,
            success: function () {
              // me.$success(true, '上传成功', 500) // FIXME:这里换成调用android的方法
              setTimeout(() => {
                me.$router.go(-1)
              }, 500)
              me.updateMyPage({isRefreshPost: true})
              resolve('ok')
            },
            error: function (err) {
              me.upErr(err) // FIXME:这里换成调用android的方法
              reject(err)
            }
          })
      })
    },
    postPicture () { // 上传图文帖子
      let me = this
      return new Promise ((resolve, reject) => {
        let data = {}
        if (window.isInAndroid && this.$store.state.pos.city) {
          data.areaProvince = this.$store.state.pos.province
          data.areaCity = this.$store.state.pos.city
          data.longitude = this.$store.state.pos.longitude
          data.latitude = this.$store.state.pos.latitude
        } else if (!window.isInAndroid) {
          data.areaProvince = this.$store.state.user.areaProvince
          data.areaCity = this.$store.state.user.areaCity
        }
      var imageList = []
          for (let i = 0; i < me.newImageList.length; i++) {
            imageList.push({
              imageUrl: me.newImageList[i]
            })
          }
          data.video = null
          data.picture = me.thumbNail
          data.postType = 1

          if (me.isVote) { // 投票
            data.activityId = me.activityId
            data.objectType = 1
          }
          if (me.item.Content && me.item.Content.length > 1) {
            data.content = me.item.Content
          }
          if (me.inputTitle && me.inputTitle.length > 1) {
            data.postTitle = me.inputTitle
          }
          data.imageList = imageList
          data.height = me.coverData.height
          data.wight = me.coverData.width
          me.api.process({
            url: 'Post',
            data: data,
            success: function () {
              resolve('ok')
            },
            error: function (res) {
              reject(res)
            }
          })
      })
    },
    upFileThumbnail () { // 上传缩略图
      let me = this
      console.log('上传缩略图')
      me.newImageList = me.item.files
      return new Promise ((resolve, reject) => {
        if (me.item.files[0].type) { // 判断是否是
          var fd = new FormData()
          fd.append('1', this.item.files[0])
          me.api.file({
            url: 'FileThumbnail',
            data: fd,
            success: (res) => {
              me.newImageList[0] = res.split(',')[0] // 原图放进imageList中, 就是轮播图中
              me.thumbNail = res.split(',')[1] // 缩略图放进封面中
              resolve('ok')
            },
            error: function (res) {
              reject(res)
            },
            onProgress(res){
              console.log(res, 'onProgress')
            }
          })
        } else {
          me.thumbNail = me.item.files[0]
          resolve('ok')
        }
      })
    },
    getImgInfo (url) { // 获取缩略图尺寸
      let me = this
      return new Promise ((resolve) => {
        let img = new Image()
        img.src = me.thumbNail || url
        if (img.complete) {
          me.coverData.width = img.width
          me.coverData.height = img.height
          resolve({width: img.width, height: img.height})
        } else {
          img.onload = function () {
            me.coverData.width = img.width
            me.coverData.height = img.height
            console.log(img.width, img.height, 'img')
            resolve({width: img.width, height: img.height})
          }
        }
      })
    },
    upImage () { // 上传轮播图
      return new Promise ((resolve, reject) => {
        let me = this
        if (me.item.files.length > 1) {
          var fd = new FormData()
          let markIndex = []
          for (let i = 1; i < this.item.files.length; i++) {
            if (me.item.files[i].type) {
              markIndex.push(i)
              fd.append('1' + i, me.item.files[i])
            }
          }
          if (markIndex.length) {
            me.api.file({
              url: 'file',
              data: fd,
              success: (res) => {
                me.newUrl = res.split(',')
                markIndex.map((item, index)=>{
                  me.newImageList[item] = me.newUrl[index]
                })
                resolve('ok')
              },
              error: function (res) {
                reject(res)
              },
              onProgress(res){
                console.log(res, 'upImage')
              }
            })
          } else {
            resolve('ok')
          }
         
        } else {
          resolve('ok')
        }
      })
    },
    /*
    * 退出逻辑
    */
    goBack () {
      this.$router.back()
    },
    showBackConfirm () {
      this.$confirm({
        title: '检测到您有编辑内容',
        msg: '确认退出编辑？',
        type: 'confirm',
        yesBtnText: '确定',
        noBtnText: '取消'
      }).then(() => {
        this.isReallyBack = true
        if (this.path === 'postActivity') {
          this.upPostCurTab(1)
          this.$router.replace({name: this.path})
          return
        }
        this.$router.push({name: this.path})
      }).catch(() => {})
    },
    /*
    * 以下是focus和touch事件： 控制是否显示imageList
    */
    getTitleFocus () {
      this.isFocus = true
    },
    getTitleBlur () {
      this.isFocus = false
    },
    getFocus () {
      this.isFocus = true
    },
    getBlur () {
      this.isFocus = false
    },
    touch (event){ // 以下是touch事件
      event = event || window.event 
      switch (event.type) {
        case 'touchstart': 
          var touch = event.touches[0]
          this.startPosition = {
            x: touch.pageX,
            y: touch.pageY
          }
          break 
        case 'touchend':
          break
        case 'touchmove': 
          touch = event.touches[0]
          this.endPosition = {
            x: touch.pageX,
            y: touch.pageY
          }
          this.deltaY = this.endPosition.y - this.startPosition.y

          break
      }
    }, 
    touchstart (e) {
      if (!this.isFocus) { // 不是focus就不监听了
        return
      }
      this.touch(e)
    },
    touchmove (e) {
      this.touch(e)
    },
    touchend (e ){
      this.touch(e)
    }
  }
}
</script>

<style lang="less" scope>
  .saveDraft{
    position: fixed;
    height: 13vw;
    line-height: 13vw;
    top: 0;
    right: 2vw;
    font-size: 3.6vw;
    color: var(--lGray);
    z-index: 1001;
  }
  .contentCount{
    position:relative;
    .allCount{
      position:absolute;
      height:6vw;
      top:0;
      right:-4.5vw;
      bottom:0;
      margin:auto 0;
      color: #b2b2b2;
      font-size: 3.7vw;
    }
  }
  .fixedHead{
    height:13.34vw;
    width:100%;
    position:fixed;
    top:0;
    left:0;
    z-index:1000;
    background:white;
    span:nth-child(1) {
      position:absolute;
      left:7.5vw;
      font-size:4.7vw;
      width:15vw;
      height:13.34vw;
      top:0;
      line-height:13.6vw;
      .activityNotice{
        font-size:4.5vw;
        font-weight: bold;
      }
    }
    span:nth-child(2) {
      display:inline-block;
      width:100%;
      height:12vw;
      line-height:14vw;
      text-align: center;
      font-size: 4.63vw;
      // color: #666;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .postMain{
    width:100%;
    .postImageWrap{
      overflow: hidden;
      height:0;
    }
    .postTitle{
      width:100%;
      height:10vw;
      padding-left:4vw;
      box-sizing: border-box;
      position:relative;
      .postInputTitle{
        width:80vw;
        height:10vw;
        border:none;
        outline: none;
        // font-size:3.7vw;
        caret-color:rgb(255, 39, 66);
        background:transparent;
      }
      .titleCount{
        position:absolute;
        top:0;
        right:4vw;
        height:10vw;
        line-height:10vw;
        color: #b2b2b2;
        font-size:3.7vw;
        font-weight: 400;
      }
    }
  }
  .post{
    display:flex;
    justify-content: center;
    margin-top:10vw;
    .postBtn{
      width: 87.78vw;
      height: 14vw;
      line-height: 14vw;
      text-align: center;
      border-radius: 7vw;
      background: #ff2742;
      color: #fff;
      font-size: 5vw;
      letter-spacing: 2px;
      border:none;
      outline: none;
    }
  }
  .form_primary{
    .weui-cells:after{
      // border:2px solid pink;
      left:3vw;
      right:3vw;
    }
    .weui-cells_form:after{
      left:3vw;
      right:4vw;
    }
    .weui-panel:after{
      left:3vw;
      right:3vw;
    }
    .weui-cells_form:before{
      left:4vw;
      right:4vw;
    }
    .wrap{
      margin-bottom:3vw;
    }
    .userTopic{
      font-size: 3.7vw;
      color: #666;
      width:96%;
      // height:40vw;
      .postInputContent{
        width:100%;
        height:30vw;
        resize:none;
        caret-color:rgb(255, 39, 66);
        border:none;
        outline: none;
        font-size:4.2vw;
        background:transparent;
      }
      .moreHeight{
        height:70vw;
      }
    }
    .cutting{
      display: block;
      width:93%;
      height:3vw;
      margin:auto;
      border-bottom:0.1vw solid rgb(234,234,234);
    }
    .topicList{
      margin-top:-0.5vw;
      padding-top: 2vw !important;
    }
  }
  .moreTopic{
    width:42vw;
    height:7vw;
    background-color: rgb(245, 245, 245);
    border-radius:3vw;
    position:relative;
    text-align: center;
    line-height:7vw;
    padding-left: 3vw;
  }
  .hasSelect {
    color:#4b8bdb;
  }
</style>
