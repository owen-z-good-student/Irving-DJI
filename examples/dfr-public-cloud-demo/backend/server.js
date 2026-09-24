const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { createProxyMiddleware } = require('http-proxy-middleware')
const { Client: MinioClient } = require('minio')
const { WebSocketServer } = require('ws')
const crypto = require('crypto')
const fs = require('fs')
const http = require('http')
const os = require('os')
const path = require('path')
const { URL } = require('url')

const app = express()
const server = http.createServer(app)
const wss = new WebSocketServer({ noServer: true })

const PORT = Number(process.env.PORT || 3000)
const DATA_ROOT = path.join(__dirname, 'data')
const USERS_ROOT = path.join(DATA_ROOT, 'users')
const COOKIE_NAME = 'dfr_uid'
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000
const WEBHOOK_MESSAGE_LIMIT = 100
const WEBHOOK_RETENTION_DAYS = 7
const AES_SECRET = process.env.DFR_CONFIG_SECRET || 'dfr-default-secret-for-dev-only'
const STATIC_ROOT = path.join(__dirname, 'Vue', 'dist')
const DEFAULT_CONFIG_PATH = path.join(__dirname, 'default-user-config.json')
const ALLOWED_DFR_PROXY_ORIGIN = 'https://es-flight-api-cn.djigate.com'
const ALLOWED_DFR_PROXY_PATH = '/openapi/v0.1/workflow'

const websocketClients = new Map()

const FALLBACK_DEFAULT_CONFIG = Object.freeze({
  dfrPost: {
    url: 'https://es-flight-api-cn.djigate.com/openapi/v0.1/workflow',
    token: '',
    project: '',
    workflow: '',
    creator: ''
  },
  mqtt: {
    url: 'ws://<YOUR_MQTT_HOST>:8083/mqtt',
    username: '<YOUR_MQTT_USER>',
    password: '<YOUR_MQTT_PASSWORD>',
    airportSn: '',
    droneSn: '',
    clientId: ''
  },
  streaming: {
    serverHost: '<YOUR_STREAM_HOST>',
    airport: {
      streamKey: '',
      rtmpUrl: '',
      flvUrl: ''
    },
    drone: {
      streamKey: '',
      rtmpUrl: '',
      flvUrl: ''
    }
  },
  minio: {
    endPoint: '<YOUR_MINIO_HOST>',
    port: 9000,
    useSSL: false,
    accessKey: '<YOUR_MINIO_ACCESS_KEY>',
    secretKey: '<YOUR_MINIO_SECRET_KEY>'
  },
  // 航线同步：需与司空 2 FlightHub Sync 挂载的桶/目录一致
  wayline: {
    bucket: '',
    prefix: '',
    orgUuid: '',
    projectUuid: ''
  },
  map: {
    center: [123.45966838, 41.93131324],
    zoom: 15
  },
  webhook: {
    messageLimit: WEBHOOK_MESSAGE_LIMIT,
    retentionDays: WEBHOOK_RETENTION_DAYS,
    allowedIps: []
  }
})

function loadDefaultConfig() {
  try {
    if (fs.existsSync(DEFAULT_CONFIG_PATH)) {
      const raw = fs.readFileSync(DEFAULT_CONFIG_PATH, 'utf8')
      const parsed = JSON.parse(raw || '{}')
      return Object.freeze(deepMerge(JSON.parse(JSON.stringify(FALLBACK_DEFAULT_CONFIG)), parsed))
    }
  } catch (error) {
    log('CONFIG', '读取默认配置文件失败，已回退到内置默认值', error.message)
  }
  return FALLBACK_DEFAULT_CONFIG
}

const DEFAULT_CONFIG = loadDefaultConfig()

app.use(
  cors({
    origin: true,
    credentials: true
  })
)
app.use(cookieParser())
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

if (fs.existsSync(STATIC_ROOT)) {
  app.use(express.static(STATIC_ROOT))
}
app.use(express.static(__dirname))

function log(scope, message, extra) {
  const timestamp = new Date().toISOString()
  if (typeof extra === 'undefined') {
    console.log(`[${timestamp}] [${scope}] ${message}`)
    return
  }
  console.log(`[${timestamp}] [${scope}] ${message}`, extra)
}

async function ensureDir(dirPath) {
  await fs.promises.mkdir(dirPath, { recursive: true, mode: 0o700 })
}

function getUserDir(userId) {
  return path.join(USERS_ROOT, userId)
}

function getConfigPath(userId) {
  return path.join(getUserDir(userId), 'config.json')
}

function getWebhookPath(userId) {
  return path.join(getUserDir(userId), 'webhook-messages.json')
}

function getServerHost(req) {
  return (
    process.env.PUBLIC_SERVER_HOST ||
    process.env.SRS_SERVER_HOST ||
    req.headers.host ||
    getLocalIpAddress() ||
    'localhost:' + PORT
  )
}

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces()
  for (const interfaceName of Object.keys(interfaces)) {
    for (const detail of interfaces[interfaceName] || []) {
      if (detail.family === 'IPv4' && !detail.internal) {
        return detail.address
      }
    }
  }
  return '127.0.0.1'
}

function buildWebhookUrl(req, userId) {
  return `${req.protocol}://${req.get('host')}/webhook/${userId}`
}

