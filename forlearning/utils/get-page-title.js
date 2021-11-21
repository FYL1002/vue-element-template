// import defaultSettings from '@/settings'
import i18n from '@/lang';
import store from '@/store';

export default function getPageTitle(key) {
  // title根据项目来改变，例：live800_角色管理、IM_角色管理
  const title = store.getters.appName;
  const haskey = i18n.te(key) || key;
  if (haskey) {
    const pageName = i18n.t(key) || key;
    return `${title}_${pageName}`;
  }
  return `${title}`;
}
