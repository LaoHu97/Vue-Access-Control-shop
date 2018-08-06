import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import App from './App.vue';
import router from './router';
import store from '@/store/index';

Vue.use(ElementUI, { size: 'medium' });
//权限指令
// Vue.directive('has', {
//   bind: function(el, binding) {
//     if (!Vue.prototype.$_has(binding.value)) {
//       el.parentNode.removeChild(el);
//     }
//   }
// });

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});

