<template>
    <div class="recommendGroupList" ref='RGroupListWrap'>
      <ul class="RGroupList" ref='RGroupList'>
        <li class="reCommendGroupItem" v-for='(item, index) in arr' :key="index" ref='groupItem'>
          <span class="closeItem" @click.stop='closeItem($event, index)'>
            <i class="iconWanwan iconWquxiao activityNotice"></i>
          </span>
          <div class="Avator">
            <!-- <router-link :to="{ name: 'discoverUser', params: { Name: eachFollow.userId }}"> -->
              <!-- <img alt=""> -->
            <!-- </router-link> -->
          </div>
          <div class="detail">
            <span class="groupName">文化交流文化交流</span>
            <div class="tagList">
              <span>
                <i class="iconWanwan iconWstar1 activityNotice"></i>5
              </span>
              <span>79人</span>
              <span>活跃</span>
            </div>
          </div>
          <div class="applyGroupBtnWrap">
            <div class="applyGroupBtn">
              申请入群
            </div>
          </div>
        </li>
      </ul>
    </div>
</template>
<script>
// import groupItem from '@/components/RecommendFollow/groupItem'
export default {
  data () {
    return {
      arr: [1, 2, 3, 4]
    }
  },
  mounted () {
    let allW = 0
    for (let i = 0; i < this.arr.length; i++) {
      console.log(this.$refs.groupItem[i])
      allW += this.$refs.groupItem[i].offsetWidth + 8
    }
    this.$refs.RGroupList.style.width = allW + 1 + 'px'
    this.hScroll = new window.BScroll(this.$refs.RGroupListWrap, {
      click: false,
      scrollX: true
    })
  },
  methods: {
    closeItem (event, index) {
      // !event._constructed) { //去掉自带的click事件点击，即pc端直接返回
      console.log(index, 99)
      this.arr.splice(index, 1)
    }
  }
}
</script>
<style lang="less">
.recommendGroupList{
  width:100vw;
  overflow: hidden;
  // overflow-y: scroll;
  background: transparent;
  ul{
    padding-left: 8px;
    background: transparent;
    font-size: 0;
    .reCommendGroupItem{
      display:inline-block;
      width:36vw;
      height:52.4vw;
      background-color:rgb(255, 255, 255);
      border-radius: 3vw;
      padding-top:3vw;
      margin-right: 8px;
      position:relative;
      box-sizing: border-box;
      .Avator{
        width:19.2vw;
        height:19.2vw;
        border-radius: 50%;
        margin:auto;
        border:1px solid rgb(243,243,243);
        overflow:hidden;
      }
      .closeItem{
        position:absolute;
        right:3vw;
      }
      .detail{
        .groupName{
          display:block;
          text-align: center;
          color:#363636;
          font-size:3.73vw;
          letter-spacing: 1px;
          font-weight: bold;
          margin-top: 3vw;
          height: 8vw;
          line-height: 8vw;
        }
        .tagList{
          text-align: center;
          font-size: 0;
          span{
            display:inline-block;
            width: 11vw;
            height: 6vw;
            border-radius: 3vw;
            margin-left: -0.5vw;
            font-size: 11px;
            color:white;
            text-align: center;
            line-height: 6vw;
            transform: scale(0.8);
            i{
              display: inline-block;
              margin-left: -1vw;
              margin-right: 1vw;
            }
          }
          span:nth-child(1){
            background-color:#fe8d54;
            margin-right: -1vw;
            .activityNotice{
              color:#fdda35;
            }
          }
          span:nth-child(2){
            background-color:#4dd3e7;
          }
          span:last-child{
            margin-left: -1vw;
            background-color:#9bd941;
          }
        }
      }
      .applyGroupBtnWrap{
        height: 12vw;
        overflow: hidden;
        .applyGroupBtn{
          height: 7vw;
          line-height: 7vw;
          border-radius: 3.5vw;
          width: 30vw;
          margin: 2.5vw auto;
          background: var(--mRed);
          color: #fff;
          text-align: center;
          font-size: var(--nText);
        }
      }
    }
  }
}
</style>
