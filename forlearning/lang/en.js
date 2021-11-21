export default {
  router: {
    dashboard: 'Dashboard',
    role: 'Role',
    urm: 'UserAuthorize',
    user: 'User',
    menu: 'Menu',
    menuList: 'Menu List',
    roleList: 'Role List',
    roleMenu: 'Role Menu'
  },
  btns: {
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    ok: 'OK',
    related: 'Related',
    clickUpload: 'Click Upload',
    save: 'Save',
    clickGenerate: 'Generate',
    addRelated: 'Add Related',
    cancelRelated: 'Cancel Related',
    toggleModule: 'Switch Module',
    toggleProduct: 'Switch Product',
    toggleApplication: 'Switch Application'
  },
  commonFields: {
    createdOn: 'CreatedOn',
    createdBy: 'CreatedBy',
    updatedOn: 'UpdatedOn',
    updatedBy: 'UpdatedBy',
    operation: 'Operation',
    realName: 'Name',
    nickName: 'NickName',
    mobile: 'Mobile',
    email: 'Email',
    lastLoginDate: 'Last Login',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    userPortrait: 'User Portrait',
    status: 'Status'
  },
  navbar: {
    dashboard: 'Dashboard',
    logOut: 'logOut',
    switchLanguageSuccess: 'Switch Language Success'
  },
  login: {
    title: 'Login Form',
    logIn: 'Login',
    username: 'Username',
    password: 'Password',
    any: 'any',
    thirdparty: 'Or connect with',
    thirdpartyTips: 'Can not be simulated on local, so please combine you own business simulation! ! !'
  },
  role: {
    fields: {
      name: 'Role Name',
      description: 'Description',
      copyRole: 'Copy Role',
      choosableCopyRole: 'Choosable copy role',
      enterUserNameSearch: 'Enter userName search'
    },
    search: 'Please enter user name',
    functionAthz: 'Function',
    serviceAthz: 'Service',
    decryptAthz: 'Decrypt',
    addRole: 'Add Role',
    editRole: 'Edit Role',
    deleteRole: 'Delete Role',
    authorization: 'Authorization',
    relatedUser: 'Related User',
    roleHaveRelatedTheUser: 'Role have related the user!',
    addedRelatedUser: 'Add Related User'
  },
  user: {
    fields: {
      name: 'Name',
      nameType: 'Name Type'
    },
    placeholder: {
      name: '4-20 characters, which can only be composed of one or more of Chinese, English, numerals, or _',
      password: '6-20 characters, case - sensitive',
      enterRoleNameSearch: 'Enter role name search'
    },
    editUser: 'Edit User',
    deleteUser: 'Delete User',
    addUser: 'Add User',
    modifyUser: 'Modify User',
    viewRole: 'View Role',
    relatedRole: 'Related Role',
    userHaveRelatedTheRole: 'User have related the role!',
    formatAndSizeLimit: 'Only JPG/PNG files can be uploaded and no more than 1Mb',
    pressDeleteKey: 'Press delete to delete',
    twoPasswords: 'The two passwords do not match',
    selectedRole: 'Selected Role',
    optionalRole: 'Optional Role',
    uploadPortrait: 'Upload Portrait',
    selectImage: 'Select Image',
    cropper: 'Cropper'
  },
  menu: {
    fields: {
      enterMenuNameSearch: 'Enter menu name search',
      name: 'Menu Name',
      icon: 'Icon',
      sortIndex: 'Sort',
      translate: 'Translate',
      menuType: 'Type',
      menuStatus: 'Status',
      theirModule: 'Module',
      superiorMenu: 'Superior',
      method: 'Method',
      url: 'URL',
      route: 'Route'
    },
    menu: 'Menu',
    catalog: 'Catalog',
    button: 'Button',
    port: 'Port',
    addSubordinate: 'Add Subordinate',
    editMenu: 'Edit Menu',
    deleteMenu: 'Delete Menu',
    addMenu: 'Add Menu',
    checkMenu: 'No result, please check the menu name',
    hiden: 'Hiden',
    clickSelectIcon: 'Click select icon'
  },
  settings: {
    title: 'Page style setting',
    theme: 'Theme Color',
    tagsView: 'Open Tags-View',
    fixedHeader: 'Fixed Header',
    sidebarLogo: 'Sidebar Logo'
  },
  content: {
    pleaseSelect: 'Please select',
    clickSearch: 'click search'
  },
  columns: {
    searchFields: 'Search Fields',
    chooseColumns: 'CHOOSE YOUR COLUMNS',
    visibleColumns: 'Visible columns',
    basicFields: 'Basic fields',
    otherFields: 'Others'
  },
  enum: {
    areaCodeSelect: {
      86: 'Chinese Mainland(+86)',
      852: 'Hong Kong(+852)',
      853: 'Macao(+853)',
      886: 'Taiwan(+886)',
      0: 'Other'
    },
    menuType: {
      1: 'Catalog',
      2: 'Menu',
      3: 'Button',
      4: 'Port'
    },
    menuStatus: {
      1: 'Show',
      2: 'Hiden'
    },
    module: {
      'Admin': 'Admin',
      'User': 'User',
      'Application': 'Application'
    },
    loggedStatus: {
      'NeverLogged': 'NeverLogged',
      'Offline': 'Offline',
      'Online': 'Online'
    }
  },
  noticeMsg: {
    maxlength: 'The length can not be greater than {maxlength}',
    minlength: 'The length can not be less than {minlength}',
    repeat: 'Two input inconsistencies',
    pattern: 'Format error, please re-enter!',
    number: 'You must enter a number',
    url: 'The input URL is not formatted correctly',
    max: 'The input value can not be greater than {max}',
    min: 'The input value can not be less than {min}',
    date: 'The date format is incorrect',

    saveSuccess: 'Saved successfully!',
    saveFail: 'Save failed!',
    AddSuccess: 'Add successfully!',
    AddFail: 'Add failed!',
    ModitySuccess: 'Successfully modified!',
    ModityFail: 'Failed modified!',
    HandleSuccess: 'Handle Success',
    HandleFail: 'Handle Fail',

    DeleteSuccess: 'Successfully deleted!',
    DeleteFail: 'Failed deleted!',
    RemoveSuccess: 'Successfully Removed!',
    RemoveFail: 'Failed Removed!',

    CreditCard: 'CreditCard',
    Email: 'The format of the incoming message is incorrect',
    Equal: 'already exists, please re-enter',
    NotEmpty: 'Can not be empty',
    NotEqual: 'does not exist',
    NotNull: 'NotNull',
    Predicate: 'Predicate',
    RegularExpression: 'RegularExpression',
    CanNotDelete: 'CanNotDelete',
    almostOne: 'Choose one at most!',
    chooseOne: 'Please select one first!',
    noApiPermission: 'No corresponding Api permission',

    successXfailYForDel: 'Delete success {successCount}, delete failed {failCount}',
    successXfilterYForAdd: 'Add success {successCount}, filtered {filterCount} duplicate {field} and {failCount} formatted {field}.',
    successXfailY: '{Method} Success {successCount}, {method} failed {failCount}',
    deleteAsk: 'Are you sure to Delete it?',
    info: 'Info',
    warning: 'Warning',
    error: 'Error',
    enterPlace: 'Press Enter to search or filter results',
    shouldBeXToYCharacter: ' should be {min}-{max} Character',
    shouldBeXToYPositiveInteger: ' should be {min}-{max} positive integer',
    alreadyExist: ' already exist',
    addedRelatedSuccess: 'Add related success!',
    addedRelatedFail: 'Add related fail!',
    deleteRelatedSuccess: 'Delete related success!',
    deleteRelatedFail: 'Delete related fail!',
    cancelRelatedSuccess: 'Cancel related success!',
    cancelRelatedFail: 'Cancel related fail!',
    passwordFormat: 'only be composed of one or more of Chinese, English, numerals, or _',
    incorrectFormat: ' is incorrect format',
    moreThan1MReSelect: 'File more than 1Mb, please re - select the image!',
    jpgOrPngReSelect: 'The image only supports JPG, PNG format, please re-select the image!'
  }
};
