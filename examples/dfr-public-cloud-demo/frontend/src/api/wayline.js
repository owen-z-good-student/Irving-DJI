import request from '@/utils/request'

// 巡检航线：通过 FlightHub Sync 挂载的 MinIO 外部存储桶实现双向同步
// 上传 = 写入被挂载的桶；司空 2 侧会自动同步该航线

export function uploadWayline(file) {
  return request({
    url: '/wayline/upload',
    method: 'post',
    params: { name: file.name },
    data: file,
    headers: { 'Content-Type': 'application/octet-stream' },
    timeout: 120000
  })
}

export function fetchWaylines() {
  return request({
    url: '/wayline/list',
    method: 'get'
  })
}

export function fetchWaylineStatus(objectName) {
  return request({
    url: '/wayline/status',
    method: 'get',
    params: { objectName }
  })
}

export function deleteWayline(objectName) {
  return request({
    url: '/wayline',
    method: 'delete',
    params: { objectName }
  })
}
