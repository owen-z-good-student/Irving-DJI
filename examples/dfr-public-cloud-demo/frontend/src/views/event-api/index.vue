<template>
  <div class="event-page">
    <el-card class="summary-card" shadow="never">
      <div class="summary-header">
        <div>
          <h3>Webhook 接收地址</h3>
          <el-input :value="webhookUrl" readonly></el-input>
        </div>
        <div class="summary-actions">
          <el-tag :type="socketStatus === 'connected' ? 'success' : 'warning'">
            {{ socketStatusText }}
          </el-tag>
          <el-button size="small" type="danger" plain @click="clearHistory"> 清空消息 </el-button>
        </div>
      </div>
    </el-card>

    <el-card class="list-card" shadow="never">
      <div slot="header" class="list-header">
        <span>Webhook 历史消息</span>
        <span>共 {{ total }} 条</span>
      </div>

      <el-empty v-if="items.length === 0" description="暂无 Event API 消息"></el-empty>

      <div v-else class="message-list">
        <div v-for="item in items" :key="item.id" class="message-item">
          <div class="message-head">
            <strong>{{ formatTime(item.receivedAt) }}</strong>
            <el-tag size="small">{{ item.ip || 'unknown' }}</el-tag>
          </div>
          <div class="message-body">
            <div class="parsed-content">
              <pre>{{ getParsedText(item.payload) }}</pre>
            </div>
            <details>
              <summary>查看原始 JSON 数据</summary>
              <pre class="raw-json">{{ formatJson(item.payload) }}</pre>
            </details>
          </div>
        </div>
      </div>

      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="page"
        :page-size="pageSize"
        :total="total"
        @current-change="handlePageChange"
      />
    </el-card>
  </div>
</template>

<script>
import { parseEvent } from '@/utils/eventParser'

export default {
  name: 'EventApi',
  computed: {
    webhookUrl() {
      return this.$store.getters.webhookUrl
    },
    items() {
      return this.$store.state.webhook.items
    },
    total() {
      return this.$store.state.webhook.total
    },
    page() {
      return this.$store.state.webhook.page
    },
    pageSize() {
      return this.$store.state.webhook.pageSize
    },
    socketStatus() {
      return this.$store.state.webhook.status
    },
    socketStatusText() {
      const dict = {
        idle: '未连接',
        connecting: '连接中',
        connected: '实时推送已连接',
        reconnecting: '推送重连中'
      }
      return dict[this.socketStatus] || '未知'
    }
  },
  created() {
    this.$store.dispatch('webhook/fetchList')
  },
  methods: {
    handlePageChange(page) {
      this.$store.dispatch('webhook/fetchList', { page, pageSize: this.pageSize })
    },
    async clearHistory() {
      await this.$store.dispatch('webhook/clearHistory')
      this.$message.success('Webhook 历史已清空')
    },
    formatTime(value) {
      return new Date(value).toLocaleString('zh-CN')
    },
    formatJson(value) {
      return JSON.stringify(value || {}, null, 2)
    },
    getParsedText(payload) {
      if (!payload) return '无内容'
      const type = payload.type || '未知类型'
      const data = payload.data || payload
      try {
        return parseEvent(type, data)
      } catch (e) {
        return '解析失败'
      }
    }
  }
}
</script>

<style scoped>
.event-page {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

.summary-card,
.list-card {
  margin-bottom: 20px;
  border: 1px solid var(--border-color);
}

.summary-header,
.list-header,
.message-head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.summary-header h3 {
  margin-top: 0;
}

.summary-actions {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.message-item {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  background: #fff;
}

.message-head strong {
  color: var(--text-color);
}

.message-body {
  margin: 0;
}

.parsed-content pre {
  margin: 0 0 10px 0;
  white-space: pre-wrap;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-color);
}

details summary {
  cursor: pointer;
  color: var(--primary-color);
  font-size: 13px;
  outline: none;
}

.raw-json {
  background: var(--bg-color);
  padding: 12px;
  border-radius: 4px;
  margin-top: 10px;
  font-family: monospace;
  font-size: 13px;
  overflow-x: auto;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .summary-header,
  .list-header,
  .message-head {
    flex-direction: column;
  }
}
</style>
