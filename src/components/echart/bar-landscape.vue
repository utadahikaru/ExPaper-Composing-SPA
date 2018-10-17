<template>
  <el-row>
    <el-col :span="24">
      <echart :options="option" :chartID="chartID" :height="chartHeight" ref="bar_chart"></echart>
    </el-col>
  </el-row>
</template>  
<style>
</style>  
<script>
export default {
  name: "bar-landscape",
  props: {
    chartID: {
      type: String,
      default: "chart-default"
    },
    chartHeight: {
      type: String,
      default: "400px"
    },
    yAxisData: {
      type: Array,
      default: function () {
        return [];
      }
    },
    seriesData: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  mounted () {
    this.changeOption();
  },
  data () {
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
        grid: {
          top: '3%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: []
        },
        series: [
          {
            type: 'bar',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: []
          }
        ]
      }
    };
  },
  methods: {
    changeData () {
      this.option.yAxis.data = this.yAxisData;
      this.option.series[0].data = this.seriesData;
    },
    changeOption () {
      this.changeData();
      this.$refs.bar_chart.setOption(this.option);
    }
  }
};
</script>