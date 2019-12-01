<template>
  <div class="blog-introduce" :style='{background: `url(${item.img})`}'>
      <div class="introduce-inner">
          <div class="introduce-tit">{{item.tit}}</div>
          <div class="introduce-desc">{{item.desc}}</div>
          <div class="more-btn introduce-btn">READ MORE</div>
      </div>
  </div>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            required: true
        }
    }
}
</script>

<style lang='less'>
.blog-introduce{
    padding: 40px;
    @media only screen and (max-width: 768px) {
        padding: 35px;
    }
    .introduce-inner{
        max-width: 400px;
        padding: 40px;
        text-align: left;
        background-color: #fff;
        @media only screen and (max-width: 768px) {
            padding: 25px;
            text-align: center;
            .introduce-btn{
                margin-top: 40px!important;
                margin-bottom: 0!important;
            }
        }
        .introduce-tit{
            font-size: 30px;
            font-weight: 600;
            letter-spacing: 2px;
            line-height: 45px;
            margin-bottom: 20px;
            text-align: center;
        }
        .introduce-desc{
            line-height: 24px;
            font-size: 16px;
            color: #666;
        }
        .introduce-btn{
            margin: 20px 0;
        }
    }
}
</style>
