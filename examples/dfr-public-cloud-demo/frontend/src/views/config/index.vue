<template>
  <div class="config-container">
    <el-card class="summary-card" shadow="never">
      <div class="summary-line">
        <span>当前用户 ID</span>
        <div class="user-id-text">{{ userId || '未初始化' }}</div>
      </div>
      <div class="summary-line">
        <span>EventAPI 地址</span>
        <el-input :value="webhookUrl" readonly></el-input>
      </div>
      <div class="summary-tip">所有设置自动同步，无需手动点击保存。</div>
    </el-card>

    <el-card class="box-card" shadow="never">
      <div slot="header" class="card-header">
        <span>1. DFR POST 设置</span>
        <div class="header-actions">
          <el-button type="text" @click="toggleAdvanced('dfrPost')">
            {{ advancedOpen.dfrPost ? '收起高级项' : '展开高级项' }}
          </el-button>
          <el-tag size="small">{{ syncing ? '同步中' : '已自动保存' }}</el-tag>
        </div>
      </div>

      <div class="parse-section">
        <p class="section-title">智能解析</p>
        <el-input
          v-model="parseText"
          type="textarea"
          :rows="4"
          placeholder="将接口文档片段粘贴到这里，可自动解析 DFR POST 相关字段"
        />
        <el-button class="mt-10" type="primary" plain @click="handleParse">一键解析</el-button>
      </div>

      <el-form label-position="top">
        <el-row :gutter="20">
          <el-col :xs="24" :md="12">
            <el-form-item label="X-User-Token">
              <el-input v-model="form.dfrPost.token" @input="queueSave('dfrPost')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :xs="24" :md="8">
            <el-form-item label="Project UUID">
              <el-input v-model="form.dfrPost.project" @input="queueSave('dfrPost')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="8">
            <el-form-item label="Workflow UUID">
              <el-input v-model="form.dfrPost.workflow" @input="queueSave('dfrPost')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-collapse-transition>
          <div v-show="advancedOpen.dfrPost">
            <el-row :gutter="20">
              <el-col :xs="24" :md="12">
                <el-form-item label="POST 地址">
                  <el-input v-model="form.dfrPost.url" @input="queueSave('dfrPost')"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :xs="24" :md="8">
                <el-form-item label="Creator">
                  <el-input v-model="form.dfrPost.creator" @input="queueSave('dfrPost')"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-collapse-transition>
      </el-form>
    </el-card>

    <el-card class="box-card" shadow="never">
      <div slot="header" class="card-header">
        <span>2. MQTT 设置</span>
        <div class="header-actions">
          <el-button type="text" @click="toggleAdvanced('mqtt')">
            {{ advancedOpen.mqtt ? '收起高级项' : '展开高级项' }}
          </el-button>
          <el-tag :type="mqttStatus === 'connected' ? 'success' : 'info'" size="small">
            {{ mqttStatusText }}
          </el-tag>
        </div>
      </div>

      <el-form label-position="top">
        <el-row :gutter="20">
          <el-col :xs="24" :md="12">
            <el-form-item label="机场 SN">
              <el-input v-model="form.mqtt.airportSn" @input="queueSave('mqtt', true)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12">
            <el-form-item label="无人机 SN">
              <el-input v-model="form.mqtt.droneSn" @input="queueSave('mqtt', true)"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-collapse-transition>
          <div v-show="advancedOpen.mqtt">
            <el-row :gutter="20">
              <el-col :xs="24" :md="12">
                <el-form-item label="MQTT 地址">
                  <el-input v-model="form.mqtt.url" @input="queueSave('mqtt', true)"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :md="6">
                <el-form-item label="用户名">
                  <el-input
                    v-model="form.mqtt.username"
                    @input="queueSave('mqtt', true)"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :md="6">
                <el-form-item label="密码">
                  <el-input
                    v-model="form.mqtt.password"
                    show-password
                    type="password"
                    @input="queueSave('mqtt', true)"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-collapse-transition>
      </el-form>
    </el-card>

    <el-card class="box-card" shadow="never">
      <div slot="header" class="card-header">
        <span>3. 直播设置</span>
        <div v-if="advancedPermissionUnlocked" class="header-actions">
          <el-button type="text" @click="toggleAdvanced('streaming')">
            {{ advancedOpen.streaming ? '收起高级项' : '展开高级项' }}
          </el-button>
          <el-button size="small" type="primary" plain @click="handleRefreshStreams">
            重新生成地址
          </el-button>
        </div>
      </div>

      <div class="stream-grid">
        <div class="stream-card">
          <h4>机场视频</h4>
          <p>RTMP 推流地址</p>
          <el-input :value="form.streaming.airport.rtmpUrl" readonly></el-input>
          <el-collapse-transition>
            <div v-show="advancedPermissionUnlocked && advancedOpen.streaming">
              <p>HTTP-FLV 播放地址</p>
              <el-input :value="form.streaming.airport.flvUrl" readonly></el-input>
            </div>
          </el-collapse-transition>
        </div>
        <div class="stream-card">
          <h4>无人机视频</h4>
          <p>RTMP 推流地址</p>
          <el-input :value="form.streaming.drone.rtmpUrl" readonly></el-input>
          <el-collapse-transition>
            <div v-show="advancedPermissionUnlocked && advancedOpen.streaming">
              <p>HTTP-FLV 播放地址</p>
              <el-input :value="form.streaming.drone.flvUrl" readonly></el-input>
            </div>
          </el-collapse-transition>
        </div>
      </div>
      <el-collapse-transition>
        <div v-show="advancedPermissionUnlocked && advancedOpen.streaming">
          <el-form label-position="top" class="advanced-block">
            <el-row :gutter="20">
              <el-col :xs="24" :md="12">
                <el-form-item label="服务主机/IP">
                  <el-input
                    v-model="form.streaming.serverHost"
                    placeholder="例如 192.168.1.10 或 dfr.example.com"
                    @input="queueSave('streaming')"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-collapse-transition>
    </el-card>

    <el-card class="box-card" shadow="never">
      <div slot="header" class="card-header">
        <span>4. 存储桶设置</span>
        <div class="header-actions">
          <el-button type="text" @click="toggleAdvanced('minio')">
            {{ advancedOpen.minio ? '收起配置项' : '展开配置项' }}
          </el-button>
          <el-button
            size="small"
            type="primary"
            plain
            :loading="testingMinio"
            @click="handleTestMinio"
          >
            测试连接
          </el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div v-show="advancedOpen.minio">
          <el-form label-position="top">
            <el-row :gutter="20">
              <el-col :xs="24" :md="8">
                <el-form-item label="EndPoint">
                  <el-input v-model="form.minio.endPoint" @input="queueSave('minio')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :md="4">
                <el-form-item label="Port">
                  <el-input-number
                    v-model="form.minio.port"
                    :min="1"
                    :max="65535"
                    @change="queueSave('minio')"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :md="4">
                <el-form-item label="SSL">
                  <el-switch v-model="form.minio.useSSL" @change="queueSave('minio')"></el-switch>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :md="4">
                <el-form-item label="Access Key">
                  <el-input v-model="form.minio.accessKey" @input="queueSave('minio')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :md="4">
                <el-form-item label="Secret Key">
                  <el-input
                    v-model="form.minio.secretKey"
                    show-password
                    type="password"
                    @input="queueSave('minio')"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-divider content-position="left">
              航线同步（需与司空 2 FlightHub Sync 挂载的桶一致）
            </el-divider>
            <el-alert
              class="wayline-tip"
              type="info"
              :closable="false"
              show-icon
              description="司空 2 的 FlightHub Sync 支持挂载 S3 兼容外部存储桶，配置「存储配置」+「同步规则」后双端新增文件双向同步。此处的桶与「目录前缀」必须与司空 2 存储配置中的桶名、预设路径完全一致，航线才能被自动收录。司空 2 预设路径留空时，此处也应留空。">
            </el-alert>
            <el-row :gutter="20">
              <el-col :xs="24" :md="8">
                <el-form-item label="航线同步存储桶">
                  <el-input
                    v-model="form.wayline.bucket"
                    placeholder="例如：dfr-wayline"
                    @input="queueSave('minio')"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :md="8">
                <el-form-item label="航线目录前缀">
                  <el-input
                    v-model="form.wayline.prefix"
                    placeholder="通常留空；须与司空 2 存储配置的「预设路径」完全一致"
                    @input="queueSave('minio')"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-collapse-transition>
    </el-card>

    <el-card class="box-card" shadow="never">
      <div slot="header" class="card-header">
        <span>5. 地图默认设置（存储于本地浏览器）</span>
      </div>

      <el-form label-position="top">
        <el-row :gutter="20">
          <el-col :xs="24" :md="8">
            <el-form-item label="默认经度">
              <el-input-number
                v-model="form.map.center[0]"
                :step="0.000001"
                :precision="6"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="8">
            <el-form-item label="默认纬度">
              <el-input-number
                v-model="form.map.center[1]"
                :step="0.000001"
                :precision="6"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="8">
            <el-form-item label="默认缩放">
              <el-input-number v-model="form.map.zoom" :min="1" :max="20"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="map-setting-actions">
          <div class="map-setting-tip">仅保存在当前浏览器，本项不会自动同步到云端。</div>
          <el-button type="primary" @click="handleApplyMapSettings">应用</el-button>
        </div>
      </el-form>
    </el-card>

    <el-card v-if="advancedPermissionUnlocked" class="box-card danger-card" shadow="never">
      <div slot="header" class="card-header">
        <span>6. 环境重置</span>
      </div>
      <div class="danger-content">
        <p>点击后会删除当前浏览器 LocalStorage、清空当前本地环境，并生成一个全新的用户。</p>
        <el-button type="danger" :loading="resetting" @click="handleFullReset">完全重置</el-button>
      </div>
    </el-card>

    <div class="advanced-permission-entry">
      <button
        type="button"
        class="advanced-permission-link"
        @click="handleUnlockAdvancedPermission"
      >
        高级权限设置
      </button>
      <span v-if="advancedPermissionUnlocked" class="advanced-permission-status">已解锁</span>
    </div>
    <div class="config-version">Ver.0521</div>
  </div>
