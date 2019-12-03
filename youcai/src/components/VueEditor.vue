<template>
  <transition name="toLeft">
    <div class="jeft-editor"
         v-show="show">
      <transition name='toDown'>
        <div v-show='leadingModelShow'
             class="leadingInModel">
          <textarea v-model="leadingText"
                    class="leadingTextarea"
                    name=""
                    id=""
                    cols="30"
                    rows="10"></textarea>
          <div class="leadingBtn">
            <div class="cancel">
              <i @click="setLeadingModel(false)">取消</i></div>
            <div class="confirm">
              <i @click="leadingIn">确定</i></div>
          </div>
        </div>
      </transition>
      <isLoading v-show="upLoading"></isLoading>
      <div class="tabNav">
        <i class="iconWanwan iconWfanhui activityNotice"
           @click="hideEditor"></i>
        <p :class="topicId?'topicTitle':''"
           v-if="topicId">
          <span class="titleStyle">{{EditorTitle}}</span>
        </p>
        <p :class="topicId?'topicTitle':''"
           v-else>
        </p>
        <span v-if="topicId"
              class="iconWanwan saveDrafts"
              @click="doneEditor('saveDrafts')">
          <i>存草稿</i>
        </span>
        <!-- <span v-if="$store.state.isZijiren" class="iconWanwan leadingIn" @click="setLeadingModel(true)">
          <i>导入</i>
        </span> -->
        <span class="iconWanwan savePost"
              @click="doneEditor('post')">
          <i>{{postName}}</i>
        </span>
      </div>
      <div class="jeft-editor-content"
           ref="JEditorContent"
           @focus="newE"
           @input="listenE"
           v-paste:JEditorContent="paste"
           contenteditable="true"></div>
      <div class="jeft-editor-actions"
           ref="jeftEditorActions">
        <ul class="jeft-editor-tabs">
          <li class="iconWanwan iconWziti"
              @click="setTabShow('textTabsShow')"></li>
          <li class="iconWanwan iconWquanjuduiqi"
              @click="setTabShow('layoutTabsShow')"></li>
          <li class="iconWanwan iconWtupian upImageWrap">
            <input @change="upImage"
                   class="upImage"
                   type="file"
                   accept="image/*"
                   name="upImage"
                   id="upImage"
                   multiple="false" />
          </li>
          <li :class="isB?'iconWanwan iconWbold isCur':'iconWanwan iconWbold'"
              @click="bold"></li>
          <li :class="isI?'iconWanwan iconWzitixieti isCur':'iconWanwan iconWzitixieti'"
              @click="italic"></li>
          <!-- <li class='iconWanwan iconWunderline' @click='underLine'></li> -->
        </ul>
        <div ref="textTabsShow"
             class="setTextTabs"
             v-show="curTabs === 'textTabsShow'">
          <div class="setTextSize">
            <p>字号选择</p>
            <ul>
              <li @click="setTextSize(index)"
                  :class="curTextSizeIndex===index? 'selectedText': ''"
                  v-for="(item, index) in textSets.textSize"
                  :key="index">{{item.text}}</li>
            </ul>
          </div>
          <div class="setTextColor">
            <p>颜色选择</p>
            <ul>
              <li @click="setTextColor(index)"
                  :class="curTextColorIndex===index? 'selectedColor': ''"
                  v-for="(item, index) in textSets.colors"
                  :key="index"
                  :style="{color: item}"></li>
            </ul>
          </div>
        </div>
        <div ref="layoutTabsShow"
             class="layoutTabs"
             v-show="curTabs === 'layoutTabsShow'">
          <div class="setTextLayout">
            <ul>
              <li :class="curLayout==='left'? 'curLayout': ''"
                  @click="left">
                <i class="iconWanwan iconWzuoduiqi1"></i>
                <span>居左对齐</span>
              </li>
              <li :class="curLayout==='center'? 'curLayout': ''"
                  @click="center">
                <i class="iconWanwan iconWjuzhongduiqi"></i>
                <span>居中对齐</span>
              </li>
              <li :class="curLayout==='right'? 'curLayout': ''"
                  @click="right">
                <i class="iconWanwan iconWyouduiqi1"></i>
                <span>居右对齐</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- <p read-write></p>
      <img src="http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/pcmoren_tian_org.png" alt="[舔屏]" data-w-e="1">-->
    </div>
  </transition>
