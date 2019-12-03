// import Config from './config'

let apiOptions = {
  url: process.env.VUE_APP_URL,
  fileUrl: process.env.VUE_APP_FILEURL,
  wsPrefix: process.env.VUE_APP_WSPREFIX,
  wsUrl: process.env.VUE_APP_WSURL,
  error: function () {
    window.error(true, '网络异常,请检查网络', '600')
  }
}

// TODO: 代码可以简化
let apiDefaults = {
  url: '',
  data: null,
  success: function () {},
  complete: function () {},
  error: function (data) {
    if (data) {
      window.$toast(data)
    } else {
      window.$toast('服务器错误')
    }
  },
  debug: false
}
/**
 * file 原图
 * FileThumbnailOnly 压缩正常
 * FileThumbnail 缩略图
 */
class FileApiHelper {
  constructor(options) {
    let me = this
    me.url = options.url
    me.fileUrl = options.fileUrl
    me.error = options.error
    me.oldUrl = options.oldUrl
    me.isLoading = false
    // eslint-disable-next-line
    let instance = axios.create()
    instance.defaults.timeout = 30000 // 请求最大时间
    me.axios = instance
  }
  success(xhr, opts) {
    if (xhr.status >= 200 && xhr.status < 300 && typeof (xhr.data) !== 'undefined') {
      opts.success(xhr.data)
    }
  }
  catchErr(error, opts) {
    let me = this
    const errMsg = error.toString()
    const code = parseInt(errMsg.substr(errMsg.indexOf('code') + 5))
    // 401 未登录
    // 401 - 500 提交错误
    // 500 服务端 有Message
    // 400 敏感词 | 字段错误
    if (parseInt(code) === 401) {
      if (typeof (opts.error) === 'function') {
        opts.error('未登录')
      } else {
        me.error('未登录')
      }
    } else {
      if ((typeof (error)).toLowerCase() === 'object' && error.response && error.response.data) {
        let ErrObj = error.response.data
        if (ErrObj.Message) {
          opts.error(`${ErrObj.Message}`)
        } else {
          try {
            for (let keyW in ErrObj) {
              let keyValue = ErrObj[keyW][0]
              if (!keyValue.indexOf('[')) { // 敏感词
                let ErrArr = JSON.parse(ErrObj[keyW][0])
                let keys = ''
                ErrArr.map((item) => {
                  keys = `${keys}${item.Keyword},`
                })
                keys.length && (keys = keys.slice(0, keys.length - 1))
                if (keys) {
                  opts.error(`含有敏感词：${keys}`)
                }
              } else { // 格式不合格
                opts.error(`${keyW}:${keyValue}`)
              }
            }
          } catch {
            opts.error(JSON.stringify(ErrObj))
          }
        }
      } else {
        if (error.toString() === 'Error: Network Error') { // 断网了
          window.$toast('似乎已断开与互联网的连接。')
          opts.error(error.toString())
        }
        // opts.error('操作失败')
      }
    }
  }
  complete(opts) {
    if (typeof (opts.complete) === 'function') {
      opts.complete()
    }
  }
  file(options) {
    var me = this
    // let opts = options
    me.axios.defaults.timeout = 60000 // 请求最大时间
    let opts = Object.assign({}, apiDefaults, options)
    var url = me.fileUrl + options.url
    if (opts.type && opts.type === 'ws') {
      url = me.wsPrefix + options.url
      console.log(me.axios)
    }
    var config = {
      onUploadProgress: progressEvent => {
        var complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
        // this.progress = complete
        if (opts.onProgress) {
          opts.onProgress(complete)
        }
      }
    }
    me.axios
      .post(url, opts.data, config)
      .then(function (xhr) {
        me.success(xhr, opts)
      })
      .catch(function (error) {
        me.catchErr(error, opts)
      })
      .then(function () {
        me.complete(opts)
      })
  }
  fileData(options) {
    var me = this
    // let opts = options
    me.axios.defaults.timeout = 60000 // 请求最大时间
    let opts = Object.assign({}, apiDefaults, options)
    var url = me.fileUrl + options.url
    if (opts.type && opts.type === 'ws') {
      url = me.wsPrefix + options.url
      console.log(me.axios)
    }
    me.axios
      .get(url)
      .then(function (xhr) {
        me.success(xhr, opts)
      })
      .catch(function (error) {
        me.catchErr(error, opts)
      })
      .then(function () {
        me.complete(opts)
      })
  }
}

