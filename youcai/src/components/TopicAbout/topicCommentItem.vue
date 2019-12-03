<template>
  <li class="topicCommentWrap">
    <div class="eachComment">
      <div class="eachHead">
        <div class="userAvator"
             @click="goHome">
          <img :src="!oneAnswer.avatar ? defaultAvatar : oneAnswer.avatar"
               alt="">
          <div class="right"
               v-if="oneAnswer.autheType === 1">
            <i class="one">v</i>
          </div>
          <!-- <div class="right" >
                        <i class="one">V</i>
                    </div> -->
        </div>
        <div class="userDetail">
          <div class="user">
            <span class="userName">{{oneAnswer.nickName}}</span>
            <BirthGender :userMessage="oneAnswer"></BirthGender>
            <!-- <span class="yellowGenderLabel">Lv.32</span> -->
          </div>
          <div class="userData">
            <span>{{reallyCreateTime}}</span>
            <!-- <span>26.32km</span> -->
          </div>
        </div>
      </div>
    </div>
    <div :class="['commentListImg',{divide:oneAnswer.imageList && oneAnswer.imageList.length >= 3}]"
         v-show="oneAnswer.imageList && oneAnswer.imageList.length > 0">
      <div v-for="(item,index) in threeImg"
           :key="index"
           @click="handleComment(oneAnswer)"
           :class="['imgOne',{imgTwo: oneAnswer.imageList && oneAnswer.imageList.length === 2},{imageOne: oneAnswer.imageList && oneAnswer.imageList.length === 1},{imageThree: oneAnswer.imageList && oneAnswer.imageList.length >=3}]">
        <img :src="item"
             alt="">
        <div v-if="oneAnswer.imageList && oneAnswer.imageList.length > 3"
             class="mask">
          <span><i class="iconWanwan iconWjiahao activityAdd"></i></span>
          <span>{{oneAnswer.imageList.length -3}}</span>
        </div>
      </div>
    </div>
    <div class="commentContent">
      <div :class="['smallH',{content: oneAnswer.content && oneAnswerContent.length >= 67}]"
           @click="handleComment(oneAnswer)"
           v-html='oneAnswerContent'>
        <!-- {{oneAnswerContent}} -->
      </div>
      <div class="contentDetail"
           @click="handleComment(oneAnswer)">
        <span>赞同{{oneAnswer.vote}}</span>
        <span>反对{{oneAnswer.against}}</span>
        <span>评论{{oneAnswer.countComment}}</span>
      </div>
    </div>
    <div class="splitLine"></div>
  </li>
</template>

<script>
import BirthGender from '@/components/BirthGender'
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      defaultAvatar: 'http://webapp.szwanwan.com/img/default/defaultavatar.png',
      imgList: ['one', 'two', 'three']
    }
  },
  components: {
    BirthGender
  },
  props: ['oneAnswer'],
  computed: {
    ...mapState(['user']),
    reallyCreateTime () {
      let time = this.oneAnswer.createTime.substring(0, 10)
      return time
    },
    threeImg () {
      let arr = []
      arr = this.oneAnswer.imageList && this.oneAnswer.imageList.slice(0, 3)
      return arr
    },
    oneAnswerContent () {
        let reTag = /<img(?:.|\s)*?>/g
        return this.oneAnswer.content.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(reTag, '')
    //   if (!this.oneAnswer.content.match(/[\u4e00-\u9fa5]/g)) {
    //     return ''
    //   }
    //   return this.oneAnswer.content.match(/[\u4e00-\u9fa5]/g).join('')
    }
  },
  methods: {
    ...mapMutations(['updateNeedBack']),
    goHome () {
      if (this.oneAnswer.userId === this.user.userId) { // 去到我的主页
        this.updateNeedBack(true)
        this.$router.push({ name: 'my' })
      } else { // 去到别人的主页
        this.$router.push({ name: 'discoverUser', params: { id: this.oneAnswer.userId } })
      }
    },
    /**
     * handleComment跳到评论内页
     */
    handleComment (oneAnswer) {
      this.$emit('showTopicCommentInner', oneAnswer)
    }
  }
}
</script>

