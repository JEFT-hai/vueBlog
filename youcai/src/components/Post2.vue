<template>
  <div class="page-content form_primary">
    <form method="post" action="javascript:;" @submit.prevent="submit" v-bind:class="{is_loading:formLoading}">
      <input type="hidden" name="Id" :value="item.Id" />
      <div class="weui-cells weui-cells_form">
        <div class="weui-cell">
          <div class="weui-cell__bd">
            <span class="noticeMsg">活动时间</span>
            <input class="weui-input"  name="Name" ud type="text" placeholder="请选择活动时间" v-model="selectTime" /><span class="inputrighticon icon-shijian2 icon iconfont" @click="selectDate"></span>
          </div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__bd">
            <span class="noticeMsg">活动地点</span>
            <input class="weui-input" name="Name" type="text" placeholder="请输入活动地点" v-model="item.place" />
            <span class="inputrighticon icon-jikediancanicon28 icon iconfont" @click='showMapF'></span>
          </div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__bd">
            <span class="noticeMsg">活动人数</span>
            <input class="weui-input" name="Name" type="text" placeholder="请输入活动人数" v-model="selectPeople" /><span class="inputrighticon icon-person icon iconfont"></span>
          </div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__bd">
            <span class="noticeMsg">主办单位</span>
            <input class="weui-input" name="Name" type="text" placeholder="请输入主办单位" v-model="selectDepartment" /><span class="inputrighticon icon-fangzi icon iconfont"></span>
          </div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__bd">
            <textarea rows="3" name="content" class="weui-textarea" placeholder="活动详情" v-model="item.Content"></textarea>
            <div class="weui-textarea-counter"><span>{{itemContentLength}}</span>/2000</div>
          </div>
        </div>
        <ImagesUploader uploaderId="discover_uploader" :images="item.Pictures" maxfileCount="9" />
        <div class="weui-cell discoverCategory">请为你的活动选择活动类型</div>
        <!-- <div class="weui-cell discoverCategory">
          <div class="weui-cells weui-cells_radio">
            <label class="weui-cell weui-check__label soli_btn" :for="'discoverCategoryId'+item.index" v-for="item in data.discover.categorys" :key="item.index">
              <div class="weui-cell__bd">
                <p>{{item.value}}</p>
              </div>
              <div class="weui-cell__ft">
                <input type="radio" class="weui-check" name="categoryId" :id="'discoverCategoryId'+item.index" :value="item.index" v-model="item.CategoryId">
                <span class="weui-icon-checked"></span>
              </div>
            </label>
          </div>
        </div> -->
        <!-- <div class="weui-cell discoverCategory">
          <router-link :to="{name: 'mygroup', params: { id: 0}}" class="allgroup">全部 ></router-link>
        </div> -->
        <!-- <div class="weui-cell discoverCategory discovergroup">
          <div class="weui-cells weui-cells_radio">

            <label class="weui-cell weui-check__label" :for="'discoverCategoryId'+item.index" v-for="item in data.discover.categorys" :key="item.index">
              <div class="weui-cell__bd">
                <img src="http://shop_api.tianvcms.com/files/avatar/32b69b3a1141419890f1ec2e068e7795.gif" />
                <p>群组1</p>
              </div>
              <div class="weui-cell__ft">
                <input type="radio" class="weui-check" name="categoryId" :id="'discoverCategoryId'+item.index" :value="item.index" v-model="item.CategoryId">
                <span class="weui-icon-checked"></span>
              </div>
            </label>
            <label class="weui-cell weui-check__label discoverCategoryId0 addgroup" >
              <router-link :to="{name: 'discoverPost3', params: { id: 0}}">+</router-link>
            </label>
          </div>
        </div> -->
      </div>
      <div class="weui-btn-area">
        <button class="btn_primary weui-btn weui-btn_primary"><span>发布</span></button>
      </div>
      <transition name='toLeft'>
        <BMap v-if='showMap' @hideBMapPage='hideMap' @subAdd='getAddress'></BMap>
      </transition>
    </form>
  </div>
</template>

