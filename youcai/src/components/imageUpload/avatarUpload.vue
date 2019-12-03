<template>
  <div class="weui-cell">
    <div class="weui-cell__bd">
      <div class="weui-uploader">
        <div class="weui-uploader__hd">
          <p class="weui-uploader__title">{{isUploadVideo?'视频':'图片'}}上传</p>
          <div class="weui-uploader__info">{{fileCount}}/{{maxfileCount}}</div>
        </div>
        <div class="weui-uploader__bd">
          <ul class="weui-uploader__files">
            <li class="weui-uploader__file" :class="{'weui-uploader__file is_queued weui-uploader__file_status': fileItem.upload.isUploading }" v-for="fileItem in fileItems" :key="fileItem.Id" @click="showGallery(fileItem)" :style="{backgroundImage: 'url(' + getImagePath(fileItem.filePreivew || fileItem.filePath) + ')'}">
              <div class="weui-uploader__file-content" v-if="fileItem.upload.isUploading">{{fileItem.upload.percent}}%</div>
              <input name="picture" type="hidden" :value="fileItem.filePath" v-else />
            </li>
          </ul>
          <div class="weui-uploader__input-box" v-show="!isUploadVideo">
            <a href="javascript:;" :id="uploaderId">
              <input class="weui-uploader__input" type="file" accept="image/*" multiple="multiple">
            </a>
          </div>
          <div class="weui-uploader__input-box" v-show="isUploadVideo && fileItems.length<=0">
            <ImageVideoUpload @VideoFramesBegin="VideoFramesBegin" @VideoFramesProgress="VideoFramesProgress" @VideoFramesDone="VideoFramesDone" v-show="showVideoUploader" />
          </div>
        </div>
      </div>
      <ImageEditor v-if="editorShow" :imageList="imageList" @hideEditor="editorShow=false" @addImage="addImage" />
    </div>
  </div>
</template>

