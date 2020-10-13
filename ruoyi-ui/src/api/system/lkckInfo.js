import request from '@/utils/request'

// 查询出库单列表
export function listLkckInfo(query) {
  return request({
    url: '/system/lkckInfo/list',
    method: 'get',
    params: query
  })
}

// 查询出库单详细
export function getLkckInfo(id) {
  return request({
    url: '/system/lkckInfo/' + id,
    method: 'get'
  })
}

// 新增出库单
export function addLkckInfo(data) {
  return request({
    url: '/system/lkckInfo',
    method: 'post',
    data: data
  })
}

// 修改出库单
export function updateLkckInfo(data) {
  return request({
    url: '/system/lkckInfo',
    method: 'put',
    data: data
  })
}

// 删除出库单
export function delLkckInfo(id) {
  return request({
    url: '/system/lkckInfo/' + id,
    method: 'delete'
  })
}
// 生效出库单
export function updateLkckInfoStatus(id) {
  return request({
    url: '/system/lkckInfo/effect/' + id,
    method: 'delete'
  })
}


// 导出出库单
export function exportLkckInfo(query) {
  return request({
    url: '/system/lkckInfo/export',
    method: 'get',
    params: query
  })
}