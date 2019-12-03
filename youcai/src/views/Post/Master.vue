<template>
  <div class="postWrap">
    <tab-move ref="tabMove"
              @scroll='goTab'
              :tabData='tab'
              :currentTab='curTab'
              class="tabLinkList"></tab-move>
    <div class="postInner">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import tabMove from '@/components/tabMove.vue'
import {mapState, mapMutations} from 'vuex'
export default {
    components: {
        tabMove
    },
    data () {
        return {
            tab: ['笔记', '活动'],
            curTab: 0,
            curLeft: '0',
            myIndex: 0,
            path: this.$route.name,
            initPath: ''
        }
    },
    created () {
        if (this.$route.name === 'postActivity') {
          this.curTab = 1
        }
    },
    computed: {
      ...mapState(['masterCurTab', 'isReallyBack', 'postCurTab']),
      postCurTab () {
        return this.$store.state && this.$store.state.postCurTab
      }
    },
    mounted () {
        this.$nextTick(() => {
          // this.caculateLeft()
        })
    },
    beforeRouteEnter(to, from, next) {
      // next()
      next(vm => {
          vm.initPath = from.name
          vm.updateInitPath(vm.initPath)
      })
    },
    watch: {
      postCurTab (newV) {
        this.$refs.tabMove.tab(newV)
      },
    },
    methods: {
       ...mapMutations(['updateInitPath']),
        goTab (index) {
            // this.curTab = index
            if (index === 0) {
               this.goPost() 
            } else {
               this.goAvtivity()
            }
            this.myIndex = index
        },
        goPost () {
            this.postCurTab && this.$refs.tabMove.tab(this.postCurTab)
            this.$router.replace({
                name: 'postPost'
            })
        },
        goAvtivity () {
            !this.postCurTab && this.$refs.tabMove.tab(this.postCurTab)
            if (!this.$store.state.user.ownGroupCount) {
                this.showConfirm.toGroup()
                return
            }
            this.$router.replace({
                name: 'postActivity'
            })
        }
    }
}
</script>
<style lang="less">
  .postWrap {
    .postInner{
        height: calc(100vh - 24vw);
        overflow-y: scroll;
    }
    .tabLinkList{
        width: 100%;
        height: 12vw;
        line-height: 12vw;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 3px #efefef;
        > span{
            flex: 1;
            text-align: center;
            color:#a5a5a5;
        }
        span.curTab{
            color: var(--dGray);
        }
    }
    // .masterTabList{
    //     // flex: 1;
    //     // font-size: 0;
    //     // text-align: center;
    //     // position:relative;
    //     // justify-content: center;
    //     width: 100%;
    //     height: 12vw;
    //     line-height: 12vw;
    //     display: flex;
    //     align-items: center;
    //     justify-content: center;
    //     box-shadow: 0 0 3px #efefef;
    //     position:relative;
    //     font-size: 0;
    //     span{
    //       flex: 1;
    //       text-align: center;
    //       color:#a5a5a5;
    //     }
    //     .curTab{
    //       // font-weight: bold;
    //       // color: var(--mRed);
    //       font-size: var(--mTitle);
    //       transition: all 0.2s ease;
    //     }
    //     .tabBottom{
    //       position: absolute;
    //       left: 0;
    //       bottom: 1.2vw;
    //       width: 7.6vw;
    //       height: 0.5vw;
    //       margin-left: -3.8vw;
    //       background: var(--mRed);
    //       transition: all 0.25s ease-in-out;
    //     }
    // }
    .masterTabList{
      width:100%;
      height:12vw;
      display:flex;
      justify-content: space-around;
    //   border:1px solid blue;
      position:relative;
      span{
         width:12vw;
         display:flex;
         height:12vw;
         align-items: center;
         justify-content: center;
         color:#a5a5a5;
         font-size: var(--mTitle);
      }
      .curTab{
          color: var(--dGray);
          transition: all 0.2s ease;
       }
      .tabBottom{
          position: absolute;
          left: 0;
          bottom: 1.2vw;
          width: 7.6vw;
          height: 0.5vw;
          margin-left: -3.8vw;
          background: var(--mRed);
          transition: all 0.25s ease-in-out;
      }
    }
  }
</style>
