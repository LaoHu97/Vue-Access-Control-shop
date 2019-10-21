'use strict'
const target = process.env.npm_lifecycle_event
  if (target === 'test') {
    var configObj = {
      NODE_ENV: '"production"',
      API_ROOT: '""',
      API_DOWNLOAD: '"https://devdownload.wandingkeji.cn"'
      }
  } else if (target === 'build') {
    var configObj = {
      NODE_ENV: '"production"',
      API_ROOT: '""',
      API_DOWNLOAD: '"https://download.wandingkeji.cn"'
    }
  }
  module.exports = configObj
