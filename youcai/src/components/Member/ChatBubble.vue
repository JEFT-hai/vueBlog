<template>
    <div class="bubblePage">
        <div class="bubbleHead">
            <span class="bubbleTitle">精美个性气泡</span>
            <span class="bubbleDetail">每周更新,让聊天更好玩</span>
            <span class="lookMore">更多></span>
        </div>
        <div class="bubbleContent">
            <div class="bubbleOne">
                <div class="boxOne">
                    <div class="boxWrap">
                        <span class="oneImage iamge">么么哒</span>
                    </div>
                    <span>加油</span>
                </div>
            </div>
            <div class="bubbleOne">
                <div class="boxOne">
                    <div class="boxWrap">
                        <span class="twoImage iamge">么么哒</span>
                    </div>
                    <span>加油</span>
                </div>
            </div>
            <div class="bubbleOne">
                <div class="boxOne">
                    <div class="boxWrap">
                        <span class="threeImage iamge">么么哒</span>
                    </div>
                    <span>加油</span>
                </div>
            </div>
        </div>
        <div class="bubbleContent">
            <div class="bubbleOne">
                <div class="boxOne">
                    <div class="boxWrap">
                        <span class="oneImage iamge">么么哒</span>
                    </div>
                    <span>加油</span>
                </div>
            </div>
            <div class="bubbleOne">
                <div class="boxOne">
                    <div class="boxWrap">
                        <span class="twoImage iamge">么么哒</span>
                    </div>
                    <span>加油</span>
                </div>
            </div>
            <div class="bubbleOne">
                <div class="boxOne">
                    <div class="boxWrap">
                        <span class="threeImage iamge">么么哒</span>
                    </div>
                    <span>加油</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    
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
            .boxWrap{
                width:28vw;
                height:28vw;
                background:rgb(230, 230, 230);
                display:flex;
                align-items: center;
                justify-content: center;
                margin-bottom:1vw;
                .iamge{
                  width:21.11vw;
                  height:7.78vw;
                  color:white;
                  font-size:4.25vw;
                  text-align: center;
                  border-radius: 2vw;
                  display:inline-block;
                  background:pink;
                }
            }
         }
     }
   }
</style>