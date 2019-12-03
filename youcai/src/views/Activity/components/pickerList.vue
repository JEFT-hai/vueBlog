<template>
  <transition name="fadeIn">
    <div v-show="show" class="pickerListMask" :style="{top:pickerTop}">
      <ul class="pickerList pickerBtnList" v-if='items.length >= 5'>
        <li @click="picker(item)" :class="pickerItem.value === item.value?'curPickerBtn pickerBtn':'pickerBtn'" v-for="(item,index) in items" :key="index">{{item.label}}</li>
      </ul>
      <ul class="pickerList pickerBarList" v-else>
        <li @click="picker(item)" :class="pickerItem.value === item.value?'curPickerBar pickerBar borderB':'pickerBar borderB'"  v-for="(item,index) in items" :key="index">
          <p>{{item.label}}</p>
          <i v-show="pickerItem.value === item.value" class="iconWfinish iconWanwan"></i>
        </li>
      </ul>
      <div class="pickerMaskTopArrow" :style="{left: pickerLeft}"></div>
      <div class="pickerMask" @click="hidePicker"></div>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array
    },
    pickerTop: {
      type: String,
      default: '0'
    },
    pickerLeft: {
      type: String,
      default: '0'
    },
    pickerItem: {
      type: Object,
      default: null
    }
  },
  methods: {
    pickerSlotHide () {
      this.$emit('pickerSlotHide')
    },
    hidePicker () {
      this.$emit('hidePicker')
    },
    picker (item) {
      this.$emit('picker', item)
    }
  }
}
</script>
<style lang='less'>
.pickerListMask{
  &.fadeIn-enter-active, &.fadeIn-leave-active{
    transition: opacity .2s ease-in-out;
  }
  &.fadeIn-leave-active{
    transition: opacity .05s ease-in-out;
  }
  &.fadeIn-enter, &.fadeIn-leave-to{
    opacity: 0;
  }
  position: fixed;
  left: 0;
  right:0;
  bottom: 0;
  z-index:100;
  .pickerBtnList{
    padding-top: 4.167vw;
  }
  .pickerList{
    position: relative;
    z-index: 1;
    width: 100%;
    background: #fff;
    font-size: 0;
    &::before{
      position:absolute;
      content:'';
      width:100vw;
      top: 0;
      left: 0;
      background: #e7e7e7;
      height:1px;
    }
    &::after{
      position:absolute;
      content:'';
      top: 0;
      left: 0;
      background: #e7e7e7;
      height:1px;
    }
    .pickerBtn{
      display: inline-block;
      box-sizing: border-box;
      font-size: var(--nText);
      color: var(--dGray);
      width: 19.5vw;
      height: 8vw;
      line-height: 8vw;
      text-align: center;
      border: 1px solid #e4e4e4;
      margin:0 0 4.4vw 4.4vw;
      border-radius: 0.7vw;
    }
    .curPickerBtn, .curPickerBar{
      border-color: var(--mRed);
      color: var(--mRed);
      p {
        color: var(--mRed);
      }
    }
    .pickerBar{
      display: flex;
      height: 11.67vw;
      line-height: 11.67vw;
      color: var(--dGray);
      font-size: var(--nText);
      padding:0 7vw 0 7.8vw;
      p{
        flex: 1;
      }
      i{
        width: 4.6vw;
        font-size: var(--nText);
        text-align: center;
      }
    }
  }
  .pickerMaskTopArrow{
    position: absolute;
    top: 0;
    height: 4vw;
    width: 5vw;
    margin-top: -3vw;
    margin-left: -2.8vw;
    z-index: 2;
    font-size: var(--title);
    color: #e7e7e7;
    &::before{
      position: absolute;
      content: '';
      width: 0;
      height:0;
      border: 1.8vw solid transparent;
      border-bottom-color: #e4e4e4;
      border-bottom-width: 1.2vw;
      top:0;
      left: 0;
    }
    &::after{
      position: absolute;
      content: '';
      width: 0;
      height:0;
      border: 1.8vw solid transparent;
      border-bottom-color: #fff;
      border-bottom-width: 1.2vw;
      top:1px;
      left: 0;
    }
  }
  .pickerMask{
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right:0;
    background: rgba(0, 0, 0, .6);
  }
}
</style>
