<template>
  <header class="pageHeader">
    <div class="headerRight">
        <span class="headTit-blog">呼啸山庄</span>
    </div>
    <div class="headerLeft">
        <i @click='toggleAside' :class="['iconfont', {'iconzhankai': !asideShow}, {'iconshouqi': asideShow}]"></i>
        <span class="headTit-page">{{$route.meta.title}}</span>
    </div>
  </header>
</template>

<script>
export default {
    props: {
        asideShow: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        toggleAside () {
            this.$emit('toggleAside')
        }
    }
}
</script>

<style lang='less'>
    .pageHeader{
        display: inline-block;
        width: 100%;
        height: 100px;
        line-height: 100px;
        background-color: #535ba0;
        padding-right:38px;
        color: #fff;
        box-sizing: border-box;
        overflow: hidden;
        .headerRight{
            float: right;
            width: 200px;
            text-align: center;
            font-size: 36px;
        }
        .headerLeft{
            text-align: left;
            font-size: 22px;
            .iconfont{
                display: inline-block;
                width: 100px;
                text-align: center;
                font-size: 23px;
                cursor: pointer;
            }
            .headTit-page{
                color: rgba(255, 255, 255, 0.8);
            }
        }
    }
</style>
