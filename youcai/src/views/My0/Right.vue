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
        <ImagesUploader :canUploadVideo='false'
                        uploaderId="feedback_uploader"
                        @upFiles='upFiles'
                        maxLength=5 />
      </li>
    </ul>
    <div class="userSubmitSave">
      <button class="mySave"
              @click="saveFeed">保存</button>
    </div>
  </div>
</template>

<script>
import ImagesUploader from '@/components/upLoader/imageUploader'
export default {
   data () {
       return {
          isOneCreate: true, // 表示是第一次提交
          formLoading: false,
          item: {
              Detail: ''
          },
          showMoreQuest: false,
          questDes: null,
          clickIndex: '',
          animateClassName: '',
          feedbackData: [],
          files: null,
          newUrl: null,
          isShowHeight: false
       }
   },
   computed: {
      itemDetailLength () {
        return this.item.Detail.length
      }
    },
   components: {
      ImagesUploader
   },
   methods: {
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
          me.$router.back()
        },
        complete: function () {
          me.formLoading = false
        },
        error: function (res) {
          me.isOneCreate = true
          me.$alert(res ? res : '请求出错')
        }
      })
    }
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
                width:100vw;
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