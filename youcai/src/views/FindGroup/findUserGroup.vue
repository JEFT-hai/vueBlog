<template>
  <div class="userGroupWrap">
    <span class="add">添加</span>
    <div class="userFindHead">
      <span :class="{special:changeColor === 1}"
            @click="change(1)">找人</span>
      <span :class="{special:changeColor === 2}"
            @click="change(2)">找群</span>
        <span class="btnLikeList" @click="goRankList">点赞排行榜</span>
    </div>
    <div class="findMain">
      <div class="findUser">
        <SearchUser :userWord="userWord"
                    v-if="changeColor === 1"></SearchUser>
      </div>
      <div class="findGroup">
        <SearchGroup v-if="changeColor === 2"></SearchGroup>
      </div>
    </div>
  </div>
</template>

<script>
import GroupList from '@/components/RecommendFollow/GroupList'
import SearchUser from './Components/SearchUser'
import SearchGroup from './Components/SearchGroup'
import {mapMutations} from 'vuex'
export default {
  data () {
    return {
      changeColor: this.$store.state.userGroupIndex, // 1表示找人，2表示找群
      interestIndex: 1,
      userWord: '', // 搜索用户关键字
      searchUserList: [] // 搜索出来的用户列表
    }
  },
  components: {
    GroupList,
    SearchUser,
    SearchGroup
  },
  methods: {
    ...mapMutations({
      'updateUserGroup': 'updateUserGroup'
    }),
    /**
     * change 改变搜索的状态
     */
    change (index) {
      this.updateUserGroup(index)
      this.changeColor = index
    },
    goRankList () {
      this.$router.push({
          name: 'rankList'
      })
    }
    
  }
}
</script>

<style lang="less" scoped>
.userGroupWrap{
    width:100%;
    height:100%;
    overflow: hidden;
    .add{
        display:inline-block;
        position:fixed;
        top:0;
        height:12vw;
        line-height:13.5vw;
        left:14vw;
        z-index:1000;
        // border:1px solid blue;
    }
    .userFindHead{
        width:100%;
        height:12.31vw;
        padding-left:4vw;
        box-sizing: border-box;
        position:relative;
        span{
            display:inline-block;
            height:14.31vw;
            width:15vw;
            line-height:12.31vw;
            color:#999;
            font-size:4.2vw;
            font-weight: bold;
        }
        .btnLikeList{
          position:absolute;
          top:1vw;
          right:2vw;
          color:#333;
          width:25vw;
        }
        .special{
            font-size:6.7vw;
            position:relative;
            margin-right:3vw;
            color:#333;
        }
        .special::after{
                content:'';
                width:3vw;
                height:1.5vw;
                border-radius: 2vw;
                background-color:#333;
                position:absolute;
                left:0;
                bottom:0vw;
                right:0;
                margin:0 auto;
            }
    }
    .findMain{
        width:100%;
        height:100%;
        .findUser{
            margin-top:4vw;
            position:relative;
            left:0;
            top:0;
            .findInput{
                    width:91.85vw;
                    margin:auto;
                    height:10.37vw;
                    border-radius: 5vw;
                    background-color:#f3f3f3;
                    .search{
                        display:inline-block;
                        width:15vw;
                        height:100%;
                        line-height:10.37vw;
                        text-align: center;
                        .activityNotice{
                            color:#cdcdcd;
                            font-size:5vw;
                        }
                    }
                    input{
                        width:70vw;
                        background-color:#f3f3f3;
                        border:none;
                        outline: none;
                        color:#999;
                        font-size:4.5vw;
                    }
                    input::-webkit-input-placeholder {
                    /* placeholder颜色  */
                    color: #cdcdcd;
                    }
            }
            .myUser{
                border:1px solid blue;
            }
        }
        
    }
}
</style>
