<template>
  <div class="wrapper">
    <el-row class="m-b" type="flex" justify="end">
      <el-col :sm="14" :xs="24">
        <el-row class="m-b-xs">
          <el-input v-model="inputName" :placeholder="$t('menu.fields.enterMenuNameSearch')" class="input-with-select" size="medium" @keyup.enter.native="handSearch">
            <el-button slot="append" type="primary" icon="el-icon-search" @click="handSearch" />
          </el-input>
        </el-row>
      </el-col>
    </el-row>
    <el-table
      ref="multipleTable"
      v-loading="tableLoading"
      :data="tableData"
      :max-height="table.maxHeight"
      row-key="id"
      :default-expand-all="false"
      :tree-props="{children: 'childrens', hasChildren: 'hasChildren'}"
      @sort-change="sortChange"
      @selection-change="handleCurrentChange"
      @select-all="selectAll"
    >
      <el-table-column width="42" fixed type="selection" />
      <el-table-column :label="$t('menu.fields.name')" min-width="200" prop="name" :show-overflow-tooltip="true" />
      <el-table-column prop="icon" :label="$t('menu.fields.icon')" min-width="50">
        <template slot-scope="{row}">
          <span v-if="row.icon"><svg-icon :icon-class="row.icon" /></span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('menu.fields.sortIndex')" min-width="65" prop="sortIndex" />
      <el-table-column :label="$t('menu.fields.translate')" min-width="110" prop="translate" :show-overflow-tooltip="true" />
      <el-table-column :label="$t('menu.fields.menuType')" min-width="100" prop="type" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <div>{{ $t(enumObj.menuType[row.type]) }}</div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('menu.fields.menuStatus')" min-width="100" prop="menuStatus" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <div v-if="row.type!=3">{{ row.status == 2 ? $t(enumObj.menuStatus[2]) : $t(enumObj.menuStatus[1]) }}</div>
          <div v-else>--</div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('commonFields.createdOn')" min-width="155" prop="createdOn" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.createdOn | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="m-b footer-wrapper" type="flex" justify="end">
      <div>
        <el-button @click="cancel">{{ $t('btns.cancel') }}</el-button>
        <el-button v-if="permissionAll[$route.path] && permissionAll[$route.path].save" type="success" :loading="dialogBtnLoading" @click="save">{{ $t('btns.save') }}</el-button>
      </div>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getRoleMenuMenuList, getRoleMenuEdit } from '@/api/menu';
import enumFun from '@/utils/enum';
import { copy } from '@/utils/common';

