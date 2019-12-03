<template>
    <div class="businessHome">
        <span class="homeName">
            {{otherUserMsg.nickName}}
        </span>
        <div class="businessMiddle">
           <scroll ref="scroll"
                  :data="discountActivity"
                  :scrollbar="scrollbarObj"
                  :pullDownRefresh="pullDownRefreshObj"
                  :pullUpLoad="pullUpLoadObj"
                  :startY="parseInt(startY)"
                  @pullingDown="onPullingDown"
                  @pullingUp="onPullingUp"
              >
                <div class="myHomeHead">
                    <div class="myhomeImg">
                        <swiper :pictures="userImages" :elId="'activity_my'" v-if="userImages" />
                    </div>
                </div>
                <div class="myMainUp">
                    <div class="userAvator">
                        <div class="avatarWrap">
                            <img :class="{defaultStyle: otherUserMsg.avatar === null || otherUserMsg.avatar == '' || otherUserMsg.avatar == 'http://webapp.szwanwan.com/img/default/defaultavatar.png' || otherUserMsg.avatar === 'http://file.szwanwan.com:8888/group1/M00/00/48/rBpkyFzourOAHyA6AABbcMMe0wc315.png'}" :src="otherUserMsg.avatar"/>
                        </div>
                    </div>
                    <div class="userMsg">
                        <div class="user">
                            <span class="name">{{businessMsg.businessName}}({{businessMsg.city}})</span>
                        </div>
                        <div class="eachDetail">
                            <span>地址:&nbsp;{{businessMsg.street}}</span>
                            <span>类型:&nbsp;{{businessMsg.businessType}}</span>
                        </div>
                        <div class="time">营业日:&nbsp;{{businessMsg.week}}</div>
                        <div class="time">营业时间:&nbsp;{{time}}</div>
                    </div>
                </div>
                <div class="groupWrap" v-if="createGroupList.length">
                    <p>商家群组</p>
                    <div class="groupList">
                        <groupItem  :item="businessMsg" @click.native="goGroup(businessMsg)"></groupItem>
                    </div>
                </div>
                <div class="publishActivity">
                    <p>优惠活动</p>
                    <ShopItem v-for="(item,index) in discountActivity" :key="index" :item="item"></ShopItem>
                    <NotFound :failTitle="failTitle" v-if="!discountActivity.length"></NotFound>
                </div>
           </scroll>
        </div>
    </div>
</template>

<script>
import ShopItem from '@/views/Shop/components/shopItem'
import Swiper from './components/HomeSwiper'
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
import groupItem from '@/components/List/groupItem'
import {mapState} from 'vuex'
import NotFound from '@/components/requestState/NotFound'
export default {
  mixins: [scrollMixin],
  data () {
    return {
      failTitle: '他还没发布优惠哦!',
      userId : '',
      otherUserMsg: {}, // 别人信息
      businessId: this.$route.params.businessId,
      businessMsg:{}, // 商家信息
      pullDownRefresh: false,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: true,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更多数据了',
      isLoading: true,
      curPage: 1,
      pageSize: 7,
      discountActivity: [], // 优惠活动
      createGroupList: [], // 群组列表
    }
  },
  components:{
    Swiper,
    scroll,
    groupItem,
    NotFound,
    ShopItem
  },
  computed: {
      ...mapState(['pos']),
    userImages () {
      let arr = []
      this.businessMsg.images && this.businessMsg.images.map((item) => {
        arr.push(item)
      })
      let str = arr.join(' ,') || arr[0]
      return str
    },
     // 用户的头像
    // userAvatar () {
    //   let avatar = this.otherUserMsg.avatar === null || this.otherUserMsg.avatar === '' ? 'http://webapp.szwanwan.com/img/default/defaultavatar.png' : this.otherUserMsg.avatar
    //   return avatar
    // },
    time () {
      if (this.businessMsg.startTime == this.businessMsg.endTime) {
          return '24小时'
      }else {
        console.log('开始时间',this.businessMsg.startTime)
        let start = this.businessMsg.startTime && this.businessMsg.startTime.substring(11,16)
        console.log(start)
        let end = this.businessMsg.endTime && this.businessMsg.endTime.substring(11,16)
        console.log(end)
        return start + '-' + end
      }
    }
  },
  created () {
    this.getBusinessMsg()
  },
  methods: {
     /**
     * getBusinessMsg获得商家信息
     */
    getBusinessMsg () {
      let me = this
      me.api.get({
        url: `UserBusiness/businessId?businessId=${me.businessId}`,
        success: function (res) {
          me.businessMsg = res
          me.getOtherUser()
          if (me.otherUserMsg) {
            me.getCreateGropList()
            me.getDiscountActivityList()
          }
        }
      })
    },
    /**
     * getDiscountActivityList得到优惠活动列表
     */
    getDiscountActivityList () {
      let me = this
      me.api.get({
         url: `BusinessActivityList?UserBusinessId=${me.businessId}&PageIndex=${me.curPage}&PageSize=${me.pageSize}`,
         success: function(res) {
            me.curPage === 1 && (me.discountActivity = [])
            me.discountActivity = me.discountActivity.concat(res)
         },
         error: function (res) {
          me.$msg.showError(res.msg)
          me.$refs.scroll && me.$refs.scroll.forceUpdate()
        },
        complete: function () {
          me.$refs.scroll && me.$refs.scroll.forceUpdate()
        }
      })
    },
    onPullingDown () {
      this.curPage = 1
      this.getDiscountActivityList()
    },
    onPullingUp () {
      // 更新数据
      this.curPage++
      this.getDiscountActivityList()
    },
    /**
     * 得到其他用户的信息
     */
    getOtherUser () {
      let me = this
      me.api.get({
        url: `UserMain/userId?userId=${me.businessMsg.userId}`,
        success: function (res) {
          me.otherUserMsg = res
        }
      })
    },
        /**
     * getCreateGropList得到创建的群组列表
     */
    getCreateGropList () {
      let me = this
      let url = `UserGroupList?Lon=${me.pos.longitude}&Lat=${me.pos.latitude}&PageIndex=1&PageSize=50&GroupType=1&UserId=${me.businessMsg.userId}`
      me.api.get({
        url: url,
        success: function (res) {
          me.createGroupList = res
        },
        complete: function () {
          me.isLoad = false
        }
      })
    },
    goGroup (item) {
      this.$router.push({ name: 'groupInfo', params: { id: item.groupId} })
    }
  }
}
</script>

