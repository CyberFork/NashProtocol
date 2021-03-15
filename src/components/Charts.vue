<template>
  <div ref="chartDom"></div>
</template>

<script>
import * as echarts from "echarts";
import { addListener, removeListener } from "resize-detector";
import _ from "lodash/debounce";

export default {
  props: {
    options: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    // 监听options值变化修改图标
    options(val) {
      console.log(this.options);
      this.chart.setOption(val);
    },
  },
  methods: {
    resize() {
      return this.chart.resize();
    },
    renderChart() {
      // 准备好的dom，初始化echarts实例
      this.chart = echarts.init(this.$refs.chartDom, null, { renderer: "svg" });
      this.chart.setOption(this.options);
    },
  },
  created() {
    /*
     *@FunctionName: debounce
     *@Params1: method
     *@Params2: time
     *@Description: 方法防抖
     *@Author: yangxiao-lhq
     *@Last Modified By: yangxiao-lhq
     *@Date: 2020-12-30 10:05:00
     */
    this.resize = _(this.resize, 300);
  },
  mounted() {
    this.renderChart();
    // 监听图标大小变化
    addListener(this.$refs.chartDom, this.resize);
  },
  beforeDestroy() {
    // 移除监听器
    removeListener(this.$refs.chartDom, this.resize);
    this.chart.dispose();
    this.chart = null;
  },
};
</script>

<style></style>
