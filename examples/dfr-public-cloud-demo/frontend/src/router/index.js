import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../layout/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/map',
    children: [
      {
        path: 'map',
        name: 'Map',
        component: () => import('../views/map/index.vue'),
        meta: { title: '项目地图', icon: 'fa-solid fa-map-location-dot' }
      },
      {
        path: 'mqtt',
        name: 'Mqtt',
        component: () => import('../views/mqtt/index.vue'),
        meta: { title: 'MQTT信息', icon: 'fa-solid fa-satellite-dish' }
      },
      {
        path: 'wayline',
        name: 'Wayline',
        component: () => import('../views/wayline/index.vue'),
        meta: { title: '巡检航线', icon: 'fa-solid fa-route' }
      },
      {
        path: 'event-api',
        name: 'EventApi',
        component: () => import('../views/event-api/index.vue'),
        meta: { title: 'Event API信息', icon: 'fa-solid fa-bell' }
      },
      {
        path: 's3',
        name: 'S3Storage',
        component: () => import('../views/s3/index.vue'),
        meta: { title: 'S3存储桶', icon: 'fa-solid fa-box-archive' }
      },
      {
        path: 'config',
        name: 'Config',
        component: () => import('../views/config/index.vue'),
        meta: { title: '配置设置', icon: 'fa-solid fa-gears' }
      }
    ]
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
