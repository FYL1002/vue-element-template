<template>
  <div class="css-1ob8ues">
    <div class="css-1v1i699">
      <div class="css-1v6jiwg">
        <div class="chatTitle">存档列表</div>
        <div class="chatList">
          <div class="search">
            <div class="cInput">
              <!-- <el-input v-model="channelValue" placeholder="请输入频道名称" clearable @keyup.enter.native="searchChannel()" /> -->
              <el-input v-model="searchValue" placeholder="请输入内容" prefix-icon="el-icon-search" clearable @keyup.enter.native="searchList()" />
            </div>
            <div class="cBtns">
              <el-button type="primary" size="medium" icon="el-icon-search" @click="searchList()" />
            </div>

          </div>
          <div class="archivesList">
            <el-scrollbar style="height:100%">
              <div class="chatWrap">
                <ul class="chatUl">
                  <li v-for="(item,i) in chattingData" :key="item.i" @click="currentClientClick(item,i)">
                    <div class="css-1vtrkp2" :class="item.id==activeChatId?'chatActive':''">
                      <div class="user-symbol-container">
                        <div class="css-ab0tuu">
                          <span class="user-symbol-content" :style="{background:item.customerName?stringToColour(item.customerName.substr(0,1)):'#4384f5'}">{{ item.customerName?item.customerName.substr(0,1):'客' }}</span>
                        </div>
                      </div>
                      <div class="midContent">
                        <div class="users">{{ item.customerName?item.customerName:'客户' }}</div>
                        <div class="last-message">
                          <div v-if="chatRecordData['content'][item.id]&&chatRecordData['content'][item.id]['list'].length" class="lastMsg" v-html="chatRecordData['content'][item.id]['list'][chatRecordData['content'][item.id]['list'].length-1].ContentJson.content" />
                        </div>
                      </div>
                      <!-- <div class="css-134gto2" v-if="chatRecordData['content'][item.id]&&chatRecordData['content'][item.id].unreadNum">
                          <div class="css-1g2zvoj">
                            <span>{{chatRecordData['content'][item.id].unreadNum}}</span>
                          </div>
                        </div> -->
                    </div>
                  </li>
                  <li v-if="chattingData.length==0 && !tableLoading" class="nochatData">暂无记录</li>
                </ul>
              </div>

            </el-scrollbar>
          </div>

          <div v-show="tableLoading" v-loading="tableLoading" class="loaddingMsg" />

          <!-- <el-backtop target="el-scrollbar .el-scrollbar__wrap" :bottom="100">
            <div
              style="{
                height: 100%;
                width: 100%;
                background-color: #f2f5f6;
                box-shadow: 0 0 6px rgba(0,0,0, .12);
                text-align: center;
                line-height: 40px;
                color: #1989fa;
              }"
            >
              UP
            </div>
          </el-backtop> -->
        </div>
      </div>
    </div>
    <div class="css-n9nsn0 archivesWrap">
      <div class="css-v43uy2">
        <div class="css-1m0bmdi">
          <div v-if="chattingClient&&chattingClient.customerName" class="css-1w1vawl">
            <b>{{ chattingClient.customerName }}</b>
            <span>和 {{ chattingClient.agentNickName || chattingClient.agentUserName }}</span>
          </div>
          <!-- <div class="downMore">
            <el-dropdown trigger="click">
              <el-button icon="el-icon-more"></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-right">转到</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div> -->
        </div>
        <div class="css-488d21">
          <div class="chat-window">
            <div class="window history-loaded">
              <div class="chat-content">
                <overlay-scrollbars ref="osComponentRef" class="chat-scroll" :options="osComponentOptions">
                  <div class="chats-container">
                    <ul class="chats">
                      <li>
                        <ul v-if="chatRecordData['content'][chattingClient.id]" class="thread-content">
                          <li v-for="(chatItem,i) in chatRecordData['content'][chattingClient.id].list" :key="'Mid-'+chatItem.Mid+chattingClient.imChatId" class="message supports-read-status has-time" :class="[chatItem.From==chattingClient.customerId?'visitor':'own', getMonitorStatue(chatItem)]">
                            <div class="message-wrapper">
                              <!-- 判断有没有昵称 有就显示昵称  没有显示用户名 -->
                              <span v-if="i==0||(chatRecordData['content'][chattingClient.id].list[i-1]&&chatItem.From!=chatRecordData['content'][chattingClient.id].list[i-1].From)" class="author">
                                {{ nickNameObjInfo[chatItem.From]?(nickNameObjInfo[chatItem.From].nickName?nickNameObjInfo[chatItem.From].nickName:nickNameObjInfo[chatItem.From].name):'未知用户' }}</span>
                              <!-- <span class="author" v-if="i==0||(chatRecordData['content'][chattingClient.id].list[i-1]&&chatItem.From!=chatRecordData['content'][chattingClient.id].list[i-1].From)">{{chatItem.From!=member.id?chattingClient.customerName:member.name}}</span> -->
                              <div class="user-symbol-container">
                                <div class="css-1l2q886">
                                  <head-portrait v-if="i==0||(chatRecordData['content'][chattingClient.id].list[i-1]&&chatItem.From!=chatRecordData['content'][chattingClient.id].list[i-1].From)" :chat-item="chatItem" />
                                </div>
                              </div>
                              <div class="text dropdownText">
                                <div v-if="chatItem.CType===2 && chatItem.ContentJson.url" class="chatimgCon">

                                  <el-image :src="chatItem.ContentJson.url" class="chatImage" @click="handleImgClick(chatItem,'upload')" />
                                </div>
                                <div v-html="chatItem.ContentJson.content" />
                                <div v-if="chatItem.ContentJson.href&&linkUrlsInfo[chatItem.ContentJson.href]">
                                  <div v-if="linkUrlsInfo[chatItem.ContentJson.href].site_name||linkUrlsInfo[chatItem.ContentJson.href].title||linkUrlsInfo[chatItem.ContentJson.href].description||linkUrlsInfo[chatItem.ContentJson.href].images" class="message_websiteSeoWrap">
                                    <div v-if="linkUrlsInfo[chatItem.ContentJson.href].site_name" class="message_website_name">
                                      <a :href="chatItem.ContentJson.href">{{ linkUrlsInfo[chatItem.ContentJson.href].site_name }}</a>
                                    </div>
                                    <div v-if="linkUrlsInfo[chatItem.ContentJson.href].title" class="message_website_title">
                                      {{ linkUrlsInfo[chatItem.ContentJson.href].title }}
                                    </div>
                                    <div v-if="linkUrlsInfo[chatItem.ContentJson.href].description" class="message_website_description">
                                      {{ linkUrlsInfo[chatItem.ContentJson.href].description }}
                                    </div>
                                    <div v-if="linkUrlsInfo[chatItem.ContentJson.href].images" class="message_website_iamge">
                                      <a>
                                        <el-image :src="linkUrlsInfo[chatItem.ContentJson.href].images[0].url" class="chatImage websiteImage" @click="handleImgClick(chatItem,'website')" />
                                      </a>
                                    </div>
                                  </div>
                                </div>
                                <p v-show="getMonitorStatue(chatItem) === 'monitor' || getMonitorStatue(chatItem) === 'monitored'" class="chatItem-inner"><svg-icon icon-class="Notvisible" />内部私聊消息</p>
                              </div>
                              <div class="components">
                                <span v-if="chatItem.Type ==4" class="time edited">edited</span>
                                <span class="time">{{ chatItem.Time | parseTime('{yyy}-{mm}-{dd} {h}:{i}') }}</span>
                              </div>
                            </div>
                          </li>
                          <li v-if="!chatRecordData['content'][chattingClient.id].list.length" class="noMsg">暂无消息</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </overlay-scrollbars>
              </div>
              <div v-show="loading" v-loading="loading" class="loaddingMsg" :class="{'loaddingMsg-history':chattingClient.hasGetHistoryBool}" />
              <!-- <div class="textarea" v-show="chattingClient.id">
                <div class="chat-input">
                  <div class="css-1ivnzjx">
                    <div v-if="chattingClient&&chattingClient.status==1">
                      <div class="css-trrz19">
                        <ChatEditor :chat-content="chatValue" @send-message="sendMessage" />
                      </div>
                    </div>

                    <div class="queue-info-wrapper" v-if="chattingClient&&chattingClient.status==4">
                      <p class="queuetime">{{chattingClient.name}}
                        正在等待队列中<strong><span>{{queuedChatData[chattingClient.index].waitCount|countFormat('zh')}}</span></strong>
                      </p>
                      <el-button type="primary" size="small" @click="startChat(chattingClient)" :loading="queuedChatData[chattingClient.index].startChatBtnLoading" v-if="permissionAll[$route.path] && permissionAll[$route.path].startChat">开始对话</el-button>
                    </div>
                  </div>
                </div>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <right-page ref="RightPage" :dialog-form-data="chattingClient" :from-page="'archives'" @checkAllChats="checkAllChatsFn" />
    <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="viewerImgList" :initial-index="initialIndex" :z-index="9999" />
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex';
import {
  getChatsList,
  getHistoryRecord,
  GetContacts,
  getMonitorChatList
} from '@/api/chats';
import {
  // storage,
  // copy,
  stringToColour,
  parseMessage
} from '@/utils/common';
import RightPage from '../chats/index.rightpage';
import HeadPortrait from '../chats/index.headPortrait';
import ElImageViewer from 'element-ui/packages/image/src/image-viewer';
let isLoadingMore = false;
let lastScroll = 0;
let osInstance;

