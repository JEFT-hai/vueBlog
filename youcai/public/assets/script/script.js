let icons = {
  'images': [
    {
      'size': '20x20',
      'idiom': 'iphone',
      'filename': 'icon-20@2x.png',
      'scale': '2x'
    },
    {
      'size': '20x20',
      'idiom': 'iphone',
      'filename': 'icon-20@3x.png',
      'scale': '3x'
    },
    {
      'size': '29x29',
      'idiom': 'iphone',
      'filename': 'icon-29.png',
      'scale': '1x'
    },
    {
      'size': '29x29',
      'idiom': 'iphone',
      'filename': 'icon-29@2x.png',
      'scale': '2x'
    },
    {
      'size': '29x29',
      'idiom': 'iphone',
      'filename': 'icon-29@3x.png',
      'scale': '3x'
    },
    {
      'size': '40x40',
      'idiom': 'iphone',
      'filename': 'icon-40@2x.png',
      'scale': '2x'
    },
    {
      'size': '40x40',
      'idiom': 'iphone',
      'filename': 'icon-40@3x.png',
      'scale': '3x'
    },
    {
      'size': '57x57',
      'idiom': 'iphone',
      'filename': 'icon-57.png',
      'scale': '1x'
    },
    {
      'size': '57x57',
      'idiom': 'iphone',
      'filename': 'icon-57@2x.png',
      'scale': '2x'
    },
    {
      'size': '60x60',
      'idiom': 'iphone',
      'filename': 'icon-60@2x.png',
      'scale': '2x'
    },
    {
      'size': '60x60',
      'idiom': 'iphone',
      'filename': 'icon-60@3x.png',
      'scale': '3x'
    },
    {
      'size': '20x20',
      'idiom': 'ipad',
      'filename': 'icon-20-ipad.png',
      'scale': '1x'
    },
    {
      'size': '20x20',
      'idiom': 'ipad',
      'filename': 'icon-20@2x-ipad.png',
      'scale': '2x'
    },
    {
      'size': '29x29',
      'idiom': 'ipad',
      'filename': 'icon-29-ipad.png',
      'scale': '1x'
    },
    {
      'size': '29x29',
      'idiom': 'ipad',
      'filename': 'icon-29@2x-ipad.png',
      'scale': '2x'
    },
    {
      'size': '40x40',
      'idiom': 'ipad',
      'filename': 'icon-40.png',
      'scale': '1x'
    },
    {
      'size': '40x40',
      'idiom': 'ipad',
      'filename': 'icon-40@2x.png',
      'scale': '2x'
    },
    {
      'size': '50x50',
      'idiom': 'ipad',
      'filename': 'icon-50.png',
      'scale': '1x'
    },
    {
      'size': '50x50',
      'idiom': 'ipad',
      'filename': 'icon-50@2x.png',
      'scale': '2x'
    },
    {
      'size': '72x72',
      'idiom': 'ipad',
      'filename': 'icon-72.png',
      'scale': '1x'
    },
    {
      'size': '72x72',
      'idiom': 'ipad',
      'filename': 'icon-72@2x.png',
      'scale': '2x'
    },
    {
      'size': '76x76',
      'idiom': 'ipad',
      'filename': 'icon-76.png',
      'scale': '1x'
    },
    {
      'size': '76x76',
      'idiom': 'ipad',
      'filename': 'icon-76@2x.png',
      'scale': '2x'
    },
    {
      'size': '83.5x83.5',
      'idiom': 'ipad',
      'filename': 'icon-83.5@2x.png',
      'scale': '2x'
    },
    {
      'size': '1024x1024',
      'idiom': 'ios-marketing',
      'filename': 'icon-1024.png',
      'scale': '1x'
    }
  ],
  'info': {
    'version': 0.1
  }
}

let lh = document.querySelector('link[href]')
let historyMode = lh && lh.getAttribute('href').startsWith('/')

icons.images.forEach(icon => {
  let el = document.createElement('link')
  el.setAttribute('rel', 'apple-touch-icon')
  el.setAttribute('href', (historyMode ? '/' : '') + 'icons/ios/AppIcon.appiconset/' + icon.filename)
  el.setAttribute('sizes', icon.size)
  document.head.appendChild(el)
})
