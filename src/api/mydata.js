import request from '@/utils/request'

export function getMyTableList(params) {
  return request({
    url: '/vue-admin-template/mytable/list',
    method: 'get',
    params
  })
}

export function handlePersonalInfo() {
    return request({
        url: '/vue-admin-template/myform/handlePersonalInfo',
        method: 'post',
        params
    })
}