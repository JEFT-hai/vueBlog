<template>
  <div class="taskInfoItem">
    <div class="tastAvatarIcon">
      <span class="tastAvatarIconInner">
        <i :class="['iconWanwan', 'iconW' + item.cls]"></i>
      </span>
    </div>
    <div class="taskInfoContent borderB">
      <div class="taskInfoText">
        <div class="taslInfoTitle">
          {{ title }}
        </div>
        <div class="taslInfoDescItem" v-for="(itm, index) in desc" :key="index">
          {{ itm }}
        </div>
      </div>
      <div :class="['taskItemBtnWrap', { hasDone: done }]" v-if="showBtn">
        <span class="taskItemBtn" @click="goDone">{{ btnTxt }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: null
    },
    canClick: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    showBtn() {
      return this.done ? this.done : this.item.showBtn
    },
    title() {
      let countOperate = this.item.countOperate
      // Math.min(this.item.countOperate, this.item.countTask)
      let com =
        this.item.countTask > 1
          ? `(${countOperate}/${this.item.countTask})`
          : `${this.item.countTask}次`
      return `${this.item.title} ${com}`
    },
    desc() {
      let desc = []
      let num = `完成任务+${this.item.singleNum}积分 VIP+${this.item.singleNum}积分`

      // let limit = `每日上限次数：${this.item.countTask} 次`
      //   if (this.item.countTask > 1 && this.item.countOperate) {
      //     num = `${num}，已完成${this.item.countOperate}次`
      //   }
      desc.push(num)
      // desc.push(limit)
      return desc
    },
    goName() {
      let name = ''
      switch (this.item.pointType) {
        case 0: // 点赞
        case 1: // 评论
        case 2: // 转发
          name = 'index'
          break
        case 3: // 发布
          name = 'postPost'
          break
        default:
          break
      }
      return name
    },
    done() {
      return this.item.countOperate >= this.item.countTask
    },
    btnTxt() {
      // if (!this.item.isGetBox && this.item.countOperate >= this.item.countTask) {
      //     return '开宝箱'
      // } else {
      return this.item.countOperate >= this.item.countTask ? '已完成' : '前往'
      // }
    }
  },
  methods: {
    goDone() {
      // if (this.btnTxt === '开宝箱') {
      //     this.$emit('openTreasure')
      //     return
      // }
      if (this.done) {
        return
      }
      this.go.name(this.goName)
    }
  }
}
</script>
<style lang="less" scoped>
.taskInfoItem {
  display: flex;
  align-items: center;
  height: 19.3vw;
  .tastAvatarIcon {
    width: 19vw;
    padding: 0 3vw 0 4.7vw;
    box-sizing: border-box;
    .tastAvatarIconInner {
      display: inline-block;
      width: 12vw;
      height: 12vw;
      line-height: 12vw;
      text-align: center;
      border-radius: 50%;
      background-color: #f4f7f6;
      .iconWanwan {
        font-size: 7vw;
        color: #ff566d;
      }
    }
  }
  .taskInfoContent {
    flex: 1;
    display: flex;
    height: 100%;
    align-items: center;
    .taskInfoText {
      flex: 1;
      .taslInfoTitle {
        line-height: 6.5vw;
        font-size: 4.5vw;
        color: #000;
      }
      .taslInfoDescItem {
        line-height: 5.9vw;
        font-size: 3.7vw;
        color: #9b9b9b;
      }
    }
    .taskItemBtnWrap {
      height: 100%;
      text-align: center;
      margin: 0 2.5vw 0 1vw;
      display: flex;
      align-items: center;
      .taskItemBtn {
        display: inline-block;
        padding: 0 3.6vw;
        height: 7.8vw;
        line-height: 7.8vw;
        border-radius: 3.9vw;
        overflow: hidden;
        font-size: 4.4vw;
        color: #ff2742;
        background-color: #f9f6f7;
        // color: #f9f6f7;
        // background-color: #ce7063;
      }
      &.hasDone {
        .taskItemBtn {
          color: #ce7063;
          background-color: #f9f6f7;
          opacity: 0.6;
        }
      }
    }
  }
}
</style>
