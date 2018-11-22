<style>
@import './assets/common.css';
</style>

<template>
  <router-view id="app" @login="loginDirect" @logout="logoutDirect"></router-view>
</template>

<script>
import Vue from 'vue';
import instance from './api';
import userPath from './router/fullpath';
import * as util from './util/util.js';
import {
  batchRemoveUser,
  menu
} from './api/shop';

//请求拦截句柄
let myInterceptor;

export default {
  data() {
    return {
      menuData: null,
      userData: null,
      menuID: ''
    }
  },
  methods: {
    getRoutes: function(userInfo) {
      if(!userInfo.data){
        return console.warn(userInfo);
      }
      let vm = this;
      let allowedRouter = [];
      //将菜单数据转成多维数组格式
      let arrayMenus = util.buildMenu(userInfo.data);
      //将多维数组转成对象格式
      let hashMenus = {};
      let setMenu2Hash = function(array, base) {
        array.map(key => {
          if (key.route) {
            let hashKey = ((base ? base + '/' : '') + key.route ).replace(/^\//, '');
            hashMenus['/' + hashKey] = true;
            if (Array.isArray(key.children)) {
              setMenu2Hash(key.children, key.route);
            }
          }
        });
      };
      setMenu2Hash(arrayMenus);
      //全局挂载hashMenus，用于实现路由守卫      
      this.$root.hashMenus = hashMenus;
      //筛选本地路由方法
      let findLocalRoute = function(array, base) {
        let replyResult = [];
        array.forEach(function(route) {
          let pathKey = (base ? base + '/' : '') + route.path;
          if (hashMenus[pathKey]) {
            if (Array.isArray(route.children)) {
              route.children = findLocalRoute(route.children, route.path);
            }
            replyResult.push(route);
          }
        });
        if (base) {
          return replyResult;
        } else {
          allowedRouter = allowedRouter.concat(replyResult);
        }
      }
      let originPath = util.deepcopy(userPath[0].children);
      findLocalRoute(originPath);
      return allowedRouter;
    },
    extendRoutes: function(allowedRouter) {
      let vm = this;
      let actualRouter = util.deepcopy(allowedRouter);
      actualRouter.map(e => {
        //复制子菜单信息到meta用于实现导航相关效果，非必需
        if (e.children) {
          if (!e.meta) e.meta = {};
          e.meta.children = e.children;
        }
        //为动态路由添加独享守卫
        return e.beforeEnter = function(to, from, next){
          if(vm.$root.hashMenus[to.path]){
            next()
          }else{
            next('/401')
          }
        }
      });
      let originPath = util.deepcopy(userPath);
      originPath[0].children = actualRouter;
      //注入路由
      vm.$router.addRoutes(originPath.concat([{
        path: '*',
        redirect: '/404'
      }]));
    },
    signin: function(callback) {
      const loading = this.$loading({
        lock: true,
        text: '请稍候,正在加载',
        background: '#fff'
      });
      let vm = this;
      //获取用户信息及权限数据
      let sessionMenuID = JSON.parse(sessionStorage.getItem('menuID'));

      let para = {
        flag: this.menuID || sessionMenuID || 'false'
      }
      menu(para).then(res=>{
        loading.close();
        let userInfo = res.data;
        //获得实际路由
        let allowedRouter = vm.getRoutes(userInfo);
        //若无可用路由限制访问
        if (!allowedRouter || !allowedRouter.length) {
          return vm.$router.push({ path: '/login', query: { from: vm.$router.currentRoute.path } });
        }
        //动态注入路由
        vm.extendRoutes(allowedRouter);
        //保存数据用作他处，非必需
        vm.$store.dispatch('get_menu', allowedRouter)
        vm.menuData = allowedRouter;
        vm.userData = userInfo;
        //执行回调
        typeof callback === 'function' && callback();
      })
    },
    loginDirect: function(data){
      this.menuID= data.menu
      sessionStorage.setItem('menuID', JSON.stringify(data.menu));
      this.signin(() => {
        this.$router.replace({path: data.path || '/'});
      })
    },
    logoutDirect: function(){
      //清除请求权限控制
      instance.interceptors.request.eject(myInterceptor);
      //清除菜单权限
      this.$root.hashMenus = {};
      //清除动态标签
      this.$store.dispatch('delAllViews')
      batchRemoveUser().then(res=>{
        //回到登录页
        this.$router.push({path: '/login'});
      })
    }
  },
  created: function(newPath) {
    this.signin();
  }
}
</script>