<template>
    <ul>
      <topicItem v-for="(topic,index) in topicAttentionList" :key="index" :topic='topic' :isAttention='isAttention'></topicItem>
    </ul>
</template>

<script>
import topicItem from './TopicItem'
export default {
  components: {
    topicItem
  },
  props:['topicAttentionList', 'isAttention'],
  methods: {
    // 方法
    gotoItem (item) {
      this.$router.push({ name: 'topicItemss', params: { id: item.topicId } })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
