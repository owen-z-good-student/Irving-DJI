import request from '@/utils/request'

export function dispatchFlight(data) {
  return request({
    url: '/proxy',
    method: 'post',
    data,
    timeout: 30000
  })
}
