<template>
  <div class='fixed-head search-wrap'>
      <div class='search-inner'>
        <div class='app-logo'></div>
        <div class='search-input-wrap' @click='goSearch'>
          <input class='search-input' disabled type='text' placeholder='搜点什么吧...'/>
        </div>
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
    height: 21vw;
    background-color: #fff;
    .search-inner{
        position: fixed;
        z-index: 100000;
        top: 0;
        left: 0;
        width: 100vw;
        height: 21vw;
        display: flex;
        align-items: center;
        background-color: #fff;
        padding: 0 4vw;
        .app-logo{
            width: 17vw;
            height: 8.4vw;
            text-align: center;
            line-height: 8.4vw;
            background: url('../../assets/y/common/logo.png') center center no-repeat;
            background-size: contain;
        }
        .search-input-wrap{
            flex: 1;
            .search-input{
                width: 66.3vw;
                height: 8.4vw;
                line-height: 8.4vw;
                font-size: 4vw;
                background-color: #f2f2f2;
                border-radius: 4.2vw;
                padding: 0 4vw;
                outline: none;
                border: none;
                box-sizing: border-box;
            }
        }
    }
}
</style>
