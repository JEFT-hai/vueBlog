<template>
  <div class="waterfallWrap">
    <div
      class="waterfallHalf waterfallHalf--left"
      ref="waterfallLeft"
      v-if="!vote"
    >
      <w-item
        v-for="(item, index) in leftItems"
        :key="item.postId ? item.postId + index : index"
        :item="item"
        :selfData="selfData"
        :theme="theme"
        :isEnd="isEnd"
      ></w-item>
    </div>
    <div class="waterfallHalf waterfallHalf--left" ref="waterfallLeft" v-else>
      <v-item
        v-for="(item, index) in leftItems"
        :key="index"
        :oneVote="item"
        :index="(index + 1) * 2 - 1"
        :voteActivity="voteActivity"
        @updateCount="updateCount"
        :selfData="selfData"
        :theme="theme"
        :isEnd="isEnd"
        :isImei="isImei"
      ></v-item>
    </div>
    <div
      class="waterfallHalf waterfallHalf--right"
      ref="waterfallRight"
      v-if="!vote"
    >
      <w-item
        v-for="(item, index) in rightItems"
        :key="item.postId ? item.postId + index : index"
        :item="item"
        :selfData="selfData"
        :theme="theme"
        :isEnd="isEnd"
      ></w-item>
    </div>
    <div class="waterfallHalf waterfallHalf--right" ref="waterfallRight" v-else>
      <v-item
        v-for="(item, index) in rightItems"
        :key="index"
        :oneVote="item"
        :index="(index + 1) * 2"
        :voteActivity="voteActivity"
        @updateCount="updateCount"
        :selfData="selfData"
        :theme="theme"
        :isEnd="isEnd"
        :isImei="isImei"
      ></v-item>
    </div>
  </div>
</template>
<script>
import WaterfallItem from '@/components/Waterfall/WaterfallItem'
import VoteItem from '@/components/Waterfall/VoteItem'
export default {
  components: {
    wItem: WaterfallItem,
    vItem: VoteItem
  },
  props: {
    addMethod: {
      type: String,
      default: 'app'
    },
    voteActivity: {
      type: Object,
      default: null
    },
    selfData: {
      type: Object,
      default: null
    },
    items: {
      type: Array,
      default: function() {
        return []
      }
    },
    addItems: {
      type: Array,
      default: null
    },
    preloadWebp: {
      // 是否预加载video的动图封面
      type: Boolean,
      default: true
    },
    isRefresh: {
      // 是否是刷新数据
      type: Boolean,
      default: false
    },
    /*
     * 以下是投票item用到的字段
     */
    vote: {
      type: Boolean,
      default: false
    },
    theme: {
      type: Number,
      default: 0
    },
    activityVote: {
      type: Object
    },
    isImei: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      allItems: [],
      leftItems: [],
      rightItems: [],
      leftDataItems: [], // 临时存储左右数据
      rightDataItems: [],
      leftH: 0,
      rightH: 0,
      refreshing: false // 是否是刷新
    }
  },
  watch: {
    addItems: {
      immediate: true,
      handler(newV) {
        if (newV) {
          this.queueLoad(newV)
            .then(res => {
              if (res === newV.length) {
                // 全部计算完了
                this.calculateAddLeftOrRight()
                this.$nextTick(() => {
                  this.$emit('renderEnd', true)
                })
              }
            })
            .catch(err => {
              console.log(err, 'err')
            })
        }
        return newV
      }
    },
    isRefresh(newV) {
      newV && (this.refreshing = newV)
      return newV
    }
  },
  computed: {
    isEnd() {
      return this.voteActivity && this.voteActivity.isEnd
    }
  },
  methods: {
    updateCount() {
      this.$emit('updateCount')
    },
    resetData() {
      this.leftItems = []
      this.rightItems = []
      this.leftH = 0
      this.rightH = 0
    },
    async queueLoad(arr) {
      let i = 0
      for (i = 0; i < arr.length; i++) {
        let res = null
        let item = arr[i]
        res = await this.getImgInfo(item, i) // 等待读取图片
        if (res) {
          // 过滤掉坏的图片源
          this.refreshing && this.resetData()
          item.r = res
          await this.calculateDataLeftOrRight(item, i)
        }
        this.refreshing = false
        this.$emit('render', i)
        this.$emit('renderEnd', false)
      }
      return i
    },
    getImgInfo(item) {
      return new Promise((resolve, reject) => {
        if (item.wight && item.height) {
          // 有wight或者height
          resolve(Number(item.height) / Number(item.wight))
        } else if (+item.postType === 2 && !this.preloadWebp) {
          // 没有wight或height并且不读图片 并且是视频就不读图片直接固定比例 (因为图片大，读数据的时间长)
          resolve(1.77777)
        } else {
          // 如果图片被缓存，则直接返回缓存数据
          if (!this.preloadWebp) {
            reject(1)
          }
          var img = new Image()
          img.src = item.picture || (item.imageList && item.imageList[0])
          if (img.complete) {
            resolve(Number(img.height) / Number(img.width))
          } else {
            // 完全加载完毕的事件
            img.onload = function() {
              resolve(Number(img.height) / Number(img.width))
            }
            img.onerror = function() {
              reject(1)
            }
          }
        }
      }).catch(error => {
        console.log('getImgInfo', error)
      })
    },
    calculateDataLeftOrRight(item) {
      return new Promise(resolve => {
        if (this.leftH <= this.rightH) {
          this.leftDataItems.push(item)
          this.leftH += item.r
        } else {
          this.rightDataItems.push(item)
          this.rightH += item.r
        }
        resolve()
      })
    },
    calculateAddLeftOrRight() {
      if (this.addMethod === 'app') {
        this.leftItems = this.leftItems.concat(this.leftDataItems)
        this.rightItems = this.rightItems.concat(this.rightDataItems)
      } else {
        this.leftItems = this.leftDataItems.concat(this.leftItems)
        this.rightItems = this.rightDataItems.concat(this.rightItems)
      }
      this.leftDataItems = []
      this.rightDataItems = []
    }
  }
}
</script>
<style lang="less" scoped>
.waterfallWrap {
  font-size: 0;
  // background: -webkit-linear-gradient(bottom, #f3fcf9, #f8f8fb);
  // background: -webkit-linear-gradient(bottom,#1E66B8,#B7AD05);
  .waterfallHalf {
    display: inline-block;
    vertical-align: top;
    margin-left: 1.39vw;
    width: 47.9vw;
    font-size: 3.6vw;
    .waterfallItem {
      width: 100%;
      border-radius: 1.39vw;
      margin-top: 1.39vw;
      overflow: hidden;
      background: #fff;
      .waterfallItem__flex--line {
        display: flex;
        height: 6.4vw;
        .flex--left {
          width: 6.4vw;
          height: 6.4vw;
        }
        .flex--middle {
          flex: 1;
        }
        .flex--right {
          width: 12vw;
        }
      }
    }
  }
}
</style>