export default {
    name: 'RoleMenu',
    components: {},
    data() {
        return {
          paging: {
              currentPage: 1,
              pageSize: 10,
              total: 0
          },
          initParam: {
              orderByDesc: 'createdOn',
              roleId: this.$route.query.id
          },
          tableData: [],
          selectionData: [],
          tableLoading: false,
          enumObj: {
              menuType: enumFun('menuType'),
              menuStatus: enumFun('menuStatus')
          },
          table: {
            maxHeight: 528, // 48+48*10
            order: 0,
            orderObj: {}, //  记录每行数据的排序号，用于搜索功能   例如：{活动管理: 1,活动列表:2,添加:3}
            expansion: {}
          },
          inputName: null,
          dialogBtnLoading: false,
          firstGet: 0
        };
    },
    computed: {
    ...mapGetters([
      'permissionAll'
    ])
  },
    created() {
      this.getList();
    },
    updated() {
      // updated事件执行的时候，页面和data数据已经保持同步了
      // this.toggleSelection(this.selectionData)
    },
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
        const arr = [];
        for (const key in this.table.orderObj) {
          if (this.inputName && key.indexOf(this.inputName) > -1) {
            arr.push(this.table.orderObj[key] - 1);
            this.toggleRowExpansion(this.table.expansion[key]);
          }
        }
        const tableWrapper = document.getElementsByClassName('el-table__body-wrapper')[0];
        const trs = tableWrapper.getElementsByTagName('tr');
        const tableFixedWrapper = document.getElementsByClassName('el-table__fixed-body-wrapper')[0];
        const fixedTrs = tableFixedWrapper.getElementsByTagName('tr');
        if (arr.length) {
          this.inputName && (tableWrapper.scrollTop = arr[0] * 48); // 设置滚动距离
        } else {
          this.inputName && this.$message({ type: 'warning', message: this.$t('menu.checkMenu') });
        }
        // 添加高亮
        for (let i = 0; i < trs.length; i++) {
          if (arr.indexOf(i) > -1 && this.inputName) {
            trs[i].style.backgroundColor = '#F5F7FA';
            fixedTrs[i].style.backgroundColor = '#F5F7FA';
          } else {
            trs[i].style.backgroundColor = 'white';
            fixedTrs[i].style.backgroundColor = 'white';
          }
        }
      },
      toggleSelection(rows, select) {
        select = select || false;
        if (rows) {
          if (rows instanceof Array) {
            rows.forEach(row => {
              this.$refs.multipleTable.toggleRowSelection(row, select);
            });
          } else {
            this.$refs.multipleTable.toggleRowSelection(rows, select);
          }
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleCurrentChange(rows) {
        this.selectionData = rows;
        // console.log(this.selectionData)
      },
      selectAll(selection) {
        // console.log(selection);
        // tabledata第一层只要有在selection里面就是全选
        const isSelect = selection.some(el => {
          const tableDataIds = this.tableData.map(j => j.id);
          return tableDataIds.includes(el.id);
        });
        // tableDate第一层只要有不在selection里面就是全不选
        const isCancel = !this.tableData.every(el => {
          const selectIds = selection.map(j => j.id);
          return selectIds.includes(el.id);
        });
        if (isSelect) {
          selection.map(el => {
            if (el.childrens) {
              el.childrens.map(j => {
                // console.log(j.childrens);
                if (j.childrens.length) {
                  j.childrens.map(k => {
                    if (k.childrens.length) {
                      k.childrens.map(m => {
                        this.toggleSelection(m, true);
                      });
                    }
                    this.toggleSelection(k, true);
                  });
                }
                this.toggleSelection(j, true);
              });
            }
          });
        }
        if (isCancel) {
          this.tableData.map(el => {
            if (el.childrens) {
              el.childrens.map(j => {
                // console.log(j.childrens);
                if (j.childrens.length) {
                  j.childrens.map(k => {
                    if (k.childrens.length) {
                      k.childrens.map(m => {
                        this.toggleSelection(m, false);
                      });
                    }
                    this.toggleSelection(k, false);
                  });
                }
                this.toggleSelection(j, false);
              });
            }
          });
        }
      },
      toggleRowExpansion(rows) {
        if (rows && rows.length) {
          rows.forEach((row) => {
            this.$refs.multipleTable.toggleRowExpansion(row, true);
          });
        }
      },
      addParentIdList(arr, ids, parent) {
        // 给每个菜单添加parentIdList字段，记录所有上级的id和自己的id
        if (arr.length > 0) {
          arr.forEach((item, index) => {
            this.table.order++;
            this.table.orderObj[item.name] = this.table.order;

            const list = item.parentId ? copy(ids) : [];
            list.push(item.id);
            item.parentIdList = list;

            var parentList = parent ? [...parent, item] : [item];
            this.table.expansion[item.name] = parent || null;

            if (item.roleId) {
              this.selectionData.push(item);
            }
            if (item.childrens && item.childrens.length) {
              this.addParentIdList(item.childrens, list, parentList);
            }
          });
        }
      },
      getList() {
        this.tableLoading = true;
        // console.log(this.initParam)
        getRoleMenuMenuList(this.initParam).then(data => {
          this.selectionData = [];
          this.table.order = 0;
          this.addParentIdList(data, []);
          this.tableData = data;
          // console.log(this.selectionData);
          this.$nextTick(() => {
            this.toggleSelection(this.selectionData, true);
          });
          setTimeout(() => {
            this.tableLoading = false;
          }, 500);
        });
      },
      cancel() {
        this.$router.push({
          path: '/urm/role/list'
        });
      },
      save() {
        // console.log('save');
        // console.log(this.selectionData);
        let arr = [];
        if (this.selectionData.length) {
          this.selectionData.forEach((item) => {
            arr.push(item.id);
          });
        } else {
          arr = null;
        }
        this.dialogBtnLoading = true;
        getRoleMenuEdit({ roleId: this.$route.query.id, MenuIds: arr }).then(data => {
          this.dialogBtnLoading = false;
          if (data.isOK) {
            this.$message({ type: 'success', message: this.$t('noticeMsg.saveSuccess') });
            this.$store.dispatch('menuPermission/getMenuInfo');
            // this.getList()
            setTimeout(() => {
              this.$router.push({
                path: '/urm/role/list'
              });
            }, 1000);
          } else {
            this.$message({ type: 'error', message: this.$t('noticeMsg.saveFail') });
          }
        });
      }
    }
};
</script>

<style lang="scss" scoped>
.wrapper >>> .footer-wrapper {
  margin-top: 20px;
}
.wrapper >>> .el-table {
  .el-table-column--selection {
    text-align: center;
  }
  .el-table__header-wrapper {
    th {
      background-color: #F6F8F8;
    }
  }
  .el-table__fixed {
    th:first-child {
      background-color: #F6F8F8;
    }
  }
}
</style>
