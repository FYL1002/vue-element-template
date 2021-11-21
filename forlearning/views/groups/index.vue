<template>
  <div class="css-1ob8ues css-1a49fo60">
    <div class="css-151x0d2 css-1a49fo61">
      <div class="wHeight">
        <el-row class="wrapper calcHeight p-9 b-b-dde2e6">
          <el-col :sm="8" :md="10" :lg="14" :xs="24">
            <el-button
              v-if="permissionAll[$route.path] && permissionAll[$route.path].add"
              class="p-8-10 p-10-20"
              type="success"
              size="medium"
              icon="el-icon-plus"
              @click="addOrEdit()"
            >{{ $t('btns.add') }}</el-button>
          </el-col>
          <el-col :sm="16" :md="14" :lg="10" :xs="24">
            <easy-search :easy-option="searchOption" @easyChange="searchChange" />
          </el-col>
        </el-row>
        <el-table
          id="elementTale"
          ref="groupsTable"
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
              <el-tooltip v-if="permissionAll[$route.path] && permissionAll[$route.path].edit" class="item" effect="dark" :content="$t('btns.edit')" placement="bottom">
                <i class="el-icon el-icon-edit" @click="addOrEdit(row)" />
              </el-tooltip>
              <el-tooltip v-if="permissionAll[$route.path] && permissionAll[$route.path].delete" class="item" effect="dark" :content="$t('btns.delete')" placement="bottom">
                <i class="el-icon el-icon-delete" @click="del(row)" />
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column :label="'组名'" min-width="80" prop="name" sortable="custom">
            <template slot-scope="{row}">
              <div>{{ row.name }}</div>
            </template>
          </el-table-column>
          <!-- <el-table-column :label="'成员'" min-width="110" prop="agent">
            <template slot-scope="{row}">
              <div
                class="css-1ocrak0 pointer"
                :title="item.userName"
                v-for="item in row.users"
                :key="item.userId"
              >
                <div class="css-5r5m5i">
                  <img src="@/assets/images/avatar.png" style="width:100%" />
                </div>
                <span
                  :class="item.agentLoggedStatus==2?'onLine css-10zmg9r':'offLine css-10zmg9r'"
                ></span>
              </div>
            </template>
          </el-table-column> -->
          <el-table-column :label="$t('commonFields.createdOn')" min-width="154" prop="createdOn" sortable="custom">
            <template slot-scope="{row}">
              <span>{{ row.createdOn | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="'描述'" min-width="100" prop="description" sortable="custom">
            <template slot-scope="{row}">
              <div>{{ row.description }}</div>
            </template>
          </el-table-column>
        </el-table>

        <pagination :total="paging.total" :pager-count="5" :page.sync="paging.currentPage" :limit.sync="paging.pageSize" @pagination="paginationChange" />
      </div>
    </div>

    <!-- 右侧 信息栏 -->
    <right-page ref="RightPage" :dialog-form-data="currentRow" @edit="addOrEdit" />
    <!-- 新增 -->
    <add-groups v-if="dialogBoolAdd" ref="AddGroups" :visible.sync="dialogBoolAdd" :dialog-form-data="dialogDataAdd" @dialogSave="ok" />
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex';
import {
  elementSize
} from '@/utils/common';
import Pagination from '@/components/Pagination';
import EasySearch from '@/components/EasySearch'; // 搜索组件

import {
  getGroupsList,
  delGroups
} from '@/api/groups';
import AddGroups from './index.add';
import RightPage from './index.rightpage';

export default {
  name: 'PriceCount',
  components: {
    Pagination,
    EasySearch,
    AddGroups,
    RightPage
  },
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
        orderByDesc: 'createdOn'
      },
      searchOption: {
        nameContains: {
          name: '组名',
          valueType: 2,
          isMoreTime: false
        }
      },
      activeNames: ['1', '2'],
      tableKey: 0,
      tableData: [],
      selectionData: [],
      currentRow: null,
      dialogBool: false,
      tableLoading: false,
      dialogType: '',
      dialogData: {},
      dialogBoolAdd: false,
      dialogDataAdd: {}
    };
  },
  computed: {
    ...mapGetters([
      'tableHeight',
      'permissionAll'
    ])
  },
  created() {
    this.getList(this.initParam);
  },
  mounted() {
    // 高度适应
    this.$nextTick(() => {
      elementSize();
    });
  },

  methods: {
    selectTable(val) {
      this.selectionData = val;
    },
    tableRowClassName({
      row,
      rowIndex
    }) {
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
      // this.initParam.Take = this.paging.pageSize
      // this.initParam.Skip = (this.paging.currentPage - 1) * this.initParam.Take

      var objParams = params;
      objParams.V = Math.random();

      getGroupsList(objParams).then(data => {
        this.tableLoading = false;
        if (data.results && data.results.length !== 0) {
          this.tableData = data.results;
          this.paging.total = data.total;
          this.$refs.groupsTable.setCurrentRow(this.tableData[0]);
        } else {
          this.tableData = [];
        }
      }).catch(errormsg => {
        this.tableLoading = false;
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
        orderByDesc: 'createdOn'
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
    addOrEdit(item) {
      this.dialogBoolAdd = true;
      if (item) {
        this.dialogDataAdd = item;
      } else {
        this.dialogDataAdd = {};
      }
    },
    del(row) {
      var selectedObjs = this.selectionData;
      var delIds = [];
      if (row) {
        delIds.push(row.id);
      } else {
        if (selectedObjs.length !== 0) {
          selectedObjs.forEach(function(item) {
            delIds.push(item.id);
          });
        }
      }
      if (delIds.length <= 0) {
        this.$message.warning({
          message: this.$t('noticeMsg.chooseOne'),
          duration: 2000,
          showColse: true
        });
        return;
      } else {
        this.$confirm(
            this.$t('noticeMsg.deleteAsk'),
            this.$t('noticeMsg.info'), {
              confirmButtonText: this.$t('btns.ok'),
              cancelButtonText: this.$t('btns.cancel'),
              customClass: 'confirmClass'
            })
          .then(() => {
            const idStr = delIds.join(',');

            delGroups({
              id: idStr
            }).then(resp => {
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
            }).catch(() => {
              // this.$message.error({
              //   message: this.$t('noticeMsg.DeleteFail'),
              //   duration: 2000,
              //   showColse: true
              // })
            });
          })
          .catch(() => {});
      }
    },
    InviteFn() {
      //   if (this.selectionData.length <= 0) {
      //     this.$message.warning({
      //       message: this.$t('noticeMsg.chooseOne'),
      //       duration: 2000,
      //       showColse: true
      //     })
      //     return;
      //   } else if (this.selectionData.length > 1) {
      //     this.$message.warning({
      //       message: this.$t('noticeMsg.almostOne'),
      //       duration: 2000,
      //       showColse: true
      //     })
      //     return;
      //   } else {
      this.dialogBoolInvite = true;
      this.dialogDataInvite = this.selectionData[0];
      // }
    },
    ok() {
      this.getList(this.initParam);
    }
  }
};
</script>

<style lang="scss">
.p-10-20 {
  padding: 10px 20px;
}
</style>

<style lang="scss" scoped>
.el-collapse {
  border: none;
}

.el-collapse>>>.el-collapse-item__header {
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

.el-collapse>>>.el-collapse-item__wrap {
  border: none;
}

.el-collapse>>>.el-collapse-item__arrow {
  position: absolute;
  left: 8px;
  top: 9px;
}
</style>
