import shoppath from './shoppath'
const path = [{
    path: '/',
    name: '数据统计',
    meta: {
      title: '数据统计', noCache: true  
    },
    component: (resolve) => require(['../views/index.vue'], resolve),
    children: shoppath
},{
  path: '/home',
  name: '首页',
  meta: {
    title: '首页', noCache: true  
  },
  component: (resolve) => require(['../views/index/home.vue'], resolve),
  children: [{
    path: '/noticeList',
    name: '公告列表',
    meta: {
      icon: 'icon-shujutongji'
    },
    component:  (resolve) => require(['../views/index/noticeList.vue'], resolve)
  },{
    path: '/noticeDetails',
    name: '公告详情',
    meta: {
      icon: 'icon-shujutongji'
    },
    component:  (resolve) => require(['../views/index/noticeDetails.vue'], resolve)
  }]
}]

export default path;