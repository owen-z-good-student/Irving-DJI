import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import flight from './modules/flight'
import mqtt from './modules/mqtt'
import webhook from './modules/webhook'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    flight,
    mqtt,
    webhook
  },
  getters: {
    systemConfig: state => state.app.config,
    appConfig: state => state.app.config?.dfrPost,
    userId: state => state.app.userId,
    webhookUrl: state => state.app.webhookUrl,
    history: state => state.flight.history,
    mqttStatus: state => state.mqtt.status,
    mqttMessages: state => state.mqtt.latestMessages,
    mqttPositions: state => state.mqtt.positions,
    mqttLastUpdateTime: state => state.mqtt.lastUpdateTime,
    webhookItems: state => state.webhook.items,
    webhookNotice: state => state.webhook.latestNotice,
    appReady: state => state.app.ready
  }
})
