<template>
  <li class='showItemWrap'>
    <div @click='goItem'>
      <div class="cover">
        <img :src="item.activityImg" />
        <div v-if='isEnd'
             class="coverMask">
          <span class="iconWanwan iconWyijieshu"></span>
        </div>
      </div>
      <div class="infoList borderB">
        <h3 class="textO">{{item.title}}</h3>
        <div class="aLine">
          <div class="address lineLeft textO">
            <i class="iconWposition iconWanwan"></i>
            <p>{{item.street}}</p>
          </div>
        </div>
        <div class="aLine">
          <div class="time lineLeft textO">
            <i class="iconWshijian1-copy iconWanwan"></i>
            <p>{{format.formatWeek(item.beginTime, item.endTime)}}</p>
          </div>
        </div>
        <div class="shopName"
             @click.stop="goHome">
          <div class="shopImg">
            <img :src="item.businessImg"
                 alt="">
          </div>
          <span class="name">{{item.businessName}}</span>
          <span class="distance"
                v-if="calculateDistance">{{calculateDistance}}km</span>
        </div>
      </div>
    </div>
  </li>
</template>
<script>
import {mapState} from 'vuex'
export default {
  data () {
    return {
      businessUser: this.isBusinessUser ? 1 : 0 // 1表示是商家，0 表示普通用户
    }
  },
  props: {
    isBusinessUser: { // 表示是否商家
      type: Boolean,
    },
    item: {
      type: Object,
      default: null
    },
    isMyCreate: {
        type: Number,
        default: 2
    },
    isAttentionId: { // 表示是关注页
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(['user']),
    isEnd () {
      return this.format.getDate(this.item.endTime) < new Date()
    },
    /**
     * calculateDistance计算距离
    */
    calculateDistance () {
       if (this.item && this.item.distance) {
         let current = this.item.distance / 1000
         return this.toDecimal2(current)
       } else {
           return 0
       }
    }
  },
  methods: {
    goItem () {
      this.$router.push({name: 'discount_info', params: { id: this.item.businessActivityId }})
    },
    goHome () {
      this.$router.push({name: 'business_home', params: {businessId: this.item.userBusinessId}})
    },
    goActivity (itm) {
      this.$router.push({name: 'activityTag', params: { id: itm}})
    },
    /**
     * toDecimal2保留两位小数
     */
    toDecimal2(x) {
        var f = parseFloat(x) 
        if (isNaN(f)) { 
            return false
        } 
        f = Math.round(x * 100) / 100 
        var s = f.toString()
        var rs = s.indexOf('.')
        if (rs < 0) { 
            rs = s.length 
            s += '.'
        } 
        while (s.length <= rs + 2) { 
            s += '0'
        } 
        return s
    }
  },
  
}
</script>
<style lang="less">
    .showItemWrap{
        &:first-child{
            padding-top: 2vw;
        }
        margin:0 2vw 2vw;
        background: var(--mBg);
        box-shadow: 0 3px 4px #efefef;
        .cover{
        position: relative;
        height: 46vw;
        width: 100%;
        border-radius: 1.11vw 1.11vw 0 0;
        overflow: hidden;
        img{
            // height: 100%;
            width: 100%;
        }
        .coverMask{
            position: absolute;
            z-index:1;
            top:0;
            left:0;
            right:0;
            bottom:0;
            line-height: 44.81vw;
            background: rgba(61, 49, 49, 0.5);
            text-align: center;
            span{
                color:#eee;
                font-size: 24vw;
            }
        }
        }
        .infoList{
            padding:1.48vw 5.55vw 1.48vw 2.8vw;
            background: #fff;
            color: var(--lGray);
            border-radius: 0 0 1.11vw 1.11vw;
        &::after{
            left:2.8vw !important;
            right: 5.55vw !important;
        }
        h3{
            color: var(--dGray);
            height: 9.26vw;
            line-height: 9.26vw;
            font-size: var(--title);
        }
        .aLine{
            display: flex;
            height: 5.55vw;
            line-height:5.55vw;
            i{
                width: 4.2vw;
                text-align: left;
                font-size: 2.78vw;
            }
            p{
                flex:1;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                font-size: var(--nText);
            }
            .lineLeft{
                flex: 1;
                display: flex;
            }
            .distance{
                width: 15vw;
                text-align: right;
            }
        }
        }
        .tagList{
          padding:0 5.55vw 0 2.8vw;
          font-size: 0;
          background: #fff;
          border-radius:0 0 1.11vw 1.11vw;
          li{
            display: inline-block;
            font-size: var(--nText);
            height: 8.15vw;
            line-height: 8.15vw;
            width: 15vw;
            text-align: center;
            margin: 2.6vw 2.6vw 3.33vw 0;
            border: 1px solid #e7e7e7;
            border-radius: 0.926vw;
            color:  var(--mGray);
            background:#fff;
            padding: 0;
            overflow: hidden;
            a{
              color: var(--mGray);
            }
          }
        }
        .shopName{
            height:14.44vw;
            display:flex;
            align-items: center;
            position:relative;
            .shopImg{
                width:9.26vw;
                height:9.26vw;
                border-radius:50%;
                overflow: hidden;
                box-shadow: 0px 0px 1px #eee;
                margin-right:3vw;
                img{
                  width:100%;
                  height:100%;
                }
            }
            .name{
              font-size:5.46vw;
              color:#494949;
            }
            .distance{
                position: absolute;
                top:0;
                right:0;
                font-size:4vw;
                color:#999999;
                line-height:14.44vw;
            }
        }
    }
</style>
