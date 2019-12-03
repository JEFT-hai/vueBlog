<template>
  <div class="postGroupPage">
    <textArea
      :textAreaData="groupDesc"
      :show="textAreaMask"
      v-if="hasMask && textAreaMask"
      @submitText="getTextAreaData"
    ></textArea>
    <v-map
      v-if="hasMask && addressMask"
      @hideBMapPage="setAddressMask(false)"
      @subAdd="setAddress"
      :address="group.address.curTit"
    ></v-map>
    <v-tags
      v-show="hasMask && tagsMask"
      @showLabel="getTags"
      :labels="tagsLabel"
      :maxLength="1"
      title="群组标签"
      :chooseData="group.tags"
      :isNeedTitle="isNeedTitle"
      @groupCategory="groupCategory"
    ></v-tags>
    <imageList
      @upFiles="getFiles"
      :canUploadVideo="canUploadVideo"
      :imagesList="imageUlrs"
      @allImagesFiles="allImagesFiles"
      @deleteList="deleteList"
    ></imageList>
    <div class>
      <ul class="groupBaseInfo LRForm">
        <li class="LRFormItem borderB">
          <span class="LFormItem">群组名称</span>
          <div class="inputWrapper FormItemContent canClear">
            <input
              type="text"
              maxlength="15"
              v-model="group.title"
              placeholder="不超过15个字"
            />
            <i
              v-show="group.title && group.title.length"
              class="inputClose iconWanwan iconWclose"
              @click="clear('group.title')"
            ></i>
          </div>
        </li>
        <li class="LRFormItem borderB" @click="setAddressMask(true)">
          <span class="LFormItem">群组地点</span>
          <p class="FormItemContent" v-if="group.address">
            {{ group.address.curTit }}
          </p>
          <p class="FormItemContent" v-else></p>
          <p class="RText">
            <span v-show="!group.address">请选择</span>
            <i class="iconWxiayibu iconWanwan textR"></i>
          </p>
        </li>
        <li class="LRFormItem borderB" @click="setTagsMask(true)">
          <span class="LFormItem">群标签</span>
          <p class="FormItemContent">
            <span v-if="group.tags">{{ group.tags[0] }}</span>
            <span
              v-for="(item, index) in group.tags"
              :key="index"
              v-show="index"
              >{{ "、" + item }}</span
            >
          </p>
          <p class="RText">
            <span v-show="!group.tags || (group.tags && !group.tags.length)"
              >请选择</span
            >
            <i class="iconWxiayibu iconWanwan textR"></i>
          </p>
        </li>
        <li class="LRFormItem borderB" @click="setTextArea(true)">
          <span class="LFormItem">群组介绍</span>
          <input
            v-model="group.desc"
            class="FormItemContent"
            placeholder="描述群介绍，让大家更了解你的群"
            readonly
          />
          <p class="RText">
            <i class="iconWxiayibu iconWanwan textR"></i>
          </p>
        </li>
        <li @click="postActive" class="LRFormItem submitPostBtnWrap">
          <div
            :class="canPost ? 'submitPostBtn canSubmitPost' : 'submitPostBtn'"
          >
            确认修改
          </div>
        </li>
        <li class="groupTip">修改文字资料，需审核才能显示</li>
      </ul>
    </div>
  </div>
