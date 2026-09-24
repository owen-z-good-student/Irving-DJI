import mqtt from 'mqtt'
import { airportFields, droneFields } from '@/constants/osdDict'

const osdRootKeys = new Set(
  [...airportFields, ...droneFields].filter(f => f.depth === 0).map(f => f.key)
)

function topicFor(sn) {
  return sn ? `thing/product/${sn}/osd` : ''
}

function extractOsdPayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return null
  }

  // 如果当前层级包含任何一个已知的 OSD 根字段，说明这就是真实数据
  if (Object.keys(payload).some(k => osdRootKeys.has(k))) {
    return payload
  }

  // 否则，通常真实数据在 'data' 字段中，或者是嵌套在某个层级下
  const keys = Object.keys(payload)
  for (let index = 0; index < keys.length; index += 1) {
    const next = extractOsdPayload(payload[keys[index]])
    if (next) {
      return next
    }
  }

  return null
}

function toNumber(value) {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : null
}

function extractPosition(payload) {
  const source = extractOsdPayload(payload) || payload
  if (!source || typeof source !== 'object') {
    return null
  }

  const longitude = toNumber(source.longitude)
  const latitude = toNumber(source.latitude)
  if (longitude === null || latitude === null) {
    return null
  }

  return {
    longitude,
    latitude,
    raw: source,
    receivedAt: Date.now()
  }
}

function buildClientId(userId, config) {
  return config.clientId || `dfr_${userId || 'guest'}_${Math.random().toString(16).slice(2, 10)}`
}

function reconnectDelay(attempt) {
  return Math.min(30000, 1000 * Math.pow(2, attempt))
}

function deepMerge(target, source) {
  if (!target) return source
  if (!source) return target
  const output = { ...target }
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        output[key] = deepMerge(output[key], source[key])
      } else {
        output[key] = source[key]
      }
    }
  }
  return output
}

