<template>
    <span :class="{pinkGenderLabel:userMessage.gender === 2,blueGenderLabel:userMessage.gender !== 2}">
        <i class="iconWanwan iconWnan-copy activityNan" v-if="userMessage.gender === 1 || userMessage.gender === 0 "></i>
        <i class="iconWanwan iconWnv3-copy activityNv" v-else></i>
        <!-- <i class="age">{{userAge}}</i> -->
    </span>
</template>

<script>
export default {
  data () {
    return {
      userInitBirth: '' // 用户的初始年龄
    }
  },
  props: ['userMessage'], // 用户信息
  computed: {
    // 用户资料年龄
    userAge () {
      console.log("初始年纪",this.userInitBirth)
      let userBirth = this.userMessage && this.userMessage.birth
      let data = new Date()
      let year = data.getFullYear()
      let month = data.getMonth() + 1
      let day = data.getDate()
      let birthYear = parseInt(userBirth && userBirth.substring(0, 4))
      let birthMonth = parseInt(userBirth && userBirth.substring(5, 7))
      let ageYear = year - birthYear
      let birthDay = parseInt(userBirth && userBirth.substring(8, 10))
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
    }
  }
}
</script>