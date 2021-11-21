<template>
  <el-dialog title="上传图片" :visible="true" :append-to-body="true" width="40%" :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <div class="upload-preview">
      <img :src="uploadData.url">
      <div v-if="uploadImgBtn" class="uploadImgBtn">
        <el-upload
          ref="uploadEdit"
          class="image-uploader"
          list-type="picture-card"
          :action="uploadUrl"
          accept="image/*"
          :limit="2"
          :on-exceed="onexceed"
          :on-change="changeFile"
          :show-file-list="false"
          :on-success="handleImageSuccess"
          :before-upload="beforeImageUpload"
          :auto-upload="false"
          :file-list="fileList"
        >
          <a class="ql-img" title="编辑图片">
            <i class="el-icon-edit" />
          </a>
        </el-upload>
      </div>
    </div>
    <el-row type="flex" class="row-bg upload-preview-text">
      <el-col :span="2">
        <div class="grid-content toolContainer">
          <el-popover v-model="emojiPopVisible" placement="top" width="290">
            <emoji-picker :emoji-data="emojiData" @pickEmoji="pickEmoji" />
            <a slot="reference" class="ql-face" title="表情">
              <svg-icon icon-class="face" />
            </a>
          </el-popover>
        </div>
      </el-col>
      <el-col :span="22">
        <div class="grid-content">
          <chat-editor-input ref="imgTextQuillEditor" :options="editorOptions" @change="onEditorChange" @keyEnter="saveAndClose" />
          <!-- <div id="imageTextEditorss" class="imageTextEditor" /> -->
        </div>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">{{ $t('btns.cancel') }}</el-button>
      <el-button type="success" @click="saveAndClose">{{ $t('btns.ok') }}</el-button>
    </div>
  </el-dialog>

</template>

<script>
import ChatEditorInput from './editor';
import emojiPicker from './emojiWrap';
import emojiJson from './emoji/emoji.json';
  var matchIndex = 0; var emojiRegex = new RegExp(':[a-z_0-9]+:', 'g');

export default {
  name: 'UploadConfirm',
  components: {
    emojiPicker,
    ChatEditorInput
  },
  props: {
    uploadData: {
      type: Object,
      required: false,
      default: null
    },
    sync: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      emojiPopVisible: false,
      editor: null, // 富文本编辑器对象
      imgContent: '', // 富文本编辑器默认内容
      emojiData: {
        text: ''
      },
     editorOptions: {
        inputEditorOption: { },
        wordsSize: 500,
        containerId: 'imgTextEditorInput',
        pasteImage: false
      },
      uploadImgBtn: false,
      uploadUrl: this.$store.state.app.WEB_CONFIG.VUE_APP_IMAGE_API + '/upload?width=192&md5=true',
      fileList: []
    };
  },
  created() {

  },
  mounted() {

  },
  methods: {
    onEditorChange(contentStr) {
      this.imgContent = contentStr;
      this.$emit('update', contentStr);
    },
    saveAndClose() {
      if (this.uploadImgBtn) { // 编辑的情况
        if (this.$refs.uploadEdit.uploadFiles.length) {
          this.$refs.uploadEdit.submit();
        } else {
          const params = { url: this.uploadData.url };
          this.handleImageSuccess(params);
        }
      } else {
        this.$emit('save', this.imgContent);
      }
    },
    handleClose(done) {
      this.$emit('close', false);
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     done()
      //   })
      //   .catch(_ => {})
    },
    pickEmoji(emoji) {
      this.emojiPopVisible = false;
      const emojiObj = emojiJson[emoji.text];
      this.$refs.imgTextQuillEditor.enterFaceInfo(emojiObj);
    },
    setQuillTest(text = '') { // 从编辑消息进来
      this.uploadImgBtn = true;
      this.imgContent = text; // 去除回车符
      matchIndex = 0;
      if (emojiRegex.test(text)) {
        text.replace(emojiRegex, (match, offset) => {
          if (offset > matchIndex) {
            this.$refs.imgTextQuillEditor.appendContent(text.substring(matchIndex, offset));
          }
          const emojiObj = emojiJson[match];
          emojiObj && this.$refs.imgTextQuillEditor.enterFaceInfo(emojiObj);
          matchIndex = match.length + offset;
        });
      }

      (matchIndex < text.length) && (this.$refs.imgTextQuillEditor.appendContent(text.substring(matchIndex, text.length)));
    },
    pasteImage(file) {
      this.$refs.uploadEdit.handleStart(file);
    },
    handleImageSuccess(resp, file) { // 编辑的上传图片成后
      if (resp.url) {
        // editsave
        var editParams = {
          url: resp.url,
          imgContent: this.imgContent
        };
        this.$emit('editsave', editParams);
        this.$refs.uploadEdit.clearFiles();
        this.$refs.imgTextQuillEditor.clearContent();
      }
    },
    beforeImageUpload(file) {
      // 可做文件大小判断之类的
    },
    changeFile(file, fileList) {
      this.uploadData = Object.assign({}, file);
      this.fileList = fileList;
      this.fileList.length === 2 && (this.fileList.splice(0, 1));
    },
    onexceed(file, fileList) {
      // 文件数超过 limit
    }
  }
};
</script>

<style lang="scss">
.upload-preview {
  position: relative;
  border: 1px dashed #ccc;
  padding: 30px 20px;
  text-align: center;

  img {
    max-width: 100%;
    max-height: 200px;
  }
}

.upload-preview-text {
  margin-top: 20px;
  border: 1px solid #ccc;

  .toolContainer {
    padding-top: 5px;
    text-align: center;
    a{
      svg{
        width:18px;
        height:18px;
      }
    }
  }

  .ql-container.ql-snow {
    height: 50px;
    border: none;
    border-left: 1px solid #ccc;
  }
}
.uploadImgBtn{
  position: absolute;
  top:8px;
  right: 8px;
  width: 28px;
  height: 28px;
  text-align: center;
  line-height: 28px;
  border-radius: 50%;
  background: rgba(0,0,0,.4);
}
.ql-img {
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
}
.ql-img i{
  line-height: 28px;
  font-size: 20px;
  color: #fff;
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
</style>
