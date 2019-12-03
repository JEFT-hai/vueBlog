let defaultOptions = {
  name: 'mydb',
  version: '1.0',
  text: 'chat',
  size: 2 * 1024 * 1024,
  callback: function () {
    console.log('open数据库')
  }
}
class webSql {
  constructor() {}
  open(options) { // 打开或创建数据库
    let opts = Object.assign({}, defaultOptions, options)
    return new Promise((resolve, reject) => {
      if (window.openDatabase) {
        let db = openDatabase(opts.name, opts.version, opts.text, opts.size)
        if (!db) {
          console.log('创建数据库失败')
          reject()
        } else {
          db.transaction(function (tx) {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS ${opts.formName} (${opts.keys})`, [], function (tx, results) {
              resolve(results)
            }, function (tx, err) {
              console.log(err, `${opts.formName}, (${opts.keys})`)
              reject(err)
            })
          })
        }
      } else {
        console.log('不支持sql')
      }
    })
  }
  /*
   * 增
   */
  async insertData(options) { // 向表中插入数据
    // let _this = this
    let opts = Object.assign({}, defaultOptions, options)
    let db = openDatabase(opts.name, opts.version, opts.text, opts.size)
    // let header = await _this.getFormHeader(options)
    let keys = []
    let values = []
    let $values = []
    for (let key in opts.obj) {
      keys.push(key)
      let value = opts.obj[key]
      if (typeof (opts.obj[key]) === 'object') {
        value = JSON.stringify(opts.obj[key])
      }
      values.push(value)
      $values.push('?')
    }
    let keysStr = keys.join(',').toString()
    let $valStr = $values.join(',').toString()
    return new Promise((resolve, reject) => {
      db.transaction(function (tx) {
        // tx.executeSql(`CREATE TABLE IF NOT EXISTS ${opts.formName} (${keysStr})`)
        // keys.map((item) => {
        //   if (!header.includes(item)) {
        //     tx.executeSql(`ALTER TABLE ${opts.formName} ADD ${item}`, [], function (tx, results) {
        //       // resolve()
        //     }, function (tx, err) {
        //       console.log(err, 'insertErr', `ALTER TABLE ${opts.formName} ADD ${item}`)
        //       reject()
        //     })
        //   }
        // })
        tx.executeSql(`INSERT INTO ${opts.formName} (${keysStr}) VALUES (${$valStr})`, values, function (tx, results) {
          resolve()
        }, function (tx, err) {
          console.log(err, 'insertDataErr', `INSERT INTO ${opts.formName} (${keysStr}) VALUES (${$valStr})`, values)
          reject(err)
        })
      })
    })
  }
  async sql(options) {
    let opts = Object.assign({}, defaultOptions, options)
    let db = openDatabase(opts.name, opts.version, opts.text, opts.size)
    return new Promise((resolve, reject) => {
      db.transaction(function (tx) {
        tx.executeSql(opts.sql, [], function (tx, results) {
          resolve()
        }, function (tx, err) {
          console.log(err, 'err', opts.sql)
          reject()
        })
      })
    })
  }
  async insertForm(options) { // 批量增加，不重复 (先删除再添加，所以要用orderBy))
    let opts = Object.assign({}, defaultOptions, options)
    let db = openDatabase(opts.name, opts.version, opts.text, opts.size)
    let keys = options.keys
    let keysStr = keys.join(',').toString()
    let arr = options.arr
    let objArr = []
    for (let i = 0; i < arr.length; i++) {
      let objArrItem = []
      for (let key in keys) {
        if (options.replace) {
          for (let k in options.replace) {
            arr[i][k] = arr[i][options.replace[k]]
          }
        }
        let value = arr[i][keys[key]]
        if (typeof (arr[i][key]) != 'string') {
          value = JSON.stringify(arr[i][keys[key]])
        }
        objArrItem.push(value)
      }
      objArr.push(`(${objArrItem.join(',').toString()})`)
    }
    let $valStr = objArr.join(',').toString()
    let insert = `replace into ${opts.formName} (${keysStr}) VALUES ${$valStr}`
    return new Promise((resolve, reject) => {
      db.transaction(function (tx) {
        tx.executeSql(insert, [], function (tx, results) {
          resolve()
        }, function (tx, err) {
          console.log(err, 'err', insert)
          reject()
        })
      })
    })
  }
  getFormHeader(options) { // 获取所有表头的函数
    let opts = Object.assign({}, defaultOptions, options)
    let db = openDatabase(opts.name, opts.version, opts.text, opts.size)
    return new Promise((resolve, reject) => {
      db.transaction(function (tx) {
        tx.executeSql(`select * from ${opts.formName} LIMIT 0,1`, [], function (tx, results) {
          let keys = []
          for (let key in results.rows[0]) {
            keys.push(key)
          }
          resolve(keys)
        }, function (tx, err) {
          reject(err)
        })
      })
    })
  }
  /*
   * 删
   */
  delItemData(options) { // 根据where删除数据，多用于单条
    let opts = Object.assign({}, defaultOptions, options)
    let db = openDatabase(opts.name, opts.version, opts.text, opts.size)
    return new Promise((resolve, reject) => {
      db.transaction(function (tx) {
        tx.executeSql(`delete from ${opts.formName} where ${opts.where}`, [], function (tx, results) {
          resolve(results)
        }, function (tx, err) {
          reject(err)
        })
      })
    })
  }
  delForm(options) { // 删除数据表
    let opts = Object.assign({}, defaultOptions, options)
    let db = openDatabase(opts.name, opts.version, opts.text, opts.size)
    return new Promise((resolve, reject) => {
      db.transaction(function (tx) {
        tx.executeSql(`drop table ${opts.formName}`, [], function (tx, results) {
          resolve(results)
        }, function (tx, err) {
          reject(err)
        })
      })
    })
  }
  /*
   * 改
   */
  upItemData(options) { // 更新数据
    let opts = Object.assign({}, defaultOptions, options)
    let db = openDatabase(opts.name, opts.version, opts.text, opts.size)
    let keys = []
    let values = []
    let insertKeys = []
    let insertValues = []
    for (let key in opts.obj) {
      if (!(key === 'by' || key === opts.obj['by'])) {
        let str = key + '=?'
        keys.push(str)
        values.push(opts.obj[key])
        insertKeys.push(key)
        insertValues.push('?')
      }
    }
    values.push(opts.obj[opts.obj['by']])
    insertKeys.push(opts.obj['by'])
    insertValues.push('?')
    db.transaction(function (tx) {
      tx.executeSql(`update ${opts.formName} set ${keys} where ${opts.obj['by']}=?`, values, function (tx, res) {
        if (!res.rowsAffected) {
          console.log('没有会插入')
          tx.executeSql(`insert into ${opts.formName} (${insertKeys.join()}) VALUES (${insertValues.join()})`, values, function (tx, res) {}, function (tx, err) {
            console.log('upItemData插入失败', err, `insert into ${opts.formName} (${insertKeys.join()}) VALUES (${insertValues.join()})`)
          })
        }
      }, function (tx, err) {
        tx.executeSql(`insert into ${opts.formName} (${insertKeys.join()}) VALUES (${insertValues.join()})`, values, function (tx, res) {}, function (tx, err) {
          console.log('upItemData插入失败', err, `insert into ${opts.formName} (${insertKeys.join()}) VALUES (${insertValues.join()})`)
        })
      })
    })
  }
  upForm(options) {
    let opts = Object.assign({}, defaultOptions, options)
    let db = openDatabase(opts.name, opts.version, opts.text, opts.size)
    return new Promise((resolve, reject) => {
      db.transaction(function (tx) {
        tx.executeSql(`update ${opts.formName} set ${opts.set} WHERE ${opts.where}`, [], function (tx, results) {
          resolve(results)
        }, function (tx, err) {
          console.log(err, 'upForm', `update ${opts.formName} set ${opts.set} WHERE ${opts.where}`)
          reject(err)
        })
      })
    })
  }
  /*
   * 查
   */
  findData(options) { // 查找数据
    let opts = Object.assign({}, defaultOptions, options)
    let db = openDatabase(opts.name, opts.version, opts.text, opts.size)
    return new Promise((resolve, reject) => {
      db.transaction(function (tx) {
        tx.executeSql(`SELECT * FROM ${opts.formName}`, [], function (tx, results) {
          resolve(results.rows)
        }, function (tx, err) {
          reject(err)
        })
      })
    })
  }
  selectData(options) { // 用sql语句查找数据
    let opts = Object.assign({}, defaultOptions, options)
    let db = openDatabase(opts.name, opts.version, opts.text, opts.size)
    return new Promise((resolve, reject) => {
      db.transaction(function (tx) {
        tx.executeSql(opts.select, [], function (tx, results) {
            resolve(results.rows)
          },
          function (tx, err) {
            console.log('selectDataErr', err, opts.select)
            reject(err)
          })
      })
    })
  }
  sum(options) {
    let opts = Object.assign({}, defaultOptions, options)
    let db = openDatabase(opts.name, opts.version, opts.text, opts.size)
    return new Promise((resolve, reject) => {
      db.transaction(function (tx) {
        tx.executeSql(opts.select, [], function (tx, results) {
            resolve(results.rows)
          },
          function (tx, err) {
            console.log('sum', err, opts.select)
            reject(err)
          })
      })
    })
  }
}
let sql = new webSql()

export default sql
