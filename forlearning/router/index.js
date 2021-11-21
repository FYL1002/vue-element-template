import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/* Layout */
import Layout from '@/layout';

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/'
  }
];

// 受权限控制的菜单
// path字段要与菜单管理的url字段一致
// name字段要与component中name字段一致，否则无组件缓存效果
export const asyncRoutes = [
  {
    path: '/agents',
    component: Layout,
    redirect: '/agents/list',
    name: 'agents',
    meta: { title: '客服管理', icon: 'user_role' },
    children: [
      {
        path: 'list',
        name: 'agentsList',
        component: () => import(/* webpackChunkName: "user" */ '@/views/agents/index'),
        meta: { title: '客服列表', icon: 'user', noCache: true }
      },
      {
        path: 'groups',
        name: 'Groups',
        component: () => import(/* webpackChunkName: "user" */ '@/views/groups/index'),
        meta: { title: '群组列表', icon: 'user' }
      }
    ]
  },
  {
    path: '/customers',
    component: Layout,
    redirect: '/customers/list',
    name: 'customers',
    meta: { title: '客服管理', icon: 'user_role' },
    children: [
      {
        path: 'list',
        name: 'customersList',
        component: () => import(/* webpackChunkName: "user" */ '@/views/customers/index'),
        meta: { title: '客户列表', icon: 'user', noCache: true }
      },
      {
        path: 'chats',
        name: 'Chats',
        component: () => import(/* webpackChunkName: "user" */ '@/views/chats/index'),
        meta: { title: '聊天列表', icon: 'user', noCache: true }
      },
      {
        path: 'archives',
        name: 'Archives',
        component: () => import(/* webpackChunkName: "user" */ '@/views/archives/index'),
        meta: { title: '存档列表', icon: 'user', noCache: true }
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    name: 'Setting',
    meta: { title: '配置管理', icon: 'Application' },
    children: [
      {
        path: '/setting/list',
        name: 'SettingList',
        component: () => import(/* webpackChunkName: "Setting" */ '@/views/setup/index'),
        meta: { title: '配置列表', icon: 'product' },
        children: [
          {
            path: '/setting/list/tags',
            name: 'SettingTags',
            component: () => import(/* webpackChunkName: "SettingTags" */ '@/views/setup/tags'),
            meta: { title: 'Tage', icon: 'product' }
          },
          {
            path: '/setting/list/notify',
            name: 'SettingNotify',
            component: () => import(/* webpackChunkName: "SettingNotify" */ '@/views/setup/notify'),
            meta: { title: '消息通知', icon: 'product' }
          },
          {
            path: '/setting/list/quickReply',
            name: 'SettingQuickReply',
            component: () => import(/* webpackChunkName: "SettingNotify" */ '@/views/setup/quickReply'),
            meta: { title: '快捷回复', icon: 'product' }
          }
        ]
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
];

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
});

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
