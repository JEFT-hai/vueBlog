<template>
    <li class="grounpListWrap">
        <div class="groupAvator">
            <img :src="item.groupCover" alt="">
        </div>
        <div class="groupDes">
            <div class="title">{{item.groupName}}</div>
            <div class="detail">
                <span>
                    <i class="iconWanwan iconWstar1 activityNotice"></i>5
                </span>
                <span>79人</span>
                <span>活跃</span>
            </div>
            <div class="message">电影直播群，先入粉丝团再联系我们哦</div>
        </div>
    </li>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: function () {
        return {}
      }
    }
  }
}
</script>

<style lang="less" scoped>
.grounpListWrap{
    width:100%;
    height:23.61vw;
    padding-left:0.5vw;
    box-sizing: border-box;
    display:flex;
    align-items: center;
    .groupAvator{
        margin: 0 5vw;
        width:19.63vw;
        height:19.63vw;
        border-radius: 50%;
        overflow: hidden;
        border:1px solid rgb(243,243,243);
        img{
            width:100%;
            height:100%;
        }
    }
    .groupDes{
        width:60vw;
        margin-left:2.8vw;
        .title{
            width:49.07vw;
            font-size:4.4vw;
            color:#333333;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap
        }
        .detail{
            width:49.07vw;
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
             span:last-child{
                background-color:#9bd941;
            }
        }
        .message{
            width:48.37vw;
            font-size:3.7vw;
            color:#999999;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap
        }
    }
}
</style>
