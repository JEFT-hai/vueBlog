<template>
  <div class="good-btn--wrap">
      <span :class="['decrease-btn', 'opreate-btn', {'canOperate': canSub}]" @click='addGood(-1)'>-</span>
      <input class="countNum" type="number" v-model='countNum' disabled>
      <span :class="['increase-btn', 'opreate-btn', {'canOperate': canAdd}]" @click='addGood(1)'>+</span>
  </div>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            countNum: 0
        }
    },
    computed: {
        canAdd () {
            return this.countNum <= 9999
        },
        canSub () {
            return this.countNum > 0
        }
    },
    methods: {
        addGood (num) {
            if (num < 0 && !this.canSub) {
                return
            }
            if (num > 0 && !this.canAdd) {
                return
            }
            this.countNum += num
        }
    }
}
</script>

<style lang='less'>
.cleanInput{
    outline: none;
    border: none;
    background-color: transparent;
}
.good-btn--wrap{
    width: 25.9vw;
    height: 8.8vw;
    line-height: 8.8vw;
    border-radius: 4.4vw;
    font-size: 0;
    background-color: #f4f4f4;
    overflow: hidden;
    .countNum{
        .cleanInput();
        display: inline-block;
        vertical-align: top;
        width: 9.2vw;
        text-align: center;
        height: 100%;
        color: #222;
        font-size: 3.15vw;
    }
    .opreate-btn{
        display: inline-block;
        vertical-align: top;
        width: 8.33vw;
        text-align: center;
        font-size: 3.15vw;
        color: #dedede;
        &.canOperate{
            color: #fd5355;
        }
    }
}
</style>
