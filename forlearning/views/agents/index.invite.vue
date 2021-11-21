<template>
  <el-dialog :title="'邀请客服'" :visible="true" :close-on-click-modal="false" @close="close">
    <el-form ref="dialogForm" :model="dialogData">
      <el-row :gutter="12" style="margin:0 auto 10px">
        <el-col :span="8">邮件</el-col>
        <el-col :span="6">角色</el-col>
        <el-col :span="8">组别</el-col>
        <el-col :span="2" />
      </el-row>

      <el-row v-for="(inviteItem,i) in dialogData.inviteData" :key="inviteItem.key" :gutter="12">
        <el-col :span="8">
          <el-form-item
            :prop="'inviteData.' + i + '.Email'"
            :rules="{validator: checkEmail, trigger: 'blur'}"
          >
            <el-input v-model="inviteItem.Email" placeholder />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            :prop="'inviteData.' + i + '.RoleIds'"
            :rules="{validator: checkRole, trigger: 'change'}"
          >
            <el-select v-model="inviteItem.RoleIds" filterable placeholder="请选择">
              <el-option
                v-for="item in roleData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :prop="'inviteData.' + i + '.GroupIds'"
            :rules="{validator:checkGroup, trigger: 'change'}"
          >
            <el-select v-model="inviteItem.GroupIds" multiple filterable default-first-option>
              <el-option
                v-for="item in groupsList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button v-if="dialogData.inviteData.length!=1" type="text" @click="delInviteFn(i)">x</el-button>
        </el-col>
      </el-row>

      <el-button type="text" @click="addInviteFn()">+ Invite another</el-button>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">{{ $t('btns.cancel') }}</el-button>
      <el-button
        type="success"
        :loading="dialogBtnLoading"
        :disabled="dialogBtnDisable"
        @click="save('dialogForm')"
      >{{ $t('btns.ok') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  getAgentList, inviteAgent, getRoleList
} from '@/api/agents';
import {
  getGroupsList
} from '@/api/groups';
import { copy } from '@/utils/common';

export default {
  name: 'AddData',
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
        inviteData: [
          { key: Math.random(), Email: '', RoleIds: '', GroupIds: '' },
          { key: Math.random(), Email: '', RoleIds: '', GroupIds: '' },
          { key: Math.random(), Email: '', RoleIds: '', GroupIds: '' }
        ]
      },
      roleData: [],
      groupsList: [],
      dialogBtnLoading: false,
      // rules: {
      //   domainsItem0: [
      //     { required: true, message: "AAAA", trigger: "change" }
      //   ],
      // },
      checkEmail: (rule, value, callback) => {
        if (value) {
          var reg = /^[A-Za-z0-9][A-Za-z0-9-_\.]{0,19}@[A-Za-z0-9][A-Za-z0-9-_\.]{0,11}\.[A-Za-z]{2,10}$/;
          if (reg.test(value)) {
            // 校验邮箱是否存在
            var objParams = {
              Email: value,
              V: Math.random()
            };
            getAgentList(objParams).then(data => {
              if (data.results && data.results.length !== 0) {
                callback(new Error('邮箱已存在'));
              } else {
                callback();
              }
            }).catch(error => { console.error(error) });
          } else {
            callback(new Error('邮箱格式不正确'));
          }
        } else {
          callback();
        }
      },
      checkRole: (rule, value, callback) => {
        // 输了邮箱后  才校验组名和角色必填
        // 获取当前校验的表单 是在遍历的第几个
        var fileArr = rule.field.split('.');
        const fieldNum = fileArr[1];
        if (this.dialogData.inviteData[fieldNum].Email && (value === '' || value === undefined)) {
          callback(new Error('角色不能为空'));
        } else {
          callback();
        }
      },
      checkGroup: (rule, value, callback) => {
        // 获取当前校验的表单 是在遍历的第几个
        var fileArr = rule.field.split('.');
        const fieldNum = fileArr[1];
        if (this.dialogData.inviteData[fieldNum].Email && (value.length === 0)) {
          callback(new Error('组别不能为空'));
        } else {
          callback();
        }
      }
    };
  },
  computed: {
    dialogBtnDisable: function() {
      let btnBool = true;
      for (let i = 0; i < this.dialogData.inviteData.length; i++) {
        if (this.dialogData.inviteData[i].Email) {
          btnBool = false;
          return;
        }
      }
      return btnBool;
    }
  },
  created() {
    this.getGroupsList();
    this.getRoleList();
  },
  methods: {
    getGroupsList() {
      // 获取组别
      var objParams = {
        V: Math.random()
      };
      getGroupsList(objParams).then(data => {
        if (data.results && data.results.length !== 0) {
          var groupsList = data.results;
          groupsList.forEach(element => {
            this.groupsList.push({
              value: element.id,
              label: element.name
            });
          });
        } else {
          this.groupsList = [];
        }
      }).catch(error => { console.error(error) });
    },
    getRoleList() {
      // 获取角色
      var objParams = {
        V: Math.random()
      };
      getRoleList(objParams).then(data => {
        if (data.results && data.results.length !== 0) {
          var roleData = data.results;
          roleData.forEach(element => {
            this.roleData.push({
              value: element.id,
              label: element.name
            });
          });
        } else {
          this.roleData = [];
        }
      }).catch(error => { console.log(error) });
    },
    addInviteFn() {
      this.dialogData.inviteData.push({ key: Math.random(), Email: '', RoleIds: '', GroupIds: '' });
    },
    delInviteFn(index) {
      this.dialogData.inviteData.splice(index, 1);
    },
    save(name) {
      this.$refs[name].validate((valid, messages) => {
        if (valid) {
          // console.log(this.dialogData.inviteData)
          // 邀请
          const inviteData = copy(this.dialogData.inviteData);
          // let params = {
          //   Email: inviteData[0].Email,
          //   RoleIds: inviteData[0].RoleIds,
          //   GroupIds: inviteData[0].GroupIds[0]
          // }

          var inviteParam = {
            Invites: []
          };
          inviteData.forEach((element) => {
            if (element.Email) {
              inviteParam.Invites.push({
                Email: element.Email,
                RoleIds: element.RoleIds,
                GroupIds: element.GroupIds
              });
            }
          });

          this.dialogBtnLoading = true;
          inviteAgent(inviteParam.Invites)
            .then(resp => {
              this.dialogBtnLoading = false;
              if (resp.isOK) {
                this.dialogBool = false;
                this.$message.success({
                  message: '邀请客服成功',
                  duration: 2000,
                  showColse: true
                });
                this.$emit('update:visible', false);
                this.$emit('dialogSave', {});
              } else if (resp.responseStatus && resp.responseStatus.errorCode === 'EmailExists') {
                this.$message.error({
                  message: '邮箱已存在，请重新输入！',
                  duration: 2000,
                  showColse: true
                });
              } else {
                this.$message.error({
                  message: '邀请客服失败',
                  duration: 2000,
                  showColse: true
                });
              }
            })
            // eslint-disable-next-line handle-callback-err
            .catch(error => {
              // this.$message.error({
              //   message: '邀请客服失败',
              //   duration: 2000,
              //   showColse: true
              // })
              this.dialogBtnLoading = false;
            });
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
  // margin-bottom: 12px;
  &:last-child {
    margin-bottom: 0;
  }
}
.is-error >>> .el-input__inner {
  border-color: #f56c6c;
}
.errorEamil {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  position: absolute;
  top: 100%;
  left: 6px;
  display: none;
}
.is-error {
  .errorEamil {
    display: block;
  }
}
</style>