function normalizeMinioTags(rawTags) {
  if (!rawTags) {
    return {}
  }
  if (Array.isArray(rawTags)) {
    return rawTags.reduce((result, tag) => {
      if (tag && tag.Key) {
        result[tag.Key] = tag.Value || ''
      }
      return result
    }, {})
  }
  return rawTags
}

function buildStreamUrls(host, streamKey) {
  const sanitizedHost = host.replace(/^https?:\/\//, '')
  return {
    rtmpUrl: `rtmp://${sanitizedHost}:1935/live/${streamKey}`,
    flvUrl: `http://${sanitizedHost}:8080/live/${streamKey}.flv`
  }
}

function createStreamConfig(userId, type, host) {
  const randomPart = crypto.randomBytes(4).toString('hex')
  const streamKey = `${userId}-${type}-${randomPart}`
  return {
    streamKey,
    ...buildStreamUrls(host, streamKey)
  }
}

function normalizeConfig(config = {}) {
  const next = JSON.parse(JSON.stringify(DEFAULT_CONFIG))
  const merged = deepMerge(next, config)
  return {
    ...merged,
    webhook: {
      ...merged.webhook,
      messageLimit: clampNumber(merged.webhook.messageLimit, 1, 500, WEBHOOK_MESSAGE_LIMIT),
      retentionDays: clampNumber(merged.webhook.retentionDays, 1, 30, WEBHOOK_RETENTION_DAYS),
      allowedIps: Array.isArray(merged.webhook.allowedIps)
        ? merged.webhook.allowedIps.filter(Boolean)
        : []
    },
    map: {
      center: Array.isArray(merged.map.center) ? merged.map.center.slice(0, 2) : DEFAULT_CONFIG.map.center,
      zoom: clampNumber(merged.map.zoom, 1, 20, DEFAULT_CONFIG.map.zoom)
    },
    minio: {
      ...merged.minio,
      port: clampNumber(merged.minio.port, 1, 65535, 9000),
      useSSL: Boolean(merged.minio.useSSL)
    }
  }
}

function deepMerge(target, source) {
  if (!source || typeof source !== 'object') {
    return target
  }
  Object.keys(source).forEach(key => {
    const value = source[key]
    if (Array.isArray(value)) {
      target[key] = value.slice()
      return
    }
    if (value && typeof value === 'object') {
      if (!target[key] || typeof target[key] !== 'object' || Array.isArray(target[key])) {
        target[key] = {}
      }
      deepMerge(target[key], value)
      return
    }
    target[key] = value
  })
  return target
}

function clampNumber(value, min, max, fallback) {
  const numeric = Number(value)
  if (Number.isNaN(numeric)) {
    return fallback
  }
  return Math.max(min, Math.min(max, numeric))
}

function deriveKey() {
  return crypto.createHash('sha256').update(AES_SECRET).digest()
}

function encryptValue(value) {
  if (!value) {
    return ''
  }
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-cbc', deriveKey(), iv)
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()])
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`
}

function decryptValue(value) {
  if (!value || typeof value !== 'string' || !value.includes(':')) {
    return value || ''
  }
  const [ivHex, encryptedHex] = value.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const decipher = crypto.createDecipheriv('aes-256-cbc', deriveKey(), iv)
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, 'hex')),
    decipher.final()
  ])
  return decrypted.toString('utf8')
}

function sanitizeConfigForStorage(config) {
  const next = normalizeConfig(config)
  if (next.minio.secretKey) {
    next.minio.secretKey = encryptValue(next.minio.secretKey)
  }
  return next
}

function hydrateConfigForClient(config) {
  const next = normalizeConfig(config)
  if (next.minio.secretKey) {
    try {
      next.minio.secretKey = decryptValue(next.minio.secretKey)
    } catch (error) {
      log('CONFIG', 'MinIO secret 解密失败，将返回空值')
      next.minio.secretKey = ''
    }
  }
  return next
}

async function ensureUserFiles(userId) {
  const userDir = getUserDir(userId)
  await ensureDir(userDir)
  const configPath = getConfigPath(userId)
  const webhookPath = getWebhookPath(userId)
  try {
    await fs.promises.access(configPath)
  } catch (error) {
    await fs.promises.writeFile(
      configPath,
      JSON.stringify(sanitizeConfigForStorage(DEFAULT_CONFIG), null, 2),
      { mode: 0o600 }
    )
  }
  try {
    await fs.promises.access(webhookPath)
  } catch (error) {
    await fs.promises.writeFile(webhookPath, '[]', { mode: 0o600 })
  }
}

async function createFreshUser(req, res) {
  const userId = crypto.randomUUID()
  const config = await ensureStreamUrls(req, userId, DEFAULT_CONFIG)
  res.cookie(COOKIE_NAME, userId, {
    httpOnly: false,
    maxAge: COOKIE_MAX_AGE,
    sameSite: 'lax'
  })
  log('USER', `创建新用户 ${userId}`)
  return {
    userId,
    webhookUrl: buildWebhookUrl(req, userId),
    config
  }
}

async function loadUserConfig(userId) {
  await ensureUserFiles(userId)
  const raw = await fs.promises.readFile(getConfigPath(userId), 'utf8')
  return hydrateConfigForClient(JSON.parse(raw || '{}'))
}

async function saveUserConfig(userId, config) {
  await ensureUserFiles(userId)
  const normalized = sanitizeConfigForStorage(config)
  await fs.promises.writeFile(getConfigPath(userId), JSON.stringify(normalized, null, 2), {
    mode: 0o600
  })
  return hydrateConfigForClient(normalized)
}

async function ensureStreamUrls(req, userId, config) {
  const host = config.streaming.serverHost || getServerHost(req)
  const nextConfig = normalizeConfig(config)
  nextConfig.streaming.serverHost = host

  if (!nextConfig.streaming.airport.streamKey) {
    nextConfig.streaming.airport = createStreamConfig(userId, 'airport', host)
  } else {
    nextConfig.streaming.airport = {
      ...nextConfig.streaming.airport,
      ...buildStreamUrls(host, nextConfig.streaming.airport.streamKey)
    }
  }

  if (!nextConfig.streaming.drone.streamKey) {
    nextConfig.streaming.drone = createStreamConfig(userId, 'drone', host)
  } else {
    nextConfig.streaming.drone = {
      ...nextConfig.streaming.drone,
      ...buildStreamUrls(host, nextConfig.streaming.drone.streamKey)
    }
  }

  return saveUserConfig(userId, nextConfig)
}

async function readWebhookMessages(userId) {
  await ensureUserFiles(userId)
  const raw = await fs.promises.readFile(getWebhookPath(userId), 'utf8')
  const list = JSON.parse(raw || '[]')
  return Array.isArray(list) ? list : []
}

async function writeWebhookMessages(userId, messages) {
  await fs.promises.writeFile(getWebhookPath(userId), JSON.stringify(messages, null, 2), {
    mode: 0o600
  })
}

function cleanupWebhookMessages(messages, retentionDays, limit) {
  const expireAt = Date.now() - retentionDays * 24 * 60 * 60 * 1000
  return messages
    .filter(item => Number(item.receivedAt) >= expireAt)
    .sort((a, b) => Number(b.receivedAt) - Number(a.receivedAt))
    .slice(0, limit)
}

function getRequestUserId(req) {
  return req.cookies[COOKIE_NAME] || req.headers['x-user-id'] || req.query.userId || ''
}

async function attachUser(req, res, next) {
  try {
    let userId = getRequestUserId(req)
    if (!userId) {
      userId = crypto.randomUUID()
      res.cookie(COOKIE_NAME, userId, {
        httpOnly: false,
        maxAge: COOKIE_MAX_AGE,
        sameSite: 'lax'
      })
      log('USER', `创建新用户 ${userId}`)
    }
    req.userId = userId
    await ensureUserFiles(userId)
    next()
  } catch (error) {
    next(error)
  }
}

function paginate(items, page, pageSize) {
  const validPage = clampNumber(page, 1, Number.MAX_SAFE_INTEGER, 1)
  const validSize = clampNumber(pageSize, 1, 100, 20)
  const start = (validPage - 1) * validSize
  return {
    page: validPage,
    pageSize: validSize,
    total: items.length,
    items: items.slice(start, start + validSize)
  }
}

function createMinioClient(config) {
  if (!config.endPoint || !config.accessKey || !config.secretKey) {
    const error = new Error('请先完善 MinIO 连接配置')
    error.statusCode = 400
    error.code = 'MINIO_NOT_CONFIGURED'
    throw error
  }
  return new MinioClient({
    endPoint: config.endPoint,
    port: clampNumber(config.port, 1, 65535, 9000),
    useSSL: Boolean(config.useSSL),
    accessKey: config.accessKey,
    secretKey: config.secretKey
  })
}

function streamToArray(stream) {
  return new Promise((resolve, reject) => {
    const results = []
    stream.on('data', item => results.push(item))
    stream.on('error', reject)
    stream.on('end', () => resolve(results))
  })
}

function parseCookies(header = '') {
  return header.split(';').reduce((acc, part) => {
    const [key, ...rest] = part.trim().split('=')
    if (!key) {
      return acc
    }
    acc[key] = decodeURIComponent(rest.join('='))
    return acc
  }, {})
}

function writeProxyBody(proxyReq, req) {
  if (!req.body || !Object.keys(req.body).length) {
    return
  }
  const contentType = proxyReq.getHeader('Content-Type') || req.headers['content-type'] || ''
  let bodyData = ''
  if (String(contentType).includes('application/json')) {
    bodyData = JSON.stringify(req.body)
  } else if (String(contentType).includes('application/x-www-form-urlencoded')) {
    bodyData = new URLSearchParams(req.body).toString()
  }
  if (!bodyData) {
    return
  }
  proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData))
  proxyReq.write(bodyData)
}

function pushUserEvent(userId, payload) {
  const clients = websocketClients.get(userId) || new Set()
  const message = JSON.stringify(payload)
  clients.forEach(client => {
    if (client.readyState === client.OPEN) {
      client.send(message)
    }
  })
}

function getDfrTargetUrl(req) {
  return req.headers['x-proxy-target'] || ''
}

function validateDfrTargetUrl(targetUrl) {
  if (!targetUrl) {
    const error = new Error('请求缺少 x-proxy-target')
    error.statusCode = 400
    return { error }
  }
  try {
    const url = new URL(targetUrl)
    if (url.origin !== ALLOWED_DFR_PROXY_ORIGIN || url.pathname !== ALLOWED_DFR_PROXY_PATH) {
      const error = new Error('仅允许代理到固定的 DFR 工作流地址')
      error.statusCode = 400
      return { error }
    }
    return { url }
  } catch (parseError) {
    const error = new Error('x-proxy-target 不是合法 URL')
    error.statusCode = 400
    return { error }
  }
}

function validateDfrRequestBody(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return '请求体必须为 JSON 对象'
  }
  if (typeof body.workflow_uuid !== 'string' || !body.workflow_uuid.trim()) {
    return 'workflow_uuid 不能为空'
  }
  if (body.trigger_type !== 0) {
    return 'trigger_type 必须为 0'
  }
  if (typeof body.name !== 'string' || !body.name.trim()) {
    return 'name 不能为空'
  }
  if (!body.params || typeof body.params !== 'object' || Array.isArray(body.params)) {
    return 'params 必须为对象'
  }
  if (typeof body.params.creator !== 'string' || !body.params.creator.trim()) {
    return 'params.creator 不能为空'
  }
  const latitude = Number(body.params.latitude)
  const longitude = Number(body.params.longitude)
  const level = Number(body.params.level)
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    return 'params.latitude 超出范围'
  }
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    return 'params.longitude 超出范围'
  }
  if (!Number.isInteger(level) || level < 1 || level > 5) {
    return 'params.level 必须是 1-5 的整数'
  }
  if (typeof body.params.desc !== 'string' || !body.params.desc.trim()) {
    return 'params.desc 不能为空'
  }
  return ''
}

app.use(attachUser)

app.get('/api/user/bootstrap', async (req, res, next) => {
  try {
    let config = await loadUserConfig(req.userId)
    config = await ensureStreamUrls(req, req.userId, config)
    res.json({
      userId: req.userId,
      webhookUrl: buildWebhookUrl(req, req.userId),
      config
    })
  } catch (error) {
    next(error)
  }
})

app.post('/api/user/reset', async (req, res, next) => {
  try {
    const result = await createFreshUser(req, res)
    res.json(result)
  } catch (error) {
    next(error)
  }
})

app.get('/api/config', async (req, res, next) => {
  try {
    const config = await loadUserConfig(req.userId)
    res.json({
      userId: req.userId,
      webhookUrl: buildWebhookUrl(req, req.userId),
      config
    })
  } catch (error) {
    next(error)
  }
})

app.put('/api/config', async (req, res, next) => {
  try {
    const current = await loadUserConfig(req.userId)
    const merged = normalizeConfig(deepMerge(current, req.body || {}))
    const saved = await ensureStreamUrls(req, req.userId, merged)
    res.json({
      userId: req.userId,
      webhookUrl: buildWebhookUrl(req, req.userId),
      config: saved
    })
  } catch (error) {
    next(error)
  }
})

app.post('/api/streams/refresh', async (req, res, next) => {
  try {
    const current = await loadUserConfig(req.userId)
    current.streaming.airport = createStreamConfig(
      req.userId,
      'airport',
      current.streaming.serverHost || getServerHost(req)
    )
    current.streaming.drone = createStreamConfig(
      req.userId,
      'drone',
      current.streaming.serverHost || getServerHost(req)
    )
    const saved = await saveUserConfig(req.userId, current)
    res.json({ config: saved })
  } catch (error) {
    next(error)
  }
})

app.get('/api/webhook/messages', async (req, res, next) => {
  try {
    const config = await loadUserConfig(req.userId)
    const messages = cleanupWebhookMessages(
      await readWebhookMessages(req.userId),
      config.webhook.retentionDays,
      config.webhook.messageLimit
    )
    await writeWebhookMessages(req.userId, messages)
    res.json(paginate(messages, req.query.page, req.query.pageSize))
  } catch (error) {
    next(error)
  }
})

app.delete('/api/webhook/messages', async (req, res, next) => {
  try {
    await writeWebhookMessages(req.userId, [])
    res.json({ success: true })
  } catch (error) {
    next(error)
  }
})

app.post('/api/minio/test', async (req, res, next) => {
  try {
    const current = await loadUserConfig(req.userId)
    const minioConfig = { ...current.minio, ...(req.body || {}) }
    const client = createMinioClient(minioConfig)
    await client.listBuckets()
    res.json({ success: true, message: '连接成功' })
  } catch (error) {
    next(error)
  }
})

app.get('/api/minio/buckets', async (req, res, next) => {
  try {
    const config = await loadUserConfig(req.userId)
    const client = createMinioClient(config.minio)
    const buckets = await client.listBuckets()
    res.json({
      items: buckets.map(item => ({
        name: item.name,
        creationDate: item.creationDate
      }))
    })
  } catch (error) {
    next(error)
  }
})

app.post('/api/minio/buckets', async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim()
    if (!name) {
      res.status(400).json({ message: '桶名称不能为空' })
      return
    }
    const config = await loadUserConfig(req.userId)
    const client = createMinioClient(config.minio)
    const exists = await client.bucketExists(name)
    if (exists) {
      res.status(400).json({ message: '桶已存在' })
      return
    }
    await client.makeBucket(name)
    res.json({ success: true })
  } catch (error) {
    next(error)
  }
})

app.delete('/api/minio/buckets/:name', async (req, res, next) => {
  try {
    const bucketName = req.params.name
    const config = await loadUserConfig(req.userId)
    const client = createMinioClient(config.minio)
    const objects = await streamToArray(client.listObjectsV2(bucketName, '', true))
    if (objects.length > 0) {
      res.status(400).json({ message: '仅支持删除空存储桶' })
      return
    }
    await client.removeBucket(bucketName)
    res.json({ success: true })
  } catch (error) {
    next(error)
  }
})

app.get('/api/minio/objects', async (req, res, next) => {
  try {
    const bucket = String(req.query.bucket || '').trim()
    const prefix = String(req.query.prefix || '')
    if (!bucket) {
      res.status(400).json({ message: 'bucket 参数不能为空' })
      return
    }
    const config = await loadUserConfig(req.userId)
    const client = createMinioClient(config.minio)
    const objectList = await streamToArray(client.listObjectsV2(bucket, prefix, false))
    const folders = []
    const files = []
    objectList.forEach(item => {
      if (item.prefix) {
        folders.push({
          name: path.basename(item.prefix.replace(/\/$/, '')),
          prefix: item.prefix,
          type: 'folder'
        })
      } else {
        files.push({
          name: path.basename(item.name),
          objectName: item.name,
          size: item.size,
          lastModified: item.lastModified,
          etag: item.etag,
          type: 'file'
        })
      }
    })
    const filesWithTags = await Promise.all(
      files.map(async item => {
        try {
          const objectTags = normalizeMinioTags(await client.getObjectTagging(bucket, item.objectName))
          return {
            ...item,
            tags: {
              name_base64: objectTags?.name_base64 || '',
              path_base64: objectTags?.path_base64 || ''
            }
          }
        } catch (error) {
          return {
            ...item,
            tags: {
              name_base64: '',
              path_base64: ''
            }
          }
        }
      })
    )
    const merged = [...folders, ...filesWithTags]
    res.json({
      prefix,
      ...paginate(merged, req.query.page, req.query.pageSize)
    })
  } catch (error) {
    next(error)
  }
})

app.get('/api/minio/download', async (req, res, next) => {
  try {
    const bucket = String(req.query.bucket || '').trim()
    const objectName = String(req.query.objectName || '').trim()
    if (!bucket || !objectName) {
      res.status(400).json({ message: 'bucket 和 objectName 参数不能为空' })
      return
    }
    const config = await loadUserConfig(req.userId)
    const client = createMinioClient(config.minio)
    const downloadUrl = await client.presignedGetObject(bucket, objectName, 60)
    res.json({ url: downloadUrl })
  } catch (error) {
    next(error)
  }
})

app.post('/webhook/:userId', async (req, res, next) => {
  try {
    const userId = req.params.userId
    await ensureUserFiles(userId)
    const config = await loadUserConfig(userId)
    const allowedIps = config.webhook.allowedIps || []
    const requestIp = req.ip || req.socket.remoteAddress || ''

    if (allowedIps.length > 0 && !allowedIps.includes(requestIp)) {
      res.status(403).json({ message: '来源 IP 不允许' })
      return
    }

    const messages = await readWebhookMessages(userId)
    const nextMessage = {
      id: crypto.randomUUID(),
      receivedAt: Date.now(),
      ip: requestIp,
      payload: req.body || {}
    }
    const cleanedMessages = cleanupWebhookMessages(
      [nextMessage, ...messages],
      config.webhook.retentionDays,
      config.webhook.messageLimit
    )
    await writeWebhookMessages(userId, cleanedMessages)
    pushUserEvent(userId, { type: 'webhook', data: nextMessage })
    log('WEBHOOK', `用户 ${userId} 收到 Event API 消息`)
    res.json({ success: true })
  } catch (error) {
    next(error)
  }
})

// =====================================================================
// 巡检航线：通过 FlightHub Sync 外部存储桶实现双向同步
// ---------------------------------------------------------------------
// 实现原理（不依赖 wayline OpenAPI 端点）：
//   司空 2 的 FlightHub Sync 支持挂载 S3 兼容外部存储桶（含 MinIO），
//   配置「存储配置」+「同步规则」后，双端【新增】文件双向同步。
//   注意：同步是增量的，删除不会传播——任一侧删除文件，另一侧仍保留。
//
// 【实测得到的真实目录结构】司空 2 使用如下路径存放航线：
//   {预设路径}/fh_sync/{组织UUID}/{项目UUID}/wayline/{航线UUID}.kmz
//   例：wayline/fh_sync/{org-uuid}/{project-uuid}/wayline/{wayline-uuid}.kmz
//   另有探针文件 {预设路径}/fh_sync/check_file.txt 用于连通性校验。
//
// 因此中间件写入航线时，必须落在同一目录下，否则司空 2 不会收录。
// 组织/项目 UUID 需在配置中指定（可从已同步下来的路径中读取）。
//
// 前置条件（在司空 2 控制台完成）：
//   1. 添加存储配置：类型选 S3 兼容，填 Endpoint / 桶名 / AK / SK / 预设路径；
//   2. 添加同步规则：数据类型选航线，关联该存储配置与项目，方向选双向。
//
// 仍需 OpenAPI 的部分：创建飞行任务（/openapi/v0.1/flight-task）。
// =====================================================================

const WAYLINE_SYNC_SEGMENT = 'fh_sync'

// 从对象路径解析出组织/项目 UUID：{prefix}/fh_sync/{org}/{project}/wayline/{file}
// 解析对象路径。由于同步方向不对称，桶内会同时存在两种结构：
//   A. 司空 2 下发：wayline/fh_sync/{org}/{project}/wayline/{file}（头部多一层 wayline）
//   B. 本端上传：         fh_sync/{org}/{project}/wayline/{file}
function parseWaylinePath(objectName) {
  const marker = `${WAYLINE_SYNC_SEGMENT}/`
  const at = objectName.indexOf(marker)
  if (at < 0) return null
  const head = objectName.slice(0, at).replace(/\/$/, '')
  const rest = objectName.slice(at + marker.length).split('/')
  // 期望结构：org / project / wayline / file
  if (rest.length === 4 && rest[2] === 'wayline') {
    return {
      orgUuid: rest[0],
      projectUuid: rest[1],
      // 头部带前缀的是司空 2 下发的；无前缀的是本端上传待同步
      source: head ? 'fh2' : 'local'
    }
  }
  return null
}

function decodeBase64(value) {
  if (!value) return ''
  try {
    return Buffer.from(String(value), 'base64').toString('utf8')
  } catch (e) {
    return ''
  }
}

// 读取司空 2 写入的对象标签，其中 name_base64 为航线原始名称
async function readWaylineTags(client, bucket, objectName) {
  try {
    const raw = await client.getObjectTagging(bucket, objectName)
    const tags = normalizeMinioTags(raw)
    return {
      waylineId: tags.id || '',
      displayName: decodeBase64(tags.name_base64),
      folder: tags.path || decodeBase64(tags.path_base64)
    }
  } catch (e) {
    return { waylineId: '', displayName: '', folder: '' }
  }
}

function getWaylineStorageConfig(config) {
  const wayline = config.wayline || {}
  const trim = v => String(v || '').trim().replace(/^\/+|\/+$/g, '')
  return {
    bucket: String(wayline.bucket || '').trim(),
    prefix: trim(wayline.prefix),
    orgUuid: trim(wayline.orgUuid),
    projectUuid: trim(wayline.projectUuid)
  }
}

// 司空 2 航线同步目录：{prefix}/fh_sync/{orgUuid}/{projectUuid}/wayline
// 上传目标目录（三方桶 → 司空 2）：
//   fh_sync/{org}/{project}/wayline/{file}
//
// 注意司空 2 同步存在方向不对称：
//   · 司空 2 → 三方桶：会自动在头部加上 wayline/，写成
//       wayline/fh_sync/{org}/{project}/wayline/{file}（我们无法修改）
//   · 三方桶 → 司空 2：头部不能带该前缀，必须写成
//       fh_sync/{org}/{project}/wayline/{file}，否则不被收录
// 因此 prefix 默认留空；尾部的 wayline 段固定保留。
function buildWaylineSyncDir(cfg) {
  const parts = []
  if (cfg.prefix) parts.push(cfg.prefix)
  parts.push(WAYLINE_SYNC_SEGMENT)
  if (cfg.orgUuid) parts.push(cfg.orgUuid)
  if (cfg.projectUuid) parts.push(cfg.projectUuid)
  parts.push('wayline')
  return parts.join('/')
}

function buildWaylineObjectName(cfg, fileName) {
  const safeName = String(fileName).replace(/[\\/]/g, '_')
  return `${buildWaylineSyncDir(cfg)}/${safeName}`
}


function requireWaylineBucket(config) {
  const cfg = getWaylineStorageConfig(config)
  if (!cfg.bucket) {
    const error = new Error('请先在「配置设置」中填写航线同步存储桶（wayline.bucket）')
    error.statusCode = 400
    error.code = 'WAYLINE_BUCKET_NOT_CONFIGURED'
    throw error
  }
  return cfg
}

// 1) 上传航线文件：真实写入被 FlightHub Sync 挂载的 MinIO 桶
app.post(
  '/api/wayline/upload',
  express.raw({ type: '*/*', limit: '50mb' }),
  async (req, res, next) => {
    try {
      const fileName = String(req.query.name || '').trim() || 'wayline.kmz'
      const buffer = req.body
      if (!buffer || !buffer.length) {
        res.status(400).json({ message: '未收到航线文件内容' })
        return
      }
      if (!/\.(kmz|kml)$/i.test(fileName)) {
        res.status(400).json({ message: '航线文件需为 .kmz 或 .kml' })
        return
      }

      const config = await loadUserConfig(req.userId)
      const cfg = requireWaylineBucket(config)
      if (!cfg.orgUuid || !cfg.projectUuid) {
        res.status(400).json({
          message:
            '请先在「配置设置」中填写组织 UUID 与项目 UUID。可先在司空 2 中新建一条航线，同步下来后点「自动识别」获取。',
          code: 'WAYLINE_IDENTITY_NOT_CONFIGURED'
        })
        return
      }
      const client = createMinioClient(config.minio)

      const exists = await client.bucketExists(cfg.bucket)
      if (!exists) {
        res.status(400).json({
          message: `存储桶 ${cfg.bucket} 不存在，请先创建并在司空 2 中挂载`
        })
        return
      }

      const bucket = cfg.bucket
      const objectName = buildWaylineObjectName(cfg, fileName)
      await client.putObject(bucket, objectName, buffer, buffer.length, {
        'Content-Type': 'application/vnd.google-earth.kmz'
      })

      log('WAYLINE', `用户 ${req.userId} 写入航线 ${bucket}/${objectName} (${buffer.length} bytes)`)
      res.json({
        success: true,
        wayline: {
          name: fileName,
          bucket,
          objectName,
          size: buffer.length,
          uploadedAt: Date.now()
        },
        notice:
          '文件已写入司空 2 航线同步目录。FlightHub Sync 将自动收录，耗时取决于其扫描周期。'
      })
    } catch (error) {
      next(error)
    }
  }
)

// 2) 列出同步目录中的航线（同时体现司空 2 侧同步下来的航线，即双向同步效果）
app.get('/api/wayline/list', async (req, res, next) => {
  try {
    const config = await loadUserConfig(req.userId)
    const cfg = getWaylineStorageConfig(config)
    if (!cfg.bucket) {
      res.json({ items: [], bucket: '', prefix: cfg.prefix, configured: false })
      return
    }

    const client = createMinioClient(config.minio)
    const exists = await client.bucketExists(cfg.bucket)
    if (!exists) {
      res.json({ items: [], bucket: cfg.bucket, prefix: cfg.prefix, configured: false, message: '存储桶不存在' })
      return
    }

    const objects = await streamToArray(client.listObjectsV2(cfg.bucket, '', true))
    const waylineObjects = objects.filter(o => o.name && /\.(kmz|kml)$/i.test(o.name))

    // 逐条读取标签（Demo 量级较小，可接受）。标签含司空 2 写入的原始航线名。
    const items = await Promise.all(
      waylineObjects.map(async o => {
        const identity = parseWaylinePath(o.name)
        const tags = await readWaylineTags(client, cfg.bucket, o.name)
        const dir = o.name.slice(0, o.name.lastIndexOf('/'))
        return {
          // 优先展示司空 2 的原始航线名，回退到文件名
          displayName: tags.displayName || path.basename(o.name),
          fileName: path.basename(o.name),
          waylineId: tags.waylineId || path.basename(o.name).replace(/\.(kmz|kml)$/i, ''),
          folder: tags.folder || '',
          // 每条航线自带来源信息，支持多组织多项目混合
          orgUuid: identity ? identity.orgUuid : '',
          projectUuid: identity ? identity.projectUuid : '',
          // fh2 = 司空 2 同步下来；local = 本端上传待同步
          source: identity ? identity.source : '',
          bucket: cfg.bucket,
          prefix: cfg.prefix,
          syncDir: dir,
          objectName: o.name,
          size: o.size,
          lastModified: o.lastModified,
          inSyncDir: Boolean(identity)
        }
      })
    )

    items.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
    res.json({ items, bucket: cfg.bucket, prefix: cfg.prefix, configured: true })
  } catch (error) {
    next(error)
  }
})

// 3) 查询同步状态：确认对象仍在桶内（司空 2 侧是否已入库需在司空 2 航线库确认）
app.get('/api/wayline/status', async (req, res, next) => {
  try {
    const objectName = String(req.query.objectName || '').trim()
    if (!objectName) {
      res.status(400).json({ message: 'objectName 不能为空' })
      return
    }
    const config = await loadUserConfig(req.userId)
    const { bucket } = requireWaylineBucket(config)
    const client = createMinioClient(config.minio)
    const stat = await client.statObject(bucket, objectName)
    res.json({ exists: true, bucket, objectName, size: stat.size, lastModified: stat.lastModified })
  } catch (error) {
    if (error && (error.code === 'NotFound' || error.code === 'NoSuchKey')) {
      res.json({ exists: false })
      return
    }
    next(error)
  }
})

// 4) 删除航线（仅删除桶内副本；同步为增量，删除不会传播到司空 2 侧）
app.delete('/api/wayline', async (req, res, next) => {
  try {
    const objectName = String(req.query.objectName || '').trim()
    if (!objectName) {
      res.status(400).json({ message: 'objectName 不能为空' })
      return
    }
    const config = await loadUserConfig(req.userId)
    const { bucket } = requireWaylineBucket(config)
    const client = createMinioClient(config.minio)
    await client.removeObject(bucket, objectName)
    log('WAYLINE', `用户 ${req.userId} 删除航线 ${path.basename(objectName)}`)
    res.json({ success: true })
  } catch (error) {
    next(error)
  }
})

// 5) 创建飞行任务（仍需 OpenAPI，未接通）
app.post('/api/wayline/plan-task', async (req, res) => {
  // TODO(二开)：调用司空 2 /openapi/v0.1/flight-task 创建飞行任务，
  // 请求头使用 X-User-Token + x-project-uuid，请求体字段（航线标识、
  // 机场 SN、任务类型、执行时间等）请以最新 Apifox 文档为准，切勿照抄。
  // 航线标识需先从司空 2 航线列表接口获取，而非使用本地对象名。
  res.status(501).json({
    message:
      '创建飞行任务需调用司空 2 OpenAPI（/openapi/v0.1/flight-task），本 Demo 未接通。请参考 ARCHITECTURE.md 与 Apifox 文档自行实现。',
    code: 'NOT_IMPLEMENTED'
  })
})

app.use(
  '/api/proxy',
  (req, res, next) => {
    try {
      if (req.method !== 'POST') {
        res.status(405).json({ message: 'DFR 代理仅支持 POST' })
        return
      }

      const token = String(req.headers['x-user-token'] || '').trim()
      const project = String(req.headers['x-project-uuid'] || '').trim()
      const target = String(req.headers['x-proxy-target'] || '').trim()

      if (!token) {
        res.status(400).json({ message: '请求缺少 X-User-Token' })
        return
      }
      if (!project) {
        res.status(400).json({ message: '请求缺少 x-project-uuid' })
        return
      }
      const targetResult = validateDfrTargetUrl(target)
      if (targetResult.error) {
        res.status(targetResult.error.statusCode || 400).json({ message: targetResult.error.message })
        return
      }
      const bodyError = validateDfrRequestBody(req.body)
      if (bodyError) {
        res.status(400).json({ message: bodyError })
        return
      }

      req.validatedDfrTarget = targetResult.url.toString()

      next()
    } catch (error) {
      next(error)
    }
  },
  createProxyMiddleware({
    target: 'https://es-flight-api-cn.djigate.com',
    changeOrigin: true,
    proxyTimeout: 30000,
    timeout: 30000,
    router(req) {
      const targetUrl = req.validatedDfrTarget || getDfrTargetUrl(req)
      const url = new URL(targetUrl)
      return `${url.protocol}//${url.host}`
    },
    pathRewrite(_currentPath, req) {
      const targetUrl = req.validatedDfrTarget || getDfrTargetUrl(req)
      const url = new URL(targetUrl)
      return `${url.pathname}${url.search}`
    },
    onProxyReq(proxyReq, req, res) {
      proxyReq.removeHeader('x-proxy-target')
      proxyReq.setHeader('X-User-Token', String(req.headers['x-user-token'] || '').trim())
      proxyReq.setHeader('x-project-uuid', String(req.headers['x-project-uuid'] || '').trim())
      writeProxyBody(proxyReq, req)
      const targetUrl = req.validatedDfrTarget || getDfrTargetUrl(req)
      res.locals.proxyTarget = targetUrl || req.url
      log('Proxy REQ', `${req.method} ${req.url} -> ${res.locals.proxyTarget}`, {
        userId: req.userId,
        project: String(req.headers['x-project-uuid'] || '').trim(),
        hasToken: Boolean(String(req.headers['x-user-token'] || '').trim())
      })
    },
    onProxyRes(proxyRes, req, res) {
      log('Proxy RES', `${req.method} ${res.locals.proxyTarget || req.url} | ${proxyRes.statusCode}`)
    },
    onError(err, _req, res) {
      log('PROXY', '代理错误', err.message)
      res.status(500).json({ message: 'Proxy Error' })
    }
  })
)

