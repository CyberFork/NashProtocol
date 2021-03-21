<template>
  <div ref="chartDom"></div>
</template>

<script>
import * as echarts from "echarts";
import { addListener, removeListener } from "resize-detector";
import _ from "lodash/debounce";

export default {
  props: {
    historyLogs: {
      type: Array,
      default: [],
    },
    chartTitle: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      options: {
        title: {
          text: this.chartTitle,
          subtext: "$ 2.2 (+5%)过去24小时 数据来源于本站",
          lineHeight: 56,
          textStyle: {
            rich: {
              a: {
                fontSize: "18px",
              },
              b: {
                color: "gray",
              },
              x: {
                fontSize: 18,
                fontWeight: "bold",
                fontFamily: "Microsoft YaHei",
              },
            },
          },
        },
        grid: {
          show: true,
          containLabel: false,
          backgroundColor: "rgba(242, 242, 242, 1)",
          x: 80,
          y: 60,
          x2: 80,
          y2: 60,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
        },
        toolbox: {
          show: true,
          itemSize: 24,
          emphasis: {
            iconStyle: {
              textFill: "rgba(0, 0, 0, 1)",
            },
          },
          feature: {
            myTool1: {
              show: true,
              title: "24小时",
              icon: "image://../image/24hours.png",
              onclick: function() {},
            },
            myTool2: {
              show: true,
              title: "1周",
              icon: "image://../image/1week.png",
              onclick: function() {},
            },
            myTool3: {
              show: true,
              title: "1月",
              icon: "image://../image/1month.png",
              onclick: function() {},
            },
          },
        },
        dataZoom: [
          {
            id: "dataZoomX",
            type: "inside",
            xAxisIndex: [0],
            filterMode: "filter",
          },
        ],
        xAxis: [
          {
            show: true,
            type: "category",
            // data: ["0", "3", "6", "9", "12", "15", "18", "21", "24"],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            show: false,
            axisLine: {
              show: true,
            },
            axisLabel: {
              formatter: "{value} ml",
            },
          },
        ],
        series: [
          {
            symbolSize: 20,
            data: this.historyLogs,
            type: "scatter",
            itemStyle: {
              color: "rgb(202, 153, 232)",
              shadowColor: "rgb(202, 153, 232)",
              shadowBlur: 10,
            },
          },
        ],
      },
    };
  },
  watch: {
    // 监听options值变化修改图标
    options(val) {
      this.chart.setOption(val);
    },
    // chartTitle() {
    //   this.chart.setOption(this.options);
    // },
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
