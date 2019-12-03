
<script>
export default {
  data () {
    return {
      pickerItems: [],
      pickerTop: '',
      pickerLeft: '',
      pickerShow: false,
      curStr: '',
      curPickerItem: {},
      isPicker: {}
    }
  },
  methods: {
    showPicker (name, str, item, event) {
      if (this.scrollYNow >= -this.bannerH) {
        this.scrollTo(0, -this.bannerH - 1)
        this.toTop = true
        this.isPicker = {
          name: name,
          str: str,
          item: item,
          event: event
        }
        return
      }
      if (this.pickerShow && item === this.curPickerItem) {
        this.curPickerItem = {}
        this.setPicker(false)
        return
      }
      this.curStr = str
      this.curPickerItem = item
      this.pickerItems = this.activeConditions[name]
      this.setPicker(true)
      console.log(this.$refs.tabList)
      this.pickerTop = this.$refs.tabList.getBoundingClientRect().top + this.$refs.tabList.offsetHeight + 'px'
      let target = null
      if (event.target.nodeName.toLowerCase() !== 'li') {
        target = event.target.parentNode
      } else {
        target = event.target
      }
      this.pickerLeft = target.getBoundingClientRect().left + target.offsetWidth / 2 + 'px'
      // console.log(this.curPickerItem)
    },
    setPicker (data) {
      this.pickerShow = data
      this.setMask(data)
      !data && (this.pickerItems = []) && (this.curPickerItem = {})
    },
    picker (item) {
      this.curPickerItem = {}
      this[this.curStr] = item
      this.resetData()
      this.rebuildScroll()
      this.setPicker(false)
      // this.showFixed = false
    }
  }
}
</script>
