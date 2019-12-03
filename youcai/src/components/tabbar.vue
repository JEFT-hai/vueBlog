<template>
  <div class="tabbar-container">
    <div class="weui-tabbar myBottom">
      <router-link :to="{'name':'index'}"
                   class="weui-tabbar__item routerItem"
                   :class="{'weui-bar__item_on':$route.name==='index'}">
        首页
      </router-link>
      <router-link :to="{'name':'activityHome'}"
                   class="weui-tabbar__item routerItem"
                   :class="{'weui-bar__item_on':$route.name==='activityHome'}">
        活动
      </router-link>
      <!-- <div href="javascript:;" class="weui-tabbar__item routerItem index_icon_share icon-add" @click="showPublish"></div> -->
      <div href="javascript:;"
           class="postUserAvatar"
           @click="showPublish">
        <!-- <i class="iconWanwan iconWjiahao activityNotice"></i> -->
        <img :src="iconImg"
             alt="">
      </div>
      <div class="weui-tabbar__item routerItem"
           :class="{'weui-bar__item_on':$route.name==='messageList'}"
           @click="toMessage">
        消息<span :class="['noRead',{specialOne: summaryMsg.UnCountRead > 9 && summaryMsg.UnCountRead < 100 }, {specialTwo: summaryMsg.UnCountRead >= 100 && summaryMsg.UnCountRead < 1000 },{specialThree: summaryMsg.UnCountRead >= 1000 && summaryMsg.UnCountRead < 10000 }, {specialFour: summaryMsg.UnCountRead >= 10000}]"
              v-if="summaryMsg.UnCountRead != 0">{{summaryMsg.UnCountRead | k}}</span>
      </div>
      <router-link :to="{'name':'my'}"
                   class="weui-tabbar__item routerItem"
                   :class="{'weui-bar__item_on':$route.name==='my'}">
        我的
      </router-link>
    </div>
    <div class="VFloat">
      <transition name="bottomBar">
        <div class="publish"
             v-show="myShow">
          <div class="mask"
               @click="cancel"></div>
          <div class="myPublish">
            <div class="ul">
              <transition enter-active-class="animated fadeInUp"
                          leave-active-class="animated fadeOutDown">
                <icon-grid v-show="myShow"
                           :list='iconList'
                           :iconBackground="iconBackground"
                           :img="{padding:'0.27rem'}"
                           :descColor="'#1f1f1f'"></icon-grid>
              </transition>
            </div>
            <div class="wrong iconfont icon-wrong"
                 @click="showPublish">取消</div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import { mapState,mapGetters, mapMutations} from 'vuex'
