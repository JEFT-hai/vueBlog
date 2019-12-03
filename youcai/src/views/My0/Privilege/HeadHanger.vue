<template>
  <div class="headHangerPage">
    <div class="fixHead">
      <div class="fixHeadBg"
           :style="fixHeadBgStyle"></div>
      <div class="headNav">
        <span @click="go.back()"
              class="navbarBack"><i class="iconWfanhui iconWanwan activityNotice"></i></span>
        <span class="title">
          <span class="titleInner">头像挂件</span>
        </span>
      </div>
      <div class="tryHead">
        <div class="avatarWrap">
          <avatar class="avatar"
                  :item="user"
                  :canClick="false"
                  :size="20"
                  :hanger="curHanger"
                  :showOwnHanger='false'></avatar>
        </div>
        <div class="middleTxt">
          <span v-if="curHanger.name">正在试用"{{ curHanger.name }}"，赶紧设置挂件吧！</span>
          <span v-else>点击下方挂件试试吧！</span>
        </div>
        <span @click='setHanger' :class="['setHangerBtn', { noClick: !curHanger.name }]">使用挂件<i class="vipTip">VIP</i></span>
      </div>
    </div>
    <div class="hangerContent">
      <scroll :bounce='false'
              :listenScroll='true'
              :listenScrollEnd='true'
              @scroll='scroll'
              @scroll-end='scroll'>
        <div class="hangerListItem"
             v-for="(value, key) in headHanger"
             :key="key">
          <div class="hangerListTit">{{ key }}</div>
          <div class="hangerList">
            <div class="hangerItem"
                 v-for="(item, index) in value"
                 :key="index">
              <div :class="['hangerImgWrap', {'curItem': item === curHanger}]"
                   @click="setCurItem(item)">
                <img class="hangerImg"
                     :src="item.path"
                     alt="" />
              </div>
              <p class="hangerItemName">{{ item.name }}</p>
            </div>
          </div>
        </div>
      </scroll>
    </div>
    <toBeVIPBar info='众多挂件，秀出与众不同的你！'
                :show='showBeVIP'></toBeVIPBar>

  </div>
</template>

<script>
import headHanger from '@/assets/js/headHanger'

import toBeVIPBar from '@/components/Vip/ToBeVIPBar'
import scroll from '@/components/scroll/scroll'
import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    avatar: () => import('@/components/Avatar.vue'),
    scroll,
    toBeVIPBar
  },
  data() {
    return {
      defaultUserAvatar: require('@/assets/images/userBg.jpg'),
      headHanger: headHanger,
      curHanger: {},
      curName: this.$route.params.curName,
      showBeVIP: true, // 是否显示toBeVIPBar
      busy: false
    }
  },
  computed: {
    ...mapState(['user']),
    avatarPath() {
      let avatar = this.user.avatar
      return avatar &&
        avatar.length >= 1 &&
        avatar.indexOf('http') === 0 &&
        avatar !== this.$store.state.avatarDefault
        ? avatar.split('?name=')[0]
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
  methods: {
    ...mapMutations(['updateUserInfoItem']),
    setCurItem(item) {
      this.curHanger = item
    },
    computeCurName (name) {
      if (name) {
        for (let key in headHanger) {
          headHanger[key].map((item) => {
            item.name === name && (this.curHanger = item)
          })
        }
      }
    },
    scroll (pos) {
      this.showBeVIP = pos.y >= -100
    },
    setHanger () {
      if (!this.curHanger || !this.curHanger.name) {
        return
      }
      if (this.busy) {
        return
      }
      if (!this.user.vipLevel) {
        // this.$alert('您还不是VIP, 快去做任务领取积分兑换VIP吧')
        this.$confirm({
          'title': '头像挂件仅限VIP会员可用',
          'msg': '去开通VIP会员',
          type: 'confirm'
        }).then(() => {
          this.$router.push({
            name: 'beVIP'
          })
        })
        return
      }
      let me = this
      this.busy = true
      let avatar = me.user.avatar.split('?name=')[0]
      let setAvatar = `${avatar}?name=${me.curHanger.name}`
      this.api.process({
        url: 'userProfile',
        data: {
          user: {
            avatar: setAvatar
          }
        },
        success: function(){
          me.$toast(`设置头像挂件"${me.curHanger.name}"成功`)
          me.updateUserInfoItem({avatar: setAvatar})
        },
        complete: function(){
          me.busy = false
        }
      })
    },
  }
}
</script>
<style lang="less">
@import url("~@/assets/less/fixHead.less");
.headHangerPage {
  padding-top: 50vw;
  .hangerContent{
    height: calc(100vh - 50vw);
  }
}
</style>
