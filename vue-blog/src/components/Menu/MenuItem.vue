<template>
    <component :is='cmpName' :index='index' :data-index='index'>
        <span slot="title"><i v-if='item.icon' :class="[item.icon]"></i>{{item.title}}</span>
        <template v-if="item.submenu">
            <el-menu-item-group v-for="(itm, idx) in item.submenu" :key='index + "-" + idx' >
                <template slot="title">分组{{idx}}</template>
                <menu-item :item='itm' :index='idx + 1 + ""'></menu-item>
            </el-menu-item-group>
        </template>
    </component>
</template>

<script>
export default {
    name: 'menu-item',
    props: {
        item: {
            type: Object,
            required: true
        },
        index: {
            type: String,
            required: true
        }
    },
    computed: {
        cmpName () {
            if (this.item.submenu){
                return 'el-submenu'
            } else {
                return 'el-menu-item'
            }
        }
    }
}
</script>

<style>

</style>