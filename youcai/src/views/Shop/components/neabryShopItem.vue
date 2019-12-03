<template>
  <li class="neabryItem borderB"
      @click="goHome">
    <div class="userAvatar">
      <img :src="userBusiness.businessImg"
           alt="">
    </div>
    <div class="shopDetail">
      <span class="name">{{userBusiness.businessName}}({{userBusiness.city}})</span>
      <div class="eachDetail">
        <span>地址:&nbsp;{{userBusiness.street}}</span>
      </div>
      <div class="runTime">
        <span>{{userBusiness.businessType}}</span>
        <span>{{userBusiness.week}}</span>
      </div>
      <div class="discountList">
        <span v-for="(oneDiscount, index) in userBusiness.businessActivitys"
              :key="index"><i class="fontStyle">惠</i> &nbsp;{{oneDiscount}}</span>
      </div>
    </div>
    <div class="distance"
         v-if="calculateDistance">{{calculateDistance}}km</div>
  </li>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      defaultAvatar: 'http://webapp.szwanwan.com/img/default/defaultavatar.png',
      userInitBirth: this.userBusiness.birth,
    }
  },
  props: {
    userBusiness: {
      type: Object,
      required: true
    },
    isAttentionId: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(['user']),
     // 用户资料年龄
    userAge () {
      let userBirth = this.userInitBirth
      let data = new Date()
      let year = data.getFullYear()
      let month = data.getMonth() + 1
      let day = data.getDate()
      let birthYear = parseInt(userBirth.substring(0, 4))
      let birthMonth = parseInt(userBirth.substring(5, 7))
      let ageYear = year - birthYear
      let birthDay = parseInt(userBirth.substring(8, 10))
      // 如果当前月份小于生日月份就要减1岁
      let change = month > birthMonth || month === birthMonth ? 0 : -1
      // 只有当生日月份当前月份相等时 才判断 day
      if (month === birthMonth) {
        change = day > birthDay || day === birthDay ? 0 : -1
      }
      if (ageYear + change === 2018) {
        return 0
      } else {
        return ageYear + change
      }
    },
    /**
     * calculateDistance计算距离
     */
    calculateDistance () {
       if (this.userBusiness && this.userBusiness.distance) {
         let current = this.userBusiness.distance / 1000
         return this.toDecimal2(current)
       } else {
           return 0
       }
    }
  },
  methods: {
     goHome () {
      this.$router.push({name: 'business_home', params: {businessId: this.userBusiness.userBusinessId}})
     },
     /**
     * toDecimal2保留两位小数
     */
   toDecimal2(x) { 
    var f = parseFloat(x) 
    if (isNaN(f)) { 
        return false
    }
    f = Math.round(x * 100) / 100 
    var s = f.toString()
    var rs = s.indexOf('.')
    if (rs < 0) { 
        rs = s.length 
        s += '.'
    } 
    while (s.length <= rs + 2) { 
        s += '0'
    } 
    return s
    }
  }
}
</script>

<style lang="less" scoped>
   .neabryItem{
     width:100%;
     padding:4vw;
     box-sizing: border-box;
     display:flex;
     align-items: center;
     background: #fff;
     .userAvatar{
        width:24.07vw;
        height:24.07vw;
        overflow: hidden;
        img{
            width:100%;
            height:100%;
            object-fit: cover; 
        }
     }
     .shopDetail{
        width:50vw;
        margin-left:4vw;
        font-size:0;
        .name{
            font-size:4.63vw;
            font-weight: bold;
        }
        .eachDetail{
            display:flex;
            align-items: center;
            color:#909090;
            font-size:3.6vw;
            // height:7vw;
            flex-flow: row wrap;
            span{
              margin-right:2vw;
              width:100%;
              display:flex;
              flex-flow: row wrap;
            }
        }
        .runTime{
          display:flex;
            // justify-content: space-between;
            align-items: center;
            color:#909090;
            font-size:3.6vw;
            height:7vw;
            margin:1vw 0;
            span{
              display:inline-block;
              padding:0vw 1vw;
              box-sizing: border-box;
              margin-right:1vw;
              background:rgb(246, 210, 228);
              color:rgb(255, 39, 66);
            }
        }
        .discountList{
          // height:10vw;
          span{
            display:inline-block;
            width:100%;
            color:#909090;
            font-size:3.6vw;
            .fontStyle{
              display:inline-block;
              height:5vw;
              width:5vw;
              font-style: normal;
              background: rgb(255, 39, 66);
              color:white;
              text-align: center;
              line-height: 5.25vw;
              margin-right:1vw;
            }
          }
        }
        .userMessage{
            display:flex;
            align-items: center;
            color:#909090;
            font-size:3.6vw;
            height:7vw;
            span:nth-child(1) {
               overflow:hidden;
              text-overflow:ellipsis;
               white-space:nowrap;
                margin-right:2vw;
                max-width:20vw;
            }
        }
     }
      .distance{
        // width: 15vw;
        height: 100%;
        color:#aaaaaa;
        display:flex;
        align-items: center;
        font-size:3.7vw;
        text-align: center;
    }
   }
</style>