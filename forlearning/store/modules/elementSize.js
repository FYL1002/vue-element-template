const getViewSize = () => {
  return {
    tableHeight: 540
  };
};

const state = getViewSize();

const mutations = {
  SET_TABLEHEIGHT: (state, tableHeight) => {
    state.tableHeight = tableHeight;
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
