import request from '@/utils/request';

export function getTagList(params) {
    return request({
        url: '/Tag/List',
        method: 'get',
        params
    });
}
export function addTag(data) {
  return request({
    url: '/Tag/Add',
    method: 'post',
    data
  });
}
export function editTag(data) {
  return request({
    url: '/Tag/Edit',
    method: 'put',
    data
  });
}
export function deleteTag(data) {
  return request({
    url: '/Tag/Delete',
    method: 'delete',
    data
  });
}
export function getUserSettingList(params) {
  return request({
      url: '/UserSetting/List',
      method: 'get',
      params
  });
}
export function editUserSetting(data) {
  return request({
    url: '/UserSetting/Edit',
    method: 'put',
    data
  });
}

export function getFastWordGroup(params) {
  return request({
    url: '/FastWordGroup/List',
    method: 'get',
    params
  });
}

export function addFastWordGroup(data) {
  return request({
    url: '/FastWordGroup/Add',
    method: 'post',
    data
  });
}

export function editFastWordGroup(data) {
  return request({
    url: '/FastWordGroup/Edit',
    method: 'put',
    data
  });
}

export function delFastWordGroup(data) {
  return request({
    url: '/FastWordGroup/Delete',
    method: 'delete',
    data
  });
}

export function getFastWord(params) {
  return request({
    url: '/FastWord/List',
    method: 'get',
    params
  });
}

export function addFastWord(data) {
  return request({
    url: '/FastWord/Add',
    method: 'post',
    data
  });
}

export function editFastWord(data) {
  return request({
    url: '/FastWord/Edit',
    method: 'put',
    data
  });
}

export function delFastWord(data) {
  return request({
    url: '/FastWord/Delete',
    method: 'delete',
    data
  });
}

export function setGroupSort(data) {
  return request({
    url: 'FastWordGroup/SetSort',
    method: 'put',
    data
  });
}

