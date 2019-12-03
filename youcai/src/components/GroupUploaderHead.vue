<template>
  <div class="weui-cell">
      <div class="weui-cell__bd">
          <div class="weui-uploader">
              <div class="weui-uploader__hd">
                <div class="weui-uploader__info">{{fileCount}}/{{maxfileCount}}</div>
              </div>
              <div class="weui-uploader__bd">
                <ul class="weui-uploader__files">
                  <li class="weui-uploader__file" v-for="file in files" :key="file" @click="showGallery" :style="{backgroundImage: 'url(' + config.imageOrigin + file + ')'}" :data-file="file">
                    <input name="picture" type="hidden" :value="file" />
                  </li>
                </ul>
                <div class="weui-uploader__input-box weui-up-grouphead">
                  <a href="javascript:;" :id="uploaderId">
                    <input class="weui-uploader__input" type="file" accept="image/*" multiple="multiple">
                  </a>
                </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      filesa: []
    }
  },
  props: ['uploaderId', 'maxfileCount', 'images'],
  computed: {
    fileCount () {
      return this.files.length
    },
    files () {
      let me = this
      if (!me.images || me.images.length <= 0) {
        return []
      }
      return me.images.indexOf(',') === -1 ? ['' + me.images] : me.images.split(',')
    }
  },
  watch: {
    formLoading: function (isLoading) {
      let me = this
      me.$msg.updateLoading(isLoading)
    }
  },
  updated () {
    let me = this
    if (!me.images || me.images.length <= 0) {
      return
    }
    let items = me.images.indexOf(',') === -1 ? ['' + me.images] : me.images.split(',')
    for (let i = 1; i <= items.length; i++) {
      let item = items[i - 1]
      if (me.ArrayHelper.findIndex(me.files, item) !== -1) {
        return
      }
      me.files.push(item)
    }
    console.log(me.files)
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
      compress: {
        width: 2048,
        height: 2048,
        quality: 0.8
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
        if (files.length + me.files.length > me.maxfileCount) {
          me.$msg.showError('上传图片数量超出限制，请重新选择')
          return false
        }
        let file = this
        let reader = new FileReader()
        reader.onload = function (e) {
          let fileItem = document.createElement('li')
          fileItem.setAttribute('fileId', file.id)
          fileItem.setAttribute('class', 'weui-uploader__file is_queued')
          fileItem.style.backgroundImage = 'url(' + e.target.result + ')'
          let fileContainer = me.$el.querySelector('.weui-uploader__files')
          fileContainer.appendChild(fileItem)
        }
        reader.readAsDataURL(file)
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
        let picture = res.value
        me.showImage(picture, this.id)
      },
      onProgress: function (percent) {
        let fileContainer = me.$el.querySelector('.weui-uploader__files')
        let fileItem = fileContainer.querySelector('[fileId="' + this.id + '"]')
        if (percent < 100) {
          fileItem.classList.add('weui-uploader__file_status')
          fileItem.innerHTML = '<div class="weui-uploader__file-content">' + percent + '%</div>'
        } else {
          fileItem.classList.remove('weui-uploader__file_status')
          fileItem.innerHTML = ''
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
    showGallery (e) {
      console.log(e)
      console.log(this)
      let me = this
      // document.getElementById()
      let image = e.target.dataset.file
      // .querySelector('input').value
      console.log(image)
      // eslint-disable-next-line
      let gallery = weui.gallery(me.config.imageOrigin + image, {
        onDelete: function () {
          console.log('onDelete')
          let index = me.ArrayHelper.findIndex(me.files, image)
          console.log(index)
          if (index !== -1) {
            me.files.splice(index, 1)
          }
          gallery.hide()
        }
      })
    },
    showImage (picture, fileId) {
      var me = this
      if (fileId && fileId >= 1) {
        return
      }
      me.fileShows.push({
        Id: fileId,
        Picture: picture
      })
      // let pictureUrl = me.config.imageOrigin + picture
      // let fileContainer = me.$el.querySelector('.weui-uploader__files')
      // let fileItem = null
      // if (fileId && fileId >= 1) {
      //   fileItem = fileContainer.querySelector('[fileId="' + fileId + '"]')
      //   fileItem.classList.remove('is_queued')
      // } else {
      //   fileItem = document.createElement('li')
      //   fileItem.setAttribute('fileId', fileId)
      //   fileItem.setAttribute('class', 'weui-uploader__file')
      //   fileContainer.appendChild(fileItem)
      // }
      // fileItem.style.backgroundImage = 'url(' + pictureUrl + ')'
      // let hidden = document.createElement('input')
      // hidden.setAttribute('name', 'picture')
      // hidden.setAttribute('type', 'hidden')
      // hidden.setAttribute('value', picture)
      // fileItem.appendChild(hidden)
      // me.files.push(picture)
      // fileItem.addEventListener('click', function (e) {
      //   // eslint-disable-next-line
      //   let gallery = weui.gallery (pictureUrl, {
      //     onDelete: function () {
      //       fileContainer.removeChild(fileItem)
      //       let fileIndex = me.files.findIndex(t => t === picture)
      //       me.files.splice(fileIndex, 1)
      //       gallery.hide()
      //     }
      //   })
      // })
    }
  }
}
</script>
