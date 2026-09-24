<template>
  <header class="app-header">
    <div class="logo">
      <i class="fa-solid fa-paper-plane"></i>
      <h1>司空2 集成能力演示Demo【请勿用于生产环境】</h1>
    </div>
    <div class="header-right hidden-xs-only">
      <span class="user-tag">用户 {{ shortUserId }}</span>
      <span class="current-time">{{ currentTime }}</span>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  data() {
    return {
      currentTime: '',
      timer: null
    }
  },
  computed: {
    shortUserId() {
      const userId = this.$store.getters.userId || '未初始化'
      return userId.length > 12 ? `${userId.slice(0, 8)}...` : userId
    }
  },
  created() {
    this.updateTime()
    this.timer = setInterval(this.updateTime, 1000)
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    updateTime() {
      const now = new Date()
      this.currentTime = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }
  }
}
</script>

<style scoped>
.app-header {
  height: 60px;
  background: var(--header-bg, #001529); /* 对应图片的深色头部 */
  border-bottom: 1px solid rgba(255, 255, 255, 0.1); /* 图片中没有明显的白色边框，稍微加一点深色分隔或者不要 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 10;
}
.logo {
  display: flex;
  align-items: center;
  color: var(--primary-color); /* 图片中的纸飞机图标是蓝色的 */
  font-size: 1.4rem;
}
.logo h1 {
  margin: 0 0 0 10px;
  font-size: 1.4rem;
  color: #ffffff; /* 标题文字是白色的 */
  font-weight: bold;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}
.user-tag {
  color: rgba(255, 255, 255, 0.85);
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(24, 144, 255, 0.2);
  font-family: monospace;
}
.current-time {
  color: rgba(255, 255, 255, 0.85); /* 时间文字变半透明白 */
  font-family: monospace;
  font-size: 0.95rem; /* 图片中字体比较小 */
}
@media (max-width: 768px) {
  .logo h1 {
    font-size: 1rem;
  }
  .app-header {
    padding: 0 10px;
  }
}
</style>
