<template>
    <div class="modifyShopPage">
        <ul class="shopBaseInfo LRForm">
          <li class="LRFormItem borderB">
            <span class="LFormItem">商户名</span>
            <p class="FormItemContent">{{item.businessName}}</p>
           </li>
           <li class="LRFormItem borderB">
            <span class="LFormItem">商户类型</span>
            <p class="FormItemContent">{{item.businessType}}</p>
           </li>
           <li class="LRFormItem borderB">
            <span class="LFormItem">城市</span>
            <p class="FormItemContent">{{item.city}}</p>
           </li>
           <li class="LRFormItem borderB">
            <span class="LFormItem">联系人</span>
            <p class="FormItemContent">{{item.contractName}}</p>
           </li>
           <li class="LRFormItem borderB">
            <span class="LFormItem">联系电话</span>
            <p class="FormItemContent">{{item.businessPhone}}</p>
           </li>
           <li class="LRFormItem borderB">
            <span class="LFormItem">地址</span>
            <p class="FormItemContent">{{item.street}}</p>
           </li>
           <li class="LRFormItem borderB">
            <span class="LFormItem">营业时间</span>
            <p class="FormItemContent">{{item.week}}</p>
           </li>
        </ul>
        <div class="confirm">
            {{title}}
        </div>
    </div>
</template>

<script>
export default {
  data () {
      return {
        item: {}
      }
  },
  created () {
      this.getUserMain()
  },
  computed: {
      title () {
        if (this.item.businessState === 1) {
          return '审核通过'
        } else if (this.item.businessState === 2) {
          return '审核拒绝'
        } else if (this.item.businessState === 0) {
            return '审核中'
        } else {
          return ''
        }
      }
  },
  methods: {
     /**
     * 获得个人信息
     */
    getUserMain () {
      let me = this
      me.api.get({
        url: 'UserMain',
        success: function (res) {
          me.item = res.userBusiness
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.modifyShopPage{
  .LRForm .LRFormItem .iconWanwan.iconWperson-fill {
   color: var(--mRed);
  }
  .shopBaseInfo {
    .shopTip {
        margin-top: 4vw;
        font-size: var(--nText);
        text-align: center;
        color: var(--lGray);
        background: #fff;
    }
  }
  .confirm{
            width: 87.78vw;
            height: 14vw;
            line-height: 14vw;
            text-align: center;
            border-radius: 7vw;
            background: #ff2742;
            color: #fff;
            font-size: 5vw;
            letter-spacing: 2px;
            margin:auto;
            margin-top:10vw;
    } 
}
</style>
