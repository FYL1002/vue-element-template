<template>
  <div class="css-1ob8ues css-1a49fo60" :style="{'height': tableHeight+102+'px'}">
    <!-- 高度 是tabs切换的高度和分页的高度 -->
    <div class="css-151x0d2 css-1a49fo61">
      <div class="wHeight">
        <el-tabs v-model="activeName" @tab-click="tabClickFn">
          <el-tab-pane label="客服列表" name="first" />
          <el-tab-pane label="暂停服务" name="second" />
        </el-tabs>
        <div class="searchRow">
          <easy-search :easy-option="searchOption" @easyChange="searchChange" />
          <el-tooltip content="编辑列" placement="top">
            <div v-if="permissionAll[$route.path] && permissionAll[$route.path].viewField" class="edit-column" @click="showDrawer">
              <svg-icon icon-class="column2" />
            </div>
          </el-tooltip>
        </div>
        <el-table
          id="elementTale"
          ref="agentsTable"
          v-loading="tableLoading"
          :data="tableData"
          border
          :max-height="tableHeight"
          highlight-current-row
          @selection-change="selectTable"
          @sort-change="sortChangeFn"
          @current-change="handleCurrentChange"
        >
          <el-table-column type="selection" width="40" fixed />
          <el-table-column :label="$t('commonFields.operation')" width="70" fixed>
            <template slot-scope="{row}">
              <el-tooltip
                v-if="permissionAll[$route.path] && permissionAll[$route.path].edit&&activeName=='first'"
                class="item"
                effect="dark"
                :content="$t('btns.edit')"
                placement="bottom"
              >
                <i class="el-icon el-icon-edit" @click="editAgent(row)" />
              </el-tooltip>
              <el-tooltip
                v-if="permissionAll[$route.path] && permissionAll[$route.path].delete"
                class="item"
                effect="dark"
                :content="$t('btns.delete')"
                placement="bottom"
              >
                <i class="el-icon el-icon-delete" @click="del(row)" />
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            v-for="item in tableColumnSet"
            :key="item.id"
            :label="$t(tableField[item.name].label)"
            :min-width="tableField[item.name].minWidth"
            :prop="tableField[item.name].prop"
            :sortable="tableField[item.name].sortable"
            :show-overflow-tooltip="tableField[item.name].tooltip"
          >
            <template slot-scope="{row}">
              <div v-if="tableField[item.name].prop === 'loggedStatus'">
                <span>{{ $t('enum.loggedStatus.'+row.loggedStatus) }}</span>
              </div>
              <div v-else-if="tableField[item.name].prop === 'lastLoginOn'">
                <span>{{ row.lastLoginOn | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
              </div>
              <div v-else>
                {{ row[tableField[item.name].prop] }}
              </div>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          :total="paging.total"
          :pager-count="5"
          :page.sync="paging.currentPage"
          :limit.sync="paging.pageSize"
          @pagination="paginationChange"
        />
      </div>
    </div>
    <!-- 右侧 信息栏 -->
    <right-page ref="RightPage" :dialog-form-data="currentRow" @dialogSave="editAgent(currentRow)" @suspend="suspendFn" />
    <!-- 邀请 -->
    <data-invite
      v-if="dialogBoolInvite"
      ref="dataInvite"
      :visible.sync="dialogBoolInvite"
      :dialog-form-data="dialogDataInvite"
      @dialogSave="ok"
    />
    <!-- 修改 -->
    <edit-agent
      v-if="dialogBoolEdit"
      ref="AddGroups"
      :visible.sync="dialogBoolEdit"
      :dialog-form-data="dialogDataEdit"
      @dialogSave="ok"
    />

    <add-group v-if="dialogAddGroup.show" :agent-data="dialogAddGroup.data" @save="addGroupSave" @close="addGroupClose" />

    <el-drawer class="el-drawer-wrapper" :visible.sync="drawer.show" :with-header="false" :before-close="closeDrawer">
      <drawer :columns="drawer.columns" :page-name="drawer.pageName" :field-translate="drawer.fieldTranslate" @close="closeDrawer" />
    </el-drawer>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { elementSize } from '@/utils/common';
import Pagination from '@/components/Pagination';
import EasySearch from '@/components/EasySearch'; // 搜索组件
import EditAgent from './index.edit';
import RightPage from './index.rightpage';

import {
  getAgentList, delAgent, editAgent
} from '@/api/agents';
import { getCustomColumns } from '@/api/common';
import { addGroupUser } from '@/api/groups';
import DataInvite from './index.invite';
import AddGroup from './index.group';
import Drawer from '@/components/EditColumn';

export default {
  name: 'AgentsList',
  components: { Pagination, EasySearch, DataInvite, EditAgent, RightPage, AddGroup, Drawer },
  data() {
    return {
      paging: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      initParam: {
        Skip: 0,
        Take: 10,
        orderByDesc: 'createdOn',
        LoginAfterStatus: 'AcceptChats'
      },
      searchOption: {
        nameContains: {
          name: '姓名', valueType: 2, isMoreTime: false
        },
        emailContains: {
          name: '邮箱', valueType: 2, isMoreTime: false
        }
      },
      activeName: 'first',
      tableKey: 0,
      tableData: [],
      selectionData: [],
      currentRow: null,
      dialogBool: false,
      tableLoading: false,
      dialogType: '',
      dialogData: {},
      dialogBoolInvite: false,
      dialogDataInvite: {},
      dialogBoolEdit: false,
      dialogDataEdit: {},
      tableIndexObj: {},
      dialogAddGroup: {
        show: false,
        data: {}
      },
      tableColumnSet: [],
      tableField: {
        Name: {
          label: 'commonFields.realName',
          minWidth: 100,
          prop: 'name',
          sortable: 'custom',
          tooltip: true
        },
        NickName: {
          label: 'commonFields.nickName',
          minWidth: 80,
          prop: 'nickName',
          sortable: 'custom',
          tooltip: true
        },
        LoggedStatus: {
          label: 'commonFields.status',
          minWidth: 74,
          prop: 'loggedStatus',
          sortable: 'custom',
          tooltip: true
        },
        Email: {
          label: 'commonFields.email',
          minWidth: 100,
          prop: 'email',
          sortable: 'custom',
          tooltip: true
        },
        LastLoginOn: {
          label: 'commonFields.lastLoginDate',
          minWidth: 154,
          prop: 'lastLoginOn',
          sortable: 'custom',
          tooltip: true
        }
      },
      drawer: {
        show: false,
        columns: {},
        pageName: 'Agent',
        fieldTranslate: {
          Name: 'commonFields.realName',
          Email: 'commonFields.email',
          NickName: 'commonFields.nickName',
          LastLoginOn: 'commonFields.lastLoginDate',
          LoggedStatus: 'commonFields.status',
          '01ae78b7-d532-11ea-b952-0c9d928123b6': 'columns.basicFields',
          '09d21981-d532-11ea-b952-0c9d928123b6': 'columns.otherFields'
        }
      }
    };
  },
  computed: {
    ...mapGetters([
      'tableHeight',
      'permissionAll'
    ])
  },
  created() {
    this.init();
    // 接收 mian.js  的推送
    this.$root.eventHub.$on('ReceiveAgentLoggedStatus', (data) => {
      if (data && data.userId && this.tableData && this.tableData.length !== 0) {
        if (this.tableIndexObj[data.userId]) {
          this.tableData[this.tableIndexObj[data.userId]].loggedStatus = data.loggedStatus;
        }
      }
    });
  },
  mounted() {
    // 高度适应
    this.$nextTick(() => {
      elementSize();
    });
  },
  methods: {
    tabClickFn(obj) {
      // 暂停服务 tabs
      if (obj.name === 'second') {
        this.initParam.LoginAfterStatus = 'NoAcceptChats';
      } else {
        this.initParam.LoginAfterStatus = 'AcceptChats';
      }
      this.initParam.Skip = 0;
      this.getList(this.initParam);
    },
    selectTable(val) {
      this.selectionData = val;
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.second > 60) {
        return 'warning-row';
      } else {
        return '';
      }
    },
    selectBlur(e) {
      this.dialogData.Spread = e.target.value;
    },
    getList(params) {
      this.tableLoading = true;
      var objParams = params;
      objParams.V = Math.random();
      // 深度拷贝dcopy
      getAgentList(objParams).then(data => {
        this.tableLoading = false;
        if (data.results && data.results.length !== 0) {
          this.tableData = data.results;

          this.tableIndexObj = {};

          for (const i in this.tableData) {
            // 遍历，，保存id 为key  的index  优化推送消息频繁for循环列表数据
            this.tableIndexObj[this.tableData[i].id] = i;
          }

          this.paging.total = data.total;
          this.$refs.agentsTable.setCurrentRow(this.tableData[0]);
        } else {
          this.tableData = [];
        }
      }).catch(error => {
        this.tableLoading = false;
        console.error(error);
      });
    },
    setCurrent(row) {
      this.$refs.agentsTable.setCurrentRow(row);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    searchChange(params) {
      const initParam = {
        Skip: 0,
        Take: 10,
        orderByDesc: 'createdOn',
        LoginAfterStatus: 'AcceptChats'
      };
      const searchParams = Object.keys(params).length !== 0 ? params : {};
      this.initParam = Object.assign(initParam, searchParams);
      this.getList(this.initParam);
    },
    paginationChange() {
      this.initParam.Take = this.paging.pageSize;
      this.initParam.Skip = (this.paging.currentPage - 1) * this.initParam.Take;
      this.getList(this.initParam);
    },
    resetDialog() {
      this.dialogData = {};
    },
    dialogClose() {
      this.$refs['dialogForm'].resetFields();
    },
    sortChangeFn(column) {
      // order: "ascending"   prop: "Symbol" 升序
      // order: "descending"   prop: "Symbol" 降序
      // order: null  prop: "Symbol"  默认

      switch (column.order) {
        case 'ascending':
          this.initParam.orderBy = column.prop;
          this.initParam.orderByDesc && this.$delete(this.initParam, 'orderByDesc');
          break;
        case 'descending':
          this.initParam.orderByDesc = column.prop;
          this.initParam.orderBy && this.$delete(this.initParam, 'orderBy');
          break;
        default:
          this.initParam.orderByDesc = 'createdOn';
          this.initParam.orderBy && this.$delete(this.initParam, 'orderBy');
      }
      this.getList(this.initParam);
    },
    editAgent(row) {
      this.dialogBoolEdit = true;
      if (row) {
        this.dialogDataEdit = row;
      }
    },
    del(row) {
      this.$confirm(
        this.$t('noticeMsg.deleteAsk'),
        this.$t('noticeMsg.info'), {
        confirmButtonText: this.$t('btns.ok'),
        cancelButtonText: this.$t('btns.cancel'),
        customClass: 'confirmClass'
      }).then(() => {
        delAgent(row).then(resp => {
          if (resp.isOK) {
            this.$message.success({
              message: this.$t('noticeMsg.DeleteSuccess'),
              duration: 2000,
              showColse: true
            });
            this.getList(this.initParam);
          } else {
            this.$message.error({
              message: this.$t('noticeMsg.DeleteFail'),
              duration: 2000,
              showColse: true
            });
          }
        }).catch(() => {});
      }).catch(() => { });
    },
    InviteFn() {
      this.dialogBoolInvite = true;
      this.dialogDataInvite = this.selectionData[0];
    },
    // 暂停服务
    suspendFn(entity) {
      if (entity) {
        var tips = this.activeName === 'first' ? '请确认是否要暂停此客服服务？' : '请确认是否要恢复此客服服务？';
        var fieldSuspend = this.activeName === 'first' ? '暂停' : '恢复';
        this.$confirm(
          tips,
          this.$t('noticeMsg.info'), {
          confirmButtonText: this.$t('btns.ok'),
          cancelButtonText: this.$t('btns.cancel'),
          customClass: 'confirmClass'
        })
          .then(() => {
            const params = {
              agentId: entity.agentId,
              LoginAfterStatus: this.activeName === 'first' ? 'NoAcceptChats' : 'AcceptChats'
            };
            editAgent(
              params
            ).then(resp => {
              if (resp.isOK) {
                this.$message.success({
                  message: fieldSuspend + '成功',
                  duration: 2000,
                  showColse: true
                });
                this.getList(this.initParam);
              } else {
                this.$message.error({
                  message: fieldSuspend + '失败',
                  duration: 2000,
                  showColse: true
                });
              }
            })
              .catch(() => {});
          });
      }
    },
    ok() {
      this.getList(this.initParam);
    },
    addGroup() {
      if (this.selectionData.length) {
        this.dialogAddGroup.show = true;
        this.dialogAddGroup.data = this.selectionData;
      }
    },
    addGroupSave(val) {
      addGroupUser(val).then(res => {
        if (res.isOK) {
          this.$message.success({
            message: this.$t('noticeMsg.AddSuccess'),
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
      }).catch(() => {});
    },
    addGroupClose(val) {
      this.dialogAddGroup.show = false;
    },
    init() {
      // 查列表排序
      getCustomColumns({ PageName: 'Agent', v: Math.random() }).then(res => {
        if (res) {
          this.drawer.columns = res;
          // 先清空再$nextTick赋值，处理数据改变但无渲染的问题
          if (this.tableColumnSet.length) {
            this.$set(this, 'tableColumnSet', []);
          }
          this.$nextTick(() => {
            this.$set(this, 'tableColumnSet', res.columnSet);
          });
        }
      });
      this.getList(this.initParam);
    },
    showDrawer() {
      this.drawer.show = true;
    },
    closeDrawer(val) {
      this.drawer.show = false;
      if (val === 'init') {
        this.init();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.searchRow {
  right: 44px;
  .edit-column {
    width: 36px;
    height: 36px;
    line-height: 38px;
    border-radius: 2px;
    border: 1px solid #e5e5e5;
    text-align: center;
    position: absolute;
    right: -40px;
    top: 0;
    cursor: pointer;
    svg {
      font-size: 24px;
      color: #999;
    }
  }
}
.el-tabs >>> .el-tabs__header {
  margin: 0;
}
.el-tabs >>> .el-tabs__nav-wrap {
  padding-left: 20px;
}
.el-tabs >>> .el-tabs__item {
  height: 52px;
  line-height: 52px;
}
.el-collapse >>> .el-collapse-item__arrow {
  position: absolute;
  left: 8px;
  top: 9px;
}
.el-drawer-wrapper >>> .el-drawer {
  min-width: 300px;
}
</style>
