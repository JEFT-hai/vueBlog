<template>
    <div class='searchPage'>
        <div class='search-header borderB'>
            <div class="serch_wrap">
                 <div class="goback">
                    <i @click="flag" class="iconWanwan iconWleftBack goto-right"></i>
                 </div>
                 <div class="search_inner">
                    <i class="icon iconfont icon-fangdajing searchFind"></i>
                    <form action="" onsubmit="return false;">
                     <input ref='searchPageInput' maxlength="16" type="search" :placeholder="placeholder" class="serch_box" v-model='searchContent' @keyup.enter="getSearch" @input="handleContent">
                    </form>
                    <span class="searchClear" v-show="searchContent.length" @click="clearContent">
                      <i class="iconWanwan iconWquxiao-copy-copy activityNotice"></i>
                    </span>
                </div>
                <div class="searchFound" @click="getSearch">
                  搜索
                </div>
            </div>
        </div>
        <div class="searchHistory">
          <div class="myHistory" v-show="!hasSearched && searchHistory.length > 0">
            <div class="historyTitle">
              <span>历史记录</span>
              <span class="deleteHistory" @click="handleHistory">
                <i class="iconWanwan iconWshanchu activityNotice"></i>
              </span>
            </div>
              <div class='searchHistory-tags'>
                <span @click="searchHistoryTag(search)" class='searchHistoryTagItem' name="btn1" size="small"  type="default" v-for="(search,index) in searchHistoryNow" :key="index">{{search.value}}</span>
              </div>
          </div>
        </div>
        <scrollPages v-if="hasSearched" ref='scrollPages' :tabList='tabList' :searchT='searchtype' :searchContent='searchContent' @blur='blur'></scrollPages>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import scrollPages from '@/components/Search/scrollPages'
export default {
  components: {
    scrollPages
  },
  props: {
    searchType: {
      type: String,
      default: '动态'
    },
    placeholder: {
      type: String,
      default: '搜一下吧'
    },
    tabList: {
      type: Array,
      default: function () {
        return ['动态', '用户', '声音', '话题']
      }
    }
  },
  computed: {
    ...mapState({'searchHistory':'searchHistory'}),
    searchHistoryNow () {
      let me = this
      let now = this.searchHistory.filter((item, index) => {
        return me.tabList.indexOf(item.type) >= 0
      })
      return now
    }
  },
  data () {
    return {
      searchContent: '',
      hasSearched: false,
      searchtype: this.searchType
    }
  },
  mounted () {
    this.$refs.searchPageInput.focus()
    this.getSearchHistory()
  },
  watch: {
    // 没有 searchContent, 不显示搜索结果详情
    searchContent (newV, oldV) {
      if (oldV && !newV) {
        this.hasSearched && (this.hasSearched = false)
      }
    }
  },
  methods: {
    ...mapMutations(['clearSearchHistory', 'setSearchHistoryArr']),
    getSearchHistory () {
      localStorage.getItem('searchHistory') && this.$store.commit('setSearchHistoryArr')
    },
    searchHistoryTag (item) {
      this.searchtype = item.type || '动态'
      this.searchContent = item.value || ''
      this.hasSearched = true
    },
    getSearch () {
      if (this.searchContent.trim() === '') {
        return
      }
      if (this.hasSearched) {
        this.$refs.scrollPages && this.$refs.scrollPages.getSearch(this.$refs.scrollPages.touchCurIndex)
      } else {
        this.searchtype = this.searchType
        this.hasSearched = true
      }
    },
    blur () {
      this.$refs.searchPageInput.blur()
    },
    flag () {
      this.$emit('flas', this.cruuaa)
    },
    clearContent () {
      this.searchContent = ''
      // this.hasSearched = false
    },
    handleContent () {
      this.searchContent.trim()
      if (this.searchContent.length > 15) {
        // eslint-disable-next-line
        weui.topTips('关键字应小于15', {
          duration: 1000
        })
      }
    },
    handleHistory () {
      this.$store.commit('clearSearchHistory')
    },
    handleFilter (index, order) {
      this.filterIndex = index
      this.searchOrder = order
      this.resetData()
      this.getSearchAll()
    }
  }
}
</script>

