import request from '@/utils/request'
import { api } from '@/api/api'

export function getDictDataList (query) {
  return request({
    url: api.DictDataList + '?type=' + query.type,
    method: 'get',
    params: query
  })
}

export function getDictTypeList (query) {
  return request({
    url: api.DictTypeList,
    params: query
  })
}

export function getDict (type) {
  return request({
    url: api.DictByType + type,
    method: 'get'
  })
}

export function getDictDataPage (query) {
  return request({
    url: api.DictDataPage,
    method: 'get',
    params: query
  })
}

export function getDictTypePage (query) {
  return request({
    url: api.DictTypePage,
    method: 'get',
    params: query
  })
}

export function getDictData (id) {
  return request({
    url: api.DictData + '/' + id,
    method: 'get'
  })
}

export function getDictType (id) {
  return request({
    url: api.DictType + '/' + id,
    method: 'get'
  })
}

export function createDictData (data) {
  return request({
    url: api.DictData,
    method: 'post',
    data: data
  })
}

export function createDictType (data) {
  return request({
    url: api.DictType,
    method: 'post',
    data: data
  })
}

export function updateDictData (data) {
  return request({
    url: api.DictData,
    method: 'put',
    data: data
  })
}

export function updateDictType (data) {
  return request({
    url: api.DictType,
    method: 'put',
    data: data
  })
}

export function delDictData (id) {
  return request({
    url: api.DictData + '/' + id,
    method: 'delete'
  })
}

export function delDictType (id) {
  return request({
    url: api.DictType + '/' + id,
    method: 'delete'
  })
}
