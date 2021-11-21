<template>
  <div class="css-ta8zni css-1a49fo61 right-wrapper">
    <a class="close"><i class="el-icon el-icon-close" @click="close()" /></a>
    <el-tabs v-model="activeName" class="right-wrapper-tabs" @tab-click="handleClick">
      <el-tab-pane label="客户信息" name="info" class="scroll">
        <el-row class="tabs-title" type="flex" justify="space-between">
          <div class="label">客户信息</div>
        </el-row>
        <div v-if="dialogFormData">
          <div class="info-box">
            <el-row class="operate" type="flex" justify="space-between">
              <div class="label">基本信息</div>
            </el-row>
            <el-row type="flex">
              <div class="label">客户姓名:</div>
              <div class="form-item">{{ dialogFormData.name }}</div>
            </el-row>
            <el-row type="flex">
              <div class="label">客户邮箱:</div>
              <div class="form-item break-all">{{ dialogFormData.email | decryptEntity }}</div>
            </el-row>
            <el-row type="flex">
              <div class="label">接待客服:</div>
              <div class="form-item">{{ dialogFormData.agentNickName }}</div>
            </el-row>
            <el-row type="flex">
              <div class="label">位置:</div>
              <div class="form-item"><span v-if="dialogFormData.city">{{ dialogFormData.city }}</span><span v-if="dialogFormData.province">，{{ dialogFormData.province }}</span><span v-if="dialogFormData.country">，{{ dialogFormData.country }}</span></div>
            </el-row>
            <el-button v-if="dialogFormData.isFrom =='archives'" style="width:100%" @click="checkAllChats()">查看所有聊天</el-button>
          </div>
          <div v-if="dialogFormData.lastBrowsePage" class="info-box">
            <el-row class="operate" type="flex" justify="space-between">
              <div class="label">访问页面</div>
            </el-row>
            <el-row type="flex">
              <div class="form-item"><a class="content-link" :href="dialogFormData.lastBrowsePage" target="_blank">{{ dialogFormData.lastBrowsePage }}</a></div>
            </el-row>
          </div>
          <div class="info-box">
            <el-row class="operate" type="flex" justify="space-between">
              <div class="label">技术信息</div>
            </el-row>
            <el-row type="flex">
              <div class="label">IP地址:</div>
              <div class="form-item">{{ dialogFormData.ip }}</div>
            </el-row>
            <el-row type="flex">
              <div class="label">操作系统:</div>
              <div class="form-item">{{ dialogFormData.os }}</div>
            </el-row>
            <el-row type="flex">
              <div class="label">浏览器:</div>
              <div class="form-item break-all">{{ dialogFormData.browser }}</div>
            </el-row>
            <el-row type="flex">
              <div class="label">用户代理:</div>
              <div class="form-item break-all">{{ dialogFormData.userAgent }}</div>
            </el-row>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

export default {
  name: 'RightPage',
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
  watch: {

  },
  created() {
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    close() {
      this.$emit('save', null);
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