</template>
<script>
const defaultHtml = '<p><br/></p>'
import isLoading from '@/components/requestState/isLoading'
import { resolve } from 'q'
// const colors = ['#333333', '#FF0000', '#FF7D00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF']
export default {
  components: {
    isLoading
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    EditorTitle: {
      type: String,
      default: '活动详情'
    },
    topicId: {
      type: String,
      default: ''
    },
    postName: {
      type: String,
      default: '发布'
    },
    detail: {
      type: String,
      default: ''
    }
  },
  watch: {
    detail(newV) {
      this.$refs.JEditorContent.innerHTML =
        this.detail.replace(/&lt;/g, '<').replace(/&gt;/g, '>') || defaultHtml
      return newV
    }
  },
  data() {
    return {
      leadingModelShow: false, // 导入框的显隐
      leadingText: '', // 导入的text
      hasImporpImg: false, // 是否有非法图片
      curNode: null,
      textSets: {
        textSize: [
          { text: '标准', value: '3.8vw', size: 4 },
          { text: '中', value: '4.8vw', size: 5 },
          { text: '大', value: '6vw', size: 6 }
        ],
        colors: [
          '#333333',
          '#999999',
          '#FF0000',
          '#FF7D00',
          '#FFFF00',
          '#00FF00',
          '#00FFFF',
          '#0000FF',
          '#FF00FF'
        ]
      },
      curTextSizeIndex: 0,
      curTextColorIndex: 0,
      lastRange: null,
      curTabs: null,
      curLayout: 'left',
      isI: false,
      isB: false,
      doneData: '',
      doneText: '',
      files: [],
      imagesUrl: [],
      upLoading: false
    }
  },
  created() {
    window.isInAndroid && window.WanAndroid.imgCropType(0, 1)
  },
  mounted() {
    // 重置图片尺寸类型， 方图/竖图
    window.isInAndroid && window.WanAndroid.imgCropType(0, 1)
    // console.log(this.$el, 88)
    let me = this
    // this.$refs.JEditorContent.innerHTML = this.detail || defaultHtml
    document.addEventListener('selectionchange', function() {
      me.getCursor(self)
    })
    if (me.topicId) {
      me.testIsHaveDrafts()
    }
  },
  directives: {
    paste: {
      componentUpdated(el, binding, vnode, oldVnode) {
        el.addEventListener('paste', event => {
          binding.value(event)
        })
      }
    }
  },
  methods: {
    setLeadingModel (data) {
      this.leadingModelShow = data
    },
    leadingIn (e) {
      this.$refs.JEditorContent.innerHTML = `${this.$refs.JEditorContent.innerHTML}${this.leadingText}`
      this.leadingText = ''
      this.setLeadingModel(false)
    },
    // 粘贴事件
    paste(e) {
      let me = this
      if (!(e.clipboardData && e.clipboardData.items)) {
        return
      }
      for (var i = 0, len = e.clipboardData.items.length; i < len; i++) {
        var item = e.clipboardData.items[i]
        if (item.kind === 'string') {
          item.getAsString(function(str) {
            console.log(str, 'str')
            // 找出非法图片 
            let hasImporperImg = me.getImporperImg(str)
            // 替换非法图片
            hasImporperImg && me.filterImage()
          })
        } else if (item.kind === 'file') {
          // var f = item.getAsFile()
          // parseFile(f, 800, function(base64) {
          //   $.post('/manager/uploadImg', { imgStr: base64 }, function(
          //     data
          //   ) {
          //     $('#summernote').summernote('editor.insertImage', data.msg)
          //   })
          // })
          console.log(f, 'f')
        }
      }
    },
    // 找出|检测 非本站网址图片 
    getImporperImg (str) {
      let me = this
        // 匹配秀米的图片地址
        // me.imageList = str.match(/(http(s?):\/\/.*?\.xiumi\.us\/.*?(png|jpg|jpeg|gif))/g)
      // 匹配所有的图片
      me.allImg = str.match(/(http(s?):\/\/.*?(png|jpg|jpeg|gif))/g)
      
      // 过滤出不在我们服务器的图片 -> 进行压缩替换
      console.log(me.allImg)
      if (me.allImg && me.allImg.length) { // 有图片 过滤
        me.imageList = []
        me.allImg.map((item, index) => {
          // 过滤掉 网址 + 图片 eg: http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 http://img.xiumi.us/xmi/ua/24yQx/i/a9ae0468c43da2234ad6b5ba394a8391-sz_1727.png
          if (item.lastIndexOf('http') > 0) {
            item = item.slice(item.lastIndexOf('http'), item.length)
          }
          if (item.indexOf('http://192.168.1.101:8888') < 0 && item.indexOf('szwanwan') < 0 ) {
            me.imageList.push(item)
          }
        })
      } else { // 无图片就不走替换程序
        me.imageList = me.allImg
      }
      // 下面是合格的网址 正式 | 测试
      // http://file.szwanwan.com:8888/group1/M00/01/22/rBpkyF0_qraAa74lAAeLSlApX7k011.jpg?x-oss-process=style/xmorient
      // http://192.168.1.102:8888/group1/M00/00/12/wKgBZl0_pTGAQFRJACdma90JPzw963.jpg?x-oss-process=style/xmorient
      return me.imageList && me.imageList.length
    },
    // 将非本站网址进行替换
    filterImage() {
      for (let i = 0; i < this.imageList.length; i++) {  
        // url -> base64 -> file -> post/res -> url
        this.replaceImage(this.imageList[i])
      }
    },
    // 将非本站网址进行替换 url -> base64 -> file -> post/res -> url
    async replaceImage (url) {
      let filename = url.slice(url.lastIndexOf('.') + 1, url.length)
      // url -> base64
      let base64 = await this.download(url)
      // base64 -> file
      let file = await this.base64ToFile(base64, filename)
      // file 请求压缩图片 替换网址
      this.postImg(file, url)
    },
    // url -> base64
    download (src) {
      let me = this
      return new Promise ((resolve) => {
        let type = src.slice(src.lastIndexOf('.') + 1, src.length)
        var img = document.createElement('img')
        img.setAttribute('crossOrigin', 'anonymous')
        img.onload = function(e) {
            let canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            var context = canvas.getContext('2d')
            context.drawImage(img, 0, 0, img.width, img.height)
            document.body.append(canvas)
            let base64 = canvas.toDataURL('image/' + type)
            resolve(base64)
        }
        img.src = src
      })
    },
    // base64 => file
    base64ToFile (dataurl, filename, src) {
      return new Promise ((resolve) => {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
        while(n--){
            u8arr[n] = bstr.charCodeAt(n)
        }
        let file = new File([u8arr], filename, {type:mime})
        resolve(file)
      })
    },
    // 替换图片
    postImg (data, src) {
      let me = this
      var fd = new FormData()
      fd.append('1', data)
      
      me.api.file({
        url: 'file',
        data: fd,
        success: res => {
          let img = new Image()
          if (img.complete) {
            me.$refs.JEditorContent.innerHTML = me.$refs.JEditorContent.innerHTML.replace(src, res)
            me.hasImporpImg = me.getImporperImg(me.$refs.JEditorContent.innerHTML)
          } else {
            img.onload = function(e) {
              me.$refs.JEditorContent.innerHTML = me.$refs.JEditorContent.innerHTML.replace(src, res)
              me.hasImporpImg = me.getImporperImg(me.$refs.JEditorContent.innerHTML)
            }
          }
          img.src = res
        }
      })
    },
    // 隐藏Editor
    hideEditor() {
      this.$emit('hideEditor')
    },
    // 提交 / 保存  xss -> 检测有没有内容 -> 提交
    doneEditor(type) {
      // 保存
      let options = {
        whiteList: {
          a: ['href', 'title', 'target'],
          p: ['style'],
          div: ['style'],
          span: ['style'],
          img: ['src', 'style'],
          strong: [],
          b: [],
          i: [],
          style: ['type']
        }
      }
      this.doneText = window.filterXSS(this.$refs.JEditorContent.innerHTML) // 没有内容不上传/不保存
      this.doneData = window.filterXSS(
        this.$refs.JEditorContent.innerHTML,
        options
      ) // 根据白名单过滤，此处进行 xss 攻击过滤
      let doneImages = Array.prototype.slice.call(
        this.$refs.JEditorContent.querySelectorAll('img')
      )
      // this.doneData = this.doneData.replace(/section/g, 'div')
      console.log(this.doneData)
      this.doneImages = doneImages.map((item, index) => {
        return item.src
      })
      // this.doneImages = this.$refs.JEditorContent.querySelectorAll('img').map((item) => {
      //   return item.getAttribute('src')
      // })
      // eslint-disable-next-line
      let deleteItem = this.imagesUrl.filter(
        key => !this.doneImages.includes(key)
      )
      if (this.topicId) {
        // 回复话题
        let doneText = 'tupain'
        if (this.doneText.indexOf('img') < 0) {
          // 无图片检测与没有文字
          doneText = this.doneText
            .replace(/<[^>]+>/g, '')
            .replace(/[&nbsp;]/g, '')
            .trim()
        }
        if (doneText) {
          if (type === 'post') {
            this.postTopicAnswer()
          } else {
            this.saveTopicAnswer()
          }
        } else {
          this.$toast('内容不能为空')
          // eslint-disable-next-line
          return
        }
      } else {
        let doneText = 'tupain'
        if (this.doneText.indexOf('img') < 0) {
          // 无图片检测与没有文字
          doneText = this.doneText
            .replace(/<[^>]+>/g, '')
            .replace(/[&nbsp;]/g, '')
            .trim()
        }
        // 活动
        if (doneText) {
          if (this.$store.state.isZijiren) {
            let hasImporperImg = this.getImporperImg(this.doneData)
            // console.log(hasImporperImg, 'hasImporperImg')
            if (!this.hasImporpImg && hasImporperImg) {
              this.$toast('还有部分图片未压缩，请等待')
              this.filterImage()
              return
            } else if (this.hasImporpImg) {
              this.$toast('还有部分图片未压缩，请等待')
              return
            } else {
              this.$toast('图片都已替换')
            }
          }
          this.$emit('hideEditor', this.doneData)
        } else {
          this.$toast('内容不能为空')
        }
      }
    },
    postTopicAnswer() {
      // 话题评论
      let me = this
      me.upLoading = true
      me.api.process({
        url: 'TopicAnswer',
        data: {
          topicId: me.topicId,
          content: me.doneData,
          imageList: me.doneImages
        },
        success: function(res) {
          me.$toast('评论成功')
          me.hideEditor()
        },
        complete: function() {
          me.upLoading = false
        }
      })
    },
    saveTopicAnswer() {
      // 保存话题草稿
      let me = this
      localStorage.setItem(me.topicId, me.doneData)
      this.$toast('保存草稿成功')
      me.hideEditor()
    },
    testIsHaveDrafts() {
      // 检测是否是草稿
      let me = this
      let content = localStorage.getItem(me.topicId)
      if (content) {
        this.$refs.JEditorContent.innerHTML = content
      }
    },
    setTabShow(str) {
      // 显示选项卡选项
      let el = this.$refs.jeftEditorActions
      this.$refs.JEditorContent.focus()
      if (this.curTabs === str) {
        this.curTabs = null
        el.style.transform = 'translate3d(0, 0, 0)'
        this.$refs.JEditorContent.style.paddingBottom = 0
        return
      }
      this.curTabs = str
      this.$nextTick(() => {
        let H = this.$refs[str].offsetHeight
        el.style.transform = 'translate3d(0,' + -H + 'px, 0)'
        this.$refs.JEditorContent.style.paddingBottom = H + 'px'
      })
    },
    // 上传图片
    upImage(e) {
      let me = this
      // var fileItem = e.target.files
      me.$toast('上传中')
      if (e.target.files[0].type.indexOf('image') >= 0) {
        for (let i = e.target.files.length - 1; i >= 0; i--) {
          let reader = new FileReader()
          let file = e.target.files[i]
          reader.onload = function(e) {
            me.upImg(file)
          }
          reader.readAsDataURL(file)
        }
      }
      e.target.value = ''
    },
    upFileThumbnailZijiRen(file) {
      // 自己人不压缩
      let me = this
      var fd = new FormData()
      fd.append('1', file)
      me.api.file({
        url: 'file',
        data: fd,
        success: res => {
          me.$toast('上传成功')
          let thumb = res
          me.files.push(file)
          me.imagesUrl.push(thumb)
          setTimeout(() => {
            document.execCommand('InsertImage', false, thumb)
          }, 30)
          me.$refs.JEditorContent.focus()
        }
      })
    },
    upImg(file) {
      // 用户的图片压缩
      let me = this
      var fd = new FormData()
      fd.append('1', file)
      let url = 'FileThumbnailOnly'
      console.log(file)
      // return
      if (file.type.indexOf('webp') || file.type.indexOf('gif')){
        url = 'file'
      }
      me.api.file({
        url: url,
        data: fd,
        success: res => {
          me.$toast('上传成功')
          // let thumb = '' + res.split(',')[1]
          let thumb = res
          me.files.push(file)
          me.imagesUrl.push(thumb)
          setTimeout(() => {
            document.execCommand('InsertImage', false, thumb)
            document.execCommand('insertHTML', false, '<br />') // 上传图片之后换行
          }, 30)
          me.$refs.JEditorContent.focus()
        }
      })
    },
    setTextSize(index) {
      // 设置文字大小
      this.curTextSizeIndex = index
      // this.curNode.style.fontSize = this.textSets.textSize[index].value
      document.execCommand(
        'fontSize',
        false,
        this.textSets.textSize[index].size
      )
      this.$refs.JEditorContent.focus()
      this.setTabShow(this.curTabs)
    },
    setTextColor(index) {
      // 设置文字颜色
      this.curTextColorIndex = index
      // this.curNode.style.color = this.textSets.colors[index]
      document.execCommand('ForeColor', false, this.textSets.colors[index])
      this.$refs.JEditorContent.focus()
      this.setTabShow(this.curTabs)
    },
    newE() {
      if (this.$refs.JEditorContent.innerHTML === '') {
        this.$refs.JEditorContent.innerHTML = defaultHtml
      }
    },
    listenE() {
      let item = this.$el.getElementsByTagName('p')
      let el = this.$el.getElementsByClassName('jeft-editor-content')[0]
      if (el.innerHTML === '' && el.component_num === 0) {
        el.placeholder.style.display = 'block'
      }
      if (!item || item.length === 0) {
        el.innerHTML = defaultHtml
      }
    },
    center() {
      // 居中 对齐
      this.curLayout = 'center'
      // this.curNode.style.textAlign = 'center'
      document.execCommand('justifycenter', false, null)
      this.$refs.JEditorContent.focus()
      this.setTabShow(this.curTabs)
    },
    left() {
      // 居左 对齐
      this.curLayout = 'left'
      // this.curNode.style.textAlign = 'left'
      document.execCommand('justifyleft', false, null)
      this.$refs.JEditorContent.focus()
      this.setTabShow(this.curTabs)
    },
    right() {
      // 居右 对齐
      this.curLayout = 'right'
      document.execCommand('justifyRight', false, null)
      this.$refs.JEditorContent.focus()
      this.setTabShow(this.curTabs)
    },
    bold() {
      // 设置为粗体
      this.isB = !this.isB
      if (document.queryCommandState('bold')) {
        // 兼容处理
        document.execCommand('bold', false, null)
        document.execCommand('insertHTML', false, '&#8203;')
      } else {
        document.execCommand('bold', false, null)
      }
      this.$refs.JEditorContent.focus()
      this.setTabShow(this.curTabs)
    },
    italic() {
      // 设置为斜体
      this.isI = !this.isI
      document.execCommand('italic', false, null)
      this.$refs.JEditorContent.focus()
      this.setTabShow(this.curTabs)
    },
    indent() {
      // 首行缩进2em
      this.curNode.style.textIndent = '2em'
      // document.execCommand('indent', false, null)
      this.$refs.JEditorContent.focus()
    },
    underLine() {
      // 下划线
      document.execCommand('underline', false, null)
    },
    getCursor(self) {
      // 获取鼠标所在的位置
      var sel = getSelection()
      if (!sel) {
        return
      }
      var node = sel.anchorNode
      var isIn = false
      while (node && node.nodeType !== node.DOCUMENT_NODE) {
        if (
          node.nodeName &&
          node.parentNode.className === 'jeft-editor-content'
        ) {
          this.curNode = node
          isIn = true
          break
        }
        if (node.nodeName && node.nodeName.toLowerCase() === 'p') {
          this.curNode = node
          isIn = true
          break
        }
        node = node.parentNode
        this.curNode = node
      }
      if (!isIn) return
      self.select = sel
      self.lastRange = sel.getRangeAt(0)
    }
  }
}
</script>
<style lang="less">
font[size='4'] {
  font-size: 4.4vw;
}
font[size='5'] {
  font-size: 5vw;
}
font[size='6'] {
  font-size: 6vw;
}
// leadingInModel
.leadingIn {
  position: absolute;
  top: 0;
  right: 18vw;
  height: 100%;
  z-index: 1000;
}
.leadingInModel {
  &.toDown-enter, &.toDown-leave-to{
    transform: translate3d(0, -100%, 0);
  }
  &.toDown-enter-active, &.toDown-leave-active{
    transition: all 0.35s ease;
  }
  position: fixed;
  z-index: 100000;
  top: 20vw;
  left: 5vw;
  width: 90vw;
  border: 1px solid #666;
  border-radius: 4vw;
  box-sizing: content-box;
  overflow: hidden;
  .leadingTextarea{
    display: block;
    width: 80vw;
    padding: 5vw;
    margin: 0 auto;
    min-height: 60vw;
    max-height: 100vw;
    border: none;
    outline: none;
    padding-bottom: 10vw;
    font-size: 4vw;
    color: #333;
    line-height: 4.6vw;
  }
  .leadingBtn{
    width: 80vw;
    margin: 0 auto;
    display: flex;
    height: 10vw;
    line-height: 10rpx;
    text-align: center;
    > div{
      flex: 1;
      > i{
        font-style: normal;
        display:inline-block;
        width: 100%;
        height: 100%;
      }
    }
  }
}

