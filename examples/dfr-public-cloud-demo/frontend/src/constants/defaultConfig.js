export const LOCAL_STORAGE_KEYS = {
  userId: 'dfr_user_id',
  config: 'dfr_system_config',
  localMap: 'dfr_local_map_config'
}

export const DEFAULT_CONFIG = {
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
    messageLimit: 100,
    retentionDays: 7,
    allowedIps: []
  }
}

export function cloneDefaultConfig() {
  return JSON.parse(JSON.stringify(DEFAULT_CONFIG))
}

export function mergeDeep(target, source) {
  const output = Array.isArray(target) ? target.slice() : { ...target }
  if (!source || typeof source !== 'object') {
    return output
  }

  Object.keys(source).forEach(key => {
    const value = source[key]
    if (Array.isArray(value)) {
      output[key] = value.slice()
      return
    }

    if (value && typeof value === 'object') {
      output[key] = mergeDeep(output[key] || {}, value)
      return
    }

    output[key] = value
  })

  return output
}

export function normalizeConfig(source = {}) {
  return mergeDeep(cloneDefaultConfig(), source)
}
