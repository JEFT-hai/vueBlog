<template>
  <transition name="mySet">
    <div class="labelWrap">
      <div class="labelHead">
        <span @click="hiddleLabel">
          <i class="iconWanwan iconWfanhui activityNotice"></i>
        </span>
        <span>我的标签</span>
        <span @click="confirmLabel">
          <i class="iconWanwan iconWgou activityNotice"></i>
        </span>
      </div>
      <div class="label">
        <div class="labelAmout">
          已选标签&nbsp;{{selectedLabel.length}}
        </div>
        <div class="labelMain"
             v-show="selectedLabel.length > 0">
          <span :class="{changeColor:isSelected(item)}"
                v-for="(item,index) in selectedLabel"
                :key="index"
                @click="userSelfSelect(item)">{{item.title}}</span>
        </div>
        <div :class="['split', {move: selectedLabel.length > 0 }]"></div>
        <div class="labelType">
          <div class="eachType"
               v-for="(eachLabel,index) in allLabel"
               :key="index">
            <p>{{eachLabel.title}}</p>
            <div class="content">
              <span :class="{changeColor:isSelected(item)}"
                    v-for="(item,index) in eachLabel.content"
                    :key="index"
                    @click="userSelfSelect(item)">{{item.title}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    chooseData: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data () {
    return {
      maxLength: 8, // 表示选择标签的数量
      /* eslint-disable */
      allLabel: [
        {
        'id': 1,
        "title": '性格',
        "content": [
            {
                "id": 1,
                "title": '专一'
            },
            {
                "id": 2,
                "title": '工作狂'
            },
            {
                "id": 3,
                "title": '偏执狂'
            },
            {
                "id": 4,
                "title": '内向'
            },
            {
                "id": 5,
                "title": "控制狂"
            },
            {
                "id": 6,
                "title": "敏感"
            },
            {
                "id": 7,
                "title": "爱浪漫"
            },
            {
                "id": 8,
                "title": "温顺小绵羊"
            },
            {
                "id": 9,
                "title": "爱冒险"
            },
            {
                "id": 10,
                "title": "善变"
            },
            {
                "id": 11,
                "title": "中二"
            },
            {
                "id": 12,
                "title": "理性"
            },
            {
                "id": 13,
                "title": "居家"
            },
            {
                "id": 14,
                "title": "感性"
            },
            {
                "id": 15,
                "title": "傻白甜"
            },
            {
                "id": 16,
                "title": "温柔"
            },
            {
                "id": 17,
                "title": "热情"
            },
            {
                "id": 18,
                "title": "乐观"
            },
            {
                "id": 19,
                "title": "理想主义"
            },
            {
                "id": 20,
                "title": "完美主义"
            },
            {
                "id": 21,
                "title": "古灵精怪"
            },
            {
                "id": 22,
                "title": "知性"
            }
          ]
        },
        {
            "id": 2,
            "title": "外形",
            "content": [
                {
                    "id": 1,
                    "title": "俏皮双马尾"
                },
                {
                    "id": 2,
                    "title": "前卫"
                },
                {
                    "id": 3,
                    "title": "文艺"
                },
                {
                    "id": 4,
                    "title": "时尚"
                },
                {
                    "id": 5,
                    "title": "宝妈"
                },
                {
                    "id": 6,
                    "title": "优雅"
                },
                {
                    "id": 7,
                    "title": "微胖"
                },
                {
                    "id": 8,
                    "title": "狂吃不胖"
                }
            ]
        },
        {
            "id": 3,
            "title": "自我描述",
            "content": [
                {
                    "id": 1,
                    "title": "选择恐惧症"
                },
                {
                    "id": 2,
                    "title": "胆小鬼"
                },
                {
                    "id": 3,
                    "title": "爱发呆"
                },
                {
                    "id": 4,
                    "title": "夜猫子"
                },
                {
                    "id": 5,
                    "title": "大叔控"
                },
                {
                    "id": 6,
                    "title": "星座"
                },
                {
                    "id": 7,
                    "title": "好奇心"
                },
                {
                    "id": 8,
                    "title": "耿直GIRL"
                },
                {
                    "id": 9,
                    "title": "铲屎官"
                },
                {
                    "id": 10,
                    "title": "宅"
                },
                {
                    "id": 11,
                    "title": "逗比"
                },
                {
                    "id": 12,
                    "title": "话痨"
                },
                {
                    "id": 13,
                    "title": "拖延症"
                },
                {
                    "id": 14,
                    "title": "外貌协会"
                },
                {
                    "id": 15,
                    "title": "吃货"
                },
                {
                    "id": 16,
                    "title": "傲娇"
                },
                {
                    "id": 17,
                    "title": "厨娘"
                },
                {
                    "id": 18,
                    "title": "独立"
                },
                {
                    "id": 19,
                    "title": "勤劳小蜜蜂"
                },
                {
                    "id": 20,
                    "title": "买买买"
                }
            ]
        },
        {
            "id": 4,
            "title": "兴趣",
            "content": [
                {
                    "id": 1,
                    "title": "自驾"
                },
                {
                    "id": 2,
                    "title": "游戏"
                },
                {
                    "id": 3,
                    "title": "逛街"
                },
                {
                    "id": 4,
                    "title": "烘焙"
                },
                {
                    "id": 5,
                    "title": "摄影"
                },
                {
                    "id": 6,
                    "title": "读书"
                },
                {
                    "id": 7,
                    "title": "运动"
                },
                {
                    "id": 8,
                    "title": "看电影"
                },
                {
                    "id": 9,
                    "title": "手工"
                },
                {
                    "id": 10,
                    "title": "收藏"
                },
                {
                    "id": 11,
                    "title": "绿植"
                },
                {
                    "id": 12,
                    "title": "旅行"
                },
                {
                    "id": 13,
                    "title": "酒"
                },
                {
                    "id": 14,
                    "title": "麻将"
                },
                {
                    "id": 15,
                    "title": "写作"
                },
                {
                    "id": 16,
                    "title": "唱歌"
                },
                {
                    "id": 17,
                    "title": "绘画"
                },
                {
                    "id": 18,
                    "title": "看剧"
                },
                {
                    "id": 19,
                    "title": "NBA"
                }
            ]
        },
        {
            "id": 5,
            "title": "运动",
            "content": [
                {
                    "id": 1,
                    "title": "滑板"
                },
                {
                    "id": 2,
                    "title": "滑雪"
                },
                {
                    "id": 3,
                    "title": "乒乓球"
                },
                {
                    "id": 4,
                    "title": "舞蹈"
                },
                {
                    "id": 5,
                    "title": "跆拳道"
                },
                {
                    "id": 6,
                    "title": "垂钓"
                },
                {
                    "id": 7,
                    "title": "骑行"
                },
                {
                    "id": 8,
                    "title": "篮球"
                },
                {
                    "id": 9,
                    "title": "健身"
                },
                {
                    "id": 10,
                    "title": "跑步"
                },
                {
                    "id": 11,
                    "title": "瑜伽"
                },
                {
                    "id": 12,
                    "title": "爬山"
                },
                {
                    "id": 13,
                    "title": "射箭"
                },
                {
                    "id": 14,
                    "title": "高尔夫"
                },
                {
                    "id": 15,
                    "title": "游泳"
                },
                {
                    "id": 16,
                    "title": "台球"
                },
                {
                    "id": 17,
                    "title": "露营"
                },
                {
                    "id": 18,
                    "title": "足球"
                },
                {
                    "id": 19,
                    "title": "徒步"
                },
                {
                    "id": 20,
                    "title": "羽毛球"
                }
            ]
        }
    ],
      /* eslint-endable */
      selectedLabel: this.chooseData
    }
  },
  mounted () {
    // eslint-disable-next-line
    // axios.get('/mock/').then(res => {
    //   let response = res.data.mySelectLabel
    //   this.allLabel = response
    // })
  },
  methods: {
    userSelfSelect (item) {
      // 单选的情况
      if (parseInt(this.maxLength) === 1) {
        this.$set(this.selectedLabel, 0, item)
        return
      }
      let index = this.selectedLabel.indexOf(item)
      if (index !== -1) {
        this.selectedLabel.splice(index, 1)
      } else {
        if (this.selectedLabel.length >= this.maxLength) {
          this.$toast(`最多选择${this.maxLength}个标签`, 750)
          return
        }
        this.selectedLabel.push(item)
      }
    },
    hiddleLabel () {
      this.$emit('showLabel',this.chooseData)
    },
    isSelected (item) {
      return this.selectedLabel.includes(item)
    },
    confirmLabel () {
      this.$emit('showLabel', this.selectedLabel)
    }
  }
}
</script>

