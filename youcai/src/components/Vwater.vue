<template>
  <div class="page-content discoverWraper">
    <div class="zq-waterfall soli_discover">
      <div class="no_data" v-if="isLoading">
        <div class="weui-loadmore">
          <i class="weui-loading"></i>
          <span class="weui-loadmore__tips">正在加载</span>
        </div>
      </div>
      <div class="no_data" v-else-if="items.length<=0">
        <div class="weui-loadmore weui-loadmore_line">
          <span class="weui-loadmore__tips">暂无数据</span>
        </div>
      </div>
      <div class="discover" v-else>
        <div class="zq-waterfall-left">
          <ul class="soli_list_waterfall">
            <li class="box" v-for="item in itemsA" :key="item.id">
              <span class="soli_play" v-show="playVisibility"><img src="@/assets/iconImg/play.png" alt=""></span>
              <div @click.stop="gotoItem(item)">
                <thumbnail :src="item.Picture" width="46vw" />
                <div class="content">{{item.Content}}</div>
              </div>
              <itemMeta :item="item" :likes="likes" @updateLikes="updateLikes" />
            </li>
          </ul>
        </div><div class="zq-waterfall-right">
          <ul class="soli_list_waterfall">
            <li class="box" v-for="item in itemsB" :key="item.id">
              <span class="soli_play" v-show="playVisibility"><img src="@/assets/iconImg/play.png" alt=""></span>
              <div @click.stop="gotoItem(item)">
                <thumbnail :src="item.Picture" width="46vw" />
                <div class="content">{{item.Content}}</div>
              </div>
              <itemMeta :item="item" :likes="likes" @updateLikes="updateLikes" />
            </li>
          </ul>
        </div>
        <div class="clearfix"></div>

      </div>
    </div>
  </div>
</template>
<style lang="less">
@import url(../assets/less/pages.less);
.zq-waterfall .content{
display:-webkit-box;
overflow:hidden;
-webkit-box-orient:vertical;
-webkit-line-clamp:3;
border: 2.315vw solid transparent;
padding:0 !important;
}
</style>
<script>
import Thumbnail from '@/components/Thumbnail.vue'
import Meta from '../views/Discover/components/Meta0'
export default {
  components: {
    'itemMeta': Meta,
    thumbnail: Thumbnail
  },
  props: ['searchTitle', 'isSingleItem'],
  data () {
    return {
      items: [],
      isLoading: false,
      likes: [],
      scrollTop: 0,
      itemsA: [],
      itemsB: []
    }
  },
  watch: {
    searchTitle () {
      console.log('discover数据改变,根据要搜索的字段去请求后台接口', this.searchTitle)
    }
  },
  activated () {
    let me = this
    // 修改滚动位置
    let parent = me.$el.parentElement
    if (me.scrollTop > 0) {
      parent.scrollTop = me.scrollTop
      me.scrollTop = 0
    }
  },
  beforeCreate () {
    this.isLoading = true
  },
  computed: {
    playVisibility () {
      return false
    }
  },
  mounted: function () {
    let me = this
    let st = setInterval(() => {
      if (me.items.length >= 1) {
        clearInterval(st)
        me.getData()
      }
    }, 150)
    if (!me.$el.dataset.AddedEvent) {
      // 保存滚动位置
      me.$el.dataset.AddedEvent = true
      me.$el.addEventListener('touchend', function () {
        me.scrollTop = me.$el.parentElement.scrollTop
      },
      {
        passive: true
      })
    }
  },
  created () {
    // let me = this
    // me.isLoading = true
    // me.api.process({
    //   file: 'Post',
    //   method: 'GetList',
    //   success: function (res) {
    //     me.items = res.items
    //     me.likes = res.likes
    //   },
    //   error: function (res) {
    //     me.$msg.showError(res.msg)
    //   },
    //   complete: function () {
    //     me.isLoading = false
    //   }
    // })
  },
  methods: {
    // 方法
    getImg (url, callback) {
      var img = new Image()
      img.src = url
      /* 如果图片被缓存，则直接返回缓存数据 */
      if (img.complete) {
        /* callback(img.width, img.height); */
        callback(img.width, img.height, Number(img.height) / Number(img.width))
      } else {
        /* 完全加载完毕的事件 */
        img.onload = function () {
          /* callback(img.width, img.height); */
          callback(img.width, img.height, Number(img.height) / Number(img.width))
        }
      }
    },
    getData () {
      // 加载完页面执行的函数
      let elLeft = this.$el.querySelector('.zq-waterfall-left')
      let elRight = this.$el.querySelector('.zq-waterfall-right')
      let that = this
      for (let i = 0; i < this.items.length; i++) {
        let val = this.items[i]
        if (!val.Picture || val.Picture.length <= 0) {
          continue
        }
        setTimeout(() => {
          that.getImg(that.config.imageOrigin + val.Picture, function (w, h, r) {
            let boxA = elLeft.clientHeight
            let boxB = elRight.clientHeight
            if (boxA > boxB) {
              that.itemsB.push(val)
            } else {
              that.itemsA.push(val)
            }
          })
        }, i * 50)
      }
    },
    updateLikes (likes) {
      this.likes = likes
    },
    gotoItem (item) {
      if (this.isSingleItem) {
        this.$router.push({ name: 'singleItem', params: { id: item.Id } })
      } else {
        this.$router.push({ name: 'discoverItem', params: { id: item.Id } })
      }
    }
  }
}
</script>

<style lang="less" scope>
  .discoverWraper{
    position: relative;
    top:0;
  }
</style>
