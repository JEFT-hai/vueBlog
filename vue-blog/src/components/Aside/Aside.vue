<template>
  <transition>
    <div class='asideWrap'>
        <el-menu background-color='#24252d'
                text-color='#fff'
                active-text-color='#535ba0'
                mode='vertical'
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                :unique-opened='true'>
            <menu-item v-for='(item, index) in asideMenu' :item='item' :index='index + 1 + ""' :key='index'>
            </menu-item>
        </el-menu>
    </div>
  </transition>
</template>
<script>
const menuItem = resolve => require(['@/components/Menu/MenuItem'], resolve)
export default {
    components: {
        menuItem
    },
    data () {
        return {
            asideMenu:[
                {title: '写博客1', link: {name: 'blogCreate'}, icon: 'el-icon-edit', submenu:[{title: '写博客1-1', link: {name: 'blogCreate'}}]},
                {title: '写博客', link: {name: 'blogCreate'}, icon: 'el-icon-edit', submenu:[{title: '写博客1-1', link: {name: 'blogCreate'}}]},
                {title: '写博客2', link: {name: 'blogCreate'}}
            ]
        }
    },
    methods: {
        handleOpen(key, keyPath) {
            // eslint-disable-next-line
            console.log(key, keyPath)
        },
        handleClose(key, keyPath) {
            // eslint-disable-next-line
            console.log(key, keyPath)
        }
    }
}
</script>
<style lang="less">
    .asideWrap{
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        width: 380px;
        background-color: #24252d;
        text-align: left;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .el-menu-vertical-demo{
        width: 380px;
        .el-icon-arrow-down{
            font-weight: bold;
            font-size: 15px;
            color: #fff;
        }
    }
</style>
