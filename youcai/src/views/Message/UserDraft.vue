<template>
    <div class="myDraft">
      <!-- <div
        class="backDireftHome iconWfanhui iconWanwan activityNotice"
        @click.self="goBack()"
      ></div> -->
      <DraftItem ref='DraftItem' v-for='(item, index) in draftsList' :key='index' :index='index' :item='item' @deleteDraftItem='deleteDraftItem' @resetOther='resetOther' @click.native='goActivePost(index)'></DraftItem>
      <NotFound v-show='draftsList.length' :failTitle="failTitle"></NotFound>
      <model v-if="modelShow" @modelCallBack='modelCallBack' :msg='modelMsg'></model>
      <!-- <p class="postList">动态帖子</p> -->
    </div>
</template>

<script>
import DraftItem from '@/components/draftItem'
import NotFound from '../../components/requestState/NotFound'
import { mapState, mapMutations } from 'vuex'
import model from '@/components/model/model'
export default {
  data () {
    return {
      failTitle: '还没有草稿哦!',
      draftsList: [],
      deleteIndex: 0,
      modelShow: false,
      modelMsg: {
        info: '确认删除？',
        title: '草稿删除后不可恢复',
        L: '取消',
        R: '确定'
      },
      router: ''
    }
  },
  components: {
    NotFound,
    DraftItem,
    model
  },
  computed: {
    ...mapState({
      'draftsIndex': 'draftsIndex'
    })
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.router = from.name
    })
  },
  created () {
    this.draftsList = JSON.parse(localStorage.getItem('activeDrafts')) || []
    this.setClick(false) 
  },
  methods: {
    ...mapMutations({
      'upDraftsIndex': 'upDraftsIndex',
      'setClick': 'setClick'
    }),
    goBack () {
      let me = this
      if (this.router) {
        this.$router.replace({
          name: me.router
        })
      }
    },
    goActivePost (index) {
      this.upDraftsIndex(index)
      let me = this
      if (this.router) {
        this.$router.replace({
          name: me.router
        })
      } else {
        this.$router.replace({
          name: 'activityPost'
        })
      }
    },
    resetOther (index) {
      for (let i = 0; i < this.draftsList.length; i++) {
        if (i !== index) {
          this.$refs.DraftItem[i].disX = 0
          this.$refs.DraftItem[i].$refs.draftMain.style.transform = ''
        }
      }
    },
    deleteDraftItem (index) {
      this.deleteIndex = index
      this.modelShow = true
    },
    modelCallBack (data) {
      if (data) {
        this.draftsList.splice(this.deleteIndex, 1)
        localStorage.setItem('activeDrafts', JSON.stringify(this.draftsList))
      }
      this.modelShow = false
    }
  }
}
</script>
<style lang="less" scoped>
  .myDraft{
    overflow: hidden;
    // border:1px solid blue;
  }
  .backDireftHome {
    position: fixed;
    height: 13.34vw;
    line-height: 13.34vw;
    width: 13.87vw;
    text-align: center;
    left: 0;
    top: 0;
    font-size: 4.4vw;
    background: #fff;
    color: var(--dGray);
    z-index: 300;
  }
</style>
