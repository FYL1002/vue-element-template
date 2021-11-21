import request from '@/utils/request';

export function getMenuList(params) {
    return request({
        url: '/Menu/list',
        method: 'get',
        params
    });
}
export function addMenu(data) {
    return request({
        url: '/Menu/add',
        method: 'post',
        data
    });
}
export function editMenu(data) {
    return request({
        url: '/Menu/edit',
        method: 'put',
        data
    });
}
export function delMenu(data) {
    return request({
        url: '/Menu/delete',
        method: 'delete',
        data
    });
}
export function getModuleList(params) {
  return request({
      url: '/Module/list',
      method: 'get',
      params
  });
}
export function getRoleMenuMenuList(params) {
  return request({
      url: '/RoleMenu/MenuList',
      method: 'get',
      params
  });
}
export function getRoleMenuEdit(data) {
  return request({
      url: '/RoleMenu/edit',
      method: 'post',
      data
  });
}
export function getRoleMenuGetUserMenus(params) {
  return request({
      url: '/RoleMenu/GetUserMenus',
      method: 'get',
      params
  });
}
export function getApplicationList(params) {
  return request({
      url: '/AuthKeeper/ApplicationList',
      method: 'get',
      params
  });
}
