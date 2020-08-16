import Vue from 'vue'
import App from './App.vue'

//router
import router from './router/router'

//element ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//bus线程
Vue.prototype.$bus = new Vue()


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
