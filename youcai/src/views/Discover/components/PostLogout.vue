<template>
<transition name="mySet">
    <div class="postLogoutPage" @click.stop="cancel(false)">
        <div class="logoutMain">
            <div class="confromImg">
                <span class="one"></span>
                <span class="two"></span>
                <span class="three">
                    <i class="iconWsanjiaoxing iconWanwan"></i>
                </span>
                <span class="four"></span>
                <div class="imgWrap">
                    <img src="../../../assets/images/笔芯.png" alt="">
                </div>
                <span class="one1"></span>
                <span class="two2">
                    <i class="iconWsanjiaoxing iconWanwan"></i>
                </span>
                <span class="three3"></span>
                <span class="four4">
                    <i class="iconWsanjiaoxing iconWanwan"></i>
                </span>
            </div>
            <div class="confirm">{{confirmMsg}}</div>
            <div class="btn">
                <span @click.stop="confrimLogout">退出</span>
                <span @click.stop="cancel(false)">留下</span>
            </div>
        </div>
    </div>
</transition>
</template>

<script>
export default {
  props: {
    confirmTitle: { // 确定标题
      type: String
    },
    confirmMsg: { //确定信息
      type: String
    }
  },
  methods: {
    cancel (data) {
      this.$emit('handleConfirm',data)
    },
    confrimLogout () {
      this.$emit('really')
    }
  }
}
</script>

<style lang="less" scoped>
.mySet-enter-active,.mySet-leave-active{
    transition:all 0.5s;
}
.mySet-enter,.mySet-leave-to{
    opacity:0;
}
.postLogoutPage{
    position: fixed;
    top:0;
    left:0;
    height:100vh;
    width:100%;
    z-index: 1002;
    background-color:rgba(0,0,0, 0.6);
    display:flex;
    .logoutMain{
        width:75.18vw;
        height:70.37vw;
        background-color:white;
        margin:auto;
        border-radius: 2vw;
        padding: 6vw 8.33vw 5.55vw 8.33vw;
        box-sizing: border-box;
        position:relative;
        z-index: 2;
        overflow: hidden;
        .confromImg{
            height:36.48vw;
            width:100%;
            position:relative;
            .one{
              position:absolute;
              top:-3vw;
              left:5vw;
              width:1.8vw;
              height:1.8vw;
              border-radius: 50%;
              background:#ffd117;
            }
            .two{
              position:absolute;
              top:5vw;
              left:-2vw;
              width:1vw;
              height:1vw;
              border-radius: 50%;
              background:#ff626c;
            }
            .three{
              position:absolute;
              top:10vw;
              left:2vw;
              color:#a36fff;
            }
            .four{
              position:absolute;
              bottom:6vw;
              left:3vw;
              width:1.48vw;
              height:1.48vw;
              background:#4dc5a4;
              transform: rotate(45deg);
            }
            .one1{
              position:absolute;
              top:0vw;
              right:0vw;
              width:2.22vw;
              height:2.22vw;
              transform: rotate(15deg);
              background:#ffd117;
            }
            .two2{
              width:1.48vw;
              height:1.48vw;
              position:absolute;
              top:5vw;
              right:1vw;
              color:#4dc5a4;
              transform: rotate(45deg);
            }
            .three3{
              position:absolute;
              bottom:10vw;
              right:0vw;
              color:#a36fff;
              width:1.48vw;
              height:1.48vw;
              background: #a36fff;
              border-radius: 50%;
            }
            .four4{
              color:#fe6e7a;
              font-size:3vw;
               position:absolute;
              bottom:5vw;
              right:9vw;
              transform: rotate(-45deg);
              z-index: 12;
            }
            .imgWrap{
                height:19.90vw;
                position:relative;
                img{
                    position: absolute;
                    top:-10vw;
                    left:0;
                    right:0;
                    margin:0 auto;
                }
            }
        }
        .confirm{
            font-size:4.72vw;
            color:#333333;
            // margin-top:3.5vw;
            width:100%;
            text-align: center;
        }
        .btn{
            // margin-left:41vw;
            // margin-top:1vw;
            width:100%;
            display:flex;
            justify-content: space-between;
            span:nth-child(1){
                width:20.87vw;
                height:9.6vw;
                line-height:9.6vw;
                text-align: center;
                display:inline-block;
                font-size:4.44vw;
                color:#929292;
                border:1px solid #e3e3e3;
                border-radius: 4vw;
            }
             span:nth-child(2){
                width:20.87vw;
                height:9.6vw;
                line-height:9.6vw;
                text-align: center;
                display:inline-block;
                font-size:4.44vw;
                color:white;
                background:rgb(255, 39, 66);
                border-radius: 4vw;
            }
        }
    }
}
</style>
