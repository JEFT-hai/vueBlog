<template>
  <div class="groupNameWrap">
    <div class="head">
      <span class="back"
            @click="back">
        <i class="iconWfanhui iconWanwan activityNotice"></i>
      </span>
      <span class="title">群昵称</span>
      <span class="save"
            :class="{special: (name && name.length) && name !== groupName}"
            @click="setName">保存</span>
      <!-- <span class="save special"  @click="setName">保存</span> -->
    </div>
    <div class="groupNameMain borderB">
      <input type="text"
             placeholder="请输入群昵称, 控制在10 个字以内"
             v-model="name"
             maxlength="10">
      <span v-if="name"
            @click="clear"><i class="iconWanwan iconWquxiao-copy-copy activityNotice"></i></span>
    </div>
    <p>在这里可以设置你在这个群里的昵称, 这个昵称只会在此群显示</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
        groupId: this.$route.params.id,
        name: this.groupName,
        isOne: true, // 表示是否是第一次
    }
  },
  props: ['groupName'],
  methods: {
    clear () {
      this.name = ''
    },
    /**
     * setName设置群成员昵称
     */
    setName () {
      if (!this.name) {
        this.$toast('请输入你的群昵称',500)
        return
      }
      if (this.name === this.groupName) {
        return
      }
      let me = this
      me.api.process({
        url: 'GroupMemberSet',
        data: {
          groupId: me.groupId,
          nickName: me.name
        },
        success: function () {
          me.$toast('设置成功',500)
          me.$emit('goName', false, me.name)
        }
      })
    },
    back () {
      this.$emit('goName', false)
    },
  }
}
</script>

<style lang="less" scoped>
   .groupNameWrap{
       width:100%;
       height:100%;
       background:white;
       position:fixed;
       top:0;
       left:0;
       z-index:1000;
       .head{
           height:12vw;
           line-height:13vw;
           width:100%;
           display:flex;
           font-size:4.5vw;
           .back{
             margin-left:4vw;
             margin-right:4vw;
           }
           .title{
             width:63vw;
             display:inline-block;
           }
           .save {
               display:inline-block;
               margin-top:2vw;
               width:17.87vw;
               height:8.24vw;
               background:rgb(243, 243, 243);
               border-radius: 4vw;
               text-align: center;
               color:rgb(205, 205, 205);
               line-height:8.24vw;
           }
           .special{
               background:rgb(255, 39, 66);
               color:white;
           }
       }
       .groupNameMain{
           width:90%;
           margin:auto;
           height:15vw;
           position:relative;
           input{
               width:100%;
               height:100%;
               border:none;
               outline: none;
           }
           span{
               position:absolute;
               top:0;
               right:0;
               bottom:0;
               margin:auto 0;
               width:4.62vw;
               height:4.62vw;
               border-radius: 50%;
               background:#ccc;
               line-height:3.62vw;
               text-align: center;
               .activityNotice{
                   color:white;
                   font-size:3vw;
               }
           }
       }
       p{
           width:90%;
           margin:auto;
           margin-top:2vw;
           font-size:3.6vw;
           color:#a8a8a8;
       }
   } 
</style>
