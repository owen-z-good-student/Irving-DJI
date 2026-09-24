function getHistoryKey(userId) {
  return `flight_history_${userId || 'anonymous'}`
}

export default {
  namespaced: true,
  state: {
    history: [],
    currentUserId: ''
  },
  mutations: {
    SET_USER(state, userId) {
      state.currentUserId = userId || ''
    },
    SET_HISTORY(state, history) {
      state.history = Array.isArray(history) ? history : []
    },
    ADD_HISTORY(state, record) {
      state.history.unshift(record)
      if (state.history.length > 50) {
        state.history.pop()
      }
      localStorage.setItem(getHistoryKey(state.currentUserId), JSON.stringify(state.history))
    },
    CLEAR_HISTORY(state) {
      state.history = []
      localStorage.removeItem(getHistoryKey(state.currentUserId))
    }
  },
  actions: {
    loadLocalHistory({ commit }, userId) {
      commit('SET_USER', userId)
      const history = JSON.parse(localStorage.getItem(getHistoryKey(userId)) || '[]')
      commit('SET_HISTORY', history)
    },
    addHistory({ commit }, record) {
      commit('ADD_HISTORY', record)
    },
    clearHistory({ commit }) {
      commit('CLEAR_HISTORY')
    }
  }
}
