<template>
<transition name="mySet">
    <div class="feelWrap">
            <ul>
                <li class="unique">
                    <span>情感状态</span>
                </li>
                <li @click="userSelect({id: 1, title: '保密'})">
                    <span>保密</span>
                    <span>
                        <i class="iconWanwan iconWgou activityNotice" v-show="index === 1"></i>
                    </span>
                </li>
                <li @click="userSelect({id: 2, title: '单身'})">
                    <span>单身</span>
                    <span>
                        <i class="iconWanwan iconWgou activityNotice" v-show="index === 2"></i>
                    </span>
                </li>
                <li @click="userSelect({id: 3, title: '恋爱中'})">
                    <span>恋爱中</span>
                    <span>
                        <i class="iconWanwan iconWgou activityNotice" v-show="index === 3"></i>
                    </span>
                </li>
                <li @click="userSelect({id: 4, title: '已婚'})">
                    <span>已婚</span>
                    <span>
                        <i class="iconWanwan iconWgou activityNotice" v-show="index === 4"></i>
                    </span>
                </li>
            </ul>
    </div>
</transition>
</template>

<script>
export default {
  data () {
    return {
      item: null,
      index: 1
    }
  },
  methods: {
    userSelect (item) {
      this.index = item.id
      this.item = item
      this.$emit('showFeel', item)
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
.feelWrap{
    width:100%;
    height:100%;
    background-color:rgba(0,0,0,.6);
    position:absolute;
    top:0;
    left:0;
    z-index: 1000;
    display:flex;
    ul{
        margin:auto;
        background-color:white;
        width:86vw;
        height:77.22vw;
        border-radius: 2vw;
        padding-left:6.48vw;
        box-sizing: border-box;
        display:flex;
        flex-flow: column wrap;
        li{
            flex:1;
            display:flex;
            align-items: center;
            justify-content: space-between;
            color:#999999;
            font-size:4vw;
            .activityNotice{
                margin-right:6vw;
                color:#999999;
                font-size:6vw;
            }
        }
        .unique{
            font-size:5vw;
            font-weight: 500vw;
            color:#333333;
        }
    }
}
</style>
