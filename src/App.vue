<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
// import trianglify from "trianglify";

export default {
  mounted() {
    // var pattern = trianglify({
    //   width: window.innerWidth,
    //   height: document.body.clientHeight,
    // });
    // document.body.appendChild(pattern.toCanvas());
  },
};
</script>

<style lang="less">
html,
body,
#app {
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

@media screen and (max-width: 1174px) {

  .bg-content {
    padding: 0px !important;
  }
  .ant-layout-content {
    padding: 0px 5px !important;
  }
  .ant-layout-header {
    padding: 0px
  }

  #app {
    margin-top: -6px;
  }

  .ant-layout-header {
    height: 80px;
    background: #c3c3c3;
  }

  .d_addressNow {
    line-height: 35px;
    margin-top: 0px !important;
    margin-right: 10px !important;
  }
  
  .d_network {
    line-height: 35px;
    margin-top: 0px !important;
  }
  .learn-more {
    float: left !important;
  }

  .ant-notification {
    width: 300px !important;
    max-width: calc(100vw) !important;
    left: 0 !important;
    right: 0 !important;
    margin: auto !important;
  }

  .ant-notification-notice {
    width: 100% !important;
    right: 0rem !important;
    left: 50%; 
    transform: translate(-50%,0%);
  }

  .canJoinCard .ant-col-12{
    width: 100% !important;
  }
}
</style>
