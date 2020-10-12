import request from '@/utils/request'

// 查询出库单明细列表
export function listLkckInfoChild(query) {
  return request({
    url: '/system/lkckInfoChild/list',
    method: 'get',
    params: query
  })
}
// 出库单选择子单列表
export function selectRkdList(query) {
  return request({
    url: '/system/rkInfo/selectRkdList',
    method: 'get',
    params: query
  })
}
// 查询出库单明细详细
export function getLkckInfoChild(id) {
  return request({
    url: '/system/lkckInfoChild/' + id,
    method: 'get'
  })
}

// 新增出库单明细
export function addLkckInfoChild(data) {
  return request({
    url: '/system/lkckInfoChild',
    method: 'post',
    data: data
  })
}

// 修改出库单明细
export function updateLkckInfoChild(data) {
  return request({
    url: '/system/lkckInfoChild',
    method: 'put',
    data: data
  })
}

// 删除出库单明细
export function delLkckInfoChild(id) {
  return request({
    url: '/system/lkckInfoChild/' + id,
    method: 'delete'
  })
}

// 导出出库单明细
export function exportLkckInfoChild(query) {
  return request({
    url: '/system/lkckInfoChild/export',
    method: 'get',
    params: query
  })
}