<template>
  <div class="taskSignWrap"
       v-show="show"
       @click='hideSignTab'>
    <div class="signTab"
         @click.stop>
      <p class="signTxt">登录第{{item.countOperate + 1}}天，获得{{item.progressArr[item.countOperate].code}}个积分</p>
      <task-progress class="signProgress"
                     key='signTab'
                     :short='true'
                     :item='item'
                     @clickTreasuer='hideSignTab'
                     @addCode='addCode'></task-progress>
      <p class="signBtn"
         @click='signTask'>立刻签到</p>
      <p class="signClose"
         @click="hideSignTab">x</p>
    </div>
  </div>
</template>
<script>
import taskProgress from '@/components/Task/TaskProgress'
export default {
    components: {
        taskProgress
    },
    props:{
        item: {
            type: Object,
            default: (()=>{
                return {}
            })
        },
        show:{
            type: Boolean,
            default:  false
        }
    },
    methods:{
        hideSignTab (){
            this.$emit('hideSignTab')
        },
        signTask () {
            this.$emit('signTask')
        },
        addCode (code) {
            this.$emit('addCode', code)
        }
    }
}
</script>
<style lang="less" scoped>
  .taskSignWrap{
    position: fixed;
    z-index: 10001;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background: rgba(0,0,0,0.5);
    .signTab{
        position: absolute;
        width: 79vw;
        top: 50%;
        left: 50%;
        padding:2vw 0;
        transform: translate3d(-50%, -50%, 0);
        margin-top: -20px;
        text-align: center;
        border-radius: 6px;
        background-color: #fff;
        .signClose{
            position: absolute;
            right: 0;
            top: 0;
            height: 10vw;
            width: 10vw;
            color: #888;
            font-size: 4.4vw;
            line-height: 10vw;
            text-align: center;
        }
        .signTxt{
            height: 13vw;
            line-height: 13vw;
            font-size: 5vw;
            text-align: center;
            font-weight: bold;
        }
        .signBtn{
            display: inline-block;
            height: 10vw;
            line-height: 10vw;
            padding: 0 14vw;
            margin: 7vw auto 2.6vw;
            font-size: 4.8vw;
            color: #505050;
            box-sizing: content-box;
            border: 1px solid #e1e1e1;
            border-radius: 5vw;
        }
    }
  }
</style>
