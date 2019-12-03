<template>
  <div class="taskItem">
    <t-item :item='item'
            @openTreasure='openTreasure'></t-item>
    <!-- <t-p-item ref="TPItem"
              @addCode='addCode'
              :key='item.pointType'
              :item='item'></t-p-item> -->
  </div>
</template>
<script>
import tItem from '@/components/Task/TaskInfoItem'
// import tPItem from '@/components/Task/TaskProgress'
export default {
    components:{
      tItem,
      // tPItem
    },
    props: {
      item: {
        type: Object,
        default: null
      }
    },
    watch:{
      item:{
        immediate: true,
        deep: true,
        handler: function(newV){
          return newV
        }
      }
    },
    methods: {
      addCode (code) {
        this.$emit('addCode', code)
      },
      openTreasure () {
        console.log('dsfsdfs')
        this.$refs.TPItem.openTreasure()
      }
    }
}
</script>
<style lang="less" scoped>
  .taskItem{
    padding-top: 10px;
    border-bottom: 1px solid #efefef;
  }
</style>
