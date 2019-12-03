<template>
  <div class="myDraft">
    <div class="headDraft">
      <span class="back"
            @click="goBack">
        <i class="iconWfanhui iconWanwan activityNotice"></i>
      </span>
      <span class="headTitle">我的草稿</span>
    </div>
    <div class="nodata"
         v-if="noData">
      <NotFound :failTitle="failTitle"></NotFound>
    </div>
    <p class="title"
       v-if="draftsList.length">活动草稿</p>
    <DraftItem ref='DraftItem'
               v-for='(item, index) in draftsList'
               :key='index'
               :index='index'
               :item='item'
               @deleteDraftItem='deleteDraftItem'
               @resetOther='resetOther'
               @click.native='goActivePost(index)'></DraftItem>
    <p class="title"
       v-if="draftsPost.length">帖子草稿</p>
    <DraftItem ref='DraftItem'
               v-for='(item, index) in draftsPost'
               :key='index'
               :index='index'
               :item='item'
               @deleteDraftItem='deletePostItem'
               @resetOther='resetOther'
               @click.native='goPost(index)'
               :isPost="isPost"></DraftItem>

    <model v-if="modelShow"
           @modelCallBack='modelCallBack'
           :msg='modelMsg'></model>

  </div>
</template>

<script>
import DraftItem from '@/components/draftItem'
import NotFound from '@/components/requestState/NotFound'
import { mapMutations } from 'vuex'
import model from '@/components/model/model'
export default {
  data () {
    return {
      failTitle: '还没有草稿哦!',
      draftsList: [],
      draftsPost: [], // 表示动态的草稿
      deleteIndex: '',
      modelShow: false,
      isPost: true,
      modelMsg: {
        info: '确认删除？',
        title: '草稿删除后不可恢复',
        L: '取消',
        R: '确定'
      }
    }
  },
  components: {
    NotFound,
    DraftItem,
    model
  },
  created () {
    this.draftsList = JSON.parse(localStorage.getItem('activeDrafts')) || []
    this.setClick(false)
    this.draftsPost = JSON.parse(localStorage.getItem('postDraftList')) || []
  },
  computed: {
    noData () {
      console.log(this.draftsList.length, '这个的长度是', this.draftsPost.length)
      return !this.draftsList.length && !this.draftsPost.length
    }
  },
  methods: {
    ...mapMutations({
      'upDraftsIndex': 'upDraftsIndex',
      'setClick': 'setClick',
      'updateDraftState': 'updateDraftState'
    }),
    goBack () {
      this.$router.replace({name:'my'})
    },
    goActivePost (index) {
      this.upDraftsIndex(index)
      this.$router.push({
        name: 'activityPost'
      })
    },
    goPost (index) {
      console.log('index是', index)
      this.updateDraftState(index)
      console.log('这个状态是多少啊', this.$store.state.postDraftState)
      this.$router.push({
        name: 'postPost'
      })
    },
    resetOther (index) {
      for (let i = 0; i < this.draftsList.length; i++) {
        if (i !== index) {
          this.$refs.DraftItem[i].disX = 0
          this.$refs.DraftItem[i].$refs.draftMain.style.transform = ''
        }
      }
    },
    /**
     * deleteDraftItem删除活动草稿
     */
    deleteDraftItem (index) {
      this.deleteIndex = index
      this.modelShow = true
    },
    /**
     * deletePostItem删除帖子草稿
     */
    deletePostItem (index) {
      console.log('我是删除活动草稿呢', index)
      this.draftsPost.splice(index, 1)
      localStorage.setItem('postDraftList', JSON.stringify(this.draftsPost))
      this.$toast('删除成功', 1200)
    },
    modelCallBack (data) {
      console.log('删除', data)
      if (data && this.deleteIndex) {
        this.draftsList.splice(this.deleteIndex, 1)
        localStorage.setItem('activeDrafts', JSON.stringify(this.draftsList))
      }
      this.modelShow = false
    }
  }
}
</script>
<style lang="less">
  .myDraft{
    overflow: hidden;
    .headDraft{
      position:fixed;
      top:0;
      left:0;
      z-index:1000;
      height:13.34vw;
      width:100vw;
      background:white;
      .back{
        height: 13.34vw;
        line-height: 13.6vw;
        position: fixed;
        left: 7.5vw;
        top: 0;
        z-index: 1001;
        .activityNotice{
          font-size: 4.5vw;
          font-weight: bold;
        }
      }
      .headTitle{
        display:inline-block;
        width:100vw;
        height:13.34vw;
        line-height:13.34vw;
        font-size: 4.63vw;
        text-align: center;
        position: fixed;
        left:0;
        top:0;
        z-index:1000;
      }
    }
    .nodata{
      width:100%;
      height:80vw;
    }
    .title{
      width:100%;
      height:8vw;
      text-align: center;
      // line-height:6vw;
      padding-top:2vw;
      box-sizing: border-box;
    }
  }
</style>