if (fs.existsSync(STATIC_ROOT)) {
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/webhook/')) {
      next()
      return
    }
    res.sendFile(path.join(STATIC_ROOT, 'index.html'))
  })
}

app.use((error, _req, res, _next) => {
  log('ERROR', error.stack || error.message || String(error))
  res.status(error.statusCode || 500).json({
    message: error.message || '服务器内部错误',
    code: error.code || 'INTERNAL_SERVER_ERROR'
  })
})

server.on('upgrade', async (request, socket, head) => {
  try {
    const pathname = new URL(request.url, `http://${request.headers.host}`).pathname
    if (pathname !== '/ws') {
      socket.destroy()
      return
    }
    const cookies = parseCookies(request.headers.cookie || '')
    const userId = cookies[COOKIE_NAME]
    if (!userId) {
      socket.destroy()
      return
    }
    request.userId = userId
    socket.on('error', err => {
      log('WS', `升级阶段 socket 异常: ${err.message}`)
    })
    wss.handleUpgrade(request, socket, head, ws => {
      wss.emit('connection', ws, request)
    })
  } catch (error) {
    socket.destroy()
  }
})

// WebSocketServer 级别的错误兜底
wss.on('error', err => {
  log('WS', `WebSocketServer 异常: ${err.message}`)
})

