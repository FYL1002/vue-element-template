import request from '@/utils/request';

export function getChatsList(params) {
  return request({
    url: '/Chat/List',
    method: 'get',
    params
  });
}
export function getMonitorChatList(params) {
  return request({
    url: '/MonitorChat/List',
    method: 'get',
    params
  });
}
// 从客户列表 发起对话
export function customerPickChat(data) {
  return request({
    url: '/PickChat/Add',
    method: 'post',
    data
  });
}

// 从对话列表 发起对话
export function PickChat(data) {
  return request({
    url: '/PickChat/Edit',
    method: 'put',
    data
  });
}

export function editChat(data) {
  return request({
    url: '/Chat/Edit',
    method: 'put',
    data
  });
}

export function getHistoryRecord(params, baseurl) {
    return request({
      url: '/IM/MessageStorage',
      method: 'get',
      params
    });
  }

  export function GetContacts(params) {
    return request({
      url: '/ChannelUser/GetContacts',
      method: 'get',
      params
    });
  }

  export function TransferrTo(data) { // 转交客服
    return request({
      url: '/TransferChat/Edit',
      method: 'put',
      data
    });
  }

  export function GetUserOfContacts(params) {
    return request({
      url: '/ChannelUser/GetUserOfContacts',
      method: 'get',
      params
    });
  }
