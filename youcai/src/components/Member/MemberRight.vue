<template>
  <div class="memberRightPage">
    <div class="swiper-container"
         id="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide oneBox">
          <div class="slideOne">
            <div class="contentOne"
                 @click='goPrivilege("film")'>
              <span class="contentFont"><i class="iconWshipin2 iconWanwan styleFont"></i></span>
              <span class="contentTitle">视频</span>
              <span class="contentDetail">2分钟视频笔记</span>
            </div>
            <div class="contentOne"
                 @click='goPrivilege("score")'>
              <span class="contentFont"><i class="iconWbajiefuli iconWanwan styleFont"></i></span>
              <span class="contentTitle">积分</span>
              <span class="contentDetail">更多积分礼物</span>
            </div>
            <div class="contentOne"
                 @click='goPrivilege("vote")'>
              <span class="contentFont"><i class="iconWVoted iconWanwan styleFont"></i></span>
              <span class="contentTitle">投票</span>
              <span class="contentDetail">体验投票加倍</span>
            </div>
            <div class="contentOne"
                 @click='goPrivilege("overt")'>
              <span class="contentFont"><i class="iconWvip iconWanwan styleFont"></i></span>
              <span class="contentTitle">标识</span>
              <span class="contentDetail">彰显独特魅力</span>
            </div>
          </div>
          <div class="slideOne">
            <div class="contentOne" @click='goPrivilege("unique")'>
              <span class="contentFont"><i class="iconWicon29 iconWanwan styleFont"></i></span>
              <span class="contentTitle">装扮</span>
              <span class="contentDetail">专属你的装扮</span>
            </div>
            <div class="contentOne"
                 @click="goLookMe">
              <span class="contentFont"><i class="iconWai-eye iconWanwan styleFont"></i></span>
              <span class="contentTitle">访客</span>
              <span class="contentDetail">查看全部访客</span>
            </div>
            <div class="contentOne" @click='goPrivilege("photo")'>
              <span class="contentFont"><i class="iconWzhaopianqiang iconWanwan styleFont"></i></span>
              <span class="contentTitle">照片墙</span>
              <span class="contentDetail">秀出你的个性</span>
            </div>
            <div class="contentOne" @click='goPrivilege("feedback")'>
              <span class="contentFont"><i class="iconWziyuan2 iconWanwan styleFont"></i></span>
              <span class="contentTitle">反馈</span>
              <span class="contentDetail">反馈优先特权</span>
            </div>
          </div>
        </div>
      </div>
      <div class="MemberSwiperPagination"></div>
    </div>
  </div>
</template>

<script>
export default {
  mounted () {
      this.meRight()
  },
  methods: {
    meRight () {
      this.mySwiper = new window.Swiper('#swiper-container', {
        zoom: true,
        allowTouchMove: true,
        passiveListeners: false,
        loop: false,
        lazyLoading: true,
        initialSlide: 0,
        observer: true, // 修改swiper自己或子元素时，自动初始化swiper
        observeParents: true,
        pagination: {
            el: '.MemberSwiperPagination'
        },
      })
    },
    goLookMe () {
      this.$router.push({ name: 'my_whoLook' })
    },
    goPrivilege (name) {
        this.$router.push({
            name: 'privilegeDetail',
            params: {
                curName: name
            }
        })
    }
  }
}
</script>

<style lang="less" scoped>
    .memberRightPage{
        .oneBox{
            width:100%;
            height:50.27vw;
            .slideOne{
                height:25vw;
                width:100vw;
                padding:2.22vw 2.22vw 0 2.22vw;
                box-sizing: border-box;
                display:flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                .contentOne{
                    width:21.29vw;
                    text-align: center;
                    font-size:0;
                    span{
                        display:inline-block;
                        width:100%;
                        text-align: center;
                    }
                    .contentFont{
                        
                        .styleFont{
                            font-size:4vw;
                            color:rgb(211, 44, 49);
                        }
                    }
                    .contentTitle{
                        font-size:4vw;
                    }
                    .contentDetail{
                        color:#908f8f;
                        font-size:3.5vw;
                    }
                }
            }
        }
        .MemberSwiperPagination{
            bottom:-10vw;
            text-align: center;
        }
    }
</style>

<style lang="less">
    .memberRightPage{
        .swiper-pagination-bullet{
            width: 4px;
            height:4px;
            border-radius: 2px;
            bottom:0;
            text-align: center;
            &.swiper-pagination-bullet-active{
                width: 8px;
                background: rgb(112, 125, 132);
            }
        }
    }
    
</style>