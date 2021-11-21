<template>
  <div>
    <!-- 弹出层-裁剪 -->
    <el-dialog class="dialog-wrapper" :title="$t('user.uploadPortrait')" :visible="true" :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false" :append-to-body="true">
      <el-row>
        <input
          id="uploads"
          ref="filElem"
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          class="el-button hide"
          style="margin-bottom:15px;display:none;"
          @change="uploadImg($event,1)"
        >
      </el-row>
      <el-row>
        <el-col :sm="24" :xs="24">
          <!-- 裁剪 -->
          <vue-cropper
            ref="cropper"
            :img="attach.customaryUrl"
            :auto-crop="options.autoCrop"
            :fixed-box="options.fixedBox"
            :can-move-box="options.canMoveBox"
            :auto-crop-width="options.autoCropWidth"
            :auto-crop-height="options.autoCropHeight"
            :center-box="options.centerBox"
            @realTime="realTime"
          />
        </el-col>
        <!-- <el-col :sm="10" :xs="24">
          <h2 align="center" class=" mar-left-50">头像预览</h2>
          <div class="show-preview">
            <div :style="previews.div" class="preview">
              <img :src="previews.url" :style="previews.img" width="100%" />
            </div>
          </div>
        </el-col> -->
      </el-row>
      <el-row class="footerBtn" align="center">
        <el-button @click="clickUpload">{{ $t('user.selectImage') }}</el-button>
        <el-button type="primary" @click="confirm('blob')">{{ $t('user.cropper') }}</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper';
import { imageUpload } from '@/api/urm';
// 数据库里需要存两份图片地址，一张为原图地址，一张为裁剪后的头像地址
export default {
  name: 'Cropper',
  components: {
    VueCropper
  },
  data() {
    return {
      options: {
        autoCrop: true, // 默认生成截图框
        fixedBox: true, // 固定截图框大小
        canMoveBox: false, // 截图框不能拖动
        centerBox: false, // 截图框被限制在图片里面
        canScale: true, // 是否允许滚轮缩放
        autoCropWidth: 200, // 截图框宽度
        autoCropHeight: 200 // 截图框高度
      },
      previews: {}, // 实时预览图数据
      attach: {
        // 后端附件表
        id: '',
        userId: '',
        customaryUrl: '', // 原图片路径
        laterUrl: '', // 裁剪后图片路径  /static/logo.png
        attachType: 'photo' // 附件类型
      },
      file: {
        name: ''
      },
      dialogBtnLoading: false
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.clickUpload();
    });
  },
  methods: {
    // 控制弹出层关闭
    handleClose() {
      this.$emit('imageCropperDialogSave', null);
    },
    // 实时预览
    realTime(data) {
      this.previews = data;
    },
    // 点击图片调取input
    clickUpload() {
      this.$refs.filElem.dispatchEvent(new MouseEvent('click'));
    },
    // 选择本地图片
    uploadImg(e, num) {
      var file = e.target.files[0];
      // if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
      //   this.$message.error("图片类型必须是.gif,jpeg,jpg,png,bmp中的一种");
      //   return false;
      // }
      if (file.size > 1024 * 1024) {
        this.$message({ type: 'warning', message: this.$t('noticeMsg.moreThan1MReSelect') });
        return false;
      }
      if (file.type.indexOf('jpeg') === -1 && file.type.indexOf('png') === -1) {
        // this.$nextTick 解决$message显示重叠问题
        this.$nextTick(() => {
          this.$message({ type: 'warning', message: this.$t('noticeMsg.jpgOrPngReSelect') });
        });
        return false;
      }
      // fileReader 接口，用于异步读取文件数据
      // console.log(file);
      this.file.name = file.name;
      var reader = new FileReader();
      reader.readAsDataURL(file); // 重要 以dataURL形式读取文件
      reader.onload = e => {
        // data = window.URL.createObjectURL(new Blob([e.target.result])) 转化为blob格式
        const data = e.target.result;
        this.attach.customaryUrl = data;
        // 转化为base64
        // reader.readAsDataURL(file)
        // 转化为blob
      };
    },
    // 确认截图,上传
    confirm(type) {
      this.$refs.cropper.getCropData(res => {
        // console.log(res)//这里截图后的url 是base64格式 让后台转下就可以
        const img = new Image();
        img.src = res;
        img.onload = async() => {
          // res为base64，需要转成二进制再传给后台
          const blob = this.dataURItoBlob(res);
          const formData = new FormData();
          formData.append('file', blob, this.file.name); // 有的后台需要传文件名，不然会报错
          // console.log(formData);
          this.dialogBtnLoading = true;
          imageUpload(formData).then(data => {
            this.$emit('imageCropperDialogSave', data);
          });
        };
      });
    },
    // base64转成bolb对象
    dataURItoBlob(base64Data) {
      let byteString;
      if (base64Data.split(',')[0].indexOf('base64') >= 0) { byteString = atob(base64Data.split(',')[1]) } else { byteString = unescape(base64Data.split(',')[1]) }
      const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
      const ia = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ia], { type: mimeString });
    }
  }
};
</script>
<style scoped lang="scss">
.dialog-wrapper {
  >>> .el-dialog {
    width: 500px !important;
    height: auto;
    .show-preview {
      display: flex;
      justify-content: center;
    }
    .vue-cropper {
      width: 400px;
      height: 400px;
      margin: 0 auto;
    }
    .preview {
      border-radius: 50%;
      overflow: hidden;
      border: 1px solid #cccccc;
      background: #cccccc;
      width: 200px !important;
      height: 200px !important;
    }
    .upload-img{
      margin-bottom: 5px;
      margin-left: 0 !important;
    }
    .footerBtn {
      display: flex;
      justify-content: center;
      margin-top: 15px;
    }
  }
}
@media screen and (max-width: 767px) {
  .dialog-wrapper {
    >>> .el-dialog {
      width: 90% !important;
    }
  }
}
@media screen and (max-width: 500px) {
  .dialog-wrapper {
    >>> .el-dialog {
      .el-dialog__body {
        padding: 15px 0px;
      }
      .vue-cropper {
        width: 280px;
        height: 280px;
      }
    }
  }
}

</style>
