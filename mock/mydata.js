const Mock = require('mockjs')

const myTable = Mock.mock({
    'items|15': [
            {
                id: "@id",
                name: "@sentence(1, 3)",
                math: "@integer(0, 100)",
                chinese: "@integer(0, 100)",
                english: "@integer(0, 100)",
            }
        ]
    }
)

module.exports = [
    {
        url: '/vue-admin-template/mytable/list',
        type: 'get',
        response: config => {
          const items = myTable.items
          return {
            code: 20000,
            data: {
              total: items.length,
              data: items
            }
          }
        }
    },
    {
        url: '/vue-admin-template/myform/handlePersonalInfo',
        type: 'post',
        response: _ => {
          return {
            code: 20000,
            data: 'success'
          }
        }
    }
]