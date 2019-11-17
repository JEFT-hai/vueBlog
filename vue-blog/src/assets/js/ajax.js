import axios from 'axios'
const ajax = {
    http(opts) {
        return new Promise((resolve, reject) => {
        axios({
            method: opts.methods || 'POST',
            url: 'http://157.245.188.150:8080/' + opts.url,
            data: opts.data,
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', //指定消息格式
            },
            transformRequest: [function (e) { //数据转换的核心代码，摘自csdn
            function setDate(e) {
                var t, n, i, r, o, s, a, c = ''
                for (t in e)
                if (n = e[t], n instanceof Array)
                    for (a = 0; a < n.length; ++a) o = n[a], i = t + '[' + a + ']', s = {}, s[i] = o, c += setDate(s) + '&'
                else if (n instanceof Object)
                for (r in n) o = n[r], i = t + '[' + r + ']', s = {}, s[i] = o, c += setDate(s) + '&'
                else void 0 !== n && null !== n && (c += encodeURIComponent(t) + '=' + encodeURIComponent(n) + '&')
                return c.length ? c.substr(0, c.length - 1) : c
            } // 数据转换的核心代码结束 
            return setDate(e)
            }]
        }).then((res) => {
            // eslint-disable-next-line
            console.log(res, 'res')
            resolve(res)
        }).catch((err) => {
            reject(err)
        })
        })
    }
    }
    export default ajax
  