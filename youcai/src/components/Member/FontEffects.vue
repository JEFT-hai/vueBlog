<template>
    <div class="bubblePage">
        <div class="bubbleHead">
            <span class="bubbleTitle">炫酷个性昵称</span>
            <span class="bubbleDetail">让你的昵称更出色</span>
            <span class="lookMore" @click="go.name('nameColor')">更多></span>
        </div>
        <div class="bubbleContent">
            <div class="bubbleOne" v-for='(item, index) in effectList1' :key='index'>
                <div class="boxOne">
                    <div class="boxWrap" @click='goName(item)'>
                        <text-effect :effect='item.Ename'></text-effect>
                    </div>
                    <span>{{item.name}}</span>
                </div>
            </div>
        </div>
        <div class="bubbleContent">
            <div class="bubbleOne" v-for='(item, index) in effectList2' :key='index'>
                <div class="boxOne">
                    <div class="boxWrap" @click='goName(item)'>
                        <text-effect :effect='item.Ename'></text-effect>
                    </div>
                    <span>{{item.name}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import textEffect from '@/components/TextEffect/textEffect'
export default {
    components: {
        textEffect
    },
  data () {
      return {
          effectList1: [{
            Ename: 'aniBop',
            name: '放大动效'
          },
          {
            Ename: 'aniBopB',
            name: '倾斜动效'
          },
          {
            Ename: 'textFill',
            name: '彩色变换'
          }],
          effectList2: [{
            Ename: 'twinkling',
            name: '细体闪烁'
          },
          {
            Ename: 'blodTwinkling',
            name: '粗体闪烁'
          },
          {
            Ename: 'stokeTwinkling',
            name: '镂空闪烁'
          }]
      }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
      goName (item) {
          this.$router.push({
              name: 'nameColor',
              params: {
                curName: item.name
              }
          })
      }
  }
}
</script>

<style lang="less" scoped>
   .bubblePage{
     .bubbleHead{
        padding-top:5.46vw;
        box-sizing: border-box;
        position:relative;
        .bubbleTitle{
            display:inline-block;
            width:100%;
            text-align: center;
            font-size:4.35vw;
        }
        .bubbleDetail{
            display:inline-block;
            width:100%;
            text-align: center;
            font-size:3.42vw;
            color:#9f9f9f;
        }
        .lookMore{
            position:absolute;
            top:5.46vw;
            color:#9f9f9f;
            right:3.9vw;
        }
     }
     .bubbleContent{
         display:flex;
         flex-flow: row nowrap;
         padding:2vw 4vw 0vw 4vw;
         box-sizing: border-box;
         justify-content: space-between;
         margin-bottom:2vw;
         .boxOne{
            .boxWrap{
                width:28vw;
                height:28vw;
                background:rgb(230, 230, 230);
                display:flex;
                align-items: center;
                justify-content: center;
                margin-bottom:1vw;
                .iamge{
                  width:21.11vw;
                  height:7.78vw;
                //   font-size:5vw;
                  text-align: center;
                  border-radius: 2vw;
                  display:inline-block;
                }
            }
         }
     }
   }
</style>