<style lang="less" scoped>
   .businessHome{
     width:100%;
     height:100%;
     .homeName{
        position:fixed;
        top:0;
        left:0;
        right:0;
        bottom:0;
        margin:0 auto;
        z-index: 1000;
        height:12vw;
        width:50vw;
        line-height:13.5vw;
        // font-size:4.25vw;
        font-weight: bold;
        // letter-spacing: 0.4vw;
        color:#333333;
        text-align: center;
     }
     .businessMiddle{
         height:calc(100vh - 12vw);
         overflow: hidden;
         .myHomeHead{
            padding-top:2vw;
            box-sizing: border-box;
            height:65vw;
            position:relative !important;
            .myhomeImg{
              width:100vw;
              height:65vw;
              overflow: hidden;
            }
         }
         .myMainUp{
              display: flex;
            //   height:20.56vw;
              .userAvator{
                width: 34.63vw;
                display:flex;
                align-items: center;
                justify-content: center;
                .avatarWrap{
                  width:25.56vw;
                  height:25.56vw;
                  border-radius: 50%;
                  box-shadow: 0px 0px 1px #efefef;
                  overflow: hidden;
                  position:relative;
                }
                img{
                  position:absolute;
                  top:0;
                  left:0;
                  right:0;
                  bottom:0;
                  margin:auto;
                  width: 100%;
                  height: 100%;
                  border-radius: 50%;
                }
                .defaultStyle{
                  width:20vw;
                  height:20vw;
                  border-radius: 0;
                 }
              }
              .userMsg{
                flex: 1;
                font-size:0;
                padding:0;
                margin:0;
                .user{
                  font-size:0;
                  padding-left:4vw;
                  box-sizing: border-box;
                  .name{
                    font-size:4.3vw;
                    color:#000000;
                  }
                }
                .one{
                  display:flex;
                  text-align: center;
                  font-size: 0;
                  height:13vw;
                  .each{
                    flex: 1;
                    span{
                      display: block;
                      color:#333333;
                      font-size:4vw;
                    }
                    .eachCount{
                      font-size:4vw;
                      margin-top:2.5vw;
                    }
                    .eachFont{
                      color:#999999;
                      margin-top:-1vw;
                      font-size:4vw;
                    }
                  }
                }
              }
              .eachDetail{
                    display:flex;
                    align-items: center;
                    color:#666;
                    font-size:4vw;
                    // height:7vw;
                    flex-flow: row wrap;
                    padding-left:4vw;
                    span{
                    margin-right:2vw;
                    width:100%;
                    display:flex;
                    flex-flow: row wrap;
                    }
                }
              }
              .time{
                  display:flex;
                    align-items: center;
                    color:#666;
                    font-size:4vw;
                    // height:7vw;
                    flex-flow: row wrap;
                    padding-left:4vw;
              }
         }
         .groupWrap{
             padding-top:5vw;
             box-sizing: border-box;
            p{
                padding-left:4vw;
                box-sizing: border-box;
                margin-bottom:3vw;
            }
         }
         .publishActivity{
             padding-top:5vw;
             box-sizing: border-box;
             p{
                 padding-left:4vw;
                 box-sizing: border-box;
                 margin-bottom:3vw;
             }
         }
   } 
</style>