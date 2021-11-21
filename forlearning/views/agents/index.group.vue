<template>
  <el-dialog :title="'选择群组'" :visible="true" :close-on-click-modal="false" @close="close">
    <el-form ref="dialogForm" :model="dialogData" label-width="120px" :rules="rules">
      <el-form-item :label="'组名'" prop="groupId">
        <!-- <el-select v-model="dialogData.groupsIds" multiple filterable style="width:100%">
          <el-option
            v-for="item in groupsList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select> -->
        <el-select
          v-model="dialogData.groupId"
          filterable
          remote
          clearable
          reserve-keyword
          placeholder="输入群组名称查询"
          :remote-method="getGroupsList"
          :loading="loading"
          popper-class="relatedSelect"
          style="width:100%"
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
      <el-button
        type="success"
        :loading="dialogBtnLoading"
        @click="save('dialogForm')"
      >{{ $t('btns.ok') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  getGroupsList
} from '@/api/groups';

export default {
  name: 'AddGroup',
  props: {
    agentData: {
      type: Array,
      required: false,
      default: null
    }
  },
  data() {
    return {
      dialogData: {},
      loading: false,
      dialogBtnLoading: false,
      rules: {
        groupId: [{
          required: true,
          message: '组名' + this.$t('noticeMsg.NotEmpty'),
          trigger: 'change'
        }]
      },
      options: [],
      list: []
    };
  },
  computed: {
  },
  created() {
    // this.getGroupsList();
  },
  methods: {
    getGroupsList(query) {
      if (query !== '') {
        this.loading = true;
        getGroupsList({ NameContains: query }).then(data => {
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
    save(name) {
      // console.log(this.agentData);
      this.$refs[name].validate((valid, messages) => {
        if (valid) {
          const arr = [];
          this.agentData.forEach(item => {
            arr.push({
              userId: item.id,
              groudId: this.dialogData.groupId
            });
          });
          this.$emit('save', { request: arr });
        }
      });
    },
    close() {
      this.$emit('close', false);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
