<template>
  <div class="map-container">
    <div id="ol-map" class="map"></div>

    <div class="basemap-switcher-wrap">
      <div v-if="showBasemapWarning" class="basemap-warning">
        该地图底图用量可能已用尽，建议切换线路。
      </div>
      <div class="basemap-switcher">
        <el-dropdown trigger="click" @command="handleBasemapSwitch">
          <el-button class="basemap-switch-btn" size="mini" round>
            <i class="fa-solid fa-layer-group"></i>
            底图：{{ activeBaseMapName }}
            <i class="el-icon-arrow-up el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="item in basemapOptions"
              :key="item.key"
              :command="item.key"
              :disabled="item.key === activeBaseMapKey"
            >
              {{ item.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <div class="mouse-position-box hidden-xs-only">
      <i class="fa-solid fa-location-crosshairs"></i>
      <span>
        经度: {{ mousePosition.lon }} ｜ 纬度: {{ mousePosition.lat }} ｜ 地图层级:
        {{ currentMapZoom }}
      </span>
    </div>

    <div
      v-if="activeFooterNotice.enabled && activeFooterNotice.text"
      class="map-footer-notice hidden-xs-only"
    >
      {{ activeFooterNotice.text }}
    </div>

    <div class="action-buttons">
      <el-button
        class="map-btn"
        type="primary"
        round
        @click="locateAirport"
        :disabled="!airportPosition"
      >
        <i class="fa-solid fa-location-dot"></i> 定位到机场
      </el-button>
      <el-button class="map-btn" round @click="locateSelf" :loading="locating">
        <i class="fa-solid fa-location-arrow"></i> 定位到我
      </el-button>
      <el-button class="map-btn" round @click="manualLocateDialogVisible = true">
        <i class="fa-solid fa-map-pin"></i> 定位到指定位置
      </el-button>
      <el-button class="map-btn" round @click="toggleVideo('airportVideo')">
        <i class="fa-solid fa-video"></i> 机场视频
      </el-button>
      <el-button class="map-btn" round @click="toggleVideo('droneVideo')">
        <i class="fa-solid fa-video"></i>
        <i class="fa-solid fa-drone"></i> 无人机视频
      </el-button>
    </div>

    <ul
      v-show="contextMenuVisible"
      :style="{ left: contextMenuLeft + 'px', top: contextMenuTop + 'px' }"
      class="context-menu"
    >
      <li @click="selectPoint(rightClickCoord)">
        <i class="fa-solid fa-location-dot"></i> 选择此点位
      </li>
    </ul>

    <el-dialog
      title="定位到指定位置"
      :visible.sync="manualLocateDialogVisible"
      width="420px"
      append-to-body
    >
      <el-form label-position="top">
        <el-form-item label="经度">
          <el-input v-model="manualLocateForm.longitude" placeholder="请输入经度"></el-input>
        </el-form-item>
        <el-form-item label="纬度">
          <el-input v-model="manualLocateForm.latitude" placeholder="请输入纬度"></el-input>
        </el-form-item>
        <el-form-item label="地图层级">
          <el-input-number
            v-model="manualLocateForm.zoom"
            :min="1"
            :max="20"
            controls-position="right"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="manualLocateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleManualLocate">确定</el-button>
      </span>
    </el-dialog>

    <el-drawer
      title="任务指派"
      :visible.sync="panelVisible"
      direction="btt"
      size="60%"
      :with-header="false"
      custom-class="action-drawer"
      v-if="isMobile"
    >
      <ActionForm
        :targetLon="targetLon"
        :targetLat="targetLat"
        @close="panelVisible = false"
        @execute="handleExecute"
        :loading="executing"
      />
    </el-drawer>

    <div v-else v-show="panelVisible" class="action-panel">
      <div class="panel-header">
        <h3><i class="fa-solid fa-bullseye"></i> 任务指派</h3>
        <i class="el-icon-close close-btn" @click="panelVisible = false"></i>
      </div>
      <ActionForm
        :targetLon="targetLon"
        :targetLat="targetLat"
        @execute="handleExecute"
        :loading="executing"
      />
    </div>

    <FloatingVideo
      ref="airportVideo"
      title="机场视频"
      :url="streaming.airport.flvUrl"
      :show-meta="false"
      :initial-left="20"
      :initial-top="20"
    />
    <FloatingVideo
      ref="droneVideo"
      title="无人机视频"
      :url="streaming.drone.flvUrl"
      :show-meta="false"
      :initial-left="360"
      :initial-top="20"
    />
  </div>
</template>

<script>
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Style, Circle, Fill, Stroke, Text } from 'ol/style'
import { fromLonLat, toLonLat } from 'ol/proj'
import Overlay from 'ol/Overlay'
import { easeOut } from 'ol/easing'
import { defaults as defaultControls } from 'ol/control'
import ActionForm from './components/ActionForm.vue'
import FloatingVideo from '@/components/FloatingVideo.vue'
import { dispatchFlight } from '@/api/flight'
import { detectLocale, pickText } from '@/utils/locale'
import 'ol/ol.css'

const BASEMAP_STORAGE_KEY = 'dfr_active_basemap_key'
const BASEMAP_TILE_ERROR_THRESHOLD = 6

function normalizeBaseMapConfig(rawConfig) {
  const basemaps = Array.isArray(rawConfig?.basemaps)
    ? rawConfig.basemaps
        .filter(item => item && item.key && item.name && item.url)
        .map(item => ({
          key: String(item.key),
          // 名称与提示文案按用户语言选择中/英版本
          name: pickText(item.name, item.nameEn),
          url: String(item.url),
          maxZoom: Number(item.maxZoom) > 0 ? Number(item.maxZoom) : 18,
          coordinateSystem: String(item.coordinateSystem || ''),
          offsetRisk: String(item.offsetRisk || ''),
          footerNotice: {
            enabled: Boolean(item.footerNotice?.enabled),
            text: pickText(item.footerNotice?.text, item.footerNotice?.textEn)
          },
          switchNotice: {
            enabled: Boolean(item.switchNotice?.enabled),
            message: pickText(item.switchNotice?.message, item.switchNotice?.messageEn)
          }
        }))
    : []

  // 默认底图：优先按用户语言匹配 localeDefaults（中文→高德，其他→谷歌），
  // 再回退到 defaultKey，最后回退到第一个可用底图。
  const locale = detectLocale()
  const localeDefaults = rawConfig?.localeDefaults || {}
  const localePreferred = String(localeDefaults[locale] || localeDefaults.default || '')
  const configuredKey = String(rawConfig?.defaultKey || '')

  const resolveKey = candidate =>
    candidate && basemaps.some(item => item.key === candidate) ? candidate : ''

  return {
    defaultKey:
      resolveKey(localePreferred) ||
      resolveKey(configuredKey) ||
      basemaps[0]?.key ||
      '',
    basemaps
  }
}

export default {
  name: 'FlightMap',
  components: { ActionForm, FloatingVideo },
  data() {
    return {
      map: null,
      tileLayer: null,
      vectorSource: null,
      rippleOverlay: null,
      mapStateTimer: null,
      markerFeatures: {
        airport: null,
        drone: null,
        target: null
      },
      mousePosition: { lon: '-', lat: '-' },
      contextMenuVisible: false,
      contextMenuLeft: 0,
      contextMenuTop: 0,
      rightClickCoord: null,
      panelVisible: false,
      targetLon: '',
      targetLat: '',
      locating: false,
      manualLocateDialogVisible: false,
      manualLocateForm: {
        longitude: '',
        latitude: '',
        zoom: 16
      },
      basemapOptions: [],
      activeBaseMapKey: '',
      showBasemapWarning: false,
      basemapTileErrorCount: 0,
      currentMapZoom: '-',
      executing: false,
      isMobile: window.innerWidth <= 768
    }
  },
  computed: {
    appConfig() {
      return this.$store.getters.appConfig
    },
    streaming() {
      return this.$store.getters.systemConfig.streaming
    },
    mapConfig() {
      return this.$store.getters.systemConfig.map
    },
    airportPosition() {
      return this.$store.getters.mqttPositions.airport
    },
    dronePosition() {
      return this.$store.getters.mqttPositions.drone
    },
    activeBaseMapName() {
      const current = this.basemapOptions.find(item => item.key === this.activeBaseMapKey)
      return current ? current.name : '未加载'
    },
    activeFooterNotice() {
      const current = this.basemapOptions.find(item => item.key === this.activeBaseMapKey)
      return (
        current?.footerNotice || {
          enabled: false,
          text: ''
        }
      )
    }
  },
  watch: {
    airportPosition: {
      handler(value) {
        this.updateMarker('airport', value)
      },
      deep: true
    },
    dronePosition: {
      handler(value) {
        this.updateMarker('drone', value)
      },
      deep: true
    }
  },
  async mounted() {
    await this.bootstrapMap()
    window.addEventListener('resize', this.handleResize)
    document.addEventListener('click', this.hideContextMenu)

    if (this.$route.query.lon && this.$route.query.lat) {
      const coord = fromLonLat([
        parseFloat(this.$route.query.lon),
        parseFloat(this.$route.query.lat)
      ])
      this.selectPoint(coord)
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    document.removeEventListener('click', this.hideContextMenu)
    clearTimeout(this.mapStateTimer)
    if (this.map) {
      this.map.setTarget(null)
    }
  },
  methods: {
    async bootstrapMap() {
      const loaded = await this.loadBaseMapConfig()
      if (!loaded) {
        return
      }
      this.initMap()
      // 首次加载默认底图时也要提示（例如中文用户默认高德，需告知坐标偏移）
      this.showBasemapSwitchNotice(this.getBaseMapByKey(this.activeBaseMapKey))
    },
    async loadBaseMapConfig() {
      try {
        const response = await fetch(`${process.env.BASE_URL}map-basemaps.json?_=${Date.now()}`, {
          cache: 'no-store'
        })
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        const config = normalizeBaseMapConfig(await response.json())
        if (!config.basemaps.length || !config.defaultKey) {
          throw new Error('EMPTY_BASEMAP_CONFIG')
        }
        this.basemapOptions = config.basemaps
        const storedKey = localStorage.getItem(BASEMAP_STORAGE_KEY) || ''
        this.activeBaseMapKey = config.basemaps.some(item => item.key === storedKey)
          ? storedKey
          : config.defaultKey
        if (this.activeBaseMapKey) {
          localStorage.setItem(BASEMAP_STORAGE_KEY, this.activeBaseMapKey)
        }
        return true
      } catch (error) {
        this.basemapOptions = []
        this.activeBaseMapKey = ''
        this.$message.error(
          pickText(
            '底图配置加载失败，请检查 public/map-basemaps.json',
            'Failed to load basemap config. Please check public/map-basemaps.json'
          )
        )
        return false
      }
    },
    resetBasemapWarningState() {
      this.basemapTileErrorCount = 0
      this.showBasemapWarning = false
    },
    handleTileLoadError() {
      this.basemapTileErrorCount += 1
      if (this.basemapTileErrorCount >= BASEMAP_TILE_ERROR_THRESHOLD) {
        this.showBasemapWarning = true
      }
    },
    createBaseMapSource(basemap) {
      const source = new XYZ({
        url: basemap.url,
        maxZoom: basemap.maxZoom || 18
      })
      source.on('tileloaderror', this.handleTileLoadError)
      return source
    },
    getBaseMapByKey(key) {
      return this.basemapOptions.find(item => item.key === key) || this.basemapOptions[0] || null
    },
    async handleBasemapSwitch(key) {
      if (!key || key === this.activeBaseMapKey) {
        return
      }
      const nextBasemap = this.getBaseMapByKey(key)
      if (!nextBasemap) {
        return
      }
      this.activeBaseMapKey = nextBasemap.key
      localStorage.setItem(BASEMAP_STORAGE_KEY, nextBasemap.key)
      this.resetBasemapWarningState()
      if (this.tileLayer) {
        this.tileLayer.setSource(this.createBaseMapSource(nextBasemap))
      }
      await this.showBasemapSwitchNotice(nextBasemap)
    },
    // 弹出底图告警（如高德坐标偏移）。切换底图与首次加载默认底图时都会调用。
    async showBasemapSwitchNotice(basemap) {
      if (!basemap || !basemap.switchNotice || !basemap.switchNotice.enabled) {
        return
      }
      if (!basemap.switchNotice.message) {
        return
      }
      const isZh = detectLocale() === 'zh'
      const title = isZh ? `当前底图：${basemap.name}` : `Current basemap: ${basemap.name}`
      const confirmText = isZh ? '我知道了' : 'Got it'
      // 文案含换行，转为 <br> 并用 HTML 模式渲染
      const html = String(basemap.switchNotice.message)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>')
      try {
        await this.$alert(html, title, {
          confirmButtonText: confirmText,
          dangerouslyUseHTMLString: true,
          customClass: 'basemap-notice-dialog'
        })
      } catch (error) {
        // 用户关闭弹窗，忽略
      }
    },
    handleResize() {
      this.isMobile = window.innerWidth <= 768
    },
    updateCurrentZoom() {
      if (!this.map) {
        this.currentMapZoom = '-'
        return
      }
      const zoom = this.map.getView().getZoom()
      this.currentMapZoom = Number.isFinite(zoom) ? Number(zoom.toFixed(2)) : '-'
    },
    hideContextMenu() {
      this.contextMenuVisible = false
    },
    initMap() {
      const currentBasemap = this.getBaseMapByKey(this.activeBaseMapKey)
      if (!currentBasemap) {
        return
      }
      this.resetBasemapWarningState()

      this.vectorSource = new VectorSource()
      const vectorLayer = new VectorLayer({
        source: this.vectorSource,
        style: feature => this.getFeatureStyle(feature.get('featureType'))
      })

      const rippleElement = document.createElement('div')
      rippleElement.className = 'ripple-container'
      rippleElement.innerHTML = '<div class="ripple"></div>'
      rippleElement.style.display = 'none'
      this.$el.appendChild(rippleElement)

      this.rippleOverlay = new Overlay({
        element: rippleElement,
        positioning: 'center-center',
        stopEvent: false
      })

      this.map = new Map({
        target: 'ol-map',
        controls: defaultControls(),
        layers: [
          (this.tileLayer = new TileLayer({
            source: this.createBaseMapSource(currentBasemap)
          })),
          vectorLayer
        ],
        view: new View({
          center: fromLonLat(this.mapConfig.center || [123.45966838, 41.93131324]),
          zoom: this.mapConfig.zoom || 15,
          minZoom: 0,
          maxZoom: 18
        })
      })

      this.map.addOverlay(this.rippleOverlay)
      this.updateCurrentZoom()
      this.map.getView().on('change:resolution', this.updateCurrentZoom)

      this.map.on('pointermove', evt => {
        if (evt.dragging) return
        const lonLat = toLonLat(evt.coordinate)
        this.mousePosition = {
          lon: lonLat[0].toFixed(6),
          lat: lonLat[1].toFixed(6)
        }
      })

      this.map.on('click', evt => {
        this.selectPoint(evt.coordinate)
      })

      this.map.on('moveend', () => {
        clearTimeout(this.mapStateTimer)
        this.mapStateTimer = setTimeout(() => {
          const center = toLonLat(this.map.getView().getCenter())
          this.saveMapSetting(center, this.map.getView().getZoom())
        }, 600)
      })

      this.map.getViewport().addEventListener('contextmenu', evt => {
        evt.preventDefault()
        const rect = this.$el.getBoundingClientRect()
        this.rightClickCoord = this.map.getEventCoordinate(evt)
        this.contextMenuLeft = evt.clientX - rect.left
        this.contextMenuTop = evt.clientY - rect.top
        this.contextMenuVisible = true
      })

      this.updateMarker('airport', this.airportPosition)
      this.updateMarker('drone', this.dronePosition)
    },
    getFeatureStyle(featureType) {
      const colorMap = {
        airport: '#1890ff',
        drone: '#1890ff',
        target: '#facc15'
      }
      const labelMap = {
        airport: '机场',
        drone: '无人机',
        target: '目标点'
      }
      return new Style({
        image: new Circle({
          radius: featureType === 'target' ? 7 : 6,
          fill: new Fill({ color: colorMap[featureType] || '#1890ff' }),
          stroke: new Stroke({ color: '#ffffff', width: 2 })
        }),
        text: new Text({
          text: labelMap[featureType] || '',
          font: 'bold 13px sans-serif',
          offsetY: 15,
          fill: new Fill({ color: colorMap[featureType] || '#1890ff' }),
          stroke: new Stroke({ color: '#ffffff', width: 3 })
        })
      })
    },
    updateMarker(type, value) {
      if (!this.vectorSource || !value) {
        return
      }

      const coordinate = fromLonLat([value.longitude, value.latitude])
      if (!this.markerFeatures[type]) {
        const feature = new Feature({
          geometry: new Point(coordinate)
        })
        feature.set('featureType', type)
        this.vectorSource.addFeature(feature)
        this.markerFeatures[type] = feature
      } else {
        this.markerFeatures[type].setGeometry(new Point(coordinate))
      }
    },
    selectPoint(coordinate) {
      if (!this.appConfig || !this.appConfig.url) {
        this.$message.warning('请先完成“配置设置”中的 DFR POST 配置')
        this.$router.push('/config')
        return
      }
      const lonLat = toLonLat(coordinate)
      this.targetLon = lonLat[0].toFixed(8)
      this.targetLat = lonLat[1].toFixed(8)

      if (!this.markerFeatures.target) {
        const targetFeature = new Feature({
          geometry: new Point(coordinate)
        })
        targetFeature.set('featureType', 'target')
        this.vectorSource.addFeature(targetFeature)
        this.markerFeatures.target = targetFeature
      } else {
        this.markerFeatures.target.setGeometry(new Point(coordinate))
      }

      this.rippleOverlay.getElement().style.display = 'block'
      this.rippleOverlay.setPosition(coordinate)

      this.panelVisible = true

      this.map.getView().animate({
        center: coordinate,
        duration: 600,
        easing: easeOut
      })
    },
    locateSelf() {
      if (!navigator.geolocation) {
        this.showLocateSelfFailure('浏览器不支持定位')
        return
      }
      this.locating = true
      navigator.geolocation.getCurrentPosition(
        pos => {
          this.locating = false
          const coord = fromLonLat([pos.coords.longitude, pos.coords.latitude])
          this.map.getView().animate({ center: coord, zoom: 16, duration: 1000 })
          setTimeout(() => this.selectPoint(coord), 1000)
        },
        err => {
          this.locating = false
          this.showLocateSelfFailure(`定位失败: ${err.message}`)
        },
        { enableHighAccuracy: true, timeout: 10000 }
      )
    },
    showLocateSelfFailure(message) {
      this.$message.error(message)
      this.$alert(
        '由于您的浏览器兼容性问题，无法获取定位。<br/>如果您需要更改地图默认位置，可以MQTT绑定机场后点击定位到机场，或者在配置设置中设定默认位置并刷新网页。',
        '定位失败',
        {
          confirmButtonText: '我知道了',
          dangerouslyUseHTMLString: true
        }
      )
    },
    locateAirport() {
      if (!this.airportPosition) {
        this.$message.warning('暂未收到机场位置')
        return
      }
      const coordinate = fromLonLat([this.airportPosition.longitude, this.airportPosition.latitude])
      this.map.getView().animate({ center: coordinate, zoom: 16, duration: 800 })
      this.saveMapSetting([this.airportPosition.longitude, this.airportPosition.latitude], 16)
    },
    handleManualLocate() {
      const longitude = Number(this.manualLocateForm.longitude)
      const latitude = Number(this.manualLocateForm.latitude)
      const zoom = Number(this.manualLocateForm.zoom || 16)
      if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
        this.$message.warning('请输入合法经度')
        return
      }
      if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
        this.$message.warning('请输入合法纬度')
        return
      }
      const coordinate = fromLonLat([longitude, latitude])
      this.map.getView().animate({
        center: coordinate,
        zoom,
        duration: 800
      })
      this.manualLocateDialogVisible = false
      this.saveMapSetting([longitude, latitude], zoom)
    },
    saveMapSetting(center, zoom) {
      this.$store.dispatch('app/saveLocalMapConfig', {
        center: [Number(center[0].toFixed(8)), Number(center[1].toFixed(8))],
        zoom: Number((zoom || 15).toFixed(2))
      })
    },
    toggleVideo(refName) {
      const component = this.$refs[refName]
      if (component && typeof component.toggleCollapse === 'function') {
        component.toggleCollapse()
      }
    },
    async handleExecute(formData) {
      const appConfig = this.appConfig
      if (!appConfig || !appConfig.url) {
        this.$message.error('未检测到接入配置')
        return
      }
      this.executing = true
      const nowStr = new Date()
        .toISOString()
        .replace(/[-:T.]/g, '')
        .slice(0, 14)
      const payload = {
        workflow_uuid: appConfig.workflow,
        trigger_type: 0,
        name: `Alert-${nowStr}`,
        params: {
          creator: appConfig.creator,
          latitude: parseFloat(this.targetLat),
          longitude: parseFloat(this.targetLon),
          level: formData.level,
          desc: formData.desc
        }
      }

      const record = {
        timestamp: Date.now(),
        name: payload.name,
        lon: payload.params.longitude,
        lat: payload.params.latitude,
        level: payload.params.level,
        desc: payload.params.desc,
        workflow: payload.workflow_uuid,
        targetUrl: appConfig.url,
        status: 'error'
      }

      try {
        await dispatchFlight(payload)
        record.status = 'success'
        this.$message.success('无人机派遣指令已送达！')
        this.panelVisible = false
        if (this.markerFeatures.target) {
          this.vectorSource.removeFeature(this.markerFeatures.target)
          this.markerFeatures.target = null
        }
        this.rippleOverlay.getElement().style.display = 'none'
      } catch (error) {
        // error handled in interceptor
      } finally {
        this.executing = false
        this.$store.dispatch('flight/addHistory', record)
      }
    }
  }
}
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
}
.map {
  width: 100%;
  height: 100%;
}
.mouse-position-box {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: var(--panel-bg);
  padding: 8px 15px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  color: var(--text-color);
  font-size: 0.9rem;
  z-index: 5;
}
.map-footer-notice {
  position: absolute;
  left: 60px;
  bottom: 20px;
  max-width: 420px;
  background: rgba(7, 24, 43, 0.85);
  color: #fff;
  border: 1px solid rgba(100, 255, 218, 0.28);
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 12px;
  line-height: 1.5;
  z-index: 5;
}
.basemap-switcher-wrap {
  position: absolute;
  right: 20px;
  bottom: 68px;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}
