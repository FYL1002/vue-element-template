let userInfo = [
    {
        path: '/home',
        menuText: "首页",
        menuNo: 1,
        children: null,
        permission: ['view']          
    },
    {
        path: "/user",
        menuText: "用户管理",
        menuNo: 1,
        children: [
            {
                path: "/userinfo",
                menuText: "用户信息",
                menuNo: 1,
                children: null,
                permission: ['view','create','update']
            },
            {
                path: "/role",
                menuText: "角色管理",
                menuNo: 2,
                children: null,
                permission: ['view','create','update','delete']
            }

        ],
        permission: []
    },
    {
        path: '/datamanage',
        menuText: "数据管理",
        menuNo: 1,
        children: [
            {
                path: "/cad",
                menuText: "证书管理",
                menuNo: 3,
                children: null,
                permission: ['view','create','update','delete']
            },
            {
                path: "/miyao",
                menuText: "密钥管理",
                menuNo: 2,
                children: null,
                permission: ['view',]
            }
        ],
        permission: ['view']  
    }
]