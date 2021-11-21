<template>
  <div class="css-1ob8ues">
    <div class="css-1v1i699">
      <div class="css-1v6jiwg">
        <div class="chatTitle">对话列表</div>
        <div class="chatList">
          <el-scrollbar style="height:100%">
            <div class="chatWrap">
              <el-collapse v-model="activeNames">
                <el-collapse-item name="chatting">
                  <template slot="title">
                    我的对话
                    <span class="chatClientNum">{{ chattingData.length }}</span>
                  </template>
                  <ul class="chatUl">
                    <li v-for="(item,i) in chattingData" :key="item.i" @click="currentClientClick(item,i,false,true)">
                      <div class="css-1vtrkp2" :class="item.id==activeChatId?'chatActive':''">
                        <div class="user-symbol-container">
                          <div class="css-ab0tuu">
                            <span class="user-symbol-content" :style="{background:item.customerName?stringToColour(item.customerName.substr(0,1)):'#4384f5'}">{{ item.customerName?item.customerName.substr(0,1):'客' }}</span>
                          </div>
                        </div>
                        <div class="midContent">
                          <div class="users">{{ item.customerName?item.customerName:'客户' }}</div>
                          <div class="last-message">
                            <div v-if="chatRecordData['content'][item.imChatId]&&chatRecordData['content'][item.imChatId]['list'].length && !(chatTypingData[item.imChatId] && chatTypingData[item.imChatId].length)" class="typingCon">
                              <AutoHide
                                v-if="chatRecordData['content'][item.imChatId]['list'][chatRecordData['content'][item.imChatId]['list'].length-1].Type==5"
                                :if-hide="true"
                                :hide-duration="60000"
                                :update="chatRecordData['content'][item.imChatId]['list'][chatRecordData['content'][item.imChatId]['list'].length-1].updateTime"
                                @delete-msg="deleteDraftMessage(chatRecordData['content'][item.imChatId]['list'].length-1,item.imChatId)"
                              />
                              <span v-if="chatRecordData['content'][item.imChatId]['list'][chatRecordData['content'][item.imChatId]['list'].length-1].Type==5" class="typingGif"><i class="typing_loader" /></span>
                              <span v-if="chatObjFn(item.imChatId)">{{ chatObjFn(item.imChatId).From == member.id ? '你' : nickNameObjInfo[chatObjFn(item.imChatId).From] ? (nickNameObjInfo[chatObjFn(item.imChatId).From].nickName || nickNameObjInfo[chatObjFn(item.imChatId).From].name || '未知用户') : getNickNameFn(chatObjFn(item.imChatId).From) }}:</span>
                              <div v-if="chatRecordData['content'][item.imChatId]['list'][chatRecordData['content'][item.imChatId]['list'].length-1].CType===2">图片</div>
                              <div v-else class="lastMsg" v-html="chatRecordData['content'][item.imChatId]['list'][chatRecordData['content'][item.imChatId]['list'].length-1].ContentJson.content" />

                            </div>
                            <div v-if="chatTypingData[item.imChatId] && chatTypingData[item.imChatId].length>0" class="typingNotice typingContent">
                              <div v-if="chatTypingData[item.imChatId].length<=2" class="text-ellipsis">
                                <span class="typingGif"><i class="typing_loader" /></span>
                                <span v-for="(tMsg,index) in chatTypingData[item.imChatId]" :key="tMsg.from"><span v-if="index===1">和</span>{{ nickNameObjInfo[tMsg.from]?(nickNameObjInfo[tMsg.from].nickName?nickNameObjInfo[tMsg.from].nickName:nickNameObjInfo[tMsg.from].userName):'未知用户' }}</span> 正在输入
                              </div>
                              <div v-if="chatTypingData[item.imChatId].length>2" class="flexBox text-ellipsis"><span class="typingGif"><i class="typing_loader" /></span>{{ chatTypingData[item.imChatId].length }} 人正在输入 </div>
                              <AutoHide v-for="(tMsg,index) in chatTypingData[item.imChatId]" :key="index" :if-hide="true" :hide-duration="3000" :update="tMsg.updateTime" @delete-msg="deleteTypingInfo(index,item.imChatId)" />

                            </div>
                          </div>
                        </div>
                        <div v-if="chatRecordData['content'][item.imChatId]" class="chatrightside">
                          <div v-if="chatRecordData['content'][item.imChatId]['list'].length" class="timeandicon">
                            <div v-if="chatRecordData['content'][item.imChatId].Time&&chatRecordData['content'][item.imChatId]['list'][chatRecordData['content'][item.imChatId]['list'].length - 1].From == member.id" class="readIcon inlineblock">
                              <svg-icon v-if="chatRecordData['content'][item.imChatId]['list'][chatRecordData['content'][item.imChatId]['list'].length - 1].Mid&&chatRecordData['content'][item.imChatId]['list'][chatRecordData['content'][item.imChatId]['list'].length - 1].Time<=chatRecordData['content'][item.imChatId].Time" icon-class="check-marks" />
                              <span v-else class="el-icon-check" />
                            </div>
                            <span v-if="chatRecordData['content'][item.imChatId]['list'][chatRecordData['content'][item.imChatId]['list'].length - 1].Time&&isToday(chatRecordData['content'][item.imChatId]['list'][chatRecordData['content'][item.imChatId]['list'].length - 1].Time)" class="inlineblock">{{ chatRecordData['content'][item.imChatId]['list'][chatRecordData['content'][item.imChatId]['list'].length - 1].Time|parseTime('{h}:{i}') }}</span>
                            <span v-if="chatRecordData['content'][item.imChatId]['list'][chatRecordData['content'][item.imChatId]['list'].length - 1].Time&&!isToday(chatRecordData['content'][item.imChatId]['list'][chatRecordData['content'][item.imChatId]['list'].length - 1].Time)" class="inlineblock">{{ chatRecordData['content'][item.imChatId]['list'][chatRecordData['content'][item.imChatId]['list'].length - 1].Time|parseTime('{x}.{mm}.{dd}') }}</span>
                          </div>
                          <span v-if="chatRecordData['content'][item.imChatId]['unreadNum']" class="unreadNum"><span>{{ chatRecordData['content'][item.imChatId]['unreadNum'] }}</span></span>
                          <!-- <div class="css-134gto2 chatrightside" v-if="chatRecordData['content'][item.imChatId]['unreadNum']">
                            <div class="css-1g2zvoj">
                              <span>{{chatRecordData['content'][item.imChatId].unreadNum}}</span>
                            </div>
                          </div> -->
                        </div>
                        <!-- <div class="css-134gto2 chatrightside" v-if="chatRecordData['content'][item.imChatId]">
                          <div class="css-1g2zvoj">
                            <span>{{ chatRecordData['content'][item.imChatId].unreadNum }}</span>
                          </div>
                        </div> -->
                        <div v-if="permissionAll[$route.path] && permissionAll[$route.path].closeChat" class="css-ymmxaz closemodel" @click="item.closeModelVisiable = true">
                          <div class="css-k1nct7">
                            <i class="closeChatIcon el-icon-close" />
                          </div>
                        </div>
                        <div v-if="item.closeModelVisiable" class="closeModel">
                          <el-button type="success" size="medium" @click="saveAndCloseFn(item)">关闭并存档</el-button>
                          <el-button type="primary" size="medium" @click="item.closeModelVisiable = false">取消
                          </el-button>
                        </div>
                      </div>
                    </li>
                    <li v-if="chattingData.length==0" class="nochatData">暂无对话</li>
                  </ul>
                </el-collapse-item>
                <el-collapse-item name="queuedChat">
                  <template slot="title">
                    排队对话
                    <span class="chatClientNum">{{ queuedChatData.length }}</span>
                  </template>
                  <ul>
                    <li v-for="(item,i) in queuedChatData" :key="item.i" @click="currentClientClick(item,i,true)">
                      <div class="css-1vtrkp2" :class="item.id==activeChatId?'chatActive':''" style="display:flex">
                        <div class="user-symbol-container">
                          <div class="css-ab0tuu">
                            <span class="user-symbol-content" :style="{background:item.customerName?stringToColour(item.customerName.substr(0,1)):'#4384f5'}">{{ item.customerName?item.customerName.substr(0,1):'客' }}</span>
                          </div>
                        </div>
                        <div class="users">{{ item.customerName?item.customerName:item.customerIp }}</div>
                        <div v-show="item.waitCount" class="timer">已等待{{ item.waitCount|countFormat('zh') }}</div>
                      </div>
                    </li>
                    <li v-if="queuedChatData.length==0" class="nochatData">暂无对话</li>
                  </ul>
                </el-collapse-item>
                <el-collapse-item name="monitor">
                  <template slot="title">
                    监控对话
                    <span class="chatClientNum">{{ monitorChatData.length - closedMonitorChatIdList.length }}</span>
                  </template>
                  <ul class="chatUl">
                    <li v-for="(item,i) in monitorChatData" :key="item.id" @click="currentClientClick(item,i)">
                      <div class="css-1vtrkp2 monitor-1vtrkp2" :class="[item.id==activeChatId?'chatActive':'', isClosedMonitorChat(item.imChatId)?'closed':'']">
                        <div class="user-symbol-container">
                          <div class="css-ab0tuu">
                            <span class="user-symbol-content" :style="{background:item.customerName?stringToColour(item.customerName.substr(0,1)):'#4384f5'}">{{ item.customerName?item.customerName.substr(0,1):'客' }}</span>
                          </div>
                        </div>
                        <div class="midContent">
                          <div class="users">{{ item.customerName?item.customerName:'客户' }}</div>
                          <div class="last-message">
                            <div v-if="chatRecordData['content'][item.imChatId]&&chatRecordData['content'][item.imChatId]['list'].length && !(chatTypingData[item.imChatId] && chatTypingData[item.imChatId].length)" class="typingCon">
                              <AutoHide
                                v-if="chatRecordData['content'][item.imChatId]['list'][chatRecordData['content'][item.imChatId]['list'].length-1].Type==5"
                                :if-hide="true"
                                :hide-duration="60000"
                                :update="chatRecordData['content'][item.imChatId]['list'][chatRecordData['content'][item.imChatId]['list'].length-1].updateTime"
                                @delete-msg="deleteDraftMessage(chatRecordData['content'][item.imChatId]['list'].length-1,item.imChatId)"
                              />
                              <span v-if="chatRecordData['content'][item.imChatId]['list'][chatRecordData['content'][item.imChatId]['list'].length-1].Type==5" class="typingGif"><i class="typing_loader" /></span>
                              <span v-if="chatObjFn(item.imChatId)">{{ chatObjFn(item.imChatId).From == member.id ? '你' : nickNameObjInfo[chatObjFn(item.imChatId).From] ? (nickNameObjInfo[chatObjFn(item.imChatId).From].nickName || nickNameObjInfo[chatObjFn(item.imChatId).From].name || '未知用户') : getNickNameFn(chatObjFn(item.imChatId).From) }}:</span>
                              <div v-if="chatRecordData['content'][item.imChatId]['list'][chatRecordData['content'][item.imChatId]['list'].length-1].CType===2">图片</div>
                              <div v-else class="lastMsg" v-html="chatRecordData['content'][item.imChatId]['list'][chatRecordData['content'][item.imChatId]['list'].length-1].ContentJson.content" />

                            </div>
                            <div v-if="chatTypingData[item.imChatId] && chatTypingData[item.imChatId].length>0" class="typingNotice typingContent">
                              <div v-if="chatTypingData[item.imChatId].length<=2" class="text-ellipsis">
                                <span class="typingGif"><i class="typing_loader" /></span>
                                <span v-for="(tMsg,index) in chatTypingData[item.imChatId]" :key="tMsg.from"><span v-if="index===1">和</span>{{ nickNameObjInfo[tMsg.from]?(nickNameObjInfo[tMsg.from].nickName?nickNameObjInfo[tMsg.from].nickName:nickNameObjInfo[tMsg.from].userName):'未知用户' }}</span> 正在输入
                              </div>
                              <div v-if="chatTypingData[item.imChatId].length>2" class="flexBox text-ellipsis"><span class="typingGif"><i class="typing_loader" /></span>{{ chatTypingData[item.imChatId].length }} 人正在输入 </div>
                              <AutoHide v-for="(tMsg,index) in chatTypingData[item.imChatId]" :key="index" :if-hide="true" :hide-duration="3000" :update="tMsg.updateTime" @delete-msg="deleteTypingInfo(index,item.imChatId)" />

                            </div>
                          </div>
                        </div>
                        <div v-if="chatRecordData['content'][item.imChatId]" class="chatrightside">
                          <div v-if="chatRecordData['content'][item.imChatId]['list'].length" class="timeandicon">
                            <div v-if="chatRecordData['content'][item.imChatId].Time&&chatRecordData['content'][item.imChatId]['list'][chatRecordData['content'][item.imChatId]['list'].length - 1].From == member.id" class="readIcon inlineblock">
                              <svg-icon v-if="chatRecordData['content'][item.imChatId]['list'][chatRecordData['content'][item.imChatId]['list'].length - 1].Mid&&chatRecordData['content'][item.imChatId]['list'][chatRecordData['content'][item.imChatId]['list'].length - 1].Time<=chatRecordData['content'][item.imChatId].Time" icon-class="check-marks" />
                              <span v-else class="el-icon-check" />
                            </div>
                            <span v-if="chatRecordData['content'][item.imChatId]['list'][chatRecordData['content'][item.imChatId]['list'].length - 1].Time&&isToday(chatRecordData['content'][item.imChatId]['list'][chatRecordData['content'][item.imChatId]['list'].length - 1].Time)" class="inlineblock">{{ chatRecordData['content'][item.imChatId]['list'][chatRecordData['content'][item.imChatId]['list'].length - 1].Time|parseTime('{h}:{i}') }}</span>
                            <span v-if="chatRecordData['content'][item.imChatId]['list'][chatRecordData['content'][item.imChatId]['list'].length - 1].Time&&!isToday(chatRecordData['content'][item.imChatId]['list'][chatRecordData['content'][item.imChatId]['list'].length - 1].Time)" class="inlineblock">{{ chatRecordData['content'][item.imChatId]['list'][chatRecordData['content'][item.imChatId]['list'].length - 1].Time|parseTime('{x}.{mm}.{dd}') }}</span>
                          </div>
                          <span v-if="chatRecordData['content'][item.imChatId]['unreadNum']" class="unreadNum"><span>{{ chatRecordData['content'][item.imChatId]['unreadNum'] }}</span></span>
                        </div>
                        <div class="closeModel">
                          <el-button type="success" size="medium" @click="closeCanceledMonitorChat(item,i)">关闭</el-button>
                        </div>
                      </div>
                    </li>
                    <li v-if="monitorChatData.length==0" class="nochatData">暂无对话</li>
                  </ul>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <div class="css-n9nsn0" @click="readedMessage()">
      <div class="css-v43uy2">
        <div class="css-1m0bmdi">
          <div v-if="chattingClient&&chattingClient.customerName" class="css-1w1vawl">{{ chattingClient.customerName }}
          </div>
          <div v-if="chattingClient&&chattingClient.status==1" class="downMore">
            <el-dropdown trigger="click" @command="handleCommand">
              <el-button icon="el-icon-more" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="permissionAll[$route.path] &&permissionAll[$route.path].transfer" icon="el-icon-right" command="transferTo">转接</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="css-488d21">
          <div class="chat-window">
            <div class="window history-loaded">
              <div class="chat-content">
                <overlay-scrollbars ref="osComponentRef" class="chat-scroll" :options="osComponentOptions">
                  <div ref="chatContainer" class="chats-container">
                    <ul v-if="chattingClient.status==1&&chatRecordData['content'][chattingClient.imChatId]" class="chats">
                      <li>
                        <ul v-if="chattingClient.status==1&&chatRecordData['content'][chattingClient.imChatId]" class="thread-content">
                          <li v-for="(chatItem,i) in chatRecordData['content'][chattingClient.imChatId].list" :key="'Mid-'+chatItem.Mid+chattingClient.imChatId" class="message supports-read-status has-time" :class="[chatItem.From==chattingClient.customerId?'visitor':'own', getMonitorStatue(chatItem)]">
                            <!-- 控制草稿消息的消失 -->
                            <AutoHide v-if="chatItem.Type==5" :if-hide="chatItem.Type==5" :hide-duration="60000" :update="chatItem.updateTime" @delete-msg="deleteDraftMessage(i,chattingClient.imChatId)" />
                            <div class="message-wrapper">
                              <span v-if="i==0||(chatRecordData['content'][chattingClient.imChatId].list[i-1]&&chatItem.From!=chatRecordData['content'][chattingClient.imChatId].list[i-1].From)" class="author">{{ nickNameObjInfo[chatItem.From]?(nickNameObjInfo[chatItem.From].nickName||nickNameObjInfo[chatItem.From].name||'未知用户'):getNickNameFn(chatItem.From) }}</span>
                              <div class="user-symbol-container">
                                <div class="css-1l2q886">
                                  <head-portrait v-if="i==0||(chatRecordData['content'][chattingClient.imChatId].list[i-1]&&chatItem.From!=chatRecordData['content'][chattingClient.imChatId].list[i-1].From)" :chat-item="chatItem" />
                                </div>
                              </div>
                              <div class="text">
                                <el-dropdown @command="handleDropdownMsg">
                                  <div class="el-dropdown-link dropdownText" style="position:relative;">
                                    <div v-if="chatItem.Type===5" class="typingMsgBox">
                                      <span class="typingGif"><i class="typing_loader" /></span>
                                    </div>
                                    <div v-if="chatItem.CType === 2 && chatItem.ContentJson.url" class="chatimgCon">
                                      <el-image :src="chatItem.ContentJson.url" class="chatImage" @click="handleImgClick(chatItem,'upload')" />
                                    </div>
                                    <div :class="chatItem.From == member.id?'msgCon':''">
                                      <pre class="pre-html" :class="chatItem.Type===5?'draftText':''" v-html="chatItem.ContentJson.content" />
                                      <div v-show="chatItem.From == member.id" class="readIcon">
                                        <svg-icon v-if="getMessageReadStatue(chatItem)" icon-class="check-marks" />
                                        <span v-else class="el-icon-check" />
                                      </div>
                                    </div>
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
                                  </div>
                                  <!-- 监控对话不做编辑、删除 -->
                                  <el-dropdown-menu slot="dropdown" :class="permissionAll[$route.path] &&(permissionAll[$route.path].editmsg||permissionAll[$route.path].deletemsg)&&handleMesDropdownShow(chatItem)?'':'displaynone'">
                                    <el-dropdown-item v-if="permissionAll[$route.path].editmsg && chatItem.From==member.id" :command="dropCommand('edit',chatItem)" icon="el-icon-edit">编辑消息</el-dropdown-item>
                                    <el-dropdown-item v-if="permissionAll[$route.path].deletemsg" :command="dropCommand('delete',chatItem)" icon="el-icon-delete">删除消息</el-dropdown-item>
                                  </el-dropdown-menu>
                                </el-dropdown>
                                <p v-show="getMonitorStatue(chatItem) === 'monitor' || getMonitorStatue(chatItem) === 'monitored'" class="chatItem-inner"><svg-icon icon-class="Notvisible" />内部私聊消息</p>
                              </div>
                              <div class="components">
                                <span v-if="chatItem.Type ==4" class="time edited">edited</span>
                                <span class="time">{{ chatItem.Time | parseTime('{yyy}-{mm}-{dd} {h}:{i}') }}</span>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>

                </overlay-scrollbars>
                <div v-show="!isScrollInBottom" class="scroll-bottom" :class="{'unRead': chatRecordData['content'][chattingClient.imChatId] && chatRecordData['content'][chattingClient.imChatId]['unreadNum'] > 0}" @click="scrollToBottom(false, 200)">
                  <div class="scroll-bottom-arrow">
                    <svg-icon icon-class="arrow-double-bottom" />
                  </div>
                  <div class="scroll-bottom-content">
                    <span v-if="chatRecordData['content'][chattingClient.imChatId] && chatRecordData['content'][chattingClient.imChatId]['unreadNum'] > 0">{{ chatRecordData['content'][chattingClient.imChatId]['unreadNum'] > 99 ? '99+' : chatRecordData['content'][chattingClient.imChatId]['unreadNum'] }}条最新消息</span>
                    <span v-else>回到底部</span>
                  </div>
                </div>
              </div>
              <div v-show="loading" v-loading="loading" class="loaddingMsg" :class="{'loaddingMsg-history':chattingClient.hasGetHistoryBool}" />

              <div v-show="chattingClient.id" class="textarea">
                <div class="chat-input">
                  <div class="css-1ivnzjx" :class="{'closed-monitor-chat': isClosedMonitorChat(chattingClient.imChatId)}">
                    <div v-if="chattingClient&&chattingClient.status==1">
                      <ChatEditor ref="ChatEditor" :chat-content="chatValue" :chatting-client="chattingClient" @send-message="sendMessage" @close-edit-message="closeEditMessage" @get-innermessage-switch="getInnerMessageSwitch" @cancel-monitor-chat="cancelMonitorChat" />
                      <!-- <ChatEditor v-bind:chat-content="chatValue"></ChatEditor> -->
                      <!-- <textarea v-model="chatValue" @keyup.enter="sendMessage" placeholder="请输入……"
                          style="height: 44px;"></textarea> -->

                      <!-- <div class="toolbar-wrapper">
                        <div class="css-1iaz4t0">#</div>
                        <div class="css-u4p24i">
                          <el-button type="primary" size="medium" @click="sendMessage" :loading="sendBtnloading"
                            :disabled="!chattingClient||!chattingClient.imChatId">发送</el-button>
                        </div>
                      </div> -->
                    </div>

                    <div v-if="chattingClient&&chattingClient.status==4" class="queue-info-wrapper">
                      <p class="queuetime">{{ chattingClient.name }}
                        正在等待队列中<strong><span>{{ queuedChatData[chattingClient.index].waitCount|countFormat('zh') }}</span></strong>
                      </p>
                      <el-button v-if="permissionAll[$route.path] && permissionAll[$route.path].startChat" type="primary" size="small" :loading="queuedChatData[chattingClient.index].startChatBtnLoading" @click="startChat(chattingClient)">开始对话</el-button>
                    </div>
                  </div>
                </div>
                <div v-show="isClosedMonitorChat(chattingClient.imChatId)" class="cancel-monitor-mask" @click.stop />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <right-page ref="RightPage" :dialog-form-data="chattingClient" :from-page="'chat'" />
    <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="viewerImgList" :initial-index="initialIndex" :z-index="9999" />
    <!-- 新增 -->
    <transfer-dialog v-if="dialogBoolTransfer" ref="transferDialog" :visible.sync="dialogBoolTransfer" :dialog-transfer-data="chattingClient" @dialogTransferrSave="TransferOk" />
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex';
import {
  getChatsList,
  editChat,
  PickChat,
  getHistoryRecord,
  GetUserOfContacts
} from '@/api/chats';
import {
  isToday,
  stringToColour,
  parseMessage,
  countFormat
} from '@/utils/common';
import RightPage from './index.rightpage';
import ChatEditor from './index.chat';
import HeadPortrait from './index.headPortrait';
import ElImageViewer from 'element-ui/packages/image/src/image-viewer';
import TransferDialog from './index.transfer';
import AutoHide from '@/components/AutoHide';
// import chatRecord from '@/store/modules/chatRecord';