<style lang="less">
.searchPage{
  background: #fff;
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  z-index: 1000;
  .search-header{
    background-color: white;
    color:rgb(127,127,127);
    font-size: 1vw;
    i{
      color: var(--dGray);
    }
    .tabList{
      height: 12vw;
      line-height: 12vw;
      margin-top: 1vw;
      .tabBottom{
        bottom: 2vw;
      }
    }
    .searchClassify{
      width: 100vw;
      font-size: 0;
      text-align: center;
      span{
        display:inline-block;
        width:19.2vw;
        height:7.34vw;
        padding: 4vw 0 2vw;
        line-height: 7.34vw;
        font-size:4vw;
        text-align: center;
        color:#999;
      }
      .searchUnique{
        // border-bottom:2px solid rgb(255, 39, 66);
        color:#232323;
      }
    }
    .serch_wrap{
      width:100%;
      height:10vw;
      display: flex;
      .goback{
        padding-top:0.5vw;
        margin-left:1vw;
        height:10vw;
        line-height:10vw;
        .goto-right{
          transform:rotate(180deg);
          margin-left:2vw;
          margin-top:2.5vw;
        }
      }
      .search_inner{
        width:75%;
        height:7vw;
        margin-left:4vw;
        margin-top:2vw;
        background-color:rgb(245, 245, 245);
        border-radius: 2vw;
        display: flex;
        form {
          input {
            width: 100%;
            height: 100%;
          }
        }
        .searchFind{
          color:rgb(127,127,127);
          margin-top:1.5vw;
          margin-left:2vw;
          font-size: var(--nText);
        }
        .serch_box{
          width:50vw;
          border:none;
          outline:none;
          margin-left:2vw;
          background-color:rgb(245, 245, 245);
        }
        .searchClear{
          display:inline-block;
          width:4vw;
          height:4vw;
          background-color:rgb(140, 140, 140);
          color:white;
          font-size:3.5vw;
          text-align: center;
          border-radius: 50%;
          margin-left:10vw;
          margin-top:1.5vw;
          line-height: 4vw;
        }
    }
    .searchFound{
      width:10vw;
      height:7vw;
      margin-left:3vw;
      margin-top:2vw;
      font-size:4vw;
      letter-spacing: 0.3vw;
    }
   }

  }
  .searchContent{
    font-size: 0;
    height: calc(100vh - 23vw);
    width: 400vw;
    background: #f9f9f9;
    overflow: hidden;
    .TabContentItemPage{
      position: relative;
      display: inline-block;
      vertical-align: top;
      width: 100vw;
      height:100%;
      font-size: var(--mText);
    }
    .dynamicsTabContent{
      .results{
        position: relative;
        width: 100vw;
        height:100%;
        .scrollWrapper{
          position: absolute;
          // top: 10.5vw;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          overflow: hidden;
        }
      }
    }
  }
}
.searchHistory{
  .myHistory{
    border-bottom:4px solid rgb(250, 250, 250);
    padding-bottom:3vw;
    box-sizing: border-box;
    margin-top:4vw;
    .historyTitle{
      font-size:4vw;
      margin-left:4vw;
      display:flex;
      justify-content: space-between;
      .deleteHistory{
        display:inline-block;
        width:14vw;
        height:6vw;
        text-align: center;
        line-height:6vw;
        .activityNotice{
          color:rgb(127,127,127);
          font-size:5vw;
        }
      }
    }
  }
  .searchHistory-tags{
    padding: 0 2.78vw;
    font-size: 0;
    margin-top: 2vw;
    span{
      display: inline-block;
      padding: 0 3vw;
      margin-bottom: 3vw;
      height: 7vw;
      line-height: 7vw;
      border-radius: 4vw;
      font-size: var(--nText);
      background: #f0f0f0;
      margin-right: 3vw;
    }
  }
}
</style>
