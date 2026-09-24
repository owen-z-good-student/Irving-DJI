<template>
  <div class="s3-page">
    <el-row :gutter="20">
      <el-col :xs="24" :lg="8">
        <el-card class="panel-card" shadow="never">
          <div slot="header" class="card-header">
            <span>存储桶</span>
            <div class="bucket-toolbar">
              <el-select v-model="bucketSort" size="small" @change="applyBucketSort">
                <el-option label="新到旧" value="newest"></el-option>
                <el-option label="旧到新" value="oldest"></el-option>
                <el-option label="名称 A-Z" value="nameAsc"></el-option>
                <el-option label="名称 Z-A" value="nameDesc"></el-option>
              </el-select>
              <el-button
                size="small"
                type="primary"
                plain
                @click="handleRefresh"
                :loading="loadingBuckets"
                >刷新</el-button
              >
            </div>
          </div>

          <div class="create-row">
            <el-button
              type="primary"
              class="create-bucket-button"
              @click="handleCreateBucket"
              :disabled="!minioReady"
              >创建新存储桶</el-button
            >
          </div>

          <el-alert
            v-if="!minioReady"
            :title="minioMessage"
            type="info"
            :closable="false"
            show-icon
          >
          </el-alert>
          <el-empty
            v-else-if="displayedBuckets.length === 0"
            description="暂无桶数据，请先创建存储桶"
          ></el-empty>
          <div v-else class="bucket-list">
            <div
              v-for="bucket in displayedBuckets"
              :key="bucket.name"
              class="bucket-item"
              :class="{ active: bucket.name === currentBucket }"
              @click="selectBucket(bucket.name)"
            >
              <div>
                <strong>{{ bucket.name }}</strong>
                <p>{{ formatTime(bucket.creationDate) }}</p>
              </div>
              <el-button
                size="mini"
                type="danger"
                plain
                @click.stop="handleDeleteBucket(bucket.name)"
              >
                删除
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="16">
        <el-card class="panel-card" shadow="never">
          <div slot="header" class="card-header">
            <div>
              <span>对象列表</span>
              <p class="path-text">
                {{ currentBucket || '未选择存储桶' }} / {{ currentPrefix || '/' }}
              </p>
            </div>
            <el-button size="small" :disabled="!currentBucket" @click="goParent"
              >返回上级</el-button
            >
          </div>

          <el-empty
            v-if="!minioReady"
            description="请先到“配置设置 -> 存储桶设置”中完成 MinIO 配置"
          ></el-empty>
          <el-empty v-else-if="!currentBucket" description="请先选择一个存储桶"></el-empty>

          <div v-else>
            <el-table :data="objects" stripe>
              <el-table-column label="名称" min-width="220">
                <template slot-scope="{ row }">
                  <el-button
                    v-if="row.type === 'folder'"
                    type="text"
                    @click="enterFolder(row.prefix)"
                  >
                    <i class="fa-regular fa-folder-open"></i> {{ row.name }}
                  </el-button>
                  <div v-else class="file-name-cell">
                    <span class="file-title"
                      ><i class="fa-regular fa-file"></i> {{ row.name }}</span
                    >
                    <div v-if="decodedTagName(row)" class="file-tag-line">
                      <span class="file-tag-label">司空平台名称</span>
                      <span class="file-tag-value">{{ decodedTagName(row) }}</span>
                    </div>
                    <div v-if="decodedTagPath(row)" class="file-tag-line">
                      <span class="file-tag-label">司空平台路径</span>
                      <span class="file-tag-value">{{ decodedTagPath(row) }}</span>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="大小" width="140">
                <template slot-scope="{ row }">
                  {{ row.type === 'folder' ? '-' : formatSize(row.size) }}
                </template>
              </el-table-column>
              <el-table-column label="修改时间" min-width="180">
                <template slot-scope="{ row }">
                  {{ row.lastModified ? formatTime(row.lastModified) : '-' }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120">
                <template slot-scope="{ row }">
                  <el-button
                    v-if="row.type === 'file'"
                    type="text"
                    @click="downloadFile(row.objectName)"
                  >
                    下载
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <div class="pager-wrap">
              <el-pagination
                background
                layout="prev, pager, next"
                :current-page="page"
                :page-size="pageSize"
                :total="total"
                @current-change="handlePageChange"
              />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  createBucket,
  deleteBucket,
  fetchBuckets,
  fetchDownloadUrl,
  fetchObjects
} from '@/api/minio'

