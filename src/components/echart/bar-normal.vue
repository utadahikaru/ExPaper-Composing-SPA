<template>
  <el-row>
    <el-col :span="24">
      <echart :options="option" :chartID="chartID" :height="chartHeight" ref="bar2_chart"></echart>
    </el-col>
  </el-row>
</template>  
<style>
</style>  
<script>
export default {
  name: "bar-normal",
  props: {
    chartID: {
      type: String,
      default: "chart-default"
    },
    chartHeight: {
      type: String,
      default: "400px"
    },
    xAxisData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    seriesData: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  mounted() {
    this.changeOption();
  },
  data() {
    return {
      option: {
        grid: {
          top: "3%",
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        color: [
          "#2dabe2e6",
          "#61a0a8",
          "#d48265",
          "#91c7ae",
          "#749f83",
          "#ca8622",
          "#bda29a",
          "#6e7074",
          "#546570",
          "#c4ccd3",
          "#61a0a8"
        ],
        xAxis: {
          axisLabel: {
            interval: 0
          },
          type: "category",
          axisTick: {},
          data: []
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            type: "bar",
            label: {
              normal: {
                show: true,
                position: "inside"
              }
            },
            data: []
          }
        ]
      }
    };
  },
  methods: {
    changeData() {
      this.option.xAxis.data = this.xAxisData;
      this.option.series[0].data = this.seriesData;
    },
    changeOption() {
      this.changeData();
      this.$refs.bar2_chart.setOption(this.option);
    }
  }
};
</script>