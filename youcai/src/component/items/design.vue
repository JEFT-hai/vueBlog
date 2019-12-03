<template>
  <div :class="['design-item', `size${size}`]">
    <userLine class="design-user--line" :item='item' v-if='item.nickName'></userLine>
    <img class='design-item--cover' :src='item.cover' />
    <div class='design-item--tit'>{{item.tit}}</div>
  </div>
</template>

<script>
const userLine = resolve => require(['@/component/user/userLine'], resolve)
export default {
    components: {
        userLine
    },
    props: {
        size: {
            type: Number,
            default: 1
        },
        item: {
            type: Object,
            required: true
        },
        canCilck: {
            type: Boolean,
            default: true
        }
    }
}
</script>

<style lang='less'>
.design-item{
    overflow: hidden;
    .design-item--cover{
        width: 100%;
        height: 48vw;
        border-radius: 4px;
    }
    .design-item--tit{
        height: 13vw;
        line-height: 13vw;
        font-size: 4.2vw;
        margin-bottom: 4.5vw;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    &.size1{
        .design-item--cover{
            height: 43vw;
        }
        .design-item--tit{
            padding-top: 2px;
            height: 11vw;
        }
        .design-user--line{
            margin: 4.3vw 0 2.9vw;
        }
    }
}
</style>
