<template>
  <el-dialog :title="'将聊天转接到…'" :visible="true" :close-on-click-modal="false" @close="close">
    <div class="transferFormWrap">
      <el-input v-model="searchValue" placeholder="请输入内容" prefix-icon="el-icon-search" clearable />
      <ul class="transferList">
        <li v-for="(agent) in filterData" :key="agent.id" class="transferLi">
          <div class="avatar">
            <head-portrait :chat-item="agent" />
          </div>
          <div class="name"><span class="ellipsis">{{ agent.name }}</span></div>
          <div class="operate">
            <el-button @click="TransferrToFn(agent)">
              <i class="el-icon-right" />&nbsp;转接
            </el-button>
          </div>
        </li>
        <li v-if="filterData.length==0" class="noData">暂无可转接客服</li>
      </ul>
    </div>
  </el-dialog>
</template>

<script>
  import {
    TransferrTo
  } from '@/api/chats';
  import {
    getAgentList
  } from '@/api/agents';

  import HeadPortrait from '../chats/index.headPortrait';

  export default {
    name: 'TransferDialog',
    components: {
      HeadPortrait
    },
    props: {
      sync: {
        type: Boolean,
        default: false
      },
      dialogTransferData: {
        type: Object,
        required: false,
        default: null
      }
    },
    data() {
      return {
        searchValue: '',
        onlineAgents: []
      };
    },
    computed: {
      filterData() {
        const {
          searchValue,
          onlineAgents
        } = this;
        // 过 滤
        const filterItem = onlineAgents.filter(p => {
          if (p.name && p.name.indexOf(searchValue) !== -1) {
            return p;
          }
        });
        return filterItem;
      }
    },
    created() {
      const objParams = {
        orderByDesc: 'name',
        loggedStatus: 'Online', // 在线状态
        LoginAfterStatus: 'AcceptChats' // 可服务状态
      };
      getAgentList(objParams).then(data => {
        if (data.results && data.results.length !== 0) {
          var onlineAgents = data.results;
          onlineAgents.forEach((ele) => {
            var eleObj = ele;
            if (this.dialogTransferData.agentUserId !== eleObj.id) {
              eleObj['From'] = eleObj.id;
              eleObj['customerName'] = eleObj.name;
              this.onlineAgents.push(eleObj);
            }
          });
        } else {
          this.onlineAgents = [];
        }
      }).catch(errormsg => {
        this.tableLoading = false;
      });
    },
    methods: {
      TransferrToFn(agent) {
        var postParams = {
          id: this.dialogTransferData.id,
          agentUserId: agent.id
        };

        TransferrTo(postParams)
          .then(resp => {
            this.dialogBtnLoading = false;
            if (resp.isOK) {
              this.$message.success({
                message: '转接成功',
                duration: 2000,
                showColse: true
              });
              this.$emit('update:visible', false);
              //   this.$emit('dialogTransferrSave', {})
            } else {
              this.$message.error({
                message: '转接失败',
                duration: 2000,
                showColse: true
              });
            }
          })
          .catch(errormsg => {});
      },
      close() {
        this.$emit('update:visible', false);
      }
    }
  };

</script>
<style lang="scss" scoped>
  .el-button {
    width: 100%;
    color: #4384f5;
    border-color: #4384f5;
  }
  .noData{
    padding: 20px;
    text-align: center;
    color: #f00;
  }

</style>
