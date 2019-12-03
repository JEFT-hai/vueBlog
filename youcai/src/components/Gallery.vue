<template>
  <div class="galleryWrap">
    <div class="mask"></div>
    <div class="galleryImg" @click="backPublish">
      <img :src="getImagePath(filePath)" alt="" :class="filterClass">
    </div>
    <div :class="['imgBeauty', beautyClassName]">
      <div class="topHead">
        <span class="topName">滤镜</span>
        <span class="fold" @click="showBeauty"></span>
      </div>
      <div class="filterList">
        <div class="filters">
            <div class="filter-content">
              <div class="itemWrap">
                  <div class="img-item" @click="changeFilter('')"><img :src="getImagePath(filePath)"></div>
                  <span>原图</span>
              </div>
              <div class="itemWrap">
                  <div class="img-item blur" @click="changeFilter('blur')"><img :src="getImagePath(filePath)"></div>
                  <span>模糊</span>
              </div>
              <div class="itemWrap">
                  <div class="img-item light" @click="changeFilter('light')"><img :src="getImagePath(filePath)"></div>
                  <span>晴日</span>
              </div>
              <div class="itemWrap">
                <div class="img-item contrast" @click="changeFilter('contrast')"><img :src="getImagePath(filePath)"></div>
                <span>小森林</span>
              </div>
              <div class="itemWrap">
                <div class="img-item grayscale" @click="changeFilter('grayscale')"><img :src="getImagePath(filePath)"></div>
                <span>流年</span>
              </div>
              <div class="itemWrap">
                <div class="img-item hue-rotate" @click="changeFilter('hue-rotate')"><img :src="getImagePath(filePath)"></div>
                <span>故事</span>
              </div>
              <div class="itemWrap">
                <div class="img-item invert" @click="changeFilter('invert')"><img :src="getImagePath(filePath)"></div>
                <span>小美好</span>
              </div>
              <div class="itemWrap">
                <div class="img-item opacity" @click="changeFilter('opacity')"><img :src="getImagePath(filePath)"></div>
                <span>1980</span>
              </div>
              <div class="itemWrap">
                <div class="img-item saturate" @click="changeFilter('saturate')"><img :src="getImagePath(filePath)"></div>
                <span>暖茶</span>
              </div>
              <div class="itemWrap">
                <div class="img-item sepa" @click="changeFilter('sepa')"><img :src="getImagePath(filePath)"></div>
                <span>怀旧</span>
              </div>
              <div class="itemWrap">
                <div class="img-item hue-rotate2" @click="changeFilter('hue-rotate2')"><img :src="getImagePath(filePath)"></div>
                <span>蓝木街</span>
              </div>
              <div class="itemWrap">
                <div class="img-item invert2" @click="changeFilter('invert2')"><img :src="getImagePath(filePath)"></div>
                <span>汽水</span>
              </div>
              <div class="itemWrap">
                <div class="img-item saturate2" @click="changeFilter('saturate2')"><img :src="getImagePath(filePath)"></div>
                <span>胶片</span>
              </div>
            </div>
        </div>
      </div>
    </div>
    <div :class="['toll', btnClassName]" >
      <span class="beauty" @click="showBeauty"></span>
      <span class="delete" @click="hiddenGallery"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import '../assets/css/filter.css'
export default {
  props: {
    filePath: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isBeauty: false,
      filterClass: '', // 图片的滤镜样式
      beautyClassName: '', // 滤镜盒子类名
      btnClassName: '' // 按钮的样式
    }
  },
  methods: {
    backPublish () {
      this.$emit('changeGallery', { filePath: this.filePath })
    },
    // 图片
    getImagePath (path) {
      if (path.indexOf('/') === 0) {
        return this.config.imageOrigin + path
      }
      if (path.indexOf('') !== -1) {
      }
      return path
    },
    // 隐藏选择滤镜页面
    hiddenGallery () {
      this.$emit('hiddenGallery')
    },
    // 滤镜选择页面
    showBeauty () {
      this.isBeauty = !this.isBeauty
      if (this.isBeauty) {
        this.beautyClassName = 'hiddenBtn'
        this.btnClassName = 'btnDisplayNone'
      } else {
        this.beautyClassName = 'showBtn'
        this.btnClassName = 'btnDisplay'
      }
    },
    // 改变滤镜
    changeFilter (data) {
      console.log('ss')
      this.filterClass = data
    }
  }
}
</script>

