<template>
  <div class="nameColorPage">
    <div class="fixHead">
      <div class="fixHeadBg"
           :style="fixHeadBgStyle"></div>
      <div class="headNav">
        <span @click="go.back()"
              class="navbarBack"><i class="iconWfanhui iconWanwan activityNotice"></i></span>
        <span class="title">
          <span class="titleInner">昵称特效</span>
        </span>
      </div>
      <div class="tryHead">
        <div class="nameWrap">
          <textEffect :effect="curEffect.Ename"
                      :text='user.nickName'></textEffect>
        </div>
        <span :class="['setHangerBtn', { noClick: !curEffect.name }]">使用特效<i class="vipTip">VIP</i></span>
      </div>
    </div>
    <div class="nameContent hangerContent">
      <scroll
      :bounce='false'
      :listenScroll='true' 
      :listenScrollEnd='true'
      @scroll='scroll'
      @scroll-end='scroll'>
        <div class="hangerListItem"
            v-for="(value, key) in textEffect"
            :key="key">
          <div class="hangerListTit">{{ key }}</div>
          <div class="hangerList">
            <div class="hangerItem"
                v-for="(item, index) in value"
                :key="index">
              <div :class="['hangerImgWrap', {'curItem': item === curEffect}]"
                  @click="setCurItem(item)">
                <textEffect :effect="item.Ename"></textEffect>
              </div>
              <p class="hangerItemName">{{ item.name }}</p>
            </div>
          </div>
        </div>
      </scroll>
    </div>
    <toBeVIPBar info='众多挂件，秀出与众不同的你！' :show='showBeVIP'></toBeVIPBar>
  </div>
</template>

<script>
import { mapState } from 'vuex'
const textEffect = resolve =>
  require(['@/components/TextEffect/textEffect'], resolve)
import toBeVIPBar from '@/components/Vip/ToBeVIPBar'
import scroll from '@/components/scroll/scroll'
export default {
  components: {
    toBeVIPBar,
    textEffect,
    scroll
  },
  data() {
    return {
      showBeVIP: true,
      defaultUserAvatar: require('@/assets/images/userBg.jpg'),
      curName: this.$route.params.curName,
      curEffect: {},
      textEffect: {
        动态特效: [
          {
            Ename: 'aniBop',
            name: '放大动效'
          },
          {
            Ename: 'aniBopB',
            name: '倾斜动效'
          },
          {
            Ename: 'textFill',
            name: '彩色变换'
          },
          {
            Ename: 'twinkling',
            name: '细体闪烁'
          },
          {
            Ename: 'blodTwinkling',
            name: '粗体闪烁'
          },
          {
            Ename: 'stokeTwinkling',
            name: '镂空闪烁'
          },
          {
            Ename: 'imgText',
            name: '多彩变幻'
          },
          {
            Ename: 'textFillLight',
            name: '流光文字'
          },
          {
            Ename: 'frozen',
            name: '冰霜效果'
          },
        ],
        彩色昵称: [{
            Ename: 'singleBlack',
            name: '黑'
          },
          {
            Ename: 'singleRed',
            name: '红'
          },
          {
            Ename: 'singleOrange',
            name: '橙'
          },
          {
            Ename: 'singleYellow',
            name: '黄'
          },
          {
            Ename: 'singleGreen',
            name: '绿'
          },
          {
            Ename: 'singleBlue',
            name: '蓝'
          },
          {
            Ename: 'singleChing',
            name: '青'
          },
          {
            Ename: 'singlePurple',
            name: '紫'
          },
          {
            Ename: 'singleDuoRed',
            name: '多录红'
          }
        ],
        彩色渐变: [
          {
            Ename: 'gradientB',
            name: '竖向蓝红渐变'
          },
          {
            Ename: 'gradientR',
            name: '横向蓝红渐变'
          },
          {
            Ename: 'gradientX',
            name: '角度蓝红渐变'
          }
        ],
        静态特效: [
          {
            Ename: 'fire',
            name: '火焰字体'
          },
          {
            Ename: 'textStoke',
            name: '镂空字体'
          },
          {
            Ename: 'threeDNormal',
            name: '3D字体'
          },
          // {
          //   Ename: 'blurText',
          //   name: '模糊字体',
          // },
          // {
          //   Ename: 'lightText'
          // },
          {
            Ename: 'textShadow--img',
            name: '颗粒阴影'
          },
          {
            Ename: 'textShadow--threeD',
            name: '3D阴影'
          },
          {
            Ename: 'textShadow--normal',
            name: '阴影效果'
          }
        ]
      }
    }
  },
  computed: {
    ...mapState(['user']),
    avatarPath() {
      let avatar = this.user.avatar
      return (avatar &&
        avatar.length >= 1 &&
        avatar.indexOf('http') === 0 &&
        avatar !== this.$store.state.avatarDefault)
        ? avatar
        : this.defaultUserAvatar
    },
    fixHeadBgStyle() {
      return {
        backgroundImage: `url(${this.avatarPath})`,
        backgroundSize: '100%'
      }
    }
  },
  watch: {
    curName: {
      immediate :true,
      handler: function (newV) {
        this.computeCurName(newV)
      }
    }
  },
  methods:{
    setCurItem (item) {
     this.curEffect = item 
    },
    computeCurName (name) {
      if (name) {
        for (let key in this.textEffect) {
          this.textEffect[key].map((item) => {
            item.name === name && (this.curEffect = item)
          })
        }
      }
    },
    scroll (pos) {
      this.showBeVIP = pos.y >= -100
    }
  }
}
</script>

<style lang="less">
@import url("~@/assets/less/fixHead.less");
.nameColorPage {
  padding-top: 60vw;
  .fixHead {
    height: 60vw;
    // .headNav .navbarBack,
    // .title{
    //   color: #333;
    // }
    // .fixHeadBg{
    //   &::after{
    //     background-color: rgba(255,255,255,0.5);
    //   }
    // }
    .tryHead {
      display: block;
      text-align: center;
      .nameWrap {
        width: 70vw;
        height: 20vw;
        margin: 10vw auto 5vw;
        line-height: 20vw;
        text-align: center;
        background-color: #fff;
        border-radius: 4vw;
      }
      .setHangerBtn {
        margin: 0 auto;
      }
    }
  }
  .hangerContent{
    height: calc(100vh - 60vw);
    background-color: #efefef!important;
    .hangerListItem{
      background-color: #efefef!important;
    }
    .hangerImgWrap {
      background-color: #fff !important;
    }
  }
  
}
</style>
