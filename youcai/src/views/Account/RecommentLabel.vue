<template>
  <div class="recommentLabel">
    <div class='skip'
         @click.stop='skip'>跳过</div>
    <p>选择感兴趣的内容</p>
    <span class="recommentTitle">打造专属你的个性化界面</span>
    <ul class="imgList">
      <li v-for="(item,index) in allCategory"
          :key="index">
        <div class="oneImg">
          <img :src="item.picture"
               alt="">
        </div>
        <div class="oneTitle">{{item.title}}</div>
        <div class="selectLabel">
          <span v-show="!isSelected(item)"
                @click="selectLabel(item)">
            <i></i>
          </span>
          <span v-show="isSelected(item)"
                @click="selectLabel(item)">
            <i class="iconWanwan iconWzhengquecopy activityNotice"></i>
          </span>
        </div>
      </li>
    </ul>
    <div class="next">
      <span :class="{rightColor:selectedLabel.length >= 4}"
            @click="success">{{labelTitle}}</span>
    </div>
    <GenerateIndex :selectedLabel="selectedLabel"
                   v-if="hasMask && isShowIndex"></GenerateIndex>
  </div>
</template>

<script>
import GenerateIndex from './components/GenerateIndex'
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      isShowIndex: false,
      maxLength: 6, // 表示选择标签的数量
      allCategory: [], // 标签分类列表
      isRight: false,
      selectedLabel: [] // 用户已经选择的标签
    }
  },
  components: {
    GenerateIndex
  },
  mounted () {
    this.getCategoryList()
  },
  computed: {
    ...mapState(['hasMask']),
    labelTitle () {
      if (this.selectedLabel.length < 4) {
        return `至少关注4个兴趣(${this.selectedLabel.length}/4)`
      } else {
        return '下一步'
      }
    }
  },
  methods: {
    ...mapMutations({
      'setMask': 'setMask'
    }),
    skip () {
      window.goIndexAndRefresh()
    },
    /**
     * getCategoryList 获得推荐的标签分类
     */
    getCategoryList () {
      let me = this
      me.api.get({
        url: 'PostCategory',
        success: function (res) {
          me.allCategory = res.categorys.splice(1)
          console.log('我的分类',me.allCategory)
        }
      })
    },
    /**
     * selectLabel选择标签
     */
    selectLabel (item) {
      // 单选的情况
      if (parseInt(this.maxLength) === 1) {
        this.$set(this.selectedLabel, 0, item)
        return
      }
      let index = this.selectedLabel.indexOf(item)
      if (index !== -1) {
        this.selectedLabel.splice(index, 1)
      } else {
        if (this.selectedLabel.length >= this.maxLength) {
          this.$toast(`最多选择${this.maxLength}个标签`, 500)
          return
        }
        this.selectedLabel.push(item)
      }
    },
    /**
     * isSelected是否选中
     */
    isSelected (item) {
      return this.selectedLabel.includes(item)
    },
    /**
     * success提交用户所选择的标签
     */
    success () {
      if (this.selectedLabel.length >=4) {
          let me = this
          let arr = []
          me.selectedLabel.forEach((item) => {
            arr.push(item.id)
          })
          me.api.process({
            url: 'Recommend',
            data: {
              'postCategoryIds': arr,
            },
            success: function () {
              me.isShowIndex = true
              me.setMask(true)
            }
          })
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .recommentLabel{
      width:100%;
      height:100%;
      position:fixed;
      top:0;
      left:0;
      z-index:1000;
      background-color:white;
      font-size:0;
      .skip {
        position: fixed;
        right: 5vw;
        top: 5vw;
        font-size: 3.5vw;
        padding: 0 2.5vw;
        height: 6vw;
        line-height: 6vw;
        border-radius: 6vw;
        color: #fff;
        background: #efefef;
      }
      p{
        margin-top:17.13vw;
        font-size:7.4vw;
        color:#2e2e2e;
        text-align: center;
      }
      .recommentTitle{
          display:inline-block;
          width:100%;
          color:#919191;
          font-size:4vw;
          text-align: center;
          margin-top:4.62vw;
      }
      .imgList{
          height:100vw;
          overflow-y: scroll;
          width:79.63vw;
          margin:auto;
          margin-top:8vw;
          display:flex;
          justify-content: space-between;
          flex-flow: row wrap;
          li{
              width:25vw;
              margin-bottom:4.53vw;
              position:relative;
              .oneImg{
                  width:25vw;
                  height:25.28vw;
                  overflow: hidden;
                  border-radius: 1vw;
                  position:relative;
                  img{
                    width:100%;
                    height:100%;
                    position: absolute;
                    top:0;
                    right:0;
                    bottom:0;
                    left:0;
                    margin:auto;
                  }
              }
              .oneTitle{
                  width:100%;
                  text-align: center;
                  margin-top:3.15vw;
                  font-size:4.17vw;
                  color:#313131;
              }
              .selectLabel{
                 position:absolute;
                 top:2vw;
                 right:1vw;
                 span{
                     width:5.83vw;
                     height:5.83vw;
                     border-radius: 50%;
                     display:inline-block;
                 } 
                 span:nth-child(1) {
                   i{
                       width:5.1vw;
                       height:5.1vw;
                       display:inline-block;
                       border:0.5vw solid white;
                       border-radius: 50%;
                       background:rgba(0,0,0,.2);
                   }
                 }
                span:nth-child(2) {
                     background-color:rgb(254, 41, 66);
                     .activityNotice{
                         display:inline-block;
                         color:white;
                         font-size:3vw;
                         border-radius: 50%;
                         width:100%;
                         height:100%;
                         line-height: 6.5vw;
                         text-align: center;
                     }
                 }
              }
          }
      }
      .next{
         width:100%;
         height:17.78vw;
         box-shadow: 0px 0px  20px 5px rgb(241, 243, 244);
         position:fixed;
         bottom: 0;
         display:flex;
         justify-content: center;
         align-items: center;
         background:white;
         z-index: 2;
         span{
             display:inline-block;
             width:79vw;
             height:12.31vw;
             text-align: center;
             line-height:12.31vw;
             background:rgb(230, 230, 230);
             border-radius: 3vw;
             color:white;
             font-size:4.8vw;
         }
         .rightColor{
           background:rgb(254, 41, 66);
         }
      }
  }
</style>