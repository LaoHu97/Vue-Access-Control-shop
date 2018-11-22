module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      '/admin': {
        target: 'http://dev.weupay.com',
        changeOrigin: true,
        pathRewrite: {
          '^/admin': '/admin'
        }
      },
      '/download': {
        target: 'http://test.weupay.com:8081',
        changeOrigin: true,
        pathRewrite: {
          '^/download': '/download'
        }
      }
    }
  }
}
