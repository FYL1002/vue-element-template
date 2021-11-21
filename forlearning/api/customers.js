import request from '@/utils/request';

export function getCustomersList(params) {
  return request({
    url: '/Customer/List',
    method: 'get',
    params
  });
}

export function getCustomersGruopList(params) {
  return request({
    url: '/Customer/GroupByStatusList',
    method: 'get',
    params
  });
}

export function GetStatusCount(params) {
  return request({
    url: '/Customer/GetStatusCount',
    method: 'get',
    params
  });
}

export function monitorChatAdd(data) {
    return request({
      url: '/MonitorChat/Add',
      method: 'post',
      data
    });
  }

export function monitorChatEdit(data) {
return request({
    url: '/MonitorChat/Edit',
    method: 'put',
    data
});
}
