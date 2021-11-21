
// 这里放所有的枚举文件
/**
 * @param {string} key
 * @returns {Object}
 */
export default function(key) {
    const allEnum = {
        userType: {
            '1': '内部用户',
            '2': '外部用户'
        },
        areaCodeSelect: {
          86: 'enum.areaCodeSelect.86', 852: 'enum.areaCodeSelect.852', 853: 'enum.areaCodeSelect.853', 886: 'enum.areaCodeSelect.886', 0: 'enum.areaCodeSelect.0'
        },
        areaCode: {
            86: '0086', 852: '00852', 853: '00853', 886: '00886', 0: ''
        },
        menuType: {
          1: 'enum.menuType.1', 2: 'enum.menuType.2', 3: 'enum.menuType.3', 4: 'enum.menuType.4'
        },
        menuStatus: {
          1: 'enum.menuStatus.1', 2: 'enum.menuStatus.2'
        },
        module: {
          'Admin': 'enum.module.Admin',
          'User': 'enum.module.User',
          'Base': 'enum.module.Application'
        },
        customerStatus: {
          '0': 'Chatting',
          '1': 'Monitor',
          '2': 'Queued',
          '3': 'WaitingReply',
          '4': 'Invited',
          '5': 'Browsing',
          '6': 'LeftWebSite',
          '7': 'ChattingFilterMonitor'
        },
        identityType: {
          // 监控monitors数组type字段
          0: 'Customer',
          1: 'ChatAgent',
          2: 'MonitorAgent'
        }

    };

    return allEnum[key] || {};
  }
