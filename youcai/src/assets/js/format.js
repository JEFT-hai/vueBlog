export default {
  padLeftZero(str, len) {
    return '0000'.substring('0000'.length - (len - str.length)) + str
  },
  id(str) {
    return str.replace(/-/g, '')
  },
  getDate(_date) { // 中国时间
    // && _date.indexOf('T') !== -1 && _date.indexOf('Z') === -1
    if (typeof (_date) === 'string') {
      _date = _date.replace('T', ' ').replace('Z', '')
      return new Date(_date)
      //  + 'Z' 转国际时间
    }
    return _date
  },
  getZ(_date) { // 转成国际时间
    if (typeof (_date) === 'string' && _date.indexOf('T') !== -1 && _date.indexOf('Z') === -1) {
      return new Date(_date + 'Z')
    }
    return _date
  },
  dateTimestamp(_date, fmt) {
    _date = new Date(Number(_date))
    return this.date(_date, fmt)
  },
  date(_date, fmt) {
    _date = this.getDate(_date)
    let d = [_date.getFullYear(), _date.getMonth() + 1, _date.getDate(), _date.getHours(), _date.getMinutes(), _date.getSeconds()]
    let o = {
      'y+': d[0],
      'M+': d[1],
      'd+': d[2],
      'h+': d[3],
      'm+': d[4],
      's+': d[5]
    }
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + ''
        fmt = fmt.replace(RegExp.$1, this.padLeftZero(str, RegExp.$1.length))
      }
    }
    return fmt
  },
  shortDate(_date) {
    _date = this.getDate(_date)
    let now = new Date()
    if (_date >= now) {
      return this.date(_date, 'yyyy-MM-dd')
      // return '刚刚'
    }
    if (_date.getFullYear() !== now.getFullYear()) {
      return this.date(_date, 'yyyy-MM-dd')
    }
    let ts = (now - _date) / 1000
    if (ts >= 604800) {
      return this.date(_date, 'MM-dd')
    }
    var ns = ['天', '小时', '分钟', '秒']
    var nn = [86400, 3600, 60, 1]
    for (let i = 0; i < 4; i++) {
      var num = Math.floor(ts / nn[i])
      if (num === 0) {
        continue
      }
      return num + ns[i] + '前'
    }
    return '刚刚'
  },
  toMinOne(_sec) {
    let min = parseInt(_sec / 60)
    let sec = parseInt(_sec % 60) <= 9 ? '0' + parseInt(_sec % 60) : parseInt(_sec % 60)
    if (isNaN(min)) {
      return '0:00'
    }
    return min + ':' + sec
  },
  toMinTwo(_sec) {
    let min = parseInt(_sec / 60) <= 9 ? '0' + parseInt(_sec / 60) : parseInt(_sec / 60)
    let sec = parseInt(_sec % 60) <= 9 ? '0' + parseInt(_sec % 60) : parseInt(_sec % 60)
    if (isNaN(min)) {
      return '00:00'
    }
    return min + ':' + sec
  },
  formatWeek(_date, _endDate) {
    _date = this.getDate(_date)
    _endDate = this.getDate(_endDate)
    let returnDateL = ''
    let returnDateR = ''
    let now = new Date()
    let weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    let WeekFirstDay = new Date(now - (now.getDay() - 1) * 86400000)
    let WeekLastDay = new Date((WeekFirstDay / 1000 + 6 * 86400) * 1000)
    let _dateWeek = weeks[_date.getDay()]
    let _endDateWeek = weeks[_endDate.getDay()]
    // 是本周就显示本周
    if (this.date(_date, 'yyyy年MM月dd日') === this.date(now, 'yyyy年MM月dd日')) {
      returnDateL = '今天' + ' ' + this.date(_date, 'hh:mm') + ' 至 '
    } else if (_date > now && _date > WeekFirstDay && _date < WeekLastDay) {
      returnDateL = '本周' + _dateWeek.substring(2) + ' ' + this.date(_date, 'hh:mm') + ' 至 '
    } else if (_date.getFullYear() !== now.getFullYear()) {
      returnDateL = this.date(_date, 'yyyy年MM月dd日') + ' ' + this.date(_date, 'hh:mm') + ' 至 '
    } else {
      returnDateL = this.date(_date, 'MM月dd日') + ' ' + this.date(_date, 'hh:mm') + ' 至 '
    }
    if (this.date(_date, 'yyyy年MM月dd日') === this.date(_endDate, 'yyyy年MM月dd日')) {
      returnDateR = this.date(_endDate, 'hh:mm')
    } else if (_endDate > WeekFirstDay && _endDate < WeekLastDay && _date > WeekFirstDay && _date < WeekLastDay && _date > now) {
      returnDateR = '本周' + _endDateWeek.substring(2) + ' ' + this.date(_endDate, 'hh:mm')
    } else if (_endDate.getFullYear() !== _date.getFullYear()) {
      returnDateR = this.date(_endDate, 'yyyy年MM月dd日') + ' ' + this.date(_endDate, 'hh:mm')
    } else {
      returnDateR = this.date(_endDate, 'MM月dd日') + ' ' + this.date(_endDate, 'hh:mm')
    }
    return returnDateL + returnDateR
  },
  formatAge(_date) {
    _date = this.getDate(_date)
    let data = new Date()
    let year = data.getFullYear()
    let month = data.getMonth() + 1
    let day = data.getDate()
    let birthYear = parseInt(_date.substring(0, 4))
    let birthMonth = parseInt(_date.substring(5, 7))
    let ageYear = year - birthYear
    let birthDay = parseInt(_date.substring(8, 10))
    // 如果当前月份小于生日月份就要减1岁
    let change = month > birthMonth || month === birthMonth ? 0 : -1
    // 只有当生日月份当前月份相等时 才判断 day
    if (month === birthMonth) {
      change = day > birthDay || day === birthDay ? 0 : -1
    }
    return ageYear + change
  },
  formatNum(_num) {
    _num = parseInt(_num)
    if (_num <= 0 || !_num) {
      return 0
    } else if (_num < 10000) {
      return _num
    } else {
      return (_num / 10000).toFixed(1) + '万'
    }
  },
  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
}
