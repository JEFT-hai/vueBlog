<template>
  <div class="broadcastPage">
    <v-tags v-show="hasMask && typeTagsMask"
            title="活动类型"
            :labels="broadcastType"
            :maxLength="1"
            @showLabel="getTypeTags"></v-tags>
    <pickerCityList :show='hasMask && pickerCityMask'
                    @hidePickerCity='setPickerCity(false)'
                    @pickerCity='getPickerCity'></pickerCityList>
    <ul class="activityBaseInfo LRForm">
      <li class="LRFormItem borderB"
          @click="setTypeTagsMask(true)">
        <span class="LFormItem">活动类型</span>
        <p class="FormItemContent">
          <span>{{chooseType}}</span>
        </p>
        <p class="RText">
          <span v-if="!chooseType">请选择</span>
          <i class="iconWxiayibu iconWanwan textR"></i>
        </p>
      </li>
      <li class="LRFormItem borderB"
          @click="setPickerCity(true)">
        <span class="LFormItem">选择城市</span>
        <p class="FormItemContent">
          <span>{{chooseCity}}</span>
        </p>
        <p class="RText">
          <span v-if="!chooseCity">请选择</span>
          <i class="iconWxiayibu iconWanwan textR"></i>
        </p>
      </li>
      <li class="LRFormItem searchItem borderB">
        <span class="LFormItem">搜素关键字</span>
        <p class="FormItemContent">
          <input class='searchInput'
                 type="text"
                 v-model="searchWord">
        </p>
        <p class="RText">
          <span @click="setSearch(true)">搜索</span>
        </p>
      </li>
    </ul>
    <searchResult :search='search'
                  :searchContent='searchWord'
                  :searchType='chooseNumber'
                  :city='chooseArea'
                  @searchDone='search=false'></searchResult>
  </div>
</template>
<script>
import {mapState, mapMutations} from 'vuex'

import VTags from '@/components/VTags'
import pickerCityList from '@/views/Activity/components/pickerCityList'
import searchResult from '@/components/Search/searchResult'
export default {
    components:{
      VTags,
      pickerCityList,
      searchResult
    },
    data () {
      return{
        broadcastType: [{
          title: '广播类别',
          tags: ['申请入群', '图文动态', '视频动态', '活动详情', '声音详情', '优惠详情', '答案', '用户详情', '群组详情', '话题详情']
        }],
        chooseType: '',
        chooseCity: '',
        searchWord: '',
        typeTagsMask: false,
        pickerCityMask: false,
        search: false
      }
    },
    watch:{
      hasMask (newV){
        !newV && (this.typeTagsMask = false, this.pickerCityMask = false)
      }
    },
    computed: {
      chooseNumber(){
        return this.broadcastType[0].tags.indexOf(this.chooseType) + 1
      },
      chooseArea(){
        return this.chooseCity !== '全部城市' ? this.chooseCity : ''
      }
    },
    beforeRouteLeave(to, from, next){
        console.log(to.name, this.path, to.name.indexOf('user', 'group', 'discoverItemOnly', 'video'))
        if([ 'discoverItemOnly', 'videoSwiper', 'activityInfo', 'discoverUser', 'topicItemss'].indexOf(to.name) >= 0){
          next(false)
        } else {
          next()
        }
    },
    methods: {
      ...mapState({
        hasMask: 'hasMask'
      }),
      ...mapMutations({
        setMask: 'setMask'
      }),
      setTypeTagsMask(data){
        this.typeTagsMask = data
        this.setMask(data)
      },
      setPickerCity(data){
        this.pickerCityMask = data
        this.setMask(data)
      },
      getTypeTags(data){
        this.setTypeTagsMask(false)
        this.chooseType = data && data[0]
      },
      getPickerCity(data){
        this.setPickerCity(false)
        this.chooseCity = `${data}市`
      },
      setSearch(data){
        if (data && this.test()) {
          this.search = data
        } else {
          this.search = false
        }
      },
      test(){
        if (!this.chooseType){
          this.$toast('请选择活动类型')
          return false
        }
        if (!this.chooseCity){
          this.$toast('请选择活动城市')
          return false
        }
        if (!this.searchWord || this.searchWord.trim() === ''){
          this.$toast('请输入搜索关键字')
          return false
        }
        return true
      }
    }
}
</script>
<style lang="less" scoped>
  .broadcastPage{
    .searchItem{
      .FormItemContent{
        margin-right: 2vw;
        .searchInput{
          width: 100%;
          height: 75%;
          border: none;
          padding: 0 2vw;
          color: #000;
          outline: none;
          font-size: 4vw;
          background-color: #efefef;
        }
      }
    }
    
  }
</style>
