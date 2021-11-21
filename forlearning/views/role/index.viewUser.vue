<template>
  <el-dialog class="dialog-wrapper" :title="'查看用户'" :visible="true" :before-close="close" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-row class="m-b" type="flex" justify="end">
      <el-col :md="18" :xs="24">
        <el-row class="m-b-xs">
          <el-input v-model="initParam.userNameContains" placeholder="输入用户名称搜索" class="input-with-select" size="medium" @keyup.enter.native="handSearch">
            <el-button slot="append" type="primary" icon="el-icon-search" @click="handSearch" />
          </el-input>
        </el-row>
      </el-col>
    </el-row>
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      border
      highlight-current-row
      @selection-change="handleCurrentChange"
      @sort-change="sortChange"
    >
      <el-table-column label="用户名" width="120" prop="userName" sortable="custom" />
      <el-table-column label="真实姓名" width="100" prop="realName" sortable="custom" />
      <el-table-column label="用户昵称" min-width="100" prop="nickName" sortable="custom" />
    </el-table>

    <pagination v-show="paging.total>0" :total="paging.total" :pager-count="5" :page.sync="paging.currentPage" :limit.sync="paging.pageSize" @pagination="getList" />

  </el-dialog>
</template>

<script>
import Pagination from '@/components/Pagination';
import { getRoleUserList } from '@/api/urm';

export default {
  name: 'UserView',
  components: { Pagination },
  props: {
    moduleData: {
      type: Object,
      required: false,
      default: null
    }
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
          orderByDesc: 'createdOn',
          roleId: this.moduleData.id
      },
      tableData: [],
      selectionData: [],
      tableLoading: false,
      inputName: ''
    };
  },
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    sortChange(val) {
      // console.log(val);
      if (val.order === 'ascending') {
        this.initParam.orderBy = val.prop;
        delete this.initParam.orderByDesc;
      } else if (val.order === 'descending') {
        this.initParam.orderByDesc = val.prop;
        delete this.initParam.orderBy;
      } else {
        this.initParam.orderByDesc = 'createdOn';
        delete this.initParam.orderBy;
      }
      this.getList();
    },
    handSearch() {
      // console.log('click success')
      this.getList();
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleCurrentChange(rows) {
      this.selectionData = rows;
      // console.log(this.selectionData)
    },
    getList() {
      this.tableLoading = true;
      this.initParam.Take = this.paging.pageSize;
      this.initParam.Skip = (this.paging.currentPage - 1) * this.initParam.Take;
      // console.log(this.initParam)
      getRoleUserList(this.initParam).then(data => {
          this.tableData = data.results;
          this.paging.total = data.total;

          setTimeout(() => {
              this.tableLoading = false;
          }, 500);
      });
    },
    close() {
      this.$emit('viewUserDialogSave', null);
    }
  }

};
</script>

<style scoped lang="scss">
  .dialog-wrapper >>> .el-dialog {
    margin-top: 10vh !important;
    .el-table {
      max-height: 400px;
      overflow-y: scroll;
    }
    .el-table::before {
      display: none;
    }
  }

</style>