class ApiHelper {
  constructor(options) {
    let me = this
    me.opts = options
    me.url = options.url
    me.fileUrl = options.fileUrl
    me.error = options.error
    me.oldUrl = options.oldUrl
    me.wsPrefix = options.wsPrefix
    me.setAuth()
  }
  setAuth() {
    let me = this
    // eslint-disable-next-line
    let instance = axios.create()
    instance.defaults.timeout = 30000 // 请求最大时间
    instance.interceptors.request.use(function (config) {
      me.appendHeader(config, 'X-DEVICE-TOKEN')
      me.appendHeader(config, 'X-XSRF-TOKEN')
      me.appendHeader(config, 'Authorization')
      return config
    })
    me.axios = instance
  }
  appendHeader(config, name) {
    let item = localStorage.getItem('Headers_' + name)
    if (typeof (item) === 'string') {
      config.headers[name] = item
    }
  }
  getFormData(data) {
    if (data == null || Object.prototype.toString.call(data) !== '[object Object]') {
      return data
    }
    let formData = new FormData()
    for (let key in data) {
      formData.append(key, data[key])
    }
    return formData
  }
  success(xhr, opts) {
    if (xhr.status >= 200 && xhr.status < 300 && typeof (xhr.data) !== 'undefined') {
      opts.success(xhr.data)
    }
  }
  catchErr(error, opts) {
    console.log(error)
    const errMsg = error.toString()
    const code = parseInt(errMsg.substr(errMsg.indexOf('code') + 5))
    // 401 未登录
    // 401 - 500 提交错误
    // 500 服务端 有Message
    // 400 敏感词 | 字段错误
    if (parseInt(code) === 401) {
      if (error.response.config) {
        try { // 如果是登录接口不报提示
          if (error.response.config.url.indexOf('UserMain') > 0 || error.response.config.url.indexOf('userMain') > 0) {
            return
          }
        } catch {
          if (typeof (opts.error) === 'function') {
            opts.error('未登录')
          }
        }
      }

    } else {
      if ((typeof (error)).toLowerCase() === 'object' && error.response && error.response.data) {
        let ErrObj = error.response.data
        if (ErrObj.Message) {
          opts.error(`${ErrObj.Message}`)
        } else {
          try {
            for (let keyW in ErrObj) {
              let keyValue = ErrObj[keyW][0]
              if (!keyValue.indexOf('[')) { // 敏感词
                let ErrArr = JSON.parse(ErrObj[keyW][0])
                let keys = ''
                ErrArr.map((item) => {
                  keys = `${keys}${item.Keyword},`
                })
                keys.length && (keys = keys.slice(0, keys.length - 1))
                if (keys) {
                  opts.error(`含有敏感词：${keys}`)
                }
              } else { // 格式不合格
                opts.error(`${keyW}:${keyValue}`)
              }
            }
          } catch {
            opts.error(JSON.stringify(ErrObj))
          }
        }
      } else {
        if (error.toString() === 'Error: Network Error') { // 断网了
          window.$toast('似乎已断开与互联网的连接。')
          opts.error(error.toString())
        }
      }
    }
  }
  complete(opts) {
    if (typeof (opts.complete) === 'function') {
      opts.complete()
    }
  }
  process(options) { // post
    var me = this
    let opts = Object.assign({}, apiDefaults, options)
    var url = me.url + options.url
    if (opts.type && opts.type === 'ws') {
      console.log(me.wsPrefix)
      url = me.wsPrefix + options.url
    }
    me.axios
      .post(url, opts.data)
      .then(function (xhr) {
        me.success(xhr, opts)
      })
      .catch(function (error) {
        if (opts.type && opts.type === 'ws') {
          opts.error('wsErr')
        } else {
          me.catchErr(error, opts)
        }
      })
      .then(function () {
        me.complete(opts)
      })
  }
  get(options) {
    return
    var me = this
    let opts = Object.assign({}, apiDefaults, options)
    var url = me.url + options.url
    if (opts.type && opts.type === 'ws') {
      url = me.wsPrefix + options.url
    }
    me.axios
      .get(url)
      .then(function (xhr) {
        me.success(xhr, opts)
      })
      .catch(function (error) {
        me.catchErr(error, opts)
      })
      .then(function () {
        me.complete(opts)
      })
  }
  delete(options) {
    var me = this
    let opts = Object.assign({}, apiDefaults, options)
    var url = me.url + options.url
    if (opts.type && opts.type === 'ws') {
      url = me.wsPrefix + options.url
    }
    me.axios
      .delete(url, {
        data: opts.data
      })
      .then(function (xhr) {
        me.success(xhr, opts)
      })
      .catch(function (error) {
        me.catchErr(error, opts)
      })
      .then(function () {
        me.complete(opts)
      })
  }
  put(options) {
    var me = this
    let opts = Object.assign({}, apiDefaults, options)
    var url = me.url + options.url
    if (opts.type && opts.type === 'ws') {
      url = me.wsPrefix + options.url
    }
    me.axios
      .put(url, opts.data)
      .then(function (xhr) {
        me.success(xhr, opts)
      })
      .catch(function (error) {
        me.catchErr(error, opts)
      })
      .then(function () {
        me.complete(opts)
      })
  }
}

let apiHelper = new ApiHelper(apiOptions)
let fileApiHelper = new FileApiHelper(apiOptions)

export default {
  oldPost: function (options) {
    apiHelper.oldPost(options)
  },
  process: function (options) {
    apiHelper.process(options)
  },
  get: function (options) {
    apiHelper.get(options)
  },
  file: function (options) {
    fileApiHelper.file(options)
  },
  fileData: function (options) {
    fileApiHelper.fileData(options)
  },
  delete: function (options) {
    apiHelper.delete(options)
  },
  put: function (options) {
    apiHelper.put(options)
  }
}
