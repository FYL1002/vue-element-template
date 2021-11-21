<template>
  <div class="section-wrapper">
    <div class="quick-reply-group">
      <div class="group-title">
        {{ $t('settings.addQuickReplyGroup') }}
        <i v-if="permissionAll[$route.path] && permissionAll[$route.path].addGroup" class="el-icon el-icon-plus" @click="addGroup()" />
      </div>
      <div class="group-list">
        <div :class="{'active': chooseIndex == 'All', 'all': true}" @click="getFastWordList('All')">{{ $t('settings.allGroup') }}<span v-if="chooseIndex === 'All'" style="position: absolute;right: 15px;">
          <i class="el-icon el-icon-right" />
        </span>
        </div>
        <draggable v-model="visibleList" :options="options" @update="datadragEnd">
          <div v-for="(item,$index) in visibleList" :key="$index" :class="{'active': chooseIndex == $index, 'drag-item': true}" @click="toWaiting(item,$index)">
            <div style="display: flex;">
              <div class="group-name">
                <el-tooltip placement="bottom" effect="light" :content="item.name" popper-class="toolp">
                  <i class="el-icon">{{ item.name }}</i>
                </el-tooltip>
              </div>
              <span class="hover-show">
                <el-tooltip v-if="permissionAll[$route.path] && permissionAll[$route.path].addQuickReply" class="item" effect="dark" content="添加" placement="bottom">
                  <i class="el-icon el-icon-plus" @click.stop="addQuickReply(item)" />
                </el-tooltip>
                <el-tooltip v-if="permissionAll[$route.path] && permissionAll[$route.path].editGroup" class="item" effect="dark" content="编辑" placement="bottom">
                  <i class="el-icon el-icon-edit" @click.stop="addGroup(item)" />
                </el-tooltip>
                <el-tooltip v-if="permissionAll[$route.path] && permissionAll[$route.path].delGroup" class="item" effect="dark" content="删除" placement="bottom">
                  <i class="el-icon el-icon-delete" @click.stop="delGroup(item)" />
                </el-tooltip>
              </span>
            </div>
            <span v-if="chooseIndex === $index" style="position: absolute;right: 15px;">
              <i class="el-icon el-icon-right" />
            </span>
          </div>
        </draggable>
      </div>
    </div>
    <div class="reply-detail-list">
      <div class="search">
        <div class="cInput">
          <!-- <el-input v-model="channelValue" placeholder="请输入频道名称" clearable @keyup.enter.native="searchChannel()" /> -->
          <el-input v-model="searchValue" placeholder="请输入内容" prefix-icon="el-icon-search" clearable @keyup.enter.native="search()" />
        </div>
        <div class="cBtns">
          <el-button type="primary" size="medium" icon="el-icon-search" @click="search()" />
        </div>
      </div>
      <div v-if="chooseIndex !== 'All'" class="detail-table-title">
        {{ visibleList[chooseIndex].name }}
      </div>
      <el-table ref="table" v-loading="tableLoading" :class="{'reply-detail-table': true, 'choose-all': chooseIndex === 'All'}" :data="detailList">
        <el-table-column label="操作" width="150" fixed>
          <template slot-scope="{row}">
            <!-- <el-tooltip v-if="permissionAll[$route.path] && permissionAll[$route.path].delQuickReply" class="item" effect="dark" content="删除" placement="bottom">
              <i class="el-icon el-icon-delete" @click="delQuickReply(row)">删除</i>
            </el-tooltip>
            <el-tooltip v-if="permissionAll[$route.path] && permissionAll[$route.path].editQuickReply" class="item" effect="dark" content="编辑" placement="bottom">
              <i class="el-icon el-icon-edit" @click="addQuickReply(row, row.id)">编辑</i>
            </el-tooltip> -->
            <span v-if="permissionAll[$route.path] && permissionAll[$route.path].delQuickReply" class="edit-quick-reply" @click="delQuickReply(row)">删除</span>
            <span v-if="permissionAll[$route.path] && permissionAll[$route.path].editQuickReply" class="edit-quick-reply" @click="addQuickReply(row, row.id)">编辑</span>
          </template>
        </el-table-column>
        <el-table-column label="内容" min-width="200" prop="content" :show-overflow-tooltip="true">
          <template slot-scope="{row}">
            <div class="tag-name" v-html="row.showContent" />
          </template>
        </el-table-column>
      </el-table>

      <pagination :total="paging.total" :pager-count="5" :page.sync="paging.currentPage" :limit.sync="paging.pageSize" @pagination="paginationChange" />
    </div>

    <!-- 新增组 -->
    <add-groups v-if="dialogBoolAddGroup" ref="AddQuickReplyGroup" :visible.sync="dialogBoolAddGroup" :dialog-form-data="dialogDataAddGroup" @dialogSave="okGroup" />
    <!-- 新增回复 -->
    <add-quick-reply v-if="dialogBoolAdd" ref="AddQuickReply" :visible.sync="dialogBoolAdd" :dialog-form-data="dialogDataAdd" @dialogSave="ok" />
  </div>
