<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.url">
        <span v-if="item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect">{{ $t(item.translate) }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ $t(item.translate) }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      levelList: null
    };
  },
  computed: {
    ...mapGetters([
      'breadcrumb'
    ])
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    }
  },
  created() {
    this.getBreadcrumb();
  },
  methods: {
    getBreadcrumb() {
      // only show routes with meta.title
      // let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      let matched = this.breadcrumb[this.$route.path] ? this.breadcrumb[this.$route.path].filter(item => item.translate) : [{}];
      const first = matched[0];

      if (!this.isDashboard(first)) {
        // matched = [{ url: '/dashboard', translate: 'router.dashboard'}].concat(matched)
        matched = [].concat(matched);
      }

      this.levelList = matched.filter(item => item.translate);
    },
    isDashboard(route) {
      const name = route && route.name;
      if (!name) {
        return false;
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase();
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route;
      var toPath = pathToRegexp.compile(path);
      return toPath(params);
    },
    handleLink(item) {
      const { url } = item;
      // if (redirect) {
      //   this.$router.push(redirect)
      //   return
      // }
      try {
        this.$router.push(this.pathCompile(url));
      } catch {
        // catch error
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
