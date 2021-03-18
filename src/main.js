import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { Breadcrumb, Carousel,Dropdown, Divider, Layout, Button, Select, Result, Badge, Icon, Input, Tabs, Card, Modal, Menu, List, Tag } from "ant-design-vue";
import "./style/index.css";

Vue.config.productionTip = false;
Vue.use(Breadcrumb);
Vue.use(Carousel);
Vue.use(Dropdown);
Vue.use(Divider);
Vue.use(Layout);
Vue.use(Select);
Vue.use(Result);
Vue.use(Button);
Vue.use(Badge);
Vue.use(Input);
Vue.use(Modal);
Vue.use(Menu);
Vue.use(List);
Vue.use(Card);
Vue.use(Icon);
Vue.use(Tabs);
Vue.use(Tag);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app");