</template>

<script>
import { refreshStreams } from '@/api/system'
import { testMinioConnection } from '@/api/minio'
import { normalizeConfig } from '@/constants/defaultConfig'

const ADVANCED_PERMISSION_PASSWORD = 'djient2026**&@qox#'

export default {
  name: 'Config',
  data() {
    return {
      parseText: '',
      form: normalizeConfig(this.$store.getters.systemConfig),
      timers: {},
      testingMinio: false,
      resetting: false,
      advancedPermissionUnlocked: false,
      advancedOpen: {
        dfrPost: false,
        mqtt: false,
        streaming: false,
        minio: false
      }
    }
  },
  computed: {
    userId() {
      return this.$store.getters.userId
    },
    webhookUrl() {
      return this.$store.getters.webhookUrl
    },
    syncing() {
      return this.$store.state.app.syncing
    },
    mqttStatus() {
      return this.$store.getters.mqttStatus
    },
    mqttStatusText() {
      const dict = {
        idle: '未连接',
        connecting: '连接中',
        connected: '已连接',
        reconnecting: '重连中',
        disconnected: '已断开'
      }
      return dict[this.mqttStatus] || '未知'
    }
  },
  methods: {
    toggleAdvanced(section) {
      this.advancedOpen = {
        ...this.advancedOpen,
        [section]: !this.advancedOpen[section]
      }
    },
    queueSave(section, refreshMqtt = false) {
      clearTimeout(this.timers[section])
      this.timers[section] = setTimeout(async () => {
        const payload = { [section]: this.form[section] }
        await this.$store.dispatch('app/saveConfig', payload)
        this.form = normalizeConfig(this.$store.getters.systemConfig)
        if (refreshMqtt) {
          this.$store.dispatch('mqtt/disconnect', { silent: true })
          this.$store.dispatch('mqtt/syncFromConfig')
        }
      }, 400)
    },
    handleParse() {
      if (!this.parseText) {
        this.$message.warning('请先粘贴配置文本')
        return
      }

      const text = this.parseText
      const urlMatch = text.match(/(https?:\/\/[^\s]+)/)
      const tokenMatch = text.match(/X-User-Token:\s*([^\s,]+)/i)
      const projectMatch = text.match(/x-project-uuid:\s*([^\s,]+)/i)
      const workflowMatch = text.match(/workflow_uuid:\s*"([^"]+)"/i)
      const creatorMatch = text.match(/creator:\s*"([^"]+)"/i)

      if (urlMatch) this.form.dfrPost.url = urlMatch[1]
      if (tokenMatch) this.form.dfrPost.token = tokenMatch[1]
      if (projectMatch) this.form.dfrPost.project = projectMatch[1]
      if (workflowMatch) this.form.dfrPost.workflow = workflowMatch[1]
      if (creatorMatch) this.form.dfrPost.creator = creatorMatch[1]

      this.queueSave('dfrPost')
      this.$message.success('已完成解析并自动保存')
    },
    async handleRefreshStreams() {
      const result = await refreshStreams()
      await this.$store.dispatch('app/saveConfig', { streaming: result.config.streaming })
      this.form = normalizeConfig(this.$store.getters.systemConfig)
      this.$message.success('推拉流地址已重新生成')
    },
    async handleTestMinio() {
      this.testingMinio = true
      try {
        await testMinioConnection(this.form.minio)
        this.$message.success('MinIO 连接成功')
      } finally {
        this.testingMinio = false
      }
    },
    handleApplyMapSettings() {
      const center = [
        Number(Number(this.form.map.center[0]).toFixed(8)),
        Number(Number(this.form.map.center[1]).toFixed(8))
      ]
      const zoom = Number(Number(this.form.map.zoom || 15).toFixed(2))
      this.$store.dispatch('app/saveLocalMapConfig', {
        center,
        zoom
      })
      this.form = normalizeConfig(this.$store.getters.systemConfig)
      this.$message.success('地图默认位置已应用到当前浏览器')
    },
    async handleFullReset() {
      try {
        await this.$confirm(
          '确认完全重置当前环境吗？这会清空当前浏览器 LocalStorage，并为你生成一个新的用户。',
          '提示',
          {
            type: 'warning',
            confirmButtonText: '确认重置',
            cancelButtonText: '取消'
          }
        )
      } catch (error) {
        return
      }

      this.resetting = true
      try {
        await this.$store.dispatch('mqtt/disconnect', { silent: true })
        if (this.$store.state.webhook.socket) {
          this.$store.state.webhook.socket.close()
        }
        await this.$store.dispatch('app/resetEnvironment')
        this.form = normalizeConfig(this.$store.getters.systemConfig)
        this.$message.success('已完成重置，当前环境已切换为新用户')
        window.location.reload()
      } finally {
        this.resetting = false
      }
    },
    async handleUnlockAdvancedPermission() {
      if (this.advancedPermissionUnlocked) {
        this.$message.success('高级权限已解锁')
        return
      }

      try {
        const { value } = await this.$prompt('请输入高级权限密码', '高级权限设置', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          inputType: 'password',
          inputValue: '',
          closeOnClickModal: false
        })

        if (value !== ADVANCED_PERMISSION_PASSWORD) {
          this.$message.error('密码错误')
          return
        }

        this.advancedPermissionUnlocked = true
        this.$message.success('高级权限已解锁')
      } catch (error) {
        // User cancelled.
      }
    }
  }
}
</script>

