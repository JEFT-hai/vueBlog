<template>
  <div class="blog-item clearfix">
      <div class="blog-item--inner clearfix">
          <img class="blog-item-img" :src="item.cover" alt="" :style="{float: index%2 ? 'left' : 'right'}">
            <div class="blog-item--shot">
                <div class="blog-item-tit">{{item.tit}}</div>
                <div class="blog-item-desc">{{item.desc}}</div>
                <div class="more-btn blog-item-btn">READ MORE</div>
            </div>
      </div>
      
      <div class="separator"></div>
  </div>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            required: true
        },
        index: {
            type: Number,
            default: 1
        }
    }
}
</script>

<style lang='less'>
.blog-item{
    width: 100%;
    overflow: hidden;
    &:last-child{
        .separator{
            display: none;
        }
        @media screen {
            margin-bottom: 40px;
        }
    }
    .blog-item--inner{
        width: 100%;
        font-size: 0;
        box-sizing: border-box;
        .blog-item-img{
            width: 50%;
            height: auto;
            padding: 0 20px;
            overflow: hidden;
            box-sizing: border-box;
        }
        .blog-item--shot{
            float: left;
            width: 50%;
            padding: 0 20px;
            text-align: left;
            box-sizing: border-box;
            .blog-item-tit{
                height: 40px;
                line-height: 40px;
                font-size: 24px;
                font-weight: 600;
                letter-spacing: 1px;
                margin-bottom: 20px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
            .blog-item-desc{
                line-height: 24px;
                font-size: 16px;
                color: var(--lGray);
            }
            .blog-item-btn{
                margin-top: 30px;
            }
        }
        @media only screen and (max-width: 768px) {
            .blog-item-img{
                padding: 0;
                width: 100%;
            }
            .blog-item--shot{
                width: 100%;
                padding: 0;
                margin-top: 40px;
            }
        }
    }
    
}
</style>
