<template>
 <transition name="set">
  <div class="aboutBigWrap">
    <div class="title">
      <span class="backto" @click="back">
          <i class="iconWanwan iconWfanhui activityNotice"></i>
      </span>
      <span class="titleDes">关于</span>
    </div>
    <div class="aboutHead">
      <div class="imgWrap">
        <Logo></Logo>
      </div>
      <div class="aboutTitle">多录</div>
    </div>
    <div class="aboutMain">
      <ul class="aboutUl">
        <li class="borderB">
          <div class="aboutEach">
            <span>检测更新</span>
            <i class="iconWanwan iconWright activityNotice"></i>
          </div>
        </li>
        <li class="borderB" @click="handleFunc">
            <div class="aboutEach">
              <span>社区规范</span>
              <i class="iconWanwan iconWright activityNotice"></i>
            </div>
        </li>
        <li class="borderB" @click="handleAgreeMent">
            <div class="aboutEach">
              <span>服务条款</span>
              <i class="iconWanwan iconWright activityNotice"></i>
            </div>
        </li>
        <li class="borderB" @click="handlePrivacy">
            <div class="aboutEach">
              <span>隐私政策</span>
              <i class="iconWanwan iconWright activityNotice"></i>
            </div>
        </li>
      </ul>
      <div class="aboutBottom">
        <div class="aboutDes">
          <span class="banquan">多录&nbsp;版权所有</span>
          <span class="aboutTime">Copyright&nbsp;@&nbsp;2019&nbsp;szwanwan.com</span>
        </div>
      </div>
    </div>
    <Func v-show="hasMask && isShowFunc" @hiddleFunc="hiddleFunc"></Func>
    <Agreement v-show="hasMask && isShowAgreeMent" @hiddleAgreement="hiddleAgreement"></Agreement>
    <Privacy v-show="hasMask && isShowPrivacy" @hiddlePrivacy="hiddlePrivacy"></Privacy>
  </div>
 </transition>
</template>

<script>
import {mapState, mapMutations } from 'vuex'
import Func from './components/Func.vue'
import Agreement from './components/Agreement.vue'
import Privacy from './components/Privacy'
export default {
  data () {
    return {
      isShowAgreeMent: false,
      isShowPrivacy: false,
      isShowFunc: false
    }
  },
  components: {
    Logo: () => import('@/components/logo.vue'),
    Func,
    Agreement,
    Privacy
  },
  computed: {
    ...mapState(['hasMask']),
  },
  methods: {
    ...mapMutations({
      'setMask': 'setMask'
    }),
    back () {
      this.$router.back()
    },
    /**
     * handleAgreeMent显示用户协议
     */
    handleAgreeMent () {
      this.isShowAgreeMent = true
      this.setMask(true)
    },
    /**
     * hiddleAgreement 隐藏用户协议
     */
    hiddleAgreement () {
      this.isShowAgreeMent = false
      this.setMask(false)
    },
    /**
     * handleFunc 显示用户隐私
     */
    handleFunc () {
      this.isShowFunc = true
      this.setMask(true)
    },
    /**
     * 隐藏用户协议
     */
    hiddleFunc () {
      this.isShowFunc = false
      this.setMask(false)
    },
    /**
     * 显示社区协议
     */
    handlePrivacy () {
      this.isShowPrivacy = true
      this.setMask(true)
    },
    /**
     * 隐藏社区协议
     */
    hiddlePrivacy () {
      this.isShowPrivacy = false
      this.setMask(false)
    }
  }
}
</script>

<style lang="less" scoped>
.aboutBigWrap{
  width:100%;
  height:100vh;
  position:fixed;
  top:0;
  left:0;
  z-index:2000;
  background-color:white;
  &.set-enter-active,&.set-leave-active{
    transition:all 0.5s;
  }
  &.set-enter,&.set-leave-to{
    left:100vw;
    opacity: 5.2;
  }
  .title{
    width:100%;
    height:12vw;
    position:relative;
    display:flex;
    justify-content: center;
    align-items: center;
    .backto{
      display:inline-block;
      width:10vw;
      height:12vw;
      line-height:12vw;
      position:absolute;
      left:4vw;
    }
    .titleDes{
      color:#666;
    }
  }
  .aboutHead{
    width:100%;
    height:40vw;
    background-color:rgb(245, 245, 245);
    padding-top:5vw;
    .imgWrap{
      width:20vw;
      height:20vw;
      margin:auto;
    }
    .aboutTitle{
      width:20vw;
      height:9vw;
      text-align: center;
      margin:auto;
      margin-top:3vw;
      margin-bottom:5vw;
      font-size:5vw;
      color:rgb(127,127,127);
      letter-spacing: 1vw;
    }
  }
  .aboutMain{
    .aboutUl{
      width:100%;
      height:96vw;
      li{
        height:12vw;
        line-height:12vw;
        .aboutEach{
          width:95%;
          margin-left:5%;
          display:flex;
          justify-content: space-between;
          color:black;
          .activityNotice{
            margin-right:4vw;
            color:rgb(127,127,127);
          }
        }
      }
    }
    .aboutBottom{
      width:100%;
      height:30vw;
      background-color:rgb(245, 245, 245);
      position:fixed;
      bottom:0;
      left:0;
      .aboutDes{
        width:50vw;
        height:100%;
        margin:auto;
        display:flex;
        flex-flow: row wrap;
        justify-content: center;
        .banquan{
          margin-top:8vw;
          color:rgb(127,127,127);
        }
        .aboutTime{
          margin-top:-6vw;
          color:rgb(127,127,127);
          font-size:3vw;
        }
      }
    }
  }
}
</style>