.basemap-warning {
  max-width: 560px;
  padding: 8px 12px;
  border-radius: 6px;
  background: rgba(255, 244, 229, 0.95);
  color: #d46b08;
  border: 1px solid rgba(250, 173, 20, 0.45);
  font-size: 18px;
  font-weight: 700;
  line-height: 1.5;
  text-align: right;
}
.basemap-switcher {
  position: static;
}
.basemap-switch-btn {
  box-shadow: var(--shadow);
}
.action-buttons {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}
::v-deep .action-buttons .el-button + .el-button {
  margin-left: 0;
}
.map-btn {
  width: 168px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  box-shadow: var(--shadow);
}
::v-deep .ol-zoom {
  top: auto;
  right: auto;
  left: 20px;
  bottom: 20px;
}
.context-menu {
  position: absolute;
  background: var(--panel-bg);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 5px 0;
  margin: 0;
  list-style: none;
  box-shadow: var(--shadow);
  z-index: 1000;
  min-width: 150px;
}
.context-menu li {
  padding: 10px 20px;
  cursor: pointer;
  color: var(--text-color);
}
.context-menu li:hover {
  background: var(--primary-hover);
  color: var(--primary-color);
}
.action-panel {
  position: absolute;
  top: 20px;
  right: 20px; /* 图片中面板在右侧 */
  left: auto;
  width: 320px;
  background: var(--panel-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: var(--shadow);
  z-index: 10;
  padding: 20px;
}
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  color: var(--text-color);
}
.panel-header h3 {
  margin: 0;
  font-size: 1.1rem;
}
.close-btn {
  cursor: pointer;
  font-size: 1.2rem;
  color: var(--text-muted);
}
.close-btn:hover {
  color: var(--danger-color);
}
::v-deep .ripple-container {
  position: absolute;
  width: 100px;
  height: 100px;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
::v-deep .ripple {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(24, 144, 255, 0.4);
  animation: ripple-anim 2s infinite;
}
@keyframes ripple-anim {
  0% {
    transform: scale(0.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

@media (max-width: 768px) {
  .basemap-switcher-wrap {
    right: 10px;
    bottom: 78px;
  }
  .basemap-warning {
    max-width: 220px;
  }
  .action-panel {
    display: none;
  }
  .action-buttons {
    bottom: 20px;
    right: 10px;
    top: auto;
  }
  ::v-deep .ol-zoom {
    left: 10px;
    bottom: 20px;
  }
  ::v-deep .action-drawer {
    background: var(--panel-bg);
  }
}
</style>