let timer; let isLoadingMore = false; let lastScroll = 0; let osInstance; let isChatContact = false;
export default {
  name: 'Chats',
  components: {
    RightPage,
    ChatEditor,
    HeadPortrait,
    ElImageViewer,
    TransferDialog,
    AutoHide
  },
  filters: {
    countFormat
  },
  data() {
    return {
      customerId: this.$route.query.id,
      initialIndex: 0,
      showViewer: false,
      viewerImgList: [],
      activeNames: ['chatting', 'queuedChat', 'monitor'],
      activeChatId: '',
      chattingData: [],
      chatValue: {
        content: '',
        type: 'text'
      },
      queuedChatData: [],
      monitorChatData: [],
      chattingClient: {},
      chatRecordObj: {},
      chatContainer: null,
      sendBtnloading: false,
      closeModelVisiable: false,
      // chatRecordData:this.$root.ChatRecordData,
      chatRecordData: this.$root.ChatRecordData,
      currentChatData: [],
      TimeEnd: '',
      currentRow: null,
      loading: false,
      dialogBoolTransfer: false, // 转交客服,
      currentEditMsg: {},
      isInnerMessage: false,
      chatHistoryData: {}, // hasGet记录该id的历史消息是否有查过、allGet记录已查询该id的所有历史消息
      isGetChatRelate: false,
      isScrollInBottom: true,
      closedMonitorChatIdList: [], // 记录已经被关闭的监控对话的imChatId
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
              if (!isLoadingMore && this.chatHistoryData[this.chattingClient.id] && !this.chatHistoryData[this.chattingClient.id].allGet && this.chattingClient.hasGetHistoryBool) {
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
            // 判断聊天区域的滚动条是否在底部
            this.isScrollInBottom = osInstance.scroll().max.y - lastScroll < 32;
          }
        }
      }
    };
  },
  computed: {
    ...mapGetters([
      'member',
      'imagePath',
      'hasUnreadMsg',
      'permissionAll',
      'notifyConfig',
      'monitorChatIdRelate',
      'chatIdPosition',
      'hasUnreadMsg'
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
    },
    chatTypingData() {
      return this.$store.getters.chatTypingData;
    },
    isToday() {
      return isToday;
    }
  },
  watch: {
    memberid(nO, oO) {
      if (nO) {
        // this.getChatsList();
        this.handleChatAndMonitorList();
        this.getNickName();// 昵称
      }
    }
  },
  created() {
    this.getQueuedChatList();
    // this.getMonitorChatList();

    // 接收 mian.js  的推送  分配客服
    this.$root.eventHub.$on('ReceiveAgentChat', (data) => { // status 1:会话中  2:待回复  3:回话结束  4:排队中
      if (data) {
        // 设置新chat的消息历史记录
        if (data.id && !this.chatHistoryData[data.id]) {
          this.chatHistoryData[data.id] = {
            hasGet: false,
            allGet: false
          };
        }
        // 设置新chat和监控chat的关联关系
        if (data.monitors && data.monitors.length) {
          this.$store.commit('chatRecord/SET_MONITORCHATIDRELATE', { monitorChatId: data.monitors[0].monitorIMChatId, chatId: data.imChatId });
        }
        if (data.agentUserId === this.member.id) {
          if (data.status === 1) { // 状态是1 对话中才加数据
            const exist = this.chattingData.some((item, index) => {
              return item.imChatId === data.imChatId;
            });
            if (!exist) {
              this.chattingData.unshift(data);
              // 昵称更新
              const nickObj = {
                contactId: data.customerId,
                imChatId: data.imChatId,
                name: null,
                nickName: data.customerName
              };
              this.$store.dispatch('app/updateNickname', nickObj);
            }
          } else if (data.status === 3) { // 会话结束 删除数据
            this.chattingData.forEach((ele, k) => {
              if (ele.id === data.id) {
                this.chattingData.splice(k, 1);
                if (data.id === this.chattingClient.id) {
                  this.chattingClient = Object.assign({});
                  this.activeChatId = ''; // 删除的这条数是选中的，则置空
                }
              }
            });
          }
        }
        if (data.status === 1 || data.status === 3) { // 对话中的和结束的  在排队中列表删除
          this.queuedChatData.forEach((element, i) => {
            if (element.id === data.id) { // 删除由排队中变成会话中的数据
              this.queuedChatData.splice(i, 1);
              if (data.id === this.chattingClient.id) {
                this.chattingClient = Object.assign({});
                this.activeChatId = ''; // 删除的这条数是选中的，则置空
              }
              // 如果当前选中的是排队中的  且删除的索引小于当前的index  index-1
              if (this.chattingClient.status === 4 && i < this.chattingClient.index) {
                this.chattingClient.index--;
              }
            }
          });
        }
        if (data.status === 4) {
          let isExit = true;
          this.queuedChatData.forEach((elementItem, j) => {
            if (elementItem.id === data.id) { // 如果status 存在，更新数据
              this.queuedChatData.splice(j, 1, data);
              (data.id === this.chattingClient.id) && (this.chattingClient = data); // 如果修改的数是选中的这条数，则重新赋值
              isExit = false;
            }
          });
          if (isExit) {
            this.queuedChatData.push(data);
            this.notifyConfig.Queued.Enabled && this.$root.eventHub.$emit('MessageNotify');
          }

          // 排队中
          timer && !this.queuedChatData.length && this.closeInterval(); // 如果数组为空则清除定时器
          !timer && this.queuedChatData.length && this.openInterval(); // 如果本来数组为空新加了数据则启动定时器
        }

        // 客户或者客服结束对话，将imChatId添加到closedMonitorChatIdList数组中
        if (data.status === 3 && data.agentUserId !== this.member.id) {
          // this.deleteListItem(this.monitorChatData, 'id', data.id);
          // if (data.id === this.chattingClient.id && this.chattingData.length) {
          //   this.currentClientClick(this.chattingData[0], 0);
          // }
          // if (data.id === this.chattingClient.id && !this.chattingData.length) {
          //   this.chattingClient = Object.assign({});
          //   this.activeChatId = ''; // 删除的这条数是选中的，则置空
          // }
          this.closedMonitorChatIdList.push(data.imChatId);
          this.$root.eventHub.$emit('EditorQuillBlur');
        }

        if (data.status === 1 && this.chattingClient.imChatId === data.imChatId && !this.closedMonitorChatIdList.includes(data.imChatId)) {
          // 更新监控中的数据,排除已经结束监控的
          const monitors = data.monitors;
          this.chattingClient === { ...data };
          this.$set(this.chattingClient, 'monitors', monitors);
        }

        if (this.chattingData.length && !this.chattingClient.id) { // 没有选中且有会话中的数据，则默认选中第一条
          this.currentClientClick(this.chattingData[0], 0);
        }
      }
    });
    // 接收 layout 的socket  的推送
    this.$root.eventHub.$on('MessageUpdate', (clientObj) => {
      // 判断推送来的消息 是否 和当前打开的聊天的客户是否一样
      this.chatRecordData = Object.assign({}, this.$root.ChatRecordData);
      if (Array.isArray(clientObj) && clientObj.length && this.isGetChatRelate) {
        // 如果是数组，即为首次连接ws推送来的未读消息
        this.contactMonitorChatData();
      }
      // 强制刷新页面
      this.$forceUpdate();
      if (clientObj.ChatId === this.chattingClient.imChatId || (this.chattingClient.monitors && this.chattingClient.monitors.length && clientObj.ChatId === this.chattingClient.monitors[0].monitorIMChatId)) {
        if (clientObj.From === this.member.id && clientObj.Type === 1) {
          this.readedMessage('selfSend');
          this.scrollToBottom(clientObj.CType === 2); // 收到自己发的消息至底
        } else if (this.isScrollInBottom) {
          // 收到别人的消息时，如果当前滚动条是在底部，则继续滚动到底部
          this.scrollToBottom();
        }
      }
    });

    // 首次查历史消息 先判断是否有未读消息
    this.$root.eventHub.$on('noUnreadMessage', () => {
      if (this.chattingClient && this.chattingClient.id) {
        // this.$set(this.chattingClient,'hasGetHistoryBool',true)
        // 根据路由的客户id,
        if (this.customerId) {
          for (let i = 0; i < this.chattingData.length; i++) {
            if (this.chattingData[i].customerId === this.customerId) {
              this.chatHistoryData[this.chattingClient.id].hasGet = true;
            }
          }
        } else {
          this.chatHistoryData[this.chattingClient.id].hasGet = true;
        }
        this.loading = true;
        this.getHistoryRecord();
        // 查询昵称
        // this.getNickName()
      }
    });
    // 转接处理
    this.$root.eventHub.$on('ReceiveTransferChats', (chatInfo) => {
      // var aa={
      //   chat: {},
      //   customerId: "fda01d6c-2074-426e-a7ce-86de9c69b882",
      //   eventId: "f7e874cd-9c7d-41cc-962c-909317766f21",
      //   fromAgentName: "lin",
      //   fromAgentNickName: null,
      //   fromAgentUserId: "e835e191-7a26-4c18-a4b3-1f4a84301214",
      //   id: "7871c6c0-3478-4ad7-984d-a64e91620fdf",
      //   imChatId: "ef08fa09-ab21-4df1-8fbd-f76c04362dc5",
      //   toAgentUserId: "94876d0e-ff3c-466c-9574-574759c8dbea"
      // }
      if (!chatInfo) return;
      if (chatInfo.fromAgentUserId === this.member.id) { // 判断from的客服和当前客服  删除操作
        this.chattingData.forEach((ele, k) => {
          if (ele.id === chatInfo.id) {
            this.chattingData.splice(k, 1);
            if (chatInfo.id === this.chattingClient.id) {
              this.chattingClient = Object.assign({});
              this.activeChatId = ''; // 删除的这条数是选中的，则置空
            }
          }
        });
      }
      if (chatInfo.toAgentUserId === this.member.id && chatInfo.chat) { // 判断to的客服和当前客服  增加
        this.chattingData.push(chatInfo.chat);
      }
    });
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
      // this.getChatsList();
      this.handleChatAndMonitorList();
      this.getNickName();// 昵称
    }
    this.chatRecordData = Object.assign({}, this.$root.ChatRecordData);
  },
  beforeDestroy() {
    this.closeInterval();
    this.$root.eventHub.$off('ReceiveAgentChat');
    this.$root.eventHub.$off('MessageUpdate');
    this.$root.eventHub.$off('noUnreadMessage');
    this.$root.eventHub.$off('ReceiveTransferChats');
  },
  methods: {
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
        if (!isLoadingMore && !this.chatHistoryData[this.chattingClient.id].allGet && this.chattingClient.hasGetHistoryBool) {
          isLoadingMore = true;

          this.$refs.chatContent.style.overflow = 'hidden';
          // 加载更多
          this.getHistoryRecord();
        }
      }

      lastScroll = this.$refs.chatContent.scrollTop;
    },
    getChatsList() {
      return new Promise((resolve, reject) => {
        var chatPostParams = {
          StatusNotEqualTo: 'End',
          v: Math.random()
        };

        this.chattingData = [];
        // status :Default, Chatting, WaitToChat, End, Queued,
        getChatsList(chatPostParams).then(resp => {
          var data = resp;
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

              // 初始化历史消息相关
              if (!this.chatHistoryData[element.id]) {
                this.chatHistoryData[element.id] = {
                  hasGet: false,
                  allGet: false
                };
              }
            });
          } else {
            this.loading = false;
          }
          const arr = data.results || [];
          resolve(arr);
        });
      });
    },
    // 获取排队的客户
    getQueuedChatList() {
      var customerParams = {
        status: 4,
        v: Math.random()
      };
      this.queuedChatData = [];
      getChatsList(customerParams).then(resp => {
        var data = resp;
        if (data.results && data.results.length) {
          data.results.forEach((ele) => {
            var eleItem = ele;
            eleItem.startChatBtnLoading = false; // 开始对话 按钮 加载中的样式

            this.queuedChatData.push(eleItem);
          });
          this.queuedChatData.length && this.openInterval();
        }
      }).catch(respon => {});
    },
    getMonitorChatList() {
      return new Promise((resolve, reject) => {
        var monitorParams = {
          status: 'Monitor',
          v: Math.random()
        };
        this.monitorChatData = [];
        getChatsList(monitorParams).then(resp => {
          var data = resp;
          if (data.results && data.results.length) {
            data.results.forEach((item, index) => {
              this.monitorChatData.push(item);

              // 初始化历史消息相关
              if (item.id && !this.chatHistoryData[item.id]) {
                this.chatHistoryData[item.id] = {
                  hasGet: false,
                  allGet: false
                };
              }
            });
          }
          const arr = data.results || [];
          resolve(arr);
        }).catch();
      });
    },
    handleChatAndMonitorList() {
      Promise.all([this.getChatsList(), this.getMonitorChatList()]).then(result => {
        result[0].forEach(element => {
          if (element.monitors && element.monitors.length) {
            this.$store.commit('chatRecord/SET_MONITORCHATIDRELATE', { monitorChatId: element.monitors[0].monitorIMChatId, chatId: element.imChatId });
          }
        });
        result[1].forEach(element => {
          if (element.monitors && element.monitors.length) {
            this.$store.commit('chatRecord/SET_MONITORCHATIDRELATE', { monitorChatId: element.monitors[0].monitorIMChatId, chatId: element.imChatId });
          }
        });
        this.isGetChatRelate = true;
        console.log(this.monitorChatIdRelate);
        if (this.hasUnreadMsg) {
          // ws先返回未读消息时，根据this.monitorChatIdRelate的关联关系，将monitorChatId和chatId两个对话的消息合并
          this.contactMonitorChatData();
        }
      }).catch((error) => {
        console.error('获取配置文件、登录信息错误', error);
      });
    },
    currentClientClick(item, i, quaueBool, setReadedBool) {
      this.loading = true;
      lastScroll = 0;
      var curItem = item;
      if (quaueBool) { // 点击排队中对话
        curItem.index = i;
        if (item.startChatBtnLoading === undefined) {
          this.$set(this.queuedChatData[i], 'startChatBtnLoading', false); // 点了开始对话按钮  加载中
        }
      } else {
        // 会话中的
        // curItem = item
      }

      this.activeChatId = curItem.id || '';
      this.chattingClient = Object.assign({}, curItem); // 当前对象 赋值

      if (!this.$root.ChatRecordData['content'][curItem.imChatId]) {
        this.$root.ChatRecordData['content'][curItem.imChatId] = {
          'unreadNum': 0,
          'list': []
        };
      }

      if (!quaueBool && !this.chatHistoryData[curItem.id].hasGet && this.hasUnreadMsg) {
        this.getHistoryRecord();
        this.chatHistoryData[curItem.id].hasGet = true;
        // this.$set(this.chattingClient,'hasGetHistoryBool',true)
        // 查询昵称
        // this.getNickName();
      } else {
        this.scrollToBottom();
        this.loading = false;
      }

      // this.currentChatData = this.chatRecordData['content'][this.chattingClient.imChatId].list;
      setReadedBool && this.readedMessage();
    },
    // 发送消息   type: 0是单聊，To的值传客户的id  ; 1是群聊 2：是已读/初始未读消息游标  3：删除，4：update
    sendMessage() {
      if (!this.$root.websock || this.$root.websock.readyState !== 1) {
        this.sendBtnloading = false;
        this.$message.error({
          message: '发送失败',
          duration: 2000
        });
        return;
      }
      if (this.chatValue.type === 'text' && !this.chatValue.content.trim()) return;
      this.sendBtnloading = true;

      var chatParams = {
        chatValue: { ...this.chatValue }
      };
      // 发送前先发送一个空内容将预览的草稿内容清掉
      this.sendTypingMessage('clear');
      if (this.currentEditMsg.type && this.currentEditMsg.type === 'edit') { // 区分 当前发送的消息  是编辑的消息还是 普通发送的消息
        chatParams['ChatId'] = this.currentEditMsg.chatItem.ChatId;
        chatParams['Type'] = 4;
        chatParams['Mid'] = this.currentEditMsg.chatItem.Mid;
        chatParams['Time'] = this.currentEditMsg.chatItem.Time;
        this.$root.websock.sendContent(chatParams);
        this.$refs.ChatEditor.uploadCancel(); // 清空处理
      } else {
        // 监控者||被监控者开启内部消息，使用monitorIMChatId
        // console.log(this.chattingClient);
        let ChatId = this.chattingClient.imChatId;
        if (this.chattingClient.monitors && this.chattingClient.monitors.length > 0 && (this.chattingClient.monitors.some(item => item.monitorAgentUserId === this.member.id) || this.isInnerMessage)) {
          ChatId = this.chattingClient.monitors[0].monitorIMChatId;
        }
        chatParams['ChatId'] = ChatId;
        chatParams['Type'] = 1;
        this.$root.websock.sendContent(chatParams);
      }

      // this.chatRecordData = this.$root.ChatRecordData;

      this.sendBtnloading = false;

      // this.$forceUpdate();
      // 清空输入框
      this.chatValue.content = '';
      delete this.chatValue.url;
      this.chatValue.type = 'text';
    },
    // 监听输入框变化发送实时消息
    sendTypingMessage(param) {
      if (!this.$root.websock || this.$root.websock.readyState !== 1) {
        return;
      }
      const chatParams = {
        chatValue: param === 'clear' ? { type: 'clear', content: '' } : this.chatValue,
        ChatId: this.chattingClient.imChatId,
        Type: 5
      };
      this.$root.websock.sendContent(chatParams);
    },
    // 发送消息的最后一条 标为已读
    readedMessage(selfSend) {
      // var len = this.chatRecordData.length-1
      var curData = this.$root.ChatRecordData['content'][this.chattingClient.imChatId];
      // 如果有未读条数 发已读消息
      if ((selfSend && selfSend === 'selfSend') || (curData && curData.unreadNum)) {
        // if (curData.list.length && curData.list[curData.list.length - 1].From != this.member.id) {

        // 设置客人聊天的消息游标
        var unreadItem = {
          ChatId: this.chattingClient.imChatId,
          Time: curData.list[curData.list.length - 1].Time,
          From: curData.list[curData.list.length - 1].From,
          Type: 2 // 0是单聊，1是群聊，2：是已/初始未读消息游标
        };
        // console.log(unreadItem);
        this.$root.websock.sendStr(unreadItem);

        if (this.chattingClient.monitors && this.chattingClient.monitors.length) {
          // 监控者与被监控者设置游标
          const unMonitorReadItem = {
            ChatId: this.chattingClient.monitors[0].monitorIMChatId,
            Time: curData.list[curData.list.length - 1].Time,
            From: curData.list[curData.list.length - 1].From,
            Type: 2 // 0是单聊，1是群聊，2：是已/初始未读消息游标
          };
          // console.log(unMonitorReadItem);
          this.$root.websock.sendStr(unMonitorReadItem);
        }
        // }
        // this.chatRecordObj = storage.get("clientChatRecord")
        // 单个对话的 未读条数
        this.$root.ChatRecordData['content'][this.chattingClient.imChatId]['unreadNum'] = 0;
        // 所有未读对话的总条数
        // this.$root.ChatRecordData["content"][this.chattingClient.imChatId]["unreadTotal"] = 0
        // for (let j in this.$root.ChatRecordData["content"][this.chattingClient.imChatId]["content"]) {
        //   this.$root.ChatRecordData["unreadTotal"] += this.$root.ChatRecordData["content"][j].unreadNum
        // }
        this.chatRecordData = this.$root.ChatRecordData;
        // 强制刷新页面
        this.$forceUpdate();
        // storage.set("clientChatRecord", this.chatRecordObj)
      }
    },
    // 队列的对话  点击开始对话按钮
    startChat(row) {
      var startParams = {
        id: row.id,
        customerId: row.customerId
      };

      this.$set(this.queuedChatData[row.index], 'startChatBtnLoading', true); // 点了开始对话按钮  加载中显示

      PickChat(startParams).then(resp => { // 修改
        if (resp.isOK) {
          console.log('点击开始对话成功');
        } else {
          this.$message.error({
            message: '开始对话失败',
            duration: 2000
          });
          this.$set(this.queuedChatData[row.index], 'startChatBtnLoading', false); // 点了开始对话按钮  加载中
        }
      }).catch((errormsg) => {});
    },
    getHistoryRecord() {
      // const period = 24 * 3600 * 90; // 查询3个月前的历史消息  秒数

      var curData = this.$root.ChatRecordData['content'][this.chattingClient.imChatId].list;
      var TimeEnd = curData.length ? Number(curData[0].Time) - 1000 : Math.floor(((new Date()).getTime() * 1000000)); // 纳秒

      // var hisParams = {
      //   Session: this.chattingClient.imChatId, // 会话ID
      //   // TimeStart: this.TimeEnd - period, // 消息开始时间  秒
      //   TimeEnd: TimeEnd, // 消息结束时间   秒
      //   Limit: 20,
      //   Reverse: true
      // };
      const chatId = this.chattingClient.imChatId + (this.chattingClient.monitors && this.chattingClient.monitors.length && this.chattingClient.monitors[0].monitorIMChatId ? ',' + this.chattingClient.monitors[0].monitorIMChatId : '');
      const getHistoryParam = {
        Chat_idIn: chatId,
        Take: 20,
        Skip: 0,
        OrderByDesc: 'time',
        // TimeBetween: Math.floor(TimeStart / 1000000000) + ',' + Math.floor(TimeEnd / 1000000000)
        '<Time': TimeEnd
      };

      getHistoryRecord(getHistoryParam).then(data => {
        if (data) {
          var historyData = JSON.parse(data);

          if (historyData.results && historyData.results.length > 0) {
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
            this.$root.ChatRecordData['content'][this.chattingClient.imChatId].list.unshift.apply(this.$root.ChatRecordData['content'][this.chattingClient.imChatId].list, historyDataArr);
            this.chatRecordData = this.$root.ChatRecordData;
            // 强制刷新页面
            this.$forceUpdate();
          } else {
            // this.chattingClient.noMoreHistoryData = true; // 判断历史消息是否全部请求完
            this.chatHistoryData[this.chattingClient.id].allGet = true; // 判断历史消息是否全部请求完
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
            this.chattingClient.hasGetHistoryBool = true;
            this.$nextTick(() => {
              osInstance.scrollStop().scroll({
                y: '100%'
              });
            });
          }
          this.loading = false;
          isLoadingMore = false;
        }, 500);
      }).catch(respon => {
        this.loading = false;
      });
    },
    saveAndCloseFn(item) {
      var chatItem = {
        id: item.id,
        status: 'End'
      };
      editChat(chatItem)
        .then(resp => {
          if (resp.isOK) {
            this.$message.success({
              message: '关闭成功',
              duration: 2000,
              showColse: true
            });
            if (chatItem.id === this.chattingClient.id) {
              this.chattingClient = Object.assign({});
              this.activeChatId = ''; // 删除的这条数是选中的，则置空
              this.rightPageBool = false;
            }
            this.getChatsList();
          } else {
            this.$message.error({
              message: '关闭失败',
              duration: 2000
            });
          }
        }).catch(errormsg => {});
    },
    getNickName() { // 所有会话昵称
      var customerParams = {
        QueryUserId: this.member.id,
        v: Math.random()
      };

      GetUserOfContacts(customerParams).then(resp => {
        var data = resp;
        if (data.results && data.results.length) {
          this.$store.dispatch('app/setNickname', data.results);
          // data.results.forEach((ele) => {
          //   if(!this.nickNameObjInfo[ele.contactId]){
          //     this.$store.dispatch('app/setNickname', ele)
          //   }
          // })
        }
      }).catch(respon => {});
    },
    getNickNameFn(from) { // 单个获取nickname
      var customerParams = {
        ContactId: from,
        take: 1,
        v: Math.random()
      };
      GetUserOfContacts(customerParams).then(resp => {
        var data = resp;
        if (data.results && data.results.length) {
          this.$store.dispatch('app/updateNickname', data.results[0]);// 取第一条
          // data.results.forEach((ele) => {
          //   if(!this.nickNameObjInfo[ele.contactId]){
          //     this.$store.dispatch('app/updateNickname', ele)
          //   }
          // })
        } else { // 没有值，默认存空数据
          const o = {
            contactId: from, name: '', nickName: ''
          };
          this.$store.dispatch('app/updateNickname', o);// 取第一条
        }
      });
    },
    chatObjFn(cfrom) {
      var cObj = null;
      this.chatRecordData['content'][cfrom] && this.chatRecordData['content'][cfrom]['list'].length && (cObj = this.chatRecordData['content'][cfrom]['list'][this.chatRecordData['content'][cfrom]['list'].length - 1]);
      return cObj;
    },
    handleCommand(command) { // 聊天窗口的右上角下拉点击
      switch (command) {
        case 'transferTo': // 转交客服
          this.dialogBoolTransfer = true;
          break;
        default:
      }
    },
    handleDropdownMsg(chatItem) { // 消息的下拉
      switch (chatItem.type) {
        case 'edit': // 编辑消息
          this.currentEditMsg = Object.assign({}, chatItem);
          if (chatItem.chatItem.CType === 1) { // 文本 链接  表情
            this.$refs.ChatEditor.setQuillTest(chatItem.chatItem.sourceContent.content);
          } else if (chatItem.chatItem.CType === 2) {
            this.$refs.ChatEditor.editImgFile(chatItem.chatItem.sourceContent);
          }
          break;
        case 'delete': // 删除消息
          this.deleteMsgFn(chatItem);
          break;
        default:
      }
    },
    dropCommand(type, chatItem) { // 点击下拉的传参处理
      return {
        'type': type,
        'chatItem': chatItem
      };
    },
    deleteMsgFn(chatItem) { // 删除消息
      this.$confirm('您确定要删除该消息吗？', this.$t('noticeMsg.info'), {
        confirmButtonText: this.$t('btns.ok'),
        cancelButtonText: this.$t('btns.cancel'),
        customClass: 'confirmClass'
      }).then(respon => {
        if (this.$root.websock.readyState === 1) {
          const chatParams = {
            ChatId: chatItem.chatItem.ChatId,
            Type: 3,
            Mid: chatItem.chatItem.Mid,
            Time: chatItem.chatItem.Time
          };
          this.$root.websock.sendStr(chatParams);
        }
      }).catch(respon => {});
    },
    closeEditMessage() {
      this.currentEditMsg = Object.assign({}); // 置空
    },
    TransferOk() {
      this.dialogBoolTransfer = false;
    },
    scrollToBottom(delay = false, duration = 0) {
      this.$nextTick(() => {
        setTimeout(() => {
          osInstance.scrollStop().scroll({
            y: '100%'
          }, duration);
        }, delay ? 300 : 0);
      });
    },
    showDefaultImage(item) {
      var img = event.srcElement;
      if (item.From === this.member.id) {
        img.src = require('@/assets/images/avatar.png');
      } else {
        item.img = true;
      }
      img.onerror = null;
      this.$forceUpdate();
    },
    openInterval() {
      const countInterval = () => {
        this.queuedChatData = this.queuedChatData.map((item) => {
          const updateTime = item.updatedOn ? new Date(item.updatedOn) : new Date();
          !item.waitCount && (item.waitCount = parseInt((new Date().getTime() - updateTime.getTime()) / 1000));
          item.waitCount++;
          return item;
        });
      };
      countInterval();
      timer = setInterval(countInterval, 1000);
    },
    closeInterval() {
      timer && (clearInterval(timer), timer = null);
    },
    deleteDraftMessage(index, chatId) {
      this.chatRecordData['content'][chatId].list.splice(index, 1);
      this.$forceUpdate();
    },
    deleteTypingInfo(index, chatId) {
      const typingItem = this.chatTypingData[chatId][index];
      var obj = Object.assign(typingItem, {
        opt: 'delete'
      });
      this.$store.dispatch('chatRecord/setTypingmsg', obj);
    },
    handleMesDropdownShow(chatItem) {
      // hover消息显示下拉操作，只能操作和客户聊天的chat，且客服只能操作自己的message
      if (this.chattingClient.imChatId === chatItem.ChatId && this.chattingClient.agentUserId === this.member.id && this.chattingClient.agentUserId === chatItem.From) {
        return true;
      }
      return false;
    },
    contactMonitorChatData() {
      if (!isChatContact) {
        isChatContact = true;
        // 获取到chatId和monitorChatId的关联关系后，将这两个数组进行合并
        for (const key in this.monitorChatIdRelate) {
          const item = this.monitorChatIdRelate[key];
          if (this.chatRecordData['content'][item] && this.chatRecordData['content'][item].list && this.chatRecordData['content'][key] && this.chatRecordData['content'][key].list) {
            // 先计算未读消息总数
            this.chatRecordData['content'][item].unreadNum = this.$root.ChatRecordData['content'][item].unreadNum + this.$root.ChatRecordData['content'][key].unreadNum;
            // 两个chatId数据合并后，对比最后一条数据的时间，只取距离当前时间最近的那条数据，再往前查询历史消息，保证数据没有遗漏
            const last1 = this.chatRecordData['content'][item].list.pop();
            const last2 = this.chatRecordData['content'][key].list.pop();
            if (last2 && last2.Time) {
              // 如果内部的chat有数据，合并到对应的chat
              const mes = !last1 || last2.Time > last1.Time ? last2 : last1;
              this.chatRecordData['content'][item].list = [mes];
            }
          }
        }
      }

      // 根据路由的客户id,点击到具体对话
      if (this.customerId) {
        for (let i = 0; i < this.chattingData.length; i++) {
          if (this.chattingData[i].customerId === this.customerId) {
            // this.chattingClient = Object.assign({}, this.chattingData[i]);
            // this.activeChatId = this.chattingClient.id || "";
            this.currentClientClick(this.chattingData[i], i);
          }
        }
        for (let i = 0; i < this.monitorChatData.length; i++) {
          if (this.monitorChatData[i].customerId === this.customerId) {
            this.currentClientClick(this.monitorChatData[i], i);
          }
        }
      }
      // 如果当前 没赋值  就默认第一条
      if (!this.chattingClient.id && this.chattingData.length) {
        this.currentClientClick(this.chattingData[0], 0);
      }
    },
    isClosedMonitorChat(imChatId) {
      // 是否已结束的监控对话
      const bool = this.closedMonitorChatIdList.some(item => item === imChatId);
      return bool;
    },
    closeCanceledMonitorChat(item, i) {
      this.monitorChatData.splice(i, 1);
      for (var k = 0; k < this.closedMonitorChatIdList.length; k++) {
        if (item.imChatId === this.closedMonitorChatIdList[k]) {
          this.closedMonitorChatIdList.splice(k, 1);
          break;
        }
      }
      if (item.id === this.chattingClient.id && this.chattingData.length) {
        this.currentClientClick(this.chattingData[0], 0);
      }
      if (item.id === this.chattingClient.id && !this.chattingData.length) {
        this.chattingClient = Object.assign({});
        this.activeChatId = ''; // 删除的这条数是选中的，则置空
      }
    },
    getInnerMessageSwitch(data) {
      this.isInnerMessage = data;
    },
    getMonitorStatue(item) {
      // 获取当前是监控者还是被监控者
      if (this.monitorChatIdRelate[item.ChatId]) {
        return this.chattingClient.agentUserId === item.From ? 'monitored' : 'monitor';
      }
      return '';
    },
    getMessageReadStatue(item) {
      // 获取当前已读、未读状态
      if (this.chattingClient.monitors && this.chattingClient.monitors.length > 0 && item.ChatId === this.chattingClient.monitors[0].monitorIMChatId) {
        return this.chatIdPosition[this.chattingClient.monitors[0].monitorIMChatId] >= item.Time;
      }
      if (item.ChatId === this.chattingClient.imChatId && this.chatIdPosition[this.chattingClient.imChatId]) {
        return this.chatIdPosition[this.chattingClient.imChatId] >= item.Time;
      } else {
        return false;
      }
    },
    cancelMonitorChat(val) {
      for (let i = 0; i < this.monitorChatData.length; i++) {
        if (this.monitorChatData[i].id === val.id) {
          this.monitorChatData.splice(i, 1);
          break;
        }
      }
      if (this.chattingData.length) {
        this.currentClientClick(this.chattingData[0], 0);
      } else {
        this.chattingClient = Object.assign({});
        this.activeChatId = ''; // 删除的这条数是选中的，则置空
      }
    },
    deleteListItem(list, key, val) {
      for (var i = 0; i < list.length; i++) {
        if (list[i][key] === val) {
          list.splice(i, 1);
          break;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
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

.chatList>>>.el-scrollbar__wrap {
  overflow-x: auto;
}

.css-v43uy2 .cancel-monitor-mask {
  position: absolute;
  z-index: 99;
  background-color: rgba($color: #000000, $alpha: 0.2);
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}
.css-1ivnzjx.closed-monitor-chat >>> .inner-message {
  background-color: #ccc;
}

.el-collapse-item__wrap .chatUl li .monitor-1vtrkp2 .closeModel {
  display: none;
}
.el-collapse-item__wrap .chatUl li .monitor-1vtrkp2.closed:hover .closeModel {
  display: flex;
}

.chat-window >>> .chat-content {
  position: relative;
  .chats-container {
    .message.monitor .text .pre-html {
      color: #000;
    }
    .message.monitored .text .pre-html {
      color: rgb(242,242,242);
    }
  }
  .scroll-bottom {
    height: 32px;
    line-height: 32px;
    border: 1px solid #409EFF;
    color: #409EFF;
    border-radius: 16px;
    padding: 0 14px;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 1px;
    left: 50%;
    cursor: pointer;
    .scroll-bottom-arrow {
      padding-top: 2px;
      margin-right: 5px;
      svg {
        font-size: 18px;
      }
    }
    .scroll-bottom-content {
      font-size: 14px;
    }
  }
  .scroll-bottom.unRead {
    border-color: rgb(247,40,98);
    color: rgb(247,40,98);
  }
}
</style>