</template>
<script>
import VMap from '@/components/Map/SMap';
import VTags from '@/components/VTags';
import textArea from '@/components/TextArea';
import imageList from '@/components/upLoader/changeImageUploader';
import { mapState, mapMutations } from 'vuex';
export default {
  components: {
    VMap,
    VTags,
    textArea,
    imageList
  },
  data() {
    return {
      canBack: false, // 是否能直接退出
      originGroupInfo: '', // 存储进入页面时候的原始群组数据
      isNeedTitle: true, // 表示需要传title
      selectTitle: '', // 选择的标签title
      groupId: this.$route.params.id,
      groupImageList: [],
      allImages: [], // 所有的图片,列表
      deleteImages: [],
      addressMask: false,
      tagsMask: false,
      textAreaMask: false,
      groupDesc: {
        maxLen: 100,
        title: '群组介绍',
        inputText: '',
        inputHolderText: '描述群介绍，让大家更了解你的群'
      },
      group: {
        address: {
          curTit: ''
        },
        filesResults: [] // 赋值 allImages -> 全部变成网络地址 -> 上传 | 中间没有改变allImages的值 -> 太有才了
      },
      canUploadVideo: false,
      tagsLabel: [
        {
          title: '交友',
          tags: ['70后', '80后', '90后', '聚会', '同城', '同乡']
        },
        {
          title: '生活',
          tags: [
            '狗',
            '花草',
            '宗教',
            '宠物',
            '茶文化',
            '家居',
            '健康',
            '母婴',
            '购物',
            '时尚',
            '美容',
            '车友'
          ]
        },
        {
          title: '兴趣',
          tags: ['文学', '摄影', '音乐', '影视', '动漫', '舞蹈', '游戏']
        },
        {
          title: '玩乐',
          tags: ['棋牌', '旅游', '星座', 'K歌', '泡吧', '美食']
        },
        {
          title: '运动',
          tags: ['瑜伽', '马拉松', '健身', '塑形', '养生', '跑步', '台球']
        }
      ]
    }
  },
  computed: {
    ...mapState({
      hasMask: 'hasMask'
    }),
    canPost() {
      var s =
        this.group.title &&
        this.group.address &&
        this.group.tags && this.group.tags.length &&
        this.group.desc &&
        this.allImages && this.allImages.length
      return s
    },
    imageUlrs() {
      let imageUlrs = []
      this.groupImageList.map(item => {
        imageUlrs.push(item.imageUrl)
      })
      return imageUlrs
    }
  },
  watch: {
    selectedIndex(newV) {
      return newV
    },
    group(newV) {
      return newV
    }
  },
  activated() {
    this.canBack = false
  },
  created() {
    this.getGroupInfo()
    window.isInAndroid && window.WanAndroid.imgCropType(2, 4)
  },
  beforeDestroy() {
    window.isInAndroid && window.WanAndroid.imgCropType(0)
  },
  beforeRouteLeave(to, from, next) {
    this.textRevise(next)
      .then(() => {
        next()
      })
      .catch(() => {
        this.postActive()
        next(false)
      })
  },
  methods: {
    ...mapMutations({
      setMask: 'setMask'
    }),
    textRevise() {
      return new Promise((resolve, reject) => {
        if (!this.canPost || this.canBack) {
          this.canBack = true
          resolve()
        } else if (
          this.originGroupInfo === JSON.stringify(this.group) &&
          JSON.stringify(this.imageUlrs) === JSON.stringify(this.allImages)
        ) {
          this.canBack = true
          resolve()
        } else {
          // 能提交
          this.$confirm({
            title: '检测到您修改过资料了',
            msg: '保存后退出？',
            yesBtnText: '保存',
            noBtnText: '不保存',
            type: 'confirm'
          })
            .then(() => {
              reject()
            })
            .catch(() => {
              this.canBack = true
              resolve()
            })
        }
      })
    },
    /*
     * 获取群组数据
     */
    getGroupInfo() {
      let me = this
      me.api.get({
        url: `UserGroup/GroupId?GroupId=${me.groupId}`,
        success: function(res) {
          me.$set(me.group, 'title', res.groupName)
          me.$set(me.group, 'tags', [res.lable])
          me.groupImageList = res.imageUlrs
          me.$set(me.group, 'address', {
            curTit: res.address,
            latitude: res.latitude,
            longitude: res.longitude
          })
          me.$set(me.group, 'desc', res.groupStatement)
          me.$set(me.groupDesc, 'inputText', res.groupStatement)
          me.originGroupInfo = JSON.stringify(me.group)
        }
      })
    },
    /*
     * 上传修改过的资料 检测 | 上传队列 -> 上传头像（压缩）、上传图片列表、上传群组资料
     */
    postActive() {
      if (!this.group.title) {
        this.$toast('请输入群组标题')
        return;
      }
      if (!this.group.address) {
        this.$toast('请输入群组地点')
        return;
      }
      if (!this.group.tags || (this.group.tags && !this.group.tags.length)) {
        this.$toast('请输入群组标签')
        return;
      }
      if (!this.group.desc) {
        this.$toast('描述一下您的群吧！')
        return;
      }
      if (!this.allImages.length) {
        this.$toast('请上传群图片')
        return;
      }
      this.queue([this.upFileThumbnail, this.postImageList, this.reviseGroup])
    },
    async queue(arr) {
      // 同步队列
      let res = '';
      this.$uploading(true, '修改中...')
      let i = 0
      for (; i < arr.length; i++) {
        res = await arr[i]()
      }
      if (res) {
        this.$success(true, '修改成功', 500)
        window.isInAndroid &&
          window.WanAndroid.updateGroupInfo(
            this.groupId,
            this.group.title,
            this.group.filesResults[0]
          )
        this.canBack = true
        setTimeout(() => {
          this.$router.back()
        }, 500)
      }
      return await res
    },
    showErr(err) {
      // 出错的处理方式
      this.group.filesResults = [] // 清空上传图片的队列
      this.$error(false, err)
    },
    upFileThumbnail() {
      // 上传头像 | 压缩
      let me = this
      me.group.filesResults = me.group.filesResults.concat(me.allImages)
      return new Promise((resolve, reject) => {
        if (me.allImages[0].type) {
          // 是新上传的文件 就上传
          var fd = new FormData()
          fd.append('1', me.allImages[0])
          me.api.file({
            url: 'FileThumbnail',
            data: fd,
            success: res => {
              me.group.filesResults[0] = res.split(',')[1]
              resolve()
            },
            error: function(err) {
              reject(err)
            }
          })
        } else {
          // 本身就是网址
          resolve()
        }
      }).catch(err => {
        me.showErr(err)
      })
    },
    postImageList() {
      // 上传图片队列 | 不压缩
      let me = this
      return new Promise((resolve, reject) => {
        if (me.allImages.length > 1) {
          var fd = new FormData()
          let markIndex = [] // 存储是文件的图片的Index
          for (let i = 1; i < me.allImages.length; i++) {
            if (me.allImages[i].type) {
              markIndex.push(i)
              fd.append('1' + i, me.allImages[i])
            }
          }
          if (markIndex.length) {
            me.api.file({
              url: 'file',
              data: fd,
              success: res => {
                let newR = res.split(',')
                markIndex.map((item, index) => {
                  // 根据markIndex依次赋值
                  me.group.filesResults[item] = newR[index]
                })
                resolve()
              },
              error: () => {
                reject()
              }
            })
          } else {
            resolve()
          }
        } else {
          resolve()
        }
      }).catch(err => {
        me.showErr(err)
      })
    },
    reviseGroup() {
      // 提交修改后的区组文字
      let me = this
      return new Promise((resolve, reject) => {
        me.api.put({
          url: 'UserGroup',
          data: {
            userGroupId: me.groupId,
            groupName: me.group.title,
            groupCover: me.group.filesResults[0],
            lable: me.group.tags[0],
            lableCategory: me.selectTitle,
            imageList: me.group.filesResults,
            groupStatement: me.group.desc,
            address: `${me.group.address.curTit}`,
            latitude: me.group.address.latitude,
            longitude: me.group.address.longitude
          },
          success: function() {
            resolve('ok') // 最后一个函数要有返回值
          },
          error: function(err) {
            reject(err)
          }
        })
      }).catch(err => {
        me.showErr(err)
      })
    },
    /**
     * groupCategory选择标签的title
     */
    groupCategory(data) {
      this.selectTitle = data
    },
    allImagesFiles(data) {
      this.allImages = data
    },
    deleteList(data) {
      this.deleteImages = data
    },
    getFiles(data) {
      this.$set(this.group, 'files', data)
    },
    clear(str) {
      if (str.indexOf('.') > 0) {
        let a1 = str.split('.')
        this[a1[0]][a1[1]] = '';
      } else {
        this[str] = '';
      }
    },
    setTextArea(data) {
      this.textAreaMask = data
      this.setMask(data)
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
