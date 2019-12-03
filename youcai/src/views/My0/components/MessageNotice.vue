<template>
<transition name="mySet">
    <div class="msgWrap">
        <div class="msgNoticeHead" @click="cancelShow">
        </div>
        <div class="msgNoticeMain">
            <div class="msgNoticeTitle borderB">
                <span class="title">新消息通知</span>
                <span class="cancel" @click="cancelShow">
                    <i class="iconWanwan iconWquxiao activityNotice"></i>
                </span>
            </div>
            <ul>
                <li class="borderB" @click="handleNoticeOne()">
                    <span>非关注好友评论通知</span>
                    <div :class="['noticeBtn',{changeBtn: isOne}]">
                        <span :class="{changeRed: isOne}" ref="one"></span>
                    </div>
                </li>
                <li class="borderB" @click="handleNoticeTwo()">
                    <span>非关注好友@通知</span>
                    <div :class="['noticeBtn',{changeBtn: isTwo}]">
                        <span  :class="{changeRed: isTwo}" ref="two"></span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</transition>
</template>

<script>
export default {
  data () {
    return {
      isOne: false,
      isTwo: false
    }
  },
  methods: {
    handleNoticeOne () {
      this.isOne = !this.isOne
      if (this.isOne) {
        this.$refs.one.style.transform = 'translateX(' + 5.5 + 'vw)'
      } else {
        this.$refs.one.style.transform = 'translateX(' + 0 + 'vw)'
      }
    },
    handleNoticeTwo () {
      this.isTwo = !this.isTwo
      if (this.isTwo) {
        this.$refs.two.style.transform = 'translateX(' + 5.5 + 'vw)'
      } else {
        this.$refs.two.style.transform = 'translateX(' + 0 + 'vw)'
      }
    },
    cancelShow () {
      this.$emit('hiddleNotice')
    }
  }
}
</script>

<style lang="less" scoped>
.mySet-enter-active,.mySet-leave-active{
    transition:all 1s;
}
.mySet-enter,.mySet-leave-to{
    opacity:0;
}
.msgWrap{
    width:100%;
    height:100vh;
    position: fixed;
    top:0;
    left:0;
    z-index: 5000;
    .msgNoticeHead{
        width:100%;
        height:50%;
        background-color:rgba(0,0,0,.6);
    }
    .msgNoticeMain{
        background-color:white;
        width:100%;
        height:50%;
        padding-top:4vw;
        box-sizing: border-box;
        .msgNoticeTitle{
            width:100%;
            height:15vw;
            display: flex;
            justify-content: center;
            position:relative;
            .title{
                display:inline-block;
            }
            .cancel{
                position:absolute;
                right:4vw;
                .activityNotice{
                    color:#cccccc;
                    font-size:4vw;
                }
            }
        }
        ul{
            li{
                height:13.7vw;
                line-height:13.7vw;
                display:flex;
                justify-content: space-between;
                align-items: center;
                padding-left:4vw;
                padding-right:6vw;
                box-sizing: border-box;
                .noticeBtn{
                    border-radius: 4vw;
                    width:11.67vw;
                    height:6.11vw;
                    position: relative;
                    background-color:rgb(220, 220, 220);
                    border:1px solid rgb(220, 220, 220);
                    transition: all 0.5s;
                    span{
                        position:absolute;
                        top:0;
                        left:0;
                        display:inline-block;
                        width:5.5vw;
                        height:5.5vw;
                        border-radius: 50%;
                        background-color:white;
                        transition: all 0.5s;
                    }
                    .changeRed{
                        background:rgb(255, 255, 255);
                    }
                }
                .changeBtn{
                    background-color:rgb(255, 39, 66);
                    border:1px solid rgb(255, 39, 66);
                }
            }
        }
    }
}
</style>
