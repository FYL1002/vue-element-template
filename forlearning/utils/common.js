import store from '@/store/index';

export function copy(val) {
  return JSON.parse(JSON.stringify(val));
}

// 到每个页面重新计算tableHeight高度
export function elementSize() {
  var domEle = document.querySelector('#app');
  // var calcEle1 = document.querySelector(".calcHeight")
  // var calcEle2 = document.querySelector(".pagination-container")
  var calcEle3 = document.querySelector('.fixed-header');

  var siblingsHeight = 0;
  var tableEle = document.getElementById('elementTale');
  if (tableEle) {
    var tableParent = tableEle.parentNode;
    var tableSiblings = tableParent.children;

    // 获取 除了 table的同级元素的所有高度
    for (var i = 0; i < tableSiblings.length; i++) {
      if (tableSiblings[i] !== tableEle) {
        // tableSiblings[i].style.background = "red";
        // console.log(tableSiblings[i].clientHeight)
        siblingsHeight += tableSiblings[i].clientHeight;
      }
    }
  }
  // console.log(siblingsHeight)

  const appHeight = domEle.clientHeight;
  // let calc1 = (calcEle1 && calcEle1.clientHeight) ? calcEle1.clientHeight : 0
  // let calc2 = (calcEle2 && calcEle2.clientHeight) ? calcEle2.clientHeight : 62
  const calc3 = (calcEle3 && calcEle3.clientHeight) ? calcEle3.clientHeight : 84;

  const tableHeight = appHeight - siblingsHeight - calc3;
  // console.log(appHeight,calc1,calc2,calc3,tableHeight,'common');
  store.commit('elementSize/SET_TABLEHEIGHT', tableHeight);
}

// 封装操作 localstorage 本地存储
var storage = {
  set(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  },
  get(key) {
    return JSON.parse(sessionStorage.getItem(key));
  },
  remove(key) {
    sessionStorage.removeItem(key);
  }
};
export {
  storage
};

