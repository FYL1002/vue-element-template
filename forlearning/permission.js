import router from './router';
import store from './store';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import getPageTitle from '@/utils/get-page-title';
import { constantRoutes } from '@/router';

const handlePerRoutes = (routers) => {
  const rel = {};
  routers.forEach(item => {
    if (item.redirect && item.path !== '/') {
      rel[item.redirect] = true;
    } else {
      rel[item.path] = true;
    }
  });
  return rel;
};

// 根据当前路由地址返回面包屑结构
const recursiveTreeByLastLevel = (val, data, fKey = 'url') => {
  let rData = [];
  for (let i = 0; i < data.length; i++) {
    rData.push(data[i]);
    if (data[i].childrens && data[i].childrens.length > 0) {
      rData = rData.concat(recursiveTreeByLastLevel(val, data[i].childrens, fKey));
      if (rData.some(item => item[fKey] === val)) return rData;
    }

    if (data[i][fKey] === val) return rData;
    rData = [];
  }
  return rData;
};

const init = async() => {
  let noPermissionRoutes = {};
  noPermissionRoutes = handlePerRoutes(constantRoutes);
  store.dispatch('userInfo/getImagePath'); // 查询图片服务器地址
  NProgress.configure({ showSpinner: false }); // NProgress Configuration
  // 查询有权限的菜单
   const url = await store.dispatch('menuPermission/getMenuInfo');
  let breadUrl = url;
  // 获取到的第一个有权限的路由作为首次跳转的路由
  if (location.hash === '#/') {
    router.push({
      path: url
    });
  } else {
    // 刷新页面的场景
    breadUrl = location.hash.replace(/#/, '');
  }
  // 面包屑
  const firstRouterList = recursiveTreeByLastLevel(breadUrl, store.getters.nav, 'url');
  store.commit('tagsView/ADD_BREADCRUMB', {
    url: breadUrl,
    bread: firstRouterList
  });
  const accessRoutes = await store.dispatch('permission/generateRoutes', []);
  router.addRoutes(accessRoutes);

  router.beforeEach(async(to, from, next) => {
    // start progress bar
    NProgress.start();

    // set page title
    document.title = getPageTitle(to.meta.title);
    next();
    NProgress.done();
    if (!store.getters.menuInfo[to.path] && !noPermissionRoutes[to.path]) {
      // 判断是否有路由的权限，如果没有则跳到首页
      // store.getters.menuInfo为接口数据
      // noPermissionRoutes为@/router/index.js constantRoutes不受权限控制的路由
      next({ path: '/404' });
      console.log('No Permission');
    }

    // 面包屑
    if (!store.getters.breadcrumb[to.path] && store.getters.nav.length) {
      // recursiveTreeByLastLevel返回面包屑结构，例:当前路由为1.2.1,，则返回[1,1.2,1.2.1]
      const routerList = recursiveTreeByLastLevel(to.path, store.getters.nav, 'url');
      store.commit('tagsView/ADD_BREADCRUMB', { url: to.path, bread: routerList });
    }
  });

  router.afterEach(() => {
    // finish progress bar
    NProgress.done();
  });
};

init();
