<template>
  <li class='activeItem'>
    <div @click='goItem'>
      <div class="cover">
        <img :src="item.activityImg" />
        <div v-if='isEnd'
             class="coverMask">
          <span class="iconWanwan iconWyijieshu"></span>
        </div>
        <div v-if='item.activityType === 1'
             class="voteTag">投票</div>
      </div>
      <div class="infoList borderB">
        <h3 class="textO">{{item.title}}</h3>
        <div class="aLine">
          <div class="address lineLeft textO">
            <i class="iconWposition iconWanwan"></i>
            <p>{{item.address}}</p>
          </div>
          <!-- <div class="distance textO" v-show="item.distance">
                        <p>{{item.distance}}</p>
                    </div> -->
        </div>
        <div class="aLine">
          <div class="time lineLeft textO">
            <i class="iconWshijian1-copy iconWanwan"></i>
            <p>{{format.formatWeek(item.beginTime, item.endTime)}}</p>
          </div>
          <div class="money textO"
               v-if="item.activityType == 0">
            <p v-if="item.fee">{{item.fee}}元</p>
            <p v-else>免费</p>
          </div>
        </div>
      </div>
    </div>
  </li>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: null
    },
    isMyCreate: {
        type: Number,
        default: 2
    }
  },
  computed: {
    isEnd () {
      return this.format.getDate(this.item.endTime) < new Date()
    }
  },
  methods: {
    goItem () {
      if (this.item.activityType === 0) {
        this.$router.push({name: 'activityInfo', params: { id: this.item.activityId, type: this.isMyCreate,}})
      } else if (this.item.activityType === 1) {
        this.$router.push({name:'voteList', params: { id: this.item.activityId }})
      }
    // 去到投票页
    //  this.$router.push({name:'vote',params: { id: this.item.activityId }})
     console.log('我是投票页哇')
    },
    goActivity (itm) {
       this.$router.push({name: 'activityTag', params: { id: itm}})
    }
  }
}
</script>
<style lang="less">
    .activeItem{
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
            min-height: 100%;
            width: 100%;
            object-fit: cover;
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
        .voteTag {
            position: absolute;
            z-index:10;
            top:0;
            right: 6vw;
            width: 12vw;
            height: 9vw;
            font-size: 3.6vw;
            color: #eee;
            background: rgba(255, 39, 66, 0.65);
            line-height: 9vw;
            text-align: center;
            border-radius: 0 0 2vw 2vw;
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
            .money{
                font-weight: bold;
                color:rgb(255, 39, 66);
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
    }
</style>
