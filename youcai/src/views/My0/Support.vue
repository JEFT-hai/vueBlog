<template>
  <div class="feedBackWrap">
    <div class="questionType"
         @click="handleMore">
      <div class="questTitle">问题类型</div>
      <div class="moreQuest">
        <span class="questDetail"
              v-if='questDes'
              @click="handleMore">{{questDes.label}}</span>
        <span class="showMore"
              :class="{down:showMoreQuest}"
              @click="handleMore">
          <i class="iconWanwan iconWright activityNotice"></i>
        </span>
        <ul :class="['list', {haveHieght: isShowHeight}]">
          <li v-for="(item,index) in feedbackData"
              :key="index"
              @click.stop="handleSelect(item)">{{ item.label }}
            <div class="selectLabel">
              <span class="noRight"
                    v-show="!(item === questDes)">
                <i></i>
              </span>
              <span class="right"
                    v-show="item === questDes">
                <i class="iconWanwan iconWzhengquecopy activityNotice"></i>
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="userInput">
      <textarea rows="3"
                name="detail"
                maxLength='200'
                class="inputContent"
                placeholder="请输入您的反馈意见"
                v-model="item.Detail"></textarea>
      <div class="count"><span>{{itemDetailLength}}</span>/200</div>
    </div>
    <div class="image">
      <ImagesUploader :canUploadVideo='false'
                      uploaderId="feedback_uploader"
                      @upFiles='upFiles'
                      maxLength=3 />
    </div>
    <div class="userPhone">
      <span>联系电话</span>
      <input class="phoneInput"
             name="phone"
             type="number"
             placeholder="请输入您的联系电话"
             v-model="item.Phone"
             oninput="if(value.length>11)value=value.slice(0,12)" />
    </div>
    <div class="vipTip" v-if='user.vipLevel'>尊敬的VIP用户，我们会优先处理您的反馈。</div>
    <div class="userSubmitSave">
      <button class="mySave"
              @click="saveFeed">保存</button>
    </div>
    <toBeVIPBar v-if="!user.vipLevel" info='更快处理，使您更方便！'></toBeVIPBar>
  </div>
</template>

<script>
const toBeVIPBar = resolve => require(['@/components/Vip/ToBeVIPBar'], resolve)
import ImagesUploader from '@/components/upLoader/imageUploader'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      isOneCreate: true, // 表示是第一次提交
      formLoading: false,
      item: {
        Id: 0, CategoryId: 1, Detail: '', Tel: ''
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
  components: {
    ImagesUploader,
    toBeVIPBar
  },
  computed: {
    ...mapState(['user']),
    itemDetailLength () {
      return this.item.Detail.length
    }
  },
  created () {
    this.getFeedBack()
  },
  methods: {
    upFiles (data) {
      this.files = data
    },
    getFeedBack () {
      let me = this
      me.api.get({
        'url': 'Condition/id',
        success: function (res) {
          me.feedbackData = me.feedbackData.concat(res.feedBack)
        }
      })
    },
    handleMore () {
      this.isShowHeight = true
    },
    handleSelect (item) {
      this.questDes = item
      this.item.categoryId = item.value
      this.showMoreQuest = false
      this.animateClassName = 'moveRight'
      this.isShowHeight = false
    },
    saveFeed () {
      if (!this.isOneCreate) {
        this.$toast('请勿重复提交',1200)
        return
      }
      if (!this.questDes) {
        this.$toast('请选择问题类型',1000)
        return
      }
      if (!this.item.Detail) {
        this.$toast('请输入你的反馈内容',1000)
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
    upFeed () {
      let me = this
      var feedBackData = {
        'FeedBackType': me.questDes.value,
        'Content': me.item.Detail,
        'Phone': me.item.Phone
      }
      if (this.files && this.files.length) {
        for (let i = 0; i < me.newUrl.length; i++) {
          i === 0 && (feedBackData.image1 = me.newUrl[0])
          i === 1 && (feedBackData.image2 = me.newUrl[1])
          i === 2 && (feedBackData.image3 = me.newUrl[2])
        }
      }
      me.api.process({
        url: 'UserFeedBack',
        data: feedBackData,
        success: function () {
          me.$toast('你的反馈已接收，感谢您反馈', 500)
          me.isOneCreate = false
          me.$router.back()
        },
        complete: function () {
          me.formLoading = false
        },
        error: function () {
          me.isOneCreate = true
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .feedBackWrap{
    width:100%;
    height:100%;
    overflow: hidden;
    .questionType{
      display:flex;
      justify-content: space-between;
      width:100%;
      padding:0 4vw;
      box-sizing: border-box;
      height:10vw;
      margin:auto;
      margin-top:3vw;
      color:rgb(117, 117, 117);
      position:relative;
      line-height:10vw;
      .moreQuest{
        .questDetail{
          display:inline-block;
          width:30vw;
          margin-right:3vw;
          color:#4b8bdb;
        }
        .showMore{
          display:inline-block;
        }
      }
      .list{
        transition:all 0.5s;
        position:absolute;
        right:0;
        width:60vw;
        background-color:white;
        z-index:2;
        height:0;
        overflow: hidden;
        li{
          height:10vw;
          line-height:10vw;
          padding-left:8vw;
          position:relative;
          .select{
            display:inline-block;
            border:1px solid rgb(222,222,222);
            border-radius: 50%;
            width:5vw;
            height:5vw;
            position:absolute;
            right:2vw;
            top:3vw;
          }
          .selectLabel{
                    position:absolute;
                    top:1vw;
                    right:2vw;
                    span{
                        width:5vw;
                        height:5vw;
                        border-radius: 50%;
                        display:inline-block;
                    } 
                    .noRight {
                      border:1px solid rgb(227,227,227);
                    }
                    .right{
                        background-color:rgb(254, 41, 66);
                        border:1px solid rgb(254, 41, 66);
                        position:relative;
                        .activityNotice{
                            display:inline-block;
                            color:white;
                            font-size:3vw;
                            border-radius: 50%;
                            width:100%;
                            height:100%;
                            position:absolute;
                            top:0;
                            left:0;
                            right:0;
                            bottom:0;
                            margin:auto;
                            line-height:6vw;
                            text-align: center;
                        }
                    }
                }
        }
      }
      .haveHieght{
        height:60vw;
        transition:all 0.5s;
      }
    }
    .userInput{
      width:100%;
      padding:4vw;
      box-sizing: border-box;
      .inputContent{
        color:rgb(117, 117, 117);
        width:100%;
        resize:none;
        border:none;
        outline: none;
      }
      .inputContent::-webkit-input-placeholder{
        color:rgb(117, 117, 117);
        font-size:4vw;
      }
      .count{
        width:100%;
        text-align: right;
        color:rgb(117, 117, 117);
      }
    }
    .userPhone{
      width:100%;
      padding:4vw;
      box-sizing: border-box;
      span{
        color:rgb(117, 117, 117);
        margin-right:5vw;
      }
      .phoneInput{
        width:50vw;
        height:7vw;
        border:none;
        outline: none;
      }
    }
    .vipTip{
      padding: 0 4vw;
      color: #999;
      font-size: 12px;
      position: relative;
      &::after{
        position: absolute;
        content: '*';
        width: 4vw;
        left: 0;
        color: var(--mRed);
        text-align: right;
        transform: scale3d(0.8, 0.8, 1);
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
        margin-top:10vw;
        font-size:4.5vw;
        letter-spacing: 0.5vw;
      }
    }
  }
</style>