// 根据字符串，返回背景色
export function stringToColour(str = '') {
  var hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (let i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}
/**
 * 解析消息体 {content:'',type:''}的字符串
 * type：text 纯文本（包括带表情），image: 带图片
 * @param {string} messageStr
 */
import Autolinker from 'autolinker';
import allStore from '@/store';
import emojiJson from '@/views/chats/chatEditor/emoji/emoji.json';
export function parseMessage(msgItem) { // json字符串
  // if (msgItem.Type !== 1) {
  //   return msgItem.Content
  // }
  let messageDataJson;
  const messageStr = msgItem.Content;// json字符串，{content:'文本内容',url:'图片地址'}
  msgItem.CType = msgItem.CType ? msgItem.CType : 1;
  const emojiRegex = new RegExp(':[a-z_0-9]+:', 'g');
  const imgReg = /\.(png|jpe?g|gif|svg)(\?.*)?$/;
  const autoLinkOptions = {
    stripPrefix: false,
    stripTrailingSlash: false,
    className: 'content-link',
    replaceFn: function(match) {
      switch (match.getType()) {
        case 'url':
          // console.log('url: ', match.getUrl())
          // messageDataJson.type = 'url'
          if (!messageDataJson.href) {
            messageDataJson.href = match.getUrl();
          }

          if (imgReg.test(messageDataJson.href)) { // 判断链接是图片连接 或者网址
            const imgUrlObj = {
              url: match.getUrl(),
              site_name: '',
              title: '',
              description: '',
              images: [{ url: match.getUrl() }]
            };
            allStore.commit('app/UPDATE_URLS', imgUrlObj);
          } else {
            allStore.dispatch('app/getUrlsInfo', { url: match.getUrl(), chatId: msgItem.ChatId, messageId: msgItem.Mid ? msgItem.Mid : msgItem.Time });
          }

          return true; // let Autolinker perform its normal anchor tag replacement

        case 'email':
          // var email = match.getEmail();
          return false;
          // if (email === "my@own.address") {
          //   return false; // don't auto-link this particular email address; leave as-is
          // } else {
          //   return; // no return value will have Autolinker perform its normal anchor tag replacement (same as returning `true`)
          // }
        case 'phone':
          return '<a href="tel:' + match.getNumber() + '" class="contentLink">' + match.matchedText + '</a>';

        case 'mention':
          return false;
            // console.log("Mention: ", match.getMention());
            // console.log("Mention Service Name: ", match.getServiceName());

            // return '<a href="http://newplace.to.link.mention.handles.to/">' + match.getMention() + '</a>';
      }
    }
  };
  var pasreEmoji = function(messageText) {
    var html = messageText || '';
    if (emojiJson) {
      html = html.replace(emojiRegex, function(match, emoji) {
        var emojiObj = emojiJson[match];
        var emojiClass = emojiObj ? emojiObj.class : '';
        if (emojiObj && emojiClass) {
          return '<span contenteditable="false" class="content-emoji ' + emojiObj.type + '_face ' + emojiClass + '"></span>';
        } else {
          return match;
        }
      });
    }
    return html;
  };
  try {
    messageDataJson = JSON.parse(messageStr);

    if (messageDataJson && typeof messageDataJson === 'object') {
      if (messageDataJson.content === undefined) { // 没有content字段
        messageDataJson.content = messageStr;
      }
    }
  } catch (error) {
    // JSON.parse失败，则为纯文本
    messageDataJson = {
      content: messageStr
    };
  }
  msgItem.sourceContent = JSON.parse(JSON.stringify(messageDataJson));
  messageDataJson.content = pasreEmoji(messageDataJson.content);
  messageDataJson.content = Autolinker.link(messageDataJson.content, autoLinkOptions);
  if (messageDataJson.type === 'img') {
    msgItem.CType = 2;
  }
  if (msgItem.CType === 2) { // 图片消息
    var imgObj = {
      url: messageDataJson.url,
      chatId: msgItem.ChatId,
      messageId: msgItem.Mid ? msgItem.Mid : msgItem.Time,
      from: 'upload'
    };
    allStore.dispatch('app/updateMsgImgs', imgObj);
  }
  if (messageDataJson.href) { // 带链接的消息
    var imgObjFromLink = {
      url: imgReg.test(messageDataJson.href) ? messageDataJson.href : '',
      chatId: msgItem.ChatId,
      messageId: msgItem.Mid ? msgItem.Mid : msgItem.Time,
      from: 'website'
    };
    allStore.dispatch('app/updateMsgImgs', imgObjFromLink);
  }
  msgItem.ContentJson = messageDataJson;

  return msgItem;
}

export function countFormat(value, t = 'en') {
  if (!value) return;
  const time = {
      seconds: parseInt(value),
      minutes: 0,
      hours: 0,
      days: 0
    };
    let results = '';
    const lang = {
      zh: {
        seconds: '秒',
        minutes: '分',
        hours: '时',
        days: '天'
      },
      en: {
        seconds: 's',
        minutes: 'm',
        hours: 'h',
        days: 'd'
      }
    };
  if (time.seconds > 60) {
    time.minutes = parseInt(time.seconds / 60);
    time.seconds = parseInt(time.seconds % 60);
    if (time.minutes > 60) {
      time.hours = parseInt(time.minutes / 60);
      time.minutes = parseInt(time.minutes % 60);
      if (time.hours > 24) {
        time.days = parseInt(time.hours / 24);
        time.hours = parseInt(time.hours % 24);
      }
    }
  }
  time.seconds > 0 && (results = time.seconds + lang[t].seconds);
  time.minutes > 0 && (results = time.minutes + lang[t].minutes + results);
  time.hours > 0 && (results = time.hours + lang[t].hours + results);
  time.days > 0 && (results = time.days + lang[t].days + results);
  return results;
}
/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function isToday(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return false;
  }
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time);
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000;
    }
    date = new Date(time);
  }

  return new Date().toDateString() === date.toDateString();
}

/**
 * @func transferMessageItem
 * @desc 对socket消息的字段进来大小写转换
 * @param {object} item - 参数item
 * @return {object} transferObj - 返回转换后的数据对象
 */
export function transferMessageItem(item) {
  //  {btype: 0,chatid: "775727fd-9cee-4548-a73a-6de7a63ce7de",cip: "127.0.0.1:51198",
  //     content: "{"type":"text","content":"232332323"}",from: "94876d0e-ff3c-466c-9574-574759c8dbea",
  //     mention: "",mid: "1610699903412901729",quote: "",rid: "",time: 1610699903,tmlid: "",type: 1}
  const transferObj = {
    ChatId: item.chatid,
    Content: item.content,
    From: item.from,
    Mid: item.mid,
    Time: item.time,
    Type: item.type,
    BType: item.BType
  };
  return transferObj;
}

/**
 * @func forEachLast
 * @desc 对数组进行倒序遍历
 * @param {array} arr - 参数arr,需要遍历的数组
 * @return {object} transferObj - 返回转换后的数据对象
 */
export const forEachLast = (arr = [], handle = () => {}) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    const isReturn = handle(arr[i], i);
    if (isReturn) {
      break;
    }
  }
};