<style lang="less" scoped>
@keyframes buttonHiden {
  0% { bottom: -36vw;opacity: 0;}
  100% {bottom: 0vw; opacity: 1;}
}
.hiddenBtn {
  animation: buttonHiden ease 0.3s 0s forwards ;
}
@keyframes showHiden {
  0% { bottom: 0vw;opacity: 1;}
  100% {bottom: -36vw; opacity: 1;}
}
.showBtn {
  animation: showHiden ease 0.3s 0s forwards ;
}
@keyframes delay {
  0% { bottom: -36vw;opacity: 0;}
  100% {bottom: 0vw; opacity: 1;}
}

.delayShow{
  animation: showHiden ease 0.3s 0.3s forwards ;
}
.btnDisplayNone{
  display:none !important;
}
@keyframes btnDisplay {
  0% { display: none !important}
  100% {display: flex !important}
}
.btnDisplay{
  //animation: btnDisplay ease 0.3s 0.3s forwards ;
  transition: all 1s ease 1s;
}
.galleryWrap{
  width:100%;
  height:100%;
  position:absolute;
  top:0;
  left:0;
  z-index:60000;
  .mask{
    width:100%;
    height:30vw;
    position:absolute;
    top:0;
    background: white;
  }
  .galleryImg{
    width:100%;
    height:80vw;
    position:absolute;
    top:20vw;
    overflow: hidden;
  }
  .imgBeauty{
    width:100%;
    height:36vw;
    background-color:rgb(51, 51, 51);
    position:absolute;
    bottom:-36vw;
    border-radius:3vw;
    .topHead{
      width:100%;
      height:6vw;
      display: flex;
      justify-content: center;
      .topName{
        color:#c8c8cd;
        width:10vw;
        height:6vw;
        letter-spacing:0.3vw;
      }
      .fold{
        width:6vw;
        height:6vw;
        transform: rotate(90deg);
        position:absolute;
        top:1vw;
        right:7vw;
      }
      .fold:after{
        content: " ";
        display: inline-block;
        height: 8px;
        width: 8px;
        border-width: 2px 2px 0 0;
        border-color: #c8c8cd;
        border-style: solid;
        -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
        transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
        top: -2px;
        position: absolute;
      }
    }
    .filterList{
      margin-top:2vw;
      height:25vw;
      .filters{
        overflow: scroll;
        .filter-content{
          min-width: 260vw;
          height: 24vw;
          .itemWrap{
            display: inline-block;
            width:20vw;
            height:20vw;
            .img-item{
              width:14vw;
              height:14vw;
              overflow: hidden;
              border-radius: 50%;
              margin:auto;
              img{
                width:14vw;
                height:14vw;
                border-radius: 50%;
              }
            }
            span{
              margin-top:1vw;
              width:20vw;
              height:4vw;
              color:#c8c8cd;
              display: inline-block;
              text-align: center;
            }
          }
        }
      }
    }
  }
  .toll{
    position:absolute;
    left:0;
    right:0;
    bottom:5vw;
    height:10vw;
    width:80%;
    margin:0 auto;
    display: flex;
    justify-content: space-around;
    .beauty{
      display: inline-block;
      width:10vw;
      height:10vw;
      background:url('../assets/images/filter10.png') no-repeat;
      background-position-x: center;
      position:relative;
    }
    .beauty:after{
      content:'滤镜';
      color:rgb(127,127,127);
      width:10vw;
      font-size:3vw;
      position:absolute;
      bottom:0vw;
      text-align: center;
      letter-spacing: 0.3vw;
    }
    .delete{
      display: inline-block;
      width:10vw;
      height:10vw;
      background:url('../assets/images/delete7.png') no-repeat;
      background-position-x: center;
      position:relative;
    }
    .delete:after{
      content:'删除';
      color:rgb(127,127,127);
      width:10vw;
      font-size:3vw;
      position:absolute;
      bottom:0vw;
      text-align: center;
      letter-spacing:0.3vw;
    }
  }
}
</style>
