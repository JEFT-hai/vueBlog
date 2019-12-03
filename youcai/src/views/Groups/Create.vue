<template>
  <div class="postGroupPage">
    <textArea :textAreaData="groupDesc"
              :show="textAreaMask"
              v-if="textAreaMask"
              @submitText="getTextAreaData"></textArea>
    <v-map v-show="hasMask && addressMask"
           @hideBMapPage="setAddressMask(false)"
           @subAdd="setAddress"></v-map>
    <v-tags v-show="hasMask && tagsMask"
            @showLabel="getTags"
            :labels="tagsLabel"
            :maxLength=1
            title="群组标签"
            :isNeedTitle="isNeedTitle"
            @groupCategory="groupCategory"></v-tags>
    <imageList @upFiles="getFiles"
               :canUploadVideo="canUploadVideo"></imageList>
    <!-- <div class="tabNav">
          <i class="iconWanwan iconWleftBack" @click="$router.go(-1)"></i>
          <p>创建群组</p>
    </div>-->
    <div class>
      <ul class="groupBaseInfo LRForm">
        <li class="LRFormItem borderB">
          <span class="LFormItem">群组名称</span>
          <div class="inputWrapper FormItemContent canClear">
            <input type="text"
                   maxlength="15"
                   v-model="group.title"
                   placeholder="不超过15个字">
            <i v-show="group.title && group.title.length"
               class="inputClose iconWanwan iconWclose"
               @click="clear('group.title')"></i>
          </div>
        </li>
        <li class="LRFormItem borderB"
            @click="setAddressMask(true)">
          <span class="LFormItem">群组地点</span>
          <p class="FormItemContent"
             v-if="group.address">{{group.address.curTit}}</p>
          <p class="FormItemContent"
             v-else></p>
          <p class="RText">
            <span v-show="!group.address">请选择</span>
            <i class="iconWxiayibu iconWanwan textR"></i>
          </p>
        </li>
        <li class="LRFormItem borderB"
            @click="setTagsMask(true)">
          <span class="LFormItem">群标签</span>
          <p class="FormItemContent">
            <span v-if="group.tags">{{group.tags[0]}}</span>
            <span v-for="(item, index) in group.tags"
                  :key="index"
                  v-show="index">{{'、' + item}}</span>
          </p>
          <p class="RText">
            <span v-show="!group.tags || (group.tags && !group.tags.length)">请选择</span>
            <i class="iconWxiayibu iconWanwan textR"></i>
          </p>
        </li>
        <li class="LRFormItem borderB"
            @click="setTextArea(true)">
          <span class="LFormItem">群组介绍</span>
          <input v-model="group.desc"
                 class="FormItemContent"
                 placeholder="描述群介绍，让大家更了解你的群"
                 readonly>
          <p class="RText">
            <i class="iconWxiayibu iconWanwan textR"></i>
          </p>
        </li>
        <li @click="postActive"
            class="LRFormItem submitPostBtnWrap">
          <div :class="canPost?'submitPostBtn canSubmitPost':'submitPostBtn'">提交申请</div>
        </li>
        <li class="groupTip">建群需审核，请认真填写</li>
      </ul>
    </div>
  </div>
