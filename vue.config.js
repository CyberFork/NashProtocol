const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  publicPath: "./",
  lintOnSave: false,
  chainWebpack: config => {
    config.resolve.alias.set("@", resolve("src"));

    config.module
      .rule("svg")
      .exclude.add(resolve("src/icons"))
      .end();

    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      });
  },
  css: {
    loaderOptions: {
      less: {
        // 这里的选项会传递给 css-loader
        javascriptEnabled: true,
      },
      // postcss: {
      //   plugins: [
      //     require("postcss-px2rem")({
      //       remUnit: 37.5,
      //     }),
      //   ],
      // },
    },
  },
  configureWebpack: {
    devtool: "source-map",
  },
  // devServer: {
  //   // 代理配置
  //   proxy: {
  //     "/api": {
  //       target: "http://localhost:8080/",
  //       changeOrigin: true,
  //       pathRewrite: {
  //         "^/api": ""
  //       },
  //       bypass: function(req, res, proxyOptions) {}
  //     }
  //   }
  // }
};
