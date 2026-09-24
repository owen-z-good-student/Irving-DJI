<template>
  <div class="wayline-page">
    <el-alert
      class="intro-alert"
      :type="configured ? 'success' : 'warning'"
      :closable="false"
      show-icon
      :title="configured ? '航线同步已就绪' : '请先完成配置'"
      :description="introText">
    </el-alert>

    <el-card class="section" shadow="never">
      <div slot="header"><span>上传航线</span></div>
      <el-upload
        drag
        action=""
        :auto-upload="false"
        :show-file-list="false"
        :on-change="handleFileChange"
        :disabled="!configured"
        accept=".kmz,.kml">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将航线文件拖到此处，或<em>点击选择</em></div>
        <div class="el-upload__tip" slot="tip">支持 .kmz / .kml，单文件不超过 50MB</div>
      </el-upload>
      <div v-if="pendingFile" class="pending-file">
        待上传：{{ pendingFile.name }}（{{ formatSize(pendingFile.size) }}）
        <el-button type="primary" size="small" :loading="uploading" @click="doUpload">
          写入同步目录
        </el-button>
      </div>
    </el-card>

    <el-card class="section" shadow="never">
      <div slot="header">
        <span>航线列表</span>
        <span class="list-hint">（含司空 2 侧同步下来的航线，支持多组织 / 多项目）</span>
        <el-button style="float: right" size="mini" @click="loadList">刷新</el-button>
      </div>

      <el-table
        :data="waylines"
        size="small"
        v-loading="loading"
        empty-text="同步目录中暂无航线">
        <el-table-column type="expand">
          <template slot-scope="{ row }">
            <el-descriptions class="detail" :column="2" size="small" border>
              <el-descriptions-item label="航线 ID">
                <code>{{ row.waylineId }}</code>
              </el-descriptions-item>
              <el-descriptions-item label="所属文件夹">
                {{ row.folder || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="组织 UUID">
                <code>{{ row.orgUuid || '-' }}</code>
              </el-descriptions-item>
              <el-descriptions-item label="项目 UUID">
                <code>{{ row.projectUuid || '-' }}</code>
              </el-descriptions-item>
              <el-descriptions-item label="存储桶">{{ row.bucket }}</el-descriptions-item>
              <el-descriptions-item label="目录前缀">
                {{ row.prefix || '(根目录)' }}
              </el-descriptions-item>
              <el-descriptions-item label="同步目录" :span="2">
                <code class="path">{{ row.syncDir }}</code>
              </el-descriptions-item>
              <el-descriptions-item label="对象文件名" :span="2">
                <code class="path">{{ row.fileName }}</code>
              </el-descriptions-item>
            </el-descriptions>
          </template>
        </el-table-column>

        <el-table-column label="航线名称" min-width="220">
          <template slot-scope="{ row }">
            <span class="wayline-name">{{ row.displayName }}</span>
            <el-tag v-if="row.source === 'fh2'" type="success" size="mini" style="margin-left:6px">
              司空 2 同步
            </el-tag>
            <el-tag v-else-if="row.source === 'local'" type="primary" size="mini" style="margin-left:6px">
              本端上传
            </el-tag>
            <el-tag v-if="!row.inSyncDir" type="warning" size="mini" style="margin-left:6px">
              不在同步目录
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="项目" width="130">
          <template slot-scope="{ row }">
            <span class="uuid-short">{{ shortUuid(row.projectUuid) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="组织" width="130">
          <template slot-scope="{ row }">
            <span class="uuid-short">{{ shortUuid(row.orgUuid) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="大小" width="90">
          <template slot-scope="{ row }">{{ formatSize(row.size) }}</template>
        </el-table-column>

        <el-table-column label="最后修改" width="160">
          <template slot-scope="{ row }">{{ formatTime(row.lastModified) }}</template>
        </el-table-column>

        <el-table-column label="操作" width="90">
          <template slot-scope="{ row }">
            <el-button size="mini" type="danger" plain @click="doDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-footer">
        点击行首箭头可展开查看该航线的完整来源信息（组织、项目、存储桶、同步目录）。<br />
        <strong>路径说明</strong>：司空 2 下发的航线会自动多一层头部目录（<code>wayline/fh_sync/...</code>），
        而本端上传须写入 <code>fh_sync/{组织}/{项目}/wayline/</code>（头部不带前缀），这是司空 2 同步的方向差异，属正常现象。<br />
        说明：本目录与司空 2 航线库为<strong>双向增量同步</strong>——两侧新增的文件会互相同步，
        但删除<strong>不会</strong>传播。此处删除仅移除存储桶中的副本，司空 2 航线库中的航线仍然保留。
      </div>
    </el-card>

    <el-alert
      class="task-alert"
      type="info"
      :closable="false"
      show-icon
      title="关于创建飞行任务"
      description="航线同步不依赖 OpenAPI，但「创建飞行任务」仍需调用司空 2 /openapi/v0.1/flight-task 接口，本 Demo 未接通。请参考 ARCHITECTURE.md 与 Apifox 文档自行实现。">
    </el-alert>
  </div>
</template>

<script>
import { uploadWayline, fetchWaylines, deleteWayline } from '@/api/wayline'

export default {
  name: 'WaylineInspection',
  data() {
    return {
      pendingFile: null,
      uploading: false,
      loading: false,
      waylines: [],
      configured: false
    }
  },
  computed: {
    introText() {
      if (!this.configured) {
        return '司空 2 的 FlightHub Sync 支持挂载 S3 兼容外部存储桶，配置「存储配置」+「同步规则」后双端双向增量同步。请先在「配置设置」中填写航线同步存储桶。'
      }
      return '航线写入同步目录后，司空 2 会自动收录到航线库；司空 2 中新建的航线也会出现在此列表。列表支持来自多个组织与项目的航线，展开行可查看各自来源。'
    }
  },
  created() {
    this.loadList()
  },
  methods: {
    formatSize(bytes) {
      if (!bytes) return '0 B'
      if (bytes < 1024) return bytes + ' B'
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
      return (bytes / 1024 / 1024).toFixed(1) + ' MB'
    },
    formatTime(value) {
      if (!value) return '-'
      return new Date(value).toLocaleString()
    },
    shortUuid(uuid) {
      if (!uuid) return '-'
      return uuid.slice(0, 8)
    },
    handleFileChange(file) {
      this.pendingFile = file.raw
    },
    async doUpload() {
      if (!this.pendingFile) return
      this.uploading = true
      try {
        const res = await uploadWayline(this.pendingFile)
        this.$message.success(res.notice || '航线已写入同步目录')
        this.pendingFile = null
        await this.loadList()
      } finally {
        this.uploading = false
      }
    },
    async loadList() {
      this.loading = true
      try {
        const res = await fetchWaylines()
        this.waylines = res.items || []
        this.configured = Boolean(res.configured)
      } finally {
        this.loading = false
      }
    },
    async doDelete(row) {
      try {
        await this.$confirm(
          `仅删除存储桶中的「${row.displayName}」，司空 2 航线库中的对应航线不受影响（同步为增量，删除不传播）。确认继续？`,
          '确认删除',
          { type: 'warning', confirmButtonText: '确认删除', cancelButtonText: '取消' }
        )
      } catch (e) {
        return
      }
      await deleteWayline(row.objectName)
      this.$message.success('已删除')
      await this.loadList()
    }
  }
}
</script>

<style scoped>
.wayline-page {
  padding: 16px;
}
.intro-alert,
.task-alert {
  margin-bottom: 16px;
}
.section {
  margin-bottom: 16px;
}
.pending-file {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.list-hint {
  color: #909399;
  font-size: 12px;
}
.wayline-name {
  font-weight: 500;
}
.uuid-short {
  font-family: monospace;
  font-size: 12px;
  color: #606266;
}
.detail {
  margin: 8px 16px;
}
.detail code,
.uuid-short {
  word-break: break-all;
}
.path {
  font-size: 12px;
  color: #409eff;
  word-break: break-all;
}
.table-footer {
  margin-top: 12px;
  color: #909399;
  font-size: 12px;
  line-height: 1.8;
}
</style>
