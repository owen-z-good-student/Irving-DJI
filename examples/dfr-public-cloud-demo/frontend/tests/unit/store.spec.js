import app from '@/store/modules/app'
import flight from '@/store/modules/flight'

jest.mock('@/api/system', () => ({
  bootstrapUser: jest.fn(),
  fetchConfig: jest.fn(),
  updateConfig: jest.fn()
}))

describe('Store Modules', () => {
  describe('app', () => {
    it('sets config correctly', () => {
      const state = { config: null }
      const config = {
        dfrPost: { url: 'test', token: '123' },
        mqtt: {},
        streaming: {},
        minio: {},
        map: {},
        webhook: {}
      }
      app.mutations.SET_CONFIG(state, config)
      expect(state.config.dfrPost.url).toBe('test')
      expect(state.config.dfrPost.token).toBe('123')
      expect(state.config.mqtt.url).toBe('ws://127.0.0.1:8083/mqtt')
      expect(state.config.webhook.messageLimit).toBe(100)
    })
  })

  describe('flight', () => {
    it('adds history and keeps only 50 items', () => {
      const state = { history: [], currentUserId: 'user-1' }
      for (let i = 0; i < 55; i++) {
        flight.mutations.ADD_HISTORY(state, { id: i })
      }
      expect(state.history.length).toBe(50)
      expect(state.history[0].id).toBe(54)
    })

    it('clears history', () => {
      const state = { history: [{ id: 1 }], currentUserId: 'user-1' }
      flight.mutations.CLEAR_HISTORY(state)
      expect(state.history.length).toBe(0)
    })
  })
})
