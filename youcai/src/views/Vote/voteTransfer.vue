<template>
  <div class="voteTransfer">
    <loadingIndex></loadingIndex>
  </div>
</template>
<script>
const loadingIndex = () => import('@/components/loadingIndexBg')
export default {
    components: {
        loadingIndex
    },
    data () {
        return {
            voteId: this.$route.params.id
        }
    },
    created () {
        this.getVoteDetail()
    },
    methods: {
        getVoteDetail () {
            let me = this
            me.api.get({
                url: `VoteDetails?VotePostId=${me.voteId}`,
                success: function (res) {
                    if (res.activityId) { // 视频投票
                      me.$router.replace({
                          name: 'voteHVideoDetail',
                          params: {
                              postId: me.voteId
                          }
                      })
                    } else { // 图文投票
                      me.$router.replace({
                        name: 'discoverItemOnly',
                        params: {
                            postId: me.voteId
                        }
                      })
                    }
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>

</style>
