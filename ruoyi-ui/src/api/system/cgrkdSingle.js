import request from '@/utils/request'

// 查询进货单列表
export function listCgrkd(query) {
  return request({
    url: '/system/cgrkdSingle/list',
    method: 'get',
    params: query
  })
}

// 查询进货单详细
export function getCgrkd(id) {
  return request({
    url: '/system/cgrkdSingle/' + id,
    method: 'get'
  })
}
// 删除进货单子表
export function delCgrkdChild(id) {
  return request({
    url: '/system/cgrkdSingleChild/' + id,
    method: 'delete'
  })
}
// 查询进货单明细

export function getCgrkdChild(dj_number) {
  return request({
    url: '/system/cgrkdSingleChild/getCgrkdChild?djNumber=' + dj_number,
    method: 'get'
  })
}

// 新增进货单
export function addCgrkd(data) {
  return request({
    url: '/system/cgrkdSingle',
    method: 'post',
    data: data
  })
}

// 修改进货单
export function updateCgrkd(data) {
  return request({
    url: '/system/cgrkdSingle',
    method: 'put',
    data: data
  })
}

// 删除进货单
export function delCgrkd(id) {
  return request({
    url: '/system/cgrkdSingle/' + id,
    method: 'delete'
  })
}

// 生效进货单
export function updateCgrkdStatus(id) {
  return request({
    url: '/system/cgrkdSingle/effect/' + id,
    method: 'delete'
  })
}

// 导出进货单
export function exportCgrkd(query) {
  return request({
    url: '/system/cgrkdSingle/export',
    method: 'get',
    params: query
  })
}