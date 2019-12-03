const api = require('./mock/api.json')
const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}

module.exports = {
  outputDir: 'dist',
  publicPath: './',
  productionSourceMap: false,
  chainWebpack: config => {
    // 配置路径别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('_c', resolve('src/component'))
  },
  devServer: {
    port: 80,
    disableHostCheck: true,
    before (app) {
      app.get('/mock/', (req, res) => {
        res.json(api)
      })
    }
  }
}
