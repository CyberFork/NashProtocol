import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    hidden: true,
    component: Home,
  },
  {
    path: "/nash",
    component: () => import(/* webpackChunkName: "layout" */ "../layout/BasicLayout"),
    children: [
      // 预言机
      {
        path: "/nash",
        redirect: "/nash/play",
      },
      {
        path: "/nash/play",
        name: "Play",
        meta: { icon: "dashboard", title: "预言机" },
        component: () => import(/* webpackChunkName: "user" */ "../views/Play"),
      },
      {
        path: "/nash/mining",
        name: "Play",
        meta: { icon: "dashboard", title: "NAP矿池" },
        component: () => import(/* webpackChunkName: "user" */ "../views/Develop"),
      },
      {
        path: "/nash/explore",
        name: "Play",
        meta: { icon: "dashboard", title: "探索" },
        component: () => import(/* webpackChunkName: "user" */ "../views/Develop"),
      },
    ],
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;
