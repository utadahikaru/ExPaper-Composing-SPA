<template>
  <el-row>
    <el-col :span="24">
      <echart :options="option" :chartID="chartID" :height="chartHeight" ref="pie_chart"></echart>
    </el-col>
  </el-row>
</template>  
<style>
</style>  
<script>
export default {
  name: "pie",
  props: {
    chartID: {
      type: String,
      default: "chart-default"
    },
    chartHeight: {
      type: String,
      default: "320px"
    },
    legendData: {
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
    this.legend_data = this.legendData;
    this.series_data = this.seriesData;
    this.changeOption();
  },
  data() {
    return {
      option: {
        color: [
          "#2dabe2e6",
          "#87CEFA",
          "#E6E6FA",
          "#87CEEB",
          "#48D1CC",
          "#40E0D0",
          "#B0E0E6",
          "#00FFFF",
          "#B0C4DE",
          "#D8BFD8",
          "#D3D3D3"
        ],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: []
        },
        series: [
          {
            name: "占比图",
            type: "pie",
            radius: "58%",
            center: ["47%", "60%"],
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      }
    };
  },
  methods: {
    changeData() {
      this.option.legend.data = this.legend_data;
      this.option.series[0].data = this.series_data;
    },
    changeOption() {
      this.changeData();
      this.$refs.pie_chart.setOption(this.option);
    }
  }
};
</script>