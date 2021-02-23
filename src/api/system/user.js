import request from '@/utils/request'
import { api } from '@/api/api'

export function getPage (query) {
  return request({
    url: api.UserPage,
    method: 'get',
    params: query
  })
}

export function get (id) {
  return request({
    url: api.User + '/' + id,
    method: 'get'
  })
}

export function create (data) {
  return request({
    url: api.User,
    method: 'post',
    data: data
  })
}

export function update (data) {
  return request({
    url: api.User,
    method: 'put',
    data: data
  })
}

export function updateStatus (data) {
  return request({
    url: api.UserStatus,
    method: 'put',
    params: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function del (id) {
  return request({
    url: api.User + '/' + id,
    method: 'delete'
  })
}