<style lang="less" scoped>
.mySet-enter-active,.mySet-leave-active{
    transition: all 1s;
}
.mySet-enter,.mySet-leave-to{
    opacity: 0;
}
@keyframes changeSmall {
    0%{
        height: 21.48vw;
    }
    100%{
        height: 2vw;
    }
}
.move{
    animation: changeSmall ease .5s 0s forwards;
}
  .labelWrap{
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1001;
      background-color: white;
      overflow:  scroll;
      .labelHead{
          background-color: white;
          width: 100%;
          position: fixed;
          top: 0;
          left: 0;
          z-index:  2;
          display: flex;
          align-items:  center;
          justify-content:  space-between;
          height: 15vw;
          padding-left: 4vw;
          padding-right: 4vw;
          box-sizing:  border-box;
          color: #333333;
          span:nth-child(2) {
            margin-left: -50vw;
          }
          span:nth-child(3) {
            .activityNotice{
                font-size: 7vw;
                color:  #999999;
            }
          }
      }
      .label{
        margin-top: 15vw;
      }
      .labelAmout{
          width: 100%;
          height: 20vw;
          line-height: 20vw;
          color: #333333;
          font-size: 3.5vw;
          padding-left: 4vw;
          box-sizing:  border-box;
          font-weight:  bold;
      }
      .labelMain{
          font-size: 3.5vw;
          padding-left: 4vw;
          box-sizing:  border-box;
          transition: all 0.5s;
                span{
                    display:  inline-block;
                    height: 10vw;
                    line-height: 10vw;
                    padding: 0 4vw;
                    box-sizing:  border-box;
                    border: 1px solid #cccccc;
                    border-radius:  5vw;
                    margin: 3.24vw 3.24vw 3.24vw 0;
                    color: #555555;
                    transition: all 0.5s;
                }
                .changeColor{
                    // background-color: rgb(255, 40, 66);
                    color: rgb(255, 40, 66);
                    border: 1px solid rgb(255, 40, 66);
                }
      }
      .split{
          width: 100%;
          height: 21.48vw;
          background-color: var(--mBg)
      }
      .labelType{
          width: 93%;
          margin: auto;
          padding-top: 6vw;
          padding-bottom: 10vw;
          box-sizing:  border-box;
          font-size: 3.5vw;
          .eachType{
             p{
              color: #333333;
              font-weight:  bold;
              margin-bottom: 5vw;
            }
            .content{
                font-size: 3.5vw;
                span{
                    display:  inline-block;
                    height: 10vw;
                    line-height: 10vw;
                    padding: 0 4vw;
                    box-sizing:  border-box;
                    border: 1px solid #cccccc;
                    border-radius:  5vw;
                    margin: 3.24vw 3.24vw 3.24vw 0;
                    color: #555555;
                }
                .changeColor{
                    // background-color: rgb(255, 40, 66);
                    color: rgb(255, 40, 66);
                    border: 1px solid rgb(255, 40, 66);
                }
            }
          }
      }
      .load{
          width: 56.30vw;
          height: 16.30vw;
          background-color: white;
      }
  }
</style>
