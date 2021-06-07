import request from '@/utils/request'
import { api } from '@/api/api'

export function get () {
  return request({
    url: api.Account,
    method: 'get'
  })
}

export function update (data) {
  return request({
    url: api.Account,
    method: 'put',
    data: data
  })
}

export function updatePassword (data) {
  return request({
    url: api.AccountPas,
    method: 'put',
    data: data
  })
}
