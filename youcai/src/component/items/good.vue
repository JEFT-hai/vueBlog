<template>
    <div class="good-item-wrap">
        <div class="good-item-name">{{item.name}}</div>
        <div class="good-item-info">
            <img class="good-item-cover" :src="item.cover" alt="">
            <div class="good-item-desc--wrap clearfix">
                <p class="good-item-desc">{{item.desc}}</p>
                <p class="good-item-types">
                    <span class="good-item-type" v-for='(itm, index) in item.types' :key='index'>{{itm}}</span>
                </p>
                <p class="good-item-priceLine">
                    <span class="good-item-price" v-if="item.discountType === 'start'">
                        到手价￥<i class="good-item-priceNum">{{item.price}}</i>起
                    </span>
                    <span class="good-item-price" v-else-if="item.discountType === 'discount'">
                        ￥<i class="good-item-priceNum">{{item.price}}</i>
                    </span>
                    <span class="good-item-oldPrice" v-if="item.discountType">￥{{item.oldPrice}}</span>
                </p>
                <good-btn class="good-item-btn" :item='item'></good-btn>
            </div>
        </div>
    </div>
</template>

<script>
const goodBtn = resolve => require(['@/component/items/goodBtn'], resolve)
export default {
    components: {
        goodBtn
    },
    props: {
        item: {
            type: Object,
            required: true
        }
    }
}
</script>

<style lang='less'>
.wrap () {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
.good-item-wrap{
    width: 100%;
    padding: 1vw 3.15vw 3vw;
    overflow: hidden;
    .good-item-name{
        width: 100%;
        height: 6.5vw;
        line-height: 6.5vw;
        font-size: 4vw;
        color: #333;
        .wrap();
    }
    .good-item-info{
        width: 100%;
        display: flex;
        align-items: center;
        .good-item-cover{
            width: 26.76vw;
            height: 26.76vw;
            border-radius: 0.8vw;
            margin-right: 2.6vw;
        }
        .good-item-desc--wrap{
            flex: 1;
            overflow: hidden;
            color: #9a9a9a;
            font-size: 3.5vw;
            padding-top: 0.05vw;
            .good-item-desc{
                height: 6.13vw;
                line-height: 6.13vw;
                .wrap()
            }
            .good-item-types {
                font-size: 0;
                width: 100%;
                height: 6.13vw;
                line-height: 6.13vw;
                .wrap();
                .good-item-type{
                    position: relative;
                    font-size: 3.15vw;
                    display: inline-block;
                    margin-right: 3vw;
                    &:last-child{
                        margin-right: 0;
                        &::after{
                            display: none;
                        }
                    }
                    &::after{
                        position: absolute;
                        content: '';
                        right: -1.5vw;
                        top: 50%;
                        width: 1px;
                        height: 3.5vw;
                        transform: translate3d(50%, -50%, 0);
                        background-color: currentColor;
                    }
                }
            }
            .good-item-priceLine{
                height: 6.95vw;
                line-height: 6.95vw;
                margin-bottom: 1.05vw;
                .good-item-price{
                    color: var(--wRed);
                    font-size: 3.5vw;
                    .good-item-priceNum{
                        font-size: 4vw;
                        font-style: normal;
                        margin-right: 2px;
                    }
                }
                .good-item-oldPrice{
                    text-decoration: line-through;
                    margin-left: 2.5vw;
                    font-size: 3vw;
                }
            }
        }
    }
    .good-item-btn{
        float: right;
    }
}
</style>
