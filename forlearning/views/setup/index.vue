<template>
  <div class="setting-wrapper">
    <div class="menu-section">
      <div class="section-title menu-section-title">
        设置
      </div>
      <div class="section-content">
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-submenu v-for="item in menu" :key="item.id" :index="item.url">
            <template slot="title">
              <svg-icon :icon-class="item.icon" />
              <span>{{ item.name }}</span>
            </template>
            <div v-if="item.childrens.length">
              <router-link v-for="sub in item.childrens" :key="sub.id" :to="{path: sub.url}">
                <el-menu-item :index="sub.url">
                  <span slot="title">{{ sub.name }}</span>
                </el-menu-item>
              </router-link>
            </div>
          </el-submenu>
        </el-menu>
      </div>
    </div>
    <div class="main-section">
      <div class="section-title main-section-title">
        <div>{{ $route.meta.title }}</div>
        <div v-show="showNotifySwitch" class="switch-master">
          <el-switch
            v-model="masterValue"
            active-color="#409eff"
            inactive-color="#aaa"
            @change="changeMasterSwitch"
          />
        </div>
      </div>
      <div class="section-content">
        <keep-alive :include="cachedViews">
          <router-view />
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Setting',
  data() {
    return {
      menu: [],
      showNotifySwitch: false,
      masterValue: false
    };
  },
  computed: {
    ...mapGetters([
      'nav',
      'notifyConfig'
    ]),
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    },
    key() {
      return this.$route.path;
    }
  },
  watch: {
    $route(n, o) {
      this.showNotifySwitch = n.name === 'SettingNotify';
    },
    notifyConfig(n, o) {
      let num = 0;
      for (const key in n) {
        if (n[key].Enabled) {
          num++;
        }
      }
      this.masterValue = num > 0;
    }
  },
  created() {
    if (Object.keys(this.notifyConfig).length) {
      for (const key in this.notifyConfig) {
        if (this.notifyConfig[key].Enabled) {
          this.masterValue = true;
        }
      }
    }
    this.nav && this.nav.forEach(item => {
      if (item.id === '750fd4c1-ffff-417c-9694-2841fc264d2f') {
        this.menu = item.childrens;
      }
    });
    this.showNotifySwitch = this.$route.name === 'SettingNotify';
  },
  mounted() {

  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    changePath(val) {
      this.$router.push({
        path: val
      });
    },
    changeMasterSwitch() {
      this.$root.eventHub.$emit('MasterSwitch', this.masterValue);
    }
  }
};
</script>

<style scoped lang="scss">
.setting-wrapper {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100%;
  .menu-section {
    width: 25%;
    min-width: 320px;
    height: 100%;
    background-color: rgb(243, 247, 249);
    border-right: 1px solid rgb(203, 212, 222);
  }
  .main-section {
    flex: 1;
    width: 0;
    min-width: 0; // 解决firefox宽度超长的bug
    height: 100%;
  }
  .section-title {
    height: 52px;
    line-height: 52px;
    border-bottom: 1px solid rgb(203, 212, 222);
    font-size: 18px;
    font-weight: 400;
    color: rgb(66, 77, 87);
    letter-spacing: 0.3px;
    white-space: nowrap;
    text-align: center;
    font-weight: 700;
  }
  .main-section-title {
    position: relative;
    .switch-master {
      position: absolute;
      top: 0;
      right: 50px;
    }
  }
  .section-content {
    height: calc(100% - 52px);
    overflow: auto;
  }

  >>> .el-menu {
    background-color: rgb(243, 247, 249);
    .el-submenu__title .el-submenu__icon-arrow {
      display: block !important;
    }
  }
}
</style>
