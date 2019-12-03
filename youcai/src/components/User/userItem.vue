<template>
  <div class="userItem borderB">
    <avatar class="avatar"
            :item='item'></avatar>
    <div class="body">
      <div class="xingming">{{item.nickName}}</div>
      <div class="fensi">粉丝数：{{item.fansCount}}</div>
    </div>
  </div>
</template>
<script>
import avatar from '@/components/Avatar'
export default {
    props:{
        item: {
            type: Object,
            required: true
        }
    },
    components:{
        avatar
    }
}
</script>
<style lang="less" scoped>
.userItem{
    display: flex;
    padding: 10px 15px;
    align-items: center;
    position:relative;
    .avatar{
        margin-right: 3vw;
    }
    .rightBtn{
      position:absolute;
      bottom:3vw;
      left:12vw;
      z-index:12;
      background:white;
      box-shadow: 0 0 1px #eeee;
      width: 5vw;
      height:5vw;
      border-radius: 50%;
      display:flex;
      .one{
        margin:auto;
        display:inline-block;
        width:4.18vw;
        height:4.18vw;
        border-radius: 50%;
        // background:rgb(255, 39, 66);
        background: linear-gradient(to right bottom,#e37782, #f56b80,#ff5363,#ff405b, #fc3f58);
        color:white;
        line-height: 4.4vw;
        text-align: center;
        font-size:12px;
        font-weight: 500;
        box-sizing:border-box;
        font-family: Times, TimesNR, 'New Century Schoolbook', Georgia, 'New York', serif;
      }
    }
    .headImgWrap{
      width:12vw;
      height:12vw;
      border-radius: 20.370vw;
      overflow: hidden;
      img{
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      
    }
    .body{
        flex: 1;
        font-size: 2.593vw;
        line-height: 5.370vw;
        color: #898989;

        .xingming {
          font-size: 3.519vw;
          color: #373737;
          font-weight: bold;

          .level {
            line-height: 3.519vw;
            height: 3.519vw;
            padding: 0 0.833vw 0 2.037vw;
            background-color: #dd4726;
            border-radius: 0.556vw;
            color: #ffffff;
            font-size: 1.852vw;
            margin-left: 3.704vw;

            .jinpai {
              background-color: #c1a580;
              border: 0.463vw solid #a68758;
              border-radius: 1.667vw;
              font-family: Arial;
              height: 3.519vw;
              line-height: 3.519vw;
              vertical-align: middle;
              padding: 0 0.833vw;
              position: absolute;
              margin-left: -4.630vw;
              margin-top: 0.463vw;
              color: #7f633b;
            }

            .yinpai {
              background-color: #d9d9d9;
              border: 0.463vw solid #b3b3b3;
              border-radius: 1.667vw;
              font-family: Arial;
              height: 3.519vw;
              line-height: 3.519vw;
              vertical-align: middle;
              padding: 0 0.833vw;
              position: absolute;
              margin-left: -4.630vw;
              margin-top: 0.463vw;
              color: #7c7c7c;
            }
          }

          .color {
            color: #8bd8f6;
          }
      }
    }
  }
</style>
