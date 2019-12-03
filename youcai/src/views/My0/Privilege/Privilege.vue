<template>
  <div class="privilegeDetailPage">
      <div :class="['topHead', {'isNotTop': noTop}]">
        <span @click="go.back()"
              class="navbarBack"><i class="iconWfanhui iconWanwan activityNotice"></i></span>
        <span class="title">
          <span class="titleInner">{{privilegeDetail.tit}}</span>
        </span>
      </div>
      <div class="topHeadBg"></div>
      <div :class="['privilegeContent', {'isNotTop': noTop}]">
          <scroll :bounce='false' 
          :listenScroll='true' 
          :listenScrollEnd='true'
          @scroll='scroll'
          @scroll-end='scroll'>
              <div class="bgHeader" ref='bgHeader'>
                  <i :class="['iconWanwan', privilegeDetail.iconCls, 'descIcon']"></i>
                  <p class="descInfo">{{privilegeDetail.descInfo}}</p>
              </div>
              <components :is='cmpName'></components>
          </scroll>
      </div>
      <toBeVIPBar v-if='!user.vipLevel' :info='privilegeDetail.beVIPSlogan'></toBeVIPBar>
  </div>
</template>

<script>
import { mapState } from 'vuex'
const scroll = resolve => require(['@/components/scroll/scroll'], resolve)
const toBeVIPBar = resolve => require(['@/components/Vip/ToBeVIPBar.vue'], resolve)
const film = resolve => require(['./components/Video.vue'], resolve)

const score = resolve => require(['./components/Score.vue'], resolve)
const overt = resolve => require(['./components/Overt.vue'], resolve)
const vote = resolve => require(['./components/Vote.vue'], resolve)
const photo = resolve => require(['./components/Photo.vue'], resolve)
const feedback = resolve => require(['./components/Feedback.vue'], resolve)
const unique = resolve => require(['./components/Unique.vue'], resolve)
export default {
    components: {
        scroll,
        toBeVIPBar,

        film,
        score,
        overt,
        vote,
        photo,
        feedback,
        unique
    },
    data () {
        return {
            cmpName: this.$route.params.curName,
            bgHeaderH: 0,
            noTop: false
        }
    },
    computed: {
        ...mapState(['user']),
        privilegeDetail () {
            let p = {}
            switch (this.cmpName) {
                case 'unique':
                        p = {
                            tit: '装扮特权',
                            iconCls: 'iconWicon29',
                            descInfo: 'VIP用户，获取你的专属头像装扮',
                            beVIPSlogan: '更多头像挂件，展示你的独立魅力！'
                        }
                        break
                case 'film':
                    p = {
                        tit: '发布特权',
                        iconCls: 'iconWshipin2',
                        descInfo: 'VIP用户，发布视频上限增加1分钟',
                        beVIPSlogan: '更长视频，展示更多的作品！'
                    }
                    break
                case 'overt':
                    p = {
                        tit: '外显特权',
                        iconCls: 'iconWvip',
                        descInfo: 'VIP图标，尊贵身份无处不在',
                        beVIPSlogan: 'VIP至尊身份看得见！'
                    }
                    break
                case 'vote':
                    p = {
                        tit: '投票特权',
                        iconCls: 'iconWtoupiao',
                        descInfo: 'VIP用户，投票每票相当于两票',
                        beVIPSlogan: '更多票数，快为喜欢的作品投票吧！'
                    }
                    break
                case 'score':
                    p = {
                        tit: '财富特权',
                        iconCls: 'iconWdkw_jifen',
                        descInfo: 'VIP用户，获取更多积分',
                        beVIPSlogan: '积分双倍，快去兑换积分礼物吧！'
                    }
                    break
                case 'photo':
                    p = {
                        tit: '展示特权',
                        iconCls: 'iconWzhaopianqiang',
                        descInfo: 'VIP用户，照片墙可以展示更多的照片',
                        beVIPSlogan: '更多照片，更好的展示自己！'
                    }
                    break
                case 'feedback':
                    p = {
                        tit: '反馈特权',
                        iconCls: 'iconWziyuan2',
                        descInfo: '反馈特权，更加快速处理您的反馈',
                        beVIPSlogan: '更快处理，使您更方便！'
                    }
                    break
                default:
                    break
            }
            return p
        }
    },
    mounted () {
        this.$nextTick(() => {
            setTimeout(() => {
                this.bgHeaderH = this.$refs.bgHeader.offsetHeight || 100
            }, 100)
        })
    },
    methods: {
        scroll (pos) {
            !this.bgHeaderH && (this.bgHeaderH = this.$refs.bgHeader.offsetHeight)
            this.noTop = (-pos.y >= this.bgHeaderH)
        }
    }
}
</script>

