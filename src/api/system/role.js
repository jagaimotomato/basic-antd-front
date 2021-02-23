import request from '@/utils/request'
import { api } from '@/api/api'

export function getPage (query) {
  return request({
    url: api.RolePage,
    method: 'get',
    params: query
  })
}

export function getList () {
  return request({
    url: api.RoleList,
    method: 'get'
  })
}

export function get (id) {
  return request({
    url: api.Role + '/' + id,
    method: 'get'
  })
}

export function create (data) {
  return request({
    url: api.Role,
    method: 'post',
    data: data
  })
}

export function update (data) {
  return request({
    url: api.Role,
    method: 'put',
    data: data
  })
}

export function updateStatus (data) {
  return request({
    url: api.RoleStatus,
    method: 'put',
    params: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function del (id) {
  return request({
    url: api.Role + '/' + id,
    method: 'delete'
  })
}
