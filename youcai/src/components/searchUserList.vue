<template>
    <ul class="userList">
        <li class=" borderB" v-for="(item,index) in items" :key="index">
            <div class="searchWrap">
                <div class="searchAvator" @click="gotoItem(item.Id)">
                    <img :src="item.Avatar === null ? userAvatar: 'http://static.szwanwan.com' + item.Avatar" alt="">
                </div>
                <div class="userDes" @click="gotoItem(item.Id)">
                    <div class="userName">{{item.NickName}}</div>
                    <div class="userIdNumber">多录号&nbsp;:&nbsp;{{item.Name}}</div>
                    <div class="userMessage">
                        <span>粉丝&nbsp;:&nbsp;{{item.FollowingCount}}</span>
                    </div>
                </div>
                <div class="followOther">
                    <BtnFollow class="postItem-btn postItem-btn-follow" :UserId="item.Id" />
                </div>
            </div>
        </li>
    </ul>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    props: {
        items: {
            type: Array,
            default: []
        }
    },
    computed: {
        ...mapGetters(['userAvatar'])
    },
    methods: {
        gotoItem (Id) {
            this.$router.push({ name: 'discoverUser', params: { Name: Id } })
        }
    }
}
</script>
<style lang="less">
    
</style>
