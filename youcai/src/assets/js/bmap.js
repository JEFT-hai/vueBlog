export function loadingMap (key) {
  return new Promise(function (resolve, reject) {
    // 百度地图引入
    let bmapLoad = () => {
      window.BMap = window.BMap || {}
      let s = document.createElement('script')
      s.src = 'https://api.map.baidu.com/getscript?v=2.0&ak=' + key
      document.body.appendChild(s)
      s.onload = function () {
        resolve(window.BMap)
      }
    }
    bmapLoad()
  })
}
