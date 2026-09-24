<template>
  <div class="mqtt-container">
    <el-card class="summary-card" shadow="never">
      <div class="summary-row">
        <span>连接状态</span>
        <el-tag :type="statusTagType">{{ statusText }}</el-tag>
      </div>
      <div class="summary-row">
        <span>最新更新时间</span>
        <strong>{{ lastUpdateTime || '暂无' }}</strong>
      </div>
      <div class="summary-row">
        <span>订阅主题数</span>
        <strong>{{ topicCards.length }}</strong>
      </div>
      <div class="summary-actions">
        <el-button size="small" type="primary" plain @click="reconnect">重新连接</el-button>
        <el-button size="small" @click="$store.dispatch('mqtt/clearMessages')">清空展示</el-button>
      </div>
    </el-card>

    <el-row :gutter="20" v-if="topicCards.length > 0">
      <el-col v-for="card in topicCards" :key="card.key" :xs="24" :lg="12">
        <el-card class="topic-card" shadow="never">
          <div slot="header" class="card-header">
            <div>
              <strong>{{ card.title }}</strong>
              <p>{{ card.topic }}</p>
            </div>
            <el-tag size="small" type="info">{{ card.positionText }}</el-tag>
          </div>

          <div class="key-summary" v-if="card.summaryItems && card.summaryItems.length">
            <div v-for="item in card.summaryItems" :key="item.label" class="summary-item">
              <span class="summary-label">{{ item.label }}</span>
              <strong class="summary-value">{{ item.value }}</strong>
            </div>
          </div>

          <el-table
            v-if="card.tableData && card.tableData.length > 0"
            :data="card.tableData"
            height="520"
            size="small"
            stripe
            border
          >
            <el-table-column
              prop="name"
              label="字段名称"
              width="160"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="key"
              label="键名"
              width="160"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column prop="value" label="数据值">
              <template slot-scope="{ row }">
                <span v-if="row.isJson" class="raw-value">{{ row.value }}</span>
                <span v-else>{{ row.value }}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-empty v-else description="暂无数据" :image-size="100"></el-empty>
        </el-card>
      </el-col>
    </el-row>

    <el-empty
      v-if="topicCards.length === 0"
      description="请先在“配置设置”中填写 MQTT 地址和机场/无人机 SN"
    />
  </div>
</template>

<script>
import { enumDict, airportFields, droneFields } from '@/constants/osdDict'

// 辅助方法：通过字符串路径获取嵌套对象的值
function getValueByPath(obj, path) {
  return path
    .split('.')
    .reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj)
}

function formatSeconds(value) {
  const totalSeconds = Number(value)
  if (!Number.isFinite(totalSeconds)) return '-'
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  return `${minutes}分${seconds}秒`
}

function formatDisplayValue(path, value, unit = '') {
  if (value === undefined || value === null || value === '') return '-'
  if (enumDict[path] && enumDict[path][value] !== undefined) {
    return `${enumDict[path][value]}${unit}`
  }
  if (typeof value === 'number') {
    return `${value}${unit}`
  }
  return `${value}${unit}`
}

