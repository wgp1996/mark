import request from '@/utils/request'

// 查询入库单子表列表
export function listRkInfoChild(query) {
  return request({
    url: '/system/rkInfoChild/list',
    method: 'get',
    params: query
  })
}

// 查询入库单子表详细
export function getRkInfoChild(id) {
  return request({
    url: '/system/rkInfoChild/' + id,
    method: 'get'
  })
}

// 新增入库单子表
export function addRkInfoChild(data) {
  return request({
    url: '/system/rkInfoChild',
    method: 'post',
    data: data
  })
}

// 修改入库单子表
export function updateRkInfoChild(data) {
  return request({
    url: '/system/rkInfoChild',
    method: 'put',
    data: data
  })
}

// 删除入库单子表
export function delRkInfoChild(id) {
  return request({
    url: '/system/rkInfoChild/' + id,
    method: 'delete'
  })
}

// 导出入库单子表
export function exportRkInfoChild(query) {
  return request({
    url: '/system/rkInfoChild/export',
    method: 'get',
    params: query
  })
}