import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { LOCAL_STORAGE_KEYS } from '@/constants/defaultConfig'

// 后端地址策略：
// 1. 优先读构建时环境变量 VUE_APP_API_BASE（需要跨域部署时用）
// 2. 否则一律走同源 /api：
//    - 开发模式：由 vue.config.js 的 devServer.proxy 转发到 localhost:3000
//    - 生产模式：前端 dist 由后端托管，天然同源
// 这样换端口、换公网 IP、加 Nginx 反代都无需改代码。
const baseURL = process.env.VUE_APP_API_BASE || '/api'

const service = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true
})

service.interceptors.request.use(
  config => {
    const systemConfig = store.getters.systemConfig
    const userId = store.getters.userId || localStorage.getItem(LOCAL_STORAGE_KEYS.userId)

    if (userId) {
      config.headers['X-User-Id'] = userId
    }

    if (systemConfig && systemConfig.dfrPost) {
      const { token, project, url } = systemConfig.dfrPost
      if (token) {
        config.headers['X-User-Token'] = token
      }
      if (project) {
        config.headers['x-project-uuid'] = project
      }
      if (url) {
        config.headers['x-proxy-target'] = url
      }
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    const message = error.response?.data?.message || error.message || '请求失败'
    Message({
      message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
