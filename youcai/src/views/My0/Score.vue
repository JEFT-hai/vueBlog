<template>
  <div class="MemberScorePage">
    <div class="scoreHead"></div>
    <div class="scoreDetail">
      <div class="exchangeWrap">
        <span class="exchange">兑换/赠送VIP</span>
      </div>
      <div class="detailOne">
        <div class="avatarWrap">
          <avatar :item='user' :size='18'></avatar>
        </div>
        <div class="userMessage">
          <div class="messageOne">
            <span :class="['userName', {redTxt: user.vipLevel}]">{{user.nickName}}</span>
            <span class="memberCard"><i :class="['vipIcon', {notVip: !user.vipLevel}]"></i><i v-if='!user.vipLevel' class="flag">未开通</i></span>
          </div>
          <div class="messageTwo">开通VIP享受特权</div>
          <div class="messageThree">管理></div>
        </div>
      </div>
      <div class="detailTwo">
          <div class="process">
            <div class="processOne">
              <span class="boxOne">VIP0</span>
              <span class="boxTitle">0</span>
            </div>
            <div class="processTwo">
              <span class="boxTwo"><i></i></span>
              <span class="boxTitle">+0点/天</span>
            </div>
            <div class="processOne">
              <span class="boxOne">VIP1</span>
              <span class="boxTitle">600</span>
            </div>
          </div>
          <span class="goBuy">开通</span>
      </div>
    </div>
    <div class="rightDetail">
      <MemberRight></MemberRight>
    </div>
    <div class="memberFunction">
      <div class="catting"></div>
      <!-- <Bubble></Bubble> -->
      <!-- <div class="catting"></div> -->
      <Decorate></Decorate>
      <!-- <div class="catting"></div> -->
      <!-- <FontEffects></FontEffects> -->
    </div>
  </div>
</template>

<script>
import MemberRight from '@/components/Member/MemberRight'
import Decorate from '@/components/Member/AvatarDecorate'
import avatar from '@/components/Avatar'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      isLoad: true, // 是否正在加载
      isFail: false // 是否加载失败
    }
  },
  computed: {
    ...mapState(['user'])
  },
  components: {
    MemberRight,
    Decorate,
    avatar
  }
}
</script>

<style lang="less" scoped>
    .MemberScorePage{
        width:100%;
        height:100%;
        position:relative;
        .scoreHead{
          width:100vw;
          height:31.29vw;
          background:rgb(47, 11, 18);
          background:url('../../assets/images/change3.jpg') no-repeat;
          background-size: cover;
        }
        .scoreDetail{
          position:absolute;
          top:4.7vw;
          left:0;
          right:0;
          margin:0 auto;
          width:91.67vw;
          height:49vw;
          background:url('../../assets/images/change2.jpg') no-repeat;
          background-size: cover;
          border-radius: 2vw;
          .exchangeWrap{
            display:flex;
            justify-content: flex-end;
            padding:1vw 0vw;
            box-sizing: border-box;
            .exchange{
              width:25.62vw;
              height:6.76vw;
              background:rgb(218, 54, 75);
              color:white;
              line-height:6.76vw;
              text-align: center;
              font-size:3.4vw;
              border-radius: 1vw;
            }
          }
          .detailOne{
            padding:0 5.56vw;
            box-sizing: border-box;
            display:flex;
            flex-flow: row nowrap;
            .avatarWrap{
              width:18.51vw;
              height:18.51vw;
              border-radius: 50%;
              overflow: hidden;
              margin-right:2vw;
              img{
                width:100%;
                height:100%;
                object-fit: cover;
              }
            }
            .userMessage{
              font-size:0;
              .messageOne{
                font-size:0;
                .userName{
                  font-size:4.5vw;
                  color:white;
                  margin-right:2vw;
                  &.redTxt{
                    color: var(--mRed);
                  }
                }
                .memberCard{
                  height:7vw;
                  display:inline-block;
                  line-height:7vw;
                  // .vipIcon{
                  //     display: inline-block;
                  //     width: 8vw;
                  //     height: 100%;
                  //     color:rgb(140, 139, 139);
                  //     font-size:12vw;
                  //     background: url(../../assets/images/vipPrivilege/vipIcon.png) 0 0 no-repeat;
                  //     background-size: 100%;
                  //     &.notVip{
                  //       -webkit-filter:grayscale(1);
                  //       filter:grayscale(1);
                  //     }
                  // }
                  .flag{
                    display:inline-block;
                    width:12.18vw;
                    border-radius: 1vw;
                    height:4vw;
                    font-size:3vw;
                    background:rgb(96, 103, 93);
                    color:white;
                    font-style:normal;
                    text-align:center;
                    line-height:4vw;
                    z-index:2;
                  }
                }
              }
              .messageTwo{
                font-size:3.5vw;
                color:white;
              }
              .messageThree{
                font-size:4vw;
                color:white;
              }
            }
         }
         .detailTwo{
           margin-top:3vw;
           display:flex;
           flex-flow: row nowrap;
           align-items: center;
           padding-left:4.62vw;
           .process{
             width:60vw;
             display:flex;
             flex-flow: row nowrap;
             .processOne{
               width:9vw;
               font-size:0;
               .boxOne{
                 width:9vw;
                 font-size:3.5vw;
                 height:4.72vw;
                 text-align: center;
                 display:inline-block;
                 background:rgb(93, 22, 25);
                 color:rgb(247, 209, 157);
               }
               .boxTitle{
                 font-size:4vw;
                 display:inline-block;
                 width:100%;
                 text-align: center;
                 color:rgb(247, 209, 157);
               }
             }
             .processTwo{
               width:42.22vw;
               .boxTwo{
                 width:42.22vw;
                 height:4.72vw;
                 display:flex;
                 align-items: center;
                 i{
                   height:2vw;
                   background:rgb(93, 22, 25);
                   display:inline-block;
                   width:100%;
                 }
               }
               .boxTitle{
                 font-size:4vw;
                 display:inline-block;
                 width:100%;
                 text-align: center;
                 color:rgb(247, 209, 157);
               }
             }
           }
           .goBuy{
             margin-left:4vw;
             display:inline-block;
             width:16.2vw;
             height:8.5vw;
             background: rgb(247, 209, 153);
             border-radius: 4vw;
             text-align: center;
             line-height:8.5vw;
             color:rgb(147, 109, 57);
             font-size:3.88vw;
           }
         }
        }
        .rightDetail{
          width:100vw;
          height:79.27vw;
          padding-top:22.53vw;
          box-sizing:border-box;
        }
        .memberFunction{
          .catting{
            height:2.4vw;
            background:#ededed;
          }
        }
    }
</style>
