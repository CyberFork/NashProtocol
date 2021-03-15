/**
 * require.context有三个参数：
 * directory：说明需要检索的目录
 useSubdirectories：是否检索子目录
 regExp: 匹配文件的正则表达式
 * */

function requireAll() {
  const requireContext = require.context("./svg", false, /\.svg$/);
  return requireContext.keys().map(requireContext);
}
requireAll();
