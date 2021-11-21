<template>
  <div class="css-trrz19" :class="{'inner-message': (isInnerMessage || currentIsMonitor) && chattingClient && chattingClient.monitors && chattingClient.monitors.length }">
    <div class="chatEditor">
      <div v-if="editMsgInfoBool" class="editMsgInfo">
        <span class="penicon"><i class="el-icon-edit" /></span>
        <div class="msgCon">
          <span class="tit">编辑消息</span>
          <span class="ellipsis" v-html="editMsgtext" />
        </div>
        <span class="penicon closeicon" @click="uploadCancel"><i class="el-icon-close" /></span>
      </div>
      <chat-editor-input ref="chatQuillEditor" :options="editorOptions" @change="onEditorChange" @pasteImage="pasteImage" @keyEnter="sendMessage" />
      <el-row :gutter="20">
        <el-col :span="20">
          <div id="chatToolbar" class="css-u4p24i">
            <ul class="chatToolbar clearfix">
              <li v-if="chattingClient && chattingClient.monitors && chattingClient.monitors.length && !currentIsMonitor" class="toolItem message-switch no-boder">
                <el-switch v-model="isInnerMessage" active-color="#409eff" inactive-color="#aaa" @change="changeSwitch" />
                <span class="message-switch-tips">{{ isInnerMessage ? '内部消息已打开' : '内部消息已关闭' }}</span>
              </li>

              <li class="toolItem">
                <el-upload
                  ref="upload"
                  class="image-uploader"
                  list-type="picture-card"
                  :action="uploadUrl"
                  accept="image/*"
                  :limit="1"
                  :on-exceed="onexceed"
                  :on-change="changeFile"
                  :show-file-list="false"
                  :on-success="handleImageSuccess"
                  :before-upload="beforeImageUpload"
                  :auto-upload="false"
                  :file-list="fileList"
                  :disabled="editMsgInfoBool"
                >
                  <a class="ql-img" title="图片">
                    <svg-icon icon-class="img" />
                  </a>
                </el-upload>
              </li>
              <li class="toolItem">
                <el-popover v-model="emojiPopVisible" placement="top" width="290">
                  <emoji-picker :emoji-data="emojiData" @pickEmoji="pickEmoji" />
                  <a slot="reference" class="ql-face" title="表情">
                    <svg-icon icon-class="face" />
                  </a>
                  <!-- <el-button slot="reference">
                    <svg-icon icon-class="face" />
                  </el-button> -->
                </el-popover>
              </li>
              <li class="toolItem" @click.prevent="enterQuickWord">
                <a>#</a>
              </li>
              <li v-if="chattingClient.monitors && chattingClient.monitors.length && currentIsMonitor" class="toolItem cancel-monitor no-boder">
                <a @click="cancelMonitorChat">取消监控</a>
              </li>
            </ul>

          </div>
        </el-col>
        <el-col :span="4">
          <div class="clearfix">
            <el-button type="primary" size="medium" style="float:right;" :loading="sendBtnloading" @click="sendMessage">发送</el-button>
          </div>
        </el-col>
      </el-row>
      <upload-confirm
        v-if="openUploadDialog"
        ref="uploadImage"
        :upload-data="uploadData"
        @save="uploadAndSend"
        @editsave="edituploadAndSend"
        @close="uploadCancel"
        @update="onEditorChange"
      />
    </div>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex';
import {
  monitorChatAdd,
  monitorChatEdit
} from '@/api/customers';
import ChatEditorInput from './chatEditor/editor';
import emojiPicker from './chatEditor/emojiWrap';
import emojiJson from './chatEditor/emoji/emoji.json';
import uploadConfirm from './chatEditor/uploadDialog';

var matchIndex = 0;
var emojiRegex = new RegExp(':[a-z_0-9]+:', 'g');

