<template>
<transition name="mySet">
    <div class="industryWrap">
        <div class="maskIndustry" @click="cancel"></div>
        <ul>
            <li class="unique">选择你从事的行业</li>
            <li class="" v-for="(item,index) in myIndustry" :key="index" @click="handleSelect(item)">
                <span :class="[{blue:item.detail === '工' || item.detail === 'IT' },{yellow:item.detail === '金' || item.detail === '交' },{green:item.detail === '商' || item.detail === '正' },{plum:item.detail === '文' || item.detail === '艺' }]">{{item.detail}}</span>
                <span>{{item.title}}</span>
                <span>
                    <i v-show="item.id === selectId" class="iconWanwan iconWgou activityNotice"></i>
                </span>
            </li>
        </ul>
    </div>
</transition>
</template>

<script>
export default {
  data () {
    return {
      myIndustry:[
        {
            id:1,
            title:"信息技术",
            detail:"IT"
        },
        {
            id:2,
            title:"金融保险",
            detail:"金"
        },
        {
            id:3,
            title:"商业服务",
            detail:"商"
        },
        {
            id:4,
            title:"工程制造",
            detail:"工"
        },
        {
            id:5,
            title:"交通运输",
            detail:"交"
        },
        {
            id:6,
            title:"文化传媒",
            detail:"文"
        },
        {
            id:7,
            title:"娱乐体育",
            detail:"艺"
        },
        {
            id:8,
            title:"公共事业",
            detail:"正"
        },
        {
            id:9,
            title:"无"
        }
    ],
      myIndex: 1,
      selectId: 9
    }
  },
  methods: {
    cancel () {
      this.$emit('showIndustry')
    },
    handleSelect (item) {
      this.selectId = item.id
      this.$emit('showIndustry', item)
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
   .industryWrap{
       width:100%;
       height:100%;
       position:absolute;
       top:0;
       left:0;
       z-index:1001;
       .maskIndustry{
           width:100%;
           height:30%;
           background-color:rgba(0,0,0,.6);
       }
       ul{
           width:100%;
           height:70%;
           margin:auto;
           background-color:white;
           li{
               width:100%;
               height:9vw;
               margin-top:1vw;
               padding-left:4vw;
               box-sizing: border-box;
               display:flex;
               align-items: center;
               font-size:4vw;
               color:#787878;
               justify-content: space-between;
               span:nth-child(1){
                   display:inline-block;
                   width:6vw;
                   height:4vw;
                   color:white;
                   font-size:3vw;
                   border-radius: 3vw;
                   text-align: center;
                   line-height:4vw;
               }
               .blue{
                   background-color:#87bae8;
               }
               .yellow{
                   background-color:#f5b068;
               }
               .green{
                   background-color:#a3e038;
               }
               .plum{
                   background-color:#be86e4;
               }
               span:nth-child(2) {
                   margin-left:-20vw;
                   width:30vw;
               }
               span:nth-child(3) {
                   margin-right:8vw;
                   width:20vw;
                   height:100%;
                   text-align: center;
                   height:9vw;
               }
           }
           .unique{
               font-size:5vw;
               color:#0c0c0c;
           }
       }
   }
</style>
