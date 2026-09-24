import request from '@/utils/request'

export function bootstrapUser() {
  return request({
    url: '/user/bootstrap',
    method: 'get'
  })
}

export function resetUser() {
  return request({
    url: '/user/reset',
    method: 'post'
  })
}

export function fetchConfig() {
  return request({
    url: '/config',
    method: 'get'
  })
}

export function updateConfig(data) {
  return request({
    url: '/config',
    method: 'put',
    data
  })
}

export function refreshStreams() {
  return request({
    url: '/streams/refresh',
    method: 'post'
  })
}

export function fetchWebhookMessages(params) {
  return request({
    url: '/webhook/messages',
    method: 'get',
    params
  })
}

export function clearWebhookMessages() {
  return request({
    url: '/webhook/messages',
    method: 'delete'
  })
}
