import request from '@/utils/request'
import { api } from '@/api/api'

export function getPage (query) {
  return request({
    url: api.PermissionPage,
    method: 'get',
    params: query
  })
}

export function getList (query) {
  return request({
    url: api.PermissionList,
    method: 'get',
    params: query
  })
}

export function getTree () {
  return request({
    url: api.PermissionTree,
    method: 'get'
  })
}

export function getRoleTree (id) {
  return request({
    url: api.PermissionTree + '/' + id,
    method: 'get'
  })
}

export function get (id) {
  return request({
    url: api.Permission + '/' + id,
    method: 'get'
  })
}

export function create (data) {
  return request({
    url: api.Permission,
    method: 'post',
    data: data
  })
}

export function update (data) {
  return request({
    url: api.Permission,
    method: 'put',
    data: data
  })
}

export function del (id) {
  return request({
    url: api.Permission + '/' + id,
    method: 'delete'
  })
}
