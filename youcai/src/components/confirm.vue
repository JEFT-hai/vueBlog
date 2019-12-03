<template>
<transition name="mySet">
    <div class="logoutWrap" @click.stop="cancel(false)">
        <div class="logoutMain">
            <p>{{confirmTitle}}</p>
            <div class="confirm">{{confirmMsg}}</div>
            <div class="btn">
                <span @click.stop="cancel(false)">取消</span>
                <span @click.stop="confrimLogout">确定</span>
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
.logoutWrap{
    position: fixed;
    top:0;
    left:0;
    height:100vh;
    width:100%;
    z-index: 3001;
    background-color:rgba(0,0,0, 0.6);
    display:flex;
    .logoutMain{
        width:86.20vw;
        height:44.07vw;
        background-color:white;
        margin:auto;
        border-radius: 2vw;
        // padding-left:6.48vw;
        // padding-right:8.33vw;
        padding: 6vw 8.33vw 5.55vw 8.33vw;
        box-sizing: border-box;
        position:relative;
        z-index: 2;
        p{
            font-size:5.3vw;
            color:#333333;
            font-weight: 500;
        }
        .confirm{
            font-size:4.17vw;
            color:#333333;
            margin-top:3.5vw;
        }
        .btn{
            margin-left:41vw;
            margin-top:1vw;
            span{
                display:inline-block;
                font-size:3.7vw;
                color:var(--mblue);
            }
            span:first-child{
                margin-right:9vw;
            }
        }
    }
}
</style>
