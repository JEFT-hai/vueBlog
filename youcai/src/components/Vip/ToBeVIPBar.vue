<template>
    <div class="toBeVIPBarWrap">
        <transition name="verticalSlide">
            <div class="toBeVIPBar" v-show='show'>
                <div class="beVIPInfo">
                    <div class="tit">开通VIP享受特权</div>
                    <div class="info">{{info}}</div>
                </div>
                <div class="beVIPBtnWrap" @click='beVIP'>
                    <span class="beVIPBtn">开通VIP</span>
                </div>
            </div>
        </transition>
        <div v-if="bg" v-show='show' class="toBeVIPBarBg"></div>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
    props: {
        info: {
            type: String,
            required: true
        },
        show: {
            type: Boolean,
            default: true
        },
        bg: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            busy: false
        }
    },
    methods: {
        ...mapActions({
            toBeVIP: 'toBeVIP'
        }),
        beVIP () {
            this.$router.push({
                name: 'beVIP'
            })
            // let me = this
            // if (me.busy) {
            //     return
            // }
            // this.toBeVIP({_this: me})
            //     .then(() => {
            //         me.busy = false
            //     })
            //     .catch((err) => {
            //         me.busy = false
            //         me.$toast(err)
            //     })
        }
    }
}
</script>

<style lang='less' scoped>
    .toBeVIPBarWrap{
        .toBeVIPBarBg{
            height: 20vw;
            background-color: transparent;
        }
    }
    .toBeVIPBar{
        &.verticalSlide-enter-active{
            // .toBeVIPBar{
                transform: translate3d(0, 0, 0);
            // }
        }
        &.verticalSlide-leave-to{
            // .toBeVIPBar{
                transform: translate3d(0, 100%, 0);
            // }
        }
        &.verticalSlide-enter-active,&.verticalSlide-leave-active{
            // .toBeVIPBar{
                transition: all 1s ease;
            // }
        }
        position: fixed;
        z-index: 100;
        height: 20vw;
        width: 100vw;
        left: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        background-color: rgba(255, 255, 255, 0.8);
        box-shadow: 0 0 1px #999;
        .beVIPInfo{
            flex: 1;
            padding: 2.6vw 0 0 5.8vw;
            .tit{
                height: 7.2vw;
                line-height: 7.2vw;
                font-size: 4.6vw;
                color: #000;
                letter-spacing: 1px;
            }
            .info {
                height: 4.6vw;
                line-height: 4.6vw;
                font-size: 3.5vw;
                color: #888;
                letter-spacing: 1px;
            }
        }
        .beVIPBtnWrap{
            width: 30vw;
            height: 100%;
            display: flex;
            align-items: center;
            .beVIPBtn{
                display: inline-block;
                width: 22vw;
                height: 6.7vw;
                line-height: 6vw;
                margin: 0 4vw;
                font-size: 4vw;
                text-align: center;
                border-radius: 3.4vw;
                background-color: var(--mRed);
                color: #fff;
                letter-spacing: 1px;
            }
        }
    }
</style>