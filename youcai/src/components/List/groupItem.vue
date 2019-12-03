<template>
    <div class="groupItem borderT">
        <div class="groupAvator">
            <img :src="cover" alt="" :class="{defaultStyle: item.avatar === null || item.avatar === '' }">
        </div>
        <div class="groupDes">
            <div class="title">{{item.groupName}}</div>
            <div class="detail">
                <span v-if="item.groupLevel">
                    <i class="iconWanwan iconWstar1 activityNotice"></i>{{item.groupLevel}}
                </span>
                <span>{{item.countMember <= 0 ? 0 : item.countMember}}人</span>
                <!-- <span v-show="item.countMember">{{item.countMember}}人</span> -->
                <span>赞{{calaulateCount}}</span>
            </div>
            <div class="message">{{item.groupStatement}}</div>
        </div>
        <div class="distance"><span v-if="calculateDistance">{{calculateDistance}}km</span></div>
    </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object
    }
  },
  computed: {
    cover () {
      return this.item.groupCover || 'http://webapp.szwanwan.com/img/default/defaultavatar.png'
    },
    /**
     * calculateDistance计算距离
     */
    calculateDistance () {
       if (this.item && this.item.distance) {
         let current = this.item.distance / 1000
         return this.toDecimal2(current)
       } else {
           return 0
       }
    },
    calaulateCount () {
      if (this.item.countLike > 1000 &&this.item.countLike <= 9999) {
        let newStr =this.item.countLike.toString()
        let str = newStr.substring(0,1)
        return str + 'k'
      } else if (this.messageCount >= 10000) {
        let newStr =this.item.countLike.toString()
        let str = newStr.substring(0,2)
        return str + 'k'
      } else {
        return this.item.countLike
      }
    }
  },
  methods: {
    /**
     * toDecimal2保留两位小数
     */
   toDecimal2(x) { 
    var f = parseFloat(x); 
    if (isNaN(f)) { 
        return false
    } 
    var f = Math.round(x * 100) / 100; 
    var s = f.toString()
    var rs = s.indexOf('.')
    if (rs < 0) { 
        rs = s.length; 
        s += '.'
    } 
    while (s.length <= rs + 2) { 
        s += '0'
    } 
    return s
    }
  }
}
</script>

<style lang="less" scoped>
.groupItem{
    width:100%;
    height:26vw;
    padding: 2vw 0.5vw;
    // padding-left: 0.5vw;
    box-sizing: border-box;
    display:flex;
    align-items: center;
    background: #fff;
    position:relative;
    .groupAvator{
        width:19.63vw;
        height:19.63vw;
        margin-left: 4vw;
        border-radius: 50%;
        overflow: hidden;
        border:1px solid rgb(243,243,243);
        img{
            width:100%;
            height:100%;
        }
    }
    .groupDes{
        flex: 1;
        // margin:0 2.8vw;
        max-width: 51vw;
        padding: 0 2.8vw;
        .title{
            // width:49.07vw;
            font-size:4.4vw;
            color:#333333;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap
        }
        .detail{
            // width:49.07vw;
            span{
                display:inline-block;
                width:9vw;
                height:4.3vw;
                border-radius: 3vw;
                margin-right:0.93vw;
                font-size:2.8vw;
                color:white;
                text-align: center;
                line-height:4.3vw;
            }
            span:nth-child(1){
                background-color:#fe8d54;
                .activityNotice{
                    color:#fdda35;
                }
            }
            span:nth-child(2){
                background-color:#4dd3e7;
            }
            span:nth-child(3){
                background-color:#9bd941;
            }
        }
        .message{
            font-size:3.7vw;
            color:#999999;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap
        }
        // .distance{
        //     position:absolute;
        //     right:4vw;
        //     top:0;
        //     height:26vw;
        //     line-height:26vw;
        //     color:#adadad;
        //     font-size:3.5vw;
        // }
    }
    .distance{
        width: 25vw;
        height: 26vw;
        line-height:32vw;
        color:#aaaaaa;
        font-size:3.7vw;
        text-align: center;
    }
}
</style>
