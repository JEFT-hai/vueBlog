<template>
  <div class="taskCenterPage">
    <div class="navbarPage"></div>
    <span @click="go.back()" class="navbarBack"
      ><i class="iconWfanhui iconWanwan activityNotice"></i
    ></span>
    <span class="title">
      <span class="titleInner">任务中心</span>
    </span>
    <div class="taskHeader">
      <integer-list
        class="integerList"
        @click.native="goFlowers"
        :code="code"
      ></integer-list>
    </div>
    <div class="taskContentWrap">
      <div class="signTab">
        <p class="tagLine"><span class="tag">每日签到</span></p>
        <div class="signTxtLine">
          <p class="signTxt" v-if="!isSign">
            登录第{{ dayIndex }}天，获得{{
              loginItem.progressArr[dayIndex - 1] &&
                loginItem.progressArr[dayIndex - 1].code
            }}个积分
          </p>
          <p class="signTxt" v-else>
            已经连续签到<i class="bigTxt">{{ dayIndex }}</i>天
          </p>
          <p :class="['signBtn', { isSign: isSign }]" @click='signTask'>
            {{ isSign ? "已签到" : "立即签到" }}
          </p>
        </div>
        <task-progress
          ref='taskProgress'
          class="signProgress"
          key="sign"
          :item="loginItem"
          @addCode="addCode"
        ></task-progress>
      </div>
      <div class="normalTaskListWrap taskList">
        <div class="taskHead borderB">
          <div class="flexL">
            <p class="taskHeadTit">
              <span class="taskHeadTitTxt">今日任务 ({{ doneNum }}/5)</span>
            </p>
            <p class="taskHeadDesc">
              完成所有今日任务，可开启该任务宝箱，可抽取最高499积分
            </p>
          </div>
          <div
            :class="['flexBtn', { isFull: isDone }, { done: progress }]"
            @click="openTreasure"
          >
            <span class="openTreasureBtn">{{
              progress ? "已完成" : "开宝箱"
            }}</span>
          </div>
        </div>
        <div class="normalTaskList taskListInner">
          <task-item
            v-for="(item, index) in items"
            :key="index"
            :item="item"
            @addCode="addCode"
          ></task-item>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import taskItem from '@/components/Task/TaskInfoItem'
import taskProgress from '@/components/Task/TaskProgress'
import integerList from '@/components/Animation/IntegerList'

