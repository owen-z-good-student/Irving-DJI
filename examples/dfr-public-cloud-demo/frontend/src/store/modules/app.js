import { bootstrapUser, fetchConfig, resetUser, updateConfig } from '@/api/system'
import {
  LOCAL_STORAGE_KEYS,
  cloneDefaultConfig,
  mergeDeep,
  normalizeConfig
} from '@/constants/defaultConfig'

function getStoredConfig() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.config)
    return raw ? normalizeConfig(JSON.parse(raw)) : cloneDefaultConfig()
  } catch (error) {
    return cloneDefaultConfig()
  }
}

function persistConfig(config) {
  localStorage.setItem(LOCAL_STORAGE_KEYS.config, JSON.stringify(config))
}

function getStoredLocalMap() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.localMap)
    if (!raw) {
      return null
    }
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.center) || typeof parsed.zoom !== 'number') {
      return null
    }
    return parsed
  } catch (error) {
    return null
  }
}

function persistLocalMap(mapConfig) {
  localStorage.setItem(LOCAL_STORAGE_KEYS.localMap, JSON.stringify(mapConfig))
}

function clearLocalState() {
  localStorage.clear()
}

export default {
  namespaced: true,
  state: {
    userId: localStorage.getItem(LOCAL_STORAGE_KEYS.userId) || '',
    webhookUrl: '',
    config: getStoredConfig(),
    ready: false,
    syncing: false
  },
  mutations: {
    SET_USER_ID(state, userId) {
      state.userId = userId || ''
      if (userId) {
        localStorage.setItem(LOCAL_STORAGE_KEYS.userId, userId)
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.userId)
      }
    },
    SET_WEBHOOK_URL(state, webhookUrl) {
      state.webhookUrl = webhookUrl || ''
    },
    SET_CONFIG(state, config) {
      state.config = normalizeConfig(config)
      persistConfig(state.config)
    },
    SET_READY(state, ready) {
      state.ready = ready
    },
    SET_SYNCING(state, syncing) {
      state.syncing = syncing
    }
  },
  actions: {
    async bootstrap({ commit, dispatch, state }) {
      commit('SET_READY', false)

      if (state.userId) {
        dispatch('flight/loadLocalHistory', state.userId, { root: true })
      }

      try {
        const result = await bootstrapUser()
        const localMap = getStoredLocalMap()
        commit('SET_USER_ID', result.userId)
        commit('SET_WEBHOOK_URL', result.webhookUrl)
        commit(
          'SET_CONFIG',
          localMap ? mergeDeep(result.config || {}, { map: localMap }) : result.config
        )
        dispatch('flight/loadLocalHistory', result.userId, { root: true })
      } catch (error) {
        if (state.userId) {
          try {
            const result = await fetchConfig()
            const localMap = getStoredLocalMap()
            commit('SET_USER_ID', result.userId)
            commit('SET_WEBHOOK_URL', result.webhookUrl)
            commit(
              'SET_CONFIG',
              localMap
                ? mergeDeep(mergeDeep(state.config, result.config || {}), { map: localMap })
                : mergeDeep(state.config, result.config || {})
            )
          } catch (innerError) {
            // Keep local cache when backend is unavailable.
          }
        }
      } finally {
        commit('SET_READY', true)
      }
    },
    async saveConfig({ commit, state }, payload) {
      const nextConfig = normalizeConfig(mergeDeep(state.config, payload))
      commit('SET_CONFIG', nextConfig)
      commit('SET_SYNCING', true)
      try {
        const result = await updateConfig(payload)
        commit('SET_USER_ID', result.userId)
        commit('SET_WEBHOOK_URL', result.webhookUrl)
        commit('SET_CONFIG', result.config)
      } finally {
        commit('SET_SYNCING', false)
      }
    },
    saveLocalMapConfig({ commit, state }, mapConfig) {
      const nextConfig = normalizeConfig(
        mergeDeep(state.config, {
          map: mapConfig
        })
      )
      persistLocalMap(nextConfig.map)
      commit('SET_CONFIG', nextConfig)
      return nextConfig.map
    },
    async resetEnvironment({ commit, dispatch }) {
      const result = await resetUser()
      clearLocalState()
      commit('SET_USER_ID', result.userId)
      commit('SET_WEBHOOK_URL', result.webhookUrl)
      commit('SET_CONFIG', result.config)
      dispatch('flight/loadLocalHistory', result.userId, { root: true })
      return result
    }
  }
}