</template>
<script>
// import VMap from '@/components/Amap'
import VMap from '@/components/Map/SMap'
import VTags from '@/components/VTags'
import textArea from '@/components/TextArea'
import imageList from '@/components/upLoader/imageUploader'
import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    VMap,
    VTags,
    textArea,
    imageList
  },
  data() {
    return {
      isNeedTitle: true, // 表示需要传title
      selectTitle: '', // 选择的标签title
      groupLabelCategoty: '', // 群组的标签类别
      addressMask: false,
      tagsMask: false,
      textAreaMask: false,
      groupDesc: {
        maxLen: 100,
        title: '群组介绍',
        inputText: '',
        inputHolderText: '描述群介绍，让大家更了解你的群'
      },
      group: {},
      canUploadVideo: false,
      tagsLabel: [
        {
          title: '兴趣',
          tags: ['文学', '摄影', '音乐', '影视', '舞蹈']
        },
        {
          title: '交友',
          tags: ['相亲', '聚会', '同城', '同乡']
        },
        {
          title: '生活',
          tags: [
            '宗教',
            '宠物',
            '茶文化',
            '家居',
            '健康',
            '母婴',
            '购物',
            '时尚',
            '美容',
          ]
        },
        {
          title: '玩乐',
          tags: ['棋牌', '旅游', '星座', 'K歌', '美食']
        },
        {
          title: '运动',
          tags: ['瑜伽', '马拉松', '健身', '塑形', '养生', '跑步', '台球']
        },
        {
          title: '商家',
          tags: ['教育培训', '餐饮', '丽人', '医疗', '休闲娱乐', '结婚', '生活服务', '亲子', '爱车', '交通枢纽', '运动健身', '酒店', '家装', '旅游', '购物', 'K歌', '电影演出赛事']
        }
      ]
    }
  },
  beforeDestroy() {
    window.isInAndroid && window.WanAndroid.imgCropType(0)
  },
  computed: {
    ...mapState({
      hasMask: 'hasMask'
    }),
    canPost() {
      var s =
        this.group.title &&
        this.group.address &&
        (this.group.tags && this.group.tags.length) &&
        this.group.desc &&
        (this.group.files && this.group.files.length)
      return s
    }
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.fromName = from.name
    })
  },
  created () {
    window.isInAndroid && window.WanAndroid.imgCropType(2, 4)
  },
  watch: {
    selectedIndex (newV) {
      return newV
    },
    group (newV) {
      return newV
    }
  },
  methods: {
    ...mapMutations({
      setMask: 'setMask',
      upUserGroupNumber: 'upUserGroupNumber'
    }),
    /**
     * groupCategory选择标签的title
     */
    groupCategory (data) {
      this.selectTitle = data
    },
    getFiles(data) {
      this.$set(this.group, 'files', data)
    },
    clear(str) {
      if (str.indexOf('.') > 0) {
        let a1 = str.split('.')
        this[a1[0]][a1[1]] = ''
      } else {
        this[str] = ''
      }
    },
    setTextArea(data) {
      this.textAreaMask = data
    },
    getTextAreaData(data) {
      if (data) {
        this.$set(this.group, 'desc', data.inputText)
        this.$set(this.groupDesc, 'inputText', data.inputText)
      }
      this.setTextArea(false)
    },
    setAddressMask(data) {
      this.addressMask = data
      this.setMask(data)
    },
    setAddress(data) {
      this.$set(this.group, 'address', data)
      this.setAddressMask(false)
    },
    setTagsMask(data) {
      this.tagsMask = data
      this.setMask(data)
    },
    getTags(data) {
      data && this.$set(this.group, 'tags', data) && this.setTagsMask(false)
      !data && this.setTagsMask(false)
    },
    upFileThumbnail() {
      let me = this
      me.$uploading(true, '创建中...')
      return new Promise((resolve, reject) => {
        var fd = new FormData()
        fd.append('1', me.group.files[0])
        me.api.file({
          url: 'FileThumbnail',
          data: fd,
          success: res => {
            me.group.filesResults = []
            me.group.filesResults.push(res.split(',')[1])
            resolve()
          },
          error: function(err) {
            reject(err)
          }
        })
      })
    },
    postImageList () {
      let me = this
      return new Promise((resolve, reject) => {
        if (this.group.files.length > 1) {
          var fd = new FormData()
          for (let i = 1; i < this.group.files.length; i++) {
            fd.append('1' + i, this.group.files[i])
          }
          me.api.file({
            url: 'file',
            data: fd,
            success: res => {
              me.group.filesResults = me.group.filesResults.concat(
                res.split(',')
              )
              resolve()
            },
            error: res => {
              reject(res)
            }
          })
        } else {
          resolve()
        }
      })
    },
    postActive() {
      if (!this.group.title) {
        this.$toast('请输入群组标题')
        return
      }
      if (!this.group.address) {
        this.$toast('请输入群组地点')
        return
      }
      if (!this.group.tags || (this.group.tags && !this.group.tags.length)) {
        this.$toast('请输入群组标签')
        return
      }
      if (!this.group.desc) {
        this.$toast('描述一下您的群吧！')
        return
      }
      if (!this.group.files.length) {
        this.$toast('请上传群头像/图片')
        return
      }
      var me = this
      let p = this.upFileThumbnail()
      p.then(me.postImageList)
        .then(() => {
          let imageList = []
          for (let i = 0; i < me.group.files.length; i++) {
            imageList.push(me.group.filesResults[i])
          }
          return new Promise((resolve, reject) => {
            me.api.process({
              url: 'UserGroup',
              data: {
                // groupName: me.group.title,
                groupName: me.group.title,
                groupCover: me.group.filesResults[0],
                lable: me.group.tags[0],
                lableCategory: me.selectTitle,
                imageList: imageList,
                groupStatement: me.group.desc,
                address: `${me.group.address.curTit}`,
                latitude: me.group.address.latitude,
                // longitude: ''
                longitude: me.group.address.longitude
              },
              success: function() {
                me.oneCreat = false
                me.$success(true, '创建成功', 500)
                me.upUserGroupNumber()
                // me.$toast('创建群组成功，等待审核')
                if (me.fromName === 'postPost') {
                  me.$router.replace({name: 'postActivity'})
                } else {
                  me.$router.push({ path: '/index' })
                }
                resolve()
              },
              error: function(err) {
                console.log(err)
                reject(err)
              }
            })
          })
        })
        .catch(res => {
          me.$error(true, res ? res : '创建失败', 500)
        })
    }
  }
}
</script>
<style lang="less">
.LRForm .LRFormItem .iconWanwan.iconWperson-fill {
  color: var(--mRed);
}
.groupBaseInfo {
  .groupTip {
    margin-top: -4vw;
    font-size: var(--nText);
    text-align: center;
    color: var(--lGray);
    background: #fff;
  }
}
.postGroupPage {
  // padding-top: 12vw;
  color: var(--dGray);
  .postCoverWrapper {
    height: 44.53vw;
    background: #e7e7e7;
    .postCover {
      padding: 5.55vw 0;
      text-align: center;
      .imgBg {
        width: 22vw;
        height: 22vw;
        line-height: 22vw;
        font-size: 12vw;
        border-radius: 50%;
        background: #fff;
        margin: 0 auto;
      }
      p {
        height: 10.9vw;
        line-height: 10.9vw;
        font-size: var(--mText);
        letter-spacing: 1px;
        font-weight: bold;
      }
    }
  }
}
</style>