export default {
  name: 'S3Storage',
  data() {
    return {
      buckets: [],
      bucketSort: 'newest',
      currentBucket: '',
      currentPrefix: '',
      objects: [],
      page: 1,
      pageSize: 20,
      total: 0,
      loadingBuckets: false,
      minioReady: true,
      minioMessage: '正在加载存储桶列表'
    }
  },
  computed: {
    displayedBuckets() {
      return [...this.buckets].sort((a, b) => this.compareBuckets(a, b))
    }
  },
  created() {
    this.loadBuckets()
  },
  methods: {
    async loadBuckets() {
      this.loadingBuckets = true
      try {
        const result = await fetchBuckets()
        this.minioReady = true
        this.minioMessage = ''
        this.buckets = result.items || []
        if (!this.currentBucket && this.displayedBuckets.length > 0) {
          this.selectBucket(this.displayedBuckets[0].name)
        } else if (
          this.currentBucket &&
          !this.buckets.some(bucket => bucket.name === this.currentBucket)
        ) {
          this.currentBucket = ''
          this.objects = []
          if (this.displayedBuckets.length > 0) {
            this.selectBucket(this.displayedBuckets[0].name)
          }
        }
      } catch (error) {
        this.buckets = []
        this.objects = []
        this.currentBucket = ''
        if (
          error.response?.data?.code === 'MINIO_NOT_CONFIGURED' ||
          error.response?.status === 400
        ) {
          this.minioReady = false
          this.minioMessage = '请先到“配置设置 -> 存储桶设置”中填写 MinIO 地址、密钥后再使用'
          return
        }
        this.minioReady = false
        this.minioMessage = error.response?.data?.message || '存储桶加载失败，请检查 MinIO 服务状态'
      } finally {
        this.loadingBuckets = false
      }
    },
    async handleRefresh() {
      await this.loadBuckets()
      if (this.currentBucket && this.minioReady) {
        await this.loadObjects()
      }
    },
    applyBucketSort() {
      if (!this.currentBucket && this.displayedBuckets.length > 0) {
        this.selectBucket(this.displayedBuckets[0].name)
      }
    },
    compareBuckets(a, b) {
      if (this.bucketSort === 'oldest') {
        return new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime()
      }
      if (this.bucketSort === 'nameAsc') {
        return a.name.localeCompare(b.name, 'zh-CN')
      }
      if (this.bucketSort === 'nameDesc') {
        return b.name.localeCompare(a.name, 'zh-CN')
      }
      return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
    },
    async selectBucket(bucket) {
      this.currentBucket = bucket
      this.currentPrefix = ''
      this.page = 1
      await this.loadObjects()
    },
    async loadObjects() {
      if (!this.currentBucket || !this.minioReady) {
        return
      }
      const result = await fetchObjects({
        bucket: this.currentBucket,
        prefix: this.currentPrefix,
        page: this.page,
        pageSize: this.pageSize
      })
      this.objects = result.items || []
      this.total = result.total || 0
    },
    async handleCreateBucket() {
      if (!this.minioReady) {
        this.$message.warning('请先完成 MinIO 配置')
        this.$router.push('/config')
        return
      }
      let bucketName = ''
      try {
        const { value } = await this.$prompt('请输入存储桶名称', '创建新存储桶', {
          confirmButtonText: '确认创建',
          cancelButtonText: '取消',
          inputValue: '',
          inputPattern: /^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/,
          inputErrorMessage: '名称需为 3-63 位，仅支持小写字母、数字、点和中划线',
          inputValidator: value => {
            const name = String(value || '').trim()
            if (!name) {
              return '请输入存储桶名称'
            }
            if (this.buckets.some(bucket => bucket.name === name)) {
              return '该存储桶名称已存在'
            }
            return true
          }
        })
        bucketName = String(value || '').trim()
      } catch (error) {
        return
      }
      await createBucket(bucketName)
      this.$message.success('存储桶创建成功')
      await this.loadBuckets()
      await this.selectBucket(bucketName)
    },
    async handleDeleteBucket(name) {
      if (!this.minioReady) {
        return
      }
      await deleteBucket(name)
      this.$message.success('存储桶删除成功')
      if (name === this.currentBucket) {
        this.currentBucket = ''
        this.objects = []
      }
      this.loadBuckets()
    },
    enterFolder(prefix) {
      this.currentPrefix = prefix
      this.page = 1
      this.loadObjects()
    },
    goParent() {
      if (!this.currentPrefix) {
        return
      }
      const segments = this.currentPrefix.split('/').filter(Boolean)
      segments.pop()
      this.currentPrefix = segments.length ? `${segments.join('/')}/` : ''
      this.page = 1
      this.loadObjects()
    },
    async downloadFile(objectName) {
      if (!this.minioReady) {
        return
      }
      const result = await fetchDownloadUrl({
        bucket: this.currentBucket,
        objectName
      })
      window.open(result.url, '_blank')
    },
    handlePageChange(page) {
      this.page = page
      this.loadObjects()
    },
    formatSize(size) {
      if (!size && size !== 0) {
        return '-'
      }
      if (size < 1024) return `${size} B`
      if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`
      if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(2)} MB`
      return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`
    },
    formatTime(value) {
      return new Date(value).toLocaleString('zh-CN')
    },
    decodeBase64(value) {
      if (!value) {
        return ''
      }
      try {
        const binary = window.atob(value)
        const bytes = Uint8Array.from(binary, char => char.charCodeAt(0))
        return new TextDecoder('utf-8').decode(bytes)
      } catch (error) {
        return ''
      }
    },
    decodedTagName(row) {
      return this.decodeBase64(row.tags?.name_base64 || '')
    },
    decodedTagPath(row) {
      return this.decodeBase64(row.tags?.path_base64 || '')
    }
  }
}
</script>

<style scoped>
.s3-page {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

.panel-card {
  margin-bottom: 20px;
  border: 1px solid var(--border-color);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.bucket-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.path-text {
  margin: 6px 0 0;
  color: var(--text-muted);
  font-size: 12px;
}

.create-row {
  margin-bottom: 16px;
}

.create-bucket-button {
  width: 100%;
}

.bucket-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bucket-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  cursor: pointer;
}

.bucket-item.active {
  border-color: var(--primary-color);
  background: #f0f8ff;
}

.bucket-item p {
  margin: 6px 0 0;
  color: var(--text-muted);
  font-size: 12px;
}

.file-name-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px 0;
}

.file-title {
  color: var(--text-primary);
}

.file-tag-line {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  line-height: 1.5;
  font-size: 12px;
}

.file-tag-label {
  flex: 0 0 78px;
  color: var(--text-muted);
}

.file-tag-value {
  color: var(--text-secondary);
  word-break: break-all;
}

.pager-wrap {
  margin-top: 20px;
  text-align: right;
}
</style>
