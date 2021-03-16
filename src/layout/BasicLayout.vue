<template>
  <a-layout id="components-layout-demo-fixed">
    <a-layout-header :style="{ width: '100%' }">
      <!-- <div class="logo" /> -->
      <Menu :collapsed="collapsed"></Menu>
      <a-badge class="d_badge" dot>
        <a-icon style="font-size: 18px" type="notification" />
      </a-badge>
      <div class="d_addressNow">😎{{ address }}</div>
      <div class="d_network">📡{{ this.$store.state.network }}</div>
    </a-layout-header>
    <a-layout-content :style="{ padding: '0 50px', marginTop: '64px' }">
      <router-view></router-view>
    </a-layout-content>
    <a-layout-footer :style="{ textAlign: 'center' }">
      NASH Protocol ©2021 Created by NASH INTERNATIONAL
    </a-layout-footer>
  </a-layout>
</template>

<script>
import Menu from "../components/Menu.vue";

export default {
  components: {
    Menu,
  },
  computed: {
    address() {
      console.log(this.$store.state.addressNow);
      var temp = this.$store.state.addressNow;
      return temp.substring(0, 5) + "..." + temp.substring(temp.length - 4, temp.length);
    },
  },
  data() {
    return {
      collapsed: false,
    };
  },
};
</script>

<style>
#components-layout-demo-fixed .logo {
  width: 120px;
  height: 31px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px 24px 16px 0;
  float: left;
}

.d_badge {
  text-align: right;
  float: right;
  margin-top: -2.5em;
  margin-right: 2em;
}

.d_badge:hover {
  cursor: pointer;
  background-color: rgba(242, 242, 242, 1);
}

.d_network {
  text-align: right;
  float: right;
  margin-top: -3.5em;
  margin-right: 1em;
}

.d_addressNow {
  text-align: right;
  float: right;
  margin-top: -3.5em;
  margin-right: 5em;
}
</style>
