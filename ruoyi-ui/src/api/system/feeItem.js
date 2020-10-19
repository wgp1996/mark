import request from '@/utils/request'

// 查询费用项目列表
export function listFeeItem(query) {
  return request({
    url: '/info/feeItem/list',
    method: 'get',
    params: query
  })
}

// 查询费用项目详细
export function getFeeItem(id) {
  return request({
    url: '/info/feeItem/' + id,
    method: 'get'
  })
}

// 新增费用项目
export function addFeeItem(data) {
  return request({
    url: '/info/feeItem',
    method: 'post',
    data: data
  })
}

// 修改费用项目
export function updateFeeItem(data) {
  return request({
    url: '/info/feeItem',
    method: 'put',
    data: data
  })
}

// 删除费用项目
export function delFeeItem(id) {
  return request({
    url: '/info/feeItem/' + id,
    method: 'delete'
  })
}

// 导出费用项目
export function exportFeeItem(query) {
  return request({
    url: '/info/feeItem/export',
    method: 'get',
    params: query
  })
}