<style lang='less'>
  .privilegeDetailPage{
      .topHead{
            position: fixed;
            z-index: 100;
            height: 10vw;
            line-height: 10vw;
            color: #fff;
            background-color: transparent;
            &.isNotTop{
                color: #333;
            }
            .navbarBack {
                display: inline-block;
                width: 13.34vw;
                height: 13.34vw;
                line-height: 13.6vw;
                position: fixed;
                left: 7.5vw;
                top: 0;
                z-index: 100010;
            }

            .title {
                position: fixed;
                top: 0;
                z-index: 100000;
                width: 100%;
                height: 13.34vw;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 4.63vw;
            }
      }
      .topHeadBg{
          position: fixed;
          left: 0;
          top: 0;
          z-index: 10;
          width: 100vw;
          height: 13vw;
          background-color: #fff;
      }
      .privilegeContent{
          height: 100vh;
          position: relative;
          z-index: 20;
          overflow: hidden;
          &.isNotTop {
            z-index: 1;
          }
          .bgHeader{
              position: relative;
              z-index: 20;
              text-align: center;
              height: 53vw;
              background: url(../../../assets/images/vipPrivilege/vipBg.png) center center no-repeat;
              background-size: cover;
              padding: 13vw 0 5vw;
              .descIcon{
                display: inline-block;
                height: 26vw;
                font-size: 18vw;
                color: #cfac7d;
              }
              .descInfo{
                height: 12vw;
                line-height: 12vw;
                color: #ecd0a4;
                font-size: 4vw;
              }
          }
          .privilegeMain{
              .privilegeItem{
                  padding: 0 4vw;
                  color: #7f7f7f;
                  box-sizing: border-box;
                  .tit{
                      height: 14.4vw;
                      line-height: 14.4vw;
                      color: #000;
                      font-size: 5vw;
                  }
                  .info{
                      line-height: 5.7vw;
                      font-size: 3.9vw;
                  }
                  .formTable{
                      border-top: 1px solid #7f7f7f;
                      border-left: 1px solid #7f7f7f;
                      margin: 5vw auto;
                      .formTableLine{
                          display: flex;
                          align-items: center;
                          color: #6b6b6b;
                          border-bottom: 1px solid #7f7f7f;
                          &.color-Black{
                                color: #000;
                          }
                          &.color-light{
                              color: #bfbfbf;
                          }
                          .formLineItem{
                            text-align: center;
                            min-height: 10vw;
                            &.flexL {
                                width: 23vw;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            }
                            &.flexR {
                                flex: 1;
                                line-height: 10vw;
                                border-right: 1px solid #7f7f7f;
                                border-left: 1px solid #7f7f7f;
                            }
                            .desc{
                                display: block;
                                width: 100%;
                                height: 10vw;
                                line-height: 10vw;
                            }
                        }
                      }
                      
                  }
                  .imgShowWrap{
                      width: 86vw;
                      margin: 5vw auto 0;
                      padding-bottom: 5vw;
                  }
              }
          }
      }
  }
</style>