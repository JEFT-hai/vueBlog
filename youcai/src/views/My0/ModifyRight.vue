<template>
  <div class="rightPage">
    <p>基本信息&nbsp;(带<i class="fontStyle">*</i>为必填项)</p>
    <ul class="rightMessage">
      <li>
        <span>姓名&nbsp;&nbsp;<i class="fontStyle">*</i></span>
        <input type="text"
               placeholder="请输入你的姓名"
               maxLength='20'
               v-model="item.Name">
      </li>
      <li>
        <span>联系方式&nbsp;&nbsp;<i class="fontStyle">*</i></span>
        <input class="phoneInput"
               name="phone"
               type="number"
               placeholder="请输入您的联系电话"
               v-model="item.Phone"
               oninput="if(value.length>11)value=value.slice(0,12)" />
      </li>
      <li>
        <span>身份证号</span>
        <input class="phoneInput"
               name="phone"
               type="number"
               placeholder="请输入您的身份证号码"
               v-model="item.Id"
               oninput="if(value.length>11)value=value.slice(0,18)" />
      </li>
      <li class="special">
        <span class="detail">认证说明&nbsp;&nbsp;<i class="fontStyle">*</i></span>
        <textarea rows="3"
                  name="detail"
                  maxLength='30'
                  class="inputContent"
                  v-model="item.Detail"></textarea>
        <div class="count">{{itemDetailLength}}/30</div>
      </li>
      <li class="specialTwo">
        <span>相关证件或其他可证明材料&nbsp;(图片)</span>
        <imageList @upFiles="getFiles"
                   :canUploadVideo='canUploadVideo'
                   :imagesList="imageUlrs"
                   @allImagesFiles="allImagesFiles"
                   @deleteList="deleteList"
                   :maxLength=5></imageList>
      </li>
    </ul>
    <div class="userSubmitSave">
      <button class="mySave"
              @click="postActive">保存</button>
    </div>
  </div>
</template>

