<template>
    <div class="bubblePage">
        <div class="bubbleHead">
            <span class="bubbleTitle">精美头像挂件</span>
            <span class="bubbleDetail">每周上新精美挂件，炫出自我秀出个性</span>
            <span class="lookMore" @click="go.name('hanger')">更多></span>
        </div>
        <div class="bubbleContent">
            <div class="bubbleOne" v-for='(item, index) in first3' :key='index'>
                <div class="boxOne">
                    <div class="boxWrap" @click='goHanger(item)'>
                        <div class="imageWrap">
                            <avatar
                                class="avatar"
                                :item="user"
                                :canClick="false"
                                :size="2"
                                :hanger="item"
                                :showOwnHanger='false'
                            ></avatar>
                        </div>
                    </div> 
                    <span class="decorateName">{{item.name}}</span>
                </div>
            </div>
        </div>
        <div class="bubbleContent">
            <div class="bubbleOne" v-for='(item, index) in last3' :key='index'>
                <div class="boxOne">
                    <div class="boxWrap" @click='goHanger(item)'>
                        <div class="imageWrap">
                            <avatar
                                class="avatar"
                                :item="user"
                                :canClick="false"
                                :size="2"
                                :hanger="item"
                                :showOwnHanger='false'
                            ></avatar>
                        </div>
                    </div>
                    <span class="decorateName">{{item.name}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import headHanger from '@/assets/js/headHanger'
import avatar from '@/components/Avatar'
export default {
    components: {
        avatar
    },
    data () {
       return {
           headHanger: headHanger,
       }
    },
    computed: {
        ...mapState(['user']),
        first3 () {
            return this.headHanger && this.headHanger.美丽花环.slice(0, 3)
        },
        last3 () {
            return this.headHanger && this.headHanger.美丽花环.slice(3, 6)
        }
    },
    methods: {
        goHanger (item) {
            console.log(item)
            this.$router.push({
                name: 'hanger',
                params: {
                    curName: item.name
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
   .bubblePage{
     .bubbleHead{
        padding-top:5.46vw;
        box-sizing: border-box;
        position:relative;
        .bubbleTitle{
            display:inline-block;
            width:100%;
            text-align: center;
            font-size:4.35vw;
        }
        .bubbleDetail{
            display:inline-block;
            width:100%;
            text-align: center;
            font-size:3.42vw;
            color:#9f9f9f;
        }
        .lookMore{
            position:absolute;
            top:5.46vw;
            color:#9f9f9f;
            right:3.9vw;
        }
     }
     .bubbleContent{
         display:flex;
         flex-flow: row nowrap;
         padding:2vw 4vw 0vw 4vw;
         box-sizing: border-box;
         justify-content: space-between;
         margin-bottom:2vw;
         .boxOne{
            .decorateName{
                display: inline-block;
                max-width: 28vw;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
            .boxWrap{
                width:28vw;
                height:28vw;
                background:rgb(230, 230, 230);
                display:flex;
                align-items: center;
                justify-content: center;
                margin-bottom:1vw;
                .imageWrap{
                    width:17.4vw;
                    height:17.4vw;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position:relative;
                    .myAvatar{
                        position:absolute;
                        top:0;
                        left:0;
                        width:17.4vw;
                        height:17.4vw;
                        border-radius: 50%;
                        overflow: hidden;
                        img{
                           width:100%;
                           height:100%; 
                        }
                    }
                    .decorate{
                        position:absolute;
                        top:-4.5vw;
                        left:-5vw;
                        width:27vw;
                        height:27vw;
                    }
                }
            }
         }
     }
   }
</style>