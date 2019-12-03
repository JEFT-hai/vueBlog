<template>
  <div class="page-content">
    <div class="no_data" v-if="isLoading">
      加载中...
    </div>
    <div class="no_data" v-else-if="item.Id<=0">
      未找到相关内容
    </div>
    <div v-else>
      <ul class="soli_list_fallow">
        <li>
          <div class="line"></div>
          <div class="head">
            <img src="http://shop_api.tianvcms.com/files/avatar/78c65d06ffed4cf0bc67d1db687fbc1f.jpg" />
            <div>
              <h4>赵六</h4>
              <span class="time">5分钟前</span>
              <span class="follow active"></span>
            </div>
            <div class="clearfix"></div>
          </div>
          <div class="clearfix"></div>
          <div class="content">{{item.Detail}}</div>
          <img src="http://shop_api.tianvcms.com/files/avatar/78c65d06ffed4cf0bc67d1db687fbc1f.jpg" />
          <div class="subinfo_box clearfix">
            <span><i class="icon-icon_subinfobox1 icon-star icon iconfont"></i>16</span>
            <span><i class="icon-icon_subinfobox2 icon-find icon iconfont"></i>8</span>
            <span><i class="icon-icon_subinfobox3 icon-messenger icon iconfont"></i>{{item.Id}}</span>
            <span class="distance">距离15km 12343人阅读</span>
          </div>
          <div class="discuz_box">
            <router-link :to="{ name:'', params: { id: 1} }" class="link discuz_title">评论12</router-link>
            <ul>
              <li>
                <span>张三：</span>评论一大堆
              </li>
              <li>
                <span>李四：</span>透过广场舞，我们看到什么？广场舞已经成为众多乡村的晚间固定“文娱项目”。
              </li>
            </ul>
            <a href="javascript:" class="link">说点什么吧.....</a>
          </div>
          <div class="clearfix"></div>
        </li>
        <li>
          <div class="line"></div>
          <div class="head">
            <img src="http://shop_api.tianvcms.com/files/avatar/78c65d06ffed4cf0bc67d1db687fbc1f.jpg" />
            <div>
              <h4>赵六</h4>
              <span class="time">5分钟前</span>
              <span class="follow active"></span>
            </div>
            <div class="clearfix"></div>
          </div>
          <div class="clearfix"></div>
          <div class="content">{{item.Detail}}</div>
          <img src="http://shop_api.tianvcms.com/files/avatar/78c65d06ffed4cf0bc67d1db687fbc1f.jpg" />
          <div class="subinfo_box clearfix">
            <span><i class="icon-icon_subinfobox1"></i>16</span>
            <span><i class="icon-icon_subinfobox2"></i>8</span>
            <span><i class="icon-icon_subinfobox3"></i>{{item.Id}}</span>
            <span class="distance">距离15km 12343人阅读</span>
          </div>
          <div class="discuz_box">
            <router-link :to="{ name:'discuz', params: { id: 1} }" class="link discuz_title">评论12</router-link>
            <ul>
              <li>
                <span>张三：</span>评论一大堆
              </li>
              <li>
                <span>李四：</span>透过广场舞，我们看到什么？广场舞已经成为众多乡村的晚间固定“文娱项目”。
              </li>
            </ul>
            <a href="javascript:" class="link">说点什么吧.....</a>
          </div>
          <div class="clearfix"></div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      isLoading: true,
      item: {
        Id: 0
      }
    }
  },
  mounted () {
    var me = this
    let id = parseInt(this.$route.params.id)
    if (id <= 0) {
      return
    }
    me.isLoading = true
    let formData = new FormData()
    formData.append('id', id)
    me.api.process({
      file: 'My',
      method: 'GetChangeItem',
      data: formData,
      success: function (res) {
        me.item = res.item
      },
      error: function (res) {
        me.$msg.showError(res.msg)
      },
      complete: function () {
        me.isLoading = false
      }
    })
  }
}
</script>
