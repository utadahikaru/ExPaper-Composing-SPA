<template>
  <!-- 细目表分析 -->
  <div>
    <h3>大题题量统计</h3>
    <div>
      <pie :chartID="'chart_quantity'" ref="chart_quantity" :legendData="legend_data_quantity" :seriesData="series_data_quantity"></pie>
    </div>

    <h3>难度分布</h3>
    <div>
      <pie :chartID="'chart_difficulty'" ref="chart_difficulty" :legendData="legend_data_difficulty" :seriesData="series_data_difficulty"></pie>
    </div>

    <h3>知识点分布</h3>
    <div>
      <bar-landscape :chartID="'chart_knowledgepoint'" ref="chart_knowledgepoint" :yAxisData="legend_data_knowledgepoint" :seriesData="series_data_knowledgepoint"></bar-landscape>
    </div>
  </div>
</template>

<script>
export default {
  name: 'xmb-analyze',
  data () {
    return {
      legend_data_quantity: [],
      series_data_quantity: [],
      legend_data_difficulty: [],
      series_data_difficulty: [],
      legend_data_knowledgepoint: [],
      series_data_knowledgepoint: [],
    }
  },
  props: {
    xmb: {
      type: Object,
      default () {
        return {
          dt: []
        }
      }
    }
  },
  computed: {
    exerciseTypes () {
      let exerciseTypes = this.$store.state.exerciseType.exerciseTypes
      if (exerciseTypes === null) {
        this.$store.dispatch('getExerciseTypes')
        return []
      }
      return exerciseTypes
    }
  },
  watch: {
    xmb: {
      handler: function (newVal, oldVal) {
        this.updateChart()
      },
      deep: true
    }
  },
  methods: {
    updateChart () {
      this.updatePieQuantity()
      this.updatePieDifficulty()
      this.updatePieKnowledgepoint()
    },

    // 更新大题题量饼图
    updatePieQuantity () {
      this.legend_data_quantity.length = 0
      this.series_data_quantity.length = 0
      this.xmb.dt.forEach(dt => {
        let type = this.getValue(this.exerciseTypes, dt.type)
        this.legend_data_quantity.push(type + '(' + dt.xt.length + ')')
        this.series_data_quantity.push({ value: dt.xt.length, name: type + '(' + dt.xt.length + ')' })
      })
      this.$refs.chart_quantity.changeOption()
    },

    // 更新难度分布饼图
    updatePieDifficulty () {
      this.legend_data_difficulty.length = 0
      this.series_data_difficulty.length = 0
      this.xmb.dt.forEach(dt => {
        dt.xt.forEach(xt => {
          let difficulty = this.getValue(this.global.difficulties, xt.difficulty)
          let difficultyIndex = this.legend_data_difficulty.indexOf(difficulty)
          if (difficultyIndex === -1) {
            this.legend_data_difficulty.push(difficulty)
            this.series_data_difficulty.push({ value: 1, name: difficulty })
          } else {
            this.series_data_difficulty[difficultyIndex].value += 1
          }
        })
      })
      for (let index = 0; index < this.series_data_difficulty.length; index++) {
        let count = this.series_data_difficulty[index].value
        this.series_data_difficulty[index].name += '(' + count + ')'
        this.legend_data_difficulty[index] += '(' + count + ')'
      }
      this.$refs.chart_difficulty.changeOption()
    },

    // 更新知识点分布饼图
    updatePieKnowledgepoint () {
      this.legend_data_knowledgepoint.length = 0
      this.series_data_knowledgepoint.length = 0
      this.xmb.dt.forEach(dt => {
        dt.xt.forEach(xt => {
          xt.knowledgePoints.forEach(knowledgepoint => {
            let kp = knowledgepoint.knowledgeName
            let knowledgepointIndex = this.legend_data_knowledgepoint.indexOf(kp)
            if (knowledgepointIndex === -1) {
              this.legend_data_knowledgepoint.push(kp)
              this.series_data_knowledgepoint.push(1)
            } else {
              this.series_data_knowledgepoint[knowledgepointIndex] += 1
            }
          })
        })
      })
      this.$refs.chart_knowledgepoint.changeOption()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

