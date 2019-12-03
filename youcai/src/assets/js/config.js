let isFormal = false
let origin = ''
let fileOrigin = ''
let wsPrefix = ''
let wsUrl = ''
if (isFormal) {
  origin = 'http://app.szwanwan.com:7031/api/'
  fileOrigin = 'http://file.szwanwan.com:7021/api/'
  wsPrefix = 'http://app.szwanwan.com:7071/'
  wsUrl = 'ws://app.szwanwan.com:7061/'
} else {
  fileOrigin = 'http://192.168.1.101:5021/api/'
  origin = 'http://192.168.1.101:5031/api/'
  wsPrefix = 'http://192.168.1.101:5071/'
  wsUrl = 'ws://192.168.1.101:5061/'
}
let imageOrigin = 'http://192.168.1.101:5031'
let oldUrl = 'http://appapi.szwanwan.com/'

oldUrl = oldUrl + '/api/{apiName}.ashx?method={methodName}'
let apiUrl = origin
let fileUrl = fileOrigin
export default {
  oldUrl: oldUrl,
  origin: origin,
  apiUrl: apiUrl,
  fileUrl: fileUrl,
  wsPrefix: wsPrefix,
  wsUrl: wsUrl,
  imageOrigin: imageOrigin,
  app: {
    title: '多录',
    version: '1.2.7',
    copyright: 'Copyright © 2008-2018 szwanwan.com',
    company: '多录'
  }
}
