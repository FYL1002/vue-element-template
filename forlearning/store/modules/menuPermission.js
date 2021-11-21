import { getRoleMenuGetUserMenus } from '@/api/menu';
import { asyncRoutes } from '@/router';

const getMenuPermissionState = () => {
  return {
    permissionAll: {}, // 所有路由的权限
    menuInfo: {}, // 所有路由信息
    nav: [] // 左侧菜单
  };
};

const state = getMenuPermissionState();

const mutations = {
  SET_PERMISSIONALL: (state, data) => {
    // state.permissionAll[data.path] = data.permission
    state.permissionAll = data;
  },
  SET_MENUINFO: (state, data) => {
    state.menuInfo = data;
  },
  SET_NAV: (state, arr) => {
    state.nav = arr;
  }
};

const actions = {
  // 获取菜单信息
  getMenuInfo({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      getRoleMenuGetUserMenus({
        moduleName: 'LIVE800.Web'
      }).then(response => {
        let menuObj = {};
        if (response.length) {
          commit('SET_NAV', response);
          menuObj = initMenuInfo(response);
          dispatch('initPermissionAll', menuObj);
        }
        // console.log(menuObj);
        commit('SET_MENUINFO', menuObj);
        const url = firstPermissionUrl(response);
        resolve(url);
      }).catch(error => {
        reject(error);
      });
    });
  },
  // 从菜单信息中整理出权限
  initPermissionAll({ commit }, menuObj) {
    var all = {};
    for (var key in menuObj) {
      var item = menuObj[key];
      if ((item.type === 1 || item.type === 2) && item.childrens.length) {
        all[item.url] = {};
        item.childrens.forEach(child => {
          if (child.type === 3) {
            all[item.url][child.code] = true;
          }
        });
      }
    }
    commit('SET_PERMISSIONALL', all);
  }
};

function initMenuInfo(arr, obj) {
  obj = obj || {};
  arr.forEach((child) => {
    child.url && (obj[child.url] = child);
    if (child.childrens.length) {
      initMenuInfo(child.childrens, obj);
    }
  });
  return obj;
}

const isValidUrl = (item) => {
  if (item.url && item.childrens.length && (item.type === 1 || item.type === 2)) {
    return true;
  }
  return false;
};

// 获取第一个有权限的路由地址
function firstPermissionUrl(arr) {
  var noViewMenus = [];
  asyncRoutes.forEach(item => {
    noViewMenus.push(item.path);
  });
  if (arr.length) {
    for (var child of arr) {
      if (noViewMenus.indexOf(child.url) > -1 && child.childrens.length) {
        for (var item of child.childrens) {
          if (isValidUrl(item)) {
            return item.url;
          }
        }
      } else if (isValidUrl(child)) {
        return child.url;
      }
    }
  }
  return '/';
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
