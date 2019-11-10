import axios from 'axios'

let Config = {
    url: 'http://157.245.188.150:8080/'
}

let apiDefaults = {
    url: '',
    data: null,
    success: function (res) {
         // eslint-disable-next-line
        console.log(this.url, res)
    },
    complete: function () {},
    error: function (err) {
        // eslint-disable-next-line
        console.log(err)
    }
}

class ApiHelper {
    constructor(options){
        let me = this
        me.url = options.url
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
    success(xhr, opts) {
        if (xhr.status >= 200 && xhr.status < 300 && typeof (xhr.data) !== 'undefined') {
          opts.success(xhr.data)
        }
    }
    catchErr(error, opts) {
        const errMsg = error.toString()
        const code = parseInt(errMsg.substr(errMsg.indexOf('code') + 5))
        // 401 未登录
        let errTxt = code
        switch (code) {
            case 401:
                errTxt = '未登录'
                break
            default:
                break
        }
        opts.error(errTxt)
    }
    complete(opts) {
        if (typeof (opts.complete) === 'function') {
          opts.complete()
        }
    }
    post (options) {
        let me = this
        let opts = Object.assign({}, apiDefaults, options)
        let url = me.url + opts.url
        me.axios
          .post(url, opts.data)
          .then(function(xhr){
            me.success(xhr, opts)
          })
          .catch(function (error) {
            me.catchErr(error, opts)
          })
          .then(function () {
            me.complete(opts)
          })
    }
    delete (options) {
        let me = this
        let opts = Object.assign({}, apiDefaults, options)
        let url = me.url + opts.url
        me.axios
          .post(url, { data: opts.data})
          .then(function(xhr){
            me.success(xhr, opts)
          })
          .catch(function (error) {
            me.catchErr(error, opts)
          })
          .then(function () {
            me.complete(opts)
          })
    }
    put (options) {
        let me = this
        let opts = Object.assign({}, apiDefaults, options)
        let url = me.url + opts.url
        me.axios
          .put(url, opts.data)
          .then(function(xhr){
            me.success(xhr, opts)
          })
          .catch(function (error) {
            me.catchErr(error, opts)
          })
          .then(function () {
            me.complete(opts)
          })
    }
    get (options) {
        let me = this
        let opts = Object.assign({}, apiDefaults, options)
        let url = me.url + opts.url
        me.axios
          .get(url)
          .then(function(xhr){
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
let apiHelper = new ApiHelper({
    url: Config.url,
    error: function () {
      window.error(true, '网络异常,请检查网络', '600')
    }
})

export default apiHelper
