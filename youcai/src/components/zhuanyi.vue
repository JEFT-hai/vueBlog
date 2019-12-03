<template>
    <span v-html="itemContent">
    </span>
</template>
<script>
export default {
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  computed: {
    itemContent () {
      if (!this.content) {
        return ''
      }
      let content = this.content.replace(/<[\s\S]*?>/g, '')
      return this.Utility.htmlEncode(content).replace(/\r?\n/g, '<br />').replace(/\n/g, '<br />').replace(/\r/g, '<br />')
    }
  }
}
</script>
