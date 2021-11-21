<template>
  <div class="css-ta8zni css-1a49fo61" :class="{'shrink': tabPosition=='left'}">
    <div class="right-wrapper" :class="{'shrink': tabPosition=='left'}">
      <a v-show="tabPosition=='top'" class="close"><i class="el-icon el-icon-close" @click="close()" /></a>
      <el-tabs v-model="activeName" class="right-wrapper-tabs chat-tabs" :tab-position="tabPosition" @tab-click="handleClick">
        <el-tab-pane name="info" class="scroll">
          <span slot="label"><i class="icon el-icon-user-solid" /></span>
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
                <div class="form-item">{{ dialogFormData.customerName }}</div>
              </el-row>
              <el-row type="flex">
                <div class="label">客户邮箱:</div>
                <div class="form-item break-all">{{ dialogFormData.customerEmail | decryptEntity }}</div>
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
            <div v-if="dialogFormData.startedOn" class="info-box">
              <el-row class="operate" type="flex" justify="space-between">
                <div class="label">进入聊天的页面</div>
              </el-row>
              <el-row type="flex">
                <div class="form-item"><a class="content-link" :href="dialogFormData.startedOn" target="_blank">{{ dialogFormData.startedOn }}</a></div>
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
  </div>
</template>

<script>
import { storage } from '@/utils/common';

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
    },
    fromPage: {
      type: String,
      required: false,
      default: ''
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
      tableLoadingGroup: false,
      showBar: true,
      tabPosition: 'left',
      rightPageSettings: storage.get('rightPageSettings') || { chatTab: false, archivesTab: false }
    };
  },
  computed: {

  },
  created() {
    switch (this.fromPage) {
      case 'chat':
        this.tabPosition = this.rightPageSettings.chatTab ? 'top' : 'left';
        break;
      case 'archives':
        this.tabPosition = this.rightPageSettings.archivesTab ? 'top' : 'left';
        break;
      default:
    }
  },
  methods: {
    handleClick(tab, event) {
      this.tabPosition = 'top';
      switch (this.fromPage) {
        case 'chat':
          this.$set(this.rightPageSettings, 'chatTab', true);
          storage.set('rightPageSettings', this.rightPageSettings);
          break;
        case 'archives':
          this.$set(this.rightPageSettings, 'archivesTab', true);
          storage.set('rightPageSettings', this.rightPageSettings);
          break;
        default:
      }
    },
    close() {
      // this.$emit('save', null)
      this.tabPosition = 'left';
      switch (this.fromPage) {
        case 'chat':
          this.$set(this.rightPageSettings, 'chatTab', false);
          storage.set('rightPageSettings', this.rightPageSettings);
          break;
        case 'archives':
          this.$set(this.rightPageSettings, 'archivesTab', false);
          storage.set('rightPageSettings', this.rightPageSettings);
          break;
        default:
      }
    },
    checkAllChats() {
      this.$emit('checkAllChats', {});
    }
  }
};
</script>
<style lang='scss' scoped></style>
