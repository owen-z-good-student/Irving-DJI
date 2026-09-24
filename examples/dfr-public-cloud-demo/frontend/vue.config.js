const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')

module.exports = defineConfig({
  transpileDependencies: true,
  // 本项目未提供 ESLint 配置文件，关闭 lint 检查以免启动报错
  lintOnSave: false,
  configureWebpack: {
    resolve: {
      fallback: {
        url: require.resolve('url/'),
        buffer: require.resolve('buffer/'),
        process: require.resolve('process/browser')
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser'
      })
    ]
  },
  devServer: {
    // 开发模式下把 /api 和 /ws 代理到后端，使前端代码始终使用同源地址。
    // 生产模式（npm run build 后由后端托管）天然同源，无需代理。
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/ws': {
        target: 'http://localhost:3000',
        ws: true,
        changeOrigin: true
      }
    }
  }
})
