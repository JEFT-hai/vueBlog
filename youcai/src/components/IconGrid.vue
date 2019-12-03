<template>
<div class='IconGrid' v-show='show'>
<div class="item" :class='itemClasses' :style="itemStyles" v-for="(item, index) in list" :key="item.id" >
 <router-link :to="{'name':item.toUrl}">
<div class="item-icon" :class='item.icon' :style="[iconStyles, iconDiffer(index)]">
<img class="item-img" :style="imgStyles" v-if='item.imgUrl' :src="item.imgUrl" />
</div>
<p class="item-desc" :style="descStyles">
<span :style="descDiffer(index)">{{item.desc}}</span><br />
<span :style="[noteStyles, noteDiffer(index)]">{{item.note}}</span>
</p></router-link>
</div>
</div>
</template>
<script>
export default {
  name: 'IconGrid',
  props: {
    list: {
      type: Array,
      required: true
    },
    width: String,
    itemClasses: Array,
    icon: {
      type: Object,
      default: function () {
        return {}
      }
    },
    img: {
      type: Object,
      default: function () {
        return {}
      }
    },
    desc: {
      type: Object,
      default: function () {
        return {}
      }
    },
    note: {
      type: Object,
      default: function () {
        return {}
      }
    },
    iconBackground: {
      default: 'rgba(255,255,255,0)'
    },
    iconColor: {
      default: '#fff'
    },
    descColor: {
      default: '#6b6b6b'
    },
    noteColor: {
      default: '#9f9f9f'
    }
  },
  computed: {
    show () {
      return this.list.length
    },
    itemStyles () {
      return {
        width: this.width || '25%'
      }
    },
    iconStyles () {
      const width = '13.5vw'
      return {
        width: this.icon.width || width,
        height: this.icon.width || width,
        lineHeight: this.icon.width || width,
        fontSize: this.icon.fontSize || '0.45rem',
        marginTop: this.icon.marginTop || '0rem',
        borderRadius: this.icon.radius || '50%'
      }
    },
    imgStyles () {
      return {
        borderRadius: this.img.radius || '0px'
      }
    },
    descStyles () {
      return {
        fontSize: this.desc.fontSize || '0.2533rem',
        padding: this.desc.padding || '0.15rem'
      }
    },
    noteStyles () {
      return {
        fontSize: this.note.fontSize || '0.2133rem',
        lineHeight: this.note.lineHeight || '0.4rem'
      }
    }
  },
  methods: {
    iconDiffer (index) {
      return {
        background: (typeof this.iconBackground === 'string') ? this.iconBackground : this.iconBackground[index],
        color: (typeof this.iconColor === 'string') ? this.iconColor : this.iconColor[index]
      }
    },
    descDiffer (index) {
      return {
        color: (typeof this.descColor === 'string') ? this.descColor : this.descColor[index]
      }
    },
    noteDiffer (index) {
      return {
        color: (typeof this.noteColor === 'string') ? this.noteColor : this.noteColor[index]
      }
    },
    click (index) {
      this.$emit('click', index)
    }
  }
}
</script>

<style lang="less" scoped="scoped">
.IconGrid {
display: flex;
flex-wrap: wrap;
justify-content: space-between;
.item {
.item-icon {
margin: 0 auto;
box-sizing: border-box;
.item-img {
position: relative;
left: 50%;
transform: translateX(-50%);
-ms-transform: translateX(-50%);
-moz-transform: translateX(-50%);
-webkit-transform: translateX(-50%);
-o-transform: translateX(-50%);
height: 100%;
box-sizing: border-box;
}
}
.item-desc {
text-align: center;
}
}
}
</style>
