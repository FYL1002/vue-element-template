import request from '@/utils/request';

export function getAgentList(params) {
  return request({
    url: '/Agent/List',
    method: 'get',
    params
  });
}
export function inviteAgent(data) {
  return request({
    url: '/Agent/EmailInvite',
    method: 'post',
    data
  });
}
export function editAgent(data) {
  return request({
    url: '/Agent/Edit',
    method: 'put',
    data
  });
}
export function delAgent(data) {
  return request({
    url: '/Agent/Delete',
    method: 'delete',
    data
  });
}
export function suspendAgent(data) {
  return request({
    url: '/Agent/Add',
    method: 'post',
    data
  });
}
export function getRoleList(params) {
  return request({
    url: '/Role/List',
    method: 'get',
    params
  });
}