// leadingInModel end
.isCur {
  color: #ff2742;
}
.upImageWrap {
  position: relative;
  .upImage {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    opacity: 0;
    z-index: 1;
  }
}
.jeft-editor:empty::before {
  content: attr('尽情输入内容，支持图文商品混排哦');
  font-size: 14px;
  color: #ccc;
  line-height: 21px;
  padding-top: 10px;
}
.jeft-editor {
  position: fixed;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  background: #fff;
  z-index: 10000;
  padding-top: 12vw;
  box-sizing: border-box;
  .tabNav {
    p{
      max-width: 80vw;
    }
    .iconWleftBack {
      display: inline-block;
      margin-right: 3vw;
    }
    .iconWanwan {
      font-size: 4vw;
      font-weight: bold;
    }
    .activityNotice {
      color: #666;
    }
    .topicTitle {
      font-size: var(--nText);
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .titleStyle{
      display: inline-block;
      width:60vw;
      margin-left:4vw;
      font-size: var(--nText);
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .saveDrafts,
    .savePost,
    .leadingIn {
      width: 15vw;
      text-align: center;
      i {
        font-size: var(--nText);
        display: inline-block;
        width: 12vw;
        margin-top: 2vw;
        height: 8vw;
        line-height: 8vw;
        font-style: normal;
      }
    }
    .savePost,
    .leadingIn {
      i {
        border-radius: 4vw;
        background: var(--mRed);
        color: #fff;
      }
    }
  }
  &.toLeft-enter-active,
  &.toLeft-leave-active {
    transition: all 0.5s linear;
  }
  &.toLeft-enter,
  &.toLeft-leave-to {
    transform: translate3d(100%, 0, 0);
  }
  .iconWanwan {
    font-size: var(--title);
  }
  .jeft-editor-content {
    // position: absolute;
    font-size: 4.4vw;
    letter-spacing: 0.33vw;
    width: 100vw;
    height: calc(100vh - 20vw);
    // left:0;
    // top: 12vw;
    // bottom: 8vw;
    padding: 0 2.5vw;
    outline: none;
    -webkit-user-select: text;
    overflow-y: scroll;
    caret-color: #ff2742;
    * {
      max-width: 100% !important;
    }
  }
  .jeft-editor-tabs {
    margin-left: 4.5vw;
    height: 8vw;
    line-height: 8vw;
    display: flex;
    // text-align: center;
    li {
      flex: 1;
      margin-right: 3vw;
    }
  }
}
.jeft-editor-actions {
  background: #fff;
  .setTextTabs {
    padding-top: 15px;
    p {
      padding-left: 4.5vw;
    }
    .setTextSize {
      ul {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 2.5vw 0;
        li {
          flex: 1;
          height: 8vw;
          line-height: 8vw;
          margin: 0 4.5vw;
          text-align: center;
          border: 1px solid #eee;
          font-size: 4vw;
          border-radius: 1vw;
        }
        .selectedText {
          background: #ff2742;
          color: #fff;
        }
      }
    }
    .setTextColor {
      ul {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 2vw;
        li {
          position: relative;
          width: 8vw;
          height: 8vw;
          margin: 0 1vw;
          border-radius: 50%;
          background-color: currentColor;
          // z-index: 1;
        }
        .selectedColor {
          &::after {
            position: absolute;
            content: '';
            width: 8vw;
            height: 8vw;
            padding: 1px;
            background: #fff;
            margin-top: -2px;
            margin-left: -2px;
            border: 1px solid currentColor;
            border-radius: 50%;
            z-index: -1;
          }
        }
      }
    }
  }
  .layoutTabs {
    .setTextLayout {
      ul {
        display: flex;
        padding: 20px 0;
        li {
          flex: 1;
          text-align: center;
          font-size: var(--title);
          i {
            display: block;
          }
          span {
            display: block;
          }
        }
        .curLayout {
          color: #ff2742;
        }
      }
    }
  }
}
</style>
