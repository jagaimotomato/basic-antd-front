import request from '@/utils/request'
import { api } from '@/api/api'

export function getPage (query) {
  return request({
    url: api.ApiPage,
    method: 'get',
    params: query
  })
}

export function getList () {
  return request({
    url: api.ApiList,
    method: 'get'
  })
}

export function getCasbinList (roleKey) {
  return request({
    url: api.CasbinList + '/' + roleKey,
    method: 'get'
  })
}

export function get (id) {
  return request({
    url: api.Api + '/' + id,
    method: 'get'
  })
}

export function create (data) {
  return request({
    url: api.Api,
    method: 'post',
    data: data
  })
}

export function update (data) {
  return request({
    url: api.Api,
    method: 'put',
    data: data
  })
}

export function del (id) {
  return request({
    url: api.Api + '/' + id,
    method: 'delete'
  })
}
