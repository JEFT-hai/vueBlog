<template>
  <div id='modeWrapper' v-show='msg.title'>
    <div class='model_mask' @click='modelCallBack(false)'>
    </div>
    <div class='model_plate'>
      <h3 class='title'>{{msg.title}}</h3>
      <p class='info'>{{msg.info}}</p>
      <div class='doubleBtn'>
        <span class='btn btn_L' @click='modelCallBack(false)'>{{msg.L}}</span>
        <span class='btn btn_R' @click='modelCallBack(true)'>{{msg.R}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    msg: {
      type: Object,
      default: null
    }
  },
  watch: {
    msg (newV) {
      return newV
    }
  },
  data () {
    return {
    }
  },
  methods: {
    modelCallBack (data) {
      this.$emit('modelCallBack', data)
    }
  }
}
</script>

<style lang="less">
#modeWrapper{
  position: fixed;
  top: 0;
  bottom:0;
  left:0;
  right:0;
  z-index: 10000;
  .model_mask{
    position: absolute;
    top:0;
    bottom:0;
    left:0;
    right:0;
    z-index: 1000;
    background:rgba(0,0,0,.7);
  }
  .model_plate{
    position: absolute;
    min-width: 80vw;
    border-radius: 2vw;
    padding: 4vw;
    top:45%;
    left:50%;
    transform: translate3d(-50%,-50%,0);
    background:#fff;
    z-index: 10001;
    .title{
      height: 8vw;
      line-height: 8vw;
    }
    .info {
      margin:4vw 1vw;
      line-height: 6vw;
    }
    .doubleBtn{
      font-size:0;
      overflow: hidden;
      height: 8vw;
      line-height:8vw;
      .btn{
        display:inline-block;
        font-size: 4vw;
        padding: 0 3vw;
      }
      .btn_L{
        color: #4cd4e9;
      }
      .btn_R{
        float: right;
        color: #ff2742;
      }
    }
  }
}
</style>