import IconGrid from '@/components/IconGrid'
import publish1 from '@/assets/iconImg/publish1.png'
// import publish4 from '@/assets/iconImg/publish4.png'
export default {
  data () {
    return {
      myShow: false,
      iconBackground: ['#ffaf44', '#73b8f8', '#36d7b6', '#f87f86'],
      iconList: [{
        id: '0001',
        imgUrl: publish1,
        desc: '动态',
        title: '动态',
        toUrl: 'discoverPost'
      }
      ]
    }
  },
  computed: {
    ...mapState('ws', {
        summaryMsg: 'summaryMsg'
    }),
    ...mapGetters(['hasBaseInfo']),
    iconImg(){
      return (!this.$store.state.user.avatar || this.$store.state.user.avatar === this.$store.state.avatarDefault) ?  require('@/assets/images/appIcon.png') : this.$store.state.user.avatar
    }
  },
  components: {
    IconGrid
  },
  methods: {
     ...mapMutations({
      'updetesummaryMsg.UnCountRead': 'updetesummaryMsg.UnCountRead'
    }),
    /**
     * toMessage去消息页
     */
    toMessage () {
      this.go.name('messageList', ['log'])
      // this.$router.push({name: 'message' })
    },
    cancel () {
      this.myShow = !this.myShow
    },
    showPublish () {
      if (!this.$store.state.isInApp) {
        window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=io.dcloud.H50D8112A'
        return
      }
      if (!this.authentication.isLogin()) {
        this.go.login()
        return
      }
      if (!this.$store.getters.hasBaseInfo()) {
        this.showConfirm.toPersonal()
        return
      }
      this.$router.push({ name: 'postPost' })
    },
    click (index) {
      this.$router.push({
        name: this.iconList[index].toUrl,
        params: {
          fade: 1,
          title: this.iconList[index].title
        }
      })
    }
  }
}
</script>
<style lang="less" scope>
.tabbar-container{
  height:12vw;
  margin-top:inherit !important;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC","Helvetica Neue",STHeiti,"Microsoft Yahei",Tahoma,Simsun,sans-serif;
  .myBottom{
    position: fixed;
    height:12vw;
    box-sizing: border-box;
    padding-bottom: 2px;
    background-color:white !important;
    box-shadow: 0 0 5px #ccc;
    // border:1px solid blue;
    &::before, &::after{
      display: none;
    }
  }
}
.weui-tabbar__item.routerItem{
  font-size: 4vw;
  color: #a2a2a2;
  padding: 0;
  line-height:calc(12vw - 2px);
  position:relative;
  .noRead{
    display:flex;
    position:absolute;
    top:1vw;
    right:1.3vw;
    width:4vw;
    height:4vw;
    background-color:rgb(255, 39, 66);
    border-radius: 50%;
    color:white;
    box-sizing: border-box;
    font-size:3vw;
    align-items: center;
    justify-content: center;
  }
  .specialOne{
    display:flex;
    position:absolute;
    top:1vw;
    right:1vw;
    width:5vw;
    height:4vw;
    background-color:rgb(255, 39, 66);
    border-radius: 4vw;
    color:white;
    box-sizing: border-box;
    font-size:3vw;
    align-items: center;
    justify-content: center;
  }
  .specialTwo{
    display:flex;
    position:absolute;
    top:1vw;
    right:-1vw;
    width:6.6vw;
    height:4vw;
    background-color:rgb(255, 39, 66);
    border-radius: 4vw;
    color:white;
    box-sizing: border-box;
    font-size:3vw;
    align-items: center;
    justify-content: center;
  }
  .specialThree{
    display:flex;
    position:absolute;
    top:1vw;
    right:-1vw;
    width:6vw;
    height:4vw;
    background-color:rgb(255, 39, 66);
    border-radius: 4vw;
    color:white;
    box-sizing: border-box;
    font-size:3vw;
    align-items: center;
    justify-content: center;
  }
  .specialFour  {
    display:flex;
    position:absolute;
    top:1vw;
    right:-2vw;
    width:7vw;
    height:4vw;
    background-color:rgb(255, 39, 66);
    border-radius: 4vw;
    color:white;
    box-sizing: border-box;
    font-size:3vw;
    align-items: center;
    justify-content: center;
  }
}
.weui-bar__item_on i {
  color: var(--main-color-tabbar);
  // font-weight: bolder;
}
.weui-bar__item_on.routerItem {
  color: #333;
  font-size:4.533vw !important;
  font-weight: bold;
}
.weui-tabbar__label{
  font-size:4.5vw !important;
}
.weui-badge {
  position: absolute;
  margin-left: 4.8vw;
  margin-top: -1.2vw;
}
.routerItem.postIcon{
  // position:relative;
}
.routerItem.postIcon{
  // display:flex;
  // justify-content: center;
  width:10vw !important;
  height:10vw !important;
  border:1px solid blue;
  border-radius: 50%;
  overflow: hidden;
  img{
    width:100%;
    height:100%;
    object-fit: cover;
  }
  // &::after{
  //     content: '';
  //     position: absolute;
  //     width: 12.78vw;
  //     height: 9.26vw;
  //     top: 50%;
  //     left: 50%;
  //     margin-top: -4.63vw;
  //     margin-left: -6.39vw;
  //     background: #ff2742;
  //     border-radius: 8px 8px 8px 8px;
  //   }
  // .activityNotice{
  //   color:white;
  //   z-index: 23;
  //   font-size:6vw;
  // }
}
.postUserAvatar{
  overflow: hidden;
  width:15vw;
  height:15vw;
  border-radius: 50%;
  position:relative;
  top:-4vw;
  background:white;
  box-shadow: 0 0 1px #ccc;
  img{
    width:11vw;
    height:11vw;
    object-fit: cover;
    border-radius: 50%;
    position:absolute;
    top:0;
    right:0;
    bottom:0;
    left:0;
    margin:auto;
  }
}
.weui-bar__item_on .icon-icon_home:before {
  content: "\e912";
}
.weui-bar__item_on .icon-icon_user:before {
  content: "\e91b";
}
.weui-bar__item_on .icon-icon_find:before {
  content: "\e91b";
}
.weui-bar__item_on .icon-icon_messenger:before {
  content: "\e91b";
}
.index_icon_share:before {
  content: '+';
  position: absolute;
  background-color: var(--main-color);
  border-radius: 50%;
  color: #fff;
  font-size: 32px;
  line-height: 9vw;
  width: 10vw;
  height: 10vw;
  display: inline-block;
  margin-left:-6.5vw;
  left:50.5vw;
  margin-top:0.5vw;
}
.tabbar_css1{display: inline-block;position: relative;}
.tabbar_css2{position: absolute;top: -2px;right: -13px;}
.tabbar_css3{position: absolute;top: 1px;right: -4px;}

.VFloat {
.publish {
position: fixed;
z-index: 99999;
top: 0;
bottom: 0;
left: 0;
right: 0;
.mask{
  background:rgba(0,0,0,.5);
  height:70%;
  width:100%;
  position:absolute;
  top:0;
}
.myPublish{
  height:30%;
  position:relative;
  top:124vw;
  background-color:white;
  z-index: 22;
}
.wrong {
position: absolute;
left: 0;
right: 0;
bottom:0;
text-align: center;
font-size: 4.6vw;
color:rgb(127,127,127);
letter-spacing:0.4vw;
line-height:20.741vw;
}
  .ul {
    position: absolute;
    bottom: 20.741vw;
    left: 0;
    right: 0;
  }
}
}
.weui-tabbar{
 .weui-badge{height:auto;}
  .item-img {
    width: 9.259vw;
    height: auto;
    margin-top: 3.889vw
  }
}
  .VFloat .IconGrid .item .item-icon .item-img {
    width: 7.407vw;
    height: auto;
    padding-top: 3.889vw;
  }
   .bottomBar-enter-active,.bottomBar-leave-active{
    transition: all 1s;
  }
  .bottomBar-enter,.bottomBar-leave-to{
    opacity: 0;
  }
</style>
