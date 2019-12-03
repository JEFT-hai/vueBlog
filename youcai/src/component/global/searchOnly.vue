<template>
    <div class='fixed-head search-wrap'>
        <div class='search-inner' @click='goSearch'>
            <i class="search-icon iconfont iconsearch"></i>
            <input class='search-input' disabled type='text' placeholder='搜点什么吧...'/>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        goSearch () {
            this.$router.push({
                name: 'search',
                params:{
                type: 'index'
                }
            })
        }
    }
}
</script>

<style lang='less'>
.search-wrap{
    width: 100vw;
    height: 12.6vw;
    background-color: #fff;
    .search-inner{
        position: fixed;
        z-index: 100000;
        top: 0;
        left: 0;
        width: 100vw;
        height: 12.6vw;
        display: flex;
        align-items: center;
        background-color: #fff;
        padding: 0 4vw;
        .search-icon{
            position: absolute;
            left: 6vw;
            top: 0;
            width: 9.4vw;
            height: 100%;
            text-align: center;
            color: #ccc;
            font-size: 5.1vw;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .search-input{
            width: 100%;
            height: 8.8vw;
            line-height: 8.8vw;
            font-size: 4vw;
            background-color: #f5f5f5;
            border-radius: 4.2vw;
            padding: 0 4vw;
            outline: none;
            border: none;
            box-sizing: border-box;
            padding-left: 11.4vw;
            &::placeholder{
                font-size: 3.2vw;
            }
        }
    }
}
</style>
