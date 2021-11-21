import Cookies from 'js-cookie';
import { getLanguage } from '@/lang/index';
import { parseUrl } from '@/api/common';
const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  language: getLanguage(),
  device: 'desktop',
  urlsParseInfo: [],
  messageImages: [],
  WEB_CONFIG: {},
  nickNameInfo: [],
  appName: 'Live800',
  notifyConfig: {},
  quickWordStorage: [],
  quickWordGroup: []
};

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened;
    state.sidebar.withoutAnimation = false;
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1);
    } else {
      Cookies.set('sidebarStatus', 0);
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0);
    state.sidebar.opened = false;
    state.sidebar.withoutAnimation = withoutAnimation;
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device;
  },
  SET_LANGUAGE: (state, language) => {
    state.language = language;
    Cookies.set('language', language);
  },
  UPDATE_URLS: (state, urlObj) => {
    var object3 = {
    };
    object3[urlObj.url] = urlObj;
    state.urlsParseInfo.push(urlObj);
  },
  UPDATE_IMAGES: (state, imgObj) => {
    imgObj.from = imgObj.from ? imgObj.from : 'upload';
    switch (imgObj.opt) {
      case 'delete': {
        state.messageImages.forEach((item, index) => {
          if (item.messageId === imgObj.messageId && imgObj.from === item.from) {
            state.messageImages.splice(index, 1);
          }
        });
        break;
      }
      case 'update': {
        state.messageImages.forEach((item, index) => {
          if (item.messageId === imgObj.messageId && imgObj.from === item.from) {
            item.url = imgObj.url;
            if (imgObj.from === 'website') {
              item.originUrl = imgObj.url;
            } else {
              imgObj.url && (imgObj.originUrl = imgObj.url.replace('192/', ''));
            }
          }
        });
        break;
      }
      default: {
        const imageObj = {
          url: imgObj.url,
          chatId: imgObj.chatId,
          messageId: imgObj.messageId,
          from: imgObj.from ? imgObj.from : 'upload'
        };
        if (imgObj.from === 'website') {
          imageObj.originUrl = imageObj.url;
        } else {
          imageObj.originUrl = imageObj.url.replace('192/', '');
        }
        state.messageImages.push(imageObj);
        break;
      }
    }
  },
  SET_WEBCONFIG: (state, data) => {
    state.WEB_CONFIG = data;
  },
  SET_NICKNAME: (state, nickArr) => {
    state.nickNameInfo = nickArr;
  },
  UPDATE_NICKNAME: (state, nickParams) => {
    state.nickNameInfo.push(nickParams);
  },
  SET_APPNAME: (state, name) => {
    state.appName = name;
  },
  SET_NOTIFYCONFIG: (state, data) => {
    state.notifyConfig = data;
  },
  SET_QWSTORAGE: (state, data) => {
    let isExited = false;
    isExited = state.quickWordStorage.some((item) => { return item.searchCode === data.searchCode });
    if (!isExited) {
      state.quickWordStorage.push(data);
    }
  },
  SET_QWGROUPSTORAGE: (state, data) => {
    for (const item of data) {
      state.quickWordGroup.push(item);
    }
  }
};

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR');
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation);
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device);
  },
  setLanguage({ commit }, language) {
    commit('SET_LANGUAGE', language);
  },
  getUrlsInfo({ commit }, urlParm) {
    var promise = new Promise((resolve, reject) => {
      parseUrl(urlParm).then(response => {
        const data = response;
        if (!data) {
          return reject('Get info failed, please try again.');
        }
        data.url = urlParm.url;
        commit('UPDATE_URLS', data);
        const imgObj = {
          chatId: urlParm.chatId,
          messageId: urlParm.messageId,
          from: 'website'
        };
        if (data.images && data.images.length > 0) {
          imgObj.opt = 'update';
          imgObj.url = data.images[0].url;
        } else {
          imgObj.opt = 'delete';
        }
        commit('UPDATE_IMAGES', imgObj);
        resolve(data);
      }).catch(error => {
        reject(error);
      });
    });
    if (state.urlsParseInfo[urlParm]) {
      return;
    } else {
      return promise;
    }
  },
  setWebConfig({ commit }, data) {
    commit('SET_WEBCONFIG', data);
  },
  updateMsgImgs({ commit }, data) {
    commit('UPDATE_IMAGES', data);
  },
  setNickname({
    commit
  }, nickdataArr) {
    commit('SET_NICKNAME', nickdataArr);
  },
  updateNickname({
    commit
  }, nickdata) {
    commit('UPDATE_NICKNAME', nickdata);
  },
  setQwStorage({ commit }, data) {
    commit('SET_QWSTORAGE', data);
  },
  setQwGroup({ commit }, data) {
    commit('SET_QWGROUPSTORAGE', data);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
