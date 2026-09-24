import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css' // For responsive classes

import './styles/index.css' // Global styles

import ErrorBoundary from './components/ErrorBoundary.vue'

Vue.config.productionTip = false

Vue.use(ElementUI)

// Global Error Boundary Registration
Vue.component('ErrorBoundary', ErrorBoundary)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
