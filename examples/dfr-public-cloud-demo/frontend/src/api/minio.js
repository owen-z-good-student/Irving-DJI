import request from '@/utils/request'

export function testMinioConnection(data) {
  return request({
    url: '/minio/test',
    method: 'post',
    data
  })
}

export function fetchBuckets() {
  return request({
    url: '/minio/buckets',
    method: 'get'
  })
}

export function createBucket(name) {
  return request({
    url: '/minio/buckets',
    method: 'post',
    data: { name }
  })
}

export function deleteBucket(name) {
  return request({
    url: `/minio/buckets/${encodeURIComponent(name)}`,
    method: 'delete'
  })
}

export function fetchObjects(params) {
  return request({
    url: '/minio/objects',
    method: 'get',
    params
  })
}

export function fetchDownloadUrl(params) {
  return request({
    url: '/minio/download',
    method: 'get',
    params
  })
}
