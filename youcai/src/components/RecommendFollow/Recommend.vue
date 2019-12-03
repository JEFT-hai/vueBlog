<template>
  <div class="recommendWrap">
     <div class="recommendTitle" v-show="!isLogin">
       <span class="noFirends">还没有好友动态哦</span>
       <span class="seeOther">看看大家都在关注哪些人吧!</span>
     </div>
     <div class="rowlist">
       <div class="listDes">
         <span class="cound">你可能感兴趣的用户</span>
         <!-- <span class="seeMore">查看更多&nbsp;></span> -->
       </div>
       <div class="userList">
         <ul class="followUl" ref="content">
           <FollowList  v-for="(item,index) in noFollowData" :key="index" :eachFollow="item" @userClearCommend.self="userClearCommend" @checkLogin="checkLogin"></FollowList>
         </ul>
       </div>
     </div>
  </div>
</template>

<script>
import FollowList from './FollowList'
import authentication from '@/assets/js/LoginHelper'
export default {
  data () {
    return {
      noFollowData: [],
      noFollowIndex: 1,
      noFollowSize: 26,
      curPage:1,
      pageSize: 8,
    }
  },
  props: {
    isLogin: {
      type: Boolean,
      default: false
    }
  },
  components: {
    FollowList
  },
  mounted () {
    this.getNotFollow()
  },
  updated () {
    this.initContentWidth()
    // let w = document.getElementsByClassName('followUl')[0].offsetWidth
  },
  watch: {
    noFollowData () {
      if (this.noFollowData.length === 0) {
        console.log("我没有值")
        this.$emit('hiddleRecommend')
      }
      if (this.noFollowData.length === 0) {
        return
      }
      this.$nextTick(() => {
        this.initScroll()
      })
      
    }
  },
  methods: {
    initContentWidth () {
      let eachLi = document.getElementsByClassName('noFoundWrapLi')
      let li = eachLi && eachLi.length > 0 ? eachLi[0] : ''
      let width = li.offsetWidth
      if (!li) {
        return
      }
      let computedStyle = getComputedStyle(li, null)
      // 获取元素的右边距
      let marginRight = computedStyle.marginRight
      let bScrollContentWidth = (parseInt(marginRight) + width) * this.noFollowData.length + parseInt(marginRight)
      document.getElementsByClassName('followUl')[0].style.width = bScrollContentWidth + 10 + 'px'
    },
    initScroll () {
      this.initContentWidth()
      this.scroll = new window.BScroll('.userList', {
        scrollX: true,
        click: true
      })
    },
    // 检查是否登录
    checkLogin () {
      if (!authentication.isLogin()) {
        this.go.login()
        return
      }
    },
    // 去掉不要推荐
    userClearCommend (eachOne) {
      for (let i = 0; i < this.noFollowData.length; i++) {
        if (eachOne.userId === this.noFollowData[i].userId) {
          this.noFollowData.splice(i, 1)
          return
        }
      }
    },
    // 搜索全部列表
    getNotFollow () {
      var me = this
      me.api.get({
        url: `UserRecommend?PageIndex=${me.curPage}&PageSize=${me.pageSize}`,
        success: function (res) {
          console.log("推荐关注的用户列表",res)
          let responseData = res
          me.noFollowData.push(responseData[0])
          for (let i = 0; i < responseData.length; i++) {
            for (let y = 0; y < me.noFollowData.length; y++) {
              if (me.noFollowData[y].userId === responseData[i].userId) {
                break
              }
              if (y === me.noFollowData.length - 1) {
                me.noFollowData.push(responseData[i])
              }
            }
          }
        },
        error: function (res) {
          me.$msg.showError(res.msg)
        },
        complete: function () {
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.recommendWrap{
  width:100%;
  height:60vw;
  // border:1px solid blue;
  .recommendTitle{
    width:100%;
    height:26.6vw;
    padding-top:8.2vw;
    .noFirends{
      width:100%;
      display:block;
      font-size:4.26vw;
      font-weight:bold;
      color:#323232;
      text-align: center;
      letter-spacing: 0.3vw;
      // font-family: " Microsoft YaHei",
    }
    .seeOther{
      width:100%;
      text-align: center;
      display:block;
      font-size:3.73vw;
      color:#9d9d9d;
      margin-top:2vw;
      letter-spacing: 0.3vw;
    }
  }
  .rowlist{
    width:100%;
    height:70vw;
    background-color:#f6f6f6;
    padding-top:3vw;
    padding-bottom:3vw;
    .listDes{
      width:90%;
      margin:auto;
      display:flex;
      justify-content: space-between;
      margin-bottom:3vw;
      .cound{
        display:inline-block;
        color:#313131;
        font-size:3.47vw;
      }
    }
    .userList{
      margin:auto;
      width:94%;
      overflow: hidden;
      font-size:0;
      ul{
        height:59vw;
        font-size:0;
      }
    }
  }
}
</style>
