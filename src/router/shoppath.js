import Abstract from '../views/common/abstract.vue';

export default [{
    path: '/index1',
    name: '交易管理',
    meta: {
      icon: 'icon-shujutongji'
    },
    component: Abstract,
    children: [{
      path: 'table',
      name: '交易查询',
      meta: {
        title: '交易查询', icon: 'table1', code:'',
      },
      component: (resolve) => require(['../views/shop/nav1/Table.vue'], resolve)
    },
    {
      path: 'table5',
      name: '交易详情',
      meta: {
        title: '交易详情', icon: 'table', noCache: true, code: '', hidden: true
      },
      component: (resolve) => require(['../views/shop/nav1/Table5.vue'], resolve)
    }]
  }, {
    path: '/index1',
    name: '对账结算',
    meta: {
      icon: 'icon-xiaochengxu'
    },
    component: Abstract,
    children: [{
      path: 'bill1',
      name: '对账单下载',
      meta: {
        title: '对账单下载',
        icon: 'icon-icon--',
        code: ''
      },
      component: (resolve) => require(['../views/shop/nav6/bill1.vue'], resolve)
    }, {
      path: 'settlement1',
      name: '结算查询',
      meta: {
        title: '结算查询',
        icon: 'table1',
        code: '',
      },
      component: (resolve) => require(['../views/shop/nav9/settlement1.vue'], resolve)
    }]
  }, {
    path: '/index2',
    name: '商户管理',
    meta: {
      icon: 'icon-sdfsdf'
    },
    component: Abstract,
    children: [{
      path: 'page3',
      name: '商户信息',
      meta: {
        title: '商户信息', icon: 'table', noCache: true, code: ''
      },
      component: (resolve) => require(['../views/shop/nav2/Page3.vue'], resolve)
    },{
      path: 'page1',
      name: '门店信息',
      meta: {
        title: '门店信息', icon: 'table', code: ''
      },
      component: (resolve) => require(['../views/shop/nav2/Page1.vue'], resolve)
    },{
      path: 'page2',
      name: '款台信息',
      meta: {
        title: '款台信息', icon: 'table', code: ''
      },
      component: (resolve) => require(['../views/shop/nav2/Page2.vue'], resolve)
    }]
  },{
    path: '/index2',
    name: '硬件管理',
    meta: {
      icon: 'icon-peizhi'
    },
    component: Abstract,
    children: [{
      path: 'configure1',
      name: '打印机配置',
      meta: {
        title: '打印机配置', icon: 'table', code:''
      },
      component: (resolve) => require(['../views/shop/nav3/configure1.vue'], resolve)
    }
  ]}
]
