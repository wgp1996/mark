import request from '@/utils/request'

// 查询进货单列表
export function listCgrkd(query) {
  return request({
    url: '/system/cgrkd/list',
    method: 'get',
    params: query
  })
}

// 查询进货单列表
export function listOrder(type) {
  return request({
    url: '/system/cgrkd/orderList/'+type,
    method: 'get'
  })
}

// 查询进货单汇总列表
export function rkdSummaryList(query) {
  return request({
    url: '/system/cgrkd/rkdSummaryList',
    method: 'get',
    params: query
  })
}

// 查询进货单详细
export function getCgrkd(id) {
  return request({
    url: '/system/cgrkd/' + id,
    method: 'get'
  })
}
// 删除进货单子表
export function delCgrkdChild(id) {
  return request({
    url: '/system/cgrkdchild/' + id,
    method: 'delete'
  })
}
// 查询进货单明细

export function getCgrkdChild(dj_number) {
  return request({
    url: '/system/cgrkdchild/getCgrkdChild?djNumber=' + dj_number,
    method: 'get'
  })
}

export function getCgrkdMxChild(id,type) {
  return request({
    url: '/system/cgrkdchild/mxList/' + id+'/'+type,
    method: 'get'
  })
}

// 新增进货单
export function addCgrkd(data) {
  return request({
    url: '/system/cgrkd',
    method: 'post',
    data: data
  })
}

// 接收订单
export function rkdReceive(data) {
  return request({
    url: '/system/cgrkd/rkdReceive',
    method: 'post',
    data: data
  })
}
// 拒绝接收订单
export function rkdRefuse(data) {
  return request({
    url: '/system/cgrkd/rkdRefuse',
    method: 'post',
    data: data
  })
}


// 修改进货单
export function updateCgrkd(data) {
  return request({
    url: '/system/cgrkd',
    method: 'put',
    data: data
  })
}

// 删除进货单
export function delCgrkd(id) {
  return request({
    url: '/system/cgrkd/' + id,
    method: 'delete'
  })
}

// 生效进货单
export function updateCgrkdStatus(id) {
  return request({
    url: '/system/cgrkd/effect/' + id,
    method: 'delete'
  })
}

// 导出进货单
export function exportCgrkd(query) {
  return request({
    url: '/system/cgrkd/export',
    method: 'get',
    params: query
  })
}