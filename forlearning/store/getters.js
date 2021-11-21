const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  breadcrumb: state => state.tagsView.breadcrumb,
  language: state => state.app.language,
  tableHeight: state => state.elementSize.tableHeight,
  member: state => state.userInfo.member,
  permissionAll: state => state.menuPermission.permissionAll,
  menuInfo: state => state.menuPermission.menuInfo,
  nav: state => state.menuPermission.nav,
  imagePath: state => state.userInfo.imagePath,
  appName: state => state.app.appName,
  urlsParseInfo: state => {
    var obj = {};
    if (state.app.urlsParseInfo.length > 0) {
      for (const item of state.app.urlsParseInfo) {
        obj[item.url] = item;
      }
    }
    return obj;
  },
  messageImages: state => {
    var obj = {};
    if (state.app.messageImages.length > 0) {
      state.app.messageImages.forEach(item => {
        if (!obj[item.chatId]) {
          obj[item.chatId] = [];
        }
        obj[item.chatId].push({ Mid: item.messageId, url: item.originUrl, from: item.from });
      });
    }
    return obj;
  },
  chatTypingData: state => {
    var obj = {};
    state.chatRecord.typingMessages.forEach(item => {
      if (!obj[item.chatId]) {
        obj[item.chatId] = [];
      }
      if (obj[item.chatId].indexOf(item.from) === -1) {
        obj[item.chatId].push(item);
      }
    });
    return obj;
  },
  monitorChatIdRelate: state => state.chatRecord.monitorChatIdRelate,
  chatIdPosition: state => state.chatRecord.chatIdPosition,
  WEB_CONFIG: state => state.app.WEB_CONFIG,
  hasUnreadMsg: state => state.userInfo.hasUnreadMsg,
  isServiceOpen: state => state.userInfo.isServiceOpen,
  nickNameInfo: state => {
    var obj = {};
    if (state.app.nickNameInfo.length > 0) {
      for (const item of state.app.nickNameInfo) {
        item.contactId && (obj[item.contactId] = item);
      }
    }
    return obj;
  },
  notifyConfig: state => state.app.notifyConfig,
  quickWordStorage: state => {
    var mapJson = {};
    if (state.app.quickWordStorage.length > 0) {
      for (const item of state.app.quickWordStorage) {
        mapJson[item.searchCode] = item.results;
      }
    }
    return mapJson;
  },
  quickWordGroups: state => state.app.quickWordGroup

};
export default getters;