export default {
  name: 'Archives',
  components: {
    RightPage,
    HeadPortrait,
    ElImageViewer
  },

  data() {
    return {
      customerId: this.$route.query.id,
      initialIndex: 0,
      tableLoading: false,
      showViewer: false,
      viewerImgList: [],
      activeNames: ['chatting'],
      activeChatId: '',
      chattingData: [],
      chatValue: {
        content: '',
        type: 'text'
      },
      queuedChatData: [],
      chattingClient: {},
      chatRecordObj: {},
      chatContainer: null,
      sendBtnloading: false,
      closeModelVisiable: false,
      chatRecordData: {
        'unreadTotal': 0,
        'content': {}
      },
      currentChatData: [],
      currentRow: null,
      loading: false,
      searchValue: '',
      chatIdRelatedMonitor: {},
      osComponentOptions: {
        scrollbars: {
          autoHide: 'leave',
          dragScrolling: true,
          clickScrolling: true
        },
        paddingAbsolute: true,
        callbacks: {
          onContentSizeChanged(eventArgs) {},
          onScroll: (eventArgs) => {
            if (!this.chattingClient) return;
            const scrollTop = osInstance.scroll().position.y;
            if (scrollTop <= 200 && lastScroll > scrollTop) {
              if (!isLoadingMore && !this.chattingClient.noMoreHistoryData && this.chattingClient.hasGetHistoryBool) {
                isLoadingMore = true;
                this.loading = true;
                osInstance.scrollStop();
                osInstance.options({
                  overflowBehavior: {
                    y: 'h'
                  }
                });
                // 加载更多
                this.getHistoryRecord();
              }
            }
            lastScroll = osInstance.scroll().position.y;
          }
        }
      }
    };
  },
  computed: {
    ...mapGetters([
      'member',
      'imagePath',
      'permissionAll'
      // 'socketUrl'
    ]),
    memberid() {
      return this.member.id;
    },
    stringToColour() {
      return stringToColour;
    },
    linkUrlsInfo() {
      return this.$store.getters.urlsParseInfo;
    },
    messageImages() {
      return this.$store.getters.messageImages;
    },
    nickNameObjInfo() {
      return this.$store.getters.nickNameInfo;
    }
    // }
  },
  watch: {
    memberid(nO, oO) {
      if (nO) {
        this.getChatsList();
      }
    },
    searchValue(nval, oval) {
      // if (nval) {
      //   var searchParams = { customerName: nval };
      //   this.getChatsList(searchParams);
      // } else if (nval === '') {
      //   this.getChatsList();
      // }
    }
  },
  created() {
    this.$nextTick(() => {
      osInstance = this.$refs.osComponentRef.osInstance();
      osInstance.scrollStop().scroll({
        y: '100%'
      });
      lastScroll = osInstance.scroll().position.y;
    });
  },
  mounted() {
    if (this.member.id) {
      this.getChatsList();
    }
  },
  methods: {
    searchList() {
      if (this.searchValue) {
        var searchParams = {
          customerName: this.searchValue
        };
        this.getChatsList(searchParams);
      } else if (this.searchValue === '') {
        this.getChatsList();
      }
    },
    handleImgClick(chatItem, from) {
      const imgFrom = from || 'upload';
      const vueThis = this;
      const chatId = chatItem.ChatId;
      const messageId = chatItem.Mid ? chatItem.Mid : chatItem.Time;
      let curIndex;
      this.viewerImgList = [];
      this.messageImages[chatId].forEach((item, i) => {
        if (item.Mid === messageId && item.from === imgFrom) {
          curIndex = i;
        }
        vueThis.viewerImgList.push(item.url);
      });
      this.initialIndex = curIndex;
      this.showViewer = true;
    },
    closeViewer() {
      this.showViewer = false;
    },
    loadingMore() {
      if (!this.chattingClient) return;
      const scrollTop = this.$refs.chatContent.scrollTop;
      if (scrollTop <= 200 && lastScroll > scrollTop) {
        if (!isLoadingMore && !this.chattingClient.noMoreHistoryData && this.chattingClient.hasGetHistoryBool) {
          isLoadingMore = true;
          this.$refs.chatContent.style.overflow = 'hidden';
          // 加载更多
          this.getHistoryRecord();
        }
      }
      lastScroll = this.$refs.chatContent.scrollTop;
    },
    getChatsList(chatParams) {
      var chatObi = chatParams || {};
      this.tableLoading = true;
      chatObi['status'] = 3; // 结束状态的会话
      chatObi['orderByDesc'] = 'updatedOn';
      chatObi['v'] = Math.random();

      this.chattingData = [];
      this.chattingClient = Object.assign({});
      // status :Default, Chatting, WaitToChat, End, Queued,
      getChatsList(chatObi).then(data => {
        this.tableLoading = false;
        if (data && data.results.length) {
          data.results.forEach(element => {
            if (element.imChatId) {
              // 排队中的状态
              if (element.status === 4) {
                this.chattingData.push(element);
              } else {
                var o = element;
                o.closeModelVisiable = false;
                o.hasGetHistoryBool = false;
                this.chattingData.push(o);
              }
            }
          });

          // 如果当前 没赋值  就默认第一条
          // if (!this.chattingClient.id) {
          this.chattingData.length && this.currentClientClick(this.chattingData[0], 0);
          // }
          // 置底部
          this.scrollToBottom();
        }
        // this.chattingData[0] && (this.currentRow = this.chattingData[0] )
      }).catch(respon => {
        this.tableLoading = false;
      });
    },
    currentClientClick(item, i) {
      this.loading = true;
      var curItem = item;

      this.activeChatId = curItem.id || '';
      this.chattingClient = Object.assign({}, curItem); // 当前对象 赋值

      this.$set(this.chattingClient, 'isFrom', 'archives');

      if (!this.chatRecordData['content'][curItem.id]) {
        this.chatRecordData['content'][curItem.id] = {
          'unreadNum': 0,
          'list': []
        };
      }
      if (!curItem.hasGetHistoryBool) {
        this.getHistoryRecord();
        this.chattingData[i].hasGetHistoryBool = true;
        // 查询昵称
        this.getNickName();
      } else {
        this.scrollToBottom();
        this.loading = false;
      }

      this.currentChatData = this.chatRecordData['content'][this.chattingClient.id].list;
    },
    async getHistoryRecord() {
      if (!this.chattingClient.id || !this.chattingClient.endTime) return;

      var curData = this.chatRecordData['content'][this.chattingClient.id].list;
      // debugger
      const TimeStart = Math.floor((new Date(this.chattingClient.createdOn)).getTime() * 1000000);
      // const TimeEnd = curData.length ? curData[0].Time : Math.floor((new Date(this.chattingClient.endTime)).getTime() / 1000); //秒
      const TimeEnd = curData.length ? Number(curData[0].Time) - 1000 : Math.floor(((new Date(this.chattingClient.endTime)).getTime() * 1000000)); // 纳秒

      if (TimeEnd < TimeStart) return;
      // var hisParams = {
      //     Session: this.chattingClient.imChatId, // 会话ID
      //     TimeStart: TimeStart, // 消息开始时间  秒
      //     TimeEnd: TimeEnd, // 消息结束时间   秒
      //     Limit: 20,
      //     Reverse: true
      //   };
      let monitorIMChatId = '';
      if (!this.chatIdRelatedMonitor[this.chattingClient.id]) {
        monitorIMChatId = await this.getMonitorChatFn(this.chattingClient.id);
      }
      console.log(monitorIMChatId);
      const getHistoryParam = {
        Chat_idIn: this.chattingClient.imChatId + (monitorIMChatId ? ',' + monitorIMChatId : ''),
        Take: 20,
        Skip: 0,
        OrderByDesc: 'time',
        TimeBetween: TimeStart + ',' + TimeEnd
        // '<Time': Math.floor(TimeEnd / 1000000000)
      };
      this.loading = true;

      getHistoryRecord(getHistoryParam).then(data => {
        if (data) {
          var historyData = JSON.parse(data);

          if (historyData.results) {
            var historyDataArr = [];
            historyData.results.forEach((item) => {
              var msgItem = {
                From: item.from,
                Type: item.type,
                Content: item.content,
                ChatId: item.chat_id,
                Mid: item.mid,
                Time: item.time
              };
              item = parseMessage(msgItem);
              historyDataArr.unshift(item);
            });
            this.chatRecordData['content'][this.chattingClient.id].list.unshift.apply(this.chatRecordData[
              'content'][this.chattingClient.id].list, historyDataArr);
            // 强制刷新页面
            this.$forceUpdate();
          } else {
            this.chattingClient.noMoreHistoryData = true; // 判断历史消息是否全部请求
          }
        }
        setTimeout(() => { // 延迟0.5秒渲染dom
          if (this.chattingClient.hasGetHistoryBool) {
            osInstance.options({
              overflowBehavior: {
                y: 's'
              }
            });
          } else {
            this.scrollToBottom();
            this.chattingClient.hasGetHistoryBool = true;
          }
          this.loading = false;
          isLoadingMore = false;
        }, 500);
      }).catch(respon => {
        this.loading = false;
      });
    },
    getMonitorChatFn(id) {
      return new Promise((resolve, reject) => {
        getMonitorChatList({ chatId: id }).then(data => {
          let monitorIMChatId = '';
          this.chatIdRelatedMonitor[id] = true;
          if (data && data.results && data.results.length) {
            monitorIMChatId = data.results[0].monitorIMChatId;
            this.chatIdRelatedMonitor[id] = monitorIMChatId;
          }
          resolve(monitorIMChatId);
        }).catch(() => {
          reject('');
        });
      });
    },
    getMonitorStatue(item) {
      // 获取当前是监控者还是被监控者
      if (this.chattingClient.imChatId !== item.ChatId) {
        return this.chattingClient.agentUserId === item.From ? 'monitored' : 'monitor';
      }
      return '';
    },
    // 昵称
    getNickName() {
      var customerParams = {
        IMChatId: this.chattingClient.imChatId,
        v: Math.random()
      };
      this.queuedChatData = [];
      GetContacts(customerParams).then(data => {
        if (data.results && data.results.length) {
          data.results.forEach((ele) => {
            if (!this.nickNameObjInfo[ele.contactId]) {
              this.$store.dispatch('app/updateNickname', ele);
            }
          });
        }
      }).catch(respon => {});
    },
    checkAllChatsFn() {
      if (this.chattingClient.id) {
        this.searchValue = this.chattingClient.customerName;
        this.searchList();
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        setTimeout(() => {
          osInstance.scrollStop().scroll({
            y: '100%'
          });
        });
      });
    }
  }
  // beforeDestroy() {
  //   //this.closeInterval();
  // },
  // filters: {
  //   countFormat
  // }
};
</script>

