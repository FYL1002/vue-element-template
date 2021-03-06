export default {
  router: {
    dashboard: '首页',
    role: '角色管理',
    urm: '用户权限管理',
    user: '用户管理',
    menu: '菜单管理',
    menuList: '菜单列表',
    roleList: '角色列表',
    roleMenu: '权限设置',
    agents: '客服管理',
    agentslist: '客服列表',
    groups: '群组列表',
    customerManage: '客户管理',
    customerlist: '客户列表',
    chatList: '对话列表',
    archives: '存档列表',
    setting: '设置列表',
    tags: '标签',
    chatSet: '对话',
    messageNotify: '消息通知',
    quickReply: '快捷回复'
  },
  btns: {
    add: '添加',
    edit: '修改',
    delete: '删除',
    cancel: '取消',
    ok: '确认',
    related: '关联',
    clickUpload: '点击上传',
    save: '保存',
    clickGenerate: '点击生成',
    addRelated: '新增关联',
    cancelRelated: '取消关联',
    toggleModule: '切换模块',
    toggleProduct: '切换产品',
    toggleApplication: '切换应用'
  },
  commonFields: {
    createdOn: '创建时间',
    createdBy: '创建人',
    updatedOn: '修改时间',
    updatedBy: '修改人',
    operation: '操作',
    realName: '姓名',
    nickName: '用户昵称',
    mobile: '手机号码',
    email: '邮箱地址',
    lastLoginDate: '最后登录时间',
    password: '密码',
    confirmPassword: '确认密码',
    userPortrait: '用户头像',
    status: '状态',
    cusEmail: '客户邮箱',
    cusName: '客户姓名',
    cusAgentUserName: '客服名称',
    cusAgentNickName: '客服昵称',
    receptionAgent: '接待客服',
    cusStatus: '状态',
    cusLastActiveOn: '上次会话时间',
    cusLastBrowsePage: '最近浏览页面',
    cusIp: '客户IP',
    cusOs: '操作系统',
    cusUserAgent: '用户代理'
  },
  navbar: {
    dashboard: '首页',
    logOut: '退出登录',
    switchLanguageSuccess: '切换语言成功',
    manageAccount: '管理您的账号'
  },
  login: {
    title: '系统登录',
    logIn: '登录',
    username: '账号',
    password: '密码',
    any: '随便填',
    thirdparty: '第三方登录',
    thirdpartyTips: '本地不能模拟，请结合自己业务进行模拟！！！'
  },
  role: {
    fields: {
      name: '角色名称',
      description: '角色描述',
      copyRole: '复制角色',
      choosableCopyRole: '可选复制角色',
      enterUserNameSearch: '输入用户名搜索'
    },
    search: '请输入角色名称',
    functionAthz: '功能',
    serviceAthz: '服务',
    decryptAthz: '解密',
    addRole: '添加角色',
    editRole: '编辑角色',
    deleteRole: '删除角色',
    authorization: '权限设置',
    relatedUser: '关联用户',
    roleHaveRelatedTheUser: '角色已关联该用户！',
    addedRelatedUser: '新增关联用户'
  },
  user: {
    fields: {
      name: '用户名',
      nameType: '用户类型'
    },
    placeholder: {
      name: '4-20个字符，只能由中文、英文、数字或_中的一种或几种组成',
      password: '6-20个字符，字母区分大小写',
      enterRoleNameSearch: '输入角色名搜索'
    },
    editUser: '编辑用户',
    deleteUser: '删除用户',
    addUser: '添加用户',
    modifyUser: '修改用户',
    viewRole: '查看角色',
    relatedRole: '关联角色',
    userHaveRelatedTheRole: '用户已关联该角色！',
    formatAndSizeLimit: '只能上传jpg/png文件，且不超过1Mb',
    pressDeleteKey: '按 delete 键可删除',
    twoPasswords: '两次密码输入不一致',
    selectedRole: '已选角色',
    optionalRole: '可选角色',
    uploadPortrait: '上传头像',
    selectImage: '选择图片',
    cropper: '裁剪'
  },
  menu: {
    fields: {
      enterMenuNameSearch: '输入菜单名称搜索',
      name: '菜单名称',
      icon: '图标',
      sortIndex: '排序号',
      translate: '实体翻译',
      menuType: '菜单类型',
      menuStatus: '菜单状态',
      theirModule: '所属模块',
      superiorMenu: '上级菜单',
      method: '请求方式',
      url: '链接地址',
      route: '路由地址'
    },
    menu: '菜单',
    catalog: '目录',
    button: '按钮',
    port: '接口',
    addSubordinate: '添加下级',
    editMenu: '编辑菜单',
    deleteMenu: '删除菜单',
    addMenu: '添加菜单',
    checkMenu: '无结果，请核对菜单名称',
    hiden: '隐藏',
    clickSelectIcon: '点击选择图标'
  },
  settings: {
    title: '系统布局配置',
    theme: '主题色',
    tagsView: '开启 Tags-View',
    fixedHeader: '固定 Header',
    sidebarLogo: '侧边栏 Logo',
    addQuickReplyGroup: '快速回复分组',
    allGroup: '全部',
    addGroup: '添加分组',
    editGroup: '编辑分组',
    addQuickReply: '添加回复',
    editQuickReply: '编辑回复'
  },
  content: {
    pleaseSelect: '请选择',
    clickSearch: '点击搜索'
  },
  columns: {
    searchFields: '搜索字段',
    chooseColumns: '选择您的列',
    visibleColumns: '显示列',
    basicFields: '基础字段',
    otherFields: '其它字段'
  },
  enum: {
    areaCodeSelect: {
      86: '中国大陆(+86)',
      852: '中国香港(+852)',
      853: '中国澳门(+853)',
      886: '台湾(+886)',
      0: '其他'
    },
    menuType: {
      1: '目录',
      2: '菜单',
      3: '按钮',
      4: '接口'
    },
    menuStatus: {
      1: '显示',
      2: '隐藏'
    },
    module: {
      'Admin': '权限管理',
      'User': '用户管理',
      'Application': '应用管理'
    },
    loggedStatus: {
      'NeverLogged': '从未登陆',
      'Offline': '离线',
      'Online': '在线'
    },
    customerstatus: {
      '0': '聊天中',
      '1': '监控中',
      '2': '排队中',
      '3': '待回复',
      '4': '邀请聊天',
      '5': '浏览中',
      '6': '已离开'
    },
    chatstatus: {
      '1': '聊天中',
      '2': '待回复',
      '3': '已结束',
      '4': '排队中'
    }
  },
  groups: {
    addGroup: '新增群组',
    editGroup: '编辑群组'
  },
  noticeMsg: {
    maxlength: '长度不能大于{maxlength}',
    minlength: '长度不能小于{minlength}',
    repeat: '两次输入不一致',
    pattern: '格式错误，请重新输入！',
    number: '必须输入数字',
    url: '格式错误，请重新输入！',
    max: '输入值不能大于{max}',
    min: '输入值不能小于{min}',
    date: '日期格式不正确',

    saveSuccess: '保存成功！',
    saveFail: '保存失败！',
    AddSuccess: '添加成功！',
    AddFail: '添加失败！',
    ModitySuccess: '修改成功！',
    ModityFail: '修改失败！',
    HandleSuccess: '处理成功',
    HandleFail: '处理失败',

    DeleteSuccess: '删除成功！',
    DeleteFail: '删除失败！',
    RemoveSuccess: '移除成功！',
    RemoveFail: '移除失败！',

    CreditCard: 'CreditCard',
    Email: '输入邮件的格式不正确',
    Equal: '已经存在，请重新输入',
    NotEmpty: '不能为空',
    NotEqual: '不存在',
    NotNull: 'NotNull',
    Predicate: 'Predicate',
    RegularExpression: 'RegularExpression',
    CanNotDelete: 'CanNotDelete',
    almostOne: '最多选择一项',
    chooseOne: '请先选择一项！',
    noApiPermission: '暂无对应接口权限',
    successXfailYForDel: '删除成功{successCount}个，删除失败{failCount}个。',
    successXfilterYForAdd: '添加成功{successCount}个，已过滤{filterCount}个重复的{field}和{failCount}个格式错误的{field}。',
    successXfailY: '{method}成功{successCount}个，{method}失败{failCount}个。',
    deleteAsk: '您确定要删除吗？',
    info: '提示',
    warning: '警告',
    error: '错误',
    enterPlace: '按Enter搜索或过滤结果',
    shouldBeXToYCharacter: '应为{min}-{max}个字符',
    shouldBeXToYPositiveInteger: '应为{min}-{max}的正整数',
    alreadyExist: '已存在',
    addedRelatedSuccess: '新增关联成功！',
    addedRelatedFail: '新增关联失败！',
    deleteRelatedSuccess: '删除关联成功！',
    deleteRelatedFail: '删除关联失败！',
    cancelRelatedSuccess: '取消关联成功！',
    cancelRelatedFail: '取消关联失败！',
    passwordFormat: '只能由中文、英文、数字或_中的一种或几种组成',
    incorrectFormat: '格式不正确',
    moreThan1MReSelect: '文件超过1Mb，请重新选择图片！',
    delGroupTitle: '删除分组',
    delGroupInfo: '是否删除快捷回复分组‘{groupName}’？分组删除后，分组下所有回复将被删除。',
    delQuickReplyTitle: '删除回复内容',
    delQuickReplyInfo: '是否删除快捷回复内容‘{quickReplyContent}’？',
    jpgOrPngReSelect: '图片只支持jpg、png格式，请重新选择图片！'
  }
};
