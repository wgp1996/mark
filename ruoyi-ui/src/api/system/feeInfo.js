import request from '@/utils/request'

// 查询帐夹列表
export function listFeeInfo(query) {
  return request({
    url: '/info/feeInfo/list',
    method: 'get',
    params: query
  })
}

// 查询帐夹详细
export function getFeeInfo(id) {
  return request({
    url: '/info/feeInfo/' + id,
    method: 'get'
  })
}

// 新增帐夹
export function addFeeInfo(data) {
  return request({
    url: '/info/feeInfo',
    method: 'post',
    data: data
  })
}

// 修改帐夹
export function updateFeeInfo(data) {
  return request({
    url: '/info/feeInfo',
    method: 'put',
    data: data
  })
}

// 删除帐夹
export function delFeeInfo(id) {
  return request({
    url: '/info/feeInfo/' + id,
    method: 'delete'
  })
}

// 导出帐夹
export function exportFeeInfo(query) {
  return request({
    url: '/info/feeInfo/export',
    method: 'get',
    params: query
  })
}