import { mapState } from 'vuex'
export default {
  components: {
    taskItem,
    taskProgress,
    integerList
  },
  data() {
    return {
      progress: null,
      signTabShow: true,
      defaultAvatar: '../../../assets/images/defaultavatar.png',
      whoLookMe: [], // 谁看过我用户列表
      isLoad: true, // 是否正在加载
      isFail: false, // 是否加载失败
      failTitle: '敬请期待哦!',
      items: [
        {
          countOperate: 0,
          pointType: 0,
          countTask: 10,
          singleNum: 1,
          curTime: 1,
          title: '点赞笔记',
          cls: 'zan',
          unit: '次',
          showBtn: true
        },
        {
          countOperate: 0, // 进行的进度
          pointType: 1,
          countTask: 10,
          singleNum: 2,
          curTime: 1,
          title: '评论笔记',
          cls: 'commit',
          unit: '次',
          showBtn: true
        },
        {
          countOperate: 0,
          pointType: 2,
          countTask: 10,
          singleNum: 1,
          curTime: 1,
          title: '转发笔记',
          cls: 'zhuanfa',
          unit: '次',
          showBtn: true
        },
        {
          countOperate: 0,
          pointType: 3,
          countTask: 10,
          singleNum: 10,
          curTime: 1,
          title: '发布笔记',
          cls: 'fabu',
          unit: '次',
          showBtn: true
        },
        {
          countOperate: 0,
          pointType: 4,
          countTask: 10,
          singleNum: 1,
          curTime: 1,
          title: '笔记作品获赞',
          cls: 'huozan',
          unit: '次',
          showBtn: false
        }
      ],
      loginItem: {
        countOperate: 0,
        pointType: 5,
        progressArr: [
        { num: 1, code: 1 },
        { num: 2, code: 2 },
        { num: 3, code: 3 },
        { num: 4, code: 5 },
        { num: 5, code: 8 },
        { num: 6, code: 13 },
        { num: 7, code: 21 }
        ], // num是天数/次数 code是积分数
        unit: '天',
        isGetBox: false
      },
      code: 0,
      checkIn: {},
      currentDate: '',
      taskPoint: 0,
      isSign: true
    }
  },
  computed: {
    ...mapState(['user']),
    signScale () {
      return this.user.vipLevel ? 2 : 1
    },
    signIndex() {
      let signNum = this.checkIn
        ? this.isResetSign
          ? 0
          : this.isSign
          ? this.checkIn.checkInType
          : this.checkIn.checkInType + 1
        : 0
      return signNum % 7
    },
    dayIndex() {
      // 第几天签到
      return this.signIndex + 1
    },
    isDone() {
      return this.doneNum >= 5
    },
    doneNum() {
      let done = 0
      this.items.map(item => {
        if (item.countOperate >= item.countTask) {
          done += 1
        }
      })
      return done
    },
    isResetSign() {
      // 是否断开签到
      if (this.checkIn && this.currentDate) {
        return (
          this.format.date(this.currentDate, 'yyyyMMdd') !==
            this.format.date(
              new Date(
                this.format.getDate(this.checkIn.checkInDate).getTime() +
                  24 * 60 * 60 * 1000
              ),
              'yyyyMMdd'
            ) && !this.isSign
        )
      } else {
        return false
      }
    }
  },
  watch: {
    items: {
      deep: true,
      handler: function(newV) {
        return newV
      }
    },
    hardItems: {
      deep: true,
      handler: function(newV) {
        return newV
      }
    },
    signIndex(newV) {
      this.$set(this.loginItem, 'countOperate', newV)
      if ((newV === this.loginItem.progressArr.length - 1) && this.isSign) {
        this.$set(this.loginItem, 'isGetBox', true)
      }
    }
  },
  async created() {
    await this.getTask()
    this.getIsSign()
    this.textAutoOpenBox()
  },
  methods: {
    getTask() {
      let me = this
      return new Promise((resolve, reject) => {
        me.api.get({
          url: 'Task',
          success: function(res) {
            me.code = res.taskPoint
            me.currentDate = res.currentDate
            me.checkIn = res.checkIn
            me.progress = res.progress
            res.tasks.splice(0, 5).filter(item => {
              me.$set(
                me.items,
                item.pointType,
                Object.assign({}, me.items[item.pointType], item)
              )
            })
            resolve()
          },
          error: function(err) {
            me.$alert(err)
            reject()
          }
        })
      })
    },
    goFlowers() {
      this.$router.push({
        name: 'flowersDetail'
      })
    },
    setSignTab(data) {
      this.signTabShow = data
    },
    signTask() {
      if (this.isSign) {
        return
      }
      this.setSignTab(false)
      let me = this
      let data = {
        CheckInType: me.signIndex
      }
      me.api.process({
        url: 'Task',
        data: data,
        success: function() {
          me.code += me.loginItem.progressArr[me.signIndex].code * this.signScale
          let date = new Date()
          me.checkIn = Object.assign({}, me.checkIn, {
            checkInType: me.signIndex,
            checkInDate: date,
            createTime: date
          })
          me.getIsSign()
          me.textAutoOpenBox()
        }
      })
    },
    getIsSign() {
      let isSign = true
      if (!this.checkIn) {
        isSign = false
      } else {
        isSign =
          this.format.date(this.checkIn.checkInDate, 'yyyy-MM-dd') ===
          this.format.date(this.currentDate, 'yyyy-MM-dd')
      }
      this.isSign = isSign
      return this.isSign
    },
    addCode(code) {
      this.code += code
    },
    // 检测是否自动开宝箱
    textAutoOpenBox () {
      if ((this.signIndex === this.loginItem.progressArr - 1) && this.isSign) {
        this.$refs.taskProgress.openTreasure()
      }
    },
    // 今日任务开宝箱
    async openTreasure(e) {
      let me = this
      if (!this.isDone || this.progress) {
        return
      } else {
        let code = await this.openBox()
        if (!e) {
          e = {}
          let box = me.$refs.treasureBox
          e.pageX = box.getBoundingClientRect().left + box.offsetWidth / 2
          e.pageY = box.getBoundingClientRect().top + box.offsetHeight / 2
        }
        this.$treasureBox({
          e: e,
          code: code
        })
      }
    },
    openBox() {
      let me = this
      return new Promise(resolve => {
        me.api.put({
          url: 'Task/sum',
          success: function(res) {
            me.addCode(res)
            me.progress = true
            resolve(res)
          },
          error: function(err) {
            me.$alert(err)
            resolve(0)
          }
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.taskCenterPage {
  .title {
    color: white;
    position: fixed;
    top: 0;
    z-index: 100000;
    width: 100%;
    height: 13.34vw;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4.63vw;
    .titleInner {
      display: inline-block;
      max-width: 66vw;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
  .navbarBack {
    color: white;
    display: inline-block;
    width: 13.34vw;
    height: 13.34vw;
    line-height: 13.6vw;
    position: fixed;
    left: 7.5vw;
    top: 0;
    z-index: 100010;
    .activityNotice {
      font-size: 4.5vw;
      font-weight: bold;
    }
  }
  .navbarPage {
    height: 13.34vw;
    width: 100%;

    position: fixed;
    z-index: 10000;
    top: 0;
    left: 0;
    background-color: #ec5553;
  }
  .taskHeader {
    position: relative;
    width: 100%;
    height: 43vw;
    background: #ec5553;
    overflow: hidden;
    .integerList {
      position: relative;
      margin-top: 19vw;
      &::after {
        content: "积分明细";
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        line-height: 8vw;
        color: #fff;
        font-size: 4vw;
        margin-right: 3.5vw;
      }
    }
  }
  .taskContentWrap{
    position: relative;
    z-index: 1;
  }
  .signTab {
    height: 52vw;
    width: 92vw;
    margin: -9vw auto 0;
    border-radius: 4px;
    background-image: linear-gradient(to right, #e87577, #e89c89);
    .tagLine {
      height: 7.4vw;
      line-height: 7.4vw;
      color: #fff;
      .tag {
        display: inline-block;
        font-size: 4.4vw;
        letter-spacing: 1px;
        padding: 0 5vw;
        border-radius: 0 0 3vw 0;
        background: #f8c96a;
      }
    }
    .signTxtLine {
      display: flex;
      height: 8.2vw;
      padding: 3.3vw 2.6vw 3.3vw;
      box-sizing: content-box;
      .bigTxt{
        display: inline-block;
        padding: 0 3vw;
        font-style: normal;
        // font-size: 6vw;
        transform: scale(1.8);
        transform-origin: 50% 60%;
      }
      .signTxt {
        flex: 1;
        font-size: 5vw;
        color: #fff;
        font-weight: bold;
      }
      .signBtn {
        height: 8.2vw;
        line-height: 8.2vw;
        padding: 0 4.4vw;
        font-size: 4.4vw;
        color: #fff;
        border-radius: 4.1vw;
        background-color: #eb5647;
        &.isSign {
          opacity: 0.7;
          color: #eee;
        }
      }
    }
    .signProgress {
      width: 90.8vw;
      margin: 0 auto;
      background-color: #fff;
    }
  }
  .taskList {
    .taskHead {
      padding: 0 2.6vw;
      height: 16vw;
      margin: 5.4vw 0 0;
      padding-bottom: 5vw;
      display: flex;
      justify-content: center;
      align-items: center;
      // flex-direction: column;
      &::after {
        background-color: #ccc !important;
      }
      .flexL {
        flex: 1;
      }
      .flexBtn {
        margin-left: 3vw;
        opacity: 0.6;
        &.isFull {
          opacity: 1;
        }
        &.done {
          opacity: 0.6;
        }
        .openTreasureBtn {
          display: inline-block;
          height: 8.2vw;
          line-height: 8.2vw;
          background-color: #eb5647;
          color: #fff;
          font-size: 3.9vw;
          padding: 0 3.9vw;
          border-radius: 4.1vw;
        }
      }
      .taskHeadTit {
        height: 6.4vw;
        line-height: 6.4vw;
        font-size: 4.5vw;
        color: #000;
        font-weight: bold;
        .taskHeadTitTxt {
          margin-right: 1vw;
        }
      }
      .taskHeadDesc {
        line-height: 4.4vw;
        font-size: 3.3vw;
        color: #8e8e8e;
        letter-spacing: 1px;
      }
    }
  }
}
.lookMeWrap {
  width: 100%;
  height: 100%;
}
</style>