<style scoped>
.wayline-tip {
  margin-bottom: 16px;
}
.config-container {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

.summary-card,
.box-card {
  margin-bottom: 20px;
  background: var(--panel-bg);
  border: 1px solid var(--border-color);
}

.summary-line {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.summary-line span {
  width: 120px;
  color: var(--text-muted);
}

.user-id-text {
  flex: 1;
  min-width: 0;
  color: var(--text-primary);
  line-height: 1.5;
  word-break: break-all;
}

.summary-tip {
  color: var(--text-muted);
  font-size: 13px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title {
  color: var(--text-muted);
}

.parse-section {
  margin-bottom: 20px;
}

.mt-10 {
  margin-top: 10px;
}

.advanced-block {
  margin-top: 16px;
}

.map-setting-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.map-setting-tip {
  color: var(--text-muted);
  font-size: 13px;
}

.stream-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.stream-card {
  padding: 16px;
  border-radius: 8px;
  background: #f8fbff;
  border: 1px solid #d7e9fb;
}

.stream-card h4 {
  margin-top: 0;
}

.stream-card p {
  margin: 12px 0 8px;
  color: var(--text-muted);
}

.danger-card {
  border-color: #f5c6cb;
}

.danger-content {
  color: var(--text-muted);
}

.advanced-permission-entry {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding-bottom: 20px;
}

.advanced-permission-link {
  border: none;
  background: transparent;
  padding: 0;
  color: var(--text-muted);
  font-size: 12px;
  cursor: pointer;
  text-decoration: underline;
}

.advanced-permission-link:hover {
  color: var(--text-primary);
}

.advanced-permission-status {
  color: var(--text-muted);
  font-size: 12px;
}

.config-version {
  padding-bottom: 20px;
  text-align: center;
  color: var(--text-muted);
  font-size: 12px;
}

::v-deep .el-card__header {
  border-bottom: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .summary-line {
    flex-direction: column;
    align-items: flex-start;
  }

  .summary-line span {
    width: auto;
  }

  .stream-grid {
    grid-template-columns: 1fr;
  }
}
</style>
