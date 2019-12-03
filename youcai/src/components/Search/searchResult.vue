<template>
  <div class="searchResult">
    <scroll ref="scroll"
            :data="items"
            :scrollbar="scrollbarObj"
            :pullDownRefresh="pullDownRefreshObj"
            :pullUpLoad="pullUpLoadObj"
            :startY="0"
            @pullingDown="onPullingDown()"
            @pullingUp="onPullingUp()">
      <div @click.prevent="showConfirm(item)"
           v-for="(item,index) in items"
           :key='index'>
        <component :is="componentName"
                   :item='item'
                   :index='index'></component>
      </div>

    </scroll>
    <loading v-if='busy'></loading>
    <not-found v-if="noData"></not-found>
  </div>
</template>
<script>
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'

import loading from '@/components/requestState/isLoading'
import notFound from '@/components/requestState/noData'

import waterfallItem from '@/components/Waterfall/WaterfallItem' // 2 || 3
import activityItem from '@/components/activityItem' // 4
import voiceItem from '@/components/music/musicItem'
import userItem from '@/components/User/userItem' // 8
import groupItem from '@/components/List/groupItem' // 9
import topicItem from '@/views/Discover/components/topicItem'

export default {
    mixins: [scrollMixin],
    components:{
        scroll,
        waterfallItem,
        activityItem,
        voiceItem,
        userItem,
        groupItem,
        topicItem,

        loading,
        notFound
    },
    props:{
        search:{
            type: Boolean,
            default:false
        },
        searchType:{
            type: Number,
            required: true
        },
        searchContent:{
            type: String,
            default:''
        },
        city:{
            type: String,
            default:''
        }
    },
    data (){
        return{
            pageIndex: 1,
            pageSize: 10,
            items: [],
            componentName: '',
            waterfall: false,
            searchUrl: '',
            itemKey: '',
            busy: false,
            isBroadcast: false,
            noData: false
        }
    },
    watch: {
        searchType (newV){
            this.items = []
            if (this.newV !== 2 && this.newV !== 3) {
                this.waterfall = false
            } else {
                this.waterfall = true
            }
            switch (newV) {
                case 2: // 图文 || 视频
                case 3:
                    this.componentName = 'waterfallItem'
                    this.searchUrl = 'Post?SearchWord='
                    this.itemKey = 'postId'
                    break
                case 4: // 活动
                    this.componentName = 'activityItem'
                    this.searchUrl = 'Activity?SearchWord='
                    break
                case 5: // 声音
                    this.componentName = 'voiceItem'
                    this.searchUrl = 'Voice?SearchWord='
                    break
                case 8: // 用户
                    this.componentName = 'userItem'
                    this.searchUrl = 'UserRecommend/id?SearchWord='
                    break
                case 9:
                    this.componentName = 'groupItem'
                    this.searchUrl = 'UserGroup?SearchWord='
                    break
                case 10: // 话题
                    this.componentName = 'topicItem'
                    this.searchUrl = 'Topic?Word='
                    this.itemKey = 'topicId'
                    break
                default:
                    this.waterfall = false
                    this.componentName = ''
            }
        },
        search(newV){
            if (newV && !this.busy){
                this.pageIndex = 1
                this.items = []
                this.getSearch()
            }
        }
    },
    methods:{
        onPullingUp () {
            // 更新数据
            this.pageIndex++
            this.getSearch()
        },
        getSearch (){
            if (this.busy) {
                return
            }
            let me = this
            me.busy = true
            let url = `${this.searchUrl}${this.searchContent}&&pageIndex=${me.pageIndex}&pageSize=${me.pageSize}`
            me.api.get({
                url: url,
                success: function (res) {
                    if (me.searchType === 2 || me.searchType === 3) { // 帖子(图文 || 视频)
                        res = res.filter((item) => {
                            return !item.activityId && parseInt(item.postType + 1) === me.searchType
                        })
                    } else if (me.searchType === 4) { // 活动
                        res = res.filter((item) => {
                            return !item.activityType
                        })
                    }
                    console.log(url, res, me.searchType, me.searchType === 2)
                    me.items = me.items.concat(res)
                },
                error: function(err){

                },
                complete: function(){
                    me.busy = false
                    me.noData = !me.items.length
                    me.$emit('searchDone')
                }
            })
        },
        showConfirm (item){
            console.log('点击了', item)
            this.$confirm({
                title: '确认要广播该帖子',
                yesBtnText: '确认',
                type: 'confirm'
            }).then(() => {
                this.boradcast(item)
            }).catch(() => {
                // console.log('cancel')
            })
        },
        boradcast(item){
            let me = this
            if (this.isBroadcast) {
                return
            }
            me.isBroadcast = true
            // let data = {
            //     ObjectType: me.searchType,
            //     ObjectId: item[`${me.itemKey}`]
            // }
            // if (me.city) {
            //     data.city = me.city
            // }
            let url = 'ws/push-msg'
            url = `${url}?ObjectType=${me.searchType}&ObjectId=${item[`${me.itemKey}`]}`
            if (me.city){
                url = `${url}&city=${me.city}`
            }
            me.api.get({
                type: 'ws',
                url: url,
                success: function(res) {
                    console.log(res, 'success')
                },
                error() {
                },
                complete: function(){
                    me.isBroadcast = false
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
.searchResult{
    position: relative;
    height: calc(100vh - 53.4vw);
    overflow: hidden;
}
</style>
