import request from '@/utils/request';

export function getGroupsList(params) {
    return request({
      url: '/Group/List',
        method: 'get',
        params
    });
}
export function addGroups(data) {
    return request({
      url: '/Group/Add',
        method: 'post',
        data
    });
}
export function editGroups(data) {
  return request({
    url: '/Group/Edit',
    method: 'put',
    data
  });
}
export function delGroups(data) {
  return request({
    url: '/Group/Delete',
    method: 'delete',
    data
  });
}

export function getGroupsUserList(params) {
  return request({
    url: '/GroupUser/List',
    method: 'get',
    params
  });
}
export function addGroupUser(data) {
  return request({
    url: '/GroupUser/Add',
    method: 'post',
    data
  });
}
export function deleteGroupUser(data) {
  return request({
    url: '/GroupUser/Delete',
    method: 'delete',
    data
  });
}

export function getGroupsUserGroupList(params) {
  return request({
    url: '/GroupUser/GroupList',
    method: 'get',
    params
  });
}
export function getGroupsUserUserList(params) {
  return request({
    url: '/GroupUser/UserList',
    method: 'get',
    params
  });
}
