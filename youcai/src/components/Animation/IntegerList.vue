<template>
  <div class="integerWrap">
    <span class="integerIcon iconWanwan iconWbonus-line"></span>
    <div class="integerList">
      <integer class="integerItem"
               v-for="(item,index) in code.toString()"
               :key='index'
               :value='parseInt(item)'></integer>
    </div>
  </div>
</template>
<script>
import integer from '@/components/Animation/Integer'
export default {
    components:{
        integer
    },
    props: {
        code: {
            type: Number,
            required: true
        }
    }
}
</script>
<style lang="less" scoped>
    .integerWrap{
        font-size: 0;
        width: 100%;
        height: 8vw;
        text-align: center;
        .integerIcon, .integerList{
          display: inline-block;
          vertical-align: top;
          height: 100%;
          line-height: 8vw;
          color: #fff;
          font-size: 7vw;
        }
        .integerIcon{
          margin-right: 5px;
        }
        .integerList{
          .integerItem{
            display: inline-block;
            margin-right: 5px;
          }
        }
      }
</style>
