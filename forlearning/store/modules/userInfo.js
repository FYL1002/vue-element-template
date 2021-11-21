import {
  getMemberInfo
} from '@/api/user';
import { getImagePath } from '@/api/common';

const getDefaultState = () => {
  return {
    member: {},
    imagePath: '',
    hasUnreadMsg: false,
    isServiceOpen: false
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_MEMBER: (state, member) => {
    state.member = member;
  },
  SET_IMAGEPATH: (state, url) => {
    state.imagePath = url.replace(/{userId}/, '');
  },
  SET_hasUnreadMsg: (state, numUnread) => {
    state.hasUnreadMsg = numUnread;
  },
  SET_SERVICE_OPEN: (state, bool) => {
    state.isServiceOpen = bool;
  }
};

const actions = {
  // get user info
  getInfo({
    commit,
    state,
    dispatch
  }) {
    return new Promise((resolve, reject) => {
      getMemberInfo().then(response => {
        const member = response;
        if (!member) {
          return;
        }
        // id 是user表的id  也是客服id
        commit('SET_MEMBER', member);
        resolve(member);
      }).catch(errorMsg => {
      });
    });
  },
  getImagePath({ state, commit }) {
    return new Promise((resolve, reject) => {
      getImagePath().then(response => {
        if (response) {
          commit('SET_IMAGEPATH', response);
        }
        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
