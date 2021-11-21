import request from '@/utils/request';
import store from '@/store';

export function getRoleList(params) {
    return request({
        url: '/role/list',
        method: 'get',
        params,
        baseURL: '/'
    });
}
export function addRole(data) {
    return request({
        url: '/role/add',
        method: 'post',
        data
    });
}
export function editRole(data) {
    return request({
        url: '/role/edit',
        method: 'put',
        data
    });
}
export function delRole(data) {
    return request({
        url: '/role/delete',
        method: 'delete',
        data
    });
}

export function getUserDetailList(params) {
  return request({
      url: '/UserDetail/list',
      method: 'get',
      params
  });
}
export function addUserDetail(data) {
  return request({
      url: '/UserDetail/Add',
      method: 'post',
      data
  });
}
export function editUserDetail(data) {
  return request({
      url: '/UserDetail/Edit',
      method: 'put',
      data
  });
}
export function deleteUserDetail(data) {
  return request({
      url: '/UserDetail/Delete',
      method: 'delete',
      data
  });
}
export function getInstanceUserUserList(params) {
  return request({
      url: '/InstanceUser/userlist',
      method: 'get',
      params
  });
}

// 查看角色已关联哪些用户
export function getRoleUserList(params) {
  return request({
      url: '/RoleUser/List',
      method: 'get',
      params
  });
}

export function addRoleUser(data) {
  return request({
      url: '/RoleUser/Add',
      method: 'post',
      data
  });
}
export function deleteRoleUser(data) {
  return request({
      url: '/RoleUser/Delete',
      method: 'delete',
      data
  });
}

export function imageUpload(data) {
  return request({
      url: store.state.app.WEB_CONFIG.VUE_APP_IMAGE_API + '/upload',
      method: 'post',
      data,
      noStringify: true
  });
}
