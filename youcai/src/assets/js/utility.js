
class ScrollOnMobileFixer {
  constructor (element) {
    let me = this
    this.element = element
    this.timeout = null
    this.ticking = false
    let es = ['touchmove', 'scroll', 'loaded']
    es.forEach((value, index) => {
      me.element.addEventListener(value, me.requestAnimationFrameFixScroll.bind(me), { passive: true })
    })
    this.fixScroll()
  }
  requestAnimationFrameFixScroll (e) {
    if (this.ticking) {
      return
    }
    this.ticking = true
    requestAnimationFrame(this.fixScroll.bind(this))
  }
  fixScroll (e) {
    let me = this
    me.ticking = false
    let element = this instanceof Element ? this : this.element
    if (!element) {
      return
    }
    if (element.scrollTop === 0) {
      element.scrollTop = 1
      return
    } else {
      console.log(element.firstElementChild)
      console.log(element.scrollTop)
    }
    if (element.firstElementChild && (element.clientHeight + element.scrollTop === element.firstElementChild.offsetHeight)) {
      element.scrollTop = element.firstElementChild.offsetHeight - element.clientHeight - 1
    }
  }
}

function fixScrollOnMobile (element) {
  if (!element || element.dataset.fixScroll) {
    return
  }
  element.dataset.fixScroll = true
  return new ScrollOnMobileFixer(element)
}

class MsgHelper {
  constructor () {
    this.loading = null
  }
  updateLoading (isLoading) {
    if (isLoading) {
      this.showLoading()
    } else {
      this.hideLoading()
    }
  }
  showLoading () {
    // eslint-disable-next-line
    this.loading = weui.loading('上传中')
  }
  hideLoading () {
    if (this.loading) {
      this.loading.hide()
    }
  }
  showError (msg) {
    this.showTopTips(msg)
  }
  showTopTips (msg) {
    // eslint-disable-next-line
    weui.topTips(msg, {
      duration: 1000
    })
  }
}

export default {
  fixScrollOnMobile,
  msg: new MsgHelper()
}
