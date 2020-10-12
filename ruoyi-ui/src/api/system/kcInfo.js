import request from '@/utils/request'

// 查询收发存查询列表
export function listKcInfo(query) {
  return request({
    url: '/system/kcInfo/list',
    method: 'get',
    params: query
  })
}

// 查询收发存查询详细
export function getKcInfo(id) {
  return request({
    url: '/system/kcInfo/' + id,
    method: 'get'
  })
}

// 新增收发存查询
export function addKcInfo(data) {
  return request({
    url: '/system/kcInfo',
    method: 'post',
    data: data
  })
}

// 修改收发存查询
export function updateKcInfo(data) {
  return request({
    url: '/system/kcInfo',
    method: 'put',
    data: data
  })
}

// 删除收发存查询
export function delKcInfo(id) {
  return request({
    url: '/system/kcInfo/' + id,
    method: 'delete'
  })
}

// 导出收发存查询
export function exportKcInfo(query) {
  return request({
    url: '/system/kcInfo/export',
    method: 'get',
    params: query
  })
}