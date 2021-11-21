<template>
  <div class="section-wrapper">
    <ul class="notify-ui" :v-loading="loading">
      <li v-for="item in notifyList" :key="item.AlertType">
        <div class="title">{{ notifyConfig[item.AlertType].name }}</div>
        <div class="switch-wrapper">
          <el-switch
            v-model="item.Enabled"
            active-color="#409eff"
            inactive-color="#aaa"
            @change="changeSwitch"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { getUserSettingList, editUserSetting } from '@/api/setting';
import { mapGetters } from 'vuex';

export default {
  name: 'SettingNotify',
  data() {
    return {
      loading: true,
      notifyList: [],
      initParam: {
        type: 'WarningTone'
      },
      masterValue: true,
      notifyConfig: {
        Chat: {
          name: '我的对话消息提醒'
        },
        Queued: {
          name: '排队对话消息提醒'
        },
        Monitored: {
          name: '监控对话消息提醒'
        },
        OtherChat: {
          name: '其他人对话消息提醒'
        }
      },
      postData: {}
    };
  },
  computed: {
    ...mapGetters([
      'permissionAll'
    ])
  },
  created() {

  },
  mounted() {
    this.getNotifyList();
    this.$root.eventHub.$on('MasterSwitch', (bool) => {
      this.notifyList.forEach(item => {
        item.Enabled = bool;
      });
      this.editNotifySetting();
    });
  },
  destroyed() {
    this.$root.eventHub.$off('MasterSwitch');
  },
  methods: {
    getNotifyList() {
      getUserSettingList(this.initParam).then(data => {
        if (data && data.results && data.results[0] && data.results[0].value) {
          this.loading = false;
          this.postData = data.results[0];
          const arr = JSON.parse(data.results[0].value);
          arr.forEach(item => {
            if (item.AlertType === 'Chat' || item.AlertType === 'Queued') {
              this.notifyList.push(item);
            }
          });
        }
      });
    },
    changeSwitch() {
      this.editNotifySetting();
    },
    editNotifySetting() {
      this.postData.value = JSON.stringify(this.notifyList);
      editUserSetting(this.postData).then(data => {
        if (data.isOK) {
          this.$message.success({ message: this.$t('noticeMsg.ModitySuccess'), duration: 2000, showColse: true });
          const notifyConfig = {};
          this.notifyList.forEach(item => {
            notifyConfig[item.AlertType] = {};
            notifyConfig[item.AlertType].Enabled = item.Enabled;
          });
          this.$store.commit('app/SET_NOTIFYCONFIG', notifyConfig);
        } else {
          this.$message.error({ message: this.$t('noticeMsg.ModityFail'), duration: 2000, showColse: true });
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.section-wrapper {
  color: #424d57;
  font-size: 14px;
}
.notify-ui {
  padding: 32px 50px 50px;
  li {
    line-height: 42px;
    border-bottom: 1px solid #dde2e6;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
}
</style>
