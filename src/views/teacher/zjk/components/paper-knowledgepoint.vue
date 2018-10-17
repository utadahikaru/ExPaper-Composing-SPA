<template>
  <!-- 试题统计组件 -->
  <div>
    <div class="title">知识点统计</div>

    <bar-landscape :chartID="'chart_knowledgepoint'" ref="chart_knowledgepoint" :yAxisData="legend_data" :seriesData="series_data"></bar-landscape>

  </div>
</template>

<script>
export default {
  name: "paperKnowledgepoint",
  data () {
    return {
      legend_data: [],
      series_data: []
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
      this.legend_data.length = 0
      this.series_data.length = 0
      this.exerciseList.forEach(exercise => {
        let knowledgeList = exercise.knowledgeName.split('@')
        knowledgeList.forEach(knowledge => {
          if (knowledge.length > 5) {
            knowledge = knowledge.substring(0, 4) + '..'
          }
          let knowledgepointIndex = this.legend_data.indexOf(knowledge)
          if (knowledgepointIndex === -1) {
            this.legend_data.push(knowledge)
            this.series_data.push(1)
          } else {
            this.series_data[knowledgepointIndex] += 1
          }
        })
      })
      this.$refs.chart_knowledgepoint.changeOption()
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
