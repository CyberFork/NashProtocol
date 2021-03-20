<template>
  <a-layout id="components-layout-demo-fixed">
    <a-layout-header :style="{ width: '100%' }">
      <!-- <div class="logo" /> -->
      <Menu class="bg-menu" :collapsed="collapsed"></Menu>
      <a-badge class="d_badge" dot>
        <a-icon style="font-size: 18px" type="notification" />
      </a-badge>
      <div class="d_addressNow" @click="toBlock">📑{{ address }}</div>
      <div class="d_network">📡{{ this.$store.state.network }}</div>
    </a-layout-header>
    <a-layout-content class="bg-content" :style="{ padding: '0 50px' }">
      <router-view></router-view>
    </a-layout-content>
    <a-layout-footer class="bg-footer" :style="{ textAlign: 'center' }">
      <span>NASH Protocol ©2021 Created by NASH INTERNATIONAL</span>
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
      var temp = this.$store.state.addressNow;
      return temp.substring(0, 5) + "..." + temp.substring(temp.length - 4, temp.length);
    },
  },
  data() {
    return {
      collapsed: false,
      blockExplorer: {
        Kovan: "kovan.etherscan.io",
        BSC: "bscscan.com",
        BSCTest: "testnet.bscscan.com",
      },
    };
  },
  methods: {
    toBlock() {
      window.open(`https://${this.blockExplorer[this.$store.state.network]}/address/${this.$store.state.addressNow}`, "_blank");
    },
  },
};
</script>

<style>
/* #components-layout-demo-fixed .logo {
  width: 120px;
  height: 31px;
  background: #a15e9c;
  margin: 16px 24px 16px 0;
  float: left;
  z-index: 1;
}

.bg-menu {
  background: #ca99e8;
  z-index: 1;
} */

.d_badge {
  text-align: right;
  float: right;
  margin-top: -2.5em;
  margin-right: 2em;
}

.d_badge:hover {
  cursor: pointer;
  background-color: rgb(242, 242, 242);
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
  cursor: pointer;
}
</style>
