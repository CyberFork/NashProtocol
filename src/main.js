import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { Carousel,Divider,Icon,Input,Button,Select,Tabs,Card,Modal,List,Tag} from "ant-design-vue";
import "./style/index.css";

Vue.config.productionTip = false;
Vue.use(Carousel);
Vue.use(Divider);
Vue.use(Select);
Vue.use(Button);
Vue.use(Input);
Vue.use(Modal);
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
