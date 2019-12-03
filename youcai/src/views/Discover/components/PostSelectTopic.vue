<template>
  <div id="pst" v-show="show">
    <div class="weui-search-bar">
        <form class="weui-search-bar__form">
            <div class="weui-search-bar__box">
                <i class="weui-icon-search"></i>
                <input type="search" class="weui-search-bar__input" placeholder="搜索更多标签" required="" v-model="q">
                <a href="javascript:" class="weui-icon-clear" @click="cleanSearch"></a>
            </div>
        </form>
        <a href="javascript:" class="weui-search-bar__cancel-btn" @click="hideMe">取消</a>
    </div>
    <div class="pst-categorys borderB" v-if="q.length<=0">
      <div class="pst-category" v-for="item in postCategory.categorys" v-bind:key="item.id" :style="'background-image: url('+item.picture+')'">
        <span :class="item.id===CategoryId?'activeCate':''" @click="filter(item, $event)">{{item.title}}</span>
      </div>
    </div>
    <div class="pst-items pstList" v-if="q.length<=0">
      <scroll ref="scroll">
        <div class="pst-item borderB" v-for="item in items" v-bind:key="item.Id">
          <a @click="select(item)" v-if="item.Id<=0">^ {{item.title}}</a>
          <a @click="select(item)" v-else># {{item.title}}<span class="readPerson" v-show='item.person'>{{item.person}}</span></a>
        </div>
      </scroll>
    </div>
    <div class="pst-items" v-if="q.length>=1">
      <div class="pst-item" v-for="item in searchs" v-bind:key="item.Id">
        <a @click="select(item)" v-if="item.Id<=0">^ {{item.title}}</a>
        <a @click="select(item)" v-else># {{item.id}}. {{item.title}}<span class="weui-badge">{{item.person}}</span></a>
      </div>
      <div>
        <a @click="createTopic">没有想参与的话题？<br />创建新话题： {{q}}</a>
      </div>
    </div>
  </div>
</template>

<script>
import scroll from '@/components/scroll/scroll'
import scrollMixin from '@/components/scroll/scrollMixin'
import { mapState, mapMutations } from 'vuex'
export default {
  mixins: [scrollMixin],
  components: {
    scroll
  },
  data () {
    return {
      q: '',
      categorys: [],
      CategoryId: 0,
      allItems: [],
      searchs: []
    }
  },
  created () {
    // console.log(this.postCategory, 'store')
    if (!this.postCategory.categorys.length) {
      this.getCategory()
    }
    // let me = this
    // me.api.oldPost({
    //   file: 'Post',
    //   method: 'GetTopicCategorys',
    //   success: function (res) {
    //     me.categorys = res.categorys
    //     console.log('res', res)
    //     me.allItems = res.items
    //   },
    //   error: function (res) {
    //     me.$msg.showError(res.msg)
    //   },
    //   complete: function () {
    //     me.isLoading = false
    //   }
    // })
    // me.api.get({
    //   url: 'PostCategory',
    //   success: function (res) {
    //     me.categorys = res.categorys
    //   }
    // })
  },
  computed: {
    ...mapState({
      'postCategory': 'postCategory'
    }),
    items () {
      let temp = this.postCategory.items.filter(t => t.parentId === this.CategoryId)
      this.postCategory.categorys[0] && this.CategoryId === this.postCategory.categorys[0].id && (temp = this.postCategory.items.filter(t => t.isRecommend === true))
      if (this.postCategory.categorys.length >= 1 && this.CategoryId === this.postCategory.categorys[0].id) {
        temp.unshift({ id: 0, parentId: 0, CategoryId: 0, title: '不参与任何标签', Person: 0 })
      }
      return temp
    }
  },
  watch: {
    q () {
      this.searchs = this.postCategory.items.filter(t => t.Title.toLowerCase().indexOf(this.q.toLowerCase()) !== -1)
    },
    show (isShow) {
      if (!isShow) {
        this.CategoryId = 0
        this.q = ''
      } else {
        if (this.postCategory.categorys.length >= 1) {
          this.CategoryId = this.postCategory.categorys[0].id
        }
      }
    }
  },
  props: {
    show: {
      required: true,
      type: Boolean
    }
  },
  methods: {
    ...mapMutations({
      'upCategory': 'upCategory'
    }),
    cleanSearch () {
      this.q = ''
    },
    hideMe () {
      this.$emit('hideTopicSelector')
    },
    filter (item, event) {
      this.CategoryId = item.id
    },
    select (item) {
      this.$emit('selectTopic', item)
      this.$emit('hideTopicSelector')
    },
    createTopic () {
      let st = this.allItems.filter(t => t.Title.toLowerCase() === this.q.toLowerCase())
      if (st != null && st.length >= 1) {
        this.$emit('selectTopic', st[0])
        this.$emit('hideTopicSelector')
        return
      }
      let newTopic = { Id: 99999, CategoryId: 0, Title: this.q, Person: 0 }
      this.allItems.push(newTopic)
      this.$emit('selectTopic', newTopic)
      this.$emit('hideTopicSelector')
    },
    getCategory () {
      let me = this
      me.api.get({
        url: 'PostCategory',
        success: function (res) {
          me.$store.commit('upCategory', res)
        }
      })
    }
  }
}
</script>

<style lang="less">
  @keyframes borderBW{
    0%{
      width: 0px;
      margin-left: 0;
    }
    100%{
      width: 8vw;
      margin-left: -4vw;
    }
  }
  #pst {
    position: fixed;
    top: 0;
    height: 0;
    z-index: 9999;
    width: 100vw;
    height: 100vh;
    background-color: #fff;
    .pst-categorys {
      white-space: nowrap;
      overflow: scroll;
      padding: 4vw;
      background:#fafafa;
      font-size: 0;
      .pst-category {
        // background-image: url(http://admin.szwanwan.com/files/upload/20190214/timg.jpg);
        background-size: cover;
        background-position: center center;
        border-radius: 1.6vw;
        display: inline-block;
        width: 23.46vw;
        height: 17.6vw;
        background-color: #f1f1f1;
        vertical-align: middle;
        margin-right: 6px;
        span {
          position: relative;
          z-index: 1;
          display: block;
          text-align: center;
          padding: 9.6vw 0 0;
          height: 6.4vw;
          line-height: 6.4vw;
          font-size: 3.73vw;
          color: #fff;
        }
        .activeCate{
          &::after{
            position: absolute;
            content:'';
            left: 50%;
            bottom: 0;
            height: 2px;
            width: 8vw;
            margin-left: -4vw;
            background-color: #fff;
            animation: borderBW .5s 1;
          }
        }
      }
    }
    .pstList {
      height: calc(100vh - 150px);
    }
    .pst-items{
      .pst-item{
        height:16vw;
        line-height: 16vw;
        margin-left: 4.266vw;
        color:#7f7f7f;
        a{
          color:#333;
        }
        &::after{
          border-color: #e5e5e5;
        }
        .readPerson{
          display: inline-block;
          background-color:rgb(245, 245, 245);
          padding-left:2vw;
          padding-right:2vw;
          box-sizing: border-box;
          position: relative;
          margin-left:2vw;
          color:rgb(199,199,199);
          height:5vw;
          border-radius: 1.5vw;
          line-height: 5vw;
          text-align: center;
        }
      }
    }
    .weui-search-bar__cancel-btn {
      display: inherit;
    }
  }
</style>