export default {
  name: 'ChatEditor',
  components: {
    emojiPicker,
    uploadConfirm,
    ChatEditorInput
  },
  props: {
    chatContent: {
      type: Object,
      default: () => {
        return {
          content: ''
        };
      }

    },
    chattingClient: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      emojiPopVisible: false,
      dialogVisible: false,
      sendBtnloading: false,
      openUploadDialog: false,
      uploadUrl: this.$store.state.app.WEB_CONFIG.VUE_APP_IMAGE_API + '/upload?width=192&md5=true',
      uploadData: {},
      fileList: [],
      editorOptions: {
        inputEditorOption: {},
        wordsSize: 500,
        containerId: 'chatEditorInput',
        pasteImage: true
      },
      emojiData: {
        text: ''
      },
      editMsgtext: '',
      editMsgInfoBool: false, // 显示隐藏编辑消息框
      sendTypingMsgTimeout: null,
      lastSendTypingMsgTime: null,
      isInnerMessage: false,
      monitorParams: {
        addMonitorChatLoading: false
      }
    };
  },
  computed: {
    ...mapGetters([
      'member'
    ]),
    currentIsMonitor() {
      if (!this.chattingClient.monitors || this.chattingClient.monitors.length === 0) {
        return false;
      }
      return this.chattingClient.monitors.some(item => item.monitorAgentUserId === this.member.id);
    }
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  methods: {
    onEditorChange(contentStr, type) {
      // this.chatContent.content = contentStr
      this.$set(this.chatContent, 'content', contentStr);
      const contentType = type || 'text';
      this.$set(this.chatContent, 'type', contentType);
      if (!this.sendTypingMsgTimeout) {
        this.sendTypingMsgTimeout = setTimeout(() => {
          this.$emit('send-typing-message');
          clearTimeout(this.sendTypingMsgTimeout);
          this.sendTypingMsgTimeout = null;
        }, 2000);
      }
    },
    setQuillTest(text = '') {
      matchIndex = 0;
      text = text.replace(/(\r|\n)$/, '');
      this.editMsgInfoBool = true;
      this.editMsgtext = this.pasreEmoji(text);
      if (emojiRegex.test(text)) {
        text.replace(emojiRegex, (match, offset) => {
          if (offset > matchIndex) {
            this.$refs.chatQuillEditor.appendContent(text.substring(matchIndex, offset));
          }
          const emojiObj = emojiJson[match];
          emojiObj && this.$refs.chatQuillEditor.enterFaceInfo(emojiObj);
          matchIndex = match.length + offset;
        });
      }

      (matchIndex < text.length) && (this.$refs.chatQuillEditor.appendContent(text.substring(matchIndex, text.length)));
    },
    pasreEmoji(messageText) {
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
    },
    pickEmoji(emoji) {
      this.emojiPopVisible = false;
      const emojiObj = emojiJson[emoji.text];
      this.$refs.chatQuillEditor.enterFaceInfo(emojiObj);
    },
    sendMessage() {
      this.$emit('send-message');
      this.$refs.chatQuillEditor.clearContent();
      this.chatContent.type = 'text'; // 类型重置为默认
    },
    sendTypingMessage() {

    },
    pasteImage(file) {
      this.$refs.upload.handleStart(file);
    },
    handleImageSuccess(resp, file) {
      this.$refs.upload.clearFiles();
      this.$refs.chatQuillEditor.clearContent();
      if (resp.url) {
        this.chatContent.type = 'img';
        this.chatContent.url = resp.url;
        this.sendMessage();
      }
    },
    beforeImageUpload(file) {
      // 可做文件大小判断之类的
    },
    changeFile(file, fileList) {
      if (file.status === 'ready') {
        this.openUploadDialog = true;
      } else {
        this.openUploadDialog = false;
      }
      this.uploadData = file;
    },
    onexceed(file, fileList) {
      // 文件数超过 limit
    },
    uploadAndSend(data) {
      this.chatContent.content = data;
      this.openUploadDialog = false;
      this.$refs.upload.submit();
    },
    uploadCancel() {
      this.$refs.upload.clearFiles();
      this.$refs.chatQuillEditor.clearContent();
      this.openUploadDialog = false;
      this.editMsgInfoBool = false;
      this.$emit('close-edit-message');
      this.chatContent.type = 'text'; // 类型重置为默认
    },
    // closeEditMsg(){   //关闭编辑消息框
    //   this.editMsgInfoBool = false;
    //   console.log(this.editMsgInfoBool)
    //   this.$emit('close-edit-message')
    //   this.$refs.chatQuillEditor.clearContent()
    //    this.chatContent.type = 'text' // 类型重置为默认
    // },
    editImgFile(imgfile) { // 编辑消息
      this.openUploadDialog = true;
      this.uploadData = {
        url: imgfile.url
      };
      this.$set(this.chatContent, 'type', imgfile.type);
      this.$set(this.chatContent, 'url', imgfile.url);
      this.$set(this.chatContent, 'content', imgfile.content);
      this.$nextTick(() => {
        this.$refs.uploadImage.setQuillTest(imgfile.content); // 设置表情的内容表情
      });
    },
    edituploadAndSend(data) { // 编辑图片的情况
      this.chatContent.type = 'img';
      this.chatContent.url = data.url;
      this.chatContent.content = data.imgContent;
      this.openUploadDialog = false;
      this.sendMessage();
    },
    changeSwitch() {
      this.$emit('get-innermessage-switch', this.isInnerMessage);
    },
    addMonitorChat() {
      this.monitorParams.addMonitorChatLoading = true;
      monitorChatAdd({
        CustomerId: this.chattingClient.customerId
      }).then((data) => {
        this.monitorParams.addMonitorChatLoading = false;
      });
    },
    cancelMonitorChat() {
      this.$emit('cancel-monitor-chat', this.chattingClient);
      monitorChatEdit({
        CustomerId: this.chattingClient.customerId
      }).then();
    },
    enterQuickWord() {
      this.$refs.chatQuillEditor.clickHashKey();
    }
  }
};
</script>

