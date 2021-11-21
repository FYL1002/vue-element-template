<template>
  <el-dialog
    :title="isEdit?$t('settings.editGroup'):$t('settings.addGroup')"
    :visible="true"
    :close-on-click-modal="false"
    @close="close"
  >
    <el-form ref="dialogForm" :model="dialogData" label-width="85px" :rules="rules">
      <el-form-item :label="'分组名'" prop="name">
        <el-input v-model="dialogData.name" />
        <span class="name-item-des">请输入15字符以内</span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">{{ $t('btns.cancel') }}</el-button>
      <el-button
        type="success"
        :loading="dialogBtnLoading"
        @click="save('dialogForm')"
      >{{ $t('btns.ok') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {
    addFastWordGroup, editFastWordGroup
  } from '@/api/setting';
  import { copy } from '@/utils/common';
  export default {
    name: 'AddQuickReplyGroup',
    props: {
      sync: {
        type: Boolean,
        default: false
      },
      dialogFormData: {
        type: Object,
        required: false,
        default: null
      }
    },
    data() {
      return {
        dialogData: {
          name: ''
        },
        dialogBtnLoading: false,
        isEdit: false,
        searchValue: '',
        rules: {
          name: [{
            required: true,
            message: '分组名' + this.$t('noticeMsg.NotEmpty'),
            trigger: ['blur', 'change']
          }, {
            max: 15,
            message: '描述最大长度为15个字符',
            trigger: 'change'
          }]
        }
      };
    },
    computed: {
    },
    created() {
      if (this.dialogFormData.id) {
        this.isEdit = true;
        this.dialogData = copy(this.dialogFormData);
      }
    },
    methods: {
      save(name) {
        this.$refs[name].validate((valid, messages) => {
          if (valid && !this.dialogBtnLoading) {
            var postParams = copy(this.dialogData);
            delete postParams.createdOn;
            this.dialogBtnLoading = true;
            if (postParams.id) {
              // 修改
              editFastWordGroup(postParams)
                .then(resp => {
                  if (resp.isOK) {
                    this.$message.success({
                      message: this.$t('noticeMsg.ModitySuccess'),
                      duration: 2000,
                      showColse: true
                    });
                    this.$emit('update:visible', false);
                    this.$emit('dialogSave', {});
                  } else if (resp.responseStatus && resp.responseStatus.errorCode === 'ReGroupName') {
                    this.$message.error({
                      message: '分组名重复，请重新输入',
                      duration: 2000,
                      showColse: true
                    });
                  } else {
                    this.$message.error({
                      message: this.$t('noticeMsg.ModityFail'),
                      duration: 2000,
                      showColse: true
                    });
                  }
                  this.dialogBtnLoading = false;
                })
                // eslint-disable-next-line handle-callback-err
                .catch(error => {
                  this.disabledBool = false;
                  // this.$message.error({
                  //   message: this.$t('noticeMsg.ModityFail'),
                  //   duration: 2000,
                  //   showColse: true
                  // })
                });
            } else {
              // 添加
              addFastWordGroup(postParams)
                .then(resp => {
                  if (resp.isOK) {
                    this.$message.success({
                      message: this.$t('noticeMsg.AddSuccess'),
                      duration: 2000,
                      showColse: true
                    });
                    this.$emit('update:visible', false);
                    this.$emit('dialogSave', {});
                  } else if (resp.responseStatus && resp.responseStatus.errorCode === 'ReName') {
                    this.$message.error({
                      message: '分组名重复，请重新输入',
                      duration: 2000,
                      showColse: true
                    });
                  } else {
                    this.$message.error({
                      message: this.$t('noticeMsg.AddFail'),
                      duration: 2000,
                      showColse: true
                    });
                  }
                  this.dialogBtnLoading = false;
                })
                // eslint-disable-next-line handle-callback-err
                .catch(error => {
                  this.dialogBtnLoading = false;
                  // this.$message.error({
                  //   message: this.$t('noticeMsg.AddFail'),
                  //   duration: 2000,
                  //   showColse: true
                  // })
                });
            }
          }
        });
      },
      close() {
        this.$emit('update:visible', false);
      }
    }
  };
  </script>
  <style lang="scss" scoped>
  .el-row {
    margin-bottom: 12px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-checkbox {
    display: block;
    margin-bottom: 10px;
  }
  .selectAllclass {
    margin: 15px 0;
  }
  .agentChooseList {
    margin: 0;
    padding: 0;
    li {
      margin: 0;
      padding: 0;
      list-style: none;
      line-height: 40px;
      &:hover {
        background-color: rgb(248, 248, 250);
      }
    }
  }
  .el-checkbox-group{
    max-height: 260px;
    overflow-y: auto;
  }
  .name-item-des {
    position: absolute;
    top: 35px;
    right: 0;
    color: #ddd;
    font-style: italic;
  }
</style>
