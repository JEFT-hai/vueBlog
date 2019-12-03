<template>
  <div class="innerSharePage">
    <div class="findInput">
      <span class="search">
        <i class="iconWanwan iconWsearch activityNotice "></i>
      </span>
      <input
        type="search"
        placeholder="请输入用户名或手机号搜索"
        v-model="userWord"
        @keyup.enter="getSearchUser"
        @focus="focusfns"
      />
      <span class="goSearch" @click="getSearchUser">搜索</span>
      <span class="clear" v-if="userWord" @click="clearWord"
        ><i class="iconWquxiao-copy-copy iconWanwan activityNotice"></i
      ></span>
    </div>
    <div class="innerTitle">
      <span :class="{ activity: index === 2 }" @click="handleIndex(2)"
        >我的群组</span
      >
      <span :class="{ activity: index === 1 }" @click="handleIndex(1)"
        >我的关注</span
      >
    </div>
    <div class="innerWrap">
      <scroll
        ref="scroll"
        :data="items"
        :scrollbar="scrollbarObj"
        :pullDownRefresh="pullDownRefreshObj"
        :pullUpLoad="pullUpLoadObj"
        :startY="parseInt(startY)"
        @pullingDown="onPullingDown"
        @pullingUp="onPullingUp"
      >
        <div class="noData" v-if="isShowNoFound">
          <NotFound :failTitle="failTitle"></NotFound>
        </div>
        <ul class="innerUlUser" v-show="index == 1 || index === 3">
          <UserMessage
            v-for="(eachUser, index) in items"
            :key="index"
            :userMessage="eachUser"
            :isAttentionId="isAttentionId"
            :isInnerShare="isInnerShare"
            @goInnerShare="goInnerShare"
          ></UserMessage>
        </ul>
        <ul class="innerUlGroup" v-show="index == 2">
          <group-item
            v-for="(item, index) in createGroupList"
            @click.native="goInnerShare(item, 'group')"
            :key="index - 5"
            :item="item"
          ></group-item>
          <group-item
            v-for="(item, index) in items"
            @click.native="goInnerShare(item, 'group')"
            :key="index"
            :item="item"
          ></group-item>
        </ul>
      </scroll>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import groupItem from '@/components/List/groupItem';
