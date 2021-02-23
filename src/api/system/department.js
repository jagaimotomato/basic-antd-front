import request from '@/utils/request'
import { api } from '@/api/api'

export function getTreeList (query) {
  return request({
    url: api.DepartmentTree,
    method: 'get',
    params: query
  })
}

export function getTree (id) {
  return request({
    url: api.DepartmentTree + '/' + id,
    method: 'get'
  })
}

export function getPage () {
  return request({
    url: api.DepartmentPage,
    method: 'get'
  })
}

export function get (id) {
  return request({
    url: api.Department + '/' + id,
    method: 'get'
  })
}

export function create (data) {
  return request({
    url: api.Department,
    method: 'post',
    data: data
  })
}

export function update (data) {
  return request({
    url: api.Department,
    method: 'put',
    data: data
  })
}

export function del (id) {
  return request({
    url: api.Department + '/' + id,
    method: 'delete'
  })
}
