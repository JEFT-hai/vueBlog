<template>
  <div class="reportWrap">
    <div class="reportSuccess"
         v-if="isSusscessReport">
      <span class="successImg"></span>
      <span class="susscessMsg">提交成功</span>
      <span class="successDes">多录小助手已收到您的举报，将在1个工作日内进行处理，处理完后会在消息中告知结果</span>
    </div>
    <div class="report"
         v-else>
      <div class="line"></div>
      <ul class="reportUl">
        <li @click="handleSelect(item)"
            v-for="(item, index) in tips"
            :key="index">
          <span>{{item.label}}</span>
          <div class="selectLabel">
            <span class="noRight"
                  v-show="!(selectedId === item.value)">
              <i></i>
            </span>
            <span class="right"
                  v-show="selectedId === item.value">
              <i class="iconWanwan iconWzhengquecopy activityNotice"></i>
            </span>
          </div>
        </li>
      </ul>
      <div class="userInput">
        <p class="title">问题描述</p>
        <div class="userSelf">
          <textarea v-model="reportArticles"></textarea>
        </div>
      </div>
      <div class="reportBotton">
        <button class="reportBtn"
                @click="submitReport(tips)"><span>提交反馈</span></button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      isSusscessReport: false,
      selectedId: null,
      reportContent: '', // 举报选项内容
      reportDetail: [],
      reportArticles: '', // 举报的笔记
      itemId: this.$route.params.id,
      isGroup: false,
      tips: [],
    }
  },
  computed: {
    ...mapState(['isPlaying', 'currentIndex', 'playList', 'squenceList', 'musicMode', 'pieShow', 'currentTime', 'duration', 'musicInnerShow']),
    type () {
      if (this.isGroup) {
        return 2
      } else {
        return this.$route.params.type
      }
    }
  },
  mounted () {
    this.getTips()
    console.log('我是每一次挂在呢')
    this.$store.commit('setMusicInnerShow', false)
  },
  beforeRouteEnter (to, from, next) {
    next(vm=>{
      if (from.name === 'groupInfo' || from.name === 'groupChatSettings') {
        vm.isGroup = true
        console.log('表示是群主举报')
      }
    })
  },
  methods: {
    ...mapMutations(['setMusicInnerShow']),
    getTips () {
      let me = this
      me.api.get({
        'url': 'Condition/id',
        success: function (res) {
          me.tips = me.tips.concat(res.tip)
        }
      })
    },
    userSubmit () {
      var me = this
      // console.log('打印type', typeof this.type)
      // return
      me.api.process({
        'url': 'Tip',
        data: {
          objectId: me.itemId,
          content: me.reportArticles,
          tipType: me.selectedId,
          objectType: me.type // 1表示动态，2表示群组 3表示评论
        },
        success: function () {
          me.isSusscessReport = true
          console.log('举报成功')
          setTimeout(() => {
            me.$router.go(-1)
          }, 500)
          
        }
      })
    },
    submitReport () {
      if (this.reportArticles === '') {
        this.$toast('请输入你的举报内容',1200)
        return
      }
      this.userSubmit()
    },
    handleSelect (item) {
      this.selectedId = item.value
      this.reportContent = item.label
    }
  }
}
</script>

<style lang="less" scoped>
.report {
   width:100%;
   height:100%;
   overflow: hidden;
  //  height:110vw;
   .line{
       width:100%;
       height:2vw;
       background-color:#f3f3f3;
   }
   .reportUl{
       width:100%;
       li{
           width:95%;
           margin-left:4vw;
           height:10vw;
           margin-top:2vw;
           line-height:10vw;
           border-bottom: 1px solid rgb(243,243,243);
           position:relative;
           .select{
            display: inline-block;
            width:5vw;
            height:5vw;
            border-radius: 50%;
            border:1px solid rgb(227,227,227);
            position:absolute;
            right:4vw;
            top:1vw;
           }
           .checked{
            background:url("../../assets/images/myright.png") no-repeat;
            background-size:contain;
          }
            .selectLabel{
                 position:absolute;
                 top:1vw;
                 right:4vw;
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
   .userInput{
     width:100%;
     height:30vw;
     margin-top:5vw;
     display:block;
     .title{
       width:100%;
       height:7vw;
       margin-left:4vw;
     }
     .userSelf{
       width:90%;
       height:20vw;
       margin-top:3vw;
       margin-left:4vw;
       border:1px solid rgb(243,243,243);
       textarea{
         border:none;
         outline:none;
         width:90%;
         height:15vw;
         resize: none;
       }
     }
   }
   .reportBotton{
     width:100%;
     display:flex;
     justify-content: center;
     padding-top:8vw;
      .reportBtn{
        width: 87.78vw;
        height: 14vw;
        line-height: 14vw;
        text-align: center;
        border-radius: 7vw;
        background: #ff2742;
        color: #fff;
        font-size: 5vw;
        letter-spacing: 2px;
        border:none;
        outline: none;
     }
   }
}
.reportSuccess{
    width:90%;
    height:60vw;
    position:relative;
    top:10vw;
    margin-left:5vw;
    .successImg{
        width:30vw;
        display:block;
        position: absolute;
        left:0;
        right:0;
        margin:0 auto;
        height:12vw;
        text-align: center;
        background:url('../../assets/images/susscess.png') no-repeat;
        background-position: center;
    }
    .susscessMsg{
        display: block;
        width:30vw;
        position: absolute;
        left:0;
        right:0;
        top:18vw;
        margin:0 auto;
        height:7vw;
        text-align: center;
        font-size:4.5vw;
        font-weight: bold;
        letter-spacing:0.4vw;
    }
    .successDes{
        width:70vw;
        display:block;
        position: absolute;
        left:0;
        right:0;
        top:35vw;
        margin:0 auto;
        height:20vw;
        text-align: center;
        font-size:4vw;
        color:rgb(127,127,127);
    }
}
</style>
