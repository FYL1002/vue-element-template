import {
  parseMessage, transferMessageItem, forEachLast
} from '../utils/common';

/**
 * @func handleMessageList
 * @desc 处理未读消息中的messagelist
 * @param {object} element - 参数elememt
 * @param {object} rel - 参数rel,初始数据
 * @return {object} rel - 返回处理过后的封装数据对象
 */
const handleMessageList = (element, rel) => {
  // 防止重连时重复添加
  const unreadCount = rel[element.chatid]['unreadNum'];
  unreadCount > 0 && rel[element.chatid]['list'].splice(rel[element.chatid]['list'].length - unreadCount, unreadCount);
  for (var item of element.messagesList) {
    let el = transferMessageItem(item);
    el = parseMessage(el);
    rel[element.chatid]['list'].push(el);
  }
  // 单个对话的 未读条数
  rel[element.chatid]['unreadNum'] = element.count || element.messagesList.length;
  return rel;
};

/**
 * @func handleLatest
 * @desc 处理未读消息中的最新一条消息
 * @param {object} element - 参数elememt
 * @param {object} rel - 参数rel,初始数据
 * @return {object} rel - 返回处理过后的封装数据对象
 */
const handleLatest = (element, rel) => {
  const item = element.latest;
  let latest = transferMessageItem(item);
  latest = parseMessage(latest);
  const curLen = rel[element.chatid]['list'].length;
  if (curLen === 0 || (curLen > 0 && !(rel[element.chatid]['list'][curLen - 1].Mid === latest.Mid))) { // 首次进入且非断网重连 才push进去
    rel[element.chatid]['list'].push(latest);
  }
  return rel;
};

/**
 * @func handleTMessage
 * @desc 处理socket连上时推过来的TMessage消息体
 * @param {array} tMessageList - 参数tMessageList
 * @return {object} rel - 返回处理过后的封装数据对象
 */
export const handleTMessage = (tMessageList, iniData = {}) => {
  tMessageList.forEach(element => {
    if (!element.chatid) return;
    if (!iniData[element.chatid]) {
      iniData[element.chatid] = {
        'unreadNum': 0,
        'list': []
      };
    }
    if (element.messagesList && element.messagesList.length) {
      iniData = handleMessageList(element, iniData);
    }
    if (element.latest) {
      iniData = handleLatest(element, iniData);
    }
  });
  return iniData;
};

/**
 * @func handleTPosition
 * @desc 处理socket连上时推过来的游标数据
 * @param {array} tPositionList - 参数tPositionList
 * @param {object} iniData - 参数iniData,初始数据
 * @return {object} store - 对应vuex的$store
 * @return {object} rel - 返回处理过后的封装数据对象
 */
export const handleTPosition = (tPositionList, iniData = {}, store) => {
  tPositionList.forEach(element => {
    if (element.chatid && element.time) {
      if (iniData[element.chatid]) {
        iniData[element.chatid]['Time'] = element.time;
      } else {
        iniData[element.chatid] = {
          'unreadNum': 0,
          'list': [],
          'Time': element.time
        };
      }
      store.commit('chatRecord/SET_CHATIDPOSITION', { chatId: element.chatid, time: element.time });
    }
  });
  return iniData;
};

/**
 * @func handleType1
 * @desc 处理socket推过来的type=1聊天消息
 * @param {objec} params - 参数params
 * @param {object} params.msg - 推过来的单条消息体
 * @param {object} params.iniData - 初始保存的聊天数据
 * @param {object} params.member - 当前登录的用户信息
 * @param {object} params.notifyConfig - 消息通知设置
 * @param {object} params.eventHub - 广播事件方法
 */
const handleType1 = (params) => {
  params.msg = parseMessage(params.msg);
  const chatId = params.monitorChatIdRelate[params.msg.ChatId] || params.msg.ChatId;
  if (params.iniData[chatId] || params.monitorChatIdRelate[chatId]) {
    params.iniData[chatId]['list'].push(params.msg);
  } else {
    params.iniData[params.msg.ChatId] = {
      'unreadNum': 0,
      'list': [params.msg]
    };
  }
  if (params.msg.From !== params.member.id) {
    // 单个对话的 未读条数
    params.iniData[chatId]['unreadNum']++;
    params.notifyConfig && params.notifyConfig.Enabled && params.eventHub.$emit('MessageNotify');// 消息声音通知
  }
};

/**
 * @func handleType2
 * @desc 处理socket推过来的type=2已读发送游标的消息
 * @param {objec} params - 参数params
 * @param {object} params.msg - 推过来的单条消息体
 * @param {object} params.iniData - 初始保存的聊天数据
 */
const handleType2 = (params) => {
  if (params.iniData[params.msg.ChatId]) {
    params.iniData[params.msg.ChatId]['Time'] = params.msg.Time;
  } else {
    params.iniData[params.msg.ChatId] = {
      'unreadNum': 0,
      'list': [],
      'Time': params.msg.Time
    };
  }
  params.store.commit('chatRecord/SET_CHATIDPOSITION', { chatId: params.msg.ChatId, time: params.msg.Time });
};

