import Vue from 'vue';

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import '@/styles/index.scss'; // global css

import App from './App';
import store from './store';
import router from './router';

import '@/icons'; // icon
import '@/permission'; // permission control

import * as filters from './filters';

import i18n from './lang';

import VueSignalR from '@latelier/vue-signalr';

Vue.use(VueSignalR, '/SignalRHub');

import UmyUi from 'umy-ui'; // https://u-leo.github.io/umy-ui/docs/index.html#/wel/component/installation
import 'umy-ui/lib/theme-chalk/index.css';// 引入样式
Vue.use(UmyUi);

import { getConfig } from '@/api/common';

import 'overlayscrollbars/css/OverlayScrollbars.css';
import { OverlayScrollbarsPlugin } from 'overlayscrollbars-vue';
Vue.use(OverlayScrollbarsPlugin);

// set ElementUI lang to EN
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
});
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

// 注入全局过滤器
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;

const getConfigFn = () => {
  return new Promise((resolve, reject) => {
    getConfig().then(res => {
      resolve(res);
    });
  });
};

const init = (data) => {
  store.commit('app/SET_WEBCONFIG', data);
  new Vue({
    el: '#app',
    router,
    store,
    i18n,
    data: {
      // 事件的广播与接收
      eventHub: new Vue(),
      websock: null,
      // 保存聊天消息
      ChatRecordData: {
        'unreadTotal': 0,
        'content': {},
        'monitorRelateChat': {} // monitorIMChatId关联imChatId
      }
    },
    created() {
      this.$socket.start({
        log: true // Active only in development for debugging.
      });
    },
    render: h => h(App),
    sockets: {
      // Equivalent of
      // signalrHubConnection.on('ReceiveAgentLoggedStatus', (data) => this.someActionWithData(data))
      ReceiveAgentLoggedStatus(data) {
        this.$root.eventHub.$emit('ReceiveAgentLoggedStatus', data);
      },
      ReceiveCustomerStatus(data) {
        this.$root.eventHub.$emit('ReceiveCustomerStatus', data);
      },
      ReceiveAgentChat(data) { // 分配客服
        this.$root.eventHub.$emit('ReceiveAgentChat', data);
      },
      ReceiveTransferChats(data) { // 转接客服
        this.$root.eventHub.$emit('ReceiveTransferChats', data);
      }
    }
  });
};

// userInfo和config两个接口整合
Promise.all([store.dispatch('userInfo/getInfo'), getConfigFn()]).then(result => {
  init(result[1]);
}).catch((error) => {
  console.error('获取配置文件、登录信息错误', error);
});

