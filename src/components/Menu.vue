<template>
  <div style="text-align:left">
    <!-- default-selected-keys 与 selectedKeys-->
    <a-menu :selectedKeys="selectedKeys" :openKeys.sync="openKeys" theme="light" mode="horizontal">
      <template v-for="item in menuData">
        <a-menu-item v-if="!item.children" :key="item.path" @click="() => $router.push({ path: item.path, query: $route.query })">
          <!-- <a-icon v-if="item.meta.icon" type="pie-chart" /> -->
          <span>{{ item.meta.title }}</span>
        </a-menu-item>
      </template>
    </a-menu>
  </div>
</template>

<script>
// 函数式组件
export default {
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    this.selectedKeysMap = {};
    this.openKeysMap = {};
    const menuData = this.getMenu(this.$router.options.routes);
    console.log(menuData);
    return {
      list: [],
      selectedKeys: this.selectedKeysMap[this.$route.path],
      openKeys: this.collapsed ? [] : this.openKeysMap[this.$route.path],
      menuData,
    };
  },
  methods: {
    getMenu(routes = [], parentKeys = [], selectedKey) {
      /*
       *@FunctionName: getMenu(routes = [], parentKeys = [], selectedKey)
       *@Params1: routes 路由项
       *@Params2: parentKeys 父级key
       *@Params3: selectedKey 当前选中项
       *@Description: 递归获取菜单列表
       *@Author: yangxiao-lhq
       *@Last Modified By: yangxiao-lhq
       *@Date: 2020-12-29 14:36:00
       */
      const menuData = [];
      for (let element of routes) {
        // 判断当前用户权限
        if (element.meta && element.meta.authority) {
          break;
        }
        if (element.name && !element.hidden) {
          this.openKeysMap[element.path] = parentKeys;
          this.selectedKeysMap[element.path] = [selectedKey || element.path];
          // 扩展运算符(...)用于取出参数对象中的所有可遍历属性，拷贝到当前对象之中
          const tempItem = { ...element };
          delete tempItem.children;
          if (element.children && !element.hiddenChildren) {
            tempItem.children = this.getMenu(element.children, [...parentKeys, element.path]);
          } else {
            this.getMenu(element.children, selectedKey ? parentKeys : [...parentKeys, element.path], selectedKey || element.path);
          }
          menuData.push(tempItem);
        } else if (!element.hidden && !element.hiddenChildren && element.children) {
          menuData.push(...this.getMenu(element.children, [...parentKeys, element.path]));
        }
      }
      return menuData;
    },
  },
  watch: {
    /*
     *@FunctionName: $route.path
     *@Params1: path
     *@Description: 收缩菜单控制当前选中菜单及展开菜单列表
     *@Author: yangxiao-lhq
     *@Last Modified By: yangxiao-lhq
     *@Date: 2020-12-29 14:34:09
     */
    "$route.path": function(val) {
      this.selectedKeys = this.selectedKeysMap[val];
      this.openKeys = this.collapsed ? [] : this.openKeysMap[val];
    },
    /*
     *@FunctionName: collapsed()
     *@Description: 收缩菜单控制展开菜单列表
     *@Author: yangxiao-lhq
     *@Last Modified By: yangxiao-lhq
     *@Date: 2020-12-29 14:32:30
     */
    collapsed: function() {
      if (this.collapsed) {
        this.openKeys = [];
      } else {
        this.openKeys = this.openKeysMap[this.$route.path];
      }
    },
  },
};
</script>