import UserMessage from '@/components/userMessage';
import scroll from '@/components/scroll/scroll';
import scrollMixin from '@/components/scroll/scrollMixin';
import { mapState } from 'vuex';
import NotFound from '@/components/requestState/NotFound';
export default {
  mixins: [scrollMixin],
  data() {
    return {
      isAttentionId: true,
      isInnerShare: false, // 表示是内部分享
      index: 2,
      pullDownRefresh: false,
      pullUpLoadTxt: '刷新成功',
      pullUpLoad: true,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '没有更多数据了',
      isLoading: true,
      items: [], // 关注的用户列表
      curPage: 1,
      pageSize: 6,
      createGroupList: [],
      userWord: '', // 搜索关键字
      innerData: JSON.parse(this.$route.params.innerShareData),
      conversationType: '',
      targetId: '',
      postUserName: '', // 发布帖子人的姓名
      postUserAvatar: '' // 发布帖子人的头像
    }
  },
  components: {
    scroll,
    UserMessage,
    groupItem,
    NotFound
  },
  computed: {
    ...mapState(['pos']),
    failTitle() {
      if (this.index === 1 && this.items.length <= 0) {
        return '还没有关注的好友哦';
      } else if (
        this.index === 2 &&
        this.items.length <= 0 &&
        this.createGroupList.length <= 0
      ) {
        return '还没有相关群哦';
      } else {
        return '';
      }
    },
    isShowNoFound() {
      if (this.index === 1 && this.items.length <= 0) {
        return true
      } else if (
        this.index === 2 &&
        this.items.length <= 0 &&
        this.createGroupList.length <= 0
      ) {
        return true
      } else {
        return '';
      }
    }
  },
  mounted() {
    this.getFollowList()
    this.getCreateGropList()
    this.$store.commit('setMusicInnerShow', false)
  },
  methods: {
    ...mapActions('ws', {
      sendShare: 'sendShare'
    }),
    /**
     * focusfns获得焦点
     */
    focusfns() {
      this.curPage = 1
    },
    /**
     * clearWord清掉关键字
     */
    clearWord() {
      this.userWord = '';
      this.index = 1
      this.curPage = 1
      this.items.length = 0
      this.getFollowList()
    },
    handleIndex(index) {
      this.index = index
      this.curPage = 1
      if (index === 2) {
        this.getCreateGropList()
        this.getFollowList()
      } else if (index === 1) {
        this.getFollowList()
      }
    },
    // 获取关注页的数据
    getFollowList() {
      let me = this
      let fansUrl = '';
      if (me.index === 1) {
        // 关注的用户列表
        fansUrl = `UserAttention/id?PageIndex=${me.curPage}&PageSize=${me.pageSize}`
      } else if (me.index === 2) {
        fansUrl = `UserGroupList?PageIndex=${me.curPage}&PageSize=${me.pageSize}&GroupType=2`
        if (me.pos.longitude && me.pos.latitude) {
          fansUrl = `${fansUrl}&Lon=${me.pos.longitude}&Lat=${me.pos.latitude}`
        }
      }
      me.api.get({
        url: fansUrl,
        success: function(res) {
          me.curPage === 1 && (me.items = [])
          me.items = me.items.concat(res)
        },
        error: function(res) {
          me.$msg.showError(res.msg)
          me.$refs.scroll && me.$refs.scroll.forceUpdate()
        },
        complete: function() {
          me.$refs.scroll && me.$refs.scroll.forceUpdate()
          me.isLoading = false
        }
      })
    },
    onPullingDown() {
      this.curPage = 1
      this.getFollowList()
    },
    onPullingUp() {
      // 更新数据
      this.curPage++
      if (this.index === 1 || this.index === 2) {
        this.getFollowList()
      } else if (this.index === 3) {
        this.getSearchUser()
      }
    },
    /**
     * getCreateGropList得到我创建的群组列表
     */
    getCreateGropList() {
      let me = this
      let url = 'UserGroupList?PageIndex=1&PageSize=50&GroupType=1';
      if (me.pos.longitude && me.pos.latitude) {
        url = `${url}&Lon=${me.pos.longitude}&Lat=${me.pos.latitude}`
      }
      me.api.get({
        url: url,
        success: function(res) {
          console.log('我创建的群组列表', res)
          me.createGroupList = res
        }
      })
    },
    /**
     * 得到搜索的用户
     */
    getSearchUser() {
      let me = this
      me.index = 3
      if (this.userWord.length >= 12) {
        this.$toast('关键字长度不能大于12', 500)
        return;
      } else if (this.userWord.length <= 0) {
        this.$toast('请输入正确的关键字', 500)
        return;
      } else {
        let myStr = me.userWord.toString()
        let SearchUrl = '';
        if (!me.pos.longitude && !me.pos.latitude) {
          SearchUrl = `UserRecommend/id?SearchWord=${myStr}&PageIndex=${me.curPage}&PageSize=${me.pageSize}`
        } else {
          SearchUrl = `UserRecommend/id?SearchWord=${myStr}&PageIndex=${me.curPage}&PageSize=${me.pageSize}&Longitude=${me.pos.longitude}&Latitude=${me.pos.latitude}`
        }
        me.api.get({
          url: SearchUrl,
          success: function(res) {
            if (!res.length && me.curPage === 1) {
              me.$toast('未找到相关用户')
            }
            me.curPage === 1 && (me.items = [])
            me.items = me.items.concat(res)
          },
          error: function() {
            me.$refs.scroll && me.$refs.scroll.forceUpdate()
          },
          complete: function() {
            me.$refs.scroll && me.$refs.scroll.forceUpdate()
          }
        })
      }
    },
    goInnerShare(item, type) {
      let tranformName = '';
      if (type === 'group') {
        this.targetId = item.userGroupId
        tranformName = item.groupName
      } else {
        if (item.attentionUserId) {
          this.targetId = item.attentionUserId
        } else {
          this.targetId = item.userId
        }
        tranformName = item.nickName
      }
      this.innerData.targetId = this.targetId
      this.innerData.name = tranformName
      this.innerData.conversationType = type
      this.innerData.postType = parseInt(this.innerData.postType)

      // console.log('打印这个音乐', this.innerData)
      // return;
      if (this.innerData.postUserId) {
        let p = this.getOtherUser(this.innerData.postUserId)
        p.then(() => {
          this.innerData.postUserAvatar = this.postUserAvatar
          this.innerData.postUserName = this.postUserName
          let newStr = JSON.stringify(this.innerData)
          this.innerData._this = this
          this.sendShare(this.innerData)
        })
      } else {
        let newStr = JSON.stringify(this.innerData)
        this.innerData._this = this
        this.sendShare(this.innerData)
      }
      // window.isInAndroid && window.WanAndroid.startConversation(type, this.targetId, tranformName)
      // window.isInAndroid && window.WanAndroid.duoluShare(newStr)
    },
    /**
     * 得到其他用户的信息
     */
    getOtherUser(userId) {
      return new Promise((resolve, reject) => {
        let me = this
        me.api.get({
          url: `UserMain/userId?userId=${userId}`,
          success: function(res) {
            me.postUserAvatar = res.avatar
            me.postUserName = res.nickName
            resolve()
          }
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.innerSharePage {
  width: 100vw;
  .findInput {
    width: 80vw;
    margin-left: 4vw;
    margin-top: 2vw;
    height: 10.37vw;
    border-radius: 5vw;
    background-color: #f3f3f3;
    position: relative;
    .search {
      display: inline-block;
      width: 15vw;
      height: 100%;
      line-height: 10.37vw;
      text-align: center;
      .activityNotice {
        color: #cdcdcd;
        font-size: 5vw;
      }
    }
    input {
      width: 60vw;
      background-color: #f3f3f3;
      border: none;
      outline: none;
      color: #999;
      font-size: 4.5vw;
    }
    input::-webkit-input-placeholder {
      /* placeholder颜色  */
      color: #cdcdcd;
    }
    .goSearch {
      width: 10.37vw;
      height: 10.37vw;
      position: absolute;
      top: 0;
      right: -13vw;
      line-height: 10.37vw;
    }
    .clear {
      width: 4.5vw;
      height: 4.5vw;
      position: absolute;
      top: 0;
      bottom: 0;
      margin: auto 0;
      right: 2vw;
      line-height: 4.5vw;
      text-align: center;
      border-radius: 50%;
      color: white;
      background: rgb(140, 140, 140);
    }
  }
  .innerTitle {
    width: 80vw;
    margin: auto;
    margin-top: 2vw;
    height: 7vw;
    display: flex;
    justify-content: space-around;
    span {
      display: inline-block;
      color: #999;
    }
    .activity {
      color: black;
    }
  }
  .innerWrap {
    width: 100%;
    margin-top: 2vw;
    height: calc(100vh - 36vw);
    overflow: hidden;
    .noData {
      padding-top: 5vw;
      box-sizing: border-box;
    }
  }
}
</style>