export default {
  namespaced: true,
  state: {
    client: null,
    status: 'idle',
    latestMessages: {},
    lastUpdateTime: '',
    positions: {
      airport: null,
      drone: null
    },
    positionTimestamps: {
      airport: 0,
      drone: 0
    },
    reconnectAttempts: 0,
    reconnectTimer: null,
    manualDisconnect: false,
    subscribedTopics: []
  },
  mutations: {
    SET_STATUS(state, status) {
      state.status = status
    },
    SET_CLIENT(state, client) {
      state.client = client
    },
    SET_LAST_UPDATE_TIME(state, value) {
      state.lastUpdateTime = value
    },
    UPSERT_MESSAGE(state, payload) {
      const current = state.latestMessages[payload.topic] || { payload: {} }
      const actualData = extractOsdPayload(payload.payload) || payload.payload
      // Merge payload to keep old fields that were not updated
      const mergedPayload = deepMerge(current.payload, actualData)
      state.latestMessages = {
        ...state.latestMessages,
        [payload.topic]: {
          ...payload,
          payload: mergedPayload
        }
      }
    },
    CLEAR_MESSAGES(state) {
      state.latestMessages = {}
      state.lastUpdateTime = ''
      state.positions = {
        airport: null,
        drone: null
      }
      state.positionTimestamps = {
        airport: 0,
        drone: 0
      }
    },
    SET_POSITION(state, { kind, value }) {
      state.positions = {
        ...state.positions,
        [kind]: value
      }
      state.positionTimestamps = {
        ...state.positionTimestamps,
        [kind]: Date.now()
      }
    },
    SET_RECONNECT_ATTEMPTS(state, attempts) {
      state.reconnectAttempts = attempts
    },
    SET_RECONNECT_TIMER(state, timer) {
      state.reconnectTimer = timer
    },
    SET_MANUAL_DISCONNECT(state, manualDisconnect) {
      state.manualDisconnect = manualDisconnect
    },
    SET_SUBSCRIBED_TOPICS(state, topics) {
      state.subscribedTopics = topics.filter(Boolean)
    }
  },
  actions: {
    syncFromConfig({ rootState, dispatch }) {
      const mqttConfig = rootState.app.config.mqtt
      if (mqttConfig.url && (mqttConfig.airportSn || mqttConfig.droneSn)) {
        dispatch('connect')
      } else {
        dispatch('disconnect', { silent: true })
      }
    },
    connect({ state, rootState, commit, dispatch }) {
      const config = rootState.app.config.mqtt
      const userId = rootState.app.userId
      const topics = [topicFor(config.airportSn), topicFor(config.droneSn)].filter(Boolean)

      if (!config.url || topics.length === 0) {
        commit('SET_STATUS', 'idle')
        return
      }

      if (state.client && (state.status === 'connected' || state.status === 'connecting')) {
        return
      }

      if (state.reconnectTimer) {
        clearTimeout(state.reconnectTimer)
        commit('SET_RECONNECT_TIMER', null)
      }

      commit('SET_MANUAL_DISCONNECT', false)
      commit('SET_STATUS', 'connecting')
      commit('SET_SUBSCRIBED_TOPICS', topics)

      const options = {
        clean: true,
        reconnectPeriod: 0,
        connectTimeout: 10000,
        clientId: buildClientId(userId, config)
      }

      if (config.username) {
        options.username = config.username
      }
      if (config.password) {
        options.password = config.password
      }

      const client = mqtt.connect(config.url, options)
      commit('SET_CLIENT', client)

      client.on('connect', () => {
        commit('SET_STATUS', 'connected')
        commit('SET_RECONNECT_ATTEMPTS', 0)
        client.subscribe(topics, error => {
          if (error) {
            dispatch('scheduleReconnect')
          }
        })
      })

      client.on('message', (topic, message) => {
        try {
          const parsed = JSON.parse(message.toString())
          commit('UPSERT_MESSAGE', {
            topic,
            receivedAt: Date.now(),
            payload: parsed
          })
          commit('SET_LAST_UPDATE_TIME', new Date().toLocaleString('zh-CN'))

          const kind = topic.includes(config.airportSn) ? 'airport' : 'drone'
          const position = extractPosition(parsed)
          if (!position) {
            return
          }
          const lastTimestamp = state.positionTimestamps[kind] || 0
          if (Date.now() - lastTimestamp >= 1000) {
            commit('SET_POSITION', { kind, value: position })
          }
        } catch (error) {
          // Ignore malformed mqtt payloads.
        }
      })

      client.on('close', () => {
        commit('SET_CLIENT', null)
        if (!state.manualDisconnect) {
          dispatch('scheduleReconnect')
        } else {
          commit('SET_STATUS', 'idle')
        }
      })

      client.on('error', () => {
        client.end(true)
      })
    },
    scheduleReconnect({ state, commit, dispatch }) {
      if (state.manualDisconnect) {
        return
      }
      commit('SET_CLIENT', null)
      commit('SET_STATUS', 'reconnecting')
      const attempts = state.reconnectAttempts + 1
      commit('SET_RECONNECT_ATTEMPTS', attempts)
      const timer = setTimeout(() => {
        commit('SET_RECONNECT_TIMER', null)
        dispatch('connect')
      }, reconnectDelay(attempts))
      commit('SET_RECONNECT_TIMER', timer)
    },
    disconnect({ state, commit }, options = {}) {
      commit('SET_MANUAL_DISCONNECT', true)
      if (state.reconnectTimer) {
        clearTimeout(state.reconnectTimer)
        commit('SET_RECONNECT_TIMER', null)
      }
      if (state.client) {
        state.client.end(true)
        commit('SET_CLIENT', null)
      }
      commit('SET_STATUS', options.silent ? 'idle' : 'disconnected')
    },
    clearMessages({ commit }) {
      commit('CLEAR_MESSAGES')
    }
  }
}
