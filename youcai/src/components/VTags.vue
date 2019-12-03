<template>
<transition name="mySet">
    <div class="labelWrap">
        <div class="labelHead">
            <span @click="hiddleLabel">
                <i class="iconWanwan iconWfanhui activityNotice"></i>
            </span>
            <span>{{title}}</span>
            <span @click="confirmLabel">
                <i class="iconWanwan iconWgou activityNotice"></i>
            </span>
        </div>
        <div class="label">
            <div class="labelAmout" v-if="maxLength=== 1">
            只能选一个标签
            </div>
            <div class="labelAmout" v-else>
            已选标签&nbsp;{{selectedLabel.length}}
            </div>
            <div class="labelMain" v-show="selectedLabel.length > 0">
                <span :class="{changeColor:isSelected(item)}" v-for="(item,index) in selectedLabel" :key="index" @click="userSelfSelect(item)">{{item}}</span>
            </div>
            <div :class="['split', {move: selectedLabel.length > 0 }]"></div>
            <div class="labelType">
                <div class="eachType" v-for="(eachLabel,index) in allLabel" :key="index">
                    <p>{{eachLabel.title}}</p>
                    <div class="content">
                        <span :class="{changeColor:isSelected(item)}" v-for="(item,index) in eachLabel.tags" :key="index" @click="userSelfSelect(item, eachLabel.title)">{{item}}</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="load">
            <span class="loadImg"></span>
            <span>正在提交，请稍后 </span>
        </div> -->
    </div>
</transition>
</template>

<script>
export default {
  props: {
    isNeedTitle: { // 表示需要传title
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '标签'
    },
    labels: {
      type: Array,
      default: null
    },
    maxLength: {
      type: Number,
      default: 4
    },
    chooseData: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      allLabel: this.labels,
      selectedLabel: []
    }
  },
  watch: {
    chooseData (newV) {
      this.selectedLabel = newV
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
    userSelfSelect (item, title) {
      if (this.isNeedTitle) {
        this.$emit('groupCategory',title)
      }
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
          this.$toast(`最多选择${this.maxLength}个标签`, 500)
          return
        }
        this.selectedLabel.push(item)
      }
    },
    hiddleLabel () {
      this.$emit('showLabel')
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
    transition:all 1s;
}
.mySet-enter,.mySet-leave-to{
    opacity:0;
}
@keyframes changeSmall {
    0%{
        height:21.48vw;
    }
    100%{
        height:2vw;
    }
}
.move{
    animation:changeSmall ease .5s 0s forwards;
}
  .labelWrap{
      width:100%;
      height:100%;
      position:fixed;
      top:0;
      left:0;
      z-index:1001;
      background-color:white;
      overflow: scroll;
      .labelHead{
          background-color:white;
          width:100%;
          position:fixed;
          top:0;
          left:0;
          z-index: 2;
          display:flex;
          align-items: center;
          justify-content: space-between;
          height:15vw;
          padding-left:4vw;
          padding-right:4vw;
          box-sizing: border-box;
          color:#333333;
          span:nth-child(2){
            margin-left:-50vw;
          }
          span:nth-child(3) {
            .activityNotice{
                font-size:7vw;
                color: #999999;
            }
          }
      }
      .label{
        margin-top:15vw;
      }
      .labelAmout{
          width:100%;
          height:20vw;
          line-height:20vw;
          color:#333333;
          font-size:3.5vw;
          padding-left:4vw;
          box-sizing: border-box;
          font-weight: bold;
      }
      .labelMain{
          font-size:3.5vw;
          padding-left:4vw;
          box-sizing: border-box;
          transition:all 0.5s;
                span{
                    display: inline-block;
                    height:10vw;
                    line-height:10vw;
                    padding:0 4vw;
                    box-sizing: border-box;
                    border:1px solid #cccccc;
                    border-radius: 5vw;
                    margin:3.24vw 3.24vw 3.24vw 0;
                    color:#555555;
                    transition:all 0.5s;
                }
                .changeColor{
                    // background-color:rgb(255, 40, 66);
                    color:rgb(255, 40, 66);
                    border:1px solid rgb(255, 40, 66);
                }
      }
      .split{
          width:100%;
          height:21.48vw;
          background-color:var(--mBg)
      }
      .labelType{
          width:93%;
          margin:auto;
          padding-top:6vw;
          padding-bottom:10vw;
          box-sizing: border-box;
          font-size:3.5vw;
          .eachType{
             p{
              color:#333333;
              font-weight: bold;
              margin-bottom:5vw;
            }
            .content{
                font-size:3.5vw;
                span{
                    display: inline-block;
                    height:10vw;
                    line-height:10vw;
                    padding:0 4vw;
                    box-sizing: border-box;
                    border:1px solid #cccccc;
                    border-radius: 5vw;
                    margin:3.24vw 3.24vw 3.24vw 0;
                    color:#555555;
                }
                .changeColor{
                    // background-color:rgb(255, 40, 66);
                    color:rgb(255, 40, 66);
                    border:1px solid rgb(255, 40, 66);
                }
            }
          }
      }
      .load{
          width:56.30vw;
          height:16.30vw;
          background-color:white;
      }
  }
</style>