export default {
  name: 'Mqtt',
  computed: {
    mqttConfig() {
      return this.$store.getters.systemConfig.mqtt
    },
    latestMessages() {
      return this.$store.getters.mqttMessages
    },
    positions() {
      return this.$store.getters.mqttPositions
    },
    lastUpdateTime() {
      return this.$store.getters.mqttLastUpdateTime
    },
    mqttStatus() {
      return this.$store.getters.mqttStatus
    },
    statusText() {
      const dict = {
        idle: '未连接',
        connecting: '连接中',
        connected: '已连接',
        reconnecting: '重连中',
        disconnected: '已断开'
      }
      return dict[this.mqttStatus] || '未知'
    },
    statusTagType() {
      if (this.mqttStatus === 'connected') return 'success'
      if (['connecting', 'reconnecting'].includes(this.mqttStatus)) return 'warning'
      return 'info'
    },
    topicCards() {
      const definitions = [
        {
          key: 'airport',
          title: '机场 OSD',
          topic: this.mqttConfig.airportSn
            ? `thing/product/${this.mqttConfig.airportSn}/osd`
            : '未配置',
          fields: airportFields
        },
        {
          key: 'drone',
          title: '无人机 OSD',
          topic: this.mqttConfig.droneSn
            ? `thing/product/${this.mqttConfig.droneSn}/osd`
            : '未配置',
          fields: droneFields
        }
      ]

      return definitions
        .filter(item => item.topic !== '未配置')
        .map(item => {
          const payload = this.latestMessages[item.topic]?.payload || {}
          const position = this.positions[item.key]

          const tableData = item.fields.map(field => {
            const rawVal = getValueByPath(payload, field.key)
            let displayVal = rawVal
            let isJson = false

            if (rawVal === undefined) {
              displayVal = '-'
            } else if (rawVal !== null && typeof rawVal === 'object') {
              displayVal = JSON.stringify(rawVal, null, 2)
              isJson = true
            } else if (enumDict[field.key] && enumDict[field.key][rawVal] !== undefined) {
              displayVal = `${enumDict[field.key][rawVal]} (${rawVal})`
            }

            return {
              key: field.key,
              name: field.name,
              value: displayVal,
              isJson
            }
          })

          return {
            ...item,
            tableData,
            summaryItems: this.buildSummaryItems(item.key, payload),
            positionText: position
              ? `${position.longitude.toFixed(6)}, ${position.latitude.toFixed(6)}`
              : '等待定位'
          }
        })
    }
  },
  methods: {
    buildSummaryItems(key, payload) {
      if (key === 'airport') {
        const hasPayload = Object.keys(payload || {}).length > 0
        return [
          { label: '设备', value: `${this.mqttConfig.airportSn || '-'} 机场` },
          { label: '在线', value: hasPayload ? '在线' : '离线' },
          {
            label: '无人机在机巢',
            value: payload.drone_in_dock === 1 ? '是' : payload.drone_in_dock === 0 ? '否' : '-'
          },
          {
            label: '无人机电量(%)',
            value:
              payload.drone_charge_state?.capacity_percent != null
                ? `${payload.drone_charge_state.capacity_percent}%`
                : '-'
          },
          {
            label: '充电状态',
            value:
              payload.drone_charge_state?.state === 1
                ? '充电中'
                : payload.drone_charge_state?.state === 0
                ? '未充电'
                : '-'
          },
          {
            label: '舱盖状态',
            value: formatDisplayValue('cover_state', payload.cover_state)
          },
          {
            label: '急停状态',
            value:
              payload.emergency_stop_state === 0
                ? '正常'
                : payload.emergency_stop_state === 1
                ? '急停'
                : '-'
          },
          { label: '工作模式', value: formatDisplayValue('mode_code', payload.mode_code) },
          {
            label: '环境温度',
            value:
              payload.environment_temperature != null ? `${payload.environment_temperature} ℃` : '-'
          },
          {
            label: '机巢温度',
            value: payload.temperature != null ? `${payload.temperature} ℃` : '-'
          },
          { label: '湿度', value: payload.humidity != null ? `${payload.humidity} %` : '-' },
          { label: '风速', value: payload.wind_speed != null ? `${payload.wind_speed} m/s` : '-' },
          { label: '降雨量', value: formatDisplayValue('rainfall', payload.rainfall) },
          { label: '纬度', value: payload.latitude != null ? String(payload.latitude) : '-' },
          { label: '经度', value: payload.longitude != null ? String(payload.longitude) : '-' },
          { label: '高度(m)', value: payload.height != null ? String(payload.height) : '-' },
          {
            label: '网络类型',
            value: formatDisplayValue('network_state.type', payload.network_state?.type)
          },
          {
            label: '网络速率',
            value: payload.network_state?.rate != null ? String(payload.network_state.rate) : '-'
          },
          {
            label: 'GPS卫星数',
            value:
              payload.position_state?.gps_number != null
                ? String(payload.position_state.gps_number)
                : '-'
          },
          {
            label: 'RTK卫星数',
            value:
              payload.position_state?.rtk_number != null
                ? String(payload.position_state.rtk_number)
                : '-'
          },
          {
            label: '报警状态',
            value: payload.alarm_state === 0 ? '正常' : payload.alarm_state === 1 ? '告警' : '-'
          }
        ]
      }

      const modeCode = payload.mode_code
      const droneOnline =
        Object.keys(payload || {}).length > 0 ? (modeCode === 14 ? '离线' : '在线') : '离线'
      return [
        { label: '设备', value: `${this.mqttConfig.droneSn || '-'} 无人机` },
        { label: '在线', value: droneOnline },
        {
          label: '电池电量',
          value:
            payload.battery?.capacity_percent != null ? `${payload.battery.capacity_percent}%` : '-'
        },
        {
          label: '剩余飞行时间',
          value: formatSeconds(payload.battery?.remain_flight_time)
        },
        {
          label: '返航所需电量',
          value:
            payload.battery?.return_home_power != null
              ? `${payload.battery.return_home_power}%`
              : '-'
        },
        { label: '飞行模式', value: formatDisplayValue('mode_code', payload.mode_code) },
        { label: '纬度', value: payload.latitude != null ? String(payload.latitude) : '-' },
        { label: '经度', value: payload.longitude != null ? String(payload.longitude) : '-' },
        { label: '飞行高度(m)', value: payload.height != null ? String(payload.height) : '-' },
        { label: '海拔(m)', value: payload.elevation != null ? String(payload.elevation) : '-' },
        {
          label: '水平速度(m/s)',
          value: payload.horizontal_speed != null ? String(payload.horizontal_speed) : '-'
        },
        {
          label: '垂直速度(m/s)',
          value: payload.vertical_speed != null ? String(payload.vertical_speed) : '-'
        },
        {
          label: '航向角(°)',
          value: payload.attitude_head != null ? String(payload.attitude_head) : '-'
        },
        {
          label: '俯仰角(°)',
          value: payload.attitude_pitch != null ? String(payload.attitude_pitch) : '-'
        },
        {
          label: '横滚角(°)',
          value: payload.attitude_roll != null ? String(payload.attitude_roll) : '-'
        },
        { label: '风速', value: payload.wind_speed != null ? String(payload.wind_speed) : '-' },
        { label: '风向', value: formatDisplayValue('wind_direction', payload.wind_direction) },
        {
          label: '返航距离(m)',
          value: payload.home_distance != null ? String(payload.home_distance) : '-'
        },
        {
          label: 'GPS卫星数',
          value:
            payload.position_state?.gps_number != null
              ? String(payload.position_state.gps_number)
              : '-'
        },
        {
          label: 'RTK卫星数',
          value:
            payload.position_state?.rtk_number != null
              ? String(payload.position_state.rtk_number)
              : '-'
        }
      ]
    },
    reconnect() {
      this.$store.dispatch('mqtt/disconnect', { silent: true })
      this.$store.dispatch('mqtt/connect')
    }
  }
}
</script>

<style scoped>
.mqtt-container {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

.summary-card,
.topic-card {
  margin-bottom: 20px;
  border: 1px solid var(--border-color);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.summary-row span {
  color: var(--text-muted);
}

.summary-actions {
  margin-top: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.card-header p {
  margin: 6px 0 0;
  color: var(--text-muted);
  font-size: 12px;
}

.key-summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 16px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px;
  border-radius: 8px;
  background: #f8fbff;
  border: 1px solid #d7e9fb;
}

.summary-label {
  color: var(--text-muted);
  font-size: 12px;
}

.summary-value {
  color: var(--text-color);
  line-height: 1.4;
}

.raw-value {
  white-space: pre-wrap;
  font-family: monospace;
  font-size: 12px;
  background: var(--bg-color);
  padding: 4px;
  display: block;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .key-summary {
    grid-template-columns: 1fr;
  }
}
</style>
