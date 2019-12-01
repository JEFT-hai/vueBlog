<template>
    <div class='asideWrap'>
        <div class="aside-search">
            <el-input class="aside-input--search" placeholder="搜索..." v-model="searchTxt"><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
            <i @click='toggleAside' :class="['iconfont', 'toggleIcon', {'iconzhankai': !asideShow}, {'iconshouqi': asideShow}]"></i>
        </div>
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
</template>
<script>
const menuItem = resolve => require(['@/components/Menu/MenuItem'], resolve)
export default {
    props: {
        asideShow: {
            type: Boolean,
            default: true
        }
    },
    components: {
        menuItem
    },
    data () {
        return {
            asideMenu:[
                {title: '写博客1', link: {name: 'blogCreate'}, icon: 'el-icon-edit', submenu:[{title: '写博客1-1', link: {name: 'blogCreate'}}]},
                {title: '写博客', link: {name: 'blogCreate'}, icon: 'el-icon-edit', submenu:[{title: '写博客1-1', link: {name: 'blogCreate'}}]},
                {title: '写博客2', link: {name: 'blogCreate'}}
            ],
            searchTxt: ''
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
        },
        toggleAside () {
            this.$emit('toggleAside')
        }
    }
}
</script>
<style lang="less">
    .asideWrap{
        @media only screen and (max-width: 380px) {
            width: 80%;
        }
        position: fixed;
        z-index: 100000;
        top: 0;
        left: 0;
        bottom: 0;
        width: 380px;
        background-color: #24252d;
        text-align: left;
        overflow-x: hidden;
        overflow-y: auto;
        .aside-search{
            // position: relative;
            height: 100px;
            line-height: 100px;
            padding: 0 40px;
            background-color: #444;
            .aside-input--search{
                font-size: 24px;
                color: #fff;
                .el-input__inner{
                    padding-left: 40px;
                    color: #fff;
                    border: none;
                    background-color: transparent;
                }
            }
            .toggleIcon{
                position: absolute;
                right: 0;
                top: 0;
                height: 100px;
                width: 60px;
                color: #fff;
                text-align: center;
                font-size: 23px;
            }
        }
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
