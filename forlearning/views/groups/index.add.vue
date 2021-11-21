<template>
  <el-dialog
    :title="isEdit?$t('groups.editGroup'):$t('groups.addGroup')"
    :visible="true"
    :close-on-click-modal="false"
    @close="close"
  >
    <el-form ref="dialogForm" :model="dialogData" label-width="60px" :rules="rules">
      <el-form-item :label="'组名'" prop="name">
        <el-input v-model="dialogData.name" maxlength="32" />
      </el-form-item>
      <el-form-item :label="'描述'" prop="description">
        <el-input v-model="dialogData.description" type="textarea" />
      </el-form-item>
      <!-- <div>客服</div>
      <ul class="agentChooseList">
        <li v-for="(agent,i) in chooseAgents" :key="agent.userId">
          <el-row>
            <el-col :span="4" style="text-align:center">
              <div class="css-1ocrak0 pointer">
                <div class="css-5r5m5i">
                  <img src="@/assets/images/avatar.png" style="width:100%" />
                </div>
                <span
                  :class="agent.agentLoggedStatus==2?'onLine css-10zmg9r':'offLine css-10zmg9r'"
                ></span>
              </div>
            </el-col>
            <el-col :span="16">{{agent.userName}}</el-col>
            <el-col :span="4">
              <el-button type="text" @click="delAgentFn(i)">x</el-button>
            </el-col>
          </el-row>
        </li>
      </ul>
      <el-button type="text" @click="openchooseAgentsDialog()">
        <i class="el-icon-circle-plus"></i>选择客服
      </el-button> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">{{ $t('btns.cancel') }}</el-button>
      <el-button
        type="success"
        :loading="dialogBtnLoading"
        @click="save('dialogForm')"
      >{{ $t('btns.ok') }}</el-button>
    </div>

    <!-- 添加synbol列表 -->
    <!-- <el-dialog
      :title="'选择客服'"
      :visible.sync="chooseAgentsDialogBool"
      :close-on-click-modal="false"
      append-to-body
    >
      <div>
        <el-input v-model="searchValue">
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
        class="selectAllclass"
      >全选</el-checkbox>
      <el-checkbox-group v-model="checkedAgent" @change="handleCheckedAgentChange">
        <el-checkbox v-for="city in filterData" :label="city" :key="city.id">
          <i class="el-icon-s-custom"></i>
          {{city.name}}
        </el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeChooseAgentsDialog()">{{ $t('btns.cancel') }}</el-button>
        <el-button
          type="success"
          :loading="chooseAgentsDisabledBool"
          @click="saveAgent"
          :disabled="checkedAgent.length==0"
        >{{ $t('btns.save') }}</el-button>
      </div>
    </el-dialog> -->
  </el-dialog>
</template>

<script>
import {
  addGroups, editGroups
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
        name: ''
      },
      dialogBtnLoading: false,
      isEdit: false,
      searchValue: '',
      chooseAgentsDialogBool: false,
      chooseAgentsDisabledBool: false,
      checkAll: false,
      checkedAgent: [],
      chooseAgents: [],
      agentsList: [],
      isIndeterminate: false,
      rules: {
        name: [{
          required: true,
          message: '组名' + this.$t('noticeMsg.NotEmpty'),
          trigger: ['blur', 'change']
        }],
        description: [{
          max: 64, message: '描述最大长度为64个字符', trigger: 'change'
        }]
      }
    };
  },
  computed: {
    filterData() {
      const { searchValue, agentsList } = this;
      // 过 滤
      const filterItem = agentsList.filter(p => {
        if (p.name && p.name.indexOf(searchValue) !== -1) {
          return p;
        }
      });
      return filterItem;
    }
  },
  created() {
    if (this.dialogFormData.id) {
      this.isEdit = true;
      this.dialogData = copy(this.dialogFormData);
      this.dialogData.users && (this.chooseAgents = this.dialogData.users);
    }
    // const objParams = {};
    // getAgentList(objParams).then(data => {
    //   if (data.results && data.results.length !== 0) {
    //     this.agentsList = []
    //     var agentdata = data.results

    //     for(let i=0;i<agentdata.length;i++){
    //       if(agentdata[i].id&&agentdata[i].name){
    //         this.agentsList.push(agentdata[i])
    //       }
    //     }

    //   } else {
    //     this.agentsList = []
    //   }
    // }).catch(error => {
    //   this.tableLoading = false
    // });
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedAgent = val ? this.agentsList : [];
      this.isIndeterminate = false;
    },
    handleCheckedAgentChange(value) {
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.agentsList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.agentsList.length;
    },
    save(name) {
      this.$refs[name].validate((valid, messages) => {
        if (valid) {
          var postParams = copy(this.dialogData);
          postParams.users = [];
          if (this.chooseAgents.length !== 0) {
            this.chooseAgents.forEach((elem) => {
              postParams.users.push({
                userId: elem.userId
              });
            });
          }
          if (postParams.id) {
            // 修改
            editGroups(postParams)
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
                } else if (resp.responseStatus && resp.responseStatus.errorCode === 'ReGroupName') {
                  this.$message.error({
                    message: '组名重复，请重新输入',
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
            addGroups(postParams)
              .then(resp => {
                this.dialogBtnLoading = false;
                if (resp.isOK) {
                  this.$message.success({
                    message: this.$t('noticeMsg.AddSuccess'),
                    duration: 2000,
                    showColse: true
                  });
                  this.$emit('update:visible', false);
                  this.$emit('dialogSave', {});
                } else if (resp.responseStatus && resp.responseStatus.errorCode === 'ReGroupName') {
                  this.$message.error({
                    message: '组名重复，请重新输入',
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
    openchooseAgentsDialog() {
      this.chooseAgentsDialogBool = true;
      this.checkedAgent = [];
      const arr = [];
      this.searchValue = '';
      this.chooseAgents.forEach(element => {
        arr.push(element.userId);
      });
      for (const i in this.agentsList) {
        if (arr.indexOf(this.agentsList[i].id) !== -1) {
          this.checkedAgent.push(this.agentsList[i]);
        }
      }
      this.handleCheckedAgentChange(this.checkedAgent);
    },
    delAgentFn(index) {
      this.chooseAgents.splice(index, 1);
    },
    saveAgent() {
      this.chooseAgentsDisabledBool = false;
      this.chooseAgentsDialogBool = false;
      this.chooseAgents = [];
      for (const i in this.checkedAgent) {
        var checkItem = this.checkedAgent[i];
        checkItem.userId = checkItem.id;
        checkItem.userName = checkItem.name;
        this.chooseAgents.push(checkItem);
      }
    },
    closeChooseAgentsDialog() {
      this.chooseAgentsDisabledBool = false;
      this.chooseAgentsDialogBool = false;
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
</style>
