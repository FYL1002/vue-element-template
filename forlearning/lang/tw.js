export default {
  router: {
    dashboard: '首頁',
    role: '角色管理',
    urm: '用戶角色管理',
    user: '用戶管理',
    menu: '菜單管理',
    menuList: '菜單列表',
    roleList: '角色列表',
    roleMenu: '權限設置'
  },
  btns: {
    add: '添加',
    edit: '修改',
    delete: '刪除',
    cancel: '取消',
    ok: '確認',
    related: '關聯',
    clickUpload: '點擊上傳',
    save: '保存',
    clickGenerate: '點擊生成',
    addRelated: '新增關聯',
    cancelRelated: '取消關聯',
    toggleModule: '切換模塊',
    toggleProduct: '切換産品',
    toggleApplication: '切换應用'
  },
  commonFields: {
    createdOn: '創建時間',
    createdBy: '創建人',
    updatedOn: '修改時間',
    updatedBy: '修改人',
    operation: '操作',
    realName: '姓名',
    nickName: '用戶昵稱',
    mobile: '手機號碼',
    email: '郵箱地址',
    lastLoginDate: '最後登錄時間',
    password: '密碼',
    confirmPassword: '確認密碼',
    userPortrait: '用戶頭像',
    status: '狀態'
  },
  navbar: {
    dashboard: '首頁',
    logOut: '退出登錄',
    switchLanguageSuccess: '切換語言成功'
  },
  login: {
    title: '系統登錄',
    logIn: '登錄',
    username: '賬號',
    password: '密碼',
    any: '隨便填',
    thirdparty: '第三方登錄',
    thirdpartyTips: '本地不能模擬，請結合自己業務進行模擬！！！'
  },
  role: {
    fields: {
      name: '角色名稱',
      description: '角色描述',
      copyRole: '複制角色',
      choosableCopyRole: '可選複制角色',
      enterUserNameSearch: '輸入用戶名搜索'
    },
    search: '請輸入角色名稱',
    functionAthz: '功能',
    serviceAthz: '服務',
    decryptAthz: '解密',
    addRole: '添加角色',
    editRole: '編輯角色',
    deleteRole: '刪除角色',
    authorization: '權限設置',
    relatedUser: '關聯用戶',
    roleHaveRelatedTheUser: '角色已關聯該用戶！',
    addedRelatedUser: '新增關聯用戶'
  },
  user: {
    fields: {
      name: '用戶名',
      nameType: '用戶類型'
    },
    placeholder: {
      name: '4-20個字符，只能由中文、英文、數字或_中的一種或幾種組成',
      password: '6-20個字符，字母區分大小寫',
      enterRoleNameSearch: '輸入角色名搜索'
    },
    editUser: '編輯用戶',
    deleteUser: '刪除用戶',
    addUser: '添加用戶',
    modifyUser: '修改用戶',
    viewRole: '查看角色',
    relatedRole: '關聯角色',
    userHaveRelatedTheRole: '用戶已關聯該角色！',
    formatAndSizeLimit: '只能上傳jpg/png文件，且不超過1Mb',
    pressDeleteKey: '按 delete 鍵可刪除',
    twoPasswords: '兩次密碼輸入不一致',
    selectedRole: '已選角色',
    optionalRole: '可選角色',
    uploadPortrait: '上傳頭像',
    selectImage: '選擇圖片',
    cropper: '裁剪'
  },
  menu: {
    fields: {
      enterMenuNameSearch: '輸入菜單名稱搜索',
      name: '菜單名稱',
      icon: '圖標',
      sortIndex: '排序號',
      translate: '實體翻譯',
      menuType: '菜單類型',
      menuStatus: '菜單狀態',
      theirModule: '所屬模塊',
      superiorMenu: '上级菜单',
      method: '请求方式',
      url: '链接地址',
      route: '路由地址'
    },
    menu: '菜單',
    catalog: '目錄',
    button: '按鈕',
    port: '接口',
    addSubordinate: '添加下級',
    editMenu: '編輯菜單',
    deleteMenu: '刪除菜單',
    addMenu: '添加菜單',
    checkMenu: '無結果，請核對菜單名稱',
    hiden: '隱藏',
    clickSelectIcon: '點擊選擇圖標'
  },
  settings: {
    title: '系統布局配置',
    theme: '主題色',
    tagsView: '開啟 Tags-View',
    fixedHeader: '固定 Header',
    sidebarLogo: '側邊欄 Logo'
  },
  content: {
    pleaseSelect: '請選擇',
    clickSearch: '點擊搜索'
  },
  columns: {
    searchFields: '搜索字段',
    chooseColumns: '選擇您的列',
    visibleColumns: '顯示列',
    basicFields: '基礎字段',
    otherFields: '其它字段'
  },
  enum: {
    areaCodeSelect: {
      86: '中國大陸(+86)',
      852: '中國香港(+852)',
      853: '中國澳門(+853)',
      886: '台灣(+886)',
      0: '其他'
    },
    menuType: {
      1: '目錄',
      2: '菜單',
      3: '按鈕',
      4: '接口'
    },
    menuStatus: {
      1: '顯示',
      2: '隱藏'
    },
    module: {
      'Admin': '權限管理',
      'User': '用戶管理',
      'Application': '應用管理'
    },
    loggedStatus: {
      'NeverLogged': '從未登陸',
      'Offline': '離線',
      'Online': '在線'
    }
  },
  noticeMsg: {
    maxlength: '長度不能大於{maxlength}',
    minlength: '長度不能小於{minlength}',
    repeat: '兩次輸入不壹致',
    pattern: '格式錯誤，請重新輸入！',
    number: '必須輸入數字',
    url: '格式錯誤，請重新輸入！',
    max: '輸入值不能大於{max}',
    min: '輸入值不能小於{min}',
    date: '日期格式不正確',

    saveSuccess: '保存成功！',
    saveFail: '保存失敗！',
    AddSuccess: '添加成功！',
    AddFail: '添加失敗！',
    ModitySuccess: '修改成功！',
    ModityFail: '修改失敗！',
    HandleSuccess: '處理成功',
    HandleFail: '處理失敗',

    DeleteSuccess: '刪除成功！',
    DeleteFail: '刪除失敗！',
    RemoveSuccess: '移除成功！',
    RemoveFail: '移除失敗！',

    CreditCard: 'CreditCard',
    Email: '輸入郵件的格式不正確',
    Equal: '已經存在，請重新輸入',
    NotEmpty: '不能為空',
    NotEqual: '不存在',
    NotNull: 'NotNull',
    Predicate: 'Predicate',
    RegularExpression: 'RegularExpression',
    CanNotDelete: 'CanNotDelete',
    almostOne: '最多選擇壹項',
    chooseOne: '請先選擇壹項！',
    noApiPermission: '暫無對應接口權限',

    successXfailYForDel: '刪除成功{successCount}個，刪除失敗{failCount}個。',
    successXfilterYForAdd: '添加成功{successCount}個，已過濾{filterCount}個重復的{field}和{failCount}個格式錯誤的{field}。',
    successXfailY: '{method}成功{successCount}個，{method}失敗{failCount}個。',
    deleteAsk: '您確定要刪除嗎？',
    info: '提示',
    warning: '警告',
    error: '錯誤',
    enterPlace: '按Enter搜索或過濾結果',
    shouldBeXToYCharacter: '應爲{min}-{max}個字符',
    shouldBeXToYPositiveInteger: '應爲{min}-{max}的正整數',
    alreadyExist: '已存在',
    addedRelatedSuccess: '新增關聯成功！',
    addedRelatedFail: '新增關聯失敗！',
    deleteRelatedSuccess: '刪除關聯成功！',
    deleteRelatedFail: '刪除關聯失敗！',
    cancelRelatedSuccess: '取消關聯成功！',
    cancelRelatedFail: '取消關聯失敗！',
    passwordFormat: '只能由中文、英文、數字或_中的一種或幾種組成',
    incorrectFormat: '格式不正確',
    moreThan1MReSelect: '文件超過1Mb，請重新選擇圖片！',
    jpgOrPngReSelect: '圖片只支持jpg、png格式，請重新選擇圖片！'
  }
};
