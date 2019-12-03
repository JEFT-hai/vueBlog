import treasureBox from './treasureBox.vue'
let $treasureBox
var vueTreasureBox = {
  install(Vue) {
    const Treasure = Vue.extend(treasureBox)
    if (!$treasureBox) {
      $treasureBox = new Treasure({
        el: document.createElement('div')
      })
      document.body.appendChild($treasureBox.$el)
    }
    Vue.prototype.$treasureBox = function (options) {
      $treasureBox.showBox(options)
      return $treasureBox.confirm()
    }
  }
}

export default vueTreasureBox

if (typeof window !== 'undefined' && !window.vueTreasureBox) {
  window.vueTreasureBox = vueTreasureBox
}
