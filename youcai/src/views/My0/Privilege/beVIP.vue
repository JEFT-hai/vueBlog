<template>
    <div class="toBeVIPPage">
        <div class="headNav">
            <span @click="go.back()"
                class="navbarBack"><i class="iconWfanhui iconWanwan activityNotice"></i></span>
            <span class="title">
                <span class="titleInner">开通会员</span>
            </span>
        </div>
        <div class="beVIPBlock scoreWay">
            <div class="beVIPBlock--head">
                <span class="beVIPBlock--tit">积分兑换</span>
                <span class="beVIPBlock--headR">
                    <span class="beVIPBlock--headRTxt">当前积分：</span>
                    <span class="pointCode">{{point}}</span></span>
            </div>
            <div class="beVIPBlock--body">
                <p>1000积分兑换一个月会员</p>
            </div>
            <div class="beVIPBlock--btnWrap">
                <span class="beVIPBlock--btn" @click='beVIP'>兑换会员</span>
            </div>
        </div>
        <div class="beVIPBlock RMBWay">
            <div class="beVIPBlock--head">
                <span class="beVIPBlock--tit">购买VIP</span>
                <span class="beVIPBlock--headR">未上线</span>
            </div>
            <div class="beVIPBlock--body">
                <p class="beVIPBlock--bodyItem">10元每月</p>
            </div>
            <div class="sizeTypes">
                <div class="sizeType--tit">开通</div>
                <div class="sizeTypeList">
                    <span class="sizeTypeItem">1个月</span>
                    <span class="sizeTypeItem">3个月</span>
                    <span class="sizeTypeItem">1年</span>
                    <span class="sizeTypeItem">自定义</span>
                </div>
            </div>
            <div class="beVIPBlock--btnWrap">
                <span class="beVIPBlock--btn">支付宝支付</span>
                <span class="beVIPBlock--btn">微信支付</span>
            </div>
        </div>
    </div>
</template>

<script>
/** 开通会员页面
 *  1. 积分兑换
 *  2. RMB支付 支付宝/微信
 */
import { mapState, mapActions } from 'vuex'
export default {
    data () {
        return {
            point: 0,
            busy: false
        }
    },
    created () {
        this.getUserPoint()
    },
    computed: {
        ...mapState(['user'])
    },
    methods: {
        ...mapActions(['toBeVIP']),
        getUserPoint() {
            let me = this
            me.api.get({
                url: 'Task/points',
                success: function (res) {
                    me.point = res
                }
            })
        },
        beVIP () {
            if (this.point < 1000) {
                this.$toast('积分不足兑换值哦，快去做任务吧！')
                return
            }
            if (this.busy) {
                return
            }
            if (this.user.vipLevel){
                this.$toast('您已经是VIP会员了')
                return
            }
            let me = this
            me.toBeVIP({
                _this: me
            })
            .then(() => {
            })
            .catch((err) => {
                me.$alert(err)
            })
            .then(() => {
                me.busy = false
            })
        }
    }
}
</script>

<style lang='less'>
    .toBeVIPPage{
        height: 100%;
        background: url(../../../assets/images/vipBg.png) 0 0 repeat-y;
        background-size: cover;
        color: #fff;
        overflow: hidden;
        .headNav{
            height: 13.3vw;
            line-height: 13.3vw;
            color: #fff;
            display: flex;
            .navbarBack{
                width: 13.3vw;
                text-align: center;
            }
            .title{
                flex: 1;
                text-align: center;
                max-width: 86.7vw;
                margin-right: 13.3vw;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
        }
        .beVIPBlock{
            width: 90vw;
            border: 2px solid #e7d7ba;
            border-radius: 3vw;
            margin: 15vw auto 10vw;
            padding: 2vw 3vw;
            background-image: linear-gradient(to right,#e7d7ba 8% , var(--mRed) 70%);
            &.RMBWay{
                opacity: 0.4;
            }
            .beVIPBlock--head{
                height: 10vw;
                line-height: 10vw;
                display: flex;
                .beVIPBlock--tit{
                    font-size: 4.6vw;
                    font-weight: bold;
                    width: 20vw;
                }
                .beVIPBlock--headR{
                    flex: 1;
                    text-align: right;
                    .beVIPBlock--headRTxt{
                        font-size: 3.8vw;
                    }
                    .pointCode{
                        font-size: 5vw;
                        color: #e7e7e7;
                    }
                }
            }
            .beVIPBlock--body{
                margin: 1vw 0;
                .beVIPBlock--bodyItem{
                    height: 8vw;
                    line-height: 8vw;
                    font-size: 4vw;
                }
            }
            .sizeTypes{
                display: flex;
                margin-top: 2vw;
                .sizeType--tit{
                    display: inline-block;
                    width: 16vw;
                }
                .sizeTypeList{
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    // padding: 0 5vw;
                    .sizeTypeItem{
                        font-size: 3.6vw;
                        // flex: 1;
                        display: inline-block;
                        padding: 0 2vw;
                        height: 7vw;
                        line-height: 7vw;
                        border: 1px solid #ccc;
                        border-radius: 2px;
                        text-align: center;
                        // margin: 0 1vw;
                    }
                }
            }
            .beVIPBlock--btnWrap{
                margin: 5vw 0 3vw;
                display: flex;
                align-items: center;
                justify-content: center;
                .beVIPBlock--btn{
                    display: inline-block;
                    height: 9vw;
                    line-height: 9vw;
                    padding: 0 2.5vw;
                    margin: 0 3vw;
                    border-radius: 4px;
                    color: var(--mRed);
                    font-weight: 500;
                    background-color: #e7d7ba;
                }
                
            }
        }
    }
</style>
