<template>
  <div class="history-container">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix card-header">
        <span><i class="fa-solid fa-clock-rotate-left"></i> 派遣历史记录</span>
        <div class="header-right">
          <span class="history-count">共 {{ historyList.length }} 条记录</span>
          <el-button type="danger" size="small" plain icon="el-icon-delete" @click="handleClear">
            清空记录
          </el-button>
        </div>
      </div>

      <div class="history-list" v-if="historyList.length > 0">
        <el-row :gutter="20">
          <el-col
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
            v-for="(item, index) in paginatedList"
            :key="index"
          >
            <el-card class="history-item-card" shadow="hover">
              <div class="hi-header">
                <span class="hi-time"
                  ><i class="fa-regular fa-clock"></i> {{ formatTime(item.timestamp) }}</span
                >
                <el-tag size="mini" :type="item.status === 'success' ? 'success' : 'danger'">
                  {{ item.status === 'success' ? '派遣成功' : '派遣失败' }}
                </el-tag>
              </div>
              <div class="hi-body">
                <div class="hi-row">
                  <span class="hi-label">任务名称:</span>
                  <span class="hi-value">{{ item.name }}</span>
                </div>
                <div class="hi-row">
                  <span class="hi-label">告警等级:</span>
                  <span class="hi-value">{{ item.level }} 级</span>
                </div>
                <div class="hi-row">
                  <span class="hi-label">经纬度:</span>
                  <span class="hi-value">{{ item.lon }}, {{ item.lat }}</span>
                </div>
                <div class="hi-desc">"{{ item.desc }}"</div>
                <div class="hi-actions">
                  <el-button type="text" size="small" @click="reselectPoint(item)">
                    <i class="fa-solid fa-location-crosshairs"></i> 在地图上重新定位
                  </el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <el-pagination
          background
          layout="prev, pager, next"
          :total="historyList.length"
          :page-size="pageSize"
          :current-page.sync="currentPage"
          class="pagination"
        >
        </el-pagination>
      </div>

      <div class="empty-state" v-else>
        <i class="fa-solid fa-box-open empty-icon"></i>
        <p>暂无派遣记录</p>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'History',
  data() {
    return {
      currentPage: 1,
      pageSize: 12
    }
  },
  computed: {
    historyList() {
      return this.$store.getters.history
    },
    paginatedList() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.historyList.slice(start, end)
    }
  },
  methods: {
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleString('zh-CN')
    },
    handleClear() {
      this.$confirm('确定要清空所有历史记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.dispatch('flight/clearHistory')
          this.$message.success('历史记录已清空')
          this.currentPage = 1
        })
        .catch(() => {})
    },
    reselectPoint(item) {
      this.$router.push({ path: '/map', query: { lon: item.lon, lat: item.lat } })
    }
  }
}
</script>

<style scoped>
.history-container {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.box-card {
  background: var(--panel-bg);
  border: 1px solid var(--border-color);
  color: var(--text-color);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-color);
  font-size: 1.2rem;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}
.history-count {
  font-size: 0.9rem;
  color: var(--text-muted);
}
.history-item-card {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  margin-bottom: 20px;
}
.hi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 10px;
}
.hi-time {
  font-size: 0.85rem;
  color: var(--text-muted);
}
.hi-row {
  font-size: 0.9rem;
  margin-bottom: 5px;
}
.hi-label {
  color: var(--text-muted);
  display: inline-block;
  width: 70px;
}
.hi-desc {
  margin-top: 10px;
  padding: 8px;
  background: rgba(100, 255, 218, 0.05);
  border-left: 3px solid var(--primary-color);
  font-size: 0.85rem;
  color: var(--text-muted);
  font-style: italic;
}
.hi-actions {
  margin-top: 15px;
  text-align: right;
}
.hi-actions .el-button {
  color: var(--primary-color);
}
.empty-state {
  text-align: center;
  padding: 50px 0;
  color: var(--text-muted);
}
.empty-icon {
  font-size: 3rem;
  margin-bottom: 10px;
  opacity: 0.5;
}
.pagination {
  margin-top: 20px;
  text-align: center;
}
::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: var(--primary-color);
  color: #0a192f;
}
::v-deep .el-card__header {
  border-bottom: 1px solid var(--border-color);
}
</style>
