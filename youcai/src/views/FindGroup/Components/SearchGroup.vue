<template>
  <div class="findGroup">
    <div :class="['findMainTop',{findMainTopNoHeight: isShow}]"
         id="findMain">
      <div class="findInput"
           v-show="!isShow">
        <span class="search">
          <i class="iconWanwan iconWsearch activityNotice "></i>
        </span>
        <input type="search"
               placeholder="输入群组关键字"
               v-model="userWord"
               @keyup.enter="getSearchUser">
        <span class="goSearch"
              @click="getSearchUser">搜索</span>
        <span class="clear"
              v-if="userWord"
              @click="clearWord"><i class="iconWquxiao-copy-copy iconWanwan activityNotice"></i></span>
      </div>
      <div :class="['findTool','borderB']"
           v-show="!isShow">
        <div class="one"
             v-show="!isShow">
          <div class="btnWrap"
               @click="goCreate">
            <span class="people">
              <i class="iconWanwan iconWduoren-copy activityNotice "></i>
            </span>
            <span>创建群组</span>
          </div>
        </div>
        <div class="two"
             v-show="!isShow">
          <div class="btnWrap"
               @click="goActivityPost">
            <span class="qiqiu">
              <i class="iconWanwan iconWqiqiu_Solid activityNotice "></i>
            </span>
            <span>创建活动</span>
          </div>
        </div>
      </div>
    </div>
    <div class="findMainMiddle">
      <ul>
        <li @click="handleInterest(1,'推荐')">
          <span class="headTui">
            <i class="iconWanwan iconWtouxiang activityNotice "></i>
          </span>
          <span :class="['footer',{special:interestIndex === 1}]">推荐</span>
        </li>
        <li @click="handleInterest(2, '交友')">
          <span class="headFu">
            <i class="iconWanwan iconWjiaoyou activityNotice "></i>
          </span>
          <span :class="['footer',{special:interestIndex === 2}]">交友</span>
        </li>
        <li @click="handleInterest(3, '生活')">
          <span class="headYou">
            <i class="iconWanwan iconWhi1 activityNotice "></i>
          </span>
          <span :class="['footer',{special:interestIndex === 3}]">生活</span>
        </li>
        <li @click="handleInterest(4, '兴趣')">
          <span class="headSheng">
            <i class="iconWanwan iconWxingqu activityNotice "></i>
          </span>
          <span :class="['footer',{special:interestIndex === 4}]">兴趣</span>
        </li>
        <li @click="handleInterest(5, '玩乐')">
          <span class="headXin">
            <i class="iconWanwan iconW1122-v2-03 activityNotice "></i>
          </span>
          <span :class="['footer',{special:interestIndex === 5}]">玩乐</span>
        </li>
        <li @click="handleInterest(6, '运动')">
          <span class="headYun">
            <i class="iconWanwan iconWyundong activityNotice "></i>
          </span>
          <span :class="['footer',{special:interestIndex === 6}]">运动</span>
        </li>
      </ul>
    </div>
    <div class="findMainBottom"
         v-if="groupList.length">
      <scroll ref="scroll"
              :listenScroll=true
              :data="groupList"
              :scrollbar="scrollbarObj"
              :pullDownRefresh="pullDownRefreshObj"
              :pullUpLoad="pullUpLoadObj"
              :startY="parseInt(startY)"
              @pullingUp="onPullingUp"
              @scroll="scroll">
        <groupItem @click.native='goGroupInfo(oneGroup)'
                   v-for="(oneGroup,index) in groupList"
                   :key="index"
                   :item="oneGroup"></groupItem>
      </scroll>
    </div>
    <div>
      <NotFound :failTitle="failTitle"
                v-if="isFail"></NotFound>
    </div>
  </div>
</template>