<style lang="scss" scoped>
.editMsgInfo {
  display: flex;
}

.editMsgInfo .penicon {
  display: flex;
  width: 32px;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  color: #419FD9;
}

.editMsgInfo .msgCon {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
  overflow: hidden;
  font-size: 13px;
  padding: 0 10px
}

.editMsgInfo .msgCon .tit {
  color: #419FD9;
  font-weight: bold;
}

.editMsgInfo .closeicon {
  cursor: pointer;
  color: #606266;
}

.chatToolbar {
  border: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  height: 36px;
  padding: 4px 0;
  display: flex;

  &>li {
    width: 28px;
    height: 28px;
    text-align: center;
    border: 1px solid transparent;
    border-radius: 2px;

    &.message-switch {
      width: 146px;
      line-height: 22px;

      .message-switch-tips {
        display: inline-block;
        vertical-align: middle;
        font-size: 14px;
      }
    }

    &.cancel-monitor {
      width: 60px;
      line-height: 20px;
      font-size: 14px;
      text-decoration: underline;
    }

    &.no-boder:hover {
      border-color: transparent;
    }

    &:hover {
      border: 1px solid #ccc;
    }

    svg {
      width: 18px;
      height: 18px;
    }
    a{
      display: block;
      width:100%;
      height:100%;
      line-height:28px;
    }
    .ql-face{
      display: block;
      padding-top:1px;
    }
  }
}

.ql-img {
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
  padding-top: 2px;
}

.chat-fileupload {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
  opacity: 0;
}

.image-uploader .el-upload--picture-card {
  background-color: transparent;
  border: none;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 28px;
  height: 28px;
  line-height: 28px;
  vertical-align: top;
}

.inner-message {
  background-color: #687179;
  border-radius: 4px;

  .chatToolbar {
    li {
      color: #fff;
    }
  }

  >>>.ql-editor p {
    color: #fff;
  }

  >>>.ql-editor.ql-blank::before {
    color: #fff;
  }
}

.add-monitor {
  padding: 20px 0;
  text-align: center;

  button {
    padding: 10px 40px;
  }
}
</style>
