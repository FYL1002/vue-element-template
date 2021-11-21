import request from '@/utils/request';
import store from '@/store';

export function getImagePath(params) {
    return request({
        url: '/Common/ImagePath',
        method: 'get',
        params
    });
}
export function parseUrl(params) {
    return request({
      url: store.state.app.WEB_CONFIG.VUE_APP_ParseLink_API + '/parse',
      method: 'get',
      params
    });
  }

export function getConfig(params) {
  return request({
    url: process.env.BASE_URL + 'webConfig.json',
    method: 'get',
    params
  });
}

export function getCustomColumns(params) {
  return request({
    url: '/Base/CustomColumns',
    method: 'get',
    params
  });
}
export function getAllColumns(params) {
  return request({
    url: '/Base/AllColumns',
    method: 'get',
    params
  });
}
export function setCustomColumns(data) {
  return request({
    url: '/Base/SetCustomColumns',
    method: 'put',
    data
  });
}

export function getLinkToken(params) {
  return request({
    url: '/IM/GetToken',
    method: 'get',
    params
  });
}
