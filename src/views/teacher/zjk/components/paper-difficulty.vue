<template>
  <!-- 试题统计组件 -->
  <div>
    <div class="title">难度统计</div>

    <pie :chartID="'chart_difficulty'" ref="chart_difficulty" :legendData="legend_data" :seriesData="series_data"></pie>

  </div>
</template>

<script>
export default {
  name: "paperDifficulty",
  data () {
    return {
      legend_data: ['简单', '适中', '困难'],
      series_data: [
        { value: 0, name: '简单' },
        { value: 0, name: '适中' },
        { value: 0, name: '困难' }
      ]
    }
  },
  props: {
    exerciseList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  mounted () {
    this.setupData()
  },
  watch: {
    'exerciseList' () {
      this.setupData()
    }
  },
  methods: {
    setupData () {
      this.exerciseList.forEach(element => {
        switch (element.exerciseDifficulty) {
          case 1:
            this.series_data[0].value += 1
            break;
          case 2:
            this.series_data[1].value += 1
            break;
          case 3:
            this.series_data[2].value += 1
            break;
          default:
            break;
        }
      });
      this.$refs.chart_difficulty.changeOption()
    },
  }
}
</script>

<style lang="scss" scoped>
.title {
  padding: 10px;

  border-top: $border-solid;
  background: #eee;

  &-top {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    margin: 10px;

    font-size: 14px;
  }
}
</style>