</template>

<script>
  import draggable from 'vuedraggable';
  import Pagination from '@/components/Pagination';
  import { getFastWordGroup, delFastWordGroup, getFastWord, delFastWord, setGroupSort } from '@/api/setting';
  import addGroups from './quickReplyGroup.add';
  import addQuickReply from './quickReply.add';
  import { copy } from '@/utils/common';
  import { mapGetters } from 'vuex';
  export default {
    name: 'SettingQuickReply',
    components: {
      draggable,
      addGroups,
      addQuickReply,
      Pagination
    },
    data() {
      return {
        paging: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        initParam: {
          Take: 10,
          Skip: 0
        },
        visibleList: [],
        dialogBoolAddGroup: false,
        dialogDataAddGroup: {},
        dialogBoolAdd: false,
        dialogDataAdd: {},
        detailList: [],
        searchValue: '',
        isSearch: false,
        options: {
          animation: 200,
          filter: '.undraggable',
          disabled: false
        },
        chooseIndex: 'All',
        tableLoading: false
      };
    },
    computed: {
      ...mapGetters([
        'permissionAll'
      ])
    },
    watch: {
      searchValue(val) {
        // 如果有搜索内容
        this.detailList = this.detailList.map(item => {
          const idx = item.content.indexOf(this.searchValue);
          if (idx >= 0) {
            item.showContent = item.content.substring(0, idx) + `<span style="background-color: #ccc;">${this.searchValue}</span>` + item.content.substring(idx + this.searchValue.length, item.content.length);
          } else {
            item.showContent = item.content;
          }
          return item;
        });
      }
    },
    created() {
      this.getAllGroup();
      this.getFastWordList();
    },
    mounted() {
    },
    destroyed() {
      this.$root.eventHub.$off('MasterSwitch');
    },
    methods: {
      getAllGroup() {
        getFastWordGroup({
          orderBy: 'sort'
        }).then(resp => {
          if (resp.results && resp.results.length !== 0) {
            const havesort = resp.results.filter(item => item.sort);
            const havenosort = resp.results.filter(item => !item.sort).sort((item1, item2) => +new Date(item1.createdOn) > +new Date(item2.createdOn) ? 1 : -1);
            this.visibleList = havesort.concat(havenosort);
            if (this.chooseIndex === 'All') {
              this.getFastWordList('All');
            } else {
              this.getFastWordList();
            }
          } else {
            this.visibleList = [];
          }
        });
      },
      delGroup(item) {
        this.$confirm(
          this.$t('noticeMsg.delGroupInfo').replace(/{groupName}/, `<span style="font-size: 16px; font-weight: bold;word-break: break-all;">${item.name}</span>`),
          this.$t('noticeMsg.delGroupTitle'), {
          confirmButtonText: this.$t('btns.ok'),
          cancelButtonText: this.$t('btns.cancel'),
          customClass: 'confirmClass',
          dangerouslyUseHTMLString: true
        }).then(() => {
          delFastWordGroup(item).then(resp => {
            if (resp.isOK) {
              this.$message.success({
                message: this.$t('noticeMsg.DeleteSuccess'),
                duration: 2000,
                showColse: true
              });
              this.getAllGroup();
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
      delQuickReply(item) {
        this.$confirm(
          this.$t('noticeMsg.delQuickReplyInfo').replace(/{quickReplyContent}/, `<span style="font-size: 16px; font-weight: bold;word-break: break-all;">${item.content}</span>`),
          this.$t('noticeMsg.delQuickReplyTitle'), {
          confirmButtonText: this.$t('btns.ok'),
          cancelButtonText: this.$t('btns.cancel'),
          customClass: 'confirmClass',
          dangerouslyUseHTMLString: true
        }).then(() => {
          delFastWord(item).then(resp => {
            if (resp.isOK) {
              this.$message.success({
                message: this.$t('noticeMsg.DeleteSuccess'),
                duration: 2000,
                showColse: true
              });
              this.getAllGroup();
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
      datadragEnd(evt) {
        if (this.chooseIndex === evt.oldIndex) {
          this.chooseIndex = evt.newIndex;
        } else if (this.chooseIndex >= evt.newIndex && this.chooseIndex < evt.oldIndex) {
          this.chooseIndex++;
        } else if (this.chooseIndex <= evt.newIndex && this.chooseIndex > evt.oldIndex) {
          this.chooseIndex--;
        }
        setGroupSort({
          request: this.visibleList
        }).then(data => {
          //
        });
        evt.preventDefault();
      },
      toWaiting(val, $index) {
        this.chooseIndex = $index;
        this.initParam.Skip = 0;
        this.paging.currentPage = 1;
        this.getFastWordList();
      },
      addGroup(item) {
        this.dialogBoolAddGroup = true;
        if (item) {
          this.dialogDataAddGroup = item;
        } else {
          this.dialogDataAddGroup = {};
        }
      },
      // 分组添加不传type，内容编辑传type
      addQuickReply(item, type) {
        this.dialogBoolAdd = true;
        const obj = copy(item);
        if (!type) {
          obj.groupId = obj.id;
          delete obj.id;
        }
        this.dialogDataAdd = obj;
      },
      search() {
        if (this.searchValue) {
          this.isSearch = true;
          this.getFastWordList();
        } else {
          this.isSearch = false;
          this.getFastWordList();
        }
      },
      // 查询所有传type，查询分组不传
      getFastWordList(type) {
        if (type) {
          this.chooseIndex = 'All';
          this.initParam.Skip = 0;
          this.paging.currentPage = 1;
        }
        if (this.isSearch) {
          this.initParam.Skip = 0;
          this.paging.currentPage = 1;
        }
        this.tableLoading = true;
        const postData = {
          ...this.initParam,
          orderByDesc: 'createdOn'
        };
        if (this.isSearch) {
          postData.ContentContains = this.searchValue;
        }
        if (this.chooseIndex !== 'All') {
          postData.groupId = this.visibleList[this.chooseIndex].id;
        }
        getFastWord(postData).then(resp => {
          if (resp.results && resp.results !== 0) {
            this.detailList = resp.results;
            // 如果有搜索内容
            this.detailList = this.detailList.map(item => {
              let idx = -1;
              this.searchValue && (idx = item.content.indexOf(this.searchValue));
              if (idx >= 0) {
                item.showContent = item.content.substring(0, idx) + `<span style="background-color: #ccc;">${this.searchValue}</span>` + item.content.substring(idx + this.searchValue.length, item.content.length);
              } else {
                item.showContent = item.content;
              }
              return item;
            });
            this.tableLoading = false;
            this.paging.total = resp.total;
            this.$refs.table.setCurrentRow(this.detailList[0]);
          } else {
            this.detailList = [];
          }
        });
      },
      paginationChange() {
        this.initParam.Take = this.paging.pageSize;
        this.initParam.Skip = (this.paging.currentPage - 1) * this.initParam.Take;
        this.getFastWordList();
      },
      okGroup() {
        this.getAllGroup();
      },
      ok() {
        this.getFastWordList();
      }
    }
  };
</script>
<style scoped lang="scss">
  .section-wrapper {
    display: flex;
    width: 100%;
    height: 100%;
  }
  .el-icon-plus {
    border: 1px solid #333;
    border-radius: 5px;
    margin-left: 5px;
    font-size: 12px;
    width: 14px;
    height: 14px;
    padding-top: 1px;
    text-align:center;
  };
  .quick-reply-group {
    min-width: 300px;
    height: 100%;
    .group-title {
      padding: 15px 0;
      text-align: center;
      border-bottom: 1px solid #cbd4de;
      .el-icon-plus{
        cursor: pointer;
      }
    }
    .group-list {
      height: calc(100% - 55px);
      overflow-y: auto;
      .drag-item, .all {
        height: 50px;
        line-height: 50px;
        padding: 0 15px;
        cursor: pointer;
        position: relative;
        .hover-show{
          display: none;
          margin-left: 10px;
        }
      }
      .drag-item:hover .hover-show{
        display: inline;
      }
      .active{
        display: flex;
        background-color: #f1f1f1;
      }
    }
  }
  .reply-detail-list {
    padding: 30px;
    width: 100%;
    height: 100%;
    border-left: 1px solid #eee;
    min-width: 700px;
    position: relative;
  }
  .reply-detail-table{
    max-height: calc(100% - 100px);
    overflow-y: auto;
  }
  .reply-detail-table.choose-all{
    margin-top: 50px;
  }
  .detail-table-title{
    height: 50px;
    line-height: 50px;
  }
  .group-name{
    max-width: 160px;
    overflow: hidden;
    font-size: 14px;
    white-space: nowrap;
    word-break: keep-all;
    text-overflow: ellipsis;
    .el-icon {
      font-style: normal;
    }
  }
  .edit-quick-reply {
    color: #409eff;
    text-decoration: underline;
    cursor: pointer;
  }
  .search {
    display: flex;
    position: fixed;
    right: 10px;
  }
</style>