/**
 * @func handleType3
 * @desc 处理socket推过来的type=3删除类型的消息
 * @param {objec} params - 参数params
 * @param {object} params.msg - 推过来的单条消息体
 * @param {object} params.iniData - 初始保存的聊天数据
 */
const handleType3 = (params) => {
  if (params.iniData[params.msg.ChatId] && params.iniData[params.msg.ChatId]['list'].length) {
    const msgLength = params.iniData[params.msg.ChatId]['list'].length;
    const readedIndex = (msgLength - params.iniData[params.msg.ChatId].unreadNum) - 1;
    const readedMTime = params.iniData[params.msg.ChatId]['list'][readedIndex].Time;
    const handleForEach = (ele, k) => {
      if (ele.Mid === params.msg.Mid) {
        if (params.msg.Time > readedMTime && params.iniData[params.msg.ChatId].unreadNum > 0) { // 删除的消息在未读消息行列
          params.iniData[params.msg.ChatId].unreadNum--;
        }
        params.iniData[params.msg.ChatId]['list'].splice(k, 1);
        return true;
      }
    };
    forEachLast(params.iniData[params.msg.ChatId]['list'], handleForEach);
  }
};

/**
 * @func handleType4
 * @desc 处理socket推过来的type=4编辑类型的消息
 * @param {objec} params - 参数params
 * @param {object} params.msg - 推过来的单条消息体
 * @param {object} params.iniData - 初始保存的聊天数据
 */
const handleType4 = (params) => {
  if (!params.iniData[params.msg.ChatId] || !params.iniData[params.msg.ChatId]['list'].length) {
    return;
  }
  const handleForEach = (ele, k) => {
    if (ele.Mid === params.msg.Mid) {
      params.msg = parseMessage(params.msg);
      params.iniData[params.msg.ChatId]['list'][k] = params.msg;
      return true;
    }
  };
  forEachLast(params.iniData[params.msg.ChatId]['list'], handleForEach);
};

/**
 * @func handleType5
 * @desc 处理socket推过来的type=5正在输入类型的消息
 * @param {objec} params - 参数params
 * @param {object} params.msg - 推过来的单条消息体
 * @param {object} params.iniData - 初始保存的聊天数据
 * @param {function} params.store - 对应vuex的$store
 */
const handleType5 = (params) => {
  let msg = params.msg;
  msg = parseMessage(msg);
  msg.updateTime = new Date().getTime();
  if (msg.ContentJson.content !== '') {
    params.store.dispatch('chatRecord/setTypingmsg', {
      from: msg.From,
      chatId: msg.ChatId,
      opt: 'update'
    });
  }

  // 处理draft草稿消息
  if (params.iniData[msg.ChatId]) {
    if (msg.CType === 1 && msg.ContentJson.content === '') {
      // 清除当前draft
      forEachLast(params.iniData[msg.ChatId].list, (item, i) => {
        if (item.Type === msg.Type && item.From === msg.From) {
          params.iniData[msg.ChatId].list.splice(i, 1);
          return true;
        }
      });
    } else {
      if (!params.iniData[msg.ChatId].list.length) {
        params.iniData[msg.ChatId].list.push(msg);
        return;
      }
      const hasExited = params.iniData[msg.ChatId].list.some((item) => {
        return item.From === msg.From && item.Type === msg.Type;
      });
      if (!hasExited) {
        params.iniData[msg.ChatId].list.push(msg);
        return;
      }
      forEachLast(params.iniData[msg.ChatId].list, (msgItem) => {
        if (msgItem.From === msg.From && msgItem.Type === msg.Type) {
          msgItem.sourceContent = msg.sourceContent;
          msgItem.Content = msg.Content;
          msgItem.ContentJson = msg.ContentJson;
          msgItem.updateTime = msg.updateTime;
          return true;
        }
      });
    }
  } else if (msg.ContentJson.content) {
    params.iniData[msg.ChatId] = {
      'unreadNum': 0,
      'list': [msg]
    };
  }
};

const typeMsg = {
  1: handleType1,
  2: handleType2,
  3: handleType3,
  4: handleType4,
  5: handleType5
};

/**
 * @func handleSingleMsg
 * @desc 处理socket推过来的单条消息
 * @param {objec} params - 参数params
 * @param {object} params.msg - 推过来的单条消息体
 * @param {object} params.iniData - 初始保存的聊天数据
 * @param {object} params.member - 当前登录的用户信息
 * @param {object} params.notifyConfig - 消息通知设置
 * @param {object} params.eventHub - 广播事件
 * @return {object} - 处理过后的聊天数据
 */
export const handleSingleMsg = (params) => {
  typeMsg[params.msg.Type] && typeMsg[params.msg.Type](params);
  return params.iniData;
};