<style lang="less" scoped>
  .topicCommentWrap{
    width:100%;
    .eachHead{
        width:93%;
        height:17.04vw;
        margin:auto;
        display:flex;
        align-items: center;
        .userAvator{
            width:12.69vw;
            height:12.69vw;
            border-radius: 50%;
            border:1px solid rgb(243,243,243);
            // overflow: hidden;
            position: relative;
            img{
                width:12.69vw;
                height: 100%;
                overflow: hidden;
                border-radius: 50%;
            }
            .right{
                  position:absolute;
                  bottom:0vw;
                  right:-1vw;
                  z-index:12;
                  background:white;
                  box-shadow: 0 0 1px #eeee;
                  width: 5vw;
                  height:5vw;
                  border-radius: 50%;
                  display:flex;
                  .one{
                    margin:auto;
                    display:inline-block;
                    width:4.18vw;
                    height:4.18vw;
                    border-radius: 50%;
                    // background:rgb(255, 39, 66);
                    background: linear-gradient(to right bottom,#e37782, #f56b80,#ff5363,#ff405b, #fc3f58);
                    color:white;
                    line-height: 4.5vw;
                    text-align: center;
                    font-size:12px;
                    font-weight: 500;
                    box-sizing: border-box;
                    font-family: Times, TimesNR, 'New Century Schoolbook', Georgia, 'New York', serif;
                  }
            }
        }
        .userDetail{
            margin-left:3vw;
            .user{
                display:flex;
                align-items: center;
                flex-flow: row wrap;
                .userName{
                  display:inline-block;
                  font-size:4.17vw;
                  color:#333333;
                  margin-right:1vw;
                  font-weight: bold;
                  max-width:50vw;
                  overflow:hidden;
                  text-overflow:ellipsis;
                  white-space:nowrap;
                  word-wrap: break-word;
                  word-break: break-all;
                }
            }
            .userData{
                color:#999999;
                font-size:3.24vw;
            //     span:nth-child(1)::after{
            //         content:'.';
            //         display:inline-block;
            //         width:4vw;
            //         position:relative;
            //         top:-1vw;
            //         text-align: center;
            //   }
            }
        }
    }
    .commentListImg{
        width:93%;
        // height:20.37vw;
        margin:auto;
        display:flex;
        justify-content: space-between;
        position:relative;
        .imgOne{
            width:30.09vw;
            height:30.09vw;
            border-radius: 1vw;
            overflow: hidden;
            img{
                width:100%;
                height:100%;
                object-fit: cover;
            }
            .mask{
                width:30.09vw;
                height:30.09vw;
                display:flex;
                align-items: center;
                background-color:rgba(0,0,0,.2);
                position:absolute;
                top:0;
                right:0;
                border-radius: 1vw;
                color:white;
                font-size:4.44vw;
                text-align: center;
                justify-content: center;
                span:nth-child(1){
                    .activityAdd{
                        font-size:3vw;
                    }
                    margin-top:-0.5vw;
                }
            }
        }
        // 表示答案列表只有一张图的时候
        .imageOne{
            width:100vw;
            height:100vw;
            border-radius: 1vw;
            overflow: hidden;
            position: relative;
            img{
                width:100%;
                height:100%;
                object-fit: cover;
                position: absolute; // 这里给图片定位，是为了让图片显示图片的中间部分
                top:0;
                left:0;
                right:0;
                bottom:0;
                margin:auto;
            }
        }
        // 表示两张图片的时候
        .imgTwo{
            width:49.2%;
            position:relative;
            height:46vw;
            img{
                width:100%;
                height:100%;
                object-fit: cover;
                position: absolute; // 这里给图片定位，是为了让图片显示图片的中间部分
                top:0;
                left:0;
                right:0;
                bottom:0;
                margin:auto;
            }
        }
        // 表示三张图片的时候
        .imageThree{
            display:flex;
            width:30.09vw;
            height:30.09vw;
            img{
                width:100%;
                height:100%;
                object-fit: cover;
            }
        }
    }
    .divide{
        justify-content: space-between;
    }
    .commentContent{
        width:93%;
        margin:auto;
        .smallH{
            width:100%;
            font-size:4vw;
            color:#444444;
            word-wrap: break-word;
            word-break: break-all;
        }
        .content{
            width:100%;
            height:18.74vw;
            font-size:4vw;
            color:#444444;
            overflow: hidden;
            text-overflow:ellipsis;//文本溢出显示省略号
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            word-wrap: break-word;
            word-break: break-all;
        }
        .contentDetail{
            padding-top:1vw;
            display:flex;
            color:#999999;
            font-size:4vw;
            span{
                margin-right:5.74vw;
            }
        }
    }
    .splitLine{
        width:100%;
        height:3vw;
        background-color:rgb(235, 235, 235);
    }
  }
</style>
