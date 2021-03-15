module.exports = {
  // presets: ["@vue/cli-plugin-babel/preset", "@vue/app"],
  presets: [
    [
      "@vue/app",
      {
        useBuiltIns: "entry",
      },
      "@vue/babel-preset-jsx",
    ],
  ],
  plugins: [
    [
      // 按需加载插件
      "import",
      {
        libraryName: "ant-design-vue",
        libraryDirectory: "es",
        // 加载less
        style: true,
      },
    ],
  ],
};
