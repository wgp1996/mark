import request from '@/utils/request'

// 查询入库单列表
export function listRkInfo(query) {
  return request({
    url: '/system/rkInfo/list',
    method: 'get',
    params: query
  })
}



// 查询入库单详细
export function getRkInfo(id) {
  return request({
    url: '/system/rkInfo/' + id,
    method: 'get'
  })
}

// 新增入库单
export function addRkInfo(data) {
  return request({
    url: '/system/rkInfo',
    method: 'post',
    data: data
  })
}

// 修改入库单
export function updateRkInfo(data) {
  return request({
    url: '/system/rkInfo',
    method: 'put',
    data: data
  })
}

// 删除入库单
export function delRkInfo(id) {
  return request({
    url: '/system/rkInfo/' + id,
    method: 'delete'
  })
}

// 导出入库单
export function exportRkInfo(query) {
  return request({
    url: '/system/rkInfo/export',
    method: 'get',
    params: query
  })
}