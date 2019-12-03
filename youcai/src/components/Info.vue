  <template>
  <div class="soli_discover_home">
    <div class="soli_discover_info">
      <div class="banner_box"><img class="item_img"
             :src="activityDetail.activityImg" /></div>
      <h1 style="position:relative;"><span class="share_page">分享</span></h1>
      <div class="time msg icon-shijian2  iconfont">活动时间<span>{{activityDetail.beginTime}} 至 {{activityDetail.endTime}}</span></div>
      <div @click='showBMap'
           class="address msg icon-jikediancanicon28  iconfont">活动地点<span>{{activityDetail.address}}</span></div>
      <div class="host msg icon-fangzi  iconfont">主办单位<span>{{activityDetail.sponsor}}</span></div>
      <div class="content">
        <p class="title">活动详情</p>
        <p>{{activityDetail.detail}}</p>
      </div>
      <div class="line"></div>
      <ul class="enroll">
        <li class="baoming">报名人员</li>
        <li class="peoples">
          <a href="javascript:;"
             v-for="(user,index) in activityDetail.joinUser"
             :key="index"><img :src="user.userAvator" /></a>
        </li>
        <li class="total"
            v-if="activityDetail.joinUser">总计{{activityDetail.joinUser.length}}人<span> &gt;</span></li>
      </ul>
      <div class="clearfix"></div>
      <router-link :to="{ name:'discuz', params: { id: 1} }"
                   class="link discuz_title"
                   v-if="activityDetail.activityComment">评论{{activityDetail.activityComment.length}}</router-link>
      <ul class="soli_list_fallow solid_list_discuz"
          v-if="activityDetail">
        <li v-for="(item,index) in activityDetail.activityComment"
            :key="index">
          <div class="head">
            <img :src="item.userAvator" />
            <div>
              <span class="user-title user-name">{{item.userName}}</span>
              <!-- <span class="iconhand nohand">{{item.commentCount}}</span> -->
            </div>
            <div class="clearfix"></div>
          </div>
          <div class="clearfix"></div>
          <div class="discuz_content">
            <div class="discuz">
              <span>{{item.commentDetail}}</span>
              <div class="reply"
                   v-if="item.replayCount">{{item.replayCount}} <a href="javascript:;">回复</a> · {{item.currentReply}}</div>
            </div>
            <ul v-if="item.replyUser">
              <li>
                <span>{{item.replyUser}}：</span>{{item.replyContent}}
              </li>
            </ul>
          </div>
          <div class="clearfix line3"></div>
        </li>
      </ul>
      <!-- 分界线 -->
      <div class="line"></div>
      <div class="applyactive">
        <router-link :to="{ name:'discuz', params: { id: 1} }"
                     class="link discuz_title"
                     v-if="isHide">12</router-link>
        <router-link :to="{ name:'discuz', params: { id: 1} }"
                     class="link addgroup"
                     v-if="isHide">加入群聊</router-link>
        <router-link :to="{name: 'discoverapply', params: { id: 1}}"
                     class="link apply canncel"
                     v-if="isHide">我要报名</router-link>
        <div class="publish-comment">
          <div class="comments"
               @click="isJoin">{{joinDescript}}</div>
          <div class="user-comment">
            <input type="text"
                   placeholder="留下你的精彩评论吧要死"
                   class="one"
                   v-model="inputContent">
            <input type="submit"
                   value="发表"
                   class="two"
                   @click="userSubmit">
          </div>
        </div>
      </div>
    </div>
    <transition name='toLeft'>
      <BMap v-if='showMap'
            :searchAddress='activityDetail.address'
            @hideBMapPage='hideMap'></BMap>
    </transition>
  </div>
</template>

<script>
import DiscoverHelper from './helper'
import BMap from '@/components/Bmap'
export default {
  data () {
    return {
      isHide: false,
      joinDescript: '报名',
      attend: false,
      activeComments: [], // 活动内页的评论数据
      inputContent: '', // 用户输入的评论内容
      activityDetail: {}, // 活动页的详情数据
      showMap: false
    }
  },
  components: {
    BMap
  },
  mounted () {
    let itemId = this.$route.params.id
    // eslint-disable-next-line
    axios.get('/mock/').then(res => {
      // 活动页数据
      let response = res.data.activities
      response.forEach(item => {
        if (item.id === itemId) {
          this.activityDetail = item
          this.activeComments = item.activityComment
        }
      })
    })
  },
  methods: {
    showBMap: function () {
      this.showMap = true
    },
    hideMap: function () {
      this.showMap = false
    },
    isJoin () {
      this.attend = !this.attend
      if (this.attend) {
        this.joinDescript = '已报名'
      } else {
        this.joinDescript = '报名'
      }
    },
    getAvatar (avatar) {
      return DiscoverHelper.GetUserAvatar(avatar)
    },
    userSubmit () {
      this.activeComments.push({
        'id': '1',
        'userAvator': this.$store.getters.userAvatar,
        'userName': '王五',
        'commentDetail': this.inputContent
      })
      this.inputContent = ''
    }
  }
}
</script>

<style lang="less" scope>
@import url(../../assets/less/pages.less);
.toLeft-enter,.toLeft-leave-active {
  left: 100vw;
}
.toLeft-enter-active,.toLeft-leave-active{
  transition: all 0.3s ease-in-out;
}
.applyactive .link.apply.canncel {
  color: #ffffff;
}
.item_img {
    width: 100%;
    height: 40vw;
  }
.applyactive {
  width: 100%;
  .publish-comment {
    width: 100%;
    height: 15vw;
    position: relative;
    .comments {
      width: 20vw;
      height:10vw;
      position: absolute;
      top:2.7vw;
      left:2vw;
      border-radius: 2vw;
      text-align: center;
      line-height: 10vw;
      color:red;
      border:1px solid red;
      &.on{
         color:gray;
      }
    }
    .user-comment {
      width: 75vw;
      height: 100%;
      position: absolute;
      top: 0;
      left: 23vw;
      .one {
        width: 55vw;
        height:60%;
        border-radius: 2vw;
        border:2px solid rgb(243, 243, 243);
        outline: none;
      }
      .two {
        width: 15vw;
        height: 100%;
        display:inline-block;
        background-color: white;
        border:none;
        color: #406599;
        border-radius: 1vw;
        outline: none;
      }
    }
  }
}
.head {
  position: relative;
  .user-name {
    position: absolute;
    left: 15vw;
    top: 4vw;
  }
}
</style>
