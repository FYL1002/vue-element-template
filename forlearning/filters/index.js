// import parseTime, formatTime and set to filter
export { parseTime, formatTime } from '@/utils';

export function decryptEntity(value) {
  if (value) {
    return value.replace(/[{]+\w+[}]+/, '******');
  }
}

export function mobileRegFilter(value) {
  if (value) {
    switch (parseInt(value)) {
        case 86:
            return /^(122|1[3-9][0-9])\d{8}$/;
        case 852:
            return /^[1-9]{1}\d{7}$/;
        case 853:
            return /^[1-9]{1}\d{7}$/;
        case 886:
            return /^[1-9]{1}\d{8}$/;
        case 0:
            return '';
        default:
            return '';
    }
  }
}

// 这里写全局filter,vue初始化时就已经注入，不用重复注入

