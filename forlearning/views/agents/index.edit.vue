<template>
  <el-dialog :title="'修改客服信息'" :visible="true" :close-on-click-modal="false" @close="close">
    <el-form ref="dialogForm" :model="dialogData" label-width="120px" :rules="rules">
      <el-form-item :label="'姓名'">
        <el-input v-model="dialogData.name" maxlength="32" :disabled="true" />
      </el-form-item>
      <el-form-item :label="'昵称'">
        <el-input v-model="dialogData.nickName" maxlength="32" :disabled="true" />
      </el-form-item>
      <el-form-item :label="'邮箱'">
        <el-input v-model="dialogData.email" :disabled="true" />
      </el-form-item>
      <!-- <el-form-item :label="'角色'" prop="rolesStr">
        <el-input v-model="dialogData.rolesStr" :disabled="true" />
      </el-form-item> -->
      <!-- <el-form-item :label="'组别'" prop="groupsIds">
        <el-select v-model="dialogData.groupsIds" multiple filterable style="width:100%">
          <el-option
            v-for="item in groupsList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item :label="'最大聊天数'" prop="chatsLimit">
        <el-input v-model="dialogData.chatsLimit" type="text" oninput="value=value.replace(/[^\d]/g,'')" maxlength="11" />
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
  editAgent
} from '@/api/agents';
import {
  getGroupsList
} from '@/api/groups';
import { copy } from '@/utils/common';

export default {
  name: 'EditAgent',
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
    var checkChatsLimit = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('最大聊天数不能为空'));
      }
      if (isNaN(Number(value))) {
        callback(new Error('请输入数字'));
      } else {
        if (value < 0) {
          callback(new Error('请输入大于0的数字'));
        } else {
          callback();
        }
      }
    };
    var checkGroup = (rule, value, callback) => {
      if (value.length) {
        callback(new Error('组别不能为空'));
      } else {
        callback();
      }
    };
    return {
      dialogData: {
        name: '',
        nickname: '',
        email: '',
        roles: '',
        groups: [],
        chatsLimit: ''
      },
      dialogBtnLoading: false,
      groupsArr: [],
      groupsList: [],
      rules: {
        name: [{
          required: true,
          message: '姓名' + this.$t('noticeMsg.NotEmpty'),
          trigger: ['blur']
        }],
        nickname: [{
          required: true,
          message: '昵称' + this.$t('noticeMsg.NotEmpty'),
          trigger: ['blur']
        }],
        groupsArr: [{
          validator: checkGroup,
          trigger: ['blur']
        }],
        chatsLimit: [{
          validator: checkChatsLimit,
          required: true,
          trigger: ['blur']
        }]
      }
    };
  },
  computed: {
  },
  created() {
    if (this.dialogFormData.id) {
      this.dialogData = copy(this.dialogFormData);

      // this.dialogData.groups.forEach((ele) => {
      //   this.groupsArr.push(ele.id)
      // })

      // let rolesArr = []
      // this.dialogData.roles.forEach((ele) => {
      //   rolesArr.push(ele.name)
      // })
      // this.dialogData.rolesStr = rolesArr.join("/")
    }

    // this.getGroupsList();
  },
  methods: {
    getGroupsList() {
      // 获取组别
      const objParams = {};
      getGroupsList(objParams).then(data => {
        if (data.results && data.results.length !== 0) {
          var groupsList = data.results;
          groupsList.forEach(element => {
            if (element.name) {
              var o = {
                value: element.id,
                label: element.name
              };
              this.groupsList.push(o);
              if (this.groupsArr.indexOf(element.id) !== -1) {
                this.dialogData.groupsIds.push(o.value);
              }
            }
          });
          // this.dialogData.groups.push(this.groupsList[0].value)
        } else {
          this.groupsList = [];
        }
      }).catch(errormsg => {
        console.error(errormsg);
      });
    },
    save(name) {
      this.$refs[name].validate((valid, messages) => {
        if (valid) {
          var postParams = {
            agentId: this.dialogData.agentId,
            chatsLimit: this.dialogData.chatsLimit
          };
          // postParams.groups=[]
          // this.dialogData.groupsIds.forEach((eleId) =>{
          //   postParams.groups.push({id:eleId})
          // })

          if (postParams.agentId) {
            // 修改
            editAgent(postParams)
              .then(resp => {
                this.dialogBtnLoading = false;
                if (resp.isOK) {
                  this.$message.success({
                    message: this.$t('noticeMsg.ModitySuccess'),
                    duration: 2000,
                    showColse: true
                  });
                  this.$emit('update:visible', false);
                  this.$emit('dialogSave', {});
                } else if (!resp.responseStatus) {
                  this.$message.error({
                    message: this.$t('noticeMsg.ModityFail'),
                    duration: 2000,
                    showColse: true
                  });
                } else {
                  const field = resp.responseStatus.errors[0].fieldName;
                  this.$message.error({
                    message: this.$t(field) +
                      this.$t(resp.responseStatus.errors[0].errorCode),
                    duration: 2000
                  });
                }
              })
              // eslint-disable-next-line handle-callback-err
              .catch(error => {
                this.disabledBool = false;
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
</style>
