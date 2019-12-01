<template>
  <div class="blogIndex-page">
    <blog-introduce :item='introduce'></blog-introduce>
    <div class="separator"></div>
    <div class="blog-categories">
      <div class="category-item" v-for="(item,index) in categories.slice(0, 3)" :key='index'>
        <img class="cate-iconImg" :src="item.iconImg" alt="">
        <p class="cate-tit">{{item.tit}}</p>
        <p class="cate-desc">{{item.desc}}</p>
      </div>
    </div>
    <div class="blog-categories">
      <div class="category-item" v-for="(item,index) in categories.slice(3,6)" :key='index'>
        <img class="cate-iconImg" :src="item.iconImg" alt="">
        <p class="cate-tit">{{item.tit}}</p>
        <p class="cate-desc">{{item.desc}}</p>
      </div>
    </div>
    <div class="separator"></div>
    <div class="blog-list">
      <blog-item v-for='(item,index) in blogs' :index='index' :item='item' :key='index'></blog-item>
    </div>
  </div>
</template>

<script>
const blogIntroduce = resolve => require(['@/components/Blog/Introduce'], resolve)
const blogItem = resolve => require(['@/components/Blog/Item'], resolve)
export default {
  components: {
    blogIntroduce,
    blogItem
  },
  data () {
    return {
      categories: [],
      introduce: {},
      blogs: []
    }
  },
  created () {
    this.getMock('index')
        .then((res) => {
          this.categories = res.categories
          this.introduce = res.introduce
          this.blogs = res.blogs
        })
  }
}
</script>

<style lang='less'>
.blogIndex-page{
  width: 100%;
  box-sizing: border-box;
  padding: 80px;
  @media only screen and (max-width: 768px) {
      padding: 15px;
  }
  .blog-categories{
    width: 100%;
    font-size: 0;
    overflow: hidden;
    .category-item{
      float: left;
      // display: inline-block;
      width: 32.83%;
      background-color: #eaebef;
      margin: 0.25%;
      padding: 40px;
      text-align: center;
      box-sizing: border-box;
      padding-bottom: 500px;
      margin-bottom: -500px;
      overflow: hidden;
      @media only screen and (max-width: 768px) {
        width: 100%;
        padding-bottom: 0;
        margin-bottom: 0.3%;
      }
      .cate-iconImg{
        width: 50px;
        height: 50px;
      }
      .cate-tit{
        line-height: 30px;
        margin: 30px 0 20px;
        font-size: 20px;
        font-weight: 600;
        color: #333;
      }
      .cate-desc{
        line-height: 24px;
        font-size: 16px;
        color: var(--lGray);
        margin: 10px 0 40px;
      }
    }
  }
}
</style>
