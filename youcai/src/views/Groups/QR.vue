<template>
  <div class="QRpage">
    <div class="QRimgWrap">
      <img :src="QRImg"
           alt="">
      <div class='groupInfo borderT'>
        <div class="avatar">
          <img :src="groupInfo.groupCover"
               alt="">
        </div>
        <div class="groupDesc">
          <p class="groupName">{{groupInfo.groupName}}</p>
          <p>多录扫一扫二维码, 加入群聊</p>
        </div>
      </div>
    </div>
    <div class="btnList"
         v-if='$store.state.isInApp'>
      <div class='btnItem white'
           @click="saveToPhone">保存到手机</div>
      <div class='btnItem blue'
           @click="shareQR">分享二维码</div>
    </div>
  </div>
</template>
<script>
import GroupStateBase from './components/GroupStateBase'
export default {
    mixins: [GroupStateBase],
    data () {
        return {
            groupInfo: {},
            QRImg: ''
        }
    },
    created () {
      this.getGroupInfo()
    },
    methods: {
      getGroupInfo () {
        let me = this
        me.api.get({
            url: `UserGroup/GroupId?GroupId=${me.groupId}&Lon=${me.$store.state.pos.longitude}&Lat=${me.$store.state.pos.latitude}`,
            success: function (res) {
              me.groupInfo = res
              me.getGroupQR()
            }
        })
      },
      getGroupQR () {
        let me = this
        me.api.fileData({
            'url': `qrurl?content=g:${me.groupInfo.groupNumber}`,
            success: function (res) {
                me.QRImg = res
                me.groupInfo.QRimg = res
            }
        })
      },
      saveToPhone () {
        window.isInAndroid && window.WanAndroid.saveQRtoGallery(this.QRImg)
      },
      shareQR () {
        if (!this.$store.state.isInApp) { // 微信分享页面点击无效
          return
        }
        let innerObj = {
          name: this.$route.name,
          objectId: this.groupId
        }
        this.$share.open(this.groupInfo, false, 'groupQR', this.$router.currentRoute.fullPath, innerObj)
      }
    }
}
</script>
<style lang="less">
  .QRpage {
    width:100%;
    min-height: 100%;
    background: #fff;
    background: #f4f4f4;
    padding:9vw 5vw 0;
    .QRimgWrap {
        width: 100%;
        border-radius: 1.11vw;
        img{
            width: 90vw;
            height:90vw;
        }
    }
    .groupInfo {
        height: 21.66vw;
        background: #fff;
        width: 100%;
        display: flex;
        align-items: center;
        &.borderT {
            &::before {
              background: #f3f3f3;
            }
        }
        .avatar {
            width: 15.6vw;
            height: 15.6vw;
            margin: 0 3vw;
            box-shadow: 0 0 1px #f0f0f0;
            > img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                overflow: hidden;
            }
        }
        .groupDesc {
            flex: 1;
            overflow: hidden;
            > p {
                height: 8vw;
                line-height: 8vw;
                color: var(--mGray);
                font-size: var(--title);
                &.groupName {
                    font-weight: bold;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }
    .btnList {
        display: flex;
        margin-top: 7vw;
        height: 10vw;
        line-height: 10vw;
        text-align: center;
        justify-content: space-between;
        .btnItem {
            width: 41vw;
            font-size: var(--mText);
            box-sizing: border-box;
            letter-spacing: 0.5px;
            border-radius: 2px;
            &.white {
                background: #fff;
                color: var(--dGray);
                border: 1px solid #ddd;
            }
            &.blue {
                background: #3e85f2;
                color: #fff;
            }
        }
    }
  }
</style>