<style lang="scss" scoped>
.el-backtop {
  position: absolute
}

.el-scrollbar__wrap {
  overflow-x: hidden;
}

.el-collapse {
  border: none;
}

.el-collapse>>>.el-collapse-item__header {
  position: relative;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  background-color: rgba(221, 226, 230, 0.5);
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  color: rgb(66, 77, 87);
  user-select: none;
  cursor: pointer;
  margin-bottom: 1px;
  border-radius: 4px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
  padding: 4px 12px 4px 30px;
}

.el-collapse>>>.el-collapse-item__wrap {
  border: none;
}

.el-button.is-round {
  padding: 7px;
}

.el-collapse>>>.el-collapse-item__arrow {
  position: absolute;
  left: 8px;
  top: 13px;
}

.el-collapse>>>.el-collapse-item__content {
  padding: 0;
}

.downMore>>>.el-button {
  border: none
}

a.content-link {
  text-decoration: underline;
}

.el-image-viewer__wrapper>>>.el-image-viewer__close {
  color: #fff;
}
.chat-window>>>p.chatItem-inner {
  bottom: -20px;
}
.chat-window >>> .chat-content .chats-container .message.monitor .text {
  color: #000;
}
.chat-window >>> .chat-content .chats-container .message.monitored .text {
  color: rgb(242,242,242);
}
</style>
