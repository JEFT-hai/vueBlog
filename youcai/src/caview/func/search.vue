<template>
  <div class="search-page">
    <div class="search-head--wrap">
        <div class="search-head">
            <div class="search-icon--back iconfont iconfanhui1" @click='go.back()'></div>
            <div class="search-head--inner search-input--wrap">
                <div class="search-icon iconfont iconsearch"></div>
                <input v-model="searchText" type="search" class="search-input" placeholder="点击搜索你需要的家具内容">
            </div>
            <div class="search-btn--text"
                 @click='getSearchItem()'
            >搜索</div>
        </div>
    </div>
    <scroll
      ref='scroll'
      class="search-content"
      :bounce='{top: false, bottom: true}'
    >
        <div class="search-content--item search-main--everybody">
            <div class="search-item--tit">大家都在搜</div>
            <div class="search-content--everybody">
                <span class="search-item--everybody" v-for='item in searchEverybody' :key='item.text' @click='getSearchItem(item)'>{{item.text}}</span>
            </div>
        </div>
        <div class="search-content--item search-main--history">
            <div class="search-item--tit">
                <div class="search-item--tit--left">搜索历史</div>
                <div class="search-item--tit--right">
                    <span class="search-icon--delete"></span>
                    <span class="search-text--delete" @click='deleteSearch'>清除历史</span>
                </div>
            </div>
            <div class="search-content--history">
                <div class="search-line--history" v-for='item in searchHistory' :key='item.text'>
                    <span class="search-line--history--text" @click='getSearchItem(item)'>{{item.text}}</span>
                    <span class='search-icon--history--delete iconfont iconClose'
                        @click='deleteSearchItem(item)'
                    ></span>
                </div>
            </div>
        </div>
    </scroll>
  </div>
</template>

<script>
/** 搜索页面
 *  1. 标签页： 大家都在搜 与 搜索历史标签
 *  2. 搜素历史的text是唯一的，type不显示，相同text会用新的替换旧的
 * 
*/
const scroll = resolve => require(['@/component/scroll/scroll'], resolve)
export default {
    components: {
        scroll
    },
    data () {
        return {
            searchEverybody: [{
                text: '床',
                type: 'index'
            },{
                text: '北欧风格',
                type: 'index'
            },{
                text: '台灯',
                type: 'index'
            },{
                text: '地毯',
                type: 'index'
            },{
                text: '改造',
                type: 'index'
            },{
                text: '卫生间',
                type: 'index'
            }],
            searchHistory: [],
            searchText: ''
        }
    },
    created () {
        this.getSearchHistory()
    },
    watch: {
        searchHistory (newV) { // 本地存储随着searchHistory改变而改变
            localStorage.setItem('searchHistory', JSON.stringify(newV))
        }
    },
    methods: {
        getSearchHistory () {
            let searchHistory = localStorage.getItem('searchHistory')
            this.searchHistory = searchHistory ? JSON.parse(searchHistory) : []
        },
        /** 
         * 搜索历史
        */
        getSearchItem (item) {
            item && (this.searchText = item.text)
            item = item ? item : {
                    text: this.searchText,
                    type: this.$route.params.type
                }
            this.deleteSearchItem(item)
            this.searchHistory.unshift(item)
        },
        /**  
         * 清空历史
        */
        deleteSearchItem (item) { // 清楚单条历史
            let idx = -1
            this.searchHistory.map((itm, index) => {
                (item.text === itm.text) && (idx = index)
            })
            idx !== -1 && this.searchHistory.splice(idx, 1)
        },
        deleteSearch () { // 清空所有历史
            this.searchHistory = []
            localStorage.setItem('searchHistory', '')
        }
    }
}
</script>

<style lang='less'>
.search-page{
    .search-head--wrap{
        height: 12vw;
        background-color: #fff;
        .search-head{
            position: fixed;
            z-index: 1000;
            top: 0;
            left: 0;
            width: 100vw;
            height: 12vw;
            display: flex;
            align-items: center;
            text-align: center;
            background-color: #fff;
            .search-icon--back,
            .search-btn--text{
                padding: 0 4vw;
                height: 12vw;
                line-height: 12vw;
            }
            .search-head--inner{
                flex: 1;
                font-size: 4.5vw;
                position: relative;
                .search-icon{
                    width: 8vw;
                    height: 8vw;
                    line-height: 8vw;
                    position: absolute;
                    left: 0;
                    top: 0;
                    color: #666;
                    font-size: 3.4vw;
                }
                .search-input{
                    flex: 1;
                    padding-left: 8vw;
                    outline: none;
                    border: none;
                    background-color: #f1f1f1;
                    height: 7vw;
                    line-height: 7vw;
                    width: 100%;
                    border-radius: 4px;
                    &::placeholder{
                        font-size: 3.4vw;
                        letter-spacing: 1px;
                    }
                }
            }
        }
    }
    .search-content{
        height: calc(100vh - 12vw);
        width: 100vw;
        padding: 0 4vw;
        overflow: hidden;
        .search-content--item{
            .search-item--tit{
                height: 10vw;
                line-height: 10vw;
                display: flex;
                font-size: 4.6vw;
                font-weight: 600;
                .search-item--tit--left{
                    flex: 1;
                }
                .search-item--tit--right{
                    width: 30vw;
                    text-align: right;
                    font-size: 3.4vw;
                    font-weight: 300;
                    color: #000;
                }
            }
            .search-content--everybody{
                margin: 2vw 0;
                .search-item--everybody{
                    display: inline-block;
                    height: 6.6vw;
                    line-height: 6.6vw;
                    padding: 0 3.3vw;
                    margin-right: 4vw;
                    margin-bottom: 2vw;
                    border-radius: 3.3vw;
                    background-color: #f0f0f0;
                    font-size: 3.4vw;
                    color: #000;
                    font-weight: 100;
                }
            }
            .search-line--history{
                height: 10vw;
                line-height: 10vw;
                width: 100%;
                display: flex;
                font-size: 3.8vw;
                .search-line--history--text{
                    flex: 1;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }
                .search-line--history--delete{
                    width: 10vw;
                    text-align: right;
                    font-size: 3.8vw;
                }
            }
        }
    }
    
}
</style>