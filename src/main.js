import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import axios from 'axios'
import "element-ui/lib/theme-chalk/index.css";

// import VConsole from 'vconsole';
// new VConsole()

Vue.config.productionTip = false;
Vue.use(ElementUI, { size: 'small' });
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.baseURL = 'http://cloud.bmob.cn/a6ed4ccfb932efa6/';

new Vue({
  render: (h) => h(App),
}).$mount("#app");