<script>
import ValidateRule from './forms/validate/Post'
import ImagesUploader from '@/components/ActiveUploader'
import BMap from '@/components/Amap'
export default {
  components: {
    ImagesUploader,
    BMap
  },
  data () {
    return {
      formLoading: false,
      item: {
        Id: 0, CategoryId: 1, Content: '', Pictures: ''
      },
      selectTime: '', // 选择活动时间
      selectDepartment: '', // 选择活动部门
      selectPeople: '', // 选择活动人数
      selectAddress: '',
      showMap: false // 展示地图
    }
  },
  computed: {
    isEdit () {
      return this.item.Id >= 1
    },
    itemContentLength () {
      return this.item.Content.length
    }
  },
  watch: {
    formLoading: function (isLoading) {
      let me = this
      me.$msg.updateLoading(isLoading)
    }
  },
  mounted () {
    let me = this
    let id = me.$route.params.id ? parseInt(this.$route.params.id) : 0
    if (id <= 0) {
      return
    }
    me.isLoading = true
    let formData = new FormData()
    formData.append('id', id)
    me.api.process({
      file: 'Post',
      method: 'GetItem',
      data: formData,
      success: function (res) {
        me.item = res.item
        Object.assign(me.item, res.item)
        // ImagesUploader.images = res.item.Pictures
        // me.item.Pictures = res.item.Pictures
        // console.log(me.item)
        // me.replys = res.replys
        // me.likes = res.likes
        // me.likeReplys = res.likeReplys
      },
      error: function (res) {
        me.$msg.showError(res.msg)
      },
      complete: function () {
        me.isLoading = false
      }
    })
  },
  methods: {
    // 选择活动日期
    selectDate () {
      let me = this
      let now = new Date()
      weui.datePicker({
        start: now, // 从今天开始
        end: now.getFullYear() + 30, // 当前时间加30年
        defaultValue: [now.getFullYear(), now.getMonth() + 1, now.getDate()],
        onChange: function (result) {
        },
        onConfirm: function (result) {
          let y = result[0].value
          let m = result[1].value
          let d = result[2].value
          me.selectTime = y + '-' + (m < 10 ? 0 + '' + m : m) + '-' + (d < 10 ? 0 + '' + d : d)
        },
        id: 'datePicker'
      })
    },
    // 地图相关
    showMapF: function () {
      this.showMap = true
    },
    hideMap: function () {
      this.showMap = false
    },
    isValidate (form) {
      let me = this
      let validateResult = me.validate.test(form, ValidateRule)
      if (typeof (validateResult) === 'string' && validateResult.length >= 1) {
        me.$msg.showTopTips(validateResult)
        return false
      }
      return true
    },
    submit: function () {
      let me = this
      if (me.formLoading) {
        return
      }
      me.formLoading = true
      let form = me.$el.querySelector('form')
      let formData = new FormData(form)
      if (!me.isValidate(form)) {
        me.formLoading = false
        return
      }
      me.api.process({
        file: 'Post',
        method: 'SetPost',
        data: formData,
        success: function (res) {
          // eslint-disable-next-line
          weui.toast('操作成功', {
            duration: 200,
            callback: function () {
              me.$router.go(-2)
            }
          })
        },
        error: function (res) {
          me.$msg.showError(res.msg)
        },
        complete: function () {
          me.$msg.hideLoading()
          me.formLoading = false
        }
      })
      return false
    },
    getAddress: function (data) {
      this.hideMap()
      this.item.place = data.curTit + ' ' + data.curAddress
    }
  }
}
</script>

<style lang="less" scope>
  .weui-cell__bd{
    display: flex;
    .noticeMsg{
      color:rgb(227, 85, 43);
    }
    .weui-input{
      margin-left:5vw;
      width:60vw;
      font-size: 1vw;
      margin-top:0.5vw;
    }
    .inputrighticon{
      margin-top:1vw;
    }
  }
   .toLeft-enter,.toLeft-leave-active {
    left: 100vw;
  }
  .toLeft-enter-active,.toLeft-leave-active{
    transition: all 0.3s ease-in-out;
  }
</style>