wss.on('connection', (ws, request) => {
  const userId = request.userId
  if (!websocketClients.has(userId)) {
    websocketClients.set(userId, new Set())
  }
  websocketClients.get(userId).add(ws)

  const dropClient = () => {
    const clients = websocketClients.get(userId)
    if (!clients) {
      return
    }
    clients.delete(ws)
    if (clients.size === 0) {
      websocketClients.delete(userId)
    }
  }

  // 关键：必须监听 error，否则畸形帧会触发未捕获的 'error' 事件并让整个进程退出
  ws.on('error', err => {
    log('WS', `客户端连接异常，已断开: ${err.message}`)
    dropClient()
    try {
      ws.terminate()
    } catch (e) {
      // 忽略关闭阶段的二次异常
    }
  })

  ws.on('close', dropClient)

  try {
    ws.send(JSON.stringify({ type: 'connected', data: { userId } }))
  } catch (error) {
    log('WS', `发送握手消息失败: ${error.message}`)
  }
})

// 进程级兜底：避免任何漏网的异常直接杀死服务
process.on('uncaughtException', error => {
  log('FATAL', `未捕获异常（进程继续运行）: ${error.stack || error.message}`)
})
process.on('unhandledRejection', reason => {
  log('FATAL', `未处理的 Promise 拒绝: ${reason}`)
})

;(async () => {
  await ensureDir(USERS_ROOT)
  server.listen(PORT, () => {
    log('BOOT', `飞行指挥平台已启动ver0519: http://localhost:${PORT}`)
    log('BOOT', `当前主机IP: ${getLocalIpAddress()}`)
    log('BOOT', `代理接口: http://localhost:${PORT}/api/proxy`)
    log('BOOT', `用户初始化: http://localhost:${PORT}/api/user/bootstrap`)
  })
})()
