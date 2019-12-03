<template>
  <div class="user-line--wrap">
      <div class="user-line--left">
        <avatar :item='item'></avatar>
        <span class="user-line--userName">{{item.nickName}}</span>
        <span class="user-line--userTag">{{item.userTag}}</span>
      </div>
      <div class="user-line--right" v-if='item.tags && item.tags.length'>
        <span class="tag-item" v-for='item in item.tags' :key='item'>{{itm}}</span>
      </div>
  </div>
</template>

<script>
import avatar from './avatar'
export default {
    components: {
        avatar
    },
    props: {
        item: {
            type: Object,
            default: function() {
                return {
                    avatar: '',
                    userName: '周润发',
                    userTag: '设计师',
                    tags: ['三室', '109平']
                }
            }
        }
    }
}
</script>

<style lang='less'>
.user-line--wrap{
    height: 7.2vw;
    line-height: 7.2vw;
    display: flex;
    align-items: center;
    .user-line--left{
        flex: 1;
        .user-line--userName{
            max-width: 40vw;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            font-size: 3.4vw;
            color: #333;
        }
    }
    .user-line--right{
        width: 30vw;
    }
}
</style>
