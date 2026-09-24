<template>
  <div class="floating-video" :class="{ collapsed: collapsed }" :style="panelStyle">
    <div class="video-header" @mousedown="startDrag">
      <span>{{ title }}</span>
      <div class="actions">
        <el-button type="text" @click.stop="toggleCollapse">
          {{ collapsed ? '展开' : '收起' }}
        </el-button>
      </div>
    </div>

    <div v-show="!collapsed" class="video-body">
      <video
        ref="video"
        class="video-player"
        :style="videoStyle"
        autoplay
        muted
        controls
        playsinline
      ></video>
      <div class="video-footer">
        <span :class="['status', status]">{{ statusText }}</span>
        <span v-if="showMeta" class="meta">{{ shortUrl }}</span>
      </div>
      <div class="resize-handle" @mousedown.stop="startResize"></div>
    </div>
  </div>
</template>

<script>
import flvjs from 'flv.js'

export default {
  name: 'FloatingVideo',
  props: {
    title: {
      type: String,
      required: true
    },
    url: {
      type: String,
      default: ''
    },
    showMeta: {
      type: Boolean,
      default: true
    },
    initialLeft: {
      type: Number,
      default: 20
    },
    initialTop: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      collapsed: true,
      status: 'idle',
      player: null,
      reconnectCount: 0,
      reconnectTimer: null,
      panel: {
        left: this.initialLeft,
        top: this.initialTop,
        width: 320,
        height: 220
      },
      dragState: null,
      resizeState: null
    }
  },
  computed: {
    panelStyle() {
      return {
        left: `${this.panel.left}px`,
        top: `${this.panel.top}px`,
        width: `${this.panel.width}px`
      }
    },
    videoStyle() {
      return {
        height: `${this.panel.height - 70}px`
      }
    },
    statusText() {
      const map = {
        idle: '未加载',
        loading: '连接中',
        playing: '播放中',
        retrying: `重连中 (${this.reconnectCount}/3)`,
        error: '播放失败'
      }
      return map[this.status] || '未知状态'
    },
    shortUrl() {
      return this.url || '未配置 FLV 地址'
    }
  },
  watch: {
    url() {
      if (!this.collapsed) {
        this.initPlayer()
      }
    },
    collapsed(value) {
      if (value) {
        this.destroyPlayer()
      } else {
        this.initPlayer()
      }
    }
  },
  beforeDestroy() {
    this.destroyPlayer()
    this.removeDocumentEvents()
  },
  methods: {
    toggleCollapse() {
      this.collapsed = !this.collapsed
    },
    initPlayer() {
      this.destroyPlayer()
      if (!this.url || !flvjs.isSupported()) {
        this.status = 'idle'
        return
      }

      this.status = 'loading'
      this.player = flvjs.createPlayer({
        type: 'flv',
        isLive: true,
        url: this.url
      })
      this.player.attachMediaElement(this.$refs.video)
      this.player.load()
      this.player.play().catch(() => {})

      this.player.on(flvjs.Events.ERROR, () => {
        this.status = 'error'
        this.scheduleReconnect()
      })

      this.player.on(flvjs.Events.LOADING_COMPLETE, () => {
        this.status = 'playing'
      })

      this.$refs.video.onplaying = () => {
        this.status = 'playing'
        this.reconnectCount = 0
      }
    },
    destroyPlayer() {
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer)
        this.reconnectTimer = null
      }
      if (this.player) {
        try {
          this.player.destroy()
        } catch (error) {
          // Ignore destroy errors.
        }
        this.player = null
      }
    },
    scheduleReconnect() {
      if (this.reconnectCount >= 3 || this.collapsed) {
        return
      }
      this.reconnectCount += 1
      this.status = 'retrying'
      this.reconnectTimer = setTimeout(() => {
        this.initPlayer()
      }, 2000)
    },
    startDrag(event) {
      this.dragState = {
        startX: event.clientX,
        startY: event.clientY,
        left: this.panel.left,
        top: this.panel.top
      }
      document.addEventListener('mousemove', this.onDrag)
      document.addEventListener('mouseup', this.stopDrag)
    },
    onDrag(event) {
      if (!this.dragState) {
        return
      }
      const nextLeft = this.dragState.left + event.clientX - this.dragState.startX
      const nextTop = this.dragState.top + event.clientY - this.dragState.startY
      this.panel.left = Math.max(0, nextLeft)
      this.panel.top = Math.max(0, nextTop)
    },
    stopDrag() {
      this.dragState = null
      this.removeDocumentEvents()
    },
    startResize(event) {
      this.resizeState = {
        startX: event.clientX,
        startY: event.clientY,
        width: this.panel.width,
        height: this.panel.height
      }
      document.addEventListener('mousemove', this.onResize)
      document.addEventListener('mouseup', this.stopResize)
    },
    onResize(event) {
      if (!this.resizeState) {
        return
      }
      this.panel.width = Math.max(
        260,
        this.resizeState.width + event.clientX - this.resizeState.startX
      )
      this.panel.height = Math.max(
        180,
        this.resizeState.height + event.clientY - this.resizeState.startY
      )
    },
    stopResize() {
      this.resizeState = null
      this.removeDocumentEvents()
    },
    removeDocumentEvents() {
      document.removeEventListener('mousemove', this.onDrag)
      document.removeEventListener('mouseup', this.stopDrag)
      document.removeEventListener('mousemove', this.onResize)
      document.removeEventListener('mouseup', this.stopResize)
    }
  }
}
</script>

<style scoped>
.floating-video {
  position: absolute;
  z-index: 20;
  background: rgba(7, 24, 43, 0.92);
  border: 1px solid rgba(24, 144, 255, 0.35);
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.28);
  color: #fff;
  overflow: hidden;
}

.floating-video.collapsed {
  width: 160px !important;
}

.video-header {
  height: 40px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: move;
  background: rgba(0, 0, 0, 0.3);
}

.video-body {
  position: relative;
}

.video-player {
  width: 100%;
  height: 150px;
  display: block;
  background: #000;
}

.video-footer {
  padding: 8px 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
}

.status.playing {
  color: #67c23a;
}

.status.retrying,
.status.loading {
  color: #e6a23c;
}

.status.error {
  color: #f56c6c;
}

.meta {
  word-break: break-all;
  color: rgba(255, 255, 255, 0.75);
}

.resize-handle {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 18px;
  height: 18px;
  cursor: nwse-resize;
}

.resize-handle::after {
  content: '';
  position: absolute;
  right: 4px;
  bottom: 4px;
  width: 8px;
  height: 8px;
  border-right: 2px solid rgba(255, 255, 255, 0.6);
  border-bottom: 2px solid rgba(255, 255, 255, 0.6);
}
</style>
