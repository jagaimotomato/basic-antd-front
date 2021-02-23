import request from '@/utils/request'
import { api } from '@/api/api'

export function getLoginLogPage (query) {
  return request({
    url: api.LoginLogPage,
    method: 'get',
    params: query
  })
}

export function getOperationLogPage (query) {
  return request({
    url: api.OperationLogPage,
    method: 'get',
    params: query
  })
}
