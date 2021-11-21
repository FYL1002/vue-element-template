<template>
  <el-dialog
    class="dialog-wrapper"
    :title="$t('role.addedRelatedUser')"
    :visible="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form ref="dialogForm" :model="dialogDataRelated" label-width="120px">
      <el-select
        v-model="value"
        multiple
        filterable
        remote
        clearable
        reserve-keyword
        :placeholder="$t('role.fields.enterUserNameSearch')"
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
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">{{ $t('btns.cancel') }}</el-button>
      <el-button type="primary" :loading="dialogBtnLoading" @click="save('dialogForm')">{{ $t('btns.related') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getUserDetailList } from '@/api/urm';
import { copy } from '@/utils/common';

export default {
  name: 'RelatedUser',
  components: {},
  props: {
    sync: {
      type: Boolean,
      default: false
    },
    userData: {
      type: Object,
      required: false,
      default: null
    }
  },
  data() {
    // console.log(this.userData);
    return {
      dialogBtnLoading: false,
      dialogDataRelated: {},
      options: [],
      value: [],
      list: [],
      loading: false
    };
  },
  created() { },
  mounted() {},
  methods: {
    close() {
      this.$emit('dialogSave', null);
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        getUserDetailList({ nameContains: query }).then(data => {
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
      // console.log(this.value);
      const postData = {
        userIds: copy(this.value),
        roleId: this.userData.id
      };
      this.dialogBtnLoading = true;
      this.$emit('dialogSave', postData);
    }
  }
};
</script>
<style lang='scss' scoped>
.el-select{
    width:100%;
}
</style>