<script>
import NotFound from '@/components/requestState/NotFound'
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
import groupItem from '@/components/List/groupItem'
import {mapState} from 'vuex'
export default {
  mixins: [scrollMixin],
  data () {
    return {
      findMainHeight: '',
      isChecked: false, // 表示是否点击
      yHeight: 0, // scroll的高度
      isShow: false,
      interestIndex: 1,
      interestTitle: '',
      userWord: '', // 搜索关键字
      groupList: [], // 搜索用户列表
      isLoad: false, // 是否正在加载
      isFail: false, // 是否加载失败
      failTitle: '没有找到该群哦',
      pullDownRefresh: false,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: true,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更多数据了',
      isLoading: true,
      curPage: 1,
      pageSize: 5
    }
  },
  components: {
    NotFound,
    scroll,
    groupItem
  },
  computed: {
    ...mapState(['pos'])
  },
  watch: {
    userWord (newV) {
      if (newV.length <= 0) {
        this.groupList = []
      }
    }
  },
  mounted () {
    this.getRecommendGroupList()
  },
  methods: {
    showSearch (height) {
      this.yHeight = height
      this.isShow = false
    },
    hiddleSearch (height) {
      this.isShow = true
      this.yHeight = height
    },
    goCreate () {
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
      this.$router.push({ name: 'groupCreate' })
    },
    goActivityPost () {
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
      this.$router.push({ name: 'activityPost' })
    },
     /**
     * handleInterest （） 改变推荐群组的列表
     */
    handleInterest (index, title) {
      this.isChecked = true
      this.interestIndex = index
      this.interestTitle = title
      this.curPage = 1
      this.groupList.length = 0
      this.getRecommendGroupList()
      this.clearWord()
    },
     /**
     * 得到搜索的用户
     */
    getSearchUser () {
       this.groupList.length = 0
       this.curPage = 1
       let me = this
       if (this.userWord.length >= 12) {
         this.$toast('关键字长度不能大于12', 500)
         return
       } else if (this.userWord.length <= 0) {
         this.$toast('请输入正确的关键字', 500)
         return
       } else {
        //  me.isLoad = true
        let myStr = me.userWord.toString()
        let myUrl = ''
        if (me.pos.longitude && me.pos.latitude) {
          myUrl = `UserGroup?SearchWord=${myStr}&Lon=${me.pos.longitude}&Lat=${me.pos.latitude}&PageIndex=${me.curPage}&PageSize=${me.pageSize}`
        } else {
          myUrl = `UserGroup?SearchWord=${myStr}&PageIndex=${me.curPage}&PageSize=${me.pageSize}`
        }
         me.api.get({
          url: myUrl,
          success: function (res) {
            me.curPage === 1 && (me.groupList = [])
            me.groupList = me.groupList.concat(res)
            if (me.groupList.length > 0) {
              me.isLoad = false
              me.isFail = false
            } else if (me.groupList.length === 0) {
              me.isLoad = false
              me.isFail = true
            }
          },
          error: function (res) {
            me.$msg.showError(res.msg)
            me.$refs.scroll && me.$refs.scroll.forceUpdate()
          },
          complete: function () {
            me.$refs.scroll && me.$refs.scroll.forceUpdate()
            me.isLoad = false
          }
         })
       }
    },
    onPullingUp () {
      // 更新数据
      this.curPage++
      if (!this.userWord) {
        this.getRecommendGroupList()
      } else {
        this.getSearchUser()
      }
    },
    /**
     * clearWord清掉关键字
     */
    clearWord () {
      this.userWord = ''
      this.isFail = false
    },
    goGroupInfo (item) {
      this.$router.push({ name: 'groupInfo', params: { id: item.userGroupId} })
    },
    /**
     * getRecommendGroupList 得到推荐群组的列表
     */
    getRecommendGroupList () {
      let me = this
      let myUrl = ''
        if (me.interestIndex === 1) { // 表示默认是推荐列表
          if (me.pos.longitude && me.pos.latitude) {
            myUrl = `UserGroupList/id?Lon=${me.pos.longitude}&Lat=${me.pos.latitude}&PageIndex=${me.curPage}&PageSize=${me.pageSize}`
          } else {
            myUrl = `UserGroup?PageIndex=${me.curPage}&PageSize=${me.pageSize}`
          }
        } else { // 表示不是推荐列表
          if (me.pos.longitude && me.pos.latitude) {
            myUrl = `UserGroupList/id?Lon=${me.pos.longitude}&Lat=${me.pos.latitude}&PageIndex=${me.curPage}&PageSize=${me.pageSize}&LableCategory=${me.interestTitle}`
          } else {
            myUrl = `UserGroup?PageIndex=${me.curPage}&PageSize=${me.pageSize}&LableCategory=${me.interestTitle}`
          }
        }
      me.api.get({
        url: myUrl,
        success: function (res) {
          me.curPage === 1 && (me.groupList = [])
          me.groupList = me.groupList.concat(res)
        },
        error: function () {
          me.$refs.scroll && me.$refs.scroll.forceUpdate()
        },
        complete: function () {
          me.$refs.scroll && me.$refs.scroll.forceUpdate()
          // me.isLoading = false
        }
      })
    },
    scroll (pos) {
      this.scrollY = Math.abs(Math.round(pos.y))
      if (this.scrollY <= 150) {
        if (this.isChecked && this.isShow) {
          return
        } else {
         this.showSearch(this.scrollY)
        }
      } else {
         this.hiddleSearch(this.scrollY)
         this.isChecked = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .findGroup{
            width:100%;
            height:100%;
            margin-top:4vw;
            position:relative;
            left:0;
            top:0;
            z-index: 2vw;
             .findMainTop{
                width:100%;
                height:29.63vw;
                transition: all 0.5s;
                 .findInput{
                    width:80vw;
                    margin-left:4vw;
                    height:10.37vw;
                    border-radius: 5vw;
                    background-color:#f3f3f3;
                    position:relative;
                    .search{
                        display:inline-block;
                        width:15vw;
                        height:100%;
                        line-height:10.37vw;
                        text-align: center;
                        .activityNotice{
                            color:#cdcdcd;
                            font-size:5vw;
                        }
                    }
                    input{
                        width:60vw;
                        background-color:#f3f3f3;
                        border:none;
                        outline: none;
                        color:#999;
                        font-size:4.5vw;
                    }
                    input::-webkit-input-placeholder {
                    /* placeholder颜色  */
                    color: #cdcdcd;
                    }
                    .goSearch{
                      width:10.37vw;
                      height:10.37vw;
                      position:absolute;
                      top:0;
                      right:-13vw;
                      line-height:10.37vw;
                    }
                    .clear{
                      width:4.5vw;
                      height:4.5vw;
                      position:absolute;
                      top:0;
                      bottom:0;
                      margin:auto 0;
                      right:2vw;
                      line-height:4.5vw;
                      text-align: center;
                      border-radius: 50%;
                      color:white;
                      background:rgb(140, 140, 140);
                    }
                 }
                .findTool{
                    width:100%;
                    height:19.17vw;
                    display:flex;
                    font-size:3.7vw;
                    color:#333;
                    .one{
                        width:46.3vw;
                        height:100%;
                        display:flex;
                        justify-content: center;
                        align-items: center;
                        position: relative;
                        .btnWrap{
                          .people{
                            margin-right:2vw;
                            .activityNotice{
                                font-size:8vw;
                                color:rgb(11, 220, 207);
                            }
                          }
                        }
                     }
                    .one::after{
                        content:'';
                        width:0.2vw;
                        height:10vw;
                        position:absolute;
                        top:0;
                        right:0;
                        bottom:0;
                        margin:auto 0;
                        background:#ebebeb;
                    }
                    .two{
                        width:46.3vw;
                        height:100%;
                        display:flex;
                        justify-content: center;
                        align-items: center;
                        .qiqiu{
                            margin-right:2vw;
                            .activityNotice{
                                font-size:7vw;
                                color:#fd7098;
                            }
                        }
                    }
                }
            }
            .findMainTopNoHeight{
              height:0;
              transition: all 0.25s;
              overflow: hidden;
            }
            .findMainMiddle{
                width:100%;
                height:24.53vw;
                overflow-x: scroll;
                background:white;
                overflow-y: hidden;
                ul{
                    display:flex;
                    min-width:147vw;
                    height:24.53vw;
                    position:relative;
                    z-index:2;
                    background:white;
                    li{
                        width:22.59vw;
                        height:24.53vw;
                        display:flex;
                        flex-flow: row wrap;
                        text-align: center;
                        align-content: center;
                        .headTui{
                            margin-top:0vw;
                            display:block;
                            width:100%;
                            height:6.69vw;
                            color:#999;
                            font-size:6.2vw;
                            .activityNotice{
                                color:#33d7f5;
                                font-size:6.5vw;
                            }
                        }
                        .headFu{
                            display:block;
                            width:6.69vw;
                            height:6.69vw;
                            margin:auto;
                            text-align: center;
                            .activityNotice{
                                color:rgb(250, 191, 0);
                                font-size:6.2vw;
                            }
                        }
                        .headYou{
                            display:block;
                            width:6.69vw;
                            height:6.69vw;
                            margin:auto;
                            text-align: center;
                            .activityNotice{
                                color:#fe63c8;
                                font-size:6vw;
                                position:relative;
                            }
                        }
                        .headSheng{
                            display:block;
                            width:6.69vw;
                            height:6.69vw;
                            margin:auto;
                            text-align: center;
                            .activityNotice{
                                color:#fe3c00;
                                font-size:6vw;
                            }
                        }
                        .headXin{
                            display:block;
                            width:6.69vw;
                            height:6.69vw;
                            margin:auto;
                            text-align: center;
                            .activityNotice{
                                color:rgb(255, 133, 136);
                                font-size:6.5vw;
                            }
                        }
                        .headYun{
                          display:block;
                            width:6.69vw;
                            height:6.69vw;
                            margin:auto;
                            text-align: center;
                            .activityNotice{
                                color:rgb(199, 128, 253);
                                font-size:6.5vw;
                            }
                        }
                        .footer{
                            margin-top:2vw;
                            display:block;
                            width:100%;
                            height:6.69vw;
                            color:#999;
                            font-size:3.33vw;
                            line-height:7vw;
                        }
                        .special{
                            font-size:5.18vw;
                            color:#333;
                            font-weight: bold;
                            line-height:7vw;
                        }
                    }
                }
            }
            .findMainBottom{
                width:100%;
                height:calc(100vh - 53.6vw);
                overflow: hidden;
            }
        }
</style>