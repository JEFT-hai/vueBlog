<template>
  <li class="reCommentsItem commentsItem">
    <router-link class="avatar" :to="{ name: 'discoverUser', params: { Name: item.id }}">
      <img :src="config.imageOrigin + item.userAvator" alt v-if="item != null" />
    </router-link>
    <div class='discuzInfo'>
        <p class="title">{{item.userName}}</p>
        <div class="bottomInfo">
            <p class="createTime" v-if='item.createTime.length > 12'>{{item.createTime.substr(5,11)}}</p>
            <p class="createTime" v-else>{{item.createTime}}</p>
        </div>
        <p class="comments">{{item.commentDetail}}</p>
    </div>
  </li>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: null
    }
  },
  created () {
    // console.log(this.item, 999)
  },
  methods: {
    showCommentedList () {
      console.log(this.item, 888)
    }
  }
}
</script>
<style lang="less">
  li.reCommentsItem{
    // box-sizing: border-box;
    // padding: 4vw 3vw 0 4vw;
    padding-top: 4vw;
    width: 100vw;
    display: flex;
    position: relative;
    .avatar {
      width:15.2vw;
      text-align: right;
      margin-top: 1.333vw;
      img{
        display: inline-block;
        width: 8.5vw;
        height: 8.5vw;
        border-radius: 50%;
        box-shadow: 0 0 3px #e0e0e0;
        overflow: hidden;
      }
    }
    .discuzInfo {
      flex:1;
      padding-left: 2.666vw;
      // &:after{
      //   position: absolute;
      //   content: '';
      //   display: block;
      //   bottom:0;
      //   left: 0;
      //   right: 0;
      //   height: 1px;
      //   background-color: #e8e8e8;
      // }
      //   @media only screen and (-webkit-min-device-pixel-ratio:1.5) {
      //   &:after{
      //       transform: scaleY(0.7);
      //   }
      //   }
      //   @media only screen and (-webkit-min-device-pixel-ratio:2) {
      //   &:after{
      //       transform: scaleY(0.5);
      //   }
      //   }
      //   @media only screen and (-webkit-min-device-pixel-ratio:3) {
      //   &:after{
      //       transform: scaleY(0.34);
      //   }
      //   }
    .title{
    //   height: 6.4vw;
    //   line-height: 6.4vw;
        height: 6.6vw;
        line-height: 6.6vw;
        font-size: 3.73vw;
        font-weight: 700;
        color:#333;
    }
    .bottomInfo{
      display:flex;
      height: 3.46vw;
      line-height: 3.46vw;
      // margin-bottom: 3.2vw;
      font-size: 2.4vw;
      color:#909090;
        .createTime{
          flex: 1;
          font-size: 1.34vw;
        }
        .reComment{
          width: 10vw;
          text-align: center;
        i{
          display:inline-block;
          margin-right: 1.5vw;
        }
      }
    }
    .comments{
        line-height: 6.1vw;
    //   padding: 6px 0 6px;
        padding:2vw 0 3.46vw;
        font-size: 3.7vw;
        color:#3f3f3f;
    }
    }
  }
</style>
