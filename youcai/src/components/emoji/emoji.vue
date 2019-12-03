<template>
  <div class="emojiPage">
    <swiper :options='swiperOption'
            class="swiper-box emojiSwiper">
      <swiper-slide class="swiper-item"
                    v-for='(item,key) in emoji'
                    :key='key'>
        <emojiTable :items='item'
                    @choose='choose'
                    @del='del'></emojiTable>
        <!-- <img src="http://192.168.1.101:8888/group1/M00/00/01/wKgBZV2tc8qASp1jAACttTfj0sg549.png"
             alt=""> -->
      </swiper-slide>
      <div class="swiper-pagination"
           slot="pagination"></div>
    </swiper>
    <ul class="emojiTabList borderT">
      <li class="curTab">
        {{emoji.people0.smiley}}
      </li>
    </ul>
  </div>
</template>
<script>
import emoji from '@/assets/js/emojis'

import emojiTable from '@/components/emoji/emojiTable'
export default {
    data(){
        return {
            emoji: emoji,
            swiperOption: {
                direction: 'horizontal',
                slidesPerView: 1,
                spaceBetween: 30,
                mousewheel: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                }
            }
        }
    },
    components:{
        // swiper,
        emojiTable
    },
    methods:{
        choose (data) {
            this.$emit('insert', data)
        },
        del(){
            this.$emit('del')
        }
    }
}
</script>
<style lang="less" scoped>
.emojiPage{
    width: 100vw;
    font-family: 'Segoe UI, Tahoma, Arial, Helvetica, sans-serif';
    .emojiSwiper{
        background-color: #f4f3f9;
    }
    .swiper-pagination{
        position: relative;
        bottom: 0;
        height: 7vw;
        line-height: 7vw;
        margin-bottom: 3vw;
    }
    .swiper-pagination-bullet{
        width: 4px;
        height:4px;
        border-radius: 2px;
        &.swiper-pagination-bullet-active{
            width: 8px;
            background: #3daf3d;
        }
    }
    .emojiTabList{
        position: relative;
        height: 9vw;
        line-height: 9vw;
        background-color: #ffffff;
        li.curTab{
          font-size: 6vw;
          background: #d9d9d9;
        }
        li{
          display: inline-block;
          vertical-align: top;
          width: 15.7vw;
          height: 9vw;
          text-align: center;
          img{
            width: 8vw;
            height: 8vw;
            margin-bottom: 0.5vw;
          }
        }
    }
}
</style>
