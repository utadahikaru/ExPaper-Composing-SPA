<template>
  <!-- 试题统计组件 -->
  <div>
    <div class="title">试题统计</div>

    <div class="sttj">
      <div class="total">
        <span>题数：{{exerciseCount}}</span>
        <span>分数：{{totalScore}}</span>
        <span></span>
      </div>
      <div class="tj-type" v-for="(data, index) in dataList" :key="index">
        <h4>{{data.type}}</h4>
        <span>&nbsp;&nbsp;题数:{{data.count}}&nbsp;&nbsp;分数:{{data.score}}</span>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "paperStatistics",
  data () {
    return {
      exerciseCount: 0,
      totalScore: 0,
      dataList: []
    }
  },
  computed: {
    exerciseListClassified () {
      return this.$store.state.paper.exerciseListClassified
    },

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
    exerciseListClassified: {
      handler: function (newVal, oldVal) {
        this.setupData()
      },
      deep: true
    }
  },
  mounted () {
    this.setupData()
  },
  methods: {
    setupData () {
      this.exerciseCount = this.$store.state.paper.exerciseInfoList.length
      this.totalScore = 0
      this.dataList = []
      this.exerciseListClassified.forEach(exerciseInType => {
        let obj = {
          type: this.getValue(this.exerciseTypes, exerciseInType.type),
          count: 0,
          score: 0
        }
        exerciseInType.exerciseList.forEach(exercise => {
          this.totalScore += exercise.score
          obj.count++
          obj.score += exercise.score
        })
        this.dataList.push(obj)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.sttj {
  padding: 10px;
}

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

.total {
  display: flex;
  justify-content: space-between;

  border-bottom: $border-dashed;
}

.tj-type {
  margin: 8px 0 0 0;
}

h4 {
  display: inline;
}
</style>
