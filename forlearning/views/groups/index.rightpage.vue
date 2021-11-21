<template>
  <div class="css-ta8zni css-1a49fo61 right-wrapper">
    <el-tabs v-model="activeName" class="right-wrapper-tabs" @tab-click="handleClick">
      <el-tab-pane label="群组信息" name="info">
        <el-row class="tabs-title" type="flex" justify="space-between">
          <div class="label">群组信息</div>
        </el-row>
        <div v-if="dialogFormData" class="info-box">
          <el-row class="operate" type="flex" justify="space-between">
            <div class="label">操作</div>
            <el-tooltip content="编辑" placement="top">
              <div v-if="permissionAll[$route.path] && permissionAll[$route.path].edit" class="operate-icon">
                <i class="el-icon el-icon-edit" @click="edit()" />
              </div>
            </el-tooltip>
          </el-row>
          <el-row type="flex">
            <div class="label">组名:</div>
            <div class="form-item">{{ dialogFormData.name }}</div>
          </el-row>
          <el-row type="flex">
            <div class="label">描述:</div>
            <div class="form-item">{{ dialogFormData.description }}</div>
          </el-row>
          <el-row type="flex">
            <div class="label">创建时间:</div>
            <div class="form-item break-all">{{ dialogFormData.createdOn | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</div>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="客服列表" name="relatedAgent">
        <el-row class="tabs-title" type="flex" justify="space-between">
          <div class="label">客服列表</div>
          <el-tooltip content="关联客服" placement="top">
            <div v-if="permissionAll[$route.path] && permissionAll[$route.path].addAgent" class="operate-icon">
              <i class="el-icon el-icon-plus" @click="relatedAgent()" />
            </div>
          </el-tooltip>
        </el-row>
        <div class="info-box table">
          <el-input v-model="initParam.emailContains" placeholder="输入客服邮箱搜索" class="input-with-select" size="medium" @keyup.enter.native="handSearchAgent">
            <el-button slot="append" type="primary" icon="el-icon-search" @click="handSearchAgent" />
          </el-input>
          <div class="table-wrapper">
            <div v-show="tableLoadingAgent" class="loading">
              <i class="el-icon el-icon-loading" />
            </div>
            <table>
              <thead>
                <tr>
                  <th>客服名称</th>
                  <th>客服邮箱</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,$index) in agentList" :key="$index">
                  <td>{{ item.userName }}</td>
                  <td>{{ item.email }}</td>
                  <td class="text-align_center"><a v-if="permissionAll[$route.path] && permissionAll[$route.path].deleteAgent" class="el-icon el-icon-delete" @click="deleteGroupUser(item)" /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <el-row class="pagination" type="flex" justify="space-between">
            <div class="prev">
              <a class="prev-first" :class="{'disabled':paging.currentPage === 1||agentList.length==0}" :disabled="agentList.length==0" @click="page('first')">&lt;&lt;</a><a :class="{'disabled':paging.currentPage === 1||agentList.length==0}" :disabled="agentList.length==0" @click="page('prev')">&lt;上一页</a>
            </div>
            <div class="next">
              <a :class="{'disabled':paging.currentPage === paging.last || agentList.length==0}" :disabled="agentList.length==0" @click="page('next')">下一页&gt;</a><a class="next-last" :class="{'disabled':paging.currentPage === paging.last || agentList.length==0}" :disabled="agentList.length==0" @click="page('last')">&gt;&gt;</a>
            </div>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>

    <related-agent v-if="dialogRelatedAgent.show" ref="relatedAgent" :agent-data="dialogRelatedAgent.data" @save="relatedAgentSave" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { copy } from '@/utils/common';
import { getGroupsUserList, addGroupUser, deleteGroupUser } from '@/api/groups';
import RelatedAgent from './right.relatedAgent';

export default {
  name: 'RightPage',
  components: { RelatedAgent },
  props: {
    // sync: {
    //   type: Boolean,
    //   default: false
    // },
    dialogFormData: {
      type: Object,
      required: false,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      activeName: 'info',
      agentList: [],
      paging: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        last: 0
      },
      initParam: {
        Skip: 0,
        Take: 10
      },
      dialogRelatedAgent: {
        show: false,
        data: {}
      },
      tableLoadingAgent: false
    };
  },
  computed: {
    ...mapGetters([
      'permissionAll'
    ])
  },
  watch: {
    dialogFormData: function(n, o) {
      // console.log(n)
      this.init();
      this.activeName === 'relatedAgent' && this.getGroupsUserList();
    }
  },
  created() {
  },
  methods: {
    init() {
      this.paging = {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        last: 0
      };
      this.initParam = {
        Skip: 0,
        Take: 10
      };
      this.agentList = [];
    },
    handleClick(tab, event) {
      // console.log(tab, event);
      if (tab.name === 'relatedAgent' && !this.agentList.length) {
        this.getGroupsUserList();
      }
    },
    edit() {
      this.$emit('edit', this.dialogFormData);
    },
    getGroupsUserList() {
      this.tableLoadingAgent = true;
      this.initParam.Take = this.paging.pageSize;
      this.initParam.Skip = (this.paging.currentPage - 1) * this.initParam.Take;
      this.initParam.groupId = this.dialogFormData.id;
      getGroupsUserList(this.initParam).then(data => {
        if (data.results.length) {
          this.agentList = data.results;
        } else {
          this.agentList = [];
        }
        this.paging.total = data.total;
        this.paging.last = Math.ceil(this.paging.total / this.paging.pageSize);
        setTimeout(() => {
          this.tableLoadingAgent = false;
        }, 300);
      });
    },
    handSearchAgent() {
      this.paging.currentPage = 1;
      this.getGroupsUserList();
    },
    relatedAgent() {
      this.dialogRelatedAgent.show = true;
      this.dialogRelatedAgent.data = copy(this.dialogFormData);
    },
    relatedAgentSave(data) {
      if (data) {
        addGroupUser(data).then(res => {
          if (res.isOK) {
            this.$message({ type: 'success', message: this.$t('noticeMsg.addedRelatedSuccess') });
            this.dialogRelatedAgent.show = false;
            this.getGroupsUserList();
          } else {
            this.$message({ type: 'error', message: this.$t('noticeMsg.addedRelatedFail') });
            this.$refs.dialogRelatedAgent.dialogBtnLoading = false;
          }
        });
      } else {
        this.dialogRelatedAgent.show = false;
      }
    },
    deleteGroupUser(item) {
      this.$confirm(this.$t('noticeMsg.deleteAsk'), this.$t('noticeMsg.info'), { confirmButtonText: this.$t('btns.ok'), cancelButtonText: this.$t('btns.cancel') }).then(() => {
        deleteGroupUser(item).then(res => {
          if (res.isOK) {
            this.$message.success({ message: this.$t('noticeMsg.DeleteSuccess'), duration: 2000, showColse: true });
            this.getGroupsUserList();
          } else {
            this.$message.error({ message: this.$t('noticeMsg.DeleteFail'), duration: 2000, showColse: true });
          }
        });
      }).catch(() => { });
    },
    page(type) {
      if (this.agentList.length === 0) return;
      if (type === 'first') {
        if (this.paging.currentPage === 1) return;
        this.paging.currentPage = 1;
      }
      if (type === 'prev') {
        if (this.paging.currentPage === 1) return;
        this.paging.currentPage--;
      }

      if (type === 'last') {
        if (this.paging.currentPage === this.paging.last) return;
        this.paging.currentPage = this.paging.last;
      }
      if (type === 'next') {
        if (this.paging.currentPage === this.paging.last) return;
        this.paging.currentPage++;
      }
      this.getGroupsUserList();
    }
  }
};
</script>
<style lang='scss' scoped>
.el-collapse {
  border: none;
}
.el-collapse >>> .el-collapse-item__header {
  position: relative;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  background-color: rgba(221, 226, 230, 0.5);
  font-size: 14px;
  height: auto;
  line-height: 24px;
  color: rgb(66, 77, 87);
  user-select: none;
  cursor: pointer;
  margin-bottom: 1px;
  border-radius: 4px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
  padding: 4px 12px 4px 30px;
}
.el-collapse >>> .el-collapse-item__wrap {
  border: none;
}
.el-button.is-round {
  padding: 7px;
}
.el-collapse >>> .el-collapse-item__arrow {
  position: absolute;
  left: 8px;
  top: 9px;
}
</style>