<script>
import imageList from '@/components/upLoader/changeImageUploader'
import {mapState} from 'vuex'
export default {
   data () {
       return {
            groupImageList: [], // 图片列表
            isOneCreate: true, // 表示是第一次提交
            formLoading: false,
            item: {
                Detail: '',
                filesResults: [],
                userAuthenticationId: ''
            },
            showMoreQuest: false,
            questDes: null,
            clickIndex: '',
            animateClassName: '',
            feedbackData: [],
            files: null,
            newUrl: null,
            isShowHeight: false,
            canUploadVideo: false,
            allImages: [],
            deleteImages: [],
       }
   },
   computed: {
      ...mapState(['user']),
      itemDetailLength () {
        return this.item.Detail.length
      },
      imageUlrs() {
        let imageUlrs = []
        this.groupImageList.map((item) => {
          imageUlrs.push(item)
        })
        return imageUlrs
      },
    },
   components: {
      imageList
   },
   mounted () {
     this.getRightMsg()
   },
   methods: {
    getFiles(data) {
      this.$set(this.item, 'files', data)
    },
    allImagesFiles(data) {
      this.allImages = data
    },
    deleteList(data) {
      this.deleteImages = data
    },
    /**
     * getRightMsg 得到认证信息
     */
    getRightMsg () {
      let me = this
      me.api.get({
        url: 'UserAuthentication',
        success: function (res) {
          me.item.Detail = res.debugContent
          me.item.Phone = res.phone
          me.item.Name = res.userName
          me.item.Id = res.idCardNo
          me.groupImageList = res.images
          me.item.userAuthenticationId = res.userAuthenticationId
        }
      })
    },
    upFiles (data) {
      this.files = data
    },
    /**
     * saveFeed提交
     */
    saveFeed () {
      if (!this.isOneCreate) {
        this.$toast('请勿重复提交',1000)
        return
      }
      if (!this.item.Name) {
        this.$toast('请输入你的姓名',1000)
        return
      }
      let rightPhone = /^[1][3,4,5,7,8][0-9]{9}$/
      var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/
      var PhoneFour = /^400[0-9]{7}/
      var PhoneEgiht = /^800[0-9]{7}/
      if (rightPhone.test(this.item.Phone) || isPhone.test(this.item.Phone) || PhoneFour.test(this.item.Phone) || PhoneEgiht.test(this.item.Phone)) {
        console.log('验证正确')
      } else {
        this.$toast('请输入正确的联系电话')
        return
      }
      let regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/  
      if(this.item.Id && !regIdNo.test(this.item.Id)){  
          this.$toast('请输入正确的身份证号',1000)
          return
       }
      if (!this.item.Detail) {
        this.$toast('请输入你的认证说明',1000)
        return
      }
   
     
      if (this.files && this.files.length) {
        this.upImage()
      } else {
        this.upFeed()
      }
      
    },
    upImage () {
      var fd = new FormData()
      for (let i = 0; i < this.files.length; i++) {
        fd.append('1' + i, this.files[i])
      }
      let me = this
      me.api.file({
        url: 'file',
        data: fd,
        success: (res) => {
          this.newUrl = res.split(',')
          me.upFeed()
        }
      })
    },
    /**upFeed上传 */
    upFeed () {
      let me = this
      var feedBackData = {
        authenticationType: 1, // 认证类型，默认也是1
        debugContent: me.item.Detail, // 认证说明
        userName: me.item.Name, // 认证姓名
        phone: me.item.Phone, // 认证电话
      }
      // 表示证明材料
      if (this.files && this.files.length) {
        feedBackData.images = me.newUrl
      }
      // 表示身份证号
      if (this.item.Id) {
        feedBackData.idCardNo = me.item.Id
      }
      me.api.process({
        url: 'UserAuthentication',
        data: feedBackData,
        success: function () {
          me.$toast('认证已提交,请等待我们的审核', 500)
          me.isOneCreate = false
        },
        complete: function () {
          me.formLoading = false
        },
        error: function () {
          me.isOneCreate = true
        }
      })
    },
    upFileThumbnail() {
      let me = this
      me.item.filesResults = me.item.filesResults.concat(me.allImages)
      return new Promise((resolve, reject) => {
        if (me.allImages[0].type) {
          var fd = new FormData()
          fd.append('1', me.allImages[0])
          me.api.file({
            url: 'FileThumbnail',
            data: fd,
            success: res => {
              me.item.filesResults[0] = res.split(',')[1]
              resolve()
            },
            error: function() {
              me.formLoading = false
              me.$error(true, '创建失败', 200)
              reject()
            }
          })
        } else {
          resolve()
        }
      })
    },
    postImageList() {
      let me = this
      return new Promise((resolve, reject) => {
        if (me.allImages.length > 1) {
          var fd = new FormData()
          let markIndex = []
          for (let i = 1; i < me.allImages.length; i++) {
            if (me.allImages[i].type) {
              markIndex.push(i)
              fd.append('1' + i, me.allImages[i])
            }
          }
          if (markIndex.length) {
            me.api.file({
              url: 'file',
              data: fd,
              success: res => {
                let newR = res.split(',')
                markIndex.map((item, index) => {
                  me.item.filesResults[item] = newR[index]
                })
                resolve()
              },
              error: () => {
                // me.$toast('上传失败')
                me.$error(true, '修改资料失败', 1200)
                reject()
              }
            })
          } else {
            resolve()
          }
        } else {
          resolve()
        }
      })
    },
    // postActice提交
    postActive() {
      // 新
      if (!this.isOneCreate) {
        this.$toast('请勿重复提交',1200)
        return
      }
      if (!this.item.Name) {
        this.$toast('请输入你的姓名',1200)
        return
      }
      let rightPhone = /^[1][3,4,5,7,8][0-9]{9}$/
      var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/
      var PhoneFour = /^400[0-9]{7}/
      var PhoneEgiht = /^800[0-9]{7}/
      if (rightPhone.test(this.item.Phone) || isPhone.test(this.item.Phone) || PhoneFour.test(this.item.Phone) || PhoneEgiht.test(this.item.Phone)) {
        console.log('验证正确')
      } else {
        this.$toast('请输入正确的联系电话')
        return
      }
      let regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/  
      if(this.item.Id && !regIdNo.test(this.item.Id)){  
          this.$toast('请输入正确的身份证号',1200)
          return
       }
      if (!this.item.Detail) {
        this.$toast('请输入你的认证说明',1200)
        return
      }
      // 新
      var me = this
      me.$uploading(true, '修改资料中...')
      let p = this.upFileThumbnail()
      p.then(me.postImageList)
        .then(() => {
          var feedBackData = {
            userAuthenticationId: me.item.userAuthenticationId, // 修改才带
            authenticationType: 1, // 认证类型，默认也是1
            debugContent: me.item.Detail, // 认证说明
            userName: me.item.Name, // 认证姓名
            phone: me.item.Phone, // 认证电话
          }
          // 表示证明材料
          if (me.item.filesResults && me.item.filesResults.length) {
            feedBackData.images = me.item.filesResults
          }
          // 表示身份证号
          if (this.item.Id) {
            feedBackData.idCardNo = me.item.Id
          }
          me.api.process({
            url: 'UserAuthentication',
            data: feedBackData,
            success: function () {
              me.$success(true, '修改成功', 1200)
              me.$router.back()
            },
            complete: function () {
              me.formLoading = false
            },
            error: function(res) {
              // me.$error(true, '修改失败', 1200)
              me.$alert(res ? res : '请求出错')
              me.isOneCreate = true
              // me.$toast('发布失败')
            }
          })
        })
        .catch(() => {
          me.$error(true, '修改失败', 1200)
        })
    },
   }
}
</script>

<style lang="less" scoped>
  .rightPage{
    width:100%;
    height:100%;
    .fontStyle{
      color:rgb(255, 39, 66);
      font-style: normal;
    }
    p{
      width:100%;
      padding:1vw 4vw;
      box-sizing: border-box;
    }
    .rightMessage{
        width:100%;
        li{
            height:10vw;
            padding:1vw 6vw;
            box-sizing: border-box;
            display:flex;
            align-items: center;
            margin-bottom:1vw;
            span{
                display:inline-block;
                width:30vw;
            }
            input{
                // width:60vw;
                flex:1;
                margin-left:4vw;
                height:100%;
                border:none;
                outline: none;
            }
        }
        .special{
            height:30vw;
            padding-top:0;
            display:flex;
            flex-flow: row wrap;
            .detail{
                margin-right:4vw;
            }
            .inputContent{
              flex:1;
              height:20vw;
              resize:none;
              border:none;
              outline: none;
              color:rgb(117, 117, 117);
            }
            .count{
                width:100%;
                height:8vw;
                text-align: right;
                color:rgb(117, 117, 117);
                font-size:4vw;
            }
        }
        .specialTwo{
            height:60vw;
            display:block;
            padding:0;
            span{
                padding-left:6vw;
                box-sizing: border-box;
                width:45vw;
                margin-bottom:2vw;
            }
        }
    }
    .userSubmitSave{
      background-color:white;
      text-align: center;
      .mySave{
        width:70%;
        height:10vw;
        border:none;
        outline:none;
        color:white;
        background-color:rgb(255, 39, 66);
        border-radius: 10vw;
        margin-top:5vw;
        font-size:4.5vw;
        letter-spacing: 0.5vw;
      }
    }
  } 
</style>