<template>
  <div v-clickoutside="closeQuickWord" class="chatEditorContainer">
    <QuickWords ref="quickWordsComponet" :is-show="isShowPopover" :word-contains="wordFilter" @enterContent="enterQuickWord" @editorFocus="editorFocus" />
    <div :id="options.containerId" v-popover:quickWordPopover class="chatEditor" />
  </div>
</template>

<script>
import Quill from 'quill';
import QuickWords from './quickWords';
import 'quill/dist/quill.snow.css';
import Clickoutside from 'element-ui/src/utils/clickoutside';
const Delta = Quill.import('delta');
export default {
  name: 'ChatEditorInput',
  components: {
    QuickWords
  },
  directives: {
    Clickoutside
  },
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          inputEditorOption: {},
          wordsSize: 500,
          containerId: ''
        };
      }
    }
  },
  data() {
    return {
      keys: {
        TAB: 9,
        ENTER: 13,
        ESC: 27,
        ARROW_LEFT: 37,
        ARROW_UP: 38,
        ARROW_RIGHT: 39,
        ARROW_DOWN: 40,
        CNAT: 229,
        ENAT: 50
      },
      editor: null,
      chatContent: '',
      chatEditorOptions: {
        modules: {
          toolbar: false,
          keyboard: {
            bindings: this.bindings
          }
          // toolbar: "#chatToolbar" // Selector for toolbar container
        },
        theme: 'snow',
        placeholder: '请输入',
        scrollingContainer: '.ql-container',
        syntax: true,
        pasteImage: this.options.pasteImage,
        vueThis: this
      },
      isShowPopover: false,
      wordFilter: ''
    };
  },
  created() {
    this.bindings = {
      tab: {
        key: this.keys['TAB'],
        handler: function() {}
      },
      ctrlEnter: {
        key: this.keys['ENTER'],
        ctrlKey: true,
        handler: (range, context) => {
          this.appendContent('\n', true);
        }
      },
      shiftEnter: {
        key: this.keys['ENTER'],
        shiftKey: true,
        handler: function(range, context) {

        }
      },
      Enter: {
        key: this.keys['ENTER'],
        ctrlKey: false,
        shiftKey: false,
        handler: () => {
          return this.keyEnterFn();
        }
      },
      esc: {
        key: this.keys['ESC'],
        handler: () => {
          this.isShowPopover && this.closeQuickWord();
        }
      },
      arrowUp: {
        key: this.keys['ARROW_UP'],
        handler: () => {
          return this.editorArrawMove('up');
        }
      },
      arrowDown: {
        key: this.keys['ARROW_DOWN'],
        handler: () => {
          return this.editorArrawMove('down');
        }
      },
      arrowLeft: {
        key: this.keys['ARROW_LEFT'],
        handler: () => {
          return this.editorArrawMove('left');
        }
      },
      arrowRight: {
        key: this.keys['ARROW_RIGHT'],
        handler: () => {
          return this.editorArrawMove('right');
        }
      }
    };
  },
  mounted() {
    this.chatEditorOptions.modules.keyboard.bindings = this.bindings;
    const containerId = this.options.containerId;
    // setTimeout(function() {
    this.editor = new Quill('#' + containerId, this.chatEditorOptions);
    this.editor.on('text-change', (delta, oldDelta, source) => {
      this.onEditorChange(delta);
    });
    this.editor.on('selection-change', (range, oldRange, source) => {
      if (range) {
        var curLeaf = this.editor.getLeaf(range.index);
        var curChar = curLeaf[0].text ? curLeaf[0].text.substring(curLeaf[1] - 1, curLeaf[1]) : curLeaf[0];
        this.quickwordOpt(curChar);
      } else {
        // console.log('Cursor not in the editor');
      }
    });
    // }, 10)
    this.$root.eventHub.$on('EditorQuillBlur', (data) => {
      this.editor.blur();
    });
  },
  beforeDestroy() {
    this.editor = null;
    delete this.editor;
    this.$root.eventHub.$off('EditorQuillBlur');
  },
  methods: {
    // 准备富文本编辑器
    onEditorReady(editor) {},
    // 富文本编辑器 失去焦点事件
    onEditorBlur(editor) {},
    // 富文本编辑器 获得焦点事件
    onEditorFocus(editor) {},
    editorFocus() {
      this.editor.focus();
    },
    // 富文本编辑器 内容改变事件
    onEditorChange(delta) {
      this.curWordSize = this.editor.getLength();
      if (this.editor.getLength() > parseInt(this.options.wordsSize)) {
        this.editor.deleteText(parseInt(this.options.wordsSize), 1, this.editor.getContents());
      }

      // //console.log('text-change')
      this.editor.focus();
      var range = this.editor.getSelection(true) ? this.editor.getSelection(true) : {
        index: 0
      };
      var curEnter;
      var curLeaf = this.editor.getLeaf(range.index);
      var curOps = delta.ops.length > 1 ? delta.ops[1] : delta.ops[0];
      if (curOps.hasOwnProperty('delete')) {
        curEnter = curLeaf[0].text ? curLeaf[0].text.substring(curLeaf[1] - 1, curLeaf[1]) : curLeaf[0];
      } else {
        curEnter = curOps.insert;
      }

      this.quickwordOpt(curEnter);
      this.updateModel();
    },
    updateModel() {
      const value = this.editor.getContents();
      let modelStr = '';
      if (this.editor.getLength() > parseInt(this.options.wordsSize)) {
        this.editor.deleteText(parseInt(this.options.wordsSize), 1);
      }
      value.ops.forEach(item => {
        if (typeof item.insert === 'string') {
          modelStr += item.insert;
        } else if (item.insert.hasOwnProperty('face')) {
          modelStr += item.insert.face.alt;
        }
      });
      this.$emit('change', modelStr);
    },
    quickwordOpt(curEnter) {
      var range = this.editor.getSelection(true) ? this.editor.getSelection(true) : {
        index: 0
      };
      // //console.log(range)
      var curLeaf = this.editor.getLeaf(range.index);

      var curChar;
      if (typeof curEnter !== 'string') { // 插入了表情
        // scope.curAtIndex = -1;
        this.wordFilter = '';
        // 关闭快捷回复框
        this.isShowPopover && this.closeQuickWord();
      } else {
        if (curEnter.length > 1) {
          curChar = curEnter.substring(curEnter.length - 1); // 取最后一个字符
        } else {
          curChar = curEnter;
        }
        // //console.log(curLeaf[0].text)
        if (curChar === ' ') {
          // //console.log('终止#操作')
          this.wordFilter = '';
          this.isShowPopover && this.closeQuickWord();
        } else {
          var curLeafText = curLeaf[0].text;
          var curLeafRangeIndex = curLeaf[1];
          var pointStr = curLeafText ? curLeafText.substring(0, curLeafRangeIndex) : '';
          if (pointStr.lastIndexOf('#') !== -1) {
            if (pointStr.lastIndexOf(' ') < pointStr.lastIndexOf('#')) { // 执行@操作
              // //console.log('进行at操作');
              this.wordFilter = pointStr.substring(pointStr.lastIndexOf('#') + 1);
              !this.isShowPopover && this.openQuickWord();
            }
          } else {
            // //console.log('不包含at操作')
            this.wordFilter = '';
            this.isShowPopover && this.closeQuickWord();
          }
        }
      }
    },
    enterFaceInfo(faceObj) {
      var range = this.editor.getSelection(true);
      if (this.editor.getLength() < parseInt(this.options.wordsSize) + 1) {
        this.editor.insertEmbed(
          range.index,
          'face', {
            alt: faceObj.text,
            url: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
            class: 'content-emoji ' + faceObj.type + '_face ' + faceObj.class,
            style: ''
          },
          Quill.sources.USER
        );
        this.editor.setSelection(range.index + 1, Quill.sources.SILENT);
      }
    },
    appendContent(text, indexCurrent) { // indexCurrent表示光标是否定位到末尾
      var range = this.editor.getSelection(true);
      this.editor.insertText(range.index, text);
      this.editor.setSelection(indexCurrent ? range.index + 1 : this.editor.getLength() + 1, Quill.sources.SILENT);
    },
    clearContent(text) {
      this.editor.setContents('');
    },
    pasteImage(file) {
      this.$emit('pasteImage', file);
    },

    openQuickWord() {
      // console.log('open');
      this.isShowPopover = true;
      this.$refs.quickWordsComponet.openPopover();
    },
    closeQuickWord(e) {
      // console.log('close');
      this.isShowPopover = false;
      this.$refs.quickWordsComponet.closePopover();
    },
    clickHashKey() {
      this.appendContent('#', true);
    },
    enterQuickWord(content) {
      let retainLength = 0;
      let delLength = 0;
      var range = this.editor.getSelection(true);
      retainLength = range.index - this.wordFilter.length - 1;
      delLength = this.wordFilter.length + 1;
      this.editor.updateContents(new Delta()
        .retain(retainLength) // 保留#之前的内容
        .delete(delLength) // 删掉#输入的
        .insert(content)
      );
      this.isShowPopover && this.closeQuickWord();
    },
    editorArrawMove(direction) {
      if (this.isShowPopover) { // 打开
        this.$refs.quickWordsComponet.handleItemKey(direction);
      } else {
        return true;
      }
    },
    keyEnterFn() {
      if (this.isShowPopover) {
        this.$refs.quickWordsComponet.handleItemEnter();
      } else {
        this.$emit('keyEnter');
      }
    }
  }
};

