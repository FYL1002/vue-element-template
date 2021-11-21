<template>
  <el-dialog
    class="dialog-wrapper"
    title="可选组别"
    :visible="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form ref="dialogForm" :model="dialogForm" label-width="120px" :rules="rules">
      <el-form-item label-width="0px">
        <el-select
          v-model="dialogForm.groupIds"
          multiple
          filterable
          remote
          clearable
          reserve-keyword
          placeholder="输入组别名称搜索"
          :remote-method="remoteMethod"
          :loading="loading"
          popper-class="relatedSelect"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">{{ $t('btns.cancel') }}</el-button>
      <el-button type="primary" :loading="dialogBtnLoading" @click="save('dialogForm')">{{ $t('btns.related') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getGroupsUserGroupList } from '@/api/groups';

export default {
  name: 'RelatedGroup',
  components: {},
  props: {
    agentData: {
      type: Object,
      required: false,
      default: () => { return {} }
    }
  },
  data() {
    // console.log(this.userData);
    return {
      rules: {
        groupIds: [{
          required: true,
          message: '组名' + this.$t('noticeMsg.NotEmpty'),
          trigger: 'change'
        }]
      },
      dialogForm: {},
      dialogBtnLoading: false,
      options: [],
      list: [],
      loading: false
    };
  },
  created() { },
  mounted() {},
  methods: {
    close() {
      this.$emit('save', null);
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        getGroupsUserGroupList({ nameContains: query, orderByDesc: 'createdOn', userId: this.agentData.id, isSelected: false }).then(data => {
          this.loading = false;
          if (data.results) {
            this.list = data.results;
            this.options = this.list.filter(item => {
              return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
            });
          }
        });
      } else {
        this.options = [];
      }
    },
    save() {
      // console.log(this.dialogForm.groupIds);
      // console.log(this.agentData);
      if (this.dialogForm.groupIds.length) {
        const arr = [];
        this.dialogForm.groupIds.forEach(item => {
          const obj = {
            userId: this.agentData.id,
            groupId: item
          };
          arr.push(obj);
        });
        this.dialogBtnLoading = true;
        this.$emit('save', { request: arr });
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.el-select{
    width:100%;
}
</style>
