<template>
  <div class="wrapper wHeight">
    <el-row class="m-b calcHeight">
      <el-col :sm="10" :xs="24" class="m-b-xs">
        <el-button
          v-if="permissionAll[$route.path] && permissionAll[$route.path].add"
          type="success"
          size="medium"
          icon="el-icon-plus"
          @click="edit(null)"
        >{{ $t('btns.add') }}</el-button>
      </el-col>
      <el-col :sm="14" :xs="24">
        <el-row class="m-b-xs">
          <!-- <el-input
            v-model="initParam.nameContains"
            :placeholder="$t('role.search')"
            class="input-with-select"
            size="medium"
            @keyup.enter.native="handSearch"
          >
            <el-button slot="append" type="primary" icon="el-icon-search" @click="handSearch" />
          </el-input> -->
          <easy-search :easy-option="searchOption" @easyChange="handSearch" />
        </el-row>
      </el-col>
    </el-row>
    <el-table v-loading="tableLoading" :data="tableData" border :max-height="tableHeight" class="table-fixed-left" @selection-change="selectTable" @sort-change="sortChange">
      <el-table-column width="40" type="selection" fixed />
      <el-table-column :label="$t('commonFields.operation')" width="120" fixed>
        <template slot-scope="{row}">
          <el-tooltip v-if="permissionAll[$route.path] && permissionAll[$route.path].edit" class="item" effect="dark" :content="$t('role.editRole')" placement="bottom">
            <i class="el-icon el-icon-edit" @click="edit(row)" />
          </el-tooltip>
          <el-tooltip v-if="permissionAll[$route.path] && permissionAll[$route.path].delete" class="item" effect="dark" :content="$t('role.deleteRole')" placement="bottom">
            <i class="el-icon el-icon-delete" @click="del(row)" />
          </el-tooltip>
          <el-tooltip v-if="permissionAll[$route.path] && permissionAll[$route.path].permissionSetting" class="item" effect="dark" :content="$t('role.authorization')" placement="bottom">
            <i class="el-icon el-icon-setting" @click="goRoleMenu(row)" />
          </el-tooltip>
          <el-tooltip v-if="permissionAll[$route.path] && permissionAll[$route.path].addRelatedUser" class="item" effect="dark" :content="$t('role.relatedUser')" placement="bottom">
            <i class="el-icon el-icon-user" @click="addRelatedUser(row)" />
          </el-tooltip>
          <!-- <i class="el-icon" v-bind:title="'查看用户'" @click="goViewUser(row)"><svg-icon icon-class="user_view" /></i> -->
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('role.fields.name')"
        min-width="120"
        prop="name"
        sortable="custom"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        :label="$t('role.fields.description')"
        min-width="150"
        prop="description"
        sortable="custom"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        :label="$t('commonFields.createdBy')"
        min-width="120"
        prop="createdBy"
        sortable="custom"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        :label="$t('commonFields.createdOn')"
        min-width="155"
        prop="createdOn"
        sortable="custom"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="{row}">
          <span>{{ row.createdOn | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('commonFields.updatedBy')"
        min-width="120"
        prop="updatedBy"
        sortable="custom"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        :label="$t('commonFields.updatedOn')"
        min-width="155"
        prop="updatedOn"
        sortable="custom"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="{row}">
          <span>{{ row.updatedOn | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="paging.total"
      :pager-count="5"
      :page.sync="paging.currentPage"
      :limit.sync="paging.pageSize"
      @pagination="getList"
    />
    <!-- <el-dialog
      :title="dialogType=='add'?$t('role.addRole'):$t('role.editRole')"
      :visible.sync="dialogBool"
    >
      <el-form ref="dialogForm" :model="dialogData" label-width="120px" :rules="rules">
        <el-form-item :label="$t('role.fields.name')" prop="name">
          <el-input v-model="dialogData.name" maxlength="50" />
        </el-form-item>
        <el-form-item :label="$t('role.fields.description')" prop="description">
          <el-input v-model="dialogData.description" maxlength="300" />
        </el-form-item>
        <el-form-item :label="$t('role.fields.copyRole')" v-if="dialogType=='add'">
          <el-select v-model="dialogData.copyRoleId" :placeholder="$t('role.fields.choosableCopyRole')" class="width100">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBool=false">{{$t('btns.cancel')}}</el-button>
        <el-button type="primary" @click="ok" :loading="disabledBool">{{$t('btns.ok')}}</el-button>
      </div>
    </el-dialog> -->

    <add-role v-if="addRoleData.show" ref="addRole" :module-data="addRoleData.data" @addRoleDialogSave="addRole" />
    <view-user
      v-if="viewUserData.show"
      :module-data="viewUserData.data"
      @viewUserDialogSave="viewUser"
    />
    <related-user
      v-if="dialogBoolRelated"
      ref="relatedUser"
      :user-data="dialogDataRelated"
      @dialogSave="relatedUser"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Pagination from '@/components/Pagination';
import { getRoleList, delRole, addRoleUser } from '@/api/urm';
import ViewUser from './index.viewUser';
import RelatedUser from './index.related';
import { elementSize } from '@/utils/common';
import EasySearch from '@/components/EasySearch'; // 搜索组件
import AddRole from './index.addRole';

export default {
  name: 'Role',
  components: { Pagination, ViewUser, RelatedUser, EasySearch, AddRole },
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
      tableData: [],
      selectionData: [],
      dialogBool: false,
      tableLoading: false,
      dialogData: {},
      disabledBool: false, // 控制重复点击
      dialogType: '',
      dialogBoolRelated: false,
      dialogDataRelated: {},
      addRoleData: {
        show: false,
        data: {}
      },
      viewUserData: {
        show: false,
        data: {}
      },
      roleList: [],
      searchOption: {
        NameContains: {
          name: 'role.fields.name', valueType: 2, isMoreTime: false
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
    this.getList();
  },
  mounted() {
    this.$nextTick(() => {
      elementSize();
    });
  },
  methods: {
    sortChange(val) {
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
    handSearch(data) {
      if (data && Object.keys(data).length > 0) {
        this.initParam = { ...this.initParam, ...data };
      } else if (data && Object.keys(data).length === 0) {
        // 空对象既初始化条件
        this.initParam = {
            orderByDesc: 'createdOn'
        };
      }
      this.paging.currentPage = 1;
      this.getList();
    },
    selectTable(val) {
      this.selectionData = val;
    },
    getList() {
      this.tableLoading = true;
      this.initParam.Take = this.paging.pageSize;
      this.initParam.Skip = (this.paging.currentPage - 1) * this.initParam.Take;
      // console.log(this.initParam);
      getRoleList(this.initParam).then(data => {
        this.tableData = data.results;
        this.paging.total = data.total;

        setTimeout(() => {
          this.tableLoading = false;
        }, 500);
      }).catch(res => {
        this.tableLoading = false;
      });
    },
    resetDialog() {
      this.dialogData = {};
    },
    creat() {
      this.dialogType = 'add';
      this.dialogBool = true;
      this.resetDialog();
      this.$nextTick(() => {
        this.$refs['dialogForm'].clearValidate();
      });
    },
    edit(row) {
      if (row) {
        this.addRoleData.data = row;
      } else {
        this.addRoleData.data = {};
      }
      this.addRoleData.show = true;
    },
    del(val) {
      this.$confirm(this.$t('noticeMsg.deleteAsk'), this.$t('noticeMsg.info'),
        { confirmButtonText: this.$t('btns.ok'), cancelButtonText: this.$t('btns.cancel') }).then(() => {
          const ids = [];
          ids.push(val.id);
          delRole({ ids }).then((resp) => {
            if (resp.isOK) {
              this.$message.success({ message: this.$t('noticeMsg.DeleteSuccess'), duration: 2000, showColse: true });
              this.getList();
            } else {
              this.$message.error({ message: this.$t('noticeMsg.DeleteFail'), duration: 2000, showColse: true });
            }
          }).catch(() => { this.$message.error({ message: this.$t('noticeMsg.DeleteFail'), duration: 2000, showColse: true }) });
        }).catch(() => { });
    },
    addRole(data) {
      this.addRoleData.show = false;
      if (data) {
        this.getList();
      }
    },
    goRoleMenu(row) {
      this.$router.push({
        path: 'roleMenu',
        query: { id: row.id }
      });
    },
    viewUser(data) {
      this.viewUserData.show = false;
    },
    addRelatedUser(item) {
      this.dialogBoolRelated = true;
      this.dialogDataRelated = item || this.selectionData[0];
    },
    relatedUser(data) {
      if (data) {
        addRoleUser(data).then(data => {
          // console.log(data)
          if (data.isOK) {
            this.dialogBoolRelated = false;
            this.$message({ type: 'success', message: this.$t('noticeMsg.addedRelatedSuccess') });
            this.getList();
          } else {
            this.$refs.relatedUser.dialogBtnLoading = false;
            if (data.responseStatus && data.responseStatus.errorCode === 'ReRoleUser') {
              this.$message({ type: 'error', message: this.$t('role.roleHaveRelatedTheUser') });
            } else {
              this.$message({ type: 'error', message: this.$t('noticeMsg.addedRelatedFail') });
            }
          }
        });
      } else {
        this.dialogBoolRelated = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper >>> .el-dialog {
  .width100 {
    width: 100%;
  }
}
</style>
