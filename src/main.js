import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router';
import store from '@/store/index';


Vue.use(ElementUI, { size: 'small' });
//权限指令
// Vue.directive('has', {
//   bind: function(el, binding) {
//     if (!Vue.prototype.$_has(binding.value)) {
//       el.parentNode.removeChild(el);
//     }
//   }
// });
router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    next({ path: '/login' })
  } else {
    next()
  }
});

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});

