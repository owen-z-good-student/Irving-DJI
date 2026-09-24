import { clearWebhookMessages, fetchWebhookMessages } from '@/api/system'

function socketUrl() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  // 走同源（window.location.host 已含端口）：
  // - 开发模式由 devServer 代理 /ws 到 localhost:3000
  // - 生产模式前端由后端托管，天然同源
  return `${protocol}//${window.location.host}/ws`
}

function reconnectDelay(attempt) {
  return Math.min(30000, 1000 * Math.pow(2, attempt))
}

export default {
  namespaced: true,
  state: {
    socket: null,
    status: 'idle',
    reconnectAttempts: 0,
    reconnectTimer: null,
    items: [],
    total: 0,
    page: 1,
    pageSize: 20,
    latestNotice: null
  },
  mutations: {
    SET_SOCKET(state, socket) {
      state.socket = socket
    },
    SET_STATUS(state, status) {
      state.status = status
    },
    SET_RECONNECT_ATTEMPTS(state, attempts) {
      state.reconnectAttempts = attempts
    },
    SET_RECONNECT_TIMER(state, timer) {
      state.reconnectTimer = timer
    },
    SET_LIST(state, payload) {
      state.items = payload.items
      state.total = payload.total
      state.page = payload.page
      state.pageSize = payload.pageSize
    },
    PREPEND_MESSAGE(state, message) {
      state.items = [message, ...state.items].slice(0, state.pageSize)
      state.total += 1
      state.latestNotice = message
    },
    CLEAR_NOTICE(state) {
      state.latestNotice = null
    }
  },
  actions: {
    async fetchList({ commit, state }, params = {}) {
      const result = await fetchWebhookMessages({
        page: params.page || state.page,
        pageSize: params.pageSize || state.pageSize
      })
      commit('SET_LIST', result)
    },
    connect({ state, commit, dispatch }) {
      if (
        state.socket &&
        [WebSocket.OPEN, WebSocket.CONNECTING].includes(state.socket.readyState)
      ) {
        return
      }

      if (state.reconnectTimer) {
        clearTimeout(state.reconnectTimer)
        commit('SET_RECONNECT_TIMER', null)
      }

      commit('SET_STATUS', 'connecting')
      const socket = new WebSocket(socketUrl())
      commit('SET_SOCKET', socket)

      socket.onopen = () => {
        commit('SET_STATUS', 'connected')
        commit('SET_RECONNECT_ATTEMPTS', 0)
      }

      socket.onmessage = event => {
        try {
          const parsed = JSON.parse(event.data)
          if (parsed.type === 'webhook' && parsed.data) {
            commit('PREPEND_MESSAGE', parsed.data)
          }
        } catch (error) {
          // Ignore malformed websocket payloads.
        }
      }

      socket.onclose = () => {
        commit('SET_SOCKET', null)
        dispatch('scheduleReconnect')
      }

      socket.onerror = () => {
        socket.close()
      }
    },
    scheduleReconnect({ state, commit, dispatch }) {
      commit('SET_STATUS', 'reconnecting')
      const attempts = state.reconnectAttempts + 1
      commit('SET_RECONNECT_ATTEMPTS', attempts)
      const timer = setTimeout(() => {
        commit('SET_RECONNECT_TIMER', null)
        dispatch('connect')
      }, reconnectDelay(attempts))
      commit('SET_RECONNECT_TIMER', timer)
    },
    async clearHistory({ commit }) {
      await clearWebhookMessages()
      commit('SET_LIST', {
        items: [],
        total: 0,
        page: 1,
        pageSize: 20
      })
    },
    clearNotice({ commit }) {
      commit('CLEAR_NOTICE')
    }
  }
}
