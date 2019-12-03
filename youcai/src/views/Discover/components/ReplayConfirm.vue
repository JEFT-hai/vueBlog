<template>
  <div class="replayConfirmPage">
    <div class="maskReplay"
         @click.stop="cancel"></div>
    <ul class="replayList">
      <li class="liOne borderB">{{replayConfirm.nickName}}:&nbsp;{{replayConfirm.content}}</li>
      <li class="liTwo borderB"
          @click="goReplay">回复</li>
      <li class="liThree"
          @click="goReport">举报</li>
      <li class="liFour"
          @click.stop="cancel">取消</li>
    </ul>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
export default {
  computed: {
    ...mapState(['replayConfirm'])
  },
  methods: {
    ...mapMutations(['updateReplayState', 'updateShowConfirm']),
    cancel () {
      console.log('我是取消')
      // this.$emit('handleReplayConfirm', false)
      this.updateShowConfirm(false)
    },
    goReplay () {
      this.updateReplayState(true)
      // this.$emit('handleReplayConfirm', false)
      this.updateShowConfirm(false)
    },
    goReport () {
      let me = this
      this.$router.push({
        name: 'report',
        params: { id: me.replayConfirm.commentId, type: 3} // 3表示评论
      })
      this.updateShowConfirm(false)
    }
  }
}
</script>

<style lang="less" scoped>
.replayConfirmPage{
    width:100vw;
    height:100vh;
    position:fixed;
    top:0;
    left:0;
    z-index:1000;
    .maskReplay{
        width:100%;
        height:68vh;
        background:rgba(0,0,0,.5);
    }
    .replayList{
        height:32vh;
        width:100%;
        background:rgba(0,0,0,.5);
        font-size:0;
        .liOne{
            width:100%;
            padding: 0 1vw;
            box-sizing: border-box;
            font-size:4vw;
            color:#8e8e8e;
            text-align: center;
            height:20vw;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            height:13.33vw;
            line-height:13.33vw;
            background:white;
            border-radius: 2vw 2vw 0 0;
        }
        .liTwo{
            font-size:4.5vw;
            color:rgb(38, 139, 210);
            text-align: center;
            height:13.33vw;
            line-height:13.33vw;
            background:white;
        }
        .liThree{
            font-size:4.5vw;
            color:rgb(38, 139, 210);
            text-align: center;
            height:13.33vw;
            line-height:13.33vw;
            background:white;
            border-radius:0 0 2vw 2vw;
        }
        .liFour{
            margin-top:2vw;
            margin-bottom:1vw;
            font-size:4.5vw;
            color:rgb(38, 139, 210);
            text-align: center;
            height:13.33vw;
            line-height:13.33vw;
            background:white;
            border-radius:2vw 2vw 2vw 2vw;
        }
    }
}
</style>