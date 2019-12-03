<template>
  <transition name="mySet">
    <div class="generateWrap">
      <div class='generateTitle'>
        正在为你生成首页...
      </div>
      <div class="imgWrap">
        <div class="oneImages"
             v-if="showOne">
          <transition name="mySetone">
            <ul class="oneUl">
              <li v-for="(item,index) in beforeThree"
                  :key="index">
                <div class="oneImg">
                  <img :src="item.picture"
                       alt="">
                </div>
                <div class="oneTitle">{{item.title}}</div>
              </li>
            </ul>
          </transition>
        </div>
        <div class="twoImages"
             v-if="!showOne">
          <transition name="mySettwo">
            <ul class="twoUl">
              <li v-for="(item,index) in afterThree"
                  :key="index">
                <div class="oneImg">
                  <img :src="item.picture"
                       alt="">
                </div>
                <div class="oneTitle">{{item.title}}</div>
              </li>
            </ul>
          </transition>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data () {
    return {
      showOne: true
    }
  },
  props: {
    selectedLabel: {
      type: Array
    }
  },
  computed: {
    beforeThree () {
      let arr = []
      arr = this.selectedLabel.slice(0, 3)
      return arr
    },
    afterThree () {
      let arr = []
      arr = this.selectedLabel.slice(3, this.selectedLabel.length)
      return arr
    }
  },
  mounted () {
    setTimeout(() => {
      this.showOne = false
    }, 1000)
    this.goIndex()
  },
  methods: {
    goIndex () {
      setTimeout(() => {
        window.goIndexAndRefresh()
      }, 1900)
    }
  }
}
</script>

<style lang="less" scoped>
.mySet-enter-active,.mySet-leave-active{
    transition:all 1s;
}
.mySet-enter,.mySet-leave-to{
    opacity:0;
}
.mySetone-enter-active,.mySetone-leave-active{
    transition:all 1s;
}
.mySetone-enter,.mySetone-leave-to{
    opacity:0;
}
.mySettwo-enter-active,.mySettwo-leave-active{
    transition:all 1s;
}
.mySettwo-enter,.mySettwo-leave-to{
    opacity:0;
}
    .generateWrap{
        background: white;
        height:100vh;
        width:100%;
        position:fixed;
        top:0;
        left:0;
        z-index:1001;
        .generateTitle{
            width:100%;
            padding-top:22.78vw;
            box-sizing: border-box;
            height:68.89vw;
            font-size:7.22vw;
            color:#252525;
            text-align: center;
        }
        .imgWrap{
            position:relative;
            .oneImages{
                position: absolute;
                top:0;
                left:0;
                z-index: 2;
                height:40vw;
                width:100%;
                overflow: hidden;
                .oneUl{
                    height:40vw;
                    width:100%;
                    display:flex;
                    overflow: hidden;
                    li{
                        width:25vw;
                        margin-bottom:4.53vw;
                        margin-left:6vw;
                        .oneImg{
                            width:25vw;
                            height:25.28vw;
                            overflow: hidden;
                            border-radius: 1vw;
                            position:relative;
                            img{
                                width:100%;
                                height:100%;
                                position: absolute;
                                top:0;
                                right:0;
                                bottom:0;
                                left:0;
                                margin:auto;
                            }
                        }
                        .oneTitle{
                            width:100%;
                            text-align: center;
                            margin-top:3.15vw;
                            font-size:4.17vw;
                            color:#313131;
                        }
                        .selectLabel{
                            position:absolute;
                            top:2vw;
                            right:1vw;
                            span{
                                width:5.83vw;
                                height:5.83vw;
                                border-radius: 50%;
                                display:inline-block;
                            }
                            span:nth-child(1) {
                            i{
                                width:5.1vw;
                                height:5.1vw;
                                display:inline-block;
                                border:0.5vw solid white;
                                border-radius: 50%;
                                background:rgba(0,0,0,.2);
                            }
                            }
                            span:nth-child(2) {
                                background-color:rgb(254, 41, 66);
                                .activityNotice{
                                    display:inline-block;
                                    color:white;
                                    font-size:3vw;
                                    border-radius: 50%;
                                    width:100%;
                                    height:100%;
                                    line-height: 6.5vw;
                                    text-align: center;
                                }
                            }
                        }
                    }
                }
            }
           .twoImages{
                position: absolute;
                top:0;
                left:0;
                height:40vw;
                width:100%;
                overflow: hidden;
            .twoUl{
                height:40vw;
                width:100%;
                overflow: hidden;
                display:flex;
                li{
                    width:25vw;
                    margin-bottom:4.53vw;
                    position:relative;
                    margin-left:6vw;
                    .oneImg{
                        width:25vw;
                        height:25.28vw;
                        overflow: hidden;
                        border-radius: 1vw;
                        position:relative;
                        img{
                            width:100%;
                            height:100%;
                            position: absolute;
                            top:0;
                            right:0;
                            bottom:0;
                            left:0;
                            margin:auto;
                        }
                    }
                    .oneTitle{
                        width:100%;
                        text-align: center;
                        margin-top:3.15vw;
                        font-size:4.17vw;
                        color:#313131;
                    }
                    .selectLabel{
                        position:absolute;
                        top:2vw;
                        right:1vw;
                        span{
                            width:5.83vw;
                            height:5.83vw;
                            border-radius: 50%;
                            display:inline-block;
                        }
                        span:nth-child(1) {
                        i{
                            width:5.1vw;
                            height:5.1vw;
                            display:inline-block;
                            border:0.5vw solid white;
                            border-radius: 50%;
                            background:rgba(0,0,0,.2);
                        }
                        }
                        span:nth-child(2) {
                            background-color:rgb(254, 41, 66);
                            .activityNotice{
                                display:inline-block;
                                color:white;
                                font-size:3vw;
                                border-radius: 50%;
                                width:100%;
                                height:100%;
                                line-height: 6.5vw;
                                text-align: center;
                            }
                        }
                    }
                }
            }
           }
        }
    }
</style>

