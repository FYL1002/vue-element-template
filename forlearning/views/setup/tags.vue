<template>
  <div class="section-wrapper">
    <div class="sec-item">
      <h4 class="item-title">What are tags</h4>
      <p class="intro">Tags let you categorize your chats and tickets.</p>
      <el-form ref="form" :model="formData" label-width="120px">
        <el-form-item label-width="0" class="m-b-md ">
          <el-row type="flex" justify="start" align="middle">
            <el-input v-model="formData.name" class="tag-input" placeholder="Tag" />
            <el-button v-if="permissionAll[$route.path] && permissionAll[$route.path].add" type="primary" :loading="btnLoading" @click="addTag">Add a Tag</el-button>
          </el-row>
        </el-form-item>
        <el-form-item label-width="0" class="m-b-md">
          <el-checkbox v-model="formData.checked" class="check-row">Remind agents to tag finished chats</el-checkbox>
          <p class="check-intro">A short message reminding agents to tag chats will be displayed after each finished conversation.</p>
        </el-form-item>
      </el-form>
      <el-table
        ref="table"
        v-loading="tableLoading"
        :data="tableData"
      >
        <el-table-column label="" width="40" fixed>
          <template slot-scope="{row}">
            <el-tooltip v-if="permissionAll[$route.path] && permissionAll[$route.path].delete" class="item" effect="dark" content="delete" placement="bottom">
              <i class="el-icon el-icon-delete" @click="deleteTag(row)" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          label="Tag"
          min-width="150"
          prop="name"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{row}">
            <div class="tag-name">{{ row.name }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="Uses"
          min-width="100"
          prop="name"
          :show-overflow-tooltip="true"
        >
          <template>
            <div class="tag-uses">
              <p>0 chats</p>
              <p>0 tickets</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="Created By"
          min-width="100"
          prop="createdBy"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="Created On"
          min-width="155"
          prop="createdOn"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{row}">
            <span>{{ row.createdOn | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getTagList, addTag, deleteTag } from '@/api/setting';
import { mapGetters } from 'vuex';

export default {
  name: 'SettingTags',
  data() {
    return {
      formData: {
        checked: false
      },
      tableData: [],
      initParam: {
        orderByDesc: 'createdOn'
      },
      tableLoading: false,
      btnLoading: false
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
  mounted() {

  },
  methods: {
    getList() {
      this.tableLoading = true;
      getTagList(this.initParam).then(data => {
        this.tableData = data.results;

        setTimeout(() => {
          this.tableLoading = false;
        }, 500);
      }).catch(res => {
        this.tableLoading = false;
      });
    },
    addTag() {
      if (this.formData.name) {
        this.btnLoading = true;
        addTag({ name: this.formData.name }).then(res => {
          if (res.isOK) {
            this.formData.name = null;
            this.$message.success({ message: this.$t('noticeMsg.AddSuccess'), duration: 2000, showColse: true });
            this.getList();
          } else if (!res.responseStatus) {
            this.$message.error({ message: this.$t('noticeMsg.AddFail'), duration: 2000, showColse: true });
          } else {
            this.$message.error({ message: '标签' + this.$t('noticeMsg.alreadyExist'), duration: 2000 });
          }
          this.btnLoading = false;
        }).catch(res => {
          this.btnLoading = false;
        });
      }
    },
    deleteTag(item) {
      this.$confirm(this.$t('noticeMsg.deleteAsk'), this.$t('noticeMsg.info'), { confirmButtonText: this.$t('btns.ok'), cancelButtonText: this.$t('btns.cancel') }).then(() => {
        deleteTag({ id: item.id }).then(res => {
          if (res.isOK) {
            this.$message.success({ message: this.$t('noticeMsg.DeleteSuccess'), duration: 2000, showColse: true });
              this.getList();
          } else {
            this.$message.error({ message: this.$t('noticeMsg.DeleteFail'), duration: 2000, showColse: true });
          }
          this.btnLoading = false;
        }).catch(res => {
          this.btnLoading = false;
        });
      }).catch(() => { });
    }
  }
};
</script>

<style scoped lang="scss">
.section-wrapper {
  padding: 32px 50px 50px;
  font-size: 14px;
  color: #424d57;
  .sec-item {
    .item-title {
      line-height: 20px;
      font-size: 18px;
      margin-top: 0;
      padding-bottom: 10px;
      margin-bottom: 10px;
      border-bottom: 1px solid #dde2e6;
    }
    .intro {
      color: rgba(66, 77, 87, 0.8);
    }
  }
  >>> .el-form {
    .tag-input {
      width: 160px;
      margin-right: 20px;
    }
    .check-row {
      line-height: 20px;
      color: #424d57;
    }
    .check-intro {
      padding-left: 26px;
      line-height: 16px;
      margin: -8px 0 0;
      color: rgba(66, 77, 87, 0.8);
    }
  }
  >>> .el-table {
    .tag-name {
      display: inline-block;
      height: 22px;
      line-height: 22px;
      padding: 0 8px;
      border-radius: 4px;
      font-size: 12px;
      color: #fff;
      background-color: #ff9800;
    }
    .tag-uses {
      p {
        line-height: 20px;
        margin: 0;
        font-size: 12px;
      }
    }
  }
}
</style>