<script>
import ImageEditor from './ImageEditor'
import ImageVideoUpload from './ImageVideoUpload'
export default {
  components: {
    ImageVideoUpload,
    ImageEditor
  },
  data () {
    return {
      editorShow: false,
      editorSrc: '',
      showVideoUploader: true,
      fileItems: [{ fileId: '', filePath: '', upload: { isUploading: false, percent: 0 } }],
      imageList: [],
      uploadId: 10000
    }
  },
  props: {
    uploaderId: {
      type: String,
      require: false,
      default: 'uploader'
    },
    maxfileCount: {
      type: Number,
      require: false,
      default: 9
    },
    images: {
      type: String,
      require: false
    },
    isUploadVideo: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  // propas: ['uploaderId', 'maxfileCount', 'images', 'isUploadVideo'],
  beforeMount () {
    if (this.fileItems && this.fileItems.length >= 1) {
      this.fileItems.splice(0, this.fileItems.length)
    }
  },
  computed: {
    fileCount () {
      return this.fileItems.length
    }
  },
  watch: {
    formLoading: function (isLoading) {
      let me = this
      me.$msg.updateLoading(isLoading)
    },
    images (val) {
      let me = this
      if (!val || val.length <= 0) {
        return
      }
      let pics = val.indexOf(',') === -1 ? ['' + val] : val.split(',')
      for (let i = 0; i < pics.length; i++) {
        const pic = pics[i]
        const fileItem = {
          fileId: 1000 + i,
          filePath: pic,
          upload: {
            isUploading: false,
            percent: 100
          }
        }
        me.fileItems.push(fileItem)
      }
    }
  },
  mounted () {
    let me = this
    let apiUrl = me.config.apiUrl.replace('{apiName}', 'Upload').replace('{methodName}', 'ImageLogin')
    // eslint-disable-next-line
    weui.uploader('#' + me.uploaderId, {
      url: apiUrl,
      auto: true,
      type: 'file',
      fileVal: 'fileVal',
      compress: false,
      compress_def: {
        width: 1024,
        height: 1024,
        quality: 0.7
      },
      onBeforeQueued: function (files) {
        if (['image/jpg', 'image/jpeg', 'image/png', 'image/gif'].indexOf(this.type) < 0) {
          me.$msg.showError('请上传图片')
          return false
        }
        if (this.size > 8 * 1024 * 1024) {
          me.$msg.showError('请上传不超过4M的图片')
          return false
        }
        if (files.length > me.maxfileCount) {
          me.$msg.showError('上传图片数量超出限制，请重新选择')
          return false
        }
        if (files.length + me.fileCount > me.maxfileCount) {
          me.$msg.showError('上传图片数量超出限制，请重新选择')
          return false
        }
        if (me.editorShow) {
          return false
        }
        let imageList = []
        for (let i = 0; i < files.length; i++) {
          const image = files[i]
          imageList.push(image)
        }
        me.imageList = imageList
        me.editorShow = true
        return false
        // let file = this
        // let reader = new FileReader()
        // reader.onload = function (e) {
        //   let fileItem = {
        //     fileId: file.id,
        //     filePath: e.target.result,
        //     upload: {
        //       isUploading: true,
        //       percent: 0
        //     }
        //   }
        //   me.fileItems.push(fileItem)
        //   me.showVideoUploader = false
        // }
        // reader.readAsDataURL(file)
      },
      onBeforeSend: function (data, headers) {
        headers['Authorization'] = localStorage.getItem('Headers_Authorization')
        me.$msg.showLoading('上传中')
      },
      onSuccess: function (res) {
        me.$msg.hideLoading()
        if (!res.success) {
          me.$msg.showError(res.msg)
          return
        }
        let fileItem = me.fileItems.find(t => t.fileId === this.id)
        fileItem.filePath = res.value
        fileItem.upload = {
          isUploading: false,
          percent: 100
        }
      },
      onProgress: function (percent) {
        let fileItem = me.fileItems.find(t => t.fileId === this.id)
        fileItem.upload = {
          isUploading: percent < 100,
          percent: percent
        }
      },
      onError: function (err) {
        me.$msg.hideLoading()
        me.$msg.showError('上传失败')
        console.log(err)
      }
    })
  },
  methods: {
    VideoFramesBegin (pic) {
      this.showVideoUploader = false
      const fileItem = {
        fileId: 10000,
        filePath: pic,
        upload: {
          isUploading: true,
          percent: 0
        }
      }
      this.fileItems.unshift(fileItem)
    },
    VideoFramesProgress (percent) {
      let isUploading = true // percent < 100
      let fileItem = this.fileItems.find(t => t.fileId === 10000)
      fileItem.upload = {
        isUploading: isUploading,
        percent: percent <= 100 ? percent : 100
      }
    },
    VideoFramesDone (url) {
      let fileItem = this.fileItems.find(t => t.fileId === 10000)
      fileItem.filePath = url
      fileItem.upload = {
        isUploading: false,
        percent: 100
      }
    },
    showGallery (fileItem) {
      if (this.isUploadVideo) {
        return
      }
      let me = this
      // eslint-disable-next-line
      let gallery = weui.gallery(me.getImagePath(fileItem.filePath), {
        onDelete: function () {
          let index = me.fileItems.findIndex(t => t.fileId === fileItem.fileId)
          if (index !== -1) {
            me.fileItems.splice(index, 1)
          }
          gallery.hide()
        }
      })
    },
    getImagePath (path) {
      if (path.indexOf('/') === 0) {
        return this.config.imageOrigin + path
      }
      if (path.indexOf('') !== -1) {
      }
      return path
    },
    addImage (imageData) {
      let me = this
      let fileItem = {
        fileId: me.uploadId++,
        filePath: imageData.imageData,
        filePreivew: imageData.previewData,
        upload: {
          isUploading: false,
          percent: 100
        }
      }
      me.fileItems.push(fileItem)
      // me.beginUpload(fileItem)
      // console.log(imageData)
      // let reader = new FileReader()
      // reader.onload = function (e) {
      //   console.log(e)
      //   console.log(this)
      //   let fileId = Math.max(me.fileItems.)
      // }
      // reader.readAsDataURL(imageData)
    }
  }
}
</script>
