<template>
  <ErrorBoundary>
    <div id="app">
      <router-view v-if="$store.getters.appReady" />
      <div v-else class="app-loading">
        <i class="el-icon-loading"></i>
        <span>正在初始化用户环境...</span>
      </div>
    </div>
  </ErrorBoundary>
</template>

<script>
import { parseEvent } from '@/utils/eventParser'

export default {
  name: 'App',
  computed: {
    webhookNotice() {
      return this.$store.getters.webhookNotice
    }
  },
  watch: {
    webhookNotice: {
      handler(notice) {
        if (!notice) {
          return
        }

        let title = '收到新的 Webhook 消息'
        let desc = ''

        try {
          const type = notice.payload?.type || '未知类型'
          const data = notice.payload?.data || notice.payload
          const parsedStr = parseEvent(type, data)
          // 提取第一行作为标题，其余作为内容
          const lines = parsedStr.split('\n')
          title = lines[0].trim() || title
          desc = lines.slice(1).join('\n')
        } catch (e) {
          desc = JSON.stringify(notice.payload)
        }

        this.$notify({
          title: title,
          message: desc,
          type: 'info',
          duration: 5000,
          onClick: () => {
            if (this.$route.path !== '/event-api') {
              this.$router.push('/event-api')
            }
          }
        })
        this.$store.dispatch('webhook/clearNotice')
      },
      deep: true
    }
  },
  async created() {
    await this.$store.dispatch('app/bootstrap')
    this.$store.dispatch('mqtt/syncFromConfig')
    this.$store.dispatch('webhook/connect')
  },
  mounted() {
    this.checkOrientation()
    window.addEventListener('resize', this.checkOrientation)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkOrientation)
    this.$store.dispatch('mqtt/disconnect', { silent: true })
  },
  methods: {
    checkOrientation() {
      if (window.innerWidth < window.innerHeight && window.innerWidth <= 768) {
        // Maybe show a toast that landscape is better, but it's optional
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei',
    '微软雅黑', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.app-loading {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--text-muted);
  font-size: 16px;
}
</style>