function registerQuillModule(Quill) {
  // 引入源码中的BlockEmbed
  const Embed = Quill.import('blots/embed'); // 定义新的blot类型
  class FaceBlot extends Embed {
    static create(value) {
      const node = super.create(value);
      node.setAttribute('alt', value.alt);
      node.setAttribute('src', value.url);
      node.setAttribute('class', value.class);
      return node;
    } // 返回节点自身的value值 用于撤销操作
    static value(node) {
      return {
        alt: node.getAttribute('alt'),
        url: node.getAttribute('src'),
        class: node.getAttribute('class')
      };
    }
  } // blotName
  FaceBlot.blotName = 'face';
  FaceBlot.tagName = 'img';
  Quill.register(FaceBlot, true);

  const Clipboard = Quill.import('modules/clipboard');
  const Delta = Quill.import('delta');

  class PlainClipboard extends Clipboard {
    onPaste(event) {
      let text = null;
      let blob = null;
      if (event.clipboardData || event.originalEvent) {
        // not for ie11某些chrome版本使用的是event.originalEvent
        var clipboardData = (event.clipboardData || event.originalEvent.clipboardData);
        if (clipboardData && clipboardData.items) {
          // for chrome firefox会进入这里
          const items = clipboardData.items;
          const len = items.length;
          // 阻止默认行为即不让剪贴板内容在div中显示出来
          event.preventDefault();
          // 在items里找粘贴的image,据上面分析,需要循环
          for (var i = 0; i < len; i++) {
            if (items[i].type.indexOf('image') !== -1) {
              // getAsFile() 此方法只是living standard firefox ie11 并不支持
              blob = items[i].getAsFile();
            }
          }
          if (blob !== null) {
            if (this.quill.options.pasteImage) {
              this.quill.options.vueThis.pasteImage(blob);
            }
          } else {
            text = (event.originalEvent || event).clipboardData.getData('text/plain');
            if (this.quill.getLength() < (parseInt(this.quill.options.vueThis.options.wordsSize) + 1)) {
              text = text.substr(0, (parseInt(this.quill.options.vueThis.options.wordsSize) + 1) - this.quill.getLength());
              var range = this.quill.getSelection(true);
              this.quill.updateContents(new Delta()
                .retain(range.index)
                .insert(text, Quill.sources.USER)
              );
              this.quill.setSelection(range.index + text.length);
              this.quill.scrollIntoView();
            }
          }
        } else {
          // ie11 会进入这里 event.originalEvent有值
          event.preventDefault();
          if (window.clipboardData) {
            if (window.clipboardData.files.length > 0) {
              if (this.quill.options.pasteImage) {
                this.quill.options.vueThis.pasteImage(window.clipboardData.files[0]);
              }
            } else {
              text = window.clipboardData.getData('Text');
              if (this.quill.getLength() < (parseInt(this.quill.options.vueThis.options.wordsSize) + 1)) {
                text = text.substr(0, (parseInt(this.quill.options.vueThis.options.wordsSize) + 1) - this.quill.getLength());
                var range2 = this.quill.getSelection(true);
                this.quill.updateContents(new Delta()
                  .retain(range.index)
                  .insert(text, Quill.sources.USER)
                );
                this.quill.setSelection(range2.index + text.length);
                this.quill.scrollIntoView();
              }
            }
          }
        }
      } else {
        // for ie11
        // console.log('ie')
        // console.log(window.clipboardData)
      }
    }
  }
  Quill.register('modules/clipboard', PlainClipboard, true);
}
registerQuillModule(Quill);
</script>

<style lang="scss" scoped>
.chatEditor .ql-container.ql-snow {
  height: 50px;
  border: none;
}

.chatEditorContainer {
  position: relative;

}
</style>
