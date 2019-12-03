<template>
  <li class="draftItem borderB"
      ref='draftItem'
      @touchstart='touchstart($event)'
      @touchmove='touchmove($event)'
      @touchend='touchend($event)'>
    <div class="draftMain"
         ref='draftMain'>
      <div class="draftImg">
        <img :src="postImg"
             alt=""
             v-if="isPost">
        <img :src="activityImg"
             alt=""
             v-else>
      </div>
      <div class="draftContent">
        <span>
          {{item.title}}
        </span>
        <span>{{item.saveTime}}</span>
      </div>
    </div>
    <div class="deleteBtn"
         @click.stop="deleteDraftItem">删除</div>
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
      },
      index: {
        type: Number,
        default: 0
      },
      isPost: {
        type: Boolean,
        default: false
      }
    },
    mounted () {
      console.log(this.item)
    },
    data () {
      return {
        startX: 0,
        startY: 0,
        moveX: 0,
        moveY: 0,
        endX: 0,
        endY: 0,
        disX: 0,
        disY: 0,
        deleteLeft: false
      }
    },
    computed: {
      activityImg () {
        return  this.item.filesResults || 'http://webapp.szwanwan.com/img/default/cover.png'
      },
      postImg () {
        return this.item.imgs[0] || 'http://webapp.szwanwan.com/img/default/cover.png'
      }
    },
    methods: {
      touchstart (e) {
        this.startX = e.touches[0].clientX
        this.startY = e.touches[0].clientY
        this.$emit('resetOther', this.index)
      },
      touchmove (e) {
        this.moveX = e.touches[0].clientX

        this.moveY = e.touches[0].clientY
        this.disY = this.moveY - this.startY
        let disY = this.disY > 0 ? this.disY : -this.disY
        this.disX = this.moveX - this.startX
        // this.disX += this.moveX - this.startX
        let disX = this.disX > 0 ? this.disX : -this.disX
        if (disY >= disX || disY > 30) {
          return
        }
        let windowWidth = window.innerWidth
        this.disX = this.disX < -windowWidth * 0.3 ? -windowWidth * 0.3 : this.disX
        this.disX = this.disX > 0 ? 0 : this.disX
        this.$refs.draftMain.style.transform = 'translate3d(' + (this.disX) + 'px, 0, 0)'
      },
      touchend (e) {
        let windowWidth = window.innerWidth
        this.startX = 0
        // 以中间为界限
        this.disX = this.disX > -windowWidth * 0.15 ? 0 : -windowWidth * 0.3
        // this.disX = this.disX > 0 ? 0 : this.disX
        this.$refs.draftMain.style.transform = 'translate3d(' + (this.disX) + 'px, 0, 0)'
      },
      deleteDraftItem () {
        this.$refs.draftMain.style.transform = ''
        this.$emit('deleteDraftItem', this.index)
      }
    }
}
</script>

<style lang="less" scoped>
    .draftItem{
        width:100%;
        height:36.3vw;
        position: relative;
        // overflow: hidden;
        // display:flex;
        .draftMain {
          position: absolute;
          top: 0;
          left: 0;
          display: flex;
          width: 100vw;
          height: 100%;
          align-items: center;
          z-index: 10;
          background: #fff;
          transition: all 0.25s ease-in-out;
        }
        .deleteBtn {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          text-align: right;
          padding: 0 10vw;
          color: #fff;
          height: 100%;
          line-height: 36.3vw;
          background-color: var(--mRed);
        }
        .draftImg{
          width:36vw;
          height:28vw;
          overflow: hidden;
          margin-left:4vw;
          border:1px solid rgb(243,243,243);
          img {
            width: 100%;
            height: 100%;
          }
        }
        .draftContent{
            flex:1;
            margin-left:5.2vw;
            font-size:4vw;
            height:28vw;
            span:nth-child(1){
                color:#333;
                display:inline-block;
                height:13.26vw;
                width:60vw;
                overflow: hidden;
                text-overflow:ellipsis;//文本溢出显示省略号
                display: -webkit-box;
                 -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                margin-top:1vw;
                margin-bottom:6vw;
            }
            span:nth-child(2){
                color:#999;
            }
        }
    }
</style>
