<template>
  <el-dialog
    class="dialog-wrapper"
    :title="!isEdit?$t('role.addRole'):$t('role.editRole')"
    :visible="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form ref="dialogForm" :model="dialogData" label-width="120px" :rules="rules">
      <el-form-item :label="$t('role.fields.name')" prop="name">
        <el-input v-model="dialogData.name" />
      </el-form-item>
      <el-form-item :label="$t('role.fields.description')" prop="description">
        <el-input v-model="dialogData.description" />
      </el-form-item>
      <el-form-item v-if="!isEdit" :label="$t('role.fields.copyRole')">
        <el-select v-model="dialogData.copyRoleId" :placeholder="$t('role.fields.choosableCopyRole')" class="width100">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">{{ $t('btns.cancel') }}</el-button>
      <el-button type="primary" :loading="dialogBtnLoading" @click="save('dialogForm')">{{ $t('btns.ok') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getRoleList, addRole, editRole } from '@/api/urm';
import { copy } from '@/utils/common';

export default {
  name: 'RelatedUser',
  components: {},
  props: {
    moduleData: {
      type: Object,
      required: false,
      default: null
    }
  },
  data() {
    return {
      dialogBtnLoading: false,
      dialogData: {},
      roleList: [],
      isEdit: false,
      rules: {
        name: [
          { required: true, message: this.$t('role.fields.name') + this.$t('noticeMsg.NotEmpty'), trigger: 'change' },
          { min: 1, max: 16, message: this.$t('role.fields.name') + this.$t('noticeMsg.shouldBeXToYCharacter').replace(/{min}/, '1').replace(/{max}/, '16'), trigger: 'change' }
        ],
        description: [
          { min: 1, max: 128, message: this.$t('role.fields.description') + this.$t('noticeMsg.shouldBeXToYCharacter').replace(/{min}/, '1').replace(/{max}/, '128'), trigger: 'change' }
        ]
      }
    };
  },
  created() {
    if (this.moduleData.id) {
      this.isEdit = true;
      this.dialogData = copy(this.moduleData);
    }
    this.getRoleList();
  },
  mounted() {},
  methods: {
    getRoleList() {
      // 查所有角色，复制角色功能用
      getRoleList({ orderByDesc: 'createdOn' }).then(data => {
        this.roleList = data.results;
      }).catch(res => {

      });
    },
    close() {
      this.$emit('addRoleDialogSave', null);
    },
    save(name) {
      // console.log(this.value);
      const postData = copy(this.dialogData);
      this.$refs[name].validate((valid, messages) => {
        if (valid) {
          this.dialogBtnLoading = true;
          if (postData.id) {
            editRole(this.dialogData).then(resp => { // 修改
              this.dialogBtnLoading = false;
              if (resp.isOK) {
                this.$message.success({ message: this.$t('noticeMsg.ModitySuccess'), duration: 2000, showColse: true });
                this.$emit('addRoleDialogSave', true);
              } else if (!resp.responseStatus) {
                this.$message.error({ message: this.$t('noticeMsg.ModityFail'), duration: 2000, showColse: true });
              } else {
                // const field = resp.responseStatus.errors[0].fieldName;
                this.$message.error({ message: this.$t('role.fields.name') + this.$t('noticeMsg.alreadyExist'), duration: 2000 });
              }
            }).catch((errormsg) => {
              this.dialogBtnLoading = false;
              this.$message.error({ message: this.$t('noticeMsg.ModityFail'), duration: 2000, showColse: true });
            });
          } else {
            addRole(this.dialogData).then(resp => { // 添加
              this.dialogBtnLoading = false;
              if (resp.isOK) {
                this.$message.success({ message: this.$t('noticeMsg.AddSuccess'), duration: 2000, showColse: true });
                this.$emit('addRoleDialogSave', true);
              } else if (!resp.responseStatus) {
                this.$message.error({ message: this.$t('noticeMsg.AddFail'), duration: 2000, showColse: true });
              } else {
                // const field = resp.responseStatus.errors[0].fieldName;
                this.$message.error({ message: this.$t('role.fields.name') + this.$t('noticeMsg.alreadyExist'), duration: 2000 });
              }
            }).catch((errormsg) => {
              this.dialogBtnLoading = false;
              this.$message.error({ message: this.$t('noticeMsg.AddFail'), duration: 2000, showColse: true });
            });
          }
        }
      });
    }
  }
};
</script>
<style lang='scss' scoped>
.el-select{
    width:100%;
}
</style>
