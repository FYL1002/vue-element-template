
const state = {
  typingMessages: [],
  monitorChatIdRelate: {},
  chatIdPosition: {}
};

const mutations = {
  SET_TYPINGMSG: (state, param) => {
    var arr = [].concat(state.typingMessages);
    if (param.opt === 'delete') {
      for (let i = 0; i < arr.length; i++) {
        const item = state.typingMessages[i];
        if (param.from === item.from) { // 删除已存在的
          state.typingMessages.splice(i, 1);
        }
      }
    } else {
      if (arr.length > 0) {
        let isExited = false;
        for (let i = 0; i < arr.length; i++) {
          const item = state.typingMessages[i];
          if (param.chatId === item.chatId && param.from === item.from) { // 已存在就更新时间
            isExited = true;
            item.updateTime = new Date().getTime();
          }
        }
        if (!isExited) {
          param.updateTime = new Date().getTime();
            state.typingMessages.push(param);
        }
      } else {
        param.updateTime = new Date().getTime();
        state.typingMessages.push(param);
      }
    }
  },
  SET_MONITORCHATIDRELATE: (state, data) => {
    state.monitorChatIdRelate[data.monitorChatId] = data.chatId;
  },
  SET_CHATIDPOSITION: (state, data) => {
    state.chatIdPosition[data.chatId] = data.time;
  }
};

const actions = {

  setTypingmsg({ commit }, data) {
    commit('SET_TYPINGMSG', data);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
