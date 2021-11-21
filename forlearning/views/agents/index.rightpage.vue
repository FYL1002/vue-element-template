<template>
  <div class="css-ta8zni css-1a49fo61 right-wrapper">
    <el-tabs v-model="activeName" class="right-wrapper-tabs" @tab-click="handleClick">
      <el-tab-pane label="客服信息" name="info">
        <el-row class="tabs-title" type="flex" justify="space-between">
          <div class="label">客服信息</div>
        </el-row>
        <div v-if="dialogFormData" class="info-box">
          <el-row class="operate" type="flex" justify="space-between">
            <div class="label">操作</div>
            <el-tooltip :content="dialogFormData.loginAfterStatus === 'AcceptChats' ? '暂停服务':'恢复服务'" placement="top">
              <div v-if="permissionAll[$route.path] && permissionAll[$route.path].editService" class="operate-icon">
                <i class="el-icon el-icon-close-notification" @click="suspendFn()" />
              </div>
            </el-tooltip>
          </el-row>
          <el-row type="flex">
            <div class="label">姓名:</div>
            <div class="form-item">{{ dialogFormData.name }}</div>
          </el-row>
          <el-row type="flex">
            <div class="label">昵称:</div>
            <div class="form-item">{{ dialogFormData.nickName }}</div>
          </el-row>
          <el-row type="flex">
            <div class="label">邮箱:</div>
            <div class="form-item">{{ dialogFormData.email }}</div>
          </el-row>
          <el-row type="flex">
            <div class="label">最后登录时间:</div>
            <div class="form-item break-all">{{ dialogFormData.lastLoginOn | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</div>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="关联组别" name="relatedGroup">
        <el-row class="tabs-title" type="flex" justify="space-between">
          <div class="label">关联组别</div>
          <el-tooltip content="关联组别" placement="top">
            <div v-if="permissionAll[$route.path] && permissionAll[$route.path].addGroup" class="operate-icon">
              <i class="el-icon el-icon-plus" @click="relatedGroup()" />
            </div>
          </el-tooltip>
        </el-row>
        <div class="info-box table">
          <el-input v-model="initParam.groupNameContains" placeholder="输入组别名称搜索" class="input-with-select" size="medium" @keyup.enter.native="handSearchGroup">
            <el-button slot="append" type="primary" icon="el-icon-search" @click="handSearchGroup" />
          </el-input>
          <div class="table-wrapper">
            <div v-show="tableLoadingGroup" class="loading">
              <i class="el-icon el-icon-loading" />
            </div>
            <table>
              <thead>
                <tr>
                  <th>组别名称</th>
                  <th>组别描述</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,$index) in groupUserList" :key="$index">
                  <td>{{ item.groupName }}</td>
                  <td>{{ item.description }}</td>
                  <td class="text-align_center"><a v-if="permissionAll[$route.path] && permissionAll[$route.path].deleteGroup" class="el-icon el-icon-delete" @click="deleteGroupUser(item)" /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <el-row class="pagination" type="flex" justify="space-between">
            <div class="prev">
              <a class="prev-first" :class="{'disabled':paging.currentPage === 1 || groupUserList.length === 0}" @click="page('first')">&lt;&lt;</a><a :class="{'disabled':paging.currentPage === 1 || groupUserList.length === 0}" @click="page('prev')">&lt;上一页</a>
            </div>
            <div class="next">
              <a :class="{'disabled':paging.currentPage === paging.last || groupUserList.length === 0}" @click="page('next')">下一页&gt;</a><a class="next-last" :class="{'disabled':paging.currentPage === paging.last || groupUserList.length === 0}" @click="page('last')">&gt;&gt;</a>
            </div>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>

    <related-group v-if="dialogRelatedGroup.show" ref="relatedGroup" :agent-data="dialogRelatedGroup.data" @save="relatedGroupSave" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { copy } from '@/utils/common';
import { getGroupsUserList, addGroupUser, deleteGroupUser } from '@/api/groups';
import RelatedGroup from './right.relatedGroup';

export default {
  name: 'RightPage',
  components: { RelatedGroup },
  props: {
    // sync: {
    //   type: Boolean,
    //   default: false
    // },
    dialogFormData: {
      type: Object,
      required: false,
      default: null
    }
  },
  data() {
    return {
      activeName: 'info',
      groupUserList: [],
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
      dialogRelatedGroup: {
        show: false,
        data: {}
      },
      tableLoadingGroup: false
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
      if (n && this.activeName === 'relatedGroup') {
        this.getGroupsUserList();
      }
    }
  },
  created() {
  },
  methods: {
    init() {
      this.groupUserList = [];
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
    },
    handleClick(tab, event) {
      // console.log(tab, event);
      if (tab.name === 'relatedGroup' && !this.groupUserList.length) {
        this.getGroupsUserList();
      }
    },
    suspendFn() {
      this.$emit('suspend', this.dialogFormData);
    },
    getGroupsUserList() {
      this.tableLoadingGroup = true;
      this.initParam.Take = this.paging.pageSize;
      this.initParam.Skip = (this.paging.currentPage - 1) * this.initParam.Take;
      this.initParam.userId = this.dialogFormData.id;
      getGroupsUserList(this.initParam).then(data => {
        if (data.results.length) {
          this.groupUserList = data.results;
        } else {
          this.groupUserList = [];
        }
        this.paging.total = data.total;
        this.paging.last = Math.ceil(this.paging.total / this.paging.pageSize);
        setTimeout(() => {
          this.tableLoadingGroup = false;
        }, 300);
      });
    },
    handSearchGroup() {
      this.paging.currentPage = 1;
      this.getGroupsUserList();
    },
    relatedGroup() {
      this.dialogRelatedGroup.show = true;
      this.dialogRelatedGroup.data = copy(this.dialogFormData);
    },
    relatedGroupSave(data) {
      if (data) {
        addGroupUser(data).then(res => {
          if (res.isOK) {
            this.$message({ type: 'success', message: this.$t('noticeMsg.addedRelatedSuccess') });
            this.dialogRelatedGroup.show = false;
            this.getGroupsUserList();
          } else {
            this.$message({ type: 'error', message: this.$t('noticeMsg.addedRelatedFail') });
            this.$refs.relatedGroup.dialogBtnLoading = false;
          }
        });
      } else {
        this.dialogRelatedGroup.show = false;
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
      if (this.groupUserList.length === 0) return;
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
