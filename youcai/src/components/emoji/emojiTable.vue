<template>
  <ul class='emojiTable'>
    <li class="emojiItem"
        v-for="(item, index) in items"
        :key="index"
        @click="choose(item)">
      {{item}}
    </li>
    <li class="emojiItem iconWdeleteicon iconWanwan"
        key='delete'
        @click="del">
    </li>
  </ul>
</template>
<script>
export default {
    props:{
        items:{
            type: Object,
            default: null
        }
    },
    methods: {
        choose (item){
            this.$emit('choose', item)
        },
        del (){
            this.$emit('del')
        }
    }
}
</script>
<style lang="less" scoped>
.emojiTable{
    box-sizing: border-box;
    width: 100vw;
    padding: 3vw;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    .emojiItem{
        font-size: 6vw;
        width: 13vw;
        height: 13vw;
        line-height: 13vw;
        text-align: center;
    }
}
</style>
