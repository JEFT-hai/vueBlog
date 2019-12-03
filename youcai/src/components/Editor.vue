<template>
    <div id='editor' class="content">
      
    </div>
</template>
<style scoped>
</style>
<script>
import E from 'wangeditor'
export default {
  data () {
    return {
      content: '请输入文章内容'
    }
  },
  mounted () {
    var editor = new E('#editor')
    // 或者 var editor = new E( document.getElementById('editor') )
    editor.create()
  },
  methods: {
    updateData (e = '') {
      this.content = e
      console.info(e)
    }
  }
}
</script>
