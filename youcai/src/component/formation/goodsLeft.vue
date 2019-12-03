<template>
    <scroll class="goodLeft-scroll" ref='scroll'>
        <span 
            ref='goodCategory'
            :class="['goods-item--category', {'curTab': curTab === item}]" 
            v-for='(item,index) in categories' 
            :key='index'
            @click='setCurTab(item, index)'
        >{{item}}</span>
    </scroll>
</template>

<script>
/** 结构组件: 商城左侧结构
 *  1. 点击顶部与底部, 会做自适应滚动
*/
const scroll = resolve => require(['@/component/scroll/scroll'], resolve)

import scrollMixin from '@/component/scroll/scrollMixin'
export default {
    mixins: [scrollMixin],
    components: {
        scroll
    },
    props: {
        categories: {
            type: Array,
            default:  function () {
                return [
                    '有才推荐',
                    '开工准备',
                    '宠物',
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                    '6',
                    '7',
                    '8',
                    '9',
                    '10',
                    '11',
                    '12',
                    '13',
                    '14',
                    '15',
                    '16',
                    '17',
                    '18'
                ]
            }
        },
        curTab: {
            type: String,
            default: '开工准备'
        }
    },
    methods: {
        setCurTab (item, index) {
            this.$emit('setCategory', item)
            this.$refs.scroll.scroll.scrollerHeight - this.$refs.scroll.scroll.wrapperHeight > 30 && this.justifyY(index)
        },
        justifyY (index) {
            let wrapperHeight = this.$refs.scroll.scroll.wrapperHeight
            let itemTop = this.$refs.goodCategory[index].offsetTop
            let itemToTop = itemTop + this.$refs.scroll.scroll.absStartY
            let absY = -this.$refs.scroll.scroll.absStartY
            let maxY = -this.$refs.scroll.scroll.maxScrollY
            if (absY > 10 && itemToTop < wrapperHeight*0.2) {
                let toY = Math.min(-absY + 100, 0)
                this.scrollTo(0, toY)
            }
            if (absY < maxY && itemToTop > wrapperHeight*0.75) {
                let toY = Math.max(-absY - 100, -maxY)
                this.scrollTo(0, toY)
            }
        }
    }
}
</script>

<style lang='less'>
.goodLeft-scroll{
    height: 100%;
    overflow: hidden;
    .goods-item--category{
        position: relative;
        display: inline-block;
        width: 100%;
        height: 13.88vw;
        line-height: 13.88vw;
        text-align: center;
        box-shadow: 1px 0 0 #efefef;
        font-size: 3.5vw;
        color: #888888;
        &.curTab{
            color: #fff;
            // font-weight: 600;
            &::after{
                position: absolute;
                z-index: -1;
                content: '';
                width: 18vw;
                height: 7vw;
                border-radius: 3.5vw;
                top: 50%;
                left: 50%;
                transform: translate3d(-50%, -50%, 0);
                background-color: #be1113;
            }
        }
    }
}
</style>
