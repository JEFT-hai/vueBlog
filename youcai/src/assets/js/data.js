export default {
  feedback: {
    categorys: [
      { index: 0, value: '请选择' }
    ]
  },
  discover: {
    categorys: [
      { index: 0, value: '请选择' }
    ]
  },
  user: {
    genders: [
      {index: 0, value: '保密' },
      {index: 1, value: '男'},
      {index: 2, value: '女'}
    ]
  },
  GetValue (items, index, def) {
    let item = items.find(t => t.index === index)
    return item ? item.value : def
  },
  ToPicker (items) {
    let result = []
    items.forEach(item => {
      result.push({ value: item.index, label: item.value })
    })
    return result
  }
}
