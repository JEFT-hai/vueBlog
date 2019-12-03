<script>
    export default {
        data () {
            return {
                lastTime: 0, // throttle 最后的时间
                playCount: 0, // 播放次数
                hasPost: false // 是否已经发过 播放时间函数
            }
        },
        computed: {
            playTime () {  // 播放的时间
                return parseInt(this.playCount * this.durationTime + this.curTime)
            },
        },
        watch: {
            curTime (newV) {
                let decimalNum = this.durationTime - parseInt(this.durationTime) // 有curTime 为 7.99, durationTime为8.2的情况 计算以下误差
                let curTime = newV
                if (decimalNum < 0.4) {
                    curTime = newV + decimalNum
                }
                if (parseInt(curTime) === parseInt(this.durationTime)) {
                    this.throttleAddPlayCount()
                }
            }
        },
        methods: {
            throttleAddPlayCount (){
                if(this.lastTime && Date.now() - this.lastTime < 800){
                    return
                }
                this.playCount++
                console.log(this.playCount, 'playCount')
                this.lastTime = Date.now()
            },
            PostVideoDetails () { // 切换视频的时候告知播放时间
                if (!this.playTime || this.hasPost) {
                    return
                }
                if (!this.authentication.isLogin()) {
                    return
                }
                let me = this
                me.api.process({
                    url: 'PostVideoDetails',
                    data: {
                    postId: me.postId,
                    watchTime: me.playTime
                    },
                    success: function () {
                    me.hasPost = true
                    }
                })
            }
        }
    }
</script>
